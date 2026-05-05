import type { Company } from '../types';
import { ollamaComplete, extractJSON } from './ollama';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_KEY = (sectorId: string) => `fsb_data_${sectorId}`;

interface CacheEntry {
  timestamp: number;
  companies: Company[];
}

function readCache(sectorId: string): Company[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY(sectorId));
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) return null;
    return entry.companies;
  } catch {
    return null;
  }
}

function writeCache(sectorId: string, companies: Company[]) {
  try {
    const entry: CacheEntry = { timestamp: Date.now(), companies };
    localStorage.setItem(CACHE_KEY(sectorId), JSON.stringify(entry));
  } catch { /* noop */ }
}

export function clearCacheForSector(sectorId: string) {
  localStorage.removeItem(CACHE_KEY(sectorId));
}

// ── Well-known seed companies per sector ──────────────────────────────────────
// These ensure Ollama focuses on the real, most-anticipated companies rather
// than generating random plausible ones. Ollama fills in the details (valuation,
// ETA, confidence, description, news) based on its training knowledge.
const SECTOR_SEEDS: Record<string, string[]> = {
  ai:         ['OpenAI', 'Anthropic', 'Databricks', 'xAI (Elon Musk)', 'Scale AI'],
  biotech:    ['Altos Labs', 'Isomorphic Labs', 'Alto Neuroscience', 'Xaira Therapeutics', 'Retro Biosciences'],
  fintech:    ['Stripe', 'Klarna', 'Chime', 'Plaid', 'Brex'],
  ev:         ['Northvolt', 'Ampere (Renault EV)', 'Rivian Accessories', 'ZeroAvia', 'Redwood Materials'],
  space:      ['SpaceX / Starlink', 'Relativity Space', 'Vast Space', 'K2 Space', 'Axiom Space'],
  cybersec:   ['Wiz', 'Snyk', 'Armis Security', 'Cyera', 'Lacework'],
  cloud:      ['Rippling', 'Vercel', 'Retool', 'Harness', 'Temporal Technologies'],
  crypto:     ['Circle Internet', 'Kraken', 'Chainalysis', 'BitGo', 'Fireblocks'],
  health:     ['Noom', 'Zipline International', 'Sword Health', 'Brightside Health', 'Hinge Health'],
  retail:     ['Shein', 'Faire', 'GoPuff', 'Bolt Financial', 'Salsify'],
  defense:    ['Anduril Industries', 'Shield AI', 'Sarcos Technology', 'Hermeus', 'Joby Aviation'],
  robotics:   ['Figure AI', 'Physical Intelligence', 'Agility Robotics', '1X Technologies', 'Apptronik'],
  media:      ['Substack', 'Plex', 'ReelShort', 'Canela Media', 'Discord'],
  food:       ['Farmers Business Network', 'Plenty', 'Apeel Sciences', 'NotCo', 'Bowery Farming'],
  realestate: ['REZI', 'Pacaso', 'VTS', 'Knock', 'Landis'],
  quantum:    ['PsiQuantum', 'Quantinuum', 'IQM Quantum', 'Atom Computing', 'Classiq'],
  logistics:  ['Flexport', 'project44', 'Stord', 'Loadsmart', 'Outrider'],
  edtech:     ['Age of Learning', 'Synthesis', 'Duolingo Max', 'Electives', 'Masterschool'],
};

const SECTOR_LABELS: Record<string, string> = {
  ai:         'AI & Machine Learning',
  biotech:    'Biotech & Genomics',
  fintech:    'Fintech & Payments',
  ev:         'EV & Clean Energy',
  space:      'Space & Aerospace',
  cybersec:   'Cybersecurity',
  cloud:      'Cloud & SaaS',
  crypto:     'Crypto & Web3',
  health:     'Digital Health',
  retail:     'Retail & eCommerce',
  defense:    'Defense & Security',
  robotics:   'Robotics & Automation',
  media:      'Media & Streaming',
  food:       'Food Tech & AgriTech',
  realestate: 'PropTech & Real Estate',
  quantum:    'Quantum Computing',
  logistics:  'Logistics & Supply Chain',
  edtech:     'EdTech & Learning',
};

// "Listed" is excluded — this app tracks PRE-IPO companies only
const VALID_STATUSES = ['Filed S-1', 'Exploring', 'Rumored', 'Watching'];

function sanitizeCompany(raw: Record<string, unknown>, sectorId: string, index: number): Company {
  // Force status to a valid pre-IPO value — never allow "Listed"
  const rawStatus = String(raw.status ?? '');
  const status = VALID_STATUSES.includes(rawStatus)
    ? (rawStatus as Company['status'])
    : 'Watching';

  // If ticker is present but status is not Listed, clear it (pre-IPO = no ticker yet)
  const ticker = null;

  return {
    id: String(raw.id ?? `${sectorId}_${index}_${Date.now()}`).toLowerCase().replace(/\s+/g, '_'),
    name: String(raw.name ?? 'Unknown Company'),
    ticker,
    sector: sectorId,
    valuation: String(raw.valuation ?? 'Unknown'),
    eta: String(raw.eta ?? 'TBD'),
    etaDate: String(raw.etaDate ?? '2027-01-01'),
    status,
    confidence: Math.min(100, Math.max(0, Number(raw.confidence) || 50)),
    description: String(raw.description ?? ''),
    newsHeadline: String(raw.newsHeadline ?? 'No recent news'),
    newsDate: String(raw.newsDate ?? 'Recent'),
    hype: Math.min(100, Math.max(0, Number(raw.hype) || 50)),
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    ipoPrice: undefined,
    currentPrice: undefined,
  };
}

export async function fetchSectorCompanies(sectorId: string): Promise<Company[]> {
  const cached = readCache(sectorId);
  if (cached) return cached;

  const label = SECTOR_LABELS[sectorId] ?? sectorId;
  const seeds = SECTOR_SEEDS[sectorId] ?? [];
  const seedList = seeds.map((name, i) => `${i + 1}. ${name}`).join('\n');

  const prompt = `You are an IPO research analyst. Your task is to provide detailed IPO tracking data for the following well-known private companies in the "${label}" sector.

Here are the exact 5 companies to include — use these names precisely:
${seedList}

For each company, return accurate information based on what you know about their IPO plans, valuation, and business status. These are all PRIVATE companies that have NOT yet had their IPO (do not mark any as Listed).

Return a JSON array of exactly 5 objects in the same order as the list above.

Each object MUST have these exact fields:
- id: short lowercase slug (e.g. "openai", "stripe")
- name: company name exactly as given above
- sector: "${sectorId}"
- valuation: latest known private valuation (e.g. "$157B", "$70B")
- eta: expected IPO timeline (e.g. "Q4 2026", "2027", "Late 2026")
- etaDate: best estimate in YYYY-MM-DD format
- status: MUST be one of: "Filed S-1" | "Exploring" | "Rumored" | "Watching" — DO NOT use "Listed"
- confidence: integer 0-100 for how likely an IPO is within 2 years
- description: 2-3 sentences about the company and its IPO outlook
- newsHeadline: a realistic recent news headline about this company
- newsDate: recent date like "Apr 2026" or "May 2026"
- hype: integer 0-100 for investor excitement level
- tags: array of 2-4 short category strings

IMPORTANT: Do NOT include a "ticker" field. All companies are pre-IPO.
Return ONLY a valid JSON array. No explanation, no markdown. Start with [ and end with ].`;

  const raw = await ollamaComplete(prompt);
  const jsonStr = extractJSON(raw);
  const parsed = JSON.parse(jsonStr) as Record<string, unknown>[];
  const companies = parsed.map((c, i) => sanitizeCompany(c, sectorId, i));
  writeCache(sectorId, companies);
  return companies;
}

export async function fetchMultipleSectors(
  sectorIds: string[],
  onProgress?: (sectorId: string, done: number, total: number) => void
): Promise<Record<string, Company[]>> {
  const result: Record<string, Company[]> = {};
  for (let i = 0; i < sectorIds.length; i++) {
    const sectorId = sectorIds[i];
    result[sectorId] = await fetchSectorCompanies(sectorId);
    onProgress?.(sectorId, i + 1, sectorIds.length);
  }
  return result;
}

export async function lookupCustomCompany(companyName: string): Promise<Company> {
  const prompt = `You are an IPO research analyst. Provide IPO tracking information for the company: "${companyName}".

This company has NOT yet had its IPO. Return a single JSON object with these exact fields:
- id: short lowercase slug
- name: full company name
- sector: one of: ai | biotech | fintech | ev | space | cybersec | cloud | crypto | health | retail | defense | robotics | media | food | realestate | quantum | logistics | edtech
- valuation: latest known valuation or "Private"
- eta: IPO expected timeline or "Unknown"
- etaDate: best estimate YYYY-MM-DD or "2027-01-01"
- status: MUST be one of: "Filed S-1" | "Exploring" | "Rumored" | "Watching"
- confidence: integer 0-100
- description: 2-3 sentences about company and IPO outlook
- newsHeadline: a realistic recent news headline
- newsDate: recent date string
- hype: integer 0-100
- tags: array of 2-4 short tags

Return ONLY valid JSON. No extra text. No ticker field.`;

  const raw = await ollamaComplete(prompt);
  const jsonStr = extractJSON(raw);
  const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
  return sanitizeCompany(parsed, String(parsed.sector ?? 'cloud'), 0);
}

export interface Sector {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export type CompanyStatus =
  | 'Filed S-1'
  | 'Exploring'
  | 'Rumored'
  | 'Watching'
  | 'Listed'
  | "Recently IPO'd"
  | 'Restructuring';

export interface Company {
  id: string;
  name: string;
  ticker?: string | null;
  sector: string;
  valuation: string;
  eta: string;
  etaDate: string;
  status: CompanyStatus;
  confidence: number;
  description: string;
  newsHeadline: string;
  newsDate: string;
  hype: number;
  tags: string[];
  ipoPrice?: number;
  currentPrice?: number;
  ipoDate?: string;
}

export interface NotificationType {
  id: string;
  label: string;
  icon: string;
}

export type NotificationsState = Record<string, Record<string, boolean>>;

export type StackEntry =
  | { type: 'sector'; sector: Sector }
  | { type: 'company'; company: Company }
  | { type: 'settings' };

export type TabId = 'dashboard' | 'calendar' | 'watchlist' | 'portfolio' | 'explore';

export interface AppSettings {
  accentColor: string;
  lightMode: boolean;
  showHypeMeter: boolean;
  compactCards: boolean;
}

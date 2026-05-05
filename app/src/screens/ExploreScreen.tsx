import React, { useState } from 'react';
import type { Company, Sector } from '../types';
import StatusBadge from '../components/shared/StatusBadge';
import { lookupCustomCompany } from '../lib/ipoData';

interface ExploreScreenProps {
  sectors: string[];
  allSectors: Sector[];
  ipoData: Record<string, Company[]>;
  onSectorPress: (sector: Sector) => void;
  onCompanyPress: (company: Company) => void;
  onAddCustom: (company: Company) => void;
  onToggleSector: (sectorId: string) => void;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({
  sectors,
  allSectors,
  ipoData,
  onSectorPress,
  onCompanyPress,
  onAddCustom,
  onToggleSector,
}) => {
  const [search, setSearch] = useState('');
  const [customSearch, setCustomSearch] = useState('');
  const [loadingCustom, setLoadingCustom] = useState(false);
  const [customResult, setCustomResult] = useState<Company | null>(null);
  const [lookupError, setLookupError] = useState('');

  const allResults = search
    ? allSectors.map((s) => ({
        ...s,
        companies: (ipoData[s.id] ?? []).filter(
          (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            (c.ticker && c.ticker.toLowerCase().includes(search.toLowerCase()))
        ),
      })).filter((s) => s.companies.length > 0)
    : [];

  const fetchCustomCompany = async () => {
    if (!customSearch.trim()) return;
    setLoadingCustom(true);
    setCustomResult(null);
    setLookupError('');
    try {
      const company = await lookupCustomCompany(customSearch);
      setCustomResult(company);
    } catch {
      setLookupError('Could not connect to Ollama. Make sure ollama serve is running.');
    }
    setLoadingCustom(false);
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
      }}
    >
      <div style={{ padding: '16px 20px 12px' }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
          }}
        >
          Explore
        </h1>
      </div>

      {/* Search */}
      <div style={{ padding: '0 20px 12px' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies..."
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 12,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            fontSize: 14,
            outline: 'none',
            fontFamily: 'var(--font)',
          }}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
        {/* Search results */}
        {search &&
          allResults.map((s) => (
            <div key={s.id} style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8 }}>
                {s.icon} {s.label}
              </h3>
              {s.companies.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onCompanyPress(c)}
                  style={{
                    width: '100%',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: '10px 12px',
                    marginBottom: 6,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                      {c.name}
                    </p>
                    {c.ticker && (
                      <p
                        style={{
                          fontSize: 11,
                          color: 'var(--gold)',
                          fontFamily: 'var(--mono)',
                        }}
                      >
                        ${c.ticker}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={c.status} />
                </button>
              ))}
            </div>
          ))}

        {/* AI Company Lookup */}
        {!search && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 14 }}>🤖</span>
              <h2
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text2)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                AI Company Lookup
              </h2>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 10 }}>
              Can't find a company? Ask AI to research it
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={customSearch}
                onChange={(e) => setCustomSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchCustomCompany()}
                placeholder="e.g. Canva, Epic Games..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: 'var(--surface)',
                  border: '1px solid var(--border-gold)',
                  color: 'var(--text)',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'var(--font)',
                }}
              />
              <button
                onClick={fetchCustomCompany}
                disabled={loadingCustom || !customSearch.trim()}
                style={{
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: 'var(--gold)',
                  color: '#0D0D0F',
                  fontWeight: 700,
                  fontSize: 14,
                  border: 'none',
                  cursor: loadingCustom || !customSearch.trim() ? 'default' : 'pointer',
                  fontFamily: 'var(--font)',
                  whiteSpace: 'nowrap',
                  opacity: loadingCustom || !customSearch.trim() ? 0.6 : 1,
                }}
              >
                {loadingCustom ? '...' : 'Look up'}
              </button>
            </div>

            {customResult && (
              <div
                style={{
                  marginTop: 12,
                  background: 'var(--surface)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 16,
                  padding: '14px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                      {customResult.name}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--gold)' }}>
                      {customResult.valuation} · {customResult.eta}
                    </p>
                  </div>
                  <StatusBadge status={customResult.status} />
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--text2)',
                    lineHeight: 1.5,
                    marginBottom: 10,
                  }}
                >
                  {customResult.description}
                </p>
                {lookupError && <p style={{ fontSize: 12, color: 'var(--red)', marginBottom: 8 }}>{lookupError}</p>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => {
                      onAddCustom(customResult);
                      setCustomResult(null);
                      setCustomSearch('');
                    }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 10,
                      background: 'var(--gold)',
                      color: '#0D0D0F',
                      fontWeight: 600,
                      fontSize: 13,
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'var(--font)',
                    }}
                  >
                    + Add to Watchlist
                  </button>
                  <button
                    onClick={() => onCompanyPress(customResult)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 10,
                      background: 'var(--surface2)',
                      border: '1px solid var(--border)',
                      color: 'var(--text2)',
                      fontSize: 13,
                      cursor: 'pointer',
                      fontFamily: 'var(--font)',
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* All sectors grid */}
        {!search && (
          <>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              All Sectors
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 12 }}>
              Tap to browse · Hold ★ to follow/unfollow
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {allSectors.map((s) => {
                const following = sectors.includes(s.id);
                return (
                  <div key={s.id} style={{ position: 'relative' }}>
                    <button
                      onClick={() => onSectorPress(s)}
                      style={{
                        width: '100%',
                        padding: '12px 6px',
                        borderRadius: 14,
                        background: following ? 'var(--gold-dim)' : 'var(--surface)',
                        border: following ? '1.5px solid var(--border-gold)' : '1.5px solid transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span style={{ fontSize: 22 }}>{s.icon}</span>
                      <span style={{ fontSize: 10, color: following ? 'var(--gold)' : 'var(--text2)', fontWeight: following ? 600 : 400, textAlign: 'center', lineHeight: 1.3 }}>
                        {s.label}
                      </span>
                    </button>
                    {/* Follow/unfollow toggle */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleSector(s.id); }}
                      style={{
                        position: 'absolute', top: 4, right: 4,
                        width: 18, height: 18, borderRadius: '50%',
                        background: following ? 'var(--gold)' : 'var(--bg4)',
                        border: following ? 'none' : '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', fontSize: 9, color: following ? '#0D0D0F' : 'var(--text3)',
                        fontWeight: 700,
                      }}
                      title={following ? 'Unfollow' : 'Follow'}
                    >
                      {following ? '✓' : '+'}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExploreScreen;

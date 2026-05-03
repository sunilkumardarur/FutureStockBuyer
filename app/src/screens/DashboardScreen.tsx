import React from 'react';
import { SECTORS } from '../data';
import type { Company, Sector, NotificationsState } from '../types';
import StatusBadge from '../components/shared/StatusBadge';
import IPOCountdown from '../components/shared/IPOCountdown';
import Icon from '../components/shared/Icon';

interface DashboardScreenProps {
  sectors: string[];
  favorites: Company[];
  notifications: NotificationsState;
  ipoData: Record<string, Company[]>;
  onSectorPress: (sector: Sector) => void;
  onCompanyPress: (company: Company) => void;
  onToggleFav: (company: Company) => void;
}

const rankColors = [
  { bg: '#D4A843', border: '#D4A843', text: '#0D0D0F' },
  { bg: 'rgba(192,192,192,0.25)', border: '#C0C0C0', text: '#C0C0C0' },
  { bg: 'rgba(205,127,50,0.25)', border: '#CD7F32', text: '#CD7F32' },
  { bg: 'rgba(96,165,250,0.18)', border: '#60A5FA', text: '#60A5FA' },
  { bg: 'rgba(167,139,250,0.18)', border: '#A78BFA', text: '#A78BFA' },
];

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  sectors,
  favorites,
  ipoData,
  onSectorPress,
  onCompanyPress,
  onToggleFav,
}) => {
  const userSectors = SECTORS.filter((s) => sectors.includes(s.id));

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'var(--bg)' }}>
      {/* Header */}
      <div
        style={{
          padding: '16px 20px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
          }}
        >
          Dashboard
        </h1>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--gold-dim)',
            border: '1px solid var(--border-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
          }}
        >
          📈
        </div>
      </div>

      {/* Watchlist strip */}
      {favorites.length > 0 && (
        <div style={{ padding: '0 20px 16px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <h2
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text2)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              ⭐ Watchlist
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
            {favorites.slice(0, 5).map((fav) => (
              <button
                key={fav.id}
                onClick={() => onCompanyPress(fav)}
                style={{
                  flex: '0 0 auto',
                  minWidth: 120,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: '10px 12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: 2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 100,
                  }}
                >
                  {fav.ticker ? `$${fav.ticker}` : fav.name.split(' ')[0]}
                </p>
                {fav.currentPrice != null ? (
                  <p
                    style={{
                      fontSize: 12,
                      color:
                        fav.currentPrice > (fav.ipoPrice ?? 0)
                          ? 'var(--green)'
                          : 'var(--red)',
                      fontFamily: 'var(--mono)',
                      fontWeight: 600,
                    }}
                  >
                    ${fav.currentPrice}
                  </p>
                ) : (
                  <StatusBadge status={fav.status} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Per-sector sections */}
      {userSectors.map((s) => {
        const preIPO = (ipoData[s.id] || [])
          .filter((c) => c.status !== 'Listed' && c.status !== "Recently IPO'd")
          .slice(0, 5);
        if (preIPO.length === 0) return null;
        return (
          <div key={s.id} style={{ padding: '0 20px 20px' }}>
            <button
              onClick={() => onSectorPress(s)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 10,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: `${s.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                }}
              >
                {s.icon}
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                {s.label}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 2 }}>→</span>
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {preIPO.map((c, i) => {
                const rank = rankColors[i] ?? rankColors[4];
                const isFav = favorites.some((f) => f.id === c.id);
                return (
                  <div
                    key={c.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 7 }}
                  >
                    <button
                      onClick={() => onCompanyPress(c)}
                      style={{
                        flex: 1,
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 13,
                        padding: '11px 13px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 7,
                          background: rank.bg,
                          border: `1.5px solid ${rank.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: rank.text,
                            fontFamily: 'var(--mono)',
                          }}
                        >
                          {i + 1}
                        </span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: 'var(--text)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            marginBottom: 1,
                          }}
                        >
                          {c.name}
                        </p>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{ fontSize: 10, color: 'var(--text3)' }}>
                            {c.valuation}
                          </span>
                          <span style={{ fontSize: 10, color: 'var(--text3)' }}>·</span>
                          <IPOCountdown etaDate={c.etaDate} />
                        </div>
                      </div>
                      <StatusBadge status={c.status} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFav(c);
                      }}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        flexShrink: 0,
                        background: isFav ? 'var(--gold-dim)' : 'var(--surface)',
                        border: isFav
                          ? '1px solid var(--border-gold)'
                          : '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Icon
                        name="star"
                        size={15}
                        color={isFav ? 'var(--gold)' : 'var(--text3)'}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <div style={{ height: 12 }} />
    </div>
  );
};

export default DashboardScreen;

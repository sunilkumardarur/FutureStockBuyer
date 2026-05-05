import React, { useState } from 'react';
import type { Company, Sector, NotificationsState, AppSettings } from '../types';
import StatusBadge from '../components/shared/StatusBadge';
import ConfidenceBar from '../components/shared/ConfidenceBar';
import HypeMeter from '../components/shared/HypeMeter';
import Icon from '../components/shared/Icon';

interface SectorScreenProps {
  sector: Sector;
  ipoData: Record<string, Company[]>;
  favorites: Company[];
  notifications: NotificationsState;
  settings: AppSettings;
  onBack: () => void;
  onCompanyPress: (company: Company) => void;
  onToggleFav: (company: Company) => void;
  onToggleNotif: (company: Company) => void;
  onRefresh: (sectorId: string) => Promise<void>;
}

const SectorScreen: React.FC<SectorScreenProps> = ({
  sector,
  ipoData,
  favorites,
  notifications,
  settings,
  onBack,
  onCompanyPress,
  onToggleFav,
  onToggleNotif,
  onRefresh,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh(sector.id);
    setRefreshing(false);
  };

  const companies = ipoData[sector.id] ?? [];
  const preIPO = companies.filter(
    (c) => c.status !== 'Listed' && c.status !== "Recently IPO'd"
  );
  const listed = companies.filter(
    (c) => c.status === 'Listed' || c.status === "Recently IPO'd"
  );

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '10px 20px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={onBack}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <Icon name="back" size={18} color="var(--text2)" />
        </button>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flex: 1,
            minWidth: 0,
          }}
        >
          <span style={{ fontSize: 20 }}>{sector.icon}</span>
          <h1
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: 'var(--text)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {sector.label}
          </h1>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--surface)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: refreshing ? 'default' : 'pointer', flexShrink: 0,
            opacity: refreshing ? 0.5 : 1,
            fontSize: 16,
          }}
          title="Refresh data"
        >
          🔄
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px' }}>
        {/* Top anticipated */}
        <h2
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text2)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 12,
          }}
        >
          🎯 Top {Math.min(preIPO.length, 5)} Anticipated IPOs
        </h2>

        {preIPO.slice(0, 5).map((c, i) => {
          const isFav = favorites.some((f) => f.id === c.id);
          const hasNotif =
            notifications[c.id] && Object.values(notifications[c.id]).some(Boolean);
          return (
            <div
              key={c.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: '16px',
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      background: 'var(--gold-dim)',
                      border: '1px solid var(--border-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'var(--gold)',
                        fontFamily: 'var(--mono)',
                      }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
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
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => onToggleNotif(c)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      background: hasNotif ? 'rgba(212,168,67,0.18)' : 'var(--bg4)',
                      border: hasNotif
                        ? '1px solid var(--border-gold)'
                        : '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Icon
                      name="bell"
                      size={15}
                      color={hasNotif ? 'var(--gold)' : 'var(--text3)'}
                    />
                  </button>
                  <button
                    onClick={() => onToggleFav(c)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      background: isFav ? 'rgba(212,168,67,0.18)' : 'var(--bg4)',
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
              </div>

              {/* Metrics */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
                <div>
                  <p style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 2 }}>
                    VALUATION
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--text)',
                      fontFamily: 'var(--mono)',
                    }}
                  >
                    {c.valuation}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 2 }}>ETA</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                    {c.eta}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 2 }}>
                    STATUS
                  </p>
                  <StatusBadge status={c.status} />
                </div>
              </div>

              {/* Confidence + hype */}
              <div style={{ marginBottom: 10 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                  }}
                >
                  <p style={{ fontSize: 10, color: 'var(--text3)' }}>IPO CONFIDENCE</p>
                  {settings.showHypeMeter && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <p style={{ fontSize: 10, color: 'var(--text3)' }}>HYPE</p>
                      <HypeMeter value={c.hype} />
                    </div>
                  )}
                </div>
                <ConfidenceBar value={c.confidence} />
              </div>

              {/* News */}
              <div
                style={{
                  background: 'var(--bg3)',
                  borderRadius: 10,
                  padding: '8px 10px',
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: 'var(--gold)',
                    fontWeight: 600,
                    marginBottom: 2,
                  }}
                >
                  Latest Update
                </p>
                <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                  {c.newsHeadline}
                </p>
                <p style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
                  {c.newsDate}
                </p>
              </div>

              {/* Tags */}
              {c.tags && c.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                  {c.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: '2px 8px',
                        borderRadius: 20,
                        background: 'var(--bg4)',
                        color: 'var(--text3)',
                        fontSize: 10,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={() => onCompanyPress(c)}
                style={{
                  marginTop: 10,
                  width: '100%',
                  padding: '8px',
                  borderRadius: 10,
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text2)',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: 'var(--font)',
                }}
              >
                Full Analysis →
              </button>
            </div>
          );
        })}

        {/* Recently Listed */}
        {listed.length > 0 && (
          <>
            <h2
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text2)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 12,
                marginTop: 8,
              }}
            >
              ✅ Recently Listed
            </h2>
            {listed.map((c) => (
              <button
                key={c.id}
                onClick={() => onCompanyPress(c)}
                style={{
                  width: '100%',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  padding: '12px 14px',
                  marginBottom: 8,
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
                <div style={{ textAlign: 'right' }}>
                  {c.currentPrice != null && (
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--text)',
                        fontFamily: 'var(--mono)',
                      }}
                    >
                      ${c.currentPrice}
                    </p>
                  )}
                  {c.ipoPrice != null && c.currentPrice != null && (
                    <p
                      style={{
                        fontSize: 11,
                        color:
                          c.currentPrice > c.ipoPrice ? 'var(--green)' : 'var(--red)',
                        fontFamily: 'var(--mono)',
                      }}
                    >
                      {c.currentPrice > c.ipoPrice ? '+' : ''}
                      {(((c.currentPrice - c.ipoPrice) / c.ipoPrice) * 100).toFixed(1)}%
                      vs IPO
                    </p>
                  )}
                </div>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SectorScreen;

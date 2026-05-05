import React, { useState } from 'react';
import { SECTORS, NOTIFICATION_TYPES } from '../data';
import type { Company, NotificationsState, AppSettings } from '../types';
import StatusBadge from '../components/shared/StatusBadge';
import ConfidenceBar from '../components/shared/ConfidenceBar';
import HypeMeter from '../components/shared/HypeMeter';
import Icon from '../components/shared/Icon';
import { ollamaComplete } from '../lib/ollama';

interface CompanyScreenProps {
  company: Company;
  favorites: Company[];
  notifications: NotificationsState;
  settings: AppSettings;
  onBack: () => void;
  onToggleFav: (company: Company) => void;
  onToggleNotif: (company: Company, notifId?: string) => void;
}

const CompanyScreen: React.FC<CompanyScreenProps> = ({
  company,
  favorites,
  notifications,
  settings,
  onBack,
  onToggleFav,
  onToggleNotif,
}) => {
  const isFav = favorites.some((f) => f.id === company.id);
  const hasNotif =
    notifications[company.id] && Object.values(notifications[company.id]).some(Boolean);
  const sector = SECTORS.find((s) => s.id === company.sector);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiUpdate, setAiUpdate] = useState<string | null>(null);

  const fetchAIUpdate = async () => {
    setLoadingAI(true);
    try {
      const result = await ollamaComplete(
        `You are an IPO intelligence analyst. Write a 2-3 sentence factual update on ${company.name} regarding its IPO plans, current business status, and what investors should watch for. Be specific, factual, and current. Focus only on what matters for an IPO decision. Keep it under 60 words. No markdown, plain text only.`
      );
      setAiUpdate(result.trim());
    } catch {
      setAiUpdate('Could not connect to Ollama. Make sure ollama serve is running with llama3.2.');
    }
    setLoadingAI(false);
  };

  const isListed = company.status === 'Listed' || company.status === "Recently IPO'd";
  const pctChange =
    company.ipoPrice != null && company.currentPrice != null
      ? (((company.currentPrice - company.ipoPrice) / company.ipoPrice) * 100).toFixed(1)
      : null;

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
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--text)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {company.name}
          </h1>
          {company.ticker && (
            <p style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'var(--mono)' }}>
              ${company.ticker}
            </p>
          )}
        </div>
        <StatusBadge status={company.status} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {/* Status banner card */}
        <div
          style={{
            background: 'var(--surface)',
            borderRadius: 16,
            padding: '16px',
            marginBottom: 16,
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <StatusBadge status={company.status} />
            {sector && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14 }}>{sector.icon}</span>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>{sector.label}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: '10px 12px' }}>
              <p style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>VALUATION</p>
              <p
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: 'var(--text)',
                  fontFamily: 'var(--mono)',
                }}
              >
                {company.valuation}
              </p>
            </div>
            <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: '10px 12px' }}>
              <p style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>IPO ETA</p>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: isListed ? 'var(--green)' : 'var(--gold)',
                }}
              >
                {company.eta}
              </p>
            </div>
            {isListed && company.ipoPrice != null && (
              <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: '10px 12px' }}>
                <p style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>
                  IPO PRICE
                </p>
                <p
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: 'var(--text)',
                    fontFamily: 'var(--mono)',
                  }}
                >
                  ${company.ipoPrice}
                </p>
              </div>
            )}
            {isListed && company.currentPrice != null && (
              <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: '10px 12px' }}>
                <p style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>
                  CURRENT PRICE
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <p
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: 'var(--text)',
                      fontFamily: 'var(--mono)',
                    }}
                  >
                    ${company.currentPrice}
                  </p>
                  {pctChange != null && (
                    <p
                      style={{
                        fontSize: 11,
                        color:
                          parseFloat(pctChange) > 0 ? 'var(--green)' : 'var(--red)',
                        fontFamily: 'var(--mono)',
                      }}
                    >
                      {parseFloat(pctChange) > 0 ? '+' : ''}
                      {pctChange}%
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {!isListed && (
            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <p style={{ fontSize: 11, color: 'var(--text3)' }}>IPO Confidence</p>
                {settings.showHypeMeter && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <p style={{ fontSize: 11, color: 'var(--text3)' }}>Hype</p>
                    <HypeMeter value={company.hype} />
                  </div>
                )}
              </div>
              <ConfidenceBar value={company.confidence} />
            </div>
          )}
        </div>

        {/* AI Intelligence */}
        <div
          style={{
            background: 'var(--surface)',
            borderRadius: 16,
            padding: '14px',
            marginBottom: 16,
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--gold)' }}>
              🤖 AI Intelligence
            </p>
            <button
              onClick={fetchAIUpdate}
              disabled={loadingAI}
              style={{
                padding: '4px 10px',
                borderRadius: 8,
                background: 'var(--gold-dim)',
                border: '1px solid var(--border-gold)',
                color: 'var(--gold)',
                fontSize: 11,
                fontWeight: 600,
                cursor: loadingAI ? 'default' : 'pointer',
                fontFamily: 'var(--font)',
              }}
            >
              {loadingAI ? '...' : 'Update'}
            </button>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
            {aiUpdate ?? company.description}
          </p>
        </div>

        {/* Latest News */}
        <div
          style={{
            background: 'var(--surface)',
            borderRadius: 16,
            padding: '14px',
            marginBottom: 16,
            border: '1px solid var(--border)',
          }}
        >
          <p
            style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 10 }}
          >
            📰 Latest News
          </p>
          <div style={{ borderLeft: '2px solid var(--gold)', paddingLeft: 12 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--text)',
                lineHeight: 1.5,
                marginBottom: 4,
              }}
            >
              {company.newsHeadline}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text3)' }}>{company.newsDate}</p>
          </div>
        </div>

        {/* Tags */}
        {company.tags && company.tags.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p
              style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 8 }}
            >
              Categories
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {company.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 20,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text2)',
                    fontSize: 12,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notification toggles */}
        {!isListed && (
          <div
            style={{
              background: 'var(--surface)',
              borderRadius: 16,
              padding: '14px',
              border: '1px solid var(--border)',
              marginBottom: 16,
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text2)',
                marginBottom: 10,
              }}
            >
              🔔 Alert me when...
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {NOTIFICATION_TYPES.slice(0, 4).map((nt) => {
                const on = notifications[company.id]?.[nt.id];
                return (
                  <button
                    key={nt.id}
                    onClick={() => onToggleNotif(company, nt.id)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 10px',
                      borderRadius: 10,
                      background: on ? 'var(--gold-dim)' : 'var(--bg3)',
                      border: on ? '1px solid var(--border-gold)' : '1px solid transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: 13, color: on ? 'var(--gold)' : 'var(--text2)' }}>
                      {nt.icon} {nt.label}
                    </span>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: on ? 'var(--gold)' : 'var(--bg4)',
                        border: on ? 'none' : '1.5px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {on && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#0D0D0F"
                          strokeWidth="3"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div
        style={{
          flexShrink: 0,
          padding: '10px 20px 14px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg2)',
          display: 'flex',
          gap: 10,
        }}
      >
        <button
          onClick={() => onToggleFav(company)}
          style={{
            flex: 1,
            padding: '13px',
            borderRadius: 13,
            background: isFav ? 'var(--gold)' : 'var(--surface)',
            border: isFav ? 'none' : '1px solid var(--border)',
            color: isFav ? '#0D0D0F' : 'var(--text2)',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'var(--font)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
          }}
        >
          <Icon name="star" size={16} color={isFav ? '#0D0D0F' : 'var(--text2)'} />
          {isFav ? 'In Watchlist' : 'Add to Watchlist'}
        </button>
        <button
          onClick={() => onToggleNotif(company)}
          style={{
            width: 50,
            borderRadius: 13,
            background: hasNotif ? 'rgba(212,168,67,0.18)' : 'var(--surface)',
            border: hasNotif ? '1px solid var(--border-gold)' : '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Icon name="bell" size={18} color={hasNotif ? 'var(--gold)' : 'var(--text3)'} />
        </button>
      </div>
    </div>
  );
};

export default CompanyScreen;

import React, { useState } from 'react';
import type { Company } from '../types';

interface PortfolioScreenProps {
  favorites: Company[];
}

interface Position {
  shares: number;
  buyPrice: number;
}

function fmt(n: number): string {
  const abs = Math.abs(n);
  const sign = n >= 0 ? '+' : '-';
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

function commify(n: number): string {
  return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const PortfolioScreen: React.FC<PortfolioScreenProps> = ({ favorites }) => {
  const listedFavs = favorites.filter(
    (f) => f.ipoPrice != null && f.currentPrice != null
  );

  const [positions, setPositions] = useState<Record<string, Position>>(() => {
    const init: Record<string, Position> = {};
    listedFavs.forEach((f) => {
      init[f.id] = { shares: 10, buyPrice: f.ipoPrice! };
    });
    return init;
  });

  const setField = (id: string, field: keyof Position, val: string) => {
    setPositions((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? { shares: 10, buyPrice: 0 }), [field]: parseFloat(val) || 0 },
    }));
  };

  const rows = listedFavs.map((f) => {
    const pos = positions[f.id] ?? { shares: 10, buyPrice: f.ipoPrice! };
    const shares = pos.shares || 0;
    const buyPrice = pos.buyPrice || 0;
    const costBasis = shares * buyPrice;
    const currentVal = shares * f.currentPrice!;
    const actualReturn = currentVal - costBasis;
    const actualPct = costBasis > 0 ? ((actualReturn / costBasis) * 100).toFixed(1) : '0';
    const ipoCostBasis = shares * f.ipoPrice!;
    const ipoReturn = currentVal - ipoCostBasis;
    const ipoPct = ipoCostBasis > 0 ? ((ipoReturn / ipoCostBasis) * 100).toFixed(1) : '0';
    return {
      ...f,
      pos,
      shares,
      buyPrice,
      costBasis,
      currentVal,
      actualReturn,
      actualPct,
      ipoCostBasis,
      ipoReturn,
      ipoPct,
    };
  });

  const totalCost = rows.reduce((s, r) => s + r.costBasis, 0);
  const totalCurrent = rows.reduce((s, r) => s + r.currentVal, 0);
  const totalReturn = totalCurrent - totalCost;
  const totalPct = totalCost > 0 ? ((totalReturn / totalCost) * 100).toFixed(1) : '0';

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          padding: '16px 20px 12px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
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
          Portfolio Sim
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
          Enter your actual purchase — see real vs IPO-price return
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px 20px' }}>
        {listedFavs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>💼</p>
            <p
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: 'var(--text)',
                marginBottom: 6,
              }}
            >
              No listed stocks yet
            </p>
            <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.5 }}>
              Add IPO'd stocks to your Watchlist to simulate here
            </p>
          </div>
        ) : (
          <>
            {/* Summary card */}
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
                style={{
                  fontSize: 11,
                  color: 'var(--text3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 10,
                }}
              >
                Portfolio Summary
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{ background: 'var(--bg3)', borderRadius: 10, padding: '10px 12px' }}
                >
                  <p style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 3 }}>
                    COST BASIS
                  </p>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: 'var(--text)',
                      fontFamily: 'var(--mono)',
                    }}
                  >
                    ${commify(totalCost)}
                  </p>
                </div>
                <div
                  style={{ background: 'var(--bg3)', borderRadius: 10, padding: '10px 12px' }}
                >
                  <p style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 3 }}>
                    MARKET VALUE
                  </p>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: 'var(--text)',
                      fontFamily: 'var(--mono)',
                    }}
                  >
                    ${commify(totalCurrent)}
                  </p>
                </div>
              </div>
              <div
                style={{
                  background:
                    totalReturn >= 0
                      ? 'rgba(74,222,128,0.1)'
                      : 'rgba(248,113,113,0.1)',
                  borderRadius: 10,
                  padding: '10px 12px',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 2 }}>
                  TOTAL P&L
                </p>
                <p
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: totalReturn >= 0 ? 'var(--green)' : 'var(--red)',
                    fontFamily: 'var(--mono)',
                  }}
                >
                  {fmt(totalReturn)}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: totalReturn >= 0 ? 'var(--green)' : 'var(--red)',
                    fontFamily: 'var(--mono)',
                  }}
                >
                  {parseFloat(totalPct) > 0 ? '+' : ''}
                  {totalPct}%
                </p>
              </div>
            </div>

            {/* Positions */}
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text2)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 10,
              }}
            >
              Positions
            </p>
            {rows.map((r) => (
              <div
                key={r.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  padding: '14px',
                  marginBottom: 12,
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
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                      {r.ticker ? `$${r.ticker}` : r.name}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text3)' }}>
                      Current price:{' '}
                      <span
                        style={{ fontFamily: 'var(--mono)', color: 'var(--text2)' }}
                      >
                        ${r.currentPrice}
                      </span>
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: r.actualReturn >= 0 ? 'var(--green)' : 'var(--red)',
                        fontFamily: 'var(--mono)',
                      }}
                    >
                      {fmt(r.actualReturn)}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: r.actualReturn >= 0 ? 'var(--green)' : 'var(--red)',
                        fontFamily: 'var(--mono)',
                      }}
                    >
                      {parseFloat(r.actualPct) > 0 ? '+' : ''}
                      {r.actualPct}%
                    </p>
                  </div>
                </div>

                {/* Inputs */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <p style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>
                      SHARES OWNED
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'var(--bg3)',
                        borderRadius: 8,
                        border: '1px solid var(--border)',
                        overflow: 'hidden',
                      }}
                    >
                      <input
                        type="number"
                        value={r.pos.shares}
                        onChange={(e) => setField(r.id, 'shares', e.target.value)}
                        style={{
                          flex: 1,
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text)',
                          fontSize: 13,
                          fontFamily: 'var(--mono)',
                          padding: '7px 10px',
                          outline: 'none',
                          width: 0,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>
                      YOUR BUY PRICE
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'var(--bg3)',
                        borderRadius: 8,
                        border: '1px solid var(--border)',
                        overflow: 'hidden',
                      }}
                    >
                      <span
                        style={{
                          padding: '7px 6px 7px 10px',
                          fontSize: 12,
                          color: 'var(--text3)',
                        }}
                      >
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        value={r.pos.buyPrice}
                        onChange={(e) => setField(r.id, 'buyPrice', e.target.value)}
                        style={{
                          flex: 1,
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text)',
                          fontSize: 13,
                          fontFamily: 'var(--mono)',
                          padding: '7px 10px 7px 0',
                          outline: 'none',
                          width: 0,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actual vs IPO comparison */}
                <div
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}
                >
                  <div
                    style={{
                      background:
                        r.actualReturn >= 0
                          ? 'rgba(74,222,128,0.08)'
                          : 'rgba(248,113,113,0.08)',
                      borderRadius: 10,
                      padding: '9px 10px',
                    }}
                  >
                    <p style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 3 }}>
                      YOUR ACTUAL RETURN
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: r.actualReturn >= 0 ? 'var(--green)' : 'var(--red)',
                        fontFamily: 'var(--mono)',
                      }}
                    >
                      {fmt(r.actualReturn)}
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: r.actualReturn >= 0 ? 'var(--green)' : 'var(--red)',
                        fontFamily: 'var(--mono)',
                      }}
                    >
                      {parseFloat(r.actualPct) > 0 ? '+' : ''}
                      {r.actualPct}%
                    </p>
                    <p style={{ fontSize: 9, color: 'var(--text3)', marginTop: 2 }}>
                      @ ${r.buyPrice}/share
                    </p>
                  </div>
                  <div
                    style={{
                      background: 'rgba(212,168,67,0.08)',
                      borderRadius: 10,
                      padding: '9px 10px',
                      border: '1px dashed rgba(212,168,67,0.25)',
                    }}
                  >
                    <p style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 3 }}>
                      IF BOUGHT AT IPO
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: r.ipoReturn >= 0 ? 'var(--green)' : 'var(--red)',
                        fontFamily: 'var(--mono)',
                      }}
                    >
                      {fmt(r.ipoReturn)}
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: r.ipoReturn >= 0 ? 'var(--green)' : 'var(--red)',
                        fontFamily: 'var(--mono)',
                      }}
                    >
                      {parseFloat(r.ipoPct) > 0 ? '+' : ''}
                      {r.ipoPct}%
                    </p>
                    <p style={{ fontSize: 9, color: 'var(--gold)', marginTop: 2 }}>
                      @ ${r.ipoPrice}/share
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default PortfolioScreen;

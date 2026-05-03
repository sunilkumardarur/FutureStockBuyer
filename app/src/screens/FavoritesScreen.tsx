import React, { useState } from 'react';
import type { Company } from '../types';
import StatusBadge from '../components/shared/StatusBadge';
import Icon from '../components/shared/Icon';

interface FavoritesScreenProps {
  favorites: Company[];
  allCompanies: Company[];
  onCompanyPress: (company: Company) => void;
  onRemoveFav: (company: Company) => void;
  onAddFav: (company: Company) => void;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  favorites,
  allCompanies,
  onCompanyPress,
  onRemoveFav,
  onAddFav,
}) => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const activeIPO = favorites.filter(
    (f) => f.status !== 'Listed' && f.status !== "Recently IPO'd"
  );
  const liveStocks = favorites.filter(
    (f) =>
      f.status === 'Listed' || f.status === "Recently IPO'd" || f.currentPrice != null
  );

  const handleSearch = (q: string) => {
    setSearch(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    const lower = q.toLowerCase();
    const results = allCompanies
      .filter(
        (c) =>
          (c.name.toLowerCase().includes(lower) ||
            (c.ticker && c.ticker.toLowerCase().includes(lower))) &&
          !favorites.some((f) => f.id === c.id)
      )
      .slice(0, 6);
    setSearchResults(results);
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
      <div
        style={{
          padding: '16px 20px 12px',
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
          Watchlist
        </h1>
        <button
          onClick={() => {
            setShowSearch(!showSearch);
            setSearch('');
            setSearchResults([]);
          }}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: showSearch ? 'var(--gold-dim)' : 'var(--surface)',
            border: showSearch ? '1px solid var(--border-gold)' : '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Icon
            name={showSearch ? 'x' : 'plus'}
            size={18}
            color={showSearch ? 'var(--gold)' : 'var(--text2)'}
          />
        </button>
      </div>

      {showSearch && (
        <div style={{ padding: '0 20px 12px' }}>
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search company or ticker..."
            autoFocus
            style={{
              width: '100%',
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
          {searchResults.length > 0 && (
            <div
              style={{
                marginTop: 8,
                background: 'var(--surface2)',
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid var(--border)',
              }}
            >
              {searchResults.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onAddFav(c);
                    setSearch('');
                    setSearchResults([]);
                    setShowSearch(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom:
                      i < searchResults.length - 1 ? '1px solid var(--border)' : 'none',
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
                    <p style={{ fontSize: 11, color: 'var(--text3)' }}>
                      {c.sector} · {c.eta}
                    </p>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 600 }}>
                    + Add
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
        {favorites.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>⭐</p>
            <p
              style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}
            >
              No watchlist items yet
            </p>
            <p style={{ fontSize: 13, color: 'var(--text3)' }}>
              Star companies from sector pages or search above
            </p>
          </div>
        )}

        {/* Listed stocks */}
        {liveStocks.length > 0 && (
          <>
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
              📊 Listed Stocks
            </h2>
            {liveStocks.map((fav) => {
              const pct =
                fav.ipoPrice != null && fav.currentPrice != null
                  ? (((fav.currentPrice - fav.ipoPrice) / fav.ipoPrice) * 100).toFixed(1)
                  : null;
              return (
                <div
                  key={fav.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 14,
                    padding: '14px',
                    marginBottom: 10,
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
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                          {fav.ticker ? `$${fav.ticker}` : fav.name}
                        </p>
                        {fav.ticker && (
                          <p style={{ fontSize: 12, color: 'var(--text2)' }}>{fav.name}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveFav(fav)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: 'var(--bg4)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Icon name="trash" size={13} color="var(--text3)" />
                    </button>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: 8,
                    }}
                  >
                    {fav.ipoPrice != null && (
                      <div
                        style={{
                          background: 'var(--bg3)',
                          borderRadius: 8,
                          padding: '8px',
                        }}
                      >
                        <p style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 2 }}>
                          IPO PRICE
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: 'var(--text)',
                            fontFamily: 'var(--mono)',
                          }}
                        >
                          ${fav.ipoPrice}
                        </p>
                      </div>
                    )}
                    {fav.currentPrice != null && (
                      <div
                        style={{
                          background: 'var(--bg3)',
                          borderRadius: 8,
                          padding: '8px',
                        }}
                      >
                        <p style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 2 }}>
                          CURRENT
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: 'var(--text)',
                            fontFamily: 'var(--mono)',
                          }}
                        >
                          ${fav.currentPrice}
                        </p>
                      </div>
                    )}
                    {pct != null && (
                      <div
                        style={{
                          background: 'var(--bg3)',
                          borderRadius: 8,
                          padding: '8px',
                        }}
                      >
                        <p style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 2 }}>
                          RETURN
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color:
                              parseFloat(pct) > 0 ? 'var(--green)' : 'var(--red)',
                            fontFamily: 'var(--mono)',
                          }}
                        >
                          {parseFloat(pct) > 0 ? '+' : ''}
                          {pct}%
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onCompanyPress(fav)}
                    style={{
                      marginTop: 8,
                      width: '100%',
                      padding: '6px',
                      borderRadius: 8,
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      color: 'var(--text2)',
                      fontSize: 12,
                      cursor: 'pointer',
                      fontFamily: 'var(--font)',
                    }}
                  >
                    Details →
                  </button>
                </div>
              );
            })}
          </>
        )}

        {/* Pre-IPO */}
        {activeIPO.length > 0 && (
          <>
            <h2
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text2)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 12,
                marginTop: liveStocks.length > 0 ? 16 : 0,
              }}
            >
              🎯 Tracking Pre-IPO
            </h2>
            {activeIPO.map((fav) => (
              <div
                key={fav.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  padding: '12px 14px',
                  marginBottom: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                  onClick={() => onCompanyPress(fav)}
                >
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--text)',
                      marginBottom: 2,
                    }}
                  >
                    {fav.name}
                  </p>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <StatusBadge status={fav.status} />
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>{fav.eta}</span>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFav(fav)}
                  style={{
                    marginLeft: 10,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: 'var(--bg4)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <Icon name="trash" size={13} color="var(--text3)" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default FavoritesScreen;

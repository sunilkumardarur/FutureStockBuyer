import React from 'react';
import Icon from './Icon';
import type { TabId } from '../../types';

interface TabBarProps {
  active: TabId;
  onTab: (tab: TabId) => void;
  notifCount: number;
}

const tabs: { id: TabId; icon: React.ComponentProps<typeof Icon>['name']; label: string }[] = [
  { id: 'dashboard', icon: 'home', label: 'Home' },
  { id: 'calendar', icon: 'clock', label: 'Calendar' },
  { id: 'watchlist', icon: 'star', label: 'Watchlist' },
  { id: 'portfolio', icon: 'chart', label: 'Portfolio' },
  { id: 'explore', icon: 'search', label: 'Explore' },
];

const TabBar: React.FC<TabBarProps> = ({ active, onTab, notifCount }) => (
  <div
    style={{
      display: 'flex',
      background: 'var(--bg2)',
      borderTop: '1px solid var(--border)',
      flexShrink: 0,
    }}
  >
    {tabs.map((t) => (
      <button
        key={t.id}
        onClick={() => onTab(t.id)}
        style={{
          flex: 1,
          padding: '10px 0 8px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          position: 'relative',
        }}
      >
        {t.id === 'watchlist' && notifCount > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 8,
              right: '50%',
              transform: 'translateX(8px)',
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: 'var(--gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 9, fontWeight: 700, color: '#0D0D0F' }}>{notifCount}</span>
          </div>
        )}
        <Icon
          name={t.icon}
          size={20}
          color={active === t.id ? 'var(--gold)' : 'var(--text3)'}
        />
        <span
          style={{
            fontSize: 9,
            color: active === t.id ? 'var(--gold)' : 'var(--text3)',
            fontWeight: active === t.id ? 600 : 400,
          }}
        >
          {t.label}
        </span>
      </button>
    ))}
  </div>
);

export default TabBar;

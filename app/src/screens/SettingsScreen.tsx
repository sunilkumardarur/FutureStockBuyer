import React, { useState } from 'react';
import type { AppSettings } from '../types';
import Icon from '../components/shared/Icon';

interface SettingsScreenProps {
  settings: AppSettings;
  onBack: () => void;
  onUpdate: (patch: Partial<AppSettings>) => void;
  onClearAllCache: () => void;
}

const ACCENT_PRESETS = [
  '#D4A843', // gold (default)
  '#60A5FA', // blue
  '#4ADE80', // green
  '#F87171', // red
  '#A78BFA', // purple
  '#F97316', // orange
  '#EC4899', // pink
  '#34D399', // teal
];

const SettingsScreen: React.FC<SettingsScreenProps> = ({ settings, onBack, onUpdate, onClearAllCache }) => {
  const [cleared, setCleared] = useState(false);

  const handleClearCache = () => {
    onClearAllCache();
    setCleared(true);
    setTimeout(() => setCleared(false), 2500);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
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
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--surface)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <Icon name="back" size={18} color="var(--text2)" />
        </button>
        <h1 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>Settings</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 32px' }}>

        {/* Appearance */}
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          Appearance
        </p>

        {/* Light / Dark Mode */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>Light Mode</p>
            <p style={{ fontSize: 12, color: 'var(--text3)' }}>Switch to a light theme</p>
          </div>
          <button
            onClick={() => onUpdate({ lightMode: !settings.lightMode })}
            style={{
              width: 44, height: 26, borderRadius: 999,
              background: settings.lightMode ? 'var(--gold)' : 'var(--bg4)',
              border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
              transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                position: 'absolute', top: 3,
                left: settings.lightMode ? 21 : 3,
                width: 20, height: 20, borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                transition: 'left 0.2s',
              }}
            />
          </button>
        </div>

        {/* Accent Color */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px', marginBottom: 10 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Accent Color</p>
          <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 12 }}>Choose your highlight color</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {ACCENT_PRESETS.map((color) => (
              <button
                key={color}
                onClick={() => onUpdate({ accentColor: color })}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: color, border: 'none', cursor: 'pointer',
                  outline: settings.accentColor === color ? `3px solid ${color}` : 'none',
                  outlineOffset: 2,
                  transform: settings.accentColor === color ? 'scale(1.15)' : 'scale(1)',
                  transition: 'transform 0.15s',
                }}
              />
            ))}
            {/* Custom color picker */}
            <label
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--bg4)', border: '1.5px dashed var(--border)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, overflow: 'hidden',
              }}
              title="Custom color"
            >
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => onUpdate({ accentColor: e.target.value })}
                style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}
              />
              +
            </label>
          </div>
        </div>

        {/* Display */}
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, marginTop: 20 }}>
          Display
        </p>

        {/* Show Hype Meter */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>Show Hype Meter</p>
            <p style={{ fontSize: 12, color: 'var(--text3)' }}>Display the hype indicator on cards</p>
          </div>
          <button
            onClick={() => onUpdate({ showHypeMeter: !settings.showHypeMeter })}
            style={{
              width: 44, height: 26, borderRadius: 999,
              background: settings.showHypeMeter ? 'var(--gold)' : 'var(--bg4)',
              border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
              transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                position: 'absolute', top: 3,
                left: settings.showHypeMeter ? 21 : 3,
                width: 20, height: 20, borderRadius: '50%',
                background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                transition: 'left 0.2s',
              }}
            />
          </button>
        </div>

        {/* Compact Cards */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>Compact Cards</p>
            <p style={{ fontSize: 12, color: 'var(--text3)' }}>Show more items with less padding</p>
          </div>
          <button
            onClick={() => onUpdate({ compactCards: !settings.compactCards })}
            style={{
              width: 44, height: 26, borderRadius: 999,
              background: settings.compactCards ? 'var(--gold)' : 'var(--bg4)',
              border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
              transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                position: 'absolute', top: 3,
                left: settings.compactCards ? 21 : 3,
                width: 20, height: 20, borderRadius: '50%',
                background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                transition: 'left 0.2s',
              }}
            />
          </button>
        </div>

        {/* Data */}
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, marginTop: 20 }}>
          Data
        </p>
        <button
          onClick={handleClearCache}
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 14,
            background: cleared ? 'rgba(74,222,128,0.1)' : 'var(--surface)',
            border: cleared ? '1px solid #4ADE80' : '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            marginBottom: 10,
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: cleared ? '#4ADE80' : 'var(--text)', marginBottom: 2 }}>
              {cleared ? 'Cache Cleared' : 'Clear All Cached Data'}
            </p>
            <p style={{ fontSize: 12, color: 'var(--text3)' }}>
              {cleared ? 'Data will reload from Ollama next visit' : 'Force fresh data from Ollama on next load'}
            </p>
          </div>
          <span style={{ fontSize: cleared ? 16 : 14 }}>{cleared ? '✓' : '🗑️'}</span>
        </button>

        {/* About */}
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, marginTop: 20 }}>
          About
        </p>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Future Stock Buyer</p>
          <p style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.6 }}>
            IPO intelligence powered by Ollama llama3.2 running locally on your machine.
            Data is refreshed every 24 hours and cached for offline use.
          </p>
          <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8, fontFamily: 'var(--mono)' }}>v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;

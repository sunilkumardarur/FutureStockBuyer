import React, { useState } from 'react';
import { SECTORS } from '../data';

interface OnboardingScreenProps {
  onDone: (sectors: string[]) => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onDone }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [step, setStep] = useState(0);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (step === 0) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 28px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--gold-dim)',
            border: '1.5px solid var(--border-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            fontSize: 32,
          }}
        >
          📈
        </div>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
            marginBottom: 10,
            lineHeight: 1.2,
          }}
        >
          Future
          <br />
          Stock Buyer
        </h1>
        <p
          style={{
            color: 'var(--text2)',
            fontSize: 14,
            lineHeight: 1.6,
            maxWidth: 260,
            marginBottom: 32,
          }}
        >
          Track anticipated IPOs before they happen. Get ahead of the market.
        </p>
        <button
          onClick={() => setStep(1)}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 14,
            background: 'var(--gold)',
            color: '#0D0D0F',
            fontWeight: 700,
            fontSize: 16,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font)',
          }}
        >
          Get Started
        </button>
        <p style={{ color: 'var(--text3)', fontSize: 12, marginTop: 14 }}>
          No account needed · Free to use
        </p>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px 10px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
          Pick your sectors
        </h2>
        <p style={{ color: 'var(--text2)', fontSize: 13 }}>
          Select industries you want to follow
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {SECTORS.map((s) => {
            const on = selected.has(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                style={{
                  padding: '12px 6px',
                  borderRadius: 14,
                  background: on ? 'var(--gold-dim)' : 'var(--surface)',
                  border: on ? '1.5px solid var(--border-gold)' : '1.5px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
              >
                {on && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: 'var(--gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0D0D0F"
                      strokeWidth="3"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                )}
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <span
                  style={{
                    fontSize: 10,
                    color: on ? 'var(--gold)' : 'var(--text2)',
                    fontWeight: on ? 600 : 400,
                    textAlign: 'center',
                    lineHeight: 1.3,
                  }}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '12px 16px 16px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => selected.size > 0 && onDone([...selected])}
          disabled={selected.size === 0}
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: 14,
            background: selected.size > 0 ? 'var(--gold)' : 'var(--surface2)',
            color: selected.size > 0 ? '#0D0D0F' : 'var(--text3)',
            fontWeight: 700,
            fontSize: 15,
            border: 'none',
            cursor: selected.size > 0 ? 'pointer' : 'default',
            fontFamily: 'var(--font)',
            transition: 'all 0.2s',
          }}
        >
          {selected.size === 0
            ? 'Select at least one sector'
            : `Continue with ${selected.size} sector${selected.size > 1 ? 's' : ''}`}
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;

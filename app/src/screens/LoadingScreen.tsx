import React from 'react';

interface LoadingScreenProps {
  message: string;
  error?: string;
  onRetry?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message, error, onRetry }) => {
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
        background: 'var(--bg)',
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
        {error ? '⚠️' : '📈'}
      </div>

      {error ? (
        <>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: 12,
              lineHeight: 1.3,
            }}
          >
            Could not connect to Ollama
          </h2>
          <p
            style={{
              fontSize: 13,
              color: 'var(--text2)',
              lineHeight: 1.6,
              maxWidth: 280,
              marginBottom: 28,
            }}
          >
            {error}
          </p>
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '14px 16px',
              marginBottom: 24,
              textAlign: 'left',
              width: '100%',
            }}
          >
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--gold)', marginBottom: 8 }}>
              Setup instructions:
            </p>
            <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7, fontFamily: 'var(--mono)' }}>
              1. ollama serve<br />
              2. ollama pull llama3.2<br />
              3. Then retry below
            </p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 14,
                background: 'var(--gold)',
                color: '#0D0D0F',
                fontWeight: 700,
                fontSize: 15,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font)',
              }}
            >
              ← Back to Setup
            </button>
          )}
        </>
      ) : (
        <>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: 10,
              letterSpacing: '-0.02em',
            }}
          >
            Fetching IPO Data
          </h2>
          <p
            style={{
              fontSize: 13,
              color: 'var(--text2)',
              lineHeight: 1.6,
              maxWidth: 260,
              marginBottom: 32,
            }}
          >
            {message}
          </p>
          {/* Animated dots */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--gold)',
                  opacity: 0.4,
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 0.2; transform: scale(0.8); }
              50% { opacity: 1; transform: scale(1.2); }
            }
          `}</style>
          <p
            style={{
              fontSize: 11,
              color: 'var(--text3)',
              marginTop: 24,
              lineHeight: 1.5,
            }}
          >
            Powered by Ollama llama3.2 · Running locally
          </p>
        </>
      )}
    </div>
  );
};

export default LoadingScreen;

import React from 'react';

interface ConfidenceBarProps {
  value: number; // 0–100
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ value }) => {
  const color = value >= 75 ? '#D4A843' : value >= 50 ? '#60A5FA' : '#94A3B8';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div
        style={{
          flex: 1,
          height: 3,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: '100%',
            background: color,
            borderRadius: 3,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
      <span
        style={{
          fontSize: 10,
          color,
          fontFamily: 'var(--mono)',
          minWidth: 28,
        }}
      >
        {value}%
      </span>
    </div>
  );
};

export default ConfidenceBar;

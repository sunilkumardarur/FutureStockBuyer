import React from 'react';

interface HypeMeterProps {
  value: number; // 0–100
}

const HypeMeter: React.FC<HypeMeterProps> = ({ value }) => {
  const BARS = 5;
  const filled = Math.round((value / 100) * BARS);
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {Array.from({ length: BARS }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 4,
            height: 10 + i * 2,
            background:
              i < filled
                ? `rgba(212,168,67,${0.4 + i * 0.12})`
                : 'rgba(255,255,255,0.07)',
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
};

export default HypeMeter;

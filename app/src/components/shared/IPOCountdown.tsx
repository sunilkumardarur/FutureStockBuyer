import React from 'react';

interface IPOCountdownProps {
  etaDate: string;
}

const IPOCountdown: React.FC<IPOCountdownProps> = ({ etaDate }) => {
  const date = new Date(etaDate);
  const now = new Date();
  const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diff <= 0) {
    return (
      <span style={{ color: 'var(--green)', fontSize: 11, fontFamily: 'var(--mono)' }}>
        Listed
      </span>
    );
  }
  if (diff <= 30) {
    return (
      <span style={{ color: 'var(--gold)', fontSize: 11, fontFamily: 'var(--mono)' }}>
        {diff}d away
      </span>
    );
  }
  const months = Math.ceil(diff / 30);
  return (
    <span style={{ color: 'var(--text2)', fontSize: 11, fontFamily: 'var(--mono)' }}>
      ~{months}mo
    </span>
  );
};

export default IPOCountdown;

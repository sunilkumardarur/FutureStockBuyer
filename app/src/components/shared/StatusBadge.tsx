import React from 'react';
import type { CompanyStatus } from '../../types';

interface StatusBadgeProps {
  status: CompanyStatus;
}

const configs: Record<CompanyStatus, { bg: string; color: string; label: string }> = {
  'Filed S-1': { bg: 'rgba(212,168,67,0.18)', color: '#D4A843', label: 'Filed S-1' },
  Exploring: { bg: 'rgba(96,165,250,0.15)', color: '#60A5FA', label: 'Exploring' },
  Rumored: { bg: 'rgba(167,139,250,0.15)', color: '#A78BFA', label: 'Rumored' },
  Watching: { bg: 'rgba(148,163,184,0.12)', color: '#94A3B8', label: 'Watching' },
  Listed: { bg: 'rgba(74,222,128,0.12)', color: '#4ADE80', label: 'Listed' },
  "Recently IPO'd": { bg: 'rgba(74,222,128,0.15)', color: '#4ADE80', label: "IPO'd" },
  Restructuring: { bg: 'rgba(248,113,113,0.12)', color: '#F87171', label: 'Restructuring' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const cfg = configs[status] ?? configs['Watching'];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 20,
        background: cfg.bg,
        color: cfg.color,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.label}
    </span>
  );
};

export default StatusBadge;

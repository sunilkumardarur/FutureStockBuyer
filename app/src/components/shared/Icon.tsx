import React from 'react';

export type IconName =
  | 'home'
  | 'search'
  | 'bell'
  | 'star'
  | 'plus'
  | 'x'
  | 'back'
  | 'trend_up'
  | 'trend_down'
  | 'chart'
  | 'settings'
  | 'check'
  | 'info'
  | 'fire'
  | 'clock'
  | 'grid'
  | 'layers'
  | 'bookmark'
  | 'trash';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}

const paths: Record<IconName, string> = {
  home: 'M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-5h-4v5H4a1 1 0 01-1-1V9.5z',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zm0 0l4 4',
  bell: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  plus: 'M12 5v14M5 12h14',
  x: 'M18 6L6 18M6 6l12 12',
  back: 'M19 12H5M12 19l-7-7 7-7',
  trend_up: 'M23 6l-9.5 9.5-5-5L1 18',
  trend_down: 'M23 18l-9.5-9.5-5 5L1 6',
  chart: 'M18 20V10M12 20V4M6 20v-6',
  settings:
    'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
  check: 'M20 6L9 17l-5-5',
  info: 'M12 16v-4M12 8h.01M22 12a10 10 0 11-20 0 10 10 0 0120 0z',
  fire: 'M12 2c0 0-5 6-5 10a5 5 0 0010 0c0-4-5-10-5-10z',
  clock: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  bookmark: 'M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z',
  trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
};

const Icon: React.FC<IconProps> = ({ name, size = 20, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d={paths[name]} />
  </svg>
);

export default Icon;

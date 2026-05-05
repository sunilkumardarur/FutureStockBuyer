import type { Sector, NotificationType } from './types';

export const SECTORS: Sector[] = [
  { id: 'ai',         label: 'AI & Machine Learning',      icon: '🤖', color: '#F59E0B' },
  { id: 'biotech',    label: 'Biotech & Genomics',          icon: '🧬', color: '#10B981' },
  { id: 'fintech',    label: 'Fintech & Payments',          icon: '💳', color: '#3B82F6' },
  { id: 'ev',         label: 'EV & Clean Energy',           icon: '⚡', color: '#6EE7B7' },
  { id: 'space',      label: 'Space & Aerospace',           icon: '🚀', color: '#8B5CF6' },
  { id: 'cybersec',   label: 'Cybersecurity',               icon: '🔒', color: '#EF4444' },
  { id: 'cloud',      label: 'Cloud & SaaS',                icon: '☁️', color: '#60A5FA' },
  { id: 'crypto',     label: 'Crypto & Web3',               icon: '₿',  color: '#F97316' },
  { id: 'health',     label: 'Digital Health',              icon: '🏥', color: '#34D399' },
  { id: 'retail',     label: 'Retail & eCommerce',          icon: '🛍️', color: '#EC4899' },
  { id: 'defense',    label: 'Defense & Security',          icon: '🛡️', color: '#64748B' },
  { id: 'robotics',   label: 'Robotics & Automation',       icon: '🦾', color: '#A78BFA' },
  { id: 'media',      label: 'Media & Streaming',           icon: '📺', color: '#F43F5E' },
  { id: 'food',       label: 'Food Tech & AgriTech',        icon: '🌱', color: '#84CC16' },
  { id: 'realestate', label: 'PropTech & Real Estate',      icon: '🏠', color: '#FB923C' },
  { id: 'quantum',    label: 'Quantum Computing',           icon: '⚛️', color: '#C084FC' },
  { id: 'logistics',  label: 'Logistics & Supply Chain',    icon: '📦', color: '#94A3B8' },
  { id: 'edtech',     label: 'EdTech & Learning',           icon: '🎓', color: '#FCD34D' },
];

export const NOTIFICATION_TYPES: NotificationType[] = [
  { id: 'day_of',       label: 'Day of IPO',      icon: '🔔' },
  { id: 'day_before',   label: '1 Day Before',    icon: '📅' },
  { id: '3_days',       label: '3 Days Before',   icon: '📆' },
  { id: '1_week',       label: '1 Week Before',   icon: '🗓️' },
  { id: 'price_update', label: 'Price Updates',   icon: '💹' },
  { id: 'news',         label: 'News Mentions',   icon: '📰' },
];

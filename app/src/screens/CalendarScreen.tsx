import React from 'react';
import { SECTORS } from '../data';
import type { Company } from '../types';
import StatusBadge from '../components/shared/StatusBadge';

interface CalendarScreenProps {
  sectors: string[];
  ipoData: Record<string, Company[]>;
  onCompanyPress: (company: Company) => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const YEARS = [2025, 2026, 2027, 2028];

const STATUS_COLOR: Record<string, string> = {
  'Filed S-1': '#D4A843',
  Exploring: '#60A5FA',
  Rumored: '#A78BFA',
  Watching: '#94A3B8',
  Restructuring: '#F87171',
  Listed: '#4ADE80',
  "Recently IPO'd": '#4ADE80',
};

interface GroupEntry {
  year: number;
  month: string;
  monthIdx: number;
  companies: Company[];
}

const CalendarScreen: React.FC<CalendarScreenProps> = ({
  sectors,
  ipoData,
  onCompanyPress,
}) => {
  // Gather all companies across selected sectors (include listed for calendar context)
  const allCompanies: Company[] = [];
  sectors.forEach((sId) => {
    (ipoData[sId] ?? []).forEach((c) => allCompanies.push(c));
  });

  // Group by year-month
  const grouped: Record<string, Company[]> = {};
  allCompanies.forEach((c) => {
    const d = new Date(c.etaDate);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(c);
  });

  const entries: GroupEntry[] = [];
  YEARS.forEach((y) => {
    MONTHS.forEach((m, mi) => {
      const key = `${y}-${mi}`;
      if (grouped[key] && grouped[key].length > 0) {
        entries.push({ year: y, month: m, monthIdx: mi, companies: grouped[key] });
      }
    });
  });

  const totalPreIPO = allCompanies.filter(
    (c) => c.status !== 'Listed' && c.status !== "Recently IPO'd"
  ).length;

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          padding: '16px 20px 12px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
          }}
        >
          IPO Calendar
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
          {totalPreIPO} upcoming across your sectors
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px 20px' }}>
        {entries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>📅</p>
            <p style={{ fontSize: 15, color: 'var(--text2)' }}>
              No calendar data for your sectors yet
            </p>
          </div>
        )}

        {entries.map(({ year, month, monthIdx, companies }) => (
          <div key={`${year}-${monthIdx}`} style={{ marginBottom: 20 }}>
            {/* Month header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div style={{ height: 1, flex: 1, background: 'var(--border)' }} />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--text3)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                {month} {year}
              </span>
              <div style={{ height: 1, flex: 1, background: 'var(--border)' }} />
            </div>

            {companies.map((c) => {
              const sector = SECTORS.find((s) => s.id === c.sector);
              const col = STATUS_COLOR[c.status] ?? '#94A3B8';
              return (
                <button
                  key={c.id}
                  onClick={() => onCompanyPress(c)}
                  style={{
                    width: '100%',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderLeft: `3px solid ${col}`,
                    borderRadius: 12,
                    padding: '11px 13px',
                    marginBottom: 8,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>
                    {sector?.icon ?? '🏢'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--text)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {c.name}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text3)' }}>
                      {c.valuation} · {sector?.label}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <StatusBadge status={c.status} />
                    <p
                      style={{
                        fontSize: 10,
                        color: 'var(--text3)',
                        marginTop: 3,
                        fontFamily: 'var(--mono)',
                      }}
                    >
                      {c.eta}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarScreen;

import React from 'react';
import { SECTORS, NOTIFICATION_TYPES } from '../data';
import type { Company, NotificationsState } from '../types';
import StatusBadge from '../components/shared/StatusBadge';

interface NotificationsScreenProps {
  notifications: NotificationsState;
  allCompanies: Company[];
  onToggleNotif: (company: Company, notifId: string) => void;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications,
  allCompanies,
  onToggleNotif,
}) => {
  const tracked = allCompanies.filter(
    (c) => notifications[c.id] && Object.values(notifications[c.id]).some(Boolean)
  );

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
      }}
    >
      <div style={{ padding: '16px 20px 12px' }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
          }}
        >
          Alerts
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>
          {tracked.length} companies tracked
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
        {tracked.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>🔔</p>
            <p
              style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}
            >
              No alerts set
            </p>
            <p style={{ fontSize: 13, color: 'var(--text3)' }}>
              Tap the bell icon on any company to set alerts
            </p>
          </div>
        ) : (
          tracked.map((c) => {
            const sector = SECTORS.find((s) => s.id === c.sector);
            return (
              <div
                key={c.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: '14px',
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{sector?.icon ?? '🏢'}</span>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                        {c.name}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--text3)' }}>{c.eta}</p>
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {NOTIFICATION_TYPES.map((nt) => {
                    const on = notifications[c.id]?.[nt.id];
                    return (
                      <button
                        key={nt.id}
                        onClick={() => onToggleNotif(c, nt.id)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: 20,
                          background: on ? 'var(--gold-dim)' : 'var(--bg4)',
                          border: on
                            ? '1px solid var(--border-gold)'
                            : '1px solid var(--border)',
                          color: on ? 'var(--gold)' : 'var(--text3)',
                          fontSize: 11,
                          cursor: 'pointer',
                          fontFamily: 'var(--font)',
                        }}
                      >
                        {nt.icon} {nt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;

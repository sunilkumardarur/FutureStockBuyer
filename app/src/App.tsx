import React, { useState, useEffect, useMemo } from 'react';
import {
  IPO_DATA,
  EXAMPLE_SECTORS,
  EXAMPLE_FAVORITES,
  EXAMPLE_NOTIFICATIONS,
} from './data';
import type { Company, Sector, NotificationsState, StackEntry, TabId } from './types';

import TabBar from './components/shared/TabBar';
import OnboardingScreen from './screens/OnboardingScreen';
import DashboardScreen from './screens/DashboardScreen';
import SectorScreen from './screens/SectorScreen';
import CompanyScreen from './screens/CompanyScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ExploreScreen from './screens/ExploreScreen';
import CalendarScreen from './screens/CalendarScreen';
import PortfolioScreen from './screens/PortfolioScreen';

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v != null ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

const App: React.FC = () => {
  const [onboarded, setOnboarded] = useState<boolean>(() =>
    load('fsb_onboarded', false)
  );
  const [userSectors, setUserSectors] = useState<string[]>(() =>
    load('fsb_sectors', EXAMPLE_SECTORS)
  );
  const [favorites, setFavorites] = useState<Company[]>(() =>
    load('fsb_favorites', EXAMPLE_FAVORITES)
  );
  const [notifications, setNotifications] = useState<NotificationsState>(() =>
    load('fsb_notifications', EXAMPLE_NOTIFICATIONS)
  );
  const [tab, setTab] = useState<TabId>('dashboard');
  const [stack, setStack] = useState<StackEntry[]>([]);

  // Persist
  useEffect(() => {
    try { localStorage.setItem('fsb_onboarded', JSON.stringify(onboarded)); } catch { /* noop */ }
  }, [onboarded]);
  useEffect(() => {
    try { localStorage.setItem('fsb_sectors', JSON.stringify(userSectors)); } catch { /* noop */ }
  }, [userSectors]);
  useEffect(() => {
    try { localStorage.setItem('fsb_favorites', JSON.stringify(favorites)); } catch { /* noop */ }
  }, [favorites]);
  useEffect(() => {
    try { localStorage.setItem('fsb_notifications', JSON.stringify(notifications)); } catch { /* noop */ }
  }, [notifications]);

  // Flatten all companies
  const allCompanies = useMemo<Company[]>(() => {
    const arr: Company[] = [];
    Object.values(IPO_DATA).forEach((companies) => arr.push(...companies));
    return arr;
  }, []);

  const notifCount = useMemo(
    () =>
      Object.values(notifications).filter((n) => Object.values(n).some(Boolean)).length,
    [notifications]
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleOnboard = (sectors: string[]) => {
    setUserSectors(sectors);
    setOnboarded(true);
  };

  const toggleFav = (company: Company) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === company.id);
      if (exists) return prev; // already in, don't duplicate
      return [...prev, company];
    });
  };

  const toggleFavFromSector = (company: Company) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === company.id);
      if (exists) return prev.filter((f) => f.id !== company.id);
      return [...prev, company];
    });
  };

  const addToFav = (company: Company) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === company.id)) return prev;
      return [...prev, company];
    });
  };

  const removeFav = (company: Company) => {
    setFavorites((prev) => prev.filter((f) => f.id !== company.id));
  };

  const toggleNotif = (company: Company, notifId?: string) => {
    if (notifId) {
      setNotifications((prev) => ({
        ...prev,
        [company.id]: {
          ...(prev[company.id] ?? {}),
          [notifId]: !prev[company.id]?.[notifId],
        },
      }));
    } else {
      // Toggle all default notifs on/off
      setNotifications((prev) => {
        const existing = prev[company.id];
        const anyOn = existing && Object.values(existing).some(Boolean);
        if (anyOn) {
          const cleared = { ...prev };
          delete cleared[company.id];
          return cleared;
        }
        return { ...prev, [company.id]: { day_of: true, day_before: true } };
      });
    }
  };

  const pushScreen = (entry: StackEntry) => setStack((s) => [...s, entry]);
  const popScreen = () => setStack((s) => s.slice(0, -1));

  const handleTabChange = (newTab: TabId) => {
    setStack([]); // clear navigation stack on tab change
    setTab(newTab);
  };

  // ── Navigation stack rendering ────────────────────────────────────────────
  const renderStack = () => {
    if (stack.length === 0) return null;
    const top = stack[stack.length - 1];

    if (top.type === 'sector') {
      return (
        <SectorScreen
          sector={top.sector}
          ipoData={IPO_DATA}
          favorites={favorites}
          notifications={notifications}
          onBack={popScreen}
          onCompanyPress={(c) => pushScreen({ type: 'company', company: c })}
          onToggleFav={toggleFavFromSector}
          onToggleNotif={toggleNotif}
        />
      );
    }

    if (top.type === 'company') {
      return (
        <CompanyScreen
          company={top.company}
          favorites={favorites}
          notifications={notifications}
          onBack={popScreen}
          onToggleFav={toggleFav}
          onToggleNotif={toggleNotif}
        />
      );
    }

    return null;
  };

  // ── Tab content ───────────────────────────────────────────────────────────
  const renderTab = () => {
    switch (tab) {
      case 'dashboard':
        return (
          <DashboardScreen
            sectors={userSectors}
            favorites={favorites}
            notifications={notifications}
            ipoData={IPO_DATA}
            onSectorPress={(s: Sector) => pushScreen({ type: 'sector', sector: s })}
            onCompanyPress={(c: Company) => pushScreen({ type: 'company', company: c })}
            onToggleFav={toggleFavFromSector}
          />
        );
      case 'calendar':
        return (
          <CalendarScreen
            sectors={userSectors}
            ipoData={IPO_DATA}
            onCompanyPress={(c: Company) => pushScreen({ type: 'company', company: c })}
          />
        );
      case 'watchlist':
        return (
          <FavoritesScreen
            favorites={favorites}
            allCompanies={allCompanies}
            onCompanyPress={(c: Company) => pushScreen({ type: 'company', company: c })}
            onRemoveFav={removeFav}
            onAddFav={addToFav}
          />
        );
      case 'portfolio':
        return <PortfolioScreen favorites={favorites} />;
      case 'explore':
        return (
          <ExploreScreen
            sectors={userSectors}
            ipoData={IPO_DATA}
            onSectorPress={(s: Sector) => pushScreen({ type: 'sector', sector: s })}
            onCompanyPress={(c: Company) => pushScreen({ type: 'company', company: c })}
            onAddCustom={addToFav}
          />
        );
      default:
        return null;
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (!onboarded) {
    return (
      <div className="app-shell">
        <OnboardingScreen onDone={handleOnboard} />
      </div>
    );
  }

  const stackContent = renderStack();

  return (
    <div className="app-shell">
      {/* Main content area */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Tab content — always rendered but hidden behind stack if needed */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            visibility: stackContent ? 'hidden' : 'visible',
            pointerEvents: stackContent ? 'none' : 'auto',
          }}
        >
          {renderTab()}
        </div>

        {/* Stack overlay */}
        {stackContent && (
          <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', zIndex: 10 }}>
            {stackContent}
          </div>
        )}
      </div>

      {/* Tab bar */}
      <TabBar active={tab} onTab={handleTabChange} notifCount={notifCount} />
    </div>
  );
};

export default App;

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SECTORS } from './data';
import type { Company, Sector, NotificationsState, StackEntry, TabId, AppSettings } from './types';
import { fetchMultipleSectors, fetchSectorCompanies, clearCacheForSector } from './lib/ipoData';

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
import SettingsScreen from './screens/SettingsScreen';
import LoadingScreen from './screens/LoadingScreen';

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v != null ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

const DEFAULT_SETTINGS: AppSettings = {
  accentColor: '#D4A843',
  lightMode: false,
  showHypeMeter: true,
  compactCards: false,
};

const App: React.FC = () => {
  const [onboarded, setOnboarded] = useState<boolean>(() => load('fsb_onboarded', false));
  const [userSectors, setUserSectors] = useState<string[]>(() => load('fsb_sectors', []));
  const [favorites, setFavorites] = useState<Company[]>(() => load('fsb_favorites', []));
  const [notifications, setNotifications] = useState<NotificationsState>(() => load('fsb_notifications', {}));
  const [settings, setSettings] = useState<AppSettings>(() => load('fsb_settings', DEFAULT_SETTINGS));
  const [tab, setTab] = useState<TabId>('dashboard');
  const [stack, setStack] = useState<StackEntry[]>([]);

  // Live IPO data fetched from Ollama, keyed by sectorId
  const [ipoData, setIpoData] = useState<Record<string, Company[]>>({});
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [loadingError, setLoadingError] = useState<string>('');

  // ── Persist ────────────────────────────────────────────────────────────────
  useEffect(() => { try { localStorage.setItem('fsb_onboarded', JSON.stringify(onboarded)); } catch { /* noop */ } }, [onboarded]);
  useEffect(() => { try { localStorage.setItem('fsb_sectors', JSON.stringify(userSectors)); } catch { /* noop */ } }, [userSectors]);
  useEffect(() => { try { localStorage.setItem('fsb_favorites', JSON.stringify(favorites)); } catch { /* noop */ } }, [favorites]);
  useEffect(() => { try { localStorage.setItem('fsb_notifications', JSON.stringify(notifications)); } catch { /* noop */ } }, [notifications]);
  useEffect(() => { try { localStorage.setItem('fsb_settings', JSON.stringify(settings)); } catch { /* noop */ } }, [settings]);

  // ── Apply theme from settings ──────────────────────────────────────────────
  useEffect(() => {
    const r = document.documentElement;
    const c = settings.accentColor;
    r.style.setProperty('--gold', c);
    r.style.setProperty('--gold-dim', c + '26');
    r.style.setProperty('--gold-glow', c + '59');
    r.style.setProperty('--border-gold', c + '40');
    r.style.setProperty('--gold-light', c);

    if (settings.lightMode) {
      r.style.setProperty('--bg', '#F5F4F0');
      r.style.setProperty('--bg2', '#ECEAE4');
      r.style.setProperty('--bg3', '#E4E2DC');
      r.style.setProperty('--bg4', '#D8D6D0');
      r.style.setProperty('--surface', '#FFFFFF');
      r.style.setProperty('--surface2', '#F0EEE8');
      r.style.setProperty('--border', 'rgba(0,0,0,0.08)');
      r.style.setProperty('--text', '#18181A');
      r.style.setProperty('--text2', '#5A5868');
      r.style.setProperty('--text3', '#9A9898');
    } else {
      r.style.setProperty('--bg', '#0D0D0F');
      r.style.setProperty('--bg2', '#13131A');
      r.style.setProperty('--bg3', '#1A1A24');
      r.style.setProperty('--bg4', '#22222F');
      r.style.setProperty('--surface', '#1E1E2A');
      r.style.setProperty('--surface2', '#252535');
      r.style.setProperty('--border', 'rgba(255,255,255,0.07)');
      r.style.setProperty('--text', '#F0EFE8');
      r.style.setProperty('--text2', '#9A9898');
      r.style.setProperty('--text3', '#5A5868');
    }
  }, [settings.accentColor, settings.lightMode]);

  // ── Load IPO data for a sector (with cache) ────────────────────────────────
  const loadSector = useCallback(async (sectorId: string) => {
    if (ipoData[sectorId]) return; // already loaded
    try {
      const companies = await fetchSectorCompanies(sectorId);
      setIpoData((prev) => ({ ...prev, [sectorId]: companies }));
    } catch (err) {
      console.error('Failed to load sector', sectorId, err);
    }
  }, [ipoData]);

  // ── On onboarding complete: fetch all selected sectors ─────────────────────
  const handleOnboard = async (sectors: string[]) => {
    setUserSectors(sectors);
    setLoadingError('');
    setLoadingMessage('Fetching IPO data for your sectors...');
    try {
      await fetchMultipleSectors(sectors, (sectorId, done, total) => {
        const label = SECTORS.find((s) => s.id === sectorId)?.label ?? sectorId;
        setLoadingMessage(`Loading ${label}... (${done}/${total})`);
        // Update ipoData incrementally so dashboard shows as each sector loads
        fetchSectorCompanies(sectorId).then((companies) => {
          setIpoData((prev) => ({ ...prev, [sectorId]: companies }));
        });
      });
      setOnboarded(true);
      setLoadingMessage('');
    } catch (err) {
      setLoadingError(
        'Could not connect to Ollama. Make sure Ollama is running (ollama serve) and llama3.2 is installed (ollama pull llama3.2).'
      );
      setLoadingMessage('');
    }
  };

  // ── Load data for sectors already onboarded (on app start) ────────────────
  useEffect(() => {
    if (!onboarded || userSectors.length === 0) return;
    userSectors.forEach((sectorId) => {
      if (!ipoData[sectorId]) {
        fetchSectorCompanies(sectorId)
          .then((companies) => setIpoData((prev) => ({ ...prev, [sectorId]: companies })))
          .catch(() => {/* show stale or empty gracefully */});
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboarded, userSectors.join(',')]);

  // ── Flatten all loaded companies for search ────────────────────────────────
  const allCompanies = useMemo<Company[]>(() => {
    return Object.values(ipoData).flat();
  }, [ipoData]);

  const notifCount = useMemo(
    () => Object.values(notifications).filter((n) => Object.values(n).some(Boolean)).length,
    [notifications]
  );

  // ── Handlers ───────────────────────────────────────────────────────────────
  const toggleFav = (company: Company) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === company.id)) return prev;
      return [...prev, company];
    });
  };

  const toggleFavFromSector = (company: Company) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === company.id);
      return exists ? prev.filter((f) => f.id !== company.id) : [...prev, company];
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
        [company.id]: { ...(prev[company.id] ?? {}), [notifId]: !prev[company.id]?.[notifId] },
      }));
    } else {
      setNotifications((prev) => {
        const anyOn = prev[company.id] && Object.values(prev[company.id]).some(Boolean);
        if (anyOn) {
          const cleared = { ...prev };
          delete cleared[company.id];
          return cleared;
        }
        return { ...prev, [company.id]: { day_of: true, day_before: true } };
      });
    }
  };

  const toggleSector = (sectorId: string) => {
    setUserSectors((prev) => {
      if (prev.includes(sectorId)) return prev.filter((s) => s !== sectorId);
      // Load data for newly followed sector
      loadSector(sectorId);
      return [...prev, sectorId];
    });
  };

  const refreshSector = async (sectorId: string) => {
    clearCacheForSector(sectorId);
    setIpoData((prev) => { const next = { ...prev }; delete next[sectorId]; return next; });
    const companies = await fetchSectorCompanies(sectorId);
    setIpoData((prev) => ({ ...prev, [sectorId]: companies }));
  };

  const updateSettings = (patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  const pushScreen = (entry: StackEntry) => setStack((s) => [...s, entry]);
  const popScreen = () => setStack((s) => s.slice(0, -1));

  const handleTabChange = (newTab: TabId) => {
    setStack([]);
    setTab(newTab);
  };

  // ── Navigation stack ───────────────────────────────────────────────────────
  const renderStack = () => {
    if (stack.length === 0) return null;
    const top = stack[stack.length - 1];

    if (top.type === 'sector') {
      return (
        <SectorScreen
          sector={top.sector}
          ipoData={ipoData}
          favorites={favorites}
          notifications={notifications}
          settings={settings}
          onBack={popScreen}
          onCompanyPress={(c) => pushScreen({ type: 'company', company: c })}
          onToggleFav={toggleFavFromSector}
          onToggleNotif={toggleNotif}
          onRefresh={refreshSector}
        />
      );
    }

    if (top.type === 'company') {
      return (
        <CompanyScreen
          company={top.company}
          favorites={favorites}
          notifications={notifications}
          settings={settings}
          onBack={popScreen}
          onToggleFav={toggleFav}
          onToggleNotif={toggleNotif}
        />
      );
    }

    if (top.type === 'settings') {
      return (
        <SettingsScreen
          settings={settings}
          onBack={popScreen}
          onUpdate={updateSettings}
        />
      );
    }

    return null;
  };

  // ── Tab content ────────────────────────────────────────────────────────────
  const renderTab = () => {
    switch (tab) {
      case 'dashboard':
        return (
          <DashboardScreen
            sectors={userSectors}
            favorites={favorites}
            ipoData={ipoData}
            settings={settings}
            onSectorPress={(s: Sector) => pushScreen({ type: 'sector', sector: s })}
            onCompanyPress={(c: Company) => pushScreen({ type: 'company', company: c })}
            onToggleFav={toggleFavFromSector}
            onSettingsPress={() => pushScreen({ type: 'settings' })}
          />
        );
      case 'calendar':
        return (
          <CalendarScreen
            sectors={userSectors}
            ipoData={ipoData}
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
            allSectors={SECTORS}
            ipoData={ipoData}
            onSectorPress={(s: Sector) => pushScreen({ type: 'sector', sector: s })}
            onCompanyPress={(c: Company) => pushScreen({ type: 'company', company: c })}
            onAddCustom={addToFav}
            onToggleSector={toggleSector}
          />
        );
      default:
        return null;
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (!onboarded || loadingMessage) {
    return (
      <div className="app-shell">
        {loadingMessage || loadingError ? (
          <LoadingScreen
            message={loadingMessage}
            error={loadingError}
            onRetry={loadingError ? () => { setLoadingError(''); setOnboarded(false); } : undefined}
          />
        ) : (
          <OnboardingScreen onDone={handleOnboard} />
        )}
      </div>
    );
  }

  const stackContent = renderStack();

  return (
    <div className="app-shell">
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div
          style={{
            position: 'absolute', inset: 0,
            visibility: stackContent ? 'hidden' : 'visible',
            pointerEvents: stackContent ? 'none' : 'auto',
          }}
        >
          {renderTab()}
        </div>
        {stackContent && (
          <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', zIndex: 10 }}>
            {stackContent}
          </div>
        )}
      </div>
      <TabBar active={tab} onTab={handleTabChange} notifCount={notifCount} />
    </div>
  );
};

export default App;

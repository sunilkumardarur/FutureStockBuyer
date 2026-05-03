# Future Stock Buyer — Build Progress

## Status: SCAFFOLD COMPLETE — TypeScript compiles clean (tsc --noEmit passes, 0 errors)

## What was done in this session

### Full Vite + React 18 + TypeScript project scaffolded at:
`D:\AI Projects\FutureStockBuyer\app\`

### Files created (all complete):

#### Config / root
- `app/package.json` — deps: react, react-dom, typescript, vite, @vitejs/plugin-react
- `app/vite.config.ts`
- `app/tsconfig.json`
- `app/index.html`

#### Source
- `app/src/main.tsx` — ReactDOM.createRoot entry
- `app/src/App.tsx` — Root component: state management (onboarded, userSectors, favorites, notifications, tab, stack), localStorage persistence, navigation stack (push/pop), tab routing, all handlers
- `app/src/types.ts` — All TypeScript interfaces: Sector, Company, CompanyStatus, NotificationType, NotificationsState, StackEntry, TabId
- `app/src/data.ts` — Full TypeScript conversion of data.js: SECTORS (18), IPO_DATA (all 18 sectors, ~90 companies), NOTIFICATION_TYPES, EXAMPLE_FAVORITES, EXAMPLE_SECTORS, EXAMPLE_NOTIFICATIONS
- `app/src/lib/claude.ts` — claudeComplete() stub with TODO for Anthropic API key

#### Styles
- `app/src/styles/globals.css` — CSS variables (dark theme, gold accent), reset, scrollbar, .app-shell (390px max-width, centered)

#### Shared components (`app/src/components/shared/`)
- `Icon.tsx` — SVG icon component (home, search, bell, star, plus, x, back, trend_up, trend_down, chart, settings, check, info, fire, clock, grid, layers, bookmark, trash)
- `StatusBadge.tsx` — Colored badge for all 7 statuses
- `ConfidenceBar.tsx` — Progress bar with color threshold (gold≥75, blue≥50, gray<50)
- `HypeMeter.tsx` — 5 rising bars
- `IPOCountdown.tsx` — Days/months until etaDate using real Date.now()
- `TabBar.tsx` — 5 tabs (Home/Calendar/Watchlist/Portfolio/Explore) with notification badge

#### Screens (`app/src/screens/`)
- `OnboardingScreen.tsx` — Welcome splash + 3-col sector grid selector, 2-step flow
- `DashboardScreen.tsx` — Header, watchlist horizontal strip, per-sector top-5 ranked rows with gold/silver/bronze/blue/purple rank badges + inline star button
- `SectorScreen.tsx` — Back button, top-5 ranked cards with confidence/hype/news/tags/bell/star, recently listed section
- `CompanyScreen.tsx` — Status banner, valuation/eta/IPO price/current price grid, AI Intelligence section (calls claudeComplete), latest news, tags, notification toggles, bottom action bar
- `FavoritesScreen.tsx` — Search/add input with live results, listed stocks section (IPO price + current + return), pre-IPO tracking section with trash buttons
- `NotificationsScreen.tsx` — Companies with active alerts, pill toggle per notification type
- `ExploreScreen.tsx` — Search input with cross-sector results, AI company lookup (calls claudeComplete + parses JSON), all sectors 3-col grid
- `CalendarScreen.tsx` — IPOs grouped by month/year (2025–2028) with color-coded left border by status
- `PortfolioScreen.tsx` — Portfolio summary card (cost basis, market value, total P&L), positions with shares/buy-price inputs, actual vs IPO return comparison

## What remains to do next session

### Priority 1 — Verify build
```
cd "D:\AI Projects\FutureStockBuyer\app"
npm run dev        # should start on http://localhost:5173
npm run build      # verify production build
```

### Priority 2 — Real Anthropic API key
- Edit `app/src/lib/claude.ts`
- Uncomment the fetch block
- Set ANTHROPIC_API_KEY
- NOTE: Browser can't call Anthropic API directly due to CORS — will need either:
  a) A Vite proxy in vite.config.ts  
  b) A small Express/Hono proxy server  
  c) Use Anthropic's client SDK with a local proxy

### Priority 3 — Optional polish
- Add slide-in animation for stack pushes (CSS transition on the overlay div in App.tsx)
- Add a "Notifications" tab or move alerts to a dedicated tab (currently alerts are accessible via bell icon on companies, managed in NotificationsScreen which is NOT currently in the tab bar — could swap Portfolio→Alerts or add as a 6th tab, or make the bell icon in DashboardScreen header navigate to Alerts)
- The TabBar currently has: Home, Calendar, Watchlist, Portfolio, Explore. The prototype had the same 5. Alerts are accessible through company screens.
- Add haptic/sound feedback (optional, browser API)
- PWA manifest + service worker for installability

### Priority 4 — Data freshness
- All IPO_DATA in src/data.ts is static (from the prototype's data.js as of ~May 2026)
- Could add an API integration to fetch live IPO news/pricing

## Key design decisions made
- Dark theme, gold accent (#D4A843), DM Sans / DM Mono fonts
- 390px max-width centered, 844px max-height (iPhone form factor)  
- No external UI libraries — pure inline styles matching prototype
- Navigation: stack-based overlay (not React Router), tab bar always visible
- State: React useState + localStorage persistence (keys: fsb_onboarded, fsb_sectors, fsb_favorites, fsb_notifications)
- TypeScript strict mode, zero type errors

## Git
- Repo should be initialized at `D:\AI Projects\FutureStockBuyer\`
- Remote: push to user's GitHub (sunildarur@gmail.com)

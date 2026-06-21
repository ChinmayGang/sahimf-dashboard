# SahiMF — Mutual Fund Research & Portfolio Intelligence

> A SEBI-registered, fee-only Research Analyst platform for direct mutual fund investing. Zero commissions. Always.

**Live:** https://sahimf-dashboard.vercel.app  
**GitHub:** https://github.com/ChinmayGang/sahimf-dashboard

---

## What is SahiMF?

SahiMF (*Kaunsa Mutual Fund Sahi Hai?*) is the flagship product of **Arqentis Financial Technologies**. It is a mutual fund research and portfolio intelligence dashboard for Indian retail investors who want to invest in direct mutual funds without commission bias.

Key principles:
- **Fee-only research** — SahiMF charges clients directly. No trail commissions, no upfront fees from AMCs.
- **Direct plans only** — Never regular plans. Lower expense ratios, better long-term returns.
- **SEBI RA compliant** — All tools and content comply with SEBI Research Analyst regulations (rank, research, alert, compare — no personalised advice, no execution, no portfolio management).
- **Hindi + English** — Built for Bharat, not just English-speaking metros.

> **NO COMMISSION RECEIVED FROM ANY INDIAN MUTUAL FUND HOUSES, EVER.**

---

## Demo Personas

The app ships with 3 pre-authenticated personas to showcase all product states:

| Persona | Plan | Portfolio | Shows |
|---------|------|-----------|-------|
| **Aryan** | Free | 0 investments | Empty states, upload CAS CTAs, PRO gate overlays |
| **Priya** | Free | 1 fund | Single-fund nudges, partial data, upgrade hooks |
| **Rohit** | PRO | 3 portfolios | Full analytics, Overlap Lens, benchmark charts, exports |

Switch between personas from the profile card in the sidebar.

---

## Features

### Auth
- **Login** — Phone/email + OTP split layout (dark panel + light panel)
- **OTP Verification** — 6-digit input with resend countdown, checker-pattern background
- **Create Profile** — Onboarding form (name, PAN, risk preference)
- **Initialize Portfolio** — Portfolio setup wizard with CAS import prompt

### Portfolio Management
- **MF Overview** — Portfolio value hero with AreaChart (2Y / 1Y / 6M / All), asset allocation pie, market indices ticker (NIFTY 50, SENSEX), 4 stat cards, trending opportunities cards, SahiMF basket CTA
- **Portfolio XIRR vs Benchmark** — Per-portfolio XIRR compared against Nifty 50 3Y CAGR with alpha chip
- **Sector Spread** — Horizontal bar breakdown of sector exposure per portfolio, deep-links to Overlap Lens
- **My Portfolios** — Portfolio cards with current value, XIRR, category tags; bar chart comparison
- **Holdings Ledger** — Fund-level drill-down: units, avg NAV, current NAV, invested, current value, gain/loss, XIRR
- **Transactions** — Full transaction history (SIP / Lumpsum / Redemption / Switch) with status badges and date/type filters

### Explore Mutual Funds
- **Explore Funds** — Hero banner, search bar, quick filter tags; accordion sidebar (Sahi, Trending, New Launches, Most Popular, Top by AMC, High Reward/Risk, ELSS, Index); fund grid with plan-gated 3Y/5Y returns; upgrade teaser
- **All Schemes** — Tab toggle (Open Schemes ↔ Sahi Funds); filter panel (category tree, volatility, expense ratio slider, AMC list); sortable table; Sahi Funds grid with "Best Choice" badge
- **My Sahi Funds** — Active baskets with allocation pie charts, multi-period returns, XIRR, rebalance notice
- **Sahi Fund Detail** — Performance tabs, methodology, holdings distribution donut, fund weights table

### Research
- **Sahi Research Card** — Appears on Scheme Detail; shows verdict (Research Pick / Watchlist / Under Review), Sahi Score, 120-char summary free; full strengths/concerns/analyst note PRO-gated
- **MF Scorecard** — SahiMF's proprietary 5-dimension scoring (Returns 35% / Consistency 25% / Risk 20% / Manager 10% / Cost 10%), grade A+ to C, Sahi Score bars, PRO gate on full breakdown
- **Scheme Detail** — NAV chart with Nifty 50 dashed benchmark line, live alpha chip, key metrics, holdings pie, peers carousel
- **Fund Manager / AMFI** — AMC profiles, manager bios, AUM bar chart, fund list per AMC

### Analysis
- **Peer Fund Suggestions** — Appears on Portfolio Detail when any holding underperforms its category threshold; suggests peer funds by category with Sahi Score and Compare link (first peer free, extras PRO-gated)
- **Overlap Lens** — Dynamic fund picker (2–10 funds); smart layout: matrix view (≤8 funds) or worst-pairs ranked list (>8 funds); 3 tabs: **Stock Overlap** (matrix + common holdings table), **Sector Exposure** (bars vs Nifty 50 reference line, diff chips), **AMC Concentration** (flags >40% single-house risk); cross-link to Fund Comparison on high-overlap pairs
- **Fund Comparison** — Up to 4 funds side-by-side; Nifty 50 dashed benchmark on the performance chart (always visible, not gated); alpha row in metrics table; best-in-class highlight (★)
- **Risk Analysis** — SVG Riskometer gauge (6-level SEBI scale), risk-return scatter bubble chart (circles sized by allocation %), PRO-gated Stress Test scenarios (2008 crisis / COVID / rate hike)
- **Market Cap Allocation** — Portfolio market cap mix breakdown with PageHeroBanner

### Tools
- **SIP / Lumpsum / SWP / STP Calculators** — Input panel with AreaChart projection + returns summary

### Reports
- **Dividends (IDCW)** — Dividend announcement lookup, filters by frequency and type, SEBI IDCW nomenclature note
- **Tax Report** — STCG / LTCG breakdown by financial year (Budget 2024 rates: 20% STCG / 12.5% LTCG), PRO-gated
- **MFPMS Disclosures** — SEBI regulatory document library; zero-commission declaration banner

---

## UI / Design System

### Design Tokens (from Figma)

| Token | Value |
|-------|-------|
| Primary accent | `#d6fd70` (lime) |
| Brand purple | `#8c34ee` |
| App background (light) | `#F5F4FF` |
| App background (dark) | `#0a0c0e` |
| Card (dark) | `#14171c` |
| Sidebar | Always dark `#0a0c0e` (both modes) |
| Border | `#1e2838` |
| Text primary | `#111827` / `#ffffff` |
| Text secondary | `#6B7280` / `#8390a2` |
| Font | Geist (400 / 500 / 600 / 700) |
| Width | 1280px max |

### Sidebar
- Always dark (`#0a0c0e`) regardless of light/dark mode
- Full-height edge-click strip to expand/collapse — hover shows indigo indicator line + caret pill
- Collapsed: icon-only with Radix Tooltip popovers
- Expanded: profile card (name + plan badge + toggle) at top, full nav tree with collapsible sub-items

### Plan Gating
`<PlanGate>` component — blurs content, shows lock icon + upgrade CTA. Content is always rendered (never hidden) — blur only. Used on: Sahi Fund returns, Overlap Lens for new users, Comparison chart, MF Scorecard details, Tax Report, 3Y/5Y returns.

---

## Plan Tiers

| Feature | Free | Sahi PRO (₹1,999/yr) | Sahi Wealth |
|---------|------|----------------------|-------------|
| Overview dashboard | Basic | Full XIRR + benchmark | Full |
| Portfolios | 1 | Up to 5 | Unlimited |
| Holdings / Transactions | ✓ | ✓ | ✓ |
| Search / Explore Schemes | ✓ | ✓ | ✓ |
| 3Y / 5Y returns | Blurred | ✓ | ✓ |
| Sahi Fund returns / weights | Locked | ✓ | ✓ |
| Overlap Lens | Demo only | ✓ Full | ✓ Full |
| Fund Comparison chart | Locked | ✓ (3 funds) | ✓ (4 funds) |
| MF Scorecard | Preview | ✓ Full | ✓ Full |
| Benchmark comparison (alpha) | ✓ Teaser | ✓ Full | ✓ Full |
| Tax Report | Locked | ✓ | ✓ |
| Export / Download | Locked | ✓ | ✓ |

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`, `@theme {}` — no config file) |
| Icons | **Phosphor Icons** (`@phosphor-icons/react`) — duotone weight default |
| Charts | Recharts (AreaChart, PieChart, BarChart) |
| Headless UI | Radix UI (Tooltip, Dialog, Tabs) |
| State | Zustand (`authStore`, `uiStore`) |
| Routing | React Router v7 |
| Font | Geist (`@fontsource/geist`) |
| Deployment | Vercel (auto-deploy from `main`) |

---

## Project Structure

```
src/
├── assets/                    # hero images, logo, background assets
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx       # root shell — sidebar + topbar + outlet
│   │   ├── Sidebar.tsx        # always-dark sidebar, full-height edge toggle
│   │   └── Topbar.tsx         # topbar with CAS sync, theme toggle, persona switcher
│   └── ui/
│       ├── PlanGate.tsx       # blur/lock overlay for plan gating
│       ├── VolatilityBadge.tsx
│       ├── PlanBadge.tsx
│       ├── StatCard.tsx
│       └── EmptyState.tsx
├── data/                      # mock data (no backend required)
│   ├── funds.ts               # 20+ open scheme records + getMockNavData()
│   ├── sahiFunds.ts           # SahiMF curated baskets
│   ├── portfolios.ts          # 3 portfolios (mapped to Aryan/Priya/Rohit)
│   ├── transactions.ts
│   ├── amcs.ts
│   ├── dividends.ts
│   └── users.ts               # 3 demo personas
├── pages/
│   ├── auth/                  # Login, OTP, CreateProfile, InitializePortfolio
│   ├── overview/              # MF Overview (persona-aware dashboard)
│   ├── portfolios/            # Portfolios, PortfolioDetail, Transactions
│   ├── sahifunds/             # ExploreFunds, AllSchemes, MySahiFunds, SahiFundDetail
│   ├── research/              # MFScorecard, FundManager, SchemeDetail
│   ├── analysis/              # OverlapLens (rebuilt), FundComparison
│   ├── tools/                 # Calculator (SIP / Lumpsum / SWP / STP)
│   ├── reports/               # Dividends, TaxReport, MFPMSDisclosures
│   └── settings/              # Account settings
├── stores/
│   ├── authStore.ts           # user session, plan tier, persona switching
│   └── uiStore.ts             # sidebar expand/collapse, lightMode toggle
├── types/                     # TypeScript interfaces (User, Fund, Portfolio, etc.)
public/
└── icons/schemes/             # origami animal SVG icons for fund cards
```

---

## Running Locally

```bash
# Clone
git clone https://github.com/ChinmayGang/sahimf-dashboard.git
cd sahimf-dashboard

# Install
npm install

# Dev server
npm run dev
# → http://localhost:5173

# Production build
npm run build
```

Requires Node.js 18+. No environment variables needed — all data is mocked. The app opens pre-authenticated as **Rohit (Sahi PRO)** so all features are immediately accessible. Switch persona from the profile card in the sidebar.

---

## SEBI Compliance Notes

- All content is generic research — no personalized investment advice (SEBI RA scope only)
- SEBI disclaimer appears on all returns-bearing pages
- Plan gating uses blur overlays — content is always rendered, never hidden
- MFPMS Disclosures page lists all regulatory documents
- Zero-commission declaration enforced across all product surfaces
- Riskometer uses SEBI's 6-level standard: Low / Low-Moderate / Moderate / Moderately High / High / Very High

---

## Roadmap

- [x] Risk Analysis page (Riskometer, scatter, stress test)
- [x] Sahi Research Card on Scheme Detail
- [x] Peer fund suggestions on Portfolio Detail
- [x] PageHeroBanner on analysis pages
- [x] Full light mode audit — all pages lm-conditional
- [ ] SahiMF Baskets as Goals — landing page, goal tracker, invest funnel
- [ ] Smarter PRO gates — partial reveal + teaser stats (not full blur)
- [ ] Legal disclaimer footer across all pages
- [ ] Portfolio health score (A/B/C grade)
- [ ] CAS import — CAMS / KFintech statement parsing
- [ ] Live NAV data — AMFI open API integration
- [ ] Mobile-responsive layout

---

## Status — UX Polish Pass (June 2026)

This pass worked through a detailed 40-point design review + ongoing session fixes. Status below.

### Done ✅

**Reusable components / global**
- `AnimatedBorderCard` — animated top-rail rotating gradient strip (4px, `#8c34ee → #4f46e5 → #d6fd70 → #06b6d4`) + "SAHI RESEARCH" pill badge pinned top-right. Used on FundComparison Sahi Comparison panels.
- `PremiumPlanCard` — dark plan card with an animated rotating light-beam border
- `ProButton` rebuilt on a shared `.glow-btn` with full active/hover/focus/disabled states — single source of truth for all upgrade buttons
- `UpgradePopup` (Radix dialog) wired to `PlanGate` and `ProTrialBanner` upgrade buttons
- Persistent `useWatchlistStore` — hearts work app-wide and survive reload
- `RankBadge` + `ordinal()` — 5-tier color system with custom rank cards (not PNGs), correct ordinals
- Custom dropdown caret + light-mode scrollbars
- SEBI registration number removed from all surfaces (Pricing, Baskets, Topbar)
- Plan tier renamed: `elite → wealth` globally (`types/index.ts`, `usePlan.ts`, `PlanBadge`, `PlanGate`, `UpgradePopup`, `Pricing`, `Sidebar`, `Overview`)
- Nav restructured: Home + Investments pages removed; Mutual Funds dropdown flattened to direct sidebar items

**Overview**
- Portfolio summary & first-time CTA cards → solid `#4F46E5`, gradient `135deg #4f46e5→#4338ca`; all text white via `bg-[#4f46e5]` class (bypasses index.css override)
- "Quick Invest" section (renamed from "Sahi Research Picks") — lime Invest buttons with monthly SIP amount
- Market status pill (green/red shaded, ping dot) with IST-hours tooltip
- Watchlist hearts active by default; heart toggle on fund cards

**Research / Scorecard**
- `MFScorecard` — full expanded-row rewrite: `ScorecardRow` component with local open state. Left: Sahi Sabh-scales dim bars (6 dimensions). Centre: `RadarChart` 6-axis spider (Recharts). Right: top holdings weight bars. Full-width: Sahi Analysis + chips + verdict + SEBI Audit-Trail + "Deep-Analyze Fund" CTA. Category filter pills with correct `text-[#ffffff]` active state.
- `SchemeDetail` rank cards — 5-tier color system (`RANK_TIER` map): Rank 1 green shine/glow, Rank 2 orange, Rank 3 slate, Rank 4 amber, 60px badge, `rounded-2xl`, winner banners.
- `SchemeDetail` Riskometer — all 3 arcs (green/amber/red) always colored; active = opacity 1, inactive = opacity 0.4. No more grey-out on "High" risk segment.

**Analysis**
- `FundComparison` — per-tab `sahiComparison()` plain-English panel in `AnimatedBorderCard` above tab content. "Add Fund" button hover fixed in light mode (indigo, not neon).
- `MarketCapAllocation` — Rebalance simulator sliders: removed `appearance-none` (was hiding the track). Added Sahi research note (50% Large / 30% Mid / 20% Small rationale) above sliders.
- `OverlapLens` — all section heading labels `#111827 uppercase`.

**Pages / layout**
- `ExploreFunds` — sidebar section buttons `outline-none focus:outline-none`; inactive hero filter tags `text-[#ffffff]` (bypasses index.css); "Sahi MF Funds" → "Sahi Picks"
- `Portfolios` — bar chart lime → `#65a30d` in light mode; chart tick, legend, arrow hover colors fixed
- `Login` — flag emoji removed from phone prefix
- `VolatilityBadge` — bg opacity `/15 → /20`, darker text per risk level

**Known footgun documented**
- `src/index.css:231` global rule: `[data-theme="light"] .text-white { color: #18181B !important }` overrides white text on dark bg elements. Workaround used everywhere: `text-[#ffffff]` (arbitrary class, not targeted by rule). Task #11: harden this selector (pending).

**Batch 6 — Sahi Funds / Baskets / Goals (done)**
- `MySahiFunds`: no card pre-selected (`activeIdx -1`) so all cards share the same neutral→indigo-border hover (#16)
- `SahiFundDetail`: subscriber deep view for owned baskets — SIP tracker + alpha chip, next-rebalance countdown, rebalance-history timeline; non-owners get a "Start investing" CTA (#17)
- `Baskets`: "Set your first goal" empty state; ExploreFunds hover pattern + solid `#4f46e5` View Details buttons (#19/#20)
- `Goals`: predefined goal tabs → white/`#4f46e5` border+text/`#EEF2FF` hover; all section headings `#111827` (#36)

**Batch 7 — New pages / tools / reports (done)**
- `ProButton` wired into `UpgradePopup` ("Unlock with Sahi PRO" + "See all plan details →") and `PlanGate` full CTA (#14 partial)
- `Calculator`: merged tabbed page — SIP / Lumpsum / SWP / STP / What-If segmented control (`?tab=` URL sync), SWP + STP formulas, embedded `<SIPWhatIf>`; sidebar collapsed to one "SIP Calculator" item (#34)
- `MarketCapAllocation`: zero-investment guidance gate, Sahi Analysis moved above fund table, filled-track pill rebalance sliders, `#111827` headings (#31)
- `RiskAnalysis`: zero-investment guidance gate, `<AnimatedBorderCard>` Sahi Insight panel (#32); bubble hover fixed with React state tooltip (Session 3)
- `TaxReport` → "Tax Optimizer": empty state, LTCG/STCG gains doughnut + 12-month holding-period graphic
- `Reports & Disclosures`: emoji glyphs → Phosphor icons; "Investment Adviser" → "Research Analyst" (RA-only brand)
- `/pricing` confirmed full-screen (no sidebar), Free / PRO / Wealth tiers

**Session 3 — Dark mode sweep + bug fixes (June 2026)**
- `DS-10 hover states` — 5 text-link buttons missing hover: Overview.tsx ×4, MFScorecard.tsx, SchemeDetail.tsx → all use `hover:opacity-75 transition-opacity`
- `Dark mode — SchemeDetail rank cards` — `RANK_TIER` map now `lm`-conditional for `tintBg`, `tintBorder`, `color` values
- `Dark mode — AnimatedBorderCard badge` — "SAHI RESEARCH" pill badge color + bg now `lm`-conditional (indigo in light, lime in dark)
- `Dark mode — Goals alert banner` — Shortfall/surplus banner `background`/`border` + inner text now theme-aware
- `Dark mode — OverlapLens section labels` — Fixed via Edit tool after PowerShell encoding corruption was recovered (`git restore`)
- `Dark mode — RiskAnalysis Sahi Risk Insight` — Hardcoded `#111827` text → `${text}` token
- `Dark mode — MFScorecard "Sahi Sabh-scales" label` — `text-[#111827]` → `${text}`
- `Encoding rule` — PowerShell `Set-Content` corrupts UTF-8 multi-byte chars (em dash → `â€"`). Rule: NEVER use PowerShell for file edits — always use the Edit tool.
- `RiskAnalysis scatter hover` — Replaced unreliable SVG `<title>` with React `useState` tooltip: fund name + allocation % + XIRR + volatility shown on hover

### Pending ⏳

**Still open**

- DS-2 Global CSS color tokens (big refactor)
- DS-3 Button.tsx — unified component + replace all raw buttons
- DS-6 Card.tsx hierarchy
- DS-9 Page header icon standardization (Baskets, OverlapLens, RiskAnalysis, others — all have different styles)
- BF-5 MF Scorecard — needs further review vs original spec
- #13/#37 Global grey→black text sweep across every remaining page
- B2-1 Extract remaining inline buttons into a shared state-driven `<Button>` component
- #28/#29 Unify page container widths + header-card style across all pages
- Batch 8 — Mobile responsive, including bottom nav bar (5 tabs: Overview · My Portfolio · **Explore** [center, highlighted] · Tools [upward sheet] · Profile → Settings) · Batch 9 — Supabase integration
- Task #11 — harden the `index.css` `.text-white` light-mode override

**New TODO — added verbatim (not yet started)**

1. we need to create database with supabase and connect all pages with each other so data, content, user, plan, investments, everthing connected to eachother.
2. we need to make subcribe and plan pages to be access from settings
3. few pages are still not developed in new create account or u have not connected yet, just keep this point in to-do for us to remember
4. we need to fix colors, design styles, design systems, text color, cards design, hover effects and animations and light mode colors and dark mode colors, need to replace all icons to filled one, removing duotones icons, form fields effects, buttons states for each button category like primary, secondary, tieretery, brand text, normal text links everything. Convert cards to components and use them and we need to finalise the card stacks hierrachy also for each have same components.
5. for aryan kapoor, we are showing he has sahi funds investment which should not be possible
6. fix the container size for each page if they are in it. overlap lens has different from others, but we need to check others too
7. sahi basket heading icon style, overlap lens heading icon style, and risk analysis heading icon styles and others, all have different styles
8. *(done)* risk odometer when gets risky has no color, make it red. — **Fixed: all 3 arcs always colored, opacity-based active/inactive.**
9. fix the buttons colors which should be fixed if we succesfully built the point 3 without any errors
10. *(done — scorecard and rebalance slider fixed)* MF scorecard still not designed as i have asked, and same with market cap mis, the rebalance simulator card drag bar not visible. — **Fixed: full scorecard rewrite with radar chart + dim bars + audit trail. Slider track now visible (removed appearance-none).**
11. *(done)* the button which is placed to add more funds is compare page and other pages has hover effect which turns it neon which make it visibility to none. — **Fixed: FundComparison "Add Fund" hover uses indigo in light mode.**
12. Colors for light mode is the major change, if required we need to make the overhaul changes to everyhting and use a global color coded to everything correctly so things stays visible.
13. calculator updates are also not done.
14. whereever u have used the upgrade, upgrade to pro, or upgrade to sahi pro buttons should have that same animated button which u have just created.

---

Built by [Arqentis Financial Technologies](https://arqentis.in) · SEBI RA

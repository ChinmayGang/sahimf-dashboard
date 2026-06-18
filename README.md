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

This pass worked through a detailed 40-point design review. Status below.

### Done ✅

**Reusable components / global**
- Rotating 4-colour conic-gradient border (`.sahi-research-border`) to highlight Sahi Research / Analysis cards (#1, #12)
- `PremiumPlanCard` — dark plan card with an animated rotating light-beam border (#2)
- `ProButton` rebuilt on a shared `.glow-btn` with full active/hover/focus/disabled states — single source of truth for all upgrade buttons (#3, #14)
- `UpgradePopup` (Radix dialog) wired to `PlanGate` and `ProTrialBanner` upgrade buttons
- Persistent `useWatchlistStore` — hearts work app-wide and survive reload (#5)
- `RankBadge` + `ordinal()` — shared rank icons (1st–5th PNGs) and correct ordinals (#11)
- Custom dropdown caret + light-mode scrollbars (#35, partial #37)
- SEBI registration number removed from the top nav (kept only in the legal footer) (#40)

**Overview**
- Portfolio summary & first-time CTA cards → solid `#4F46E5`; research upsell → `#0A0C0E` (#4)
- Brighter text on "Grow your idle money" / "Global shifts" cards (#6)
- Market status pill made prominent (green/red shaded, ping dot) with an IST-hours tooltip 9:15 AM–3:30 PM (#8)
- Watchlist hearts active by default; heart toggle added to fund cards (#5)
- Added 4 more Sahi funds so the showcase scroll is visible (#7)

**Pages**
- My Portfolios: quick-action row (Holdings / Compare / Overlap) per card (#9)
- Explore MF: fixed the black-border flash on section switch (#15)
- Baskets: removed featured ring/Popular focus, hover matches Explore cards, readable risk pills (#19, #20)
- Overlap Lens: stronger pills, darkened gray headings, readable severity pills, sector-bar explainer, white search field, max-5 funds (#21–#26)
- Scheme Detail: rank icons for 1st–5th, only rank 1 tagged, fixed ordinals (#11)
- My Sahi Funds: active/first card now has hover feedback (#16)
- Reports: removed MFPMS PDF section + sub-tab, renamed to "Reports & Disclosures", Tax promoted to its own nav item (#39, #38 partial)
- Pricing: premium animated PRO/Elite cards + simulated purchase flow that returns the user to their previous page (#30)

### Pending ⏳

- #10 Explore tags / search button (already white — verify against latest design)
- #13/#37 Global grey→black text sweep across every remaining page
- #14 Extract remaining buttons into shared state-driven components
- #17 Deeper detail view for *owned* Sahi funds vs scheme preview
- #18 Reframe Sahi Funds as recommendations (schemes), not separate products
- #22 Audit every remaining grey heading project-wide
- #27 Per-tab "Sahi Comparison" insight section in Fund Comparison (PRO, highlighted border)
- #28/#29 Unify page container widths + header-card style across all pages
- #31 Market Cap: free-tier guidance, rebalance simulator UX, remove emoji, move Sahi analysis up
- #32 Risk Analysis: free-tier guidance, bubble-chart tooltips, fill right-side gap with insight
- #33 MF Scorecard: deeper per-fund scorecard analysis on row expand
- #34 Merge SIP What-If into SIP, fix toggle, build Lumpsum/SWP/STP variants
- #36 Goals & Plans: full design-system alignment (tabs, hover, tones)
- Risk-label vocabulary unified to one scale project-wide (Low/Medium/High vs Moderate)
- Mobile responsive (Batch 8) · Supabase integration (Batch 9)

---

Built by [Arqentis Financial Technologies](https://arqentis.in) · SEBI RA

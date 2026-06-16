# SahiMF — Mutual Fund Dashboard

> A SEBI-registered, fee-only investment advisory platform for direct mutual fund investing. Zero commissions. Always.

**Live:** https://sahimf-dashboard.vercel.app  
**GitHub:** https://github.com/ChinmayGang/sahimf-dashboard

---

## What is SahiMF?

SahiMF is a mutual fund research and portfolio management dashboard built under **Arqentis Financial Technologies**. It is designed for Indian investors who want to invest in direct mutual funds without any commission bias.

Key principles:
- **Fee-only advisory** — SahiMF charges clients directly. No trail commissions, no upfront fees from AMCs.
- **Direct plans only** — Never regular plans. Lower expense ratios, better long-term returns.
- **SEBI-registered Investment Adviser** — All tools and content comply with SEBI IA regulations.
- **No personalized recommendations** — All content is generic and educational to stay within SEBI scope.

> **NO COMMISSION RECEIVED FROM ANY INDIAN MUTUAL FUND HOUSES, EVER.**

---

## Screenshots

| Page | Description |
|---|---|
| Explore Funds | Curated hero banner with fund baskets, origami icons, section accordion |
| MF Overview | Portfolio net worth chart, asset allocation donut, stat cards |
| My Portfolios | Portfolio cards with XIRR, bar chart comparison |
| All Schemes | Filter sidebar, sortable table with origami icons per fund |

---

## Features Built

### Auth
- **Login** — Phone/email/OTP split layout (dark panel + light panel)
- **OTP Verification** — 6-digit OTP input with resend countdown, checker-pattern background
- **Create Profile** — Onboarding form for new users
- **Initialize Portfolio** — Portfolio setup wizard

### Portfolio Management
- **MF Overview** — Portfolio value hero with area chart (2Y/1Y/6M/All), asset allocation pie chart, market indices ticker (NIFTY 50, SENSEX), 4 stat cards, Sahi MF CTA banner, quick nav pills
- **My Portfolios** — Portfolio cards with current value, XIRR, category tags; bar chart comparison; plan-gated add flow
- **Holdings Ledger** — Drill-down fund-level holdings: units, avg NAV, current value, gain/loss, XIRR
- **Transactions** — Full transaction history (SIP / Lumpsum / Redemption / Switch) with status badges and date/type filters

### Explore Mutual Funds
- **Explore Funds** (`/mutual-funds/explore`) — Hero banner with custom background image, search bar, quick filter tags; left accordion sidebar with 9 sections (Sahi, Trending, New Launches, Most Popular, Top by AMC, High Reward/Risk, Stable Returns, ELSS, Index); right 2-col fund grid with origami animal icons and colored palette backgrounds; PRO returns locked with blur; upgrade teaser card
- **All Schemes** (`/mutual-funds/explore/all`) — Tab toggle (Open Schemes ↔ Sahi Funds); left filter panel with category tree, volatility checkboxes, expense ratio slider, AMC list; sortable table with origami icons per row; Sahi Funds 2-col grid with "Best Choice" badge
- **My Sahi Funds** — Active baskets with mini allocation pie charts, multi-period returns (1M / 1Y / 3Y), XIRR, rebalance notice
- **Sahi Fund Detail** — Performance tabs, methodology, holdings distribution donut, fund weights table

### Research
- **MF Scorecard** — SahiMF's proprietary 5-dimension fund scoring (Returns 35% / Consistency 25% / Risk 20% / Manager 10% / Cost 10%), grade A+ to C, score bars, PlanGate for full data
- **Fund Manager / AMFI** — AMC profiles with manager bios, AUM ranking bar chart, fund list per AMC
- **Scheme Detail** — NAV chart, key metrics, holdings breakdown, peer comparison carousel

### Analysis
- **Overlap Lens** — Portfolio overlap matrix (color-coded by overlap %) + common stocks cross-fund weight table
- **Fund Comparison** — Side-by-side comparison of up to 4 funds: overlaid performance chart, metrics table with best-in-class highlight, PlanGate for full comparison

### Tools
- **SIP / Lumpsum / SWP / STP Calculators** — Shared calculator layout: inputs on left, AreaChart projection + returns summary on right

### Reports
- **Dividends (IDCW)** — Dividend announcement lookup with filters by frequency and type; SEBI IDCW nomenclature note
- **Tax Report** — STCG / LTCG breakdown by financial year (Budget 2024 rates: 20% / 12.5%), plan-gated
- **MFPMS Disclosures** — SEBI regulatory document library; zero-commission declaration banner

---

## UI / Design System

### Light Mode (Default)
SahiMF defaults to **light mode** with a soft lavender-white palette.

| Token | Light | Dark |
|---|---|---|
| App background | `#F5F4FF` | `#0A0A0A` |
| Card | `#FFFFFF` | `#1A1A1A` |
| Sidebar | `#111111` | `#111111` |
| Text primary | `#111827` | `#FFFFFF` |
| Text secondary | `#6B7280` | `#A0A0A0` |
| Accent (yellow-green) | `#C5F135` | `#C5F135` |
| Purple (Pro / highlight) | `#7B2FBE` | `#7B2FBE` |
| Success | `#22C55E` | `#22C55E` |
| Danger | `#EF4444` | `#EF4444` |
| Font | Geist | Geist |

### Card Interaction Pattern
All fund/scheme/portfolio cards share a unified hover style:
- **Default**: white background, no visible border
- **Hover**: `1px solid #7B2FBE` border, card lifts up (`-translate-y-1`), `box-shadow: xl`
- **Heading**: transitions to `#7B2FBE` purple on hover
- **Fund icons**: unique origami animal SVGs (50 icons) with soft-colored palette backgrounds

### Sidebar
- Floating pill — `4px gap` on all sides via `m-1 rounded-2xl`
- **Collapsed**: purple avatar button at top, nav icons vertically centered, ✳ logo mark at bottom
- **Expanded**: profile card (name + "Sahi PRO" + collapse toggle) at top, full nav list, SahiMF v1.0 at bottom
- Tooltips on hover show full submenu popover in collapsed state

### Plan Gating
`<PlanGate>` component — blurs content, shows lock icon + "Upgrade to Sahi PRO" overlay. Content is always visible but locked (never hidden). Used on: Sahi Fund returns, Overlap Lens, Comparison chart, Scorecard details, Tax Report, 3Y/5Y returns in scheme tables.

---

## Plan Tiers

| Feature | Free | Sahi PRO (₹1,999/yr) | Sahi Elite (₹3,999 lifetime) |
|---|---|---|---|
| Overview dashboard | Basic | Full XIRR + breakdown | Full |
| My Portfolios | 1 portfolio | Up to 5 | Unlimited |
| Holdings Ledger | ✓ | ✓ | ✓ |
| Transactions | ✓ | ✓ | ✓ |
| Search / Explore Schemes | ✓ | ✓ | ✓ |
| 3Y / 5Y returns | Blurred | ✓ | ✓ |
| Sahi Fund returns / weights | Locked | ✓ | ✓ |
| Overlap Lens | Locked | ✓ | ✓ |
| Fund Comparison | Locked | ✓ (3 funds) | ✓ (4 funds) |
| MF Scorecard | Preview | ✓ | ✓ |
| Tax Report | Locked | ✓ | ✓ |
| MFPMS Disclosures | ✓ | ✓ | ✓ |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`, `@theme {}` — no config file) |
| Icons | Material UI Icons (`@mui/icons-material`) |
| Fund Icons | 50 origami SVG icons served from `public/icons/schemes/` |
| Charts | Recharts (AreaChart, PieChart, BarChart) |
| Headless UI | Radix UI (Tooltip, Dialog, Tabs) |
| State | Zustand (`authStore`, `uiStore`) |
| Routing | React Router v6 |
| Data Fetching | TanStack Query (React Query) |
| Font | Geist (`@fontsource/geist`) |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── assets/                    # hero images, logo, background assets
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx       # root shell — sidebar + topbar + outlet
│   │   ├── Sidebar.tsx        # floating pill sidebar, 4 states
│   │   └── Topbar.tsx         # transparent topbar with CAS sync, theme toggle
│   └── ui/
│       ├── PlanGate.tsx       # blur/lock overlay for plan gating
│       ├── VolatilityBadge.tsx
│       ├── PlanBadge.tsx
│       ├── StatCard.tsx
│       └── EmptyState.tsx
├── data/                      # mock data (no backend required)
│   ├── funds.ts               # 20+ open scheme records
│   ├── sahiFunds.ts           # SahiMF curated baskets
│   ├── portfolios.ts
│   ├── transactions.ts
│   ├── amcs.ts
│   └── dividends.ts
├── pages/
│   ├── auth/                  # Login, OTP, CreateProfile, InitializePortfolio
│   ├── overview/              # MF Overview dashboard
│   ├── portfolios/            # Portfolios, PortfolioDetail (Holdings), Transactions
│   ├── sahifunds/             # ExploreFunds, AllSchemes, MySahiFunds, SahiFundDetail
│   ├── research/              # MFScorecard, FundManager, SchemeDetail
│   ├── analysis/              # OverlapLens, FundComparison
│   ├── tools/                 # Calculator (SIP / Lumpsum / SWP / STP)
│   └── reports/               # Dividends, TaxReport, MFPMSDisclosures
├── stores/
│   ├── authStore.ts           # user session + plan tier (mocked as PRO)
│   └── uiStore.ts             # sidebar expand/collapse, lightMode toggle
├── hooks/
│   └── usePlan.ts             # plan tier checks (can('pro'), etc.)
├── types/                     # TypeScript interfaces (User, Fund, Portfolio, etc.)
public/
└── icons/schemes/             # 50 origami animal SVG icons for fund cards
```

---

## Running Locally

```bash
# Clone
git clone https://github.com/ChinmayGang/sahimf-dashboard.git
cd sahimf-dashboard

# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173

# Production build
npm run build
```

Requires Node.js 18+. No environment variables needed — all data is mocked locally. The app opens pre-authenticated as "Emily Rose (Sahi PRO)" so all pages are accessible immediately.

---

## SEBI Compliance Notes

- All mutual fund content is generic and educational — no personalized recommendations
- SEBI disclaimer appears on all Sahi MF Funds pages
- Plan gating uses blur overlays — content is always visible but locked, never hidden
- Footer carries the zero-commission declaration on all relevant pages
- MFPMS Disclosures page lists all regulatory documents (SEBI IA certificate, fee schedule, conflict of interest disclosure, etc.)
- "NO COMMISSION RECEIVED FROM ANY INDIAN MUTUAL FUND HOUSES, EVER." — enforced across the product

---

## Roadmap

- [ ] CAS import — CAMS / KFintech statement parsing
- [ ] Live NAV data — AMFI API integration
- [ ] Goal-based planning module
- [ ] SWP / STP calculators (full)
- [ ] Numera — equity research module (coming soon)
- [ ] Thematic Baskets module (coming soon)
- [ ] ArqEd learning module (coming soon)
- [ ] Mobile-responsive layout
- [ ] Email/phone OTP auth (replace mock)

---

Built by [Arqentis Financial Technologies](https://arqentis.in)

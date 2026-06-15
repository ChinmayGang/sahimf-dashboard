# SahiMF — Mutual Fund Dashboard

> A SEBI-registered, fee-only investment advisory platform for direct mutual fund investing. Zero commissions. Always.

**Live:** https://sahimf-dashboard.vercel.app

---

## What is SahiMF?

SahiMF is a mutual fund research and portfolio management dashboard built under **Arqentis Financial Technologies**. It is designed for Indian investors who want to invest in direct mutual funds without any commission bias.

Key principles:
- **Fee-only advisory** — SahiMF charges clients directly. No trail commissions, no upfront fees from AMCs.
- **Direct plans only** — Never regular plans. Lower expense ratios, better returns.
- **SEBI-registered Investment Adviser** — All advice and tools comply with SEBI IA regulations.
- **No personalized recommendations** — Tools are generic and educational to stay within SEBI scope.

> **NO COMMISSION RECEIVED FROM ANY INDIAN MUTUAL FUND HOUSES, EVER.**

---

## Features Built

### Auth
- **Login** — Phone number entry with split layout (dark panel + light panel)
- **OTP Verification** — 6-digit OTP input with resend countdown, checker-pattern background

### Portfolio Management
- **MF Overview** — Portfolio value summary, asset allocation pie chart, returns area chart, market indices ticker
- **My Portfolios** — Portfolio cards with current value, XIRR, fund count; add portfolio flow
- **Holdings Ledger** — Drill-down fund-level holdings: units, avg NAV, current value, gain/loss, XIRR
- **Transactions** — Full transaction history (SIP / Lumpsum / Redemption / Switch) with status badges and filters

### Sahi MF Funds (Curated Baskets)
- **Explore Sahi Funds** — Grid of SahiMF's curated fund baskets filtered by theme and risk
- **My Sahi Funds** — Active baskets with mini allocation pie charts, multi-period returns, XIRR tracking
- **Sahi Fund Detail** — Performance chart, methodology, holdings distribution donut, rebalance schedule

### Research
- **Search Schemes** — Fund explorer with sticky filter panel (category, volatility, expense ratio, AMC, fund size)
- **Scheme Detail** — NAV chart, fund analysis metrics, holdings, peer comparison
- **MF Scorecard** — SahiMF's proprietary 5-dimension fund scoring (Returns / Consistency / Risk / Manager / Cost), grade A+ to C
- **Fund Manager / AMFI** — AMC profiles with manager bios, AUM ranking bar chart

### Analysis
- **Overlap Lens** — Portfolio overlap matrix (color-coded by overlap %) + common stocks cross-fund weight table
- **Fund Comparison** — Side-by-side comparison of up to 4 funds: overlaid performance chart, metrics table with best-in-class highlight

### Tools
- **SIP Calculator** — Monthly investment projection with AreaChart and returns summary
- **Lumpsum Calculator** — One-time investment projection

### Reports
- **Dividends (IDCW)** — Dividend announcement lookup with filters by frequency and type; SEBI IDCW nomenclature note
- **Tax Report** — STCG / LTCG breakdown by financial year (Budget 2024 rates: 20% / 12.5%)
- **MFPMS Disclosures** — SEBI regulatory document library with hover-reveal download actions; zero-commission banner

---

## Plan Tiers & Feature Gating

| Feature | Free | Sahi PRO (₹1,999/yr) | Sahi Elite (₹3,999 lifetime) |
|---|---|---|---|
| Overview dashboard | Basic | Full XIRR + breakdown | Full |
| My Portfolios | 1 portfolio | Up to 5 | Unlimited |
| Holdings Ledger | ✓ | ✓ | ✓ |
| Transactions | ✓ | ✓ | ✓ |
| Search Schemes | ✓ | ✓ | ✓ |
| 3Y / 5Y returns | Blurred | ✓ | ✓ |
| Sahi Fund holdings/weights | Locked | ✓ | ✓ |
| Overlap Lens | Locked | ✓ | ✓ |
| Fund Comparison chart | Locked | ✓ (3 funds) | ✓ (4 funds) |
| MF Scorecard | Preview | ✓ | ✓ |
| Tax Report | Locked | ✓ | ✓ |
| MFPMS Disclosures | ✓ | ✓ | ✓ |

Gating uses a **blur overlay** pattern — locked content is always visible but blurred, with an "Upgrade to Sahi PRO" CTA. Content is never hidden.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| Icons | Material UI Icons (`@mui/icons-material`) |
| Charts | Recharts (pie, area, bar) |
| State | Zustand |
| Routing | React Router v6 |
| Font | Geist (`@fontsource/geist`) |
| Deployment | Vercel |

---

## Design System

| Token | Value |
|---|---|
| Background | `#0A0A0A` |
| Accent (yellow-green) | `#C5F135` |
| Sidebar | `#111111` |
| Card | `#1A1A1A` |
| Pro badge (purple) | `#7B2FBE` |
| Success | `#22C55E` |
| Danger | `#EF4444` |
| Font | Geist (all weights) |

Dark-first UI. Light mode uses a soft purple gradient background.

---

## Project Structure

```
src/
├── assets/                 # logos, background images
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx    # root shell with sidebar + topbar
│   │   ├── Sidebar.tsx     # 4-state collapsible sidebar
│   │   └── Topbar.tsx
│   └── ui/
│       ├── PlanGate.tsx    # blur/lock overlay for plan gating
│       ├── VolatilityBadge.tsx
│       └── ...
├── data/                   # mock data (funds, portfolios, AMCs, etc.)
│   ├── funds.ts
│   ├── sahiFunds.ts
│   ├── portfolios.ts
│   ├── transactions.ts
│   ├── amcs.ts
│   └── dividends.ts
├── pages/
│   ├── auth/               # Login, OTP
│   ├── overview/           # MF Overview
│   ├── portfolios/         # Portfolios, Holdings, Transactions
│   ├── sahifunds/          # Explore, My Sahi Funds, Fund Detail
│   ├── research/           # Search Schemes, Scheme Detail, Scorecard, Fund Manager
│   ├── analysis/           # Overlap Lens, Fund Comparison
│   ├── tools/              # SIP / Lumpsum Calculator
│   └── reports/            # Dividends, Tax Report, MFPMS Disclosures
├── stores/
│   ├── authStore.ts        # user session + plan tier
│   └── uiStore.ts          # sidebar collapse state, light/dark mode
└── App.tsx                 # route tree
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

# Production build
npm run build
```

Requires Node.js 18+. No environment variables needed — all data is mocked locally.

---

## SEBI Compliance Notes

- All mutual fund content is generic and educational — no personalized recommendations
- SEBI disclaimer appears on all Sahi MF Funds pages
- Plan gating uses blur overlays — content visible but locked, never hidden
- Footer carries the zero-commission declaration on all relevant pages
- MFPMS Disclosures page lists all regulatory documents (SEBI IA certificate, fee schedule, conflict of interest disclosure, etc.)

---

## Roadmap

- [ ] CAS import (CAMS / KFintech statement parsing)
- [ ] Live NAV integration (AMFI API)
- [ ] Goal-based planning module
- [ ] Numera (equity research) module
- [ ] Thematic Baskets module
- [ ] ArqEd learning module
- [ ] Mobile-responsive layout

---

Built by [Arqentis Financial Technologies](https://arqentis.in)

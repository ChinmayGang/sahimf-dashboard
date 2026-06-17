# SahiMF — Design Reference

> Single source of truth for colors, typography, spacing, components, and patterns.  
> Updated: 2026-06-17

---

## Brand Colors

| Name | Hex | Usage |
|---|---|---|
| **Sahi Lime** | `#d6fd70` | Dark mode accent, CTA background, active nav, highlights |
| **Brand Purple** | `#8c34ee` | Logo, primary brand gradient start |
| **Indigo** | `#4f46e5` | Light mode accent, buttons, links, active states |
| **Indigo Light** | `#6366f1` | Secondary indigo, icons on dark bg |

## Semantic Colors

### Dark Mode
| Role | Value |
|---|---|
| Page background | `#0a0c0e` |
| Card background | `#14171c` |
| Card border | `#1e2838` |
| Divider | `#1e2838` |
| Text primary | `#ffffff` |
| Text secondary | `#8390a2` |
| Text muted | `#64748b` |
| Accent text | `#d6fd70` |
| Hover row bg | `#1a2130` |

### Light Mode (DEFAULT)
| Role | Value |
|---|---|
| Page background | `#f8f9fc` |
| Card background | `#ffffff` |
| Card border | `#E0E3E8` |
| Divider | `#F0F0F8` |
| Text primary | `#111827` |
| Text secondary | `#6B7280` |
| Text muted | `#9CA3AF` |
| Accent text | `#4f46e5` |
| Hover row bg | `#F9F9FF` |

### Status Colors (same in both modes)
| Status | Hex |
|---|---|
| Positive / Gain | `#22C55E` |
| Negative / Loss | `#EF4444` |
| Warning | `#F59E0B` |
| Info | `#06b6d4` |

---

## Risk Labels (SEBI 6-Level — use everywhere)

| Level | Label | Color |
|---|---|---|
| 1 | Low | `#16a34a` |
| 2 | Low-Moderate | `#22C55E` |
| 3 | Moderate | `#F59E0B` |
| 4 | Moderately High | `#f97316` |
| 5 | High | `#EF4444` |
| 6 | Very High | `#dc2626` |

> Do NOT use Low / Medium / High — SEBI mandates the 6-level scale on all riskometers.

---

## Typography

| Element | Font | Weight | Size |
|---|---|---|---|
| Page title | Geist | 700 | 20–24px |
| Section heading | Geist | 600 | 14–16px |
| Card title | Geist | 600 | 14px |
| Body text | Geist | 400 | 14px |
| Table row | Geist | 400 | 13px |
| Label / meta | Geist | 500 | 11–12px |
| Badge | Geist | 700 | 10–11px |

---

## Spacing & Layout

| Token | Value |
|---|---|
| Page padding | `p-6` (24px) |
| Card padding | `p-5` (20px) |
| Section gap | `space-y-6` |
| Card gap in grid | `gap-4` or `gap-5` |
| Inner page max-width | `max-w-7xl mx-auto` |
| ExploreFunds | Full width (no max-w) |
| Border radius — card | `rounded-2xl` (16px) |
| Border radius — chip | `rounded-full` |
| Border radius — button | `rounded-lg` (8px) or `rounded-full` for pill CTAs |

---

## Component Patterns

### Card (light mode)
```tsx
<div className="bg-white border border-[#E0E3E8] rounded-2xl p-5">
```

### Card (dark mode)
```tsx
<div className="bg-[#14171c] border border-[#1e2838] rounded-2xl p-5">
```

### AnimatedBorderCard (research / analysis highlight)
- Top-rail only: 4px gradient strip across the top
- Colors rotate on 3s CSS loop: `#8c34ee → #4f46e5 → #d6fd70 → #06b6d4`
- File: `src/components/ui/AnimatedBorderCard.tsx`
- Used on: SahiResearchCard, Sahi Comparison tables, Sahi Analysis panels

### ProButton (upgrade CTA)
- Gradient bg: `#8c34ee → #4f46e5`
- Sparkles icon (Phosphor)
- Click pulse animation
- File: `src/components/ui/ProButton.tsx`

### PlanCard (pricing)
- Dark bg with radial-gradient backdrop
- Rotating conic border (same 4 colours as AnimatedBorderCard)
- Feature checklist with `#4f46e5` check circles
- File: `src/components/ui/PlanCard.tsx`

### PlanGate (content gate)
- Blurs child content
- Shows lock icon + tier label + `<ProButton>`
- On upgrade click → opens `<UpgradePopup>`
- File: `src/components/ui/PlanGate.tsx`

### Button variants
- `primary` → `bg-[#4f46e5] text-white hover:bg-[#4338ca]`
- `secondary` → `border border-[#E0E3E8] text-[#111827] hover:bg-[#F9F9FF]`
- `ghost` → `text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]`
- `lime` → `bg-[#d6fd70] text-black hover:bg-[#b8d94a]` (dark mode CTA only)
- File: `src/components/ui/Button.tsx`

---

## Overview Page Color Map (Batch 3)

| Card | Background |
|---|---|
| Portfolio summary (invested/current value) | `#4F46E5` |
| First-time user onboarding CTA | `#4F46E5` |
| "Grow your idle money" | `#3359C3` |
| "Global Shifts" | `#1E6B55` |
| "Unlock the full research desk" (PRO) | `#0A0C0E` |

---

## Assets

### Rank Icons
Location: `src/assets/rank-icons/`

| File | Use |
|---|---|
| `first.png` | Rank #1 — includes "HIGHEST RETURN" visual |
| `second.png` | Rank #2 |
| `third.png` | Rank #3 |
| `fourth.png` | Rank #4 |
| `fifth.png` | Rank #5 |

Usage in SchemeDetail: show rank icon for Returns, Cost (TER), and Volatility. Only rank 1 gets the "HIGHEST" badge. Fix ordinal suffix (1st, 2nd, 3rd, 4th, 5th).

### Logo
Location: `src/assets/logo/`

| File | Use |
|---|---|
| `sahi_logo-white.svg` | Sidebar, dark backgrounds |
| `sahi_logo-black.svg` | Light mode header |
| `sahi_icon.svg` | Favicon, small icon |
| `sahi_text.svg` | Text-only wordmark |

### Background Images
| File | Used On |
|---|---|
| `black_checker-background-1.jpg` | Auth login page bg |
| `white_purple_gradient-background-1.jpg` | Auth panel bg |
| `paperplane.jpg` | Overview onboarding card bg |
| `piramid-landingpage.png` | PRO upsell card bg |
| `hero.png` | Login left panel graphic |
| `loginpage-graphic.jpg` | Login illustration |
| `explore-funds-header.jpg/.png` | ExploreFunds hero |

---

## Page Container Reference

| Page | Container |
|---|---|
| ExploreFunds | Full width (no max-w) |
| All other pages | `max-w-7xl mx-auto` |
| Auth pages | Full screen, no sidebar |
| Pricing page | Full screen, no sidebar |

---

## Sidebar Navigation Structure

```
Overview
───────────────────
My Portfolios
  └ Portfolios
  └ Transactions
───────────────────
Mutual Funds
  └ Explore Funds
  └ All Schemes
  └ MF Scorecard
  └ Fund Manager / AMFI
───────────────────
Analysis
  └ Overlap Lens       (max 5 funds)
  └ Fund Comparison    (max 4 funds)
  └ Market Cap Mix
  └ Risk Analysis
───────────────────
Sahi Funds
  └ Explore Sahi Funds
  └ My Sahi Funds
  └ Sahi Baskets
  └ Goals & Plans
───────────────────
Tools
  └ SIP Calculator     (merged: SIP / Lumpsum / SWP / STP / What-If tabs)
───────────────────
Reports
  └ Dividends
  └ Tax Optimizer
  └ Reports & Disclosures  (was MFPMSDisclosures)
───────────────────
Settings
```

---

## SEBI RA Compliance Rules

- **Allowed:** Fund rankings, Sahi Score, research verdicts (Research Pick / Watchlist / Under Review), category comparisons, overlap analysis, portfolio health metrics, performance charts, alerts.
- **Not allowed:** Personalised buy/sell/hold advice, risk profiling individuals, portfolio discretionary management, execution services.
- **Never say:** Buy / Sell / Hold — always use Research Pick / Watchlist / Under Review.
- **Disclaimer** must appear on every returns-bearing page.
- **Riskometer** must use SEBI 6-level standard only.

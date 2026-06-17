# SahiMF — Product To-Do & Batch Plan

> Last updated: 2026-06-17  
> 40 open items organised into 7 batches in dependency order.  
> Each batch can be handed to Claude Code as a single session prompt.

---

## Status Legend
- `[ ]` — Not started  
- `[~]` — In progress  
- `[x]` — Done  

---

## Batch 1 — Global Fixes (Colors, Text, Spacing)
*Do first — affects every other batch.*

- [ ] **B1-1** `Global` All grey-tint headings / body text → `#111827` on light cards. No more `text-[#6B7280]` or `text-[#8390a2]` for primary headings.
- [ ] **B1-2** `Global` Readable body text floor: `#374151` minimum on white bg; `rgba(255,255,255,0.85)` minimum on dark bg.
- [ ] **B1-3** `VolatilityBadge` + all pill badges: increase bg opacity to `/20` and use darker text shade so they read on white. Standardise risk vocabulary to SEBI 6-level: `Low / Low-Moderate / Moderate / Moderately High / High / Very High`. Audit and replace every `Low/Medium/High` occurrence project-wide.
- [ ] **B1-4** `Global` Caret / chevron / dropdown icons misaligned — audit every `<select>` and custom accordion toggle, fix vertical alignment.
- [ ] **B1-5** `Topbar` Remove SEBI RA registration number `INH000009876` from the top nav. Keep the "SEBI RA" badge text only.
- [ ] **B1-6** `Portfolios` Add `gap-5` between portfolio cards (currently touching). Add a "Compare" quick-chip on each card.
- [ ] **B1-7** `Global` Standardise inner-page container to `max-w-7xl mx-auto` on all pages except ExploreFunds (full-width). Check: OverlapLens, Baskets, MySahiFunds, FundComparison, RiskAnalysis, MarketCapAllocation, Goals.
- [ ] **B1-8** `Global` Every dark-bg element must use white text; every light-bg element must use dark text. Audit cards in Goals, Baskets, Overview widgets.

---

## Batch 2 — Design System Components
*Build shared components; Batches 3–7 consume them.*

- [ ] **B2-1** `NEW src/components/ui/Button.tsx` — Base `<Button>` with variants (`primary`, `secondary`, `ghost`, `destructive`) and all states (default / hover / active / focus / disabled / loading spinner). Replace inline `<button className="...">` across the project.
- [ ] **B2-2** `NEW src/components/ui/ProButton.tsx` — Glow CTA button. Gradient: `#8c34ee → #4f46e5`. Phosphor `Sparkles` icon. Click pulse animation. Used for every "Upgrade to PRO", "Get Sahi Pro", "Unlock" CTA across the app.
- [ ] **B2-3** `NEW src/components/ui/AnimatedBorderCard.tsx` — Card wrapper with a top-rail animated gradient strip (4px height). Colours rotate on 3s loop: `#8c34ee → #4f46e5 → #d6fd70 → #06b6d4`. Used on: `SahiResearchCard`, Sahi Comparison tables in FundComparison, Sahi Analysis sections on MarketCap / RiskAnalysis / MFScorecard.
- [ ] **B2-4** `NEW src/components/ui/PlanCard.tsx` — Pricing card adapted from reference design. Dark bg with radial-gradient, rotating conic border, feature checklist, `<ProButton>` CTA. Used on `/pricing` page and upgrade popup. Reference code provided in session 2026-06-17.
- [ ] **B2-5** `NEW src/components/ui/UpgradePopup.tsx` — Modal popup triggered from any `<PlanGate>` upgrade button. Shows feature list for that tier, links to `/pricing` page. Uses `<PlanCard>` layout inside a Dialog.

---

## Batch 3 — Overview Page + ExploreFunds Tab Fixes

- [ ] **B3-1** `Overview` Invested/Current Value summary card → `bg-[#4F46E5]`, white text throughout. "Overlap Analysis" button → white outlined.
- [ ] **B3-2** `Overview` First-time user CTA card → `bg-[#4F46E5]`.
- [ ] **B3-3** `Overview` "Grow your idle money" card → `bg-[#3359C3]`, all text white.
- [ ] **B3-4** `Overview` "Global Shifts" card → `bg-[#1E6B55]`, all text white.
- [ ] **B3-5** `Overview` "Unlock the full research desk" PRO upsell card → `bg-[#0A0C0E]`.
- [ ] **B3-6** `Overview` Watchlist heart icons → render as filled/active for funds already in `user.watchlist`. Add heart toggle button to `FundCard` component so funds can be saved/removed from watchlist.
- [ ] **B3-7** `Overview` Exclusive Sahi Funds horizontal scroll → add 4 more mock fund cards (total ~8) so scroll is visible.
- [ ] **B3-8** `Overview` Live market indicator: green glow + light-green bg when open (9:00–15:30 IST Mon–Fri); red bg when closed. Hover tooltip: "Market Open · 9:00 AM – 3:30 PM IST" or "Market Closed · Opens Mon 9:00 AM".
- [ ] **B3-9** `ExploreFunds` Hero search button → white text. Unselected category filter tags → white text on dark bg (not black).
- [ ] **B3-10** `ExploreFunds` Fix 1-frame black border flash when switching tabs (remove focus `ring` or `outline` that appears on tab re-render).

---

## Batch 4 — Overlap Lens + Fund Comparison

- [ ] **B4-1** `OverlapLens` "Common Holdings" heading → `#111827` (currently grey).
- [ ] **B4-2** `OverlapLens` Worst-pairs section: remove dark border from pair cards, use `border-[#E0E3E8]`. Fix overlap % pill colours (increase opacity).
- [ ] **B4-3** `OverlapLens` Sector Exposure tab: grey headings → `#111827`. Add label/tooltip on the single bar explaining it is the Nifty 50 reference line.
- [ ] **B4-4** `OverlapLens` Sector tab search bar white bg → `bg-white border-[#E0E3E8]` with proper text colour.
- [ ] **B4-5** `OverlapLens` Cap fund picker at **5 funds** max (was 10). Show "Max 5 funds" disabled state tooltip when limit reached.
- [ ] **B4-6** `FundComparison` Free plan: hide the entire metrics table. Add "Sahi Comparison" panel per tab (Overview / Fund Analysis / Holdings / Manager) — natural-language AI-style analysis card wrapped in `<AnimatedBorderCard>`. PRO-gated via `<PlanGate>`.
- [ ] **B4-7** `FundComparison` + `MarketCapAllocation` + `RiskAnalysis` Remove `<PageHeroBanner>` purple gradient header from these pages. Replace with a minimal page header (title + subtitle + inline chips) matching the Baskets / OverlapLens style.

---

## Batch 5 — Scheme Detail + MF Scorecard + Rank Icons

- [ ] **B5-1** `SchemeDetail` Replace hardcoded rank number text with rank badge images from `src/assets/rank-icons/` (first.png → fifth.png). Fix ordinal suffix bug ("2st" → "2nd"). Add "HIGHEST RETURN" badge only to rank 1 in each of the 3 rank cards (returns / cost / volatility).
- [ ] **B5-2** `SchemeDetail` Standardise risk riskometer label to SEBI 6-level. Check same on RiskAnalysis, VolatilityBadge, Baskets.
- [ ] **B5-3** `SchemeDetail` `SahiResearchCard` → wrap in `<AnimatedBorderCard>` (top-rail). Add "SAHI RESEARCH" pill badge in top-right corner of the card header.
- [ ] **B5-4** `MFScorecard` Expand accordion row to show: 6-dimension sub-score bars, peer comparison (rank vs category), manager tenure chip, 3Y rolling alpha, 3-sentence analyst verdict. Table is the entry; row expand is the depth.
- [ ] **B5-5** `ExploreFunds` Rename/reframe "Sahi Recommended" sidebar section — these are scorecard research picks, NOT the Sahi Funds product. Correct label and description copy.

---

## Batch 6 — Sahi Funds, Baskets, Goals

- [ ] **B6-1** `MySahiFunds` First card has no hover state — add `hover:-translate-y-1 hover:border-[#4f46e5]` transition.
- [ ] **B6-2** `SahiFundDetail` Subscriber-only view: add SIP tracker section (current units, total invested, XIRR), rebalance history timeline, next-rebalance countdown card, performance vs category benchmark chart. Should feel distinct from the free preview.
- [ ] **B6-3** `Baskets` Empty goals state → show "Set your first goal" CTA card (not a blank area). Remove dark highlight border from "Popular" baskets. Hover → same as ExploreFunds cards. All "View Details" buttons → `bg-[#4F46E5]` text-white.
- [ ] **B6-4** `Goals` Replace brown/dark gradient header card with a light `bg-[#F3F4F6]` card and dark text. Predefined goal buttons → consistent with project button style. All headings → `#111827`. Fix black text on dark buttons.

---

## Batch 7 — New Pages + Tools + Reports Cleanup

- [ ] **B7-1** `NEW /pricing` Full-screen pricing page (no sidebar). Three `<PlanCard>` columns: Free / Sahi Pro ₹1,999/yr / Sahi Wealth. Feature comparison table below. Linked from every `<ProButton>` CTA.
- [ ] **B7-2** `UpgradePopup` Triggered from `<PlanGate>` upgrade buttons. Shows tier feature list, "See full plan details →" link to `/pricing`.
- [ ] **B7-3** `MarketCapAllocation` Free user → show guidance card ("Upload portfolio to unlock") instead of empty charts. Paid + many funds → group by category, show top 10 by allocation %. Rebalance simulator → visible drag handle. Remove emoji. Move Sahi Analysis panel above the fold. All headings → `#111827`.
- [ ] **B7-4** `RiskAnalysis` Free user → same guidance card pattern. Bubble chart → tooltip on hover showing full fund name. Fill empty right-column space with Sahi Insight card (`<AnimatedBorderCard>`).
- [ ] **B7-5** `Calculator + SIPWhatIf` Merge into one page: Calculator with tabs (SIP / Lumpsum / SWP / STP / What-If). Sidebar label → "SIP Calculator". What-If category toggle → proper segmented control (not text links). Lumpsum / SWP / STP calculator tabs to be added.
- [ ] **B7-6** `TaxReport` Promote to dedicated sidebar item "Tax Optimizer". 0-investment user → "No investments found" empty state. Strengthen visual hierarchy: summary cards → chart → table → alerts. No raw text dumps.
- [ ] **B7-7** `MFPMSDisclosures + Reports sidebar` Merge into one "Reports & Disclosures" sidebar item. Remove "MFPMS" from page heading. Remove MF Portfolio PDF section entirely. Direct link from Reports page.
- [ ] **B7-8** `Pricing decision` Use full-screen `/pricing` (no sidebar) — industry standard for conversion-focused pricing pages. User lands there from ProButton clicks and can return to the app normally after.

---

## Cross-Cutting Decisions (Locked)

| Decision | Choice |
|---|---|
| Animated research card border style | Top-rail only (4px gradient strip) |
| ProButton gradient | `#8c34ee → #4f46e5` (brand purple → indigo) |
| Pricing page layout | Full-screen, no sidebar |
| Risk label standard | SEBI 6-level: Low / Low-Moderate / Moderate / Moderately High / High / Very High |
| Container max-width | `max-w-7xl` on all inner pages; ExploreFunds full-width |
| Font | Geist throughout |

---

## Done (Previous Sessions)

- [x] SEBI RA badge, sidebar overhaul, Phosphor icons
- [x] Overlap Lens rebuild (matrix + worst-pairs + sector + AMC tabs)
- [x] Fund Comparison with benchmark line
- [x] Market Cap Allocation page
- [x] SIP What-If calculator
- [x] Tax Report (LTCG/STCG, Budget 2024 rates)
- [x] Goals retirement planner
- [x] Baskets page
- [x] MF Scorecard with grade system
- [x] Scheme Detail with NAV chart + benchmark
- [x] Risk Analysis (Riskometer SVG, scatter, stress test)
- [x] Sahi Research Card on Scheme Detail
- [x] Peer fund suggestions on Portfolio Detail
- [x] PageHeroBanner component
- [x] Comprehensive light mode audit (all 18 files — neon lime → indigo on white bg)
- [x] Portfolios.tsx blank page bug fix
- [x] FundCard light mode
- [x] PlanGate light mode
- [x] Topbar light mode
- [x] ExploreSahiFunds light mode rewrite
- [x] SearchSchemes full light mode pass
- [x] Transactions / Dividends color map split (dark/light)
- [x] README updated
- [x] Rank icon assets added to `src/assets/rank-icons/`

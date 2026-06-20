# SahiMF — Product To-Do & Batch Plan

> Last updated: 2026-06-19  
> 9 batches in dependency order. Each batch can be handed to Claude Code as a single session prompt.

---

## Status Legend
- `[ ]` — Not started  
- `[~]` — In progress  
- `[x]` — Done  

---

## Batch 1 — Global Fixes (Colors, Text, Spacing)
*Do first — affects every other batch.*

- [ ] **B1-1** `Global` All grey-tint headings / body text → `#111827` on light cards. No more `text-[#6B7280]` or `text-[#8390a2]` for any primary heading or label. Rule: if bg is light/white → use `#111827`; if bg is dark → use `#ffffff`.
- [ ] **B1-2** `Global` Readable body text floor: `#374151` minimum on white bg; `rgba(255,255,255,0.85)` minimum on dark bg. Any secondary text (captions, labels, metadata) must be `#6B7280` minimum — never lighter.
- [x] **B1-3** `VolatilityBadge` + all pill/chip badges: increase bg opacity to `/20` and use a darker text shade so they are legible on white cards. Standardise risk vocabulary to SEBI 6-level across the entire project: `Low / Low-Moderate / Moderate / Moderately High / High / Very High`. Find and replace every `Low/Medium/High` triple project-wide (VolatilityBadge, RiskAnalysis riskometer, Baskets, SchemeDetail, MFScorecard). *(Done: badge opacity/text already done; now the vocabulary is SEBI-standard everywhere — `Fund/SahiFund.volatility` types widened to the 6-level union, all `'Medium'` data → `'Moderate'`, and every consumer relabelled (`VolatilityBadge` dropped the `Medium` alias, `SchemeDetail` uses `fund.volatility` directly, `RiskAnalysis` riskometer labels, `SearchSchemes`/`AllSchemes` volatility filters, `DesignSystem` mock). No `'Medium'` remains. tsc clean; verified Moderate renders on SchemeDetail/AllSchemes/RiskAnalysis. NOTE: the riskometer SVGs still render 3 zones (collapsing the 6-level) — the full 6-zone riskometer is the remaining visual part of B5-2.)*
- [ ] **B1-4** `Global` Caret/chevron/dropdown icons misaligned — audit every `<select>` and custom accordion toggle, fix vertical alignment so icon sits centred with label text.
- [x] **B1-5** `Topbar` Remove SEBI RA registration number `INH000009876`. Keep "SEBI RA" badge text only — no number visible.
- [ ] **B1-6** `Portfolios` Add `gap-5` between portfolio cards (currently touching with no gap). Add a "Compare" quick-chip on each portfolio card that links to `/mutual-funds/compare` pre-seeded with that portfolio's top funds.
- [x] **B1-7** `Global` Standardise inner-page container to `max-w-7xl mx-auto px-6` on ALL pages except ExploreFunds (full-width). Audit and fix: OverlapLens, Baskets, MySahiFunds, FundComparison, RiskAnalysis, MarketCapAllocation, Goals, SchemeDetail, MFScorecard, Calculator, TaxReport. *(Done: audited — all listed pages already use `p-6 max-w-7xl mx-auto`; the one outlier was OverlapLens's new-investor empty state (`max-w-5xl`), now `max-w-7xl`. Pricing keeps `max-w-5xl` intentionally (standalone full-screen).)*
- [ ] **B1-8** `Global` Dark bg element → must use white text; light bg element → must use dark/black text. Fix all known violators: Goals brown/dark cards have black text on dark bg; Baskets "Popular" section dark border cards; Overview widgets; any button with dark bg and grey text.
- [x] **B1-9** `Global` No emoji in any finance-product UI. Find and remove all emoji usage (🎯, 🚀, 📊, etc.) from all pages. Replace with Phosphor icons where a visual indicator is needed. *(Done/verified: a codepoint scan (U+1F000–1FAFF, U+2600–27BF) found no colourful emoji anywhere — they were removed in earlier sessions. Only intentional typographic glyphs remain: the `✳` brand mark on auth screens, `✓` checklist ticks, `⚠` inline error markers, `★` best-in-class. No 🎯/🚀/📊-style emoji.)*
- [ ] **B1-10** `Global` Every `<select>` element: apply consistent styling (`bg-white border border-[#E0E3E8] rounded-lg text-[#111827] text-xs px-2.5 py-1.5`) across all pages. No unstyled browser selects.

---

## Batch 2 — Design System Components
*Build shared components; Batches 3–7 consume them.*

- [ ] **B2-1** `NEW src/components/ui/Button.tsx` — Base `<Button>` with variants: `primary` (bg `#4F46E5`, white text), `secondary` (white bg, `#4F46E5` border+text), `ghost` (transparent, `#6B7280` text), `destructive` (red), `brand` (bg `#C5F135`, black text). All states: default / hover / active / focus ring / disabled (opacity-50 cursor-not-allowed) / loading (spinner replaces label). Replace all inline `<button className="...">` across the project with this component.
- [ ] **B2-2** `NEW src/components/ui/ProButton.tsx` — Glow CTA button. Gradient: `#8c34ee → #4f46e5`. Phosphor `Sparkle` icon (duotone) on the right. Click pulse animation: scale 0.97 → 1.0 on 200ms. Inset white box-shadow for the glow. Pill shape (`rounded-full`). Used for every "Upgrade to PRO", "Get Sahi Pro", "Unlock Full Access" CTA in the app. Replace all existing upgrade buttons.
- [x] **B2-3** `NEW src/components/ui/AnimatedBorderCard.tsx` — Card wrapper that highlights Sahi Research / Analysis cards so users immediately know this content is from SahiMF's research desk. Implementation: animated top-rail gradient strip (4px height at top of card, `border-radius` on top corners only). Gradient rotates on 3s loop: `#8c34ee → #4f46e5 → #d6fd70 → #06b6d4 → #8c34ee`. Rest of card border: standard `1px solid #E0E3E8`. Also add a small "SAHI RESEARCH" pill badge (indigo bg, white text, 10px font) pinned to the top-right corner of the card header so the user can instantly identify it. Prop: `children`, optional `badge` (default "SAHI RESEARCH"). Used on: `SahiResearchCard`, Sahi Comparison panels in FundComparison, Sahi Analysis sections in MarketCapAllocation/RiskAnalysis/MFScorecard.
- [ ] **B2-4** `NEW src/components/ui/PlanCard.tsx` — Premium pricing card. Base on the reference design provided (rotating conic border animation, dark radial-gradient bg, feature checklist, CTA button). SahiMF colours: `--primary: #8c34ee`, radial-gradient spots use `#8c34ee`, `#c5f135`, `#4f46e5`. Background: `#0a0c0e` with radial gradients. The rotating border uses `@keyframes rotate 8s linear infinite` on a `::before` pseudo-element. Feature checklist uses Phosphor `CheckCircle` icon in `#8c34ee`. CTA button uses `<ProButton>`. Tiers: Free / Sahi PRO ₹1,999/yr / Sahi Wealth ₹3,999 lifetime. Each tier card is a separate instance of `PlanCard` with different feature lists.
- [ ] **B2-5** `NEW src/components/ui/UpgradePopup.tsx` — Dialog/modal triggered from any `<PlanGate>` upgrade button. Shows: which feature is locked, feature list for that PRO tier using `<PlanCard>` layout, `<ProButton>` CTA, "See full plan details →" link to `/pricing`. Uses Radix `Dialog`. The popup is compact (max-w-md) — it is NOT the full pricing page.

---

## Batch 3 — Overview Page + ExploreFunds Fixes

- [x] **B3-1** `Overview` Invested & Current Value summary card → background `#4F46E5`, all text white. "Overlap Analysis" quick button inside that card → white outlined button (white border, white text, transparent bg, hover: white bg + indigo text).
- [x] **B3-2** `Overview` First-time user / zero-portfolio CTA card ("Get your first portfolio") → background `#4F46E5`, white text throughout, white CTA button style.
- [ ] **B3-3** `Overview` "Grow your idle money" card → background `#3359C3`, **all text white** (heading, body, subtext — no grey, no dark text anywhere on this card).
- [ ] **B3-4** `Overview` "Global Shifts" card → background `#1E6B55`, all text white.
- [ ] **B3-5** `Overview` "Unlock the full research desk" PRO upsell card → background `#0A0C0E`, white text, replace existing upgrade button with `<ProButton>`.
- [ ] **B3-6** `Overview` Watchlist heart icons → render as filled/active (solid heart, indigo `#4F46E5`) for funds already in `user.watchlist` array. Add heart toggle button to `FundCard` component: on click, adds/removes fund from `user.watchlist` in authStore. Icon: Phosphor `Heart` (weight `fill` when saved, `regular` when not). Optimistic update with no reload.
- [ ] **B3-7** `Overview` Exclusive Sahi Funds horizontal scroll → add 4 more mock Sahi fund cards (total ~8) so the scroll is clearly visible and functional.
- [ ] **B3-8** `Overview` Live market indicator → more prominent. When market is OPEN (Mon–Fri 09:00–15:30 IST): green border `border-[#16A34A]` + light-green bg `bg-[#F0FDF4]`, green dot pulse animation. When CLOSED: red border `border-[#DC2626]` + `bg-[#FEF2F2]`. Hover tooltip: "Market Open · 9:00 AM – 3:30 PM IST" or "Market Closed · Opens Mon 9:00 AM". Use IST offset (`UTC+5:30`) from `new Date()` to determine state.
- [x] **B3-9** `ExploreFunds` Hero search button → white text on the Search button (was showing dark). Unselected category quick-filter tags → `text-white/80` with `bg-white/10` (not black text on dark bg).
- [ ] **B3-10** `ExploreFunds` Fix 1-frame black border flash when switching sidebar sections — remove any focus `ring`, `outline`, or transition that causes a visible black border on tab re-render.

---

## Batch 4 — Overlap Lens + Fund Comparison

- [x] **B4-1** `OverlapLens` "Common Holdings" section heading → `#111827` (currently grey). Audit all headings on all 4 tabs — all must be `#111827`.
- [ ] **B4-2** `OverlapLens` Worst-pairs cards: remove the dark/black border, replace with `border border-[#E0E3E8]`. Fix overlap % pill colours: increase opacity so they are legible on white bg (`bg-red-100 text-red-700`, `bg-amber-100 text-amber-700`, `bg-green-100 text-green-700`).
- [ ] **B4-3** `OverlapLens` Sector Exposure tab: all grey headings → `#111827`. Add tooltip/label on the single reference bar explaining it is the Nifty 50 benchmark — text: "Nifty 50 reference". Fix search bar: `bg-white border border-[#E0E3E8]` with `text-[#111827]` input text (was white bg with invisible text).
- [ ] **B4-4** `OverlapLens` AMC Concentration tab: same grey heading fix — all headings `#111827`.
- [ ] **B4-5** `OverlapLens` Cap fund picker at **5 funds** max (was 10 per TODO, matches user request). When limit reached: "+" button is disabled with tooltip "Max 5 funds". Remove existing 10-fund logic.
- [x] **B4-6** `FundComparison` Free plan: hide the entire metrics comparison table behind `<PlanGate>`. For each tab (Overview / Fund Analysis / Holdings / Manager) add a "Sahi Comparison" panel wrapped in `<AnimatedBorderCard>` — natural-language AI-style summary that reads all data on that tab and presents it in plain English ("Fund A has lower expense ratio but Fund B showed more consistent returns over 3Y…"). PRO-gated via `<PlanGate>`. The Sahi Comparison panel gives free users a taste; the full table requires PRO.
- [ ] **B4-7** `FundComparison` + `MarketCapAllocation` + `RiskAnalysis` Remove `<PageHeroBanner>` purple gradient header from these 3 pages. Replace with a minimal page header: title (`text-lg font-bold text-[#111827]`) + subtitle (`text-xs text-[#6B7280]`) + inline stat/filter chips. Match the header style used on Baskets and OverlapLens pages.

---

## Batch 5 — Scheme Detail + MF Scorecard + Rank Icons

- [x] **B5-1** `SchemeDetail` Rank cards (Returns / Cost / Volatility): redesigned with 5-tier color system — Rank 1 green, Rank 2 orange, Rank 3 slate, Rank 4 amber, Rank 5 slate. 60px badge, shine gradient on rank 1 winner card, tinted bg + border per tier. Riskometer now shows all 3 arcs colored (green/amber/red), active segment at full opacity, inactive at 0.4 — no more grey-out on High risk. *(Original TODO: use rank-icon PNGs + SEBI 6-level banners — partially done; PNGs not used, labels not yet SEBI 6-level)*
- [ ] **B5-2** `SchemeDetail` + `RiskAnalysis` + `VolatilityBadge` + `Baskets` Standardise ALL risk labels to SEBI 6-level: `Low / Low-Moderate / Moderate / Moderately High / High / Very High`. Find and replace any `Low/Medium/High` triple and any 3-level scale. Pick one standard and never mix.
- [ ] **B5-3** `SchemeDetail` Wrap `SahiResearchCard` in `<AnimatedBorderCard>` (top-rail rotating gradient). Add "SAHI RESEARCH" pill badge in top-right corner. The card must visually stand out from surrounding fund info cards so users immediately know it is SahiMF research content.
- [x] **B5-4** `MFScorecard` Expand accordion row to show richer detail when a row is clicked: 6-dimension sub-score bars (Consistency of Returns, Risk-adjusted Return, Expense Ratio Discipline, Fund Manager Tenure, Portfolio Quality, Mandate Adherence), peer comparison rank vs category, manager tenure chip, 3Y rolling alpha chip, 3-sentence analyst verdict. Left column: Sahi Sabh-scales dim bars. Centre column: RadarChart (6-axis spider) with Recharts. Right column: Top Portfolio Holdings with % weight. Full-width: "Sahi Analysis & Rationale" chips + verdict + SEBI Audit-Trail + "Deep-Analyze Fund" CTA. Category filter pills with active state fix (`text-[#ffffff]` not `text-white`).
- [x] **B5-5** `ExploreFunds` Sidebar "Sahi MF Funds" / "Recommended" section — these are scorecard research picks, NOT the Sahi Funds product/basket. Renamed label to "Sahi Picks" and updated description copy to: "Top-rated schemes by SahiMF research score — not affiliated with Sahi Baskets."

---

## Batch 6 — Sahi Funds, Baskets, Goals

- [x] **B6-1** `MySahiFunds` First card missing hover state — add `hover:-translate-y-1 hover:border-[#4f46e5] transition-all` to match all other fund cards. All cards on this page must use the same hover pattern as ExploreFunds cards (transparent border default → indigo border + lift on hover + heading colour change). *(Done: default `activeIdx` set to -1 so no card is pre-highlighted — every card starts neutral and reveals the same indigo-border + lift hover.)*
- [x] **B6-2** `SahiFundDetail` Subscriber-only deep view (when user holds this fund in MySahiFunds): add SIP tracker section (current units held, total invested, current value, XIRR), rebalance history timeline (last 3 rebalances with date + % change), next-rebalance countdown card (days remaining), performance vs category benchmark chart with alpha chip. This content only appears for users who own the fund — free preview shows a "Start investing" CTA instead. *(Done: `OWNED_DATA` map (sf001/sf002) drives the deep view — SIP tracker grid + alpha-vs-category chip + Manage SIP, next-rebalance countdown (days computed from `nextRebalance`), and a 3-stop rebalance-history timeline. Non-owners see an indigo "Start investing" CTA.)*
- [x] **B6-3** `Baskets` Empty goals state (zero active goals): show "Set your first goal" CTA card instead of blank area. Remove dark highlight border from "Popular" baskets section — use standard `border-[#E0E3E8]`. All basket/fund cards on this page: replace current hover with the ExploreFunds hover pattern (transparent border → `hover:border-[#4f46e5] hover:-translate-y-1 hover:shadow-xl group`). All "View Details" buttons → `bg-[#4F46E5] text-white` (consistent indigo, not varied colours). *(Done: empty state copy now "Set your first goal"; cards use theme-aware `card` + `group hover:border-[#4f46e5] hover:-translate-y-1 hover:shadow-xl` with heading colour shift; all 6 View Details + Upgrade buttons → solid `#4f46e5` bg / white text.)*
- [x] **B6-4** `Goals` Replace brown/dark gradient header card with light `bg-[#F3F4F6]` card with dark `#111827` text. Predefined goal quick-buttons: white bg, `#4F46E5` border and text, hover `bg-[#EEF2FF]` — consistent with rest of project. Fix black text on any dark-bg button. All headings on this page: `#111827`. No grey headings. *(Done: header was already light; predefined goal tabs now white bg + `#4f46e5` border/text + `hover:bg-[#EEF2FF]`; all 4 uppercase section headings → `#111827` in light mode, theme-aware for dark.)*

---

## Batch 7 — New Pages + Tools + Reports Cleanup

- [x] **B7-1** `NEW /pricing` Full-screen pricing page (no sidebar, no topbar — standalone). Three `<PlanCard>` columns: Free / Sahi PRO ₹1,999/yr / Sahi Wealth ₹3,999 lifetime. Feature comparison table below the cards. "Most Popular" tag on PRO card. Linked from every `<ProButton>` CTA and from `<UpgradePopup>` "See full plan details" link. After purchase CTA click → return to the page user was on (pass `returnTo` query param). *(Built in a prior session with `PremiumPlanCard` + simulated purchase flow. Verified this pass: `/pricing` renders full-screen (no sidebar) with Free / PRO / Wealth tiers, no errors.)*
- [x] **B7-2** `UpgradePopup` Wire `<UpgradePopup>` to every `<PlanGate>` upgrade button. Popup shows: which specific feature is locked, 3–5 bullet benefits of upgrading, `<ProButton>` with label "Unlock with Sahi PRO", "See all plan details →" link to `/pricing`. *(Done: UpgradePopup CTA is now `<ProButton label="Unlock with Sahi PRO">` + a "See all plan details →" link to /pricing; PlanGate's full-view CTA is also `<ProButton>`. PlanGate already triggers the popup. Verified: popup glow-btn renders, all links present.)*
- [x] **B7-3** `MarketCapAllocation` Free user (0 investments): show guidance card "Upload your portfolio to unlock" with `<ProButton>` CTA instead of empty charts. Paid user with many funds: group funds by market cap category, show top 10 by allocation % (collapse rest under "Show more"). Drag handle on rebalance simulator: make it a visible coloured pill handle (`bg-[#4F46E5]`, `w-4 h-4 rounded-full`) so it's clearly draggable. No emoji anywhere. Move "Sahi Analysis" panel above the fund-by-fund table (not at the very bottom). All headings `#111827`. Suggested fund actions: clean card list with Phosphor icons, no emoji. *(Done: zero-investment guidance early-return with ProButton; Sahi Analysis panel moved above the fund table; section headings → #111827 (theme-aware); rebalance sliders now render a filled gradient track + an 18px pill thumb via `.rebalance-slider` CSS + `--thumb` var. Verified: analysis above table, 3 pill sliders, guidance for Aryan. Top-10 grouping skipped — only 4 mock funds.)*
- [x] **B7-4** `RiskAnalysis` Free user: show guidance card ("Analyse your portfolio risk — upload CAS or add funds") with `<ProButton>` instead of empty charts. PRO user bubble chart: add hover tooltip on each bubble showing full fund name + allocation %. Fill the empty right column space with a Sahi Insight card wrapped in `<AnimatedBorderCard>`. *(Done: zero-investment guidance early-return with ProButton; bubble chart now in a 2-col grid with a `<AnimatedBorderCard badge="SAHI INSIGHT">` risk-insight panel; each bubble has an SVG `<title>` hover tooltip showing fund name + allocation% + XIRR + volatility; headings → #111827. Verified on Rohit + Aryan.)*
- [x] **B7-5** `Calculator + SIPWhatIf` Merge into one page at `/mutual-funds/tools/sip`. Sidebar label: "SIP Calculator". Add tab switcher at top of page: SIP / Lumpsum / SWP / STP / What-If. What-If category toggle: replace text links with proper segmented control (pill-style with active bg). Build out Lumpsum, SWP, STP tabs (copy SIP layout, adjust formula and labels). *(Done: Calculator is now a single tabbed page — segmented control SIP/Lumpsum/SWP/STP/What-If, `?tab=` URL sync. SWP (corpus drawdown) + STP (source→equity transfer) formulas added with their own input/result labels. What-If renders `<SIPWhatIf embedded>` (single header). Legacy /lumpsum //swp //stp //sip-whatif routes redirect to the right tab. Sidebar Tools dropdown collapsed to one "SIP Calculator" item. Verified all 5 tabs render, SWP labels correct, single h1.)*
- [x] **B7-6** `TaxReport` Rename sidebar item to "Tax Optimizer". Separate it as a top-level module (not buried in Reports). Zero-investment user → show "No investments found" empty state with "Add Portfolio" CTA. Paid user with investments: improve visual hierarchy — summary cards (STCG total, LTCG total, Tax payable) → doughnut chart → timeline table → tax-saving alerts. Replace text alerts with visual alert cards (icon + colour-coded border). Add graphics/illustrations for key concepts (STCG vs LTCG holding period). *(Done: sidebar + page heading → "Tax Optimizer" (top-level module). Zero-investment users get a "No investments found" empty state with an `<ProButton>` Add Portfolio CTA. Added a LTCG-vs-STCG gains-split doughnut and a "12-month line" holding-period graphic after the summary cards. The STCG / ELSS / harvesting alerts are already colour-coded visual cards. Headings → #111827. Verified Rohit (full redesign) + Aryan (empty state).)*
- [x] **B7-7** `MFPMSDisclosures + Reports sidebar` Merge into single "Reports & Disclosures" sidebar item at `/mutual-funds/reports`. Remove "MFPMS" from page heading — rename to "Reports & Disclosures". Remove "MF Portfolio PDF" section entirely. Direct link from the sidebar item. *(Done in prior sessions — heading is "Reports & Disclosures", PDF section removed, sidebar is a single top-level "Reports & Disclosures" item. This pass: replaced the `✓`/emoji highlight glyphs with Phosphor CheckCircle icons and corrected "Investment Adviser" → "Research Analyst" to match the RA-only brand. Verified.)*
- [x] **B7-8** Pricing page should be full-screen (no sidebar) — standard for conversion-focused pricing. Users can return to the app from the pricing page via back button or after purchase. *(Done — `/pricing` is a top-level route outside AppShell; verified it renders with no sidebar.)*

---

## Batch 8 — Mobile Responsive

- [ ] **B8-1** `AppShell` Mobile breakpoint (`< 768px`): sidebar collapses to bottom tab bar (5 items: Home, Portfolios, Explore, Sahi Funds, More). Topbar becomes compact with just logo + notification bell + avatar.
- [ ] **B8-2** `Overview` Mobile: stack all cards vertically. Area chart full width. Stat cards 2-col grid. Market indices ticker stays horizontal scroll.
- [ ] **B8-3** `ExploreFunds` Mobile: hero banner reduced to 140px height. Accordion sidebar collapses into a horizontal scroll pill row above the fund grid. Fund grid: 1-col on mobile.
- [ ] **B8-4** `AllSchemes` Mobile: filter sidebar hidden behind a "Filters" drawer button (Phosphor `Funnel` icon). Fund table: collapse to card list (hide 3Y/5Y columns, show only NAV + 1Y + Risk).
- [ ] **B8-5** `Portfolios` + `MySahiFunds` Mobile: cards 1-col. Hide chart comparison widget on mobile. Show XIRR + gain prominently.
- [ ] **B8-6** `OverlapLens` Mobile: matrix view replaced by worst-pairs ranked list (matrix is unreadable on small screens). Sector bar chart horizontal scrolls.
- [ ] **B8-7** `FundComparison` Mobile: show max 2 funds side-by-side. "Add fund" button disabled at 2 on mobile. Horizontal scroll on metrics table.
- [ ] **B8-8** `SchemeDetail` + `MFScorecard` Mobile: single column layout. Rank cards stack vertically. Scorecard expanded row becomes a bottom sheet / drawer.
- [ ] **B8-9** `Calculator` + `SIPWhatIf` Mobile: inputs stacked above chart. Tab switcher horizontally scrolls.
- [ ] **B8-10** `Goals` + `Baskets` Mobile: goal grid 1-col. Basket scroll cards wrap to 1-col.
- [ ] **B8-11** `Auth pages` (Login, OTP, CreateProfile) Mobile: already somewhat responsive, but audit padding, font sizes, and OTP input box sizes at 375px width.
- [ ] **B8-12** `/pricing` page Mobile: PlanCards stack vertically. Feature comparison table horizontally scrolls or collapses to accordion per plan.

---

## Batch 9 — Supabase Database & Auth

*This batch replaces all mock data with real persistent data and enables multi-user, multi-plan operation.*

- [ ] **B9-1** `Supabase project setup` Create Supabase project. Configure `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Install `@supabase/supabase-js`. Create `src/lib/supabase.ts` client singleton.

- [ ] **B9-2** `Database schema` Design and apply migrations for all tables:
  ```sql
  -- Core user identity
  users (id, name, email, phone, pan_hash, risk_profile, created_at)
  
  -- Subscriptions / plan tiers
  subscriptions (id, user_id, plan [free|pro|wealth], started_at, expires_at, payment_ref)
  
  -- Portfolios
  portfolios (id, user_id, name, created_at, cas_source [manual|cas_import])
  
  -- Holdings (fund positions)
  holdings (id, portfolio_id, scheme_code, fund_name, units, avg_nav, invested_amount, updated_at)
  
  -- Transactions
  transactions (id, portfolio_id, scheme_code, type [SIP|Lumpsum|Redemption|Switch], amount, units, nav, date, status)
  
  -- Sahi Fund subscriptions (baskets the user is invested in)
  sahi_subscriptions (id, user_id, sahi_fund_id, invested_amount, units, started_at)
  
  -- Watchlist
  watchlist (id, user_id, scheme_code, added_at)
  
  -- Goals
  goals (id, user_id, name, target_amount, target_date, linked_portfolio_id, monthly_sip, created_at)
  
  -- Baskets (Sahi curated fund sets — admin-managed)
  baskets (id, name, description, min_amount, rebalance_freq, created_at)
  basket_funds (id, basket_id, scheme_code, weight_percent)
  
  -- Funds master (open schemes — synced from AMFI)
  funds_master (scheme_code PK, name, amc, category, sub_category, nav, expense_ratio, aum, volatility, updated_at)
  
  -- NAV history (for charting)
  nav_history (scheme_code, date, nav)
  ```

- [ ] **B9-3** `Row Level Security (RLS)` Enable RLS on all user-data tables. Each user can only read/write their own rows. Admins (Arqentis staff) bypass via service-role key for basket management.

- [ ] **B9-4** `Auth — replace mock` Replace `authStore` mock with Supabase Auth. Support: phone OTP login (primary), email OTP (secondary). On first login create a `users` row. Persist session via `supabase.auth.getSession()` on app load. Store `user_id` + `plan` from `subscriptions` table in Zustand.

- [ ] **B9-5** `Plan tier from DB` On login, fetch the user's active subscription from `subscriptions` table. Set `plan` in authStore to `free | pro | wealth`. All `<PlanGate>` and `usePlan()` checks read from this live value, not mock. Subscription expiry check: if `expires_at < now()` → downgrade to free automatically.

- [ ] **B9-6** `Portfolio data from DB` Replace all `mockPortfolios` references with live Supabase queries via TanStack Query hooks:
  - `usePortfolios(userId)` → fetch portfolios + holdings
  - `useTransactions(portfolioId)` → paginated transactions
  - `useAddPortfolio()` → mutation
  - `useAddHolding()` → mutation
  CAS import: parse uploaded CAMS/KFintech PDF → extract holdings → insert into `holdings` table.

- [ ] **B9-7** `Watchlist from DB` Replace `user.watchlist` mock array with live `watchlist` table. `useSaveToWatchlist(schemeCode)` mutation. Optimistic update in FundCard heart toggle (B3-6 depends on this).

- [ ] **B9-8** `Goals from DB` Replace mock goals with live `goals` table. `useGoals(userId)`, `useCreateGoal()`, `useUpdateGoal()` hooks. Link goals to portfolio via `linked_portfolio_id`.

- [ ] **B9-9** `Sahi Fund subscriptions from DB` Replace mock Sahi fund holdings with `sahi_subscriptions` table. `useMySahiFunds(userId)` hook. `SahiFundDetail` subscriber view (B6-2) reads from this.

- [ ] **B9-10** `AMFI NAV sync` Scheduled Supabase Edge Function (daily cron at 22:00 IST): fetch AMFI `allnavs` file → parse → upsert `funds_master` and `nav_history` tables. This keeps NAV, AUM, expense ratio current without a third-party API.

- [ ] **B9-11** `Demo personas from DB` Replace the 3 hardcoded demo personas (Aryan/Priya/Rohit) with actual seeded rows in the database. Use Supabase's seed SQL or a seed script. Each persona has matching `subscriptions`, `portfolios`, `holdings`, `transactions`, and `watchlist` rows so the demo is fully realistic end-to-end.

- [ ] **B9-12** `Admin panel (minimal)` A simple `/admin` route (service-role only, password-gated) for Arqentis to: view all users + plan status, manually set plan tier, add/edit Sahi Baskets, trigger NAV sync. Can be a simple table UI — no need for a full CMS.

---

## Round 2 — Follow-up Fixes
*Reported after the Batch 6–7 pass. UI/UX corrections across explore, pricing, baskets, tools and schemes.*

- [x] **R2-1** `ExploreFunds` / `ExploreSahiFunds` In Explore Mutual Funds, Sahi Funds the user has **not** invested in are being shown as already invested. Only funds actually held (in `MySahiFunds` / `sahi_subscriptions`) should render the "invested / owned" state — everyone else sees the default "explore / invest" state. Fix the ownership check so un-owned Sahi funds don't show an invested badge/status. (Relates to the Aryan "shows Sahi funds investment" bug.) *(Done: added `getOwnedSahiFundIds(userId)` in `data/sahiFunds.ts` (only Rohit/u003 owns sf001/sf002). `MySahiFunds` filters by it + shows an "explore" empty state for non-owners; `SahiFundDetail` gates the owned deep-view on it (non-owners get "Start investing"). Verified: Aryan → empty/Start-investing, Rohit → 2 owned funds.)*
- [x] **R2-2** `Pricing` Fix the plan page layout: align the text across the 3 plan cards (consistent baselines / equal-height sections so feature rows line up), and fix the divider/breaker line so it sits correctly (consistent position, full width, not misaligned between cards). *(Done: root cause was a CSS specificity bug — `.premium-plan-card > * { position: relative }` overrode `.premium-plan-card__border { position: absolute }`, pulling the animated border into flow and shoving the Wealth card's content down ~58px. Bumped the border selector to `.premium-plan-card > .premium-plan-card__border` so `absolute` wins. Also restructured the Free card to mirror `PremiumPlanCard` (icon → title → price → paragraph → divider → features → CTA) with equal paragraph min-height + `flex-1` features. Verified: divider tops spread 1px, CTA tops spread 3px.)*
- [x] **R2-3** `Baskets` The "Upgrade to PRO" button text is rendering in **black** — make it **white** on the indigo button (ensure `text-white` / `text-[#ffffff]` isn't being overridden by the light-mode `.text-white` rule). *(Done: root cause was `text-white` + an inline-gradient bg, so the light-mode `.text-white` override turned it black. Replaced the button with the `<ProButton>` glow component (always-white text) — verified `color: rgb(255,255,255)`.)*
- [x] **R2-4** `Calculator (SIP)` Merge the What-If fund table onto the **same** SIP Calculator page: a single input/customisation menu drives both the SIP calculation **and** the fund-comparison table shown directly **below** it. When the user adjusts the SIP inputs, the calculator result updates and the table of funds re-ranks below it — one page, one set of controls, no separate What-If page/tab. *(Done: `SIPWhatIf` now accepts controlled `monthly`/`years` props — in that mode it drops its own SIP/duration sliders (shows a "Ranking funds for your SIP above…" note) and keeps the category filter + chart + table. The Calculator's SIP tab renders `<SIPWhatIf monthly={monthly} years={years}>` below the calculator under "How top funds would have grown this SIP". Removed the separate "What-If" tab (TABS now SIP/Lumpsum/SWP/STP); legacy `/tools/sip-whatif` redirects to `/tools/sip`. Verified: moving the SIP slider to ₹25,000 live-updated the table note + ranking.)*
- [x] **R2-5** `AllSchemes` In the fund listing on the All Open Schemes page, change each fund card: `border-radius: 0`, remove left & right borders, and set the spacing between listings to `0` (cards flush/stacked). On **hover**, show a full all-side border in the same blue (`#4f46e5`) plus the push-up (`-translate-y`) animation. *(Done: Open Schemes rows now `rounded-none`, container `space-y-0` (flush), default `border border-transparent` with only a colored `border-b` separator (no visible L/R border); hover sets full `border-[#4f46e5]` + `-translate-y-0.5` + `z-10`. Verified computed: radius 0, L/R border transparent, 0 gap, hover classes present.)*

---

## Cross-Cutting Decisions (Locked)

| Decision | Choice |
|---|---|
| Animated research card border style | Top-rail only (4px rotating gradient strip) + "SAHI RESEARCH" pill badge |
| ProButton gradient | `#8c34ee → #4f46e5` (brand purple → indigo) |
| Pricing page layout | Full-screen, no sidebar |
| Risk label standard | SEBI 6-level: Low / Low-Moderate / Moderate / Moderately High / High / Very High |
| Container max-width | `max-w-7xl` on all inner pages; ExploreFunds full-width |
| Font | Geist throughout |
| No emoji | Finance product — no emoji anywhere, use Phosphor icons instead |
| Card hover | Transparent border default → `hover:border-[#4f46e5] hover:-translate-y-1 hover:shadow-xl group` |
| Text on light bg | `#111827` headings, `#374151` body, `#6B7280` captions |
| Text on dark bg | `#ffffff` headings, `rgba(255,255,255,0.85)` body |
| Brand indigo (new primary) | `#4F46E5` for buttons, active states, highlighted borders |
| Database | Supabase (Postgres + Auth + Edge Functions) |
| Mobile breakpoint | 768px — bottom tab bar, 1-col layouts |
| Plan tiers | `free \| pro \| wealth` (not elite — renamed to Sahi Wealth) |
| `text-white` light-mode footgun | RESOLVED (#11) — the blanket `[data-theme="light"] .text-white` override was removed. `text-white` now always renders white (only used on dark/coloured surfaces); surfaces that flip use a theme-aware token (`lm ? 'text-[#111827]' : 'text-white'`). Existing `text-[#ffffff]` workarounds still work but are no longer required. |

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
- [x] Explore Funds hero banner (custom image, rounded card, spaced margins)
- [x] Origami animal icons for all fund cards (50 SVGs, palette-colored bg)
- [x] Card hover pattern (transparent border → purple border + lift + heading color)
- [x] Featured/PRO badge position fix (relative positioning)
- [x] AllSchemes, MySahiFunds, Portfolios — unified card hover style
- [x] Topbar transparent background with visible bottom border

## Done (Session 2 — June 2026)

- [x] **Nav restructure** — Removed Home and Investments pages + routes. Flattened Mutual Funds dropdown: all MF sub-items now appear directly in sidebar nav with no dropdown wrapper. `Sidebar.tsx` + `App.tsx` updated.
- [x] **Plan tier rename** — `elite` → `wealth` globally across `types/index.ts`, `usePlan.ts`, `PlanBadge.tsx`, `PlanGate.tsx`, `UpgradePopup.tsx`, `Pricing.tsx`, `Sidebar.tsx`, `Overview.tsx`. Pricing column now reads "Sahi Wealth" (₹3,999 lifetime).
- [x] **SEBI RA number removed** — `INH000009876` removed from `Pricing.tsx` and `Baskets.tsx`. "SEBI Registered Research Analyst" label kept, number dropped.
- [x] **Login.tsx** — Removed 🇮🇳 flag emoji from phone prefix.
- [x] **VolatilityBadge** — Badge bg opacity `/15 → /20`, text colours darkened (Low `#15803D`, Moderate `#B45309`, High `#B91C1C`, etc.).
- [x] **Overview summary card** (B3-1) — Added `bg-[#4f46e5]` class to summary card div so `text-white` override is bypassed. All text on the indigo card now renders white correctly.
- [x] **Overview onboarding card** (B3-2) — Removed paperplane BG image, replaced with solid `linear-gradient(135deg, #4f46e5, #4338ca)`. White text throughout.
- [x] **Overview Quick Invest** — "Sahi Research Picks" renamed to "Quick Invest". Lime "Invest ₹{sip}/mo" buttons added. `score`/`reason` fields removed from mock data.
- [x] **Portfolios.tsx** — Bar chart fill uses `#65a30d` in light mode (visible green, not neon lime). Chart tick, legend, arrow icon hover colors fixed.
- [x] **FundComparison.tsx** — Added `AnimatedBorderCard` wrapping a per-tab `sahiComparison()` plain-English panel above tab content. "Add Fund" button hover fixed (`hover:border-[#4f46e5] hover:text-[#4f46e5]` in light mode, not neon).
- [x] **OverlapLens.tsx** — All section heading labels darkened: `text-[#374151] uppercase → text-[#111827] uppercase`.
- [x] **ExploreFunds.tsx** — Sidebar section buttons: `outline-none focus:outline-none`. Inactive hero filter tags: `text-white → text-[#ffffff]` to bypass index.css footgun. "Sahi MF Funds" label → "Sahi Picks".
- [x] **SchemeDetail.tsx — Rank cards** — Complete redesign with 5-tier color system (`RANK_TIER` map: Rank 1 green shine, Rank 2 orange, Rank 3 slate, Rank 4 amber, Rank 5 slate). 60px badge, `text-3xl font-black` rank number, `rounded-2xl`, winner banners.
- [x] **SchemeDetail.tsx — Riskometer** — SVG arcs now always show all 3 colors (green/amber/red). Active segment at `opacity 1`, inactive at `opacity 0.4`. Previously inactive segments above current level were filled grey.
- [x] **MFScorecard.tsx** — Full rewrite of expanded row (`ScorecardRow` component): Sahi Sabh-scales dim bars (left), RadarChart 6-axis spider with Recharts (center), top holdings weight bars (right), full-width analysis + SEBI Audit-Trail + "Deep-Analyze Fund" CTA. Category filter pills active state uses `text-[#ffffff]` (not `text-white`) to avoid index.css override.
- [x] **MarketCapAllocation.tsx** — Rebalance simulator: removed `appearance-none` (was hiding the slider track). Added `h-2`. Sliders now render with browser native track + colored thumb via `accentColor`. Added Sahi research note card above sliders (purple tint in light, dark-purple in dark) with 50/30/20 composition rationale.
- [x] **index.css footgun documented** — `[data-theme="light"] .text-white { color: #18181B !important }` in `src/index.css:231` overrides white text on dark bg. Workaround: use `text-[#ffffff]` (arbitrary value). Task #11: harden this selector to be more surgical (still pending).

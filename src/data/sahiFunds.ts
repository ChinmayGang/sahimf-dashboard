import type { SahiFund } from '../types'

// Which Sahi funds each persona actually holds. Only Rohit (Sahi PRO, sahiFundCount 2)
// owns any — Aryan and Priya own none, so they must see the "explore / invest" state,
// never the "invested / owned" state. (R2-1)
export const OWNED_SAHI_FUNDS_BY_USER: Record<string, string[]> = {
  u003: ['sf001', 'sf002'],
}

export function getOwnedSahiFundIds(userId?: string | null): string[] {
  return userId ? (OWNED_SAHI_FUNDS_BY_USER[userId] ?? []) : []
}

export const mockSahiFunds: SahiFund[] = [
  {
    id: 'sf001',
    name: 'Sahi All-Weather Portfolio',
    description:
      'A balanced portfolio designed to perform across all market cycles — equity for growth, debt for stability, and gold as a hedge.',
    methodology:
      'The portfolio follows a dynamic asset allocation model — rebalancing quarterly based on valuation signals. No single asset class exceeds 60%.',
    managerName: 'Sahi Research Desk',
    managerCompany: 'SahiMF / Arqentis',
    fundCount: 4,
    minAmount: 5000,
    rebalanceFrequency: 'Quarterly',
    lastRebalance: '2026-04-01',
    nextRebalance: '2026-07-01',
    returns: { '1M': 1.8, '3M': 5.2, '6M': 9.4, '1Y': 16.8, '3Y': 14.2 },
    volatility: 'Low',
    accessTier: 'free',
    tags: ['Balanced', 'All Weather', 'Low Risk'],
    holdingsDistribution: [
      { label: 'Equity', value: 50, color: '#C5F135' },
      { label: 'Debt', value: 30, color: '#7B2FBE' },
      { label: 'Gold', value: 20, color: '#F59E0B' },
    ],
    holdings: [
      { fundId: 'f001', fundName: 'Mirae Asset Large Cap Fund', weight: 35 },
      { fundId: 'f007', fundName: 'ICICI Prudential Balanced Advantage Fund', weight: 15 },
      { fundId: 'f008', fundName: 'Kotak Gilt Fund', weight: 30 },
    ],
  },
  {
    id: 'sf002',
    name: 'Sahi Growth Accelerator',
    description:
      'High-conviction equity portfolio spanning large, mid, and small cap funds for long-term wealth creation.',
    methodology:
      'Selects funds with consistent alpha generation over 5+ years, low overlap, and experienced fund managers. Rebalanced semi-annually.',
    managerName: 'Sahi Research Desk',
    managerCompany: 'SahiMF / Arqentis',
    fundCount: 5,
    minAmount: 10000,
    rebalanceFrequency: 'Half-Yearly',
    lastRebalance: '2026-01-01',
    nextRebalance: '2026-07-01',
    returns: { '1M': 4.2, '3M': 11.8, '6M': 18.4, '1Y': 28.6, '3Y': 22.4 },
    volatility: 'High',
    accessTier: 'pro',
    tags: ['Equity', 'Growth', 'High Returns', 'Long Term'],
    holdingsDistribution: [
      { label: 'Large Cap', value: 40, color: '#C5F135' },
      { label: 'Mid Cap', value: 35, color: '#7B2FBE' },
      { label: 'Small Cap', value: 25, color: '#EF4444' },
    ],
    holdings: [
      { fundId: 'f001', fundName: 'Mirae Asset Large Cap Fund', weight: 25 },
      { fundId: 'f002', fundName: 'Parag Parikh Flexi Cap Fund', weight: 20 },
      { fundId: 'f005', fundName: 'HDFC Mid-Cap Opportunities Fund', weight: 30 },
      { fundId: 'f006', fundName: 'SBI Small Cap Fund', weight: 25 },
    ],
  },
  {
    id: 'sf003',
    name: 'Sahi Tax Saver Pack',
    description:
      'A curated set of ELSS funds to maximise your Section 80C benefit while building long-term equity wealth.',
    methodology:
      'Selects 3 ELSS funds with different style biases — value, growth, and momentum — to diversify within the ELSS category.',
    managerName: 'Sahi Research Desk',
    managerCompany: 'SahiMF / Arqentis',
    fundCount: 3,
    minAmount: 500,
    rebalanceFrequency: 'Yearly',
    lastRebalance: '2026-04-01',
    nextRebalance: '2027-04-01',
    returns: { '1M': 2.4, '3M': 7.2, '6M': 12.8, '1Y': 21.4, '3Y': 17.6 },
    volatility: 'Moderate',
    accessTier: 'free',
    tags: ['ELSS', 'Tax Saving', '80C', 'Equity'],
    holdingsDistribution: [
      { label: 'Equity', value: 100, color: '#C5F135' },
    ],
  },
  {
    id: 'sf004',
    name: 'Sahi Passive Index Core',
    description:
      'A low-cost, zero-manager-risk portfolio built entirely on index funds tracking Nifty 50, Nifty Next 50, and Nifty Midcap 150.',
    methodology:
      'Follows a fixed weight allocation. Rebalanced annually. Expense ratio below 0.1% across all constituents.',
    managerName: 'Sahi Research Desk',
    managerCompany: 'SahiMF / Arqentis',
    fundCount: 3,
    minAmount: 1000,
    rebalanceFrequency: 'Yearly',
    lastRebalance: '2026-01-01',
    nextRebalance: '2027-01-01',
    returns: { '1M': 2.1, '3M': 6.4, '6M': 11.2, '1Y': 19.8, '3Y': 15.4 },
    volatility: 'Moderate',
    accessTier: 'pro',
    tags: ['Index', 'Passive', 'Low Cost', 'Nifty 50'],
    holdingsDistribution: [
      { label: 'Nifty 50', value: 60, color: '#C5F135' },
      { label: 'Nifty Next 50', value: 25, color: '#7B2FBE' },
      { label: 'Midcap 150', value: 15, color: '#22C55E' },
    ],
  },
  {
    id: 'sf005',
    name: 'Sahi Flexi Alpha',
    description:
      "A high-conviction flexi-cap portfolio that invests across market caps based on Sahi's proprietary alpha signals.",
    methodology:
      'Dynamic allocation between large, mid, and small cap based on valuation gaps and earnings momentum. Typically 6–8 funds. Rebalanced quarterly.',
    managerName: 'Sahi Research Desk',
    managerCompany: 'SahiMF / Arqentis',
    fundCount: 7,
    minAmount: 5000,
    rebalanceFrequency: 'Quarterly',
    lastRebalance: '2026-04-01',
    nextRebalance: '2026-07-01',
    returns: { '1M': 3.8, '3M': 10.4, '6M': 17.2, '1Y': 26.1, '3Y': 20.3 },
    volatility: 'High',
    accessTier: 'free',
    tags: ['Flexi Cap', 'Alpha', 'Multi Cap'],
    holdingsDistribution: [
      { label: 'Large Cap', value: 45, color: '#C5F135' },
      { label: 'Mid Cap', value: 30, color: '#7B2FBE' },
      { label: 'Small Cap', value: 25, color: '#EF4444' },
    ],
    holdings: [
      { fundId: 'f002', fundName: 'Parag Parikh Flexi Cap Fund', weight: 30 },
      { fundId: 'f001', fundName: 'Mirae Asset Large Cap Fund', weight: 20 },
      { fundId: 'f005', fundName: 'HDFC Mid-Cap Opportunities Fund', weight: 25 },
      { fundId: 'f006', fundName: 'SBI Small Cap Fund', weight: 25 },
    ],
  },
  {
    id: 'sf006',
    name: 'Sahi Debt Shield',
    description:
      'A capital-preservation portfolio using short-duration and corporate debt funds to park money safely with predictable returns.',
    methodology:
      'Combines liquid, ultra-short, and corporate bond funds. Duration managed to stay under 2 years. No credit risk beyond AA-rated instruments.',
    managerName: 'Sahi Research Desk',
    managerCompany: 'SahiMF / Arqentis',
    fundCount: 3,
    minAmount: 1000,
    rebalanceFrequency: 'Half-Yearly',
    lastRebalance: '2026-01-01',
    nextRebalance: '2026-07-01',
    returns: { '1M': 0.6, '3M': 1.8, '6M': 3.7, '1Y': 7.4, '3Y': 6.9 },
    volatility: 'Low',
    accessTier: 'free',
    tags: ['Debt', 'Capital Safety', 'Short Duration'],
    holdingsDistribution: [
      { label: 'Liquid / Ultra Short', value: 50, color: '#22C55E' },
      { label: 'Corporate Bond', value: 30, color: '#7B2FBE' },
      { label: 'Gilt', value: 20, color: '#F59E0B' },
    ],
    holdings: [
      { fundId: 'f008', fundName: 'Kotak Gilt Fund', weight: 20 },
      { fundId: 'f007', fundName: 'ICICI Prudential BAF', weight: 50 },
    ],
  },
  {
    id: 'sf007',
    name: 'Sahi International Diversifier',
    description:
      'Adds meaningful global equity exposure through US tech, emerging markets, and global commodity funds.',
    methodology:
      'Targets 25–35% international allocation. Primarily US index and emerging market funds, rebalanced semi-annually. Currency hedging not applied.',
    managerName: 'Sahi Research Desk',
    managerCompany: 'SahiMF / Arqentis',
    fundCount: 4,
    minAmount: 10000,
    rebalanceFrequency: 'Half-Yearly',
    lastRebalance: '2026-01-01',
    nextRebalance: '2026-07-01',
    returns: { '1M': 2.9, '3M': 8.6, '6M': 14.3, '1Y': 22.7, '3Y': 18.1 },
    volatility: 'High',
    accessTier: 'pro',
    tags: ['International', 'US Tech', 'Global', 'Diversification'],
    holdingsDistribution: [
      { label: 'India Equity', value: 65, color: '#C5F135' },
      { label: 'US / Global', value: 35, color: '#7B2FBE' },
    ],
    holdings: [
      { fundId: 'f001', fundName: 'Mirae Asset Large Cap Fund', weight: 35 },
      { fundId: 'f002', fundName: 'Parag Parikh Flexi Cap Fund', weight: 30 },
    ],
  },
  {
    id: 'sf008',
    name: 'Sahi Momentum Quant',
    description:
      'A pure quantitative strategy that rotates into the top-performing mid and small cap funds each month based on momentum signals.',
    methodology:
      "Uses Sahi's 5-factor momentum model — 3M price momentum, earnings revision, relative strength, volume trend, and sector rotation signal — to pick 4 funds from a universe of 60. Monthly rebalancing.",
    managerName: 'Sahi Research Desk',
    managerCompany: 'SahiMF / Arqentis',
    fundCount: 4,
    minAmount: 25000,
    rebalanceFrequency: 'Monthly',
    lastRebalance: '2026-06-01',
    nextRebalance: '2026-07-01',
    returns: { '1M': 5.4, '3M': 14.2, '6M': 23.8, '1Y': 34.6, '3Y': 26.1 },
    volatility: 'High',
    accessTier: 'pro',
    tags: ['Quant', 'Momentum', 'High Alpha', 'PRO Exclusive'],
    holdingsDistribution: [
      { label: 'Mid Cap', value: 50, color: '#7B2FBE' },
      { label: 'Small Cap', value: 50, color: '#EF4444' },
    ],
    holdings: [
      { fundId: 'f005', fundName: 'HDFC Mid-Cap Opportunities Fund', weight: 30 },
      { fundId: 'f006', fundName: 'SBI Small Cap Fund', weight: 30 },
      { fundId: 'f002', fundName: 'Parag Parikh Flexi Cap Fund', weight: 40 },
    ],
  },
  {
    id: 'sf009',
    name: 'Sahi Retirement Builder',
    description:
      'A long-horizon allocation tuned for steady compounding into retirement — heavier on quality large caps with a debt cushion.',
    methodology:
      'Glide-path allocation that gradually de-risks as the target date nears. Annual rebalance with a quality and low-volatility tilt.',
    managerName: 'Sahi Research Desk',
    managerCompany: 'SahiMF / Arqentis',
    fundCount: 5,
    minAmount: 5000,
    rebalanceFrequency: 'Yearly',
    lastRebalance: '2026-01-01',
    nextRebalance: '2027-01-01',
    returns: { '1M': 1.4, '3M': 4.1, '6M': 8.2, '1Y': 14.1, '3Y': 12.8 },
    volatility: 'Low',
    accessTier: 'free',
    tags: ['Retirement', 'Long Term', 'Low Risk'],
    holdingsDistribution: [
      { label: 'Large Cap', value: 55, color: '#C5F135' },
      { label: 'Debt', value: 35, color: '#7B2FBE' },
      { label: 'Gold', value: 10, color: '#F59E0B' },
    ],
    holdings: [
      { fundId: 'f001', fundName: 'Mirae Asset Large Cap Fund', weight: 40 },
      { fundId: 'f008', fundName: 'Kotak Gilt Fund', weight: 35 },
    ],
  },
  {
    id: 'sf010',
    name: 'Sahi Tax Saver ELSS',
    description:
      'A curated set of ELSS funds for 80C tax savings with a 3-year lock-in and strong long-term equity track records.',
    methodology:
      'Screens ELSS funds on rolling 5Y returns, expense ratio and downside capture. Equal-weighted across 3 funds, reviewed yearly.',
    managerName: 'Sahi Research Desk',
    managerCompany: 'SahiMF / Arqentis',
    fundCount: 3,
    minAmount: 500,
    rebalanceFrequency: 'Yearly',
    lastRebalance: '2026-01-01',
    nextRebalance: '2027-01-01',
    returns: { '1M': 3.1, '3M': 9.2, '6M': 15.6, '1Y': 24.2, '3Y': 19.4 },
    volatility: 'Moderate',
    accessTier: 'free',
    tags: ['ELSS', 'Tax Saving', '80C'],
    holdingsDistribution: [
      { label: 'Large Cap', value: 50, color: '#C5F135' },
      { label: 'Mid Cap', value: 35, color: '#7B2FBE' },
      { label: 'Small Cap', value: 15, color: '#EF4444' },
    ],
    holdings: [
      { fundId: 'f002', fundName: 'Parag Parikh Flexi Cap Fund', weight: 50 },
      { fundId: 'f005', fundName: 'HDFC Mid-Cap Opportunities Fund', weight: 50 },
    ],
  },
  {
    id: 'sf011',
    name: 'Sahi Steady Income',
    description:
      'A conservative debt-oriented allocation for capital preservation and predictable income with minimal volatility.',
    methodology:
      'Blends short-duration and corporate bond funds with a small equity sleeve. Duration kept low to limit interest-rate risk.',
    managerName: 'Sahi Research Desk',
    managerCompany: 'SahiMF / Arqentis',
    fundCount: 3,
    minAmount: 5000,
    rebalanceFrequency: 'Quarterly',
    lastRebalance: '2026-04-01',
    nextRebalance: '2026-07-01',
    returns: { '1M': 0.7, '3M': 2.1, '6M': 4.3, '1Y': 8.1, '3Y': 7.2 },
    volatility: 'Low',
    accessTier: 'pro',
    tags: ['Debt', 'Income', 'Capital Preservation'],
    holdingsDistribution: [
      { label: 'Debt', value: 85, color: '#7B2FBE' },
      { label: 'Equity', value: 15, color: '#C5F135' },
    ],
    holdings: [
      { fundId: 'f008', fundName: 'Kotak Gilt Fund', weight: 60 },
      { fundId: 'f007', fundName: 'ICICI Prudential Balanced Advantage Fund', weight: 40 },
    ],
  },
  {
    id: 'sf012',
    name: 'Sahi Bluechip Core',
    description:
      'A simple, low-cost core of large-cap funds for investors who want broad-market equity exposure without the noise.',
    methodology:
      'Two-fund large-cap core selected on consistency and low expense. Rebalanced half-yearly to keep weights in band.',
    managerName: 'Sahi Research Desk',
    managerCompany: 'SahiMF / Arqentis',
    fundCount: 2,
    minAmount: 5000,
    rebalanceFrequency: 'Half-Yearly',
    lastRebalance: '2026-01-01',
    nextRebalance: '2026-07-01',
    returns: { '1M': 2.2, '3M': 6.4, '6M': 11.2, '1Y': 18.9, '3Y': 15.1 },
    volatility: 'Moderate',
    accessTier: 'free',
    tags: ['Large Cap', 'Bluechip', 'Core'],
    holdingsDistribution: [
      { label: 'Large Cap', value: 100, color: '#C5F135' },
    ],
    holdings: [
      { fundId: 'f001', fundName: 'Mirae Asset Large Cap Fund', weight: 50 },
      { fundId: 'f002', fundName: 'Parag Parikh Flexi Cap Fund', weight: 50 },
    ],
  },
]

import type { SahiFund } from '../types'

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
    volatility: 'Medium',
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
    volatility: 'Medium',
    accessTier: 'pro',
    tags: ['Index', 'Passive', 'Low Cost', 'Nifty 50'],
    holdingsDistribution: [
      { label: 'Nifty 50', value: 60, color: '#C5F135' },
      { label: 'Nifty Next 50', value: 25, color: '#7B2FBE' },
      { label: 'Midcap 150', value: 15, color: '#22C55E' },
    ],
  },
]

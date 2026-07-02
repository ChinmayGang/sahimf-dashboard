// Overlap Lens module — all data isolated here

export const SECTOR_WEIGHTS: Record<string, Record<string, number>> = {
  f001: { Banking: 32, IT: 19, 'Consumer Staples': 12, Healthcare: 10, Auto: 5, Energy: 8, Infra: 6, Others: 8 },
  f002: { Banking: 18, IT: 12, 'Consumer Staples': 8, Healthcare: 6, Auto: 3, Energy: 4, 'International': 25, Others: 24 },
  f003: { Banking: 4,  IT: 2,  'Consumer Staples': 2, Healthcare: 4, Auto: 4, Energy: 48, Infra: 22, Others: 14 },
  f004: { Banking: 35, IT: 22, 'Consumer Staples': 12, Healthcare: 5, Auto: 5, Energy: 14, Infra: 4, Others: 3 },
  f005: { Banking: 14, IT: 8,  'Consumer Staples': 5, Healthcare: 17, Auto: 14, Energy: 4, Specialty: 13, Others: 25 },
  f006: { Banking: 4,  IT: 6,  'Consumer Staples': 4, Healthcare: 15, Auto: 8, Energy: 2, Infra: 16, Others: 45 },
  f007: { Banking: 29, IT: 18, 'Consumer Staples': 12, Healthcare: 8, Auto: 11, Energy: 8, Infra: 6, Others: 8 },
  f008: { Banking: 24, IT: 16, 'Consumer Staples': 9, Healthcare: 17, Auto: 14, Energy: 0, Specialty: 8, Others: 12 },
  f009: { Banking: 30, IT: 16, 'Consumer Staples': 13, Healthcare: 10, Auto: 9, Energy: 11, Infra: 4, Others: 7 },
  f010: { Banking: 33, IT: 20, 'Consumer Staples': 11, Healthcare: 7, Auto: 7, Energy: 10, Infra: 5, Others: 7 },
}

export const NIFTY_WEIGHTS: Record<string, number> = {
  Banking: 28, IT: 15, 'Consumer Staples': 9, Healthcare: 8, Auto: 7, Energy: 12, Infra: 6, Others: 15,
}

// Overlap % between any two funds (symmetric)
const RAW_PAIRS: [string, string, number][] = [
  ['f001','f002', 14], ['f001','f003',  4], ['f001','f004', 36],
  ['f001','f005',  9], ['f001','f006',  3], ['f001','f007', 20],
  ['f001','f008', 32], ['f001','f009', 28], ['f001','f010', 36],
  ['f002','f003',  2], ['f002','f004', 14], ['f002','f005', 18],
  ['f002','f006',  6], ['f002','f007', 16], ['f002','f008', 10],
  ['f002','f009', 12], ['f002','f010', 14],
  ['f003','f004',  5], ['f003','f005',  4], ['f003','f006',  3],
  ['f003','f007',  6], ['f003','f008',  4], ['f003','f009',  5],
  ['f003','f010',  6],
  ['f004','f005',  9], ['f004','f006',  4], ['f004','f007', 22],
  ['f004','f008', 26], ['f004','f009', 38], ['f004','f010', 42],
  ['f005','f006', 22], ['f005','f007', 24], ['f005','f008', 12],
  ['f005','f009',  6], ['f005','f010',  8],
  ['f006','f007',  4], ['f006','f008',  8], ['f006','f009',  5],
  ['f006','f010',  6],
  ['f007','f008', 20], ['f007','f009', 26], ['f007','f010', 28],
  ['f008','f009', 30], ['f008','f010', 34],
  ['f009','f010', 40],
]

export const OVERLAP_PAIRS: Record<string, Record<string, number>> = {}
for (const [a, b, v] of RAW_PAIRS) {
  if (!OVERLAP_PAIRS[a]) OVERLAP_PAIRS[a] = {}
  if (!OVERLAP_PAIRS[b]) OVERLAP_PAIRS[b] = {}
  OVERLAP_PAIRS[a][b] = v
  OVERLAP_PAIRS[b][a] = v
  OVERLAP_PAIRS[a][a] = 100
  OVERLAP_PAIRS[b][b] = 100
}

// Common stocks — weight in each fund (0 = not held)
export type StockHolding = {
  name: string
  niftyWeight: number
  weights: Record<string, number>
}

export const COMMON_STOCKS: StockHolding[] = [
  { name: 'HDFC Bank Ltd',                   niftyWeight: 13.4,
    weights: { f001:9.82, f002:9.20, f003:0,    f004:10.42, f005:0,    f006:0,    f007:9.42, f008:8.62, f009:8.92, f010:10.22 } },
  { name: 'ICICI Bank Ltd',                  niftyWeight: 8.6,
    weights: { f001:8.14, f002:8.96, f003:0,    f004:9.18,  f005:0,    f006:0,    f007:7.82, f008:6.44, f009:7.62, f010:8.42 } },
  { name: 'Infosys Ltd',                     niftyWeight: 6.8,
    weights: { f001:7.42, f002:0,    f003:0,    f004:9.84,  f005:0,    f006:0,    f007:6.82, f008:5.22, f009:6.42, f010:8.22 } },
  { name: 'Tata Consultancy Services Ltd',   niftyWeight: 5.9,
    weights: { f001:6.38, f002:0,    f003:0,    f004:8.62,  f005:0,    f006:0,    f007:5.84, f008:4.82, f009:5.64, f010:7.42 } },
  { name: 'Reliance Industries Ltd',         niftyWeight: 9.2,
    weights: { f001:8.24, f002:0,    f003:4.31, f004:10.44, f005:0,    f006:0,    f007:7.62, f008:0,    f009:5.42, f010:6.82 } },
  { name: 'Bharti Airtel Ltd',               niftyWeight: 3.2,
    weights: { f001:4.63, f002:0,    f003:0,    f004:5.82,  f005:0,    f006:0,    f007:4.22, f008:3.82, f009:4.42, f010:4.82 } },
  { name: 'Kotak Mahindra Bank Ltd',         niftyWeight: 3.8,
    weights: { f001:4.93, f002:0,    f003:0,    f004:6.82,  f005:0,    f006:0,    f007:2.46, f008:3.42, f009:3.82, f010:5.22 } },
  { name: 'Axis Bank Ltd',                   niftyWeight: 3.4,
    weights: { f001:3.90, f002:0,    f003:0,    f004:0,     f005:0,    f006:0,    f007:3.42, f008:0,    f009:4.24, f010:4.62 } },
  { name: 'Larsen & Toubro Ltd',             niftyWeight: 4.1,
    weights: { f001:6.18, f002:0,    f003:0,    f004:6.40,  f005:0,    f006:0,    f007:5.44, f008:0,    f009:3.82, f010:4.22 } },
  { name: 'Sun Pharmaceutical Ind. Ltd',     niftyWeight: 2.4,
    weights: { f001:5.14, f002:0,    f003:0,    f004:0,     f005:4.62, f006:0,    f007:0,    f008:5.82, f009:4.82, f010:0    } },
  { name: 'Hindustan Unilever Ltd',          niftyWeight: 2.8,
    weights: { f001:5.22, f002:0,    f003:0,    f004:3.88,  f005:0,    f006:0,    f007:4.82, f008:0,    f009:5.22, f010:1.94 } },
  { name: 'ITC Ltd',                         niftyWeight: 3.6,
    weights: { f001:4.18, f002:7.82, f003:0,    f004:0,     f005:0,    f006:0,    f007:3.62, f008:0,    f009:4.62, f010:0    } },
  { name: 'Cholamandalam Invest. & Fin.',    niftyWeight: 0.8,
    weights: { f001:0,    f002:0,    f003:0,    f004:0,     f005:5.44, f006:0,    f007:0,    f008:4.82, f009:0,    f010:0    } },
  { name: 'Aavas Financiers Ltd',            niftyWeight: 0,
    weights: { f001:0,    f002:4.36, f003:0,    f004:0,     f005:3.74, f006:0,    f007:0,    f008:0,    f009:0,    f010:0    } },
  { name: 'Minda Industries Ltd',            niftyWeight: 0,
    weights: { f001:0,    f002:0,    f003:0,    f004:0,     f005:5.40, f006:0,    f007:4.18, f008:5.62, f009:0,    f010:0    } },
  { name: 'HCL Technologies Ltd',            niftyWeight: 3.1,
    weights: { f001:4.80, f002:0,    f003:0,    f004:3.94,  f005:0,    f006:0,    f007:3.62, f008:0,    f009:4.34, f010:4.76 } },
  { name: 'State Bank of India',             niftyWeight: 2.8,
    weights: { f001:5.61, f002:0,    f003:0,    f004:0,     f005:0,    f006:0,    f007:5.48, f008:0,    f009:5.18, f010:4.30 } },
  { name: 'Alkem Laboratories Ltd',          niftyWeight: 0,
    weights: { f001:0,    f002:0,    f003:0,    f004:0,     f005:4.18, f006:0,    f007:0,    f008:3.84, f009:0,    f010:0    } },
  { name: 'Torrent Pharmaceuticals Ltd',     niftyWeight: 0,
    weights: { f001:0,    f002:0,    f003:0,    f004:0,     f005:3.82, f006:0,    f007:0,    f008:2.52, f009:0,    f010:0    } },
  { name: 'Maruti Suzuki India Ltd',         niftyWeight: 2.2,
    weights: { f001:4.92, f002:0,    f003:0,    f004:0,     f005:0,    f006:0,    f007:3.82, f008:0,    f009:3.24, f010:3.44 } },
]

// Mock portfolios for OverlapLanding
export type OverlapPortfolio = {
  id: string
  name: string
  fundIds: string[]
  weights: number[] // % allocation per fund (sums to 100)
  totalInvested: number
  xirr: number
}

export const OVERLAP_PORTFOLIOS: OverlapPortfolio[] = [
  {
    id: 'p1',
    name: 'Core Holdings',
    fundIds: ['f001', 'f002', 'f005', 'f007'],
    weights: [35, 25, 20, 20],
    totalInvested: 550000,
    xirr: 18.4,
  },
  {
    id: 'p2',
    name: 'Aggressive Growth',
    fundIds: ['f005', 'f006', 'f008', 'f009'],
    weights: [30, 25, 25, 20],
    totalInvested: 450000,
    xirr: 22.1,
  },
  {
    id: 'p3',
    name: 'Balanced Equity',
    fundIds: ['f004', 'f009', 'f010'],
    weights: [40, 30, 30],
    totalInvested: 300000,
    xirr: 16.8,
  },
]

// Presets for "Top 5 by category"
export type FundPreset = { label: string; ids: string[] }

export const CATEGORY_PRESETS: FundPreset[] = [
  { label: 'Large Cap — by AUM',           ids: ['f010', 'f009', 'f004', 'f001'] },
  { label: 'Large Cap — by 5Y Returns',    ids: ['f010', 'f001', 'f009', 'f004'] },
  { label: 'Mid Cap — by AUM',             ids: ['f005'] },
  { label: 'Mid Cap — by 5Y Returns',      ids: ['f005'] },
  { label: 'Small Cap — by AUM',           ids: ['f006'] },
  { label: 'Small Cap — by 5Y Returns',    ids: ['f006'] },
  { label: 'Large & Mid Cap — by AUM',     ids: ['f008'] },
  { label: 'Flexi Cap — by AUM',           ids: ['f007', 'f002'] },
  { label: 'Flexi Cap — by 5Y Returns',    ids: ['f007', 'f002'] },
]

export const AMC_PRESETS: FundPreset[] = [
  { label: 'HDFC Mutual Fund',         ids: ['f005', 'f007'] },
  { label: 'Mirae Asset',              ids: ['f001', 'f008'] },
  { label: 'SBI Mutual Fund',          ids: ['f006', 'f009'] },
  { label: 'PPFAS Mutual Fund',        ids: ['f002'] },
  { label: 'Axis Mutual Fund',         ids: ['f004'] },
  { label: 'ICICI Prudential MF',      ids: ['f010'] },
  { label: 'DSP Mutual Fund',          ids: ['f003'] },
]

export function getOverlap(a: string, b: string): number {
  if (a === b) return 100
  return OVERLAP_PAIRS[a]?.[b] ?? OVERLAP_PAIRS[b]?.[a] ?? 0
}

export function overlapColor(pct: number): string {
  if (pct >= 35) return '#ef4444'
  if (pct >= 20) return '#f59e0b'
  if (pct >= 10) return '#6366f1'
  return '#22c55e'
}

export function shortFundName(name: string): string {
  return name.replace(/\s*[-–]\s*Direct Plan.*$/i, '').split(' ').slice(0, 4).join(' ')
}

export type PlanTier = 'free' | 'pro' | 'elite'

export interface User {
  id: string
  name: string
  phone: string
  email?: string
  avatar?: string
  plan: PlanTier
  planExpiresAt?: string
}

export interface Fund {
  id: string
  name: string
  amcName: string
  amcLogo?: string
  category: string
  subCategory: string
  nav: number
  navChange: number
  navChangePercent: number
  returns: {
    '1M'?: number
    '6M'?: number
    '1Y'?: number
    '3Y'?: number
    '5Y'?: number
    MAX?: number
  }
  volatility: 'Low' | 'Medium' | 'High'
  expenseRatio: number
  exitLoad: number
  sharpeRatio: number
  fundSize: number
  launchedOn: string
  minSIP: number
  minLumpsum: number
  lockIn: string
  tags: string[]
  constituents?: Constituent[]
}

export interface Constituent {
  sector: string
  holdings: { name: string; weight: number }[]
  totalWeight: number
}

export interface Portfolio {
  id: string
  name: string
  userId: string
  createdAt: string
  holdings: Holding[]
  totalInvested: number
  currentValue: number
  xirr: number
  absoluteReturns: number
  absoluteReturnsPercent: number
}

export interface Holding {
  fundId: string
  fundName: string
  amcName: string
  units: number
  avgNAV: number
  currentNAV: number
  investedAmount: number
  currentValue: number
  gainLoss: number
  gainLossPercent: number
  xirr: number
  category: string
}

export interface Transaction {
  id: string
  portfolioId: string
  fundId: string
  fundName: string
  type: 'SIP' | 'Lumpsum' | 'Redemption' | 'Switch'
  units: number
  nav: number
  amount: number
  date: string
  status: 'Completed' | 'Processing' | 'Failed'
}

export interface SahiFund {
  id: string
  name: string
  description: string
  methodology: string
  managerName: string
  managerCompany: string
  managerLogo?: string
  fundCount: number
  minAmount: number
  rebalanceFrequency: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly'
  lastRebalance: string
  nextRebalance: string
  returns: {
    '1M'?: number
    '3M'?: number
    '6M'?: number
    '1Y'?: number
    '3Y'?: number
  }
  volatility: 'Low' | 'Medium' | 'High'
  accessTier: 'free' | 'pro' | 'elite'
  tags: string[]
  holdings?: SahiFundHolding[]
  holdingsDistribution?: { label: string; value: number; color: string }[]
  factsheetUrl?: string
}

export interface SahiFundHolding {
  fundId: string
  fundName: string
  weight: number
}

export interface AMC {
  id: string
  name: string
  logo?: string
  sebiRegNo: string
  fundsManaged: number
  aum: number
  description: string
  website: string
  managers: FundManager[]
}

export interface FundManager {
  name: string
  designation: string
  experience: string
  fundsManaged: number
}

export interface NavDataPoint {
  date: string
  value: number
}

export interface PortfolioDataPoint {
  date: string
  invested: number
  current: number
}

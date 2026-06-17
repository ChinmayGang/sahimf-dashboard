import type { Portfolio, PortfolioDataPoint } from '../types'

export const mockPortfolios: Portfolio[] = [
  {
    id: 'p001',
    name: 'Primary Portfolio',
    userId: 'u003',
    createdAt: '2022-01-15',
    totalInvested: 450000,
    currentValue: 612480,
    xirr: 18.4,
    absoluteReturns: 162480,
    absoluteReturnsPercent: 36.1,
    holdings: [
      {
        fundId: 'f001',
        fundName: 'Mirae Asset Large Cap Fund',
        amcName: 'Mirae Asset',
        units: 1842.6,
        avgNAV: 84.32,
        currentNAV: 104.52,
        investedAmount: 155400,
        currentValue: 192582,
        gainLoss: 37182,
        gainLossPercent: 23.9,
        xirr: 16.8,
        category: 'Large Cap',
      },
      {
        fundId: 'f002',
        fundName: 'Parag Parikh Flexi Cap Fund',
        amcName: 'PPFAS Mutual Fund',
        units: 1428.4,
        avgNAV: 58.62,
        currentNAV: 82.34,
        investedAmount: 83740,
        currentValue: 117578,
        gainLoss: 33838,
        gainLossPercent: 40.4,
        xirr: 22.1,
        category: 'Flexi Cap',
      },
      {
        fundId: 'f005',
        fundName: 'HDFC Mid-Cap Opportunities Fund',
        amcName: 'HDFC Mutual Fund',
        units: 872.3,
        avgNAV: 126.48,
        currentNAV: 198.45,
        investedAmount: 110280,
        currentValue: 173068,
        gainLoss: 62788,
        gainLossPercent: 56.9,
        xirr: 24.6,
        category: 'Mid Cap',
      },
      {
        fundId: 'f007',
        fundName: 'ICICI Prudential Balanced Advantage Fund',
        amcName: 'ICICI Prudential',
        units: 1486.2,
        avgNAV: 67.28,
        currentNAV: 68.32,
        investedAmount: 100000,
        currentValue: 101546,
        gainLoss: 1546,
        gainLossPercent: 1.5,
        xirr: 8.4,
        category: 'Hybrid',
      },
      {
        fundId: 'f008',
        fundName: 'Kotak Gilt Fund',
        amcName: 'Kotak Mutual Fund',
        units: 434.8,
        avgNAV: 92.12,
        currentNAV: 92.18,
        investedAmount: 40042,
        currentValue: 40069,
        gainLoss: 27,
        gainLossPercent: 0.07,
        xirr: 6.2,
        category: 'Debt',
      },
    ],
  },
  {
    id: 'p002',
    name: 'Goal: Child Education',
    userId: 'u003',
    createdAt: '2023-06-01',
    totalInvested: 120000,
    currentValue: 138640,
    xirr: 22.1,
    absoluteReturns: 18640,
    absoluteReturnsPercent: 15.5,
    holdings: [
      {
        fundId: 'f006',
        fundName: 'SBI Small Cap Fund',
        amcName: 'SBI Mutual Fund',
        units: 628.4,
        avgNAV: 114.24,
        currentNAV: 142.76,
        investedAmount: 71800,
        currentValue: 89726,
        gainLoss: 17926,
        gainLossPercent: 24.9,
        xirr: 26.4,
        category: 'Small Cap',
      },
      {
        fundId: 'f002',
        fundName: 'Parag Parikh Flexi Cap Fund',
        amcName: 'PPFAS Mutual Fund',
        units: 584.6,
        avgNAV: 82.28,
        currentNAV: 82.34,
        investedAmount: 48100,
        currentValue: 48135,
        gainLoss: 35,
        gainLossPercent: 0.07,
        xirr: 18.2,
        category: 'Flexi Cap',
      },
    ],
  },
]

export const getMockPortfolioHistory = (): PortfolioDataPoint[] => {
  const data: PortfolioDataPoint[] = []
  const now = new Date()
  let invested = 200000
  let current = 200000
  for (let i = 24; i >= 0; i--) {
    const date = new Date(now)
    date.setMonth(date.getMonth() - i)
    if (i % 3 === 0) invested += 50000
    current = current * (1 + (Math.random() - 0.35) * 0.06)
    if (current < invested) current = invested * 1.02
    data.push({
      date: date.toISOString().split('T')[0],
      invested: parseFloat(invested.toFixed(0)),
      current: parseFloat(current.toFixed(0)),
    })
  }
  return data
}

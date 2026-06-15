import type { Transaction } from '../types'

export const mockTransactions: Transaction[] = [
  { id: 't001', portfolioId: 'p001', fundId: 'f001', fundName: 'Mirae Asset Large Cap Fund', type: 'SIP', units: 9.56, nav: 104.52, amount: 1000, date: '2026-06-01', status: 'Completed' },
  { id: 't002', portfolioId: 'p001', fundId: 'f002', fundName: 'Parag Parikh Flexi Cap Fund', type: 'SIP', units: 12.14, nav: 82.34, amount: 1000, date: '2026-06-01', status: 'Completed' },
  { id: 't003', portfolioId: 'p001', fundId: 'f005', fundName: 'HDFC Mid-Cap Opportunities Fund', type: 'SIP', units: 5.04, nav: 198.45, amount: 1000, date: '2026-06-01', status: 'Processing' },
  { id: 't004', portfolioId: 'p001', fundId: 'f001', fundName: 'Mirae Asset Large Cap Fund', type: 'SIP', units: 9.61, nav: 103.98, amount: 1000, date: '2026-05-01', status: 'Completed' },
  { id: 't005', portfolioId: 'p001', fundId: 'f002', fundName: 'Parag Parikh Flexi Cap Fund', type: 'Lumpsum', units: 60.71, nav: 82.34, amount: 5000, date: '2026-04-15', status: 'Completed' },
  { id: 't006', portfolioId: 'p001', fundId: 'f005', fundName: 'HDFC Mid-Cap Opportunities Fund', type: 'SIP', units: 5.08, nav: 196.80, amount: 1000, date: '2026-05-01', status: 'Completed' },
  { id: 't007', portfolioId: 'p001', fundId: 'f007', fundName: 'ICICI Prudential Balanced Advantage Fund', type: 'Lumpsum', units: 731.7, nav: 68.32, amount: 50000, date: '2026-03-20', status: 'Completed' },
  { id: 't008', portfolioId: 'p001', fundId: 'f008', fundName: 'Kotak Gilt Fund', type: 'Lumpsum', units: 108.5, nav: 92.18, amount: 10000, date: '2026-02-10', status: 'Completed' },
  { id: 't009', portfolioId: 'p001', fundId: 'f001', fundName: 'Mirae Asset Large Cap Fund', type: 'Redemption', units: 50.0, nav: 101.20, amount: 5060, date: '2026-01-15', status: 'Completed' },
  { id: 't010', portfolioId: 'p001', fundId: 'f006', fundName: 'SBI Small Cap Fund', type: 'SIP', units: 5.81, nav: 172.12, amount: 1000, date: '2026-06-01', status: 'Failed' },
  { id: 't011', portfolioId: 'p002', fundId: 'f003', fundName: 'DSP Natural Res & New Energy Fund', type: 'SIP', units: 8.40, nav: 119.04, amount: 1000, date: '2026-06-01', status: 'Completed' },
  { id: 't012', portfolioId: 'p002', fundId: 'f004', fundName: 'Nippon India Small Cap Fund', type: 'SIP', units: 5.26, nav: 190.10, amount: 1000, date: '2026-06-01', status: 'Completed' },
  { id: 't013', portfolioId: 'p002', fundId: 'f003', fundName: 'DSP Natural Res & New Energy Fund', type: 'Switch', units: 16.80, nav: 119.04, amount: 2000, date: '2026-05-18', status: 'Completed' },
  { id: 't014', portfolioId: 'p001', fundId: 'f001', fundName: 'Mirae Asset Large Cap Fund', type: 'SIP', units: 9.48, nav: 105.38, amount: 1000, date: '2026-04-01', status: 'Completed' },
  { id: 't015', portfolioId: 'p001', fundId: 'f002', fundName: 'Parag Parikh Flexi Cap Fund', type: 'SIP', units: 12.80, nav: 78.12, amount: 1000, date: '2026-03-01', status: 'Completed' },
]

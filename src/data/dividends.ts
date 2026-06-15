export interface DividendRecord {
  id: string
  fundName: string
  amcName: string
  category: string
  recordDate: string
  dividendPerUnit: number
  dividendType: 'IDCW' | 'Growth'
  frequency: 'Monthly' | 'Quarterly' | 'Annual' | 'Special'
}

export const mockDividends: DividendRecord[] = [
  { id: 'd001', fundName: 'HDFC Liquid Fund - IDCW', amcName: 'HDFC Mutual Fund', category: 'Debt - Liquid', recordDate: '2026-06-10', dividendPerUnit: 0.0812, dividendType: 'IDCW', frequency: 'Monthly' },
  { id: 'd002', fundName: 'ICICI Pru Savings Fund - IDCW', amcName: 'ICICI Prudential', category: 'Debt - Low Duration', recordDate: '2026-06-08', dividendPerUnit: 0.0624, dividendType: 'IDCW', frequency: 'Monthly' },
  { id: 'd003', fundName: 'Kotak Savings Fund - Monthly IDCW', amcName: 'Kotak Mutual Fund', category: 'Debt - Low Duration', recordDate: '2026-06-05', dividendPerUnit: 0.0590, dividendType: 'IDCW', frequency: 'Monthly' },
  { id: 'd004', fundName: 'SBI Magnum Income Fund - Quarterly IDCW', amcName: 'SBI Mutual Fund', category: 'Debt - Medium Duration', recordDate: '2026-05-30', dividendPerUnit: 0.3210, dividendType: 'IDCW', frequency: 'Quarterly' },
  { id: 'd005', fundName: 'Nippon India Income Fund - Quarterly IDCW', amcName: 'Nippon India', category: 'Debt - Medium to Long Duration', recordDate: '2026-05-28', dividendPerUnit: 0.2840, dividendType: 'IDCW', frequency: 'Quarterly' },
  { id: 'd006', fundName: 'DSP Regular Savings Fund - Quarterly IDCW', amcName: 'DSP Mutual Fund', category: 'Hybrid - Conservative', recordDate: '2026-05-25', dividendPerUnit: 0.5120, dividendType: 'IDCW', frequency: 'Quarterly' },
  { id: 'd007', fundName: 'HDFC Balanced Advantage - Annual IDCW', amcName: 'HDFC Mutual Fund', category: 'Hybrid - Balanced Advantage', recordDate: '2026-04-28', dividendPerUnit: 2.4200, dividendType: 'IDCW', frequency: 'Annual' },
  { id: 'd008', fundName: 'ICICI Pru Balanced Advantage - Annual IDCW', amcName: 'ICICI Prudential', category: 'Hybrid - Balanced Advantage', recordDate: '2026-04-20', dividendPerUnit: 1.8600, dividendType: 'IDCW', frequency: 'Annual' },
  { id: 'd009', fundName: 'Mirae Asset Tax Saver Fund - Special', amcName: 'Mirae Asset', category: 'Equity - ELSS', recordDate: '2026-03-28', dividendPerUnit: 3.1500, dividendType: 'IDCW', frequency: 'Special' },
  { id: 'd010', fundName: 'SBI ETF Nifty 50 - Special', amcName: 'SBI Mutual Fund', category: 'Index Fund', recordDate: '2026-03-15', dividendPerUnit: 1.2200, dividendType: 'IDCW', frequency: 'Special' },
  { id: 'd011', fundName: 'Kotak Gilt Fund - Monthly IDCW', amcName: 'Kotak Mutual Fund', category: 'Debt - Gilt', recordDate: '2026-06-12', dividendPerUnit: 0.0960, dividendType: 'IDCW', frequency: 'Monthly' },
  { id: 'd012', fundName: 'PPFAS Tax Return Fund - Annual IDCW', amcName: 'PPFAS Mutual Fund', category: 'Equity - ELSS', recordDate: '2026-04-10', dividendPerUnit: 4.2800, dividendType: 'IDCW', frequency: 'Annual' },
]

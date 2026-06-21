import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowsLeftRight as CompareArrowsIcon } from '@phosphor-icons/react'
import { Plus as AddIcon } from '@phosphor-icons/react'
import { X as CloseIcon } from '@phosphor-icons/react'
import { Check as CheckIcon } from '@phosphor-icons/react'
import { X as XIcon } from '@phosphor-icons/react'
import { User as UserIcon } from '@phosphor-icons/react'
import { ChartBar as BarChartIcon } from '@phosphor-icons/react'
import { Buildings as BuildingsIcon } from '@phosphor-icons/react'
import { ListBullets as ListIcon } from '@phosphor-icons/react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { mockFunds } from '../../data/funds'
import { VolatilityBadge } from '../../components/ui/VolatilityBadge'
import { PlanGate } from '../../components/ui/PlanGate'
import { AnimatedBorderCard } from '../../components/ui/AnimatedBorderCard'
import { ProTrialBanner } from '../../components/ui/ProTrialBanner'
import { useUIStore } from '../../stores/uiStore'
import { usePlan } from '../../hooks/usePlan'

const COLORS = ['#d6fd70', '#4f46e5', '#22C55E', '#F59E0B']

// â”€â”€â”€ Extended mock data for comparison â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FUND_EXTENDED: Record<string, {
  manager: { name: string; exp: string; edu: string; aum: string }
  amcOwner: string
  registrar: string
  custodian: string
  lastDividend: string | null
  pe: number; pb: number; turnover: number
  cashPct: number; equityPct: number
  beta: number; sd: number
  pros: string[]
  cons: string[]
}> = {
  f001: {
    manager: { name: 'Gaurav Khandelwal', exp: '18 yrs', edu: 'MBA Finance, CFA', aum: 'â‚¹74,800 Cr' },
    amcOwner: 'Mirae Asset Global Investments (Korea)',
    registrar: 'KFin Technologies Ltd',
    custodian: 'Deutsche Bank AG',
    lastDividend: null,
    pe: 22.4, pb: 3.8, turnover: 18, cashPct: 3, equityPct: 97,
    beta: 0.92, sd: 13.2,
    pros: ['Consistently beats Nifty 50 over 7Y', 'Low expense ratio (0.54%)', 'Strong risk-adjusted returns', 'Experienced fund manager 18+ years'],
    cons: ['Limited mid/small-cap exposure', 'Correlated to broad market', 'Slight large-cap concentration risk'],
  },
  f002: {
    manager: { name: 'Rajeev Thakkar', exp: '22 yrs', edu: 'CA, CFA', aum: 'â‚¹92,400 Cr' },
    amcOwner: 'PPFAS Asset Management Pvt Ltd (Indian, independent)',
    registrar: 'KFin Technologies Ltd',
    custodian: 'Citibank N.A.',
    lastDividend: null,
    pe: 24.1, pb: 4.2, turnover: 12, cashPct: 12, equityPct: 83,
    beta: 0.78, sd: 11.8,
    pros: ['Global diversification (25% international)', 'Ultra-low turnover 12%', 'CIO manages fund personally', 'High conviction portfolio'],
    cons: ['Higher cash holding reduces upside', 'Smaller domestic mid-cap allocation', 'Concentration in top 10 holdings ~65%'],
  },
  f003: {
    manager: { name: 'Jay Kothari', exp: '14 yrs', edu: 'MBA, CFA Level 2', aum: 'â‚¹12,200 Cr' },
    amcOwner: 'DSP Group (India, family-owned)',
    registrar: 'CAMS (Computer Age Management Services)',
    custodian: 'HDFC Bank Ltd',
    lastDividend: 'Mar 2024 Â· â‚¹1.20/unit',
    pe: 18.6, pb: 2.7, turnover: 35, cashPct: 13, equityPct: 78,
    beta: 1.08, sd: 17.4,
    pros: ['Pure sectoral play on energy transition', 'International FoF exposure to global energy', 'Low AUM â€” nimble portfolio'],
    cons: ['Sectoral concentration risk', 'High beta 1.08', 'International exposure adds currency risk'],
  },
  f004: {
    manager: { name: 'Chirag Setalvad', exp: '20 yrs', edu: 'MBA, CFA', aum: 'â‚¹1,10,600 Cr' },
    amcOwner: 'HDFC Asset Management Company Ltd (BSE listed)',
    registrar: 'CAMS (Computer Age Management Services)',
    custodian: 'Citibank N.A.',
    lastDividend: null,
    pe: 27.8, pb: 4.6, turnover: 22, cashPct: 5, equityPct: 95,
    beta: 0.96, sd: 15.1,
    pros: ['Best-in-class mid-cap 5Y alpha', 'Veteran manager 20 yrs', 'High liquidity, large AUM', 'Consistent dividend history'],
    cons: ['Large AUM may limit small-cap bets', 'Higher P/E than category average', 'Mid-cap drawdowns can be severe'],
  },
  f005: {
    manager: { name: 'R. Srinivasan', exp: '16 yrs', edu: 'MBA Finance', aum: 'â‚¹31,800 Cr' },
    amcOwner: 'SBI Funds Management Ltd (SBI + Amundi JV)',
    registrar: 'CAMS (Computer Age Management Services)',
    custodian: 'Citibank N.A.',
    lastDividend: null,
    pe: 32.4, pb: 5.1, turnover: 28, cashPct: 6, equityPct: 94,
    beta: 1.12, sd: 18.9,
    pros: ['Lowest expense ratio in small-cap category (0.66%)', 'Strong 10Y track record', 'Diversified across 80+ small-cap stocks'],
    cons: ['High beta 1.12 â€” amplifies drawdowns', 'Liquidity risk in small-caps', 'Very high P/E 32.4 â€” priced for perfection'],
  },
  f006: {
    manager: { name: 'Neelesh Surana', exp: '19 yrs', edu: 'MBA, CMA', aum: 'â‚¹44,200 Cr' },
    amcOwner: 'Mirae Asset Global Investments (Korea)',
    registrar: 'KFin Technologies Ltd',
    custodian: 'Deutsche Bank AG',
    lastDividend: null,
    pe: 26.1, pb: 4.0, turnover: 20, cashPct: 4, equityPct: 96,
    beta: 0.88, sd: 12.6,
    pros: ['Low volatility vs peers', 'Strong downside protection', 'Diversified sector allocation'],
    cons: ['Limited global exposure', 'Slightly higher expense vs competition'],
  },
}

const PERF_DATA = Array.from({ length: 24 }, (_, i) => ({
  month: new Date(2024, i, 1).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
  f001: 100 + i * 1.6 + Math.sin(i * 0.5) * 3,
  f002: 100 + i * 2.1 + Math.sin(i * 0.7) * 4,
  f005: 100 + i * 2.6 + Math.sin(i * 0.4) * 5,
  f006: 100 + i * 2.8 + Math.sin(i * 0.9) * 6,
  f003: 100 + i * 1.9 + Math.sin(i * 0.6) * 3.5,
  f004: 100 + i * 2.3 + Math.sin(i * 0.8) * 4.5,
  nifty50: 100 + i * 1.4 + Math.sin(i * 0.45) * 2.5,
}))

const METRICS = [
  { key: '1Y', label: '1Y Return', format: (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`, higherBetter: true },
  { key: '3Y', label: '3Y CAGR', format: (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`, higherBetter: true },
  { key: '5Y', label: '5Y CAGR', format: (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`, higherBetter: true },
  { key: 'expenseRatio', label: 'Expense Ratio', format: (v: number) => `${v.toFixed(2)}%`, higherBetter: false },
  { key: 'sharpeRatio', label: 'Sharpe Ratio', format: (v: number) => v.toFixed(2), higherBetter: true },
  { key: 'fundSize', label: 'Fund Size (Cr)', format: (v: number) => `â‚¹${v.toLocaleString('en-IN')}`, higherBetter: null },
  { key: 'minSIP', label: 'Min SIP', format: (v: number) => `â‚¹${v.toLocaleString('en-IN')}`, higherBetter: null },
  { key: 'nav', label: 'NAV', format: (v: number) => `â‚¹${v.toFixed(2)}`, higherBetter: null },
]

type TabKey = 'overview' | 'manager' | 'portfolio' | 'holdings' | 'fundinfo'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'manager', label: 'Fund Manager' },
  { key: 'portfolio', label: 'Portfolio Details' },
  { key: 'holdings', label: 'Top Holdings' },
  { key: 'fundinfo', label: 'Fund Info' },
]

function getFundVal(fund: typeof mockFunds[0], key: string): number {
  if (key in fund.returns) return (fund.returns as Record<string, number>)[key] ?? 0
  return ((fund as unknown) as Record<string, number>)[key] ?? 0
}

const short = (n: string) => n.split(' ').slice(0, 2).join(' ')

/** Plain-English "Sahi Comparison" summary, derived live from the selected funds â€” the free taste before the PRO tables. */
function sahiComparison(tab: TabKey, funds: typeof mockFunds): string {
  if (funds.length < 2) return 'Add at least two funds to see a Sahi Comparison summary.'
  switch (tab) {
    case 'overview': {
      const bestRet = [...funds].sort((a, b) => (b.returns['1Y'] ?? 0) - (a.returns['1Y'] ?? 0))[0]
      const cheapest = [...funds].sort((a, b) => a.expenseRatio - b.expenseRatio)[0]
      const bestSharpe = [...funds].sort((a, b) => b.sharpeRatio - a.sharpeRatio)[0]
      return `${short(bestRet.name)} leads on 1-year return at +${(bestRet.returns['1Y'] ?? 0).toFixed(1)}%, while ${short(cheapest.name)} is the cheapest to own at a ${cheapest.expenseRatio.toFixed(2)}% expense ratio. On a risk-adjusted basis ${short(bestSharpe.name)} looks strongest (Sharpe ${bestSharpe.sharpeRatio.toFixed(2)}). Lower costs compound over time, so weigh the expense gap against past performance rather than chasing returns alone.`
    }
    case 'manager': {
      const top = funds.map(f => ({ f, e: parseInt(FUND_EXTENDED[f.id]?.manager.exp ?? '0') })).sort((a, b) => b.e - a.e)[0]
      return `${short(top.f.name)} is run by the most experienced manager (${FUND_EXTENDED[top.f.id]?.manager.exp}). A longer tenure usually means a process tested across several market cycles â€” just confirm the manager who built the track record is still the one in charge.`
    }
    case 'holdings': {
      const conc = funds.map(f => {
        const hs = (f.constituents ?? []).flatMap(s => s.holdings)
        const t5 = [...hs].sort((a, b) => b.weight - a.weight).slice(0, 5).reduce((s, h) => s + Math.max(h.weight, 0), 0)
        return { f, t5 }
      }).sort((a, b) => b.t5 - a.t5)[0]
      return `${short(conc.f.name)} is the most concentrated â€” its top 5 holdings alone make up ${conc.t5.toFixed(1)}% of the portfolio. Higher concentration signals conviction but also more single-stock risk; pair it with a more diversified fund to balance.`
    }
    case 'portfolio': {
      const lowPE = funds.map(f => ({ f, pe: FUND_EXTENDED[f.id]?.pe ?? 99 })).sort((a, b) => a.pe - b.pe)[0]
      const lowBeta = funds.map(f => ({ f, b: FUND_EXTENDED[f.id]?.beta ?? 9 })).sort((a, b) => a.b - b.b)[0]
      return `${short(lowPE.f.name)} holds the cheapest portfolio by P/E (${lowPE.pe}), while ${short(lowBeta.f.name)} is the most defensive with the lowest beta (${lowBeta.b.toFixed(2)}) â€” it should fall less than the others in a market drop.`
    }
    case 'fundinfo': {
      const biggest = [...funds].sort((a, b) => b.fundSize - a.fundSize)[0]
      return `${short(biggest.name)} is the largest by AUM (â‚¹${biggest.fundSize.toLocaleString('en-IN')} Cr). Larger funds bring liquidity and stability, while smaller funds can move more nimbly in mid- and small-cap positions.`
    }
  }
}

export function FundComparison() {
  // Pre-seed from a ?funds=id1,id2 deep-link (e.g. the Compare chip on a portfolio card, B1-6).
  const [params] = useSearchParams()
  const seeded = (params.get('funds') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((id) => mockFunds.some((f) => f.id === id))
    .slice(0, 4)
  const [selectedIds, setSelectedIds] = useState<string[]>(seeded.length >= 2 ? seeded : ['f001', 'f002'])
  const [showPicker, setShowPicker] = useState(false)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const lm = useUIStore((s) => s.lightMode)
  const { can } = usePlan()
  const isPro = can('pro')

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#6B7280]' : 'text-[#64748b]'
  const chipBg = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const rowHover = lm ? 'hover:bg-[#F9F9FF]' : 'hover:bg-[#1a2130]'
  const rowBorder = lm ? 'border-[#F0F0F8]' : 'border-[#1e2838]'
  const dividerColor = lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'
  const categoryRowBg = lm ? 'bg-[#F9F9FF]' : 'bg-[#0a0c0e]'
  const proPlaceholder = lm ? 'text-[#D1D5DB]' : 'text-[#1e2838]'
  const tooltipStyle = {
    background: lm ? '#fff' : '#14171c',
    border: `1px solid ${lm ? '#E0E3E8' : '#1e2838'}`,
    borderRadius: 8,
  }
  const chartGrid = lm ? '#E0E3E8' : '#1e2838'
  const chartTick = lm ? '#9CA3AF' : '#64748b'

  const selectedFunds = selectedIds.map((id) => mockFunds.find((f) => f.id === id)).filter(Boolean) as typeof mockFunds

  const addFund = (id: string) => {
    if (selectedIds.length < 4 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id])
    }
    setShowPicker(false)
    setSearch('')
  }

  const removeFund = (id: string) => setSelectedIds(selectedIds.filter((x) => x !== id))

  const filteredFunds = mockFunds.filter((f) => !selectedIds.includes(f.id) && f.name.toLowerCase().includes(search.toLowerCase()))

  const bestIdx = (key: string, higherBetter: boolean | null) => {
    if (higherBetter === null) return -1
    const vals = selectedFunds.map((f) => getFundVal(f, key))
    return higherBetter ? vals.indexOf(Math.max(...vals)) : vals.indexOf(Math.min(...vals))
  }

  const cols = `200px repeat(${selectedFunds.length}, 1fr)`

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #8c34ee, #4f46e5)', boxShadow: '0 4px 16px rgba(140,52,238,0.25)' }}>
            <span style={{ color: '#d6fd70' }}><CompareArrowsIcon size={20} weight="fill" /></span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-xl font-black tracking-tight text-[#111827]">Fund Comparison</h1>
              <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#eeedfd] text-[#4f46e5]">Research Tool</span>
            </div>
            <p className="text-xs text-[#6B7280]">Compare up to 4 funds side-by-side â€” manager profile, top holdings, portfolio ratios &amp; more</p>
          </div>
        </div>
        <div className="flex-shrink-0 flex gap-2">
          {[
            { label: 'Comparing', value: `${selectedFunds.length} funds` },
            { label: 'Best 1Y', value: `+${Math.max(...selectedFunds.map(f => f.returns['1Y'] ?? 0)).toFixed(1)}%` },
            { label: 'Lowest Expense', value: `${Math.min(...selectedFunds.map(f => f.expenseRatio)).toFixed(2)}%` },
          ].map(s => (
            <div key={s.label} className="text-center px-3 py-2 rounded-xl bg-white border border-[#E0E3E8]">
              <p className="text-sm font-bold text-[#4f46e5] leading-none">{s.value}</p>
              <p className="text-[10px] text-[#6B7280] mt-0.5 whitespace-nowrap">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Fund selector row */}
      <div className="flex gap-3 flex-wrap">
        {selectedFunds.map((fund, idx) => (
          <div key={fund.id} className={`flex items-center gap-2 ${chipBg} rounded-xl px-3 py-2`}>
            <div className="w-2 h-2 rounded-full" style={{ background: COLORS[idx] }} />
            <span className={`text-sm font-medium ${text} max-w-48 truncate`}>{fund.name}</span>
            <button onClick={() => removeFund(fund.id)} className={`${textMuted} hover:text-[#EF4444] transition-colors ml-1`}>
              <CloseIcon size={14} weight="regular" />
            </button>
          </div>
        ))}
        {selectedIds.length < 4 && (
          <div className="relative">
            <button
              onClick={() => setShowPicker(!showPicker)}
              className={`flex items-center gap-1.5 ${lm ? 'bg-white border-[#E0E3E8]' : 'bg-[#14171c] border-[#1e2838]'} border border-dashed rounded-xl px-3 py-2 text-sm ${textMuted} hover:border-[#4f46e5] hover:text-[#4f46e5] transition-all`}
            >
              <AddIcon size={16} weight="fill" /> Add Fund
            </button>
            {showPicker && (
              <div className={`absolute top-full mt-2 left-0 z-20 w-72 ${lm ? 'bg-white border-[#E0E3E8]' : 'bg-[#14171c] border-[#1e2838]'} border rounded-xl shadow-2xl p-2`}>
                <input
                  autoFocus value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search fund..."
                  className={`w-full ${lm ? 'bg-[#F9F9FF] border-[#E0E3E8] text-[#111827]' : 'bg-[#14171c] border-[#1e2838] text-white'} border rounded-lg px-3 py-2 text-sm outline-none placeholder-[#9CA3AF] mb-2`}
                />
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredFunds.slice(0, 8).map((f) => (
                    <button key={f.id} onClick={() => addFund(f.id)} className={`w-full text-left px-3 py-2 rounded-lg ${lm ? 'hover:bg-[#F3F4F6]' : 'hover:bg-[#1e2838]'} transition-colors`}>
                      <p className={`text-sm ${text} truncate`}>{f.name}</p>
                      <p className={`text-[11px] ${textMuted}`}>{f.subCategory}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div className={`flex gap-1 p-1 rounded-xl ${lm ? 'bg-[#F3F4F6]' : 'bg-[#0a0c0e]'}`}>
        {TABS.map(tab => {
          const icons: Record<TabKey, React.ReactNode> = {
            overview: <CompareArrowsIcon size={12} weight="fill" />,
            manager: <UserIcon size={12} weight="fill" />,
            portfolio: <BarChartIcon size={12} weight="fill" />,
            holdings: <ListIcon size={12} weight="fill" />,
            fundinfo: <BuildingsIcon size={12} weight="fill" />,
          }
          const active = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-1 justify-center ${active ? (lm ? 'bg-white text-[#111827] shadow-sm' : 'bg-[#14171c] text-white') : (lm ? 'text-[#6B7280]' : 'text-[#64748b]')}`}
            >
              {icons[tab.key]}
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Sahi Comparison â€” PRO only */}
      <PlanGate requiredTier="pro" label="Sahi Comparison â€” PRO" feature="Sahi Comparison" featureDesc="Plain-English fund analysis generated by SahiMF research desk.">
        <AnimatedBorderCard badge="SAHI COMPARISON">
          <div className="px-4 pb-4">
            <p className="text-sm text-[#374151] leading-relaxed">{sahiComparison(activeTab, selectedFunds)}</p>
          </div>
        </AnimatedBorderCard>
      </PlanGate>

      {/* â”€â”€ OVERVIEW TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === 'overview' && (
        <>
          {/* Performance Chart */}
          <div className={`${card} rounded-2xl p-5`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-sm font-semibold ${text}`}>Performance (indexed to 100)</h2>
              <div className="flex items-center gap-3 flex-wrap">
                {selectedFunds.map((f, idx) => (
                  <div key={f.id} className="flex items-center gap-1.5">
                    <div className="w-4 h-0.5 rounded" style={{ background: COLORS[idx] }} />
                    <span className={`text-xs ${textSub}`}>{f.name.split(' ')[0]}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-0" style={{ borderTop: '2px dashed #64748b', display: 'inline-block' }} />
                  <span className={`text-xs ${textSub}`}>Nifty 50</span>
                </div>
              </div>
            </div>
            <PlanGate requiredTier="pro" label="Unlock Performance Comparison">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={PERF_DATA}>
                  <defs>
                    {selectedIds.map((id, idx) => (
                      <linearGradient key={id} id={`cmpGrad${idx}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS[idx]} stopOpacity={0.12} />
                        <stop offset="95%" stopColor={COLORS[idx]} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: chartTick }} tickLine={false} axisLine={false} interval={3} />
                  <YAxis tick={{ fontSize: 10, fill: chartTick }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: lm ? '#6B7280' : '#8390a2', fontSize: 11 }}
                    formatter={(v, name) => [Number(v).toFixed(1), name === 'nifty50' ? 'Nifty 50' : name]} />
                  <Area type="monotone" dataKey="nifty50" stroke="#64748b" strokeWidth={1.5} strokeDasharray="5 3" fill="none" dot={false} />
                  {selectedIds.map((id, idx) => (
                    <Area key={id} type="monotone" dataKey={id} stroke={COLORS[idx]} strokeWidth={2} fill={`url(#cmpGrad${idx})`} dot={false} />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </PlanGate>
          </div>

          {/* Metrics table */}
          <div className={`${card} rounded-2xl overflow-hidden`}>
            <div className={`border-b ${dividerColor}`} style={{ display: 'grid', gridTemplateColumns: cols }}>
              <div className={`px-5 py-3 text-[11px] font-semibold ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} uppercase tracking-wider`}>Metric</div>
              {selectedFunds.map((f, idx) => (
                <div key={f.id} className="px-4 py-3 text-center">
                  <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ background: COLORS[idx] }} />
                  <p className={`text-xs font-semibold ${text} truncate`}>{f.name.split(' ').slice(0, 3).join(' ')}</p>
                  <VolatilityBadge level={f.volatility} />
                </div>
              ))}
            </div>
            <div className={`border-b ${rowBorder} ${categoryRowBg}`} style={{ display: 'grid', gridTemplateColumns: cols }}>
              <div className={`px-5 py-2 text-[11px] ${textMuted}`}>Category</div>
              {selectedFunds.map((f) => (
                <div key={f.id} className="px-4 py-2 text-center">
                  <p className={`text-xs ${textSub}`}>{f.subCategory}</p>
                </div>
              ))}
            </div>
            <div className={`border-b ${rowBorder} ${categoryRowBg}`} style={{ display: 'grid', gridTemplateColumns: cols }}>
              <div className={`px-5 py-2.5 text-[11px] font-semibold ${textMuted} flex items-center gap-1.5`}>
                <div className="w-3 h-0" style={{ borderTop: '2px dashed #64748b', display: 'inline-block' }} />
                vs Nifty 50 (1Y)
              </div>
              {selectedFunds.map((fund) => {
                const ret1Y = getFundVal(fund, '1Y')
                const nifty1Y = 14.2
                const alpha = (ret1Y - nifty1Y).toFixed(1)
                return (
                  <div key={fund.id} className="px-4 py-2.5 text-center">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md"
                      style={Number(alpha) >= 0
                        ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e' }
                        : { background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                      {Number(alpha) >= 0 ? '+' : ''}{alpha}% alpha
                    </span>
                  </div>
                )
              })}
            </div>
            {METRICS.map((m) => (
              <div key={m.key} className={`border-b ${rowBorder} last:border-0 ${rowHover} transition-colors`} style={{ display: 'grid', gridTemplateColumns: cols }}>
                <div className={`px-5 py-3 text-sm ${textSub}`}>{m.label}</div>
                {selectedFunds.map((fund, idx) => {
                  const val = getFundVal(fund, m.key)
                  const best = bestIdx(m.key, m.higherBetter)
                  const isBest = best === idx
                  const needsGate = (m.key === '3Y' || m.key === '5Y') && idx > 0
                  return (
                    <div key={fund.id} className="px-4 py-3 text-center">
                      {needsGate ? (
                        <span className={`text-xs ${proPlaceholder}`}>â€” PRO</span>
                      ) : (
                        <span className={`text-sm font-semibold ${isBest ? (lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]') : text}`}>
                          {m.format(val)}
                          {isBest && <span className="text-[10px] ml-1">â˜…</span>}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </>
      )}

      {/* â”€â”€ FUND MANAGER TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === 'manager' && (
        <div className={`${card} rounded-2xl overflow-hidden`}>
          <div className={`border-b ${dividerColor}`} style={{ display: 'grid', gridTemplateColumns: cols }}>
            <div className={`px-5 py-3 text-[11px] font-semibold ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} uppercase tracking-wider`}>Fund Manager</div>
            {selectedFunds.map((f, idx) => (
              <div key={f.id} className="px-4 py-3 text-center">
                <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ background: COLORS[idx] }} />
                <p className={`text-xs font-semibold ${text} truncate`}>{f.name.split(' ').slice(0, 3).join(' ')}</p>
              </div>
            ))}
          </div>

          {[
            { label: 'Manager Name', render: (ext: (typeof FUND_EXTENDED)[string]) => <span className={`text-sm font-semibold ${text}`}>{ext.manager.name}</span> },
            { label: 'Experience', render: (ext: (typeof FUND_EXTENDED)[string]) => <span className={`text-sm ${text}`}>{ext.manager.exp}</span> },
            { label: 'Education', render: (ext: (typeof FUND_EXTENDED)[string]) => <span className={`text-xs ${textSub}`}>{ext.manager.edu}</span> },
            { label: 'Total AUM Managed', render: (ext: (typeof FUND_EXTENDED)[string]) => <span className={`text-sm font-semibold ${lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'}`}>{ext.manager.aum}</span> },
          ].map(row => (
            <div key={row.label} className={`border-b ${rowBorder} last:border-0 ${rowHover} transition-colors`} style={{ display: 'grid', gridTemplateColumns: cols }}>
              <div className={`px-5 py-3 text-sm ${textSub}`}>{row.label}</div>
              {selectedFunds.map((f) => {
                const ext = FUND_EXTENDED[f.id]
                return <div key={f.id} className="px-4 py-3 text-center">{ext ? row.render(ext) : <span className={textMuted}>â€”</span>}</div>
              })}
            </div>
          ))}

          {/* Pros & Cons */}
          <div className={`px-5 py-4 border-t ${dividerColor}`}>
            <p className={`text-[11px] font-semibold ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} uppercase tracking-wider mb-3`}>Pros & Cons</p>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${selectedFunds.length}, 1fr)`, gap: '1rem' }}>
              {selectedFunds.map((f, idx) => {
                const ext = FUND_EXTENDED[f.id]
                if (!ext) return <div key={f.id} />
                return (
                  <div key={f.id} className="space-y-2">
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: COLORS[idx] }} />
                      <span className={`text-xs font-semibold ${text}`}>{f.name.split(' ').slice(0, 2).join(' ')}</span>
                    </div>
                    {ext.pros.map((p, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <CheckIcon size={11} color={lm ? '#16a34a' : '#4ade80'} weight="bold" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span className={`text-[11px] ${textSub}`}>{p}</span>
                      </div>
                    ))}
                    {ext.cons.map((c, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <XIcon size={11} color={lm ? '#dc2626' : '#f87171'} weight="bold" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span className={`text-[11px] ${textSub}`}>{c}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ PORTFOLIO DETAILS TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === 'portfolio' && (
        <PlanGate requiredTier="pro" label="Portfolio Details â€” Sahi PRO">
          <div className={`${card} rounded-2xl overflow-hidden`}>
            <div className={`border-b ${dividerColor}`} style={{ display: 'grid', gridTemplateColumns: cols }}>
              <div className={`px-5 py-3 text-[11px] font-semibold ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} uppercase tracking-wider`}>Portfolio Metric</div>
              {selectedFunds.map((f, idx) => (
                <div key={f.id} className="px-4 py-3 text-center">
                  <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ background: COLORS[idx] }} />
                  <p className={`text-xs font-semibold ${text} truncate`}>{f.name.split(' ').slice(0, 3).join(' ')}</p>
                </div>
              ))}
            </div>

            {[
              { label: 'P/E Ratio', key: 'pe', format: (v: number) => v.toFixed(1), higherBetter: false as (boolean | null) },
              { label: 'P/B Ratio', key: 'pb', format: (v: number) => v.toFixed(1), higherBetter: false as (boolean | null) },
              { label: 'Portfolio Turnover', key: 'turnover', format: (v: number) => `${v}%`, higherBetter: false as (boolean | null) },
              { label: 'Beta (vs Nifty)', key: 'beta', format: (v: number) => v.toFixed(2), higherBetter: false as (boolean | null) },
              { label: 'Std Deviation (1Y)', key: 'sd', format: (v: number) => `${v}%`, higherBetter: false as (boolean | null) },
              { label: 'Equity Allocation', key: 'equityPct', format: (v: number) => `${v}%`, higherBetter: null },
              { label: 'Cash Allocation', key: 'cashPct', format: (v: number) => `${v}%`, higherBetter: null },
              { label: 'Exit Load', key: null, format: null, higherBetter: null },
            ].map(row => {
              if (row.key === null) {
                return (
                  <div key="exitload" className={`border-b ${rowBorder} last:border-0`} style={{ display: 'grid', gridTemplateColumns: cols }}>
                    <div className={`px-5 py-3 text-sm ${textSub}`}>Exit Load</div>
                    {selectedFunds.map((f) => (
                      <div key={f.id} className="px-4 py-3 text-center">
                        <span className={`text-sm ${text}`}>{f.exitLoad}% (1Y)</span>
                      </div>
                    ))}
                  </div>
                )
              }
              const extVals = selectedFunds.map(f => FUND_EXTENDED[f.id]?.[row.key as keyof typeof FUND_EXTENDED[string]] as number ?? 0)
              const bestExtIdx = row.higherBetter === null ? -1 : row.higherBetter
                ? extVals.indexOf(Math.max(...extVals))
                : extVals.indexOf(Math.min(...extVals))
              return (
                <div key={row.key} className={`border-b ${rowBorder} last:border-0 ${rowHover}`} style={{ display: 'grid', gridTemplateColumns: cols }}>
                  <div className={`px-5 py-3 text-sm ${textSub}`}>{row.label}</div>
                  {selectedFunds.map((f, idx) => {
                    const ext = FUND_EXTENDED[f.id]
                    const val = ext ? ext[row.key as keyof typeof ext] as number : 0
                    const isBest = bestExtIdx === idx
                    return (
                      <div key={f.id} className="px-4 py-3 text-center">
                        <span className={`text-sm font-semibold ${isBest ? (lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]') : text}`}>
                          {row.format ? row.format(val) : 'â€”'}
                          {isBest && <span className="text-[10px] ml-1">â˜…</span>}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )
            })}

            {/* Equity/Cash bars */}
            <div className={`px-5 py-4 border-t ${dividerColor}`}>
              <p className={`text-[11px] font-semibold ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} uppercase tracking-wider mb-3`}>Equity vs Cash Split</p>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${selectedFunds.length}, 1fr)`, gap: '1rem' }}>
                {selectedFunds.map((f, idx) => {
                  const ext = FUND_EXTENDED[f.id]
                  if (!ext) return <div key={f.id} />
                  return (
                    <div key={f.id}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: COLORS[idx] }} />
                        <span className={`text-xs font-semibold ${text}`}>{f.name.split(' ').slice(0, 2).join(' ')}</span>
                      </div>
                      <div className="flex rounded-lg overflow-hidden h-4">
                        <div className="flex items-center justify-center text-[9px] font-bold text-white" style={{ width: `${ext.equityPct}%`, background: COLORS[idx] }}>
                          {ext.equityPct}%
                        </div>
                        <div className={`flex items-center justify-center text-[9px] font-bold ${lm ? 'text-[#6B7280]' : 'text-[#505d6f]'}`} style={{ width: `${ext.cashPct}%`, background: lm ? '#E5E7EB' : '#1e2838' }}>
                          {ext.cashPct}%
                        </div>
                        {(100 - ext.equityPct - ext.cashPct) > 0 && (
                          <div className="flex-1" style={{ background: lm ? '#F3F4F6' : '#14171c' }} />
                        )}
                      </div>
                      <div className="flex gap-3 mt-1">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm" style={{ background: COLORS[idx] }} /><span className={`text-[9px] ${textMuted}`}>Equity</span></div>
                        <div className="flex items-center gap-1"><div className={`w-2 h-2 rounded-sm ${lm ? 'bg-[#E5E7EB]' : 'bg-[#1e2838]'}`} /><span className={`text-[9px] ${textMuted}`}>Cash</span></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </PlanGate>
      )}

      {/* â”€â”€ TOP HOLDINGS TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === 'holdings' && (
        <div className="space-y-4">
          {selectedFunds.map((f, idx) => {
            const allHoldings = (f.constituents ?? []).flatMap(s => s.holdings.map(h => ({ ...h, sector: s.sector })))
            const sorted = [...allHoldings].sort((a, b) => b.weight - a.weight)
            const top5 = sorted.slice(0, 5)
            const top10 = sorted.slice(0, 10)
            const totalTop5 = top5.reduce((s, h) => s + Math.max(h.weight, 0), 0)
            const totalTop10 = top10.reduce((s, h) => s + Math.max(h.weight, 0), 0)

            return (
              <div key={f.id} className={`${card} rounded-2xl overflow-hidden`}>
                <div className={`px-5 py-3 border-b ${dividerColor} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[idx] }} />
                    <p className={`text-sm font-semibold ${text}`}>{f.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] ${textMuted}`}>Top 5 = {totalTop5.toFixed(1)}%</span>
                    <span className={`text-[11px] ${textMuted}`}>Top 10 = {totalTop10.toFixed(1)}%</span>
                  </div>
                </div>
                {top10.map((h, i) => (
                  <div key={h.name} className={`flex items-center justify-between px-5 py-2.5 border-b ${rowBorder} last:border-0 ${rowHover} transition-colors`}>
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-bold w-5 text-center ${i < 5 ? (lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]') : textMuted}`}>{i + 1}</span>
                      <div>
                        <p className={`text-sm font-medium ${text}`}>{h.name}</p>
                        <p className={`text-[10px] ${textMuted}`}>{h.sector}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24">
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: lm ? '#E5E7EB' : '#1e2838' }}>
                          <div className="h-full rounded-full" style={{ width: `${Math.min(Math.max(h.weight, 0) / 12 * 100, 100)}%`, background: COLORS[idx] }} />
                        </div>
                      </div>
                      <span className={`text-sm font-bold w-12 text-right ${h.weight < 0 ? (lm ? 'text-[#dc2626]' : 'text-[#f87171]') : text}`}>
                        {h.weight > 0 ? `${h.weight.toFixed(2)}%` : 'â€”'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}

      {/* â”€â”€ FUND INFO TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === 'fundinfo' && (
        <div className={`${card} rounded-2xl overflow-hidden`}>
          <div className={`border-b ${dividerColor}`} style={{ display: 'grid', gridTemplateColumns: cols }}>
            <div className={`px-5 py-3 text-[11px] font-semibold ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} uppercase tracking-wider`}>Fund Information</div>
            {selectedFunds.map((f, idx) => (
              <div key={f.id} className="px-4 py-3 text-center">
                <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ background: COLORS[idx] }} />
                <p className={`text-xs font-semibold ${text} truncate`}>{f.name.split(' ').slice(0, 3).join(' ')}</p>
              </div>
            ))}
          </div>

          {[
            { label: 'AMC Name', render: (f: typeof mockFunds[0]) => f.amcName },
            { label: 'AMC Owner / Group', render: (f: typeof mockFunds[0]) => FUND_EXTENDED[f.id]?.amcOwner ?? 'â€”' },
            { label: 'Inception Date', render: (f: typeof mockFunds[0]) => new Date(f.launchedOn).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) },
            { label: 'AUM', render: (f: typeof mockFunds[0]) => `â‚¹${f.fundSize.toLocaleString('en-IN')} Cr` },
            { label: 'NAV', render: (f: typeof mockFunds[0]) => `â‚¹${f.nav.toFixed(2)}` },
            { label: 'NAV Change (1D)', render: (f: typeof mockFunds[0]) => `${f.navChange >= 0 ? '+' : ''}${f.navChange.toFixed(2)} (${f.navChangePercent >= 0 ? '+' : ''}${f.navChangePercent.toFixed(2)}%)` },
            { label: 'Min SIP', render: (f: typeof mockFunds[0]) => `â‚¹${f.minSIP.toLocaleString('en-IN')}` },
            { label: 'Min Lumpsum', render: (f: typeof mockFunds[0]) => `â‚¹${f.minLumpsum.toLocaleString('en-IN')}` },
            { label: 'Exit Load', render: (f: typeof mockFunds[0]) => `${f.exitLoad}% (within 1Y)` },
            { label: 'Lock-in Period', render: (f: typeof mockFunds[0]) => f.lockIn },
            { label: 'Last Dividend', render: (f: typeof mockFunds[0]) => FUND_EXTENDED[f.id]?.lastDividend ?? 'N/A (Growth plan)' },
            { label: 'Registrar', render: (f: typeof mockFunds[0]) => FUND_EXTENDED[f.id]?.registrar ?? 'â€”' },
            { label: 'Custodian', render: (f: typeof mockFunds[0]) => FUND_EXTENDED[f.id]?.custodian ?? 'â€”' },
          ].map(row => (
            <div key={row.label} className={`border-b ${rowBorder} last:border-0 ${rowHover} transition-colors`} style={{ display: 'grid', gridTemplateColumns: cols }}>
              <div className={`px-5 py-3 text-sm ${textSub}`}>{row.label}</div>
              {selectedFunds.map((f) => (
                <div key={f.id} className="px-4 py-3 text-center">
                  <span className={`text-sm ${text}`}>{row.render(f)}</span>
                </div>
              ))}
            </div>
          ))}

          {/* Tags */}
          <div className={`px-5 py-4 border-t ${dividerColor}`}>
            <p className={`text-[11px] font-semibold ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} uppercase tracking-wider mb-3`}>Tags</p>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${selectedFunds.length}, 1fr)`, gap: '1rem' }}>
              {selectedFunds.map((f) => (
                <div key={f.id} className="flex flex-wrap gap-1">
                  {f.tags.map(tag => (
                    <span key={tag} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${lm ? 'bg-[#F3F4F6] text-[#6B7280]' : 'bg-[#1e2838] text-[#64748b]'}`}>{tag}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!isPro && (
        <ProTrialBanner
          headline="Unlock full fund comparison with Sahi PRO"
          features={['3Y & 5Y returns', 'Portfolio P/E, P/B, Beta, SD', 'Fund manager details & pros/cons', 'Complete fund info & custodian']}
        />
      )}
    </div>
  )
}

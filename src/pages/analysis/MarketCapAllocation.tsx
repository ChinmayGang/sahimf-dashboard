import { useState, useMemo } from 'react'
import { ChartPieSlice, ArrowsClockwise, Warning, TrendUp, Info, UploadSimple } from '@phosphor-icons/react'
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import { useUIStore } from '../../stores/uiStore'
import { useAuthStore } from '../../stores/authStore'
import { mockPortfolios } from '../../data/portfolios'
import { PlanGate } from '../../components/ui/PlanGate'
import { ProButton } from '../../components/ui/ProButton'

// ─── Mock data ────────────────────────────────────────────────────────────────
const FUNDS = [
  {
    id: 'f001', name: 'Mirae Asset Large Cap', category: 'Large Cap',
    large: 87, mid: 11, small: 2,
    aum: '₹37,420 Cr', score: '8.8/10',
    driftFrom: { large: 90, mid: 8, small: 2 },
  },
  {
    id: 'f002', name: 'Parag Parikh Flexi Cap', category: 'Flexi Cap',
    large: 58, mid: 22, small: 12,
    aum: '₹82,640 Cr', score: '9.2/10',
    driftFrom: { large: 65, mid: 20, small: 15 },
  },
  {
    id: 'f003', name: 'SBI Small Cap', category: 'Small Cap',
    large: 4, mid: 18, small: 78,
    aum: '₹28,310 Cr', score: '8.5/10',
    driftFrom: { large: 3, mid: 15, small: 82 },
  },
  {
    id: 'f004', name: 'HDFC Mid-Cap Opps', category: 'Mid Cap',
    large: 14, mid: 68, small: 18,
    aum: '₹69,200 Cr', score: '8.1/10',
    driftFrom: { large: 10, mid: 75, small: 15 },
  },
]

// Weightings in portfolio (by current value)
const WEIGHTS = [0.30, 0.35, 0.20, 0.15]

// Recommended allocation (ideal for a balanced growth investor)
const RECOMMENDED = { large: 50, mid: 30, small: 20 }

const MCAP_COLORS = {
  large: '#4f46e5',
  mid: '#0891b2',
  small: '#d97706',
}

const DRIFT_THRESHOLD = 7 // percentage points

function computePortfolioMix(funds: typeof FUNDS, weights: number[]) {
  let large = 0, mid = 0, small = 0
  funds.forEach((f, i) => {
    large += f.large * weights[i]
    mid += f.mid * weights[i]
    small += f.small * weights[i]
  })
  return { large: Math.round(large), mid: Math.round(mid), small: Math.round(small) }
}

function DriftBadge({ diff, lm }: { diff: number; lm: boolean }) {
  const abs = Math.abs(diff)
  if (abs < 3) return <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${lm ? 'bg-[#f0fdf4] text-[#16a34a]' : 'bg-[#16a34a]/10 text-[#4ade80]'}`}>On track</span>
  if (abs < DRIFT_THRESHOLD) return <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${lm ? 'bg-[#fef9c3] text-[#ca8a04]' : 'bg-[#ca8a04]/15 text-[#facc15]'}`}>Minor drift</span>
  return <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${lm ? 'bg-[#fef2f2] text-[#dc2626]' : 'bg-[#dc2626]/10 text-[#f87171]'}`}>High drift</span>
}

export function MarketCapAllocation() {
  const lm = useUIStore((s) => s.lightMode)
  const { user } = useAuthStore()
  const hasInvestments = mockPortfolios.some(p => p.userId === (user?.id ?? '') && p.holdings.length > 0)

  const [selectedFund, setSelectedFund] = useState<string | null>(null)
  const [rebalanceTarget, setRebalanceTarget] = useState({ large: RECOMMENDED.large, mid: RECOMMENDED.mid, small: RECOMMENDED.small })

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#6B7280]' : 'text-[#64748b]'
  const divider = lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'
  const rowHover = lm ? 'hover:bg-[#F9F9FF]' : 'hover:bg-[#1a2130]'

  const portfolioMix = useMemo(() => computePortfolioMix(FUNDS, WEIGHTS), [])

  const driftAlerts = useMemo(() => FUNDS.map((f, i) => {
    const largeDrift = f.large - f.driftFrom.large
    const midDrift = f.mid - f.driftFrom.mid
    const smallDrift = f.small - f.driftFrom.small
    const maxDrift = Math.max(Math.abs(largeDrift), Math.abs(midDrift), Math.abs(smallDrift))
    return { ...f, largeDrift, midDrift, smallDrift, maxDrift, weight: WEIGHTS[i] }
  }).filter(f => f.maxDrift >= 3).sort((a, b) => b.maxDrift - a.maxDrift), [])

  const pieLargeData = [
    { name: 'Large Cap', value: portfolioMix.large, color: MCAP_COLORS.large },
    { name: 'Mid Cap', value: portfolioMix.mid, color: MCAP_COLORS.mid },
    { name: 'Small Cap', value: portfolioMix.small, color: MCAP_COLORS.small },
  ]

  const allocationCompare = [
    { name: 'Large Cap', current: portfolioMix.large, recommended: RECOMMENDED.large, target: rebalanceTarget.large },
    { name: 'Mid Cap', current: portfolioMix.mid, recommended: RECOMMENDED.mid, target: rebalanceTarget.mid },
    { name: 'Small Cap', current: portfolioMix.small, recommended: RECOMMENDED.small, target: rebalanceTarget.small },
  ]

  const totalRebalanceTarget = rebalanceTarget.large + rebalanceTarget.mid + rebalanceTarget.small

  // Free / zero-investment users have no portfolio to analyse — show guidance instead of empty charts.
  if (!hasInvestments) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #8c34ee, #4f46e5)', boxShadow: '0 4px 16px rgba(140,52,238,0.25)' }}>
            <span style={{ color: '#d6fd70' }}><ChartPieSlice size={20} weight="duotone" /></span>
          </div>
          <div>
            <h1 className={`text-xl font-black tracking-tight ${text}`}>Market Cap Allocation</h1>
            <p className={`text-xs ${textSub}`}>Portfolio market cap mix vs recommended — drift analysis &amp; rebalancing signals</p>
          </div>
        </div>

        <div className={`${card} rounded-2xl p-10 flex flex-col items-center text-center`}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: lm ? '#eeedfd' : 'rgba(79,70,229,0.12)' }}>
            <UploadSimple size={26} color={lm ? '#4f46e5' : '#d6fd70'} weight="duotone" />
          </div>
          <p className={`text-base font-bold ${text} mb-1`}>Upload your portfolio to unlock market-cap analysis</p>
          <p className={`text-sm ${textSub} max-w-md mb-5`}>
            Add your funds or import your CAS statement and we'll break down your large / mid / small-cap mix,
            flag drift from the recommended blend, and simulate a rebalance.
          </p>
          <ProButton label="Add your portfolio" onClick={() => { window.location.href = '/mutual-funds/portfolios' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #8c34ee, #4f46e5)', boxShadow: '0 4px 16px rgba(140,52,238,0.25)' }}>
            <span style={{ color: '#d6fd70' }}><ChartPieSlice size={20} weight="duotone" /></span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-xl font-black tracking-tight text-[#111827]">Market Cap Allocation</h1>
              <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#eeedfd] text-[#4f46e5]">Research Tool</span>
            </div>
            <p className="text-xs text-[#6B7280]">Portfolio market cap mix vs recommended — drift analysis &amp; rebalancing signals</p>
          </div>
        </div>
        <div className="flex-shrink-0 flex gap-2">
          {[
            { label: 'Your Large Cap', value: `${portfolioMix.large}%` },
            { label: 'Your Mid Cap', value: `${portfolioMix.mid}%` },
            { label: 'Your Small Cap', value: `${portfolioMix.small}%` },
          ].map(s => (
            <div key={s.label} className="text-center px-3 py-2 rounded-xl bg-white border border-[#E0E3E8]">
              <p className="text-sm font-bold text-[#4f46e5] leading-none">{s.value}</p>
              <p className="text-[10px] text-[#6B7280] mt-0.5 whitespace-nowrap">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Drift alerts strip */}
      {driftAlerts.length > 0 && (
        <div className={`rounded-xl px-4 py-3 flex items-start gap-3 ${lm ? 'bg-[#fef9c3] border border-[#fde68a]' : 'bg-[#ca8a04]/10 border border-[#ca8a04]/30'}`}>
          <Warning size={16} color={lm ? '#ca8a04' : '#facc15'} weight="duotone" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className={`text-xs font-semibold ${lm ? 'text-[#92400e]' : 'text-[#facc15]'}`}>
              {driftAlerts.length} fund{driftAlerts.length > 1 ? 's have' : ' has'} drifted from expected market cap mix
            </p>
            <p className={`text-[11px] mt-0.5 ${lm ? 'text-[#b45309]' : 'text-[#d97706]'}`}>
              {driftAlerts.map(f => f.name).join(' · ')} — review rebalancing below
            </p>
          </div>
        </div>
      )}

      {/* Overview row: Donut + Bar */}
      <div className="grid grid-cols-[auto_1fr] gap-5">

        {/* Donut */}
        <div className={`${card} rounded-2xl p-5 flex flex-col items-center justify-center gap-4`} style={{ minWidth: 220 }}>
          <p className={`text-xs font-semibold ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} uppercase tracking-wider self-start`}>Portfolio Mix</p>
          <div className="relative">
            <PieChart width={160} height={160}>
              <Pie data={pieLargeData} cx={80} cy={80} innerRadius={50} outerRadius={72} dataKey="value" strokeWidth={0} paddingAngle={2}>
                {pieLargeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-[11px] ${textMuted}`}>Your mix</span>
            </div>
          </div>
          <div className="space-y-1.5 w-full">
            {pieLargeData.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                  <span className={`text-[11px] ${textSub}`}>{d.name}</span>
                </div>
                <span className={`text-[11px] font-bold ${text}`}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Allocation vs Recommended bar chart */}
        <div className={`${card} rounded-2xl p-5`}>
          <p className={`text-xs font-semibold ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} uppercase tracking-wider mb-4`}>Current vs Recommended</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={allocationCompare} barCategoryGap="35%" barGap={4} layout="vertical">
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: lm ? '#9CA3AF' : '#64748b' }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: lm ? '#6B7280' : '#8390a2' }} tickLine={false} axisLine={false} width={80} />
              <RechartsTip
                contentStyle={{ background: lm ? '#fff' : '#14171c', border: `1px solid ${lm ? '#E0E3E8' : '#1e2838'}`, borderRadius: 10, fontSize: 11, color: lm ? '#111827' : '#fff' }}
                formatter={(v, name) => [`${Number(v)}%`, name === 'current' ? 'Your portfolio' : 'Recommended'] as [string, string]}
              />
              <Bar dataKey="current" name="current" radius={[0, 4, 4, 0]} fill={MCAP_COLORS.large}>
                {allocationCompare.map((_d, i) => {
                  const colors = [MCAP_COLORS.large, MCAP_COLORS.mid, MCAP_COLORS.small]
                  return <Cell key={i} fill={colors[i]} />
                })}
              </Bar>
              <Bar dataKey="recommended" name="recommended" radius={[0, 4, 4, 0]} fill={lm ? '#e5e7eb' : '#1e2838'}>
                {allocationCompare.map((_d, i) => {
                  const colors = lm
                    ? ['#c7d2fe', '#bae6fd', '#fde68a']
                    : ['#3730a3', '#0e7490', '#92400e']
                  return <Cell key={i} fill={colors[i]} />
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm" style={{ background: MCAP_COLORS.large }} />
              <span className={`text-[10px] ${textMuted}`}>Your portfolio</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-3 h-2 rounded-sm ${lm ? 'bg-[#c7d2fe]' : 'bg-[#3730a3]'}`} />
              <span className={`text-[10px] ${textMuted}`}>Recommended</span>
            </div>
          </div>

          {/* Diff summary */}
          <div className={`mt-4 grid grid-cols-3 gap-3 pt-3 border-t ${divider}`}>
            {allocationCompare.map(d => {
              const diff = d.current - d.recommended
              const positive = diff > 0
              return (
                <div key={d.name} className="text-center">
                  <p className={`text-[10px] ${textMuted} mb-0.5`}>{d.name}</p>
                  <p className={`text-sm font-bold ${diff === 0 ? text : positive ? (lm ? 'text-[#dc2626]' : 'text-[#f87171]') : (lm ? 'text-[#16a34a]' : 'text-[#4ade80]')}`}>
                    {diff > 0 ? '+' : ''}{diff}%
                  </p>
                  <p className={`text-[9px] ${textMuted}`}>{Math.abs(diff) < 3 ? 'balanced' : positive ? 'overweight' : 'underweight'}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sahi Analysis Research Note — surfaced above the fund table (B7-3) */}
      <div className={`${card} rounded-2xl p-5 space-y-3`}>
        <div className="flex items-center gap-2">
          <TrendUp size={15} color={lm ? '#4f46e5' : '#d6fd70'} weight="duotone" />
          <p className={`text-sm font-semibold ${text}`}>Sahi Analysis · Market Cap Research Note</p>
          <Info size={13} color={textMuted} weight="duotone" />
        </div>
        <PlanGate requiredTier="pro" compact>
          <div className={`space-y-2 text-xs ${textSub} leading-relaxed`}>
            <p>
              Your portfolio is <span className={`font-semibold ${lm ? 'text-[#dc2626]' : 'text-[#f87171]'}`}>overweight large-cap by {portfolioMix.large - RECOMMENDED.large}%</span> relative to the Sahi recommended blend for a balanced growth investor. While large-cap funds offer stability, the excess allocation reduces your long-term wealth compounding potential — SEBI data shows flexi-cap and mid-cap categories have outperformed large-cap by 4-7% CAGR over 10-year rolling periods.
            </p>
            <p>
              <span className="font-semibold" style={{ color: MCAP_COLORS.mid }}>Mid-cap is underweighted by {RECOMMENDED.mid - portfolioMix.mid}%.</span> Historically, Indian mid-caps enter large-cap indices within 5–7 years of strong earnings growth, making this the highest-return segment for investors with a 7+ year horizon.
            </p>
            <p>
              <span className="font-semibold" style={{ color: MCAP_COLORS.small }}>Small-cap ({portfolioMix.small}%)</span> is within healthy range. SBI Small Cap has maintained the lowest expense ratio in the category (0.66%) — a structural edge that compounds significantly over time.
            </p>
            <p className={`text-[10px] ${textMuted} pt-1 border-t ${divider}`}>
              Sahi analysis is for research and educational purposes only. This is not personalised investment advice. SEBI RA regulations apply. Please consult a registered investment adviser before making changes to your portfolio.
            </p>
          </div>
        </PlanGate>
      </div>

      {/* Fund-by-Fund Breakdown */}
      <div className={`${card} rounded-2xl overflow-hidden`}>
        <div className={`px-5 py-3 border-b ${divider} flex items-center justify-between`}>
          <p className={`text-sm font-semibold ${text}`}>Fund-by-Fund Market Cap Mix</p>
          <p className={`text-[11px] ${textMuted}`}>Click a fund to see drift details</p>
        </div>
        <div>
          {FUNDS.map((f, i) => {
            const w = WEIGHTS[i]
            const driftInfo = driftAlerts.find(d => d.id === f.id)
            const isSelected = selectedFund === f.id

            return (
              <div key={f.id}>
                <div
                  className={`px-5 py-4 border-b ${divider} last:border-0 ${rowHover} cursor-pointer transition-colors`}
                  onClick={() => setSelectedFund(isSelected ? null : f.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className={`text-sm font-medium ${text}`}>{f.name}</p>
                        <p className={`text-[11px] ${textMuted}`}>{f.category} · AUM {f.aum} · Sahi Score {f.score}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] ${textMuted}`}>{Math.round(w * 100)}% of portfolio</span>
                      {driftInfo ? <DriftBadge diff={driftInfo.maxDrift} lm={lm} /> : <DriftBadge diff={0} lm={lm} />}
                    </div>
                  </div>

                  {/* Stacked bar */}
                  <div className="flex rounded-lg overflow-hidden h-5 gap-[1px]">
                    <div
                      className="flex items-center justify-center text-[9px] font-bold text-white transition-all"
                      style={{ width: `${f.large}%`, background: MCAP_COLORS.large }}
                    >
                      {f.large >= 8 ? `${f.large}%` : ''}
                    </div>
                    <div
                      className="flex items-center justify-center text-[9px] font-bold text-white transition-all"
                      style={{ width: `${f.mid}%`, background: MCAP_COLORS.mid }}
                    >
                      {f.mid >= 8 ? `${f.mid}%` : ''}
                    </div>
                    <div
                      className="flex items-center justify-center text-[9px] font-bold text-white transition-all"
                      style={{ width: `${f.small}%`, background: MCAP_COLORS.small }}
                    >
                      {f.small >= 8 ? `${f.small}%` : ''}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 mt-1.5">
                    {[
                      { label: 'Large', val: f.large, color: MCAP_COLORS.large },
                      { label: 'Mid', val: f.mid, color: MCAP_COLORS.mid },
                      { label: 'Small', val: f.small, color: MCAP_COLORS.small },
                    ].map(b => (
                      <div key={b.label} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-sm" style={{ background: b.color }} />
                        <span className={`text-[10px] ${textMuted}`}>{b.label} {b.val}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expanded drift detail */}
                {isSelected && driftInfo && (
                  <div className={`px-5 py-4 ${lm ? 'bg-[#fafafa]' : 'bg-[#0d1016]'} border-b ${divider}`}>
                    <p className={`text-xs font-semibold ${textMuted} mb-3`}>Drift vs SEBI mandate (last rebalance)</p>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Large Cap', curr: f.large, prev: f.driftFrom.large, color: MCAP_COLORS.large },
                        { label: 'Mid Cap', curr: f.mid, prev: f.driftFrom.mid, color: MCAP_COLORS.mid },
                        { label: 'Small Cap', curr: f.small, prev: f.driftFrom.small, color: MCAP_COLORS.small },
                      ].map(d => {
                        const diff = d.curr - d.prev
                        return (
                          <div key={d.label} className={`${card} rounded-xl px-3 py-2.5`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <div className="w-2 h-2 rounded-sm" style={{ background: d.color }} />
                              <span className={`text-[10px] font-semibold ${textMuted}`}>{d.label}</span>
                            </div>
                            <p className={`text-xl font-black ${text}`}>{d.curr}%</p>
                            <p className={`text-[10px] ${diff > 0 ? (lm ? 'text-[#dc2626]' : 'text-[#f87171]') : diff < 0 ? (lm ? 'text-[#16a34a]' : 'text-[#4ade80]') : textMuted}`}>
                              {diff > 0 ? '▲' : diff < 0 ? '▼' : '●'} {Math.abs(diff)}% vs last quarter
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Rebalance Simulator — PRO gated */}
      <PlanGate requiredTier="pro">
        <div className={`${card} rounded-2xl p-5 space-y-4`}>
          <div className="flex items-center gap-2">
            <ArrowsClockwise size={16} color={lm ? '#4f46e5' : '#d6fd70'} weight="duotone" />
            <p className={`text-sm font-semibold ${text}`}>Rebalance Simulator</p>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#4f46e5] text-white ml-auto">PRO</span>
          </div>
          <p className={`text-xs ${textSub}`}>Drag sliders to see how rebalancing to your target mix affects individual fund weights.</p>

          {/* Sahi research — recommended composition note */}
          <div className="rounded-xl px-3.5 py-3" style={{ background: lm ? '#F5F3FF' : 'rgba(79,70,229,0.08)', border: `1px solid ${lm ? '#ddd6fe' : 'rgba(79,70,229,0.2)'}` }}>
            <p className="text-[11px] leading-relaxed" style={{ color: lm ? '#4338ca' : '#a5b4fc' }}>
              <span className="font-bold" style={{ color: lm ? '#4f46e5' : '#c7d2fe' }}>Sahi research view — best composition: </span>
              For a balanced growth investor we suggest <b style={{ color: MCAP_COLORS.large }}>{RECOMMENDED.large}% Large Cap</b>, <b style={{ color: MCAP_COLORS.mid }}>{RECOMMENDED.mid}% Mid Cap</b> and <b style={{ color: MCAP_COLORS.small }}>{RECOMMENDED.small}% Small Cap</b>. Large caps anchor stability, mid caps drive long-term growth, and a measured small-cap sleeve adds upside without over-concentrating risk. Use the sliders to model your own mix — your target must total 100%.
            </p>
          </div>

          <div className="space-y-4">
            {(['large', 'mid', 'small'] as const).map((cap) => {
              const labels = { large: 'Large Cap', mid: 'Mid Cap', small: 'Small Cap' }
              const colors = { large: MCAP_COLORS.large, mid: MCAP_COLORS.mid, small: MCAP_COLORS.small }
              const val = rebalanceTarget[cap]
              const rec = RECOMMENDED[cap]
              return (
                <div key={cap}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: colors[cap] }} />
                      <span className={`text-xs font-medium ${text}`}>{labels[cap]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] ${textMuted}`}>Recommended: {rec}%</span>
                      <span className="text-sm font-bold" style={{ color: colors[cap] }}>{val}%</span>
                    </div>
                  </div>
                  <input
                    type="range" min={0} max={80} value={val}
                    onChange={(e) => setRebalanceTarget(prev => ({ ...prev, [cap]: Number(e.target.value) }))}
                    className="w-full rebalance-slider"
                    style={{
                      ['--thumb' as string]: colors[cap],
                      background: `linear-gradient(to right, ${colors[cap]} ${(val / 80) * 100}%, ${lm ? '#E5E7EB' : '#1e2838'} ${(val / 80) * 100}%)`,
                    }}
                  />
                </div>
              )
            })}
          </div>

          {/* Target summary */}
          <div className={`rounded-xl px-4 py-3 ${lm ? 'bg-[#F8F7FF]' : 'bg-[#0d1016]'} border ${lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'}`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-xs font-semibold ${text}`}>Target Portfolio Mix</p>
              <span className={`text-[10px] font-bold ${totalRebalanceTarget === 100 ? (lm ? 'text-[#16a34a]' : 'text-[#4ade80]') : (lm ? 'text-[#dc2626]' : 'text-[#f87171]')}`}>
                Total: {totalRebalanceTarget}% {totalRebalanceTarget !== 100 && '(must equal 100%)'}
              </span>
            </div>
            <div className="flex rounded-lg overflow-hidden h-4 gap-[1px]">
              {(['large', 'mid', 'small'] as const).map(cap => (
                <div key={cap} className="transition-all" style={{ width: `${rebalanceTarget[cap]}%`, background: MCAP_COLORS[cap] }} />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-1.5">
              {(['large', 'mid', 'small'] as const).map(cap => {
                const labels = { large: 'Large', mid: 'Mid', small: 'Small' }
                const diff = rebalanceTarget[cap] - portfolioMix[cap]
                return (
                  <div key={cap} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-sm" style={{ background: MCAP_COLORS[cap] }} />
                    <span className={`text-[10px] ${textMuted}`}>{labels[cap]}</span>
                    <span className={`text-[10px] font-semibold ${diff > 0 ? (lm ? 'text-[#16a34a]' : 'text-[#4ade80]') : diff < 0 ? (lm ? 'text-[#dc2626]' : 'text-[#f87171]') : textMuted}`}>
                      {diff > 0 ? '+' : ''}{diff}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Fund rebalance actions */}
          {totalRebalanceTarget === 100 && (
            <div className="space-y-2">
              <p className={`text-xs font-semibold ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} uppercase tracking-wider`}>Suggested Fund Actions</p>
              {FUNDS.map((f, i) => {
                const w = Math.round(WEIGHTS[i] * 100)
                const action = w > 30 ? 'Reduce' : w < 20 ? 'Increase' : 'Hold'
                const actionColor = action === 'Reduce'
                  ? (lm ? 'text-[#dc2626]' : 'text-[#f87171]')
                  : action === 'Increase'
                  ? (lm ? 'text-[#16a34a]' : 'text-[#4ade80]')
                  : textMuted
                return (
                  <div key={f.id} className={`flex items-center justify-between py-2 px-3 rounded-xl ${lm ? 'bg-[#F9FAFB]' : 'bg-[#0d1016]'}`}>
                    <div>
                      <p className={`text-xs font-medium ${text}`}>{f.name}</p>
                      <p className={`text-[10px] ${textMuted}`}>Current weight: {w}%</p>
                    </div>
                    <span className={`text-xs font-bold ${actionColor}`}>{action}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </PlanGate>

      <p className={`text-[10px] ${textMuted} text-center`}>
        Market cap classifications follow SEBI's AMFI list (top 100 = Large Cap, 101–250 = Mid Cap, 251+ = Small Cap).
        Data is indicative and based on last available portfolio disclosures. SahiMF is a SEBI-registered Research Analyst.
      </p>
    </div>
  )
}

import { useState } from 'react'
import { ArrowsLeftRight as CompareArrowsIcon } from '@phosphor-icons/react'
import { Plus as AddIcon } from '@phosphor-icons/react'
import { X as CloseIcon } from '@phosphor-icons/react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { mockFunds } from '../../data/funds'
import { VolatilityBadge } from '../../components/ui/VolatilityBadge'
import { PlanGate } from '../../components/ui/PlanGate'
import { ProTrialBanner } from '../../components/ui/ProTrialBanner'
import { useUIStore } from '../../stores/uiStore'
import { usePlan } from '../../hooks/usePlan'

const COLORS = ['#d6fd70', '#4f46e5', '#22C55E', '#F59E0B']

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
  { key: 'fundSize', label: 'Fund Size (Cr)', format: (v: number) => `₹${v.toLocaleString('en-IN')}`, higherBetter: null },
  { key: 'minSIP', label: 'Min SIP', format: (v: number) => `₹${v.toLocaleString('en-IN')}`, higherBetter: null },
  { key: 'nav', label: 'NAV', format: (v: number) => `₹${v.toFixed(2)}`, higherBetter: null },
]

function getFundVal(fund: typeof mockFunds[0], key: string): number {
  if (key in fund.returns) return (fund.returns as Record<string, number>)[key] ?? 0
  return ((fund as unknown) as Record<string, number>)[key] ?? 0
}

export function FundComparison() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['f001', 'f002'])
  const [showPicker, setShowPicker] = useState(false)
  const [search, setSearch] = useState('')
  const lm = useUIStore((s) => s.lightMode)
  const { can } = usePlan()
  const isPro = can('pro')

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'
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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'} flex items-center justify-center`}>
            <CompareArrowsIcon size={18} color={lm ? '#6366f1' : '#d6fd70'} weight="duotone" />
          </div>
          <div>
            <h1 className={`text-lg font-bold ${text}`}>Fund Comparison</h1>
            <p className={`text-xs ${textMuted}`}>Compare up to 4 funds side-by-side</p>
          </div>
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
              className={`flex items-center gap-1.5 ${lm ? 'bg-white border-[#E0E3E8]' : 'bg-[#14171c] border-[#1e2838]'} border border-dashed hover:border-[#d6fd70] rounded-xl px-3 py-2 text-sm ${textMuted} hover:text-[#d6fd70] transition-all`}
            >
              <AddIcon size={16} weight="duotone" /> Add Fund
            </button>
            {showPicker && (
              <div className={`absolute top-full mt-2 left-0 z-20 w-72 ${lm ? 'bg-white border-[#E0E3E8]' : 'bg-[#14171c] border-[#1e2838]'} border rounded-xl shadow-2xl p-2`}>
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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

      {/* Performance Chart */}
      <div className={`${card} rounded-2xl p-5`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-sm font-semibold ${text}`}>Performance (indexed to 100)</h2>
          <div className="flex items-center gap-3">
            {selectedFunds.map((f, idx) => (
              <div key={f.id} className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 rounded" style={{ background: COLORS[idx] }} />
                <span className={`text-xs ${textSub}`}>{f.name.split(' ')[0]}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0" style={{ borderTop: '2px dashed #64748b' }} />
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
              {/* Benchmark Nifty line — always visible (not gated) */}
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
        {/* Fund header row */}
        <div className={`border-b ${dividerColor}`} style={{ display: 'grid', gridTemplateColumns: `200px repeat(${selectedFunds.length}, 1fr)` }}>
          <div className={`px-5 py-3 text-[11px] font-semibold ${textMuted} uppercase tracking-wider`}>Metric</div>
          {selectedFunds.map((f, idx) => (
            <div key={f.id} className="px-4 py-3 text-center">
              <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ background: COLORS[idx] }} />
              <p className={`text-xs font-semibold ${text} truncate`}>{f.name.split(' ').slice(0, 3).join(' ')}</p>
              <VolatilityBadge level={f.volatility} />
            </div>
          ))}
        </div>

        {/* Category + sub */}
        <div className={`border-b ${rowBorder} ${categoryRowBg}`} style={{ display: 'grid', gridTemplateColumns: `200px repeat(${selectedFunds.length}, 1fr)` }}>
          <div className={`px-5 py-2 text-[11px] ${textMuted}`}>Category</div>
          {selectedFunds.map((f) => (
            <div key={f.id} className="px-4 py-2 text-center">
              <p className={`text-xs ${textSub}`}>{f.subCategory}</p>
            </div>
          ))}
        </div>

        {/* Nifty 50 benchmark row */}
        <div className={`border-b ${rowBorder} ${categoryRowBg}`} style={{ display: 'grid', gridTemplateColumns: `200px repeat(${selectedFunds.length}, 1fr)` }}>
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
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-md"
                  style={Number(alpha) >= 0
                    ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e' }
                    : { background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
                >
                  {Number(alpha) >= 0 ? '+' : ''}{alpha}% alpha
                </span>
              </div>
            )
          })}
        </div>

        {METRICS.map((m) => (
          <div key={m.key} className={`border-b ${rowBorder} last:border-0 ${rowHover} transition-colors`} style={{ display: 'grid', gridTemplateColumns: `200px repeat(${selectedFunds.length}, 1fr)` }}>
            <div className={`px-5 py-3 text-sm ${textSub}`}>{m.label}</div>
            {selectedFunds.map((fund, idx) => {
              const val = getFundVal(fund, m.key)
              const best = bestIdx(m.key, m.higherBetter)
              const isBest = best === idx
              const needsGate = (m.key === '3Y' || m.key === '5Y') && idx > 0
              return (
                <div key={fund.id} className="px-4 py-3 text-center">
                  {needsGate ? (
                    <span className={`text-xs ${proPlaceholder}`}>— PRO</span>
                  ) : (
                    <span className={`text-sm font-semibold ${isBest ? 'text-[#d6fd70]' : text}`}>
                      {m.format(val)}
                      {isBest && <span className="text-[10px] ml-1">★</span>}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {!isPro && (
        <ProTrialBanner
          headline="Unlock full fund comparison with Sahi PRO"
          features={['3Y & 5Y returns', 'Sharpe & Sortino ratios', 'Drawdown analysis', 'Rolling return charts']}
        />
      )}
    </div>
  )
}

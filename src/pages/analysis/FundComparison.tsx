import { useState } from 'react'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { mockFunds } from '../../data/funds'
import { VolatilityBadge } from '../../components/ui/VolatilityBadge'
import { PlanGate } from '../../components/ui/PlanGate'

const COLORS = ['#C5F135', '#7B2FBE', '#22C55E', '#F59E0B']

const PERF_DATA = Array.from({ length: 24 }, (_, i) => ({
  month: new Date(2024, i, 1).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
  f001: 100 + i * 1.6 + Math.sin(i * 0.5) * 3,
  f002: 100 + i * 2.1 + Math.sin(i * 0.7) * 4,
  f005: 100 + i * 2.6 + Math.sin(i * 0.4) * 5,
  f006: 100 + i * 2.8 + Math.sin(i * 0.9) * 6,
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
          <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
            <CompareArrowsIcon sx={{ fontSize: 18, color: '#C5F135' }} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Fund Comparison</h1>
            <p className="text-xs text-[#606060]">Compare up to 4 funds side-by-side</p>
          </div>
        </div>
      </div>

      {/* Fund selector row */}
      <div className="flex gap-3 flex-wrap">
        {selectedFunds.map((fund, idx) => (
          <div key={fund.id} className="flex items-center gap-2 bg-[#141414] border border-[#2A2A2A] rounded-xl px-3 py-2">
            <div className="w-2 h-2 rounded-full" style={{ background: COLORS[idx] }} />
            <span className="text-sm font-medium text-white max-w-48 truncate">{fund.name}</span>
            <button onClick={() => removeFund(fund.id)} className="text-[#606060] hover:text-[#EF4444] transition-colors ml-1">
              <CloseIcon sx={{ fontSize: 14 }} />
            </button>
          </div>
        ))}

        {selectedIds.length < 4 && (
          <div className="relative">
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="flex items-center gap-1.5 bg-[#1A1A1A] border border-dashed border-[#2A2A2A] hover:border-[#C5F135] rounded-xl px-3 py-2 text-sm text-[#606060] hover:text-[#C5F135] transition-all"
            >
              <AddIcon sx={{ fontSize: 16 }} /> Add Fund
            </button>
            {showPicker && (
              <div className="absolute top-full mt-2 left-0 z-20 w-72 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-2xl p-2">
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search fund..."
                  className="w-full bg-[#141414] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white outline-none placeholder-[#606060] mb-2"
                />
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredFunds.slice(0, 8).map((f) => (
                    <button key={f.id} onClick={() => addFund(f.id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#2A2A2A] transition-colors">
                      <p className="text-sm text-white truncate">{f.name}</p>
                      <p className="text-[11px] text-[#606060]">{f.subCategory}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Performance Chart */}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Performance (indexed to 100)</h2>
        <PlanGate requiredTier="pro" label="Unlock Performance Comparison">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={PERF_DATA}>
              <defs>
                {selectedIds.map((id, idx) => (
                  <linearGradient key={id} id={`cmpGrad${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[idx]} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={COLORS[idx]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#606060' }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: '#606060' }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8 }} labelStyle={{ color: '#A0A0A0', fontSize: 11 }} />
              {selectedIds.map((id, idx) => (
                <Area key={id} type="monotone" dataKey={id} stroke={COLORS[idx]} strokeWidth={2} fill={`url(#cmpGrad${idx})`} dot={false} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </PlanGate>
      </div>

      {/* Metrics table */}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden">
        {/* Fund header row */}
        <div className="border-b border-[#2A2A2A]" style={{ display: 'grid', gridTemplateColumns: `200px repeat(${selectedFunds.length}, 1fr)` }}>
          <div className="px-5 py-3 text-[11px] font-semibold text-[#606060] uppercase tracking-wider">Metric</div>
          {selectedFunds.map((f, idx) => (
            <div key={f.id} className="px-4 py-3 text-center">
              <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ background: COLORS[idx] }} />
              <p className="text-xs font-semibold text-white truncate">{f.name.split(' ').slice(0, 3).join(' ')}</p>
              <VolatilityBadge level={f.volatility} />
            </div>
          ))}
        </div>

        {/* Category + sub */}
        <div className="border-b border-[#1E1E1E] bg-[#111]" style={{ display: 'grid', gridTemplateColumns: `200px repeat(${selectedFunds.length}, 1fr)` }}>
          <div className="px-5 py-2 text-[11px] text-[#606060]">Category</div>
          {selectedFunds.map((f) => (
            <div key={f.id} className="px-4 py-2 text-center">
              <p className="text-xs text-[#A0A0A0]">{f.subCategory}</p>
            </div>
          ))}
        </div>

        {METRICS.map((m) => (
          <div key={m.key} className="border-b border-[#1E1E1E] last:border-0 hover:bg-[#1A1A1A] transition-colors" style={{ display: 'grid', gridTemplateColumns: `200px repeat(${selectedFunds.length}, 1fr)` }}>
            <div className="px-5 py-3 text-sm text-[#A0A0A0]">{m.label}</div>
            {selectedFunds.map((fund, idx) => {
              const val = getFundVal(fund, m.key)
              const best = bestIdx(m.key, m.higherBetter)
              const isBest = best === idx
              const needsGate = (m.key === '3Y' || m.key === '5Y') && idx > 0
              return (
                <div key={fund.id} className="px-4 py-3 text-center">
                  {needsGate ? (
                    <span className="text-xs text-[#2A2A2A]">— PRO</span>
                  ) : (
                    <span className={`text-sm font-semibold ${isBest ? 'text-[#C5F135]' : 'text-white'}`}>
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
    </div>
  )
}

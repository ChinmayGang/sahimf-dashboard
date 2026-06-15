import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DiamondIcon from '@mui/icons-material/Diamond'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AddIcon from '@mui/icons-material/Add'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { mockSahiFunds } from '../../data/sahiFunds'
import { VolatilityBadge } from '../../components/ui/VolatilityBadge'

const MY_FUNDS = ['sf001', 'sf002']

function formatINR(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`
  return `₹${n.toLocaleString('en-IN')}`
}

export function MySahiFunds() {
  const navigate = useNavigate()
  const myFunds = mockSahiFunds.filter((f) => MY_FUNDS.includes(f.id))

  const [activeIdx, setActiveIdx] = useState(0)

  const mockInvested = [38000, 55000]
  const mockCurrent = [44820, 72450]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
            <DiamondIcon sx={{ fontSize: 18, color: '#C5F135' }} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">My Sahi Funds</h1>
            <p className="text-xs text-[#606060]">{myFunds.length} baskets active</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/mutual-funds/sahi-funds')}
          className="flex items-center gap-1.5 bg-[#C5F135] hover:bg-[#A8D020] text-black text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
        >
          <AddIcon sx={{ fontSize: 14 }} />
          Explore More
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Invested', value: formatINR(mockInvested.reduce((a, b) => a + b, 0)) },
          { label: 'Current Value', value: formatINR(mockCurrent.reduce((a, b) => a + b, 0)), green: true },
          { label: 'Total Gain', value: `+${formatINR(mockCurrent.reduce((a, b) => a + b, 0) - mockInvested.reduce((a, b) => a + b, 0))}`, green: true },
        ].map((s) => (
          <div key={s.label} className="bg-[#141414] border border-[#2A2A2A] rounded-xl px-4 py-3">
            <p className="text-[11px] text-[#606060] mb-1">{s.label}</p>
            <p className={`text-base font-bold ${s.green ? 'text-[#22C55E]' : 'text-white'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Fund cards row */}
      <div className="grid grid-cols-2 gap-4">
        {myFunds.map((fund, idx) => (
          <button
            key={fund.id}
            onClick={() => { setActiveIdx(idx); navigate(`/mutual-funds/sahi-funds/${fund.id}`) }}
            className="text-left bg-[#141414] border rounded-2xl p-5 hover:border-[#C5F135]/40 transition-all"
            style={{ borderColor: activeIdx === idx ? '#C5F135' : '#2A2A2A' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-white mb-1">{fund.name}</p>
                <VolatilityBadge level={fund.volatility} />
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${fund.accessTier === 'pro' ? 'bg-[#7B2FBE]/20 text-[#7B2FBE]' : 'bg-[#C5F135]/10 text-[#C5F135]'}`}>
                {fund.accessTier === 'pro' ? 'PRO' : 'FREE'}
              </span>
            </div>

            {/* Allocation mini chart */}
            {fund.holdingsDistribution && (
              <div className="flex items-center gap-3 mb-4">
                <ResponsiveContainer width={60} height={60}>
                  <PieChart>
                    <Pie data={fund.holdingsDistribution} dataKey="value" cx="50%" cy="50%" innerRadius={18} outerRadius={28} strokeWidth={0}>
                      {fund.holdingsDistribution.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1">
                  {fund.holdingsDistribution.map((d) => (
                    <div key={d.label} className="flex items-center gap-1.5 text-[11px]">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-[#A0A0A0]">{d.label}</span>
                      <span className="text-white font-medium">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Returns */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(['1M', '1Y', '3Y'] as const).map((k) => (
                <div key={k} className="bg-[#1A1A1A] rounded-lg px-2 py-1.5 text-center">
                  <p className="text-[10px] text-[#606060]">{k}</p>
                  <p className={`text-xs font-bold ${(fund.returns[k] ?? 0) >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                    {(fund.returns[k] ?? 0) >= 0 ? '+' : ''}{fund.returns[k]?.toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>

            {/* Investment status */}
            <div className="flex items-center justify-between pt-3 border-t border-[#2A2A2A]">
              <div>
                <p className="text-[11px] text-[#606060]">Invested</p>
                <p className="text-sm font-semibold text-white">{formatINR(mockInvested[idx])}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[#606060]">Current</p>
                <p className="text-sm font-semibold text-[#22C55E]">{formatINR(mockCurrent[idx])}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[#606060]">XIRR</p>
                <p className="text-sm font-semibold text-[#C5F135]">+{(((mockCurrent[idx] / mockInvested[idx]) - 1) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Next rebalance notice */}
      <div className="bg-[#7B2FBE]/10 border border-[#7B2FBE]/30 rounded-xl px-4 py-3 flex items-center gap-3">
        <TrendingUpIcon sx={{ fontSize: 16, color: '#7B2FBE' }} />
        <p className="text-xs text-[#A0A0A0]">
          <span className="text-white font-medium">Sahi All-Weather Portfolio</span> is due for rebalancing on{' '}
          <span className="text-white font-medium">1 Jul 2026</span>. You'll be notified 7 days before.
        </p>
      </div>
    </div>
  )
}

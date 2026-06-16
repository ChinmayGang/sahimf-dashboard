import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DiamondIcon from '@mui/icons-material/Diamond'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AddIcon from '@mui/icons-material/Add'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { mockSahiFunds } from '../../data/sahiFunds'
import { VolatilityBadge } from '../../components/ui/VolatilityBadge'
import { useUIStore } from '../../stores/uiStore'

const ORIGAMI_ICONS = [
  'bat-origami-4895697.svg','bee-origami-4895698.svg','butterfly-origami-4895700.svg',
  'cactus-origami-4895701.svg','cat-origami-4895702.svg','chick-origami-4895653.svg',
  'dragon-origami-4895659.svg','elephant-origami-4895660.svg','flower-origami-4895661.svg',
  'fox-origami-4895662.svg','giraffe-origami-4895664.svg','horse-origami-4895667.svg',
  'kangaroo-origami-4895672.svg','kite-origami-4895673.svg','owl-origami-4895676.svg',
  'panda-origami-4895677.svg','paper-plane-origami-4895678.svg','penguin-origami-4895680.svg',
  'rabbit-origami-4895682.svg','star-origami-4895689.svg','sun-origami-4895691.svg',
  'tulip-origami-4895693.svg','unicorn-origami-4895694.svg','whale-origami-4895695.svg',
]
const ICON_PALETTES = [
  { bg: '#EDE9FE' }, { bg: '#FEF3C7' }, { bg: '#DCFCE7' }, { bg: '#DBEAFE' },
  { bg: '#FCE7F3' }, { bg: '#FEE2E2' }, { bg: '#ECFDF5' }, { bg: '#FFF7ED' },
  { bg: '#F0F9FF' }, { bg: '#F5F3FF' },
]

const MY_FUNDS = ['sf001', 'sf002']

function formatINR(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`
  return `₹${n.toLocaleString('en-IN')}`
}

export function MySahiFunds() {
  const navigate = useNavigate()
  const myFunds = mockSahiFunds.filter((f) => MY_FUNDS.includes(f.id))
  const [activeIdx, setActiveIdx] = useState(0)
  const lm = useUIStore((s) => s.lightMode)

  const card = lm ? 'bg-white border border-transparent' : 'bg-[#141414] border border-transparent'
  const cardInner = lm ? 'bg-[#F8F7FF] border border-[#E8E8F0]' : 'bg-[#1A1A1A] border border-[#2A2A2A]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#A0A0A0]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#606060]'
  const dividerColor = lm ? 'border-[#E8E8F0]' : 'border-[#2A2A2A]'

  const mockInvested = [38000, 55000]
  const mockCurrent = [44820, 72450]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${lm ? 'bg-white border border-[#E8E8F0] shadow-sm' : 'bg-[#1A1A1A] border border-[#2A2A2A]'} flex items-center justify-center`}>
            <DiamondIcon sx={{ fontSize: 18, color: '#C5F135' }} />
          </div>
          <div>
            <h1 className={`text-lg font-bold ${text}`}>My Sahi Funds</h1>
            <p className={`text-xs ${textMuted}`}>{myFunds.length} baskets active</p>
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
          <div key={s.label} className={`${card} rounded-xl px-4 py-3`}>
            <p className={`text-[11px] ${textMuted} mb-1`}>{s.label}</p>
            <p className={`text-base font-bold ${s.green ? 'text-[#22C55E]' : text}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Fund cards row */}
      <div className="grid grid-cols-2 gap-4">
        {myFunds.map((fund, idx) => (
          <button
            key={fund.id}
            onClick={() => { setActiveIdx(idx); navigate(`/mutual-funds/sahi-funds/${fund.id}`) }}
            className={`text-left ${card} rounded-2xl p-5 transition-all duration-200 group ${
              activeIdx === idx
                ? lm ? 'border-[#7B2FBE]' : 'border-[#C5F135]'
                : lm ? 'hover:border-[#7B2FBE] hover:-translate-y-1 hover:shadow-xl' : 'hover:border-[#C5F135] hover:-translate-y-1 hover:shadow-xl'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: ICON_PALETTES[idx % ICON_PALETTES.length].bg }}>
                  <img src={`/icons/schemes/${ORIGAMI_ICONS[idx % ORIGAMI_ICONS.length]}`} className="w-5 h-5" alt="" />
                </div>
                <div>
                  <p className={`text-sm font-bold ${text} mb-1 transition-colors duration-200 ${lm ? 'group-hover:text-[#7B2FBE]' : 'group-hover:text-[#C5F135]'}`}>{fund.name}</p>
                  <VolatilityBadge level={fund.volatility} />
                </div>
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
                      <span className={textSub}>{d.label}</span>
                      <span className={`${text} font-medium`}>{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Returns */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(['1M', '1Y', '3Y'] as const).map((k) => (
                <div key={k} className={`${cardInner} rounded-lg px-2 py-1.5 text-center`}>
                  <p className={`text-[10px] ${textMuted}`}>{k}</p>
                  <p className={`text-xs font-bold ${(fund.returns[k] ?? 0) >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                    {(fund.returns[k] ?? 0) >= 0 ? '+' : ''}{fund.returns[k]?.toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>

            {/* Investment status */}
            <div className={`flex items-center justify-between pt-3 border-t ${dividerColor}`}>
              <div>
                <p className={`text-[11px] ${textMuted}`}>Invested</p>
                <p className={`text-sm font-semibold ${text}`}>{formatINR(mockInvested[idx])}</p>
              </div>
              <div className="text-right">
                <p className={`text-[11px] ${textMuted}`}>Current</p>
                <p className="text-sm font-semibold text-[#22C55E]">{formatINR(mockCurrent[idx])}</p>
              </div>
              <div className="text-right">
                <p className={`text-[11px] ${textMuted}`}>XIRR</p>
                <p className="text-sm font-semibold text-[#C5F135]">+{(((mockCurrent[idx] / mockInvested[idx]) - 1) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Next rebalance notice */}
      <div className="bg-[#7B2FBE]/10 border border-[#7B2FBE]/30 rounded-xl px-4 py-3 flex items-center gap-3">
        <TrendingUpIcon sx={{ fontSize: 16, color: '#7B2FBE' }} />
        <p className={`text-xs ${textSub}`}>
          <span className={`${text} font-medium`}>Sahi All-Weather Portfolio</span> is due for rebalancing on{' '}
          <span className={`${text} font-medium`}>1 Jul 2026</span>. You'll be notified 7 days before.
        </p>
      </div>
    </div>
  )
}

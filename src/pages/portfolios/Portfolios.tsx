import { useState } from 'react'
import { Link } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { mockPortfolios } from '../../data/portfolios'
import { EmptyState } from '../../components/ui/EmptyState'
import { usePlan } from '../../hooks/usePlan'
import { useUIStore } from '../../stores/uiStore'

function formatINR(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
  return `₹${n.toLocaleString('en-IN')}`
}

export function Portfolios() {
  const { can } = usePlan()
  const [_showAddModal, setShowAddModal] = useState(false)
  const canAddMore = can('pro') || mockPortfolios.length < 1
  const lm = useUIStore((s) => s.lightMode)

  const card = lm ? 'bg-white border border-[#E8E8F0] shadow-sm' : 'bg-[#1A1A1A] border border-[#2A2A2A]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#A0A0A0]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#606060]'
  const chip = lm ? 'bg-[#F3F4F6] text-[#374151]' : 'bg-[#2A2A2A] text-[#A0A0A0]'
  const tooltipStyle = {
    background: lm ? '#fff' : '#1A1A1A',
    border: `1px solid ${lm ? '#E8E8F0' : '#2A2A2A'}`,
    borderRadius: 8, fontSize: 12,
    color: lm ? '#111827' : '#fff',
  }
  const chartTick = lm ? '#9CA3AF' : '#606060'

  const totalInvested = mockPortfolios.reduce((s, p) => s + p.totalInvested, 0)
  const totalCurrent = mockPortfolios.reduce((s, p) => s + p.currentValue, 0)

  const allocationData = mockPortfolios.map((p) => ({
    name: p.name.length > 16 ? p.name.slice(0, 16) + '…' : p.name,
    invested: p.totalInvested,
    current: p.currentValue,
  }))

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-lg font-semibold ${text}`}>My Portfolios</h1>
          <p className={`text-xs ${textSub} mt-0.5`}>{mockPortfolios.length} portfolios · {formatINR(totalInvested)} invested</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
            canAddMore
              ? 'bg-[#C5F135] hover:bg-[#A8D020] text-black'
              : lm
                ? 'bg-[#F3F4F6] text-[#9CA3AF] border border-[#E8E8F0] cursor-not-allowed'
                : 'bg-[#1A1A1A] text-[#606060] border border-[#2A2A2A] cursor-not-allowed'
          }`}
        >
          <AddIcon sx={{ fontSize: 16 }} />
          {canAddMore ? 'Add Portfolio' : 'Upgrade for More Portfolios'}
        </button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`${card} rounded-xl p-4`}>
          <p className={`text-xs ${textSub} mb-1`}>Total Invested</p>
          <p className={`text-xl font-semibold ${text}`}>{formatINR(totalInvested)}</p>
        </div>
        <div className={`${lm ? 'bg-white border border-[#E8E8F0] shadow-sm' : 'bg-[#1A1A1A] border border-[#C5F135]/20'} rounded-xl p-4`}>
          <p className={`text-xs ${textSub} mb-1`}>Current Value</p>
          <p className="text-xl font-semibold text-[#C5F135]">{formatINR(totalCurrent)}</p>
          <p className="text-xs text-[#22C55E] mt-0.5">
            +{formatINR(totalCurrent - totalInvested)} ({(((totalCurrent - totalInvested) / totalInvested) * 100).toFixed(1)}%)
          </p>
        </div>
        <div className={`${card} rounded-xl p-4`}>
          <p className={`text-xs ${textSub} mb-1`}>Portfolios</p>
          <p className={`text-xl font-semibold ${text}`}>{mockPortfolios.length}</p>
          <p className={`text-xs ${textSub} mt-0.5`}>{can('pro') ? 'Up to 5 (PRO)' : '1 (Free)'}</p>
        </div>
      </div>

      {/* Comparison chart */}
      <div className={`${card} rounded-xl p-5`}>
        <h2 className={`text-sm font-semibold ${text} mb-4`}>Portfolio Comparison</h2>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={allocationData} barCategoryGap="30%">
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: chartTick }} tickLine={false} axisLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v) => [formatINR(Number(v))]}
            />
            <Bar dataKey="invested" fill="#7B2FBE" radius={[4, 4, 0, 0]} />
            <Bar dataKey="current" fill="#C5F135" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-1.5"><span className="w-3 h-2.5 rounded bg-[#7B2FBE]" /><span className={`text-xs ${textSub}`}>Invested</span></div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-2.5 rounded bg-[#C5F135]" /><span className={`text-xs ${textSub}`}>Current</span></div>
        </div>
      </div>

      {/* Portfolio cards */}
      {mockPortfolios.length === 0 ? (
        <EmptyState
          icon={<FolderOpenIcon sx={{ fontSize: 28 }} />}
          title="No portfolios yet"
          description="Add your first portfolio to start tracking your mutual fund investments."
          action={
            <button className="bg-[#C5F135] hover:bg-[#A8D020] text-black text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
              Add Portfolio
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {mockPortfolios.map((p) => (
            <Link key={p.id} to={`/mutual-funds/portfolios/${p.id}`}>
              <div className={`${card} rounded-xl p-5 hover:border-[#C5F135]/30 transition-all group`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#C5F135]/10 flex items-center justify-center">
                      <FolderOpenIcon sx={{ fontSize: 20, color: '#C5F135' }} />
                    </div>
                    <div>
                      <h3 className={`text-sm font-semibold ${text} group-hover:text-[#C5F135] transition-colors`}>
                        {p.name}
                      </h3>
                      <p className={`text-xs ${textSub}`}>{p.holdings.length} funds · since {new Date(p.createdAt).getFullYear()}</p>
                    </div>
                  </div>
                  <ArrowForwardIosIcon sx={{ fontSize: 14, color: lm ? '#9CA3AF' : '#606060' }} className="group-hover:text-[#C5F135] transition-colors mt-1" />
                </div>

                <div className={`grid grid-cols-4 gap-6 mt-5 pt-4 border-t ${lm ? 'border-[#E8E8F0]' : 'border-[#2A2A2A]'}`}>
                  <div>
                    <p className={`text-xs ${textSub} mb-1`}>Invested</p>
                    <p className={`text-sm font-semibold ${text}`}>{formatINR(p.totalInvested)}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${textSub} mb-1`}>Current Value</p>
                    <p className="text-sm font-semibold text-[#C5F135]">{formatINR(p.currentValue)}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${textSub} mb-1`}>Total Gain</p>
                    <p className={`text-sm font-semibold ${p.absoluteReturns >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                      {p.absoluteReturns >= 0 ? '+' : ''}{formatINR(p.absoluteReturns)}
                      <span className="text-xs ml-1">({p.absoluteReturnsPercent.toFixed(1)}%)</span>
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${textSub} mb-1`}>XIRR</p>
                    <div className="flex items-center gap-1">
                      <TrendingUpIcon sx={{ fontSize: 14, color: '#22C55E' }} />
                      <p className="text-sm font-semibold text-[#22C55E]">{p.xirr}%</p>
                    </div>
                  </div>
                </div>

                {/* Mini holdings preview */}
                <div className="flex gap-1.5 mt-3 flex-wrap">
                  {p.holdings.slice(0, 4).map((h) => (
                    <span key={h.fundId} className={`text-xs ${chip} px-2 py-0.5 rounded-full`}>
                      {h.category}
                    </span>
                  ))}
                  {p.holdings.length > 4 && (
                    <span className={`text-xs ${textMuted} px-1 py-0.5`}>+{p.holdings.length - 4} more</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Upgrade prompt for free users */}
      {!can('pro') && (
        <div className="bg-[#7B2FBE]/10 border border-[#7B2FBE]/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShowChartIcon sx={{ fontSize: 20, color: '#9B59D6' }} />
            <div>
              <p className={`text-sm font-semibold ${text}`}>Track up to 5 portfolios with Sahi PRO</p>
              <p className={`text-xs ${textSub}`}>Free plan allows 1 portfolio only</p>
            </div>
          </div>
          <button className="bg-[#7B2FBE] hover:bg-[#9B59D6] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex-shrink-0">
            Upgrade to PRO
          </button>
        </div>
      )}
    </div>
  )
}

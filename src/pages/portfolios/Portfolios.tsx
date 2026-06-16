import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus as AddIcon } from '@phosphor-icons/react'
import { TrendUp as TrendingUpIcon } from '@phosphor-icons/react'
import { FolderOpen as FolderOpenIcon } from '@phosphor-icons/react'
import { ChartLine as ShowChartIcon } from '@phosphor-icons/react'
import { CaretRight as ArrowForwardIosIcon } from '@phosphor-icons/react'
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

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-transparent'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'
  const chip = lm ? 'bg-[#F3F4F6] text-[#374151]' : 'bg-[#1e2838] text-[#8390a2]'
  const tooltipStyle = {
    background: lm ? '#fff' : '#14171c',
    border: `1px solid ${lm ? '#E0E3E8' : '#1e2838'}`,
    borderRadius: 8, fontSize: 12,
    color: lm ? '#111827' : '#fff',
  }
  const chartTick = lm ? '#9CA3AF' : '#64748b'

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
              ? 'bg-[#d6fd70] hover:bg-[#b8d94a] text-black'
              : lm
                ? 'bg-[#F3F4F6] text-[#9CA3AF] border border-[#E0E3E8] cursor-not-allowed'
                : 'bg-[#14171c] text-[#64748b] border border-[#1e2838] cursor-not-allowed'
          }`}
        >
          <AddIcon size={16} weight="duotone" />
          {canAddMore ? 'Add Portfolio' : 'Upgrade for More Portfolios'}
        </button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`${card} rounded-xl p-4`}>
          <p className={`text-xs ${textSub} mb-1`}>Total Invested</p>
          <p className={`text-xl font-semibold ${text}`}>{formatINR(totalInvested)}</p>
        </div>
        <div className={`${lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#d6fd70]/20'} rounded-xl p-4`}>
          <p className={`text-xs ${textSub} mb-1`}>Current Value</p>
          <p className="text-xl font-semibold text-[#d6fd70]">{formatINR(totalCurrent)}</p>
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
            <Bar dataKey="invested" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            <Bar dataKey="current" fill="#d6fd70" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-1.5"><span className="w-3 h-2.5 rounded bg-[#4f46e5]" /><span className={`text-xs ${textSub}`}>Invested</span></div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-2.5 rounded bg-[#d6fd70]" /><span className={`text-xs ${textSub}`}>Current</span></div>
        </div>
      </div>

      {/* Portfolio cards */}
      {mockPortfolios.length === 0 ? (
        <EmptyState
          icon={<FolderOpenIcon size={28} weight="duotone" />}
          title="No portfolios yet"
          description="Add your first portfolio to start tracking your mutual fund investments."
          action={
            <button className="bg-[#d6fd70] hover:bg-[#b8d94a] text-black text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
              Add Portfolio
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {mockPortfolios.map((p) => (
            <Link key={p.id} to={`/mutual-funds/portfolios/${p.id}`}>
              <div className={`${card} rounded-xl p-5 transition-all duration-200 group ${lm ? 'hover:border-[#4f46e5] hover:-translate-y-1' : 'hover:border-[#d6fd70] hover:-translate-y-1'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#d6fd70]/10 flex items-center justify-center">
                      <FolderOpenIcon size={20} color="#d6fd70" weight="duotone" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-semibold ${text} transition-colors duration-200 ${lm ? 'group-hover:text-[#4f46e5]' : 'group-hover:text-[#d6fd70]'}`}>
                        {p.name}
                      </h3>
                      <p className={`text-xs ${textSub}`}>{p.holdings.length} funds · since {new Date(p.createdAt).getFullYear()}</p>
                    </div>
                  </div>
                  <ArrowForwardIosIcon size={14} color={lm ? '#9CA3AF' : '#64748b'} weight="bold" className="group-hover:text-[#d6fd70] transition-colors mt-1" />
                </div>

                <div className={`grid grid-cols-4 gap-6 mt-5 pt-4 border-t ${lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'}`}>
                  <div>
                    <p className={`text-xs ${textSub} mb-1`}>Invested</p>
                    <p className={`text-sm font-semibold ${text}`}>{formatINR(p.totalInvested)}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${textSub} mb-1`}>Current Value</p>
                    <p className="text-sm font-semibold text-[#d6fd70]">{formatINR(p.currentValue)}</p>
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
                      <TrendingUpIcon size={14} color="#22C55E" weight="regular" />
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
        <div className="bg-[#4f46e5]/10 border border-[#4f46e5]/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShowChartIcon size={20} color="#6366f1" weight="duotone" />
            <div>
              <p className={`text-sm font-semibold ${text}`}>Track up to 5 portfolios with Sahi PRO</p>
              <p className={`text-xs ${textSub}`}>Free plan allows 1 portfolio only</p>
            </div>
          </div>
          <button className="bg-[#4f46e5] hover:bg-[#6366f1] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex-shrink-0">
            Upgrade to PRO
          </button>
        </div>
      )}
    </div>
  )
}

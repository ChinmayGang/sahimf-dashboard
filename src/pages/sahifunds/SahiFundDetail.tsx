import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft as ArrowBackIcon } from '@phosphor-icons/react'
import { Info as InfoOutlinedIcon } from '@phosphor-icons/react'
import { CalendarDots as EventIcon } from '@phosphor-icons/react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { mockSahiFunds } from '../../data/sahiFunds'
import { VolatilityBadge } from '../../components/ui/VolatilityBadge'
import { PlanGate } from '../../components/ui/PlanGate'
import { useUIStore } from '../../stores/uiStore'

const NAV_HISTORY = Array.from({ length: 24 }, (_, i) => ({
  month: new Date(2024, i, 1).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
  value: 100 + i * 2.4 + Math.sin(i * 0.6) * 4,
}))

export function SahiFundDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'overview' | 'funds'>('overview')
  const lm = useUIStore((s) => s.lightMode)

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'
  const chip = lm ? 'bg-[#F3F4F6] text-[#374151]' : 'bg-[#14171c] border border-[#1e2838] text-[#8390a2]'
  const rowHover = lm ? 'hover:bg-[#F9F9FF]' : 'hover:bg-[#1a2130]'
  const rowBorder = lm ? 'border-[#F0F0F8]' : 'border-[#1e2838]'
  const dividerColor = lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'
  const progressTrack = lm ? 'bg-[#E0E3E8]' : 'bg-[#1e2838]'
  const tooltipStyle = {
    background: lm ? '#fff' : '#14171c',
    border: `1px solid ${lm ? '#E0E3E8' : '#1e2838'}`,
    borderRadius: 8,
  }
  const chartGrid = lm ? '#E0E3E8' : '#1e2838'
  const chartTick = lm ? '#9CA3AF' : '#64748b'

  const fund = mockSahiFunds.find((f) => f.id === id)

  if (!fund) {
    return (
      <div className="flex items-center justify-center h-full min-h-64">
        <div className="text-center">
          <p className={`${textSub} text-sm`}>Sahi Fund not found.</p>
          <button onClick={() => navigate(-1)} className="text-[#d6fd70] text-xs mt-2 hover:underline">Go back</button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <button onClick={() => navigate(-1)} className={`flex items-center gap-1.5 text-sm ${textMuted} hover:${text} transition-colors`}>
        <ArrowBackIcon size={15} weight="bold" />
        Explore Sahi Funds
      </button>

      {/* Header */}
      <div className={`${card} rounded-2xl p-6`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className={`text-xl font-bold ${text}`}>{fund.name}</h1>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${fund.accessTier === 'pro' ? 'bg-[#4f46e5]/20 text-[#4f46e5]' : 'bg-[#d6fd70]/10 text-[#d6fd70]'}`}>
                {fund.accessTier === 'pro' ? 'PRO' : 'FREE'}
              </span>
              <VolatilityBadge level={fund.volatility} />
            </div>
            <p className={`text-sm ${textSub} max-w-2xl`}>{fund.description}</p>
          </div>
          <button className="bg-[#d6fd70] hover:bg-[#b8d94a] text-black text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors flex-shrink-0 ml-4">
            Invest Now
          </button>
        </div>

        {/* Stats row */}
        <div className={`grid grid-cols-5 gap-4 pt-4 border-t ${dividerColor}`}>
          {[
            { label: 'Fund Count', value: `${fund.fundCount} Funds` },
            { label: 'Min Amount', value: `₹${fund.minAmount.toLocaleString('en-IN')}` },
            { label: 'Rebalance', value: fund.rebalanceFrequency },
            { label: 'Last Rebalance', value: new Date(fund.lastRebalance).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
            { label: 'Next Rebalance', value: new Date(fund.nextRebalance).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
          ].map((s) => (
            <div key={s.label}>
              <p className={`text-[11px] ${textMuted} mb-0.5`}>{s.label}</p>
              <p className={`text-sm font-semibold ${text}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Returns row */}
      <div className="grid grid-cols-5 gap-3">
        {(['1M', '3M', '6M', '1Y', '3Y'] as const).map((k) => (
          <div key={k} className={`${card} rounded-xl px-4 py-3 text-center`}>
            <p className={`text-[11px] ${textMuted} mb-1`}>{k} Returns</p>
            <p className={`text-lg font-bold ${(fund.returns[k] ?? 0) >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {(fund.returns[k] ?? 0) >= 0 ? '+' : ''}{fund.returns[k]?.toFixed(1)}%
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={`flex gap-0 ${lm ? 'bg-[#F3F4F6] border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'} rounded-xl p-1 w-fit`}>
        {(['overview', 'funds'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize"
            style={{ background: tab === t ? '#d6fd70' : 'transparent', color: tab === t ? '#000' : lm ? '#6B7280' : '#8390a2' }}
          >
            {t === 'funds' ? 'Funds & Weights' : 'Overview'}
          </button>
        ))}
      </div>

      {/* Tab — Overview */}
      {tab === 'overview' && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* Performance chart */}
            <div className={`${card} rounded-2xl p-5`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-sm font-semibold ${text}`}>Live Performance</h2>
                <span className={`text-[11px] ${textMuted}`}>Since inception (indexed to 100)</span>
              </div>
              <PlanGate requiredTier="pro" label="Unlock Live Performance Chart">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={NAV_HISTORY}>
                    <defs>
                      <linearGradient id="sfGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d6fd70" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#d6fd70" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: chartTick }} tickLine={false} axisLine={false} interval={3} />
                    <YAxis tick={{ fontSize: 10, fill: chartTick }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      labelStyle={{ color: lm ? '#6B7280' : '#8390a2', fontSize: 11 }}
                      itemStyle={{ color: '#d6fd70', fontSize: 12, fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#d6fd70" strokeWidth={2} fill="url(#sfGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </PlanGate>
            </div>

            {/* Methodology */}
            <div className={`${card} rounded-2xl p-5`}>
              <h2 className={`text-sm font-semibold ${text} mb-3 flex items-center gap-2`}>
                <InfoOutlinedIcon size={15} color={lm ? '#4f46e5' : '#d6fd70'} weight="regular" /> Methodology
              </h2>
              <p className={`text-sm ${textSub} leading-relaxed`}>{fund.methodology}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {fund.tags.map((tag) => (
                <span key={tag} className={`text-xs px-3 py-1 rounded-full ${chip}`}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            {/* Allocation donut */}
            {fund.holdingsDistribution && (
              <div className={`${card} rounded-2xl p-5`}>
                <h2 className={`text-sm font-semibold ${text} mb-4`}>Allocation</h2>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={fund.holdingsDistribution} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={60} strokeWidth={0}>
                      {fund.holdingsDistribution.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(val) => [`${val}%`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {fund.holdingsDistribution.map((d) => (
                    <div key={d.label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                        <span className={textSub}>{d.label}</span>
                      </div>
                      <span className={`${text} font-semibold`}>{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Manager */}
            <div className={`${card} rounded-2xl p-5`}>
              <h2 className={`text-sm font-semibold ${text} mb-3`}>Managed By</h2>
              <p className={`text-sm font-medium ${text}`}>{fund.managerName}</p>
              <p className={`text-xs ${textMuted}`}>{fund.managerCompany}</p>
            </div>

            {/* Rebalance schedule */}
            <div className={`${card} rounded-2xl p-5`}>
              <h2 className={`text-sm font-semibold ${text} mb-3 flex items-center gap-2`}>
                <EventIcon size={14} color={lm ? '#4f46e5' : '#d6fd70'} weight="regular" /> Rebalance Schedule
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className={textMuted}>Frequency</span>
                  <span className={text}>{fund.rebalanceFrequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className={textMuted}>Last</span>
                  <span className={text}>{new Date(fund.lastRebalance).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className={textMuted}>Next</span>
                  <span className="text-[#d6fd70] font-semibold">{new Date(fund.nextRebalance).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab — Funds & Weights */}
      {tab === 'funds' && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <PlanGate requiredTier="pro" label="Unlock Fund Weights">
              <div className={`${card} rounded-2xl overflow-hidden`}>
                <div className={`grid grid-cols-[1fr_80px_80px] gap-4 px-5 py-3 border-b ${dividerColor}`}>
                  {['Fund Name', 'Weight', '1Y Return'].map((h) => (
                    <span key={h} className={`text-[11px] font-semibold ${textMuted} uppercase tracking-wider`}>{h}</span>
                  ))}
                </div>
                {(fund.holdings ?? []).map((h, i) => (
                  <div key={h.fundId} className={`grid grid-cols-[1fr_80px_80px] gap-4 px-5 py-4 items-center border-b ${rowBorder} ${rowHover} transition-colors`} style={{ borderBottomColor: i === (fund.holdings?.length ?? 0) - 1 ? 'transparent' : undefined }}>
                    <p className={`text-sm font-medium ${text}`}>{h.fundName}</p>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className={`flex-1 ${progressTrack} rounded-full h-1.5`}>
                          <div className="h-1.5 rounded-full bg-[#d6fd70]" style={{ width: `${h.weight}%` }} />
                        </div>
                        <span className={`text-xs font-semibold ${text} w-8 text-right`}>{h.weight}%</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#22C55E]">+{(14 + i * 2.3).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </PlanGate>
          </div>

          {/* At a glance */}
          <div className={`${card} rounded-2xl p-5 h-fit`}>
            <h2 className={`text-sm font-semibold ${text} mb-4`}>At a Glance</h2>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Number of Funds', value: fund.fundCount },
                { label: 'Rebalance Frequency', value: fund.rebalanceFrequency },
                { label: 'Next Rebalance', value: new Date(fund.nextRebalance).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                { label: 'Risk Level', value: fund.volatility },
                { label: 'Min Investment', value: `₹${fund.minAmount.toLocaleString('en-IN')}` },
              ].map((s) => (
                <div key={s.label} className={`flex justify-between items-center py-2 border-b ${rowBorder} last:border-0`}>
                  <span className={textMuted}>{s.label}</span>
                  <span className={`${text} font-medium`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEBI disclaimer */}
      <p className={`text-[10px] ${lm ? 'text-[#9CA3AF]' : 'text-[#505d6f]'} text-center`}>
        Sahi MF Funds are model portfolios for educational purposes. Mutual Fund investments are subject to market risks.
        Past performance does not guarantee future returns. This is not investment advice.
        Please consult a SEBI-registered investment advisor before investing.
      </p>
    </div>
  )
}

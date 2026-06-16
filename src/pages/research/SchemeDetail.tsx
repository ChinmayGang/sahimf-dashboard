import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ArrowLeft as ArrowBackIcon } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { VolatilityBadge } from '../../components/ui/VolatilityBadge'
import { PlanGate } from '../../components/ui/PlanGate'
import { mockFunds, getMockNavData } from '../../data/funds'
import { useUIStore } from '../../stores/uiStore'

const periods = ['1M', '6M', '1Y', '3Y', 'MAX'] as const
type Period = (typeof periods)[number]

const periodMonths: Record<Period, number> = { '1M': 1, '6M': 6, '1Y': 12, '3Y': 36, MAX: 60 }

const holdingsDist = [
  { label: 'Equity', value: 75.9, color: '#d6fd70' },
  { label: 'Mutual Funds', value: 13.1, color: '#4f46e5' },
  { label: 'Cash & Eq.', value: 11.0, color: '#22C55E' },
]

export function SchemeDetail() {
  const { id } = useParams()
  const fund = mockFunds.find((f) => f.id === id) ?? mockFunds[2]
  const [tab, setTab] = useState<'overview' | 'constituents'>('overview')
  const [period, setPeriod] = useState<Period>('3Y')
  const lm = useUIStore((s) => s.lightMode)

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'
  const chip = lm ? 'bg-[#F3F4F6] text-[#374151]' : 'bg-[#1e2838] text-[#8390a2]'
  const rowBorder = lm ? 'border-[#F0F0F8]' : 'border-[#1e2838]'
  const dividerColor = lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'
  const tabBorder = lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'
  const accentBg = lm ? 'bg-[#F3F4F6]' : 'bg-[#1e2838]'
  const tooltipStyle = {
    background: lm ? '#fff' : '#14171c',
    border: `1px solid ${lm ? '#E0E3E8' : '#1e2838'}`,
    borderRadius: 8, fontSize: 12,
    color: lm ? '#111827' : '#fff',
  }
  const chartTick = lm ? '#9CA3AF' : '#64748b'
  const constituentBorder = lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'

  const navData = getMockNavData(periodMonths[period])
  const startVal = navData[0]?.value ?? 100
  const endVal = navData[navData.length - 1]?.value ?? 100
  const totalReturn = (((endVal - startVal) / startVal) * 100).toFixed(2)

  // Nifty 50 benchmark (normalised to fund's start value so both start at same point)
  const niftyData = navData.map((d, i) => ({
    ...d,
    nifty: startVal * (1 + i * 0.008 + Math.sin(i * 0.3) * 0.012),
  }))
  const niftyReturn = (((niftyData[niftyData.length - 1]?.nifty ?? startVal) - startVal) / startVal * 100).toFixed(2)
  const alpha = (Number(totalReturn) - Number(niftyReturn)).toFixed(1)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      {/* Back */}
      <Link to="/mutual-funds/search" className={`flex items-center gap-2 text-xs ${textMuted} hover:${text} transition-colors w-fit`}>
        <ArrowBackIcon size={14} weight="bold" />
        Back to Search
      </Link>

      {/* Fund header */}
      <div className={`${card} rounded-xl p-5`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${accentBg} flex items-center justify-center text-sm font-bold text-[#d6fd70]`}>
              {fund.amcName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className={`text-base font-semibold ${text}`}>{fund.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs ${textSub}`}>{fund.category}</span>
                <span className={lm ? 'text-[#E0E3E8]' : 'text-[#1e2838]'}>·</span>
                <span className={`text-xs ${textSub}`}>{fund.subCategory}</span>
                {fund.tags.slice(0, 2).map((t) => (
                  <span key={t} className={`text-xs ${chip} px-2 py-0.5 rounded-full`}>{t}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-8 text-right">
            <div>
              <p className={`text-xs ${textSub}`}>NAV</p>
              <p className={`text-lg font-semibold ${text}`}>₹{fund.nav.toFixed(2)}</p>
              <p className={`text-xs ${fund.navChangePercent >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {fund.navChangePercent >= 0 ? '▲' : '▼'} {Math.abs(fund.navChangePercent).toFixed(2)}%
              </p>
            </div>
            <div>
              <p className={`text-xs ${textSub}`}>5Y CAGR</p>
              <p className="text-lg font-semibold text-[#22C55E]">+{fund.returns['5Y'] ?? '—'}%</p>
            </div>
            <div><VolatilityBadge level={fund.volatility} size="md" /></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex gap-1 border-b ${tabBorder}`}>
        {(['overview', 'constituents'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-[#d6fd70] text-[#d6fd70]' : `border-transparent ${textSub} hover:${text}`
            }`}
          >
            {t === 'overview' ? 'Overview' : 'Constituents'}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-3 gap-5">
          {/* Left: Performance + Analysis */}
          <div className="col-span-2 space-y-4">
            {/* Performance chart */}
            <div className={`${card} rounded-xl p-5`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className={`text-xs ${textSub}`}>This fund</p>
                    <p className={`text-xl font-semibold ${Number(totalReturn) >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                      {Number(totalReturn) >= 0 ? '+' : ''}{totalReturn}%
                    </p>
                  </div>
                  <div className={`h-8 w-px`} style={{ background: lm ? '#E0E3E8' : '#1e2838' }} />
                  <div>
                    <p className={`text-xs ${textSub}`}>Nifty 50</p>
                    <p className={`text-xl font-semibold ${textSub}`}>{Number(niftyReturn) >= 0 ? '+' : ''}{niftyReturn}%</p>
                  </div>
                  <div
                    className="px-2.5 py-1 rounded-lg text-xs font-bold"
                    style={Number(alpha) >= 0
                      ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }
                      : { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}
                  >
                    {Number(alpha) >= 0 ? '▲' : '▼'} {Math.abs(Number(alpha))}% alpha
                  </div>
                </div>
                <div className="flex gap-1">
                  {periods.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                        period === p ? 'bg-[#d6fd70] text-black font-semibold' : `${textSub} hover:${text}`
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1.5"><div className="w-6 h-0.5 rounded" style={{ background: '#d6fd70' }} /><span className={`text-xs ${textSub}`}>{fund.name.split(' ')[0]}</span></div>
                <div className="flex items-center gap-1.5"><div className="w-6 h-0.5 rounded border-t-2 border-dashed" style={{ borderColor: '#64748b' }} /><span className={`text-xs ${textSub}`}>Nifty 50</span></div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={niftyData}>
                  <defs>
                    <linearGradient id="navGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d6fd70" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#d6fd70" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: chartTick }} tickLine={false} axisLine={false}
                    tickFormatter={(v) => format(new Date(v), period === '1M' ? 'd MMM' : 'MMM yy')} interval="preserveStartEnd" />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelFormatter={(v) => format(new Date(v as string), 'd MMM yyyy')}
                    formatter={(v, name) => [`₹${Number(v).toFixed(2)}`, name === 'nifty' ? 'Nifty 50' : 'NAV']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#d6fd70" strokeWidth={2} fill="url(#navGrad)" dot={false} />
                  <Area type="monotone" dataKey="nifty" stroke="#64748b" strokeWidth={1.5} strokeDasharray="5 3" fill="none" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Key metrics */}
            <div className={`${card} rounded-xl p-5`}>
              <h3 className={`text-sm font-semibold ${text} mb-4`}>Fund Analysis</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {[
                  { label: 'Expense Ratio', fund: `${fund.expenseRatio}%`, cat: '1.34%' },
                  { label: 'Exit Load', fund: `${fund.exitLoad}%`, cat: '0.69%' },
                  { label: 'Sharpe Ratio', fund: `${fund.sharpeRatio}`, cat: '0.33' },
                  { label: 'Fund Size', fund: `₹${fund.fundSize.toLocaleString('en-IN')} Cr`, cat: '—' },
                  { label: 'Min SIP', fund: `₹${fund.minSIP}`, cat: '—' },
                  { label: 'Lock-in', fund: fund.lockIn, cat: '—' },
                ].map((row) => (
                  <div key={row.label} className={`flex items-center justify-between py-1.5 border-b ${rowBorder}`}>
                    <span className={`text-xs ${textSub}`}>{row.label}</span>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className={text}>{row.fund}</span>
                      {row.cat !== '—' && <span className={textMuted}>Cat: {row.cat}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About the fund */}
            <div className={`${card} rounded-xl p-5`}>
              <h3 className={`text-sm font-semibold ${text} mb-3`}>About the Fund</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Min SIP Amount', value: `₹${fund.minSIP}` },
                  { label: 'Lock-in', value: fund.lockIn },
                  { label: 'Fund Size', value: `₹${fund.fundSize.toLocaleString('en-IN')} Cr` },
                  { label: 'Launched on', value: new Date(fund.launchedOn).getFullYear() },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d6fd70]" />
                    <span className={`text-xs ${textSub}`}>{item.label}:</span>
                    <span className={`text-xs font-semibold ${text}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: CTA + Returns */}
          <div className="space-y-4">
            <div className={`${card} rounded-xl p-5 space-y-3`}>
              <div>
                <p className={`text-xs ${textSub}`}>Minimum Investment</p>
                <p className={`text-xl font-semibold ${text}`}>₹{fund.minLumpsum}</p>
              </div>
              <button className="w-full bg-[#d6fd70] hover:bg-[#b8d94a] text-black text-sm font-semibold py-2.5 rounded-lg transition-colors">
                Start SIP
              </button>
              <button className={`w-full border ${dividerColor} hover:border-[#d6fd70]/30 ${text} text-sm font-semibold py-2.5 rounded-lg transition-colors`}>
                Invest Now
              </button>
            </div>

            {/* Returns table */}
            <div className={`${card} rounded-xl p-5`}>
              <h3 className={`text-sm font-semibold ${text} mb-3`}>Returns</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className={`border-b ${dividerColor}`}>
                    <th className={`text-left ${textMuted} py-1.5`}>Period</th>
                    <th className={`text-right ${textMuted} py-1.5`}>Fund</th>
                    <th className={`text-right ${textMuted} py-1.5`}>Cat Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {(['1Y', '3Y', '5Y'] as const).map((p) => (
                    <tr key={p} className={`border-b ${rowBorder} last:border-b-0`}>
                      <td className={`${textSub} py-2`}>{p} Return</td>
                      <td className="text-right py-2">
                        {p === '1Y' ? (
                          <span className="text-[#22C55E] font-semibold">+{fund.returns[p]}%</span>
                        ) : (
                          <PlanGate requiredTier="pro" compact>
                            <span className="text-[#22C55E] font-semibold">+{fund.returns[p]}%</span>
                          </PlanGate>
                        )}
                      </td>
                      <td className={`text-right py-2 ${textMuted}`}>—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'constituents' && (
        <div className="grid grid-cols-3 gap-5">
          <div className={`col-span-2 ${card} rounded-xl p-5`}>
            <h3 className={`text-sm font-semibold ${text} mb-4`}>Constituents & Weights</h3>
            {fund.constituents ? (
              <div className="space-y-3">
                {fund.constituents.map((sec) => (
                  <div key={sec.sector}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-semibold ${text}`}>{sec.sector}</span>
                      <span className="text-xs font-semibold text-[#d6fd70]">{sec.totalWeight}%</span>
                    </div>
                    {sec.holdings.map((h) => (
                      <div key={h.name} className={`flex justify-between py-1 pl-3 border-l ${constituentBorder} ml-1`}>
                        <span className={`text-xs ${textSub}`}>{h.name}</span>
                        <span className={`text-xs ${text}`}>{h.weight}%</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-xs ${textMuted}`}>Constituents data not available for this fund.</p>
            )}
          </div>

          <div className={`${card} rounded-xl p-5`}>
            <h3 className={`text-sm font-semibold ${text} mb-4`}>Holdings Distribution</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={holdingsDist} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70} strokeWidth={0}>
                  {holdingsDist.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {holdingsDist.map((d) => (
                <div key={d.label} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className={`text-xs ${textSub}`}>{d.label}</span>
                  </div>
                  <span className={`text-xs font-semibold ${text}`}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

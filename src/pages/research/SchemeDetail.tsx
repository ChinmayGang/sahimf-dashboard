import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { format } from 'date-fns'
import { VolatilityBadge } from '../../components/ui/VolatilityBadge'
import { PlanGate } from '../../components/ui/PlanGate'
import { mockFunds, getMockNavData } from '../../data/funds'

const periods = ['1M', '6M', '1Y', '3Y', 'MAX'] as const
type Period = (typeof periods)[number]

const periodMonths: Record<Period, number> = { '1M': 1, '6M': 6, '1Y': 12, '3Y': 36, MAX: 60 }

const holdingsDist = [
  { label: 'Equity', value: 75.9, color: '#C5F135' },
  { label: 'Mutual Funds', value: 13.1, color: '#7B2FBE' },
  { label: 'Cash & Eq.', value: 11.0, color: '#22C55E' },
]

export function SchemeDetail() {
  const { id } = useParams()
  const fund = mockFunds.find((f) => f.id === id) ?? mockFunds[2]
  const [tab, setTab] = useState<'overview' | 'constituents'>('overview')
  const [period, setPeriod] = useState<Period>('3Y')

  const navData = getMockNavData(periodMonths[period])
  const startVal = navData[0]?.value ?? 100
  const endVal = navData[navData.length - 1]?.value ?? 100
  const totalReturn = (((endVal - startVal) / startVal) * 100).toFixed(2)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      {/* Back */}
      <Link to="/mutual-funds/search" className="flex items-center gap-2 text-xs text-[#606060] hover:text-white transition-colors w-fit">
        <ArrowBackIcon sx={{ fontSize: 14 }} />
        Back to Search
      </Link>

      {/* Fund header */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2A2A2A] flex items-center justify-center text-sm font-bold text-[#C5F135]">
              {fund.amcName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-base font-semibold text-white">{fund.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[#A0A0A0]">{fund.category}</span>
                <span className="text-[#2A2A2A]">·</span>
                <span className="text-xs text-[#A0A0A0]">{fund.subCategory}</span>
                {fund.tags.slice(0, 2).map((t) => (
                  <span key={t} className="text-xs bg-[#2A2A2A] text-[#A0A0A0] px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-8 text-right">
            <div>
              <p className="text-xs text-[#A0A0A0]">NAV</p>
              <p className="text-lg font-semibold text-white">₹{fund.nav.toFixed(2)}</p>
              <p className={`text-xs ${fund.navChangePercent >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {fund.navChangePercent >= 0 ? '▲' : '▼'} {Math.abs(fund.navChangePercent).toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-[#A0A0A0]">5Y CAGR</p>
              <p className="text-lg font-semibold text-[#22C55E]">+{fund.returns['5Y'] ?? '—'}%</p>
            </div>
            <div><VolatilityBadge level={fund.volatility} size="md" /></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#1E1E1E]">
        {(['overview', 'constituents'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-[#C5F135] text-[#C5F135]' : 'border-transparent text-[#A0A0A0] hover:text-white'
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
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-[#A0A0A0]">Performance</p>
                  <p className={`text-xl font-semibold ${Number(totalReturn) >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                    {Number(totalReturn) >= 0 ? '+' : ''}{totalReturn}%
                  </p>
                </div>
                <div className="flex gap-1">
                  {periods.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                        period === p ? 'bg-[#C5F135] text-black font-semibold' : 'text-[#A0A0A0] hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={navData}>
                  <defs>
                    <linearGradient id="navGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C5F135" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#C5F135" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#606060' }} tickLine={false} axisLine={false}
                    tickFormatter={(v) => format(new Date(v), period === '1M' ? 'd MMM' : 'MMM yy')} interval="preserveStartEnd" />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8, fontSize: 12 }}
                    labelFormatter={(v) => format(new Date(v as string), 'd MMM yyyy')}
                    formatter={(v) => [`₹${Number(v).toFixed(2)}`, 'NAV']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#C5F135" strokeWidth={2} fill="url(#navGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Key metrics */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Fund Analysis</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {[
                  { label: 'Expense Ratio', fund: `${fund.expenseRatio}%`, cat: '1.34%' },
                  { label: 'Exit Load', fund: `${fund.exitLoad}%`, cat: '0.69%' },
                  { label: 'Sharpe Ratio', fund: `${fund.sharpeRatio}`, cat: '0.33' },
                  { label: 'Fund Size', fund: `₹${fund.fundSize.toLocaleString('en-IN')} Cr`, cat: '—' },
                  { label: 'Min SIP', fund: `₹${fund.minSIP}`, cat: '—' },
                  { label: 'Lock-in', fund: fund.lockIn, cat: '—' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-[#1E1E1E]">
                    <span className="text-xs text-[#A0A0A0]">{row.label}</span>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className="text-white">{row.fund}</span>
                      {row.cat !== '—' && <span className="text-[#606060]">Cat: {row.cat}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About the fund */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">About the Fund</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Min SIP Amount', value: `₹${fund.minSIP}` },
                  { label: 'Lock-in', value: fund.lockIn },
                  { label: 'Fund Size', value: `₹${fund.fundSize.toLocaleString('en-IN')} Cr` },
                  { label: 'Launched on', value: new Date(fund.launchedOn).getFullYear() },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C5F135]" />
                    <span className="text-xs text-[#A0A0A0]">{item.label}:</span>
                    <span className="text-xs font-semibold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: CTA + Returns */}
          <div className="space-y-4">
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5 space-y-3">
              <div>
                <p className="text-xs text-[#A0A0A0]">Minimum Investment</p>
                <p className="text-xl font-semibold text-white">₹{fund.minLumpsum}</p>
              </div>
              <button className="w-full bg-[#C5F135] hover:bg-[#A8D020] text-black text-sm font-semibold py-2.5 rounded-lg transition-colors">
                Start SIP
              </button>
              <button className="w-full border border-[#2A2A2A] hover:border-[#C5F135]/30 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
                Invest Now
              </button>
            </div>

            {/* Returns table */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Returns</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#2A2A2A]">
                    <th className="text-left text-[#606060] py-1.5">Period</th>
                    <th className="text-right text-[#606060] py-1.5">Fund</th>
                    <th className="text-right text-[#606060] py-1.5">Cat Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {(['1Y', '3Y', '5Y'] as const).map((p) => (
                    <tr key={p} className="border-b border-[#1E1E1E] last:border-b-0">
                      <td className="text-[#A0A0A0] py-2">{p} Return</td>
                      <td className="text-right py-2">
                        {p === '1Y' ? (
                          <span className="text-[#22C55E] font-semibold">+{fund.returns[p]}%</span>
                        ) : (
                          <PlanGate requiredTier="pro" compact>
                            <span className="text-[#22C55E] font-semibold">+{fund.returns[p]}%</span>
                          </PlanGate>
                        )}
                      </td>
                      <td className="text-right py-2 text-[#606060]">—</td>
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
          <div className="col-span-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Constituents & Weights</h3>
            {fund.constituents ? (
              <div className="space-y-3">
                {fund.constituents.map((sec) => (
                  <div key={sec.sector}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-white">{sec.sector}</span>
                      <span className="text-xs font-semibold text-[#C5F135]">{sec.totalWeight}%</span>
                    </div>
                    {sec.holdings.map((h) => (
                      <div key={h.name} className="flex justify-between py-1 pl-3 border-l border-[#2A2A2A] ml-1">
                        <span className="text-xs text-[#A0A0A0]">{h.name}</span>
                        <span className="text-xs text-white">{h.weight}%</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#606060]">Constituents data not available for this fund.</p>
            )}
          </div>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Holdings Distribution</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={holdingsDist} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70} strokeWidth={0}>
                  {holdingsDist.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {holdingsDist.map((d) => (
                <div key={d.label} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-xs text-[#A0A0A0]">{d.label}</span>
                  </div>
                  <span className="text-xs font-semibold text-white">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

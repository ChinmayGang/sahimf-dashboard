import { useState, useMemo } from 'react'
import { TrendUp as TrendUpIcon, Lock as LockIcon, ArrowRight as ArrowRightIcon, ChartLine as ChartLineIcon } from '@phosphor-icons/react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { mockFunds } from '../../data/funds'
import { useUIStore } from '../../stores/uiStore'
import { usePlan } from '../../hooks/usePlan'

const FREE_VISIBLE = 3
const NIFTY_XIRR = 12.4
const CATEGORIES = ['All', 'Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'Sectoral', 'Balanced Advantage', 'Gilt']

function sipCorpus(monthly: number, annualRate: number, years: number) {
  const r = annualRate / 100 / 12
  const n = years * 12
  if (r === 0) return monthly * n
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
}


function formatINR(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`
  return `₹${n.toLocaleString('en-IN')}`
}

const CHART_COLORS = ['#d6fd70', '#6366f1', '#22c55e', '#f59e0b', '#0891b2', '#ec4899', '#14b8a6', '#a855f7', '#f97316', '#ef4444']
const NIFTY_COLOR = '#64748b'

export function SIPWhatIf() {
  const lm = useUIStore((s) => s.lightMode)
  const { can } = usePlan()
  const isPro = can('pro')

  const [monthly, setMonthly] = useState(5000)
  const [years, setYears] = useState(5)
  const [category, setCategory] = useState('All')

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'
  const divider = lm ? '#E0E3E8' : '#1e2838'
  const tooltipStyle = { background: lm ? '#fff' : '#14171c', border: `1px solid ${divider}`, borderRadius: 8, fontSize: 11, color: lm ? '#111827' : '#fff' }
  const accentText = lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'

  const filtered = useMemo(() => {
    const base = category === 'All'
      ? mockFunds
      : mockFunds.filter(f => f.subCategory === category || f.category === category)
    return [...base]
      .sort((a, b) => sipCorpus(monthly, b.returns['5Y'] ?? 12, years) - sipCorpus(monthly, a.returns['5Y'] ?? 12, years))
      .slice(0, 10)
  }, [monthly, years, category])

  const chartData = useMemo(() => {
    const pts: Record<string, number | string>[] = []
    for (let y = 0; y <= years; y++) {
      const row: Record<string, number | string> = { year: `${y}Y` }
      filtered.forEach((f, i) => {
        row[`f${i}`] = Math.round(sipCorpus(monthly, f.returns['5Y'] ?? 12, y))
      })
      row['nifty'] = Math.round(sipCorpus(monthly, NIFTY_XIRR, y))
      pts.push(row)
    }
    return pts
  }, [filtered, monthly, years])

  const invested = monthly * years * 12

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${lm ? 'bg-[#eeedfd]' : 'bg-[#4f46e5]/10'}`}>
          <ChartLineIcon size={18} color={lm ? '#6366f1' : '#d6fd70'} weight="duotone" />
        </div>
        <div>
          <h1 className={`text-lg font-bold ${text}`}>SIP What If Calculator</h1>
          <p className={`text-xs ${textMuted}`}>Compare how top funds would have grown your SIP — side by side</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left: controls */}
        <div className={`${card} rounded-xl p-5 space-y-5`}>
          {/* Monthly SIP */}
          <div>
            <div className="flex justify-between mb-2">
              <label className={`text-xs font-medium ${textSub}`}>Monthly SIP</label>
              <span className={`text-xs font-bold ${accentText}`}>₹{monthly.toLocaleString('en-IN')}</span>
            </div>
            <input type="range" min={500} max={50000} step={500} value={monthly}
              onChange={e => setMonthly(Number(e.target.value))} className="w-full accent-[#4f46e5]" />
            <div className={`flex justify-between text-[10px] ${textMuted} mt-1`}>
              <span>₹500</span><span>₹50K</span>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className={`text-xs font-medium ${textSub} block mb-2`}>Duration</label>
            <div className="flex gap-1.5 flex-wrap">
              {[1, 3, 5, 10, 15, 20].map(y => (
                <button
                  key={y}
                  onClick={() => setYears(y)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-colors font-medium ${years === y ? 'bg-[#4f46e5] text-white' : `${textSub} border`}`}
                  style={years !== y ? { borderColor: divider } : {}}
                >
                  {y}Y
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className={`text-xs font-medium ${textSub} block mb-2`}>Category</label>
            <div className="flex flex-col gap-1">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors ${category === c ? (lm ? 'bg-[#eeedfd] text-[#4f46e5] font-semibold' : 'bg-[#4f46e5]/15 text-[#818cf8] font-semibold') : `${textSub} hover:bg-[${lm ? '#F3F4F6' : '#1e2838'}]`}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="pt-3 border-t space-y-2" style={{ borderColor: divider }}>
            <div className="flex justify-between">
              <span className={`text-xs ${textSub}`}>Total Invested</span>
              <span className={`text-xs font-semibold ${text}`}>{formatINR(invested)}</span>
            </div>
            <div className="flex justify-between">
              <span className={`text-xs ${textSub}`}>Nifty 50 corpus</span>
              <span className={`text-xs font-semibold ${text}`}>{formatINR(sipCorpus(monthly, NIFTY_XIRR, years))}</span>
            </div>
            {filtered[0] && (
              <div className="flex justify-between">
                <span className={`text-xs ${textSub}`}>Top fund corpus</span>
                <span className="text-xs font-bold text-[#22c55e]">{formatINR(sipCorpus(monthly, filtered[0].returns['5Y'] ?? 12, years))}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: chart + table */}
        <div className="col-span-2 space-y-4">
          {/* Chart */}
          <div className={`${card} rounded-xl p-5`}>
            <div className="flex items-center justify-between mb-3">
              <p className={`text-sm font-semibold ${text}`}>Corpus Growth — ₹{monthly.toLocaleString('en-IN')}/mo over {years}Y</p>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[10px]" style={{ color: NIFTY_COLOR }}>
                  <span className="inline-block w-6 border-t-2 border-dashed" style={{ borderColor: NIFTY_COLOR }} />
                  Nifty 50
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: lm ? '#9CA3AF' : '#64748b' }} tickLine={false} axisLine={false} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v, name) => {
                    if (name === 'nifty') return [formatINR(Number(v)), 'Nifty 50']
                    const i = parseInt(String(name).replace('f', ''))
                    const fund = filtered[i]
                    return [formatINR(Number(v)), fund ? (isPro || i < FREE_VISIBLE ? fund.name.split(' ').slice(0, 3).join(' ') : '••••••') : name]
                  }}
                />
                <ReferenceLine y={invested} stroke={lm ? '#D1D5DB' : '#374151'} strokeDasharray="3 3" />
                {filtered.map((_, i) => (
                  <Line
                    key={`f${i}`}
                    type="monotone"
                    dataKey={`f${i}`}
                    stroke={CHART_COLORS[i]}
                    strokeWidth={i === 0 ? 2.5 : 1.5}
                    dot={false}
                    opacity={isPro || i < FREE_VISIBLE ? 1 : 0.3}
                  />
                ))}
                <Line type="monotone" dataKey="nifty" stroke={NIFTY_COLOR} strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <p className={`text-[10px] mt-1 ${textMuted}`}>Dashed reference = total amount invested. Returns based on 5Y historical CAGR. Not a guarantee.</p>
          </div>

          {/* Fund ranking table */}
          <div className={`${card} rounded-xl overflow-hidden`}>
            <div className={`grid grid-cols-[24px_1fr_80px_90px_90px_90px] gap-3 px-4 py-2.5 border-b`} style={{ borderColor: divider }}>
              {['#', 'Fund', 'Category', 'Rate', 'Final Corpus', 'vs Nifty'].map(h => (
                <span key={h} className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>{h}</span>
              ))}
            </div>

            {filtered.map((f, i) => {
              const finalCorpus = sipCorpus(monthly, f.returns['5Y'] ?? 12, years)
              const niftyCorpus = sipCorpus(monthly, NIFTY_XIRR, years)
              const alpha = finalCorpus - niftyCorpus
              const isLocked = !isPro && i >= FREE_VISIBLE

              return (
                <div
                  key={f.id}
                  className={`grid grid-cols-[24px_1fr_80px_90px_90px_90px] gap-3 px-4 py-3 items-center border-b transition-colors ${lm ? 'hover:bg-[#F9F9FF] border-[#F0F0F8]' : 'hover:bg-[#1a2130] border-[#1e2838]'} ${isLocked ? 'relative' : ''}`}
                >
                  <span className="text-xs font-bold" style={{ color: CHART_COLORS[i] }}>#{i + 1}</span>
                  <div style={{ filter: isLocked ? 'blur(5px)' : 'none', userSelect: isLocked ? 'none' : undefined }}>
                    <p className={`text-xs font-semibold ${text} truncate`}>{f.name}</p>
                    <p className={`text-[10px] ${textMuted}`}>{f.amcName}</p>
                  </div>
                  <span className={`text-[10px] ${textSub} leading-tight`}>{f.subCategory}</span>
                  <span className={`text-xs font-semibold ${text}`}>{f.returns['5Y'] ?? '—'}%</span>
                  <span className={`text-xs font-bold ${isLocked ? 'blur-sm select-none' : ''} ${text}`}>{isLocked ? '₹??.?? L' : formatINR(finalCorpus)}</span>
                  <span className={`text-xs font-semibold ${alpha >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'} ${isLocked ? 'blur-sm select-none' : ''}`}>
                    {alpha >= 0 ? '+' : ''}{formatINR(Math.abs(alpha))}
                  </span>
                </div>
              )
            })}

            {/* PRO gate overlay */}
            {!isPro && (
              <div className="px-4 py-4 flex items-center justify-between" style={{ background: lm ? '#F9F9FF' : '#0d0f14', borderTop: `1px solid ${divider}` }}>
                <div className="flex items-center gap-2">
                  <LockIcon size={14} color={lm ? '#6366f1' : '#d6fd70'} weight="duotone" />
                  <p className={`text-xs ${text}`}>
                    <span className="font-semibold">{filtered.length - FREE_VISIBLE} fund names hidden.</span>
                    {' '}Unlock all {filtered.length} funds with PRO to find hidden gems.
                  </p>
                </div>
                <button className="flex items-center gap-1.5 bg-[#4f46e5] text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-[#6366f1] transition-colors flex-shrink-0">
                  Try PRO Free <ArrowRightIcon size={12} weight="bold" />
                </button>
              </div>
            )}
          </div>

          {/* Insight row */}
          {filtered[0] && (
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: 'Best Fund Extra vs Nifty',
                  value: formatINR(sipCorpus(monthly, filtered[0].returns['5Y'] ?? 12, years) - sipCorpus(monthly, NIFTY_XIRR, years)),
                  color: '#22c55e',
                  icon: <TrendUpIcon size={14} weight="duotone" />,
                },
                {
                  label: `Invested over ${years}Y`,
                  value: formatINR(invested),
                  color: lm ? '#4f46e5' : '#d6fd70',
                  icon: <ChartLineIcon size={14} weight="duotone" />,
                },
                {
                  label: 'Top fund CAGR',
                  value: `${filtered[0].returns['5Y'] ?? '—'}% p.a.`,
                  color: '#22c55e',
                  icon: <TrendUpIcon size={14} weight="duotone" />,
                },
              ].map(s => (
                <div key={s.label} className={`${card} rounded-xl p-3`}>
                  <div className="flex items-center gap-1.5 mb-1" style={{ color: s.color }}>
                    {s.icon}
                    <span className={`text-[10px] font-medium ${textMuted}`}>{s.label}</span>
                  </div>
                  <p className="text-base font-bold" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className={`text-[10px] ${textMuted} text-center`}>
        Calculations based on historical 5Y CAGR. Past performance is not indicative of future returns. SahiMF is a SEBI-registered Research Analyst — this is generic research, not personalised advice.
      </p>
    </div>
  )
}

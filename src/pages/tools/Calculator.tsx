import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Calculator as CalculateIcon } from '@phosphor-icons/react'
import { useUIStore } from '../../stores/uiStore'

type ToolType = 'sip' | 'lumpsum' | 'swp' | 'stp'

function formatINR(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

function useSIPCalc(monthly: number, rate: number, years: number) {
  return useMemo(() => {
    const months = years * 12
    const r = rate / 100 / 12
    const data = []
    let invested = 0
    let value = 0
    for (let m = 1; m <= months; m++) {
      invested += monthly
      value = (value + monthly) * (1 + r)
      if (m % 6 === 0 || m === months) {
        data.push({
          month: m,
          label: `Y${Math.floor(m / 12) || 1}`,
          invested: Math.round(invested),
          value: Math.round(value),
        })
      }
    }
    return { data, totalInvested: invested, maturity: Math.round(value), gain: Math.round(value - invested) }
  }, [monthly, rate, years])
}

function useLumpsumCalc(principal: number, rate: number, years: number) {
  return useMemo(() => {
    const data = []
    for (let y = 1; y <= years; y++) {
      const value = principal * Math.pow(1 + rate / 100, y)
      data.push({ label: `Y${y}`, invested: principal, value: Math.round(value) })
    }
    const maturity = principal * Math.pow(1 + rate / 100, years)
    return { data, totalInvested: principal, maturity: Math.round(maturity), gain: Math.round(maturity - principal) }
  }, [principal, rate, years])
}

export function Calculator() {
  const { type } = useParams<{ type: ToolType }>()
  const toolType = (type ?? 'sip') as ToolType
  const lm = useUIStore((s) => s.lightMode)

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'
  const dividerColor = lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'
  const tooltipStyle = {
    background: lm ? '#fff' : '#14171c',
    border: `1px solid ${lm ? '#E0E3E8' : '#1e2838'}`,
    borderRadius: 8, fontSize: 12,
    color: lm ? '#111827' : '#fff',
  }
  const chartTick = lm ? '#9CA3AF' : '#64748b'

  const [monthly, setMonthly] = useState(10000)
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(12)
  const [years, setYears] = useState(10)
  const [_withdrawal, _setWithdrawal] = useState(5000)

  const sip = useSIPCalc(monthly, rate, years)
  const lumpsum = useLumpsumCalc(principal, rate, years)

  const isSIP = toolType === 'sip'
  const calc = isSIP ? sip : lumpsum
  const chartData = calc.data

  const toolLabels: Record<ToolType, string> = {
    sip: 'SIP Calculator',
    lumpsum: 'Lumpsum Calculator',
    swp: 'SWP Calculator',
    stp: 'STP Calculator',
  }

  const toolDescriptions: Record<ToolType, string> = {
    sip: 'Calculate wealth created by investing a fixed amount every month.',
    lumpsum: 'See how a one-time investment grows over time at a given rate.',
    swp: 'Plan systematic withdrawals from your corpus without depleting it.',
    stp: 'Transfer funds systematically from one fund to another.',
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${lm ? 'bg-[#4f46e5]/10' : 'bg-[#d6fd70]/10'} flex items-center justify-center`}>
          <CalculateIcon size={20} color={lm ? '#6366f1' : '#d6fd70'} weight="duotone" />
        </div>
        <div>
          <h1 className={`text-lg font-semibold ${text}`}>{toolLabels[toolType]}</h1>
          <p className={`text-xs ${textSub}`}>{toolDescriptions[toolType]}</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Inputs */}
        <div className={`col-span-2 ${card} rounded-xl p-5 space-y-5`}>
          {(isSIP || toolType === 'swp') ? (
            <div>
              <div className="flex justify-between mb-2">
                <label className={`text-xs ${textSub}`}>{toolType === 'swp' ? 'Monthly Withdrawal' : 'Monthly SIP Amount'}</label>
                <span className={`text-xs font-semibold ${lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'}`}>₹{monthly.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" min={500} max={100000} step={500} value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))} className="w-full" style={{ accentColor: lm ? '#4f46e5' : '#d6fd70' }} />
              <div className={`flex justify-between text-[10px] ${textMuted} mt-1`}>
                <span>₹500</span><span>₹1 L</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between mb-2">
                <label className={`text-xs ${textSub}`}>Investment Amount</label>
                <span className={`text-xs font-semibold ${lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'}`}>₹{principal.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" min={10000} max={10000000} step={10000} value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full" style={{ accentColor: lm ? '#4f46e5' : '#d6fd70' }} />
              <div className={`flex justify-between text-[10px] ${textMuted} mt-1`}>
                <span>₹10K</span><span>₹1 Cr</span>
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between mb-2">
              <label className={`text-xs ${textSub}`}>Expected Return Rate (p.a.)</label>
              <span className={`text-xs font-semibold ${lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'}`}>{rate}%</span>
            </div>
            <input type="range" min={4} max={30} step={0.5} value={rate}
              onChange={(e) => setRate(Number(e.target.value))} className="w-full" style={{ accentColor: lm ? '#4f46e5' : '#d6fd70' }} />
            <div className={`flex justify-between text-[10px] ${textMuted} mt-1`}>
              <span>4%</span><span>30%</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className={`text-xs ${textSub}`}>Time Period</label>
              <span className={`text-xs font-semibold ${lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'}`}>{years} yrs</span>
            </div>
            <input type="range" min={1} max={40} step={1} value={years}
              onChange={(e) => setYears(Number(e.target.value))} className="w-full" style={{ accentColor: lm ? '#4f46e5' : '#d6fd70' }} />
            <div className={`flex justify-between text-[10px] ${textMuted} mt-1`}>
              <span>1 yr</span><span>40 yrs</span>
            </div>
          </div>

          {/* Results */}
          <div className={`pt-4 border-t ${dividerColor} space-y-3`}>
            <div className="flex justify-between">
              <span className={`text-xs ${textSub}`}>Total Invested</span>
              <span className={`text-xs font-semibold ${text}`}>{formatINR(calc.totalInvested)}</span>
            </div>
            <div className="flex justify-between">
              <span className={`text-xs ${textSub}`}>Est. Returns</span>
              <span className="text-xs font-semibold text-[#22C55E]">+{formatINR(calc.gain)}</span>
            </div>
            <div className={`flex justify-between pt-2 border-t ${dividerColor}`}>
              <span className={`text-xs font-semibold ${textSub}`}>Total Value</span>
              <span className={`text-sm font-bold ${lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'}`}>{formatINR(calc.maturity)}</span>
            </div>
          </div>

          <button className="w-full bg-[#d6fd70] hover:bg-[#b8d94a] text-black text-sm font-semibold py-2.5 rounded-lg transition-colors">
            Start {toolType.toUpperCase()}
          </button>
        </div>

        {/* Chart */}
        <div className="col-span-3 space-y-4">
          <div className={`${card} rounded-xl p-5`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-sm font-semibold ${text}`}>Growth Projection</h2>
              <div className="text-right">
                <p className={`text-xs ${textSub}`}>Maturity Value</p>
                <p className={`text-lg font-bold ${lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'}`}>{formatINR(calc.maturity)}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="invGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="valGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={lm ? '#4f46e5' : '#d6fd70'} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={lm ? '#4f46e5' : '#d6fd70'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: chartTick }} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v) => [formatINR(Number(v))]}
                />
                <Area type="monotone" dataKey="invested" stroke="#4f46e5" strokeWidth={1.5} fill="url(#invGrad2)" />
                <Area type="monotone" dataKey="value" stroke={lm ? '#4f46e5' : '#d6fd70'} strokeWidth={2} fill="url(#valGrad2)" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#4f46e5] rounded" /><span className={`text-xs ${textSub}`}>Invested</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#d6fd70] rounded" /><span className={`text-xs ${textSub}`}>Projected Value</span></div>
            </div>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Wealth Multiplier', value: `${(calc.maturity / calc.totalInvested).toFixed(1)}x` },
              { label: 'Absolute Returns', value: `${(((calc.maturity - calc.totalInvested) / calc.totalInvested) * 100).toFixed(0)}%` },
              { label: 'Est. CAGR', value: `${rate}% p.a.` },
            ].map((s) => (
              <div key={s.label} className={`${card} rounded-xl p-3 text-center`}>
                <p className={`text-xs ${textSub} mb-1`}>{s.label}</p>
                <p className={`text-base font-bold ${text}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Calculator as CalculateIcon } from '@phosphor-icons/react'
import { useUIStore } from '../../stores/uiStore'
import { SIPWhatIf } from './SIPWhatIf'

type ToolType = 'sip' | 'lumpsum' | 'swp' | 'stp'

const TABS: { key: ToolType; label: string }[] = [
  { key: 'sip', label: 'SIP' },
  { key: 'lumpsum', label: 'Lumpsum' },
  { key: 'swp', label: 'SWP' },
  { key: 'stp', label: 'STP' },
]

function formatINR(n: number) {
  if (n >= 10000000) return `â‚¹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `â‚¹${(n / 100000).toFixed(2)} L`
  return `â‚¹${Math.round(n).toLocaleString('en-IN')}`
}

/** Each calculator normalises to { data:[{label,invested,value}], totalInvested, maturity, gain }. */
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
        data.push({ label: `Y${Math.floor(m / 12) || 1}`, invested: Math.round(invested), value: Math.round(value) })
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

/** SWP â€” start with a corpus, withdraw monthly while the balance keeps compounding. */
function useSWPCalc(corpus: number, withdrawal: number, rate: number, years: number) {
  return useMemo(() => {
    const months = years * 12
    const r = rate / 100 / 12
    const data = []
    let bal = corpus
    let withdrawn = 0
    for (let m = 1; m <= months; m++) {
      bal = bal * (1 + r) - withdrawal
      withdrawn += withdrawal
      if (bal < 0) bal = 0
      if (m % 6 === 0 || m === months) {
        data.push({ label: `Y${Math.floor(m / 12) || 1}`, invested: Math.round(withdrawn), value: Math.round(Math.max(0, bal)) })
      }
    }
    return { data, totalInvested: corpus, totalWithdrawn: withdrawn, maturity: Math.round(Math.max(0, bal)), gain: Math.round((withdrawn + Math.max(0, bal)) - corpus) }
  }, [corpus, withdrawal, rate, years])
}

/** STP â€” park a lump in a low-risk source (fixed 6.5% p.a.), transfer a fixed amount
 *  into the target each month where it compounds at the equity rate. */
function useSTPCalc(principal: number, transfer: number, targetRate: number, years: number) {
  return useMemo(() => {
    const months = years * 12
    const sr = 6.5 / 100 / 12
    const tr = targetRate / 100 / 12
    const data = []
    let src = principal
    let tgt = 0
    for (let m = 1; m <= months; m++) {
      src = src * (1 + sr)
      const t = Math.min(transfer, src)
      src -= t
      tgt = (tgt + t) * (1 + tr)
      if (m % 6 === 0 || m === months) {
        data.push({ label: `Y${Math.floor(m / 12) || 1}`, invested: principal, value: Math.round(src + tgt) })
      }
    }
    const maturity = src + tgt
    return { data, totalInvested: principal, maturity: Math.round(maturity), gain: Math.round(maturity - principal) }
  }, [principal, transfer, targetRate, years])
}

export function Calculator() {
  const [params, setParams] = useSearchParams()
  const lm = useUIStore((s) => s.lightMode)

  const initialTab = (TABS.some(t => t.key === params.get('tab')) ? params.get('tab') : 'sip') as ToolType
  const [tab, setTab] = useState<ToolType>(initialTab)
  useEffect(() => { if (params.get('tab') !== tab) setParams({ tab }, { replace: true }) }, [tab]) // eslint-disable-line react-hooks/exhaustive-deps

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#6B7280]' : 'text-[#64748b]'
  const dividerColor = lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'
  const tooltipStyle = {
    background: lm ? '#fff' : '#14171c',
    border: `1px solid ${lm ? '#E0E3E8' : '#1e2838'}`,
    borderRadius: 8, fontSize: 12,
    color: lm ? '#111827' : '#fff',
  }
  const chartTick = lm ? '#9CA3AF' : '#64748b'
  const accent = lm ? '#4f46e5' : '#d6fd70'

  const [monthly, setMonthly] = useState(10000)
  const [principal, setPrincipal] = useState(100000)
  const [corpus, setCorpus] = useState(2500000)
  const [withdrawal, setWithdrawal] = useState(20000)
  const [transfer, setTransfer] = useState(25000)
  const [rate, setRate] = useState(12)
  const [years, setYears] = useState(10)

  const sip = useSIPCalc(monthly, rate, years)
  const lumpsum = useLumpsumCalc(principal, rate, years)
  const swp = useSWPCalc(corpus, withdrawal, rate, years)
  const stp = useSTPCalc(principal, transfer, rate, years)

  const calc = tab === 'sip' ? sip : tab === 'lumpsum' ? lumpsum : tab === 'swp' ? swp : stp

  const toolLabels: Record<ToolType, string> = {
    sip: 'SIP Calculator',
    lumpsum: 'Lumpsum Calculator',
    swp: 'SWP Calculator',
    stp: 'STP Calculator',
  }
  const toolDescriptions: Record<ToolType, string> = {
    sip: 'Calculate wealth created by investing a fixed amount every month.',
    lumpsum: 'See how a one-time investment grows over time at a given rate.',
    swp: 'Plan systematic withdrawals from your corpus without depleting it early.',
    stp: 'Transfer funds systematically from a low-risk source into equity.',
  }
  // SWP relabels the three result rows since "invested" is really withdrawn.
  const resultLabels = tab === 'swp'
    ? { invested: 'Starting Corpus', gain: 'Total Withdrawn', total: 'Balance Left' }
    : { invested: 'Total Invested', gain: 'Est. Returns', total: 'Total Value' }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${lm ? 'bg-[#4f46e5]/10' : 'bg-[#d6fd70]/10'} flex items-center justify-center`}>
          <CalculateIcon size={20} color={lm ? '#6366f1' : '#d6fd70'} weight="fill" />
        </div>
        <div>
          <h1 className={`text-lg font-semibold ${text}`}>{toolLabels[tab]}</h1>
          <p className={`text-xs ${textSub}`}>{toolDescriptions[tab]}</p>
        </div>
      </div>

      {/* Segmented control */}
      <div className={`inline-flex gap-1 rounded-xl p-1 ${lm ? 'bg-[#F3F4F6] border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'}`}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={tab === t.key
              ? { background: accent, color: lm ? '#fff' : '#000' }
              : { background: 'transparent', color: lm ? '#6B7280' : '#8390a2' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Inputs */}
        <div className={`col-span-2 ${card} rounded-xl p-5 space-y-5`}>
          {tab === 'sip' && (
            <Slider label="Monthly SIP Amount" value={monthly} min={500} max={100000} step={500} onChange={setMonthly} fmt={v => `â‚¹${v.toLocaleString('en-IN')}`} loFmt="â‚¹500" hiFmt="â‚¹1 L" lm={lm} />
          )}
          {(tab === 'lumpsum' || tab === 'stp') && (
            <Slider label={tab === 'stp' ? 'Source Amount' : 'Investment Amount'} value={principal} min={10000} max={10000000} step={10000} onChange={setPrincipal} fmt={v => `â‚¹${v.toLocaleString('en-IN')}`} loFmt="â‚¹10K" hiFmt="â‚¹1 Cr" lm={lm} />
          )}
          {tab === 'swp' && (
            <>
              <Slider label="Starting Corpus" value={corpus} min={100000} max={50000000} step={100000} onChange={setCorpus} fmt={v => formatINR(v)} loFmt="â‚¹1 L" hiFmt="â‚¹5 Cr" lm={lm} />
              <Slider label="Monthly Withdrawal" value={withdrawal} min={1000} max={500000} step={1000} onChange={setWithdrawal} fmt={v => `â‚¹${v.toLocaleString('en-IN')}`} loFmt="â‚¹1K" hiFmt="â‚¹5 L" lm={lm} />
            </>
          )}
          {tab === 'stp' && (
            <Slider label="Monthly Transfer to Equity" value={transfer} min={1000} max={200000} step={1000} onChange={setTransfer} fmt={v => `â‚¹${v.toLocaleString('en-IN')}`} loFmt="â‚¹1K" hiFmt="â‚¹2 L" lm={lm} />
          )}

          <Slider label={tab === 'stp' ? 'Equity Return Rate (p.a.)' : 'Expected Return Rate (p.a.)'} value={rate} min={4} max={30} step={0.5} onChange={setRate} fmt={v => `${v}%`} loFmt="4%" hiFmt="30%" lm={lm} />
          <Slider label="Time Period" value={years} min={1} max={40} step={1} onChange={setYears} fmt={v => `${v} yrs`} loFmt="1 yr" hiFmt="40 yrs" lm={lm} />

          {tab === 'stp' && <p className={`text-[10px] ${textMuted}`}>Source corpus earns a fixed 6.5% p.a. while it is gradually moved into equity.</p>}

          {/* Results */}
          <div className={`pt-4 border-t ${dividerColor} space-y-3`}>
            <div className="flex justify-between">
              <span className={`text-xs ${textSub}`}>{resultLabels.invested}</span>
              <span className={`text-xs font-semibold ${text}`}>{formatINR(tab === 'swp' ? (swp.totalInvested) : calc.totalInvested)}</span>
            </div>
            <div className="flex justify-between">
              <span className={`text-xs ${textSub}`}>{resultLabels.gain}</span>
              <span className="text-xs font-semibold text-[#22C55E]">{tab === 'swp' ? formatINR(swp.totalWithdrawn ?? 0) : `+${formatINR(calc.gain)}`}</span>
            </div>
            <div className={`flex justify-between pt-2 border-t ${dividerColor}`}>
              <span className={`text-xs font-semibold ${textSub}`}>{resultLabels.total}</span>
              <span className={`text-sm font-bold ${lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'}`}>{formatINR(calc.maturity)}</span>
            </div>
          </div>

          <button className="w-full bg-[#d6fd70] hover:bg-[#b8d94a] text-black text-sm font-semibold py-2.5 rounded-lg transition-colors">
            Start {tab.toUpperCase()}
          </button>
        </div>

        {/* Chart */}
        <div className="col-span-3 space-y-4">
          <div className={`${card} rounded-xl p-5`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-sm font-semibold ${text}`}>{tab === 'swp' ? 'Balance Over Time' : 'Growth Projection'}</h2>
              <div className="text-right">
                <p className={`text-xs ${textSub}`}>{resultLabels.total}</p>
                <p className={`text-lg font-bold ${lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'}`}>{formatINR(calc.maturity)}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={calc.data}>
                <defs>
                  <linearGradient id="invGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="valGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={accent} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: chartTick }} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v, name) => [formatINR(Number(v)), name === 'invested' ? (tab === 'swp' ? 'Withdrawn' : 'Invested') : (tab === 'swp' ? 'Balance' : 'Value')]}
                />
                <Area type="monotone" dataKey="invested" stroke="#4f46e5" strokeWidth={1.5} fill="url(#invGrad2)" />
                <Area type="monotone" dataKey="value" stroke={accent} strokeWidth={2} fill="url(#valGrad2)" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#4f46e5] rounded" /><span className={`text-xs ${textSub}`}>{tab === 'swp' ? 'Cumulative Withdrawn' : 'Invested'}</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded" style={{ background: accent }} /><span className={`text-xs ${textSub}`}>{tab === 'swp' ? 'Remaining Balance' : 'Projected Value'}</span></div>
            </div>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-3 gap-3">
            {(tab === 'swp'
              ? [
                  { label: 'Total Withdrawn', value: formatINR(swp.totalWithdrawn ?? 0) },
                  { label: 'Balance Left', value: formatINR(calc.maturity) },
                  { label: 'Withdrawal Rate', value: `${((withdrawal * 12 / corpus) * 100).toFixed(1)}% p.a.` },
                ]
              : [
                  { label: 'Wealth Multiplier', value: `${(calc.maturity / calc.totalInvested).toFixed(1)}x` },
                  { label: 'Absolute Returns', value: `${(((calc.maturity - calc.totalInvested) / calc.totalInvested) * 100).toFixed(0)}%` },
                  { label: 'Est. CAGR', value: `${rate}% p.a.` },
                ]
            ).map((s) => (
              <div key={s.label} className={`${card} rounded-xl p-3 text-center`}>
                <p className={`text-xs ${textSub} mb-1`}>{s.label}</p>
                <p className={`text-base font-bold ${text}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What-If fund comparison merged onto the SIP page â€” the same SIP inputs drive it (R2-4) */}
      {tab === 'sip' && (
        <div className="space-y-3 pt-2">
          <div>
            <h2 className={`text-base font-bold ${text}`}>How top funds would have grown this SIP</h2>
            <p className={`text-xs ${textSub}`}>Ranked for â‚¹{monthly.toLocaleString('en-IN')}/mo over {years}Y on 5Y historical CAGR â€” adjust the calculator above to update.</p>
          </div>
          <SIPWhatIf embedded monthly={monthly} years={years} />
        </div>
      )}

      <p className={`text-[10px] ${textMuted} text-center`}>
        Calculations are illustrative and based on the assumptions you set. Past performance is not indicative of future returns.
        SahiMF is a SEBI-registered Research Analyst â€” this is generic research, not personalised advice.
      </p>
    </div>
  )
}

function Slider({ label, value, min, max, step, onChange, fmt, loFmt, hiFmt, lm }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; fmt: (v: number) => string; loFmt: string; hiFmt: string; lm: boolean
}) {
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#6B7280]' : 'text-[#64748b]'
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className={`text-xs ${textSub}`}>{label}</label>
        <span className={`text-xs font-semibold ${lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'}`}>{fmt(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} className="w-full h-2" style={{ accentColor: lm ? '#4f46e5' : '#d6fd70' }} />
      <div className={`flex justify-between text-[10px] ${textMuted} mt-1`}>
        <span>{loFmt}</span><span>{hiFmt}</span>
      </div>
    </div>
  )
}

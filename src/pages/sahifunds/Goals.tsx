import { useState, useMemo } from 'react'
import {
  Target as TargetIcon,
  Plus as PlusIcon,
  GraduationCap as EducationIcon,
  House as HouseIcon,
  Umbrella as RetirementIcon,
  Heart as WeddingIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  LightbulbFilament as BulbIcon,
} from '@phosphor-icons/react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { useUIStore } from '../../stores/uiStore'
import { usePlan } from '../../hooks/usePlan'

function formatINR(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
  return `₹${n.toLocaleString('en-IN')}`
}

const GOAL_TEMPLATES = [
  { id: 'retirement', label: 'Retirement', icon: RetirementIcon, color: '#4f46e5', bg: '#EEF2FF', description: 'Build a corpus to sustain monthly expenses post-retirement' },
  { id: 'education', label: 'Child Education', icon: EducationIcon, color: '#0891b2', bg: '#E0F2FE', description: 'Fund higher education 10—20 years away' },
  { id: 'home', label: 'Buy a Home', icon: HouseIcon, color: '#16a34a', bg: '#DCFCE7', description: 'Save for down payment or full purchase' },
  { id: 'wedding', label: 'Wedding', icon: WeddingIcon, color: '#db2777', bg: '#FCE7F3', description: 'Plan for a milestone celebration' },
]

function computeRetirement(monthlyExpense: number, retirementAge: number, currentAge = 38, sipAmount: number, expectedReturn: number, postReturnRate = 7, inflation = 6, existingCorpus = 142000) {
  const yearsToRetire = retirementAge - currentAge
  const postYears = 25
  const monthlyReturnRate = expectedReturn / 100 / 12
  const postMonthlyRate = postReturnRate / 100 / 12
  const inflatedExpense = monthlyExpense * Math.pow(1 + inflation / 100, yearsToRetire)
  const requiredCorpus = inflatedExpense * ((1 - Math.pow(1 + postMonthlyRate, -postYears * 12)) / postMonthlyRate)

  const sipCorpus = sipAmount * ((Math.pow(1 + monthlyReturnRate, yearsToRetire * 12) - 1) / monthlyReturnRate) * (1 + monthlyReturnRate)
  const existingGrown = existingCorpus * Math.pow(1 + expectedReturn / 100, yearsToRetire)
  const projectedCorpus = sipCorpus + existingGrown

  const shortfall = requiredCorpus - projectedCorpus
  const sipNeeded = Math.max(0, shortfall > 0
    ? shortfall / (((Math.pow(1 + monthlyReturnRate, yearsToRetire * 12) - 1) / monthlyReturnRate) * (1 + monthlyReturnRate))
    : 0)

  const yearlyData = Array.from({ length: yearsToRetire + postYears + 1 }, (_, i) => {
    const age = currentAge + i
    if (i <= yearsToRetire) {
      const accum = sipAmount * ((Math.pow(1 + monthlyReturnRate, i * 12) - 1) / monthlyReturnRate) * (1 + monthlyReturnRate) + existingCorpus * Math.pow(1 + expectedReturn / 100, i)
      return { age, corpus: Math.round(accum / 100000), required: Math.round(requiredCorpus / 100000), phase: 'accum' }
    } else {
      const drawdownYr = i - yearsToRetire
      const remaining = Math.max(0, projectedCorpus * Math.pow(1 + postReturnRate / 100, drawdownYr) - inflatedExpense * ((Math.pow(1 + postReturnRate / 100, drawdownYr) - 1) / (postReturnRate / 100)) * 12)
      return { age, corpus: Math.round(remaining / 100000), required: Math.round(requiredCorpus / 100000), phase: 'drawdown' }
    }
  })

  const corpusSurvivesYrs = yearlyData.filter(d => d.phase === 'drawdown').findIndex(d => d.corpus <= 0)
  const survivalYears = corpusSurvivesYrs === -1 ? postYears : corpusSurvivesYrs

  return { projectedCorpus, requiredCorpus, shortfall, sipNeeded: Math.round(sipNeeded), yearlyData, retirementAge, survivalYears, inflatedExpense }
}

export function Goals() {
  const lm = useUIStore((s) => s.lightMode)
  const { can: _can } = usePlan()

  const [activeGoal, setActiveGoal] = useState<string | null>('retirement')
  const [_showNewGoal, setShowNewGoal] = useState(false)

  // Retirement sliders
  const [sip, setSip] = useState(25000)
  const [retAge, setRetAge] = useState(60)
  const [monthlyExp, setMonthlyExp] = useState(80000)
  const [returnRate, setReturnRate] = useState(12)
  const [inflation, setInflation] = useState(6)

  const result = useMemo(() => computeRetirement(monthlyExp, retAge, 38, sip, returnRate, 7, inflation), [sip, retAge, monthlyExp, returnRate, inflation])

  const hasShortfall = result.shortfall > 0

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#6B7280]' : 'text-[#64748b]'
  const tooltipStyle = { background: lm ? '#fff' : '#14171c', border: `1px solid ${lm ? '#E0E3E8' : '#1e2838'}`, borderRadius: 8, fontSize: 11, color: lm ? '#111827' : '#fff' }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${card} flex items-center justify-center`}>
            <TargetIcon size={18} color={lm ? '#4f46e5' : '#d6fd70'} weight="fill" />
          </div>
          <div>
            <h1 className={`text-lg font-bold ${text}`}>Goals & Plans</h1>
            <p className={`text-xs ${textMuted}`}>Simulate and track your financial goals</p>
          </div>
        </div>
        <button
          onClick={() => setShowNewGoal(true)}
          className="flex items-center gap-1.5 bg-[#4f46e5] hover:bg-[#6366f1] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <PlusIcon size={14} weight="bold" />
          New Goal
        </button>
      </div>

      {/* ── Goal type tabs ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {GOAL_TEMPLATES.map(g => {
          const Icon = g.icon
          const active = activeGoal === g.id
          return (
            <button
              key={g.id}
              onClick={() => setActiveGoal(g.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 transition-all ${
                active
                  ? 'shadow-sm'
                  : lm ? 'bg-white border border-[#4f46e5] text-[#4f46e5] hover:bg-[#EEF2FF]' : 'bg-[#14171c] border border-[#1e2838] text-[#8390a2] hover:border-[#4f46e5]/40'
              }`}
              style={active ? { background: g.color, color: '#ffffff' } : {}}
            >
              <Icon size={16} weight="fill" />
              {g.label}
            </button>
          )
        })}
      </div>

      {/* ── Retirement goal detail ── */}
      {activeGoal === 'retirement' && (
        <div className="space-y-5">

          {/* Shortfall / surplus banner */}
          <div
            className="rounded-2xl p-5"
            style={hasShortfall
              ? { background: '#FEF2F2', border: '1px solid #FCA5A5' }
              : { background: '#F0FDF4', border: '1px solid #86EFAC' }
            }
          >
            <div className="flex items-start gap-3 mb-4">
              {hasShortfall
                ? <WarningIcon size={18} color="#DC2626" weight="fill" className="flex-shrink-0 mt-0.5" />
                : <CheckIcon size={18} color="#16A34A" weight="fill" className="flex-shrink-0 mt-0.5" />
              }
              <div>
                <p className="text-[#111827] font-bold text-base">
                  {hasShortfall
                    ? `Shortfall of ${formatINR(result.shortfall)} — action needed`
                    : `On track — surplus of ${formatINR(-result.shortfall)}`
                  }
                </p>
                <p className="text-sm mt-0.5 text-[#374151]">
                  Your ₹{(sip / 1000).toFixed(0)}K/month SIP projects {formatINR(result.projectedCorpus)} by age {retAge},
                  but you need {formatINR(result.requiredCorpus)} to sustain ₹{formatINR(result.inflatedExpense)}/month in retirement.
                </p>
              </div>
            </div>

            {/* 4 key stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Projected corpus at ' + retAge, value: formatINR(result.projectedCorpus), color: hasShortfall ? '#DC2626' : '#16A34A' },
                { label: 'Corpus needed', value: formatINR(result.requiredCorpus), color: '#111827', sub: 'For 25 yrs post-retirement' },
                { label: hasShortfall ? 'Shortfall' : 'Surplus', value: formatINR(Math.abs(result.shortfall)), color: hasShortfall ? '#DC2626' : '#16A34A', sub: hasShortfall ? 'Action needed' : 'On track!' },
                { label: 'SIP needed to close gap', value: `₹${(sip + result.sipNeeded).toLocaleString('en-IN')}/mo`, color: '#4f46e5', sub: `vs current ₹${(sip / 1000).toFixed(0)}K/mo` },
              ].map((s, i) => (
                <div key={i} className="rounded-xl px-3 py-2.5 bg-white/80 border border-black/5">
                  <p className="text-[10px] uppercase tracking-wide text-[#6B7280] mb-1">{s.label}</p>
                  <p className="text-base font-bold" style={{ color: s.color }}>{s.value}</p>
                  {s.sub && <p className="text-[10px] text-[#6B7280] mt-0.5">{s.sub}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Retirement timeline bar */}
          <div className={`${card} rounded-2xl p-5`}>
            <p className={`text-xs font-bold uppercase tracking-wider ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} mb-3`}>RETIREMENT TIMELINE</p>
            <div className="flex rounded-xl overflow-hidden h-8 mb-2">
              <div className="flex items-center justify-center text-xs font-bold text-white" style={{ width: `${(retAge - 38) / (retAge - 38 + 25) * 100}%`, background: '#4f46e5' }}>
                Accumulation {retAge - 38} yrs
              </div>
              <div className="flex items-center justify-center text-xs font-bold text-white" style={{ width: `${25 / (retAge - 38 + 25) * 100}%`, background: '#f59e0b' }}>
                Drawdown 25 yrs
              </div>
            </div>
            <div className="flex gap-4">
              {[{ c: '#4f46e5', l: 'Accumulation (SIP phase)' }, { c: '#22c55e', l: 'Corpus growth on existing' }, { c: '#f59e0b', l: 'Retirement drawdown' }].map(item => (
                <div key={item.l} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: item.c }} />
                  <span className={`text-[10px] ${textMuted}`}>{item.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Corpus projection chart */}
          <div className={`${card} rounded-2xl p-5`}>
            <p className={`text-xs font-bold uppercase tracking-wider ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} mb-1`}>CORPUS PROJECTION — YEAR BY YEAR</p>
            <p className={`text-xs ${textMuted} mb-4`}>(₹ in Lakhs)</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={result.yearlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="age" tick={{ fontSize: 10, fill: lm ? '#9CA3AF' : '#64748b' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: lm ? '#9CA3AF' : '#64748b' }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}L`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v, name) => [`₹${Number(v)}L`, name === 'corpus' ? 'Your projected corpus' : 'Required corpus'] as [string, string]}
                  labelFormatter={l => `Age ${l}`}
                />
                <ReferenceLine x={retAge} stroke={lm ? '#E0E3E8' : '#1e2838'} strokeDasharray="4 2" />
                <Line type="monotone" dataKey="corpus" name="corpus" stroke="#4f46e5" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="required" name="required" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              {[{ c: '#4f46e5', l: 'Your projected corpus' }, { c: '#ef4444', l: 'Required corpus', dash: true }].map(item => (
                <div key={item.l} className="flex items-center gap-1.5">
                  <div className="w-4 h-0.5 flex-shrink-0" style={{ background: item.c, borderTop: item.dash ? '2px dashed ' + item.c : 'none' }} />
                  <span className={`text-[10px] ${textMuted}`}>{item.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assumption sliders */}
          <div className={`${card} rounded-2xl p-5`}>
            <p className={`text-xs font-bold uppercase tracking-wider ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} mb-4`}>ADJUST YOUR ASSUMPTIONS</p>
            <div className="space-y-4">
              {[
                { label: 'Monthly SIP (₹)', value: sip, min: 1000, max: 200000, step: 1000, onChange: setSip, fmt: (v: number) => `₹${v.toLocaleString('en-IN')}` },
                { label: 'Expected return (%)', value: returnRate, min: 6, max: 20, step: 0.5, onChange: setReturnRate, fmt: (v: number) => `${v}%` },
                { label: 'Retirement age', value: retAge, min: 45, max: 75, step: 1, onChange: setRetAge, fmt: (v: number) => `Age ${v}` },
                { label: 'Monthly expenses at retirement (₹)', value: monthlyExp, min: 20000, max: 500000, step: 5000, onChange: setMonthlyExp, fmt: (v: number) => `₹${v.toLocaleString('en-IN')}` },
                { label: 'Inflation rate (%)', value: inflation, min: 3, max: 12, step: 0.5, onChange: setInflation, fmt: (v: number) => `${v}%` },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-4">
                  <p className={`text-xs font-medium w-52 flex-shrink-0 ${textSub}`}>{s.label}</p>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={s.value}
                    onChange={e => s.onChange(Number(e.target.value))}
                    className="flex-1 accent-[#4f46e5]"
                  />
                  <span className={`text-sm font-bold w-24 text-right ${text}`}>{s.fmt(s.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly withdrawal sustainability */}
          <div className={`${card} rounded-2xl p-5`}>
            <p className={`text-xs font-bold uppercase tracking-wider ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} mb-3`}>MONTHLY WITHDRAWAL SUSTAINABILITY</p>
            <p className={`text-xs ${textSub} mb-4`}>At {formatINR(result.inflatedExpense)}/month withdrawal, assuming 7% post-retirement return:</p>

            <div className="flex items-baseline gap-2 mb-1">
              <p className={`text-3xl font-black ${result.survivalYears >= 25 ? 'text-[#22c55e]' : 'text-[#f59e0b]'}`}>
                {result.survivalYears >= 25 ? '30+ yrs' : `${result.survivalYears} yrs`}
              </p>
              <p className={`text-sm ${result.survivalYears >= 25 ? 'text-[#22c55e]' : 'text-[#f59e0b]'}`}>
                {result.survivalYears >= 25 ? 'corpus survives' : 'then depleted'}
              </p>
            </div>
            <p className={`text-xs ${textMuted} mb-3`}>{result.survivalYears >= 25 ? 'Corpus lasts full retirement' : 'Increase SIP or reduce expenses'}</p>

            <div className="flex gap-2 mb-1">
              <div className="flex-1">
                <div className="h-3 rounded-full overflow-hidden" style={{ background: lm ? '#F3F4F6' : '#1e2838' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (result.survivalYears / 30) * 100)}%`,
                      background: result.survivalYears >= 25 ? '#22c55e' : '#f59e0b',
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className={textMuted}>Retirement start</span>
              <span className={textMuted}>25 year target</span>
              <span className={textMuted}>30 years</span>
            </div>
          </div>

          {/* Sahi recommendations */}
          <div className="space-y-3">
            {hasShortfall && (
              <div className="rounded-2xl p-4" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <div className="flex items-start gap-2">
                  <WarningIcon size={14} color="#ef4444" weight="fill" className="flex-shrink-0 mt-0.5" />
                  <p className="text-xs" style={{ color: lm ? '#7f1d1d' : '#fca5a5' }}>
                    <strong>Shortfall of {formatINR(result.shortfall)}.</strong> You need to increase your SIP by ₹{result.sipNeeded.toLocaleString('en-IN')}/month
                    (to ₹{(sip + result.sipNeeded).toLocaleString('en-IN')} total) to close the gap at your current return assumption.
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-2xl p-4" style={{ background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.2)' }}>
              <div className="flex items-start gap-2">
                <BulbIcon size={14} color="#6366f1" weight="fill" className="flex-shrink-0 mt-0.5" />
                <p className="text-xs" style={{ color: lm ? '#312e81' : '#a5b4fc' }}>
                  <strong>Step-up SIP is the smarter fix.</strong> Instead of jumping SIP immediately, increasing it by 10% every year
                  gets you to the same corpus with a much lower starting burden.
                  <button className="ml-1.5 font-bold underline underline-offset-2 hover:opacity-80 transition-opacity">
                    Try the step-up plan below →
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Other goal types — coming soon placeholder ── */}
      {activeGoal !== 'retirement' && (
        <div className={`${card} rounded-2xl p-10 text-center`}>
          {(() => {
            const g = GOAL_TEMPLATES.find(g => g.id === activeGoal)!
            const Icon = g.icon
            return (
              <>
                <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3" style={{ background: g.bg }}>
                  <Icon size={24} color={g.color} weight="fill" />
                </div>
                <p className={`text-base font-bold ${text} mb-1`}>{g.label} Goal Planner</p>
                <p className={`text-sm ${textSub} max-w-xs mx-auto`}>{g.description}</p>
                <p className={`text-xs mt-3 ${textMuted}`}>Coming soon — use Retirement planner for a head-start on any long-horizon goal</p>
              </>
            )
          })()}
        </div>
      )}

    </div>
  )
}

import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star as StarIcon, Info as InfoOutlinedIcon, Lock as LockIcon, TrendUp as TrendUpIcon, ArrowRight as ArrowRightIcon, CaretDown as CaretDownIcon, CaretRight as CaretRightIcon, ShieldCheck as ShieldCheckIcon } from '@phosphor-icons/react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { mockFunds } from '../../data/funds'
import { VolatilityBadge } from '../../components/ui/VolatilityBadge'
import { PlanGate } from '../../components/ui/PlanGate'
import { useUIStore } from '../../stores/uiStore'
import { usePlan } from '../../hooks/usePlan'

interface ScorecardEntry {
  fundId: string
  scores: { returns: number; consistency: number; risk: number; manager: number; cost: number }
  total: number
  grade: string
  rank: number
}

const GRADES = ['A+', 'A', 'A', 'B+', 'B', 'B', 'B-', 'C+']
const GRADE_COLORS_DARK: Record<string, string> = {
  'A+': '#22C55E', 'A': '#22C55E', 'B+': '#d6fd70', 'B': '#d6fd70', 'B-': '#F59E0B', 'C+': '#F59E0B', 'C': '#EF4444',
}
const GRADE_COLORS_LIGHT: Record<string, string> = {
  'A+': '#16a34a', 'A': '#16a34a', 'B+': '#4f46e5', 'B': '#4f46e5', 'B-': '#d97706', 'C+': '#d97706', 'C': '#dc2626',
}
function gradeColor(grade: string, lm: boolean) {
  return lm ? (GRADE_COLORS_LIGHT[grade] ?? '#4f46e5') : (GRADE_COLORS_DARK[grade] ?? '#d6fd70')
}

const SCORECARDS: ScorecardEntry[] = mockFunds.slice(0, 8).map((f, i) => {
  const returns = Math.round(60 + (i * 7 + 11) % 35)
  const consistency = Math.round(55 + (i * 9 + 13) % 40)
  const risk = Math.round(50 + (i * 11 + 7) % 45)
  const manager = Math.round(60 + (i * 13 + 5) % 35)
  const cost = Math.round(55 + (i * 5 + 17) % 40)
  const total = Math.round(returns * 0.35 + consistency * 0.25 + risk * 0.2 + manager * 0.1 + cost * 0.1)
  return { fundId: f.id, scores: { returns, consistency, risk, manager, cost }, total, grade: GRADES[i], rank: i + 1 }
})

function ScoreBar({ value, lm }: { value: number; lm: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-full h-1.5" style={{ background: lm ? '#E0E3E8' : '#1e2838' }}>
        <div
          className="h-1.5 rounded-full"
          style={{ width: `${value}%`, background: value >= 80 ? '#22C55E' : value >= 60 ? (lm ? '#4f46e5' : '#d6fd70') : '#F59E0B' }}
        />
      </div>
      <span className="text-xs font-semibold w-6 text-right" style={{ color: lm ? '#111827' : '#fff' }}>{value}</span>
    </div>
  )
}

function Chip({ children, color, lm }: { children: ReactNode; color?: string; lm: boolean }) {
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: lm ? '#F3F4F6' : '#1e2838', color: color ?? (lm ? '#374151' : '#8390a2') }}>
      {children}
    </span>
  )
}

const GRID = 'grid grid-cols-[40px_1fr_80px_90px_90px_80px_80px_60px_60px] gap-3'

/** A scorecard row that expands into a 3-column deep-dive when clicked. */
function ScorecardRow({ entry, lm }: { entry: ScorecardEntry; lm: boolean }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const fund = mockFunds.find((f) => f.id === entry.fundId)!
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#6B7280]' : 'text-[#64748b]'
  const rowHover = lm ? 'hover:bg-[#F9F9FF]' : 'hover:bg-[#1a2130]'
  const rowBorder = lm ? 'border-[#F0F0F8]' : 'border-[#1e2838]'

  const holdings = (fund.constituents ?? [])
    .flatMap((c) => c.holdings.map((h) => ({ ...h, sector: c.sector })))
    .filter((h) => h.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)
  const tenure = 6 + Math.round((entry.scores.manager - 55) / 5)
  const alpha = ((entry.scores.returns - 72) / 7).toFixed(1)
  const peerPct = Math.max(1, Math.round((entry.rank / SCORECARDS.length) * 100))
  const dims = [
    { label: 'Consistency of Returns', abbr: 'Consistency', value: entry.scores.consistency },
    { label: 'Risk-adjusted Return', abbr: 'Risk-adj.', value: entry.scores.risk },
    { label: 'Expense Ratio Discipline', abbr: 'Expense', value: entry.scores.cost },
    { label: 'Fund Manager Tenure', abbr: 'Tenure', value: entry.scores.manager },
    { label: 'Portfolio Quality', abbr: 'Quality', value: Math.min(98, Math.round((entry.scores.returns + entry.scores.consistency) / 2)) },
    { label: 'Mandate Adherence', abbr: 'Mandate', value: Math.min(98, Math.round((entry.scores.risk + entry.scores.manager) / 2)) },
  ]
  const dimColor = (v: number) => v >= 80 ? '#16a34a' : v >= 60 ? (lm ? '#4f46e5' : '#d6fd70') : '#d97706'
  const strongest = [...dims].sort((a, b) => b.value - a.value)[0]
  const weakest = [...dims].sort((a, b) => a.value - b.value)[0]
  const verdict = `${fund.name.split(' ').slice(0, 3).join(' ')} earns a Sahi Score of ${entry.total}/100 (grade ${entry.grade}), placing it in the top ${peerPct}% of its category. Its strongest dimension is ${strongest.label.toLowerCase()} (${strongest.value}/100), while ${weakest.label.toLowerCase()} (${weakest.value}/100) is the area to watch. ${Number(alpha) >= 0 ? `It has delivered roughly +${alpha}% rolling 3Y alpha over its benchmark` : `It has trailed its benchmark by about ${alpha}% on rolling 3Y alpha`}, consistent with a ${entry.grade}-grade research view.`

  return (
    <div className={`border-b ${rowBorder} last:border-0`}>
      <button onClick={() => setOpen((o) => !o)} className={`w-full ${GRID} px-5 py-4 items-center text-left ${rowHover} transition-colors`}>
        <span className={`text-sm font-bold ${lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'}`}>#{entry.rank}</span>
        <div className="flex items-center gap-2 min-w-0">
          {open ? <CaretDownIcon size={12} weight="bold" className="flex-shrink-0" color={lm ? '#6B7280' : '#8390a2'} /> : <CaretRightIcon size={12} weight="bold" className="flex-shrink-0" color={lm ? '#9CA3AF' : '#64748b'} />}
          <div className="min-w-0">
            <p className={`text-sm font-medium ${text} leading-snug truncate`}>{fund.name}</p>
            <VolatilityBadge level={fund.volatility} />
          </div>
        </div>
        <span className={`text-[11px] ${textSub} leading-tight`}>{fund.subCategory}</span>
        <ScoreBar value={entry.scores.returns} lm={lm} />
        <ScoreBar value={entry.scores.consistency} lm={lm} />
        <ScoreBar value={entry.scores.risk} lm={lm} />
        <ScoreBar value={entry.scores.cost} lm={lm} />
        <span className="text-sm font-bold" style={{ color: gradeColor(entry.grade, lm) }}>{entry.grade}</span>
        <div className="text-center">
          <span className={`text-base font-bold ${text}`}>{entry.total}</span>
          <span className={`text-[10px] ${textMuted}`}>/100</span>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-2" style={{ background: lm ? '#FAFAFF' : '#0f1420' }}>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Left — Sahi Sabh-scales (6 sub-dimensions) */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-3 text-[#111827]">Sahi Sabh-scales</p>
              <div className="space-y-2.5">
                {dims.map((d) => (
                  <div key={d.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] ${textSub}`}>{d.label}</span>
                      <span className="text-[10px] font-bold" style={{ color: dimColor(d.value) }}>{d.value}%</span>
                    </div>
                    <div className="rounded-full h-1.5" style={{ background: lm ? '#E0E3E8' : '#1e2838' }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${d.value}%`, background: dimColor(d.value) }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Center — radar / web chart of the score profile */}
            <div className="flex flex-col">
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-[#111827]">Score Profile</p>
              <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height={210}>
                  <RadarChart data={dims.map((d) => ({ dim: d.abbr, value: d.value }))} outerRadius="68%">
                    <PolarGrid stroke={lm ? '#E0E3E8' : '#1e2838'} />
                    <PolarAngleAxis dataKey="dim" tick={{ fontSize: 9, fill: lm ? '#6B7280' : '#8390a2' }} />
                    <Radar dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.22} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Right — top holdings */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-3 text-[#111827]">Top Portfolio Holdings</p>
              <div className="space-y-2">
                {holdings.length > 0 ? holdings.map((h) => (
                  <div key={h.name} className="flex items-center gap-2">
                    <span className={`text-[11px] flex-1 truncate ${text}`}>{h.name}</span>
                    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: lm ? '#E5E7EB' : '#1e2838' }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(h.weight / 12 * 100, 100)}%`, background: lm ? '#4f46e5' : '#d6fd70' }} />
                    </div>
                    <span className={`text-[11px] font-semibold w-10 text-right ${text}`}>{h.weight.toFixed(1)}%</span>
                  </div>
                )) : <p className={`text-[11px] ${textMuted}`}>Holdings data not available for this fund.</p>}
              </div>
            </div>
          </div>

          {/* Sahi Analysis & Rationale — full width */}
          <div className="mt-5 pt-4 border-t" style={{ borderColor: lm ? '#E0E3E8' : '#1e2838' }}>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#111827]">Sahi Analysis &amp; Rationale</p>
              <div className="flex flex-wrap gap-1.5">
                <Chip lm={lm}>{tenure} yr manager tenure</Chip>
                <Chip lm={lm} color={Number(alpha) >= 0 ? '#16a34a' : '#dc2626'}>{Number(alpha) >= 0 ? '+' : ''}{alpha}% 3Y alpha</Chip>
                <Chip lm={lm}>Top {peerPct}% peer rank</Chip>
              </div>
            </div>
            <p className={`text-[11px] leading-relaxed ${textSub} max-w-3xl`}>{verdict}</p>
            <button className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#4f46e5] hover:underline">
              <ShieldCheckIcon size={12} weight="fill" /> Verifiable SEBI Audit-Trail
            </button>
          </div>

          <button
            onClick={() => navigate(`/mutual-funds/search/${fund.id}`)}
            className="mt-4 flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            style={{ background: lm ? '#4f46e5' : '#d6fd70', color: lm ? '#fff' : '#000' }}
          >
            Deep-Analyze Fund <ArrowRightIcon size={13} weight="bold" />
          </button>
        </div>
      )}
    </div>
  )
}

const FREE_ROWS = 3

export function MFScorecard() {
  const [sortBy, setSortBy] = useState<'rank' | 'returns' | 'risk'>('rank')
  const [cat, setCat] = useState('All')
  const lm = useUIStore((s) => s.lightMode)
  const { can } = usePlan()
  const isPro = can('pro')

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#6B7280]' : 'text-[#64748b]'
  const inputBg = lm ? 'bg-white border-[#E0E3E8] text-[#111827]' : 'bg-[#14171c] border-[#1e2838] text-white'
  const rowBorder = lm ? 'border-[#F0F0F8]' : 'border-[#1e2838]'
  const dividerColor = lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'

  const CATS = ['All', ...Array.from(new Set(SCORECARDS.map((e) => mockFunds.find((f) => f.id === e.fundId)!.subCategory)))]
  const sorted = [...SCORECARDS]
    .filter((e) => cat === 'All' || mockFunds.find((f) => f.id === e.fundId)!.subCategory === cat)
    .sort((a, b) => {
      if (sortBy === 'rank') return a.rank - b.rank
      if (sortBy === 'returns') return b.scores.returns - a.scores.returns
      return b.scores.risk - a.scores.risk
    })

  const topScore = sorted[0]?.total ?? 82
  const topGrade = sorted[0]?.grade ?? 'A+'

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #8c34ee, #4f46e5)', boxShadow: '0 4px 16px rgba(140,52,238,0.25)' }}>
            <span style={{ color: '#d6fd70' }}><StarIcon size={20} weight="duotone" /></span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-xl font-black tracking-tight text-[#111827]">MF Scorecard</h1>
              <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#eeedfd] text-[#4f46e5]">Research Tool</span>
            </div>
            <p className="text-xs text-[#6B7280]">Sahi Score™ ranks {mockFunds.length} funds across returns, consistency, risk, cost &amp; manager quality</p>
          </div>
        </div>
        <div className="flex-shrink-0 flex gap-2">
          {[{ label: 'Funds Ranked', value: `${mockFunds.length}` }, { label: 'Top Grade', value: topGrade }, { label: 'Top Score', value: `${topScore}` }].map(s => (
            <div key={s.label} className="text-center px-3 py-2 rounded-xl bg-white border border-[#E0E3E8]">
              <p className="text-sm font-bold text-[#4f46e5] leading-none">{s.value}</p>
              <p className="text-[10px] text-[#6B7280] mt-0.5 whitespace-nowrap">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Category filter + sort */}
      <div className="flex items-center justify-between gap-3 flex-wrap -mt-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-medium ${textMuted}`}>Category:</span>
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                cat === c
                  ? 'bg-[#111827] text-[#ffffff] border-[#111827]'
                  : lm
                    ? 'bg-white text-[#374151] border-[#E0E3E8] hover:border-[#4f46e5]'
                    : 'bg-[#14171c] text-[#8390a2] border-[#1e2838] hover:border-[#d6fd70]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs ${textMuted}`}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className={`${inputBg} border rounded-lg text-xs px-2.5 py-1.5 outline-none cursor-pointer appearance-none`}
          >
            <option value="rank">Sahi Score</option>
            <option value="returns">Returns Score</option>
            <option value="risk">Risk Score</option>
          </select>
        </div>
      </div>

      {/* Teaser stat — value hook before the gate */}
      {!isPro && (
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={lm ? { background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.15)' } : { background: 'rgba(214,253,112,0.06)', border: '1px solid rgba(214,253,112,0.2)' }}
        >
          <TrendUpIcon size={18} color={lm ? '#6366f1' : '#d6fd70'} weight="duotone" style={{ flexShrink: 0 }} />
          <div className="flex-1">
            <p className={`text-xs font-semibold ${text}`}>
              Funds graded <span style={{ color: lm ? '#4f46e5' : '#d6fd70' }}>{topGrade}</span> on SahiMF Scorecard (score {topScore}+) beat Nifty 50 by an average of <span style={{ color: '#22c55e' }}>4.2% per year</span> over the last 3 years.
            </p>
            <p className={`text-[10px] ${textMuted} mt-0.5`}>
              Showing top {FREE_ROWS} of {SCORECARDS.length} ranked funds · Unlock all {SCORECARDS.length} with PRO
            </p>
          </div>
        </div>
      )}

      {/* Methodology callout */}
      <div className={`${card} rounded-xl px-4 py-3 flex items-start gap-3`}>
        <InfoOutlinedIcon size={15} color={lm ? '#4f46e5' : '#d6fd70'} weight="regular" style={{ flexShrink: 0, marginTop: '1px' }} />
        <div className={`text-xs ${textSub} space-y-1`}>
          <p><span className={`${text} font-medium`}>Sahi Scoring Methodology</span> — Funds are scored on 5 dimensions across a 100-point scale.</p>
          <p>Returns (35%) · Consistency (25%) · Risk-Adjusted Returns (20%) · Manager Quality (10%) · Cost Efficiency (10%)</p>
          <p className={textMuted}>Scores are recalculated monthly based on trailing 3Y data. NOT personalized recommendations.</p>
        </div>
      </div>

      {/* Score table with partial reveal */}
      <div className={`${card} rounded-2xl overflow-hidden`}>
        {/* Header */}
        <div className={`grid grid-cols-[40px_1fr_80px_90px_90px_80px_80px_60px_60px] gap-3 px-5 py-3 border-b ${dividerColor}`}>
          {['#', 'Fund', 'Category', 'Returns', 'Consistency', 'Risk', 'Cost', 'Grade', 'Score'].map((h) => (
            <span key={h} className={`text-[11px] font-semibold ${textSub} uppercase tracking-wider`}>{h}</span>
          ))}
        </div>

        {/* Free rows — always visible */}
        {sorted.slice(0, FREE_ROWS).map((entry) => (
          <ScorecardRow key={entry.fundId} entry={entry} lm={lm} />
        ))}

        {/* Locked rows — blurred with upgrade overlay */}
        {!isPro && (
          <div className="relative">
            {/* Ghost rows — blurred */}
            <div className="pointer-events-none select-none" style={{ filter: 'blur(3px)', opacity: 0.4 }}>
              {sorted.slice(FREE_ROWS).map((entry) => {
                const fund = mockFunds.find((f) => f.id === entry.fundId)!
                return (
                  <div
                    key={entry.fundId}
                    className={`grid grid-cols-[40px_1fr_80px_90px_90px_80px_80px_60px_60px] gap-3 px-5 py-4 items-center border-b ${rowBorder}`}
                  >
                    <span className={`text-sm font-bold ${lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'}`}>#{entry.rank}</span>
                    <div>
                      <p className={`text-sm font-medium ${text} leading-snug`}>{fund.name}</p>
                      <VolatilityBadge level={fund.volatility} />
                    </div>
                    <span className={`text-[11px] ${textSub} leading-tight`}>{fund.subCategory}</span>
                    <ScoreBar value={entry.scores.returns} lm={lm} />
                    <ScoreBar value={entry.scores.consistency} lm={lm} />
                    <ScoreBar value={entry.scores.risk} lm={lm} />
                    <ScoreBar value={entry.scores.cost} lm={lm} />
                    <span className="text-sm font-bold" style={{ color: gradeColor(entry.grade, lm) }}>{entry.grade}</span>
                    <div className="text-center">
                      <span className={`text-base font-bold ${text}`}>{entry.total}</span>
                      <span className={`text-[10px] ${textMuted}`}>/100</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Fade gradient over blurred rows */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: lm
                  ? 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.95) 80%)'
                  : 'linear-gradient(to bottom, rgba(20,23,28,0) 0%, rgba(20,23,28,0.7) 40%, rgba(20,23,28,0.97) 80%)',
              }}
            />

            {/* Upgrade CTA overlay */}
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-3 pb-6 pt-2">
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-full"
                style={{ background: lm ? '#F3F4F6' : '#1e2838' }}
              >
                <LockIcon size={13} color={lm ? '#6366f1' : '#d6fd70'} weight="duotone" />
                <span className={`text-xs font-semibold ${text}`}>
                  {SCORECARDS.length - FREE_ROWS} more funds locked
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-1.5 bg-[#d6fd70] hover:bg-[#b8d94a] text-black text-sm font-bold px-5 py-2.5 rounded-full transition-colors shadow-lg"
                >
                  Unlock Full Scorecard
                  <ArrowRightIcon size={14} weight="bold" />
                </button>
                <button
                  className="text-xs font-semibold px-4 py-2.5 rounded-full transition-colors"
                  style={{ background: lm ? '#eeedfd' : 'rgba(79,70,229,0.15)', color: '#6366f1' }}
                >
                  Try PRO — 14 days free
                </button>
              </div>
              <p className={`text-[10px] ${textMuted}`}>No credit card required · Cancel anytime</p>
            </div>
          </div>
        )}

        {/* Pro rows — fully visible when unlocked */}
        {isPro && sorted.slice(FREE_ROWS).map((entry) => (
          <ScorecardRow key={entry.fundId} entry={entry} lm={lm} />
        ))}
      </div>

      {/* Individual fund detail gate — PRO only section */}
      {!isPro && (
        <div className={`${card} rounded-xl p-5`}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-sm font-semibold ${text} mb-1`}>Drill into any fund's scorecard</p>
              <p className={`text-xs ${textMuted}`}>See dimension-level breakdowns, peer percentile ranks, and month-over-month score change history.</p>
            </div>
            <PlanGate requiredTier="pro" compact>
              <button className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: lm ? '#F3F4F6' : '#1e2838', color: lm ? '#374151' : '#8390a2' }}>
                View breakdown
              </button>
            </PlanGate>
          </div>
        </div>
      )}

      <p className={`text-[10px] ${lm ? 'text-[#6B7280]' : 'text-[#505d6f]'} text-center`}>
        SahiMF Scorecard is a quantitative ranking tool for educational and research purposes only.
        Scores do not constitute personalized investment advice. Mutual Fund investments are subject to market risks.
        SEBI requires us to state: past performance is not indicative of future returns.
      </p>
    </div>
  )
}

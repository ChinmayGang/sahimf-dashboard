import { useState } from 'react'
import { Star as StarIcon, Info as InfoOutlinedIcon, Lock as LockIcon, TrendUp as TrendUpIcon, ArrowRight as ArrowRightIcon } from '@phosphor-icons/react'
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
const GRADE_COLORS: Record<string, string> = {
  'A+': '#22C55E', 'A': '#22C55E', 'B+': '#d6fd70', 'B': '#d6fd70', 'B-': '#F59E0B', 'C+': '#F59E0B', 'C': '#EF4444',
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
          style={{ width: `${value}%`, background: value >= 80 ? '#22C55E' : value >= 60 ? '#d6fd70' : '#F59E0B' }}
        />
      </div>
      <span className="text-xs font-semibold w-6 text-right" style={{ color: lm ? '#111827' : '#fff' }}>{value}</span>
    </div>
  )
}

const FREE_ROWS = 3

export function MFScorecard() {
  const [sortBy, setSortBy] = useState<'rank' | 'returns' | 'risk'>('rank')
  const lm = useUIStore((s) => s.lightMode)
  const { can } = usePlan()
  const isPro = can('pro')

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'
  const inputBg = lm ? 'bg-white border-[#E0E3E8] text-[#111827]' : 'bg-[#14171c] border-[#1e2838] text-white'
  const rowHover = lm ? 'hover:bg-[#F9F9FF]' : 'hover:bg-[#1a2130]'
  const rowBorder = lm ? 'border-[#F0F0F8]' : 'border-[#1e2838]'
  const dividerColor = lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'

  const sorted = [...SCORECARDS].sort((a, b) => {
    if (sortBy === 'rank') return a.rank - b.rank
    if (sortBy === 'returns') return b.scores.returns - a.scores.returns
    return b.scores.risk - a.scores.risk
  })

  const topScore = sorted[0]?.total ?? 82
  const topGrade = sorted[0]?.grade ?? 'A+'

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'} flex items-center justify-center`}>
            <StarIcon size={18} color={lm ? '#6366f1' : '#d6fd70'} weight="duotone" />
          </div>
          <div>
            <h1 className={`text-lg font-bold ${text}`}>MF Scorecard</h1>
            <p className={`text-xs ${textMuted}`}>SahiMF proprietary fund scoring system · Updated monthly</p>
          </div>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className={`${inputBg} border rounded-xl px-3 py-2 text-sm outline-none cursor-pointer`}
        >
          <option value="rank">Sort: Rank</option>
          <option value="returns">Sort: Returns Score</option>
          <option value="risk">Sort: Risk Score</option>
        </select>
      </div>

      {/* Teaser stat — value hook before the gate */}
      {!isPro && (
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ background: 'rgba(214,253,112,0.06)', border: '1px solid rgba(214,253,112,0.2)' }}
        >
          <TrendUpIcon size={18} color={lm ? '#6366f1' : '#d6fd70'} weight="duotone" style={{ flexShrink: 0 }} />
          <div className="flex-1">
            <p className={`text-xs font-semibold ${text}`}>
              Funds graded <span style={{ color: '#d6fd70' }}>{topGrade}</span> on SahiMF Scorecard (score {topScore}+) beat Nifty 50 by an average of <span style={{ color: '#22c55e' }}>4.2% per year</span> over the last 3 years.
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
            <span key={h} className={`text-[11px] font-semibold ${textMuted} uppercase tracking-wider`}>{h}</span>
          ))}
        </div>

        {/* Free rows — always visible */}
        {sorted.slice(0, FREE_ROWS).map((entry, i) => {
          const fund = mockFunds.find((f) => f.id === entry.fundId)!
          return (
            <div
              key={entry.fundId}
              className={`grid grid-cols-[40px_1fr_80px_90px_90px_80px_80px_60px_60px] gap-3 px-5 py-4 items-center border-b ${rowBorder} ${rowHover} transition-colors`}
              style={{ borderBottomColor: i === FREE_ROWS - 1 && !isPro ? undefined : undefined }}
            >
              <span className="text-sm font-bold text-[#d6fd70]">#{entry.rank}</span>
              <div>
                <p className={`text-sm font-medium ${text} leading-snug`}>{fund.name}</p>
                <VolatilityBadge level={fund.volatility} />
              </div>
              <span className={`text-[11px] ${textSub} leading-tight`}>{fund.subCategory}</span>
              <ScoreBar value={entry.scores.returns} lm={lm} />
              <ScoreBar value={entry.scores.consistency} lm={lm} />
              <ScoreBar value={entry.scores.risk} lm={lm} />
              <ScoreBar value={entry.scores.cost} lm={lm} />
              <span className="text-sm font-bold" style={{ color: GRADE_COLORS[entry.grade] ?? '#8390a2' }}>{entry.grade}</span>
              <div className="text-center">
                <span className={`text-base font-bold ${text}`}>{entry.total}</span>
                <span className={`text-[10px] ${textMuted}`}>/100</span>
              </div>
            </div>
          )
        })}

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
                    <span className="text-sm font-bold text-[#d6fd70]">#{entry.rank}</span>
                    <div>
                      <p className={`text-sm font-medium ${text} leading-snug`}>{fund.name}</p>
                      <VolatilityBadge level={fund.volatility} />
                    </div>
                    <span className={`text-[11px] ${textSub} leading-tight`}>{fund.subCategory}</span>
                    <ScoreBar value={entry.scores.returns} lm={lm} />
                    <ScoreBar value={entry.scores.consistency} lm={lm} />
                    <ScoreBar value={entry.scores.risk} lm={lm} />
                    <ScoreBar value={entry.scores.cost} lm={lm} />
                    <span className="text-sm font-bold" style={{ color: GRADE_COLORS[entry.grade] ?? '#8390a2' }}>{entry.grade}</span>
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
        {isPro && sorted.slice(FREE_ROWS).map((entry, i) => {
          const fund = mockFunds.find((f) => f.id === entry.fundId)!
          return (
            <div
              key={entry.fundId}
              className={`grid grid-cols-[40px_1fr_80px_90px_90px_80px_80px_60px_60px] gap-3 px-5 py-4 items-center border-b ${rowBorder} ${rowHover} transition-colors`}
              style={{ borderBottomColor: i === sorted.slice(FREE_ROWS).length - 1 ? 'transparent' : undefined }}
            >
              <span className="text-sm font-bold text-[#d6fd70]">#{entry.rank}</span>
              <div>
                <p className={`text-sm font-medium ${text} leading-snug`}>{fund.name}</p>
                <VolatilityBadge level={fund.volatility} />
              </div>
              <span className={`text-[11px] ${textSub} leading-tight`}>{fund.subCategory}</span>
              <ScoreBar value={entry.scores.returns} lm={lm} />
              <ScoreBar value={entry.scores.consistency} lm={lm} />
              <ScoreBar value={entry.scores.risk} lm={lm} />
              <ScoreBar value={entry.scores.cost} lm={lm} />
              <span className="text-sm font-bold" style={{ color: GRADE_COLORS[entry.grade] ?? '#8390a2' }}>{entry.grade}</span>
              <div className="text-center">
                <span className={`text-base font-bold ${text}`}>{entry.total}</span>
                <span className={`text-[10px] ${textMuted}`}>/100</span>
              </div>
            </div>
          )
        })}
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

      <p className={`text-[10px] ${lm ? 'text-[#9CA3AF]' : 'text-[#505d6f]'} text-center`}>
        SahiMF Scorecard is a quantitative ranking tool for educational and research purposes only.
        Scores do not constitute personalized investment advice. Mutual Fund investments are subject to market risks.
        SEBI requires us to state: past performance is not indicative of future returns.
      </p>
    </div>
  )
}

import { useState } from 'react'
import StarIcon from '@mui/icons-material/Star'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { mockFunds } from '../../data/funds'
import { VolatilityBadge } from '../../components/ui/VolatilityBadge'
import { PlanGate } from '../../components/ui/PlanGate'
import { useUIStore } from '../../stores/uiStore'

interface ScorecardEntry {
  fundId: string
  scores: {
    returns: number
    consistency: number
    risk: number
    manager: number
    cost: number
  }
  total: number
  grade: string
  rank: number
}

const GRADES = ['A+', 'A', 'A', 'B+', 'B', 'B', 'B-', 'C+']
const GRADE_COLORS: Record<string, string> = {
  'A+': '#22C55E', 'A': '#22C55E', 'B+': '#C5F135', 'B': '#C5F135', 'B-': '#F59E0B', 'C+': '#F59E0B', 'C': '#EF4444',
}

const SCORECARDS: ScorecardEntry[] = mockFunds.slice(0, 8).map((f, i) => {
  const returns = Math.round(60 + Math.random() * 35)
  const consistency = Math.round(55 + Math.random() * 40)
  const risk = Math.round(50 + Math.random() * 45)
  const manager = Math.round(60 + Math.random() * 35)
  const cost = Math.round(55 + Math.random() * 40)
  const total = Math.round((returns * 0.35 + consistency * 0.25 + risk * 0.2 + manager * 0.1 + cost * 0.1))
  return { fundId: f.id, scores: { returns, consistency, risk, manager, cost }, total, grade: GRADES[i], rank: i + 1 }
})

function ScoreBar({ value, lm }: { value: number; lm: boolean }) {
  const trackColor = lm ? '#E8E8F0' : '#2A2A2A'
  const textColor = lm ? '#111827' : '#fff'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-full h-1.5" style={{ background: trackColor }}>
        <div
          className="h-1.5 rounded-full"
          style={{
            width: `${value}%`,
            background: value >= 80 ? '#22C55E' : value >= 60 ? '#C5F135' : '#F59E0B',
          }}
        />
      </div>
      <span className="text-xs font-semibold w-6 text-right" style={{ color: textColor }}>{value}</span>
    </div>
  )
}

export function MFScorecard() {
  const [sortBy, setSortBy] = useState<'rank' | 'returns' | 'risk'>('rank')
  const lm = useUIStore((s) => s.lightMode)

  const card = lm ? 'bg-white border border-[#E8E8F0] shadow-sm' : 'bg-[#141414] border border-[#2A2A2A]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#A0A0A0]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#606060]'
  const inputBg = lm ? 'bg-white border-[#E8E8F0] text-[#111827]' : 'bg-[#141414] border-[#2A2A2A] text-white'
  const rowHover = lm ? 'hover:bg-[#F9F9FF]' : 'hover:bg-[#1A1A1A]'
  const rowBorder = lm ? 'border-[#F0F0F8]' : 'border-[#1E1E1E]'
  const dividerColor = lm ? 'border-[#E8E8F0]' : 'border-[#2A2A2A]'

  const sorted = [...SCORECARDS].sort((a, b) => {
    if (sortBy === 'rank') return a.rank - b.rank
    if (sortBy === 'returns') return b.scores.returns - a.scores.returns
    return b.scores.risk - a.scores.risk
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${lm ? 'bg-white border border-[#E8E8F0] shadow-sm' : 'bg-[#1A1A1A] border border-[#2A2A2A]'} flex items-center justify-center`}>
            <StarIcon sx={{ fontSize: 18, color: '#C5F135' }} />
          </div>
          <div>
            <h1 className={`text-lg font-bold ${text}`}>MF Scorecard</h1>
            <p className={`text-xs ${textMuted}`}>SahiMF proprietary fund scoring system</p>
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

      {/* Methodology callout */}
      <div className={`${card} rounded-xl px-4 py-3 flex items-start gap-3`}>
        <InfoOutlinedIcon sx={{ fontSize: 15, color: '#C5F135', flexShrink: 0, marginTop: '1px' }} />
        <div className={`text-xs ${textSub} space-y-1`}>
          <p><span className={`${text} font-medium`}>Sahi Scoring Methodology</span> — Funds are scored on 5 dimensions across a 100-point scale.</p>
          <p>Returns (35%) · Consistency (25%) · Risk-Adjusted Returns (20%) · Manager Quality (10%) · Cost Efficiency (10%)</p>
          <p className={textMuted}>Scores are recalculated monthly based on trailing 3Y data. NOT personalized recommendations.</p>
        </div>
      </div>

      {/* Score table */}
      <PlanGate requiredTier="pro" label="Unlock Full MF Scorecard">
        <div className={`${card} rounded-2xl overflow-hidden`}>
          {/* Header */}
          <div className={`grid grid-cols-[40px_1fr_80px_90px_90px_80px_80px_60px_60px] gap-3 px-5 py-3 border-b ${dividerColor}`}>
            {['#', 'Fund', 'Category', 'Returns', 'Consistency', 'Risk', 'Cost', 'Grade', 'Score'].map((h) => (
              <span key={h} className={`text-[11px] font-semibold ${textMuted} uppercase tracking-wider`}>{h}</span>
            ))}
          </div>

          {sorted.map((entry, i) => {
            const fund = mockFunds.find((f) => f.id === entry.fundId)!
            const grade = entry.grade
            return (
              <div key={entry.fundId} className={`grid grid-cols-[40px_1fr_80px_90px_90px_80px_80px_60px_60px] gap-3 px-5 py-4 items-center border-b ${rowBorder} ${rowHover} transition-colors`} style={{ borderBottomColor: i === sorted.length - 1 ? 'transparent' : undefined }}>
                {/* Rank */}
                <span className="text-sm font-bold text-[#C5F135]">#{entry.rank}</span>

                {/* Fund */}
                <div>
                  <p className={`text-sm font-medium ${text} leading-snug`}>{fund.name}</p>
                  <VolatilityBadge level={fund.volatility} />
                </div>

                {/* Category */}
                <span className={`text-[11px] ${textSub} leading-tight`}>{fund.subCategory}</span>

                {/* Scores */}
                <ScoreBar value={entry.scores.returns} lm={lm} />
                <ScoreBar value={entry.scores.consistency} lm={lm} />
                <ScoreBar value={entry.scores.risk} lm={lm} />
                <ScoreBar value={entry.scores.cost} lm={lm} />

                {/* Grade */}
                <span className="text-sm font-bold" style={{ color: GRADE_COLORS[grade] ?? (lm ? '#9CA3AF' : '#A0A0A0') }}>{grade}</span>

                {/* Total */}
                <div className="text-center">
                  <span className={`text-base font-bold ${text}`}>{entry.total}</span>
                  <span className={`text-[10px] ${textMuted}`}>/100</span>
                </div>
              </div>
            )
          })}
        </div>
      </PlanGate>

      {/* SEBI disclaimer */}
      <p className={`text-[10px] ${lm ? 'text-[#9CA3AF]' : 'text-[#404040]'} text-center`}>
        SahiMF Scorecard is a quantitative ranking tool for educational and research purposes only.
        Scores do not constitute personalized investment advice. Mutual Fund investments are subject to market risks.
        SEBI requires us to state: past performance is not indicative of future returns.
      </p>
    </div>
  )
}

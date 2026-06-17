import { Sparkle as SparkleIcon } from '@phosphor-icons/react'
import { Check as CheckIcon } from '@phosphor-icons/react'
import { Warning as WarnIcon } from '@phosphor-icons/react'
import { PlanGate } from './PlanGate'
import { usePlan } from '../../hooks/usePlan'

type Verdict = 'Research Pick' | 'Watchlist' | 'Under Review'

type ResearchData = {
  verdict: Verdict
  sahiScore: number
  summary: string
  strengths: string[]
  concerns: string[]
  analystNote: string
  updatedAt: string
  subScores: { label: string; value: number }[]
}

type Props = {
  fundName: string
  data: ResearchData
  lm: boolean
}

const VERDICT_STYLE: Record<Verdict, { bg: string; border: string; color: string }> = {
  'Research Pick': { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)', color: '#22c55e' },
  'Watchlist': { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', color: '#f59e0b' },
  'Under Review': { bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.25)', color: '#94a3b8' },
}

function ScoreBar({ label, value, lm }: { label: string; value: number; lm: boolean }) {
  const color = value >= 75 ? '#22c55e' : value >= 55 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] w-24 flex-shrink-0" style={{ color: lm ? '#6B7280' : '#8390a2' }}>{label}</span>
      <div className="flex-1 rounded-full h-1.5" style={{ background: lm ? '#E0E3E8' : '#1e2838' }}>
        <div className="h-1.5 rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-[10px] font-bold w-6 text-right" style={{ color }}>{value}</span>
    </div>
  )
}

export function SahiResearchCard({ fundName, data, lm }: Props) {
  const { can } = usePlan()
  const isPro = can('pro')
  const vs = VERDICT_STYLE[data.verdict]
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'

  const scoreColor = data.sahiScore >= 80 ? '#22c55e' : data.sahiScore >= 65 ? '#f59e0b' : '#ef4444'

  return (
    <div className={`${card} rounded-2xl overflow-hidden`}>
      {/* Header strip */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{
          background: lm
            ? 'linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%)'
            : 'linear-gradient(135deg, #0d0820 0%, #160b30 100%)',
          borderBottom: lm ? '1px solid #ddd6fe' : '1px solid rgba(140,52,238,0.2)',
        }}
      >
        <div className="flex items-center gap-2">
          <SparkleIcon size={15} weight="duotone" style={{ color: lm ? '#8c34ee' : '#d6fd70' }} />
          <span className="text-xs font-bold" style={{ color: lm ? '#5b21b6' : '#d6fd70' }}>
            SahiMF Research Note
          </span>
          <span
            className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full"
            style={{ background: lm ? 'rgba(140,52,238,0.1)' : 'rgba(214,253,112,0.1)', color: lm ? '#7c3aed' : '#d6fd70' }}
          >
            Generic · Not Personalised
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Verdict pill */}
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: vs.bg, border: `1px solid ${vs.border}`, color: vs.color }}
          >
            {data.verdict}
          </span>
          {/* Sahi Score circle */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black text-white"
            style={{ background: scoreColor, boxShadow: `0 0 8px ${scoreColor}40` }}
          >
            {data.sahiScore}
          </div>
        </div>
      </div>

      {/* Always-visible: summary teaser */}
      <div className="px-5 py-4">
        <p className={`text-xs leading-relaxed ${text}`}>
          <span className="font-semibold">{fundName.split(' ').slice(0, 3).join(' ')}</span>{' '}
          {data.summary.slice(0, 120)}
          {!isPro && '…'}
        </p>

        {/* Free gate — blurred continuation */}
        {!isPro && (
          <div className="relative mt-2">
            <div
              className="pointer-events-none select-none"
              style={{ filter: 'blur(4px)', opacity: 0.5, userSelect: 'none' }}
            >
              <p className={`text-xs leading-relaxed ${text}`}>{data.summary.slice(120)}</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${textMuted}`}>Key Strengths</p>
                  {data.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-1.5 mb-1.5">
                      <CheckIcon size={11} color="#22c55e" weight="bold" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span className={`text-[11px] ${textSub}`}>{s}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${textMuted}`}>Watch Points</p>
                  {data.concerns.map((c, i) => (
                    <div key={i} className="flex items-start gap-1.5 mb-1.5">
                      <WarnIcon size={11} color="#f59e0b" weight="fill" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span className={`text-[11px] ${textSub}`}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Unlock overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: lm
                  ? 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.85) 40%)'
                  : 'linear-gradient(to bottom, transparent 0%, rgba(20,23,28,0.9) 40%)',
              }}
            >
              <PlanGate requiredTier="pro">
                <span />
              </PlanGate>
            </div>
          </div>
        )}

        {/* PRO — full content */}
        {isPro && (
          <>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${textMuted}`}>Key Strengths</p>
                {data.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-1.5 mb-1.5">
                    <CheckIcon size={11} color={lm ? '#16a34a' : '#4ade80'} weight="bold" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span className={`text-[11px] ${textSub}`}>{s}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${textMuted}`}>Watch Points</p>
                {data.concerns.map((c, i) => (
                  <div key={i} className="flex items-start gap-1.5 mb-1.5">
                    <WarnIcon size={11} color="#f59e0b" weight="fill" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span className={`text-[11px] ${textSub}`}>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-score bars */}
            <div className={`mt-4 pt-4 border-t ${lm ? 'border-[#F0F0F8]' : 'border-[#1e2838]'}`}>
              <p className={`text-[10px] font-semibold uppercase tracking-wider mb-3 ${textMuted}`}>Sahi Score Breakdown</p>
              <div className="space-y-2">
                {data.subScores.map((s) => (
                  <ScoreBar key={s.label} label={s.label} value={s.value} lm={lm} />
                ))}
              </div>
            </div>

            {/* Analyst note */}
            <div
              className="mt-4 rounded-xl px-3 py-2.5"
              style={{ background: lm ? '#F8F6FF' : 'rgba(140,52,238,0.06)', border: lm ? '1px solid #ede9fe' : '1px solid rgba(140,52,238,0.15)' }}
            >
              <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${textMuted}`}>Analyst Note</p>
              <p className={`text-[11px] leading-relaxed italic ${textSub}`}>{data.analystNote}</p>
              <p className={`text-[9px] mt-1.5 ${textMuted}`}>Updated {data.updatedAt} · For research purposes only</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

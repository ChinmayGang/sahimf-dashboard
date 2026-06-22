import { useState } from 'react'
import { Sparkle as SparkleIcon } from '@phosphor-icons/react'
import { Check as CheckIcon } from '@phosphor-icons/react'
import { Warning as WarnIcon } from '@phosphor-icons/react'
import { LockSimple as LockIcon } from '@phosphor-icons/react'
import { AnimatedBorderCard } from './AnimatedBorderCard'
import { ProButton } from './ProButton'
import { UpgradePopup } from './UpgradePopup'
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
  const [showUpgrade, setShowUpgrade] = useState(false)
  const vs = VERDICT_STYLE[data.verdict]
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const scoreColor = data.sahiScore >= 80 ? '#22c55e' : data.sahiScore >= 65 ? '#f59e0b' : '#ef4444'

  return (
    <AnimatedBorderCard badge={false}>
      {/* Custom badge row with verdict + score */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 pb-3 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <SparkleIcon size={13} weight="fill" color="#4f46e5" />
          <span className="text-xs font-bold text-[#4f46e5]">SAHI RESEARCH NOTE</span>
          <span className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-[#eeedfd] text-[#7c3aed]">
            Generic · Not Personalised
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: vs.bg, border: `1px solid ${vs.border}`, color: vs.color }}
          >
            {data.verdict}
          </span>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
            style={{ background: scoreColor, boxShadow: `0 0 8px ${scoreColor}40` }}
          >
            {data.sahiScore}
          </div>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: lm ? '#E0E3E8' : '#1e2838' }} />

      {/* Always-visible: summary teaser */}
      <div className="px-5 py-4">
        <p className={`text-xs leading-relaxed ${text}`}>
          <span className="font-semibold">{fundName.split(' ').slice(0, 3).join(' ')}</span>{' '}
          {data.summary.slice(0, 120)}
          {!isPro && '…'}
        </p>

        {/* Free gate — blurred preview with a working unlock overlay */}
        {!isPro && (
          <div className="relative mt-3 rounded-xl overflow-hidden" style={{ minHeight: 150 }}>
            <div
              className="pointer-events-none select-none px-1"
              style={{ filter: 'blur(5px)', userSelect: 'none' }}
              aria-hidden
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'}`}>Key Strengths</p>
                  {data.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-1.5 mb-1.5">
                      <CheckIcon size={11} color="#22c55e" weight="bold" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span className={`text-[11px] ${textSub}`}>{s}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'}`}>Watch Points</p>
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
              className="absolute inset-0 flex flex-col items-center justify-center text-center gap-2 px-6"
              style={{
                background: lm
                  ? 'linear-gradient(to bottom, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.92) 55%)'
                  : 'linear-gradient(to bottom, rgba(20,23,28,0.55) 0%, rgba(20,23,28,0.94) 55%)',
              }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: lm ? '#eeedfd' : 'rgba(214,253,112,0.08)',
                  border: `1px solid ${lm ? 'rgba(79,70,229,0.25)' : 'rgba(214,253,112,0.2)'}`,
                }}
              >
                <LockIcon size={16} color={lm ? '#4f46e5' : '#d6fd70'} weight="fill" />
              </div>
              <p className={`text-xs font-semibold ${lm ? 'text-[#111827]' : 'text-white'}`}>Full research note is a Sahi PRO feature</p>
              <p className={`text-[11px] max-w-xs ${lm ? 'text-[#6B7280]' : 'text-[#8390a2]'}`}>Strengths, watch points, Sahi Score breakdown and the analyst note.</p>
              <ProButton label="Unlock with Sahi PRO" size="sm" className="mt-1" onClick={() => setShowUpgrade(true)} />
            </div>
          </div>
        )}

        {/* PRO — full content */}
        {isPro && (
          <>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'}`}>Key Strengths</p>
                {data.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-1.5 mb-1.5">
                    <CheckIcon size={11} color="#16a34a" weight="bold" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span className={`text-[11px] ${textSub}`}>{s}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'}`}>Watch Points</p>
                {data.concerns.map((c, i) => (
                  <div key={i} className="flex items-start gap-1.5 mb-1.5">
                    <WarnIcon size={11} color="#f59e0b" weight="fill" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span className={`text-[11px] ${textSub}`}>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t" style={{ borderColor: lm ? '#E0E3E8' : '#1e2838' }}>
              <p className={`text-[10px] font-semibold uppercase tracking-wider mb-3 ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'}`}>Sahi Score Breakdown</p>
              <div className="space-y-2">
                {data.subScores.map((s) => (
                  <ScoreBar key={s.label} label={s.label} value={s.value} lm={lm} />
                ))}
              </div>
            </div>

            <div
              className="mt-4 rounded-xl px-3 py-2.5"
              style={{
                background: lm ? '#F8F6FF' : '#0f1420',
                border: `1px solid ${lm ? '#ede9fe' : '#1e2838'}`,
              }}
            >
              <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'}`}>Analyst Note</p>
              <p className={`text-[11px] leading-relaxed italic ${textSub}`}>{data.analystNote}</p>
              <p className="text-[9px] mt-1.5 text-[#6B7280]">Updated {data.updatedAt} · For research purposes only</p>
            </div>
          </>
        )}
      </div>

      <UpgradePopup
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        feature="Full Sahi Research Note"
        description="Unlock the complete analyst note — strengths, watch points, Sahi Score breakdown and verdict rationale for every fund."
      />
    </AnimatedBorderCard>
  )
}

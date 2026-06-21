import { useState } from 'react'
import { Lock as LockIcon } from '@phosphor-icons/react'
import type { PlanTier } from '../../types'
import { usePlan } from '../../hooks/usePlan'
import { useUIStore } from '../../stores/uiStore'
import { UpgradePopup } from './UpgradePopup'
import { ProButton } from './ProButton'

interface PlanGateProps {
  requiredTier: PlanTier
  children: React.ReactNode
  label?: string
  compact?: boolean
  feature?: string
  featureDesc?: string
  /** Override the min-height of the gate block (default: 220px for full, 56px for compact) */
  minHeight?: string
}

export function PlanGate({ requiredTier, children, label, compact, feature, featureDesc, minHeight }: PlanGateProps) {
  const { can } = usePlan()
  const lm = useUIStore((s) => s.lightMode)
  const [showUpgrade, setShowUpgrade] = useState(false)

  if (can(requiredTier)) return <>{children}</>

  const tierLabel = requiredTier === 'pro' ? 'Sahi PRO' : 'Sahi Wealth'

  const compactBg = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const compactText = lm ? 'text-[#111827]' : 'text-white'
  const defaultMinH = compact ? (minHeight ?? '56px') : (minHeight ?? '220px')

  return (
    <>
      {/* w-full ensures the gate fills its grid/flex parent; rounded-2xl clips children to match card radius */}
      <div className="relative w-full rounded-2xl overflow-hidden" style={{ minHeight: defaultMinH }}>
        <div className="pointer-events-none select-none blur-sm w-full h-full">{children}</div>
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[3px] rounded-2xl ${lm ? 'bg-[#ede9fe]/70' : 'bg-black/45'}`}
        >
          {compact ? (
            <button
              onClick={() => setShowUpgrade(true)}
              className={`flex items-center gap-1.5 ${compactBg} rounded-full px-3 py-1.5 hover:opacity-80 transition-opacity cursor-pointer`}
            >
              <LockIcon size={12} color={lm ? '#4f46e5' : '#d6fd70'} weight="fill" />
              <span className={`text-xs font-medium ${compactText}`}>{tierLabel}</span>
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center px-8 py-6">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: lm ? 'rgba(79,70,229,0.1)' : 'rgba(214,253,112,0.1)',
                  border: `1px solid ${lm ? 'rgba(79,70,229,0.2)' : 'rgba(214,253,112,0.2)'}`,
                }}
              >
                <LockIcon size={20} color={lm ? '#4f46e5' : '#d6fd70'} weight="fill" />
              </div>
              <div>
                <p className={`text-sm font-semibold mb-1 ${lm ? 'text-[#111827]' : 'text-white'}`}>
                  {label ?? `Upgrade to ${tierLabel}`}
                </p>
                <p className={`text-xs max-w-[240px] leading-relaxed ${lm ? 'text-[#374151]' : 'text-[rgba(255,255,255,0.72)]'}`}>
                  {featureDesc ?? `Unlock this with a ${tierLabel} subscription`}
                </p>
              </div>
              <ProButton
                label={`Upgrade to ${tierLabel}`}
                size="sm"
                onClick={() => setShowUpgrade(true)}
              />
            </div>
          )}
        </div>
      </div>

      <UpgradePopup
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        feature={feature ?? `Unlock ${tierLabel} features`}
        description={featureDesc}
      />
    </>
  )
}

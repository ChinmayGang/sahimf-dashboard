import { Lock as LockIcon } from '@phosphor-icons/react'
import type { PlanTier } from '../../types'
import { usePlan } from '../../hooks/usePlan'
import { useUIStore } from '../../stores/uiStore'

interface PlanGateProps {
  requiredTier: PlanTier
  children: React.ReactNode
  label?: string
  compact?: boolean
}

export function PlanGate({ requiredTier, children, label, compact }: PlanGateProps) {
  const { can } = usePlan()
  const lm = useUIStore((s) => s.lightMode)

  if (can(requiredTier)) return <>{children}</>

  const tierLabel = requiredTier === 'pro' ? 'Sahi PRO' : 'Sahi Elite'

  const compactBg = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const compactText = lm ? 'text-[#111827]' : 'text-white'

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-lg backdrop-blur-[2px]">
        {compact ? (
          <div className={`flex items-center gap-1.5 ${compactBg} rounded-full px-3 py-1.5`}>
            <LockIcon size={12} color={lm ? '#4f46e5' : '#d6fd70'} weight="regular" />
            <span className={`text-xs font-medium ${compactText}`}>{tierLabel}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: lm ? 'rgba(79,70,229,0.1)' : 'rgba(214,253,112,0.1)', border: `1px solid ${lm ? 'rgba(79,70,229,0.2)' : 'rgba(214,253,112,0.2)'}` }}>
              <LockIcon size={20} color={lm ? '#4f46e5' : '#d6fd70'} weight="duotone" />
            </div>
            <div>
              <p className={`text-sm font-semibold mb-1 ${lm ? 'text-[#111827]' : 'text-white'}`}>
                {label ?? `Upgrade to ${tierLabel}`}
              </p>
              <p className={`text-xs ${lm ? 'text-[#6B7280]' : 'text-[#8390a2]'}`}>
                Unlock this with a {tierLabel} subscription
              </p>
            </div>
            <button className="bg-[#d6fd70] hover:bg-[#b8d94a] text-black text-xs font-semibold px-4 py-2 rounded-full transition-colors">
              Upgrade to {tierLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

import LockIcon from '@mui/icons-material/Lock'
import type { PlanTier } from '../../types'
import { usePlan } from '../../hooks/usePlan'

interface PlanGateProps {
  requiredTier: PlanTier
  children: React.ReactNode
  label?: string
  compact?: boolean
}

export function PlanGate({ requiredTier, children, label, compact }: PlanGateProps) {
  const { can } = usePlan()

  if (can(requiredTier)) return <>{children}</>

  const tierLabel = requiredTier === 'pro' ? 'Sahi PRO' : 'Sahi Elite'

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-lg backdrop-blur-[2px]">
        {compact ? (
          <div className="flex items-center gap-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full px-3 py-1.5">
            <LockIcon sx={{ fontSize: 12, color: '#C5F135' }} />
            <span className="text-xs font-medium text-white">{tierLabel}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <div className="w-10 h-10 rounded-full bg-[#C5F135]/10 border border-[#C5F135]/20 flex items-center justify-center">
              <LockIcon sx={{ fontSize: 20, color: '#C5F135' }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-1">
                {label ?? `Upgrade to ${tierLabel}`}
              </p>
              <p className="text-xs text-[#A0A0A0]">
                Unlock this with a {tierLabel} subscription
              </p>
            </div>
            <button className="bg-[#C5F135] hover:bg-[#A8D020] text-black text-xs font-semibold px-4 py-2 rounded-full transition-colors">
              Upgrade to {tierLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

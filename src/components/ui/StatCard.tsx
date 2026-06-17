import { TrendUp as TrendingUpIcon } from '@phosphor-icons/react'
import { TrendDown as TrendingDownIcon } from '@phosphor-icons/react'
import { useUIStore } from '../../stores/uiStore'

interface StatCardProps {
  label: string
  value: string
  subValue?: string
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  accent?: boolean
}

export function StatCard({ label, value, subValue, change, changeLabel, icon, accent }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0
  const lm = useUIStore((s) => s.lightMode)

  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'

  return (
    <div
      className={`rounded-xl p-4 border transition-colors ${
        accent
          ? 'bg-[#d6fd70]/5 border-[#d6fd70]/20'
          : lm
            ? 'bg-white border-[#E0E3E8] hover:border-[#D1D5DB]'
            : 'bg-[#14171c] border-[#1e2838] hover:border-[#3c4653]'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs ${textSub} font-medium uppercase tracking-wide`}>{label}</span>
        {icon && <span className={textMuted}>{icon}</span>}
      </div>
      <div className="space-y-1">
        <p className={`text-xl font-semibold ${accent ? (lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]') : text}`}>{value}</p>
        {subValue && <p className={`text-xs ${textSub}`}>{subValue}</p>}
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {isPositive ? (
              <TrendingUpIcon size={14} weight="regular" />
            ) : (
              <TrendingDownIcon size={14} weight="regular" />
            )}
            <span>
              {isPositive ? '+' : ''}{change.toFixed(2)}%{changeLabel ? ` ${changeLabel}` : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

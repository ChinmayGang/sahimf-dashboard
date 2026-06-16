import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
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
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#A0A0A0]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#606060]'

  return (
    <div
      className={`rounded-xl p-4 border transition-colors ${
        accent
          ? 'bg-[#C5F135]/5 border-[#C5F135]/20'
          : lm
            ? 'bg-white border-[#E8E8F0] shadow-sm hover:border-[#D1D5DB]'
            : 'bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#3A3A3A]'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs ${textSub} font-medium uppercase tracking-wide`}>{label}</span>
        {icon && <span className={textMuted}>{icon}</span>}
      </div>
      <div className="space-y-1">
        <p className={`text-xl font-semibold ${accent ? 'text-[#C5F135]' : text}`}>{value}</p>
        {subValue && <p className={`text-xs ${textSub}`}>{subValue}</p>}
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {isPositive ? (
              <TrendingUpIcon sx={{ fontSize: 14 }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: 14 }} />
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

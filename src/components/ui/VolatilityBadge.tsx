// SEBI 6-level risk vocabulary — the single standard used across the app.
type RiskLevel =
  | 'Low'
  | 'Low-Moderate'
  | 'Moderate'
  | 'Moderately High'
  | 'High'
  | 'Very High'

interface Props {
  level: RiskLevel
  size?: 'sm' | 'md'
}

const config: Record<RiskLevel, { color: string; bg: string; dot: string }> = {
  'Low':            { color: 'text-[#15803D]', bg: 'bg-[#16A34A]/20', dot: 'bg-[#16A34A]' },
  'Low-Moderate':   { color: 'text-[#0F766E]', bg: 'bg-[#0D9488]/20', dot: 'bg-[#0D9488]' },
  'Moderate':       { color: 'text-[#B45309]', bg: 'bg-[#D97706]/20', dot: 'bg-[#D97706]' },
  'Moderately High':{ color: 'text-[#C2410C]', bg: 'bg-[#EA580C]/20', dot: 'bg-[#EA580C]' },
  'High':           { color: 'text-[#B91C1C]', bg: 'bg-[#DC2626]/20', dot: 'bg-[#DC2626]' },
  'Very High':      { color: 'text-[#7F1D1D]', bg: 'bg-[#9B1C1C]/20', dot: 'bg-[#9B1C1C]' },
}

export function VolatilityBadge({ level, size = 'sm' }: Props) {
  const { color, bg, dot } = config[level] ?? config['Moderate']
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${bg} ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span className={`font-medium ${color}`}>{level}</span>
    </span>
  )
}

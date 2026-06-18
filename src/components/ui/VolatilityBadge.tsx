type RiskLevel =
  | 'Low'
  | 'Low-Moderate'
  | 'Moderate'
  | 'Moderately High'
  | 'High'
  | 'Very High'
  | 'Medium'

interface Props {
  level: RiskLevel
  size?: 'sm' | 'md'
}

const config: Record<RiskLevel, { color: string; bg: string; dot: string }> = {
  'Low':            { color: 'text-[#16A34A]', bg: 'bg-[#16A34A]/15', dot: 'bg-[#16A34A]' },
  'Low-Moderate':   { color: 'text-[#0D9488]', bg: 'bg-[#0D9488]/15', dot: 'bg-[#0D9488]' },
  'Moderate':       { color: 'text-[#D97706]', bg: 'bg-[#D97706]/15', dot: 'bg-[#D97706]' },
  'Medium':         { color: 'text-[#D97706]', bg: 'bg-[#D97706]/15', dot: 'bg-[#D97706]' },
  'Moderately High':{ color: 'text-[#EA580C]', bg: 'bg-[#EA580C]/15', dot: 'bg-[#EA580C]' },
  'High':           { color: 'text-[#DC2626]', bg: 'bg-[#DC2626]/15', dot: 'bg-[#DC2626]' },
  'Very High':      { color: 'text-[#9B1C1C]', bg: 'bg-[#9B1C1C]/15', dot: 'bg-[#9B1C1C]' },
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
      <span className={`font-medium ${color}`}>{level === 'Medium' ? 'Moderate' : level}</span>
    </span>
  )
}

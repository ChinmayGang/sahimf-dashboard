interface Props {
  level: 'Low' | 'Medium' | 'High'
  size?: 'sm' | 'md'
}

const config = {
  Low: { color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10', dot: 'bg-[#22C55E]' },
  Medium: { color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', dot: 'bg-[#F59E0B]' },
  High: { color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10', dot: 'bg-[#EF4444]' },
}

export function VolatilityBadge({ level, size = 'sm' }: Props) {
  const { color, bg, dot } = config[level]
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

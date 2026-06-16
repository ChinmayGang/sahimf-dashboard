import { Star as StarIcon } from '@phosphor-icons/react'
import type { PlanTier } from '../../types'
import { useUIStore } from '../../stores/uiStore'

interface Props {
  tier: PlanTier
  size?: 'sm' | 'md'
}

export function PlanBadge({ tier, size = 'sm' }: Props) {
  const lm = useUIStore((s) => s.lightMode)

  const config: Record<PlanTier, { label: string; bg: string; text: string }> = {
    free: {
      label: 'Free',
      bg: lm ? 'bg-[#F3F4F6]' : 'bg-[#1e2838]',
      text: lm ? 'text-[#6B7280]' : 'text-[#8390a2]',
    },
    pro: { label: 'Sahi PRO', bg: 'bg-[#4f46e5]', text: 'text-white' },
    elite: { label: 'Sahi Elite', bg: 'bg-gradient-to-r from-[#d6fd70] to-[#b8d94a]', text: 'text-black' },
  }

  const { label, bg, text } = config[tier]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${bg} ${text} ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      }`}
    >
      {tier !== 'free' && <StarIcon size={10} weight="regular" />}
      {label}
    </span>
  )
}

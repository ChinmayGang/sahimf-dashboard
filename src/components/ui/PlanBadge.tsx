import StarIcon from '@mui/icons-material/Star'
import type { PlanTier } from '../../types'

interface Props {
  tier: PlanTier
  size?: 'sm' | 'md'
}

const config: Record<PlanTier, { label: string; bg: string; text: string }> = {
  free: { label: 'Free', bg: 'bg-[#2A2A2A]', text: 'text-[#A0A0A0]' },
  pro: { label: 'Sahi PRO', bg: 'bg-[#7B2FBE]', text: 'text-white' },
  elite: { label: 'Sahi Elite', bg: 'bg-gradient-to-r from-[#C5F135] to-[#A8D020]', text: 'text-black' },
}

export function PlanBadge({ tier, size = 'sm' }: Props) {
  const { label, bg, text } = config[tier]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${bg} ${text} ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      }`}
    >
      {tier !== 'free' && <StarIcon sx={{ fontSize: 10 }} />}
      {label}
    </span>
  )
}

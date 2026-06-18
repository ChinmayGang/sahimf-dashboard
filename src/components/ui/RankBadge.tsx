import first from '../../assets/rank-icons/first.png'
import second from '../../assets/rank-icons/second.png'
import third from '../../assets/rank-icons/third.png'
import fourth from '../../assets/rank-icons/fourth.png'
import fifth from '../../assets/rank-icons/fifth.png'

const RANK_ICONS: Record<number, string> = { 1: first, 2: second, 3: third, 4: fourth, 5: fifth }

/** Correct ordinal suffix for any positive integer (1st, 2nd, 3rd, 4th, 11th, 21st…). */
export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0])
}

export function rankIcon(rank: number): string | null {
  return RANK_ICONS[rank] ?? null
}

interface RankBadgeProps {
  rank: number
  size?: number
}

/** Medal/laurel icon for ranks 1-5 (null for 6+). */
export function RankBadge({ rank, size = 26 }: RankBadgeProps) {
  const icon = rankIcon(rank)
  if (!icon) return null
  return <img src={icon} alt={`Rank ${rank}`} width={size} height={size} style={{ objectFit: 'contain' }} />
}

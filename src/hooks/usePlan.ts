import { useAuthStore } from '../stores/authStore'
import type { PlanTier } from '../types'

const tierRank: Record<PlanTier, number> = { free: 0, pro: 1, wealth: 2 }

export function usePlan() {
  const user = useAuthStore((s) => s.user)
  const currentTier = user?.plan ?? 'free'

  const can = (requiredTier: PlanTier) =>
    tierRank[currentTier] >= tierRank[requiredTier]

  const isFree = currentTier === 'free'
  const isPro = currentTier === 'pro'
  const isWealth = currentTier === 'wealth'

  return { currentTier, can, isFree, isPro, isWealth }
}

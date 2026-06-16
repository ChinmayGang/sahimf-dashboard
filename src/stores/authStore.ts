import { create } from 'zustand'
import type { User, PlanTier } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  setPlan: (plan: PlanTier) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  setPlan: (plan) =>
    set((state) => ({
      user: state.user ? { ...state.user, plan } : null,
    })),
}))

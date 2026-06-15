import { create } from 'zustand'
import type { User, PlanTier } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  setPlan: (plan: PlanTier) => void
}

const mockUser: User = {
  id: '1',
  name: 'Emily Rose',
  phone: '+91 9876543210',
  email: 'emily@example.com',
  plan: 'pro',
  planExpiresAt: '2027-06-15',
}

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUser,
  isAuthenticated: true,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  setPlan: (plan) =>
    set((state) => ({
      user: state.user ? { ...state.user, plan } : null,
    })),
}))

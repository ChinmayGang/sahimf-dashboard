import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WatchlistState {
  ids: string[]
  /** seed from the user's saved watchlist once on login (does not clobber local adds) */
  seed: (ids: string[]) => void
  toggle: (id: string) => void
  has: (id: string) => boolean
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      seed: (ids) =>
        set((s) => ({ ids: Array.from(new Set([...ids, ...s.ids])) })),
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id],
        })),
      has: (id) => get().ids.includes(id),
    }),
    { name: 'sahimf-watchlist' }
  )
)

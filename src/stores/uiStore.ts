import { create } from 'zustand'

interface UIState {
  sidebarExpanded: boolean
  openSubmenu: string | null
  lightMode: boolean
  toggleSidebar: () => void
  setSidebarExpanded: (v: boolean) => void
  toggleSubmenu: (key: string) => void
  closeSubmenu: () => void
  toggleLightMode: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarExpanded: true,
  openSubmenu: 'mutual-funds',
  lightMode: true,
  toggleSidebar: () =>
    set((s) => ({ sidebarExpanded: !s.sidebarExpanded, openSubmenu: null })),
  setSidebarExpanded: (v) => set({ sidebarExpanded: v }),
  toggleSubmenu: (key) =>
    set((s) => ({ openSubmenu: s.openSubmenu === key ? null : key })),
  closeSubmenu: () => set({ openSubmenu: null }),
  toggleLightMode: () => set((s) => ({ lightMode: !s.lightMode })),
}))

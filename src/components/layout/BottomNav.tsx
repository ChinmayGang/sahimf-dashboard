import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  SquaresFour, Compass, Wrench, UserCircle, FolderOpen,
  Stack, ArrowsLeftRight, ChartPieSlice, ShieldCheck, Star,
  Calculator, Target, ShoppingBag, FileText, ChartBar, Buildings,
  X, Sparkle,
} from '@phosphor-icons/react'

const W = 'fill' as const

interface SheetLink {
  label: string
  path: string
  icon: React.ReactNode
}

const sheetLinks: SheetLink[] = [
  { label: 'Overlap Lens', path: '/mutual-funds/overlap', icon: <Stack size={20} weight={W} /> },
  { label: 'Fund Compare', path: '/mutual-funds/compare', icon: <ArrowsLeftRight size={20} weight={W} /> },
  { label: 'Market Cap', path: '/mutual-funds/market-cap', icon: <ChartPieSlice size={20} weight={W} /> },
  { label: 'Risk Analysis', path: '/mutual-funds/risk', icon: <ShieldCheck size={20} weight={W} /> },
  { label: 'MF Scorecard', path: '/mutual-funds/scorecard', icon: <Star size={20} weight={W} /> },
  { label: 'SIP Calc', path: '/mutual-funds/tools/sip', icon: <Calculator size={20} weight={W} /> },
  { label: 'Goals', path: '/mutual-funds/goals', icon: <Target size={20} weight={W} /> },
  { label: 'Baskets', path: '/mutual-funds/baskets', icon: <ShoppingBag size={20} weight={W} /> },
  { label: 'Sahi Funds', path: '/mutual-funds/my-sahi-funds', icon: <Sparkle size={20} weight={W} /> },
  { label: 'Fund Mgr', path: '/mutual-funds/amfi', icon: <Buildings size={20} weight={W} /> },
  { label: 'Tax Optimizer', path: '/mutual-funds/reports/tax', icon: <FileText size={20} weight={W} /> },
  { label: 'Reports', path: '/mutual-funds/reports/mfpms', icon: <ChartBar size={20} weight={W} /> },
]

const primaryTabs = [
  { key: 'overview', label: 'Overview', icon: <SquaresFour size={20} weight={W} />, path: '/mutual-funds' },
  { key: 'portfolio', label: 'Portfolio', icon: <FolderOpen size={20} weight={W} />, path: '/mutual-funds/portfolios' },
  { key: 'explore', label: 'Explore', icon: <Compass size={22} weight={W} />, path: '/mutual-funds/explore', center: true },
  { key: 'tools', label: 'Tools', icon: <Wrench size={20} weight={W} />, path: null },
  { key: 'profile', label: 'Profile', icon: <UserCircle size={20} weight={W} />, path: '/settings' },
] as const

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sheetOpen, setSheetOpen] = useState(false)

  // Auto-close sheet when route changes (user tapped a nav tab)
  useEffect(() => {
    setSheetOpen(false)
  }, [location.pathname])

  function isActive(path: string | null) {
    if (!path) return false
    if (path === '/mutual-funds') return location.pathname === '/mutual-funds'
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Bottom bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex items-center"
        style={{ background: '#0a0c0e', borderTop: '1px solid #1e2838', height: 64, paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {primaryTabs.map((tab) => {
          const active = isActive(tab.path)
          const isCenter = 'center' in tab && tab.center

          if (isCenter) {
            return (
              <button
                key={tab.key}
                onClick={() => navigate(tab.path as string)}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
                style={{ marginTop: -16 }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                  style={{ background: active ? '#d6fd70' : '#4f46e5' }}
                >
                  <span style={{ color: active ? '#0a0c0e' : '#fff' }}>{tab.icon}</span>
                </div>
                <span className="text-[10px] font-medium mt-0.5" style={{ color: active ? '#d6fd70' : '#8390a2' }}>
                  {tab.label}
                </span>
              </button>
            )
          }

          if (tab.key === 'tools') {
            return (
              <button
                key={tab.key}
                onClick={() => setSheetOpen(s => !s)}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2"
              >
                <span style={{ color: sheetOpen ? '#d6fd70' : '#8390a2' }}>{tab.icon}</span>
                <span className="text-[10px] font-medium" style={{ color: sheetOpen ? '#d6fd70' : '#8390a2' }}>
                  {tab.label}
                </span>
              </button>
            )
          }

          return (
            <button
              key={tab.key}
              onClick={() => navigate(tab.path as string)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2"
            >
              <span style={{ color: active ? '#d6fd70' : '#8390a2' }}>{tab.icon}</span>
              <span className="text-[10px] font-medium" style={{ color: active ? '#d6fd70' : '#8390a2' }}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Tools upward sheet */}
      {sheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={() => setSheetOpen(false)}
          />
          {/* Sheet */}
          <div
            className="fixed left-0 right-0 z-50 md:hidden rounded-t-3xl"
            style={{
              bottom: 64,
              background: '#0d0f14',
              border: '1px solid #1e2838',
              borderBottom: 'none',
              maxHeight: '72vh',
              overflowY: 'auto',
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: '#2a3444' }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#8390a2' }}>
                Quick Nav
              </span>
              <button
                onClick={() => setSheetOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: '#1e2838', color: '#8390a2' }}
              >
                <X size={14} weight={W} />
              </button>
            </div>

            {/* Grid of links */}
            <div className="grid grid-cols-3 gap-3 px-4 pb-6">
              {sheetLinks.map((link) => {
                const active = location.pathname.startsWith(link.path)
                return (
                  <button
                    key={link.path}
                    onClick={() => { navigate(link.path); setSheetOpen(false) }}
                    className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl text-center transition-all"
                    style={active
                      ? { background: 'rgba(214,253,112,0.08)', border: '1px solid rgba(214,253,112,0.2)' }
                      : { background: '#14171c', border: '1px solid #1e2838' }
                    }
                  >
                    <span style={{ color: active ? '#d6fd70' : '#64748b' }}>{link.icon}</span>
                    <span
                      className="text-[11px] font-medium leading-tight"
                      style={{ color: active ? '#d6fd70' : '#8390a2' }}
                    >
                      {link.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </>
  )
}

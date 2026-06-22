import { useState } from 'react'
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
  { label: 'Overlap Lens', path: '/mutual-funds/overlap', icon: <Stack size={16} weight={W} /> },
  { label: 'Fund Comparison', path: '/mutual-funds/compare', icon: <ArrowsLeftRight size={16} weight={W} /> },
  { label: 'Market Cap Mix', path: '/mutual-funds/market-cap', icon: <ChartPieSlice size={16} weight={W} /> },
  { label: 'Risk Analysis', path: '/mutual-funds/risk', icon: <ShieldCheck size={16} weight={W} /> },
  { label: 'MF Scorecard', path: '/mutual-funds/scorecard', icon: <Star size={16} weight={W} /> },
  { label: 'SIP Calculator', path: '/mutual-funds/tools/sip', icon: <Calculator size={16} weight={W} /> },
  { label: 'Goals & Plans', path: '/mutual-funds/goals', icon: <Target size={16} weight={W} /> },
  { label: 'Sahi Baskets', path: '/mutual-funds/baskets', icon: <ShoppingBag size={16} weight={W} /> },
  { label: 'My Sahi Funds', path: '/mutual-funds/my-sahi-funds', icon: <Sparkle size={16} weight={W} /> },
  { label: 'Fund Manager', path: '/mutual-funds/amfi', icon: <Buildings size={16} weight={W} /> },
  { label: 'Tax Optimizer', path: '/mutual-funds/reports/tax', icon: <FileText size={16} weight={W} /> },
  { label: 'Reports', path: '/mutual-funds/reports/mfpms', icon: <ChartBar size={16} weight={W} /> },
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
                onClick={() => setSheetOpen(true)}
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
          <div
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setSheetOpen(false)}
          />
          <div
            className="fixed left-0 right-0 z-50 md:hidden rounded-t-2xl overflow-hidden"
            style={{
              bottom: 64,
              background: '#0a0c0e',
              border: '1px solid #1e2838',
              borderBottom: 'none',
              maxHeight: '70vh',
              overflowY: 'auto',
            }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#1e2838' }}>
              <span className="text-sm font-semibold text-white">More Tools</span>
              <button onClick={() => setSheetOpen(false)} className="text-[#8390a2]">
                <X size={18} weight={W} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-px p-4" style={{ background: '#1e2838' }}>
              {sheetLinks.map((link) => {
                const active = location.pathname.startsWith(link.path)
                return (
                  <button
                    key={link.path}
                    onClick={() => { navigate(link.path); setSheetOpen(false) }}
                    className="flex flex-col items-center gap-2 py-4 px-2 rounded-xl text-center"
                    style={{ background: active ? 'rgba(214,253,112,0.1)' : '#0a0c0e' }}
                  >
                    <span style={{ color: active ? '#d6fd70' : '#8390a2' }}>{link.icon}</span>
                    <span className="text-[10px] leading-tight" style={{ color: active ? '#d6fd70' : '#8390a2' }}>
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

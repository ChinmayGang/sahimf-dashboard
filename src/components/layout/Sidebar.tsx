import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  SquaresFour, Folder, Sparkle, Compass,
  ArrowsLeftRight, Stack, Star, Buildings, Calculator, ChartBar, FileText,
  CaretDown, CaretRight, CaretLeft, Lock, Gear, SignOut,
  SidebarSimple, ShoppingBag, Target, ChartPieSlice, ShieldCheck,
} from '@phosphor-icons/react'
import sahiIcon from '../../assets/logo/sahi_icon.svg'
import sahiLogoWhite from '../../assets/logo/sahi_logo-white.svg'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useUIStore } from '../../stores/uiStore'
import { useAuthStore } from '../../stores/authStore'

interface NavItem {
  key: string
  label: string
  icon: React.ReactNode
  path?: string
  children?: NavItem[]
  badge?: number
  comingSoon?: boolean
}

const W = 'duotone' as const

const mfChildren: NavItem[] = [
  { key: 'mf-overview', label: 'Overview', icon: <SquaresFour size={15} weight={W} />, path: '/mutual-funds' },
  { key: 'mf-portfolios', label: 'My Portfolios', icon: <Folder size={15} weight={W} />, path: '/mutual-funds/portfolios' },
  { key: 'mf-explore', label: 'Explore Funds', icon: <Compass size={15} weight={W} />, path: '/mutual-funds/explore' },
  { key: 'sahi-mine', label: 'My Sahi Funds', icon: <Sparkle size={15} weight={W} />, path: '/mutual-funds/my-sahi-funds' },
  { key: 'mf-baskets', label: 'Sahi Baskets', icon: <ShoppingBag size={15} weight={W} />, path: '/mutual-funds/baskets' },
  { key: 'mf-overlap', label: 'Overlap Lens', icon: <Stack size={15} weight={W} />, path: '/mutual-funds/overlap', badge: 1 },
  { key: 'mf-compare', label: 'Fund Comparison', icon: <ArrowsLeftRight size={15} weight={W} />, path: '/mutual-funds/compare' },
  { key: 'mf-market-cap', label: 'Market Cap Mix', icon: <ChartPieSlice size={15} weight={W} />, path: '/mutual-funds/market-cap' },
  { key: 'mf-risk', label: 'Risk Analysis', icon: <ShieldCheck size={15} weight={W} />, path: '/mutual-funds/risk' },
  { key: 'mf-scorecard', label: 'MF Scorecard', icon: <Star size={15} weight={W} />, path: '/mutual-funds/scorecard' },
  { key: 'mf-amfi', label: 'Fund Manager', icon: <Buildings size={15} weight={W} />, path: '/mutual-funds/amfi' },
  { key: 'mf-tools', label: 'SIP Calculator', icon: <Calculator size={15} weight={W} />, path: '/mutual-funds/tools/sip' },
  { key: 'mf-dividends', label: 'Dividends', icon: <ChartBar size={15} weight={W} />, path: '/mutual-funds/dividends' },
  { key: 'mf-goals', label: 'Goals & Plans', icon: <Target size={15} weight={W} />, path: '/mutual-funds/goals' },
  { key: 'mf-tax', label: 'Tax Optimizer', icon: <FileText size={15} weight={W} />, path: '/mutual-funds/reports/tax' },
  { key: 'mf-reports', label: 'Reports & Disclosures', icon: <FileText size={15} weight={W} />, path: '/mutual-funds/reports/mfpms' },
]

// Flat top-level nav — all mutual-fund tools are surfaced directly (no parent dropdown).
// Other Arqentis products (Numera, Thematic Baskets, ArqEd, F&O, Credit) are hidden until launch.
const navItems: NavItem[] = mfChildren

// Sidebar is always dark regardless of app light/dark mode
const S = {
  bg: '#0a0c0e',
  profileBg: '#14171c',
  profileBorder: '1px solid #1e2838',
  divider: '#1e2838',
  text: 'white',
  textSub: '#8390a2',
  textMuted: '#505d6f',
  activeText: '#d6fd70',
  activeBg: 'rgba(214,253,112,0.1)',
  hoverBg: '#1e2838',
  disabledText: '#3c4653',
  tooltipBg: '#14171c',
  tooltipBorder: '#1e2838',
}

function NavRow({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const location = useLocation()
  const [open, setOpen] = useState(item.key === 'mutual-funds')
  const isActive = item.path ? location.pathname === item.path : false
  const hasChildren = !!(item.children?.length)
  const iconEl = item.comingSoon ? <Lock size={13} weight="fill" color={S.disabledText} /> : item.icon

  const activeClass = `font-semibold`
  const activeStyle = { background: S.activeBg, color: S.activeText }
  const defaultStyle = item.comingSoon
    ? { color: S.disabledText, cursor: 'not-allowed' }
    : { color: S.textSub }

  const row = (
    <div
      onClick={() => hasChildren && !item.comingSoon && setOpen(p => !p)}
      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all select-none ${depth > 0 ? 'ml-3 text-[11.5px]' : 'text-[12.5px]'} ${isActive ? activeClass : ''}`}
      style={isActive ? activeStyle : defaultStyle}
      onMouseEnter={e => { if (!isActive && !item.comingSoon) { e.currentTarget.style.background = S.hoverBg; e.currentTarget.style.color = 'white' } }}
      onMouseLeave={e => { if (!isActive && !item.comingSoon) { e.currentTarget.style.background = ''; e.currentTarget.style.color = S.textSub } }}
    >
      <span className="flex-shrink-0 opacity-80">{iconEl}</span>
      <span className="flex-1 truncate font-medium">{item.label}</span>
      {item.badge && <span className="bg-[#4f46e5] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>}
      {item.comingSoon && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#1e2838] text-[#3c4653]">SOON</span>}
      {hasChildren && !item.comingSoon && (
        <span className="opacity-40 flex-shrink-0">
          {open ? <CaretDown size={11} weight="bold" /> : <CaretRight size={11} weight="bold" />}
        </span>
      )}
    </div>
  )
  return (
    <div>
      {item.path && !item.comingSoon ? <Link to={item.path}>{row}</Link> : row}
      {hasChildren && open && !item.comingSoon && (
        <div className="mt-0.5 space-y-0.5 border-l ml-4 pl-0.5" style={{ borderColor: S.divider }}>
          {item.children!.map(child => <NavRow key={child.key} item={child} depth={depth + 1} />)}
        </div>
      )}
    </div>
  )
}

function CollapsedIcon({ item }: { item: NavItem }) {
  const location = useLocation()
  const isActive = item.path ? location.pathname === item.path : false
  const hasChildren = !!(item.children?.length)
  const iconEl = item.comingSoon ? <Lock size={14} weight="fill" color={S.disabledText} /> : item.icon

  const btn = (
    <div
      className="flex items-center justify-center w-8 h-8 rounded-xl cursor-pointer transition-all"
      style={{
        background: isActive ? S.activeBg : '',
        color: isActive ? S.activeText : item.comingSoon ? S.disabledText : S.textSub,
      }}
      onMouseEnter={e => { if (!isActive && !item.comingSoon) { e.currentTarget.style.background = S.hoverBg; e.currentTarget.style.color = 'white' } }}
      onMouseLeave={e => { if (!isActive && !item.comingSoon) { e.currentTarget.style.background = ''; e.currentTarget.style.color = S.textSub } }}
    >
      {iconEl}
    </div>
  )

  if (item.comingSoon) return btn

  return (
    <Tooltip.Provider delayDuration={80}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {item.path && !hasChildren ? <Link to={item.path}>{btn}</Link> : btn}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content side="right" sideOffset={12} className="z-50 animate-in fade-in-0 zoom-in-95">
            {hasChildren ? (
              <div className="rounded-2xl p-2 min-w-[180px] max-h-[70vh] overflow-y-auto shadow-xl" style={{ background: S.tooltipBg, border: `1px solid ${S.tooltipBorder}` }}>
                <p className="text-[10px] font-bold uppercase tracking-wider px-2 py-1" style={{ color: S.textSub }}>{item.label}</p>
                {item.children?.map(child =>
                  child.children ? (
                    <div key={child.key}>
                      <p className="text-[10px] font-bold uppercase tracking-wider px-2 pt-2 pb-1" style={{ color: S.textSub }}>{child.label}</p>
                      {child.children.map(gc => (
                        <Link key={gc.key} to={gc.path ?? '#'}>
                          <div className="flex items-center gap-2 pl-4 pr-2 py-1.5 rounded-lg transition-colors hover:bg-[#1e2838]" style={{ color: S.text }}>
                            <span style={{ color: S.textSub }}>{gc.icon}</span>
                            <span className="text-xs font-medium">{gc.label}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link key={child.key} to={child.path ?? '#'}>
                      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors hover:bg-[#1e2838]" style={{ color: S.text }}>
                        <span style={{ color: S.textSub }}>{child.icon}</span>
                        <span className="text-xs font-medium">{child.label}</span>
                      </div>
                    </Link>
                  )
                )}
              </div>
            ) : (
              <div className="text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-md" style={{ background: S.tooltipBg, border: `1px solid ${S.tooltipBorder}`, color: S.text }}>{item.label}</div>
            )}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export function Sidebar() {
  const { sidebarExpanded, toggleSidebar } = useUIStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [edgeHovered, setEdgeHovered] = useState(false)

  const initials = user?.name ? user.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() : '??'
  const planLabel = user?.plan === 'pro' ? 'Sahi PRO' : user?.plan === 'wealth' ? 'Sahi Wealth' : 'Free'
  const planColor = user?.plan === 'pro' ? '#4f46e5' : user?.plan === 'wealth' ? '#f59e0b' : S.textMuted
  const handleLogout = () => { logout(); navigate('/auth/login') }

  return (
    <div className="relative flex flex-shrink-0">
      <aside
        className={`flex flex-col m-1 rounded-2xl transition-all duration-200 overflow-hidden ${sidebarExpanded ? 'w-52' : 'w-[52px]'}`}
        style={{ background: S.bg, height: 'calc(100vh - 8px)' }}
      >

        {/* Profile */}
        <div className="flex-shrink-0 p-2 pt-2.5">
          {sidebarExpanded ? (
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl" style={{ background: S.profileBg, border: S.profileBorder }}>
              <div className="w-7 h-7 rounded-full bg-[#4f46e5] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">{initials}</div>
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-semibold truncate leading-tight" style={{ color: S.text }}>{user?.name ?? '—'}</p>
                <p className="text-[10px] font-semibold" style={{ color: planColor }}>{planLabel}</p>
              </div>
              <button onClick={toggleSidebar} className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity">
                <SidebarSimple size={14} color={S.textSub} />
              </button>
            </div>
          ) : (
            <Tooltip.Provider delayDuration={80}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button onClick={toggleSidebar} className="w-8 h-8 rounded-full bg-[#4f46e5] flex items-center justify-center text-[10px] font-bold text-white mx-auto hover:scale-105 transition-transform">{initials}</button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content side="right" sideOffset={12} className="z-50">
                    <div className="rounded-lg px-2.5 py-1.5 text-xs font-medium shadow-md" style={{ background: S.tooltipBg, border: `1px solid ${S.tooltipBorder}`, color: S.text }}>
                      {user?.name} · {planLabel}
                    </div>
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          )}
        </div>

        {/* Nav */}
        {sidebarExpanded ? (
          <div className="flex-1 overflow-y-auto py-1 px-2 space-y-0.5 scrollbar-hide">
            {navItems.map(item => <NavRow key={item.key} item={item} />)}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center gap-0.5 py-2 overflow-y-auto scrollbar-hide">
            {navItems.map(item => <CollapsedIcon key={item.key} item={item} />)}
          </div>
        )}

        {/* Bottom */}
        <div className="flex-shrink-0 p-2 pb-2.5">
          <div className="border-t mb-2" style={{ borderColor: S.divider }} />
          {sidebarExpanded ? (
            <div className="space-y-0.5">
              <Link to="/settings">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[12px] font-medium cursor-pointer transition-colors text-[#8390a2] hover:bg-[#1e2838] hover:text-white">
                  <Gear size={14} weight="duotone" /><span>Settings</span>
                </div>
              </Link>
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[12px] font-medium cursor-pointer transition-colors text-left text-[#ef4444] hover:bg-[#1a0a0a]">
                <SignOut size={14} weight="duotone" /><span>Sign Out</span>
              </button>
              <div className="px-2 pt-1.5">
                <img src={sahiLogoWhite} alt="SahiMF" style={{ height: 18 }} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-0.5">
              {[
                { icon: <Gear size={14} weight="duotone" />, label: 'Settings', onClick: () => navigate('/settings'), danger: false },
                { icon: <SignOut size={14} weight="duotone" />, label: 'Sign Out', onClick: handleLogout, danger: true },
              ].map(a => (
                <Tooltip.Provider key={a.label} delayDuration={80}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        onClick={a.onClick}
                        className={`flex items-center justify-center w-8 h-8 rounded-xl cursor-pointer transition-colors ${a.danger ? 'text-[#ef4444] hover:bg-[#1a0a0a]' : 'text-[#505d6f] hover:bg-[#1e2838] hover:text-white'}`}
                      >
                        {a.icon}
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content side="right" sideOffset={12} className="z-50">
                        <div className="rounded-lg px-2.5 py-1.5 text-xs font-medium shadow-md" style={{ background: S.tooltipBg, border: `1px solid ${S.tooltipBorder}`, color: S.text }}>{a.label}</div>
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              ))}
              <div className="mt-1">
                <img src={sahiIcon} alt="SahiMF" style={{ width: 24, height: 24 }} />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Full-height edge strip — click anywhere on right border to toggle */}
      <div
        onClick={toggleSidebar}
        onMouseEnter={() => setEdgeHovered(true)}
        onMouseLeave={() => setEdgeHovered(false)}
        className="absolute right-0 top-0 bottom-0 z-20 flex items-center justify-center cursor-pointer"
        style={{ width: 8 }}
        title={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {/* The visible line — brightens on hover */}
        <div
          className="h-full transition-all duration-150"
          style={{
            width: edgeHovered ? 2 : 1,
            background: edgeHovered ? '#4f46e5' : 'rgba(255,255,255,0.06)',
            borderRadius: 1,
          }}
        />
        {/* Floating caret pill — appears on hover at center */}
        <div
          className="absolute flex items-center justify-center rounded-full transition-all duration-150"
          style={{
            width: 18,
            height: 18,
            background: edgeHovered ? '#4f46e5' : 'transparent',
            opacity: edgeHovered ? 1 : 0,
            transform: edgeHovered ? 'translateX(1px)' : 'translateX(-2px)',
            boxShadow: edgeHovered ? '0 0 0 3px rgba(79,70,229,0.2)' : 'none',
          }}
        >
          {sidebarExpanded
            ? <CaretLeft size={10} weight="bold" color="white" />
            : <CaretRight size={10} weight="bold" color="white" />}
        </div>
      </div>
    </div>
  )
}

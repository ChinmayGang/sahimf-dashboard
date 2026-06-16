import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FolderIcon from '@mui/icons-material/Folder'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ExploreIcon from '@mui/icons-material/Explore'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import BubbleChartIcon from '@mui/icons-material/BubbleChart'
import StarRateIcon from '@mui/icons-material/StarRate'
import BusinessIcon from '@mui/icons-material/Business'
import CalculateIcon from '@mui/icons-material/Calculate'
import AssessmentIcon from '@mui/icons-material/Assessment'
import ArticleIcon from '@mui/icons-material/Article'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import LockIcon from '@mui/icons-material/Lock'
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

const mfChildren: NavItem[] = [
  { key: 'mf-overview', label: 'Overview', icon: <DashboardIcon sx={{ fontSize: 16 }} />, path: '/mutual-funds' },
  { key: 'mf-portfolios', label: 'My Portfolios', icon: <FolderIcon sx={{ fontSize: 16 }} />, path: '/mutual-funds/portfolios' },
  { key: 'mf-transactions', label: 'Transactions', icon: <ReceiptLongIcon sx={{ fontSize: 16 }} />, path: '/mutual-funds/transactions' },
  { key: 'mf-explore', label: 'Explore Funds', icon: <ExploreIcon sx={{ fontSize: 16 }} />, path: '/mutual-funds/explore' },
  { key: 'sahi-mine', label: 'My Sahi Funds', icon: <AutoAwesomeIcon sx={{ fontSize: 16 }} />, path: '/mutual-funds/my-sahi-funds' },
  { key: 'mf-overlap', label: 'Overlap Lens', icon: <BubbleChartIcon sx={{ fontSize: 16 }} />, path: '/mutual-funds/overlap' },
  { key: 'mf-compare', label: 'Fund Comparison', icon: <CompareArrowsIcon sx={{ fontSize: 16 }} />, path: '/mutual-funds/compare' },
  { key: 'mf-scorecard', label: 'MF Scorecard', icon: <StarRateIcon sx={{ fontSize: 16 }} />, path: '/mutual-funds/scorecard' },
  { key: 'mf-amfi', label: 'Fund Manager', icon: <BusinessIcon sx={{ fontSize: 16 }} />, path: '/mutual-funds/amfi' },
  {
    key: 'mf-tools', label: 'Tools', icon: <CalculateIcon sx={{ fontSize: 16 }} />,
    children: [
      { key: 'tool-sip', label: 'SIP', icon: <CalculateIcon sx={{ fontSize: 14 }} />, path: '/mutual-funds/tools/sip' },
      { key: 'tool-lumpsum', label: 'Lumpsum', icon: <CalculateIcon sx={{ fontSize: 14 }} />, path: '/mutual-funds/tools/lumpsum' },
      { key: 'tool-swp', label: 'SWP', icon: <CalculateIcon sx={{ fontSize: 14 }} />, path: '/mutual-funds/tools/swp' },
      { key: 'tool-stp', label: 'STP', icon: <CalculateIcon sx={{ fontSize: 14 }} />, path: '/mutual-funds/tools/stp' },
    ],
  },
  { key: 'mf-dividends', label: 'Dividends', icon: <AssessmentIcon sx={{ fontSize: 16 }} />, path: '/mutual-funds/dividends' },
  {
    key: 'mf-reports', label: 'Reports', icon: <ArticleIcon sx={{ fontSize: 16 }} />,
    children: [
      { key: 'mf-tax', label: 'Tax Report', icon: <ArticleIcon sx={{ fontSize: 14 }} />, path: '/mutual-funds/reports/tax' },
      { key: 'mf-mfpms', label: 'MFPMS Disclosures', icon: <ArticleIcon sx={{ fontSize: 14 }} />, path: '/mutual-funds/reports/mfpms' },
    ],
  },
]

const topNavItems: NavItem[] = [
  { key: 'home', label: 'Home', icon: <HomeIcon sx={{ fontSize: 17 }} />, path: '/' },
  { key: 'investments', label: 'Investments', icon: <AccountBalanceWalletIcon sx={{ fontSize: 17 }} />, path: '/investments' },
]

const productItems: NavItem[] = [
  { key: 'mutual-funds', label: 'Mutual Funds', icon: <DashboardIcon sx={{ fontSize: 17 }} />, children: mfChildren },
  { key: 'numera', label: 'Numera', icon: <AssessmentIcon sx={{ fontSize: 17 }} />, comingSoon: true },
  { key: 'thematic', label: 'Thematic Baskets', icon: <BubbleChartIcon sx={{ fontSize: 17 }} />, comingSoon: true },
  { key: 'arqed', label: 'ArqEd Learning', icon: <ExploreIcon sx={{ fontSize: 17 }} />, comingSoon: true },
  { key: 'fo', label: 'F&O', icon: <CompareArrowsIcon sx={{ fontSize: 17 }} />, comingSoon: true },
  { key: 'credit', label: 'Credit', icon: <AccountBalanceWalletIcon sx={{ fontSize: 17 }} />, comingSoon: true },
]

function NavItemRow({
  item,
  depth = 0,
  expanded,
  onToggle,
}: {
  item: NavItem
  depth?: number
  expanded: boolean
  onToggle: (key: string) => void
}) {
  const location = useLocation()
  const [submenuOpen, setSubmenuOpen] = useState(item.key === 'mutual-funds')
  const isActive = item.path ? location.pathname === item.path : false
  const hasChildren = item.children && item.children.length > 0

  const iconEl = item.comingSoon
    ? <LockIcon sx={{ fontSize: depth > 0 ? 13 : 15, color: '#3A3A3A' }} />
    : item.icon

  /* ── Collapsed: icon-only ── */
  if (!expanded) {
    const iconBtn = (
      <div
        onClick={() => hasChildren && setSubmenuOpen((p) => !p)}
        className={`flex items-center justify-center w-8 h-8 rounded-xl cursor-pointer transition-all
          ${isActive
            ? 'bg-[#C5F135]/15 text-[#C5F135]'
            : item.comingSoon
            ? 'text-[#3A3A3A] cursor-not-allowed'
            : 'text-[#555] hover:text-white hover:bg-[#1E1E1E]'
          }`}
      >
        {iconEl}
      </div>
    )

    if (item.comingSoon) return iconBtn

    return (
      <Tooltip.Provider delayDuration={80}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            {item.path ? <Link to={item.path}>{iconBtn}</Link> : iconBtn}
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="right"
              sideOffset={10}
              className="z-50 rounded-xl overflow-hidden"
            >
              {hasChildren ? (
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-2 min-w-[200px] max-h-[70vh] overflow-y-auto">
                  <p className="text-[10px] font-bold text-[#606060] uppercase tracking-wider px-2 py-1">{item.label}</p>
                  {item.children?.map((child) =>
                    child.children ? (
                      <div key={child.key} className="mt-1 pt-1 border-t border-[#2A2A2A]">
                        <p className="flex items-center gap-1.5 text-[10px] font-semibold text-[#606060] uppercase tracking-wider px-2 pt-1 pb-0.5">
                          <span className="opacity-60">{child.icon}</span>{child.label}
                        </p>
                        {child.children.map((gc) => (
                          <Link key={gc.key} to={gc.path ?? '#'}>
                            <div className="flex items-center gap-2 pl-5 pr-2 py-1.5 rounded-lg hover:bg-[#2A2A2A] transition-colors">
                              <span className="text-[#606060]">{gc.icon}</span>
                              <span className="text-xs text-white">{gc.label}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link key={child.key} to={child.path ?? '#'}>
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#2A2A2A] transition-colors">
                          <span className="text-[#606060]">{child.icon}</span>
                          <span className="text-xs text-white">{child.label}</span>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              ) : (
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] text-white text-xs px-2.5 py-1.5 rounded-lg">
                  {item.label}
                </div>
              )}
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    )
  }

  /* ── Expanded: full row ── */
  const content = (
    <div>
      <div
        onClick={() => hasChildren && setSubmenuOpen((p) => !p)}
        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-pointer transition-all select-none
          ${depth > 0 ? 'ml-2 text-[12px]' : 'text-[13px]'}
          ${isActive
            ? 'bg-[#C5F135]/10 text-[#C5F135]'
            : item.comingSoon
            ? 'text-[#3A3A3A] cursor-not-allowed'
            : 'text-[#888] hover:text-white hover:bg-[#1E1E1E]'
          }`}
      >
        <span className={`flex-shrink-0 ${isActive ? 'text-[#C5F135]' : ''}`}>{iconEl}</span>
        <span className="flex-1 truncate font-medium">{item.label}</span>
        {item.badge && (
          <span className="bg-[#7B2FBE] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
        )}
        {item.comingSoon && (
          <span className="text-[10px] text-[#3A3A3A] font-medium">Soon</span>
        )}
        {hasChildren && !item.comingSoon && (
          <span className="text-[#555]">
            {submenuOpen ? <ExpandMoreIcon sx={{ fontSize: 13 }} /> : <ChevronRightIcon sx={{ fontSize: 13 }} />}
          </span>
        )}
      </div>

      {hasChildren && submenuOpen && !item.comingSoon && (
        <div className="mt-0.5 space-y-0.5 border-l border-[#272727] ml-4">
          {item.children!.map((child) => (
            <NavItemRow key={child.key} item={child} depth={depth + 1} expanded={expanded} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  )

  return item.path ? <Link to={item.path}>{content}</Link> : content
}

export function Sidebar() {
  const { sidebarExpanded, toggleSidebar, toggleSubmenu } = useUIStore()
  const user = useAuthStore((s) => s.user)

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'ER'

  return (
    /* 4px floating gap on all sides via m-1 */
    <aside
      className={`flex flex-col m-1 rounded-2xl bg-[#111111] transition-all duration-200 flex-shrink-0 overflow-hidden ${
        sidebarExpanded ? 'w-52' : 'w-[52px]'
      }`}
      style={{ height: 'calc(100vh - 8px)' }}
    >
      {/* ── TOP: Profile card ── */}
      <div className="flex-shrink-0 p-2 pt-2.5">
        {sidebarExpanded ? (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-[#1A1A1A]">
            <div className="w-7 h-7 rounded-full bg-[#7B2FBE] flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate leading-tight">{user?.name ?? 'Emily Rose'}</p>
              <p className="text-[10px] text-[#555] truncate">Sahi PRO</p>
            </div>
            {/* collapse toggle */}
            <button onClick={toggleSidebar} className="text-[#555] hover:text-white transition-colors flex-shrink-0">
              <ChevronLeftIcon sx={{ fontSize: 15 }} />
            </button>
          </div>
        ) : (
          <button
            onClick={toggleSidebar}
            className="w-9 h-9 rounded-full bg-[#7B2FBE] flex items-center justify-center text-[11px] font-bold text-white mx-auto"
            title="Expand sidebar"
          >
            {initials}
          </button>
        )}
      </div>

      {/* ── MIDDLE: Nav ── */}
      {sidebarExpanded ? (
        /* Expanded — list from top, scrollable */
        <div className="flex-1 overflow-y-auto py-1 px-2 space-y-0.5 scrollbar-hide">
          {topNavItems.map((item) => (
            <NavItemRow key={item.key} item={item} expanded={true} onToggle={toggleSubmenu} />
          ))}
          <div className="my-1.5 border-t border-[#1E1E1E]" />
          {productItems.map((item) => (
            <NavItemRow key={item.key} item={item} expanded={true} onToggle={toggleSubmenu} />
          ))}
        </div>
      ) : (
        /* Collapsed — icons centered vertically */
        <div className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2">
          {topNavItems.map((item) => (
            <NavItemRow key={item.key} item={item} expanded={false} onToggle={toggleSubmenu} />
          ))}
          <div className="w-5 border-t border-[#1E1E1E] my-1.5" />
          {productItems.map((item) => (
            <NavItemRow key={item.key} item={item} expanded={false} onToggle={toggleSubmenu} />
          ))}
        </div>
      )}

      {/* ── BOTTOM: Logo mark ── */}
      <div className="flex-shrink-0 p-2 pb-2.5">
        {sidebarExpanded ? (
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-6 h-6 rounded-lg bg-[#C5F135] flex items-center justify-center flex-shrink-0">
              <span className="text-black text-[11px] font-black leading-none">✳</span>
            </div>
            <span className="text-xs font-bold text-white">SahiMF</span>
            <span className="ml-auto text-[10px] text-[#444] font-medium">v1.0</span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-[#C5F135] flex items-center justify-center mx-auto">
            <span className="text-black text-sm font-black leading-none">✳</span>
          </div>
        )}
      </div>
    </aside>
  )
}

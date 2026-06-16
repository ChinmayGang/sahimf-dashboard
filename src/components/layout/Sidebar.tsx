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
import MenuIcon from '@mui/icons-material/Menu'
import LockIcon from '@mui/icons-material/Lock'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useUIStore } from '../../stores/uiStore'

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
  { key: 'home', label: 'Home', icon: <HomeIcon sx={{ fontSize: 18 }} />, path: '/', badge: 2 },
  { key: 'investments', label: 'Investments', icon: <AccountBalanceWalletIcon sx={{ fontSize: 18 }} />, path: '/investments' },
]

const productItems: NavItem[] = [
  { key: 'mutual-funds', label: 'Mutual Funds', icon: <DashboardIcon sx={{ fontSize: 18 }} />, children: mfChildren },
  { key: 'numera', label: 'Numera', icon: <AssessmentIcon sx={{ fontSize: 18 }} />, comingSoon: true },
  { key: 'thematic', label: 'Thematic Baskets', icon: <BubbleChartIcon sx={{ fontSize: 18 }} />, comingSoon: true },
  { key: 'arqed', label: 'ArqEd Learning', icon: <ExploreIcon sx={{ fontSize: 18 }} />, comingSoon: true },
  { key: 'fo', label: 'F&O', icon: <CompareArrowsIcon sx={{ fontSize: 18 }} />, comingSoon: true },
  { key: 'credit', label: 'Credit', icon: <AccountBalanceWalletIcon sx={{ fontSize: 18 }} />, comingSoon: true },
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

  const handleClick = () => {
    if (hasChildren) setSubmenuOpen((p) => !p)
  }

  const content = (
    <div>
      <div
        onClick={handleClick}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all select-none
          ${depth > 0 ? 'ml-3 text-[13px]' : 'text-sm'}
          ${
            isActive
              ? 'bg-[#C5F135]/10 text-[#C5F135]'
              : item.comingSoon
              ? 'text-[#444444] cursor-not-allowed'
              : 'text-[#A0A0A0] hover:text-white hover:bg-[#1E1E1E]'
          }
        `}
      >
        <span className={`flex-shrink-0 ${isActive ? 'text-[#C5F135]' : ''}`}>
          {item.comingSoon ? <LockIcon sx={{ fontSize: depth > 0 ? 13 : 16, color: '#444444' }} /> : item.icon}
        </span>
        {expanded && (
          <>
            <span className="flex-1 truncate font-medium">{item.label}</span>
            {item.badge && (
              <span className="bg-[#7B2FBE] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
            {item.comingSoon && (
              <span className="text-[10px] text-[#444444] font-medium">Soon</span>
            )}
            {hasChildren && !item.comingSoon && (
              <span className="text-[#606060]">
                {submenuOpen ? (
                  <ExpandMoreIcon sx={{ fontSize: 14 }} />
                ) : (
                  <ChevronRightIcon sx={{ fontSize: 14 }} />
                )}
              </span>
            )}
          </>
        )}
      </div>

      {hasChildren && expanded && submenuOpen && !item.comingSoon && (
        <div className="mt-0.5 space-y-0.5 border-l border-[#2A2A2A] ml-5">
          {item.children!.map((child) => (
            <NavItemRow
              key={child.key}
              item={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )

  if (!expanded && !hasChildren && item.path) {
    return (
      <Tooltip.Provider delayDuration={100}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Link to={item.path}>
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-lg mx-auto cursor-pointer transition-all
                  ${isActive ? 'bg-[#C5F135]/10 text-[#C5F135]' : 'text-[#606060] hover:text-white hover:bg-[#1E1E1E]'}
                `}
              >
                {item.icon}
              </div>
            </Link>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="right"
              className="bg-[#1A1A1A] border border-[#2A2A2A] text-white text-xs px-2.5 py-1.5 rounded-lg z-50"
            >
              {item.label}
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    )
  }

  if (!expanded && hasChildren) {
    return (
      <Tooltip.Provider delayDuration={100}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-lg mx-auto cursor-pointer transition-all
                ${isActive ? 'bg-[#C5F135]/10 text-[#C5F135]' : 'text-[#606060] hover:text-white hover:bg-[#1E1E1E]'}
              `}
            >
              {item.icon}
            </div>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="right"
              sideOffset={8}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-2 z-50 min-w-[200px] max-h-[80vh] overflow-y-auto"
            >
              <p className="text-xs font-semibold text-[#A0A0A0] px-2 py-1 mb-1">{item.label}</p>
              {item.children?.map((child) =>
                child.children ? (
                  /* nested group — e.g. Sahi MF Funds, Tools, Reports */
                  <div key={child.key} className="mt-1 pt-1 border-t border-[#2A2A2A]">
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold text-[#606060] uppercase tracking-wider px-2 pt-1 pb-0.5">
                      <span className="opacity-60">{child.icon}</span>
                      {child.label}
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
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    )
  }

  if (item.path) {
    return <Link to={item.path}>{content}</Link>
  }

  return content
}

export function Sidebar() {
  const { sidebarExpanded, toggleSidebar, toggleSubmenu } = useUIStore()

  return (
    <aside
      className={`flex flex-col h-screen bg-[#111111] border-r border-[#1E1E1E] transition-all duration-200 flex-shrink-0 ${
        sidebarExpanded ? 'w-56' : 'w-14'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-4 border-b border-[#1E1E1E]">
        {sidebarExpanded ? (
          <>
            <div className="w-7 h-7 rounded-lg bg-[#C5F135] flex items-center justify-center flex-shrink-0">
              <span className="text-black text-xs font-black">✳</span>
            </div>
            <span className="text-sm font-bold text-white flex-1">SahiMF</span>
            <button
              onClick={toggleSidebar}
              className="text-[#606060] hover:text-white transition-colors"
            >
              <MenuIcon sx={{ fontSize: 18 }} />
            </button>
          </>
        ) : (
          <button
            onClick={toggleSidebar}
            className="w-9 h-9 rounded-lg bg-[#C5F135] flex items-center justify-center mx-auto"
          >
            <span className="text-black text-xs font-black">✳</span>
          </button>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-hide">
        {/* Top items */}
        {topNavItems.map((item) => (
          <NavItemRow
            key={item.key}
            item={item}
            expanded={sidebarExpanded}
            onToggle={toggleSubmenu}
          />
        ))}

        <div className="my-2 border-t border-[#1E1E1E]" />

        {/* Products */}
        {productItems.map((item) => (
          <NavItemRow
            key={item.key}
            item={item}
            expanded={sidebarExpanded}
            onToggle={toggleSubmenu}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#1E1E1E]">
        {sidebarExpanded ? (
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-[#1A1A1A]">
            <div className="w-7 h-7 rounded-full bg-[#7B2FBE] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              ER
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">Emily Rose</p>
              <p className="text-[10px] text-[#A0A0A0] truncate">+91 9876543210</p>
            </div>
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-[#7B2FBE] flex items-center justify-center text-xs font-bold text-white mx-auto">
            ER
          </div>
        )}
      </div>
    </aside>
  )
}

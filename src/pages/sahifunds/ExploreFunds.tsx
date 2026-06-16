import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import NewReleasesIcon from '@mui/icons-material/NewReleases'
import StarIcon from '@mui/icons-material/Star'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import ShieldIcon from '@mui/icons-material/Shield'
import SavingsIcon from '@mui/icons-material/Savings'
import BarChartIcon from '@mui/icons-material/BarChart'
import LockIcon from '@mui/icons-material/Lock'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useUIStore } from '../../stores/uiStore'
import { mockFunds } from '../../data/funds'
import { mockSahiFunds } from '../../data/sahiFunds'
import { VolatilityBadge } from '../../components/ui/VolatilityBadge'
import heroImg from '../../assets/explore-funds-header.png'

const TAGS = ['Low Risk', 'ELSS', 'Free Access', 'New SahiMF', 'View All']

const SECTIONS = [
  { id: 'sahi', label: 'Sahi MF Funds', badge: 'Recommended', icon: <AutoAwesomeIcon sx={{ fontSize: 16 }} />, isSahi: true },
  { id: 'trending', label: 'Trending Now', icon: <LocalFireDepartmentIcon sx={{ fontSize: 16 }} /> },
  { id: 'new', label: 'New Launches', icon: <NewReleasesIcon sx={{ fontSize: 16 }} /> },
  { id: 'popular', label: 'Most Popular', icon: <StarIcon sx={{ fontSize: 16 }} /> },
  { id: 'top-amc', label: 'Top Funds by AMC', icon: <AccountBalanceIcon sx={{ fontSize: 16 }} /> },
  { id: 'high-risk', label: 'High Reward · High Risk', icon: <RocketLaunchIcon sx={{ fontSize: 16 }} /> },
  { id: 'low-risk', label: 'Stable Returns', icon: <ShieldIcon sx={{ fontSize: 16 }} /> },
  { id: 'elss', label: 'ELSS Tax Savers', icon: <SavingsIcon sx={{ fontSize: 16 }} /> },
  { id: 'index', label: 'Index Funds', icon: <BarChartIcon sx={{ fontSize: 16 }} /> },
]

// Origami icon filenames (50 available in /icons/schemes/)
const ORIGAMI_ICONS = [
  'bat-origami-4895697.svg', 'bee-origami-4895698.svg', 'brontosaurus-origami-4895699.svg',
  'butterfly-origami-4895700.svg', 'cactus-origami-4895701.svg', 'cat-origami-4895702.svg',
  'chick-origami-4895653.svg', 'cicada-origami-4895654.svg', 'diamond-origami-4895655.svg',
  'dinosaur-origami-4895656.svg', 'dog-origami-4895657.svg', 'dove-origami-4895658.svg',
  'dragon-origami-4895659.svg', 'elephant-origami-4895660.svg', 'flower-origami-4895661.svg',
  'fox-origami-4895662.svg', 'ghost-origami-4895663.svg', 'giraffe-origami-4895664.svg',
  'hat-origami-4895665.svg', 'heart-origami-4895666.svg', 'horse-origami-4895667.svg',
  'house-origami-4895668.svg', 'ice-cream-cone-origami-4895669.svg', 'insect-origami-4895670.svg',
  'kangaroo-origami-4895672.svg', 'kite-origami-4895673.svg', 'mouse-origami-4895674.svg',
  'owl-origami-4895676.svg', 'panda-origami-4895677.svg', 'paper-plane-origami-4895678.svg',
  'pegasus-origami-4895679.svg', 'penguin-origami-4895680.svg', 'pig-origami-4895681.svg',
  'rabbit-origami-4895682.svg', 'rooster-origami-4895684.svg', 'ship-origami-4895686.svg',
  'squirrel-origami-4895688.svg', 'star-origami-4895689.svg', 'sun-origami-4895691.svg',
  'tulip-origami-4895693.svg', 'unicorn-origami-4895694.svg', 'whale-origami-4895695.svg',
  'windmill-origami-4895696.svg',
]

// Soft color palette for icon backgrounds (light mode)
const ICON_PALETTES = [
  { bg: '#EDE9FE', tint: 'rgba(124,58,237,0.08)' },  // purple
  { bg: '#FEF3C7', tint: 'rgba(217,119,6,0.08)' },   // amber
  { bg: '#DCFCE7', tint: 'rgba(22,163,74,0.08)' },   // green
  { bg: '#DBEAFE', tint: 'rgba(37,99,235,0.08)' },   // blue
  { bg: '#FCE7F3', tint: 'rgba(190,24,93,0.08)' },   // pink
  { bg: '#FEE2E2', tint: 'rgba(220,38,38,0.08)' },   // red
  { bg: '#ECFDF5', tint: 'rgba(5,150,105,0.08)' },   // emerald
  { bg: '#FFF7ED', tint: 'rgba(234,88,12,0.08)' },   // orange
  { bg: '#F0F9FF', tint: 'rgba(14,165,233,0.08)' },  // sky
  { bg: '#F5F3FF', tint: 'rgba(139,92,246,0.08)' },  // violet
]

function getIconForFund(index: number) {
  return ORIGAMI_ICONS[index % ORIGAMI_ICONS.length]
}

function getPaletteForFund(index: number) {
  return ICON_PALETTES[index % ICON_PALETTES.length]
}

function getFunds(sectionId: string) {
  switch (sectionId) {
    case 'trending': return mockFunds.filter((f) => (f.returns['1Y'] ?? 0) > 18).slice(0, 6)
    case 'new': return mockFunds.filter((f) => new Date(f.launchedOn ?? '') > new Date('2015-01-01')).slice(0, 6)
    case 'popular': return [...mockFunds].sort((a, b) => b.fundSize - a.fundSize).slice(0, 6)
    case 'top-amc': return mockFunds.filter((f) => ['Mirae Asset', 'PPFAS Mutual Fund'].includes(f.amcName)).slice(0, 6)
    case 'high-risk': return mockFunds.filter((f) => f.volatility === 'High').slice(0, 6)
    case 'low-risk': return mockFunds.filter((f) => f.volatility === 'Low').slice(0, 6)
    case 'elss': return mockFunds.filter((f) => f.subCategory === 'ELSS').slice(0, 6)
    case 'index': return mockFunds.filter((f) => f.category === 'Index / ETF' || f.subCategory?.toLowerCase().includes('nifty')).slice(0, 6)
    default: return mockFunds.slice(0, 6)
  }
}

function formatINR(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}K Cr`
  return `₹${n.toLocaleString('en-IN')} Cr`
}

export function ExploreFunds() {
  const lightMode = useUIStore((s) => s.lightMode)
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('sahi')
  const [activeTag, setActiveTag] = useState('View All')
  const [search, setSearch] = useState('')

  const lm = lightMode
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#A0A0A0]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#606060]'
  const sidebarBg = lm ? '#FDFCFF' : '#0D0D0D'
  const sidebarBorder = lm ? '#E8E8F0' : '#1E1E1E'
  const divider = lm ? '#E8E8F0' : '#2A2A2A'

  const sidebarItem = (active: boolean) => lm
    ? active
      ? 'bg-[#F3F0FF] border border-[#7B2FBE]/20 text-[#7B2FBE]'
      : 'text-[#6B7280] hover:bg-[#F8F7FF] hover:text-[#111827]'
    : active
      ? 'bg-[#C5F135]/10 text-[#C5F135] border border-[#C5F135]/20'
      : 'text-[#A0A0A0] hover:bg-[#1E1E1E] hover:text-white'

  const activeSectionData = SECTIONS.find((s) => s.id === activeSection)!
  const displayFunds = getFunds(activeSection)

  const handleViewAll = () => navigate('/mutual-funds/explore/all')

  // Card base: transparent border (1px placeholder) to avoid layout shift on hover
  const cardBase = lm
    ? 'bg-white border border-transparent rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:border-[#7B2FBE] hover:-translate-y-1 hover:shadow-xl group'
    : 'bg-[#1A1A1A] border border-transparent rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:border-[#C5F135] hover:-translate-y-1 hover:shadow-xl group'

  return (
    <div className="flex flex-col h-full">
      {/* ── Hero Banner — spaced, rounded, hero image centered ── */}
      <div className="px-4 pt-4 pb-0 flex-shrink-0">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            backgroundImage: `url(${heroImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            minHeight: 190,
          }}
        >
          {/* Purple gradient overlay — heavier on left so text readable */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(100deg, rgba(76,29,149,0.97) 0%, rgba(109,40,217,0.90) 40%, rgba(139,92,246,0.55) 70%, rgba(139,92,246,0.15) 100%)' }}
          />

          <div className="relative px-7 pt-6 pb-5">
            <h1 className="text-2xl font-black text-white mb-1 tracking-tight">Explore Mutual Funds</h1>
            <p className="text-sm text-white/65 mb-4 max-w-md leading-relaxed">
              Curated fund portfolios built by the SahiMF research desk. Research-driven, rules-based, and transparently constructed.
            </p>

            {/* Search bar */}
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 max-w-lg" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}>
              <SearchIcon sx={{ fontSize: 17, color: 'rgba(255,255,255,0.6)' }} />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  if (e.target.value) navigate('/mutual-funds/explore/all')
                }}
                placeholder="Search for sahi mutual funds, or collections..."
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/45 min-w-0"
              />
              <button className="bg-white text-[#6D28D9] text-xs font-bold px-4 py-1.5 rounded-lg flex-shrink-0 hover:bg-white/90 transition-colors">
                Search
              </button>
            </div>

            {/* Quick tags */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setActiveTag(tag)
                    if (tag === 'View All') handleViewAll()
                    else if (tag === 'Low Risk') setActiveSection('low-risk')
                    else if (tag === 'ELSS') setActiveSection('elss')
                    else if (tag === 'New SahiMF') setActiveSection('new')
                    else if (tag === 'Free Access') setActiveSection('sahi')
                  }}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                    activeTag === tag
                      ? 'bg-[#C5F135] text-black border-[#C5F135] font-bold'
                      : 'text-white border-white/25 hover:border-white/50'
                  }`}
                  style={activeTag !== tag ? { background: 'rgba(255,255,255,0.1)' } : {}}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left accordion sidebar */}
        <aside
          className="w-60 flex-shrink-0 overflow-y-auto p-3 space-y-0.5"
          style={{ borderRight: `1px solid ${sidebarBorder}`, background: sidebarBg }}
        >
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all text-sm font-medium ${sidebarItem(activeSection === sec.id)}`}
            >
              <span className="flex-shrink-0">{sec.icon}</span>
              <span className="flex-1 truncate">{sec.label}</span>
              {sec.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: '#C5F135', color: '#000' }}>
                  {sec.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-3 mt-2" style={{ borderTop: `1px solid ${sidebarBorder}` }}>
            <button
              onClick={handleViewAll}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ color: lm ? '#7B2FBE' : '#C5F135' }}
            >
              <ArrowForwardIcon sx={{ fontSize: 15 }} />
              View All Schemes
            </button>
          </div>
        </aside>

        {/* Right: fund cards */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Section header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={lm ? 'text-[#7B2FBE]' : 'text-[#C5F135]'}>{activeSectionData.icon}</span>
              <h2 className={`text-sm font-bold ${text}`}>{activeSectionData.label}</h2>
              {activeSectionData.badge && (
                <span className="text-[10px] font-bold bg-[#C5F135] text-black px-2 py-0.5 rounded-full">
                  {activeSectionData.badge}
                </span>
              )}
            </div>
            <button
              onClick={handleViewAll}
              className={`text-xs font-semibold flex items-center gap-1 transition-colors ${lm ? 'text-[#7B2FBE] hover:text-[#6D28D9]' : 'text-[#C5F135] hover:text-[#A8D020]'}`}
            >
              View All <ArrowForwardIcon sx={{ fontSize: 13 }} />
            </button>
          </div>

          {/* Sahi Funds section */}
          {activeSection === 'sahi' && (
            <div className="grid grid-cols-2 gap-3">
              {mockSahiFunds.map((fund, idx) => {
                const palette = getPaletteForFund(idx)
                const iconFile = getIconForFund(idx)
                return (
                  <div
                    key={fund.id}
                    onClick={() => navigate(`/mutual-funds/sahi-funds/${fund.id}`)}
                    className={cardBase}
                    style={{ boxShadow: 'none' }}
                  >
                    {/* Featured ribbon */}
                    <div className="absolute top-3 right-3 flex gap-1">
                      <span className="text-[10px] font-bold bg-[#C5F135] text-black px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                      {fund.accessTier !== 'free' && (
                        <span className="text-[10px] font-bold bg-[#7B2FBE] text-white px-2 py-0.5 rounded-full">PRO</span>
                      )}
                    </div>

                    {/* Icon block with origami icon + colored bg */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 flex-shrink-0 relative overflow-hidden"
                      style={{ background: lm ? palette.bg : 'rgba(197,241,53,0.07)' }}
                    >
                      {/* Low-opacity tint overlay */}
                      <div className="absolute inset-0" style={{ background: lm ? palette.tint : 'transparent' }} />
                      <img
                        src={`/icons/schemes/${iconFile}`}
                        alt=""
                        className="w-6 h-6 relative z-10"
                        style={{ filter: lm ? 'none' : 'brightness(0) invert(1) opacity(0.6)' }}
                      />
                    </div>

                    <h3 className={`text-sm font-bold mb-1 pr-16 transition-colors ${lm ? 'text-[#111827] group-hover:text-[#7B2FBE]' : 'text-white group-hover:text-[#C5F135]'}`}>
                      {fund.name}
                    </h3>
                    <p className={`text-xs ${textSub} leading-relaxed mb-3 flex-1`}>{fund.description}</p>

                    <div className="flex gap-1 mb-3 flex-wrap">
                      {fund.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: lm ? '#F3F0FF' : '#2A2A2A', color: lm ? '#7B2FBE' : '#A0A0A0' }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <div
                      className="grid grid-cols-3 gap-2 pt-3 text-center"
                      style={{ borderTop: `1px solid ${divider}` }}
                    >
                      <div>
                        <p className={`text-[10px] ${textMuted}`}>Min</p>
                        <p className={`text-xs font-bold ${text}`}>₹{fund.minAmount.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className={`text-[10px] ${textMuted}`}>Rebalance</p>
                        <p className={`text-xs font-bold ${text}`}>{fund.rebalanceFrequency}</p>
                      </div>
                      <div>
                        <p className={`text-[10px] ${textMuted}`}>1Y Returns</p>
                        {fund.accessTier === 'free' ? (
                          <p className="text-xs font-bold text-[#16A34A]">+{fund.returns['1Y']}%</p>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <LockIcon sx={{ fontSize: 10, color: '#7B2FBE' }} />
                            <span className={`text-xs font-bold ${lm ? 'text-[#7B2FBE]' : 'text-[#C5F135]'}`}>PRO</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Upgrade teaser card */}
              <div
                className="rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg, #7B2FBE18, #C5F13518)', border: lm ? '1px dashed #7B2FBE35' : '1px dashed #C5F13535' }}
                onClick={() => navigate('/mutual-funds/explore/all')}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                  style={{ background: lm ? '#F3F0FF' : 'rgba(197,241,53,0.1)' }}>
                  <LockIcon sx={{ fontSize: 18, color: lm ? '#7B2FBE' : '#C5F135' }} />
                </div>
                <p className={`text-sm font-bold ${text} mb-1`}>Unlock All Sahi Funds</p>
                <p className={`text-xs ${textSub} mb-3`}>4 more curated baskets available with Sahi PRO</p>
                <button
                  className="text-xs font-bold px-4 py-2 rounded-xl"
                  style={{ background: lm ? '#7B2FBE' : '#C5F135', color: lm ? '#fff' : '#000' }}
                >
                  Upgrade to PRO
                </button>
              </div>
            </div>
          )}

          {/* Open Funds sections */}
          {activeSection !== 'sahi' && (
            <>
              {displayFunds.length === 0 ? (
                <div className={`flex items-center justify-center h-40 text-sm ${textMuted}`}>
                  No funds in this category yet
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {displayFunds.map((fund, idx) => {
                    const palette = getPaletteForFund(idx + 10)
                    const iconFile = getIconForFund(idx + 10)
                    return (
                      <div
                        key={fund.id}
                        onClick={() => navigate(`/mutual-funds/search/${fund.id}`)}
                        className={cardBase}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          {/* Origami icon block */}
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                            style={{ background: lm ? palette.bg : '#2A2A2A' }}
                          >
                            <div className="absolute inset-0" style={{ background: lm ? palette.tint : 'transparent' }} />
                            <img
                              src={`/icons/schemes/${iconFile}`}
                              alt=""
                              className="w-5 h-5 relative z-10"
                              style={{ filter: lm ? 'none' : 'brightness(0) invert(1) opacity(0.5)' }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-bold truncate transition-colors ${lm ? 'text-[#111827] group-hover:text-[#7B2FBE]' : 'text-white group-hover:text-[#C5F135]'}`}>
                              {fund.name}
                            </p>
                            <p className={`text-[10px] ${textMuted} mt-0.5`}>{fund.subCategory} · Direct Growth</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <VolatilityBadge level={fund.volatility} size="sm" />
                          <span className={`text-[10px] ${textMuted}`}>ER: {fund.expenseRatio}%</span>
                        </div>

                        <div
                          className="grid grid-cols-3 gap-2 pt-2 text-center"
                          style={{ borderTop: `1px solid ${divider}` }}
                        >
                          <div>
                            <p className={`text-[10px] ${textMuted}`}>NAV</p>
                            <p className={`text-xs font-bold ${text}`}>₹{fund.nav.toFixed(0)}</p>
                          </div>
                          <div>
                            <p className={`text-[10px] ${textMuted}`}>1Y Return</p>
                            <p className="text-xs font-bold text-[#16A34A]">+{fund.returns['1Y']}%</p>
                          </div>
                          <div>
                            <p className={`text-[10px] ${textMuted}`}>AUM</p>
                            <p className={`text-xs font-bold ${text}`}>{formatINR(fund.fundSize)}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="mt-4 text-center">
                <button
                  onClick={handleViewAll}
                  className="text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
                  style={{ background: lm ? '#7B2FBE' : '#C5F135', color: lm ? '#fff' : '#000' }}
                >
                  View All {activeSectionData.label} →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

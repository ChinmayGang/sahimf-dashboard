import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react'
import { Sparkle as AutoAwesomeIcon } from '@phosphor-icons/react'
import { Flame as LocalFireDepartmentIcon } from '@phosphor-icons/react'
import { SealCheck as NewReleasesIcon } from '@phosphor-icons/react'
import { Star as StarIcon } from '@phosphor-icons/react'
import { Bank as AccountBalanceIcon } from '@phosphor-icons/react'
import { Rocket as RocketLaunchIcon } from '@phosphor-icons/react'
import { Shield as ShieldIcon } from '@phosphor-icons/react'
import { PiggyBank as SavingsIcon } from '@phosphor-icons/react'
import { ChartBar as BarChartIcon } from '@phosphor-icons/react'
import { Lock as LockIcon } from '@phosphor-icons/react'
import { ArrowRight as ArrowForwardIcon } from '@phosphor-icons/react'
import { ProButton } from '../../components/ui/ProButton'
import { useUIStore } from '../../stores/uiStore'
import { useAuthStore } from '../../stores/authStore'
import { mockPortfolios } from '../../data/portfolios'
import { mockFunds } from '../../data/funds'
import { mockSahiFunds } from '../../data/sahiFunds'
import { VolatilityBadge } from '../../components/ui/VolatilityBadge'
import heroImg from '../../assets/explore-funds-header.jpg'

const TAGS = ['Low Risk', 'ELSS', 'Free Access', 'New SahiMF', 'View All']

const SECTIONS = [
  { id: 'sahi', label: 'Sahi Picks', badge: 'Recommended', icon: <AutoAwesomeIcon size={16} weight="fill" />, isSahi: true },
  { id: 'trending', label: 'Trending Now', icon: <LocalFireDepartmentIcon size={16} weight="fill" /> },
  { id: 'new', label: 'New Launches', icon: <NewReleasesIcon size={16} weight="fill" /> },
  { id: 'popular', label: 'Most Popular', icon: <StarIcon size={16} weight="fill" /> },
  { id: 'top-amc', label: 'Top Funds by AMC', icon: <AccountBalanceIcon size={16} weight="fill" /> },
  { id: 'high-risk', label: 'High Reward · High Risk', icon: <RocketLaunchIcon size={16} weight="fill" /> },
  { id: 'low-risk', label: 'Stable Returns', icon: <ShieldIcon size={16} weight="fill" /> },
  { id: 'elss', label: 'ELSS Tax Savers', icon: <SavingsIcon size={16} weight="fill" /> },
  { id: 'index', label: 'Index Funds', icon: <BarChartIcon size={16} weight="fill" /> },
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
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#6B7280]' : 'text-[#606060]'
  const sidebarBg = lm ? '#FDFCFF' : '#0a0c0e'
  const sidebarBorder = lm ? '#E0E3E8' : '#1e2838'
  const divider = lm ? '#E0E3E8' : '#3c4653'

  const sidebarItem = (active: boolean) => lm
    ? active
      ? 'bg-[#eeedfd] border border-[#4f46e5]/20 text-[#4f46e5]'
      : 'border border-transparent text-[#6B7280] hover:bg-[#f0efff] hover:text-[#111827]'
    : active
      ? 'bg-[#d6fd70]/10 text-[#d6fd70] border border-[#d6fd70]/20'
      : 'border border-transparent text-[#8390a2] hover:bg-[#1e2838] hover:text-white'

  const { user } = useAuthStore()
  const activeSectionData = SECTIONS.find((s) => s.id === activeSection)!
  const displayFunds = getFunds(activeSection)

  // Portfolio gap analysis — look at Rohit's (userId=1) holdings
  const userPortfolios = mockPortfolios.filter(p => p.userId === (user?.id ?? '1'))
  const ownedCategories = new Set(userPortfolios.flatMap(p => p.holdings.map(h => h.category)))
  const ALL_CATEGORIES = ['Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'ELSS', 'Gilt', 'Balanced Advantage', 'Sectoral']
  const gapCategories = ALL_CATEGORIES.filter(c => !ownedCategories.has(c)).slice(0, 3)
  const bestForPortfolio = gapCategories.map(cat => {
    const fund = mockFunds.find(f => f.subCategory === cat || f.category === cat)
    return fund ? { category: cat, fund } : null
  }).filter(Boolean) as { category: string; fund: typeof mockFunds[0] }[]

  const handleViewAll = () => navigate('/mutual-funds/explore/all')

  // Card base: transparent border (1px placeholder) to avoid layout shift on hover
  const cardBase = lm
    ? 'relative bg-white border border-[#E0E3E8] rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:border-[#4f46e5] hover:-translate-y-1 group'
    : 'relative bg-[#14171c] border border-transparent rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:border-[#d6fd70] hover:-translate-y-1 group'

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
            minHeight: 'clamp(140px, 20vw, 190px)',
          }}
        >
          <div className="relative px-7 pt-6 pb-5">
            <h1 className="text-2xl font-black mb-1 tracking-tight" style={{ color: '#ffffff' }}>Explore Mutual Funds</h1>
            <p className="text-sm mb-4 max-w-md leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Curated fund portfolios built by the SahiMF research desk. Research-driven, rules-based, and transparently constructed.
            </p>

            {/* Search bar */}
            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 max-w-lg shadow-sm">
              <SearchIcon size={17} color="#8390a2" weight="fill" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  if (e.target.value) navigate('/mutual-funds/explore/all')
                }}
                placeholder="Search for sahi mutual funds, or collections..."
                className="flex-1 bg-transparent outline-none text-sm text-[#111827] placeholder-[#8390a2] min-w-0"
              />
              <button className="bg-[#4f46e5] text-white text-xs font-bold px-4 py-1.5 rounded-lg flex-shrink-0 hover:bg-[#6366f1] transition-colors">
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
                      ? 'bg-[#d6fd70] text-black border-[#d6fd70] font-bold'
                      : 'text-[#ffffff] border-white/30 hover:border-white/60'
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
        {/* Left accordion sidebar — hidden on mobile */}
        <aside
          className="hidden md:block w-60 flex-shrink-0 overflow-y-auto p-3 space-y-0.5"
          style={{ borderRight: `1px solid ${sidebarBorder}`, background: sidebarBg }}
        >
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-[background-color,color] duration-150 text-sm font-medium outline-none focus:outline-none ${sidebarItem(activeSection === sec.id)}`}
            >
              <span className="flex-shrink-0">{sec.icon}</span>
              <span className="flex-1 truncate">{sec.label}</span>
              {sec.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: '#d6fd70', color: '#000' }}>
                  {sec.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-3 mt-2" style={{ borderTop: `1px solid ${sidebarBorder}` }}>
            <button
              onClick={handleViewAll}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ color: lm ? '#4f46e5' : '#d6fd70' }}
            >
              <ArrowForwardIcon size={15} weight="bold" />
              View All Schemes
            </button>
          </div>
        </aside>

        {/* Right: fund cards */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Mobile section pills — visible only on small screens */}
          <div className="flex md:hidden gap-2 overflow-x-auto pb-2 mb-3 -mx-1 px-1 scrollbar-none">
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border"
                style={activeSection === sec.id
                  ? { background: lm ? '#4f46e5' : '#d6fd70', color: lm ? '#fff' : '#000', borderColor: 'transparent' }
                  : { background: 'transparent', color: lm ? '#6B7280' : '#8390a2', borderColor: lm ? '#E0E3E8' : '#1e2838' }}
              >
                {sec.icon}
                {sec.label}
              </button>
            ))}
          </div>
          {/* Best for your portfolio — gap analysis */}
          {bestForPortfolio.length > 0 && (
            <div className="mb-5 rounded-2xl p-4" style={{ background: lm ? 'linear-gradient(135deg,#f5f3ff,#eef2ff)' : 'linear-gradient(135deg,rgba(79,70,229,0.08),rgba(99,102,241,0.04))', border: lm ? '1px solid #c7d2fe' : '1px solid rgba(79,70,229,0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm" style={{ color: lm ? '#4f46e5' : '#818cf8' }}>✦</span>
                <h3 className="text-sm font-bold" style={{ color: lm ? '#4f46e5' : '#818cf8' }}>Best for your portfolio</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: lm ? '#4f46e5' : '#d6fd70', color: lm ? '#fff' : '#000' }}>Gap analysis</span>
              </div>
              <p className="text-xs mb-3" style={{ color: lm ? '#6366f1' : '#a5b4fc' }}>
                Your portfolio is missing these categories — adding them may reduce concentration risk.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {bestForPortfolio.map(({ category, fund }) => (
                  <div
                    key={category}
                    className="rounded-xl p-3 cursor-pointer transition-all hover:-translate-y-0.5"
                    style={{ background: lm ? '#fff' : 'rgba(255,255,255,0.04)', border: lm ? '1px solid #e0e7ff' : '1px solid rgba(99,102,241,0.2)' }}
                    onClick={() => navigate(`/mutual-funds/search/${fund.id}`)}
                  >
                    <p className="text-[10px] font-bold mb-0.5" style={{ color: lm ? '#4f46e5' : '#818cf8' }}>{category}</p>
                    <p className={`text-xs font-semibold truncate ${text}`}>{fund.name.split(' ').slice(0, 3).join(' ')}</p>
                    <p className="text-xs text-[#22c55e] font-bold mt-1">+{fund.returns['1Y'] ?? '—'}% 1Y</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'}>{activeSectionData.icon}</span>
              <h2 className={`text-sm font-bold ${text}`}>{activeSectionData.label}</h2>
              {activeSectionData.badge && (
                <span className="text-[10px] font-bold bg-[#d6fd70] text-black px-2 py-0.5 rounded-full">
                  {activeSectionData.badge}
                </span>
              )}
            </div>
            <button
              onClick={handleViewAll}
              className={`text-xs font-semibold flex items-center gap-1 transition-colors ${lm ? 'text-[#4f46e5] hover:text-[#4338ca]' : 'text-[#d6fd70] hover:text-[#b8d94a]'}`}
            >
              View All <ArrowForwardIcon size={13} weight="bold" />
            </button>
          </div>

          {/* Sahi Funds section */}
          {activeSection === 'sahi' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      <span className="text-[10px] font-bold bg-[#d6fd70] text-black px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                      {fund.accessTier !== 'free' && (
                        <span className="text-[10px] font-bold bg-[#4f46e5] text-white px-2 py-0.5 rounded-full">PRO</span>
                      )}
                    </div>

                    {/* Icon block with origami icon + colored bg */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 flex-shrink-0 relative overflow-hidden"
                      style={{ background: lm ? palette.bg : 'rgba(214,253,112,0.07)' }}
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

                    <h3 className={`text-sm font-bold mb-1 line-clamp-2 transition-colors ${lm ? 'text-[#111827] group-hover:text-[#4f46e5]' : 'text-white group-hover:text-[#d6fd70]'}`}>
                      {fund.name}
                    </h3>
                    <p className={`text-xs ${textSub} leading-relaxed mb-3 flex-1`}>{fund.description}</p>

                    <div className="flex gap-1 mb-3 flex-wrap">
                      {fund.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: lm ? '#eeedfd' : '#1e2838', color: lm ? '#4f46e5' : '#8390a2' }}>
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
                            <LockIcon size={10} color="#4f46e5" weight="fill" />
                            <span className={`text-xs font-bold ${lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'}`}>PRO</span>
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
                style={{ background: 'linear-gradient(135deg, #4f46e518, #d6fd7018)', border: lm ? '1px dashed #4f46e535' : '1px dashed #d6fd7035' }}
                onClick={() => navigate('/mutual-funds/explore/all')}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                  style={{ background: lm ? '#eeedfd' : 'rgba(214,253,112,0.1)' }}>
                  <LockIcon size={18} color={lm ? '#4f46e5' : '#d6fd70'} weight="fill" />
                </div>
                <p className={`text-sm font-bold ${text} mb-1`}>Unlock All Sahi Funds</p>
                <p className={`text-xs ${textSub} mb-3`}>4 more curated baskets available with Sahi PRO</p>
                <ProButton label="Upgrade to PRO" size="sm" onClick={() => navigate('/pricing')} />
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
                            style={{ background: lm ? palette.bg : '#1e2838' }}
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
                            <p className={`text-xs font-bold truncate transition-colors ${lm ? 'text-[#111827] group-hover:text-[#4f46e5]' : 'text-white group-hover:text-[#d6fd70]'}`}>
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
                  style={{ background: lm ? '#4f46e5' : '#d6fd70', color: lm ? '#fff' : '#000' }}
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

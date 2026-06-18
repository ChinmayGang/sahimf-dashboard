import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkle as AutoAwesomeIcon } from '@phosphor-icons/react'
import { ArrowRight as ArrowForwardIcon } from '@phosphor-icons/react'
import { Plus as AddIcon } from '@phosphor-icons/react'
import { TrendUp as TrendingUpIcon } from '@phosphor-icons/react'
import { TrendDown as TrendingDownIcon } from '@phosphor-icons/react'
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react'
import { UploadSimple as UploadFileIcon } from '@phosphor-icons/react'
import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react'
import { ChartBar as BarChartIcon } from '@phosphor-icons/react'
import { Brain as PsychologyIcon } from '@phosphor-icons/react'
import { ShoppingBag as ShoppingBasketIcon } from '@phosphor-icons/react'
import { Heart as FavoriteIcon } from '@phosphor-icons/react'
import { HeartBreak as FavoriteBorderIcon } from '@phosphor-icons/react'
import { Newspaper as NewspaperIcon } from '@phosphor-icons/react'
import { BookmarkSimple as BookmarkBorderIcon } from '@phosphor-icons/react'
import { CaretRight as ChevronRightIcon } from '@phosphor-icons/react'
import { CaretLeft as ChevronLeftIcon } from '@phosphor-icons/react'
import { Lightning as FlashOnIcon } from '@phosphor-icons/react'
import { GraduationCap as SchoolIcon } from '@phosphor-icons/react'
import { ChartLine as ShowChartIcon } from '@phosphor-icons/react'
import { CurrencyDollar as CurrencyDollarIcon } from '@phosphor-icons/react'
import { Globe as GlobeIcon } from '@phosphor-icons/react'
import { useUIStore } from '../../stores/uiStore'
import { ProButton } from '../../components/ui/ProButton'
import { useAuthStore } from '../../stores/authStore'
import { mockSahiFunds } from '../../data/sahiFunds'
import { mockFunds } from '../../data/funds'
import type { UserInvestment } from '../../types'
import paperplaneBg from '../../assets/paperplane.jpg'
import pyramidBg from '../../assets/piramid-landingpage.png'

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatINR(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
  return `₹${n.toLocaleString('en-IN')}`
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function isMarketOpen(): boolean {
  // BSE/NSE: Mon–Fri 09:15–15:30 IST
  const istStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  const ist = new Date(istStr)
  const day = ist.getDay() // 0=Sun, 6=Sat
  const mins = ist.getHours() * 60 + ist.getMinutes()
  return day >= 1 && day <= 5 && mins >= 9 * 60 + 15 && mins < 15 * 60 + 30
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MARKET_INDICES = [
  { name: 'NIFTY 50', value: '24,780', change: '+0.42%', up: true },
  { name: 'SENSEX', value: '81,562', change: '+0.38%', up: true },
  { name: 'NIFTY MID 150', value: '18,240', change: '-0.12%', up: false },
  { name: 'GOLD', value: '₹73,450', change: '+0.08%', up: true },
  { name: 'USD/INR', value: '83.54', change: '-0.06%', up: false },
  { name: 'NIFTY BANK', value: '52,310', change: '+0.55%', up: true },
]

const NEWS = [
  {
    id: 1,
    source: 'Economic Times',
    headline: 'SIP inflows hit record ₹26,632 Cr in May 2026, equity MF AUM crosses ₹30 lakh Cr',
    time: '2h ago',
    tag: 'Trending',
    tagColor: '#ef4444',
  },
  {
    id: 2,
    source: 'Mint',
    headline: 'SEBI proposes changes to MF expense ratio disclosure norms for direct plans',
    time: '5h ago',
    tag: 'Regulatory',
    tagColor: '#f59e0b',
  },
  {
    id: 3,
    source: 'BloombergQuint',
    headline: 'Mid-cap funds outperform large-cap peers by 4.2% YTD — analysis of top 20 funds',
    time: '8h ago',
    tag: 'Analysis',
    tagColor: '#4f46e5',
  },
]

const MARKETPLACE = [
  {
    id: 'numera',
    name: 'Numera',
    tagline: 'Stock-level intelligence',
    stat: '4,200+ stocks',
    icon: <ShowChartIcon size={20} weight="duotone" />,
    color: '#4f46e5',
    bg: '#eeedfd',
    comingSoon: true,
  },
  {
    id: 'thematic',
    name: 'Thematic Baskets',
    tagline: 'Curated investment themes',
    stat: '18 strategies',
    icon: <ShoppingBasketIcon size={20} weight="duotone" />,
    color: '#0891b2',
    bg: '#e0f2fe',
    comingSoon: true,
  },
  {
    id: 'arqed',
    name: 'ArqEd Learning',
    tagline: 'Finance education, simplified',
    stat: '120+ lessons',
    icon: <SchoolIcon size={20} weight="duotone" />,
    color: '#16a34a',
    bg: '#dcfce7',
    comingSoon: true,
  },
  {
    id: 'fo',
    name: 'F&O Insights',
    tagline: 'Options flow & strategy desk',
    stat: 'Weekly reports',
    icon: <BarChartIcon size={20} weight="duotone" />,
    color: '#ea580c',
    bg: '#ffedd5',
    comingSoon: true,
  },
]

const RESEARCH_PICKS = [
  { name: 'Parag Parikh Flexi Cap', score: '9.2/10', returns1Y: '+28.6%', up: true, category: 'Flexi Cap', reason: 'Global diversification + 14yr manager tenure' },
  { name: 'Mirae Asset Large Cap', score: '8.8/10', returns1Y: '+17.0%', up: true, category: 'Large Cap', reason: 'Consistent alpha vs Nifty for 7 years' },
  { name: 'SBI Small Cap', score: '8.5/10', returns1Y: '+31.2%', up: true, category: 'Small Cap', reason: 'Lowest expense ratio in category' },
  { name: 'HDFC Mid-Cap Opps', score: '8.1/10', returns1Y: '+22.4%', up: true, category: 'Mid Cap', reason: 'Best risk-adjusted returns 5Y CAGR' },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function SahiFundCard({ fund, lm }: { fund: (typeof mockSahiFunds)[0]; lm: boolean }) {
  const navigate = useNavigate()
  const ret = fund.returns['1Y'] ?? 0
  const tierColor = fund.accessTier === 'free' ? '#16a34a' : fund.accessTier === 'pro' ? '#4f46e5' : '#f59e0b'
  const tierBg = fund.accessTier === 'free' ? '#dcfce7' : fund.accessTier === 'pro' ? '#eeedfd' : '#fef9c3'
  const tierLabel = fund.accessTier === 'free' ? 'Free' : fund.accessTier === 'pro' ? 'PRO' : 'Elite'

  return (
    <div
      onClick={() => navigate(`/mutual-funds/sahi-funds/${fund.id}`)}
      className={`flex-shrink-0 w-64 rounded-2xl p-4 cursor-pointer border transition-all hover:-translate-y-0.5 ${lm ? 'bg-white border-[#E0E3E8] hover:border-[#4f46e5]/40' : 'bg-[#14171c] border-[#1e2838] hover:border-[#d6fd70]/30'}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#eeedfd' }}
        >
          <AutoAwesomeIcon size={18} color="#4f46e5" weight="duotone" />
        </div>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: tierBg, color: tierColor }}
        >
          {tierLabel}
        </span>
      </div>
      <p className={`text-sm font-bold leading-snug mb-1 ${lm ? 'text-[#111827]' : 'text-white'}`}>{fund.name}</p>
      <p className={`text-[11px] mb-3 line-clamp-2 ${lm ? 'text-[#6B7280]' : 'text-[#8390a2]'}`}>{fund.description}</p>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-[10px] ${lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'}`}>1Y Returns</p>
          <p className={`text-sm font-bold ${ret >= 0 ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
            {ret >= 0 ? '+' : ''}{ret}%
          </p>
        </div>
        <div className="text-right">
          <p className={`text-[10px] ${lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'}`}>Min. Amount</p>
          <p className={`text-xs font-semibold ${lm ? 'text-[#374151]' : 'text-[#d1d5db]'}`}>₹{fund.minAmount.toLocaleString()}</p>
        </div>
      </div>
      <div className="flex gap-1 mt-3 flex-wrap">
        {fund.tags.slice(0, 2).map(t => (
          <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full ${lm ? 'bg-[#F3F4F6] text-[#6B7280]' : 'bg-[#1e2838] text-[#8390a2]'}`}>{t}</span>
        ))}
      </div>
    </div>
  )
}

function InvestmentCard({ inv, lm }: { inv: UserInvestment; lm: boolean }) {
  const isPositive = inv.gainLossPercent >= 0
  const gain = inv.currentValue - inv.investedAmount
  return (
    <div className={`rounded-2xl p-4 border ${lm ? 'bg-white border-[#E0E3E8]' : 'bg-[#14171c] border-[#1e2838]'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className={`text-sm font-bold leading-snug ${lm ? 'text-[#111827]' : 'text-white'}`}>{inv.fundName}</p>
          <p className={`text-xs ${lm ? 'text-[#6B7280]' : 'text-[#8390a2]'}`}>{inv.amcName} · {inv.category}</p>
        </div>
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isPositive ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fee2e2] text-[#dc2626]'}`}
        >
          {isPositive ? '+' : ''}{inv.gainLossPercent.toFixed(1)}%
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <p className={`text-[10px] ${lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'}`}>Invested</p>
          <p className={`text-sm font-semibold ${lm ? 'text-[#374151]' : 'text-[#d1d5db]'}`}>{formatINR(inv.investedAmount)}</p>
        </div>
        <div>
          <p className={`text-[10px] ${lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'}`}>Current</p>
          <p className={`text-sm font-semibold ${lm ? 'text-[#374151]' : 'text-[#d1d5db]'}`}>{formatINR(inv.currentValue)}</p>
        </div>
        <div>
          <p className={`text-[10px] ${lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'}`}>Gain/Loss</p>
          <p className={`text-sm font-semibold ${isPositive ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
            {isPositive ? '+' : ''}{formatINR(gain)}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className={`flex-1 text-xs font-semibold py-1.5 rounded-lg border transition-colors ${lm ? 'border-[#4f46e5]/30 text-[#4f46e5] hover:bg-[#eeedfd]' : 'border-[#d6fd70]/30 text-[#d6fd70] hover:bg-[#d6fd70]/10'}`}>
          {isPositive ? 'Sahi Analysis' : 'View Fund'}
        </button>
        <button className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${lm ? 'border-[#E0E3E8] text-[#6B7280] hover:bg-[#F9FAFB]' : 'border-[#1e2838] text-[#8390a2] hover:bg-[#1a2130]'}`}>
          Details
        </button>
      </div>
    </div>
  )
}

// ── Main Overview ─────────────────────────────────────────────────────────────
export function Overview() {
  const navigate = useNavigate()
  const { lightMode } = useUIStore()
  const { user } = useAuthStore()
  const lm = lightMode

  const [askQuery, setAskQuery] = useState('')
  const [watchlisted, setWatchlisted] = useState<string[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  const investments = user?.investments ?? []
  const investCount = investments.length
  const sahiFundCount = user?.sahiFundCount ?? 0
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  // Styles
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'
  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const bgPage = lm ? '#ffffff' : '#0a0c0e'

  // Scroll Sahi row
  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -280, behavior: 'smooth' })
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 280, behavior: 'smooth' })

  // ── Section: First-time portfolio CTA ─────────────────────────────────────
  const STEPS = [
    { icon: <UploadFileIcon size={18} weight="duotone" />, label: 'Upload CAS / Import', sub: 'Connect via CAMS, Karvy, or MFCentral', key: 'upload' },
    { icon: <SearchIcon size={18} weight="duotone" />, label: 'Review Your Funds', sub: 'We match and normalise your holdings', key: 'review' },
    { icon: <BarChartIcon size={18} weight="duotone" />, label: 'Get AI Analysis', sub: 'Overlap, risk, and Sahi Score', key: 'analysis' },
  ]
  const currentStep = 0

  const BOT_FEATURES = [
    { icon: <PsychologyIcon size={16} weight="duotone" />, label: 'Market Research', color: '#4f46e5' },
    { icon: <BarChartIcon size={16} weight="duotone" />, label: 'Portfolio Health', color: '#16a34a' },
    { icon: <ShowChartIcon size={16} weight="duotone" />, label: 'Stock Reports', color: '#ea580c' },
    { icon: <ShoppingBasketIcon size={16} weight="duotone" />, label: 'Get a Basket', color: '#0891b2' },
  ]

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="h-full overflow-y-auto" style={{ background: bgPage }}>
      <div className="max-w-[1200px] mx-auto px-4 pt-5 pb-10 space-y-8">

        {/* ── Greeting + Market Ticker ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-xl font-bold ${text}`}>{greeting()}, {firstName}</h1>
              <p className={`text-sm ${textSub}`}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            {(() => {
              const open = isMarketOpen()
              return (
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium ${lm ? 'bg-[#F9FAFB] border-[#E0E3E8]' : 'bg-[#14171c] border-[#1e2838]'}`}
                  style={{ color: open ? '#16a34a' : '#dc2626' }}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-[#22c55e] animate-pulse' : 'bg-[#ef4444]'}`} />
                  {open ? 'Market Open' : 'Market Closed'}
                </div>
              )
            })()}
          </div>

          {/* Ticker row */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {MARKET_INDICES.map(idx => (
              <div key={idx.name} className={`flex-shrink-0 flex items-center gap-3 px-3.5 py-2 rounded-xl border ${card}`}>
                <span className={`text-xs font-semibold ${textMuted}`}>{idx.name}</span>
                <div className="text-right">
                  <p className={`text-xs font-bold ${text}`}>{idx.value}</p>
                  <p className={`text-[10px] font-semibold ${idx.up ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>{idx.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sahi Funds Showcase ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-[#eeedfd]">
                <AutoAwesomeIcon size={14} color="#4f46e5" weight="regular" />
              </div>
              <h2 className={`text-base font-bold ${text}`}>Exclusive Sahi Funds</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d6fd70] text-[#0a0c0e]">Curated</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={scrollLeft} className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-colors ${lm ? 'border-[#E0E3E8] text-[#6B7280] hover:bg-[#F3F4F6]' : 'border-[#1e2838] text-[#8390a2] hover:bg-[#1a2130]'}`}>
                <ChevronLeftIcon size={16} weight="bold" />
              </button>
              <button onClick={scrollRight} className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-colors ${lm ? 'border-[#E0E3E8] text-[#6B7280] hover:bg-[#F3F4F6]' : 'border-[#1e2838] text-[#8390a2] hover:bg-[#1a2130]'}`}>
                <ChevronRightIcon size={16} weight="bold" />
              </button>
              <button
                onClick={() => navigate('/mutual-funds/explore')}
                className="flex items-center gap-1 text-xs font-semibold text-[#4f46e5] hover:text-[#6366f1] transition-colors"
              >
                View All <ArrowForwardIcon size={13} weight="bold" />
              </button>
            </div>
          </div>
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {mockSahiFunds.slice(0, 8).map(f => (
              <SahiFundCard key={f.id} fund={f} lm={lm} />
            ))}
          </div>
        </div>

        {/* ── Dynamic Portfolio Section ── */}
        {investCount === 0 && (
          /* Case 1: New investor — onboarding CTA */
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{
              backgroundImage: `url(${paperplaneBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Overlay — must be absolute so bg image shows through */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,12,14,0.96) 0%, rgba(15,12,30,0.92) 50%, rgba(10,12,14,0.85) 100%)' }} />
            <div className="relative" style={{ color: '#ffffff' }}>
              <div className="p-6 lg:p-8">
                <div className="grid lg:grid-cols-2 gap-8">

                  {/* Left: 3-step onboarding */}
                  <div>
                    <p style={{ color: '#d6fd70' }} className="text-[10px] font-bold tracking-widest mb-2 uppercase">Start your journey</p>
                    <h2 className="text-2xl font-bold mb-1 leading-snug" style={{ color: '#ffffff' }}>
                      Get your first<br />MF Portfolio
                    </h2>
                    <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      3 simple steps to unlock your personalised portfolio analysis on SahiMF.
                    </p>
                    <div className="space-y-4">
                      {STEPS.map((step, i) => {
                        const isDone = i < currentStep
                        const isActive = i === currentStep
                        return (
                          <div key={step.key} className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${isDone ? 'bg-[#d6fd70]' : isActive ? 'bg-[#4f46e5]' : 'bg-white/10'}`}>
                              {isDone
                                ? <CheckCircleIcon size={16} color="#0a0c0e" weight="duotone" />
                                : <span style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.35)' }}>{step.icon}</span>
                              }
                            </div>
                            <div>
                              <p className="text-sm font-semibold" style={{ color: isDone ? '#d6fd70' : isActive ? '#ffffff' : 'rgba(255,255,255,0.4)' }}>
                                Step {i + 1}: {step.label}
                              </p>
                              <p className="text-xs" style={{ color: isActive ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.3)' }}>{step.sub}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-6 flex items-center gap-3 flex-wrap">
                      <button
                        onClick={() => navigate('/auth/initialize')}
                        className="flex items-center gap-2 bg-[#d6fd70] text-[#0a0c0e] text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#b8d94a] transition-colors"
                      >
                        <UploadFileIcon size={16} weight="duotone" />
                        Upload CAS to Start
                      </button>
                      <button
                        onClick={() => navigate('/mutual-funds/search')}
                        className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff' }}
                      >
                        <SearchIcon size={16} weight="duotone" />
                        Browse Funds
                      </button>
                    </div>
                    <p className="mt-3 text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      No credit card · No brokerage account needed to explore
                    </p>
                  </div>

                  {/* Right: Sahi Bot */}
                  <div>
                    <p className="text-[10px] font-bold tracking-widest mb-3 uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>Sahi Research Bot</p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {BOT_FEATURES.map(f => (
                        <button
                          key={f.label}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all hover:-translate-y-0.5"
                          style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}
                        >
                          <span style={{ color: f.color }}>{f.icon}</span>
                          <span className="text-xs font-semibold" style={{ color: '#ffffff' }}>{f.label}</span>
                        </button>
                      ))}
                    </div>
                    {/* Ask field */}
                    <div className="flex gap-2 mb-5">
                      <input
                        value={askQuery}
                        onChange={e => setAskQuery(e.target.value)}
                        placeholder="Ask anything about MFs, markets, or your portfolio…"
                        className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors min-w-0"
                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff' }}
                      />
                      <button className="bg-[#4f46e5] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#6366f1] transition-colors flex-shrink-0" style={{ color: '#ffffff' }}>
                        Ask
                      </button>
                    </div>
                    {/* Sahi Research Picks */}
                    <p className="text-[10px] font-bold tracking-widest mb-2 uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>Sahi Research Picks</p>
                    <div className="space-y-2">
                      {RESEARCH_PICKS.map(f => (
                        <div
                          key={f.name}
                          onClick={() => navigate('/mutual-funds/scorecard')}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate" style={{ color: '#ffffff' }}>{f.name}</p>
                            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{f.category} · {f.reason}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-[10px] font-bold" style={{ color: f.up ? '#22c55e' : '#ef4444' }}>{f.returns1Y}</span>
                            <p className="text-[10px]" style={{ color: '#d6fd70' }}>{f.score}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {investCount === 1 && (
          /* Case 2: Single investment */
          <div>
            {/* Diversification nudge */}
            <div
              className="rounded-2xl px-4 py-3 mb-4 flex items-start gap-3"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}
            >
              <FlashOnIcon size={16} color="#f59e0b" weight="duotone" style={{ flexShrink: 0, marginTop: 1 }} />
              <div className="flex-1">
                <p className={`text-xs font-semibold ${text}`}>
                  You have only 1 fund — <span style={{ color: '#f59e0b' }}>100% concentration risk</span>
                </p>
                <p className={`text-[11px] mt-0.5 ${textSub}`}>
                  Diversifying across 3–5 funds in different categories typically reduces volatility by 35–40%. Here are popular funds to consider:
                </p>
              </div>
              <button
                onClick={() => navigate('/mutual-funds/search')}
                className="flex items-center gap-1 text-[11px] font-semibold flex-shrink-0 hover:underline"
                style={{ color: '#f59e0b' }}
              >
                Explore <ArrowForwardIcon size={12} weight="bold" />
              </button>
            </div>

            <div className="flex items-center justify-between mb-3">
              <h2 className={`text-base font-bold ${text}`}>Your Portfolio</h2>
              <button onClick={() => navigate('/mutual-funds/portfolios')} className="text-xs font-semibold text-[#4f46e5] flex items-center gap-1">
                View All <ArrowForwardIcon size={13} weight="bold" />
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Existing fund */}
              <InvestmentCard inv={investments[0]} lm={lm} />
              {/* 2 recommended popular funds */}
              {mockFunds.slice(0, 2).map(f => (
                <div key={f.id} className={`rounded-2xl p-4 border relative ${card}`}>
                  <span className="absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#eeedfd] text-[#4f46e5]">Popular</span>
                  <p className={`text-sm font-bold leading-snug mb-1 pr-16 ${text}`}>{f.name}</p>
                  <p className={`text-xs mb-3 ${textSub}`}>{f.amcName} · {f.category}</p>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className={`text-[10px] ${textMuted}`}>1Y Returns</p>
                      <p className="text-sm font-bold text-[#16a34a]">+{f.returns['1Y'] ?? 0}%</p>
                    </div>
                    <div>
                      <p className={`text-[10px] ${textMuted}`}>Min SIP</p>
                      <p className={`text-xs font-semibold ${lm ? 'text-[#374151]' : 'text-[#d1d5db]'}`}>₹{f.minSIP}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/mutual-funds/search/${f.id}`)}
                    className="w-full bg-[#4f46e5] text-white text-xs font-bold py-1.5 rounded-lg hover:bg-[#6366f1] transition-colors"
                  >
                    View Research
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {investCount >= 3 && (
          /* Case 3: 3+ investments */
          <div>
            {/* Portfolio summary */}
            {(() => {
              const totalInv = investments.reduce((s, i) => s + i.investedAmount, 0)
              const totalCur = investments.reduce((s, i) => s + i.currentValue, 0)
              const totalGain = totalCur - totalInv
              const totalPct = (totalGain / totalInv) * 100
              return (
                <div
                  className="rounded-2xl p-5 mb-5 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 80%)' }}
                >
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${pyramidBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-white/60 mb-0.5">Invested</p>
                      <p className="text-xl font-bold text-white">{formatINR(totalInv)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60 mb-0.5">Current Value</p>
                      <p className="text-xl font-bold text-white">{formatINR(totalCur)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60 mb-0.5">Total Gain</p>
                      <p className={`text-xl font-bold ${totalGain >= 0 ? 'text-[#d6fd70]' : 'text-[#fca5a5]'}`}>
                        {totalGain >= 0 ? '+' : ''}{formatINR(totalGain)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60 mb-0.5">Overall Return</p>
                      <div className="flex items-center gap-1.5">
                        {totalPct >= 0
                          ? <TrendingUpIcon size={18} color="#d6fd70" weight="duotone" />
                          : <TrendingDownIcon size={18} color="#fca5a5" weight="duotone" />
                        }
                        <p className={`text-xl font-bold ${totalPct >= 0 ? 'text-[#d6fd70]' : 'text-[#fca5a5]'}`}>
                          {totalPct >= 0 ? '+' : ''}{totalPct.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex gap-2 mt-4">
                    <button
                      onClick={() => navigate('/mutual-funds/portfolios')}
                      className="flex items-center gap-1.5 bg-white text-[#4f46e5] text-xs font-bold px-4 py-2 rounded-xl hover:bg-white/90 transition-colors"
                    >
                      Full Portfolio <ArrowForwardIcon size={13} weight="bold" />
                    </button>
                    <button
                      onClick={() => navigate('/mutual-funds/overlap')}
                      className="flex items-center gap-1.5 bg-white/15 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-white/25 border border-white/20 transition-colors"
                    >
                      Overlap Analysis <ArrowForwardIcon size={13} weight="bold" />
                    </button>
                  </div>
                </div>
              )
            })()}

            {/* Individual fund cards */}
            <div className="flex items-center justify-between mb-3">
              <h2 className={`text-base font-bold ${text}`}>Your Investments</h2>
              <span className={`text-xs ${textMuted}`}>{investCount} funds</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {investments.map(inv => (
                <InvestmentCard key={inv.fundId} inv={inv} lm={lm} />
              ))}
            </div>

            {/* Sahi Funds they hold */}
            {sahiFundCount > 0 && (
              <div className="mt-5">
                <div className="flex items-center gap-2 mb-3">
                  <AutoAwesomeIcon size={15} color="#4f46e5" weight="regular" />
                  <p className={`text-sm font-bold ${text}`}>Your Sahi Funds ({sahiFundCount})</p>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                  {mockSahiFunds.slice(0, sahiFundCount).map(f => (
                    <SahiFundCard key={f.id} fund={f} lm={lm} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Marketplace ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className={`text-base font-bold ${text}`}>Arqentis Marketplace</h2>
              <p className={`text-xs ${textSub}`}>Everything we're building for you</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {MARKETPLACE.map(item => (
              <div
                key={item.id}
                className={`rounded-2xl p-4 border relative overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 ${card}`}
              >
                {item.comingSoon && (
                  <span className={`absolute top-3 right-3 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${lm ? 'bg-[#F3F4F6] text-[#9CA3AF]' : 'bg-[#1e2838] text-[#64748b]'}`}>
                    Soon
                  </span>
                )}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: item.bg }}>
                  <span style={{ color: item.color }}>{item.icon}</span>
                </div>
                <p className={`text-sm font-bold mb-0.5 ${text}`}>{item.name}</p>
                <p className={`text-xs mb-2 ${textSub}`}>{item.tagline}</p>
                <p className="text-xs font-semibold" style={{ color: item.color }}>{item.stat}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Watchlist ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookmarkBorderIcon size={16} color={lm ? '#6B7280' : '#8390a2'} weight="duotone" />
              <h2 className={`text-base font-bold ${text}`}>Watchlist</h2>
            </div>
            <button className={`text-xs font-semibold flex items-center gap-1 ${lm ? 'text-[#4f46e5]' : 'text-[#818cf8]'}`}>
              <AddIcon size={14} weight="regular" /> Add Fund
            </button>
          </div>
          {(user?.watchlist ?? []).length === 0 ? (
            <div className={`rounded-2xl border p-8 text-center ${card}`}>
              <FavoriteBorderIcon size={28} color={lm ? '#E0E3E8' : '#1e2838'} weight="duotone" />
              <p className={`text-sm font-medium mt-2 ${textSub}`}>Your watchlist is empty</p>
              <p className={`text-xs mt-1 ${textMuted}`}>Bookmark funds to track them here</p>
              <button
                onClick={() => navigate('/mutual-funds/explore')}
                className="mt-4 text-xs font-semibold text-[#4f46e5] border border-[#4f46e5]/30 px-4 py-1.5 rounded-lg hover:bg-[#eeedfd] transition-colors"
              >
                Explore Funds
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-3">
              {(user?.watchlist ?? []).slice(0, 3).map(fundId => {
                const f = mockFunds.find(mf => mf.id === fundId)
                if (!f) return null
                const isWL = watchlisted.includes(fundId)
                return (
                  <div key={fundId} className={`rounded-2xl border p-4 ${card}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-bold truncate ${text}`}>{f.name}</p>
                        <p className={`text-xs ${textSub}`}>{f.category}</p>
                      </div>
                      <button
                        onClick={() => setWatchlisted(w => isWL ? w.filter(x => x !== fundId) : [...w, fundId])}
                        className="flex-shrink-0 ml-2"
                      >
                        {isWL
                          ? <FavoriteIcon size={16} color="#4f46e5" weight="fill" />
                          : <FavoriteBorderIcon size={16} color={lm ? '#9CA3AF' : '#505d6f'} weight="duotone" />
                        }
                      </button>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className={`text-[10px] ${textMuted}`}>1Y</p>
                        <p className={`text-sm font-bold ${(f.returns['1Y'] ?? 0) >= 0 ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                          {(f.returns['1Y'] ?? 0) >= 0 ? '+' : ''}{f.returns['1Y']}%
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/mutual-funds/search/${fundId}`)}
                        className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-[#4f46e5] text-white hover:bg-[#6366f1] transition-colors"
                      >
                        Research
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Latest News ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <NewspaperIcon size={16} color={lm ? '#6B7280' : '#8390a2'} weight="duotone" />
              <h2 className={`text-base font-bold ${text}`}>Market Pulse</h2>
            </div>
            <button className={`text-xs font-semibold flex items-center gap-1 ${lm ? 'text-[#4f46e5]' : 'text-[#818cf8]'}`}>
              All News <ArrowForwardIcon size={13} weight="bold" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {NEWS.map(n => (
              <div key={n.id} className={`rounded-2xl border p-4 cursor-pointer hover:-translate-y-0.5 transition-all ${card}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold" style={{ color: n.tagColor }}>{n.tag}</span>
                  <span className={`text-[10px] ${textMuted}`}>{n.time}</span>
                </div>
                <p className={`text-sm font-semibold leading-snug mb-2 ${text}`}>{n.headline}</p>
                <p className={`text-[11px] ${textMuted}`}>{n.source}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Market Themes (contextual upsell like image 3) ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-base font-bold ${text}`}>Trending Opportunities</h2>
            <button className={`text-xs font-semibold flex items-center gap-1 ${lm ? 'text-[#4f46e5]' : 'text-[#818cf8]'}`}>
              See all <ArrowForwardIcon size={13} weight="bold" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Card 1 — Idle money parking */}
            <div className="rounded-2xl overflow-hidden relative flex items-center gap-4 p-5 min-h-[120px]"
              style={{ background: '#3359C3' }}>
              <div>
                <p className="text-xs font-bold text-blue-200 mb-1 tracking-wider uppercase">Liquid Parking</p>
                <h3 className="text-base font-bold text-white mb-1.5 leading-snug">Grow your idle money</h3>
                <p className="text-xs text-white/65 mb-3 max-w-xs">Park surplus cash in liquid MF portfolios with zero lock-in and instant withdrawal.</p>
                <button className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-colors ${lm ? 'bg-white text-[#1d4ed8] hover:bg-blue-50' : 'bg-white text-[#1d4ed8] hover:bg-blue-50'}`}>
                  Explore now
                </button>
              </div>
              <div className="flex-shrink-0 opacity-80"><CurrencyDollarIcon size={52} color="rgba(255,255,255,0.75)" weight="duotone" /></div>
            </div>

            {/* Card 2 — Geopolitical theme */}
            <div className="rounded-2xl overflow-hidden relative flex items-center gap-4 p-5 min-h-[120px]"
              style={{ background: '#1E6B55' }}>
              <div>
                <p className="text-xs font-bold mb-1 tracking-wider uppercase" style={{ color: '#6ee7b7' }}>Market Theme</p>
                <h3 className="text-base font-bold mb-1.5 leading-snug" style={{ color: '#ffffff' }}>Global shifts, local gains</h3>
                <p className="text-xs mb-3 max-w-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>Funds likely to benefit from geopolitical shifts and new trade corridors.</p>
                <button className="text-xs font-bold px-4 py-1.5 rounded-lg transition-colors bg-white hover:bg-emerald-50" style={{ color: '#065f46' }}>
                  Explore now
                </button>
              </div>
              <div className="flex-shrink-0 opacity-80"><GlobeIcon size={44} color="rgba(255,255,255,0.75)" weight="duotone" /></div>
            </div>
          </div>
        </div>

        {/* ── Upsell: Upgrade banner (free plan only) ── */}
        {user?.plan === 'free' && (
          <div className="rounded-2xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #0a0c0e 0%, #1a1230 100%)' }}>
            {/* BG image as absolute overlay */}
            <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url(${pyramidBg})`, backgroundSize: 'cover', backgroundPosition: 'right center' }} />
            {/* Gradient fade over the image */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(10,12,14,0.98) 40%, transparent 100%)' }} />
            <div className="relative flex items-center justify-between gap-6 p-6" style={{ color: '#ffffff' }}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FlashOnIcon size={15} color="#d6fd70" weight="regular" />
                  <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#d6fd70' }}>Sahi PRO</span>
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: '#ffffff' }}>Unlock the full research desk</h3>
                <p className="text-sm max-w-md" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  All 6 Sahi Funds, deep portfolio analytics, rebalance alerts, and priority access to new strategies.
                </p>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-2">
                <ProButton label="Upgrade to PRO" onClick={() => navigate('/pricing')} />
                <button className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  See what's included
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

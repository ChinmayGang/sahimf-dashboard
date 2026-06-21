import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ArrowLeft as ArrowBackIcon, ArrowsLeftRight as CompareIcon, FileText as ReportIcon, Buildings as BuildingsIcon, Globe as GlobeIcon, Newspaper as NewsIcon, ArrowSquareOut as ExternalLinkIcon, X as CloseIcon, Clock as ClockIcon, Coins as CoinsIcon, TrendDown as TrendDownIcon, ShoppingBag as BasketUpsellIcon, ArrowRight as ArrowRightSmIcon } from '@phosphor-icons/react'
import { format, formatDistanceToNow } from 'date-fns'
import { VolatilityBadge } from '../../components/ui/VolatilityBadge'
import { PlanGate } from '../../components/ui/PlanGate'
import { SahiResearchCard } from '../../components/ui/SahiResearchCard'
import { RankBadge, ordinal } from '../../components/ui/RankBadge'
import { mockFunds, getMockNavData } from '../../data/funds'
import { FUND_NEWS, type NewsItem } from '../../data/fundNews'
import { useUIStore } from '../../stores/uiStore'

const RESEARCH_DB: Record<string, Parameters<typeof SahiResearchCard>[0]['data']> = {
  f001: {
    verdict: 'Research Pick',
    sahiScore: 84,
    summary: 'Mirae Asset Large Cap Fund has consistently delivered above-category returns over 3- and 5-year horizons, driven by a quality-focused bottom-up approach. The fund maintains high conviction in top-tier banking and IT stocks while managing downside through selective rebalancing. Its low-turnover style and competitive expense ratio of 0.54% make it a cost-efficient core holding in a large-cap allocation.',
    strengths: ['Consistent top-quartile 3Y CAGR of 14.2%', 'Expense ratio below category average (0.54%)', 'Experienced manager with 12+ year track record', 'Well-diversified with >75 holdings'],
    concerns: ['Moderate tracking error to Nifty 50', 'High banking sector concentration (32%)', 'Underperformance vs index in 2022 bear market'],
    analystNote: 'Suitable as a core large-cap allocation. Investors seeking passive exposure may consider a Nifty 50 index fund as an alternative. The manager change in 2021 has not disrupted the investment process.',
    updatedAt: 'June 2026',
    subScores: [
      { label: 'Returns', value: 82 },
      { label: 'Consistency', value: 79 },
      { label: 'Risk-Adj.', value: 88 },
      { label: 'Manager', value: 85 },
      { label: 'Cost', value: 91 },
    ],
  },
  f002: {
    verdict: 'Research Pick',
    sahiScore: 92,
    summary: 'Parag Parikh Flexi Cap Fund stands out for its global diversification and disciplined value-oriented mandate. The fund\'s allocation to international equities (US tech giants) acts as a natural hedge and has significantly contributed to its superior long-term returns. Manager continuity and a concentrated portfolio of high-conviction ideas have driven consistent alpha generation.',
    strengths: ['Only flexi-cap fund with meaningful international allocation', 'Strong 5Y CAGR of 21.4% with low drawdowns', 'Low expense ratio of 0.63% for actively managed flexi-cap', 'Long-term holding philosophy reduces churn'],
    concerns: ['SEBI cap on overseas fund allocation (25%) limits global diversification', 'Concentrated top-10 holdings (>60% weight)', 'US tech exposure creates currency and geopolitical risk'],
    analystNote: 'A strong conviction choice for investors with a 5+ year horizon who want diversified equity exposure including international stocks. The fund\'s differentiated mandate makes it difficult to compare within the flexi-cap category.',
    updatedAt: 'June 2026',
    subScores: [
      { label: 'Returns', value: 94 },
      { label: 'Consistency', value: 91 },
      { label: 'Risk-Adj.', value: 89 },
      { label: 'Manager', value: 96 },
      { label: 'Cost', value: 88 },
    ],
  },
  default: {
    verdict: 'Watchlist',
    sahiScore: 72,
    summary: 'This fund is currently under SahiMF research coverage. Based on available data, the fund shows adequate performance within its category with some areas warranting further monitoring. Detailed analyst notes are updated monthly.',
    strengths: ['Adequate historical returns vs category median', 'Reasonable expense ratio', 'Reputed AMC with strong AUM base'],
    concerns: ['Limited long-term track record', 'Moderate manager stability concerns', 'Below-average risk-adjusted returns'],
    analystNote: 'Monitor for 2 more quarters before establishing a clear conviction view. Watch for any key personnel changes.',
    updatedAt: 'June 2026',
    subScores: [
      { label: 'Returns', value: 68 },
      { label: 'Consistency', value: 72 },
      { label: 'Risk-Adj.', value: 74 },
      { label: 'Manager', value: 70 },
      { label: 'Cost', value: 75 },
    ],
  },
}

const periods = ['1M', '6M', '1Y', '3Y', 'MAX'] as const
type Period = (typeof periods)[number]

const periodMonths: Record<Period, number> = { '1M': 1, '6M': 6, '1Y': 12, '3Y': 36, MAX: 60 }

const holdingsDist = [
  { label: 'Equity', value: 75.9, color: '#4f46e5' },
  { label: 'Mutual Funds', value: 13.1, color: '#0891b2' },
  { label: 'Cash & Eq.', value: 11.0, color: '#22C55E' },
]

type RiskLevel = 'Low' | 'Low-Moderate' | 'Moderate' | 'Moderately High' | 'High' | 'Very High'

// 3-level display map (data uses 6-level vocabulary, riskometer collapses to 3 zones)
const RISK_3_MAP: Record<RiskLevel, { label: string; idx: number; color: string }> = {
  'Low':             { label: 'Low',      idx: 0, color: '#16a34a' },
  'Low-Moderate':    { label: 'Low',      idx: 0, color: '#16a34a' },
  'Moderate':        { label: 'Moderate', idx: 1, color: '#f59e0b' },
  'Moderately High': { label: 'Moderate', idx: 1, color: '#f59e0b' },
  'High':            { label: 'High',     idx: 2, color: '#ef4444' },
  'Very High':       { label: 'High',     idx: 2, color: '#ef4444' },
}

function Riskometer({ level, lm }: { level: RiskLevel; lm: boolean }) {
  const { label, idx, color } = RISK_3_MAP[level]
  // Arc spans 180·—360· (left → top → right). 3 segments × 60· each.
  const angleDeg = 180 + (idx + 0.5) * 60
  const cx = 80, cy = 82, r = 68
  const SEGS = [
    { fill: '#16a34a' }, // Low — green
    { fill: '#f59e0b' }, // Moderate — amber
    { fill: '#ef4444' }, // High — red (always red, always visible)
  ]

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 160 90" width="160" height="90" style={{ overflow: 'visible' }}>
        {SEGS.map((seg, i) => {
          const startAngle = Math.PI + (i / 3) * Math.PI
          const endAngle = Math.PI + ((i + 1) / 3) * Math.PI
          const x1 = cx + r * Math.cos(startAngle)
          const y1 = cy + r * Math.sin(startAngle)
          const x2 = cx + r * Math.cos(endAngle)
          const y2 = cy + r * Math.sin(endAngle)
          return (
            <path
              key={i}
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
              fill={seg.fill}
              opacity={i === idx ? 1 : 0.18}
            />
          )
        })}
        <circle cx={cx} cy={cy} r="44" fill={lm ? '#ffffff' : '#14171c'} />
        {(() => {
          const rad = (angleDeg * Math.PI) / 180
          const nx = cx + 52 * Math.cos(rad)
          const ny = cy + 52 * Math.sin(rad)
          return (
            <>
              <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
              <circle cx={cx} cy={cy} r="4" fill={color} />
            </>
          )
        })()}
      </svg>
      <p className="text-xs font-bold mt-1" style={{ color }}>{label}</p>
    </div>
  )
}

// Peer funds mock data (same subcategory, different funds)
function getPeerFunds(currentId: string, subCategory: string) {
  return mockFunds
    .filter(f => f.id !== currentId && f.subCategory === subCategory)
    .slice(0, 3)
}

function getPeerFundsAny(currentId: string) {
  return mockFunds.filter(f => f.id !== currentId).slice(0, 3)
}

export function SchemeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const fund = mockFunds.find((f) => f.id === id) ?? mockFunds[2]
  const [tab, setTab] = useState<'overview' | 'constituents' | 'dividends'>('overview')
  const [period, setPeriod] = useState<Period>('3Y')

  useEffect(() => {
    const el = document.querySelector('.overflow-y-auto')
    if (el) el.scrollTop = 0
  }, [id])
  const lm = useUIStore((s) => s.lightMode)

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#6B7280]' : 'text-[#64748b]'
  const chip = lm ? 'bg-[#F3F4F6] text-[#374151]' : 'bg-[#1e2838] text-[#8390a2]'
  const rowBorder = lm ? 'border-[#F0F0F8]' : 'border-[#1e2838]'
  const dividerColor = lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'
  const tabBorder = lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'
  const accentBg = lm ? 'bg-[#F3F4F6]' : 'bg-[#1e2838]'
  const tooltipStyle = {
    background: lm ? '#fff' : '#14171c',
    border: `1px solid ${lm ? '#E0E3E8' : '#1e2838'}`,
    borderRadius: 8, fontSize: 12,
    color: lm ? '#111827' : '#fff',
  }
  const chartTick = lm ? '#9CA3AF' : '#64748b'
  const constituentBorder = lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'

  const navData = getMockNavData(periodMonths[period])
  const startVal = navData[0]?.value ?? 100
  const endVal = navData[navData.length - 1]?.value ?? 100
  const totalReturn = (((endVal - startVal) / startVal) * 100).toFixed(2)

  const niftyData = navData.map((d, i) => ({
    ...d,
    nifty: startVal * (1 + i * 0.008 + Math.sin(i * 0.3) * 0.012),
  }))
  const niftyReturn = (((niftyData[niftyData.length - 1]?.nifty ?? startVal) - startVal) / startVal * 100).toFixed(2)
  const alpha = (Number(totalReturn) - Number(niftyReturn)).toFixed(1)

  const riskLevel = fund.volatility
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const fundNews = FUND_NEWS[fund.id] ?? []

  const categoryColors: Record<string, { bg: string; text: string }> = {
    'Fund Update':  { bg: 'rgba(99,102,241,0.12)',  text: '#818cf8' },
    'Market News':  { bg: 'rgba(245,158,11,0.12)',  text: '#fbbf24' },
    'AMC News':     { bg: 'rgba(34,197,94,0.12)',   text: '#4ade80' },
    'Regulatory':   { bg: 'rgba(239,68,68,0.12)',   text: '#f87171' },
    'Performance':  { bg: lm ? 'rgba(79,70,229,0.1)' : 'rgba(214,253,112,0.12)', text: lm ? '#4f46e5' : '#d6fd70' },
  }

  // Rank cards: mock rank in category (based on fund index in same subcat)
  const sameCatFunds = mockFunds.filter(f => f.subCategory === fund.subCategory)
  const totalInCat = Math.max(sameCatFunds.length, 5)
  const returnRank = sameCatFunds.sort((a, b) => (b.returns['1Y'] ?? 0) - (a.returns['1Y'] ?? 0)).findIndex(f => f.id === fund.id) + 1
  const costRank = sameCatFunds.sort((a, b) => a.expenseRatio - b.expenseRatio).findIndex(f => f.id === fund.id) + 1
  const volRank = sameCatFunds.sort((a, b) => {
    const order = { Low: 0, Medium: 1, High: 2 }
    return order[a.volatility] - order[b.volatility]
  }).findIndex(f => f.id === fund.id) + 1

  const peers = getPeerFunds(fund.id, fund.subCategory)
  const peerFunds = peers.length >= 2 ? peers : getPeerFundsAny(fund.id).slice(0, 3)
  const leastVolatilePeer = [...peerFunds].sort((a, b) => {
    const o = { Low: 0, Medium: 1, High: 2 }
    return o[a.volatility] - o[b.volatility]
  })[0]
  const highestReturnPeer = [...peerFunds].sort((a, b) => (b.returns['1Y'] ?? 0) - (a.returns['1Y'] ?? 0))[0]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      {/* News modal */}
      {selectedNews && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelectedNews(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl p-6 space-y-4"
            style={{ background: lm ? '#ffffff' : '#14171c', border: `1px solid ${lm ? '#E0E3E8' : '#1e2838'}`, maxHeight: '80vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between gap-3">
              <span
                className="text-[10px] font-bold px-2 py-1 rounded-full"
                style={categoryColors[selectedNews.category]}
              >
                {selectedNews.category}
              </span>
              <button onClick={() => setSelectedNews(null)}>
                <CloseIcon size={18} weight="bold" color={lm ? '#9CA3AF' : '#64748b'} />
              </button>
            </div>
            <h2 className={`text-sm font-bold ${text} leading-snug`}>{selectedNews.headline}</h2>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold ${textSub}`}>{selectedNews.source}</span>
              <span className={`text-[10px] ${textMuted} flex items-center gap-1`}>
                <ClockIcon size={10} weight="regular" />
                {format(new Date(selectedNews.publishedAt), 'd MMM yyyy, h:mm a')}
              </span>
            </div>
            <p className={`text-xs ${textSub} leading-relaxed`}>{selectedNews.body}</p>
            {selectedNews.sourceUrl ? (
              <a
                href={selectedNews.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#6366f1] hover:underline"
              >
                <ExternalLinkIcon size={13} weight="fill" />
                Read full article on {selectedNews.source}
              </a>
            ) : (
              <p className={`text-[10px] ${textMuted}`}>Full article available on {selectedNews.source} website.</p>
            )}
          </div>
        </div>
      )}
      {/* Back */}
      <div className="flex items-center justify-between">
        <Link to="/mutual-funds/search" className={`flex items-center gap-2 text-xs ${textMuted} hover:${text} transition-colors`}>
          <ArrowBackIcon size={14} weight="bold" />
          Back to Search
        </Link>
        <button
          onClick={() => navigate(`/mutual-funds/compare?fund=${fund.id}`)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
          style={{ background: lm ? '#eeedfd' : 'rgba(79,70,229,0.12)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          <CompareIcon size={13} weight="fill" />
          Compare with similar
        </button>
      </div>

      {/* Fund header */}
      <div className={`${card} rounded-xl p-5`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${accentBg} flex items-center justify-center text-sm font-bold ${lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'}`}>
              {fund.amcName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className={`text-base font-semibold ${text}`}>{fund.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs ${textSub}`}>{fund.category}</span>
                <span className={lm ? 'text-[#E0E3E8]' : 'text-[#1e2838]'}>·</span>
                <span className={`text-xs ${textSub}`}>{fund.subCategory}</span>
                {fund.tags.slice(0, 2).map((t) => (
                  <span key={t} className={`text-xs ${chip} px-2 py-0.5 rounded-full`}>{t}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-8 text-right">
            <div>
              <p className={`text-xs ${textSub}`}>NAV</p>
              <p className={`text-lg font-semibold ${text}`}>₹{fund.nav.toFixed(2)}</p>
              <p className={`text-xs ${fund.navChangePercent >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {fund.navChangePercent >= 0 ? '▲' : '▼'} {Math.abs(fund.navChangePercent).toFixed(2)}%
              </p>
            </div>
            <div>
              <p className={`text-xs ${textSub}`}>5Y CAGR</p>
              <p className="text-lg font-semibold text-[#22C55E]">+{fund.returns['5Y'] ?? '—'}%</p>
            </div>
            <div><VolatilityBadge level={fund.volatility} size="md" /></div>
          </div>
        </div>
      </div>

      {/* Fund Analysis rank cards — inspired by smallcase/tickertape */}
      <div className="grid grid-cols-3 gap-3 mt-3">
        {[
          {
            label: 'Returns',
            rank: returnRank,
            total: totalInCat,
            stat: `${fund.returns['1Y'] ?? '—'}%`,
            statLabel: '1Y Return',
            topTag: 'Highest Return',
          },
          {
            label: 'Cost',
            rank: costRank,
            total: totalInCat,
            stat: `${fund.expenseRatio}%`,
            statLabel: 'Expense Ratio',
            topTag: 'Lowest Cost',
          },
          {
            label: 'Volatility',
            rank: volRank,
            total: totalInCat,
            stat: fund.volatility,
            statLabel: 'Std. Deviation tier',
            topTag: 'Lowest Risk',
          },
        ].map((item) => {
          // Per-rank medal styling matching the reference: 1 green · 2 orange · 3 slate · 4 amber · 5 slate
          const RANK_TIER: Record<number, { color: string; tintBg: string; tintBorder: string; shine: string; shadow: string }> = {
            1: { color: '#16a34a', tintBg: '#f0fdf4', tintBorder: '#86efac', shine: 'linear-gradient(90deg, #15803d, #22c55e, #86efac, #22c55e, #15803d)', shadow: 'rgba(34,197,94,0.45)' },
            2: { color: '#ea580c', tintBg: '#fff7ed', tintBorder: '#fdba74', shine: '', shadow: '' },
            3: { color: '#64748b', tintBg: '#f8fafc', tintBorder: '#cbd5e1', shine: '', shadow: '' },
            4: { color: '#d97706', tintBg: '#fffbeb', tintBorder: '#fcd34d', shine: '', shadow: '' },
            5: { color: '#64748b', tintBg: '#f8fafc', tintBorder: '#cbd5e1', shine: '', shadow: '' },
          }
          const tier = RANK_TIER[item.rank] ?? { color: '#6B7280', tintBg: '#f9fafb', tintBorder: '#E0E3E8', shine: '', shadow: '' }
          return (
          <div
            key={item.label}
            className="relative rounded-2xl p-4 flex flex-col"
            style={{ background: tier.tintBg, border: `1.5px solid ${tier.tintBorder}` }}
          >
            {/* Rank-1 winner banner anchored to the top border */}
            {item.rank === 1 && (
              <span
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wide px-3 py-1 rounded-full text-white whitespace-nowrap z-10"
                style={{ background: tier.shine, backgroundSize: '200% 100%', animation: 'shimmer-rail 3s linear infinite', boxShadow: `0 3px 10px ${tier.shadow}` }}
              >
                {item.topTag}
              </span>
            )}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold text-[#111827] uppercase tracking-wider mb-1">{item.label}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black leading-none" style={{ color: tier.color }}>
                    {item.rank}<span className="text-base font-bold">{ordinal(item.rank).replace(String(item.rank), '')}</span>
                  </span>
                  <span className="text-xs font-medium" style={{ color: tier.color, opacity: 0.7 }}>of {item.total}</span>
                </div>
              </div>
              <div className="flex-shrink-0 -mt-1 -mr-1">
                <RankBadge rank={item.rank} size={60} />
              </div>
            </div>
            <p className="text-xl font-black mt-3" style={{ color: tier.color }}>{item.stat}</p>
            <p className="text-[11px] font-medium text-[#6B7280] mb-3">{item.statLabel}</p>
            <div className="mt-auto h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${((item.total - item.rank + 1) / item.total) * 100}%`, background: tier.color }}
              />
            </div>
          </div>
          )
        })}
      </div>

      {/* SahiMF Research Note */}
      <SahiResearchCard
        fundName={fund.name}
        data={RESEARCH_DB[fund.id] ?? RESEARCH_DB.default}
        lm={lm}
      />

      {/* Tabs */}
      <div className={`flex gap-1 border-b ${tabBorder}`}>
        {(['overview', 'constituents', 'dividends'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? (lm ? 'border-[#4f46e5] text-[#4f46e5]' : 'border-[#d6fd70] text-[#d6fd70]') : `border-transparent ${textSub} hover:${text}`
            }`}
          >
            {t === 'overview' ? 'Overview' : t === 'constituents' ? 'Constituents' : 'Dividends'}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-3 gap-5">
          {/* Left column */}
          <div className="col-span-2 space-y-4">
            {/* Performance chart */}
            <div className={`${card} rounded-xl p-5`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className={`text-xs ${textSub}`}>This fund</p>
                    <p className={`text-xl font-semibold ${Number(totalReturn) >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                      {Number(totalReturn) >= 0 ? '+' : ''}{totalReturn}%
                    </p>
                  </div>
                  <div className="h-8 w-px" style={{ background: lm ? '#E0E3E8' : '#1e2838' }} />
                  <div>
                    <p className={`text-xs ${textSub}`}>Nifty 50</p>
                    <p className={`text-xl font-semibold ${textSub}`}>{Number(niftyReturn) >= 0 ? '+' : ''}{niftyReturn}%</p>
                  </div>
                  <div
                    className="px-2.5 py-1 rounded-lg text-xs font-bold"
                    style={Number(alpha) >= 0
                      ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }
                      : { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}
                  >
                    {Number(alpha) >= 0 ? '▲' : '▼'} {Math.abs(Number(alpha))}% alpha
                  </div>
                </div>
                <div className="flex gap-1">
                  {periods.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                        period === p ? (lm ? 'bg-[#4f46e5] text-white font-semibold' : 'bg-[#d6fd70] text-black font-semibold') : `${textSub} hover:${text}`
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 rounded" style={{ background: lm ? '#4f46e5' : '#d6fd70' }} />
                  <span className={`text-xs ${textSub}`}>{fund.name.split(' ')[0]}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 rounded border-t-2 border-dashed" style={{ borderColor: '#64748b' }} />
                  <span className={`text-xs ${textSub}`}>Nifty 50</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={niftyData}>
                  <defs>
                    <linearGradient id="navGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={lm ? '#4f46e5' : '#d6fd70'} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={lm ? '#4f46e5' : '#d6fd70'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: chartTick }} tickLine={false} axisLine={false}
                    tickFormatter={(v) => format(new Date(v), period === '1M' ? 'd MMM' : 'MMM yy')} interval="preserveStartEnd" />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelFormatter={(v) => format(new Date(v as string), 'd MMM yyyy')}
                    formatter={(v, name) => [`₹${Number(v).toFixed(2)}`, name === 'nifty' ? 'Nifty 50' : 'NAV']}
                    itemStyle={{ color: lm ? '#4f46e5' : '#d6fd70', fontSize: 12, fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="value" stroke={lm ? '#4f46e5' : '#d6fd70'} strokeWidth={2} fill="url(#navGrad)" dot={false} />
                  <Area type="monotone" dataKey="nifty" stroke="#64748b" strokeWidth={1.5} strokeDasharray="5 3" fill="none" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
              <p className="text-[10px] mt-2" style={{ color: lm ? '#9CA3AF' : '#505d6f' }}>
                Past performance is not indicative of future returns.
              </p>
            </div>

            {/* Risk metrics row */}
            <div className={`${card} rounded-xl p-4`}>
              <p className={`text-xs font-semibold ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} uppercase tracking-wider mb-3`}>Risk Metrics</p>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Alpha (1Y)', value: alpha, suffix: '%', color: Number(alpha) >= 0 ? '#22c55e' : '#ef4444', free: true },
                  { label: 'Beta', value: (0.85 + Math.random() * 0.3).toFixed(2), suffix: '', color: lm ? '#111827' : '#fff', free: false },
                  { label: 'Sharpe Ratio', value: fund.sharpeRatio.toFixed(2), suffix: '', color: fund.sharpeRatio >= 1 ? '#22c55e' : '#f59e0b', free: false },
                  { label: 'Max Drawdown', value: `${(-(8 + Math.random() * 12)).toFixed(1)}`, suffix: '%', color: '#ef4444', free: false },
                ].map((m) => (
                  <div key={m.label} className="text-center">
                    <p className={`text-[10px] ${textMuted} mb-1`}>{m.label}</p>
                    {m.free ? (
                      <p className="text-lg font-bold" style={{ color: m.color }}>{m.value}{m.suffix}</p>
                    ) : (
                      <PlanGate requiredTier="pro" compact>
                        <p className="text-lg font-bold" style={{ color: m.color }}>{m.value}{m.suffix}</p>
                      </PlanGate>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Fund Analysis key metrics */}
            <div className={`${card} rounded-xl p-5`}>
              <h3 className={`text-sm font-semibold ${text} mb-4`}>Fund Analysis</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {[
                  { label: 'Expense Ratio', fund: `${fund.expenseRatio}%`, cat: '1.34%' },
                  { label: 'Exit Load', fund: `${fund.exitLoad}%`, cat: '0.69%' },
                  { label: 'Sharpe Ratio', fund: `${fund.sharpeRatio}`, cat: '0.33' },
                  { label: 'Fund Size', fund: `₹${fund.fundSize.toLocaleString('en-IN')} Cr`, cat: '—' },
                  { label: 'Min SIP', fund: `₹${fund.minSIP}`, cat: '—' },
                  { label: 'Lock-in', fund: fund.lockIn, cat: '—' },
                ].map((row) => (
                  <div key={row.label} className={`flex items-center justify-between py-1.5 border-b ${rowBorder}`}>
                    <span className={`text-xs ${textSub}`}>{row.label}</span>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className={text}>{row.fund}</span>
                      {row.cat !== '—' && <span className={textMuted}>Cat avg: {row.cat}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Peer Mutual Funds */}
            <div className={`${card} rounded-xl p-5`}>
              <h3 className={`text-sm font-semibold ${text} mb-4`}>Peer Mutual Funds</h3>
              <div className="grid grid-cols-2 gap-3">
                {/* Least Volatile */}
                {leastVolatilePeer && (
                  <div
                    className="rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.01]"
                    style={{ background: lm ? '#F9F9FF' : '#0a0c0e', border: `1px solid ${lm ? '#E0E3E8' : '#1e2838'}` }}
                    onClick={() => navigate(`/mutual-funds/scheme/${leastVolatilePeer.id}`)}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                        Least Volatile
                      </span>
                    </div>
                    <p className={`text-xs font-semibold ${text} line-clamp-2 mb-1`}>{leastVolatilePeer.name}</p>
                    <p className={`text-[10px] ${textMuted} mb-2`}>{leastVolatilePeer.amcName}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-[10px] ${textMuted}`}>1Y Returns</p>
                        <p className="text-sm font-bold text-[#22C55E]">{leastVolatilePeer.returns['1Y']}%</p>
                      </div>
                      <div>
                        <p className={`text-[10px] ${textMuted}`}>NAV</p>
                        <p className={`text-sm font-semibold ${text}`}>₹{leastVolatilePeer.nav.toFixed(2)}</p>
                      </div>
                      <VolatilityBadge level={leastVolatilePeer.volatility} size="sm" />
                    </div>
                  </div>
                )}
                {/* Highest 1Y Returns */}
                {highestReturnPeer && (
                  <div
                    className="rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.01]"
                    style={{ background: lm ? '#F9F9FF' : '#0a0c0e', border: `1px solid ${lm ? '#E0E3E8' : '#1e2838'}` }}
                    onClick={() => navigate(`/mutual-funds/scheme/${highestReturnPeer.id}`)}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                        Highest 1Y Returns
                      </span>
                    </div>
                    <p className={`text-xs font-semibold ${text} line-clamp-2 mb-1`}>{highestReturnPeer.name}</p>
                    <p className={`text-[10px] ${textMuted} mb-2`}>{highestReturnPeer.amcName}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-[10px] ${textMuted}`}>1Y Returns</p>
                        <p className="text-sm font-bold text-[#22C55E]">{highestReturnPeer.returns['1Y']}%</p>
                      </div>
                      <div>
                        <p className={`text-[10px] ${textMuted}`}>NAV</p>
                        <p className={`text-sm font-semibold ${text}`}>₹{highestReturnPeer.nav.toFixed(2)}</p>
                      </div>
                      <VolatilityBadge level={highestReturnPeer.volatility} size="sm" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fund News & Updates */}
            {fundNews.length > 0 && (
              <div className={`${card} rounded-xl p-5`}>
                <div className="flex items-center gap-2 mb-4">
                  <NewsIcon size={15} weight="fill" color={lm ? '#6366f1' : '#d6fd70'} />
                  <h3 className={`text-sm font-semibold ${text}`}>Fund News & Updates</h3>
                  <span
                    className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: lm ? 'rgba(79,70,229,0.08)' : 'rgba(214,253,112,0.1)', color: lm ? '#4f46e5' : '#d6fd70' }}
                  >
                    {fundNews.length} articles
                  </span>
                </div>
                <div className="space-y-2">
                  {fundNews.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.005]"
                      style={{
                        background: lm ? '#F9F9FF' : '#0a0c0e',
                        border: `1px solid ${lm ? '#E0E3E8' : '#1e2838'}`,
                      }}
                      onClick={() => setSelectedNews(item)}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={categoryColors[item.category]}
                        >
                          {item.category}
                        </span>
                        <span className={`text-[10px] ${textMuted} flex items-center gap-1 flex-shrink-0`}>
                          <ClockIcon size={9} weight="regular" />
                          {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className={`text-xs font-medium ${text} leading-snug mb-1 line-clamp-2`}>{item.headline}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] ${textMuted}`}>{item.source}</span>
                        <ExternalLinkIcon size={11} weight="fill" color={lm ? '#9CA3AF' : '#64748b'} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AMC block */}
            <div className={`${card} rounded-xl p-5`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
                    style={{ background: lm ? '#F3F4F6' : '#1e2838', color: lm ? '#4f46e5' : '#d6fd70' }}
                  >
                    {fund.amcName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${text}`}>{fund.amcName}</p>
                    <p className={`text-[10px] ${textMuted}`}>SEBI Reg: AMC/MF/SEBI/2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/reports/mfpms-disclosures')}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    style={{ background: lm ? '#eeedfd' : 'rgba(79,70,229,0.12)', color: '#6366f1' }}
                  >
                    <ReportIcon size={12} weight="fill" />
                    See Factsheet
                  </button>
                  <button
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    style={{ background: lm ? '#F3F4F6' : '#1e2838', color: lm ? '#6B7280' : '#8390a2' }}
                  >
                    <GlobeIcon size={12} weight="fill" />
                    AMC Website
                  </button>
                </div>
              </div>
              <p className={`text-xs ${textSub} leading-relaxed mb-3`}>
                {fund.amcName} is one of India's leading asset management companies. As an AMC, it manages mutual fund
                schemes across equity, debt, and hybrid categories, with a focus on disciplined investment processes
                and long-term wealth creation for investors.
              </p>
              <div className="flex items-center gap-4">
                <div>
                  <p className={`text-[10px] ${textMuted}`}>Schemes Managed</p>
                  <p className={`text-sm font-bold ${text}`}>{8 + mockFunds.filter(f => f.amcName === fund.amcName).length}</p>
                </div>
                <div className={`h-6 w-px`} style={{ background: lm ? '#E0E3E8' : '#1e2838' }} />
                <div>
                  <p className={`text-[10px] ${textMuted}`}>Total AUM</p>
                  <p className={`text-sm font-bold ${text}`}>₹{(fund.fundSize * 4.2 / 100).toFixed(0)}K Cr</p>
                </div>
                <div className={`h-6 w-px`} style={{ background: lm ? '#E0E3E8' : '#1e2838' }} />
                <div className="flex items-center gap-1.5">
                  <BuildingsIcon size={12} weight="fill" color="#8390a2" />
                  <p className={`text-[10px] ${textMuted}`}>Mumbai, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* CTA card */}
            <div className={`${card} rounded-xl p-5 space-y-3`}>
              <div>
                <p className={`text-xs ${textSub}`}>Minimum Investment</p>
                <p className={`text-xl font-semibold ${text}`}>₹{fund.minLumpsum}</p>
              </div>
              <div className="space-y-1.5">
                <p className={`text-[10px] ${textMuted}`}>Suggested SIP amounts</p>
                <div className="flex gap-2">
                  {[500, 1000, 5000].map(amt => (
                    <button
                      key={amt}
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={{ background: lm ? '#F3F4F6' : '#1e2838', color: lm ? '#374151' : '#8390a2' }}
                    >
                      ₹{amt >= 1000 ? `${amt / 1000}K` : amt}
                    </button>
                  ))}
                </div>
              </div>
              <button className="w-full bg-[#d6fd70] hover:bg-[#b8d94a] text-black text-sm font-semibold py-2.5 rounded-lg transition-colors">
                Start SIP
              </button>
              <button className={`w-full border ${dividerColor} hover:border-[#d6fd70]/30 ${text} text-sm font-semibold py-2.5 rounded-lg transition-colors`}>
                Invest Lumpsum
              </button>
              <p className="text-[9px] text-center" style={{ color: lm ? '#9CA3AF' : '#505d6f' }}>
                Min SIP ₹{fund.minSIP} · Lock-in: {fund.lockIn}
              </p>
            </div>

            {/* Riskometer */}
            <div className={`${card} rounded-xl p-5`}>
              <p className={`text-xs font-semibold ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} uppercase tracking-wider mb-3`}>Risk Level</p>
              <div className="flex justify-center">
                <Riskometer level={riskLevel} lm={lm} />
              </div>
              <div className="mt-3 flex justify-around">
                {(['Low', 'Moderate', 'High'] as const).map((lvl) => {
                  const cfg = { Low: '#16a34a', Moderate: '#f59e0b', High: '#ef4444' }
                  const active = RISK_3_MAP[riskLevel]?.label === lvl
                  return (
                    <div key={lvl} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: active ? cfg[lvl] : (lm ? '#E0E3E8' : '#1e2838') }} />
                      <span className="text-[10px]" style={{ color: active ? cfg[lvl] : (lm ? '#6B7280' : '#505d6f'), fontWeight: active ? 700 : 400 }}>{lvl}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Basket upsell */}
            <div
              className="rounded-2xl p-4 cursor-pointer transition-all hover:-translate-y-0.5"
              style={{ background: lm ? 'linear-gradient(135deg, #eeedfd 0%, #f5f3ff 100%)' : 'linear-gradient(135deg, rgba(79,70,229,0.12) 0%, rgba(99,102,241,0.06) 100%)', border: lm ? '1px solid #c7d2fe' : '1px solid rgba(79,70,229,0.2)' }}
              onClick={() => navigate('/mutual-funds/baskets')}
            >
              <div className="flex items-center gap-2 mb-2">
                <BasketUpsellIcon size={14} color={lm ? '#4f46e5' : '#818cf8'} weight="fill" />
                <span className="text-xs font-bold" style={{ color: lm ? '#4f46e5' : '#818cf8' }}>Sahi Baskets</span>
              </div>
              <p className={`text-[11px] leading-relaxed mb-3`} style={{ color: lm ? '#4f46e5' : '#a5b4fc' }}>
                This fund is part of the <span className="font-semibold">Dream Home</span> and <span className="font-semibold">Retirement Corpus</span> baskets. Invest with a goal in mind.
              </p>
              <button className="flex items-center gap-1 text-[11px] font-bold" style={{ color: lm ? '#4f46e5' : '#818cf8' }}>
                Explore Baskets <ArrowRightSmIcon size={11} weight="bold" />
              </button>
            </div>

            {/* Returns table */}
            <div className={`${card} rounded-xl p-5`}>
              <h3 className={`text-sm font-semibold ${text} mb-3`}>Returns</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className={`border-b ${dividerColor}`}>
                    <th className={`text-left ${textMuted} py-1.5`}>Period</th>
                    <th className={`text-right ${textMuted} py-1.5`}>Fund</th>
                    <th className={`text-right ${textMuted} py-1.5`}>Cat Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {(['1Y', '3Y', '5Y'] as const).map((p) => (
                    <tr key={p} className={`border-b ${rowBorder} last:border-b-0`}>
                      <td className={`${textSub} py-2`}>{p} Return</td>
                      <td className="text-right py-2">
                        {p === '1Y' ? (
                          <span className="text-[#22C55E] font-semibold">+{fund.returns[p]}%</span>
                        ) : (
                          <PlanGate requiredTier="pro" compact>
                            <span className="text-[#22C55E] font-semibold">+{fund.returns[p]}%</span>
                          </PlanGate>
                        )}
                      </td>
                      <td className={`text-right py-2 ${textMuted}`}>—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[9px] mt-2" style={{ color: lm ? '#9CA3AF' : '#505d6f' }}>
                Past performance is not indicative of future returns.
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === 'dividends' && (() => {
        const dividends = [
          { date: '2024-12-13', record: '2024-12-16', nav: 42.18, amount: 0.80, type: 'Regular' },
          { date: '2024-09-13', record: '2024-09-16', nav: 40.92, amount: 0.75, type: 'Regular' },
          { date: '2024-06-14', record: '2024-06-17', nav: 39.55, amount: 0.70, type: 'Regular' },
          { date: '2024-03-15', record: '2024-03-18', nav: 37.80, amount: 0.65, type: 'Regular' },
          { date: '2023-12-15', record: '2023-12-18', nav: 36.22, amount: 0.60, type: 'Regular' },
          { date: '2023-09-15', record: '2023-09-18', nav: 34.90, amount: 0.55, type: 'Regular' },
          { date: '2023-06-16', record: '2023-06-19', nav: 33.45, amount: 0.55, type: 'Regular' },
          { date: '2023-03-17', record: '2023-03-20', nav: 31.80, amount: 0.50, type: 'Regular' },
          { date: '2022-12-16', record: '2022-12-19', nav: 30.10, amount: 0.50, type: 'Regular' },
          { date: '2022-09-16', record: '2022-09-19', nav: 28.75, amount: 0.45, type: 'Special' },
          { date: '2022-06-17', record: '2022-06-20', nav: 27.20, amount: 0.45, type: 'Regular' },
          { date: '2022-03-18', record: '2022-03-21', nav: 26.10, amount: 0.40, type: 'Regular' },
        ]
        const totalPaid = dividends.reduce((s, d) => s + d.amount, 0)
        const annualAvg = (totalPaid / (dividends.length / 4)).toFixed(2)
        const yieldPct = ((totalPaid / dividends[0].nav) * 100 / 3).toFixed(2)
        return (
          <div className="grid grid-cols-3 gap-5">
            <div className={`col-span-2 ${card} rounded-xl overflow-hidden`}>
              <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: lm ? '#E0E3E8' : '#1e2838' }}>
                <div className="flex items-center gap-2">
                  <CoinsIcon size={15} color={lm ? '#6366f1' : '#d6fd70'} weight="fill" />
                  <h3 className={`text-sm font-semibold ${text}`}>Dividend History</h3>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold`} style={{ background: lm ? 'rgba(79,70,229,0.08)' : 'rgba(214,253,112,0.1)', color: lm ? '#4f46e5' : '#d6fd70' }}>
                  {dividends.length} payouts · 3 years
                </span>
              </div>
              <div className={`grid grid-cols-[1fr_1fr_80px_80px_70px] gap-3 px-5 py-2 border-b`} style={{ borderColor: lm ? '#E0E3E8' : '#1e2838' }}>
                {['Ex-Date', 'Record Date', 'NAV', 'Amount', 'Type'].map(h => (
                  <span key={h} className={`text-[10px] font-bold uppercase tracking-wider ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'}`}>{h}</span>
                ))}
              </div>
              {dividends.map((d) => (
                <div
                  key={d.date}
                  className={`grid grid-cols-[1fr_1fr_80px_80px_70px] gap-3 px-5 py-2.5 items-center border-b transition-colors ${lm ? 'hover:bg-[#F9F9FF] border-[#F0F0F8]' : 'hover:bg-[#1a2130] border-[#1e2838]'}`}
                >
                  <span className={`text-xs font-medium ${text}`}>{format(new Date(d.date), 'dd MMM yyyy')}</span>
                  <span className={`text-xs ${textSub}`}>{format(new Date(d.record), 'dd MMM yyyy')}</span>
                  <span className={`text-xs ${textSub}`}>₹{d.nav.toFixed(2)}</span>
                  <div className="flex items-center gap-1">
                    <TrendDownIcon size={11} color="#22c55e" weight="bold" />
                    <span className="text-xs font-semibold text-[#22c55e]">₹{d.amount.toFixed(2)}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d.type === 'Special' ? 'bg-amber-500/10 text-amber-500' : (lm ? 'bg-[#F3F4F6] text-[#6B7280]' : 'bg-[#1e2838] text-[#8390a2]')}`}>{d.type}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className={`${card} rounded-xl p-5 space-y-4`}>
                <h3 className={`text-sm font-semibold ${text}`}>Dividend Stats</h3>
                {[
                  { label: '3Y Total Payout', value: `₹${totalPaid.toFixed(2)}` },
                  { label: 'Avg Annual Dividend', value: `₹${annualAvg}` },
                  { label: 'Approx Div Yield', value: `${yieldPct}% p.a.`, accent: true },
                  { label: 'Frequency', value: 'Quarterly' },
                  { label: 'Payout on', value: 'Growth & IDCW' },
                ].map(s => (
                  <div key={s.label} className="flex justify-between items-center">
                    <span className={`text-xs ${textSub}`}>{s.label}</span>
                    <span className={`text-xs font-bold ${s.accent ? (lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]') : text}`}>{s.value}</span>
                  </div>
                ))}
              </div>
              <div className={`${card} rounded-xl p-4`}>
                <p className={`text-[10px] leading-relaxed ${textMuted}`}>
                  Dividends (IDCW) reduce the NAV by the payout amount on the ex-date. The actual yield depends on your purchase NAV. Consider Growth option for long-term compounding — dividends are taxed as income.
                </p>
              </div>
            </div>
          </div>
        )
      })()}

      {tab === 'constituents' && (
        <div className="grid grid-cols-3 gap-5">
          <div className={`col-span-2 ${card} rounded-xl p-5`}>
            <h3 className={`text-sm font-semibold ${text} mb-4`}>Constituents & Weights</h3>
            {fund.constituents ? (
              <div className="space-y-3">
                {fund.constituents.map((sec) => (
                  <div key={sec.sector}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-semibold ${text}`}>{sec.sector}</span>
                      <span className={`text-xs font-semibold ${lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'}`}>{sec.totalWeight}%</span>
                    </div>
                    {sec.holdings.map((h) => (
                      <div key={h.name} className={`flex justify-between py-1 pl-3 border-l ${constituentBorder} ml-1`}>
                        <span className={`text-xs ${textSub}`}>{h.name}</span>
                        <span className={`text-xs ${text}`}>{h.weight}%</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-xs ${textMuted}`}>Constituents data not available for this fund.</p>
            )}
          </div>

          <div className={`${card} rounded-xl p-5`}>
            <h3 className={`text-sm font-semibold ${text} mb-4`}>Holdings Distribution</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={holdingsDist} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70} strokeWidth={0}>
                  {holdingsDist.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {holdingsDist.map((d) => (
                <div key={d.label} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className={`text-xs ${textSub}`}>{d.label}</span>
                  </div>
                  <span className={`text-xs font-semibold ${text}`}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

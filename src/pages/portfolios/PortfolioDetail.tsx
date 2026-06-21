import { useParams, Link } from 'react-router-dom'
import { ArrowLeft as ArrowBackIcon } from '@phosphor-icons/react'
import { TrendUp as TrendingUpIcon } from '@phosphor-icons/react'
import { TrendDown as TrendingDownIcon } from '@phosphor-icons/react'
import { DownloadSimple as FileDownloadIcon } from '@phosphor-icons/react'
import { Warning as WarningIcon } from '@phosphor-icons/react'
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react'
import { PlanGate } from '../../components/ui/PlanGate'
import { mockPortfolios } from '../../data/portfolios'
import { useUIStore } from '../../stores/uiStore'

type PeerFund = {
  id: string
  name: string
  amc: string
  xirr: number
  return1Y: number
  sahiScore: number
  tag: string
}

const PEER_MAP: Record<string, PeerFund[]> = {
  Hybrid: [
    { id: 'ph1', name: 'HDFC Balanced Advantage Fund', amc: 'HDFC Mutual Fund', xirr: 14.2, return1Y: 21.4, sahiScore: 84, tag: 'Dynamic Asset Alloc' },
    { id: 'ph2', name: 'Mirae Asset Hybrid Equity Fund', amc: 'Mirae Asset', xirr: 13.1, return1Y: 19.8, sahiScore: 79, tag: 'Aggressive Hybrid' },
    { id: 'ph3', name: 'Kotak Balanced Advantage Fund', amc: 'Kotak Mutual Fund', xirr: 12.6, return1Y: 18.2, sahiScore: 76, tag: 'Dynamic Asset Alloc' },
  ],
  'Large Cap': [
    { id: 'pl1', name: 'Nippon India Large Cap Fund', amc: 'Nippon India', xirr: 19.4, return1Y: 26.1, sahiScore: 88, tag: 'Large Cap' },
    { id: 'pl2', name: 'HDFC Top 100 Fund', amc: 'HDFC Mutual Fund', xirr: 17.8, return1Y: 24.6, sahiScore: 82, tag: 'Large Cap' },
  ],
  'Mid Cap': [
    { id: 'pm1', name: 'Nippon India Growth Fund', amc: 'Nippon India', xirr: 28.4, return1Y: 34.2, sahiScore: 91, tag: 'Mid Cap' },
    { id: 'pm2', name: 'Kotak Emerging Equity Fund', amc: 'Kotak Mutual Fund', xirr: 26.1, return1Y: 31.8, sahiScore: 86, tag: 'Mid Cap' },
  ],
  Debt: [],
}

function scoreColor(score: number) {
  if (score >= 80) return '#22c55e'
  if (score >= 65) return '#f59e0b'
  return '#ef4444'
}

function formatINR(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
  return `₹${n.toLocaleString('en-IN')}`
}

export function PortfolioDetail() {
  const { id } = useParams()
  const portfolio = mockPortfolios.find((p) => p.id === id) ?? mockPortfolios[0]
  const lm = useUIStore((s) => s.lightMode)

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#6B7280]' : 'text-[#64748b]'
  const chip = lm ? 'bg-[#F3F4F6] text-[#374151]' : 'bg-[#1e2838] text-[#8390a2]'
  const rowHover = lm ? 'hover:bg-[#F9F9FF]' : 'hover:bg-[#1a2130]'
  const rowBorder = lm ? 'border-[#F0F0F8]' : 'border-[#1e2838]'
  const dividerColor = lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <Link to="/mutual-funds/portfolios" className={`${textMuted} hover:${text} transition-colors`}>
          <ArrowBackIcon size={20} weight="bold" />
        </Link>
        <div>
          <h1 className={`text-lg font-semibold ${text}`}>{portfolio.name}</h1>
          <p className={`text-xs ${textSub}`}>Holdings Ledger · {portfolio.holdings.length} funds</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Invested', value: formatINR(portfolio.totalInvested), color: text },
          { label: 'Current Value', value: formatINR(portfolio.currentValue), color: lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]' },
          {
            label: 'Absolute Returns',
            value: `+${formatINR(portfolio.absoluteReturns)} (${portfolio.absoluteReturnsPercent.toFixed(1)}%)`,
            color: 'text-[#22C55E]',
          },
          { label: 'XIRR', value: `${portfolio.xirr}%`, color: 'text-[#22C55E]' },
        ].map((s) => (
          <div key={s.label} className={`${card} rounded-xl p-4`}>
            <p className={`text-xs ${textSub} mb-1 uppercase tracking-wide`}>{s.label}</p>
            <p className={`text-lg font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Benchmark + Sector overview */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* XIRR vs Nifty */}
        <div className={`${card} rounded-xl p-4`}>
          <p className={`text-xs font-semibold ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} uppercase tracking-wider mb-3`}>Portfolio XIRR vs Benchmark</p>
          {(() => {
            const nifty3Y = 14.2
            const alpha = (portfolio.xirr - nifty3Y).toFixed(1)
            const isPositive = Number(alpha) >= 0
            return (
              <div className="flex items-end gap-6">
                <div>
                  <p className={`text-[10px] ${textMuted} mb-0.5`}>Your XIRR</p>
                  <p className="text-2xl font-bold text-[#22C55E]">{portfolio.xirr}%</p>
                </div>
                <div>
                  <p className={`text-[10px] ${textMuted} mb-0.5`}>Nifty 50 (3Y CAGR)</p>
                  <p className={`text-2xl font-bold ${textSub}`}>{nifty3Y}%</p>
                </div>
                <div className="ml-auto">
                  <div
                    className="px-3 py-1.5 rounded-xl text-sm font-bold"
                    style={isPositive
                      ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }
                      : { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                  >
                    {isPositive ? '▲' : '▼'} {Math.abs(Number(alpha))}% alpha
                  </div>
                  <p className={`text-[10px] ${textMuted} text-center mt-1`}>{isPositive ? 'Beating' : 'Lagging'} index</p>
                </div>
              </div>
            )
          })()}
        </div>

        {/* Sector spread */}
        <div className={`${card} rounded-xl p-4`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-semibold ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} uppercase tracking-wider`}>Sector spread</p>
            <button
              onClick={() => window.location.href = '/mutual-funds/overlap'}
              className="text-[10px] font-semibold px-2 py-1 rounded-lg transition-colors"
              style={{ background: lm ? '#eeedfd' : 'rgba(79,70,229,0.15)', color: '#6366f1' }}
            >
              Full analysis →
            </button>
          </div>
          {[
            { name: 'Banking', pct: 24, color: '#4f46e5' },
            { name: 'IT', pct: 18, color: '#0891b2' },
            { name: 'Pharma', pct: 14, color: '#16a34a' },
            { name: 'Auto', pct: 12, color: '#f59e0b' },
            { name: 'Others', pct: 32, color: '#64748b' },
          ].map(s => (
            <div key={s.name} className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] w-16 flex-shrink-0 ${textMuted}`}>{s.name}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: lm ? '#F3F4F6' : '#1e2838' }}>
                <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
              </div>
              <span className={`text-[10px] font-semibold w-7 text-right ${textSub}`}>{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Holdings table */}
      <div className={`${card} rounded-xl overflow-hidden`}>
        <div className={`flex items-center justify-between px-5 py-4 border-b ${dividerColor}`}>
          <h2 className={`text-sm font-semibold ${text}`}>Fund Holdings</h2>
          <PlanGate requiredTier="pro" compact>
            <button className={`flex items-center gap-1.5 text-xs ${textSub} hover:${text} border ${dividerColor} hover:border-[#3c4653] px-3 py-1.5 rounded-lg transition-all`}>
              <FileDownloadIcon size={14} weight="fill" />
              Export
            </button>
          </PlanGate>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${dividerColor}`}>
                {['Fund', 'Category', 'Units', 'Avg NAV', 'Current NAV', 'Invested', 'Current Value', 'Gain/Loss', 'XIRR'].map((h) => (
                  <th key={h} className={`text-left text-xs font-medium ${textMuted} px-4 py-3 whitespace-nowrap`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {portfolio.holdings.map((h, i) => (
                <tr
                  key={h.fundId}
                  className={`border-b ${rowBorder} ${rowHover} transition-colors ${
                    i === portfolio.holdings.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className={`text-xs font-semibold ${text} leading-tight line-clamp-2 max-w-[180px]`}>
                        {h.fundName}
                      </p>
                      <p className={`text-xs ${textMuted} mt-0.5`}>{h.amcName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs ${chip} px-2 py-0.5 rounded-full whitespace-nowrap`}>
                      {h.category}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-xs ${text} whitespace-nowrap`}>{h.units.toFixed(3)}</td>
                  <td className={`px-4 py-3 text-xs ${text} whitespace-nowrap`}>₹{h.avgNAV.toFixed(2)}</td>
                  <td className={`px-4 py-3 text-xs ${text} whitespace-nowrap`}>₹{h.currentNAV.toFixed(2)}</td>
                  <td className={`px-4 py-3 text-xs ${text} whitespace-nowrap`}>{formatINR(h.investedAmount)}</td>
                  <td className={`px-4 py-3 text-xs font-semibold ${lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'} whitespace-nowrap`}>
                    {formatINR(h.currentValue)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className={`flex items-center gap-1 text-xs font-semibold ${h.gainLoss >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                      {h.gainLoss >= 0 ? (
                        <TrendingUpIcon size={13} weight="fill" />
                      ) : (
                        <TrendingDownIcon size={13} weight="fill" />
                      )}
                      {h.gainLoss >= 0 ? '+' : ''}{formatINR(h.gainLoss)}
                      <span className="text-[10px]">({h.gainLossPercent.toFixed(1)}%)</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${h.xirr >= 12 ? 'text-[#22C55E]' : h.xirr >= 8 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                      {h.xirr}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Peer Recommendations — shown when any holding is lagging */}
      {(() => {
        const XIRR_THRESHOLDS: Record<string, number> = { Debt: -Infinity, Hybrid: 10, 'Large Cap': 12, 'Mid Cap': 14, 'Flexi Cap': 12, 'Small Cap': 14 }
        const laggingFunds = portfolio.holdings.filter(h => {
          const threshold = XIRR_THRESHOLDS[h.category] ?? 12
          return h.xirr < threshold && h.category !== 'Debt'
        })
        if (laggingFunds.length === 0) return null

        return (
          <div className={`${card} rounded-xl overflow-hidden`}>
            {/* Header */}
            <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${lm ? 'border-[#FDE68A] bg-[#FFFBEB]' : 'border-[#422006]/60 bg-[#1c1409]'}`}>
              <WarningIcon size={16} weight="fill" className="text-[#f59e0b] flex-shrink-0" />
              <div className="flex-1">
                <p className={`text-sm font-semibold ${lm ? 'text-[#92400E]' : 'text-[#fcd34d]'}`}>
                  {laggingFunds.length} fund{laggingFunds.length > 1 ? 's' : ''} may be underperforming their category peers
                </p>
                <p className={`text-xs mt-0.5 ${lm ? 'text-[#B45309]' : 'text-[#a16207]'}`}>
                  Research-based peer comparison · Not personalised advice
                </p>
              </div>
            </div>

            {/* One block per lagging fund */}
            {laggingFunds.map((h, idx) => {
              const peers = PEER_MAP[h.category] ?? []
              const visiblePeers = peers.slice(0, 1)
              const gatedPeers = peers.slice(1)
              return (
                <div key={h.fundId} className={idx < laggingFunds.length - 1 ? `border-b ${lm ? 'border-[#F0F0F8]' : 'border-[#1e2838]'}` : ''}>
                  {/* Lagging fund row */}
                  <div className={`px-5 py-3 flex items-center gap-3 ${lm ? 'bg-[#FAFAFA]' : 'bg-[#0f1318]'}`}>
                    <div className="flex-1">
                      <p className={`text-xs font-semibold ${text} leading-tight`}>{h.fundName}</p>
                      <p className={`text-[10px] mt-0.5 ${textMuted}`}>{h.amcName} · {h.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#ef4444]">{h.xirr}% XIRR</p>
                      <p className={`text-[10px] ${textMuted}`}>Your fund</p>
                    </div>
                    <TrendingDownIcon size={16} weight="fill" className="text-[#ef4444]" />
                  </div>

                  {/* Peer cards */}
                  <div className="px-5 py-3 space-y-2">
                    <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'}`}>Category peers with better Sahi Score</p>
                    {visiblePeers.map(peer => (
                      <div key={peer.id} className={`flex items-center gap-3 p-3 rounded-xl border ${lm ? 'border-[#E8F5E9] bg-[#F0FFF0]' : 'border-[#14291a] bg-[#0c1a0f]'}`}>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold ${text} leading-tight truncate`}>{peer.name}</p>
                          <p className={`text-[10px] mt-0.5 ${textMuted}`}>{peer.amc} · {peer.tag}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-xs font-bold text-[#22c55e]">{peer.xirr}% XIRR</p>
                            <p className={`text-[10px] ${textMuted}`}>{peer.return1Y}% 1Y</p>
                          </div>
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                            style={{ background: scoreColor(peer.sahiScore) }}
                          >
                            {peer.sahiScore}
                          </div>
                          <Link
                            to={`/mutual-funds/compare?a=${h.fundId}&b=${peer.id}`}
                            className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                            style={{ background: lm ? '#eeedfd' : 'rgba(79,70,229,0.15)', color: '#6366f1' }}
                          >
                            Compare <ArrowRightIcon size={10} weight="bold" />
                          </Link>
                        </div>
                      </div>
                    ))}

                    {/* PRO gate for remaining peers */}
                    {gatedPeers.length > 0 && (
                      <PlanGate requiredTier="pro" compact>
                        <div className="space-y-2">
                          {gatedPeers.map(peer => (
                            <div key={peer.id} className={`flex items-center gap-3 p-3 rounded-xl border ${lm ? 'border-[#E8F5E9] bg-[#F0FFF0]' : 'border-[#14291a] bg-[#0c1a0f]'}`}>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-semibold ${text} leading-tight truncate`}>{peer.name}</p>
                                <p className={`text-[10px] mt-0.5 ${textMuted}`}>{peer.amc} · {peer.tag}</p>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <div className="text-right">
                                  <p className="text-xs font-bold text-[#22c55e]">{peer.xirr}% XIRR</p>
                                  <p className={`text-[10px] ${textMuted}`}>{peer.return1Y}% 1Y</p>
                                </div>
                                <div
                                  className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                                  style={{ background: scoreColor(peer.sahiScore) }}
                                >
                                  {peer.sahiScore}
                                </div>
                                <Link
                                  to={`/mutual-funds/compare?a=${h.fundId}&b=${peer.id}`}
                                  className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                                  style={{ background: lm ? '#eeedfd' : 'rgba(79,70,229,0.15)', color: '#6366f1' }}
                                >
                                  Compare <ArrowRightIcon size={10} weight="bold" />
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </PlanGate>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })()}
    </div>
  )
}

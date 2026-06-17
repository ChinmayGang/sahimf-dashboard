import { useParams, Link } from 'react-router-dom'
import { ArrowLeft as ArrowBackIcon } from '@phosphor-icons/react'
import { TrendUp as TrendingUpIcon } from '@phosphor-icons/react'
import { TrendDown as TrendingDownIcon } from '@phosphor-icons/react'
import { DownloadSimple as FileDownloadIcon } from '@phosphor-icons/react'
import { PlanGate } from '../../components/ui/PlanGate'
import { mockPortfolios } from '../../data/portfolios'
import { useUIStore } from '../../stores/uiStore'

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
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'
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
          <p className={`text-xs font-semibold ${textMuted} uppercase tracking-wider mb-3`}>Portfolio XIRR vs Benchmark</p>
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
            <p className={`text-xs font-semibold ${textMuted} uppercase tracking-wider`}>Sector spread</p>
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
              <FileDownloadIcon size={14} weight="regular" />
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
                  <td className="px-4 py-3 text-xs font-semibold text-[#d6fd70] whitespace-nowrap">
                    {formatINR(h.currentValue)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className={`flex items-center gap-1 text-xs font-semibold ${h.gainLoss >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                      {h.gainLoss >= 0 ? (
                        <TrendingUpIcon size={13} weight="regular" />
                      ) : (
                        <TrendingDownIcon size={13} weight="regular" />
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
    </div>
  )
}

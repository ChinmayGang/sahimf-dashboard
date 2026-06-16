import { useParams, Link } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
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

  const card = lm ? 'bg-white border border-[#E8E8F0] shadow-sm' : 'bg-[#1A1A1A] border border-[#2A2A2A]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#A0A0A0]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#606060]'
  const chip = lm ? 'bg-[#F3F4F6] text-[#374151]' : 'bg-[#2A2A2A] text-[#A0A0A0]'
  const rowHover = lm ? 'hover:bg-[#F9F9FF]' : 'hover:bg-[#1E1E1E]'
  const rowBorder = lm ? 'border-[#F0F0F8]' : 'border-[#1E1E1E]'
  const dividerColor = lm ? 'border-[#E8E8F0]' : 'border-[#2A2A2A]'

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <Link to="/mutual-funds/portfolios" className={`${textMuted} hover:${text} transition-colors`}>
          <ArrowBackIcon sx={{ fontSize: 20 }} />
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
          { label: 'Current Value', value: formatINR(portfolio.currentValue), color: 'text-[#C5F135]' },
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

      {/* Holdings table */}
      <div className={`${card} rounded-xl overflow-hidden`}>
        <div className={`flex items-center justify-between px-5 py-4 border-b ${dividerColor}`}>
          <h2 className={`text-sm font-semibold ${text}`}>Fund Holdings</h2>
          <PlanGate requiredTier="pro" compact>
            <button className={`flex items-center gap-1.5 text-xs ${textSub} hover:${text} border ${dividerColor} hover:border-[#3A3A3A] px-3 py-1.5 rounded-lg transition-all`}>
              <FileDownloadIcon sx={{ fontSize: 14 }} />
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
                  <td className="px-4 py-3 text-xs font-semibold text-[#C5F135] whitespace-nowrap">
                    {formatINR(h.currentValue)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className={`flex items-center gap-1 text-xs font-semibold ${h.gainLoss >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                      {h.gainLoss >= 0 ? (
                        <TrendingUpIcon sx={{ fontSize: 13 }} />
                      ) : (
                        <TrendingDownIcon sx={{ fontSize: 13 }} />
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

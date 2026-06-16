import {
  AreaChart, Area, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { format } from 'date-fns'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import AddIcon from '@mui/icons-material/Add'
import SyncAltIcon from '@mui/icons-material/SyncAlt'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '../../stores/uiStore'
import { mockPortfolios, getMockPortfolioHistory } from '../../data/portfolios'

const portfolioHistory = getMockPortfolioHistory()

const totalInvested = mockPortfolios.reduce((s, p) => s + p.totalInvested, 0)
const totalCurrent = mockPortfolios.reduce((s, p) => s + p.currentValue, 0)
const totalGain = totalCurrent - totalInvested
const totalGainPct = (totalGain / totalInvested) * 100

const allocationData = [
  { name: 'Equity', value: 71, color: '#7B2FBE' },
  { name: 'Hybrid', value: 16, color: '#C5F135' },
  { name: 'Debt', value: 13, color: '#22C55E' },
]

const indices = [
  { name: 'NIFTY 50', value: '24,780.25', change: '+0.42%', up: true },
  { name: 'SENSEX', value: '81,562.10', change: '+0.38%', up: true },
  { name: 'NIFTY MID 150', value: '18,240.80', change: '-0.12%', up: false },
  { name: 'GOLD', value: '₹73,450', change: '+0.08%', up: true },
  { name: 'USD/INR', value: '83.54', change: '-0.06%', up: false },
]

function formatINR(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
  return `₹${n.toLocaleString('en-IN')}`
}

export function Overview() {
  const lightMode = useUIStore((s) => s.lightMode)
  const navigate = useNavigate()

  const card = lightMode
    ? 'bg-white border border-[#E8E8F0] shadow-sm'
    : 'bg-[#1A1A1A] border border-[#2A2A2A]'
  const text = lightMode ? 'text-[#111827]' : 'text-white'
  const textSub = lightMode ? 'text-[#6B7280]' : 'text-[#A0A0A0]'
  const textMuted = lightMode ? 'text-[#9CA3AF]' : 'text-[#606060]'
  const pill = lightMode ? 'bg-[#F3F0FF] text-[#7B2FBE] border border-[#E0D9FF]' : 'bg-[#2A2A2A] text-[#A0A0A0] border border-[#333]'
  const tickerCard = lightMode
    ? 'bg-white border border-[#E8E8F0] shadow-sm'
    : 'bg-[#1A1A1A] border border-[#2A2A2A]'
  const chartGrid = lightMode ? '#E8E8F0' : '#1E1E1E'
  const chartTick = lightMode ? '#9CA3AF' : '#606060'
  const tooltipStyle = {
    background: lightMode ? '#fff' : '#1A1A1A',
    border: `1px solid ${lightMode ? '#E8E8F0' : '#2A2A2A'}`,
    borderRadius: 8,
    fontSize: 12,
    color: lightMode ? '#111827' : '#fff',
  }

  return (
    <div className="p-5 space-y-4 max-w-7xl mx-auto">
      {/* Market indices ticker */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {indices.map((idx) => (
          <div
            key={idx.name}
            className={`flex items-center gap-2.5 ${tickerCard} rounded-xl px-3 py-2 flex-shrink-0`}
          >
            <span className={`text-xs font-medium ${textMuted}`}>{idx.name}</span>
            <span className={`text-xs font-bold ${text}`}>{idx.value}</span>
            <span className={`text-xs font-semibold flex items-center gap-0.5 ${idx.up ? 'text-[#16A34A]' : 'text-[#EF4444]'}`}>
              {idx.up
                ? <ArrowUpwardIcon sx={{ fontSize: 10 }} />
                : <ArrowDownwardIcon sx={{ fontSize: 10 }} />}
              {idx.change}
            </span>
          </div>
        ))}
      </div>

      {/* Net Worth Hero */}
      <div className={`${card} rounded-2xl p-5`}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className={`text-xs font-medium ${textMuted} mb-1`}>Net Worth · Mutual Funds</p>
            <p className={`text-3xl font-black ${text}`}>{formatINR(totalCurrent)}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                +{totalGainPct.toFixed(2)}%
              </span>
              <span className={`text-xs ${textMuted}`}>+{formatINR(totalGain)} overall</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(['6M', '1Y', '2Y', 'All'] as const).map((p) => (
              <button
                key={p}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors font-medium ${
                  p === '2Y'
                    ? 'bg-[#7B2FBE] text-white'
                    : lightMode
                    ? 'text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6]'
                    : 'text-[#A0A0A0] hover:text-white hover:bg-[#2A2A2A]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={portfolioHistory} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7B2FBE" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#7B2FBE" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C5F135" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#C5F135" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: chartTick }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => format(new Date(v), 'MMM yy')}
              interval={4}
            />
            <YAxis hide />
            <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} vertical={false} />
            <Tooltip contentStyle={tooltipStyle}
              labelFormatter={(v) => format(new Date(v as string), 'd MMM yyyy')}
              formatter={(v, name) => [formatINR(Number(v)), name === 'invested' ? 'Invested' : 'Current Value']}
            />
            <Area type="monotone" dataKey="invested" stroke="#7B2FBE" strokeWidth={1.5} fill="url(#investedGrad)" dot={false} />
            <Area type="monotone" dataKey="current" stroke="#C5F135" strokeWidth={2.5} fill="url(#currentGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>

        <div className="flex items-center justify-between pt-3 mt-1 border-t" style={{ borderColor: lightMode ? '#E8E8F0' : '#2A2A2A' }}>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#7B2FBE] rounded inline-block" />
              <span className={`text-xs ${textMuted}`}>Invested · {formatINR(totalInvested)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#C5F135] rounded inline-block" />
              <span className={`text-xs ${textMuted}`}>Current · {formatINR(totalCurrent)}</span>
            </div>
          </div>
          <span className={`text-xs font-semibold ${lightMode ? 'text-[#7B2FBE]' : 'text-[#C5F135]'}`}>
            XIRR 19.4% p.a.
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Invested', value: formatINR(totalInvested), icon: <AccountBalanceIcon sx={{ fontSize: 16 }} />, color: '#7B2FBE' },
          { label: 'Current Value', value: formatINR(totalCurrent), icon: <TrendingUpIcon sx={{ fontSize: 16 }} />, color: '#C5F135', accent: true },
          { label: 'Total Gain', value: `+${formatINR(totalGain)}`, sub: `+${totalGainPct.toFixed(1)}%`, icon: <ShowChartIcon sx={{ fontSize: 16 }} />, color: '#16A34A' },
          { label: 'Portfolio XIRR', value: '19.4%', sub: 'Annualised returns', icon: <ShowChartIcon sx={{ fontSize: 16 }} />, color: '#7B2FBE' },
        ].map((s) => (
          <div key={s.label} className={`${card} rounded-xl px-4 py-3.5`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-xs ${textMuted}`}>{s.label}</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18`, color: s.color }}>
                {s.icon}
              </div>
            </div>
            <p className={`text-base font-bold ${s.accent ? 'text-[#C5F135]' : text}`} style={s.accent && lightMode ? { color: '#7B2FBE' } : {}}>
              {s.value}
            </p>
            {s.sub && <p className="text-xs text-[#16A34A] font-medium mt-0.5">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Portfolios + Allocation */}
      <div className="grid grid-cols-3 gap-4">
        {/* My Portfolios */}
        <div className="col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className={`text-sm font-bold ${text}`}>My Portfolios</h2>
            <button
              onClick={() => navigate('/mutual-funds/portfolios')}
              className={`flex items-center gap-1 text-xs font-semibold ${lightMode ? 'text-[#7B2FBE] hover:text-[#6D28D9]' : 'text-[#C5F135] hover:text-[#A8D020]'} transition-colors`}
            >
              <AddIcon sx={{ fontSize: 14 }} />
              Add Portfolio
            </button>
          </div>
          <div className="space-y-2">
            {mockPortfolios.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/mutual-funds/portfolios/${p.id}`)}
                className={`${card} rounded-xl p-4 hover:border-[#7B2FBE]/30 transition-all cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className={`text-sm font-semibold ${text} group-hover:text-[#7B2FBE] transition-colors`}>{p.name}</h3>
                    <p className={`text-xs ${textMuted}`}>{p.holdings.length} funds · Direct Growth</p>
                  </div>
                  <span className="text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-2.5 py-1 rounded-full">
                    XIRR {p.xirr}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-[11px] ${textMuted}`}>Invested</p>
                    <p className={`text-sm font-semibold ${text}`}>{formatINR(p.totalInvested)}</p>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className={`h-1.5 rounded-full ${lightMode ? 'bg-[#E8E8F0]' : 'bg-[#2A2A2A]'}`}>
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${Math.min((p.currentValue / p.totalInvested) * 60, 100)}%`, background: '#C5F135' }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[11px] ${textMuted}`}>Current</p>
                    <p className={`text-sm font-semibold ${lightMode ? 'text-[#7B2FBE]' : 'text-[#C5F135]'}`}>{formatINR(p.currentValue)}</p>
                    <p className="text-xs text-[#16A34A] font-medium">+{p.absoluteReturnsPercent.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Allocation */}
        <div className={`${card} rounded-xl p-5 flex flex-col`}>
          <h2 className={`text-sm font-bold ${text} mb-0.5`}>Asset Allocation</h2>
          <p className={`text-xs ${textMuted} mb-3`}>Across all portfolios</p>
          <div className="flex justify-center mb-4">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={allocationData} cx="50%" cy="50%" innerRadius={42} outerRadius={64} dataKey="value" strokeWidth={0}>
                  {allocationData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2.5 flex-1">
            {allocationData.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className={`text-xs ${textSub}`}>{d.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-16 h-1 rounded-full ${lightMode ? 'bg-[#E8E8F0]' : 'bg-[#2A2A2A]'}`}>
                    <div className="h-1 rounded-full" style={{ width: `${d.value}%`, background: d.color }} />
                  </div>
                  <span className={`text-xs font-bold w-7 text-right ${text}`}>{d.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sahi MF Funds CTA */}
      <div
        className="rounded-2xl p-5 flex items-center gap-4 cursor-pointer group"
        style={{ background: 'linear-gradient(135deg, #7B2FBE 0%, #9333EA 50%, #A855F7 100%)' }}
        onClick={() => navigate('/mutual-funds/explore')}
      >
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
          <AutoAwesomeIcon sx={{ fontSize: 20, color: '#C5F135' }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">Explore Sahi MF Funds</p>
          <p className="text-xs text-white/70 mt-0.5">
            Research-driven curated baskets built by the SahiMF desk. Zero commission. Direct plans only.
          </p>
        </div>
        <div className="flex-shrink-0 bg-[#C5F135] text-black text-xs font-bold px-4 py-2 rounded-xl group-hover:bg-[#D4FF40] transition-colors">
          Explore →
        </div>
      </div>

      {/* CAS Import banner */}
      <div className={`${card} rounded-xl p-4 flex items-center gap-4`}>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: lightMode ? '#F3F0FF' : '#C5F135/10' }}
        >
          <SyncAltIcon sx={{ fontSize: 20, color: lightMode ? '#7B2FBE' : '#C5F135' }} />
        </div>
        <div className="flex-1">
          <p className={`text-sm font-semibold ${text}`}>Import your CAS statement</p>
          <p className={`text-xs ${textMuted} mt-0.5`}>Sync your complete MF portfolio from CAMS or KFintech in one click</p>
        </div>
        <button
          className="flex-shrink-0 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          style={{ background: lightMode ? '#7B2FBE' : '#C5F135', color: lightMode ? '#fff' : '#000' }}
        >
          Sync CAS
        </button>
      </div>

      {/* Quick nav pills */}
      <div className="flex gap-2 flex-wrap pb-2">
        {[
          { label: '📊 MF Scorecard', path: '/mutual-funds/scorecard' },
          { label: '🔍 Overlap Lens', path: '/mutual-funds/overlap' },
          { label: '⚖️ Fund Comparison', path: '/mutual-funds/compare' },
          { label: '🧮 SIP Calculator', path: '/mutual-funds/tools/sip' },
          { label: '📋 Tax Report', path: '/mutual-funds/reports/tax' },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${pill}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}


import {
  AreaChart, Area, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis,
} from 'recharts'
import { format } from 'date-fns'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import AddIcon from '@mui/icons-material/Add'
import SyncAltIcon from '@mui/icons-material/SyncAlt'
import { StatCard } from '../../components/ui/StatCard'
import { mockPortfolios, getMockPortfolioHistory } from '../../data/portfolios'

const portfolioHistory = getMockPortfolioHistory()

const totalInvested = mockPortfolios.reduce((s, p) => s + p.totalInvested, 0)
const totalCurrent = mockPortfolios.reduce((s, p) => s + p.currentValue, 0)
const totalGain = totalCurrent - totalInvested
const totalGainPct = (totalGain / totalInvested) * 100

const allocationData = [
  { name: 'Equity', value: 71, color: '#C5F135' },
  { name: 'Hybrid', value: 16, color: '#7B2FBE' },
  { name: 'Debt', value: 13, color: '#22C55E' },
]

const indices = [
  { name: 'NIFTY 50', value: '24,780.25', change: '+0.42%', up: true },
  { name: 'SENSEX', value: '81,562.10', change: '+0.38%', up: true },
  { name: 'NIFTY MID 150', value: '18,240.80', change: '-0.12%', up: false },
  { name: 'GOLD', value: '₹73,450', change: '+0.08%', up: true },
]

function formatINR(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
  return `₹${n.toLocaleString('en-IN')}`
}

export function Overview() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Market indices ticker */}
      <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
        {indices.map((idx) => (
          <div key={idx.name} className="flex items-center gap-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 flex-shrink-0">
            <span className="text-xs text-[#A0A0A0] font-medium">{idx.name}</span>
            <span className="text-xs font-semibold text-white">{idx.value}</span>
            <span className={`text-xs font-medium ${idx.up ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {idx.change}
            </span>
          </div>
        ))}
      </div>

      {/* Main stats row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Total Invested"
          value={formatINR(totalInvested)}
          icon={<AccountBalanceIcon sx={{ fontSize: 16 }} />}
        />
        <StatCard
          label="Current Value"
          value={formatINR(totalCurrent)}
          change={totalGainPct}
          changeLabel="overall"
          accent
          icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
        />
        <StatCard
          label="Total Gain"
          value={formatINR(totalGain)}
          subValue={`+${totalGainPct.toFixed(2)}%`}
          icon={<ShowChartIcon sx={{ fontSize: 16 }} />}
        />
        <StatCard
          label="Portfolio XIRR"
          value="19.4%"
          subValue="Annualised returns"
          change={19.4}
          icon={<ShowChartIcon sx={{ fontSize: 16 }} />}
        />
      </div>

      {/* Portfolio chart + Allocation */}
      <div className="grid grid-cols-3 gap-4">
        {/* Portfolio value chart */}
        <div className="col-span-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Portfolio Value</h2>
              <p className="text-xs text-[#A0A0A0]">Invested vs Current over time</p>
            </div>
            <div className="flex gap-2">
              {['6M', '1Y', '2Y', 'All'].map((p) => (
                <button
                  key={p}
                  className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                    p === '2Y'
                      ? 'bg-[#C5F135] text-black font-semibold'
                      : 'text-[#A0A0A0] hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={portfolioHistory} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7B2FBE" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7B2FBE" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C5F135" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C5F135" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#606060' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => format(new Date(v), 'MMM yy')}
                interval={4}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8, fontSize: 12 }}
                labelFormatter={(v) => format(new Date(v as string), 'd MMM yyyy')}
                formatter={(v, name) => [formatINR(Number(v)), name === 'invested' ? 'Invested' : 'Current Value']}
              />
              <Area type="monotone" dataKey="invested" stroke="#7B2FBE" strokeWidth={1.5} fill="url(#investedGrad)" />
              <Area type="monotone" dataKey="current" stroke="#C5F135" strokeWidth={2} fill="url(#currentGrad)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#7B2FBE] rounded" />
              <span className="text-xs text-[#A0A0A0]">Invested</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#C5F135] rounded" />
              <span className="text-xs text-[#A0A0A0]">Current Value</span>
            </div>
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-1">Asset Allocation</h2>
          <p className="text-xs text-[#A0A0A0] mb-4">Across all portfolios</p>
          <div className="flex justify-center mb-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {allocationData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => [`${v}%`]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {allocationData.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-xs text-[#A0A0A0]">{d.name}</span>
                </div>
                <span className="text-xs font-semibold text-white">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">My Portfolios</h2>
          <button className="flex items-center gap-1 text-xs text-[#C5F135] hover:text-[#A8D020] transition-colors font-medium">
            <AddIcon sx={{ fontSize: 14 }} />
            Add Portfolio
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {mockPortfolios.map((p) => (
            <div
              key={p.id}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 hover:border-[#C5F135]/30 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">{p.name}</h3>
                  <p className="text-xs text-[#A0A0A0]">{p.holdings.length} funds</p>
                </div>
                <span className="text-xs bg-[#22C55E]/10 text-[#22C55E] px-2 py-0.5 rounded-full font-medium">
                  XIRR {p.xirr}%
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-[#A0A0A0]">Invested</p>
                  <p className="text-sm font-semibold text-white">{formatINR(p.totalInvested)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#A0A0A0]">Current</p>
                  <p className="text-sm font-semibold text-[#C5F135]">{formatINR(p.currentValue)}</p>
                  <p className="text-xs text-[#22C55E]">+{p.absoluteReturnsPercent.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CAS Import banner */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#C5F135]/10 flex items-center justify-center flex-shrink-0">
          <SyncAltIcon sx={{ fontSize: 20, color: '#C5F135' }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Import your CAS statement</p>
          <p className="text-xs text-[#A0A0A0]">
            Sync your complete MF portfolio from CAMS or KFintech in one click
          </p>
        </div>
        <button className="flex-shrink-0 bg-[#C5F135] hover:bg-[#A8D020] text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          Sync CAS
        </button>
      </div>
    </div>
  )
}

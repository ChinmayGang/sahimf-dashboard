import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import TuneIcon from '@mui/icons-material/Tune'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { VolatilityBadge } from '../../components/ui/VolatilityBadge'
import { PlanGate } from '../../components/ui/PlanGate'
import { mockFunds } from '../../data/funds'

const categories = [
  { label: 'Equity', children: ['Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'Multi Cap', 'Sectoral', 'Thematic', 'ELSS'] },
  { label: 'Debt', children: ['Liquid', 'Overnight', 'Ultra Short', 'Short Duration', 'Medium Duration', 'Long Duration', 'Gilt', 'Credit Risk'] },
  { label: 'Hybrid', children: ['Aggressive Hybrid', 'Balanced Advantage', 'Multi Asset', 'Arbitrage'] },
  { label: 'Index / ETF', children: ['Nifty 50', 'Nifty Next 50', 'Sensex', 'Nifty Midcap 150'] },
]

const amcList = ['Mirae Asset', 'PPFAS', 'DSP', 'Axis', 'HDFC', 'SBI', 'ICICI Prudential', 'Kotak', 'Nippon']

const sortOptions = ['Popularity', '1Y Returns ↑', '1Y Returns ↓', 'Expense Ratio ↑', 'Sharpe Ratio ↓', 'Fund Size ↓']

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-[#1E1E1E] pb-3 mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-2"
      >
        {title}
        {open ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
      </button>
      {open && children}
    </div>
  )
}

export function SearchSchemes() {
  const [query, setQuery] = useState('')
  const [selectedCats, setSelectedCats] = useState<string[]>([])
  const [selectedVolatility, setSelectedVolatility] = useState<string[]>([])
  const [selectedAMC, setSelectedAMC] = useState<string[]>([])
  const [expenseMax, setExpenseMax] = useState(2.5)
  const [sortBy, setSortBy] = useState('Popularity')
  const [openCats, setOpenCats] = useState<string[]>(['Equity'])

  const toggleCat = (cat: string) => setSelectedCats((p) => p.includes(cat) ? p.filter((c) => c !== cat) : [...p, cat])
  const toggleVol = (v: string) => setSelectedVolatility((p) => p.includes(v) ? p.filter((c) => c !== v) : [...p, v])
  const toggleAMC = (a: string) => setSelectedAMC((p) => p.includes(a) ? p.filter((c) => c !== a) : [...p, a])

  const filtered = useMemo(() => {
    return mockFunds.filter((f) => {
      if (query && !f.name.toLowerCase().includes(query.toLowerCase()) && !f.amcName.toLowerCase().includes(query.toLowerCase())) return false
      if (selectedCats.length && !selectedCats.some((c) => f.category === c || f.subCategory === c)) return false
      if (selectedVolatility.length && !selectedVolatility.includes(f.volatility)) return false
      if (selectedAMC.length && !selectedAMC.some((a) => f.amcName.includes(a))) return false
      if (f.expenseRatio > expenseMax) return false
      return true
    })
  }, [query, selectedCats, selectedVolatility, selectedAMC, expenseMax])

  const activeFilterCount = selectedCats.length + selectedVolatility.length + selectedAMC.length

  return (
    <div className="flex h-full">
      {/* Filter Sidebar */}
      <aside className="w-60 flex-shrink-0 border-r border-[#1E1E1E] overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
            <TuneIcon sx={{ fontSize: 16 }} />
            Filters
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={() => { setSelectedCats([]); setSelectedVolatility([]); setSelectedAMC([]) }}
              className="text-xs text-[#C5F135] hover:text-[#A8D020]"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Category */}
        <FilterSection title="Category">
          {categories.map((cat) => (
            <div key={cat.label} className="mb-1">
              <button
                onClick={() => setOpenCats((p) => p.includes(cat.label) ? p.filter((c) => c !== cat.label) : [...p, cat.label])}
                className="flex items-center justify-between w-full text-xs text-[#A0A0A0] hover:text-white py-1 transition-colors"
              >
                <span className="font-medium">{cat.label}</span>
                {openCats.includes(cat.label) ? <ExpandLessIcon sx={{ fontSize: 13 }} /> : <ExpandMoreIcon sx={{ fontSize: 13 }} />}
              </button>
              {openCats.includes(cat.label) && (
                <div className="ml-2 space-y-0.5">
                  {cat.children.map((sub) => (
                    <label key={sub} className="flex items-center gap-2 cursor-pointer py-0.5 group">
                      <input
                        type="checkbox"
                        checked={selectedCats.includes(sub)}
                        onChange={() => toggleCat(sub)}
                        className="accent-[#C5F135] w-3 h-3"
                      />
                      <span className={`text-xs transition-colors ${selectedCats.includes(sub) ? 'text-[#C5F135]' : 'text-[#A0A0A0] group-hover:text-white'}`}>
                        {sub}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </FilterSection>

        {/* Volatility */}
        <FilterSection title="Volatility">
          {(['Low', 'Medium', 'High'] as const).map((v) => (
            <label key={v} className="flex items-center gap-2 cursor-pointer py-1 group">
              <input
                type="checkbox"
                checked={selectedVolatility.includes(v)}
                onChange={() => toggleVol(v)}
                className="accent-[#C5F135] w-3 h-3"
              />
              <VolatilityBadge level={v} />
            </label>
          ))}
        </FilterSection>

        {/* Expense Ratio */}
        <FilterSection title="Expense Ratio">
          <div className="space-y-2">
            <input
              type="range"
              min={0}
              max={2.5}
              step={0.1}
              value={expenseMax}
              onChange={(e) => setExpenseMax(Number(e.target.value))}
              className="w-full accent-[#C5F135]"
            />
            <div className="flex justify-between text-xs text-[#606060]">
              <span>0%</span>
              <span className="text-[#C5F135] font-medium">Up to {expenseMax.toFixed(1)}%</span>
              <span>2.5%</span>
            </div>
          </div>
        </FilterSection>

        {/* AMC */}
        <FilterSection title="AMC" defaultOpen={false}>
          <div className="space-y-0.5">
            {amcList.map((a) => (
              <label key={a} className="flex items-center gap-2 cursor-pointer py-0.5 group">
                <input
                  type="checkbox"
                  checked={selectedAMC.includes(a)}
                  onChange={() => toggleAMC(a)}
                  className="accent-[#C5F135] w-3 h-3"
                />
                <span className={`text-xs transition-colors ${selectedAMC.includes(a) ? 'text-[#C5F135]' : 'text-[#A0A0A0] group-hover:text-white'}`}>
                  {a}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search + sort bar */}
        <div className="flex items-center gap-3 p-4 border-b border-[#1E1E1E] flex-shrink-0">
          <div className="relative flex-1 max-w-md">
            <SearchIcon sx={{ fontSize: 16, color: '#606060' }} className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by fund name, AMC..."
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-[#606060] focus:outline-none focus:border-[#C5F135]/50 transition-colors"
            />
          </div>
          <span className="text-xs text-[#A0A0A0]">{filtered.length} funds</span>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-[#606060]">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#1A1A1A] border border-[#2A2A2A] text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none"
            >
              {sortOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Fund list */}
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-[#606060] text-sm">
              No funds match your filters
            </div>
          ) : (
            <div className="space-y-2">
              {/* Table header */}
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-2 text-xs font-medium text-[#606060] uppercase tracking-wide">
                <span>Fund</span>
                <span>NAV</span>
                <span>1Y Returns</span>
                <span className="flex items-center gap-1">3Y CAGR</span>
                <span>5Y CAGR</span>
                <span>Volatility</span>
              </div>

              {filtered.map((fund) => (
                <Link key={fund.id} to={`/mutual-funds/search/${fund.id}`}>
                  <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl hover:border-[#C5F135]/30 transition-all items-center group">
                    {/* Fund info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#2A2A2A] flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#C5F135]">
                        {fund.amcName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white group-hover:text-[#C5F135] transition-colors truncate">
                          {fund.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] text-[#606060]">{fund.subCategory}</span>
                          <span className="text-[#2A2A2A]">·</span>
                          <span className="text-[10px] bg-[#2A2A2A] text-[#A0A0A0] px-1.5 py-0 rounded-full">Direct</span>
                          <span className="text-[10px] bg-[#2A2A2A] text-[#A0A0A0] px-1.5 py-0 rounded-full">Growth</span>
                        </div>
                      </div>
                    </div>

                    {/* NAV */}
                    <div>
                      <p className="text-xs font-semibold text-white">₹{fund.nav.toFixed(2)}</p>
                      <p className={`text-[10px] ${fund.navChangePercent >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                        {fund.navChangePercent >= 0 ? '+' : ''}{fund.navChangePercent.toFixed(2)}%
                      </p>
                    </div>

                    {/* 1Y */}
                    <span className={`text-xs font-semibold ${fund.returns['1Y'] && fund.returns['1Y'] >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                      {fund.returns['1Y'] ? `+${fund.returns['1Y']}%` : '—'}
                    </span>

                    {/* 3Y */}
                    <PlanGate requiredTier="pro" compact>
                      <span className={`text-xs font-semibold ${fund.returns['3Y'] && fund.returns['3Y'] >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                        {fund.returns['3Y'] ? `+${fund.returns['3Y']}%` : '—'}
                      </span>
                    </PlanGate>

                    {/* 5Y */}
                    <PlanGate requiredTier="pro" compact>
                      <span className={`text-xs font-semibold ${fund.returns['5Y'] && fund.returns['5Y'] >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                        {fund.returns['5Y'] ? `+${fund.returns['5Y']}%` : '—'}
                      </span>
                    </PlanGate>

                    {/* Volatility */}
                    <VolatilityBadge level={fund.volatility} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

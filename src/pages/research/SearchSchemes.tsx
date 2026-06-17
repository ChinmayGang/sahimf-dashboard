import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react'
import { Sliders as TuneIcon } from '@phosphor-icons/react'
import { CaretDown as ExpandMoreIcon } from '@phosphor-icons/react'
import { CaretUp as ExpandLessIcon } from '@phosphor-icons/react'
import { VolatilityBadge } from '../../components/ui/VolatilityBadge'
import { PlanGate } from '../../components/ui/PlanGate'
import { mockFunds } from '../../data/funds'
import { useUIStore } from '../../stores/uiStore'

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
  const lm = useUIStore((s) => s.lightMode)
  return (
    <div className={`border-b ${lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'} pb-3 mb-3`}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider mb-2 ${lm ? 'text-[#6B7280]' : 'text-[#8390a2]'}`}
      >
        {title}
        {open ? <ExpandLessIcon size={16} weight="bold" /> : <ExpandMoreIcon size={16} weight="bold" />}
      </button>
      {open && children}
    </div>
  )
}

export function SearchSchemes() {
  const lm = useUIStore((s) => s.lightMode)
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
      <aside className={`w-60 flex-shrink-0 border-r ${lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'} overflow-y-auto p-4`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-1.5 text-sm font-semibold ${lm ? 'text-[#111827]' : 'text-white'}`}>
            <TuneIcon size={16} weight="duotone" />
            Filters
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={() => { setSelectedCats([]); setSelectedVolatility([]); setSelectedAMC([]) }}
              className={`text-xs ${lm ? 'text-[#4f46e5] hover:text-[#4338ca]' : 'text-[#d6fd70] hover:text-[#b8d94a]'}`}
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
                className={`flex items-center justify-between w-full text-xs py-1 transition-colors ${lm ? 'text-[#6B7280] hover:text-[#111827]' : 'text-[#8390a2] hover:text-white'}`}
              >
                <span className="font-medium">{cat.label}</span>
                {openCats.includes(cat.label) ? <ExpandLessIcon size={13} weight="bold" /> : <ExpandMoreIcon size={13} weight="bold" />}
              </button>
              {openCats.includes(cat.label) && (
                <div className="ml-2 space-y-0.5">
                  {cat.children.map((sub) => (
                    <label key={sub} className="flex items-center gap-2 cursor-pointer py-0.5 group">
                      <input
                        type="checkbox"
                        checked={selectedCats.includes(sub)}
                        onChange={() => toggleCat(sub)}
                        className="w-3 h-3" style={{ accentColor: lm ? '#4f46e5' : '#d6fd70' }}
                      />
                      <span className={`text-xs transition-colors ${selectedCats.includes(sub) ? (lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]') : lm ? 'text-[#6B7280] group-hover:text-[#111827]' : 'text-[#8390a2] group-hover:text-white'}`}>
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
                className="accent-[#d6fd70] w-3 h-3"
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
              className="w-full" style={{ accentColor: lm ? '#4f46e5' : '#d6fd70' }}
            />
            <div className="flex justify-between text-xs text-[#64748b]">
              <span>0%</span>
              <span className={`${lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'} font-medium`}>Up to {expenseMax.toFixed(1)}%</span>
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
                  className="accent-[#d6fd70] w-3 h-3"
                />
                <span className={`text-xs transition-colors ${selectedAMC.includes(a) ? (lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]') : lm ? 'text-[#6B7280] group-hover:text-[#111827]' : 'text-[#8390a2] group-hover:text-white'}`}>
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
        <div className={`flex items-center gap-3 p-4 border-b ${lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'} flex-shrink-0`}>
          <div className="relative flex-1 max-w-md">
            <SearchIcon size={16} color="#64748b" weight="duotone" className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by fund name, AMC..."
              className={`w-full border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none transition-colors ${lm ? 'bg-white border-[#E0E3E8] text-[#111827] placeholder-[#9CA3AF] focus:border-[#4f46e5]/50' : 'bg-[#14171c] border-[#1e2838] text-white placeholder-[#64748b] focus:border-[#d6fd70]/50'}`}
            />
          </div>
          <span className={`text-xs ${lm ? 'text-[#6B7280]' : 'text-[#8390a2]'}`}>{filtered.length} funds</span>
          <div className="flex items-center gap-2 ml-auto">
            <span className={`text-xs ${lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'}`}>Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`border text-xs rounded-lg px-3 py-1.5 focus:outline-none ${lm ? 'bg-white border-[#E0E3E8] text-[#111827]' : 'bg-[#14171c] border-[#1e2838] text-white'}`}
            >
              {sortOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Fund list */}
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-[#64748b] text-sm">
              No funds match your filters
            </div>
          ) : (
            <div className="space-y-2">
              {/* Table header */}
              <div className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-2 text-xs font-medium uppercase tracking-wide ${lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'}`}>
                <span>Fund</span>
                <span>NAV</span>
                <span>1Y Returns</span>
                <span className="flex items-center gap-1">3Y CAGR</span>
                <span>5Y CAGR</span>
                <span>Volatility</span>
              </div>

              {filtered.map((fund) => (
                <Link key={fund.id} to={`/mutual-funds/search/${fund.id}`}>
                  <div className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3 border rounded-xl transition-all items-center group ${lm ? 'bg-white border-[#E0E3E8] hover:border-[#4f46e5]/30' : 'bg-[#14171c] border-[#1e2838] hover:border-[#d6fd70]/30'}`}>
                    {/* Fund info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${lm ? 'bg-[#F3F4F6] text-[#4f46e5]' : 'bg-[#1e2838] text-[#d6fd70]'}`}>
                        {fund.amcName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold transition-colors truncate ${lm ? 'text-[#111827] group-hover:text-[#4f46e5]' : 'text-white group-hover:text-[#d6fd70]'}`}>
                          {fund.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={`text-[10px] ${lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'}`}>{fund.subCategory}</span>
                          <span className={lm ? 'text-[#E0E3E8]' : 'text-[#1e2838]'}>·</span>
                          <span className={`text-[10px] px-1.5 py-0 rounded-full ${lm ? 'bg-[#F3F4F6] text-[#6B7280]' : 'bg-[#1e2838] text-[#8390a2]'}`}>Direct</span>
                          <span className={`text-[10px] px-1.5 py-0 rounded-full ${lm ? 'bg-[#F3F4F6] text-[#6B7280]' : 'bg-[#1e2838] text-[#8390a2]'}`}>Growth</span>
                        </div>
                      </div>
                    </div>

                    {/* NAV */}
                    <div>
                      <p className={`text-xs font-semibold ${lm ? 'text-[#111827]' : 'text-white'}`}>₹{fund.nav.toFixed(2)}</p>
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

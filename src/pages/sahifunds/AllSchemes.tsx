import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react'
import { Sliders as TuneIcon } from '@phosphor-icons/react'
import { CaretDown as ExpandMoreIcon } from '@phosphor-icons/react'
import { CaretUp as ExpandLessIcon } from '@phosphor-icons/react'
import { Sparkle as AutoAwesomeIcon } from '@phosphor-icons/react'
import { Lock as LockIcon } from '@phosphor-icons/react'
import { ArrowLeft as ArrowBackIcon } from '@phosphor-icons/react'
import { useUIStore } from '../../stores/uiStore'
import { mockFunds } from '../../data/funds'
import { mockSahiFunds } from '../../data/sahiFunds'
import { VolatilityBadge } from '../../components/ui/VolatilityBadge'

const ORIGAMI_ICONS = [
  'bat-origami-4895697.svg','bee-origami-4895698.svg','butterfly-origami-4895700.svg',
  'cactus-origami-4895701.svg','cat-origami-4895702.svg','chick-origami-4895653.svg',
  'dragon-origami-4895659.svg','elephant-origami-4895660.svg','flower-origami-4895661.svg',
  'fox-origami-4895662.svg','giraffe-origami-4895664.svg','horse-origami-4895667.svg',
  'kangaroo-origami-4895672.svg','kite-origami-4895673.svg','owl-origami-4895676.svg',
  'panda-origami-4895677.svg','paper-plane-origami-4895678.svg','penguin-origami-4895680.svg',
  'rabbit-origami-4895682.svg','star-origami-4895689.svg','sun-origami-4895691.svg',
  'tulip-origami-4895693.svg','unicorn-origami-4895694.svg','whale-origami-4895695.svg',
]
const ICON_PALETTES = [
  { bg: '#EDE9FE' }, { bg: '#FEF3C7' }, { bg: '#DCFCE7' }, { bg: '#DBEAFE' },
  { bg: '#FCE7F3' }, { bg: '#FEE2E2' }, { bg: '#ECFDF5' }, { bg: '#FFF7ED' },
  { bg: '#F0F9FF' }, { bg: '#F5F3FF' },
]

const CATEGORIES = [
  { label: 'Equity', children: ['Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'Multi Cap', 'Sectoral', 'ELSS'] },
  { label: 'Debt', children: ['Liquid', 'Overnight', 'Short Duration', 'Medium Duration', 'Long Duration', 'Gilt'] },
  { label: 'Hybrid', children: ['Aggressive Hybrid', 'Balanced Advantage', 'Multi Asset', 'Arbitrage'] },
  { label: 'Index / ETF', children: ['Nifty 50', 'Nifty Next 50', 'Sensex', 'Nifty Midcap 150'] },
]
const AMCS = ['Mirae Asset', 'PPFAS', 'DSP', 'Axis', 'HDFC', 'SBI', 'ICICI Prudential', 'Kotak', 'Nippon']
const SORT_OPTIONS = ['Popularity', '1Y Returns ↑', '1Y Returns ↓', 'Expense Ratio ↑', 'Sharpe Ratio ↓', 'Fund Size ↓']
type TabType = 'open' | 'sahi'

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const lightMode = useUIStore((s) => s.lightMode)
  return (
    <div className="mb-3 pb-3" style={{ borderBottom: lightMode ? '1px solid #E0E3E8' : '1px solid #1e2838' }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color: lightMode ? '#9CA3AF' : '#64748b' }}
      >
        {title}
        {open ? <ExpandLessIcon size={15} weight="bold" /> : <ExpandMoreIcon size={15} weight="bold" />}
      </button>
      {open && children}
    </div>
  )
}

export function AllSchemes() {
  const lightMode = useUIStore((s) => s.lightMode)
  const navigate = useNavigate()
  const [tab, setTab] = useState<TabType>('open')
  const [query, setQuery] = useState('')
  const [selectedCats, setSelectedCats] = useState<string[]>([])
  const [selectedVolatility, setSelectedVolatility] = useState<string[]>([])
  const [selectedAMC, setSelectedAMC] = useState<string[]>([])
  const [expenseMax, setExpenseMax] = useState(2.5)
  const [sortBy, setSortBy] = useState('Popularity')
  const [openCats, setOpenCats] = useState<string[]>(['Equity'])

  const lm = lightMode
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#6B7280]' : 'text-[#64748b]'
  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-transparent'
  const inputBg = lm ? 'bg-white border-[#E0E3E8]' : 'bg-[#14171c] border-[#3c4653]'
  const accent = lm ? '#4f46e5' : '#d6fd70'
  const accentText = lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'

  const toggleCat = (c: string) => setSelectedCats((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c])
  const toggleVol = (v: string) => setSelectedVolatility((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v])
  const toggleAMC = (a: string) => setSelectedAMC((p) => p.includes(a) ? p.filter((x) => x !== a) : [...p, a])
  const toggleCatOpen = (c: string) => setOpenCats((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c])

  const filteredOpen = useMemo(() => {
    return mockFunds.filter((f) => {
      if (query && !f.name.toLowerCase().includes(query.toLowerCase()) && !f.amcName.toLowerCase().includes(query.toLowerCase())) return false
      if (selectedCats.length && !selectedCats.some((c) => f.category === c || f.subCategory === c)) return false
      if (selectedVolatility.length && !selectedVolatility.includes(f.volatility)) return false
      if (selectedAMC.length && !selectedAMC.some((a) => f.amcName.includes(a))) return false
      if (f.expenseRatio > expenseMax) return false
      return true
    })
  }, [query, selectedCats, selectedVolatility, selectedAMC, expenseMax])

  const filteredSahi = useMemo(() => {
    return mockSahiFunds.filter((f) => !query || f.name.toLowerCase().includes(query.toLowerCase()))
  }, [query])

  const activeCount = selectedCats.length + selectedVolatility.length + selectedAMC.length

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <div
        className="flex items-center gap-3 px-5 py-3 flex-shrink-0"
        style={{ borderBottom: lm ? '1px solid #E0E3E8' : '1px solid #1e2838', background: lm ? '#FDFCFF' : 'transparent' }}
      >
        <button
          onClick={() => navigate('/mutual-funds/explore')}
          className={`flex items-center gap-1 text-xs font-medium ${textSub} hover:${text} transition-colors`}
        >
          <ArrowBackIcon size={15} weight="bold" />
          Explore Funds
        </button>
        <span className={textMuted}>/</span>
        <span className={`text-xs font-semibold ${text}`}>
          {tab === 'sahi' ? 'Sahi MF Funds' : 'All Open Schemes'}
        </span>

        {/* Tab toggle */}
        <div
          className="flex items-center rounded-xl p-0.5 ml-3"
          style={{ background: lm ? '#eeedfd' : '#14171c', border: lm ? '1px solid #dcdafa' : '1px solid #3c4653' }}
        >
          {(['open', 'sahi'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={tab === t
                ? { background: accent, color: lm ? '#fff' : '#000' }
                : { color: lm ? '#9CA3AF' : '#64748b' }}
            >
              {t === 'sahi' && <AutoAwesomeIcon size={12} weight="fill" />}
              {t === 'sahi' ? 'Sahi Funds' : 'Open Schemes'}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className={`flex items-center gap-2 ${inputBg} border rounded-xl px-3 py-1.5 flex-1 max-w-sm ml-auto`}>
          <SearchIcon size={15} color={lm ? '#9CA3AF' : '#64748b'} weight="fill" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by fund name, AMC..."
            className={`bg-transparent outline-none text-xs flex-1 ${text} placeholder-[#9CA3AF]`}
          />
        </div>

        <span className={`text-xs ${textMuted} flex-shrink-0`}>
          {tab === 'sahi' ? filteredSahi.length : filteredOpen.length} funds
        </span>

        {tab === 'open' && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`${inputBg} border rounded-lg text-xs px-2.5 py-1.5 outline-none cursor-pointer appearance-none`}
          >
            {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Filter sidebar — only for open schemes */}
        {tab === 'open' && (
          <aside
            className="w-56 flex-shrink-0 overflow-y-auto p-4"
            style={{ borderRight: lm ? '1px solid #E0E3E8' : '1px solid #1e2838', background: lm ? '#FDFCFF' : '#0a0c0e' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: lm ? '#374151' : '#fff' }}>
                <TuneIcon size={14} weight="fill" />
                Filters
              </div>
              {activeCount > 0 && (
                <button
                  onClick={() => { setSelectedCats([]); setSelectedVolatility([]); setSelectedAMC([]) }}
                  className={`text-xs font-semibold ${accentText}`}
                >
                  Clear all ({activeCount})
                </button>
              )}
            </div>

            <FilterSection title="Category">
              {CATEGORIES.map((cat) => (
                <div key={cat.label} className="mb-1">
                  <button
                    onClick={() => toggleCatOpen(cat.label)}
                    className={`flex items-center justify-between w-full text-xs py-1 transition-colors ${textSub} hover:${text}`}
                  >
                    <span className="font-semibold">{cat.label}</span>
                    {openCats.includes(cat.label) ? <ExpandLessIcon size={13} weight="bold" /> : <ExpandMoreIcon size={13} weight="bold" />}
                  </button>
                  {openCats.includes(cat.label) && (
                    <div className="ml-2 mt-0.5 space-y-0.5">
                      {cat.children.map((sub) => (
                        <label key={sub} className="flex items-center gap-2 cursor-pointer py-0.5">
                          <input type="checkbox" checked={selectedCats.includes(sub)} onChange={() => toggleCat(sub)} className="w-3 h-3 rounded" style={{ accentColor: accent }} />
                          <span className={`text-xs ${selectedCats.includes(sub) ? accentText : textSub}`}>{sub}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </FilterSection>

            <FilterSection title="Volatility">
              {(['Low', 'Moderate', 'High'] as const).map((v) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer py-1">
                  <input type="checkbox" checked={selectedVolatility.includes(v)} onChange={() => toggleVol(v)} className="w-3 h-3" style={{ accentColor: accent }} />
                  <VolatilityBadge level={v} />
                </label>
              ))}
            </FilterSection>

            <FilterSection title="Expense Ratio">
              <input type="range" min={0} max={2.5} step={0.1} value={expenseMax} onChange={(e) => setExpenseMax(Number(e.target.value))} className="w-full" style={{ accentColor: accent }} />
              <div className="flex justify-between text-xs mt-1" style={{ color: lm ? '#9CA3AF' : '#64748b' }}>
                <span>0%</span>
                <span className="font-semibold" style={{ color: accent }}>≤ {expenseMax.toFixed(1)}%</span>
                <span>2.5%</span>
              </div>
            </FilterSection>

            <FilterSection title="AMC" defaultOpen={false}>
              {AMCS.map((a) => (
                <label key={a} className="flex items-center gap-2 cursor-pointer py-0.5">
                  <input type="checkbox" checked={selectedAMC.includes(a)} onChange={() => toggleAMC(a)} className="w-3 h-3" style={{ accentColor: accent }} />
                  <span className={`text-xs ${selectedAMC.includes(a) ? accentText : textSub}`}>{a}</span>
                </label>
              ))}
            </FilterSection>
          </aside>
        )}

        {/* Fund list */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'sahi' ? (
            /* Sahi Funds grid */
            <div className="grid grid-cols-2 gap-3">
              {filteredSahi.map((fund, idx) => (
                <div
                  key={fund.id}
                  onClick={() => navigate(`/mutual-funds/sahi-funds/${fund.id}`)}
                  className={`${card} rounded-2xl p-4 cursor-pointer transition-all duration-200 relative overflow-hidden group ${lm ? 'hover:border-[#4f46e5] hover:-translate-y-1' : 'hover:border-[#d6fd70] hover:-translate-y-1'}`}
                >
                  <div className="absolute top-3 right-3 flex gap-1">
                    <span className="text-[10px] font-bold bg-[#d6fd70] text-black px-2 py-0.5 rounded-full">Best Choice</span>
                  </div>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5"
                    style={{ background: ICON_PALETTES[idx % ICON_PALETTES.length].bg }}>
                    <img src={`/icons/schemes/${ORIGAMI_ICONS[idx % ORIGAMI_ICONS.length]}`} className="w-5 h-5" alt="" />
                  </div>
                  <h3 className={`text-sm font-bold ${text} pr-20 mb-1 transition-colors duration-200 ${lm ? 'group-hover:text-[#4f46e5]' : 'group-hover:text-[#d6fd70]'}`}>{fund.name}</h3>
                  <p className={`text-[11px] ${textSub} mb-3 leading-relaxed`}>{fund.description}</p>
                  <div className="flex gap-1 mb-3">
                    <VolatilityBadge level={fund.volatility} size="sm" />
                    {fund.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: lm ? '#eeedfd' : '#1e2838', color: lm ? '#4f46e5' : '#8390a2' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2.5 text-center"
                    style={{ borderTop: lm ? '1px solid #E0E3E8' : '1px solid #3c4653' }}>
                    <div>
                      <p className={`text-[10px] ${textMuted}`}>Min</p>
                      <p className={`text-xs font-bold ${text}`}>₹{fund.minAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className={`text-[10px] ${textMuted}`}>{fund.fundCount} Funds</p>
                      <p className={`text-xs font-bold ${text}`}>{fund.rebalanceFrequency}</p>
                    </div>
                    <div>
                      <p className={`text-[10px] ${textMuted}`}>1Y Return</p>
                      {fund.accessTier === 'free' ? (
                        <p className="text-xs font-bold text-[#16A34A]">+{fund.returns['1Y']}%</p>
                      ) : (
                        <div className="flex items-center justify-center gap-0.5">
                          <LockIcon size={10} color={lm ? '#4f46e5' : '#d6fd70'} weight="fill" />
                          <span className={`text-xs font-bold ${accentText}`}>PRO</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Open Schemes table */
            filteredOpen.length === 0 ? (
              <div className={`flex items-center justify-center h-48 text-sm ${textMuted}`}>No funds match your filters</div>
            ) : (
              <div className="space-y-0">
                {/* Flush stacked listing — 0 gap, no radius, no L/R border; full blue border + lift on hover (R2-5) */}
                {/* Table header */}
                <div
                  className="grid px-4 py-2 text-[10px] font-bold uppercase tracking-wider"
                  style={{ gridTemplateColumns: '2fr 80px 80px 80px 80px 100px', color: lm ? '#9CA3AF' : '#64748b' }}
                >
                  <span>Fund</span>
                  <span className="text-center">NAV</span>
                  <span className="text-center">1Y</span>
                  <span className="text-center">3Y</span>
                  <span className="text-center">5Y</span>
                  <span className="text-right">Volatility</span>
                </div>

                {filteredOpen.map((fund, idx) => (
                  <div
                    key={fund.id}
                    onClick={() => navigate(`/mutual-funds/search/${fund.id}`)}
                    className={`${lm ? 'bg-white' : 'bg-[#14171c]'} rounded-none hover:rounded-xl border border-transparent ${lm ? 'border-b-[#E0E3E8]' : 'border-b-[#1e2838]'} px-4 py-3 cursor-pointer transition-all duration-200 grid items-center group ${lm ? 'hover:border-[#4f46e5]' : 'hover:border-[#d6fd70]'} hover:-translate-y-0.5 hover:relative hover:z-10`}
                    style={{ gridTemplateColumns: '2fr 80px 80px 80px 80px 100px' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: ICON_PALETTES[idx % ICON_PALETTES.length].bg }}
                      >
                        <img src={`/icons/schemes/${ORIGAMI_ICONS[idx % ORIGAMI_ICONS.length]}`} className="w-4 h-4" alt="" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold ${text} truncate transition-colors duration-200 ${lm ? 'group-hover:text-[#4f46e5]' : 'group-hover:text-[#d6fd70]'}`}>{fund.name}</p>
                        <p className={`text-[10px] ${textMuted} mt-0.5`}>{fund.subCategory} · Direct</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-bold ${text}`}>₹{fund.nav.toFixed(0)}</p>
                      <p className={`text-[10px] ${fund.navChangePercent >= 0 ? 'text-[#16A34A]' : 'text-[#EF4444]'}`}>
                        {fund.navChangePercent >= 0 ? '+' : ''}{fund.navChangePercent.toFixed(2)}%
                      </p>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-bold text-[#16A34A]">+{fund.returns['1Y']}%</span>
                    </div>
                    <div className="text-center">
                      <span className={`text-xs font-bold ${accentText}`}>+{fund.returns['3Y']}%</span>
                    </div>
                    <div className="text-center">
                      <span className={`text-xs font-bold ${accentText}`}>+{fund.returns['5Y']}%</span>
                    </div>
                    <div className="flex justify-end">
                      <VolatilityBadge level={fund.volatility} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

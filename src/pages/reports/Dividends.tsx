import { useState, useMemo } from 'react'
import { PiggyBank as SavingsIcon } from '@phosphor-icons/react'
import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react'
import { Funnel as FilterListIcon } from '@phosphor-icons/react'
import { mockDividends } from '../../data/dividends'
import { useUIStore } from '../../stores/uiStore'

const FREQ_COLORS: Record<string, string> = {
  Monthly: '#22C55E',
  Quarterly: '#d6fd70',
  Annual: '#4f46e5',
  Special: '#F59E0B',
}

export function Dividends() {
  const [search, setSearch] = useState('')
  const [freqFilter, setFreqFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const lm = useUIStore((s) => s.lightMode)

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'
  const inputBg = lm ? 'bg-white border-[#E0E3E8] text-[#111827]' : 'bg-[#14171c] border-[#1e2838] text-white'
  const rowHover = lm ? 'hover:bg-[#F9F9FF]' : 'hover:bg-[#1a2130]'
  const rowBorder = lm ? 'border-[#F0F0F8]' : 'border-[#1e2838]'
  const dividerColor = lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'
  const noteBg = lm ? 'bg-[#F8F7FF] border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'

  const filtered = useMemo(() => {
    return mockDividends.filter((d) => {
      if (search && !d.fundName.toLowerCase().includes(search.toLowerCase()) && !d.amcName.toLowerCase().includes(search.toLowerCase())) return false
      if (freqFilter !== 'All' && d.frequency !== freqFilter) return false
      if (typeFilter !== 'All' && d.dividendType !== typeFilter) return false
      return true
    }).sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime())
  }, [search, freqFilter, typeFilter])

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl ${lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'} flex items-center justify-center`}>
          <SavingsIcon size={18} color="#d6fd70" weight="duotone" />
        </div>
        <div>
          <h1 className={`text-lg font-bold ${text}`}>Dividends</h1>
          <p className={`text-xs ${textMuted}`}>IDCW announcements and dividend history</p>
        </div>
      </div>

      {/* Note */}
      <div className={`${noteBg} rounded-xl px-4 py-3 text-xs ${textSub}`}>
        <span className={`${text} font-medium`}>IDCW (Income Distribution cum Capital Withdrawal)</span> — Formerly called dividends under SEBI's new nomenclature. The fund distributes from the available distributable surplus in the scheme.
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className={`flex items-center gap-2 ${inputBg} border rounded-xl px-3 py-2 flex-1 min-w-48`}>
          <SearchIcon size={15} color={lm ? '#9CA3AF' : '#64748b'} weight="regular" />
          <input
            type="text"
            placeholder="Search fund or AMC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`bg-transparent outline-none text-sm ${text} placeholder-[#9CA3AF] flex-1`}
          />
        </div>
        <FilterListIcon size={16} color={lm ? '#9CA3AF' : '#64748b'} weight="duotone" />
        <select value={freqFilter} onChange={(e) => setFreqFilter(e.target.value)} className={`${inputBg} border rounded-xl px-3 py-2 text-sm outline-none cursor-pointer`}>
          {['All', 'Monthly', 'Quarterly', 'Annual', 'Special'].map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={`${inputBg} border rounded-xl px-3 py-2 text-sm outline-none cursor-pointer`}>
          {['All', 'IDCW', 'Growth'].map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className={`${card} rounded-2xl overflow-hidden`}>
        <div className={`grid grid-cols-[1fr_150px_120px_120px_100px] gap-4 px-5 py-3 border-b ${dividerColor}`}>
          {['Fund', 'AMC', 'Record Date', 'Dividend/Unit', 'Frequency'].map((h) => (
            <span key={h} className={`text-[11px] font-semibold ${textMuted} uppercase tracking-wider`}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className={`${textMuted} text-sm`}>No dividends match your filters.</p>
          </div>
        )}

        {filtered.map((d, i) => (
          <div
            key={d.id}
            className={`grid grid-cols-[1fr_150px_120px_120px_100px] gap-4 px-5 py-4 items-center border-b ${rowBorder} ${rowHover} transition-colors`}
            style={{ borderBottomColor: i === filtered.length - 1 ? 'transparent' : undefined }}
          >
            <div>
              <p className={`text-sm font-medium ${text} leading-snug`}>{d.fundName}</p>
              <p className={`text-[11px] ${textMuted} mt-0.5`}>{d.category}</p>
            </div>
            <span className={`text-xs ${textSub}`}>{d.amcName}</span>
            <span className={`text-sm ${text} font-medium`}>{new Date(d.recordDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span className="text-sm font-bold text-[#d6fd70]">₹{d.dividendPerUnit.toFixed(4)}</span>
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit"
              style={{ background: `${FREQ_COLORS[d.frequency]}18`, color: FREQ_COLORS[d.frequency] }}
            >
              {d.frequency}
            </span>
          </div>
        ))}
      </div>

      <p className={`text-[10px] ${lm ? 'text-[#9CA3AF]' : 'text-[#505d6f]'} text-center`}>
        Dividend data is for informational purposes only. IDCW payouts depend on the distributable surplus of the scheme.
        Past dividends do not guarantee future distributions. SEBI regulations apply.
      </p>
    </div>
  )
}

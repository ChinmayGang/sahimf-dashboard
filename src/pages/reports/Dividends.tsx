import { useState, useMemo } from 'react'
import SavingsIcon from '@mui/icons-material/Savings'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import { mockDividends } from '../../data/dividends'

const FREQ_COLORS: Record<string, string> = {
  Monthly: '#22C55E',
  Quarterly: '#C5F135',
  Annual: '#7B2FBE',
  Special: '#F59E0B',
}

export function Dividends() {
  const [search, setSearch] = useState('')
  const [freqFilter, setFreqFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')

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
        <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
          <SavingsIcon sx={{ fontSize: 18, color: '#C5F135' }} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Dividends</h1>
          <p className="text-xs text-[#606060]">IDCW announcements and dividend history</p>
        </div>
      </div>

      {/* Note */}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-[#A0A0A0]">
        <span className="text-white font-medium">IDCW (Income Distribution cum Capital Withdrawal)</span> — Formerly called dividends under SEBI's new nomenclature. The fund distributes from the available distributable surplus in the scheme.
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-[#141414] border border-[#2A2A2A] rounded-xl px-3 py-2 flex-1 min-w-48">
          <SearchIcon sx={{ fontSize: 15, color: '#606060' }} />
          <input
            type="text"
            placeholder="Search fund or AMC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-white placeholder-[#606060] flex-1"
          />
        </div>
        <FilterListIcon sx={{ fontSize: 16, color: '#606060' }} />
        <select value={freqFilter} onChange={(e) => setFreqFilter(e.target.value)} className="bg-[#141414] border border-[#2A2A2A] rounded-xl px-3 py-2 text-sm text-white outline-none cursor-pointer">
          {['All', 'Monthly', 'Quarterly', 'Annual', 'Special'].map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-[#141414] border border-[#2A2A2A] rounded-xl px-3 py-2 text-sm text-white outline-none cursor-pointer">
          {['All', 'IDCW', 'Growth'].map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_150px_120px_120px_100px] gap-4 px-5 py-3 border-b border-[#2A2A2A]">
          {['Fund', 'AMC', 'Record Date', 'Dividend/Unit', 'Frequency'].map((h) => (
            <span key={h} className="text-[11px] font-semibold text-[#606060] uppercase tracking-wider">{h}</span>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-[#606060] text-sm">No dividends match your filters.</p>
          </div>
        )}

        {filtered.map((d, i) => (
          <div
            key={d.id}
            className="grid grid-cols-[1fr_150px_120px_120px_100px] gap-4 px-5 py-4 items-center border-b border-[#1E1E1E] hover:bg-[#1A1A1A] transition-colors"
            style={{ borderBottomColor: i === filtered.length - 1 ? 'transparent' : undefined }}
          >
            <div>
              <p className="text-sm font-medium text-white leading-snug">{d.fundName}</p>
              <p className="text-[11px] text-[#606060] mt-0.5">{d.category}</p>
            </div>
            <span className="text-xs text-[#A0A0A0]">{d.amcName}</span>
            <span className="text-sm text-white font-medium">{new Date(d.recordDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span className="text-sm font-bold text-[#C5F135]">₹{d.dividendPerUnit.toFixed(4)}</span>
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit"
              style={{ background: `${FREQ_COLORS[d.frequency]}18`, color: FREQ_COLORS[d.frequency] }}
            >
              {d.frequency}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-[#404040] text-center">
        Dividend data is for informational purposes only. IDCW payouts depend on the distributable surplus of the scheme.
        Past dividends do not guarantee future distributions. SEBI regulations apply.
      </p>
    </div>
  )
}

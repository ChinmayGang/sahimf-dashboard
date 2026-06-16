import { useState, useMemo } from 'react'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import FilterListIcon from '@mui/icons-material/FilterList'
import SearchIcon from '@mui/icons-material/Search'
import { mockTransactions } from '../../data/transactions'
import { mockPortfolios } from '../../data/portfolios'
import { useUIStore } from '../../stores/uiStore'

const TYPE_COLORS: Record<string, string> = {
  SIP: '#C5F135',
  Lumpsum: '#7B2FBE',
  Redemption: '#EF4444',
  Switch: '#F59E0B',
}

const STATUS_COLORS: Record<string, string> = {
  Completed: '#22C55E',
  Processing: '#F59E0B',
  Failed: '#EF4444',
}

function formatINR(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`
  return `₹${n.toLocaleString('en-IN')}`
}

export function Transactions() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('All')
  const [portfolioFilter, setPortfolioFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const lm = useUIStore((s) => s.lightMode)

  const card = lm ? 'bg-white border border-[#E8E8F0] shadow-sm' : 'bg-[#141414] border border-[#2A2A2A]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#A0A0A0]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#606060]'
  const inputBg = lm ? 'bg-white border-[#E8E8F0] text-[#111827]' : 'bg-[#1A1A1A] border-[#2A2A2A] text-white'
  const rowHover = lm ? 'hover:bg-[#F9F9FF]' : 'hover:bg-[#1A1A1A]'
  const rowBorder = lm ? 'border-[#F0F0F8]' : 'border-[#1E1E1E]'
  const dividerColor = lm ? 'border-[#E8E8F0]' : 'border-[#2A2A2A]'
  const summaryCard = lm ? 'bg-white border border-[#E8E8F0] shadow-sm' : 'bg-[#141414] border border-[#2A2A2A]'

  const portfolioOptions = ['All', ...mockPortfolios.map((p) => p.name)]

  const filtered = useMemo(() => {
    return mockTransactions.filter((t) => {
      if (search && !t.fundName.toLowerCase().includes(search.toLowerCase())) return false
      if (typeFilter !== 'All' && t.type !== typeFilter) return false
      if (statusFilter !== 'All' && t.status !== statusFilter) return false
      if (portfolioFilter !== 'All') {
        const portfolio = mockPortfolios.find((p) => p.name === portfolioFilter)
        if (portfolio && t.portfolioId !== portfolio.id) return false
      }
      return true
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [search, typeFilter, portfolioFilter, statusFilter])

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${lm ? 'bg-white border border-[#E8E8F0] shadow-sm' : 'bg-[#1A1A1A] border border-[#2A2A2A]'} flex items-center justify-center`}>
            <ReceiptLongIcon sx={{ fontSize: 18, color: '#C5F135' }} />
          </div>
          <div>
            <h1 className={`text-lg font-bold ${text}`}>Transactions</h1>
            <p className={`text-xs ${textMuted}`}>{filtered.length} transactions</p>
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className={`flex items-center gap-2 ${inputBg} border rounded-xl px-3 py-2 flex-1 min-w-48`}>
          <SearchIcon sx={{ fontSize: 15, color: lm ? '#9CA3AF' : '#606060' }} />
          <input
            type="text"
            placeholder="Search fund..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`bg-transparent outline-none text-sm ${text} placeholder-[#9CA3AF] flex-1`}
          />
        </div>

        <FilterListIcon sx={{ fontSize: 16, color: lm ? '#9CA3AF' : '#606060' }} />

        {/* Portfolio */}
        <select
          value={portfolioFilter}
          onChange={(e) => setPortfolioFilter(e.target.value)}
          className={`${inputBg} border rounded-xl px-3 py-2 text-sm outline-none cursor-pointer`}
        >
          {portfolioOptions.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        {/* Type */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={`${inputBg} border rounded-xl px-3 py-2 text-sm outline-none cursor-pointer`}
        >
          {['All', 'SIP', 'Lumpsum', 'Redemption', 'Switch'].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`${inputBg} border rounded-xl px-3 py-2 text-sm outline-none cursor-pointer`}
        >
          {['All', 'Completed', 'Processing', 'Failed'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className={`${card} rounded-2xl overflow-hidden`}>
        {/* Table header */}
        <div className={`grid grid-cols-[1fr_100px_80px_100px_110px_90px] gap-4 px-5 py-3 border-b ${dividerColor}`}>
          {['Fund', 'Portfolio', 'Type', 'Amount', 'Date', 'Status'].map((h) => (
            <span key={h} className={`text-[11px] font-semibold ${textMuted} uppercase tracking-wider`}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className={`${textMuted} text-sm`}>No transactions match your filters.</p>
          </div>
        )}

        {filtered.map((t, i) => {
          const portfolio = mockPortfolios.find((p) => p.id === t.portfolioId)
          return (
            <div
              key={t.id}
              className={`grid grid-cols-[1fr_100px_80px_100px_110px_90px] gap-4 px-5 py-4 items-center border-b ${rowBorder} ${rowHover} transition-colors`}
              style={{ borderBottomColor: i === filtered.length - 1 ? 'transparent' : undefined }}
            >
              {/* Fund name */}
              <div>
                <p className={`text-sm font-medium ${text} leading-snug`}>{t.fundName}</p>
                <p className={`text-[11px] ${textMuted} mt-0.5`}>{t.units.toFixed(3)} units @ ₹{t.nav}</p>
              </div>

              {/* Portfolio */}
              <span className={`text-xs ${textSub} truncate`}>{portfolio?.name ?? '—'}</span>

              {/* Type */}
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit"
                style={{ background: `${TYPE_COLORS[t.type]}18`, color: TYPE_COLORS[t.type] }}
              >
                {t.type}
              </span>

              {/* Amount */}
              <span className={`text-sm font-semibold ${t.type === 'Redemption' ? 'text-[#22C55E]' : text}`}>
                {t.type === 'Redemption' ? '+' : ''}{formatINR(t.amount)}
              </span>

              {/* Date */}
              <span className={`text-xs ${textSub}`}>{new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>

              {/* Status */}
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit"
                style={{ background: `${STATUS_COLORS[t.status]}18`, color: STATUS_COLORS[t.status] }}
              >
                {t.status}
              </span>
            </div>
          )
        })}
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Invested (filtered)', value: formatINR(filtered.filter(t => t.type !== 'Redemption' && t.status === 'Completed').reduce((s, t) => s + t.amount, 0)) },
          { label: 'Total Redeemed (filtered)', value: formatINR(filtered.filter(t => t.type === 'Redemption' && t.status === 'Completed').reduce((s, t) => s + t.amount, 0)) },
          { label: 'Pending / Processing', value: filtered.filter(t => t.status === 'Processing').length + ' transactions' },
        ].map((s) => (
          <div key={s.label} className={`${summaryCard} rounded-xl px-4 py-3`}>
            <p className={`text-[11px] ${textMuted} mb-1`}>{s.label}</p>
            <p className={`text-base font-bold ${text}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

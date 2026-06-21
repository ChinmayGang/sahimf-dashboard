import { useState, useMemo } from 'react'
import { Receipt as ReceiptLongIcon } from '@phosphor-icons/react'
import { Funnel as FilterListIcon } from '@phosphor-icons/react'
import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react'
import { mockTransactions } from '../../data/transactions'
import { mockPortfolios } from '../../data/portfolios'
import { useUIStore } from '../../stores/uiStore'

const TYPE_COLORS_DARK: Record<string, string> = {
  SIP: '#d6fd70',
  Lumpsum: '#4f46e5',
  Redemption: '#EF4444',
  Switch: '#F59E0B',
}
const TYPE_COLORS_LIGHT: Record<string, string> = {
  SIP: '#4f46e5',
  Lumpsum: '#6366f1',
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

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#6B7280]' : 'text-[#64748b]'
  const inputBg = lm ? 'bg-white border-[#E0E3E8] text-[#111827]' : 'bg-[#14171c] border-[#1e2838] text-white'
  const rowHover = lm ? 'hover:bg-[#F9F9FF]' : 'hover:bg-[#1a2130]'
  const rowBorder = lm ? 'border-[#F0F0F8]' : 'border-[#1e2838]'
  const dividerColor = lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'
  const summaryCard = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'

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
          <div className={`w-9 h-9 rounded-xl ${lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'} flex items-center justify-center`}>
            <ReceiptLongIcon size={18} color={lm ? '#6366f1' : '#d6fd70'} weight="fill" />
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
          <SearchIcon size={15} color={lm ? '#9CA3AF' : '#64748b'} weight="regular" />
          <input
            type="text"
            placeholder="Search fund..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`bg-transparent outline-none text-sm ${text} placeholder-[#9CA3AF] flex-1`}
          />
        </div>

        <FilterListIcon size={16} color={lm ? '#9CA3AF' : '#64748b'} weight="fill" />

        {/* Portfolio */}
        <select
          value={portfolioFilter}
          onChange={(e) => setPortfolioFilter(e.target.value)}
          className={`${inputBg} border rounded-lg text-xs px-2.5 py-1.5 outline-none cursor-pointer appearance-none`}
        >
          {portfolioOptions.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        {/* Type */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={`${inputBg} border rounded-lg text-xs px-2.5 py-1.5 outline-none cursor-pointer appearance-none`}
        >
          {['All', 'SIP', 'Lumpsum', 'Redemption', 'Switch'].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`${inputBg} border rounded-lg text-xs px-2.5 py-1.5 outline-none cursor-pointer appearance-none`}
        >
          {['All', 'Completed', 'Processing', 'Failed'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className={`${card} rounded-2xl overflow-hidden`}>
        {/* Table header */}
        <div className={`grid grid-cols-[1fr_100px_80px_100px_110px_90px] gap-4 px-5 py-3 border-b ${dividerColor}`}>
          {['Fund', 'Portfolio', 'Type', 'Amount', 'Date', 'Status'].map((h) => (
            <span key={h} className={`text-[11px] font-semibold ${textSub} uppercase tracking-wider`}>{h}</span>
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
                style={{ background: `${(lm ? TYPE_COLORS_LIGHT : TYPE_COLORS_DARK)[t.type]}18`, color: (lm ? TYPE_COLORS_LIGHT : TYPE_COLORS_DARK)[t.type] }}
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

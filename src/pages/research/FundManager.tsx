import { useState } from 'react'
import { Bank as AccountBalanceIcon } from '@phosphor-icons/react'
import { User as PersonIcon } from '@phosphor-icons/react'
import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react'
import { ArrowLeft as ArrowBackIcon } from '@phosphor-icons/react'
import { mockAMCs } from '../../data/amcs'
import { useUIStore } from '../../stores/uiStore'

function formatAUM(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L Cr`
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K Cr`
  return `₹${n} Cr`
}

export function FundManager() {
  const [search, setSearch] = useState('')
  const [selectedAMC, setSelectedAMC] = useState<string | null>(null)
  const lm = useUIStore((s) => s.lightMode)

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const cardInner = lm ? 'bg-[#F8F7FF] border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#6B7280]' : 'text-[#64748b]'
  const dividerColor = lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'
  const progressTrack = lm ? 'bg-[#E0E3E8]' : 'bg-[#1e2838]'
  const inputBg = lm ? 'bg-white border-[#E0E3E8] text-[#111827]' : 'bg-[#14171c] border-[#1e2838] text-white'

  const filtered = mockAMCs.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
  const detail = mockAMCs.find((a) => a.id === selectedAMC)

  if (detail) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <button onClick={() => setSelectedAMC(null)} className={`flex items-center gap-1.5 text-sm ${textMuted} hover:${text} transition-colors`}>
          <ArrowBackIcon size={15} weight="bold" />
          Fund Manager / AMFI
        </button>

        {/* AMC Header */}
        <div className={`${card} rounded-2xl p-6`}>
          <div className="flex items-start gap-4 mb-5">
            <div className={`w-14 h-14 rounded-2xl ${cardInner} flex items-center justify-center flex-shrink-0`}>
              <AccountBalanceIcon size={24} color={lm ? '#6366f1' : '#d6fd70'} weight="fill" />
            </div>
            <div className="flex-1">
              <h1 className={`text-xl font-bold ${text} mb-1`}>{detail.name}</h1>
              <p className={`text-xs ${textMuted} mb-3`}>SEBI Reg: {detail.sebiRegNo}</p>
              <p className={`text-sm ${textSub} leading-relaxed`}>{detail.description}</p>
            </div>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-3 gap-4 pt-5 border-t ${dividerColor}`}>
            {[
              { label: 'Total AUM', value: formatAUM(detail.aum) },
              { label: 'Funds Managed', value: `${detail.fundsManaged} Schemes` },
              { label: 'Website', value: detail.website.replace('https://www.', '') },
            ].map((s) => (
              <div key={s.label}>
                <p className={`text-[11px] ${textMuted} mb-0.5`}>{s.label}</p>
                <p className={`text-sm font-semibold ${text}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fund Managers */}
        <div>
          <h2 className={`text-sm font-semibold ${text} mb-3`}>Fund Managers</h2>
          <div className="grid grid-cols-2 gap-4">
            {detail.managers.map((mgr) => (
              <div key={mgr.name} className={`${card} rounded-2xl p-5 flex items-start gap-4`}>
                <div className={`w-10 h-10 rounded-full ${cardInner} flex items-center justify-center flex-shrink-0`}>
                  <PersonIcon size={18} color={lm ? '#9CA3AF' : '#8390a2'} weight="fill" />
                </div>
                <div>
                  <p className={`text-sm font-bold ${text} mb-0.5`}>{mgr.name}</p>
                  <p className={`text-xs mb-2 ${lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'}`}>{mgr.designation}</p>
                  <div className={`flex gap-4 text-xs ${textMuted}`}>
                    <span>Experience: <span className={textSub}>{mgr.experience}</span></span>
                    <span>Funds: <span className={textSub}>{mgr.fundsManaged}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AUM bar chart visual */}
        <div className={`${card} rounded-2xl p-5`}>
          <h2 className={`text-sm font-semibold ${text} mb-4`}>AUM Rank vs Peers</h2>
          <div className="space-y-3">
            {mockAMCs.sort((a, b) => b.aum - a.aum).slice(0, 6).map((amc) => {
              const maxAUM = Math.max(...mockAMCs.map((a) => a.aum))
              const pct = (amc.aum / maxAUM) * 100
              const isActive = amc.id === detail.id
              return (
                <div key={amc.id} className="flex items-center gap-3">
                  <span className="text-xs w-40 truncate" style={{ color: isActive ? (lm ? '#4f46e5' : '#d6fd70') : lm ? '#6B7280' : '#8390a2' }}>{amc.name.split(' ').slice(0, 3).join(' ')}</span>
                  <div className={`flex-1 ${progressTrack} rounded-full h-2`}>
                    <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: isActive ? (lm ? '#4f46e5' : '#d6fd70') : lm ? '#D1D5DB' : '#3c4653' }} />
                  </div>
                  <span className={`text-xs font-medium ${textSub} w-20 text-right`}>{formatAUM(amc.aum)}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${lm ? 'bg-[#4f46e5]/10' : 'bg-[#d6fd70]/10'} flex items-center justify-center`}>
            <AccountBalanceIcon size={20} color={lm ? '#6366f1' : '#d6fd70'} weight="fill" />
          </div>
          <div>
            <h1 className={`text-lg font-bold ${text}`}>Fund Manager / AMFI</h1>
            <p className={`text-xs ${textMuted}`}>AMC profiles and fund manager track records</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className={`flex items-center gap-2 ${inputBg} border rounded-xl px-3 py-2 max-w-sm`}>
        <SearchIcon size={15} color={lm ? '#9CA3AF' : '#64748b'} weight="fill" />
        <input
          type="text"
          placeholder="Search AMC..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`bg-transparent outline-none text-sm ${text} placeholder-[#9CA3AF] flex-1`}
        />
      </div>

      {/* AUM summary bar */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total AMCs', value: `${mockAMCs.length}` },
          { label: 'Total Industry AUM', value: '₹68.4L Cr' },
          { label: 'Largest AMC', value: 'SBI Mutual Fund' },
          { label: 'Avg Funds / AMC', value: `${Math.round(mockAMCs.reduce((s, a) => s + a.fundsManaged, 0) / mockAMCs.length)}` },
        ].map((s) => (
          <div key={s.label} className={`${card} rounded-xl px-4 py-3`}>
            <p className={`text-[11px] ${textMuted} mb-1`}>{s.label}</p>
            <p className={`text-sm font-bold ${text}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* AMC grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((amc) => (
          <button
            key={amc.id}
            onClick={() => setSelectedAMC(amc.id)}
            className={`text-left ${card} rounded-2xl p-5 hover:border-[#d6fd70]/40 ${lm ? 'hover:bg-[#F9F9FF]' : 'hover:bg-[#1a2130]'} transition-all`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl ${cardInner} flex items-center justify-center flex-shrink-0`}>
                <AccountBalanceIcon size={18} color={lm ? '#6366f1' : '#d6fd70'} weight="fill" />
              </div>
              <div>
                <p className={`text-sm font-bold ${text}`}>{amc.name}</p>
                <p className={`text-[11px] ${textMuted}`}>{amc.fundsManaged} schemes</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className={`text-[11px] ${textMuted} mb-0.5`}>AUM</p>
                <p className={`text-sm font-semibold ${text}`}>{formatAUM(amc.aum)}</p>
              </div>
              <div>
                <p className={`text-[11px] ${textMuted} mb-0.5`}>Managers</p>
                <p className={`text-sm font-semibold ${text}`}>{amc.managers.length} profiled</p>
              </div>
            </div>

            {/* AUM bar */}
            <div className="flex items-center gap-2">
              <div className={`flex-1 ${progressTrack} rounded-full h-1`}>
                <div className={`h-1 rounded-full ${lm ? 'bg-[#4f46e5]' : 'bg-[#d6fd70]'}`} style={{ width: `${(amc.aum / 1200000) * 100}%` }} />
              </div>
              <span className={`text-[10px] ${textMuted}`}>{((amc.aum / 6837090) * 100).toFixed(1)}% share</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

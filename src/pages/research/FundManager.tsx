import { useState } from 'react'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PersonIcon from '@mui/icons-material/Person'
import SearchIcon from '@mui/icons-material/Search'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { mockAMCs } from '../../data/amcs'

function formatAUM(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L Cr`
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K Cr`
  return `₹${n} Cr`
}

export function FundManager() {
  const [search, setSearch] = useState('')
  const [selectedAMC, setSelectedAMC] = useState<string | null>(null)

  const filtered = mockAMCs.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
  const detail = mockAMCs.find((a) => a.id === selectedAMC)

  if (detail) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <button onClick={() => setSelectedAMC(null)} className="flex items-center gap-1.5 text-sm text-[#606060] hover:text-white transition-colors">
          <ArrowBackIcon sx={{ fontSize: 15 }} />
          Fund Manager / AMFI
        </button>

        {/* AMC Header */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
              <AccountBalanceIcon sx={{ fontSize: 24, color: '#C5F135' }} />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white mb-1">{detail.name}</h1>
              <p className="text-xs text-[#606060] mb-3">SEBI Reg: {detail.sebiRegNo}</p>
              <p className="text-sm text-[#A0A0A0] leading-relaxed">{detail.description}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-5 border-t border-[#2A2A2A]">
            {[
              { label: 'Total AUM', value: formatAUM(detail.aum) },
              { label: 'Funds Managed', value: `${detail.fundsManaged} Schemes` },
              { label: 'Website', value: detail.website.replace('https://www.', '') },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[11px] text-[#606060] mb-0.5">{s.label}</p>
                <p className="text-sm font-semibold text-white">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fund Managers */}
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">Fund Managers</h2>
          <div className="grid grid-cols-2 gap-4">
            {detail.managers.map((mgr) => (
              <div key={mgr.name} className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                  <PersonIcon sx={{ fontSize: 18, color: '#A0A0A0' }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-0.5">{mgr.name}</p>
                  <p className="text-xs text-[#C5F135] mb-2">{mgr.designation}</p>
                  <div className="flex gap-4 text-xs text-[#606060]">
                    <span>Experience: <span className="text-[#A0A0A0]">{mgr.experience}</span></span>
                    <span>Funds: <span className="text-[#A0A0A0]">{mgr.fundsManaged}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AUM bar chart visual */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">AUM Rank vs Peers</h2>
          <div className="space-y-3">
            {mockAMCs.sort((a, b) => b.aum - a.aum).slice(0, 6).map((amc) => {
              const maxAUM = Math.max(...mockAMCs.map((a) => a.aum))
              const pct = (amc.aum / maxAUM) * 100
              const isActive = amc.id === detail.id
              return (
                <div key={amc.id} className="flex items-center gap-3">
                  <span className="text-xs text-[#A0A0A0] w-40 truncate" style={{ color: isActive ? '#C5F135' : undefined }}>{amc.name.split(' ').slice(0, 3).join(' ')}</span>
                  <div className="flex-1 bg-[#2A2A2A] rounded-full h-2">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: isActive ? '#C5F135' : '#2A2A2A', border: isActive ? 'none' : '1px solid #3A3A3A', background: isActive ? '#C5F135' : '#3A3A3A' }} />
                  </div>
                  <span className="text-xs font-medium text-[#A0A0A0] w-20 text-right">{formatAUM(amc.aum)}</span>
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
          <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
            <AccountBalanceIcon sx={{ fontSize: 18, color: '#C5F135' }} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Fund Manager / AMFI</h1>
            <p className="text-xs text-[#606060]">AMC profiles and fund manager track records</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-[#141414] border border-[#2A2A2A] rounded-xl px-3 py-2 max-w-sm">
        <SearchIcon sx={{ fontSize: 15, color: '#606060' }} />
        <input
          type="text"
          placeholder="Search AMC..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none text-sm text-white placeholder-[#606060] flex-1"
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
          <div key={s.label} className="bg-[#141414] border border-[#2A2A2A] rounded-xl px-4 py-3">
            <p className="text-[11px] text-[#606060] mb-1">{s.label}</p>
            <p className="text-sm font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* AMC grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((amc) => (
          <button
            key={amc.id}
            onClick={() => setSelectedAMC(amc.id)}
            className="text-left bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 hover:border-[#C5F135]/40 hover:bg-[#1A1A1A] transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                <AccountBalanceIcon sx={{ fontSize: 18, color: '#C5F135' }} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{amc.name}</p>
                <p className="text-[11px] text-[#606060]">{amc.fundsManaged} schemes</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-[11px] text-[#606060] mb-0.5">AUM</p>
                <p className="text-sm font-semibold text-white">{formatAUM(amc.aum)}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#606060] mb-0.5">Managers</p>
                <p className="text-sm font-semibold text-white">{amc.managers.length} profiled</p>
              </div>
            </div>

            {/* AUM bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#2A2A2A] rounded-full h-1">
                <div className="h-1 rounded-full bg-[#C5F135]" style={{ width: `${(amc.aum / 1200000) * 100}%` }} />
              </div>
              <span className="text-[10px] text-[#606060]">{((amc.aum / 6837090) * 100).toFixed(1)}% share</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

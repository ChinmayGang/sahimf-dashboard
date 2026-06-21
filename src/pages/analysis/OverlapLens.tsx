import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Aperture as BlurOnIcon,
  MagnifyingGlass,
  X,
  Plus,
  Warning,
  ArrowRight,
  Buildings,
  ChartPie,
  Stack,
  Lightning,
} from '@phosphor-icons/react'
import { useUIStore } from '../../stores/uiStore'
import { usePlan } from '../../hooks/usePlan'
import { ProTrialBanner } from '../../components/ui/ProTrialBanner'
import { useAuthStore } from '../../stores/authStore'
import { mockFunds } from '../../data/funds'

// â"€â"€ Mock sector / AMC data â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
const SECTOR_WEIGHTS: Record<string, Record<string, number>> = {
  f001: { Banking: 28, IT: 22, FMCG: 11, Auto: 9, Energy: 8, Pharma: 7, Infra: 6, Others: 9 },
  f002: { Banking: 18, IT: 14, FMCG: 8, Auto: 12, Energy: 6, Pharma: 14, Infra: 11, Others: 17 },
  f005: { Banking: 12, IT: 8, FMCG: 6, Auto: 18, Energy: 5, Pharma: 22, Infra: 14, Others: 15 },
  f006: { Banking: 9, IT: 6, FMCG: 4, Auto: 8, Energy: 22, Pharma: 10, Infra: 28, Others: 13 },
  f003: { Banking: 32, IT: 26, FMCG: 10, Auto: 7, Energy: 5, Pharma: 6, Infra: 4, Others: 10 },
  f004: { Banking: 8, IT: 4, FMCG: 3, Auto: 6, Energy: 4, Pharma: 28, Infra: 12, Others: 35 },
}

// Nifty 50 reference sector weights
const NIFTY_WEIGHTS: Record<string, number> = {
  Banking: 26, IT: 14, FMCG: 10, Auto: 9, Energy: 10, Pharma: 9, Infra: 8, Others: 14,
}

const SECTORS = ['Banking', 'IT', 'FMCG', 'Auto', 'Energy', 'Pharma', 'Infra', 'Others']

// Pairwise stock overlap matrix (symmetric)
const OVERLAP_PAIRS: Record<string, Record<string, number>> = {
  f001: { f001: 100, f002: 12, f003: 38, f004: 6, f005: 8, f006: 3 },
  f002: { f001: 12, f002: 100, f003: 21, f004: 9, f005: 18, f006: 6 },
  f003: { f001: 38, f002: 21, f003: 100, f004: 4, f005: 11, f006: 5 },
  f004: { f001: 6, f002: 9, f003: 4, f004: 100, f005: 14, f006: 8 },
  f005: { f001: 8, f002: 18, f003: 11, f004: 14, f005: 100, f006: 22 },
  f006: { f001: 3, f002: 6, f003: 5, f004: 8, f005: 22, f006: 100 },
}

const COMMON_STOCKS = [
  { name: 'HDFC Bank Ltd',               f001: 8.2, f002: 4.1, f003: 9.8, f004: 0,   f005: 0,   f006: 0   },
  { name: 'Infosys Ltd',                  f001: 6.8, f002: 5.4, f003: 7.2, f004: 0,   f005: 3.2, f006: 0   },
  { name: 'ICICI Bank Ltd',               f001: 7.1, f002: 3.8, f003: 8.4, f004: 0,   f005: 0,   f006: 2.1 },
  { name: 'Bharti Airtel Ltd',            f001: 4.2, f002: 3.1, f003: 0,   f004: 0,   f005: 2.8, f006: 0   },
  { name: 'Tata Consultancy Services',    f001: 5.9, f002: 4.8, f003: 6.6, f004: 0,   f005: 2.1, f006: 0   },
  { name: 'Avenue Supermarts (DMart)',    f001: 0,   f002: 2.9, f003: 0,   f004: 0,   f005: 3.4, f006: 0   },
  { name: 'Astral Ltd',                   f001: 0,   f002: 0,   f003: 0,   f004: 2.2, f005: 2.8, f006: 3.1 },
  { name: 'Cholamandalam Invest.',        f001: 0,   f002: 0,   f003: 0,   f004: 3.1, f005: 3.1, f006: 4.2 },
  { name: 'Reliance Industries',          f001: 4.4, f002: 2.2, f003: 5.1, f004: 0,   f005: 0,   f006: 8.4 },
  { name: 'Sun Pharma',                   f001: 0,   f002: 3.3, f003: 0,   f004: 6.8, f005: 5.2, f006: 0   },
]

function overlapColor(v: number, isDiag: boolean, lm?: boolean) {
  if (isDiag) return lm
    ? { bg: '#eeedfd', text: '#4f46e5', border: 'rgba(79,70,229,0.35)' }
    : { bg: 'rgba(214,253,112,0.15)', text: '#d6fd70', border: 'rgba(214,253,112,0.3)' }
  // Stronger, darker-text pills so they read clearly on a white background (pt 21)
  if (v >= 25)  return { bg: '#fee2e2', text: '#b91c1c', border: 'rgba(239,68,68,0.4)' }
  if (v >= 12)  return { bg: '#fef3c7', text: '#b45309', border: 'rgba(245,158,11,0.4)' }
  if (v > 0)    return { bg: '#dcfce7', text: '#15803d', border: 'rgba(34,197,94,0.35)' }
  return null
}

function sectorHeatColor(pct: number) {
  if (pct >= 30) return '#ef4444'
  if (pct >= 20) return '#f59e0b'
  if (pct >= 12) return '#4f46e5'
  if (pct >= 6)  return '#22c55e'
  return '#64748b'
}

// â"€â"€ Helpers â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function shortName(name: string) { return name.split(' ').slice(0, 2).join(' ') }

export function OverlapLens() {
  const navigate = useNavigate()
  const lm = useUIStore(s => s.lightMode)
  const { user } = useAuthStore()
  const { can } = usePlan()
  const isPro = can('pro')

  const [tab, setTab] = useState<'matrix' | 'sectors' | 'amc'>('matrix')
  const [selectedIds, setSelectedIds] = useState<string[]>(['f001', 'f002', 'f005', 'f006'])
  const [search, setSearch] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)

  const investCount = user?.investments?.length ?? 0

  // Style tokens
  const bg = lm ? '#ffffff' : '#0a0c0e'
  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#6B7280]' : 'text-[#64748b]'
  const divider = lm ? '#E0E3E8' : '#1e2838'
  const rowHover = lm ? 'hover:bg-[#F9FAFB]' : 'hover:bg-[#1a2130]'
  const inputBg = lm ? '#F9FAFB' : '#14171c'
  const inputBorder = lm ? '#E0E3E8' : '#1e2838'

  const selectedFunds = useMemo(() =>
    mockFunds.filter(f => selectedIds.includes(f.id)),
    [selectedIds]
  )

  const searchResults = mockFunds.filter(f =>
    !selectedIds.includes(f.id) &&
    f.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 8)

  // Worst overlap pairs (for large portfolio view)
  const worstPairs = useMemo(() => {
    const pairs: { a: string; b: string; val: number }[] = []
    for (let i = 0; i < selectedIds.length; i++) {
      for (let j = i + 1; j < selectedIds.length; j++) {
        const val = OVERLAP_PAIRS[selectedIds[i]]?.[selectedIds[j]] ?? 0
        pairs.push({ a: selectedIds[i], b: selectedIds[j], val })
      }
    }
    return pairs.sort((a, b) => b.val - a.val)
  }, [selectedIds])

  const highOverlapCount = worstPairs.filter(p => p.val >= 20).length

  // Sector aggregated across selected funds
  const avgSectors = useMemo(() => {
    if (selectedIds.length === 0) return {}
    return SECTORS.reduce((acc, s) => {
      const avg = selectedIds.reduce((sum, id) => sum + (SECTOR_WEIGHTS[id]?.[s] ?? 0), 0) / selectedIds.length
      acc[s] = Math.round(avg)
      return acc
    }, {} as Record<string, number>)
  }, [selectedIds])

  // AMC concentration
  const amcMap = useMemo(() => {
    const map: Record<string, number> = {}
    selectedFunds.forEach(f => {
      const amc = f.amcName ?? 'Unknown AMC'
      map[amc] = (map[amc] ?? 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [selectedFunds])

  const TABS = [
    { id: 'matrix', label: 'Stock Overlap', icon: <Stack size={14} weight="fill" /> },
    { id: 'sectors', label: 'Sector Exposure', icon: <ChartPie size={14} weight="fill" /> },
    { id: 'amc', label: 'AMC Concentration', icon: <Buildings size={14} weight="fill" /> },
  ] as const

  // â"€â"€ New investor state â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  if (investCount === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto" style={{ background: bg }}>
        <div className="flex items-center gap-3 mb-8">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'}`}>
            <BlurOnIcon size={18} color={lm ? '#6366f1' : '#d6fd70'} weight="fill" />
          </div>
          <div>
            <h1 className={`text-lg font-bold ${text}`}>Overlap Lens</h1>
            <p className={`text-xs ${textMuted}`}>Detect redundancy across your funds before it costs you</p>
          </div>
        </div>

        {/* Demo blurred preview */}
        <div className="relative rounded-3xl overflow-hidden mb-6" style={{ background: lm ? '#F3F4F6' : '#14171c', border: `1px solid ${divider}` }}>
          <div className="p-6 opacity-30 pointer-events-none select-none">
            <div className="grid grid-cols-5 gap-2 mb-4">
              {['', 'Fund A', 'Fund B', 'Fund C', 'Fund D'].map((h, i) => (
                <div key={i} className={`text-xs font-semibold text-center py-2 ${textSub}`}>{h}</div>
              ))}
              {['Fund A', 'Fund B', 'Fund C', 'Fund D'].map((row, ri) =>
                ['Fund A', 'Fund B', 'Fund C', 'Fund D'].map((_, ci) => {
                  const demoVals = [[100,14,32,5],[14,100,8,21],[32,8,100,11],[5,21,11,100]]
                  const v = demoVals[ri][ci]
                  const cl = v === 100 ? '#d6fd70' : v >= 20 ? '#ef4444' : v >= 10 ? '#f59e0b' : '#22c55e'
                  return ci === 0
                    ? <div key={ci} className={`text-xs font-medium ${text} flex items-center`}>{row}</div>
                    : <div key={ci} className="flex items-center justify-center">
                        <div className="w-14 h-10 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: `${cl}22`, color: cl }}>{v}%</div>
                      </div>
                })
              )}
            </div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm" style={{ background: lm ? 'rgba(237,233,254,0.82)' : 'rgba(10,12,14,0.6)' }}>
            <BlurOnIcon size={32} color={lm ? '#4f46e5' : '#d6fd70'} weight="fill" />
            <h3 className="font-bold text-lg mt-3 mb-1" style={{ color: lm ? '#111827' : '#ffffff' }}>Upload your portfolio to unlock</h3>
            <p className="text-sm mb-5 text-center max-w-xs" style={{ color: lm ? '#374151' : 'rgba(255,255,255,0.6)' }}>See exactly which funds overlap and what sectors you're overweight in</p>
            <button
              onClick={() => navigate('/auth/initialize')}
              className="flex items-center gap-2 bg-[#4f46e5] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#3730a3] transition-colors"
            >
              Upload CAS to Unlock <ArrowRight size={16} weight="bold" />
            </button>
          </div>
        </div>

        {/* What you'll see */}
        <div className={`grid grid-cols-3 gap-4`}>
          {[
            { icon: <Stack size={20} weight="fill" />, color: '#4f46e5', title: 'Stock Overlap Matrix', desc: 'Which funds share the same stocks and by how much' },
            { icon: <ChartPie size={20} weight="fill" />, color: '#0891b2', title: 'Sector Heat Map', desc: 'Your portfolio sector weights vs Nifty 50 benchmark' },
            { icon: <Buildings size={20} weight="fill" />, color: '#f59e0b', title: 'AMC Concentration', desc: 'Flag over-reliance on a single fund house' },
          ].map(item => (
            <div key={item.title} className={`rounded-2xl p-4 ${card}`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${item.color}18` }}>
                <span style={{ color: item.color }}>{item.icon}</span>
              </div>
              <p className={`text-sm font-semibold mb-1 ${text}`}>{item.title}</p>
              <p className={`text-xs ${textSub}`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5" style={{ background: bg }}>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'}`}>
            <BlurOnIcon size={18} color={lm ? '#6366f1' : '#d6fd70'} weight="fill" />
          </div>
          <div>
            <h1 className={`text-lg font-bold ${text}`}>Overlap Lens</h1>
            <p className={`text-xs ${textMuted}`}>{selectedIds.length} funds selected · {worstPairs.length} pairs analysed</p>
          </div>
        </div>
        {highOverlapCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <Warning size={14} weight="fill" color="#ef4444" />
            <span className="text-xs font-semibold text-[#ef4444]">{highOverlapCount} high-overlap pair{highOverlapCount > 1 ? 's' : ''} detected</span>
          </div>
        )}
      </div>

      {/* Fund Picker */}
      <div className={`rounded-2xl p-4 ${card}`}>
        <div className="flex items-center justify-between mb-3">
          <p className={`text-xs font-semibold uppercase tracking-wider ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'}`}>Funds being analysed</p>
          <button
            onClick={() => selectedIds.length < 5 && setPickerOpen(p => !p)}
            disabled={selectedIds.length >= 5}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: lm ? '#eeedfd' : 'rgba(79,70,229,0.15)', color: '#4f46e5' }}
          >
            <Plus size={13} weight="bold" /> {selectedIds.length >= 5 ? 'Max 5 funds' : 'Add Fund'}
          </button>
        </div>

        {/* Selected chips */}
        <div className="flex flex-wrap gap-2">
          {selectedFunds.map(f => (
            <div
              key={f.id}
              className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl text-xs font-medium"
              style={{ background: lm ? '#F3F4F6' : '#1e2838', color: lm ? '#374151' : '#d1d5db' }}
            >
              <span className="max-w-[140px] truncate">{f.name.split(' ').slice(0, 3).join(' ')}</span>
              <button
                onClick={() => setSelectedIds(ids => ids.filter(id => id !== f.id))}
                className="opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
              >
                <X size={12} weight="bold" />
              </button>
            </div>
          ))}
          {selectedIds.length === 0 && (
            <p className={`text-xs ${textMuted} italic`}>No funds selected — add funds to analyse</p>
          )}
        </div>

        {/* Search dropdown */}
        {pickerOpen && (
          <div className="mt-3">
            <div className="flex items-center gap-2 rounded-xl px-3 py-2 mb-2" style={{ background: lm ? '#ffffff' : inputBg, border: `1px solid ${lm ? '#D1D5DB' : inputBorder}` }}>
              <MagnifyingGlass size={14} color={lm ? '#9CA3AF' : '#64748b'} weight="fill" />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search funds to addâ€¦"
                className="flex-1 text-sm outline-none bg-transparent"
                style={{ color: lm ? '#111827' : '#ffffff' }}
              />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-0.5">
              {searchResults.map(f => (
                <button
                  key={f.id}
                  onClick={() => { if (selectedIds.length < 5) { setSelectedIds(ids => [...ids, f.id]); setSearch(''); setPickerOpen(false) } }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${rowHover}`}
                >
                  <div>
                    <p className={`text-xs font-medium ${text}`}>{f.name}</p>
                    <p className={`text-[11px] ${textMuted}`}>{f.category}</p>
                  </div>
                  <Plus size={14} color="#4f46e5" weight="bold" />
                </button>
              ))}
              {searchResults.length === 0 && search && (
                <p className={`text-xs ${textMuted} px-3 py-2`}>No funds found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: lm ? '#F3F4F6' : '#14171c', border: `1px solid ${divider}` }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: tab === t.id ? (lm ? '#4f46e5' : '#d6fd70') : 'transparent',
              color: tab === t.id ? (lm ? '#ffffff' : '#0a0c0e') : lm ? '#6B7280' : '#8390a2',
            }}
          >
            <span style={{ color: tab === t.id ? (lm ? '#ffffff' : '#0a0c0e') : undefined }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {selectedIds.length < 2 ? (
        <div className={`rounded-2xl p-10 text-center ${card}`}>
          <Stack size={32} color={lm ? '#E0E3E8' : '#1e2838'} weight="fill" />
          <p className={`text-sm font-medium mt-3 ${textSub}`}>Select at least 2 funds to see overlap analysis</p>
        </div>
      ) : (
        <>
          {/* â"€â"€ TAB: Stock Overlap â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
          {tab === 'matrix' && (
            <div className="space-y-4">
              {/* Legend */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {[
                  { color: lm ? '#4f46e5' : '#d6fd70', label: 'Same fund' },
                  { color: '#ef4444', label: 'High (â‰¥25%)' },
                  { color: '#f59e0b', label: 'Medium (12—24%)' },
                  { color: '#22c55e', label: 'Low (<12%)' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded" style={{ background: `${l.color}33`, border: `1.5px solid ${l.color}` }} />
                    <span className={textSub}>{l.label}</span>
                  </div>
                ))}
              </div>

              {/* Smart display: â‰¤8 funds â†' matrix, >8 â†' ranked pairs list */}
              {selectedIds.length <= 8 ? (
                <div className={`rounded-2xl overflow-auto ${card}`}>
                  <table className="min-w-full">
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${divider}` }}>
                        <th className={`text-left px-4 py-3 text-[11px] font-semibold text-[#111827] uppercase tracking-wider w-48`}> </th>
                        {selectedFunds.map(f => (
                          <th key={f.id} className="px-3 py-3 text-center min-w-[100px]">
                            <p className={`text-[11px] font-medium ${text} truncate max-w-24`}>{shortName(f.name)}</p>
                            <p className={`text-[10px] ${textMuted}`}>{f.subCategory}</p>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedFunds.map((rowF, ri) => (
                        <tr key={rowF.id} style={{ borderBottom: ri < selectedFunds.length - 1 ? `1px solid ${divider}` : 'none' }}
                          className={`transition-colors ${rowHover}`}>
                          <td className="px-4 py-3">
                            <p className={`text-xs font-semibold ${text}`}>{shortName(rowF.name)}</p>
                            <p className={`text-[10px] ${textMuted}`}>{rowF.category}</p>
                          </td>
                          {selectedFunds.map(colF => {
                            const val = OVERLAP_PAIRS[rowF.id]?.[colF.id] ?? 0
                            const isDiag = rowF.id === colF.id
                            const c = overlapColor(val, isDiag, lm)
                            return (
                              <td key={colF.id} className="px-3 py-3 text-center">
                                <div
                                  className="inline-flex items-center justify-center w-14 h-10 rounded-lg text-sm font-bold mx-auto"
                                  style={c ? { background: c.bg, color: c.text, border: `1px solid ${c.border}` } : { background: 'transparent', color: lm ? '#D1D5DB' : '#1e2838' }}
                                >
                                  {isDiag ? '—' : `${val}%`}
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* >8 funds: ranked worst-pairs list */
                <div className={`rounded-2xl overflow-hidden ${card}`}>
                  <div className="px-5 py-3" style={{ borderBottom: `1px solid ${divider}` }}>
                    <p className={`text-xs font-semibold text-[#111827] uppercase tracking-wider`}>
                      Overlap ranked — worst pairs first ({worstPairs.length} total)
                    </p>
                  </div>
                  {worstPairs.map((pair, i) => {
                    const fa = mockFunds.find(f => f.id === pair.a)
                    const fb = mockFunds.find(f => f.id === pair.b)
                    const c = overlapColor(pair.val, false, lm)
                    return (
                      <div key={`${pair.a}-${pair.b}`}
                        className={`flex items-center gap-4 px-5 py-3 transition-colors ${rowHover}`}
                        style={{ borderBottom: i < worstPairs.length - 1 ? `1px solid ${divider}` : 'none' }}
                      >
                        <span className={`text-xs font-bold w-5 ${textMuted}`}>{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold ${text}`}>{shortName(fa?.name ?? '')} Ã— {shortName(fb?.name ?? '')}</p>
                          <p className={`text-[10px] ${textMuted}`}>{fa?.category} · {fb?.category}</p>
                        </div>
                        <div
                          className="px-3 py-1 rounded-lg text-xs font-bold"
                          style={c ? { background: c.bg, color: c.text, border: `1px solid ${c.border}` } : { color: lm ? '#D1D5DB' : '#505d6f' }}
                        >
                          {pair.val}%
                        </div>
                        {pair.val >= 20 && (
                          <button
                            onClick={() => navigate('/mutual-funds/compare')}
                            className="text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors flex-shrink-0"
                            style={{ background: 'rgba(79,70,229,0.12)', color: '#6366f1' }}
                          >
                            Compare â†'
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Common stocks table */}
              <div className={`rounded-2xl overflow-hidden ${card}`}>
                <div className="px-5 py-3" style={{ borderBottom: `1px solid ${divider}` }}>
                  <p className={`text-xs font-semibold text-[#111827] uppercase tracking-wider`}>Common holdings (% of fund)</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${divider}` }}>
                        <th className={`text-left px-4 py-2.5 text-[11px] font-semibold text-[#111827] uppercase tracking-wide w-48`}>Stock</th>
                        {selectedFunds.map(f => (
                          <th key={f.id} className={`text-center px-3 py-2.5 text-[11px] font-semibold text-[#374151] min-w-[80px]`}>
                            {f.name.split(' ')[0]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {COMMON_STOCKS.map((stock, si) => {
                        const vals = selectedIds.map(id => (stock as unknown as Record<string, number>)[id] ?? 0)
                        const appearsIn = vals.filter(v => v > 0).length
                        if (appearsIn < 2) return null
                        return (
                          <tr key={stock.name} className={`transition-colors ${rowHover}`}
                            style={{ borderBottom: si < COMMON_STOCKS.length - 1 ? `1px solid ${divider}` : 'none' }}>
                            <td className={`px-4 py-2.5 text-xs font-medium ${text}`}>{stock.name}</td>
                            {selectedIds.map(id => {
                              const v = (stock as unknown as Record<string, number>)[id] ?? 0
                              return (
                                <td key={id} className="px-3 py-2.5 text-center">
                                  {v > 0
                                    ? <span className="text-xs font-semibold text-[#22c55e]">{v.toFixed(1)}%</span>
                                    : <span className={`text-xs ${textMuted}`}>—</span>
                                  }
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI insight */}
              {highOverlapCount > 0 && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
                  <Lightning size={16} weight="fill" color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p className="text-xs font-semibold text-[#f59e0b] mb-0.5">Overlap detected</p>
                    <p className={`text-xs ${textSub}`}>
                      {worstPairs[0] && `${shortName(mockFunds.find(f => f.id === worstPairs[0].a)?.name ?? '')} and ${shortName(mockFunds.find(f => f.id === worstPairs[0].b)?.name ?? '')} share ${worstPairs[0].val}% of their stock holdings — you're effectively doubling exposure to the same companies. `}
                      Consider swapping one for a fund in a different category to improve diversification.
                      <button onClick={() => navigate('/mutual-funds/compare')} className="ml-1 text-[#6366f1] font-semibold hover:underline">Compare alternatives â†'</button>
                    </p>
                  </div>
                </div>
              )}

              {/* â"€â"€ WORST OVERLAPPING PAIRS â"€â"€ */}
              <div className={`rounded-2xl overflow-hidden bg-white border ${highOverlapCount > 0 ? 'border-[#ef4444]/30' : 'border-[#E0E3E8]'}`}>
                <div className="px-5 py-4 border-b" style={{ borderColor: highOverlapCount > 0 ? 'rgba(239,68,68,0.15)' : divider }}>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold ${text}`}>Worst Overlapping Pairs</p>
                    {highOverlapCount > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                        {highOverlapCount} High
                      </span>
                    )}
                  </div>
                </div>
                <div className="divide-y" style={{ borderColor: divider }}>
                  {worstPairs.slice(0, 5).map((pair) => {
                    const fa = mockFunds.find(f => f.id === pair.a)
                    const fb = mockFunds.find(f => f.id === pair.b)
                    const severity = pair.val >= 30 ? { label: 'Very high', color: '#ef4444', bg: '#fee2e2', text: '#b91c1c' }
                      : pair.val >= 18 ? { label: 'Moderate', color: '#f59e0b', bg: '#fef3c7', text: '#b45309' }
                      : pair.val >= 8  ? { label: 'Low', color: '#22c55e', bg: '#dcfce7', text: '#15803d' }
                      : { label: 'Healthy', color: '#22c55e', bg: '#dcfce7', text: '#15803d' }
                    const stocksShared = Math.round(pair.val * 0.5)
                    const desc = pair.val >= 30
                      ? `${stocksShared} of 50 stocks shared · Both ${fa?.category ?? ''} mandated`
                      : pair.val >= 18
                      ? `${stocksShared} of 50 stocks shared · Top Nifty names overlap`
                      : pair.val >= 8
                      ? `${stocksShared} of 50 stocks shared · Partial sector overlap`
                      : 'Minimal overlap — different market universe'
                    return (
                      <div key={`${pair.a}-${pair.b}`} className="px-5 py-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0 pr-4">
                            <p className={`text-sm font-semibold ${text}`}>{shortName(fa?.name ?? '')} Ã— {shortName(fb?.name ?? '')}</p>
                            <p className={`text-xs ${textMuted} mt-0.5`}>{desc}</p>
                          </div>
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: severity.bg, color: severity.text }}>
                            {severity.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: lm ? '#F3F4F6' : '#1e2838' }}>
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${pair.val}%`, background: severity.color }}
                            />
                          </div>
                          <span className="text-xs font-bold w-10 text-right" style={{ color: severity.color }}>{pair.val}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* â"€â"€ MOST DUPLICATED STOCKS â"€â"€ */}
              {(() => {
                const FUND_COLORS: Record<string, string> = { f001: '#4f46e5', f002: '#0891b2', f003: '#16a34a', f005: '#ea580c', f006: '#db2777' }
                const duplicated = COMMON_STOCKS
                  .map(s => {
                    const fundsHolding = selectedIds.filter(id => ((s as unknown as Record<string, number>)[id] ?? 0) > 0)
                    const totalPct = fundsHolding.reduce((sum, id) => sum + ((s as unknown as Record<string, number>)[id] ?? 0), 0)
                    return { name: s.name, fundsHolding, totalPct, fundCount: fundsHolding.length }
                  })
                  .filter(s => s.fundCount >= 2)
                  .sort((a, b) => b.fundCount - a.fundCount || b.totalPct - a.totalPct)
                  .slice(0, 8)
                if (duplicated.length === 0) return null
                return (
                  <div className={`rounded-2xl p-5 ${card}`}>
                    <p className={`text-sm font-bold ${text} mb-1`}>MOST DUPLICATED STOCKS ACROSS YOUR PORTFOLIO</p>
                    <p className={`text-xs ${textMuted} mb-4`}>Stocks you're holding in multiple funds — you're paying for the same exposure multiple times.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {duplicated.map(s => (
                        <div key={s.name} className={`rounded-xl p-3 ${lm ? 'bg-[#F9FAFB] border border-[#E0E3E8]' : 'bg-[#0f1420] border border-[#1e2838]'}`}>
                          <div className="flex items-start justify-between mb-2">
                            <p className={`text-xs font-semibold leading-tight ${text}`}>{s.name}</p>
                            <div className="flex gap-0.5 ml-2 flex-shrink-0">
                              {s.fundsHolding.map(id => (
                                <div key={id} className="w-2 h-2 rounded-full" style={{ background: FUND_COLORS[id] ?? '#64748b' }} />
                              ))}
                            </div>
                          </div>
                          <p className={`text-[10px] ${textMuted}`}>
                            {s.fundCount} funds · {s.totalPct.toFixed(1)}% of portfolio
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {selectedFunds.map(f => (
                        <div key={f.id} className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ background: FUND_COLORS[f.id] ?? '#64748b' }} />
                          <span className={`text-[10px] ${textMuted}`}>{f.name.split(' ').slice(0, 2).join(' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* â"€â"€ SECTOR OVERLAP ACROSS ALL FUNDS (stacked) â"€â"€ */}
              <div className={`rounded-2xl p-5 ${card}`}>
                <p className={`text-sm font-bold ${text} mb-1`}>SECTOR OVERLAP ACROSS ALL FUNDS</p>
                <p className={`text-xs ${textMuted} mb-4`}>Bars show each fund's weight in that sector. Tall bars = concentrated exposure through multiple funds.</p>
                <div className="space-y-2.5">
                  {SECTORS.slice(0, 6).map(sector => {
                    const FUND_COLORS: Record<string, string> = { f001: '#4f46e5', f002: '#0891b2', f003: '#22c55e', f005: '#ea580c', f006: '#db2777' }
                    const fundWeights = selectedIds.map(id => ({ id, weight: SECTOR_WEIGHTS[id]?.[sector] ?? 0 }))
                    const avg = Math.round(fundWeights.reduce((s, f) => s + f.weight, 0) / fundWeights.length)
                    const max = 40
                    return (
                      <div key={sector} className="flex items-center gap-3">
                        <span className={`text-xs font-medium w-28 flex-shrink-0 ${textSub}`}>{sector}</span>
                        <div className="flex-1 flex items-center gap-0.5 h-4 rounded overflow-hidden" style={{ background: lm ? '#F3F4F6' : '#1e2838' }}>
                          {fundWeights.map(fw => (
                            <div
                              key={fw.id}
                              className="h-full flex-shrink-0 first:rounded-l-sm last:rounded-r-sm"
                              style={{ width: `${(fw.weight / max) * 100 / fundWeights.length * 4}%`, background: FUND_COLORS[fw.id] ?? '#64748b', opacity: fw.weight > 0 ? 0.85 : 0 }}
                              title={`${fw.weight}%`}
                            />
                          ))}
                        </div>
                        <span className={`text-xs font-semibold w-14 text-right ${textMuted}`}>{avg}% avg</span>
                      </div>
                    )
                  })}
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  {selectedFunds.slice(0, 4).map((f, i) => {
                    const FUND_COLORS = ['#4f46e5', '#0891b2', '#22c55e', '#ea580c']
                    return (
                      <div key={f.id} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ background: FUND_COLORS[i] }} />
                        <span className={`text-[10px] ${textMuted}`}>{f.name.split(' ').slice(0, 2).join(' ')}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* â"€â"€ TAB: Sector Exposure â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
          {tab === 'sectors' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: '#4f46e5' }} /><span className={textSub}>Your portfolio (avg)</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded border-2 border-dashed" style={{ borderColor: '#64748b' }} /><span className={textSub}>Nifty 50 weight</span></div>
              </div>

              <div className={`rounded-2xl overflow-hidden ${card}`}>
                <div className="px-5 py-3" style={{ borderBottom: `1px solid ${divider}` }}>
                  <p className={`text-xs font-semibold text-[#111827] uppercase tracking-wider`}>Sector allocation vs Nifty 50</p>
                  <p className={`text-[11px] ${textSub} mt-0.5 normal-case`}>The coloured bar is your portfolio's average weight in each sector. The grey vertical line marks the Nifty 50 benchmark weight.</p>
                </div>
                <div className="p-5 space-y-4">
                  {SECTORS.map(sector => {
                    const yours = avgSectors[sector] ?? 0
                    const nifty = NIFTY_WEIGHTS[sector] ?? 0
                    const diff = yours - nifty
                    const maxBar = 40
                    return (
                      <div key={sector}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-xs font-semibold ${text}`}>{sector}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${textMuted}`}>Nifty {nifty}%</span>
                            <span className="text-xs font-bold" style={{ color: diff > 5 ? '#f59e0b' : diff < -5 ? '#ef4444' : '#22c55e' }}>
                              {diff > 0 ? '+' : ''}{diff}% vs index
                            </span>
                          </div>
                        </div>
                        <div className="relative h-7 rounded-lg overflow-hidden" style={{ background: lm ? '#F3F4F6' : '#1e2838' }}>
                          {/* Nifty reference line */}
                          <div className="absolute top-0 bottom-0 w-0.5 z-10" style={{ left: `${(nifty / maxBar) * 100}%`, background: '#64748b' }} />
                          {/* Your bar */}
                          <div
                            className="absolute top-0 left-0 bottom-0 rounded-lg flex items-center px-2.5 transition-all"
                            style={{ width: `${Math.min((yours / maxBar) * 100, 100)}%`, background: sectorHeatColor(yours) + '33', border: `1px solid ${sectorHeatColor(yours)}55` }}
                          >
                            <span className="text-xs font-bold" style={{ color: sectorHeatColor(yours) }}>{yours}%</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Per-fund sector breakdown */}
              <div className={`rounded-2xl overflow-hidden ${card}`}>
                <div className="px-5 py-3" style={{ borderBottom: `1px solid ${divider}` }}>
                  <p className={`text-xs font-semibold text-[#111827] uppercase tracking-wider`}>Per-fund sector breakdown</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${divider}` }}>
                        <th className={`text-left px-4 py-2.5 text-[11px] font-semibold text-[#111827] uppercase tracking-wide w-28`}>Sector</th>
                        {selectedFunds.map(f => (
                          <th key={f.id} className={`text-center px-3 py-2.5 text-[11px] font-semibold text-[#374151] min-w-[90px]`}>
                            {shortName(f.name)}
                          </th>
                        ))}
                        <th className={`text-center px-3 py-2.5 text-[11px] font-semibold text-[#374151]`}>Nifty 50</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SECTORS.map((sector, si) => (
                        <tr key={sector} className={`transition-colors ${rowHover}`}
                          style={{ borderBottom: si < SECTORS.length - 1 ? `1px solid ${divider}` : 'none' }}>
                          <td className={`px-4 py-2.5 text-xs font-semibold ${text}`}>{sector}</td>
                          {selectedIds.map(id => {
                            const v = SECTOR_WEIGHTS[id]?.[sector] ?? 0
                            return (
                              <td key={id} className="px-3 py-2.5 text-center">
                                <span className="text-xs font-medium" style={{ color: sectorHeatColor(v) }}>{v}%</span>
                              </td>
                            )
                          })}
                          <td className="px-3 py-2.5 text-center">
                            <span className={`text-xs font-medium ${textSub}`}>{NIFTY_WEIGHTS[sector]}%</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.2)' }}>
                <Lightning size={16} weight="fill" color="#6366f1" style={{ flexShrink: 0, marginTop: 2 }} />
                <p className={`text-xs ${textSub}`}>
                  <span className="font-semibold text-[#6366f1]">Sector insight: </span>
                  Your portfolio is {avgSectors['Banking'] > NIFTY_WEIGHTS['Banking'] ? `overweight Banking by +${avgSectors['Banking'] - NIFTY_WEIGHTS['Banking']}%` : `underweight Banking by ${NIFTY_WEIGHTS['Banking'] - avgSectors['Banking']}%`} vs Nifty 50.
                  {' '}PRO analysis shows rolling sector drift and rebalancing alerts.
                </p>
              </div>
            </div>
          )}

          {/* â"€â"€ TAB: AMC Concentration â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
          {tab === 'amc' && (
            <div className="space-y-4">
              <div className={`rounded-2xl overflow-hidden ${card}`}>
                <div className="px-5 py-3" style={{ borderBottom: `1px solid ${divider}` }}>
                  <p className={`text-xs font-semibold text-[#111827] uppercase tracking-wider`}>Fund house concentration</p>
                </div>
                <div className="p-5 space-y-4">
                  {amcMap.map(([amc, count]) => {
                    const pct = Math.round((count / selectedIds.length) * 100)
                    const isHigh = pct >= 40
                    return (
                      <div key={amc}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <Buildings size={14} weight="fill" color={isHigh ? '#f59e0b' : lm ? '#6B7280' : '#8390a2'} />
                            <span className={`text-xs font-semibold ${text}`}>{amc}</span>
                            {isHigh && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>High concentration</span>
                            )}
                          </div>
                          <span className={`text-xs font-bold ${text}`}>{count} fund{count > 1 ? 's' : ''} · {pct}%</span>
                        </div>
                        <div className="h-3 rounded-full overflow-hidden" style={{ background: lm ? '#F3F4F6' : '#1e2838' }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              background: isHigh ? '#f59e0b' : '#4f46e5',
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className={`rounded-2xl p-4 ${card}`}>
                <p className={`text-xs font-semibold ${textSub} mb-3`}>Funds in selection</p>
                <div className="space-y-2">
                  {selectedFunds.map(f => (
                    <div key={f.id} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: lm ? '#F3F4F6' : '#1e2838' }}>
                        <Buildings size={14} weight="fill" color={lm ? '#6B7280' : '#8390a2'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium truncate ${text}`}>{f.name}</p>
                        <p className={`text-[10px] ${textMuted}`}>{f.amcName}</p>
                      </div>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${lm ? 'bg-[#F3F4F6] text-[#374151]' : 'bg-[#1e2838] text-[#8390a2]'}`}>{f.category}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <Lightning size={16} weight="fill" color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                <p className={`text-xs ${textSub}`}>
                  <span className="font-semibold text-[#22c55e]">Best practice: </span>
                  SEBI recommends not holding more than 40% of your portfolio with a single AMC. Spreading across 3—4 AMCs reduces fund-house risk significantly.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {!isPro && (
        <div className="px-6 pb-6">
          <ProTrialBanner
            headline="Unlock deeper overlap insights with Sahi PRO"
            features={['Rolling sector drift alerts', 'AMC concentration risk', 'Rebalancing suggestions', 'Portfolio stress test']}
          />
        </div>
      )}
    </div>
  )
}

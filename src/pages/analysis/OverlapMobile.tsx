import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MagnifyingGlass,
  X,
  Plus,
  Warning,
  ArrowRight,
  Buildings,
  ChartPie,
  Stack,
  Lightning,
  CaretDown,
  CaretUp,
  ArrowSquareOut,
  SealWarning,
  CheckCircle,
  Aperture,
} from '@phosphor-icons/react'
import { useAuthStore } from '../../stores/authStore'
import { usePlan } from '../../hooks/usePlan'
import { mockFunds } from '../../data/funds'

// ── Data (same as OverlapLens) ──────────────────────────────────────────────
const SECTOR_WEIGHTS: Record<string, Record<string, number>> = {
  f001: { Banking: 28, IT: 22, FMCG: 11, Auto: 9, Energy: 8, Pharma: 7, Infra: 6, Others: 9 },
  f002: { Banking: 18, IT: 14, FMCG: 8, Auto: 12, Energy: 6, Pharma: 14, Infra: 11, Others: 17 },
  f005: { Banking: 12, IT: 8, FMCG: 6, Auto: 18, Energy: 5, Pharma: 22, Infra: 14, Others: 15 },
  f006: { Banking: 9, IT: 6, FMCG: 4, Auto: 8, Energy: 22, Pharma: 10, Infra: 28, Others: 13 },
  f003: { Banking: 32, IT: 26, FMCG: 10, Auto: 7, Energy: 5, Pharma: 6, Infra: 4, Others: 10 },
  f004: { Banking: 8, IT: 4, FMCG: 3, Auto: 6, Energy: 4, Pharma: 28, Infra: 12, Others: 35 },
}
const NIFTY_WEIGHTS: Record<string, number> = {
  Banking: 26, IT: 14, FMCG: 10, Auto: 9, Energy: 10, Pharma: 9, Infra: 8, Others: 14,
}
const SECTORS = ['Banking', 'IT', 'FMCG', 'Auto', 'Energy', 'Pharma', 'Infra', 'Others']
const OVERLAP_PAIRS: Record<string, Record<string, number>> = {
  f001: { f001: 100, f002: 12, f003: 38, f004: 6, f005: 8, f006: 3 },
  f002: { f001: 12, f002: 100, f003: 21, f004: 9, f005: 18, f006: 6 },
  f003: { f001: 38, f002: 21, f003: 100, f004: 4, f005: 11, f006: 5 },
  f004: { f001: 6, f002: 9, f003: 4, f004: 100, f005: 14, f006: 8 },
  f005: { f001: 8, f002: 18, f003: 11, f004: 14, f005: 100, f006: 22 },
  f006: { f001: 3, f002: 6, f003: 5, f004: 8, f005: 22, f006: 100 },
}
const COMMON_STOCKS = [
  { name: 'HDFC Bank Ltd',            f001: 8.2, f002: 4.1, f003: 9.8, f004: 0,   f005: 0,   f006: 0   },
  { name: 'Infosys Ltd',              f001: 6.8, f002: 5.4, f003: 7.2, f004: 0,   f005: 3.2, f006: 0   },
  { name: 'ICICI Bank Ltd',           f001: 7.1, f002: 3.8, f003: 8.4, f004: 0,   f005: 0,   f006: 2.1 },
  { name: 'Bharti Airtel Ltd',        f001: 4.2, f002: 3.1, f003: 0,   f004: 0,   f005: 2.8, f006: 0   },
  { name: 'Tata Consultancy Services',f001: 5.9, f002: 4.8, f003: 6.6, f004: 0,   f005: 2.1, f006: 0   },
  { name: 'Avenue Supermarts (DMart)',f001: 0,   f002: 2.9, f003: 0,   f004: 0,   f005: 3.4, f006: 0   },
  { name: 'Astral Ltd',               f001: 0,   f002: 0,   f003: 0,   f004: 2.2, f005: 2.8, f006: 3.1 },
  { name: 'Cholamandalam Invest.',    f001: 0,   f002: 0,   f003: 0,   f004: 3.1, f005: 3.1, f006: 4.2 },
  { name: 'Reliance Industries',      f001: 4.4, f002: 2.2, f003: 5.1, f004: 0,   f005: 0,   f006: 8.4 },
  { name: 'Sun Pharma',               f001: 0,   f002: 3.3, f003: 0,   f004: 6.8, f005: 5.2, f006: 0   },
]

// ── Design tokens (always light — mobile app is light mode only) ─────────────
const PAGE_BG    = '#F5F4FF'
const CARD_BG    = '#ffffff'
const CARD_BORDER= '#E8E6FF'
const HEADER_BG  = '#4f46e5'
const LIME       = '#d6fd70'
const INDIGO     = '#4f46e5'
const TEXT       = '#111827'
const TEXT_SUB   = '#6B7280'
const TEXT_MUTED = '#9CA3AF'
const RED        = '#ef4444'
const AMBER      = '#f59e0b'
const GREEN      = '#22c55e'

// Fund color palette for dot markers
const FUND_COLORS = ['#4f46e5', '#0891b2', '#16a34a', '#ea580c', '#db2777']

function shortName(name: string) { return name.split(' ').slice(0, 3).join(' ') }

function pairSeverity(v: number) {
  if (v >= 30) return { label: 'Very High', color: RED,   bg: '#fee2e2', textColor: '#b91c1c' }
  if (v >= 18) return { label: 'High',      color: AMBER, bg: '#fef3c7', textColor: '#b45309' }
  if (v >= 8)  return { label: 'Moderate',  color: GREEN, bg: '#dcfce7', textColor: '#15803d' }
  return           { label: 'Low',      color: '#6366f1', bg: '#eeedfd', textColor: '#4f46e5' }
}

function sectorHeatColor(pct: number) {
  if (pct >= 30) return RED
  if (pct >= 20) return AMBER
  if (pct >= 12) return INDIGO
  if (pct >= 6)  return GREEN
  return TEXT_MUTED
}

// ── Reusable: Accordion Row ──────────────────────────────────────────────────
function AccordionRow({ label, sub, right, children, defaultOpen = false }: {
  label: string; sub?: string; right?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left active:bg-[#F5F4FF] transition-colors"
      >
        <div className="flex-1 min-w-0 pr-3">
          <p className="text-sm font-semibold" style={{ color: TEXT }}>{label}</p>
          {sub && <p className="text-xs mt-0.5" style={{ color: TEXT_SUB }}>{sub}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {right}
          {open
            ? <CaretUp size={14} weight="bold" color={TEXT_MUTED} />
            : <CaretDown size={14} weight="bold" color={TEXT_MUTED} />
          }
        </div>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

// ── Reusable: Section Card ───────────────────────────────────────────────────
function SectionCard({ title, icon, children, noPad = false }: {
  title?: string; icon?: React.ReactNode; children: React.ReactNode; noPad?: boolean
}) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
      {title && (
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
          {icon}
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: TEXT }}>{title}</p>
        </div>
      )}
      <div className={noPad ? '' : 'p-4'}>{children}</div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────
export function OverlapMobile() {
  const navigate   = useNavigate()
  const { user }   = useAuthStore()
  const { can }    = usePlan()
  const isPro      = can('pro')

  const [tab,         setTab]         = useState<'overlap' | 'sectors' | 'amc'>('overlap')
  const [selectedIds, setSelectedIds] = useState<string[]>(['f001', 'f002', 'f005', 'f006'])
  const [search,      setSearch]      = useState('')
  const [pickerOpen,  setPickerOpen]  = useState(false)

  const investCount = user?.investments?.length ?? 0

  const selectedFunds = useMemo(() =>
    mockFunds.filter(f => selectedIds.includes(f.id)), [selectedIds])

  const searchResults = mockFunds.filter(f =>
    !selectedIds.includes(f.id) &&
    f.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 8)

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

  const avgOverlap = useMemo(() => {
    if (worstPairs.length === 0) return 0
    return Math.round(worstPairs.reduce((s, p) => s + p.val, 0) / worstPairs.length)
  }, [worstPairs])

  const highOverlapCount = worstPairs.filter(p => p.val >= 20).length

  const avgSectors = useMemo(() => {
    if (selectedIds.length === 0) return {}
    return SECTORS.reduce((acc, s) => {
      acc[s] = Math.round(selectedIds.reduce((sum, id) => sum + (SECTOR_WEIGHTS[id]?.[s] ?? 0), 0) / selectedIds.length)
      return acc
    }, {} as Record<string, number>)
  }, [selectedIds])

  const amcMap = useMemo(() => {
    const map: Record<string, string[]> = {}
    selectedFunds.forEach(f => {
      const amc = f.amcName ?? 'Unknown'
      if (!map[amc]) map[amc] = []
      map[amc].push(f.id)
    })
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length)
  }, [selectedFunds])

  const duplicatedStocks = useMemo(() =>
    COMMON_STOCKS
      .map(s => {
        const fundsHolding = selectedIds.filter(id => ((s as unknown as Record<string, number>)[id] ?? 0) > 0)
        return { ...s, fundsHolding, fundCount: fundsHolding.length }
      })
      .filter(s => s.fundCount >= 2)
      .sort((a, b) => b.fundCount - a.fundCount)
  , [selectedIds])

  const overlapScore = Math.max(0, 100 - avgOverlap * 2)
  const scoreColor = overlapScore >= 70 ? GREEN : overlapScore >= 45 ? AMBER : RED
  const scoreLabel = overlapScore >= 70 ? 'Well diversified' : overlapScore >= 45 ? 'Some redundancy' : 'High redundancy'

  // ── Empty state ──────────────────────────────────────────────────────────
  if (investCount === 0) {
    return (
      <div style={{ background: PAGE_BG, minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ background: HEADER_BG }} className="px-4 pt-5 pb-8">
          <h1 className="text-xl font-bold text-white mb-1">Overlap Lens</h1>
          <p className="text-sm text-white/70">Detect fund redundancy before it costs you</p>
        </div>
        <div className="-mt-4 px-4 space-y-3">
          {/* Blurred preview */}
          <div className="rounded-2xl overflow-hidden relative" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
            <div className="p-4 opacity-20 pointer-events-none select-none">
              {['HDFC Flexi Cap × Mirae Large Cap', 'Parag Parikh × Axis Bluechip', 'SBI Small Cap × Nippon'].map((pair, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < 2 ? `1px solid ${CARD_BORDER}` : 'none' }}>
                  <div className="flex-1"><p className="text-sm font-medium" style={{ color: TEXT }}>{pair}</p></div>
                  <div className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: '#fee2e2', color: '#b91c1c' }}>{[38, 21, 14][i]}%</div>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(245,244,255,0.94)', backdropFilter: 'blur(12px)' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: `${INDIGO}15` }}>
                <Aperture size={28} color={INDIGO} weight="fill" />
              </div>
              <p className="text-base font-bold mb-1" style={{ color: TEXT }}>Upload portfolio to unlock</p>
              <p className="text-xs text-center mb-5 px-6" style={{ color: TEXT_SUB }}>See exactly which funds overlap and where you're doubling exposure</p>
              <button
                onClick={() => navigate('/auth/initialize')}
                className="flex items-center gap-2 text-white text-sm font-bold px-5 py-3 rounded-xl"
                style={{ background: INDIGO }}
              >
                Upload CAS <ArrowRight size={16} weight="bold" />
              </button>
            </div>
          </div>
          {/* Feature previews */}
          {[
            { icon: <Stack size={18} weight="fill" color={INDIGO} />, title: 'Stock Overlap Score', desc: 'Which funds share the same stocks' },
            { icon: <ChartPie size={18} weight="fill" color="#0891b2" />, title: 'Sector Heat Map', desc: 'Your weights vs Nifty 50 benchmark' },
            { icon: <Buildings size={18} weight="fill" color={AMBER} />, title: 'AMC Concentration', desc: 'Flag single fund-house overload' },
          ].map(item => (
            <div key={item.title} className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F5F4FF' }}>{item.icon}</div>
              <div>
                <p className="text-sm font-semibold" style={{ color: TEXT }}>{item.title}</p>
                <p className="text-xs" style={{ color: TEXT_SUB }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: PAGE_BG, minHeight: '100vh', paddingBottom: 80 }}>

      {/* ── Purple Header ─────────────────────────────────────────────────── */}
      <div style={{ background: HEADER_BG }} className="px-4 pt-5 pb-14">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h1 className="text-xl font-bold text-white">Overlap Lens</h1>
            <p className="text-sm text-white/60">{selectedIds.length} funds · {worstPairs.length} pairs</p>
          </div>
          {highOverlapCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl" style={{ background: 'rgba(239,68,68,0.25)', border: '1px solid rgba(239,68,68,0.4)' }}>
              <Warning size={13} weight="fill" color="#fca5a5" />
              <span className="text-xs font-bold text-[#fca5a5]">{highOverlapCount} high overlap</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Score Ring Card (floats over header) ──────────────────────────── */}
      <div className="px-4 -mt-10 mb-3">
        <div className="rounded-2xl p-4" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, boxShadow: '0 4px 24px rgba(79,70,229,0.08)' }}>
          <div className="flex items-center gap-5">
            {/* Circular score */}
            <div className="relative flex-shrink-0 w-20 h-20">
              <svg viewBox="0 0 80 80" width="80" height="80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#F3F4F6" strokeWidth="7" />
                <circle
                  cx="40" cy="40" r="32" fill="none"
                  stroke={scoreColor} strokeWidth="7"
                  strokeDasharray={`${(overlapScore / 100) * 201} 201`}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                  style={{ transition: 'stroke-dasharray 0.6s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black" style={{ color: scoreColor }}>{overlapScore}</span>
                <span className="text-[9px] font-bold" style={{ color: TEXT_MUTED }}>/ 100</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-bold" style={{ color: TEXT }}>Portfolio Score</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${scoreColor}18`, color: scoreColor }}>{scoreLabel}</span>
              </div>
              <p className="text-xs mb-2.5" style={{ color: TEXT_SUB }}>
                {avgOverlap}% average overlap across {worstPairs.length} fund pairs
              </p>
              <div className="flex gap-4">
                <div>
                  <p className="text-[10px] font-medium" style={{ color: TEXT_MUTED }}>HIGH OVERLAP</p>
                  <p className="text-sm font-bold" style={{ color: RED }}>{highOverlapCount} pairs</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium" style={{ color: TEXT_MUTED }}>SHARED STOCKS</p>
                  <p className="text-sm font-bold" style={{ color: INDIGO }}>{duplicatedStocks.length}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium" style={{ color: TEXT_MUTED }}>AMC RISK</p>
                  <p className="text-sm font-bold" style={{ color: amcMap[0]?.[1].length > 1 ? AMBER : GREEN }}>
                    {amcMap[0]?.[1].length > 1 ? 'Flag' : 'OK'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Fund Chips Row ─────────────────────────────────────────────────── */}
      <div className="px-4 mb-3">
        <div className="rounded-2xl p-3" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
          <div className="flex items-center gap-2 mb-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider flex-1" style={{ color: TEXT_MUTED }}>Funds being compared</p>
            <button
              disabled={selectedIds.length >= 5}
              onClick={() => setPickerOpen(p => !p)}
              className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg disabled:opacity-40"
              style={{ background: `${INDIGO}12`, color: INDIGO }}
            >
              <Plus size={11} weight="bold" />
              {selectedIds.length >= 5 ? 'Max 5' : 'Add'}
            </button>
          </div>
          {/* Horizontal scroll chips */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {selectedFunds.map((f, i) => (
              <div
                key={f.id}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl flex-shrink-0 text-xs font-medium"
                style={{ background: `${FUND_COLORS[i % FUND_COLORS.length]}15`, border: `1px solid ${FUND_COLORS[i % FUND_COLORS.length]}30`, color: TEXT }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: FUND_COLORS[i % FUND_COLORS.length] }} />
                <span className="max-w-[120px] truncate">{shortName(f.name)}</span>
                <button onClick={() => setSelectedIds(ids => ids.filter(id => id !== f.id))} className="ml-0.5 opacity-50 hover:opacity-100">
                  <X size={11} weight="bold" />
                </button>
              </div>
            ))}
          </div>

          {/* Fund search dropdown */}
          {pickerOpen && (
            <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
              <div className="flex items-center gap-2 rounded-xl px-3 py-2 mb-2" style={{ background: PAGE_BG, border: `1px solid ${CARD_BORDER}` }}>
                <MagnifyingGlass size={14} color={TEXT_MUTED} weight="fill" />
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search funds..."
                  className="flex-1 text-sm bg-transparent outline-none"
                  style={{ color: TEXT }}
                />
              </div>
              <div className="max-h-44 overflow-y-auto space-y-0.5">
                {searchResults.map(f => (
                  <button
                    key={f.id}
                    onClick={() => { setSelectedIds(ids => [...ids, f.id]); setSearch(''); setPickerOpen(false) }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left active:bg-[#F5F4FF]"
                  >
                    <div>
                      <p className="text-xs font-semibold" style={{ color: TEXT }}>{f.name}</p>
                      <p className="text-[11px]" style={{ color: TEXT_MUTED }}>{f.category}</p>
                    </div>
                    <Plus size={14} color={INDIGO} weight="bold" />
                  </button>
                ))}
                {searchResults.length === 0 && search && (
                  <p className="text-xs px-3 py-2" style={{ color: TEXT_MUTED }}>No funds found</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Alert Banner ──────────────────────────────────────────────────── */}
      {highOverlapCount > 0 && (
        <div className="px-4 mb-3">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: '#fff7ed', border: `1px solid ${AMBER}40` }}>
            <SealWarning size={20} weight="fill" color={AMBER} className="flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold" style={{ color: '#92400e' }}>Redundancy detected</p>
              <p className="text-xs" style={{ color: '#b45309' }}>
                {worstPairs[0] && `${shortName(mockFunds.find(f => f.id === worstPairs[0].a)?.name ?? '')} & ${shortName(mockFunds.find(f => f.id === worstPairs[0].b)?.name ?? '')} share ${worstPairs[0].val}% stocks`}
              </p>
            </div>
            <button onClick={() => navigate('/mutual-funds/compare')} className="flex-shrink-0">
              <ArrowSquareOut size={16} color={AMBER} weight="fill" />
            </button>
          </div>
        </div>
      )}

      {/* ── Tab Pills ─────────────────────────────────────────────────────── */}
      <div className="px-4 mb-4">
        <div className="flex gap-1.5 p-1 rounded-2xl" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
          {([
            { id: 'overlap', label: 'Overlap', icon: <Stack size={13} weight="fill" /> },
            { id: 'sectors', label: 'Sectors', icon: <ChartPie size={13} weight="fill" /> },
            { id: 'amc',     label: 'AMC Risk', icon: <Buildings size={13} weight="fill" /> },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={{
                background: tab === t.id ? INDIGO : 'transparent',
                color: tab === t.id ? '#ffffff' : TEXT_SUB,
              }}
            >
              <span style={{ opacity: tab === t.id ? 1 : 0.6 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {selectedIds.length < 2 ? (
        <div className="px-4">
          <div className="flex flex-col items-center justify-center py-12 rounded-2xl" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
            <Stack size={36} color={CARD_BORDER} weight="fill" />
            <p className="text-sm font-semibold mt-3" style={{ color: TEXT_SUB }}>Select at least 2 funds to analyse</p>
          </div>
        </div>
      ) : (
        <div className="px-4 space-y-3">

          {/* ════════════════════════════════════════════════════════════════
              TAB: OVERLAP
          ════════════════════════════════════════════════════════════════ */}
          {tab === 'overlap' && (
            <>
              {/* Worst Pairs — Accordion List */}
              <SectionCard
                title="Fund Pair Overlap"
                icon={<Stack size={14} weight="fill" color={INDIGO} />}
                noPad
              >
                {worstPairs.map((pair, i) => {
                  const fa = mockFunds.find(f => f.id === pair.a)
                  const fb = mockFunds.find(f => f.id === pair.b)
                  const sev = pairSeverity(pair.val)
                  const stocksShared = Math.round(pair.val * 0.5)
                  const desc = pair.val >= 30
                    ? `${stocksShared} stocks shared · Same category mandate`
                    : pair.val >= 18
                    ? `${stocksShared} stocks shared · Nifty names overlap`
                    : pair.val >= 8
                    ? `${stocksShared} stocks shared · Partial sector overlap`
                    : 'Minimal overlap — different market universe'
                  return (
                    <AccordionRow
                      key={`${pair.a}-${pair.b}`}
                      label={`${shortName(fa?.name ?? '')} × ${shortName(fb?.name ?? '')}`}
                      sub={desc}
                      defaultOpen={i === 0 && pair.val >= 18}
                      right={
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: sev.bg, color: sev.textColor }}>
                          {sev.label} · {pair.val}%
                        </span>
                      }
                    >
                      <div className="space-y-3 pt-1">
                        {/* Progress bar */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px]" style={{ color: TEXT_MUTED }}>Stock overlap</span>
                            <span className="text-sm font-black" style={{ color: sev.color }}>{pair.val}%</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
                            <div className="h-full rounded-full" style={{ width: `${pair.val}%`, background: sev.color }} />
                          </div>
                        </div>
                        {/* Fund meta */}
                        <div className="grid grid-cols-2 gap-2">
                          {[fa, fb].map((f, fi) => f && (
                            <div key={fi} className="p-2.5 rounded-xl" style={{ background: PAGE_BG, border: `1px solid ${CARD_BORDER}` }}>
                              <p className="text-[11px] font-semibold truncate" style={{ color: TEXT }}>{f.name.split(' ').slice(0, 2).join(' ')}</p>
                              <p className="text-[10px]" style={{ color: TEXT_MUTED }}>{f.category}</p>
                            </div>
                          ))}
                        </div>
                        {pair.val >= 18 && (
                          <button
                            onClick={() => navigate('/mutual-funds/compare')}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold"
                            style={{ background: `${INDIGO}10`, color: INDIGO, border: `1px solid ${INDIGO}25` }}
                          >
                            Compare these funds <ArrowRight size={13} weight="bold" />
                          </button>
                        )}
                      </div>
                    </AccordionRow>
                  )
                })}
              </SectionCard>

              {/* Shared Stocks — Accordion per stock */}
              {duplicatedStocks.length > 0 && (
                <SectionCard
                  title="Shared Holdings"
                  icon={<Stack size={14} weight="fill" color="#0891b2" />}
                  noPad
                >
                  <div className="px-4 py-3" style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                    <p className="text-xs" style={{ color: TEXT_SUB }}>
                      Stocks held across multiple funds — paying for the same exposure twice.
                    </p>
                  </div>
                  {duplicatedStocks.map((s, i) => (
                    <AccordionRow
                      key={s.name}
                      label={s.name}
                      sub={`${s.fundCount} funds hold this · tap to see weights`}
                      right={
                        <div className="flex gap-1">
                          {s.fundsHolding.map((id, ci) => (
                            <div key={id} className="w-2 h-2 rounded-full" style={{ background: FUND_COLORS[selectedIds.indexOf(id) % FUND_COLORS.length] }} />
                          ))}
                        </div>
                      }
                    >
                      <div className="space-y-2 pt-1">
                        {s.fundsHolding.map(id => {
                          const f = mockFunds.find(f => f.id === id)
                          const weight = (s as unknown as Record<string, number>)[id] ?? 0
                          const ci = selectedIds.indexOf(id)
                          return (
                            <div key={id} className="flex items-center gap-3">
                              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: FUND_COLORS[ci % FUND_COLORS.length] }} />
                              <p className="text-xs flex-1 truncate" style={{ color: TEXT }}>{f?.name.split(' ').slice(0, 3).join(' ')}</p>
                              <span className="text-xs font-bold" style={{ color: GREEN }}>{weight.toFixed(1)}%</span>
                            </div>
                          )
                        })}
                      </div>
                    </AccordionRow>
                  ))}
                </SectionCard>
              )}

              {/* Duplicated Stocks horizontal scroll mini cards */}
              {duplicatedStocks.length > 0 && (
                <SectionCard title="Most Duplicated Stocks" icon={<Warning size={14} weight="fill" color={AMBER} />}>
                  <p className="text-xs mb-3" style={{ color: TEXT_SUB }}>You're holding these through multiple funds simultaneously.</p>
                  <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                    {duplicatedStocks.slice(0, 8).map(s => (
                      <div
                        key={s.name}
                        className="flex-shrink-0 rounded-xl p-3"
                        style={{ background: PAGE_BG, border: `1px solid ${CARD_BORDER}`, minWidth: 130 }}
                      >
                        <div className="flex gap-1 mb-2">
                          {s.fundsHolding.map(id => (
                            <div key={id} className="w-2 h-2 rounded-full" style={{ background: FUND_COLORS[selectedIds.indexOf(id) % FUND_COLORS.length] }} />
                          ))}
                        </div>
                        <p className="text-xs font-semibold leading-tight mb-1" style={{ color: TEXT }}>{s.name}</p>
                        <p className="text-[10px]" style={{ color: TEXT_MUTED }}>{s.fundCount} funds</p>
                      </div>
                    ))}
                  </div>
                  {/* Legend */}
                  <div className="flex flex-wrap gap-3 mt-3 pt-3" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                    {selectedFunds.map((f, i) => (
                      <div key={f.id} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: FUND_COLORS[i % FUND_COLORS.length] }} />
                        <span className="text-[10px]" style={{ color: TEXT_MUTED }}>{f.name.split(' ').slice(0, 2).join(' ')}</span>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Sector concentration stacked bars */}
              <SectionCard title="Sector Concentration" icon={<ChartPie size={14} weight="fill" color="#16a34a" />}>
                <p className="text-xs mb-4" style={{ color: TEXT_SUB }}>Each bar = a fund's sector weight. Stacked = total portfolio exposure.</p>
                <div className="space-y-3">
                  {SECTORS.slice(0, 6).map(sector => {
                    const fundWeights = selectedIds.map(id => ({ id, weight: SECTOR_WEIGHTS[id]?.[sector] ?? 0 }))
                    const avg = Math.round(fundWeights.reduce((s, f) => s + f.weight, 0) / fundWeights.length)
                    return (
                      <div key={sector} className="flex items-center gap-3">
                        <span className="text-xs font-medium w-16 flex-shrink-0" style={{ color: TEXT_SUB }}>{sector}</span>
                        <div className="flex-1 flex items-center h-5 rounded-lg overflow-hidden" style={{ background: '#F3F4F6' }}>
                          {fundWeights.map((fw, fi) => (
                            <div
                              key={fw.id}
                              className="h-full"
                              style={{
                                width: `${(fw.weight / 40) * 100 / fundWeights.length * 4}%`,
                                background: FUND_COLORS[fi % FUND_COLORS.length],
                                opacity: fw.weight > 0 ? 0.8 : 0,
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold w-12 text-right" style={{ color: sectorHeatColor(avg) }}>{avg}% avg</span>
                      </div>
                    )
                  })}
                </div>
              </SectionCard>

              {/* PRO hint if not pro */}
              {!isPro && (
                <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: `${INDIGO}08`, border: `1px solid ${INDIGO}20` }}>
                  <Lightning size={18} weight="fill" color={INDIGO} className="flex-shrink-0" />
                  <p className="text-xs flex-1" style={{ color: TEXT_SUB }}>
                    <span className="font-bold" style={{ color: INDIGO }}>Sahi PRO</span> unlocks rolling sector drift alerts, rebalancing suggestions &amp; stress test.
                  </p>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0"
                    style={{ background: INDIGO, color: '#ffffff' }}
                  >
                    Unlock
                  </button>
                </div>
              )}
            </>
          )}

          {/* ════════════════════════════════════════════════════════════════
              TAB: SECTORS
          ════════════════════════════════════════════════════════════════ */}
          {tab === 'sectors' && (
            <>
              <SectionCard title="Portfolio vs Nifty 50" icon={<ChartPie size={14} weight="fill" color={INDIGO} />} noPad>
                <div className="px-4 py-3" style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: INDIGO }} /><span style={{ color: TEXT_SUB }}>Your portfolio</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: '#E0E7FF', border: `1.5px dashed #94a3b8` }} /><span style={{ color: TEXT_SUB }}>Nifty 50</span></div>
                  </div>
                </div>
                {SECTORS.map((sector, si) => {
                  const yours = avgSectors[sector] ?? 0
                  const nifty = NIFTY_WEIGHTS[sector] ?? 0
                  const diff = yours - nifty
                  const diffColor = Math.abs(diff) > 8 ? (diff > 0 ? AMBER : RED) : GREEN
                  const maxBar = 40
                  return (
                    <AccordionRow
                      key={sector}
                      label={sector}
                      sub={`Your avg ${yours}% · Nifty ${nifty}%`}
                      right={
                        <span className="text-xs font-bold" style={{ color: diffColor }}>
                          {diff > 0 ? '+' : ''}{diff}%
                        </span>
                      }
                    >
                      <div className="space-y-3 pt-1">
                        {/* Visual bar comparison */}
                        <div className="space-y-2">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px]" style={{ color: TEXT_MUTED }}>Your portfolio avg</span>
                              <span className="text-xs font-bold" style={{ color: sectorHeatColor(yours) }}>{yours}%</span>
                            </div>
                            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
                              <div className="h-full rounded-full" style={{ width: `${(yours / maxBar) * 100}%`, background: sectorHeatColor(yours) }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px]" style={{ color: TEXT_MUTED }}>Nifty 50 weight</span>
                              <span className="text-xs font-bold" style={{ color: '#94a3b8' }}>{nifty}%</span>
                            </div>
                            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
                              <div className="h-full rounded-full" style={{ width: `${(nifty / maxBar) * 100}%`, background: '#cbd5e1' }} />
                            </div>
                          </div>
                        </div>
                        {/* Per-fund breakdown */}
                        <div className="pt-2" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: TEXT_MUTED }}>Per Fund</p>
                          <div className="space-y-1.5">
                            {selectedIds.map((id, ci) => {
                              const f = mockFunds.find(f => f.id === id)
                              const w = SECTOR_WEIGHTS[id]?.[sector] ?? 0
                              return (
                                <div key={id} className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: FUND_COLORS[ci % FUND_COLORS.length] }} />
                                  <span className="text-[11px] flex-1 truncate" style={{ color: TEXT }}>{f?.name.split(' ').slice(0, 2).join(' ')}</span>
                                  <span className="text-xs font-semibold" style={{ color: w > 0 ? sectorHeatColor(w) : TEXT_MUTED }}>{w > 0 ? `${w}%` : '—'}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </AccordionRow>
                  )
                })}
              </SectionCard>

              {/* Sector insight banner */}
              <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: `${INDIGO}08`, border: `1px solid ${INDIGO}20` }}>
                <Lightning size={16} weight="fill" color={INDIGO} className="flex-shrink-0 mt-0.5" />
                <p className="text-xs" style={{ color: TEXT_SUB }}>
                  <span className="font-bold" style={{ color: INDIGO }}>Sector insight: </span>
                  Portfolio is {avgSectors['Banking'] > NIFTY_WEIGHTS['Banking']
                    ? `overweight Banking by +${avgSectors['Banking'] - NIFTY_WEIGHTS['Banking']}%`
                    : `underweight Banking by ${NIFTY_WEIGHTS['Banking'] - (avgSectors['Banking'] ?? 0)}%`
                  } vs Nifty 50. PRO shows rolling drift alerts.
                </p>
              </div>
            </>
          )}

          {/* ════════════════════════════════════════════════════════════════
              TAB: AMC
          ════════════════════════════════════════════════════════════════ */}
          {tab === 'amc' && (
            <>
              <SectionCard title="Fund House Risk" icon={<Buildings size={14} weight="fill" color={AMBER} />} noPad>
                {amcMap.map(([amc, ids], i) => {
                  const pct = Math.round((ids.length / selectedIds.length) * 100)
                  const isHigh = pct >= 40
                  const fundsInAmc = selectedFunds.filter(f => (f.amcName ?? 'Unknown') === amc)
                  return (
                    <AccordionRow
                      key={amc}
                      label={amc}
                      sub={`${ids.length} fund${ids.length > 1 ? 's' : ''} · ${pct}% of selection`}
                      defaultOpen={i === 0}
                      right={
                        isHigh
                          ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#fef3c7', color: '#b45309' }}>High</span>
                          : <CheckCircle size={14} weight="fill" color={GREEN} />
                      }
                    >
                      <div className="space-y-3 pt-1">
                        {/* Concentration bar */}
                        <div>
                          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: isHigh ? AMBER : INDIGO }} />
                          </div>
                          {isHigh && (
                            <p className="text-[11px] mt-1.5 font-medium" style={{ color: '#b45309' }}>
                              SEBI recommends max 40% from one AMC. You're at {pct}%.
                            </p>
                          )}
                        </div>
                        {/* Fund list under this AMC */}
                        <div className="space-y-2">
                          {fundsInAmc.map(f => (
                            <div key={f.id} className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ background: PAGE_BG, border: `1px solid ${CARD_BORDER}` }}>
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${INDIGO}10` }}>
                                <Buildings size={14} weight="fill" color={INDIGO} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold truncate" style={{ color: TEXT }}>{f.name}</p>
                                <p className="text-[10px]" style={{ color: TEXT_MUTED }}>{f.category}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionRow>
                  )
                })}
              </SectionCard>

              {/* Best practice tip */}
              <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: '#f0fdf4', border: `1px solid ${GREEN}30` }}>
                <CheckCircle size={16} weight="fill" color={GREEN} className="flex-shrink-0 mt-0.5" />
                <p className="text-xs" style={{ color: '#166534' }}>
                  <span className="font-bold">Best practice: </span>
                  Spread across 3-4 AMCs. Reduces fund-house risk significantly. SEBI cap is 40% per AMC.
                </p>
              </div>
            </>
          )}

        </div>
      )}
    </div>
  )
}

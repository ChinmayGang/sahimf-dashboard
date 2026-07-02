import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, CaretDown, PencilSimple, CheckCircle,
  MagnifyingGlass, X, ChartPieSlice, ArrowsLeftRight,
  Browsers, Warning,
} from '@phosphor-icons/react'
import { mockFunds } from '../../data/funds'
import {
  OVERLAP_PORTFOLIOS, CATEGORY_PRESETS, AMC_PRESETS,
  shortFundName, type OverlapPortfolio,
} from '../../data/overlapData'

const HEADER  = '#4f46e5'
const INDIGO  = '#4f46e5'
const LIME    = '#d6fd70'
const BG      = '#F5F4FF'
const CARD    = '#ffffff'
const BDR     = '#E8E6FF'
const TEXT    = '#1e1b4b'
const SUB     = '#6b7280'
const MUTED   = '#9ca3af'
const AMBER   = '#f59e0b'

// ── Fund picker bottom sheet ─────────────────────────────────────────────────
function FundPicker({
  open, title, exclude, onSelect, onClose,
}: {
  open: boolean; title: string; exclude: string[]; onSelect: (id: string) => void; onClose: () => void
}) {
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (open) { setQ(''); setTimeout(() => inputRef.current?.focus(), 200) } }, [open])

  const filtered = mockFunds.filter(f =>
    !exclude.includes(f.id) &&
    (shortFundName(f.name).toLowerCase().includes(q.toLowerCase()) ||
     f.amcName.toLowerCase().includes(q.toLowerCase()) ||
     f.subCategory.toLowerCase().includes(q.toLowerCase()))
  )

  if (!open) return null
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl flex flex-col"
        style={{ background: CARD, maxHeight: '80vh', boxShadow: '0 -8px 32px rgba(0,0,0,0.18)' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: BDR }} />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${BDR}` }}>
          <p className="text-sm font-bold" style={{ color: TEXT }}>{title}</p>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: BG }}>
            <X size={14} color={SUB} weight="bold" />
          </button>
        </div>
        {/* Search */}
        <div className="px-4 py-3" style={{ borderBottom: `1px solid ${BDR}` }}>
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl" style={{ background: BG, border: `1.5px solid ${BDR}` }}>
            <MagnifyingGlass size={15} color={MUTED} />
            <input
              ref={inputRef}
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search fund or AMC…"
              className="flex-1 text-sm bg-transparent outline-none"
              style={{ color: TEXT }}
            />
            {q && <button onClick={() => setQ('')}><X size={13} color={MUTED} /></button>}
          </div>
        </div>
        {/* List */}
        <div className="overflow-y-auto flex-1 pb-6">
          {filtered.length === 0 && (
            <p className="text-xs text-center py-8" style={{ color: MUTED }}>No funds match "{q}"</p>
          )}
          {filtered.map(f => {
            const ret5 = f.returns['5Y']
            const ret3 = f.returns['3Y']
            const retVal = ret5 ?? ret3
            const retLabel = ret5 != null ? '5Y' : '3Y'
            return (
              <button
                key={f.id}
                onClick={() => { onSelect(f.id); onClose() }}
                className="w-full px-4 py-3.5 flex items-center gap-3 text-left active:bg-[#F5F4FF]"
                style={{ borderBottom: `1px solid ${BDR}` }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight" style={{ color: TEXT }}>
                    {shortFundName(f.name)}
                  </p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: SUB }}>
                    {f.amcName} · {f.subCategory}
                  </p>
                </div>
                {retVal != null && (
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold" style={{ color: '#16a34a' }}>{retVal}%</p>
                    <p className="text-[10px]" style={{ color: MUTED }}>{retLabel} CAGR</p>
                  </div>
                )}
                <CaretDown size={13} color={MUTED} style={{ transform: 'rotate(-90deg)' }} />
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

// ── Step wrapper ─────────────────────────────────────────────────────────────
function StepCard({
  number, title, icon, done, active, locked, summary, onEdit, children,
}: {
  number: number; title: string; icon: React.ReactNode
  done: boolean; active: boolean; locked: boolean
  summary?: string; onEdit?: () => void; children: React.ReactNode
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden mb-3 transition-all"
      style={{
        background: CARD,
        border: `1.5px solid ${done ? INDIGO : active ? BDR : BDR}`,
        opacity: locked ? 0.45 : 1,
      }}
    >
      {/* Step header */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black"
          style={{
            background: done ? INDIGO : active ? '#EEF2FF' : BG,
            color: done ? '#fff' : active ? INDIGO : MUTED,
          }}
        >
          {done ? <CheckCircle size={16} weight="fill" color="#fff" /> : number}
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {icon}
          <p className="text-sm font-bold" style={{ color: done || active ? TEXT : MUTED }}>{title}</p>
        </div>
        {done && onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: '#EEF2FF', color: INDIGO }}
          >
            <PencilSimple size={11} />
            Edit
          </button>
        )}
      </div>

      {/* Done summary */}
      {done && summary && !active && (
        <div className="px-4 pb-3.5">
          <div className="px-3 py-2 rounded-xl" style={{ background: '#EEF2FF' }}>
            <p className="text-xs font-semibold" style={{ color: INDIGO }}>{summary}</p>
          </div>
        </div>
      )}

      {/* Active content */}
      {active && (
        <div style={{ borderTop: `1px solid ${BDR}` }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export function OverlapLanding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [portfolio, setPortfolio] = useState<OverlapPortfolio | null>(null)
  const [mode, setMode] = useState<2 | 5 | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [fundAOpen, setFundAOpen] = useState(false)
  const [fundBOpen, setFundBOpen] = useState(false)
  const [presetTab, setPresetTab] = useState<'category' | 'amc'>('category')

  function pickPortfolio(p: OverlapPortfolio) {
    setPortfolio(p)
    setSelectedIds([...p.fundIds])
    setStep(2)
  }

  function skipPortfolio() {
    setPortfolio(null)
    setSelectedIds([])
    setStep(2)
  }

  function pickMode(m: 2 | 5) {
    setMode(m)
    if (m === 2) {
      setSelectedIds(prev => prev.slice(0, 2))
    } else {
      setSelectedIds(prev => prev.slice(0, 5))
    }
    setStep(3)
  }

  function applyPreset(ids: string[]) {
    const merged = [...new Set([...selectedIds, ...ids])].slice(0, 5)
    setSelectedIds(merged)
  }

  function toggleChip(id: string) {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (mode && prev.length >= mode) return prev
      return [...prev, id]
    })
  }

  function setFundSlot(slot: 0 | 1, id: string) {
    setSelectedIds(prev => {
      const next = [...prev]
      next[slot] = id
      return next.filter(Boolean)
    })
  }

  const canAnalyse = mode != null && selectedIds.length >= 2

  function analyse() {
    if (!canAnalyse) return
    if (mode === 2 && selectedIds.length === 2) {
      navigate(`/mutual-funds/overlap-v2/compare/${selectedIds[0]}/${selectedIds[1]}`)
    } else {
      navigate(`/mutual-funds/overlap-v2/matrix?ids=${selectedIds.join(',')}`)
    }
  }

  const fundA = mockFunds.find(f => f.id === selectedIds[0])
  const fundB = mockFunds.find(f => f.id === selectedIds[1])

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: HEADER, paddingBottom: 24 }}>
        <div className="px-4 pt-5 pb-2">
          <p className="text-xs font-medium mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Analysis Tool</p>
          <h1 className="text-xl font-black text-white">Portfolio Overlap</h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
            3 quick steps to spot hidden overlaps
          </p>
        </div>
        {/* Step dots */}
        <div className="flex items-center gap-2 px-4 mt-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="flex items-center gap-2">
              <div
                className="flex items-center justify-center rounded-full text-[10px] font-black transition-all"
                style={{
                  width: step >= n ? 28 : 22,
                  height: step >= n ? 28 : 22,
                  background: step > n ? LIME : step === n ? '#fff' : 'rgba(255,255,255,0.2)',
                  color: step > n ? INDIGO : step === n ? INDIGO : 'rgba(255,255,255,0.5)',
                }}
              >
                {step > n ? '✓' : n}
              </div>
              {n < 3 && (
                <div className="h-0.5 w-8 rounded-full" style={{ background: step > n ? LIME : 'rgba(255,255,255,0.2)' }} />
              )}
            </div>
          ))}
          <p className="text-xs ml-2 font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {step === 1 ? 'Select portfolio' : step === 2 ? 'Compare mode' : 'Pick funds'}
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="px-4 pt-4">

        {/* ── STEP 1: Portfolio ── */}
        <StepCard
          number={1} title="Your Portfolio" done={step > 1} active={step === 1} locked={false}
          icon={<ChartPieSlice size={15} color={step === 1 ? INDIGO : MUTED} weight="fill" />}
          summary={portfolio ? `${portfolio.name} — ${portfolio.fundIds.length} funds · ${portfolio.xirr}% XIRR` : 'Skipped — manual selection'}
          onEdit={() => setStep(1)}
        >
          <div className="px-4 pt-3 pb-4 flex flex-col gap-2.5">
            {OVERLAP_PORTFOLIOS.map(p => (
              <button
                key={p.id}
                onClick={() => pickPortfolio(p)}
                className="w-full text-left rounded-xl px-4 py-3.5 flex items-center justify-between active:opacity-70 transition-opacity"
                style={{ background: BG, border: `1.5px solid ${BDR}` }}
              >
                <div>
                  <p className="text-sm font-bold" style={{ color: TEXT }}>{p.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: SUB }}>
                    {p.fundIds.length} funds · ₹{(p.totalInvested / 100000).toFixed(1)}L
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#dcfce7', color: '#16a34a' }}>
                    {p.xirr}% XIRR
                  </span>
                  <ArrowRight size={14} color={MUTED} />
                </div>
              </button>
            ))}
            <button
              onClick={skipPortfolio}
              className="text-xs font-semibold text-center py-2 mt-1"
              style={{ color: INDIGO }}
            >
              Skip — I'll pick funds manually →
            </button>
          </div>
        </StepCard>

        {/* ── STEP 2: Mode ── */}
        <StepCard
          number={2} title="Compare Mode" done={step > 2} active={step === 2} locked={step < 2}
          icon={<ArrowsLeftRight size={15} color={step === 2 ? INDIGO : MUTED} weight="fill" />}
          summary={mode === 2 ? 'Deep Compare — 2 funds' : 'Full Matrix — up to 5 funds'}
          onEdit={() => setStep(2)}
        >
          <div className="px-4 pt-3 pb-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => pickMode(2)}
              className="rounded-2xl p-4 flex flex-col items-center gap-1.5 active:opacity-70 transition-opacity"
              style={{ background: BG, border: `1.5px solid ${BDR}` }}
            >
              <ArrowsLeftRight size={28} color={INDIGO} weight="fill" />
              <p className="text-base font-black" style={{ color: TEXT }}>2 Funds</p>
              <p className="text-[11px] text-center leading-tight" style={{ color: SUB }}>
                Deep compare with all 9 sections
              </p>
            </button>
            <button
              onClick={() => pickMode(5)}
              className="rounded-2xl p-4 flex flex-col items-center gap-1.5 active:opacity-70 transition-opacity"
              style={{ background: BG, border: `1.5px solid ${BDR}` }}
            >
              <Browsers size={28} color={INDIGO} weight="fill" />
              <p className="text-base font-black" style={{ color: TEXT }}>5 Funds</p>
              <p className="text-[11px] text-center leading-tight" style={{ color: SUB }}>
                Full matrix + AMC concentration
              </p>
            </button>
          </div>
        </StepCard>

        {/* ── STEP 3: Funds ── */}
        <StepCard
          number={3} title="Select Funds" done={false} active={step === 3} locked={step < 3}
          icon={<MagnifyingGlass size={15} color={step === 3 ? INDIGO : MUTED} weight="fill" />}
        >
          {mode === 2 ? (
            /* ── 2-fund picker: two dropdown slots ── */
            <div className="px-4 pt-3 pb-4 flex flex-col gap-3">
              {/* Fund A */}
              <button
                onClick={() => setFundAOpen(true)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl active:opacity-70"
                style={{ background: fundA ? '#EEF2FF' : BG, border: `1.5px solid ${fundA ? INDIGO : BDR}` }}
              >
                <div className="text-left min-w-0 flex-1 mr-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: fundA ? INDIGO : MUTED }}>Fund A</p>
                  <p className="text-sm font-semibold truncate" style={{ color: fundA ? TEXT : SUB }}>
                    {fundA ? shortFundName(fundA.name) : 'Tap to select…'}
                  </p>
                  {fundA && <p className="text-xs mt-0.5 truncate" style={{ color: SUB }}>{fundA.amcName}</p>}
                </div>
                <CaretDown size={16} color={fundA ? INDIGO : MUTED} weight="bold" />
              </button>

              {/* Swap hint */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px" style={{ background: BDR }} />
                <div className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ borderColor: BDR, background: CARD }}>
                  <ArrowsLeftRight size={14} color={MUTED} />
                </div>
                <div className="flex-1 h-px" style={{ background: BDR }} />
              </div>

              {/* Fund B */}
              <button
                onClick={() => setFundBOpen(true)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl active:opacity-70"
                style={{ background: fundB ? `${MUTED}10` : BG, border: `1.5px solid ${fundB ? '#0d9488' : BDR}` }}
              >
                <div className="text-left min-w-0 flex-1 mr-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: fundB ? '#0d9488' : MUTED }}>Fund B</p>
                  <p className="text-sm font-semibold truncate" style={{ color: fundB ? TEXT : SUB }}>
                    {fundB ? shortFundName(fundB.name) : 'Tap to select…'}
                  </p>
                  {fundB && <p className="text-xs mt-0.5 truncate" style={{ color: SUB }}>{fundB.amcName}</p>}
                </div>
                <CaretDown size={16} color={fundB ? '#0d9488' : MUTED} weight="bold" />
              </button>

              {/* Same-AMC inline nudge */}
              {fundA && fundB && fundA.amcName === fundB.amcName && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
                  <Warning size={14} color={AMBER} weight="fill" className="flex-shrink-0 mt-0.5" />
                  <p className="text-xs" style={{ color: '#b45309' }}>
                    Both from <strong>{fundA.amcName}</strong>. Same AMC may create hidden correlation beyond stock overlap.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* ── 5-fund picker: presets + chip multi-select ── */
            <div className="pt-3 pb-4">
              {/* Preset pills */}
              <div className="px-4 mb-3">
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: MUTED }}>Quick Presets</p>
                <div className="flex gap-2 mb-2">
                  {(['category', 'amc'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setPresetTab(t)}
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: presetTab === t ? INDIGO : '#EEF2FF', color: presetTab === t ? '#fff' : INDIGO }}
                    >
                      {t === 'category' ? 'By Category' : 'By AMC'}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                  {(presetTab === 'category' ? CATEGORY_PRESETS : AMC_PRESETS).map(p => (
                    <button
                      key={p.label}
                      onClick={() => applyPreset(p.ids)}
                      className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium active:opacity-70"
                      style={{ background: BG, border: `1px solid ${BDR}`, color: TEXT, whiteSpace: 'nowrap' }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected chips */}
              <div className="px-4 mb-3" style={{ borderTop: `1px solid ${BDR}`, paddingTop: 12 }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wide" style={{ color: MUTED }}>
                    Selected ({selectedIds.length}/5)
                  </p>
                  {selectedIds.length > 0 && (
                    <button onClick={() => setSelectedIds([])} className="text-xs" style={{ color: INDIGO }}>Clear all</button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 min-h-[36px]">
                  {selectedIds.map(id => {
                    const f = mockFunds.find(x => x.id === id)
                    return f ? (
                      <button
                        key={id}
                        onClick={() => toggleChip(id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{ background: '#EEF2FF', color: INDIGO }}
                      >
                        {shortFundName(f.name)}
                        <X size={11} weight="bold" />
                      </button>
                    ) : null
                  })}
                  {selectedIds.length === 0 && (
                    <p className="text-xs" style={{ color: MUTED }}>Select from presets or fund list below</p>
                  )}
                </div>
              </div>

              {/* Compact fund list */}
              <div style={{ borderTop: `1px solid ${BDR}` }}>
                <p className="text-xs font-bold uppercase tracking-wide px-4 pt-3 mb-2" style={{ color: MUTED }}>All Funds</p>
                {mockFunds.map(f => {
                  const sel = selectedIds.includes(f.id)
                  const disabled = !sel && selectedIds.length >= 5
                  const ret5 = f.returns['5Y']
                  const ret3 = f.returns['3Y']
                  const retVal = ret5 ?? ret3
                  const retLabel = ret5 != null ? '5Y' : '3Y'
                  return (
                    <button
                      key={f.id}
                      onClick={() => !disabled && toggleChip(f.id)}
                      disabled={disabled}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left active:bg-[#F5F4FF]"
                      style={{ borderBottom: `1px solid ${BDR}`, opacity: disabled ? 0.35 : 1 }}
                    >
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                        style={{ borderColor: sel ? INDIGO : '#d1d5db', background: sel ? INDIGO : 'transparent' }}
                      >
                        {sel && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold leading-tight" style={{ color: TEXT }}>
                          {shortFundName(f.name)}
                        </p>
                        <p className="text-[11px] mt-0.5 truncate" style={{ color: SUB }}>{f.amcName} · {f.subCategory}</p>
                      </div>
                      {retVal != null && (
                        <p className="text-xs font-bold flex-shrink-0" style={{ color: '#16a34a' }}>
                          {retVal}% <span className="font-normal text-[10px]" style={{ color: MUTED }}>{retLabel}</span>
                        </p>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </StepCard>

        {/* ── Analyse CTA ── */}
        {step === 3 && (
          <button
            onClick={analyse}
            disabled={!canAnalyse}
            className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all mb-2"
            style={{
              background: canAnalyse ? INDIGO : '#e5e7eb',
              color: canAnalyse ? '#fff' : MUTED,
            }}
          >
            {mode === 2 ? 'Deep Compare' : 'Analyse Matrix'}
            <ArrowRight size={18} weight="bold" />
          </button>
        )}

        {step === 3 && !canAnalyse && (
          <p className="text-xs text-center pb-2" style={{ color: MUTED }}>
            {mode === 2 ? 'Select both Fund A and Fund B' : 'Select at least 2 funds'}
          </p>
        )}

        <div className="h-24" />
      </div>

      {/* Fund picker sheets */}
      <FundPicker
        open={fundAOpen} title="Select Fund A"
        exclude={selectedIds[1] ? [selectedIds[1]] : []}
        onSelect={id => setFundSlot(0, id)}
        onClose={() => setFundAOpen(false)}
      />
      <FundPicker
        open={fundBOpen} title="Select Fund B"
        exclude={selectedIds[0] ? [selectedIds[0]] : []}
        onSelect={id => setFundSlot(1, id)}
        onClose={() => setFundBOpen(false)}
      />
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle, ChartPieSlice, Buildings, SortAscending } from '@phosphor-icons/react'
import { mockFunds } from '../../data/funds'
import {
  OVERLAP_PORTFOLIOS,
  CATEGORY_PRESETS,
  AMC_PRESETS,
  shortFundName,
  type OverlapPortfolio,
} from '../../data/overlapData'

const PAGE_BG    = '#F5F4FF'
const CARD_BG    = '#ffffff'
const CARD_BDR   = '#E8E6FF'
const HEADER_BG  = '#4f46e5'
const INDIGO     = '#4f46e5'
const TEXT       = '#1e1b4b'
const TEXT_SUB   = '#6b7280'
const LIME       = '#d6fd70'

const ALL_IDS = mockFunds.map(f => f.id)

export function OverlapLanding() {
  const navigate = useNavigate()
  const [selectedPortfolio, setSelectedPortfolio] = useState<OverlapPortfolio | null>(null)
  const [mode, setMode] = useState<2 | 5>(5)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [presetTab, setPresetTab] = useState<'category' | 'amc'>('category')

  function applyPortfolio(p: OverlapPortfolio) {
    setSelectedPortfolio(p)
    setSelectedIds(p.fundIds.slice(0, mode))
  }

  function applyPreset(ids: string[]) {
    if (mode === 2) {
      setSelectedIds(ids.slice(0, 2))
    } else {
      const merged = [...new Set([...selectedIds, ...ids])].slice(0, 5)
      setSelectedIds(merged)
    }
  }

  function toggleFund(id: string) {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= mode) return prev
      return [...prev, id]
    })
  }

  function analyse() {
    if (selectedIds.length < 2) return
    const url = `/mutual-funds/overlap-v2/matrix?ids=${selectedIds.join(',')}`
    navigate(url)
  }

  const canAnalyse = selectedIds.length >= 2

  return (
    <div style={{ background: PAGE_BG, minHeight: '100vh', fontFamily: 'inherit' }}>
      {/* Header */}
      <div style={{ background: HEADER_BG, paddingBottom: 32 }}>
        <div className="flex items-center gap-3 px-4 pt-4 pb-2">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <ArrowLeft size={16} weight="bold" color="#fff" />
          </button>
          <div>
            <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>Analysis</p>
            <h1 className="text-lg font-bold text-white leading-tight">Portfolio Overlap</h1>
          </div>
        </div>
        <p className="px-4 text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Find hidden overlaps across your mutual funds
        </p>
      </div>

      <div className="px-4" style={{ marginTop: -16 }}>
        {/* Portfolio selector */}
        <Section title="Your Portfolio" icon={<ChartPieSlice size={15} color={INDIGO} weight="fill" />}>
          <div className="flex flex-col gap-3">
            {OVERLAP_PORTFOLIOS.map(p => {
              const active = selectedPortfolio?.id === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => applyPortfolio(p)}
                  className="w-full text-left rounded-2xl p-4 transition-all"
                  style={{
                    background: active ? '#EEF2FF' : CARD_BG,
                    border: `1.5px solid ${active ? INDIGO : CARD_BDR}`,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: TEXT }}>{p.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: TEXT_SUB }}>
                        {p.fundIds.length} funds · ₹{(p.totalInvested / 100000).toFixed(1)}L invested
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: '#dcfce7', color: '#16a34a' }}>
                        {p.xirr}% XIRR
                      </div>
                      {active && <CheckCircle size={18} color={INDIGO} weight="fill" />}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {p.fundIds.map(id => {
                      const f = mockFunds.find(x => x.id === id)
                      return f ? (
                        <span
                          key={id}
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{ background: '#EEF2FF', color: INDIGO }}
                        >
                          {shortFundName(f.name)}
                        </span>
                      ) : null
                    })}
                  </div>
                </button>
              )
            })}
          </div>
        </Section>

        {/* Compare mode */}
        <Section title="Compare Mode" icon={<SortAscending size={15} color={INDIGO} weight="fill" />} className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            {([2, 5] as const).map(m => (
              <button
                key={m}
                onClick={() => {
                  setMode(m)
                  setSelectedIds(prev => prev.slice(0, m))
                }}
                className="rounded-2xl p-4 text-center transition-all"
                style={{
                  background: mode === m ? INDIGO : CARD_BG,
                  border: `1.5px solid ${mode === m ? INDIGO : CARD_BDR}`,
                }}
              >
                <p className="text-2xl font-black" style={{ color: mode === m ? LIME : TEXT }}>
                  {m}
                </p>
                <p className="text-xs font-medium mt-0.5" style={{ color: mode === m ? 'rgba(255,255,255,0.8)' : TEXT_SUB }}>
                  {m === 2 ? 'Deep compare' : 'Full matrix'}
                </p>
              </button>
            ))}
          </div>
        </Section>

        {/* Presets (only for 5-fund mode) */}
        {mode === 5 && (
          <Section title="Quick Presets" icon={<Buildings size={15} color={INDIGO} weight="fill" />} className="mt-4">
            <div className="flex gap-2 mb-3">
              {(['category', 'amc'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setPresetTab(tab)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                  style={{
                    background: presetTab === tab ? INDIGO : '#EEF2FF',
                    color: presetTab === tab ? '#fff' : INDIGO,
                  }}
                >
                  {tab === 'category' ? 'By Category' : 'By AMC'}
                </button>
              ))}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {(presetTab === 'category' ? CATEGORY_PRESETS : AMC_PRESETS).map(preset => (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset.ids)}
                  className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium border transition-colors active:opacity-70"
                  style={{ background: CARD_BG, border: `1px solid ${CARD_BDR}`, color: TEXT, whiteSpace: 'nowrap' }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* Manual fund picker */}
        <Section title={`Select Funds (${selectedIds.length}/${mode})`} className="mt-4">
          <div className="flex flex-col gap-2">
            {ALL_IDS.map(id => {
              const f = mockFunds.find(x => x.id === id)!
              const sel = selectedIds.includes(id)
              const disabled = !sel && selectedIds.length >= mode
              return (
                <button
                  key={id}
                  onClick={() => !disabled && toggleFund(id)}
                  disabled={disabled}
                  className="w-full text-left rounded-xl px-3.5 py-3 flex items-center gap-3 transition-all"
                  style={{
                    background: sel ? '#EEF2FF' : CARD_BG,
                    border: `1.5px solid ${sel ? INDIGO : CARD_BDR}`,
                    opacity: disabled ? 0.4 : 1,
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: sel ? INDIGO : '#d1d5db', background: sel ? INDIGO : 'transparent' }}
                  >
                    {sel && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold leading-tight" style={{ color: TEXT }}>
                      {shortFundName(f.name)}
                    </p>
                    <p className="text-[11px] mt-0.5 truncate" style={{ color: TEXT_SUB }}>
                      {f.amcName} · {f.subCategory}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold" style={{ color: '#16a34a' }}>
                      {f.returns['5Y'] != null ? `${f.returns['5Y']}%` : f.returns['3Y'] != null ? `${f.returns['3Y']}%` : 'N/A'}
                    </p>
                    <p className="text-[10px]" style={{ color: TEXT_SUB }}>
                      {f.returns['5Y'] != null ? '5Y CAGR' : f.returns['3Y'] != null ? '3Y CAGR' : '—'}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </Section>

        {/* Selected preview + CTA */}
        {selectedIds.length > 0 && (
          <div
            className="mt-4 rounded-2xl p-4"
            style={{ background: CARD_BG, border: `1.5px solid ${CARD_BDR}` }}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: TEXT_SUB }}>Selected</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selectedIds.map(id => {
                const f = mockFunds.find(x => x.id === id)
                return f ? (
                  <span
                    key={id}
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ background: '#EEF2FF', color: INDIGO }}
                  >
                    {shortFundName(f.name)}
                  </span>
                ) : null
              })}
            </div>
            <button
              onClick={analyse}
              disabled={!canAnalyse}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                background: canAnalyse ? INDIGO : '#d1d5db',
                color: canAnalyse ? '#fff' : '#9ca3af',
              }}
            >
              Analyse Overlap
              <ArrowRight size={16} weight="bold" />
            </button>
          </div>
        )}

        {selectedIds.length === 0 && (
          <div className="mt-4 py-4 text-center rounded-2xl" style={{ background: CARD_BG, border: `1.5px dashed ${CARD_BDR}` }}>
            <p className="text-xs" style={{ color: TEXT_SUB }}>Select at least 2 funds to analyse</p>
          </div>
        )}

        <div className="h-24" />
      </div>
    </div>
  )
}

function Section({
  title,
  icon,
  children,
  className = '',
}: {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 mb-2.5">
        {icon}
        <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#6b7280' }}>
          {title}
        </p>
      </div>
      {children}
    </div>
  )
}

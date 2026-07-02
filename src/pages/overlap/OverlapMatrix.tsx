import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, CaretDown, CaretUp, Warning, Info,
} from '@phosphor-icons/react'
import { mockFunds } from '../../data/funds'
import {
  SECTOR_WEIGHTS, NIFTY_WEIGHTS, COMMON_STOCKS,
  getOverlap, overlapColor, shortFundName,
} from '../../data/overlapData'

const PAGE_BG   = '#F5F4FF'
const CARD_BG   = '#ffffff'
const CARD_BDR  = '#E8E6FF'
const HEADER_BG = '#4f46e5'
const INDIGO    = '#4f46e5'
const LIME      = '#d6fd70'
const TEXT      = '#1e1b4b'
const TEXT_SUB  = '#6b7280'
const TEXT_MUTED = '#9ca3af'
const RED       = '#ef4444'
const AMBER     = '#f59e0b'
const GREEN     = '#22c55e'

function AccordionRow({
  label, sub, right, children, defaultOpen = false,
}: {
  label: string; sub?: string; right?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderBottom: `1px solid ${CARD_BDR}` }}>
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
            : <CaretDown size={14} weight="bold" color={TEXT_MUTED} />}
        </div>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden mb-3" style={{ background: CARD_BG, border: `1px solid ${CARD_BDR}` }}>
      <div className="px-4 py-3" style={{ borderBottom: `1px solid ${CARD_BDR}` }}>
        <p className="text-sm font-bold" style={{ color: TEXT }}>{title}</p>
      </div>
      {children}
    </div>
  )
}

export function OverlapMatrix() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const rawIds = searchParams.get('ids')?.split(',').filter(Boolean) ?? []
  const fundIds = rawIds.filter(id => mockFunds.find(f => f.id === id))

  const [activeTab, setActiveTab] = useState<'overview' | 'sectors' | 'amcs'>('overview')

  const funds = fundIds.map(id => mockFunds.find(f => f.id === id)!).filter(Boolean)

  if (funds.length < 2) {
    return (
      <div style={{ background: PAGE_BG, minHeight: '100vh' }} className="flex flex-col items-center justify-center gap-4 p-8">
        <p style={{ color: TEXT_SUB }} className="text-sm text-center">Select at least 2 funds to view overlap matrix.</p>
        <button
          onClick={() => navigate('/mutual-funds/overlap-v2')}
          className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
          style={{ background: INDIGO }}
        >
          Go Back
        </button>
      </div>
    )
  }

  // Compute overlap score (100 - avg overlap of all pairs)
  const pairs: { a: string; b: string; pct: number }[] = []
  for (let i = 0; i < fundIds.length; i++) {
    for (let j = i + 1; j < fundIds.length; j++) {
      pairs.push({ a: fundIds[i], b: fundIds[j], pct: getOverlap(fundIds[i], fundIds[j]) })
    }
  }
  const avgOverlap = pairs.reduce((s, p) => s + p.pct, 0) / pairs.length
  const overlapScore = Math.max(0, Math.round(100 - avgOverlap * 1.8))

  const worstPair = [...pairs].sort((a, b) => b.pct - a.pct)[0]
  const circum = 2 * Math.PI * 32
  const ringOffset = circum - (overlapScore / 100) * circum
  const ringColor = overlapScore >= 70 ? GREEN : overlapScore >= 50 ? AMBER : RED

  // AMC groups
  const amcMap: Record<string, string[]> = {}
  for (const f of funds) {
    if (!amcMap[f.amcName]) amcMap[f.amcName] = []
    amcMap[f.amcName].push(f.id)
  }
  const amcConcentration = Object.entries(amcMap).filter(([, ids]) => ids.length > 1)

  // Common stocks visible across most funds
  const topStocks = COMMON_STOCKS
    .map(s => ({
      ...s,
      fundCount: fundIds.filter(id => (s.weights[id] ?? 0) > 0).length,
    }))
    .filter(s => s.fundCount >= 2)
    .sort((a, b) => b.fundCount - a.fundCount)
    .slice(0, 8)

  return (
    <div style={{ background: PAGE_BG, minHeight: '100vh', fontFamily: 'inherit' }}>
      {/* Header */}
      <div style={{ background: HEADER_BG }}>
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button
            onClick={() => navigate('/mutual-funds/overlap-v2')}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <ArrowLeft size={16} weight="bold" color="#fff" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>Overlap Analysis</p>
            <p className="text-sm font-bold text-white truncate">
              {funds.map(f => shortFundName(f.name)).join(' · ')}
            </p>
          </div>
        </div>

        {/* Score ring */}
        <div className="flex items-center gap-5 px-4 pb-5">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
              <circle
                cx="40" cy="40" r="32" fill="none"
                stroke={ringColor}
                strokeWidth="8"
                strokeDasharray={`${circum}`}
                strokeDashoffset={ringOffset}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black" style={{ color: ringColor }}>{overlapScore}</span>
              <span className="text-[9px] font-semibold text-white opacity-70">SCORE</span>
            </div>
          </div>
          <div>
            <p className="text-base font-bold text-white">{overlapScore >= 70 ? 'Good Diversification' : overlapScore >= 50 ? 'Moderate Overlap' : 'High Overlap Risk'}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Avg pair overlap: <strong style={{ color: LIME }}>{avgOverlap.toFixed(0)}%</strong>
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {funds.length} funds · {pairs.length} pairs analysed
            </p>
          </div>
        </div>

        {/* Chip row */}
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {funds.map(f => (
            <div
              key={f.id}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', maxWidth: 140 }}
            >
              <span className="truncate block">{shortFundName(f.name)}</span>
            </div>
          ))}
        </div>

        {/* Alert banner */}
        {(amcConcentration.length > 0 || worstPair.pct >= 30) && (
          <div className="mx-4 mb-4 px-3 py-2.5 rounded-xl flex items-start gap-2" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <Warning size={16} color="#fca5a5" weight="fill" className="flex-shrink-0 mt-0.5" />
            <p className="text-xs" style={{ color: '#fca5a5' }}>
              {amcConcentration.length > 0
                ? `${amcConcentration.map(([amc]) => amc.split(' ')[0]).join(', ')} AMC${amcConcentration.length > 1 ? 's' : ''} concentrated. `
                : ''}
              {worstPair.pct >= 30
                ? `${shortFundName(funds.find(f => f.id === worstPair.a)?.name ?? '')} × ${shortFundName(funds.find(f => f.id === worstPair.b)?.name ?? '')} share ${worstPair.pct}%.`
                : ''}
            </p>
          </div>
        )}

        {/* Tab pills */}
        <div className="flex gap-2 px-4 pb-4">
          {(['overview', 'sectors', 'amcs'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: activeTab === tab ? LIME : 'rgba(255,255,255,0.12)',
                color: activeTab === tab ? '#1e1b4b' : 'rgba(255,255,255,0.85)',
              }}
            >
              {tab === 'overview' ? 'Pairs' : tab === 'sectors' ? 'Sectors' : 'AMCs'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {activeTab === 'overview' && (
          <>
            {/* Pair overlap grid */}
            <SectionCard title="Fund Pairs — Overlap %">
              {pairs.sort((a, b) => b.pct - a.pct).map(pair => {
                const fa = funds.find(f => f.id === pair.a)!
                const fb = funds.find(f => f.id === pair.b)!
                const color = overlapColor(pair.pct)
                const label = pair.pct >= 35 ? 'Very High' : pair.pct >= 20 ? 'High' : pair.pct >= 10 ? 'Moderate' : 'Low'
                return (
                  <button
                    key={`${pair.a}-${pair.b}`}
                    onClick={() => navigate(`/mutual-funds/overlap-v2/compare/${pair.a}/${pair.b}`)}
                    className="w-full px-4 py-3.5 flex items-center gap-3 text-left active:bg-[#F5F4FF] transition-colors"
                    style={{ borderBottom: `1px solid ${CARD_BDR}` }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold leading-tight" style={{ color: TEXT }}>
                        {shortFundName(fa.name)}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: TEXT_SUB }}>
                        × {shortFundName(fb.name)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div
                        className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: `${color}20`, color }}
                      >
                        {pair.pct}%
                      </div>
                      <span className="text-[10px]" style={{ color }}>{label}</span>
                      <div className="w-1 h-4 rounded-full" style={{ background: color }} />
                    </div>
                  </button>
                )
              })}
              <p className="px-4 pt-3 pb-1 text-xs" style={{ color: TEXT_MUTED }}>
                Tap any pair to deep compare →
              </p>
            </SectionCard>

            {/* Common holdings */}
            <SectionCard title="Most Common Holdings">
              {topStocks.map((s, i) => (
                <AccordionRow
                  key={s.name}
                  label={s.name}
                  sub={`Held in ${s.fundCount} of ${funds.length} funds`}
                  right={
                    <span className="text-xs font-bold" style={{ color: INDIGO }}>
                      {s.fundCount}/{funds.length}
                    </span>
                  }
                >
                  <div className="flex flex-col gap-2 mt-1">
                    {fundIds.filter(id => (s.weights[id] ?? 0) > 0).map(id => {
                      const f = funds.find(x => x.id === id)!
                      const w = s.weights[id]
                      return (
                        <div key={id} className="flex items-center gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <p className="text-xs truncate" style={{ color: TEXT_SUB, maxWidth: 160 }}>
                                {shortFundName(f.name)}
                              </p>
                              <p className="text-xs font-bold" style={{ color: INDIGO }}>{w}%</p>
                            </div>
                            <div className="h-1.5 rounded-full" style={{ background: CARD_BDR }}>
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${Math.min(100, w * 5)}%`, background: INDIGO }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-xs" style={{ color: '#16a34a' }}>NIFTY 50 weight</p>
                          <p className="text-xs font-bold" style={{ color: '#16a34a' }}>{s.niftyWeight}%</p>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: '#dcfce7' }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${Math.min(100, s.niftyWeight * 5)}%`, background: '#16a34a' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionRow>
              ))}
            </SectionCard>
          </>
        )}

        {activeTab === 'sectors' && (
          <SectionCard title="Sector Allocation">
            {Object.keys(NIFTY_WEIGHTS).map(sector => {
              const nifty = NIFTY_WEIGHTS[sector]
              const hasData = fundIds.some(id => (SECTOR_WEIGHTS[id]?.[sector] ?? 0) > 0)
              if (!hasData && nifty === 0) return null
              return (
                <AccordionRow
                  key={sector}
                  label={sector}
                  sub={`NIFTY: ${nifty}%`}
                  right={
                    <span className="text-xs font-medium" style={{ color: TEXT_MUTED }}>NIFTY {nifty}%</span>
                  }
                >
                  <div className="flex flex-col gap-2.5 mt-1">
                    {fundIds.map(id => {
                      const f = funds.find(x => x.id === id)!
                      const w = SECTOR_WEIGHTS[id]?.[sector] ?? 0
                      return (
                        <div key={id}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs truncate" style={{ color: TEXT_SUB, maxWidth: 180 }}>
                              {shortFundName(f.name)}
                            </p>
                            <p className="text-xs font-bold" style={{ color: INDIGO }}>{w}%</p>
                          </div>
                          <div className="h-2 rounded-full" style={{ background: CARD_BDR }}>
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${Math.min(100, w * 2)}%`, background: INDIGO }}
                            />
                          </div>
                        </div>
                      )
                    })}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs" style={{ color: '#16a34a' }}>NIFTY 50</p>
                        <p className="text-xs font-bold" style={{ color: '#16a34a' }}>{nifty}%</p>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: '#dcfce7' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.min(100, nifty * 2)}%`, background: '#16a34a' }}
                        />
                      </div>
                    </div>
                  </div>
                </AccordionRow>
              )
            })}
          </SectionCard>
        )}

        {activeTab === 'amcs' && (
          <>
            {amcConcentration.length > 0 && (
              <div
                className="rounded-2xl p-4 mb-3 flex items-start gap-2.5"
                style={{ background: '#fff7ed', border: `1.5px solid #fed7aa` }}
              >
                <Warning size={16} color={AMBER} weight="fill" className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#92400e' }}>AMC Concentration Detected</p>
                  <p className="text-xs mt-1" style={{ color: '#b45309' }}>
                    You hold multiple funds from the same AMC. Fund managers at the same AMC often share research, which can create hidden correlation.
                  </p>
                </div>
              </div>
            )}

            <SectionCard title="AMC Distribution">
              {Object.entries(amcMap).sort((a, b) => b[1].length - a[1].length).map(([amc, ids]) => {
                const concentrated = ids.length > 1
                return (
                  <AccordionRow
                    key={amc}
                    label={amc}
                    sub={`${ids.length} fund${ids.length > 1 ? 's' : ''} selected`}
                    right={
                      concentrated
                        ? <Warning size={14} color={AMBER} weight="fill" />
                        : <div className="w-2 h-2 rounded-full" style={{ background: GREEN }} />
                    }
                  >
                    <div className="flex flex-col gap-2 mt-1">
                      {ids.map(id => {
                        const f = funds.find(x => x.id === id)!
                        return (
                          <div key={id} className="p-3 rounded-xl" style={{ background: '#F5F4FF' }}>
                            <p className="text-xs font-semibold leading-tight" style={{ color: TEXT }}>
                              {shortFundName(f.name)}
                            </p>
                            <p className="text-[11px] mt-0.5" style={{ color: TEXT_SUB }}>
                              {f.subCategory} · {f.returns['5Y']}% 5Y CAGR
                            </p>
                          </div>
                        )
                      })}
                      {concentrated && (
                        <div className="flex gap-1.5 mt-1">
                          <Info size={12} color={AMBER} weight="fill" className="flex-shrink-0 mt-0.5" />
                          <p className="text-xs" style={{ color: '#b45309' }}>
                            Consider replacing one of these with a fund from a different AMC for true diversification.
                          </p>
                        </div>
                      )}
                    </div>
                  </AccordionRow>
                )
              })}
            </SectionCard>

            {amcConcentration.length === 0 && (
              <div
                className="rounded-2xl p-4 flex items-start gap-2.5"
                style={{ background: '#f0fdf4', border: `1.5px solid #bbf7d0` }}
              >
                <Info size={16} color={GREEN} weight="fill" className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#14532d' }}>100% AMC Diversified</p>
                  <p className="text-xs mt-1" style={{ color: '#166534' }}>
                    All selected funds are from different AMCs. This gives you maximum diversification against house-bias risk.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        <div className="h-20" />
      </div>
    </div>
  )
}

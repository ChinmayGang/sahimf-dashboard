import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Warning, Info, CheckCircle, CaretDown, CaretUp,
  ChartBar, Scales, Buildings, Stack, Coins, ArrowsLeftRight,
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
const TEAL      = '#0d9488'
const LIME      = '#d6fd70'
const TEXT      = '#1e1b4b'
const TEXT_SUB  = '#6b7280'
const TEXT_MUTED = '#9ca3af'
const RED       = '#ef4444'
const AMBER     = '#f59e0b'
const GREEN     = '#22c55e'

function AccordionSection({
  title, icon, badge, children, defaultOpen = false,
}: {
  title: string; icon: React.ReactNode; badge?: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl overflow-hidden mb-3" style={{ background: CARD_BG, border: `1px solid ${CARD_BDR}` }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left"
      >
        <div className="flex items-center gap-2.5">
          {icon}
          <p className="text-sm font-bold" style={{ color: TEXT }}>{title}</p>
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#EEF2FF', color: INDIGO }}>
              {badge}
            </span>
          )}
        </div>
        {open
          ? <CaretUp size={14} weight="bold" color={TEXT_MUTED} />
          : <CaretDown size={14} weight="bold" color={TEXT_MUTED} />}
      </button>
      {open && <div style={{ borderTop: `1px solid ${CARD_BDR}` }}>{children}</div>}
    </div>
  )
}

function FundLabel({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold"
      style={{ background: `${color}18`, color }}
    >
      {shortFundName(name)}
    </span>
  )
}

function ReturnBar({ label, valA, valB }: { label: string; valA: number; valB: number }) {
  const max = Math.max(valA, valB, 1)
  return (
    <div className="py-2.5" style={{ borderBottom: `1px solid ${CARD_BDR}` }}>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs font-medium" style={{ color: TEXT_SUB }}>{label}</p>
        <div className="flex gap-3">
          <p className="text-xs font-bold" style={{ color: INDIGO }}>{valA}%</p>
          <p className="text-xs font-bold" style={{ color: TEAL }}>{valB}%</p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="h-1.5 rounded-full" style={{ background: '#EEF2FF' }}>
          <div className="h-full rounded-full" style={{ width: `${(valA / max) * 100}%`, background: INDIGO }} />
        </div>
        <div className="h-1.5 rounded-full" style={{ background: `${TEAL}18` }}>
          <div className="h-full rounded-full" style={{ width: `${(valB / max) * 100}%`, background: TEAL }} />
        </div>
      </div>
    </div>
  )
}

function OverviewRow({ label, valA, valB }: { label: string; valA: string | number; valB: string | number }) {
  return (
    <div
      className="grid items-start py-3 px-4"
      style={{ gridTemplateColumns: '1fr 1fr 1fr', borderBottom: `1px solid ${CARD_BDR}` }}
    >
      <p className="text-xs" style={{ color: TEXT_MUTED }}>{label}</p>
      <p className="text-xs font-semibold text-center" style={{ color: TEXT }}>{valA}</p>
      <p className="text-xs font-semibold text-right" style={{ color: TEXT }}>{valB}</p>
    </div>
  )
}

export function OverlapCompare2() {
  const navigate = useNavigate()
  const { fundA, fundB } = useParams<{ fundA: string; fundB: string }>()

  const fa = mockFunds.find(f => f.id === fundA)
  const fb = mockFunds.find(f => f.id === fundB)

  if (!fa || !fb) {
    return (
      <div style={{ background: PAGE_BG, minHeight: '100vh' }} className="flex flex-col items-center justify-center gap-4 p-8">
        <p style={{ color: TEXT_SUB }} className="text-sm">Funds not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
          style={{ background: INDIGO }}
        >Go Back</button>
      </div>
    )
  }

  const overlap = getOverlap(fa.id, fb.id)
  const overlapCol = overlapColor(overlap)
  const sameAMC = fa.amcName === fb.amcName

  // Holdings from constituents
  function getHoldings(fund: typeof fa) {
    return (fund?.constituents ?? []).flatMap(s => s.holdings)
  }
  const holdingsA = getHoldings(fa)
  const holdingsB = getHoldings(fb)
  const namesB = new Set(holdingsB.map(h => h.name))
  const namesA = new Set(holdingsA.map(h => h.name))

  const sharedStocks = COMMON_STOCKS.filter(
    s => (s.weights[fa.id] ?? 0) > 0 && (s.weights[fb.id] ?? 0) > 0
  )
  const exclusiveA = holdingsA.filter(h => !namesB.has(h.name)).slice(0, 6)
  const exclusiveB = holdingsB.filter(h => !namesA.has(h.name)).slice(0, 6)

  // Top 5 combined holdings
  const allStocks = COMMON_STOCKS
    .filter(s => (s.weights[fa.id] ?? 0) > 0 || (s.weights[fb.id] ?? 0) > 0)
    .map(s => ({
      name: s.name,
      niftyWeight: s.niftyWeight,
      weightA: s.weights[fa.id] ?? 0,
      weightB: s.weights[fb.id] ?? 0,
      combined: ((s.weights[fa.id] ?? 0) + (s.weights[fb.id] ?? 0)) / 2,
    }))
    .sort((a, b) => b.combined - a.combined)
    .slice(0, 5)

  const circum = 2 * Math.PI * 28
  const ringOffset = circum - (overlap / 100) * circum

  return (
    <div style={{ background: PAGE_BG, minHeight: '100vh', fontFamily: 'inherit' }}>
      {/* Header */}
      <div style={{ background: HEADER_BG, paddingBottom: 20 }}>
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <ArrowLeft size={16} weight="bold" color="#fff" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>Deep Compare</p>
            <p className="text-sm font-bold text-white truncate">
              {shortFundName(fa.name)} × {shortFundName(fb.name)}
            </p>
          </div>
        </div>

        {/* Overlap ring + fund labels */}
        <div className="px-4 flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="7" />
              <circle cx="32" cy="32" r="28" fill="none" stroke={overlapCol} strokeWidth="7"
                strokeDasharray={`${circum}`} strokeDashoffset={ringOffset}
                strokeLinecap="round" transform="rotate(-90 32 32)" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-black" style={{ color: overlapCol }}>{overlap}%</span>
            </div>
          </div>
          <div>
            <FundLabel name={fa.name} color={LIME} />
            <p className="my-1 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>×</p>
            <FundLabel name={fb.name} color="#a5f3fc" />
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs font-semibold" style={{ color: overlapCol }}>
              {overlap >= 35 ? 'Very High' : overlap >= 20 ? 'High' : overlap >= 10 ? 'Moderate' : 'Low'} Overlap
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="px-4 pt-4">

        {/* 1. Portfolio Composition */}
        <AccordionSection
          title="Portfolio Composition"
          icon={<ChartBar size={16} color={INDIGO} weight="fill" />}
          badge="50:50"
          defaultOpen
        >
          <div className="px-4 py-3">
            {/* Visual split bar */}
            <div className="flex rounded-full overflow-hidden h-3 mb-3">
              <div className="h-full" style={{ width: '50%', background: INDIGO }} />
              <div className="h-full" style={{ width: '50%', background: TEAL }} />
            </div>
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: INDIGO }} />
                <p className="text-xs font-semibold" style={{ color: TEXT }}>50% — {shortFundName(fa.name)}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: TEAL }} />
                <p className="text-xs font-semibold" style={{ color: TEXT }}>50% — {shortFundName(fb.name)}</p>
              </div>
            </div>
            <div className="p-3 rounded-xl" style={{ background: '#F5F4FF' }}>
              <p className="text-xs leading-relaxed" style={{ color: TEXT_SUB }}>
                <strong style={{ color: TEXT }}>Research note: </strong>
                {fa.subCategory === fb.subCategory
                  ? `Both funds follow the ${fa.subCategory} mandate — an equal split concentrates your equity exposure in the same market cap segment, amplifying both returns and drawdowns in that segment.`
                  : `Combining ${fa.subCategory} (${shortFundName(fa.name)}) with ${fb.subCategory} (${shortFundName(fb.name)}) provides cross-segment coverage, but check sector and stock overlaps before assuming full diversification.`}
              </p>
            </div>
          </div>
        </AccordionSection>

        {/* 2. Overlapping Holdings */}
        <AccordionSection
          title="Overlapping Holdings"
          icon={<ArrowsLeftRight size={16} color={INDIGO} weight="fill" />}
          badge={`${sharedStocks.length} stocks`}
          defaultOpen
        >
          {sharedStocks.length === 0 ? (
            <div className="px-4 py-4 text-center">
              <p className="text-xs" style={{ color: TEXT_SUB }}>No common stock holdings found between these two funds.</p>
            </div>
          ) : (
            <>
              <div className="px-4 pt-2 pb-1 grid text-[10px] font-bold uppercase" style={{ gridTemplateColumns: '1fr 60px 60px', color: TEXT_MUTED }}>
                <span>Stock</span>
                <span className="text-right" style={{ color: INDIGO }}>{shortFundName(fa.name).split(' ')[0]}</span>
                <span className="text-right" style={{ color: TEAL }}>{shortFundName(fb.name).split(' ')[0]}</span>
              </div>
              {sharedStocks.map(s => (
                <div
                  key={s.name}
                  className="px-4 py-2.5 grid items-center"
                  style={{ gridTemplateColumns: '1fr 60px 60px', borderBottom: `1px solid ${CARD_BDR}` }}
                >
                  <p className="text-xs font-medium truncate pr-2" style={{ color: TEXT }}>{s.name}</p>
                  <p className="text-xs font-bold text-right" style={{ color: INDIGO }}>{s.weights[fa.id]}%</p>
                  <p className="text-xs font-bold text-right" style={{ color: TEAL }}>{s.weights[fb.id]}%</p>
                </div>
              ))}
            </>
          )}
        </AccordionSection>

        {/* 3. Exclusive Holdings */}
        <AccordionSection
          title="Exclusive Holdings"
          icon={<Stack size={16} color={INDIGO} weight="fill" />}
          badge="Unique to each"
        >
          <div className="px-4 pt-3 pb-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] font-bold mb-2 px-2 py-1 rounded-lg" style={{ color: INDIGO, background: '#EEF2FF' }}>
                  {shortFundName(fa.name).split(' ')[0]}
                </p>
                {exclusiveA.map(h => (
                  <div key={h.name} className="flex justify-between py-1.5" style={{ borderBottom: `1px solid ${CARD_BDR}` }}>
                    <p className="text-[11px] truncate pr-1" style={{ color: TEXT, maxWidth: 120 }}>{h.name}</p>
                    <p className="text-[11px] font-bold flex-shrink-0" style={{ color: INDIGO }}>{h.weight}%</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[11px] font-bold mb-2 px-2 py-1 rounded-lg" style={{ color: TEAL, background: `${TEAL}18` }}>
                  {shortFundName(fb.name).split(' ')[0]}
                </p>
                {exclusiveB.map(h => (
                  <div key={h.name} className="flex justify-between py-1.5" style={{ borderBottom: `1px solid ${CARD_BDR}` }}>
                    <p className="text-[11px] truncate pr-1" style={{ color: TEXT, maxWidth: 120 }}>{h.name}</p>
                    <p className="text-[11px] font-bold flex-shrink-0" style={{ color: TEAL }}>{h.weight}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* 4. Fund Overview */}
        <AccordionSection
          title="Fund Overview"
          icon={<Info size={16} color={INDIGO} weight="fill" />}
          defaultOpen
        >
          <div className="px-4 pt-1 pb-2 grid text-[10px] font-bold uppercase" style={{ gridTemplateColumns: '1fr 1fr 1fr', color: TEXT_MUTED }}>
            <span></span>
            <span className="text-center" style={{ color: INDIGO }}>{shortFundName(fa.name).split(' ').slice(0,2).join(' ')}</span>
            <span className="text-right" style={{ color: TEAL }}>{shortFundName(fb.name).split(' ').slice(0,2).join(' ')}</span>
          </div>
          <OverviewRow label="Category" valA={fa.subCategory} valB={fb.subCategory} />
          <OverviewRow label="AMC" valA={fa.amcName.split(' ')[0]} valB={fb.amcName.split(' ')[0]} />
          <OverviewRow label="AUM" valA={`₹${(fa.fundSize / 100).toFixed(0)}Cr`} valB={`₹${(fb.fundSize / 100).toFixed(0)}Cr`} />
          <OverviewRow label="NAV" valA={`₹${fa.nav}`} valB={`₹${fb.nav}`} />
          <OverviewRow label="Since" valA={fa.launchedOn.slice(0,4)} valB={fb.launchedOn.slice(0,4)} />
          <OverviewRow label="Min SIP" valA={`₹${fa.minSIP}`} valB={`₹${fb.minSIP}`} />
        </AccordionSection>

        {/* 5. Returns Comparison */}
        <AccordionSection
          title="Returns Comparison"
          icon={<ChartBar size={16} color={INDIGO} weight="fill" />}
          defaultOpen
        >
          <div className="px-4 pt-1 pb-2">
            <div className="flex gap-4 text-[10px] font-bold mb-2" style={{ color: TEXT_MUTED }}>
              <div className="flex items-center gap-1">
                <div className="w-3 h-1.5 rounded-full" style={{ background: INDIGO }} />
                <span style={{ color: INDIGO }}>{shortFundName(fa.name).split(' ').slice(0,2).join(' ')}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-1.5 rounded-full" style={{ background: TEAL }} />
                <span style={{ color: TEAL }}>{shortFundName(fb.name).split(' ').slice(0,2).join(' ')}</span>
              </div>
            </div>
            {(['1M','6M','1Y','3Y','5Y'] as const).map(period => (
              <ReturnBar
                key={period}
                label={period}
                valA={fa.returns[period] ?? 0}
                valB={fb.returns[period] ?? 0}
              />
            ))}
          </div>
        </AccordionSection>

        {/* 6. Financial Ratios */}
        <AccordionSection
          title="Financial Ratios"
          icon={<Coins size={16} color={INDIGO} weight="fill" />}
        >
          <div className="px-4 pt-1 pb-2 grid text-[10px] font-bold uppercase" style={{ gridTemplateColumns: '1fr 1fr 1fr', color: TEXT_MUTED }}>
            <span></span>
            <span className="text-center" style={{ color: INDIGO }}>{shortFundName(fa.name).split(' ').slice(0,2).join(' ')}</span>
            <span className="text-right" style={{ color: TEAL }}>{shortFundName(fb.name).split(' ').slice(0,2).join(' ')}</span>
          </div>
          <OverviewRow label="Expense Ratio" valA={`${fa.expenseRatio}%`} valB={`${fb.expenseRatio}%`} />
          <OverviewRow label="Sharpe Ratio" valA={fa.sharpeRatio} valB={fb.sharpeRatio} />
          <OverviewRow label="Exit Load" valA={`${fa.exitLoad}%`} valB={`${fb.exitLoad}%`} />
          <OverviewRow label="Volatility" valA={fa.volatility} valB={fb.volatility} />
        </AccordionSection>

        {/* 7. Sector Overlap */}
        <AccordionSection
          title="Sector Overlap"
          icon={<ChartBar size={16} color={INDIGO} weight="fill" />}
        >
          <div className="px-4 pt-2 pb-3">
            {Object.keys(NIFTY_WEIGHTS).map(sector => {
              const wA = SECTOR_WEIGHTS[fa.id]?.[sector] ?? 0
              const wB = SECTOR_WEIGHTS[fb.id]?.[sector] ?? 0
              const nifty = NIFTY_WEIGHTS[sector]
              if (wA === 0 && wB === 0 && nifty === 0) return null
              const max = Math.max(wA, wB, nifty, 1)
              return (
                <div key={sector} className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium" style={{ color: TEXT }}>{sector}</p>
                    <p className="text-[10px]" style={{ color: TEXT_MUTED }}>NIFTY {nifty}%</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full" style={{ background: '#EEF2FF' }}>
                        <div className="h-full rounded-full" style={{ width: `${(wA / max) * 100}%`, background: INDIGO }} />
                      </div>
                      <span className="text-[10px] w-8 text-right font-bold" style={{ color: INDIGO }}>{wA}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full" style={{ background: `${TEAL}18` }}>
                        <div className="h-full rounded-full" style={{ width: `${(wB / max) * 100}%`, background: TEAL }} />
                      </div>
                      <span className="text-[10px] w-8 text-right font-bold" style={{ color: TEAL }}>{wB}%</span>
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="mt-3 p-3 rounded-xl" style={{ background: '#F5F4FF' }}>
              <p className="text-xs leading-relaxed" style={{ color: TEXT_SUB }}>
                <strong style={{ color: TEXT }}>Research note: </strong>
                {(() => {
                  const maxSector = Object.keys(NIFTY_WEIGHTS).reduce((best, s) => {
                    const diff = Math.abs((SECTOR_WEIGHTS[fa.id]?.[s] ?? 0) - (SECTOR_WEIGHTS[fb.id]?.[s] ?? 0))
                    return diff > best.diff ? { sector: s, diff } : best
                  }, { sector: '', diff: 0 })
                  return `${maxSector.sector} sector shows the largest divergence between these two funds. ${
                    (SECTOR_WEIGHTS[fa.id]?.[maxSector.sector] ?? 0) > (SECTOR_WEIGHTS[fb.id]?.[maxSector.sector] ?? 0)
                      ? `${shortFundName(fa.name)} is more ${maxSector.sector}-heavy.`
                      : `${shortFundName(fb.name)} is more ${maxSector.sector}-heavy.`
                  }`
                })()}
              </p>
            </div>
          </div>
        </AccordionSection>

        {/* 8. AMC Overlap */}
        <AccordionSection
          title="AMC Overlap"
          icon={<Buildings size={16} color={INDIGO} weight="fill" />}
          badge={sameAMC ? 'Same AMC' : 'Diversified'}
          defaultOpen
        >
          <div className="px-4 py-4">
            {sameAMC ? (
              <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: '#fff7ed', border: `1.5px solid #fed7aa` }}>
                <Warning size={18} color={AMBER} weight="fill" className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold" style={{ color: '#92400e' }}>Same AMC — {fa.amcName}</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: '#b45309' }}>
                    Both funds are managed by the same AMC. Fund managers often share research and investment philosophy within a house, which can create hidden correlation beyond what stock overlap numbers show. Consider adding a fund from a different AMC.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: '#f0fdf4', border: `1.5px solid #bbf7d0` }}>
                <CheckCircle size={18} color={GREEN} weight="fill" className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold" style={{ color: '#14532d' }}>100% AMC Diversified</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: '#166534' }}>
                    {shortFundName(fa.name)} ({fa.amcName.split(' ')[0]}) and {shortFundName(fb.name)} ({fb.amcName.split(' ')[0]}) come from different fund houses — giving you maximum protection against AMC-level concentration risk and house-bias.
                  </p>
                </div>
              </div>
            )}
          </div>
        </AccordionSection>

        {/* 9. Top 5 Holdings vs NIFTY */}
        <AccordionSection
          title="Top Holdings vs NIFTY"
          icon={<Scales size={16} color={INDIGO} weight="fill" />}
          badge="Top 5"
          defaultOpen
        >
          <div>
            <div className="px-4 pt-2 pb-1 grid text-[10px] font-bold uppercase" style={{ gridTemplateColumns: '1fr 50px 50px 50px', color: TEXT_MUTED }}>
              <span>Stock</span>
              <span className="text-right" style={{ color: INDIGO }}>A</span>
              <span className="text-right" style={{ color: TEAL }}>B</span>
              <span className="text-right" style={{ color: '#16a34a' }}>NIFTY</span>
            </div>
            {allStocks.map(s => (
              <div
                key={s.name}
                className="px-4 py-2.5 grid items-center"
                style={{ gridTemplateColumns: '1fr 50px 50px 50px', borderBottom: `1px solid ${CARD_BDR}` }}
              >
                <p className="text-xs font-medium truncate pr-2" style={{ color: TEXT }}>{s.name}</p>
                <p className="text-xs font-bold text-right" style={{ color: s.weightA > 0 ? INDIGO : TEXT_MUTED }}>
                  {s.weightA > 0 ? `${s.weightA}%` : '—'}
                </p>
                <p className="text-xs font-bold text-right" style={{ color: s.weightB > 0 ? TEAL : TEXT_MUTED }}>
                  {s.weightB > 0 ? `${s.weightB}%` : '—'}
                </p>
                <p className="text-xs font-bold text-right" style={{ color: s.niftyWeight > 0 ? '#16a34a' : TEXT_MUTED }}>
                  {s.niftyWeight > 0 ? `${s.niftyWeight}%` : '—'}
                </p>
              </div>
            ))}
            <div className="px-4 py-3">
              <div className="p-3 rounded-xl" style={{ background: '#F5F4FF' }}>
                <p className="text-xs leading-relaxed" style={{ color: TEXT_SUB }}>
                  <strong style={{ color: TEXT }}>vs NIFTY 50: </strong>
                  {overlap >= 30
                    ? `With ${overlap}% stock overlap, combined portfolio behaves close to NIFTY 50 in these top holdings. You may be paying two expense ratios for near-index returns.`
                    : `Combined top holdings diverge from NIFTY in meaningful ways — ${shortFundName(fa.name)} and ${shortFundName(fb.name)} together provide differentiated exposure beyond the index.`}
                </p>
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* Footer disclaimer */}
        <div className="pb-6 pt-2">
          <p className="text-[10px] text-center leading-relaxed px-4" style={{ color: TEXT_MUTED }}>
            Overlap % is indicative based on disclosed portfolio data. Actual overlap may vary. Past performance is not a guarantee of future returns. NO COMMISSION RECEIVED FROM ANY INDIAN MUTUAL FUND HOUSES, EVER.
          </p>
        </div>

        <div className="h-8" />
      </div>
    </div>
  )
}

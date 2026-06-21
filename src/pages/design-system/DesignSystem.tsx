import { TrendUp as TrendingUpIcon } from '@phosphor-icons/react'
import { TrendDown as TrendingDownIcon } from '@phosphor-icons/react'
import { Star as StarIcon } from '@phosphor-icons/react'
import { Lock as LockIcon } from '@phosphor-icons/react'
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react'
import { Sparkle as AutoAwesomeIcon } from '@phosphor-icons/react'
import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react'
import { Info as InfoOutlinedIcon } from '@phosphor-icons/react'
import { Warning as WarningAmberIcon } from '@phosphor-icons/react'
import { CheckCircle as CheckCircleOutlineIcon } from '@phosphor-icons/react'
import { Warning as ErrorOutlineIcon } from '@phosphor-icons/react'

/* ─── Design tokens — these will drive all pages ─────────────── */
const PAGE_BG = 'radial-gradient(ellipse at 75% -5%, #DDD6FE 0%, #EDE9FE 28%, #F5F3FF 55%, #FAFAFA 100%)'
const CARD = '#FFFFFF'
const CARD_BORDER = '#E5E7EB'
const CARD_SHADOW = '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)'
const SURFACE_2 = '#F9FAFB'   // table rows, alternate bg
const BORDER_SUBTLE = '#F3F4F6'
const ACCENT = '#d6fd70'
const PRO = '#4f46e5'
const SUCCESS = '#22C55E'
const DANGER = '#EF4444'
const WARNING = '#F59E0B'
const T1 = '#18181B'
const T2 = '#52525B'
const T3 = '#A1A1AA'

/* ─── Helpers ─────────────────────────────────────────────────── */
function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <div className="mb-6 pb-3 border-b" style={{ borderColor: CARD_BORDER }}>
        <h2 className="text-xl font-bold" style={{ color: T1 }}>{title}</h2>
        {desc && <p className="text-sm mt-1" style={{ color: T2 }}>{desc}</p>}
      </div>
      {children}
    </section>
  )
}

function Token({ label, value }: { label: string; value: string }) {
  return (
    <code className="text-xs font-mono px-2 py-1 rounded-md" style={{ background: SURFACE_2, color: PRO, border: `1px solid ${CARD_BORDER}` }}>
      {label}: {value}
    </code>
  )
}

/* ─── Card component (the core reusable pattern) ──────────────── */
function Card({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-2xl ${className}`} style={{ background: CARD, border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, ...style }}>
      {children}
    </div>
  )
}

/* ─── Metric card ─────────────────────────────────────────────── */
function MetricCard({ label, value, sub, change, accent }: { label: string; value: string; sub?: string; change?: number; accent?: boolean }) {
  const pos = (change ?? 0) >= 0
  return (
    <Card style={accent ? { borderColor: `${ACCENT}40`, background: `linear-gradient(135deg, #F7FFDC 0%, #FFFFFF 60%)` } : {}}>
      <div className="p-5">
        <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: T3 }}>{label}</p>
        <p className="text-2xl font-bold mb-1" style={{ color: T1 }}>{value}</p>
        {sub && <p className="text-xs" style={{ color: T2 }}>{sub}</p>}
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full"
              style={{ background: pos ? '#DCFCE7' : '#FEE2E2', color: pos ? SUCCESS : DANGER }}>
              {pos ? <TrendingUpIcon size={12} weight="regular" /> : <TrendingDownIcon size={12} weight="regular" />}
              {Math.abs(change).toFixed(1)}%
            </span>
            <span className="text-xs" style={{ color: T3 }}>vs last month</span>
          </div>
        )}
      </div>
    </Card>
  )
}

/* ─── Sample data ─────────────────────────────────────────────── */
const FUNDS = [
  { name: 'Mirae Asset Large Cap Fund', amc: 'Mirae Asset', cat: 'Large Cap', nav: 107.42, change: 0.34, r1y: 18.7, r3y: 14.2, vol: 'Low' as const },
  { name: 'Parag Parikh Flexi Cap Fund', amc: 'PPFAS', cat: 'Flexi Cap', nav: 84.15, change: -0.12, r1y: 22.3, r3y: 19.8, vol: 'Moderate' as const },
  { name: 'HDFC Mid-Cap Opportunities', amc: 'HDFC', cat: 'Mid Cap', nav: 153.67, change: 0.91, r1y: 31.5, r3y: 24.1, vol: 'High' as const },
]

const VOL_CONFIG: Record<string, { dot: string; bg: string; text: string }> = {
  Low:      { dot: SUCCESS, bg: '#DCFCE7', text: SUCCESS },
  Moderate: { dot: WARNING, bg: '#FEF3C7', text: WARNING },
  Medium:   { dot: WARNING, bg: '#FEF3C7', text: WARNING },
  High:     { dot: DANGER,  bg: '#FEE2E2', text: DANGER },
}

export function DesignSystem() {
  return (
    <div className="min-h-screen p-8" style={{ background: PAGE_BG }}>
      <div className="max-w-5xl mx-auto">

        {/* ── Header ────────────────────────────────────────────── */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: `${ACCENT}20`, color: '#3B5E00' }}>
            <AutoAwesomeIcon size={12} weight="regular" />
            For approval · v1.0
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: T1 }}>SahiMF Design System</h1>
          <p className="text-base" style={{ color: T2 }}>
            Core visual language for all dashboard pages. Review each section and confirm before we roll out to all pages.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════
            1. FOUNDATION
        ══════════════════════════════════════════════════════════ */}
        <Section title="1. Foundation" desc="Color tokens and surface hierarchy.">

          {/* Surfaces */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: T3 }}>Surfaces</p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Page BG', bg: PAGE_BG, border: false, desc: 'Purple-lavender gradient · main content area' },
                { label: 'Card', bg: CARD, border: true, desc: 'White · all cards and panels' },
                { label: 'Surface 2', bg: SURFACE_2, border: true, desc: '#F9FAFB · table rows, alt bg' },
                { label: 'Sidebar', bg: '#111111', border: false, desc: '#111111 · always dark, never themed' },
              ].map(s => (
                <div key={s.label}>
                  <div className="h-16 rounded-xl mb-2" style={{ background: s.bg, border: s.border ? `1px solid ${CARD_BORDER}` : 'none', boxShadow: CARD_SHADOW }} />
                  <p className="text-xs font-semibold" style={{ color: T1 }}>{s.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: T3 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Brand & Semantic */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: T3 }}>Brand & Semantic</p>
            <div className="grid grid-cols-6 gap-3">
              {[
                { name: 'Accent', hex: '#d6fd70', dark: true, desc: 'CTA, active nav, accent text' },
                { name: 'Pro Purple', hex: '#4f46e5', dark: false, desc: 'PRO plan elements' },
                { name: 'Success', hex: '#22C55E', dark: false, desc: 'Gains, positive returns' },
                { name: 'Danger', hex: '#EF4444', dark: false, desc: 'Losses, negative returns' },
                { name: 'Warning', hex: '#F59E0B', dark: false, desc: 'Medium risk, alerts' },
                { name: 'Info', hex: '#3B82F6', dark: false, desc: 'Informational, neutral' },
              ].map(c => (
                <div key={c.name}>
                  <div className="h-14 rounded-xl mb-2 flex items-end p-2" style={{ background: c.hex }}>
                    <span className="text-xs font-mono font-bold" style={{ color: c.dark ? '#000' : '#fff' }}>{c.hex}</span>
                  </div>
                  <p className="text-xs font-semibold" style={{ color: T1 }}>{c.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: T3 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════
            2. TYPOGRAPHY
        ══════════════════════════════════════════════════════════ */}
        <Section title="2. Typography" desc="Geist font across all weights. Tight line-height for data-dense UIs.">
          <Card>
            <div className="p-6 space-y-5 divide-y" style={{ borderColor: BORDER_SUBTLE }}>
              {[
                { label: 'Page Title',    size: 'text-2xl',   weight: 'font-bold',      sample: 'SahiMF Dashboard',      token: 'text-2xl / 700' },
                { label: 'Section Title', size: 'text-xl',    weight: 'font-semibold',  sample: 'My Portfolios',          token: 'text-xl / 600' },
                { label: 'Card Title',    size: 'text-base',  weight: 'font-semibold',  sample: 'Portfolio Performance',  token: 'text-base / 600' },
                { label: 'Body',          size: 'text-sm',    weight: 'font-normal',    sample: 'Mutual funds are subject to market risks. Read all scheme documents carefully.', token: 'text-sm / 400' },
                { label: 'Label / Meta',  size: 'text-xs',    weight: 'font-medium',    sample: 'TOTAL INVESTED · 24 FUNDS · XIRR 14.2%', token: 'text-xs / 500 · uppercase tracking-wider' },
                { label: 'Micro',         size: 'text-[10px]',weight: 'font-semibold',  sample: 'LARGE CAP · DIRECT · GROWTH',  token: '10px / 600 · pills' },
              ].map(t => (
                <div key={t.label} className="flex items-baseline gap-6 pt-4 first:pt-0">
                  <div className="w-32 flex-shrink-0">
                    <span className="text-xs" style={{ color: T3 }}>{t.label}</span>
                    <br/>
                    <code className="text-[10px] font-mono" style={{ color: PRO }}>{t.token}</code>
                  </div>
                  <p className={`${t.size} ${t.weight} flex-1`} style={{ color: T1 }}>{t.sample}</p>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        {/* ══════════════════════════════════════════════════════════
            3. CARDS
        ══════════════════════════════════════════════════════════ */}
        <Section title="3. Card Patterns" desc="Four card variants used throughout. All: rounded-2xl · white · 1px border #E5E7EB ·.">

          {/* Metric cards */}
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: T3 }}>Metric Cards — overview stats</p>
            <div className="grid grid-cols-4 gap-4">
              <MetricCard label="Total Invested" value="₹12,40,000" sub="Across 3 portfolios" change={3.2} />
              <MetricCard label="Current Value" value="₹15,63,847" sub="As of today" change={26.1} accent />
              <MetricCard label="Total Gain" value="₹3,23,847" change={26.1} />
              <MetricCard label="Portfolio XIRR" value="18.4%" sub="Annualised return" change={-1.2} />
            </div>
          </div>

          {/* Section card */}
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: T3 }}>Section Card — content panels (chart containers, analysis)</p>
            <Card>
              <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: CARD_BORDER }}>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: T1 }}>Portfolio Value Over Time</h3>
                  <p className="text-xs mt-0.5" style={{ color: T3 }}>Invested vs Current · 24 months</p>
                </div>
                <div className="flex items-center gap-2">
                  {['1M','6M','1Y','3Y','MAX'].map(p => (
                    <button key={p} className="text-xs px-2.5 py-1 rounded-full transition-colors"
                      style={p === '1Y' ? { background: ACCENT, color: '#000', fontWeight: 600 } : { color: T3 }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-40 flex items-center justify-center" style={{ background: SURFACE_2 }}>
                <p className="text-xs" style={{ color: T3 }}>← Chart renders here (Recharts AreaChart)</p>
              </div>
              <div className="px-5 py-3 flex items-center gap-5 border-t" style={{ borderColor: BORDER_SUBTLE }}>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 rounded inline-block" style={{ background: '#4f46e5' }} />
                  <span className="text-xs" style={{ color: T2 }}>Invested</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 rounded inline-block" style={{ background: ACCENT }} />
                  <span className="text-xs" style={{ color: T2 }}>Current Value</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Fund card */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: T3 }}>Fund Card — individual scheme or portfolio entry</p>
            <Card>
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
                    style={{ background: `${PRO}15`, color: PRO }}>MI</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold" style={{ color: T1 }}>Mirae Asset Large Cap Fund</h3>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#EDE9FE', color: PRO }}>Large Cap</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: SURFACE_2, color: T2 }}>Direct</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: SURFACE_2, color: T2 }}>Growth</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold" style={{ color: T1 }}>₹107.42</p>
                        <p className="text-xs font-medium" style={{ color: SUCCESS }}>▲ 0.34%</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t" style={{ borderColor: BORDER_SUBTLE }}>
                      {[
                        { label: '1Y Return', value: '+18.7%', color: SUCCESS },
                        { label: '3Y CAGR', value: '+14.2%', color: SUCCESS, locked: true },
                        { label: 'Volatility', value: 'Low', color: '#3B82F6' },
                      ].map(m => (
                        <div key={m.label}>
                          <p className="text-xs mb-1" style={{ color: T3 }}>{m.label}</p>
                          {m.locked ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                              style={{ background: `${PRO}15`, color: PRO }}>
                              <LockIcon size={10} weight="regular" /> PRO
                            </span>
                          ) : (
                            <p className="text-sm font-semibold" style={{ color: m.color }}>{m.value}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════
            4. DATA TABLE
        ══════════════════════════════════════════════════════════ */}
        <Section title="4. Data Table" desc="Fund list, holdings ledger, search results. Clean alternating rows, color-coded returns.">
          <Card>
            {/* Table header */}
            <div className="grid gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b"
              style={{ gridTemplateColumns: '2fr 80px 80px 80px 100px', borderColor: CARD_BORDER, color: T3, background: SURFACE_2, borderRadius: '16px 16px 0 0' }}>
              <span>Fund</span>
              <span className="text-right">NAV</span>
              <span className="text-right">1Y</span>
              <span className="text-right">3Y</span>
              <span>Volatility</span>
            </div>

            {FUNDS.map((f, i) => {
              const vc = VOL_CONFIG[f.vol]
              return (
                <div key={f.name}
                  className="grid gap-3 px-4 py-3.5 items-center border-b last:border-b-0 transition-colors cursor-pointer"
                  style={{ gridTemplateColumns: '2fr 80px 80px 80px 100px', borderColor: BORDER_SUBTLE, background: i % 2 === 1 ? SURFACE_2 : CARD }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#EDE9FE')}
                  onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 1 ? SURFACE_2 : CARD)}
                >
                  {/* Fund name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: `${PRO}15`, color: PRO }}>
                      {f.amc.slice(0,2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: T1 }}>{f.name}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: T3 }}>{f.amc} · {f.cat}</p>
                    </div>
                  </div>
                  {/* NAV */}
                  <div className="text-right">
                    <p className="text-xs font-semibold" style={{ color: T1 }}>₹{f.nav}</p>
                    <p className="text-[10px]" style={{ color: f.change >= 0 ? SUCCESS : DANGER }}>
                      {f.change >= 0 ? '+' : ''}{f.change}%
                    </p>
                  </div>
                  {/* 1Y */}
                  <p className="text-right text-xs font-semibold" style={{ color: f.r1y >= 0 ? SUCCESS : DANGER }}>
                    +{f.r1y}%
                  </p>
                  {/* 3Y — locked */}
                  <div className="flex justify-end">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ background: `${PRO}15`, color: PRO }}>
                      <LockIcon size={9} weight="regular" /> PRO
                    </span>
                  </div>
                  {/* Volatility */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: vc.dot }} />
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: vc.bg, color: vc.text }}>{f.vol}</span>
                  </div>
                </div>
              )
            })}
          </Card>
          <div className="mt-3 flex gap-3 flex-wrap">
            <Token label="row-hover" value="#EDE9FE (light purple)" />
            <Token label="alternate-row" value="#F9FAFB" />
            <Token label="column-lock" value="PRO badge pill" />
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════
            5. BADGES & TAGS
        ══════════════════════════════════════════════════════════ */}
        <Section title="5. Badges & Tags" desc="Every badge type used across the dashboard.">
          <Card>
            <div className="p-6 space-y-6">

              {/* Plan badges */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: T3 }}>Plan Badges</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: SURFACE_2, color: T2, border: `1px solid ${CARD_BORDER}` }}>
                    Free
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: PRO, color: '#fff' }}>
                    <StarIcon size={11} weight="regular" /> Sahi PRO
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'linear-gradient(90deg, #d6fd70, #b8d94a)', color: '#000' }}>
                    <StarIcon size={11} weight="regular" /> Sahi Wealth
                  </span>
                </div>
              </div>

              {/* Volatility */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: T3 }}>Volatility</p>
                <div className="flex items-center gap-3">
                  {Object.entries(VOL_CONFIG).map(([label, c]) => (
                    <span key={label} className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: c.bg, color: c.text }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: c.dot }} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Category tags */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: T3 }}>Category / Fund Type Tags</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {['Large Cap','Mid Cap','Small Cap','Flexi Cap','ELSS','Gilt','Balanced Advantage','Multi Asset'].map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#EDE9FE', color: PRO }}>
                      {t}
                    </span>
                  ))}
                  {['Direct','Regular','Growth','IDCW'].map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: SURFACE_2, color: T2, border: `1px solid ${CARD_BORDER}` }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Return indicators */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: T3 }}>Return Indicators</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#DCFCE7', color: SUCCESS }}>
                    <TrendingUpIcon size={12} weight="regular" /> +22.3%
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#FEE2E2', color: DANGER }}>
                    <TrendingDownIcon size={12} weight="regular" /> −3.8%
                  </span>
                  <span className="text-sm font-bold" style={{ color: SUCCESS }}>+18.7%</span>
                  <span className="text-sm font-bold" style={{ color: DANGER }}>−4.2%</span>
                  <span className="text-sm font-bold" style={{ color: T2 }}>—</span>
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: T3 }}>Status</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {[
                    { label: 'Active SIP', bg: '#DCFCE7', text: SUCCESS, dot: SUCCESS },
                    { label: 'Redeemed', bg: '#FEE2E2', text: DANGER, dot: DANGER },
                    { label: 'Pending', bg: '#FEF3C7', text: WARNING, dot: WARNING },
                    { label: 'Paused', bg: SURFACE_2, text: T2, dot: T3 },
                  ].map(s => (
                    <span key={s.label} className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: s.bg, color: s.text }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </Section>

        {/* ══════════════════════════════════════════════════════════
            6. BUTTONS
        ══════════════════════════════════════════════════════════ */}
        <Section title="6. Buttons" desc="All button variants. Primary uses the brand accent, never white-on-green.">
          <Card>
            <div className="p-6 space-y-5">
              {/* Sizes */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: T3 }}>Primary CTA</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <button className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all" style={{ background: ACCENT, color: '#000' }}>
                    Start SIP
                  </button>
                  <button className="px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all" style={{ border: `2px solid ${T1}`, color: T1, background: 'transparent' }}>
                    Invest Lumpsum
                  </button>
                  <button className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all" style={{ background: PRO, color: '#fff' }}>
                    Upgrade to PRO
                  </button>
                  <button className="px-4 py-2 rounded-lg text-xs font-semibold transition-all" style={{ background: SURFACE_2, color: T2, border: `1px solid ${CARD_BORDER}` }}>
                    Export CSV
                  </button>
                  <button className="px-4 py-2 rounded-lg text-xs font-semibold transition-all" style={{ color: T2 }}>
                    Cancel
                  </button>
                </div>
              </div>

              {/* With icons */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: T3 }}>With Icons</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: ACCENT, color: '#000' }}>
                    <AutoAwesomeIcon size={16} weight="fill" /> Explore Sahi Funds
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border" style={{ borderColor: CARD_BORDER, color: T1 }}>
                    <CheckCircleIcon size={14} weight="regular" /> Approve
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold" style={{ background: `${PRO}15`, color: PRO }}>
                    <LockIcon size={13} weight="regular" /> Unlock with PRO
                  </button>
                </div>
              </div>

              {/* Destructive / danger */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: T3 }}>Danger</p>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: DANGER, color: '#fff' }}>
                    Remove Portfolio
                  </button>
                  <button className="px-4 py-2 rounded-lg text-xs font-semibold border" style={{ borderColor: DANGER, color: DANGER }}>
                    Cancel SIP
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </Section>

        {/* ══════════════════════════════════════════════════════════
            7. FORM ELEMENTS
        ══════════════════════════════════════════════════════════ */}
        <Section title="7. Form Elements" desc="All inputs use white bg · 1px border · rounded-xl · focus ring uses accent color.">
          <Card>
            <div className="p-6 grid grid-cols-2 gap-6">
              {/* Search */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: T2 }}>Search Input</label>
                <div className="relative">
                  <SearchIcon size={15} weight="regular" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} color={T3} />
                  <input className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={{ background: CARD, border: `1px solid ${CARD_BORDER}`, color: T1 }}
                    placeholder="Search by fund name, AMC..."
                    onFocus={e => e.target.style.borderColor = ACCENT}
                    onBlur={e => e.target.style.borderColor = CARD_BORDER}
                  />
                </div>
              </div>

              {/* Select */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: T2 }}>Select / Dropdown</label>
                <select className="w-full px-3 py-2.5 rounded-xl text-sm outline-none appearance-none"
                  style={{ background: CARD, border: `1px solid ${CARD_BORDER}`, color: T1 }}>
                  <option>Sort by Popularity</option>
                  <option>1Y Returns ↑</option>
                  <option>Expense Ratio ↑</option>
                </select>
              </div>

              {/* Range slider */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: T2 }}>
                  Range Slider <span className="font-normal" style={{ color: T3 }}>— SIP amount / Expense ratio filter</span>
                </label>
                <div className="space-y-2">
                  <input type="range" min={500} max={100000} defaultValue={25000}
                    className="w-full" style={{ accentColor: ACCENT }} />
                  <div className="flex justify-between text-xs" style={{ color: T3 }}>
                    <span>₹500</span><span className="font-semibold" style={{ color: PRO }}>₹25,000</span><span>₹1 L</span>
                  </div>
                </div>
              </div>

              {/* Phone input (from login) */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: T2 }}>Phone Input</label>
                <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
                  <div className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium border-r flex-shrink-0" style={{ background: SURFACE_2, borderColor: CARD_BORDER, color: T2 }}>
                    +91
                  </div>
                  <input className="flex-1 px-3 py-2.5 text-sm outline-none" style={{ background: CARD, color: T1 }} placeholder="98765 43210" />
                </div>
              </div>

              {/* Checkbox */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: T2 }}>Checkboxes — filters</label>
                <div className="space-y-2">
                  {['Large Cap', 'Mid Cap', 'Flexi Cap'].map((c, i) => (
                    <label key={c} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" defaultChecked={i === 0} style={{ accentColor: ACCENT, width: 14, height: 14 }} />
                      <span className="text-sm" style={{ color: T1 }}>{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tab bar */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: T2 }}>Tab Bar</label>
                <div className="flex gap-1 border-b" style={{ borderColor: CARD_BORDER }}>
                  {['Overview', 'Constituents', 'Returns'].map((t, i) => (
                    <button key={t} className="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
                      style={i === 0
                        ? { borderColor: ACCENT, color: T1 }
                        : { borderColor: 'transparent', color: T3 }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </Section>

        {/* ══════════════════════════════════════════════════════════
            8. ALERTS & FEEDBACK
        ══════════════════════════════════════════════════════════ */}
        <Section title="8. Alerts & Feedback" desc="Banners, empty states, plan gates.">
          <div className="space-y-3">

            {/* Alert banners */}
            {[
              { icon: <InfoOutlinedIcon size={16} weight="fill" />, bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8', label: 'Info', msg: 'Import your CAS from MFCentral to see all your portfolios in one place.' },
              { icon: <CheckCircleOutlineIcon size={16} weight="fill" />, bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D', label: 'Success', msg: 'SIP of ₹5,000 in Mirae Asset Large Cap Fund activated successfully.' },
              { icon: <WarningAmberIcon size={16} weight="fill" />, bg: '#FFFBEB', border: '#FDE68A', text: '#B45309', label: 'Warning', msg: 'SEBI notice: Sahi MF Funds are research portfolios, not personalised advice.' },
              { icon: <ErrorOutlineIcon size={16} weight="fill" />, bg: '#FFF1F2', border: '#FECDD3', text: '#BE123C', label: 'Danger', msg: 'Plan expired. Renew Sahi PRO to continue accessing 3Y/5Y returns and overlaps.' },
            ].map(a => (
              <div key={a.label} className="flex items-start gap-3 p-4 rounded-xl border" style={{ background: a.bg, borderColor: a.border }}>
                <span style={{ color: a.text, marginTop: 1 }}>{a.icon}</span>
                <div>
                  <span className="text-xs font-bold mr-2" style={{ color: a.text }}>{a.label}.</span>
                  <span className="text-xs" style={{ color: a.text }}>{a.msg}</span>
                </div>
              </div>
            ))}

            {/* Plan gate */}
            <div className="relative mt-2">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3 mt-4" style={{ color: T3 }}>Plan Gate — blur + lock overlay</p>
              <Card>
                <div className="relative">
                  <div className="blur-sm select-none p-5">
                    <p className="text-sm font-semibold mb-2" style={{ color: T1 }}>Fund Overlap Analysis</p>
                    <div className="grid grid-cols-3 gap-3">
                      {['Overlap: 42%', 'Common: 12 stocks', 'Concentration: High'].map(s => (
                        <div key={s} className="p-3 rounded-xl" style={{ background: SURFACE_2 }}>
                          <p className="text-xs" style={{ color: T1 }}>{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(2px)' }}>
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: `${PRO}15`, border: `1px solid ${PRO}30` }}>
                        <LockIcon size={18} color={PRO} weight="fill" />
                      </div>
                      <p className="text-sm font-semibold mb-1" style={{ color: T1 }}>Upgrade to Sahi PRO</p>
                      <p className="text-xs mb-3" style={{ color: T2 }}>Unlock overlap analysis and 50+ more features</p>
                      <button className="px-5 py-2 rounded-full text-sm font-semibold" style={{ background: PRO, color: '#fff' }}>
                        View Plans
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════
            9. SPACING & RADIUS GUIDE
        ══════════════════════════════════════════════════════════ */}
        <Section title="9. Spacing & Radius" desc="Consistent spacing scale prevents visual noise.">
          <Card>
            <div className="p-6 grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: T3 }}>Border Radius Scale</p>
                <div className="space-y-3">
                  {[
                    { label: 'rounded-lg (8px)', r: 8, use: 'Buttons, inputs, small pills' },
                    { label: 'rounded-xl (12px)', r: 12, use: 'Badges, tags, small cards' },
                    { label: 'rounded-2xl (16px)', r: 16, use: 'All main cards and panels' },
                    { label: 'rounded-full', r: 999, use: 'Avatars, pill badges, circles' },
                  ].map(r => (
                    <div key={r.label} className="flex items-center gap-4">
                      <div className="w-10 h-10 flex-shrink-0" style={{ background: `${PRO}20`, borderRadius: r.r }} />
                      <div>
                        <p className="text-xs font-semibold" style={{ color: T1 }}>{r.label}</p>
                        <p className="text-xs" style={{ color: T3 }}>{r.use}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: T3 }}>Layout Spacing</p>
                <div className="space-y-2">
                  {[
                    { token: 'Page padding', value: 'p-6 (24px)', use: 'Outer page container' },
                    { token: 'Card padding', value: 'p-5 (20px)', use: 'Card interior' },
                    { token: 'Card header', value: 'px-5 py-4', use: 'Card title row' },
                    { token: 'Section gap', value: 'gap-6 (24px)', use: 'Between cards in grid' },
                    { token: 'Item gap', value: 'gap-4 (16px)', use: 'Inside cards' },
                    { token: 'Micro gap', value: 'gap-2 (8px)', use: 'Icon + label, badge items' },
                  ].map(s => (
                    <div key={s.token} className="flex items-start gap-3 py-1.5 border-b" style={{ borderColor: BORDER_SUBTLE }}>
                      <code className="text-[10px] font-mono w-28 flex-shrink-0" style={{ color: PRO }}>{s.value}</code>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: T1 }}>{s.token}</p>
                        <p className="text-xs" style={{ color: T3 }}>{s.use}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </Section>

        {/* Approval CTA */}
        <div className="rounded-2xl p-8 text-center" style={{ background: T1 }}>
          <p className="text-2xl font-bold text-white mb-2">Ready to approve?</p>
          <p className="text-sm mb-6" style={{ color: '#A1A1AA' }}>
            Once confirmed, we'll refactor all dashboard pages to use these tokens and patterns.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button className="px-6 py-2.5 rounded-xl text-sm font-semibold" style={{ background: ACCENT, color: '#000' }}>
              ✓ Approve & Continue Build
            </button>
            <button className="px-6 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: '#3F3F46', color: '#A1A1AA' }}>
              Request Changes
            </button>
          </div>
        </div>

        <div className="h-12" />
      </div>
    </div>
  )
}

import { useMemo } from 'react'
import { ShieldCheck as ShieldIcon } from '@phosphor-icons/react'
import { mockPortfolios } from '../../data/portfolios'
import { useUIStore } from '../../stores/uiStore'
import { useAuthStore } from '../../stores/authStore'
import { PlanGate } from '../../components/ui/PlanGate'
import { PageHeroBanner } from '../../components/ui/PageHeroBanner'

// ─── Risk score helpers ───────────────────────────────────────────────────────
const CAT_RISK: Record<string, number> = {
  'Large Cap': 3, 'Flexi Cap': 3.5, 'Mid Cap': 4.5, 'Small Cap': 5.5,
  'Hybrid': 2.5, 'Debt': 1.5,
}
const CAT_RISK_LABEL: Record<string, string> = {
  'Large Cap': 'Moderate', 'Flexi Cap': 'Moderate', 'Mid Cap': 'Moderately High',
  'Small Cap': 'High', 'Hybrid': 'Low-Moderate', 'Debt': 'Low',
}
const CAT_VOL: Record<string, number> = {
  'Large Cap': 14, 'Flexi Cap': 15, 'Mid Cap': 19, 'Small Cap': 24,
  'Hybrid': 10, 'Debt': 4,
}
const RISK_SCORE_COLORS = ['#22c55e', '#84cc16', '#eab308', '#f59e0b', '#ef4444', '#dc2626']
const RISK_SCORE_LABELS = ['Low', 'Low-Moderate', 'Moderate', 'Moderately High', 'High', 'Very High']

function getRiskLabel(score: number): string {
  if (score < 2) return 'Low'
  if (score < 2.8) return 'Low-Moderate'
  if (score < 3.5) return 'Moderate'
  if (score < 4.5) return 'Moderately High'
  if (score < 5) return 'High'
  return 'Very High'
}
function getRiskLabelIdx(label: string): number {
  return RISK_SCORE_LABELS.indexOf(label)
}

// ─── Riskometer SVG ───────────────────────────────────────────────────────────
function Riskometer({ label, lm }: { label: string; lm: boolean }) {
  const idx = getRiskLabelIdx(label)
  const total = RISK_SCORE_LABELS.length - 1
  const angleDeg = -90 + (idx / total) * 180
  const color = RISK_SCORE_COLORS[idx]
  const cx = 110, cy = 90, r = 75

  // Needle
  const rad = (angleDeg * Math.PI) / 180
  const nx = cx + r * Math.cos(rad)
  const ny = cy + r * Math.sin(rad)

  // Arc segments
  const segments = RISK_SCORE_LABELS.map((_, i) => {
    const startAngle = -90 + (i / total) * 180
    const endAngle = -90 + ((i + 1) / total) * 180
    const sRad = (startAngle * Math.PI) / 180
    const eRad = (endAngle * Math.PI) / 180
    const x1 = cx + r * Math.cos(sRad)
    const y1 = cy + r * Math.sin(sRad)
    const x2 = cx + r * Math.cos(eRad)
    const y2 = cy + r * Math.sin(eRad)
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`
  })

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 220 110" width="220" height="110" style={{ overflow: 'visible' }}>
        {/* Background arc */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={lm ? '#E0E3E8' : '#1e2838'}
          strokeWidth={14}
          strokeLinecap="round"
        />
        {/* Colored arc up to current level */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${nx} ${ny}`}
          fill="none"
          stroke={color}
          strokeWidth={14}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
        {/* Segment ticks */}
        {RISK_SCORE_LABELS.map((_, i) => {
          const a = (-90 + (i / total) * 180) * (Math.PI / 180)
          return (
            <line
              key={i}
              x1={cx + (r - 10) * Math.cos(a)}
              y1={cy + (r - 10) * Math.sin(a)}
              x2={cx + (r + 2) * Math.cos(a)}
              y2={cy + (r + 2) * Math.sin(a)}
              stroke={lm ? '#E0E3E8' : '#2a3545'}
              strokeWidth={2}
            />
          )
        })}
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + (r - 15) * Math.cos(rad)}
          y2={cy + (r - 15) * Math.sin(rad)}
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={6} fill={color} />
        {/* Labels */}
        <text x={cx - r - 2} y={cy + 18} fontSize={8} fill={lm ? '#9CA3AF' : '#64748b'} textAnchor="middle">Low</text>
        <text x={cx + r + 2} y={cy + 18} fontSize={8} fill={lm ? '#9CA3AF' : '#64748b'} textAnchor="middle">High</text>
        {/* Score label */}
        <text x={cx} y={cy + 22} fontSize={11} fontWeight="bold" fill={color} textAnchor="middle">{label}</text>
      </svg>
    </div>
  )
}

// ─── Overlapping circles (risk/return scatter) ────────────────────────────────
function RiskReturnBubbles({
  funds,
  lm,
}: {
  funds: { name: string; xirr: number; vol: number; alloc: number; category: string }[]
  lm: boolean
}) {
  const W = 400, H = 220
  const PAD = { l: 32, r: 16, t: 12, b: 30 }
  const xMin = 0, xMax = 30
  const yMin = 0, yMax = 28

  const toX = (v: number) => PAD.l + ((v - xMin) / (xMax - xMin)) * (W - PAD.l - PAD.r)
  const toY = (v: number) => H - PAD.b - ((v - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b)

  const gridX = [0, 10, 20, 30]
  const gridY = [0, 10, 20]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
      {/* Grid */}
      {gridX.map(x => (
        <g key={`gx${x}`}>
          <line x1={toX(x)} y1={PAD.t} x2={toX(x)} y2={H - PAD.b} stroke={lm ? '#F3F4F6' : '#1e2838'} strokeWidth={1} />
          <text x={toX(x)} y={H - PAD.b + 12} fontSize={8} fill={lm ? '#9CA3AF' : '#64748b'} textAnchor="middle">{x}%</text>
        </g>
      ))}
      {gridY.map(y => (
        <g key={`gy${y}`}>
          <line x1={PAD.l} y1={toY(y)} x2={W - PAD.r} y2={toY(y)} stroke={lm ? '#F3F4F6' : '#1e2838'} strokeWidth={1} />
          <text x={PAD.l - 4} y={toY(y) + 3} fontSize={8} fill={lm ? '#9CA3AF' : '#64748b'} textAnchor="end">{y}%</text>
        </g>
      ))}
      {/* Axes labels */}
      <text x={PAD.l + (W - PAD.l - PAD.r) / 2} y={H} fontSize={9} fill={lm ? '#6B7280' : '#8390a2'} textAnchor="middle">XIRR →</text>
      <text x={8} y={H / 2} fontSize={9} fill={lm ? '#6B7280' : '#8390a2'} textAnchor="middle" transform={`rotate(-90, 8, ${H / 2})`}>Volatility →</text>

      {/* Bubbles */}
      {funds.map((f, i) => {
        const cx = toX(f.xirr)
        const cy = toY(f.vol)
        const r = 8 + f.alloc * 0.4
        const color = RISK_SCORE_COLORS[Math.min(Math.floor(CAT_RISK[f.category] ?? 3), 5)]
        return (
          <g key={f.name}>
            <circle
              cx={cx} cy={cy} r={r}
              fill={color}
              fillOpacity={0.25}
              stroke={color}
              strokeWidth={1.5}
            />
            <text
              x={cx} y={cy + 3}
              fontSize={7}
              fontWeight="bold"
              fill={lm ? '#111827' : '#ffffff'}
              textAnchor="middle"
              style={{ pointerEvents: 'none' }}
            >
              {f.name.split(' ').slice(0, 1).join('')}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function RiskAnalysis() {
  const lm = useUIStore((s) => s.lightMode)
  const { user } = useAuthStore()

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'
  const divider = lm ? 'border-[#F0F0F8]' : 'border-[#1e2838]'
  const rowHover = lm ? 'hover:bg-[#F9FAFB]' : 'hover:bg-[#1a2130]'

  const portfolios = mockPortfolios.filter(p => p.userId === (user?.id ?? 'u003'))
  const allHoldings = portfolios.flatMap(p => p.holdings)

  const totalInvested = allHoldings.reduce((s, h) => s + h.investedAmount, 0)

  const fundsWithRisk = useMemo(() => allHoldings.map(h => ({
    name: h.fundName,
    amc: h.amcName,
    category: h.category,
    xirr: h.xirr,
    vol: CAT_VOL[h.category] ?? 14,
    alloc: totalInvested > 0 ? (h.investedAmount / totalInvested) * 100 : 0,
    riskScore: CAT_RISK[h.category] ?? 3,
    riskLabel: CAT_RISK_LABEL[h.category] ?? 'Moderate',
  })), [allHoldings, totalInvested])

  const portfolioRiskScore = useMemo(() => {
    if (totalInvested === 0) return 3
    return fundsWithRisk.reduce((sum, f) => sum + f.riskScore * (f.alloc / 100), 0)
  }, [fundsWithRisk, totalInvested])

  const portfolioRiskLabel = getRiskLabel(portfolioRiskScore)
  const portfolioVol = useMemo(() => {
    if (totalInvested === 0) return 0
    return fundsWithRisk.reduce((sum, f) => sum + f.vol * (f.alloc / 100), 0)
  }, [fundsWithRisk, totalInvested])

  const portfolioXirr = useMemo(() => {
    if (totalInvested === 0) return 0
    const totalWeightedXirr = allHoldings.reduce((sum, h) => sum + h.xirr * h.investedAmount, 0)
    return totalWeightedXirr / totalInvested
  }, [allHoldings, totalInvested])

  const maxDrawdownEst = -(portfolioVol * 0.8).toFixed(1)
  const beta = (portfolioRiskScore / 3.5).toFixed(2)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeroBanner
        lm={lm}
        icon={<ShieldIcon size={22} weight="duotone" />}
        title="Portfolio Risk Analysis"
        subtitle="Research-based risk scoring of your portfolio — volatility, beta, drawdown & fund-level breakdown"
        badge="Research Tool"
        stats={[
          { label: 'Risk Level', value: portfolioRiskLabel },
          { label: 'Est. Volatility', value: `${portfolioVol.toFixed(1)}%` },
          { label: 'Portfolio XIRR', value: `${portfolioXirr.toFixed(1)}%`, positive: true },
        ]}
      />

      {/* Top row: riskometer + summary metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Riskometer card */}
        <div className={`${card} rounded-2xl p-5`}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${textMuted}`}>Portfolio Risk Level</p>
          <Riskometer label={portfolioRiskLabel} lm={lm} />
          <div className="mt-3 text-center">
            <p className={`text-xs ${textSub} max-w-xs mx-auto leading-relaxed`}>
              Based on category-weighted risk scoring across your {fundsWithRisk.length} holdings. Not a regulatory risk rating.
            </p>
          </div>

          {/* Risk level legend */}
          <div className="flex justify-between mt-4 px-2">
            {RISK_SCORE_LABELS.map((l, i) => (
              <div key={l} className="flex flex-col items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: RISK_SCORE_COLORS[i] }} />
                <span className="text-[7px] text-center leading-tight" style={{ color: lm ? '#9CA3AF' : '#64748b', maxWidth: 28 }}>{l.split('-')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk metrics */}
        <div className={`${card} rounded-2xl p-5 space-y-3`}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${textMuted}`}>Key Risk Metrics</p>
          {[
            { label: 'Portfolio Beta (vs Nifty)', value: beta, note: 'Lower = less market sensitive', highlight: Number(beta) < 1 },
            { label: 'Est. Portfolio Volatility (1Y SD)', value: `${portfolioVol.toFixed(1)}%`, note: 'Annualised standard deviation', highlight: portfolioVol < 15 },
            { label: 'Weighted XIRR', value: `${portfolioXirr.toFixed(1)}%`, note: 'Weighted across all holdings', highlight: true },
            { label: 'Est. Max Drawdown (bear)', value: `${maxDrawdownEst}%`, note: 'Estimated worst-case correction', highlight: false },
          ].map(m => (
            <div key={m.label} className={`flex items-center justify-between py-2 border-b ${divider} last:border-0`}>
              <div>
                <p className={`text-xs font-medium ${text}`}>{m.label}</p>
                <p className={`text-[10px] ${textMuted}`}>{m.note}</p>
              </div>
              <span
                className="text-sm font-bold"
                style={{ color: m.highlight ? (lm ? '#4f46e5' : '#d6fd70') : (lm ? '#111827' : '#ffffff') }}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk/Return Bubble Chart */}
      <div className={`${card} rounded-2xl p-5`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`text-sm font-semibold ${text}`}>Risk vs Return — Fund Scatter</p>
            <p className={`text-xs ${textMuted} mt-0.5`}>Bubble size = allocation %; right = higher return; up = higher volatility</p>
          </div>
        </div>
        <RiskReturnBubbles funds={fundsWithRisk} lm={lm} />
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-3">
          {fundsWithRisk.map((f, i) => {
            const color = RISK_SCORE_COLORS[Math.min(Math.floor(f.riskScore), 5)]
            return (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color, opacity: 0.7 }} />
                <span className={`text-[10px] ${textMuted}`}>{f.name.split(' ').slice(0, 3).join(' ')}</span>
                <span className={`text-[10px] font-semibold ${textSub}`}>{f.alloc.toFixed(0)}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Fund-by-fund risk table */}
      <div className={`${card} rounded-2xl overflow-hidden`}>
        <div className={`flex items-center justify-between px-5 py-4 border-b ${divider}`}>
          <p className={`text-sm font-semibold ${text}`}>Fund-Level Risk Breakdown</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${divider}`}>
                {['Fund', 'Category', 'Allocation', 'Risk Level', 'Est. Volatility', 'XIRR', 'Risk Score'].map(h => (
                  <th key={h} className={`text-left text-[11px] font-semibold ${textMuted} uppercase tracking-wide px-4 py-3 whitespace-nowrap`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fundsWithRisk.map((f, i) => {
                const labelIdx = getRiskLabelIdx(f.riskLabel)
                const color = RISK_SCORE_COLORS[labelIdx] ?? '#64748b'
                return (
                  <tr key={i} className={`border-b ${divider} last:border-0 ${rowHover} transition-colors`}>
                    <td className="px-4 py-3">
                      <p className={`text-xs font-semibold ${text} max-w-[200px] leading-tight`}>{f.name}</p>
                      <p className={`text-[10px] ${textMuted}`}>{f.amc}</p>
                    </td>
                    <td className={`px-4 py-3 text-xs ${textSub}`}>{f.category}</td>
                    <td className={`px-4 py-3 text-xs font-semibold ${text}`}>{f.alloc.toFixed(1)}%</td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${color}18`, color }}>
                        {f.riskLabel}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-xs ${text}`}>{f.vol}%</td>
                    <td className={`px-4 py-3 text-xs font-bold ${f.xirr >= 14 ? 'text-[#22c55e]' : f.xirr >= 8 ? 'text-[#f59e0b]' : 'text-[#ef4444]'}`}>{f.xirr}%</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: lm ? '#F3F4F6' : '#1e2838', width: 60 }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${(f.riskScore / 6) * 100}%`, background: color }} />
                        </div>
                        <span className="text-[10px] font-bold" style={{ color }}>{f.riskScore.toFixed(1)}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stress test — PRO gated */}
      <PlanGate requiredTier="pro">
        <div className={`${card} rounded-2xl p-5`}>
          <p className={`text-sm font-semibold ${text} mb-4`}>Stress Test Scenarios</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { scenario: 'COVID-19 Crash (Mar 2020)', portImpact: '-29.4%', recovery: '11 months', color: '#ef4444' },
              { scenario: '2022 Bear Market', portImpact: '-18.2%', recovery: '7 months', color: '#f59e0b' },
              { scenario: 'US Fed Rate Hike Cycle', portImpact: '-12.8%', recovery: '4 months', color: '#eab308' },
            ].map(s => (
              <div key={s.scenario} className="rounded-xl p-4" style={{ background: `${s.color}0d`, border: `1px solid ${s.color}30` }}>
                <p className={`text-[10px] font-semibold uppercase tracking-wide ${textMuted} mb-2`}>{s.scenario}</p>
                <p className="text-xl font-black" style={{ color: s.color }}>{s.portImpact}</p>
                <p className={`text-xs mt-1 ${textSub}`}>Est. portfolio impact</p>
                <p className={`text-xs font-semibold mt-2 ${text}`}>Recovery: {s.recovery}</p>
              </div>
            ))}
          </div>
          <p className={`text-[10px] ${textMuted} mt-3`}>
            Estimated based on category-weighted historical drawdowns. Not indicative of future performance.
          </p>
        </div>
      </PlanGate>
    </div>
  )
}

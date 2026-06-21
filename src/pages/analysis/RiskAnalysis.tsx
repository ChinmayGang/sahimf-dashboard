import { useMemo } from 'react'
import { ShieldCheck as ShieldIcon, UploadSimple as UploadIcon, LightbulbFilament as BulbIcon } from '@phosphor-icons/react'
import { mockPortfolios } from '../../data/portfolios'
import { useUIStore } from '../../stores/uiStore'
import { useAuthStore } from '../../stores/authStore'
import { PlanGate } from '../../components/ui/PlanGate'
import { ProButton } from '../../components/ui/ProButton'
import { AnimatedBorderCard } from '../../components/ui/AnimatedBorderCard'

// â"€â"€â"€ Risk score helpers â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
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
function getRiskLabel(score: number): string {
  if (score < 2.5) return 'Low'
  if (score < 4) return 'Moderate'
  return 'High'
}

const RISK3_LABELS = ['Low', 'Moderate', 'High']
const RISK3_COLORS = ['#22c55e', '#f59e0b', '#ef4444']

function getRiskLabelIdx(label: string): number {
  const i = RISK3_LABELS.indexOf(label)
  return i === -1 ? 1 : i
}

function riskScoreToColor(score: number): string {
  if (score < 2.5) return '#22c55e'
  if (score < 4) return '#f59e0b'
  return '#ef4444'
}

const RISK3_CONFIG: Record<string, { idx: number; color: string }> = {
  'Low':      { idx: 0, color: '#22c55e' },
  'Moderate': { idx: 1, color: '#f59e0b' },
  'High':     { idx: 2, color: '#ef4444' },
}

// â"€â"€â"€ Riskometer SVG â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function Riskometer({ label, lm }: { label: string; lm: boolean }) {
  const cfg = RISK3_CONFIG[label] ?? RISK3_CONFIG['Moderate']
  const { idx, color } = cfg
  // Arc spans 180·â†'360· (LEFTâ†'UPâ†'RIGHT). Needle at center of each 60· segment.
  const angleDeg = 180 + (idx + 0.5) * 60
  const cx = 110, cy = 90, r = 75
  const rad = (angleDeg * Math.PI) / 180

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 220 110" width="220" height="110" style={{ overflow: 'visible' }}>
        {/* 3 colored arc segments: LEFTâ†'UPâ†'RIGHT */}
        {[
          { color: '#22c55e' },
          { color: '#f59e0b' },
          { color: '#ef4444' },
        ].map((seg, i) => {
          const a0 = ((180 + (i / 3) * 180) * Math.PI) / 180
          const a1 = ((180 + ((i + 1) / 3) * 180) * Math.PI) / 180
          const x1 = cx + r * Math.cos(a0), y1 = cy + r * Math.sin(a0)
          const x2 = cx + r * Math.cos(a1), y2 = cy + r * Math.sin(a1)
          return (
            <path
              key={i}
              d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
              fill="none"
              stroke={i <= idx ? seg.color : (lm ? '#E0E3E8' : '#1e2838')}
              strokeWidth={14}
              strokeLinecap="butt"
              opacity={i <= idx ? 1 : 0.4}
            />
          )
        })}
        {/* Needle */}
        <line
          x1={cx} y1={cy}
          x2={cx + (r - 15) * Math.cos(rad)}
          y2={cy + (r - 15) * Math.sin(rad)}
          stroke={color} strokeWidth={3} strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={6} fill={color} />
        {/* Labels */}
        <text x={cx - r - 2} y={cy + 18} fontSize={8} fill={lm ? '#6B7280' : '#64748b'} textAnchor="middle">Low</text>
        <text x={cx} y={cy + 22} fontSize={9} fontWeight="bold" fill={color} textAnchor="middle">{label}</text>
        <text x={cx + r + 2} y={cy + 18} fontSize={8} fill={lm ? '#6B7280' : '#64748b'} textAnchor="middle">High</text>
      </svg>
    </div>
  )
}

// â"€â"€â"€ Overlapping circles (risk/return scatter) â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
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
      <text x={PAD.l + (W - PAD.l - PAD.r) / 2} y={H} fontSize={9} fill={lm ? '#6B7280' : '#8390a2'} textAnchor="middle">XIRR â†'</text>
      <text x={8} y={H / 2} fontSize={9} fill={lm ? '#6B7280' : '#8390a2'} textAnchor="middle" transform={`rotate(-90, 8, ${H / 2})`}>Volatility â†'</text>

      {/* Bubbles */}
      {funds.map((f, _i) => {
        const cx = toX(f.xirr)
        const cy = toY(f.vol)
        const r = 8 + f.alloc * 0.4
        const color = riskScoreToColor(CAT_RISK[f.category] ?? 3)
        return (
          <g key={`${f.name}-${_i}`} style={{ cursor: 'pointer' }}>
            <title>{`${f.name} · ${f.alloc.toFixed(0)}% allocation · ${f.xirr.toFixed(1)}% XIRR · ${f.vol}% volatility`}</title>
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

// â"€â"€â"€ Main component â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
export function RiskAnalysis() {
  const lm = useUIStore((s) => s.lightMode)
  const { user } = useAuthStore()

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#6B7280]' : 'text-[#64748b]'
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

  // No holdings to analyse — guide the user to add a portfolio instead of empty charts.
  if (totalInvested === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #8c34ee, #4f46e5)', boxShadow: '0 4px 16px rgba(140,52,238,0.25)' }}>
            <span style={{ color: '#d6fd70' }}><ShieldIcon size={20} weight="fill" /></span>
          </div>
          <div>
            <h1 className={`text-xl font-black tracking-tight ${text}`}>Portfolio Risk Analysis</h1>
            <p className={`text-xs ${textSub}`}>Research-based risk scoring of your portfolio — volatility, beta, drawdown &amp; fund breakdown</p>
          </div>
        </div>

        <div className={`${card} rounded-2xl p-10 flex flex-col items-center text-center`}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: lm ? '#eeedfd' : 'rgba(79,70,229,0.12)' }}>
            <UploadIcon size={26} color={lm ? '#4f46e5' : '#d6fd70'} weight="fill" />
          </div>
          <p className={`text-base font-bold ${text} mb-1`}>Analyse your portfolio risk</p>
          <p className={`text-sm ${textSub} max-w-md mb-5`}>
            Upload your CAS statement or add a few funds and we'll score your portfolio's volatility, beta,
            drawdown and fund-level risk — with a Sahi insight on how to balance it.
          </p>
          <ProButton label="Add your portfolio" onClick={() => { window.location.href = '/mutual-funds/portfolios' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #8c34ee, #4f46e5)', boxShadow: '0 4px 16px rgba(140,52,238,0.25)' }}>
            <span style={{ color: '#d6fd70' }}><ShieldIcon size={20} weight="fill" /></span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-xl font-black tracking-tight text-[#111827]">Portfolio Risk Analysis</h1>
              <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#eeedfd] text-[#4f46e5]">Research Tool</span>
            </div>
            <p className="text-xs text-[#6B7280]">Research-based risk scoring of your portfolio — volatility, beta, drawdown &amp; fund-level breakdown</p>
          </div>
        </div>
        <div className="flex-shrink-0 flex gap-2">
          {[
            { label: 'Risk Level', value: portfolioRiskLabel },
            { label: 'Est. Volatility', value: `${portfolioVol.toFixed(1)}%` },
            { label: 'Portfolio XIRR', value: `${portfolioXirr.toFixed(1)}%` },
          ].map(s => (
            <div key={s.label} className="text-center px-3 py-2 rounded-xl bg-white border border-[#E0E3E8]">
              <p className="text-sm font-bold text-[#4f46e5] leading-none">{s.value}</p>
              <p className="text-[10px] text-[#6B7280] mt-0.5 whitespace-nowrap">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top row: riskometer + summary metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Riskometer card */}
        <div className={`${card} rounded-2xl p-5`}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'}`}>Portfolio Risk Level</p>
          <Riskometer label={portfolioRiskLabel} lm={lm} />
          <div className="mt-3 text-center">
            <p className={`text-xs ${textSub} max-w-xs mx-auto leading-relaxed`}>
              Based on category-weighted risk scoring across your {fundsWithRisk.length} holdings. Not a regulatory risk rating.
            </p>
          </div>

          {/* Risk level legend */}
          <div className="flex justify-around mt-4 px-2">
            {RISK3_LABELS.map((l, i) => (
              <div key={l} className="flex flex-col items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: RISK3_COLORS[i] }} />
                <span className="text-[8px] text-center leading-tight" style={{ color: lm ? '#6B7280' : '#64748b' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk metrics */}
        <div className={`${card} rounded-2xl p-5 space-y-3`}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'}`}>Key Risk Metrics</p>
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

      {/* Risk/Return Bubble Chart + Sahi Insight (B7-4) */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
      <div className={`${card} rounded-2xl p-5`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`text-sm font-semibold ${text}`}>Risk vs Return — Fund Scatter</p>
            <p className={`text-xs ${textMuted} mt-0.5`}>Bubble size = allocation %; hover a bubble for details</p>
          </div>
        </div>
        <RiskReturnBubbles funds={fundsWithRisk} lm={lm} />
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-3">
          {fundsWithRisk.map((f, i) => {
            const color = riskScoreToColor(f.riskScore)
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

      {/* Sahi Insight — fills the column beside the scatter */}
      <AnimatedBorderCard badge="SAHI INSIGHT">
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <BulbIcon size={15} color="#4f46e5" weight="fill" />
            <p className="text-sm font-semibold text-[#111827]">Sahi Risk Insight</p>
          </div>
          <p className="text-xs text-[#374151] leading-relaxed">
            Your portfolio carries a <b style={{ color: riskScoreToColor(portfolioRiskScore) }}>{portfolioRiskLabel}</b> risk profile —
            an estimated <b className="text-[#111827]">{portfolioVol.toFixed(1)}%</b> annualised volatility and a beta of <b className="text-[#111827]">{beta}</b> versus the Nifty 50.
          </p>
          <ul className="mt-3 space-y-2">
            {[
              Number(beta) < 1 ? 'Beta below 1 — your mix is less sensitive to market swings than the index.' : 'Beta above 1 — expect sharper moves than the index in both directions.',
              `Worst-case drawdown is estimated near ${maxDrawdownEst}% in a deep correction — size your emergency buffer accordingly.`,
              portfolioVol > 18 ? 'Volatility is on the higher side; a larger large-cap or hybrid sleeve would smooth the ride.' : 'Volatility sits in a comfortable band for a long-horizon growth investor.',
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[#374151] leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#4f46e5' }} />
                {t}
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-[#6B7280] mt-3 pt-3 border-t border-[#E0E3E8]">
            Generic research, not personalised advice. SEBI RA regulations apply.
          </p>
        </div>
      </AnimatedBorderCard>
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
                  <th key={h} className={`text-left text-[11px] font-semibold ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} uppercase tracking-wide px-4 py-3 whitespace-nowrap`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fundsWithRisk.map((f, i) => {
                const labelIdx = getRiskLabelIdx(f.riskLabel)
                const color = RISK3_COLORS[labelIdx] ?? '#f59e0b'
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
                <p className={`text-[10px] font-semibold uppercase tracking-wide ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} mb-2`}>{s.scenario}</p>
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

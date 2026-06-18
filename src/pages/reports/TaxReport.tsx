import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Receipt as ReceiptIcon,
  DownloadSimple as DownloadIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  LightbulbFilament as BulbIcon,
  ArrowRight as ArrowRightIcon,
} from '@phosphor-icons/react'
import { PlanGate } from '../../components/ui/PlanGate'
import { ProTrialBanner } from '../../components/ui/ProTrialBanner'
import { useUIStore } from '../../stores/uiStore'
import { usePlan } from '../../hooks/usePlan'

// ── Mock data ──────────────────────────────────────────────────────────────────

const FUND_TAX = [
  {
    name: 'Mirae Asset Large Cap Fund',
    avgHold: '3y 2m',
    gain: 142000,
    holdingMonths: 38,
    taxType: 'LTCG',
    taxRate: 12.5,
    taxOutgo: 5250,
    fundId: 'f001',
  },
  {
    name: 'Parag Parikh Flexi Cap Fund',
    avgHold: '2y 5m',
    gain: 163000,
    holdingMonths: 29,
    taxType: 'LTCG',
    taxRate: 12.5,
    taxOutgo: 7875,
    fundId: 'f002',
  },
  {
    name: 'SBI Bluechip Fund',
    avgHold: '1y 10m',
    gain: 61200,
    holdingMonths: 22,
    taxType: 'LTCG',
    taxRate: 12.5,
    taxOutgo: 0,
    fundId: 'f003',
    freeLimit: true,
  },
  {
    name: 'Nippon India Small Cap Fund',
    avgHold: '8m',
    gain: 18000,
    holdingMonths: 8,
    taxType: 'STCG',
    taxRate: 20,
    taxOutgo: 3600,
    fundId: 'f006',
  },
]

const TOTAL_UNREALISED = 384200
const STCG_GAIN = 18000
const LTCG_TOTAL = 366200
const LTCG_FREE_LIMIT = 100000
const NET_LTCG_TAXABLE = LTCG_TOTAL - LTCG_FREE_LIMIT
const LTCG_TAX = Math.round(NET_LTCG_TAXABLE * 0.125)
const STCG_TAX = Math.round(STCG_GAIN * 0.20)
const TOTAL_TAX = LTCG_TAX + STCG_TAX
const ELSS_MISSING_SAVING = 46800
const ELSS_80C_REMAINING = 90000

const WATERFALL = [
  { label: 'Total unrealised gain', value: TOTAL_UNREALISED, type: 'total', subtotal: TOTAL_UNREALISED },
  { label: 'STCG (Nippon — <12m)', value: -STCG_GAIN, type: 'deduct', subtotal: LTCG_TOTAL },
  { label: 'LTCG subtotal', value: null, type: 'subtotal', subtotal: LTCG_TOTAL },
  { label: 'LTCG free limit (Budget 24)', value: -LTCG_FREE_LIMIT, type: 'save', subtotal: NET_LTCG_TAXABLE },
  { label: 'Net LTCG taxable', value: null, type: 'subtotal', subtotal: NET_LTCG_TAXABLE },
  { label: `LTCG tax @12.5%`, value: -LTCG_TAX, type: 'tax', subtotal: null },
  { label: `STCG tax @20%`, value: -STCG_TAX, type: 'tax', subtotal: null },
  { label: 'Total tax owed', value: TOTAL_TAX, type: 'result', subtotal: TOTAL_TAX },
]

function formatINR(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
  return `₹${n.toLocaleString('en-IN')}`
}

export function TaxReport() {
  const navigate = useNavigate()
  const lm = useUIStore((s) => s.lightMode)
  const { can } = usePlan()
  const isPro = can('pro')

  const [harvestAmount, setHarvestAmount] = useState(0)
  const harvestTaxSaved = Math.round(Math.min(harvestAmount, LTCG_FREE_LIMIT) * 0.125)

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#64748b]'
  const dividerColor = lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'
  const rowHover = lm ? 'hover:bg-[#F9F9FF]' : 'hover:bg-[#0f1420]'

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${card} flex items-center justify-center`}>
            <ReceiptIcon size={18} color={lm ? '#4f46e5' : '#d6fd70'} weight="duotone" />
          </div>
          <div>
            <h1 className={`text-lg font-bold ${text}`}>Tax Optimisation & Efficiency</h1>
            <p className={`text-xs ${textMuted}`}>FY 2025–26 · LTCG + STCG + 80C analysis</p>
          </div>
        </div>
        <PlanGate requiredTier="pro" compact>
          <button className={`flex items-center gap-1.5 ${lm ? 'bg-white border-[#E0E3E8] text-[#6B7280] hover:text-[#111827]' : 'bg-[#14171c] border-[#1e2838] text-[#8390a2] hover:text-white'} border hover:border-[#4f46e5] rounded-xl px-3 py-2 text-sm transition-all`}>
            <DownloadIcon size={14} weight="regular" />
            Download PDF
          </button>
        </PlanGate>
      </div>

      {/* ── Key stat cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total unrealised gain',
            value: formatINR(TOTAL_UNREALISED),
            sub: 'Across all 4 funds',
            color: lm ? 'text-[#111827]' : 'text-white',
            icon: null,
          },
          {
            label: 'Tax payable if redeemed',
            value: formatINR(TOTAL_TAX),
            sub: 'LTCG + STCG combined',
            color: 'text-[#ef4444]',
            icon: <WarningIcon size={14} color="#ef4444" weight="duotone" />,
          },
          {
            label: 'Tax saved via harvesting',
            value: formatINR(LTCG_FREE_LIMIT * 0.125),
            sub: 'LTCG free limit unused',
            color: 'text-[#22c55e]',
            icon: <CheckCircleIcon size={14} color="#22c55e" weight="duotone" />,
          },
          {
            label: 'ELSS tax saving (80C)',
            value: '₹0',
            sub: 'No ELSS in portfolio',
            color: lm ? 'text-[#9CA3AF]' : 'text-[#64748b]',
            icon: <InfoIcon size={14} color={lm ? '#9CA3AF' : '#64748b'} weight="duotone" />,
          },
        ].map((s) => (
          <div key={s.label} className={`${card} rounded-xl p-4`}>
            <div className="flex items-center gap-1.5 mb-2">
              {s.icon}
              <p className={`text-[11px] font-medium ${textSub}`}>{s.label}</p>
            </div>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className={`text-[10px] mt-0.5 ${textMuted}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Fund-level breakdown ── */}
      <div className={`${card} rounded-2xl overflow-hidden`}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: lm ? '#E0E3E8' : '#1e2838' }}>
          <p className={`text-sm font-bold ${text}`}>TAX BREAKDOWN — FUND LEVEL</p>
          <p className={`text-xs ${textMuted}`}>Based on current NAV vs your average cost</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${dividerColor} ${lm ? 'bg-[#F9F9FF]' : 'bg-[#0f1420]'}`}>
              {['Fund', 'Gain', 'Holding', 'Tax type', 'Tax outgo'].map(h => (
                <th key={h} className={`text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#374151]`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FUND_TAX.map((f, _i) => (
              <tr
                key={f.fundId}
                className={`border-b ${dividerColor} ${rowHover} cursor-pointer transition-colors`}
                onClick={() => navigate(`/mutual-funds/search/${f.fundId}`)}
              >
                <td className="px-5 py-3.5">
                  <p className={`text-sm font-semibold ${text}`}>{f.name}</p>
                  <p className={`text-xs ${textMuted}`}>Avg hold: {f.avgHold}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p className={`text-sm font-semibold ${f.gain >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                    +{formatINR(f.gain)}
                  </p>
                </td>
                <td className="px-5 py-3.5">
                  <p className={`text-sm ${textSub}`}>{f.avgHold}</p>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={f.taxType === 'LTCG'
                      ? { background: 'rgba(79,70,229,0.12)', color: '#4f46e5' }
                      : { background: 'rgba(239,68,68,0.12)', color: '#ef4444' }
                    }
                  >
                    {f.taxType} {f.taxRate}%
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  {f.freeLimit ? (
                    <span className="text-sm font-bold text-[#22c55e]">Nil</span>
                  ) : (
                    <p className={`text-sm font-semibold ${f.taxType === 'STCG' ? 'text-[#ef4444]' : text}`}>
                      {formatINR(f.taxOutgo)}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={`${lm ? 'bg-[#F3F4F6]' : 'bg-[#0f1420]'}`}>
              <td className={`px-5 py-3 text-sm font-bold ${text}`}>Total</td>
              <td className="px-5 py-3">
                <p className="text-sm font-bold text-[#22c55e]">+{formatINR(TOTAL_UNREALISED)}</p>
              </td>
              <td colSpan={2} />
              <td className="px-5 py-3">
                <p className="text-sm font-bold text-[#ef4444]">{formatINR(TOTAL_TAX)}</p>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── Tax waterfall ── */}
      <div className={`${card} rounded-2xl p-5`}>
        <p className={`text-sm font-bold ${text} mb-1`}>HOW YOUR TAX IS CALCULATED — FY 2025–26</p>
        <p className={`text-xs ${textMuted} mb-5`}>Waterfall from total gains to actual tax owed</p>

        <div className="space-y-2.5">
          {WATERFALL.map((row, i) => {
            const isSubtotal = row.type === 'subtotal'
            const isResult = row.type === 'result'
            const isSave = row.type === 'save'
            const isDeduct = row.type === 'deduct'
            const isTax = row.type === 'tax'
            const maxVal = TOTAL_UNREALISED

            const barWidth = row.subtotal ? Math.max(8, (row.subtotal / maxVal) * 100) : 0
            const deductWidth = row.value && row.value < 0 ? Math.max(4, (Math.abs(row.value) / maxVal) * 100) : 0

            if (isSubtotal) {
              return (
                <div key={i} className={`flex items-center gap-3 py-1.5 border-t border-b ${dividerColor}`}>
                  <p className={`text-xs font-bold w-52 flex-shrink-0 ${text}`}>{row.label}</p>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: lm ? '#F3F4F6' : '#1e2838' }}>
                      <div className="h-full rounded-full bg-[#4f46e5]" style={{ width: `${barWidth}%` }} />
                    </div>
                    <span className={`text-sm font-bold w-28 text-right ${text}`}>= {formatINR(row.subtotal!)}</span>
                  </div>
                </div>
              )
            }

            if (isResult) {
              return (
                <div key={i} className={`flex items-center gap-3 py-2.5 rounded-xl px-3 ${lm ? 'bg-[#FEF2F2] border border-[#FCA5A5]' : 'bg-[#2d0b0b] border border-[#ef4444]/30'}`}>
                  <p className="text-sm font-bold text-[#ef4444] w-52 flex-shrink-0">{row.label}</p>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: lm ? '#FECACA' : '#3d1515' }}>
                      <div className="h-full rounded-full bg-[#ef4444]" style={{ width: `${(row.value! / maxVal) * 100}%` }} />
                    </div>
                    <span className="text-base font-black text-[#ef4444] w-28 text-right">= {formatINR(row.value!)}</span>
                  </div>
                </div>
              )
            }

            return (
              <div key={i} className="flex items-center gap-3">
                <p className={`text-xs font-medium w-52 flex-shrink-0 ${isDeduct || isTax ? 'text-[#ef4444]' : isSave ? 'text-[#22c55e]' : textSub}`}>
                  {row.label}
                </p>
                <div className="flex-1 flex items-center gap-3">
                  {row.value !== null && (
                    <>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: lm ? '#F3F4F6' : '#1e2838' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${deductWidth}%`,
                            background: isDeduct || isTax ? '#ef4444' : isSave ? '#22c55e' : '#4f46e5',
                          }}
                        />
                      </div>
                      <span className={`text-xs font-semibold w-28 text-right ${isDeduct || isTax ? 'text-[#ef4444]' : isSave ? 'text-[#22c55e]' : textSub}`}>
                        {row.value < 0 ? '-' : '+'}{formatINR(Math.abs(row.value))}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Tax harvesting opportunity ── */}
      <PlanGate requiredTier="pro" label="Tax Harvesting Analysis">
        <div className="space-y-4">
          {/* Harvesting banner */}
          <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)', border: '1px solid rgba(110,231,183,0.3)' }}>
            <div className="flex items-start gap-3">
              <BulbIcon size={20} color="#6ee7b7" weight="duotone" className="flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold text-white mb-1">
                  You can book ₹1,00,000 in LTCG completely tax-free before March 31.
                </p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.72)' }}>
                  Redeem and immediately reinvest — this resets your cost basis without triggering any tax,
                  saving you {formatINR(LTCG_FREE_LIMIT * 0.125)} in future LTCG liability.
                </p>
              </div>
            </div>
          </div>

          {/* Free limit tracker */}
          <div className={`${card} rounded-2xl p-5`}>
            <p className={`text-sm font-bold ${text} mb-1`}>LTCG free limit usage this FY (₹1,00,000 total)</p>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className={textMuted}>₹0 used so far this FY</span>
              <span className={textMuted}>₹1,00,000 limit</span>
            </div>
            <div className="h-2 rounded-full mb-5" style={{ background: lm ? '#F3F4F6' : '#1e2838' }}>
              <div className="h-full rounded-full bg-[#22c55e]" style={{ width: '0%' }} />
            </div>

            <p className={`text-xs font-semibold ${textSub} mb-3`}>Harvest from these funds (LTCG eligible only)</p>
            <div className="space-y-2.5 mb-5">
              {FUND_TAX.filter(f => f.taxType === 'LTCG').map(f => {
                const harvestPct = Math.min(100, (Math.min(f.gain, LTCG_FREE_LIMIT) / LTCG_FREE_LIMIT) * 100)
                return (
                  <div key={f.fundId}>
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-xs font-medium ${text}`}>{f.name}</p>
                      <p className={`text-[10px] ${textMuted}`}>LTCG: {formatINR(f.gain)} · {f.avgHold} held</p>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: lm ? '#F3F4F6' : '#1e2838' }}>
                      <div className="h-full rounded-full bg-[#4f46e5]" style={{ width: `${harvestPct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Harvest slider */}
            <p className={`text-xs font-semibold ${textSub} mb-2`}>Simulate harvest amount</p>
            <div className="flex items-center gap-4 mb-1">
              <input
                type="range"
                min={0}
                max={LTCG_FREE_LIMIT}
                step={5000}
                value={harvestAmount}
                onChange={e => setHarvestAmount(Number(e.target.value))}
                className="flex-1 accent-[#4f46e5]"
              />
              <span className={`text-sm font-bold w-24 text-right ${text}`}>{formatINR(harvestAmount)}</span>
            </div>
            <p className={`text-xs ${textMuted}`}>
              Move the slider to see how much tax you can eliminate.{' '}
              {harvestAmount > 0 && (
                <span className="text-[#22c55e] font-semibold">
                  Harvesting {formatINR(harvestAmount)} saves {formatINR(harvestTaxSaved)} in LTCG tax.
                </span>
              )}
            </p>
          </div>
        </div>
      </PlanGate>

      {/* ── ELSS gap analysis ── */}
      <div className={`${card} rounded-2xl p-5`}>
        <div className="flex items-start gap-2 mb-4">
          <WarningIcon size={16} color="#f59e0b" weight="duotone" className="flex-shrink-0 mt-0.5" />
          <div>
            <p className={`text-sm font-bold ${text}`}>ELSS — MISSING {formatINR(ELSS_MISSING_SAVING)} IN TAX SAVINGS</p>
          </div>
        </div>

        <div className="rounded-xl p-4 mb-4" style={{ background: lm ? '#EFF6FF' : 'rgba(59,130,246,0.08)', border: `1px solid ${lm ? '#BFDBFE' : 'rgba(59,130,246,0.2)'}` }}>
          <div className="flex items-start gap-2">
            <InfoIcon size={14} color="#3b82f6" weight="duotone" className="flex-shrink-0 mt-0.5" />
            <p className="text-xs" style={{ color: lm ? '#1d4ed8' : '#93c5fd' }}>
              <strong>You have no ELSS fund.</strong> Investing ₹1,50,000 in an ELSS fund qualifies for Section 80C
              deduction. At 30% tax bracket this saves ₹{(150000 * 0.3).toLocaleString('en-IN')} in income tax — with
              only a 3-year lock-in, the shortest of all 80C instruments.
            </p>
          </div>
        </div>

        <p className={`text-xs font-semibold ${textSub} mb-2`}>80C utilisation this year</p>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className={textMuted}>₹60,000 used (PPF + EPF)</span>
          <span className={textMuted}>₹1,50,000 limit · ₹{ELSS_80C_REMAINING.toLocaleString('en-IN')} remaining</span>
        </div>
        <div className="h-2 rounded-full mb-4" style={{ background: lm ? '#F3F4F6' : '#1e2838' }}>
          <div className="h-full rounded-full bg-[#4f46e5]" style={{ width: '40%' }} />
        </div>

        <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <WarningIcon size={14} color="#f59e0b" weight="duotone" className="flex-shrink-0" />
          <p className="text-xs" style={{ color: lm ? '#b45309' : '#fcd34d' }}>
            <strong>Deadline: March 31.</strong> ELSS investments must be made before FY end to count for this year's
            80C. At current markets there are ~{Math.round((new Date('2026-03-31').getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))} months left.
          </p>
        </div>

        <button
          onClick={() => navigate('/mutual-funds/explore')}
          className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#4f46e5] hover:underline transition-colors"
        >
          Browse ELSS funds <ArrowRightIcon size={13} weight="bold" />
        </button>
      </div>

      {/* ── STCG alert ── */}
      <div className="rounded-2xl p-4" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }}>
        <p className={`text-xs font-bold uppercase tracking-wider mb-2`} style={{ color: '#ef4444' }}>STCG ALERT</p>
        <div className="flex items-start gap-2">
          <WarningIcon size={14} color="#ef4444" weight="duotone" className="flex-shrink-0 mt-0.5" />
          <p className="text-xs" style={{ color: lm ? '#7f1d1d' : '#fca5a5' }}>
            <strong>Nippon India Small Cap has ₹18,000 in STCG</strong> (held less than 12 months) — ₹3,600 tax at
            20% flat. Avoid redeeming this fund until it crosses the 12-month mark to convert STCG into tax-efficient
            LTCG. <strong>4 more months to go.</strong>
          </p>
        </div>
      </div>

      {/* ── Sahi Research note ── */}
      <div className={`${card} rounded-2xl p-5`}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: lm ? '#EEF2FF' : 'rgba(214,253,112,0.1)' }}>
            <BulbIcon size={16} color={lm ? '#4f46e5' : '#d6fd70'} weight="duotone" />
          </div>
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'}`}>Sahi Tax Strategy</p>
            <p className={`text-sm font-semibold ${text} mb-1`}>Your portfolio is tax-efficient, but can be smarter</p>
            <p className={`text-xs leading-relaxed ${textSub}`}>
              With ₹1L LTCG free limit unused, harvesting from Mirae or Parag Parikh before March saves ₹12,500 in
              future tax. Adding an ELSS fund saves an additional ₹{(ELSS_80C_REMAINING * 0.3).toLocaleString('en-IN')}
              in income tax this year. Combined annual tax saving opportunity: <strong>₹{(12500 + ELSS_80C_REMAINING * 0.3).toLocaleString('en-IN')}</strong>.
            </p>
          </div>
        </div>
      </div>

      {!isPro && <ProTrialBanner />}

      {/* Legal disclaimer */}
      <p className={`text-[10px] ${textMuted} text-center`}>
        Tax computations shown are estimates based on current NAV and holding data. Consult a qualified CA before acting.
        SahiMF is a SEBI-registered Research Analyst — not a tax adviser.
      </p>
    </div>
  )
}

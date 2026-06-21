import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingBag as BasketIcon, House as HouseIcon, GraduationCap as EducationIcon,
  Car as CarIcon, Heartbeat as RetirementIcon, Airplane as TravelIcon,
  ArrowRight as ArrowRightIcon, Info as InfoIcon, X as CloseIcon,
  CheckCircle as CheckCircleIcon, Lock as LockIcon, Sparkle as SparkleIcon,
  Target as TargetIcon,
} from '@phosphor-icons/react'
import { useUIStore } from '../../stores/uiStore'
import { useAuthStore } from '../../stores/authStore'
import { usePlan } from '../../hooks/usePlan'
import { ProButton } from '../../components/ui/ProButton'

interface Basket {
  id: string
  name: string
  goal: string
  icon: React.ReactNode
  iconColor: string
  iconBg: string
  horizon: string
  minSIP: number
  funds: number
  cagr: string
  riskLevel: 'Low' | 'Moderate' | 'High'
  description: string
  fundNames: string[]
  methodology: string
  tier: 'free' | 'pro'
  featured?: boolean
}

const BASKETS: Basket[] = [
  {
    id: 'home-dream',
    name: 'Dream Home',
    goal: 'Buy your first home',
    icon: <HouseIcon size={22} weight="fill" />,
    iconColor: '#4f46e5',
    iconBg: '#eeedfd',
    horizon: '7—10 years',
    minSIP: 5000,
    funds: 4,
    cagr: '13—16%',
    riskLevel: 'Moderate',
    description: 'A balanced mix of large-cap and hybrid funds to grow a down-payment corpus with controlled volatility.',
    fundNames: ['Mirae Asset Large Cap', 'HDFC Mid-Cap Opportunities', 'ICICI Prudential BAF', 'Parag Parikh Flexi Cap'],
    methodology: 'Dynamically rebalanced quarterly. 60% equity (large + flexi cap), 30% hybrid (BAF for auto equity-debt balancing), 10% short-duration debt. Designed to grow steadily without sharp drawdowns close to your goal date.',
    tier: 'free',
    featured: true,
  },
  {
    id: 'child-education',
    name: "Child's Education",
    goal: 'Fund higher education abroad or India',
    icon: <EducationIcon size={22} weight="fill" />,
    iconColor: '#0891b2',
    iconBg: '#e0f2fe',
    horizon: '10—15 years',
    minSIP: 3000,
    funds: 5,
    cagr: '14—17%',
    riskLevel: 'Moderate',
    description: 'Long-horizon multi-cap strategy with a gradual de-risking glide path as the goal date approaches.',
    fundNames: ['PPFAS Flexi Cap', 'HDFC Mid-Cap', 'Axis Bluechip', 'SBI Small Cap', 'Kotak Gilt'],
    methodology: 'Starts equity-heavy (80%) in years 1—8, then automatically shifts toward debt and balanced funds in years 9—15. International allocation via PPFAS provides INR hedging against tuition cost inflation abroad.',
    tier: 'free',
  },
  {
    id: 'retirement',
    name: 'Retirement Corpus',
    goal: 'Build financial independence',
    icon: <RetirementIcon size={22} weight="fill" />,
    iconColor: '#16a34a',
    iconBg: '#dcfce7',
    horizon: '20—30 years',
    minSIP: 10000,
    funds: 6,
    cagr: '15—18%',
    riskLevel: 'High',
    description: 'Aggressive long-term wealth builder using proven multi-cap and small-cap compounders.',
    fundNames: ['PPFAS Flexi Cap', 'SBI Small Cap', 'HDFC Mid-Cap', 'Mirae Asset Large Cap', 'DSP Natural Resources', 'Axis Bluechip'],
    methodology: 'Equity-only for the first 20 years to maximise compounding. Includes a 15% small-cap allocation for asymmetric upside. Kotak Gilt added in year 20+ for capital preservation. NPS-friendly rebalancing calendar included for PRO users.',
    tier: 'pro',
    featured: true,
  },
  {
    id: 'car',
    name: 'New Car',
    goal: 'Buy your dream car in 3—5 years',
    icon: <CarIcon size={22} weight="fill" />,
    iconColor: '#ea580c',
    iconBg: '#ffedd5',
    horizon: '3—5 years',
    minSIP: 8000,
    funds: 3,
    cagr: '11—13%',
    riskLevel: 'Low',
    description: 'Conservative short-to-medium term strategy with flexi-cap and hybrid allocation.',
    fundNames: ['ICICI Prudential BAF', 'Axis Bluechip', 'Kotak Gilt'],
    methodology: 'Capital preservation focus. 50% Balanced Advantage Fund for downside protection, 30% Large Cap for steady growth, 20% Gilt for liquidity and low correlation to equity.',
    tier: 'free',
  },
  {
    id: 'travel',
    name: 'Dream Vacation',
    goal: 'Europe trip, Bali, or world tour',
    icon: <TravelIcon size={22} weight="fill" />,
    iconColor: '#7c3aed',
    iconBg: '#f5f3ff',
    horizon: '1—3 years',
    minSIP: 2000,
    funds: 2,
    cagr: '8—11%',
    riskLevel: 'Low',
    description: 'Short-term goal basket with liquid and ultra-short debt to protect capital.',
    fundNames: ['ICICI Prudential BAF', 'Kotak Gilt'],
    methodology: 'Pure capital preservation. 70% liquid/ultra-short debt + 30% BAF for mild upside. Goal corpus locked 6 months before target date.',
    tier: 'free',
  },
  {
    id: 'alpha-wealth',
    name: 'Alpha Wealth Builder',
    goal: 'Beat Nifty 50 by 5%+ consistently',
    icon: <SparkleIcon size={22} weight="fill" />,
    iconColor: '#d6fd70',
    iconBg: 'rgba(214,253,112,0.15)',
    horizon: '5+ years',
    minSIP: 15000,
    funds: 5,
    cagr: '17—22%',
    riskLevel: 'High',
    description: 'Curated high-conviction basket built to deliver meaningful alpha over index funds.',
    fundNames: ['PPFAS Flexi Cap', 'HDFC Mid-Cap', 'SBI Small Cap', 'DSP Natural Resources', 'Mirae Asset Large Cap'],
    methodology: "Sahi's proprietary alpha-scoring model selects funds based on 5-factor scoring: manager tenure, rolling alpha, drawdown recovery, AUM momentum, and expense efficiency. Rebalanced monthly. PRO-exclusive with Sahi Score tracking.",
    tier: 'pro',
    featured: true,
  },
]

// Light-theme readable risk pills (darker text + solid soft bg)
const RISK_PILL: Record<string, { bg: string; text: string }> = {
  Low: { bg: '#dcfce7', text: '#15803d' },
  Moderate: { bg: '#fef3c7', text: '#b45309' },
  High: { bg: '#fee2e2', text: '#b91c1c' },
}

export function Baskets() {
  const navigate = useNavigate()
  const lm = useUIStore((s) => s.lightMode)
  const { user } = useAuthStore()
  const { can } = usePlan()
  const isPro = can('pro')

  const [selectedBasket, setSelectedBasket] = useState<Basket | null>(null)
  const [showMethodology, setShowMethodology] = useState(false)

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#6B7280]' : 'text-[#64748b]'
  const divider = lm ? '#E0E3E8' : '#1e2838'

  // User's tracked baskets (Rohit has invested)
  const trackedBaskets = user?.plan === 'pro' ? [BASKETS[0], BASKETS[2]] : []

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Methodology modal */}
      {showMethodology && selectedBasket && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowMethodology(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl p-6 space-y-4"
            style={{ background: lm ? '#fff' : '#14171c', border: `1px solid ${divider}`, maxHeight: '80vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: selectedBasket.iconBg, color: selectedBasket.iconColor }}>
                  {selectedBasket.icon}
                </div>
                <div>
                  <h2 className={`text-sm font-bold ${text}`}>{selectedBasket.name} — Methodology</h2>
                  <p className={`text-xs ${textMuted}`}>{selectedBasket.horizon} · {selectedBasket.funds} funds</p>
                </div>
              </div>
              <button onClick={() => setShowMethodology(false)}><CloseIcon size={18} weight="bold" color={lm ? '#9CA3AF' : '#64748b'} /></button>
            </div>
            <div>
              <p className={`text-xs font-semibold ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} uppercase tracking-wider mb-2`}>Fund Composition</p>
              <div className="space-y-1.5">
                {selectedBasket.fundNames.map((fn, i) => (
                  <div key={fn} className="flex items-center gap-2">
                    <CheckCircleIcon size={13} color="#22c55e" weight="fill" />
                    <span className={`text-xs ${text}`}>{fn}</span>
                    {i === 0 && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${lm ? 'bg-[#4f46e5]/10 text-[#4f46e5]' : 'bg-[#d6fd70]/10 text-[#d6fd70]'}`}>Anchor</span>}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className={`text-xs font-semibold ${lm ? 'text-[#111827]' : 'text-[#cbd5e1]'} uppercase tracking-wider mb-2`}>How it works</p>
              <p className={`text-xs leading-relaxed ${textSub}`}>{selectedBasket.methodology}</p>
            </div>
            <p className={`text-[10px] ${textMuted}`}>Past CAGR range is for illustrative purposes only. Not a guarantee of returns. SEBI Registered Research Analyst.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${lm ? 'bg-[#4f46e5]/10' : 'bg-[#d6fd70]/10'}`}>
            <BasketIcon size={20} color={lm ? '#6366f1' : '#d6fd70'} weight="fill" />
          </div>
          <div>
            <h1 className={`text-lg font-bold ${text}`}>Sahi Baskets</h1>
            <p className={`text-xs ${textMuted}`}>Goal-based fund baskets — curated by the SahiMF research team</p>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
          style={{ background: lm ? '#eeedfd' : 'rgba(79,70,229,0.1)', color: '#6366f1' }}
          onClick={() => selectedBasket && setShowMethodology(true)}
        >
          <InfoIcon size={13} weight="fill" />
          How baskets work
        </div>
      </div>

      {/* Active goal trackers — PRO users / empty CTA for free */}
      {trackedBaskets.length === 0 && !isPro && (
        <div className="rounded-2xl p-6 flex items-center gap-5" style={{ background: 'linear-gradient(135deg, #f5f0ff 0%, #eee8ff 100%)', border: '1px solid #d4c5ff' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #8c34ee, #4f46e5)', boxShadow: '0 4px 16px rgba(140,52,238,0.3)' }}>
            <TargetIcon size={22} color="#d6fd70" weight="fill" />
          </div>
          <div className="flex-1">
            <p className="text-base font-black text-[#1e0845] mb-0.5">Set your first goal</p>
            <p className="text-xs text-[#5b3f8a] leading-relaxed">
              You have no active goals yet. Add a Sahi Basket to your portfolio, set a target, and watch your progress — retirement, education, home or any goal.
            </p>
          </div>
          <ProButton label="Upgrade to PRO" className="flex-shrink-0" onClick={() => navigate('/pricing')} />
        </div>
      )}
      {trackedBaskets.length > 0 && (
        <div>
          <p className={`text-sm font-semibold ${text} mb-3`}>Your Active Goals</p>
          <div className="grid grid-cols-2 gap-4">
            {trackedBaskets.map((b, idx) => {
              const progress = idx === 0 ? 34 : 67
              const targetCorpus = idx === 0 ? 4500000 : 25000000
              const currentCorpus = Math.round(targetCorpus * progress / 100)
              return (
                <div key={b.id} className={`${card} rounded-2xl p-5`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: b.iconBg, color: b.iconColor }}>
                        {b.icon}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${text}`}>{b.name}</p>
                        <p className={`text-[10px] ${textMuted}`}>{b.goal}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full`} style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>Active</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className={textMuted}>Goal progress</span>
                      <span className={`font-semibold ${text}`}>{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: lm ? '#F3F4F6' : '#1e2838' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: b.iconColor }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <p className={`text-[10px] ${textMuted}`}>Current Corpus</p>
                      <p className={`text-sm font-bold ${text}`}>₹{(currentCorpus / 100000).toFixed(1)}L</p>
                    </div>
                    <div>
                      <p className={`text-[10px] ${textMuted}`}>Target</p>
                      <p className={`text-sm font-bold ${text}`}>₹{(targetCorpus / 100000).toFixed(0)}L</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Basket grid */}
      <div>
        <p className={`text-sm font-semibold ${text} mb-3`}>All Baskets</p>
        <div className="grid grid-cols-3 gap-4">
          {BASKETS.map(basket => {
            const isLocked = basket.tier === 'pro' && !isPro
            return (
              <div
                key={basket.id}
                className={`group ${card} rounded-2xl p-5 transition-all duration-200 hover:border-[#4f46e5] hover:-translate-y-1 hover:shadow-xl cursor-pointer relative`}
                onClick={() => { setSelectedBasket(basket); if (!isLocked) setShowMethodology(true) }}
              >
                {isLocked && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>
                    <LockIcon size={9} weight="bold" /> PRO
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: basket.iconBg, color: basket.iconColor }}>
                    {basket.icon}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${text} transition-colors duration-200 group-hover:text-[#4f46e5]`}>{basket.name}</p>
                    <p className={`text-[10px] ${textMuted}`}>{basket.goal}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { label: 'Horizon', value: basket.horizon },
                    { label: 'Min SIP', value: `₹${basket.minSIP.toLocaleString('en-IN')}` },
                    { label: 'Hist. CAGR', value: basket.cagr },
                    { label: 'Funds', value: `${basket.funds} funds` },
                  ].map(s => (
                    <div key={s.label}>
                      <p className={`text-[9px] ${textMuted} mb-0.5`}>{s.label}</p>
                      <p className={`text-xs font-semibold ${text}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: divider }}>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: RISK_PILL[basket.riskLevel].bg, color: RISK_PILL[basket.riskLevel].text }}>
                    {basket.riskLevel} Risk
                  </span>
                  {isLocked ? (
                    <span onClick={e => e.stopPropagation()}>
                      <ProButton label="Upgrade to PRO" size="xs" onClick={() => navigate('/pricing')} />
                    </span>
                  ) : (
                    <button
                      className="flex items-center gap-1 text-xs font-semibold text-white bg-[#4f46e5] hover:bg-[#4338ca] px-3 py-1.5 rounded-lg transition-colors"
                      onClick={e => { e.stopPropagation(); setSelectedBasket(basket); setShowMethodology(true) }}
                    >
                      View Details <ArrowRightIcon size={11} weight="bold" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <p className={`text-[10px] ${textMuted} text-center`}>
        Sahi Baskets are curated by the SahiMF research team for educational and informational purposes only. They are not personalised investment recommendations. SEBI Registered Research Analyst. Past performance is not indicative of future returns.
      </p>
    </div>
  )
}

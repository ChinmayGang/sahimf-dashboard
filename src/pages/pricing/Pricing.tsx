import { useNavigate } from 'react-router-dom'
import { Check as CheckIcon, X as CloseIcon, Sparkle as SparkleIcon, ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react'
import { PremiumPlanCard } from '../../components/ui/PremiumPlanCard'
import { useAuthStore } from '../../stores/authStore'
import type { PlanTier } from '../../types'

const FEATURES = [
  { label: 'Overview Dashboard', free: true, pro: true, wealth: true },
  { label: 'My Portfolios', free: '1 portfolio', pro: 'Up to 5', wealth: 'Unlimited' },
  { label: 'Holdings Ledger', free: true, pro: true, wealth: true },
  { label: 'Transactions History', free: true, pro: true, wealth: true },
  { label: 'Search Schemes (list)', free: true, pro: true, wealth: true },
  { label: 'Scheme 3Y/5Y/MAX Returns', free: false, pro: true, wealth: true },
  { label: 'Explore Sahi Funds', free: 'Info only', pro: true, wealth: true },
  { label: 'Sahi Fund Holdings & Weights', free: false, pro: true, wealth: true },
  { label: 'Overlap Lens', free: false, pro: true, wealth: true },
  { label: 'Fund Comparison', free: false, pro: '3 funds', wealth: '4 funds' },
  { label: 'MF Scorecard & Sahi Score', free: 'Preview', pro: true, wealth: true },
  { label: 'Risk Analysis', free: false, pro: true, wealth: true },
  { label: 'Market Cap Allocation', free: false, pro: true, wealth: true },
  { label: 'SIP/Lumpsum Calculators', free: 'Basic SIP', pro: 'All tools', wealth: 'All tools' },
  { label: 'Tax Report (STCG/LTCG)', free: false, pro: true, wealth: true },
  { label: 'Sahi Research Notes', free: false, pro: true, wealth: true },
  { label: 'Sahi Baskets (Goal Baskets)', free: 'Free baskets', pro: 'All baskets', wealth: 'All baskets' },
  { label: 'Priority Support', free: false, pro: false, wealth: true },
  { label: 'Lifetime Access', free: false, pro: false, wealth: true },
]

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <CheckIcon size={16} weight="bold" color="#22c55e" />
  if (value === false) return <CloseIcon size={15} weight="bold" color="#D1D5DB" />
  return <span className="text-xs font-medium text-[#374151]">{value}</span>
}

export function Pricing() {
  const navigate = useNavigate()
  const setPlan = useAuthStore((s) => s.setPlan)
  const user = useAuthStore((s) => s.user)

  const goBack = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate('/mutual-funds')
  }

  const purchase = (plan: PlanTier) => {
    setPlan(plan)
    // Simulated purchase — return the user to where they came from
    goBack()
  }

  return (
    <div className="min-h-screen" style={{ background: '#F5F4FF' }}>
      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* Back */}
        <button
          onClick={goBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors mb-8"
        >
          <ArrowLeftIcon size={16} weight="bold" /> Back
        </button>

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#eeedfd] text-[#4f46e5] mb-4">
            <SparkleIcon size={11} weight="fill" />
            Sahi MF Plans
          </span>
          <h1 className="text-4xl font-black tracking-tight text-[#111827] mb-3">
            Choose what fits your journey
          </h1>
          <p className="text-base text-[#6B7280] max-w-lg mx-auto leading-relaxed">
            Start free. Upgrade only when you're ready. No hidden fees, no commissions — ever.
          </p>
          {user?.plan && user.plan !== 'free' && (
            <p className="mt-3 text-xs font-semibold text-[#4f46e5]">You're currently on Sahi {user.plan === 'pro' ? 'PRO' : 'Wealth'}.</p>
          )}
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14 items-stretch">
          {/* Free — light card. Structure mirrors PremiumPlanCard 1:1 (flex-col gap-4:
              header block → divider → features → CTA) so titles, prices, the breaker
              line and CTAs line up across all three columns (R2-2). */}
          <div className="bg-white rounded-2xl border border-[#E0E3E8] p-6 flex flex-col gap-4">
            {/* Header block — same internal spacing as the premium cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F3F4F6' }}>
                  <SparkleIcon size={20} color="#9CA3AF" weight="fill" />
                </div>
              </div>
              <span className="text-base font-bold text-[#111827]">Free</span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-black text-[#111827]">₹0</span>
                <span className="text-xs text-[#9CA3AF]">forever</span>
              </div>
              <p className="mt-2 text-xs text-[#6B7280] leading-relaxed min-h-[3.75rem]">
                Everything you need to start — research, fund search and a basic SIP calculator, free for life.
              </p>
            </div>

            <hr className="border-0 h-px w-full bg-[#F0F0F0]" />

            <ul className="flex flex-col gap-2.5 text-xs text-[#374151] flex-1">
              {['Overview dashboard', '1 portfolio', 'Fund search & scheme details', 'SIP calculator (basic)', 'Sahi Funds info view'].map(f => (
                <li key={f} className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#dcfce7] flex-shrink-0">
                    <CheckIcon size={11} color="#15803d" weight="bold" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => purchase('free')}
              className="mt-1 w-full py-2.5 rounded-full border border-[#E0E3E8] text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors"
            >
              {user?.plan === 'free' ? 'Current Plan' : 'Switch to Free'}
            </button>
          </div>

          {/* PRO — premium animated card */}
          <PremiumPlanCard
            title="Sahi PRO"
            price="₹1,999"
            priceSuffix="/yr"
            badge="Most Popular"
            paragraph="₹167/month billed annually. The full research desk — analytics, tools and all baskets."
            features={['Up to 5 portfolios', 'Deep fund analytics & Sahi Score', 'All tools — SIP, Lumpsum, SWP, STP', 'Risk & Overlap Analysis', 'Fund Comparison (3 funds)', 'All Sahi Research Notes & Baskets']}
            ctaLabel={user?.plan === 'pro' ? 'Current Plan' : 'Get Sahi PRO'}
            onCta={() => purchase('pro')}
            accent="#d6fd70"
            icon="sparkle"
          />

          {/* Wealth — premium animated card */}
          <PremiumPlanCard
            title="Sahi Wealth"
            price="₹3,999"
            priceSuffix="lifetime"
            paragraph="One-time payment, lifetime access. Everything in PRO plus unlimited scale and priority support."
            features={['Everything in Sahi PRO', 'Unlimited portfolios', 'Fund Comparison (4 funds)', 'Priority support', 'All future features — forever']}
            ctaLabel={user?.plan === 'wealth' ? 'Current Plan' : 'Get Sahi Wealth'}
            onCta={() => purchase('wealth')}
            accent="#f5b94d"
            icon="crown"
          />
        </div>

        {/* Feature comparison table — horizontal scroll on mobile */}
        <div className="overflow-x-auto mb-10">
        <div className="bg-white rounded-2xl border border-[#E0E3E8] overflow-hidden min-w-[520px]">
          <div className="grid grid-cols-4 border-b border-[#E0E3E8]">
            <div className="p-4 col-span-1">
              <p className="text-xs font-bold text-[#111827] uppercase tracking-wider">Features</p>
            </div>
            {[{ label: 'Free', color: '#6B7280' }, { label: 'PRO', color: '#4f46e5' }, { label: 'Wealth', color: '#ea580c' }].map(t => (
              <div key={t.label} className="p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: t.color }}>{t.label}</p>
              </div>
            ))}
          </div>
          {FEATURES.map((feature, i) => (
            <div
              key={feature.label}
              className={`grid grid-cols-4 border-b border-[#F3F4F6] last:border-0 ${i % 2 === 0 ? '' : 'bg-[#FAFAFA]'}`}
            >
              <div className="px-4 py-3 col-span-1">
                <p className="text-xs text-[#374151]">{feature.label}</p>
              </div>
              {([feature.free, feature.pro, feature.wealth] as Array<boolean | string>).map((val, j) => (
                <div key={j} className="px-4 py-3 flex items-center justify-center">
                  <Cell value={val} />
                </div>
              ))}
            </div>
          ))}
        </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-[#6B7280] max-w-xl mx-auto leading-relaxed">
          SahiMF is powered by Arqentis. All plans include our core promise: <span className="font-bold text-[#374151]">NO COMMISSION RECEIVED FROM ANY INDIAN MUTUAL FUND HOUSES, EVER.</span> SEBI Registered Research Analyst.
        </p>
      </div>
    </div>
  )
}

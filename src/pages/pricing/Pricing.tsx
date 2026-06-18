import { Check as CheckIcon, X as CloseIcon, Sparkle as SparkleIcon, Crown as CrownIcon, User as UserIcon } from '@phosphor-icons/react'
import { ProButton } from '../../components/ui/ProButton'

const FEATURES = [
  { label: 'Overview Dashboard', free: true, pro: true, elite: true },
  { label: 'My Portfolios', free: '1 portfolio', pro: 'Up to 5', elite: 'Unlimited' },
  { label: 'Holdings Ledger', free: true, pro: true, elite: true },
  { label: 'Transactions History', free: true, pro: true, elite: true },
  { label: 'Search Schemes (list)', free: true, pro: true, elite: true },
  { label: 'Scheme 3Y/5Y/MAX Returns', free: false, pro: true, elite: true },
  { label: 'Explore Sahi Funds', free: 'Info only', pro: true, elite: true },
  { label: 'Sahi Fund Holdings & Weights', free: false, pro: true, elite: true },
  { label: 'Overlap Lens', free: false, pro: true, elite: true },
  { label: 'Fund Comparison', free: false, pro: '3 funds', elite: '4 funds' },
  { label: 'MF Scorecard & Sahi Score', free: 'Preview', pro: true, elite: true },
  { label: 'Risk Analysis', free: false, pro: true, elite: true },
  { label: 'Market Cap Allocation', free: false, pro: true, elite: true },
  { label: 'SIP/Lumpsum Calculators', free: 'Basic SIP', pro: 'All tools', elite: 'All tools' },
  { label: 'Tax Report (STCG/LTCG)', free: false, pro: true, elite: true },
  { label: 'Sahi Research Notes', free: false, pro: true, elite: true },
  { label: 'Sahi Baskets (Goal Baskets)', free: 'Free baskets', pro: 'All baskets', elite: 'All baskets' },
  { label: 'Priority Support', free: false, pro: false, elite: true },
  { label: 'Lifetime Access', free: false, pro: false, elite: true },
]

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <CheckIcon size={16} weight="bold" color="#22c55e" />
  if (value === false) return <CloseIcon size={15} weight="bold" color="#D1D5DB" />
  return <span className="text-xs font-medium text-[#374151]">{value}</span>
}

export function Pricing() {
  return (
    <div className="min-h-screen" style={{ background: '#F5F4FF' }}>
      <div className="max-w-5xl mx-auto px-6 py-16">

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
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-3 gap-5 mb-14">
          {/* Free */}
          <div className="bg-white rounded-2xl border border-[#E0E3E8] p-6 flex flex-col">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#F3F4F6] mb-4">
              <UserIcon size={20} color="#6B7280" weight="duotone" />
            </div>
            <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">Free</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-black text-[#111827]">₹0</span>
            </div>
            <p className="text-xs text-[#9CA3AF] mb-6">Forever free</p>
            <button className="w-full py-2.5 rounded-xl border border-[#E0E3E8] text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors mb-6">
              Get Started Free
            </button>
            <ul className="space-y-3 text-xs text-[#374151]">
              {['Overview dashboard', '1 portfolio', 'Fund search & scheme details', 'SIP calculator (basic)', 'Sahi Funds info view'].map(f => (
                <li key={f} className="flex items-start gap-2">
                  <CheckIcon size={14} color="#22c55e" weight="bold" className="mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* PRO — featured */}
          <div
            className="rounded-2xl p-6 flex flex-col relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }}
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #d6fd70, transparent)' }} />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #8c34ee, transparent)' }} />
            <span className="absolute top-4 right-4 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#d6fd70] text-[#0a0c0e] tracking-wide">
              MOST POPULAR
            </span>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/15 mb-4">
              <SparkleIcon size={20} color="#d6fd70" weight="fill" />
            </div>
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Sahi PRO</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-black text-white">₹1,999</span>
              <span className="text-sm text-white/60 mb-1">/yr</span>
            </div>
            <p className="text-xs text-white/50 mb-6">₹167/month billed annually</p>
            <button
              className="w-full py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mb-6"
              style={{ background: '#d6fd70', color: '#0a0c0e' }}
            >
              <SparkleIcon size={14} weight="fill" />
              Get Sahi PRO
            </button>
            <ul className="space-y-3 text-xs text-white/90 relative">
              {['Everything in Free', 'Up to 5 portfolios', 'Deep fund analytics & Sahi Score', 'All tools — SIP, Lumpsum, SWP, STP', 'Risk & Overlap Analysis', 'Fund Comparison (3 funds)', 'Tax Report (STCG/LTCG)', 'All Sahi Research Notes', 'All Sahi Baskets'].map(f => (
                <li key={f} className="flex items-start gap-2">
                  <CheckIcon size={14} color="#d6fd70" weight="bold" className="mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Elite */}
          <div className="bg-white rounded-2xl border border-[#E0E3E8] p-6 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, #8c34ee, #4f46e5, #d6fd70)' }} />
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#FFF7ED] mb-4">
              <CrownIcon size={20} color="#ea580c" weight="duotone" />
            </div>
            <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">Sahi Elite</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-black text-[#111827]">₹3,999</span>
            </div>
            <p className="text-xs text-[#9CA3AF] mb-6">One-time payment · Lifetime access</p>
            <button className="w-full py-2.5 rounded-xl text-sm font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] transition-colors mb-6">
              Get Sahi Elite
            </button>
            <ul className="space-y-3 text-xs text-[#374151]">
              {['Everything in Sahi PRO', 'Unlimited portfolios', 'Fund Comparison (4 funds)', 'Priority support', 'All future features — included forever'].map(f => (
                <li key={f} className="flex items-start gap-2">
                  <CheckIcon size={14} color="#22c55e" weight="bold" className="mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feature comparison table */}
        <div className="bg-white rounded-2xl border border-[#E0E3E8] overflow-hidden mb-10">
          <div className="grid grid-cols-4 border-b border-[#E0E3E8]">
            <div className="p-4 col-span-1">
              <p className="text-xs font-bold text-[#374151] uppercase tracking-wider">Features</p>
            </div>
            {[{ label: 'Free', color: '#6B7280' }, { label: 'PRO', color: '#4f46e5' }, { label: 'Elite', color: '#ea580c' }].map(t => (
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
              {([feature.free, feature.pro, feature.elite] as Array<boolean | string>).map((val, j) => (
                <div key={j} className="px-4 py-3 flex items-center justify-center">
                  <Cell value={val} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-[#9CA3AF] max-w-xl mx-auto leading-relaxed">
          SahiMF is powered by Arqentis. All plans include our core promise: <span className="font-bold text-[#374151]">NO COMMISSION RECEIVED FROM ANY INDIAN MUTUAL FUND HOUSES, EVER.</span> SEBI RA: INH000009876.
        </p>
      </div>
    </div>
  )
}

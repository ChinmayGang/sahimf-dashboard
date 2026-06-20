import { Check as CheckIcon, Sparkle as SparkleIcon, Crown as CrownIcon } from '@phosphor-icons/react'
import { Sparkles } from './Sparkles'

export interface PremiumPlanCardProps {
  title: string
  price: string
  priceSuffix?: string
  paragraph: string
  features: string[]
  ctaLabel: string
  onCta?: () => void
  badge?: string
  icon?: 'sparkle' | 'crown'
  /** highlight ring tone for the check bullets */
  accent?: string
}

/**
 * Premium dark plan card with an animated rotating light-beam border.
 * Used on the pricing page and inside upgrade flows.
 */
export function PremiumPlanCard({
  title,
  price,
  priceSuffix,
  paragraph,
  features,
  ctaLabel,
  onCta,
  badge,
  icon = 'sparkle',
  accent = '#d6fd70',
}: PremiumPlanCardProps) {
  return (
    <div className="premium-plan-card w-full">
      {/* Sparkles emit from a glowing baseline at the bottom and rise + dissolve
          toward the top (z-0, behind the content). */}
      <div className="inset-0 rounded-2xl overflow-hidden" style={{ position: 'absolute', zIndex: 0 }}>
        {/* Bottom radial glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{ width: '140%', height: '55%', background: `radial-gradient(50% 60% at 50% 100%, ${accent}33 0%, transparent 72%)` }}
        />
        {/* Bright horizon line */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{ width: '70%', height: '1px', background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, boxShadow: `0 0 8px ${accent}` }}
        />
        {/* Rising particles, masked so they fade out as they reach the top */}
        <div
          className="absolute inset-0"
          style={{
            maskImage: 'linear-gradient(to top, #000 0%, #000 25%, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(to top, #000 0%, #000 25%, transparent 85%)',
          }}
        >
          <Sparkles
            className="absolute inset-0"
            color={accent}
            direction="top"
            density={120}
            size={1.4}
            minSize={0.5}
            speed={1.4}
            minSpeed={0.4}
            opacity={0.9}
            opacitySpeed={2}
          />
        </div>
      </div>

      {/* Title */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
            {icon === 'crown'
              ? <CrownIcon size={20} color={accent} weight="fill" />
              : <SparkleIcon size={20} color={accent} weight="fill" />}
          </div>
          {badge && (
            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: accent, color: '#0a0c0e' }}>
              {badge}
            </span>
          )}
        </div>
        <span className="text-base font-bold text-white">{title}</span>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-3xl font-black text-white">{price}</span>
          {priceSuffix && <span className="text-xs text-white/50">{priceSuffix}</span>}
        </div>
        <p className="mt-2 text-xs text-white/55 leading-relaxed min-h-[3.75rem]">{paragraph}</p>
      </div>

      <hr className="border-0 h-px w-full" style={{ background: 'rgba(255,255,255,0.12)' }} />

      {/* Features — flex-1 so the CTA pins to the bottom and lines up across cards */}
      <ul className="flex flex-col gap-2.5 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-4 h-4 rounded-full flex-shrink-0" style={{ background: accent }}>
              <CheckIcon size={11} weight="bold" color="#0a0c0e" />
            </span>
            <span className="text-xs text-white/90">{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={onCta}
        className="mt-1 w-full py-2.5 rounded-full text-sm font-bold text-white transition-all hover:brightness-110 active:scale-[0.98]"
        style={{
          backgroundImage: 'linear-gradient(0deg, #4f46e5 0%, #8c34ee 100%)',
          boxShadow: 'inset 0 -2px 25px -4px rgba(255,255,255,0.6)',
        }}
      >
        {ctaLabel}
      </button>
    </div>
  )
}

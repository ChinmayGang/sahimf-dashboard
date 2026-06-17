import { ArrowRight as ArrowRightIcon, Sparkle as SparkleIcon } from '@phosphor-icons/react'
import { useUIStore } from '../../stores/uiStore'

interface ProTrialBannerProps {
  headline?: string
  subtext?: string
  features?: string[]
}

export function ProTrialBanner({
  headline = 'Unlock the full picture with Sahi PRO',
  subtext = 'No credit card required · Cancel anytime',
  features = [],
}: ProTrialBannerProps) {
  const lm = useUIStore((s) => s.lightMode)

  return (
    <div
      className="rounded-2xl p-5 flex items-center justify-between gap-6"
      style={{
        background: lm
          ? 'linear-gradient(135deg, #eeedfd 0%, #f0f4ff 100%)'
          : 'linear-gradient(135deg, rgba(79,70,229,0.12) 0%, rgba(99,102,241,0.05) 100%)',
        border: lm ? '1px solid #c7d2fe' : '1px solid rgba(79,70,229,0.25)',
      }}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: lm ? '#4f46e5' : 'rgba(79,70,229,0.2)' }}
        >
          <SparkleIcon size={16} color={lm ? '#fff' : '#818cf8'} weight="duotone" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold mb-0.5" style={{ color: lm ? '#3730a3' : '#a5b4fc' }}>
            {headline}
          </p>
          {features.length > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-1">
              {features.map((f) => (
                <span key={f} className="text-[10px] font-medium" style={{ color: lm ? '#6366f1' : '#818cf8' }}>
                  ✓ {f}
                </span>
              ))}
            </div>
          )}
          <p className="text-[10px]" style={{ color: lm ? '#9CA3AF' : '#64748b' }}>{subtext}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          className="text-xs font-semibold px-4 py-2 rounded-full transition-colors"
          style={{ background: lm ? '#eeedfd' : 'rgba(99,102,241,0.15)', color: '#6366f1' }}
        >
          Try PRO — 14 days free
        </button>
        <button
          className="flex items-center gap-1.5 text-sm font-bold px-5 py-2 rounded-full transition-colors"
          style={{ background: '#d6fd70', color: '#000' }}
        >
          Upgrade Now <ArrowRightIcon size={13} weight="bold" />
        </button>
      </div>
    </div>
  )
}

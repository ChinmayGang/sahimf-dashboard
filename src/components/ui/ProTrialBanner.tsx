import { useState } from 'react'
import { Sparkle as SparkleIcon } from '@phosphor-icons/react'
import { useUIStore } from '../../stores/uiStore'
import { UpgradePopup } from './UpgradePopup'
import { ProButton } from './ProButton'

interface ProTrialBannerProps {
  headline?: string
  subtext?: string
  features?: string[]
  featureDesc?: string
}

export function ProTrialBanner({
  headline = 'Unlock the full picture with Sahi PRO',
  subtext = 'No credit card required · Cancel anytime',
  features = [],
  featureDesc,
}: ProTrialBannerProps) {
  const lm = useUIStore((s) => s.lightMode)
  const [showUpgrade, setShowUpgrade] = useState(false)

  return (
    <>
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
            <SparkleIcon size={16} color={lm ? '#fff' : '#818cf8'} weight="fill" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold mb-0.5" style={{ color: lm ? '#3730a3' : '#a5b4fc' }}>
              {headline}
            </p>
            {features.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-1">
                {features.map((f) => (
                  <span key={f} className="text-[10px] font-medium" style={{ color: lm ? '#6366f1' : '#818cf8' }}>
                    âœ" {f}
                  </span>
                ))}
              </div>
            )}
            <p className="text-[10px]" style={{ color: lm ? '#9CA3AF' : '#64748b' }}>{subtext}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowUpgrade(true)}
            className="text-xs font-semibold px-4 py-2 rounded-full transition-colors"
            style={{ background: lm ? '#eeedfd' : 'rgba(99,102,241,0.15)', color: '#6366f1' }}
          >
            See what's included
          </button>
          <ProButton label="Upgrade Now" size="sm" onClick={() => setShowUpgrade(true)} />
        </div>
      </div>

      <UpgradePopup
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        feature={headline}
        description={featureDesc}
      />
    </>
  )
}

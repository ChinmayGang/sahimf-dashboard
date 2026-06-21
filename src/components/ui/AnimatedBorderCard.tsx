import { Sparkle } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { useUIStore } from '../../stores/uiStore'

interface AnimatedBorderCardProps {
  children: ReactNode
  className?: string
  badge?: string | false
}

export function AnimatedBorderCard({ children, className = '', badge = 'SAHI RESEARCH' }: AnimatedBorderCardProps) {
  const lm = useUIStore((s) => s.lightMode)
  return (
    <div className={`sahi-research-border ${className}`}>
      <div className="relative z-[1] rounded-2xl overflow-hidden" style={{ background: lm ? '#ffffff' : '#14171c' }}>
        <div className="pt-4">
          {badge && (
            <div className="px-4 pb-3">
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: '#eeedfd', color: '#4f46e5' }}
              >
                <Sparkle size={10} weight="fill" />
                {badge}
              </span>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

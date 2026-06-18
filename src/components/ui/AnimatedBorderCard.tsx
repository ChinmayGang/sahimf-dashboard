import { Sparkle } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

interface AnimatedBorderCardProps {
  children: ReactNode
  className?: string
  badge?: string | false
}

/**
 * Highlight card for Sahi Research / Analysis content.
 * Uses a continuously rotating 4-colour conic-gradient border so these cards
 * are instantly distinguishable from regular light-bordered cards.
 */
export function AnimatedBorderCard({ children, className = '', badge = 'SAHI RESEARCH' }: AnimatedBorderCardProps) {
  return (
    <div className={`sahi-research-border ${className}`}>
      <div className="relative z-[1] rounded-2xl overflow-hidden bg-white">
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

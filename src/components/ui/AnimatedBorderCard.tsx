import { Sparkle } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

interface AnimatedBorderCardProps {
  children: ReactNode
  className?: string
  badge?: string | false
}

/**
 * Highlight card for Sahi Research / Analysis content.
 * The wrapper renders a continuously rotating 4-colour conic-gradient ring;
 * the inner white card sits on top (inset by the wrapper's 2px padding) so the
 * gradient reads as an animated border — instantly distinct from plain cards.
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

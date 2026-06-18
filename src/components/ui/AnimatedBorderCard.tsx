import { Sparkle } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

interface AnimatedBorderCardProps {
  children: ReactNode
  className?: string
  badge?: string | false
}

export function AnimatedBorderCard({ children, className = '', badge = 'SAHI RESEARCH' }: AnimatedBorderCardProps) {
  return (
    <div className={`relative rounded-2xl overflow-hidden bg-white border border-[#E0E3E8] ${className}`}>
      {/* Animated top rail */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background: 'linear-gradient(90deg, #8c34ee, #4f46e5, #d6fd70, #4f46e5, #8c34ee)',
          backgroundSize: '200% 100%',
          animation: 'shimmer-rail 3s linear infinite',
        }}
      />
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
  )
}

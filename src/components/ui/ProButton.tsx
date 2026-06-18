import { forwardRef, useState } from 'react'
import { Sparkle } from '@phosphor-icons/react'

interface ProButtonProps {
  label?: string
  onClick?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

/**
 * Brand PRO call-to-action. Single source of truth — all upgrade buttons use this
 * so visual changes propagate everywhere. Glow + press states baked in via .glow-btn.
 */
export const ProButton = forwardRef<HTMLButtonElement, ProButtonProps>(
  ({ label = 'Upgrade to PRO', onClick, className = '', size = 'md', disabled }, ref) => {
    const [clicked, setClicked] = useState(false)

    const sizeClasses: Record<string, string> = {
      sm: 'text-xs px-4 py-1.5 gap-1.5',
      md: 'text-sm px-5 py-2.5 gap-2',
      lg: 'text-base px-6 py-3 gap-2',
    }
    const iconSize = size === 'sm' ? 13 : size === 'lg' ? 18 : 15

    const handleClick = () => {
      setClicked(true)
      setTimeout(() => setClicked(false), 200)
      onClick?.()
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={handleClick}
        data-state={clicked ? 'clicked' : undefined}
        className={`glow-btn ${sizeClasses[size]} ${className}`}
      >
        <span className="flex items-center justify-center gap-1.5">
          {label}
          <Sparkle size={iconSize} weight="fill" />
        </span>
      </button>
    )
  }
)

ProButton.displayName = 'ProButton'

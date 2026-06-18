import { Sparkle } from '@phosphor-icons/react'

interface ProButtonProps {
  label?: string
  onClick?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ProButton({ label = 'Upgrade to PRO', onClick, className = '', size = 'md' }: ProButtonProps) {
  const sizeClasses: Record<string, string> = {
    sm: 'text-xs px-4 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2',
  }
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 15
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center rounded-full font-bold text-white transition-all hover:opacity-90 hover:scale-[1.03] active:scale-95 whitespace-nowrap ${sizeClasses[size]} ${className}`}
      style={{
        background: 'linear-gradient(135deg, #8c34ee 0%, #4f46e5 100%)',
        boxShadow: '0 4px 20px rgba(140,52,238,0.35)',
      }}
    >
      <Sparkle size={iconSize} weight="fill" />
      {label}
    </button>
  )
}

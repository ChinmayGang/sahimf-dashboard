import { type ReactNode, type ButtonHTMLAttributes } from 'react'
import { CircleNotch } from '@phosphor-icons/react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'brand'
type Size = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children: ReactNode
  fullWidth?: boolean
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    'bg-[#4f46e5] text-white border border-[#4f46e5] hover:bg-[#3730a3] hover:border-[#3730a3] focus-visible:ring-[#4f46e5]/30',
  secondary:
    'bg-transparent text-[#4f46e5] border border-[#4f46e5] hover:bg-[#4f46e5] hover:text-white focus-visible:ring-[#4f46e5]/30',
  ghost:
    'bg-transparent text-[#6B7280] border border-transparent hover:bg-[#F3F4F6] hover:text-[#111827] focus-visible:ring-[#6B7280]/20',
  destructive:
    'bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700 focus-visible:ring-red-400/30',
  brand:
    'bg-[#d6fd70] text-[#0a0c0e] border border-[#d6fd70] hover:bg-[#c5f135] hover:border-[#c5f135] focus-visible:ring-[#d6fd70]/30',
}

const SIZE_STYLES: Record<Size, string> = {
  xs: 'text-xs px-2.5 py-1 gap-1',
  sm: 'text-sm px-3.5 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
  lg: 'text-base px-5 py-2.5 gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-medium rounded-xl',
        'transition-all duration-150',
        'focus:outline-none focus-visible:ring-2',
        'active:scale-[0.97]',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading ? (
        <CircleNotch size={14} weight="bold" className="animate-spin flex-shrink-0" />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  )
}

interface HighlightWordProps {
  children: React.ReactNode
  bg?: string
  color?: string
  skew?: boolean
  variant?: 'block' | 'stripe'
}

export function HighlightWord({ children, bg = '#4f46e5', color = '#ffffff', skew = false, variant = 'block' }: HighlightWordProps) {
  if (variant === 'stripe') {
    return (
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
          color,
          zIndex: 1,
          transform: skew ? 'skewX(-4deg)' : undefined,
        }}
      >
        {children}
        <span
          aria-hidden
          style={{
            content: '""',
            position: 'absolute',
            width: '96%',
            height: '35%',
            top: '60%',
            left: '2%',
            background: bg,
            opacity: 1,
            borderRadius: 0,
            zIndex: -1,
            pointerEvents: 'none',
          }}
        />
      </span>
    )
  }

  return (
    <span
      className="inline-block relative"
      style={{ padding: '0 6px 2px', background: bg, color, borderRadius: 3, transform: skew ? 'skewX(-4deg)' : undefined }}
    >
      {children}
    </span>
  )
}

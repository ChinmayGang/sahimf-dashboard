import type { ReactNode } from 'react'

type Stat = {
  label: string
  value: string
  positive?: boolean
}

type Props = {
  icon: ReactNode
  title: string
  subtitle: string
  badge?: string
  stats?: Stat[]
  actions?: ReactNode
  lm: boolean
}

export function PageHeroBanner({ icon, title, subtitle, badge, stats, actions, lm }: Props) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl px-6 py-5 flex items-center gap-6 mb-6"
      style={
        lm
          ? {
              background: 'linear-gradient(135deg, #f0ebff 0%, #e5ddff 50%, #ede4ff 100%)',
              border: '1px solid #d4c5ff',
            }
          : {
              background: 'linear-gradient(135deg, #0d0820 0%, #160b30 50%, #0f0a25 100%)',
              border: '1px solid rgba(140,52,238,0.25)',
            }
      }
    >
      {/* Decorative blobs */}
      <div
        className="absolute -right-12 -top-12 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: lm
            ? 'radial-gradient(circle, rgba(140,52,238,0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(140,52,238,0.18) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute right-24 -bottom-8 w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: lm
            ? 'radial-gradient(circle, rgba(214,253,112,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(214,253,112,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Icon */}
      <div
        className="relative flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{
          background: lm
            ? 'linear-gradient(135deg, #8c34ee, #6366f1)'
            : 'linear-gradient(135deg, #8c34ee, #4f46e5)',
          boxShadow: '0 4px 20px rgba(140,52,238,0.35)',
        }}
      >
        <span style={{ color: '#d6fd70' }}>{icon}</span>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 relative">
        {badge && (
          <span
            className="inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-1.5"
            style={{
              background: lm ? 'rgba(140,52,238,0.12)' : 'rgba(214,253,112,0.12)',
              color: lm ? '#8c34ee' : '#d6fd70',
              border: `1px solid ${lm ? 'rgba(140,52,238,0.2)' : 'rgba(214,253,112,0.2)'}`,
            }}
          >
            {badge}
          </span>
        )}
        <h1
          className="text-xl font-black tracking-tight leading-tight"
          style={{ color: lm ? '#1e0845' : '#ffffff' }}
        >
          {title}
        </h1>
        <p
          className="text-xs mt-1 leading-relaxed max-w-lg"
          style={{ color: lm ? '#5b3f8a' : 'rgba(255,255,255,0.55)' }}
        >
          {subtitle}
        </p>
        {actions && <div className="mt-3">{actions}</div>}
      </div>

      {/* Stats */}
      {stats && stats.length > 0 && (
        <div className="relative flex-shrink-0 flex gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="text-center px-4 py-2.5 rounded-xl"
              style={{
                background: lm ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.05)',
                border: lm ? '1px solid rgba(140,52,238,0.15)' : '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <p
                className="text-base font-bold leading-none"
                style={{
                  color:
                    s.positive === true
                      ? '#22c55e'
                      : s.positive === false
                      ? '#ef4444'
                      : lm
                      ? '#4f46e5'
                      : '#d6fd70',
                }}
              >
                {s.value}
              </p>
              <p
                className="text-[10px] mt-1 whitespace-nowrap"
                style={{ color: lm ? '#6b5a9e' : 'rgba(255,255,255,0.45)' }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

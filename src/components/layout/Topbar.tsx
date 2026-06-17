import { ArrowsClockwise as SyncIcon } from '@phosphor-icons/react'
import { Bell as NotificationsNoneIcon } from '@phosphor-icons/react'
import { Sun as LightModeIcon } from '@phosphor-icons/react'
import { Moon as DarkModeIcon } from '@phosphor-icons/react'
import { PlanBadge } from '../ui/PlanBadge'
import { useAuthStore } from '../../stores/authStore'
import { useUIStore } from '../../stores/uiStore'
import { format } from 'date-fns'

export function Topbar() {
  const user = useAuthStore((s) => s.user)
  const { lightMode, toggleLightMode } = useUIStore()
  const today = new Date()

  const border = lightMode ? '#D1D5DB' : '#1e2838'
  const bg = 'transparent'
  const textPrimary = lightMode ? '#18181B' : '#FFFFFF'
  const textSecondary = lightMode ? '#52525B' : '#8390a2'
  const btnBorder = lightMode ? '#E5E7EB' : '#3c4653'
  const btnHoverBg = lightMode ? '#F4F4F5' : '#14171c'

  return (
    <header
      className="h-14 flex items-center justify-between px-6 flex-shrink-0 border-b transition-colors"
      style={{ background: bg, borderBottomColor: border }}
    >
      <div className="flex items-center gap-3">
        <div>
          <span className="text-sm font-semibold transition-colors" style={{ color: textPrimary }}>
            Hi, {user?.name?.split(' ')[0]}
          </span>
          <span className="ml-3 text-xs transition-colors" style={{ color: textSecondary }}>
            {format(today, 'EEE').toUpperCase()} · {format(today, 'd MMM yyyy').toUpperCase()}
          </span>
          {user?.plan && (
            <span className="ml-2">
              <PlanBadge tier={user.plan} />
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* SEBI RA badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold"
          style={{ color: lightMode ? '#4f46e5' : '#818cf8', borderColor: lightMode ? '#c7d2fe' : 'rgba(99,102,241,0.25)', background: lightMode ? '#eeedfd' : 'rgba(79,70,229,0.08)' }}
          title="SEBI Research Analyst — INH000009876 | Generic research only, not personalised advice"
        >
          SEBI RA
          <span className="opacity-60 font-medium hidden sm:inline">· INH000009876</span>
        </div>

        {/* Sync CAS */}
        <button
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all"
          style={{ color: textSecondary, borderColor: btnBorder }}
          onMouseEnter={(e) => { e.currentTarget.style.background = btnHoverBg }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <SyncIcon size={14} weight="regular" />
          Sync Active CAS
        </button>

        {/* Notifications */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors relative"
          style={{ color: textSecondary }}
          onMouseEnter={(e) => { e.currentTarget.style.background = btnHoverBg }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <NotificationsNoneIcon size={18} weight="duotone" />
          <span className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${lightMode ? 'bg-[#4f46e5]' : 'bg-[#d6fd70]'}`} />
        </button>

        {/* Light/Dark toggle */}
        <button
          onClick={toggleLightMode}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
          style={{ color: lightMode ? '#F59E0B' : '#8390a2', background: lightMode ? '#FEF3C7' : 'transparent' }}
          title={lightMode ? 'Switch to dark mode' : 'Switch to light mode'}
          onMouseEnter={(e) => { if (!lightMode) e.currentTarget.style.background = btnHoverBg }}
          onMouseLeave={(e) => { if (!lightMode) e.currentTarget.style.background = 'transparent' }}
        >
          {lightMode
            ? <DarkModeIcon size={16} weight="duotone" />
            : <LightModeIcon size={16} weight="duotone" />}
        </button>

        {/* Language toggle */}
        <div
          className="flex items-center gap-1 rounded-lg overflow-hidden border"
          style={{ borderColor: btnBorder }}
        >
          <button
            className="px-2.5 py-1.5 text-xs font-medium transition-colors"
            style={{ background: lightMode ? '#18181B' : '#3c4653', color: '#FFFFFF' }}
          >
            En
          </button>
          <button
            className="px-2.5 py-1.5 text-xs font-medium transition-colors"
            style={{ color: textSecondary }}
            onMouseEnter={(e) => { e.currentTarget.style.color = textPrimary }}
            onMouseLeave={(e) => { e.currentTarget.style.color = textSecondary }}
          >
            हि
          </button>
        </div>
      </div>
    </header>
  )
}

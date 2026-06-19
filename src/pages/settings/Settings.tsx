import { useNavigate } from 'react-router-dom'
import { Moon as DarkModeIcon } from '@phosphor-icons/react'
import { Sun as LightModeIcon } from '@phosphor-icons/react'
import { User as PersonIcon } from '@phosphor-icons/react'
import { Bell as NotificationsIcon } from '@phosphor-icons/react'
import { ShieldCheck as SecurityIcon } from '@phosphor-icons/react'
import { Info as InfoIcon } from '@phosphor-icons/react'
import { ArrowLeft as ArrowBackIcon } from '@phosphor-icons/react'
import { SignOut as LogoutIcon } from '@phosphor-icons/react'
import { useUIStore } from '../../stores/uiStore'
import { useAuthStore } from '../../stores/authStore'

export function Settings() {
  const navigate = useNavigate()
  const { lightMode, toggleLightMode } = useUIStore()
  const { user, logout } = useAuthStore()

  const lm = lightMode
  const bg = lm ? '#ffffff' : '#0a0c0e'
  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const divider = lm ? '#E0E3E8' : '#1e2838'
  const rowHover = lm ? 'hover:bg-[#F9FAFB]' : 'hover:bg-[#1a2130]'

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '??'

  const planLabel = user?.plan === 'pro' ? 'Sahi PRO' : user?.plan === 'wealth' ? 'Sahi Wealth' : 'Free'
  const planColor = user?.plan === 'pro' ? '#4f46e5' : user?.plan === 'wealth' ? '#f59e0b' : '#6B7280'

  return (
    <div className="min-h-full p-6" style={{ background: bg }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${rowHover} ${card}`}
          >
            <ArrowBackIcon size={16} color={lm ? '#6B7280' : '#8390a2'} weight="bold" />
          </button>
          <div>
            <h1 className={`text-lg font-bold ${text}`}>Settings</h1>
            <p className={`text-xs ${textSub}`}>Manage your account and preferences</p>
          </div>
        </div>

        {/* Profile card */}
        <div className={`rounded-2xl p-4 mb-4 ${card}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#4f46e5] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`font-semibold ${text}`}>{user?.name ?? '—'}</p>
              <p className={`text-sm ${textSub}`}>{user?.phone ? `+91 ${user.phone}` : '—'}</p>
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block"
                style={{ background: `${planColor}15`, color: planColor }}
              >
                {planLabel}
              </span>
            </div>
            <button className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${lm ? 'border-[#E0E3E8] text-[#6B7280] hover:bg-[#F9FAFB]' : 'border-[#1e2838] text-[#8390a2] hover:bg-[#1a2130]'}`}>
              Edit
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className={`rounded-2xl overflow-hidden mb-4 ${card}`}>
          <div className={`px-4 py-2.5 border-b text-xs font-bold tracking-wider uppercase ${textSub}`} style={{ borderColor: divider }}>
            Appearance
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${lm ? 'bg-[#F9FAFB]' : 'bg-[#1a2130]'}`}>
                  {lm
                    ? <LightModeIcon size={16} color="#f59e0b" weight="duotone" />
                    : <DarkModeIcon size={16} color="#8390a2" weight="duotone" />}
                </div>
                <div>
                  <p className={`text-sm font-medium ${text}`}>Dark Mode</p>
                  <p className={`text-xs ${textSub}`}>{lm ? 'Currently using light mode' : 'Currently using dark mode'}</p>
                </div>
              </div>
              {/* Toggle */}
              <button
                onClick={toggleLightMode}
                className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
                style={{ background: lm ? '#E0E3E8' : '#4f46e5' }}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200"
                  style={{ left: lm ? '2px' : '22px', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className={`rounded-2xl overflow-hidden mb-4 ${card}`}>
          <div className={`px-4 py-2.5 border-b text-xs font-bold tracking-wider uppercase ${textSub}`} style={{ borderColor: divider }}>
            Account
          </div>
          {[
            { icon: <PersonIcon size={16} weight="duotone" />, label: 'Profile Information', desc: 'Name, email, phone' },
            { icon: <NotificationsIcon size={16} weight="duotone" />, label: 'Notifications', desc: 'Alerts, news, rebalance reminders' },
            { icon: <SecurityIcon size={16} weight="duotone" />, label: 'Security', desc: 'Manage login & 2FA' },
            { icon: <InfoIcon size={16} weight="duotone" />, label: 'About Sahi MF', desc: 'Version, licences, terms' },
          ].map((item, i, arr) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${rowHover} ${i < arr.length - 1 ? 'border-b' : ''}`}
              style={{ borderColor: divider }}
            >
              <span className={textSub}>{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${text}`}>{item.label}</p>
                <p className={`text-xs ${textSub}`}>{item.desc}</p>
              </div>
              <span className={`text-xs ${textSub}`}>›</span>
            </button>
          ))}
        </div>

        {/* Plan */}
        {user?.plan === 'free' && (
          <div
            className="rounded-2xl p-4 mb-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }}
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #d6fd70 0%, transparent 60%)' }} />
            <div className="relative">
              <p className="text-white font-bold text-sm mb-0.5">Upgrade to Sahi PRO</p>
              <p className="text-white/70 text-xs mb-3">Unlock all Sahi Funds, deeper analytics, and priority research.</p>
              <button className="bg-[#d6fd70] text-[#0a0c0e] text-xs font-bold px-4 py-1.5 rounded-lg">
                View Plans
              </button>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-colors text-left ${lm ? 'border-[#fee2e2] bg-[#fff5f5] text-[#dc2626] hover:bg-[#fef2f2]' : 'border-[#3b1a1a] bg-[#1a0a0a] text-[#ef4444] hover:bg-[#2a0f0f]'}`}
        >
          <LogoutIcon size={16} weight="duotone" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>

        <p className={`text-center text-[11px] mt-6 ${textSub}`}>
          SahiMF v1.0.0 · Mumbai, India · © 2026 Arqentis
        </p>
      </div>
    </div>
  )
}

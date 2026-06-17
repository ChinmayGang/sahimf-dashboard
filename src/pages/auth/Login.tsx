import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight as ArrowForwardIcon } from '@phosphor-icons/react'
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react'
import logoWhite from '../../assets/logo/sahi_logo-white.svg'
import heroGraphic from '../../assets/loginpage-graphic.jpg'
import checkerBg from '../../assets/black_checker-background-1.jpg'
import { useAuthStore } from '../../stores/authStore'
import { DEMO_USERS } from '../../data/users'
import { HighlightWord } from '../../components/ui/HighlightWord'

const FOOTER = 'Mumbai, India | Copyright © 2026 Sahi MF · Arqentis'
const DISCLAIMER = 'NO COMMISSION RECEIVED FROM ANY INDIAN MUTUAL FUND HOUSES, EVER.'

const PERSONAS = [
  {
    key: 'aryan',
    label: 'Aryan Kapoor',
    tag: 'New Investor',
    tagColor: '#4f46e5',
    tagBg: '#eeedfd',
    desc: 'No investments yet',
    avatar: 'AK',
    avatarBg: '#6366f1',
  },
  {
    key: 'priya',
    label: 'Priya Singh',
    tag: 'First Fund',
    tagColor: '#16a34a',
    tagBg: '#dcfce7',
    desc: '1 MF · ₹10,000 invested',
    avatar: 'PS',
    avatarBg: '#0891b2',
  },
  {
    key: 'rohit',
    label: 'Rohit Sharma',
    tag: 'Sahi PRO',
    tagColor: '#7c3aed',
    tagBg: '#f5f3ff',
    desc: '3 MF · 2 Sahi Funds',
    avatar: 'RS',
    avatarBg: '#d6fd70',
  },
]

export function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [focused, setFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 10) {
      setError('Enter a valid 10-digit mobile number')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
      setTimeout(() => navigate('/auth/otp', { state: { phone: digits } }), 600)
    }, 900)
  }

  const handleDemoLogin = (key: string) => {
    login(DEMO_USERS[key])
    navigate('/mutual-funds')
  }

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{
        backgroundImage: `url(${checkerBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Left panel — inset card with 10px margin */}
      <div
        className="hidden lg:flex flex-col w-[52%] flex-shrink-0 relative overflow-hidden"
        style={{
          margin: '10px 0 10px 10px',
          borderRadius: '20px',
        }}
      >
        {/* Logo */}
        <div className="p-8 flex-shrink-0">
          <img src={logoWhite} alt="SahiMF" style={{ height: 26 }} />
        </div>

        {/* Content — no box/border/bg */}
        <div className="flex-1 flex flex-col items-center justify-center px-10 text-center">
          <p className="text-xs font-semibold tracking-widest mb-5" style={{ color: '#64748b' }}>
            — ZERO COMMISSIONS · SEBI PA DIRECT PLAN —
          </p>
          <h1 className="text-4xl font-bold leading-tight mb-4" style={{ color: '#FFFFFF' }}>
            Kaunsa{' '}
            <HighlightWord bg="#4e46e5" color="#ffffff" variant="stripe">mutual fund</HighlightWord>
            {' '}sahi hai
            <br />— for <span style={{ color: '#d6fd70' }}>your</span> portfolio?
          </h1>
          <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: '#64748b' }}>
            We accept ₹0 in fund sponsorship, charge no affiliate commissions,
            and focus strictly on portfolio-level diagnostics.
          </p>
          <img
            src={heroGraphic}
            alt=""
            className="w-80 mx-auto"
            style={{ mixBlendMode: 'screen' }}
          />
        </div>
      </div>

      {/* Right panel — full height white */}
      <div className="flex-1 flex flex-col bg-white" style={{ margin: '10px 10px 10px 0', borderRadius: '20px', overflow: 'hidden' }}>
        {/* Topbar */}
        <div className="flex items-center justify-between px-8 py-5 flex-shrink-0">
          <img src={logoWhite} alt="SahiMF" className="lg:hidden" style={{ height: 22, filter: 'invert(1)' }} />
          <span />
          <div className="flex items-center gap-1 text-xs font-medium">
            <button className="px-2.5 py-1 rounded-md transition-colors" style={{ background: '#18181B', color: '#fff' }}>En</button>
            <button
              className="px-2.5 py-1 rounded-md transition-colors"
              style={{ color: '#71717A' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F4F4F5')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >हि</button>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col justify-center px-8 py-4 overflow-y-auto">
          <div className="w-full max-w-xs mx-auto">
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#D6FD70' }}>
                <img src={logoWhite} alt="" style={{ height: 20, filter: 'invert(1) brightness(0)' }} />
              </div>
            </div>
            <p className="text-center text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: '#A1A1AA' }}>
              Sahi MF Journey
            </p>
            <h2 className="text-2xl font-bold text-center leading-snug mb-1" style={{ color: '#18181B' }}>
              Access your<br />SAHI MF Portfolio
            </h2>
            <p className="text-sm text-center mb-6" style={{ color: '#71717A' }}>
              Start your journey with just a phone no. &amp; FREE plan.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#52525B' }}>
                  Enter your phone number
                </label>
                <div
                  className="flex rounded-xl overflow-hidden transition-all"
                  style={{ border: `1.5px solid ${error ? '#EF4444' : focused ? '#18181B' : '#E4E4E7'}` }}
                >
                  <div
                    className="flex items-center gap-1.5 px-3 py-3 border-r flex-shrink-0 text-sm font-medium select-none"
                    style={{ borderColor: error ? '#EF4444' : focused ? '#D4D4D8' : '#E4E4E7', color: '#18181B', background: '#F9FAFB' }}
                  >
                    <span>🇮🇳</span><span>+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => { setError(''); setSent(false); setPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10)) }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="98765 43210"
                    autoFocus
                    className="flex-1 px-3 py-3 text-sm outline-none"
                    style={{ color: '#18181B', background: '#FFFFFF' }}
                  />
                </div>
                {error && <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: '#EF4444' }}>⚠ {error}</p>}
              </div>
              <button
                type="submit"
                disabled={loading || sent}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background: sent ? '#22C55E' : '#18181B', color: '#FFFFFF', opacity: (loading || sent) ? 0.9 : 1 }}
                onMouseEnter={e => { if (!loading && !sent) e.currentTarget.style.background = '#27272A' }}
                onMouseLeave={e => { if (!loading && !sent) e.currentTarget.style.background = sent ? '#22C55E' : '#18181B' }}
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending OTP...</>
                ) : sent ? (
                  <><CheckCircleIcon size={16} weight="duotone" />OTP Sent</>
                ) : (
                  <>Get OTP<ArrowForwardIcon size={16} weight="bold" /></>
                )}
              </button>
            </form>

            {/* Demo logins */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px" style={{ background: '#E4E4E7' }} />
                <span className="text-[11px] font-medium" style={{ color: '#A1A1AA' }}>Try a demo account</span>
                <div className="flex-1 h-px" style={{ background: '#E4E4E7' }} />
              </div>
              <div className="space-y-2">
                {PERSONAS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => handleDemoLogin(p.key)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left"
                    style={{ borderColor: '#E4E4E7', background: '#FAFAFA' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4D4D8'; e.currentTarget.style.background = '#F4F4F5' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E4E4E7'; e.currentTarget.style.background = '#FAFAFA' }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                      style={{ background: p.avatarBg, color: p.key === 'rohit' ? '#0a0c0e' : '#ffffff' }}
                    >
                      {p.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold" style={{ color: '#18181B' }}>{p.label}</span>
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: p.tagBg, color: p.tagColor }}
                        >{p.tag}</span>
                      </div>
                      <p className="text-[11px]" style={{ color: '#71717A' }}>{p.desc}</p>
                    </div>
                    <ArrowForwardIcon size={14} color="#A1A1AA" weight="bold" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right footer */}
        <div className="px-8 py-4 text-center flex-shrink-0 border-t" style={{ borderColor: '#F4F4F5' }}>
          <p className="text-[10px]" style={{ color: '#A1A1AA' }}>{FOOTER}</p>
          <p className="text-[10px] mt-0.5" style={{ color: '#A1A1AA' }}>{DISCLAIMER}</p>
        </div>
      </div>
    </div>
  )
}

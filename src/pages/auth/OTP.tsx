import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight as ArrowForwardIcon } from '@phosphor-icons/react'
import { useAuthStore } from '../../stores/authStore'
import type { User } from '../../types'
import logoWhite from '../../assets/logo/sahi_logo-white.svg'
import heroGraphic from '../../assets/loginpage-graphic.jpg'
import checkerBg from '../../assets/black_checker-background-1.jpg'

const DEMO_USER: User = {
  id: '1',
  name: 'Emily Rose',
  phone: '+91 9876543210',
  email: 'emily@example.com',
  plan: 'pro',
  planExpiresAt: '2027-06-15',
}

const OTP_LENGTH = 6
const RESEND_SECONDS = 30
const FOOTER = 'Mumbai, India | Copyright © 2026 Sahi MF · Arqentis'
const DISCLAIMER = 'NO COMMISSION RECEIVED FROM ANY INDIAN MUTUAL FUND HOUSES, EVER.'

export function OTP() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((s) => s.login)

  const phone: string = (location.state as { phone?: string })?.phone ?? '9876543210'
  const displayPhone = `+91 ${phone}`

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(RESEND_SECONDS)
  const [resending, setResending] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => { inputRefs.current[0]?.focus() }, [])

  useEffect(() => {
    if (countdown === 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const updateDigit = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]
    next[index] = val
    setDigits(next)
    setError('')
    if (val && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!text) return
    const next = Array(OTP_LENGTH).fill('')
    text.split('').forEach((c, i) => { next[i] = c })
    setDigits(next)
    inputRefs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus()
  }

  const handleVerify = () => {
    const code = digits.join('')
    if (code.length < OTP_LENGTH) { setError('Please enter a correct OTP number.'); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      login(DEMO_USER)
      navigate('/auth/create-profile', { replace: true })
    }, 900)
  }

  const handleResend = () => {
    if (countdown > 0) return
    setResending(true)
    setDigits(Array(OTP_LENGTH).fill(''))
    setError('')
    setTimeout(() => { setResending(false); setCountdown(RESEND_SECONDS); inputRefs.current[0]?.focus() }, 600)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F4F4F5' }}>

      {/* Outer white card */}
      <div className="flex w-full max-w-5xl min-h-[600px] rounded-3xl overflow-hidden mx-4"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.18)' }}>

        {/* ── Left panel ───────────────────────────────────────── */}
        <div
          className="hidden lg:flex flex-col justify-between w-[52%] flex-shrink-0 p-8 relative"
          style={{
            backgroundImage: `url(${checkerBg})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          <div>
            <img src={logoWhite} alt="SahiMF" style={{ height: 26 }} />
          </div>

          <div className="flex-1 flex items-center justify-center py-8">
            <div
              className="w-full rounded-2xl p-8 text-center"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <p className="text-xs font-semibold tracking-widest mb-5" style={{ color: '#64748b' }}>
                — ZERO COMMISSIONS · SEBI PA DIRECT PLAN —
              </p>
              <h1 className="text-3xl font-bold leading-tight mb-4" style={{ color: '#FFFFFF' }}>
                Kaunsa{' '}
                <span style={{ color: '#4f46e5', textDecoration: 'underline', textUnderlineOffset: 4 }}>
                  mutual fund
                </span>
                {' '}sahi hai
                <br />— for{' '}
                <span style={{ color: '#D6FD70' }}>your</span>
                {' '}portfolio?
              </h1>
              <p className="text-sm leading-relaxed mb-8" style={{ color: '#64748b' }}>
                We accept ₹0 in fund sponsorship, charge no affiliate
                commissions, and focus strictly on portfolio-level diagnostics.
              </p>
              <img src={heroGraphic} alt="" className="w-56 mx-auto" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-[10px]" style={{ color: '#505d6f' }}>{FOOTER}</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#505d6f' }}>{DISCLAIMER}</p>
          </div>
        </div>

        {/* ── Right panel — OTP form ───────────────────────────── */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Topbar */}
          <div className="flex items-center justify-between px-8 py-5">
            <span />
            <div className="flex items-center gap-1 text-xs font-medium">
              <button className="px-2.5 py-1 rounded-md" style={{ background: '#18181B', color: '#fff' }}>En</button>
              <button
                className="px-2.5 py-1 rounded-md transition-colors"
                style={{ color: '#71717A' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F4F4F5')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >हि</button>
            </div>
          </div>

          {/* Centered form */}
          <div className="flex-1 flex items-center justify-center px-8 py-6">
            <div className="w-full max-w-xs">

              {/* Icon */}
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: '#D6FD70' }}>
                  <img src={logoWhite} alt="" style={{ height: 20, filter: 'invert(1) brightness(0)' }} />
                </div>
              </div>

              <p className="text-center text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: '#A1A1AA' }}>
                Sahi MF Journey
              </p>

              <h2 className="text-2xl font-bold text-center mb-1" style={{ color: '#18181B' }}>
                Enter SMS Verification
              </h2>
              <p className="text-sm text-center mb-6" style={{ color: '#71717A' }}>
                Enter the 6-digit passcode sent to{' '}
                <span className="font-semibold" style={{ color: '#18181B' }}>{displayPhone}</span>
              </p>

              {/* OTP boxes */}
              <label className="block text-xs font-medium mb-2" style={{ color: '#52525B' }}>
                Enter OTP Code
              </label>
              <div className="flex gap-2 mb-3">
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => updateDigit(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className="outline-none transition-all text-center text-base font-bold rounded-xl"
                    style={{
                      width: 44,
                      height: 50,
                      flexShrink: 0,
                      border: `2px solid ${error ? '#EF4444' : d ? '#18181B' : '#E4E4E7'}`,
                      color: '#18181B',
                      background: d ? '#F9FAFB' : '#FFFFFF',
                      caretColor: '#18181B',
                    }}
                    onFocus={e => { if (!error) e.target.style.borderColor = '#18181B' }}
                    onBlur={e => { if (!error && !digits[i]) e.target.style.borderColor = '#E4E4E7' }}
                  />
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3 text-xs"
                  style={{ background: '#FEE2E2', color: '#DC2626' }}>
                  ⚠ {error}
                </div>
              )}

              {/* Resend row */}
              <div className="flex items-center justify-between mb-4 text-xs" style={{ color: '#71717A' }}>
                <span>Didn't receive SMS?</span>
                {countdown > 0 ? (
                  <span style={{ color: '#A1A1AA' }}>Resend in {countdown}s</span>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={resending}
                    className="font-semibold transition-colors"
                    style={{ color: resending ? '#A1A1AA' : '#18181B' }}
                    onMouseEnter={e => { if (!resending) e.currentTarget.style.color = '#4f46e5' }}
                    onMouseLeave={e => { if (!resending) e.currentTarget.style.color = '#18181B' }}
                  >
                    {resending ? 'Resending...' : 'Resend SMS Code'}
                  </button>
                )}
              </div>

              {/* Verify button */}
              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: '#18181B',
                  color: '#FFFFFF',
                  opacity: loading ? 0.8 : 1,
                  cursor: loading ? 'default' : 'pointer',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#27272A' }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#18181B' }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify &amp; Log In
                    <ArrowForwardIcon size={16} weight="bold" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 text-center border-t" style={{ borderColor: '#F4F4F5' }}>
            <p className="text-[10px]" style={{ color: '#A1A1AA' }}>{FOOTER}</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#A1A1AA' }}>{DISCLAIMER}</p>
          </div>
        </div>

      </div>
    </div>
  )
}

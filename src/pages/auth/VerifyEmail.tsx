import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight as ArrowForwardIcon, SignOut as SignOutIcon } from '@phosphor-icons/react'
import paperplane from '../../assets/paperplane.jpg'

const OTP_LENGTH = 6
const RESEND_SECONDS = 30
const FOOTER = 'Mumbai, India | Copyright © 2026 Sahi MF · Arqentis'
const DISCLAIMER = 'NO COMMISSION RECEIVED FROM ANY INDIAN MUTUAL FUND HOUSES, EVER.'

export function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()
  const email: string = (location.state as { email?: string })?.email ?? 'you@example.com'

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
    if (code.length < OTP_LENGTH) { setError('Please enter the 6-digit code sent to your email.'); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/auth/initialize', { replace: true })
    }, 900)
  }

  const handleResend = () => {
    if (countdown > 0) return
    setResending(true)
    setDigits(Array(OTP_LENGTH).fill(''))
    setError('')
    setTimeout(() => { setResending(false); setCountdown(RESEND_SECONDS); inputRefs.current[0]?.focus() }, 600)
  }

  const handleLogout = () => navigate('/auth/login')

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* Topbar */}
      <div className="flex items-center justify-between px-8 py-5 border-b flex-shrink-0" style={{ borderColor: '#F4F4F5' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm" style={{ background: '#D6FD70', color: '#000' }}>✳</div>
          <span className="text-sm font-bold" style={{ color: '#18181B' }}>SahiMF</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-medium">
            <button
              className="px-2.5 py-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#18181B]"
              style={{ background: '#18181B', color: '#fff' }}
            >En</button>
            <button
              className="px-2.5 py-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#D4D4D8]"
              style={{ color: '#71717A' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F4F4F5'; e.currentTarget.style.color = '#18181B' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#71717A' }}
            >हि</button>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#EF4444]"
            style={{ borderColor: '#E4E4E7', color: '#71717A', background: 'transparent' }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#FCA5A5'
              e.currentTarget.style.color = '#EF4444'
              e.currentTarget.style.background = '#FEF2F2'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E4E4E7'
              e.currentTarget.style.color = '#71717A'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <SignOutIcon size={12} weight="bold" />
            Logout
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden px-6 py-10">
        {/* Illustration — left */}
        <div className="absolute left-0 bottom-0 w-72 opacity-90 hidden lg:block">
          <img src={paperplane} alt="" className="w-full h-full object-contain" style={{ filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.08))' }} />
        </div>

        {/* Form — centered */}
        <div className="w-full max-w-xs relative z-10">
          {/* Icon */}
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#D6FD70' }}>
              <span className="text-black text-lg font-black">✳</span>
            </div>
          </div>

          <p className="text-center text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: '#A1A1AA' }}>
            SahiMF Journey
          </p>

          <h2 className="text-2xl font-bold text-center leading-snug mb-1" style={{ color: '#18181B' }}>
            Verify your Email
          </h2>
          <p className="text-sm text-center mb-1" style={{ color: '#71717A' }}>
            Enter the 6-digit code sent to
          </p>
          <p className="text-sm font-semibold text-center mb-7 break-all" style={{ color: '#18181B' }}>
            {email}
          </p>

          {/* OTP boxes */}
          <label className="block text-xs font-medium mb-2" style={{ color: '#52525B' }}>
            Enter Email OTP
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
                className="outline-none transition-all text-center text-base font-bold rounded-xl focus:ring-2 focus:ring-[#18181B] focus:ring-offset-1"
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

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3 text-xs"
              style={{ background: '#FEE2E2', color: '#DC2626' }}>
              ⚠ {error}
            </div>
          )}

          {/* Resend row */}
          <div className="flex items-center justify-between mb-4 text-xs" style={{ color: '#71717A' }}>
            <span>Didn't receive email?</span>
            {countdown > 0 ? (
              <span style={{ color: '#A1A1AA' }}>Resend in {countdown}s</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="font-semibold transition-colors focus:outline-none focus:underline"
                style={{ color: resending ? '#A1A1AA' : '#18181B' }}
                onMouseEnter={e => { if (!resending) e.currentTarget.style.color = '#4f46e5' }}
                onMouseLeave={e => { if (!resending) e.currentTarget.style.color = '#18181B' }}
              >
                {resending ? 'Resending...' : 'Resend Email Code'}
              </button>
            )}
          </div>

          {/* Verify button */}
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold mt-1 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#18181B]"
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
                Verify Email &amp; Continue
                <ArrowForwardIcon size={16} weight="bold" />
              </>
            )}
          </button>

          <p className="text-center text-xs mt-4" style={{ color: '#A1A1AA' }}>
            Wrong email?{' '}
            <button
              onClick={() => navigate('/auth/create-profile')}
              className="font-semibold underline underline-offset-2 transition-colors focus:outline-none"
              style={{ color: '#18181B' }}
              onMouseEnter={e => e.currentTarget.style.color = '#4f46e5'}
              onMouseLeave={e => e.currentTarget.style.color = '#18181B'}
            >
              Go back
            </button>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-5 text-center border-t flex-shrink-0" style={{ borderColor: '#F4F4F5' }}>
        <p className="text-[10px]" style={{ color: '#A1A1AA' }}>{FOOTER}</p>
        <p className="text-[10px] mt-0.5" style={{ color: '#A1A1AA' }}>{DISCLAIMER}</p>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'
import paperplane from '../../assets/paperplane.jpg'

const FOOTER = 'Mumbai, India | Copyright © 2026 Sahi MF · Arqentis'
const DISCLAIMER = 'NO COMMISSION RECEIVED FROM ANY INDIAN MUTUAL FUND HOUSES, EVER.'

export function CreateProfile() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Please enter your legal name'); return }
    if (!email.includes('@')) { setError('Please enter a valid email address'); return }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/auth/verify-email', { state: { email } })
    }, 800)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Topbar */}
      <div className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: '#F4F4F5' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm"
            style={{ background: '#D6FD70', color: '#000' }}>✳</div>
          <span className="text-sm font-bold" style={{ color: '#18181B' }}>SahiMF</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-medium">
            <button className="px-2.5 py-1 rounded-md" style={{ background: '#18181B', color: '#fff' }}>En</button>
            <button className="px-2.5 py-1 rounded-md" style={{ color: '#71717A' }}>हि</button>
          </div>
          <button className="text-xs font-medium px-3 py-1.5 rounded-lg border"
            style={{ borderColor: '#E4E4E7', color: '#71717A' }}>Logout</button>
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
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: '#D6FD70' }}>
              <span className="text-black text-lg font-black">✳</span>
            </div>
          </div>

          <p className="text-center text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: '#A1A1AA' }}>
            SahiMF Journey
          </p>

          <h2 className="text-2xl font-bold text-center leading-snug mb-1" style={{ color: '#18181B' }}>
            Create your Investor Profile
          </h2>
          <p className="text-sm text-center mb-7" style={{ color: '#71717A' }}>
            Welcome aboard! Let's record your name identifier and email address to finalize legal SEBI reporting registries.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#52525B' }}>
                Your Legal Name
              </label>
              <div className="relative">
                <PersonOutlineIcon sx={{ fontSize: 15, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#A1A1AA' }} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setError(''); setName(e.target.value) }}
                  placeholder="Arjun Sharma"
                  autoFocus
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ border: '1px solid #E4E4E7', color: '#18181B', background: '#FFFFFF' }}
                  onFocus={(e) => e.target.style.borderColor = '#18181B'}
                  onBlur={(e) => e.target.style.borderColor = '#E4E4E7'}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#52525B' }}>
                Direct Email Address
              </label>
              <div className="relative">
                <EmailOutlinedIcon sx={{ fontSize: 15, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#A1A1AA' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setError(''); setEmail(e.target.value) }}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ border: '1px solid #E4E4E7', color: '#18181B', background: '#FFFFFF' }}
                  onFocus={(e) => e.target.style.borderColor = '#18181B'}
                  onBlur={(e) => e.target.style.borderColor = '#E4E4E7'}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                style={{ background: '#FEE2E2', color: '#DC2626' }}>
                <span>⚠</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold mt-1 transition-all"
              style={{ background: '#18181B', color: '#FFFFFF', opacity: loading ? 0.8 : 1 }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Continue to Email Verify
                  <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-5 text-center border-t" style={{ borderColor: '#F4F4F5' }}>
        <p className="text-[10px]" style={{ color: '#A1A1AA' }}>{FOOTER}</p>
        <p className="text-[10px] mt-0.5" style={{ color: '#A1A1AA' }}>{DISCLAIMER}</p>
      </div>
    </div>
  )
}

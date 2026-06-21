import { useNavigate } from 'react-router-dom'
import { ArrowRight as ArrowForwardIcon } from '@phosphor-icons/react'
import pyramidImg from '../../assets/piramid-landingpage.png'

const FOOTER = 'Mumbai, India | Copyright © 2026 Sahi MF � Arqentis'
const DISCLAIMER = 'NO COMMISSION RECEIVED FROM ANY INDIAN MUTUAL FUND HOUSES, EVER.'

export function InitializePortfolio() {
  const navigate = useNavigate()

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
        {/* Illustration */}
        <div className="absolute left-0 bottom-0 w-64 opacity-90 hidden lg:block pointer-events-none">
          <img src={pyramidImg} alt="" className="w-full h-full object-contain" />
        </div>

        {/* Content — centered */}
        <div className="w-full max-w-sm relative z-10">
          {/* Icon */}
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: '#D6FD70' }}>
              <span className="text-black text-lg font-black">✳</span>
            </div>
          </div>

          <p className="text-center text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: '#A1A1AA' }}>
            Sahi Wealth Unlocked
          </p>

          <h2 className="text-2xl font-bold text-center leading-snug mb-2" style={{ color: '#18181B' }}>
            Initialize your MF Investment
          </h2>
          <p className="text-sm text-center mb-8" style={{ color: '#71717A' }}>
            Your custom workspace is now provisioned. Let's synchronize your current mutual funds to compute overlay ratios.
          </p>

          {/* Option cards */}
          <div className="space-y-3">
            {/* Option 1 — Recommended */}
            <div className="rounded-2xl p-5 border-2 cursor-pointer transition-all"
              style={{ borderColor: '#18181B', background: '#FAFAFA' }}>
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ borderColor: '#18181B', background: '#18181B' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold mb-1" style={{ color: '#18181B' }}>
                    Let's Get Your Active MF Portfolio
                  </p>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: '#71717A' }}>
                    Link CAMS/MFU/MFfetch records via using secure OTP decryption inside our regulatory sandbox.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: '#4f46e5', color: '#fff' }}>
                      ✦ Recommended
                    </span>
                    <button
                      onClick={() => navigate('/mutual-funds', { replace: true })}
                      className="flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-lg transition-all"
                      style={{ background: '#18181B', color: '#fff' }}
                    >
                      Fetch Portfolio
                      <ArrowForwardIcon size={13} weight="bold" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Option 2 — Manual */}
            <div className="rounded-2xl p-5 border cursor-pointer transition-all"
              style={{ borderColor: '#E4E4E7', background: '#FFFFFF' }}>
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5"
                  style={{ borderColor: '#D4D4D8' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold mb-1" style={{ color: '#18181B' }}>
                    Continue with Create New Portfolio Manually
                  </p>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: '#71717A' }}>
                    Skip file import, explore ratings directly, and compile custom schemes by hand.
                  </p>
                  <button
                    onClick={() => navigate('/mutual-funds', { replace: true })}
                    className="flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-lg transition-all"
                    style={{ background: '#18181B', color: '#fff' }}
                  >
                    Create Manually
                    <ArrowForwardIcon size={13} weight="bold" />
                  </button>
                </div>
              </div>
            </div>
          </div>
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

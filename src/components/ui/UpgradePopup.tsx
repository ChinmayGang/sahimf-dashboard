import * as Dialog from '@radix-ui/react-dialog'
import { X as CloseIcon, Sparkle as SparkleIcon, Check as CheckIcon, Crown as CrownIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { ProButton } from './ProButton'

interface UpgradePopupProps {
  open: boolean
  onClose: () => void
  feature?: string
  description?: string
}

const PRO_HIGHLIGHTS = [
  'Deep fund analytics & Sahi Score',
  'Risk & Overlap Analysis',
  'Fund Comparison (up to 3 funds)',
  'All Sahi Research Notes',
  'Tax Report (STCG/LTCG)',
  'Up to 5 portfolios',
]

export function UpgradePopup({ open, onClose, feature, description }: UpgradePopupProps) {
  const navigate = useNavigate()

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50"
          style={{ background: 'rgba(10,8,20,0.55)', backdropFilter: 'blur(4px)' }}
        />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden shadow-2xl outline-none"
          style={{ background: '#fff' }}
        >
          {/* Gradient header strip */}
          <div className="h-[3px]" style={{
            background: 'linear-gradient(90deg, #8c34ee, #4f46e5, #d6fd70, #4f46e5, #8c34ee)',
            backgroundSize: '200% 100%',
            animation: 'shimmer-rail 3s linear infinite',
          }} />

          {/* Header */}
          <div className="relative px-6 pt-5 pb-4"
            style={{ background: 'linear-gradient(135deg, #f5f0ff 0%, #eee8ff 100%)' }}>
            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-white/60 transition-colors"
                aria-label="Close"
              >
                <CloseIcon size={16} weight="bold" />
              </button>
            </Dialog.Close>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #8c34ee, #4f46e5)', boxShadow: '0 4px 16px rgba(140,52,238,0.35)' }}>
                <SparkleIcon size={20} color="#d6fd70" weight="fill" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#8c34ee] mb-0.5">Upgrade Required</p>
                <h2 className="text-lg font-black tracking-tight text-[#1e0845]">
                  {feature ?? 'This is a PRO feature'}
                </h2>
              </div>
            </div>

            {description && (
              <p className="text-xs text-[#5b3f8a] leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <p className="text-xs font-semibold text-[#111827] uppercase tracking-wider mb-3">What you unlock with Sahi PRO</p>
            <ul className="space-y-2 mb-5">
              {PRO_HIGHLIGHTS.map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-[#374151]">
                  <CheckIcon size={14} color="#22c55e" weight="bold" className="flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Price row */}
            <div className="flex items-center gap-3 p-3 rounded-xl mb-4"
              style={{ background: '#f5f4ff', border: '1px solid #e0ddff' }}>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[#111827]">₹1,999</span>
                  <span className="text-xs text-[#6B7280]">/year</span>
                </div>
                <p className="text-[10px] text-[#6B7280]">₹167/month · Cancel anytime</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-[#ea580c] bg-[#fff7ed] px-2.5 py-1 rounded-full">
                <CrownIcon size={11} weight="fill" />
                Sahi Wealth at ₹3,999 lifetime
              </div>
            </div>

            {/* CTAs */}
            <ProButton
              label="Unlock with Sahi PRO"
              size="lg"
              className="w-full"
              onClick={() => { onClose(); navigate('/pricing') }}
            />
            <button
              onClick={() => { onClose(); navigate('/pricing') }}
              className="w-full mt-2.5 py-2 rounded-xl text-xs font-semibold text-[#4f46e5] hover:underline transition-colors"
            >
              See all plan details →
            </button>
            <button
              onClick={onClose}
              className="w-full mt-0.5 py-1.5 rounded-xl text-xs font-medium text-[#6B7280] hover:text-[#374151] transition-colors"
            >
              Maybe later
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

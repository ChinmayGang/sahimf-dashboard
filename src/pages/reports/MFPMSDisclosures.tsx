import { FileText as ArticleIcon } from '@phosphor-icons/react'
import { DownloadSimple as DownloadIcon } from '@phosphor-icons/react'
import { ArrowSquareOut as OpenInNewIcon } from '@phosphor-icons/react'
import { SealCheck as VerifiedIcon, CheckCircle as CheckIcon } from '@phosphor-icons/react'
import { useUIStore } from '../../stores/uiStore'

const DISCLOSURES = [
  {
    category: 'SEBI Compliance',
    docs: [
      { title: 'SEBI Research Analyst Registration Certificate', date: 'Mar 2024', type: 'PDF', size: '248 KB' },
      { title: 'Annual Compliance Report – FY 2024–25', date: 'Apr 2025', type: 'PDF', size: '1.2 MB' },
      { title: 'Client Grievance Redressal Policy', date: 'Jan 2024', type: 'PDF', size: '180 KB' },
    ],
  },
  {
    category: 'Fee & Conflict Disclosure',
    docs: [
      { title: 'Fee Structure & Schedule (All Plans)', date: 'Apr 2026', type: 'PDF', size: '92 KB' },
      { title: 'Conflict of Interest Disclosure Statement', date: 'Jan 2024', type: 'PDF', size: '120 KB' },
      { title: 'Zero Commission Declaration — All AMCs', date: 'Jan 2024', type: 'PDF', size: '64 KB' },
    ],
  },
  {
    category: 'Research & Risk Disclosure',
    docs: [
      { title: 'Research Methodology Disclosure', date: 'Apr 2026', type: 'PDF', size: '320 KB' },
      { title: 'Risk Disclosure & Investor Charter', date: 'Mar 2024', type: 'PDF', size: '215 KB' },
    ],
  },
  {
    category: 'Privacy & Terms',
    docs: [
      { title: 'Privacy Policy', date: 'Jan 2025', type: 'Web', size: null },
      { title: 'Terms of Service', date: 'Jan 2025', type: 'Web', size: null },
      { title: 'Data Processing Agreement (DPA)', date: 'Mar 2024', type: 'PDF', size: '410 KB' },
    ],
  },
]

const HIGHLIGHTS = [
  { icon: '₹0', check: false, label: 'Commission Received', sub: 'From any Indian MF house. Ever.' },
  { icon: null, check: true, label: 'SEBI Registered RA', sub: 'SEBI Registered Research Analyst' },
  { icon: null, check: true, label: 'Direct Plan Only', sub: 'Never regular plans' },
  { icon: null, check: true, label: 'Full Disclosure', sub: 'Fee-only advisory model' },
]

export function MFPMSDisclosures() {
  const lm = useUIStore((s) => s.lightMode)

  const card = lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#8390a2]'
  const textMuted = lm ? 'text-[#6B7280]' : 'text-[#64748b]'
  const rowHover = lm ? 'hover:bg-[#F9F9FF]' : 'hover:bg-[#1a2130]'
  const rowBorder = lm ? 'border-[#F0F0F8]' : 'border-[#1e2838]'
  const dividerColor = lm ? 'border-[#E0E3E8]' : 'border-[#1e2838]'
  const docIconBg = lm ? 'bg-[#F3F4F6] border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'
  const typeBadge = lm ? 'bg-[#F3F4F6] border border-[#E0E3E8] text-[#6B7280]' : 'bg-[#14171c] border border-[#1e2838] text-[#64748b]'
  const bannerBg = lm ? 'bg-[#F8F7FF] border border-[#d6fd70]/30' : 'bg-[#14171c] border border-[#d6fd70]/30'

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl ${lm ? 'bg-white border border-[#E0E3E8]' : 'bg-[#14171c] border border-[#1e2838]'} flex items-center justify-center`}>
          <ArticleIcon size={18} color={lm ? '#4f46e5' : '#d6fd70'} weight="fill" />
        </div>
        <div>
          <h1 className={`text-lg font-bold ${text}`}>Reports &amp; Disclosures</h1>
          <p className={`text-xs ${textMuted}`}>SEBI regulatory documents and compliance disclosures</p>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-4 gap-4">
        {HIGHLIGHTS.map((h) => (
          <div key={h.label} className={`${card} rounded-xl px-4 py-3 text-center`}>
            <div className="flex items-center justify-center h-7 mb-1">
              {h.check
                ? <CheckIcon size={24} weight="fill" color={lm ? '#4f46e5' : '#d6fd70'} />
                : <p className={`text-xl font-black ${lm ? 'text-[#4f46e5]' : 'text-[#d6fd70]'}`}>{h.icon}</p>}
            </div>
            <p className={`text-xs font-semibold ${text} mb-0.5`}>{h.label}</p>
            <p className={`text-[10px] ${textMuted}`}>{h.sub}</p>
          </div>
        ))}
      </div>

      {/* SEBI disclaimer banner */}
      <div className={`${bannerBg} rounded-xl px-5 py-4 flex items-start gap-3`}>
        <VerifiedIcon size={18} color={lm ? '#4f46e5' : '#d6fd70'} weight="fill" style={{ flexShrink: 0, marginTop: "1px" }} />
        <div className={`text-xs ${textSub} space-y-1`}>
          <p className={`${text} font-semibold text-sm`}>
            NO COMMISSION RECEIVED FROM ANY INDIAN MUTUAL FUND HOUSES, EVER.
          </p>
          <p>SahiMF operates as a SEBI-registered Research Analyst under the fee-only model. We charge clients directly. We do not receive trail commissions, upfront fees, or any form of compensation from AMCs or distributors. All research covers direct plans only.</p>
          <p className={textMuted}>Mutual Fund investments are subject to market risks. Read all scheme-related documents carefully before investing. Past performance is not indicative of future returns.</p>
        </div>
      </div>

      {/* Document sections */}
      <div className="space-y-5">
        {DISCLOSURES.map((section) => (
          <div key={section.category} className={`${card} rounded-2xl overflow-hidden`}>
            <div className={`px-5 py-3 border-b ${dividerColor}`}>
              <h2 className={`text-sm font-semibold ${text}`}>{section.category}</h2>
            </div>
            <div>
              {section.docs.map((doc) => (
                <div
                  key={doc.title}
                  className={`flex items-center justify-between px-5 py-4 border-b ${rowBorder} last:border-0 ${rowHover} transition-colors group`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${docIconBg} flex items-center justify-center flex-shrink-0`}>
                      <ArticleIcon size={14} color={lm ? '#9CA3AF' : '#64748b'} weight="regular" />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${text}`}>{doc.title}</p>
                      <p className={`text-[11px] ${textMuted} mt-0.5`}>
                        Updated {doc.date}{doc.size ? ` · ${doc.size}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {doc.type === 'PDF' ? (
                      <button className={`flex items-center gap-1.5 text-xs ${textSub} transition-colors`}>
                        <DownloadIcon size={14} weight="regular" /> Download
                      </button>
                    ) : (
                      <button className={`flex items-center gap-1.5 text-xs ${textSub} transition-colors`}>
                        <OpenInNewIcon size={14} weight="regular" /> View
                      </button>
                    )}
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded ${typeBadge} ml-3 flex-shrink-0`}>{doc.type}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className={`text-[10px] ${lm ? 'text-[#6B7280]' : 'text-[#505d6f]'} text-center`}>
        All disclosures are filed with SEBI and updated on a mandatory basis. For grievances, contact grievance@sahimf.in or write to SEBI at scores.gov.in.
        SahiMF is a product of Arqentis Financial Technologies Pvt. Ltd., Mumbai.
      </p>
    </div>
  )
}

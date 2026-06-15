import ArticleIcon from '@mui/icons-material/Article'
import DownloadIcon from '@mui/icons-material/Download'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import VerifiedIcon from '@mui/icons-material/Verified'

const DISCLOSURES = [
  {
    category: 'SEBI Compliance',
    docs: [
      { title: 'SEBI Investment Adviser Registration Certificate', date: 'Mar 2024', type: 'PDF', size: '248 KB' },
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
    category: 'MF Portfolio Management Service (MFPMS)',
    docs: [
      { title: 'MFPMS Disclosure Document', date: 'Apr 2026', type: 'PDF', size: '890 KB' },
      { title: 'Model Portfolio Performance — Q4 FY 2025–26', date: 'Jun 2026', type: 'PDF', size: '340 KB' },
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
  { icon: '₹0', label: 'Commission Received', sub: 'From any Indian MF house. Ever.' },
  { icon: '✓', label: 'SEBI Registered IA', sub: 'SEBI/IA/0000/2024' },
  { icon: '🔒', label: 'Direct Plan Only', sub: 'Never regular plans' },
  { icon: '📋', label: 'Full Disclosure', sub: 'Fee-only advisory model' },
]

export function MFPMSDisclosures() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
          <ArticleIcon sx={{ fontSize: 18, color: '#C5F135' }} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">MFPMS Disclosures</h1>
          <p className="text-xs text-[#606060]">SEBI regulatory documents and compliance disclosures</p>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-4 gap-4">
        {HIGHLIGHTS.map((h) => (
          <div key={h.label} className="bg-[#141414] border border-[#2A2A2A] rounded-xl px-4 py-3 text-center">
            <p className="text-xl font-black text-[#C5F135] mb-1">{h.icon}</p>
            <p className="text-xs font-semibold text-white mb-0.5">{h.label}</p>
            <p className="text-[10px] text-[#606060]">{h.sub}</p>
          </div>
        ))}
      </div>

      {/* SEBI disclaimer banner */}
      <div className="bg-[#1A1A1A] border border-[#C5F135]/30 rounded-xl px-5 py-4 flex items-start gap-3">
        <VerifiedIcon sx={{ fontSize: 18, color: '#C5F135', flexShrink: 0, marginTop: '1px' }} />
        <div className="text-xs text-[#A0A0A0] space-y-1">
          <p className="text-white font-semibold text-sm">
            NO COMMISSION RECEIVED FROM ANY INDIAN MUTUAL FUND HOUSES, EVER.
          </p>
          <p>SahiMF operates as a SEBI-registered Investment Adviser under the fee-only model. We charge clients directly. We do not receive trail commissions, upfront fees, or any form of compensation from AMCs or distributors. All recommendations are direct-plan only.</p>
          <p className="text-[#606060]">Mutual Fund investments are subject to market risks. Read all scheme-related documents carefully before investing. Past performance is not indicative of future returns.</p>
        </div>
      </div>

      {/* Document sections */}
      <div className="space-y-5">
        {DISCLOSURES.map((section) => (
          <div key={section.category} className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-[#2A2A2A]">
              <h2 className="text-sm font-semibold text-white">{section.category}</h2>
            </div>
            <div>
              {section.docs.map((doc) => (
                <div
                  key={doc.title}
                  className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E] last:border-0 hover:bg-[#1A1A1A] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                      <ArticleIcon sx={{ fontSize: 14, color: '#606060' }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{doc.title}</p>
                      <p className="text-[11px] text-[#606060] mt-0.5">
                        Updated {doc.date}{doc.size ? ` · ${doc.size}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {doc.type === 'PDF' ? (
                      <button className="flex items-center gap-1.5 text-xs text-[#A0A0A0] hover:text-[#C5F135] transition-colors">
                        <DownloadIcon sx={{ fontSize: 14 }} /> Download
                      </button>
                    ) : (
                      <button className="flex items-center gap-1.5 text-xs text-[#A0A0A0] hover:text-[#C5F135] transition-colors">
                        <OpenInNewIcon sx={{ fontSize: 14 }} /> View
                      </button>
                    )}
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-[#606060] ml-3 flex-shrink-0">{doc.type}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-[#404040] text-center">
        All disclosures are filed with SEBI and updated on a mandatory basis. For grievances, contact grievance@sahimf.in or write to SEBI at scores.gov.in.
        SahiMF is a product of Arqentis Financial Technologies Pvt. Ltd., Mumbai.
      </p>
    </div>
  )
}

import ReceiptIcon from '@mui/icons-material/Receipt'
import DownloadIcon from '@mui/icons-material/Download'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { PlanGate } from '../../components/ui/PlanGate'
import { useUIStore } from '../../stores/uiStore'

const TAX_DATA = [
  {
    fy: 'FY 2025–26',
    stcg: { gains: 18420, tax: 2763, holding: '< 1 year', rate: '15%' },
    ltcg: { gains: 48600, exempted: 10000, taxable: 38600, tax: 3860, holding: '> 1 year', rate: '10%' },
  },
  {
    fy: 'FY 2024–25',
    stcg: { gains: 12350, tax: 1852, holding: '< 1 year', rate: '15%' },
    ltcg: { gains: 36200, exempted: 10000, taxable: 26200, tax: 2620, holding: '> 1 year', rate: '10%' },
  },
]

function formatINR(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

export function TaxReport() {
  const lm = useUIStore((s) => s.lightMode)

  const card = lm ? 'bg-white border border-[#E8E8F0] shadow-sm' : 'bg-[#141414] border border-[#2A2A2A]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#A0A0A0]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#606060]'
  const dividerColor = lm ? 'border-[#E8E8F0]' : 'border-[#2A2A2A]'
  const totalRowBg = lm ? 'bg-[#F9F9FF]' : 'bg-[#1A1A1A]'
  const noteBg = lm ? 'bg-[#F8F7FF] border border-[#E8E8F0]' : 'bg-[#141414] border border-[#2A2A2A]'

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${lm ? 'bg-white border border-[#E8E8F0] shadow-sm' : 'bg-[#1A1A1A] border border-[#2A2A2A]'} flex items-center justify-center`}>
            <ReceiptIcon sx={{ fontSize: 18, color: '#C5F135' }} />
          </div>
          <div>
            <h1 className={`text-lg font-bold ${text}`}>Tax Report</h1>
            <p className={`text-xs ${textMuted}`}>STCG / LTCG breakdown by financial year</p>
          </div>
        </div>
        <PlanGate requiredTier="pro" compact>
          <button className={`flex items-center gap-1.5 ${lm ? 'bg-white border-[#E8E8F0] text-[#6B7280] hover:text-[#111827]' : 'bg-[#1A1A1A] border-[#2A2A2A] text-[#A0A0A0] hover:text-white'} border hover:border-[#C5F135] rounded-xl px-3 py-2 text-sm transition-all`}>
            <DownloadIcon sx={{ fontSize: 14 }} />
            Download PDF
          </button>
        </PlanGate>
      </div>

      {/* Tax rules note */}
      <div className={`${noteBg} rounded-xl px-4 py-3 flex items-start gap-3`}>
        <InfoOutlinedIcon sx={{ fontSize: 15, color: '#C5F135', flexShrink: 0, marginTop: '1px' }} />
        <div className={`text-xs ${textSub} space-y-1`}>
          <p><span className={`${text} font-medium`}>Equity Fund Tax Rules (post Budget 2024)</span></p>
          <p>STCG (held &lt; 12 months): taxed at <span className="text-[#C5F135] font-medium">20%</span> flat (revised from 15%)</p>
          <p>LTCG (held ≥ 12 months): taxed at <span className="text-[#C5F135] font-medium">12.5%</span> above ₹1.25L exemption per year (revised from 10% / ₹1L)</p>
          <p className={textMuted}>Data shown uses old rates for FY 2024–25 and prior. Please consult a tax advisor for current applicability.</p>
        </div>
      </div>

      <PlanGate requiredTier="pro" label="Unlock Tax Report">
        <div className="space-y-6">
          {TAX_DATA.map((fy) => (
            <div key={fy.fy} className={`${card} rounded-2xl overflow-hidden`}>
              <div className={`px-5 py-3 border-b ${dividerColor} flex items-center justify-between`}>
                <h2 className={`text-sm font-bold ${text}`}>{fy.fy}</h2>
                <span className={`text-xs ${textMuted}`}>Equity Mutual Funds</span>
              </div>

              <div className={`grid grid-cols-2 divide-x ${lm ? 'divide-[#E8E8F0]' : 'divide-[#2A2A2A]'}`}>
                {/* STCG */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                    <p className={`text-sm font-semibold ${text}`}>Short-Term Capital Gains (STCG)</p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className={textMuted}>Holding Period</span>
                      <span className={textSub}>{fy.stcg.holding}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={textMuted}>STCG Gains</span>
                      <span className={`${text} font-semibold`}>{formatINR(fy.stcg.gains)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={textMuted}>Tax Rate</span>
                      <span className="text-[#F59E0B] font-semibold">{fy.stcg.rate}</span>
                    </div>
                    <div className={`flex justify-between border-t ${dividerColor} pt-3`}>
                      <span className={`${text} font-semibold`}>Tax Payable</span>
                      <span className="text-[#EF4444] font-bold">{formatINR(fy.stcg.tax)}</span>
                    </div>
                  </div>
                </div>

                {/* LTCG */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    <p className={`text-sm font-semibold ${text}`}>Long-Term Capital Gains (LTCG)</p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className={textMuted}>Holding Period</span>
                      <span className={textSub}>{fy.ltcg.holding}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={textMuted}>Total Gains</span>
                      <span className={`${text} font-semibold`}>{formatINR(fy.ltcg.gains)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={textMuted}>Exemption (₹1L)</span>
                      <span className="text-[#22C55E]">— {formatINR(fy.ltcg.exempted)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={textMuted}>Taxable LTCG</span>
                      <span className={`${text} font-semibold`}>{formatINR(fy.ltcg.taxable)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={textMuted}>Tax Rate</span>
                      <span className="text-[#C5F135] font-semibold">{fy.ltcg.rate}</span>
                    </div>
                    <div className={`flex justify-between border-t ${dividerColor} pt-3`}>
                      <span className={`${text} font-semibold`}>Tax Payable</span>
                      <span className="text-[#EF4444] font-bold">{formatINR(fy.ltcg.tax)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className={`px-5 py-3 ${totalRowBg} border-t ${dividerColor} flex items-center justify-between`}>
                <span className={`text-sm font-semibold ${text}`}>Total Estimated Tax ({fy.fy})</span>
                <span className="text-base font-bold text-[#EF4444]">{formatINR(fy.stcg.tax + fy.ltcg.tax)}</span>
              </div>
            </div>
          ))}
        </div>
      </PlanGate>

      <p className={`text-[10px] ${lm ? 'text-[#9CA3AF]' : 'text-[#404040]'} text-center`}>
        Tax computations are estimates based on declared transactions. SahiMF does not provide tax advice.
        Please consult a CA or tax advisor for accurate ITR filing. Tax laws are subject to change.
      </p>
    </div>
  )
}

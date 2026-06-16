import { useState } from 'react'
import BlurOnIcon from '@mui/icons-material/BlurOn'
import { PlanGate } from '../../components/ui/PlanGate'
import { mockFunds } from '../../data/funds'
import { useUIStore } from '../../stores/uiStore'

const SELECTED_FUNDS = ['f001', 'f002', 'f005', 'f006']

const OVERLAP_MATRIX: Record<string, Record<string, number>> = {
  f001: { f001: 100, f002: 12, f005: 8, f006: 3 },
  f002: { f001: 12, f002: 100, f005: 18, f006: 6 },
  f005: { f001: 8, f002: 18, f005: 100, f006: 22 },
  f006: { f001: 3, f002: 6, f005: 22, f006: 100 },
}

const COMMON_STOCKS = [
  { name: 'HDFC Bank Ltd', f001: 8.2, f002: 4.1, f005: 0, f006: 0 },
  { name: 'Infosys Ltd', f001: 6.8, f002: 5.4, f005: 3.2, f006: 0 },
  { name: 'ICICI Bank Ltd', f001: 7.1, f002: 3.8, f005: 0, f006: 2.1 },
  { name: 'Bharti Airtel Ltd', f001: 4.2, f002: 3.1, f005: 2.8, f006: 0 },
  { name: 'Tata Consultancy Services', f001: 5.9, f002: 4.8, f005: 2.1, f006: 0 },
  { name: 'Avenue Supermarts Ltd (DMart)', f001: 0, f002: 2.9, f005: 3.4, f006: 0 },
  { name: 'Astral Ltd', f001: 0, f002: 0, f005: 2.8, f006: 3.1 },
  { name: 'Cholamandalam Investment', f001: 0, f002: 0, f005: 3.1, f006: 4.2 },
]

function getColor(val: number) {
  if (val === 100) return { bg: '#C5F135', text: '#000' }
  if (val >= 20) return { bg: '#EF4444', text: '#fff' }
  if (val >= 10) return { bg: '#F59E0B', text: '#000' }
  if (val > 0) return { bg: '#22C55E33', text: '#22C55E' }
  return null
}

export function OverlapLens() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'stocks'>('matrix')
  const funds = mockFunds.filter((f) => SELECTED_FUNDS.includes(f.id))
  const lm = useUIStore((s) => s.lightMode)

  const card = lm ? 'bg-white border border-[#E8E8F0] shadow-sm' : 'bg-[#141414] border border-[#2A2A2A]'
  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#A0A0A0]'
  const textMuted = lm ? 'text-[#9CA3AF]' : 'text-[#606060]'
  const rowHover = lm ? 'hover:bg-[#F9F9FF]' : 'hover:bg-[#1A1A1A]'
  const rowBorder = lm ? 'border-[#F0F0F8]' : 'border-[#1E1E1E]'
  const dividerColor = lm ? 'border-[#E8E8F0]' : 'border-[#2A2A2A]'
  const emptyCell = lm ? 'text-[#D1D5DB]' : 'text-[#2A2A2A]'

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl ${lm ? 'bg-white border border-[#E8E8F0] shadow-sm' : 'bg-[#1A1A1A] border border-[#2A2A2A]'} flex items-center justify-center`}>
          <BlurOnIcon sx={{ fontSize: 18, color: '#C5F135' }} />
        </div>
        <div>
          <h1 className={`text-lg font-bold ${text}`}>Overlap Lens</h1>
          <p className={`text-xs ${textMuted}`}>Portfolio overlap analysis across your funds</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex gap-0 ${lm ? 'bg-[#F3F4F6] border border-[#E8E8F0]' : 'bg-[#141414] border border-[#2A2A2A]'} rounded-xl p-1 w-fit`}>
        {(['matrix', 'stocks'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: activeTab === t ? '#C5F135' : 'transparent', color: activeTab === t ? '#000' : lm ? '#6B7280' : '#A0A0A0' }}
          >
            {t === 'matrix' ? 'Overlap Matrix' : 'Common Stocks'}
          </button>
        ))}
      </div>

      <PlanGate requiredTier="pro" label="Unlock Overlap Lens">
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            {/* Legend */}
            <div className="flex items-center gap-4 text-xs">
              {[
                { color: '#C5F135', label: 'Same fund (100%)' },
                { color: '#EF4444', label: 'High overlap (>20%)' },
                { color: '#F59E0B', label: 'Medium overlap (10–20%)' },
                { color: '#22C55E', label: 'Low overlap (<10%)' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded" style={{ background: l.color }} />
                  <span className={textSub}>{l.label}</span>
                </div>
              ))}
            </div>

            {/* Matrix table */}
            <div className={`${card} rounded-2xl overflow-hidden`}>
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${dividerColor}`}>
                    <th className={`text-left px-5 py-3 text-[11px] font-semibold ${textMuted} uppercase tracking-wider w-52`}>Fund</th>
                    {funds.map((f) => (
                      <th key={f.id} className="px-3 py-3 text-center">
                        <p className={`text-[11px] font-medium ${text} truncate max-w-28`}>{f.name.split(' ').slice(0, 2).join(' ')}</p>
                        <p className={`text-[10px] ${textMuted}`}>{f.subCategory}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {funds.map((rowFund) => (
                    <tr key={rowFund.id} className={`border-b ${rowBorder} last:border-0 ${rowHover} transition-colors`}>
                      <td className="px-5 py-3">
                        <p className={`text-sm font-medium ${text}`}>{rowFund.name.split(' ').slice(0, 3).join(' ')}</p>
                        <p className={`text-[11px] ${textMuted}`}>{rowFund.subCategory}</p>
                      </td>
                      {funds.map((colFund) => {
                        const val = OVERLAP_MATRIX[rowFund.id]?.[colFund.id] ?? 0
                        const colors = getColor(val)
                        const bgColor = colors ? colors.bg : (lm ? '#F3F4F6' : '#1A1A1A')
                        const textColor = colors ? colors.text : (lm ? '#9CA3AF' : '#606060')
                        return (
                          <td key={colFund.id} className="px-3 py-3 text-center">
                            <div className="inline-flex items-center justify-center w-14 h-10 rounded-lg text-sm font-bold" style={{ background: bgColor, color: textColor }}>
                              {val}%
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Insight */}
            <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl px-4 py-3">
              <p className={`text-xs ${textSub}`}>
                <span className="text-[#F59E0B] font-semibold">Moderate overlap detected</span> — HDFC Mid-Cap Opportunities and SBI Small Cap share 22% overlap, indicating similar mid/small cap stock picks. Consider this when rebalancing.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'stocks' && (
          <div className={`${card} rounded-2xl overflow-hidden`}>
            <div className={`grid px-5 py-3 border-b ${dividerColor}`} style={{ gridTemplateColumns: '1fr repeat(4, 90px)' }}>
              <span className={`text-[11px] font-semibold ${textMuted} uppercase tracking-wider`}>Stock</span>
              {funds.map((f) => (
                <span key={f.id} className={`text-[11px] font-semibold ${textMuted} uppercase tracking-wider text-center truncate`}>
                  {f.name.split(' ')[0]}
                </span>
              ))}
            </div>
            {COMMON_STOCKS.map((stock, i) => (
              <div key={stock.name} className={`grid px-5 py-3 items-center border-b ${rowBorder} ${rowHover} transition-colors`} style={{ gridTemplateColumns: '1fr repeat(4, 90px)', borderBottomColor: i === COMMON_STOCKS.length - 1 ? 'transparent' : undefined }}>
                <span className={`text-sm font-medium ${text}`}>{stock.name}</span>
                {SELECTED_FUNDS.map((fid) => {
                  const val = ((stock as unknown) as Record<string, number>)[fid] ?? 0
                  return (
                    <div key={fid} className="text-center">
                      {val > 0 ? (
                        <span className="text-xs font-semibold text-[#22C55E]">{val.toFixed(1)}%</span>
                      ) : (
                        <span className={`text-xs ${emptyCell}`}>—</span>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </PlanGate>
    </div>
  )
}

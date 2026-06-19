import { Link } from 'react-router-dom'
import { VolatilityBadge } from './VolatilityBadge'
import { PlanGate } from './PlanGate'
import { useUIStore } from '../../stores/uiStore'
import type { Fund } from '../../types'

interface FundCardProps {
  fund: Fund
  showReturns?: boolean
}

export function FundCard({ fund, showReturns = true }: FundCardProps) {
  const lm = useUIStore((s) => s.lightMode)

  return (
    <Link
      to={`/mutual-funds/search/${fund.id}`}
      className={`block rounded-xl p-4 transition-all group border ${
        lm
          ? 'bg-white border-[#E0E3E8] hover:border-[#4f46e5]/40 hover:shadow-sm'
          : 'bg-[#14171c] border-[#1e2838] hover:border-[#d6fd70]/30'
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
          lm ? 'bg-[#F3F4F6] text-[#4f46e5]' : 'bg-[#1e2838] text-[#d6fd70]'
        }`}>
          {fund.amcName.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-semibold transition-colors line-clamp-2 leading-tight ${
            lm ? 'text-[#111827] group-hover:text-[#4f46e5]' : 'text-white group-hover:text-[#d6fd70]'
          }`}>
            {fund.name}
          </p>
          <p className={`text-xs mt-0.5 ${lm ? 'text-[#6B7280]' : 'text-[#8390a2]'}`}>{fund.amcName}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {fund.tags.slice(0, 2).map((tag) => (
          <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${
            lm ? 'bg-[#F3F4F6] text-[#6B7280]' : 'bg-[#1e2838] text-[#8390a2]'
          }`}>
            {tag}
          </span>
        ))}
        <VolatilityBadge level={fund.volatility} />
      </div>

      <div className={`flex items-center justify-between border-t pt-3 ${lm ? 'border-[#F0F0F8]' : 'border-[#1e2838]'}`}>
        <div>
          <p className={`text-xs ${lm ? 'text-[#6B7280]' : 'text-[#8390a2]'}`}>NAV</p>
          <p className={`text-sm font-semibold ${lm ? 'text-[#111827]' : 'text-white'}`}>₹{fund.nav.toFixed(2)}</p>
          <p className={`text-xs ${fund.navChangePercent >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {fund.navChangePercent >= 0 ? '+' : ''}{fund.navChangePercent.toFixed(2)}%
          </p>
        </div>

        {showReturns && (
          <div className="text-right">
            <p className={`text-xs ${lm ? 'text-[#6B7280]' : 'text-[#8390a2]'}`}>1Y Returns</p>
            <PlanGate requiredTier="free" compact>
              <p className="text-sm font-semibold text-[#22C55E]">
                {fund.returns['1Y'] ? `+${fund.returns['1Y']}%` : '—'}
              </p>
            </PlanGate>
          </div>
        )}

        {showReturns && fund.returns['3Y'] && (
          <div className="text-right">
            <p className={`text-xs ${lm ? 'text-[#6B7280]' : 'text-[#8390a2]'}`}>3Y CAGR</p>
            <PlanGate requiredTier="pro" compact>
              <p className="text-sm font-semibold text-[#22C55E]">
                +{fund.returns['3Y']}%
              </p>
            </PlanGate>
          </div>
        )}
      </div>
    </Link>
  )
}

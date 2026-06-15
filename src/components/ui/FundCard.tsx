import { Link } from 'react-router-dom'
import { VolatilityBadge } from './VolatilityBadge'
import { PlanGate } from './PlanGate'
import type { Fund } from '../../types'

interface FundCardProps {
  fund: Fund
  showReturns?: boolean
}

export function FundCard({ fund, showReturns = true }: FundCardProps) {
  return (
    <Link
      to={`/mutual-funds/search/${fund.id}`}
      className="block bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 hover:border-[#C5F135]/30 transition-all group"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-[#2A2A2A] flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#C5F135]">
          {fund.amcName.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white group-hover:text-[#C5F135] transition-colors line-clamp-2 leading-tight">
            {fund.name}
          </p>
          <p className="text-xs text-[#A0A0A0] mt-0.5">{fund.amcName}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {fund.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="text-xs bg-[#2A2A2A] text-[#A0A0A0] px-2 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
        <VolatilityBadge level={fund.volatility} />
      </div>

      <div className="flex items-center justify-between border-t border-[#2A2A2A] pt-3">
        <div>
          <p className="text-xs text-[#A0A0A0]">NAV</p>
          <p className="text-sm font-semibold text-white">₹{fund.nav.toFixed(2)}</p>
          <p className={`text-xs ${fund.navChangePercent >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {fund.navChangePercent >= 0 ? '+' : ''}{fund.navChangePercent.toFixed(2)}%
          </p>
        </div>

        {showReturns && (
          <div className="text-right">
            <p className="text-xs text-[#A0A0A0]">1Y Returns</p>
            <PlanGate requiredTier="free" compact>
              <p className="text-sm font-semibold text-[#22C55E]">
                {fund.returns['1Y'] ? `+${fund.returns['1Y']}%` : '—'}
              </p>
            </PlanGate>
          </div>
        )}

        {showReturns && fund.returns['3Y'] && (
          <div className="text-right">
            <p className="text-xs text-[#A0A0A0]">3Y CAGR</p>
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

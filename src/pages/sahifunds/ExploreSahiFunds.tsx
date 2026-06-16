import { Link } from 'react-router-dom'
import { Sparkle as AutoAwesomeIcon } from '@phosphor-icons/react'
import { VolatilityBadge } from '../../components/ui/VolatilityBadge'
import { PlanGate } from '../../components/ui/PlanGate'
import { PlanBadge } from '../../components/ui/PlanBadge'
import { mockSahiFunds } from '../../data/sahiFunds'
import type { PlanTier } from '../../types'

export function ExploreSahiFunds() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AutoAwesomeIcon size={18} color="#d6fd70" weight="duotone" />
            <h1 className="text-lg font-semibold text-white">Sahi MF Funds</h1>
          </div>
          <p className="text-xs text-[#8390a2] max-w-lg">
            Curated mutual fund portfolios built by the SahiMF research desk. No personalization —
            research-driven, rules-based, and transparently constructed.
          </p>
        </div>
        <div className="bg-[#d6fd70]/10 border border-[#d6fd70]/20 rounded-xl px-4 py-3 text-center">
          <p className="text-[#d6fd70] text-xl font-bold">{mockSahiFunds.length}</p>
          <p className="text-xs text-[#8390a2]">Portfolios</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-[#14171c] border border-[#F59E0B]/20 rounded-xl px-4 py-3">
        <p className="text-xs text-[#F59E0B]">
          <strong>Important:</strong> Sahi MF Funds are curated research portfolios, not personalized investment advice.
          Past performance does not guarantee future returns. Please read all scheme documents before investing.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['All', 'Low Risk', 'ELSS', 'Index / Passive', 'Growth'].map((f) => (
          <button
            key={f}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              f === 'All'
                ? 'bg-[#d6fd70] text-black font-semibold border-[#d6fd70]'
                : 'border-[#1e2838] text-[#8390a2] hover:border-[#d6fd70]/40 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Fund grid */}
      <div className="grid grid-cols-2 gap-4">
        {mockSahiFunds.map((fund) => (
          <Link key={fund.id} to={`/mutual-funds/sahi-funds/${fund.id}`}>
            <div className="bg-[#14171c] border border-[#1e2838] rounded-xl p-5 hover:border-[#d6fd70]/30 transition-all group h-full flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#d6fd70]/10 flex items-center justify-center flex-shrink-0">
                  <AutoAwesomeIcon size={18} color="#d6fd70" weight="duotone" />
                </div>
                <div className="flex items-center gap-2">
                  <PlanBadge tier={fund.accessTier as PlanTier} />
                  <VolatilityBadge level={fund.volatility} />
                </div>
              </div>

              <h3 className="text-sm font-semibold text-white group-hover:text-[#d6fd70] transition-colors mb-1">
                {fund.name}
              </h3>
              <p className="text-xs text-[#8390a2] leading-relaxed mb-4 flex-1">
                {fund.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {fund.tags.map((t) => (
                  <span key={t} className="text-xs bg-[#1e2838] text-[#8390a2] px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#1e2838]">
                <div>
                  <p className="text-[10px] text-[#64748b] mb-0.5">Min Amount</p>
                  <p className="text-xs font-semibold text-white">₹{fund.minAmount.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#64748b] mb-0.5">{fund.fundCount} Funds</p>
                  <p className="text-xs font-semibold text-white">{fund.rebalanceFrequency}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[#64748b] mb-0.5">1Y Returns</p>
                  <PlanGate requiredTier={fund.accessTier as PlanTier} compact>
                    <p className="text-xs font-semibold text-[#22C55E]">
                      {fund.returns['1Y'] ? `+${fund.returns['1Y']}%` : '—'}
                    </p>
                  </PlanGate>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

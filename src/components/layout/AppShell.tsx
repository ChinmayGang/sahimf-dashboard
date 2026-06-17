import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useUIStore } from '../../stores/uiStore'

function LegalFooter({ lm }: { lm: boolean }) {
  return (
    <footer
      className="px-6 py-3 flex-shrink-0"
      style={{
        borderTop: `1px solid ${lm ? '#E0E3E8' : '#1e2838'}`,
        background: lm ? '#F9F9FF' : '#0a0c0e',
      }}
    >
      <p style={{ fontSize: 10, lineHeight: '1.5', color: lm ? '#9CA3AF' : '#505d6f' }}>
        Mutual Fund investments are subject to market risks. Please read all scheme-related documents carefully before investing.
        Past performance is not indicative of future returns. SahiMF is a SEBI-registered Research Analyst — this platform provides
        generic research analysis only and does not constitute personalised investment advice. Please confirm with the AMC for details
        of any scheme. By using this platform, you confirm that you have read and understood the scheme information documents provided
        by the respective AMCs and agree to the terms and conditions.{' '}
        <span style={{ fontWeight: 600, color: lm ? '#6B7280' : '#3c4653' }}>
          NO COMMISSION RECEIVED FROM ANY INDIAN MUTUAL FUND HOUSE, EVER.
        </span>
      </p>
    </footer>
  )
}

export function AppShell() {
  const lightMode = useUIStore((s) => s.lightMode)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: lightMode ? '#ffffff' : '#0A0A0A' }}>
      <Sidebar />
      <div
        className="flex flex-col flex-1 overflow-hidden"
        style={{ background: lightMode ? '#ffffff' : '#0A0A0A' }}
        data-theme={lightMode ? 'light' : 'dark'}
      >
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
          <LegalFooter lm={lightMode} />
        </main>
      </div>
    </div>
  )
}

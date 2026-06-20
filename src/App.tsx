import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from './components/layout/AppShell'
import { Overview } from './pages/overview/Overview'
import { Portfolios } from './pages/portfolios/Portfolios'
import { PortfolioDetail } from './pages/portfolios/PortfolioDetail'
import { Transactions } from './pages/portfolios/Transactions'
import { SchemeDetail } from './pages/research/SchemeDetail'
import { MFScorecard } from './pages/research/MFScorecard'
import { FundManager } from './pages/research/FundManager'
import { ExploreFunds } from './pages/sahifunds/ExploreFunds'
import { AllSchemes } from './pages/sahifunds/AllSchemes'
import { SahiFundDetail } from './pages/sahifunds/SahiFundDetail'
import { MySahiFunds } from './pages/sahifunds/MySahiFunds'
import { OverlapLens } from './pages/analysis/OverlapLens'
import { FundComparison } from './pages/analysis/FundComparison'
import { MarketCapAllocation } from './pages/analysis/MarketCapAllocation'
import { RiskAnalysis } from './pages/analysis/RiskAnalysis'
import { Calculator } from './pages/tools/Calculator'
import { Baskets } from './pages/sahifunds/Baskets'
import { Goals } from './pages/sahifunds/Goals'
import { Dividends } from './pages/reports/Dividends'
import { TaxReport } from './pages/reports/TaxReport'
import { MFPMSDisclosures } from './pages/reports/MFPMSDisclosures'
import { Settings } from './pages/settings/Settings'
import { Login } from './pages/auth/Login'
import { OTP } from './pages/auth/OTP'
import { CreateProfile } from './pages/auth/CreateProfile'
import { InitializePortfolio } from './pages/auth/InitializePortfolio'
import { VerifyEmail } from './pages/auth/VerifyEmail'
import { DesignSystem } from './pages/design-system/DesignSystem'
import { Pricing } from './pages/pricing/Pricing'
import { useAuthStore } from './stores/authStore'

const queryClient = new QueryClient()

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/otp" element={<OTP />} />
          <Route path="/auth/create-profile" element={<CreateProfile />} />
          <Route path="/auth/initialize" element={<InitializePortfolio />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
          <Route path="/design-system" element={<DesignSystem />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/mutual-funds" replace />} />
            <Route path="mutual-funds" element={<Overview />} />
            <Route path="mutual-funds/portfolios" element={<Portfolios />} />
            <Route path="mutual-funds/portfolios/:id" element={<PortfolioDetail />} />
            <Route path="mutual-funds/transactions" element={<Transactions />} />
            <Route path="mutual-funds/explore" element={<ExploreFunds />} />
            <Route path="mutual-funds/explore/all" element={<AllSchemes />} />
            <Route path="mutual-funds/sahi-funds" element={<Navigate to="/mutual-funds/explore" replace />} />
            <Route path="mutual-funds/sahi-funds/:id" element={<SahiFundDetail />} />
            <Route path="mutual-funds/my-sahi-funds" element={<MySahiFunds />} />
            <Route path="mutual-funds/overlap" element={<OverlapLens />} />
            <Route path="mutual-funds/compare" element={<FundComparison />} />
            <Route path="mutual-funds/market-cap" element={<MarketCapAllocation />} />
            <Route path="mutual-funds/risk" element={<RiskAnalysis />} />
            <Route path="mutual-funds/search" element={<Navigate to="/mutual-funds/explore/all" replace />} />
            <Route path="mutual-funds/search/:id" element={<SchemeDetail />} />
            <Route path="mutual-funds/scorecard" element={<MFScorecard />} />
            <Route path="mutual-funds/amfi" element={<FundManager />} />
            <Route path="mutual-funds/baskets" element={<Baskets />} />
            <Route path="mutual-funds/goals" element={<Goals />} />
            {/* All tools merged into one tabbed page; legacy paths deep-link to a tab */}
            <Route path="mutual-funds/tools/sip" element={<Calculator />} />
            <Route path="mutual-funds/tools/sip-whatif" element={<Navigate to="/mutual-funds/tools/sip" replace />} />
            <Route path="mutual-funds/tools/lumpsum" element={<Navigate to="/mutual-funds/tools/sip?tab=lumpsum" replace />} />
            <Route path="mutual-funds/tools/swp" element={<Navigate to="/mutual-funds/tools/sip?tab=swp" replace />} />
            <Route path="mutual-funds/tools/stp" element={<Navigate to="/mutual-funds/tools/sip?tab=stp" replace />} />
            <Route path="mutual-funds/dividends" element={<Dividends />} />
            <Route path="mutual-funds/reports/tax" element={<TaxReport />} />
            <Route path="mutual-funds/reports/mfpms" element={<MFPMSDisclosures />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

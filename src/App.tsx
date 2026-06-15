import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from './components/layout/AppShell'
import { Overview } from './pages/overview/Overview'
import { Portfolios } from './pages/portfolios/Portfolios'
import { PortfolioDetail } from './pages/portfolios/PortfolioDetail'
import { Transactions } from './pages/portfolios/Transactions'
import { SearchSchemes } from './pages/research/SearchSchemes'
import { SchemeDetail } from './pages/research/SchemeDetail'
import { MFScorecard } from './pages/research/MFScorecard'
import { FundManager } from './pages/research/FundManager'
import { ExploreSahiFunds } from './pages/sahifunds/ExploreSahiFunds'
import { SahiFundDetail } from './pages/sahifunds/SahiFundDetail'
import { MySahiFunds } from './pages/sahifunds/MySahiFunds'
import { OverlapLens } from './pages/analysis/OverlapLens'
import { FundComparison } from './pages/analysis/FundComparison'
import { Calculator } from './pages/tools/Calculator'
import { Dividends } from './pages/reports/Dividends'
import { TaxReport } from './pages/reports/TaxReport'
import { MFPMSDisclosures } from './pages/reports/MFPMSDisclosures'
import { Login } from './pages/auth/Login'
import { OTP } from './pages/auth/OTP'
import { CreateProfile } from './pages/auth/CreateProfile'
import { InitializePortfolio } from './pages/auth/InitializePortfolio'
import { DesignSystem } from './pages/design-system/DesignSystem'

const queryClient = new QueryClient()

const ComingSoon = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center h-full min-h-64">
    <div className="text-center">
      <p className="text-[#A0A0A0] text-sm font-medium">{name}</p>
      <p className="text-[#606060] text-xs mt-1">Coming soon</p>
    </div>
  </div>
)

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/otp" element={<OTP />} />
          <Route path="/auth/create-profile" element={<CreateProfile />} />
          <Route path="/auth/initialize" element={<InitializePortfolio />} />
          <Route path="/design-system" element={<DesignSystem />} />
          <Route path="/" element={<AppShell />}>
            <Route index element={<Navigate to="/mutual-funds" replace />} />
            <Route path="mutual-funds" element={<Overview />} />
            <Route path="mutual-funds/portfolios" element={<Portfolios />} />
            <Route path="mutual-funds/portfolios/:id" element={<PortfolioDetail />} />
            <Route path="mutual-funds/transactions" element={<Transactions />} />
            <Route path="mutual-funds/sahi-funds" element={<ExploreSahiFunds />} />
            <Route path="mutual-funds/sahi-funds/:id" element={<SahiFundDetail />} />
            <Route path="mutual-funds/my-sahi-funds" element={<MySahiFunds />} />
            <Route path="mutual-funds/overlap" element={<OverlapLens />} />
            <Route path="mutual-funds/compare" element={<FundComparison />} />
            <Route path="mutual-funds/search" element={<SearchSchemes />} />
            <Route path="mutual-funds/search/:id" element={<SchemeDetail />} />
            <Route path="mutual-funds/scorecard" element={<MFScorecard />} />
            <Route path="mutual-funds/amfi" element={<FundManager />} />
            <Route path="mutual-funds/tools/sip" element={<Calculator />} />
            <Route path="mutual-funds/tools/lumpsum" element={<Calculator />} />
            <Route path="mutual-funds/tools/swp" element={<Calculator />} />
            <Route path="mutual-funds/tools/stp" element={<Calculator />} />
            <Route path="mutual-funds/dividends" element={<Dividends />} />
            <Route path="mutual-funds/reports/tax" element={<TaxReport />} />
            <Route path="mutual-funds/reports/mfpms" element={<MFPMSDisclosures />} />
            <Route path="investments" element={<ComingSoon name="Investments" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

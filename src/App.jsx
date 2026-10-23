import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import Layout from './components/Layout'
import { useVani } from './contexts/VaniContext'
import { useFarmer } from './contexts/FarmerContext'
import { useAuth } from './contexts/AuthContext'
import { SettingsProvider } from './contexts/SettingsContext'
import NotificationEngine from './components/NotificationEngine'
import AuthLayout from './components/AuthLayout'
import VaniWidget from './components/Vani/VaniWidget'
import ScrollToTop from './components/ScrollToTop'

// ── Lazy load all pages ────────────────────────────────────────────────────
const FarmerDashboard  = lazy(() => import('./components/FarmerDashboard'))
const CropManagement   = lazy(() => import('./pages/CropManagement'))

// Crop Ecosystem Pages
const CropWorkspace    = lazy(() => import('./pages/crops/CropWorkspace'))
const CropGrowth       = lazy(() => import('./pages/crops/CropGrowth'))
const CropIrrigation   = lazy(() => import('./pages/crops/CropIrrigation'))
const CropFertilizer   = lazy(() => import('./pages/crops/CropFertilizer'))
const CropMoreTools    = lazy(() => import('./pages/crops/CropMoreTools'))
const CropSoilHealth   = lazy(() => import('./pages/crops/CropSoilHealth'))
const CropWeather      = lazy(() => import('./pages/crops/CropWeather'))
const CropCalendar     = lazy(() => import('./pages/crops/CropCalendar'))
const CropInputRecords = lazy(() => import('./pages/crops/CropInputRecords'))
const CropYieldEstimator = lazy(() => import('./pages/crops/CropYieldEstimator'))
const CropFarmExpenses = lazy(() => import('./pages/crops/CropFarmExpenses'))
const CropReports      = lazy(() => import('./pages/crops/CropReports'))
const CropNotes        = lazy(() => import('./pages/crops/CropNotes'))

// Removed standalone VaniPage to consolidate into VaniWidget
const ToxiGuard        = lazy(() => import('./components/ToxiGuard'))
const CropNutrition    = lazy(() => import('./components/CropNutrition'))
const FertilisersPage  = lazy(() => import('./pages/FertilisersPage'))
const LivestockMonitor = lazy(() => import('./components/LivestockMonitor'))
const ThermaPlan       = lazy(() => import('./components/ThermaPlan'))
const SatWaterMonitor  = lazy(() => import('./components/SatWaterMonitor'))
const HealMarketplace  = lazy(() => import('./components/HealMarketplace'))
const NewsCenter       = lazy(() => import('./pages/NewsCenter'))
const SchemesCenter    = lazy(() => import('./pages/SchemesCenter'))
const Records          = lazy(() => import('./pages/Records'))
const Notifications    = lazy(() => import('./pages/Notifications'))
const Profile          = lazy(() => import('./pages/Profile'))
const Settings         = lazy(() => import('./pages/Settings'))
const FarmCare         = lazy(() => import('./pages/FarmCare'))
const ToolsStore       = lazy(() => import('./pages/ToolsStore'))
const CommunityPage    = lazy(() => import('./pages/CommunityPage'))
// Removed AILearningPage to consolidate AI features
const AIAssistant      = lazy(() => import('./pages/AIAssistant'))
const HelpSupportPage  = lazy(() => import('./pages/HelpSupportPage'))

// Auth Pages
const Onboarding       = lazy(() => import('./pages/auth/Onboarding'))
const LanguageSelect   = lazy(() => import('./pages/auth/LanguageSelect'))
const Welcome          = lazy(() => import('./pages/auth/Welcome'))
const Login            = lazy(() => import('./pages/auth/Login'))
const Register         = lazy(() => import('./pages/auth/Register'))
const VerifyOTP        = lazy(() => import('./pages/auth/VerifyOTP'))
const ForgotPassword   = lazy(() => import('./pages/auth/ForgotPassword'))
const ProfileSetup     = lazy(() => import('./pages/auth/ProfileSetup'))

// ── Skeleton fallback ──────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[1, 2, 3].map(i => (
        <div key={i} className="skeleton" style={{ height: i === 1 ? 200 : 80, borderRadius: 16 }} />
      ))}
    </div>
  )
}

// ── App shell ──────────────────────────────────────────────────────────────
export default function App() {
  const { greet } = useVani()
  const { profile } = useFarmer()
  const { isAuthenticated, hasCompletedOnboarding } = useAuth()
  const location = useLocation()

  // Routes where VaniWidget should be visible
  const showVaniWidget = ['/farm-care', '/market', '/help'].some(path => location.pathname.startsWith(path));

  // Greet on first load
  useEffect(() => {
    const greeted = sessionStorage.getItem('ah-greeted')
    if (!greeted) {
      sessionStorage.setItem('ah-greeted', '1')
      const firstName = profile?.name ? profile.name.split(' ')[0] : 'Farmer'
      setTimeout(() => greet(firstName, '38°C with partial clouds'), 1200)
    }
  }, []) // eslint-disable-line

  return (
    <>
      <ScrollToTop />
      {showVaniWidget && <VaniWidget />}
      <SettingsProvider>
        <NotificationEngine />
      <Suspense fallback={<PageLoader />}>
        {!isAuthenticated ? (
          <Routes location={location}>
            <Route element={<AuthLayout />}>
              <Route path="/" element={
                <Navigate to={
                  !localStorage.getItem('ah-lang') ? "/lang" : (hasCompletedOnboarding ? "/welcome" : "/onboarding")
                } replace />
              } />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/lang" element={<LanguageSelect />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<VerifyOTP />} />
              <Route path="/forgot" element={<ForgotPassword />} />
              <Route path="/setup" element={<ProfileSetup />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        ) : (
          <Layout>
            <Routes location={location}>
              <Route path="/"             element={<Navigate to="/home" replace />} />
              <Route path="/home"         element={<FarmerDashboard  setPage={() => {}} onSpeak={() => {}} />} />
            <Route path="/crops"        element={<CropManagement />} />
            <Route path="/crops/:id"            element={<CropWorkspace />} />
            <Route path="/crops/:id/growth"     element={<CropWorkspace />} />
            <Route path="/crops/:id/water"      element={<CropWorkspace />} />
            <Route path="/crops/:id/nutrition"  element={<CropWorkspace />} />
            <Route path="/farm-care"            element={<FarmCare />} />
            <Route path="/crops/:id/irrigation" element={<CropIrrigation />} />
            <Route path="/crops/:id/fertilizer" element={<CropFertilizer />} />
            <Route path="/crops/:id/more"       element={<CropMoreTools />} />
            <Route path="/crops/:id/soil"       element={<CropSoilHealth />} />
            <Route path="/crops/:id/weather"    element={<CropWeather />} />
            <Route path="/crops/:id/calendar"   element={<CropCalendar />} />
            <Route path="/crops/:id/inputs"     element={<CropInputRecords />} />
            <Route path="/crops/:id/yield"      element={<CropYieldEstimator />} />
            <Route path="/crops/:id/expenses"   element={<CropFarmExpenses />} />
            <Route path="/crops/:id/reports"    element={<CropReports />} />
            <Route path="/crops/:id/notes"      element={<CropNotes />} />
            <Route path="/farm-care"    element={<FarmCare />} />
            {/* Removed /vani route */}
            <Route path="/toxi"         element={<ToxiGuard        onSpeak={() => {}} />} />
            <Route path="/fertilisers"  element={<FertilisersPage />} />
            <Route path="/nutri"        element={<CropNutrition    onSpeak={() => {}} />} />
            <Route path="/livestock"    element={<LivestockMonitor onSpeak={() => {}} />} />
            <Route path="/therma"       element={<ThermaPlan       onSpeak={() => {}} />} />
            <Route path="/water"        element={<SatWaterMonitor  onSpeak={() => {}} />} />
            <Route path="/market"       element={<HealMarketplace  onSpeak={() => {}} />} />
            <Route path="/news"         element={<NewsCenter />} />
            <Route path="/schemes"      element={<SchemesCenter />} />
            <Route path="/records"      element={<Records />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile"      element={<Profile />} />
            <Route path="/settings/*"   element={<Settings />} />
            <Route path="/store"        element={<ToolsStore />} />
            <Route path="/community"    element={<CommunityPage />} />
            <Route path="/assistant"    element={<AIAssistant />} />
            <Route path="/help"         element={<HelpSupportPage />} />
              <Route path="*"             element={<Navigate to="/home" replace />} />
            </Routes>
          </Layout>
        )}
      </Suspense>
    </SettingsProvider>
    </>
  )
}

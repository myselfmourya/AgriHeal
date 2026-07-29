import { useState, useEffect } from 'react'
import { useLocation, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { 
  Home, 
  Leaf, 
  Bot, 
  CloudSun, 
   
   
  Wrench, 
  Users, 
  
  
  Bell,
  
  
  
  Droplet,
  
  
  ClipboardList,
  
  LineChart,
  
  X,
  Settings,
  Camera,
  Headset
} from 'lucide-react'
import { useVani } from '../contexts/VaniContext'
import VaniOverlay from './VaniOverlay'
import TopNavigation from './navigation/TopNavigation'
import { useTranslation } from 'react-i18next'

const NAV = [
  { to: '/home', icon: Home, label: 'Dashboard' },
  { to: '/crops', icon: Leaf, label: 'Crop Management' },
  { to: '/fertilisers', icon: Droplet, label: 'Fertilisers' },
  { to: '/farm-care', icon: CloudSun, label: 'Farm Care' },
  { to: '/store', icon: Wrench, label: 'Tools' },
  { to: '/market', icon: LineChart, label: 'Market & Finance' },
  { to: '/notifications', icon: Bell, label: 'Alerts & Reminders' },
  { to: '/schemes', icon: ClipboardList, label: 'Schemes & Insurances' },
  { to: '/community', icon: Users, label: 'Community & Services' },
  { to: '/assistant', icon: Bot, label: 'AI & Learning' },
  { to: '/analysis', icon: Camera, label: 'Image Analysis' },
  { to: '/help', icon: Headset, label: 'Help & Support' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Layout({ children }) {
  const { overlay, closeVani } = useVani()
  const location = useLocation()
  const { t } = useTranslation()
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-[#e8efe9] text-gray-900 font-sans p-0 md:p-4">
      {/* App Wrapper */}
      <div className="flex flex-1 bg-white md:rounded-[32px] md:shadow-2xl overflow-hidden relative">
        
        {/* Desktop / Tablet Sidebar */}
        <aside className="hidden md:flex flex-col w-[80px] lg:w-[260px] py-6 border-r border-gray-100 shrink-0 z-10 bg-white transition-all duration-300">
          {/* Logo */}
          <div className="mb-8 flex flex-col lg:flex-row items-center gap-3 px-4 lg:px-6">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <div className="hidden lg:block">
              <span className="text-gray-900 font-bold text-lg tracking-wide block leading-tight">AgriHeal</span>
              <span className="text-[10px] text-gray-500 font-medium">Smart AI Farming Assistant</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 w-full px-3 lg:px-4 flex-1 overflow-y-auto scrollbar-hide">
            {NAV.map(n => {
              const Icon = n.icon
              return (
                <NavLink 
                  key={n.to} 
                  to={n.to} 
                  className={({ isActive }) => `
                    flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-[#e6f4ea] text-green-700 font-semibold' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-medium'
                    }
                  `}
                  title={n.label}
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0 mx-auto lg:mx-0" />
                      <span className="hidden lg:block text-sm whitespace-nowrap">{t(`nav.${n.label}`)}</span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Talk to Vani Card (Desktop) - Removed per user request */}
        </aside>

        {/* Mobile Slide-out Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.aside 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                className="md:hidden fixed inset-y-0 left-0 w-[280px] bg-white z-50 shadow-2xl flex flex-col py-6"
              >
                <div className="flex items-center justify-between px-6 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                      <Leaf className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <span className="text-gray-900 font-bold text-lg tracking-wide block leading-tight">AgriHeal</span>
                      <span className="text-[10px] text-gray-500 font-medium">Smart AI Farming Assistant</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="flex flex-col gap-1 w-full px-4 flex-1 overflow-y-auto scrollbar-hide">
                  {NAV.map(n => {
                    const Icon = n.icon
                    return (
                      <NavLink 
                        key={n.to} 
                        to={n.to} 
                        className={({ isActive }) => `
                          flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                          ${isActive 
                            ? 'bg-[#e6f4ea] text-green-700 font-semibold' 
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-medium'
                          }
                        `}
                      >
                        {({ isActive }) => (
                          <>
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                            <span className="text-sm whitespace-nowrap font-medium">{t(`nav.${n.label}`)}</span>
                          </>
                        )}
                      </NavLink>
                    )
                  })}
                </nav>

                {/* Talk to Vani Card (Mobile) - Removed per user request */}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col min-w-0 bg-[#f8faf9] relative h-full">
          
          <TopNavigation setIsMobileMenuOpen={setIsMobileMenuOpen} />

          <main className="flex-1 overflow-y-auto scrollbar-hide relative bg-[#f4f7f5]">
            <AnimatePresence mode="wait">
              <motion.div 
                key={location.pathname} 
                className="min-h-full"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Vani Overlay */}
      <AnimatePresence>
        {overlay && <VaniOverlay onClose={closeVani} />}
      </AnimatePresence>
    </div>
  )
}

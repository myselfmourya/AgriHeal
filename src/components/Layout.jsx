import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Home, Leaf, FileText, Settings, Bot, Menu, X, LeafyGreen } from 'lucide-react';
import { useVani } from '../contexts/VaniContext';
import VaniOverlay from './VaniOverlay';
import { useTranslation } from 'react-i18next';
import { useFarmer } from '../contexts/FarmerContext';

// Utility for classes
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { overlay, closeVani, startVaniSession } = useVani();
  const { profile } = useFarmer();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: Home, href: '/home', label: 'Home' },
    { icon: Leaf, href: '/crops', label: 'Crops' },
    { icon: Bot, href: '/assistant', label: 'AI Assistant' },
    { icon: FileText, href: '/records', label: 'Farm Locker' },
    { icon: Settings, href: '/settings', label: 'Settings' },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex w-full min-h-[100dvh] bg-white relative overflow-hidden">
      
      {/* ── Background Elements (Agriculture Theme) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden hidden md:block">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] min-w-[300px] min-h-[300px] rounded-full bg-green-400/20 mix-blend-multiply filter blur-3xl opacity-50"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[45vw] h-[45vw] min-w-[250px] min-h-[250px] rounded-full bg-emerald-400/20 mix-blend-multiply filter blur-3xl opacity-50"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] left-[20%] w-[60vw] h-[60vw] min-w-[350px] min-h-[350px] rounded-full bg-teal-400/20 mix-blend-multiply filter blur-3xl opacity-50"
        />
      </div>

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 bg-white/80 backdrop-blur-xl border-r border-green-100/50 p-4 fixed h-full z-40 shadow-[4px_0_24px_rgba(34,197,94,0.05)]">
        <div className="flex items-center gap-2 mb-10 px-2 mt-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-green-600/20">
            <LeafyGreen className="w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-gray-900">AgriHeal</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href) && item.href !== '#');
            const Icon = item.icon;
            
            if (item.isFab) {
              return (
                <button 
                  key="fab-desk"
                  onClick={item.action}
                  className="w-full mt-6 bg-gradient-to-br from-slate-900 to-slate-800 text-green-400 hover:from-black hover:to-slate-900 flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 shadow-xl shadow-green-900/10 hover:shadow-green-500/20 group transform hover:-translate-y-1"
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                  <span className="text-sm font-bold tracking-wide text-white">{t(item.label)}</span>
                </button>
              );
            }

            return (
              <Link key={item.href} to={item.href} className="block">
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group",
                  isActive ? "bg-green-50/80 text-green-700 font-bold shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"
                )}>
                  <Icon className={cn("w-5 h-5", isActive ? "text-green-600" : "text-gray-400 group-hover:text-gray-600")} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-sm">{t(item.label)}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ── Main content area ── */}
      <main className="flex-1 flex flex-col w-full h-[100dvh] overflow-hidden bg-transparent relative transition-all md:pl-64">
        {/* Scrollable Container */}
        <div id="main-scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden w-full pb-24 md:pb-8 flex flex-col">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl flex-1 flex flex-col pt-16 md:pt-10 transition-all duration-300">
            {children}
          </div>
        </div>
      </main>

      {/* ── Mobile Bottom Navigation Bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe bg-white/90 backdrop-blur-xl border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.06)]">
        <div className="w-full">
          <nav className="px-2 py-2 flex items-center justify-around relative">
            {navItems.map((item, idx) => {
              const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href) && item.href !== '#');
              const Icon = item.icon;

              if (item.isFab) {
                return (
                  <button 
                    key={`mob-nav-${idx}`}
                    onClick={item.action}
                    className={cn(
                      "relative -top-6 w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all duration-300",
                      overlay
                        ? "bg-gradient-to-br from-slate-900 to-black text-green-400 scale-110 shadow-[0_0_30px_rgba(34,197,94,0.4)] border-4 border-white"
                        : "bg-gradient-to-br from-slate-900 to-slate-800 text-green-400 hover:scale-105 shadow-xl border-4 border-white shadow-green-900/20"
                    )}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2.5} />
                  </button>
                );
              }

              return (
                <Link key={`mob-nav-${idx}`} to={item.href} className="flex-1 flex justify-center">
                  <div className={cn(
                    "flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200",
                    isActive ? "text-green-700 bg-green-100/50" : "text-gray-400 hover:text-gray-600"
                  )}>
                    <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Vani Voice Overlay */}
      <AnimatePresence>
        {overlay && <VaniOverlay onClose={closeVani} />}
      </AnimatePresence>
    </div>
  );
}

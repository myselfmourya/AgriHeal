import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Leaf, Menu } from 'lucide-react';
import SmartSearch from './SmartSearch';
import NotificationCenter from './NotificationCenter';
import MessageCenter from './MessageCenter';
import ProfileMenu from './ProfileMenu';

export default function TopNavigation({ setIsMobileMenuOpen }) {
  const [activeDropdown, setActiveDropdown] = useState(null); // 'search', 'notifications', 'messages', 'profile'
  const navRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setActiveDropdown(prev => prev === 'search' ? null : 'search');
      }
      // Esc to close active dropdown
      if (e.key === 'Escape') {
        setActiveDropdown(null);
      }
      // Ctrl+Shift+N to open new AI chat
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        navigate('/assistant');
      }
      // Ctrl+/ for help
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        navigate('/help');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <header 
      ref={navRef}
      className="sticky top-0 z-50 flex items-center justify-between h-16 md:h-20 px-4 md:px-8 border-b border-gray-100 bg-white/90 backdrop-blur-xl transition-all duration-300"
    >
      {/* LEFT: Branding (Mobile Only) */}
      <div className="md:hidden flex items-center gap-3 shrink-0">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <NavLink 
          to="/home" 
          className="group flex items-center gap-2 relative"
          title="Go to Dashboard"
        >
          <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5 text-green-600" />
          </div>
          <div className="transition-all duration-300">
            <span className="text-gray-900 font-bold text-base tracking-wide block leading-tight">AgriHeal</span>
          </div>
        </NavLink>
      </div>

      {/* CENTER: Smart Search */}
      <div className="flex-1 min-w-[150px] max-w-3xl mx-2 md:mx-4 flex justify-end md:justify-start lg:justify-center relative">
        <SmartSearch 
          isActive={activeDropdown === 'search'} 
          setActive={() => setActiveDropdown(prev => prev === 'search' ? null : 'search')} 
        />
      </div>

      {/* RIGHT: Quick Actions & Profile */}
      <div className="flex items-center gap-1 md:gap-2 shrink-0 relative">
        <NotificationCenter 
          isActive={activeDropdown === 'notifications'} 
          setActive={() => setActiveDropdown(prev => prev === 'notifications' ? null : 'notifications')} 
        />
        <MessageCenter 
          isActive={activeDropdown === 'messages'} 
          setActive={() => setActiveDropdown(prev => prev === 'messages' ? null : 'messages')} 
        />
        
        <div className="w-px h-8 bg-gray-200 hidden md:block mx-1"></div>
        
        <ProfileMenu 
          isActive={activeDropdown === 'profile'} 
          setActive={() => setActiveDropdown(prev => prev === 'profile' ? null : 'profile')} 
        />
      </div>
    </header>
  );
}

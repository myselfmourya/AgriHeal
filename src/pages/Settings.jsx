import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  Settings as SettingsIcon, Globe, Mic, Palette, 
  Leaf, 
    Bell, Shield, Database, WifiOff, 
  AlertTriangle, Info, ChevronRight, Menu, UserCircle
} from 'lucide-react';
import GeneralSettings from './settings/GeneralSettings';
import LanguageSettings from './settings/LanguageSettings';
import VoiceAssistantSettings from './settings/VoiceAssistantSettings';
import DisplayThemeSettings from './settings/DisplayThemeSettings';
import WeatherAlertsSettings from './settings/WeatherAlertsSettings';
import CropFarmSettings from './settings/CropFarmSettings';
import MarketPricesSettings from './settings/MarketPricesSettings';
import IrrigationWaterSettings from './settings/IrrigationWaterSettings';
import PestDiseaseSettings from './settings/PestDiseaseSettings';
import FertilizerSoilSettings from './settings/FertilizerSoilSettings';
import StoreOrdersSettings from './settings/StoreOrdersSettings';
import CommunitySettings from './settings/CommunitySettings';
import ExpertsAdvisorySettings from './settings/ExpertsAdvisorySettings';
import NotificationSettings from './settings/NotificationSettings';
import PrivacySecuritySettings from './settings/PrivacySecuritySettings';
import DataStorageSettings from './settings/DataStorageSettings';
import OfflineModeSettings from './settings/OfflineModeSettings';
import EmergencySettings from './settings/EmergencySettings';
import AboutAppSettings from './settings/AboutAppSettings';
import AccountSettings from './settings/AccountSettings';
import ProfileSettings from './settings/ProfileSettings';

// Dummy component for unimplemented settings
const PlaceholderSettings = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-500 animate-in fade-in">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <SettingsIcon className="w-8 h-8 text-gray-400" />
    </div>
    <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
    <p className="text-sm">This settings page is under construction.</p>
  </div>
);

const SETTINGS_GROUPS = [
  {
    title: 'Account',
    items: [
      { id: 'profile', path: '/settings/profile', icon: UserCircle, label: 'Profile Details', component: ProfileSettings },
      { id: 'account', path: '/settings/account', icon: UserCircle, label: 'Account & Security', component: AccountSettings },
    ]
  },
  {
    title: 'App Settings',
    items: [
      { id: 'general', path: '/settings/general', icon: SettingsIcon, label: 'General', component: GeneralSettings },
      { id: 'display', path: '/settings/display', icon: Palette, label: 'Display & Theme', component: DisplayThemeSettings },
      { id: 'language', path: '/settings/language', icon: Globe, label: 'Language', component: LanguageSettings },
      { id: 'notifications', path: '/settings/notifications', icon: Bell, label: 'Notifications', component: NotificationSettings },
    ]
  },
  {
    title: 'Farm & AI',
    items: [
      { id: 'crop', path: '/settings/crop', icon: Leaf, label: 'Crop & Farm', component: CropFarmSettings },
      { id: 'voice', path: '/settings/voice', icon: Mic, label: 'Voice Assistant', component: VoiceAssistantSettings },
    ]
  },
  {
    title: 'Privacy & Data',
    items: [
      { id: 'privacy', path: '/settings/privacy', icon: Shield, label: 'Privacy & Security', component: PrivacySecuritySettings },
      { id: 'data', path: '/settings/data', icon: Database, label: 'Data & Storage', component: DataStorageSettings },
      { id: 'offline', path: '/settings/offline', icon: WifiOff, label: 'Offline Mode', component: OfflineModeSettings },
    ]
  },
  {
    title: 'Support',
    items: [
      { id: 'emergency', path: '/settings/emergency', icon: AlertTriangle, label: 'Emergency', component: EmergencySettings, color: 'text-red-500' },
      { id: 'about', path: '/settings/about', icon: Info, label: 'About App', component: AboutAppSettings },
    ]
  }
];

// Flatten for routing
const ALL_ROUTES = SETTINGS_GROUPS.flatMap(group => group.items);

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If we are exactly on /settings, redirect to account
  if (location.pathname === '/settings') {
    return <Navigate to="/settings/account" replace />;
  }

  const currentCategory = ALL_ROUTES.find(c => c.path === location.pathname) || ALL_ROUTES[0];

  return (
    <div className="page-content px-4 md:px-8 pt-6 w-full min-h-screen">
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 min-h-[calc(100vh-120px)] flex flex-col md:flex-row overflow-hidden relative mb-10">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-gray-50 rounded-lg"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-black text-gray-900">{currentCategory.label}</h1>
          </div>
        </div>

        {/* Left Sidebar (Categories) */}
        <div className={`w-full md:w-80 shrink-0 flex flex-col bg-gray-50/30 border-r border-gray-100 ${mobileMenuOpen ? 'block' : 'hidden md:flex'}`}>
          <div className="p-6">
            <div className="mb-6 px-2">
              <h1 className="text-2xl font-black text-gray-900 mb-1">Settings</h1>
              <p className="text-sm text-gray-500">Customize your app experience</p>
            </div>
            
            <div className="flex flex-col gap-6">
              {SETTINGS_GROUPS.map((group, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-1">{group.title}</h3>
                  {group.items.map(category => {
                    const Icon = category.icon;
                    const isActive = location.pathname === category.path;
                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          navigate(category.path);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                          isActive 
                            ? 'bg-white shadow-sm text-green-700 border border-gray-100' 
                            : 'text-gray-600 hover:bg-gray-100/50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${category.color || (isActive ? 'text-green-700' : 'text-gray-500')}`} />
                          <span className="font-semibold text-sm">{category.label}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${isActive ? 'text-green-700 opacity-100' : 'opacity-0'}`} />
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className={`flex-1 min-w-0 w-full p-6 md:p-10 ${mobileMenuOpen ? 'hidden md:block' : 'block'}`}>
          {/* Desktop Header */}
          <div className="hidden md:flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
            {location.pathname !== '/settings/account' && (
              <button onClick={() => navigate('/settings/account')} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            <h1 className="text-3xl font-bold text-gray-900">{currentCategory.label}</h1>
          </div>
          
          {/* Render the specific settings component based on route */}
          <Routes>
            {ALL_ROUTES.map(category => (
              <Route 
                key={category.id} 
                path={category.id} 
                element={<category.component />} 
              />
            ))}
          </Routes>
        </div>
      </div>
    </div>
  );
}

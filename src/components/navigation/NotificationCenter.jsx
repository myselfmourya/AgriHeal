import React, { useState } from 'react';
import { Bell, CloudLightning, ShieldAlert, Check, Settings, Mic } from 'lucide-react';

const NOTIFICATIONS = [
  { id: 1, title: 'Rain Expected Tomorrow', desc: 'Avoid spraying today.', time: '2 mins ago', type: 'weather', icon: CloudLightning, color: 'text-blue-500', bg: 'bg-blue-50', unread: true },
  { id: 2, title: 'Tomato Blight Warning', desc: 'High risk in your region. Check crops.', time: '1 hr ago', type: 'alert', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50', unread: true },
  { id: 3, title: 'Profile Incomplete', desc: 'Add farm details to get better AI suggestions.', time: 'Yesterday', type: 'system', icon: Settings, color: 'text-gray-500', bg: 'bg-gray-50', unread: false }
];

export default function NotificationCenter({ isActive, setActive }) {
  const [activeTab, setActiveTab] = useState('All');
  
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  return (
    <div className="relative">
      {/* Trigger */}
      <button 
        onClick={() => setActive(!isActive)}
        className={`relative p-2.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-2 ring-white ring-opacity-50 animate-pulse"></span>
        )}
      </button>

      {/* Panel */}
      {isActive && (
        <div className="absolute top-full right-0 mt-2 w-[340px] md:w-[400px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50">
          
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Mark all read">
                <Check className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Settings">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex border-b border-gray-100 px-2">
            {['All', 'Unread', 'Alerts'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-colors ${activeTab === tab ? 'border-green-500 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            <div className="p-2 space-y-1">
              {NOTIFICATIONS.map(notif => (
                <div key={notif.id} className={`p-3 rounded-xl transition-all group hover:bg-gray-50 flex items-start gap-3 ${notif.unread ? 'bg-blue-50/30' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.bg}`}>
                    <notif.icon className={`w-5 h-5 ${notif.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className={`text-sm font-semibold truncate ${notif.unread ? 'text-gray-900' : 'text-gray-700'}`}>{notif.title}</h4>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{notif.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{notif.desc}</p>
                    
                    {/* Action Buttons for specific types */}
                    {notif.type === 'weather' && (
                      <div className="mt-2 flex gap-2">
                        <button className="text-[10px] px-3 py-1.5 bg-white border border-gray-200 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition-colors">View Details</button>
                        <button className="text-[10px] px-3 py-1.5 bg-green-50 text-green-700 rounded-md font-semibold hover:bg-green-100 transition-colors flex items-center gap-1"><Mic className="w-3 h-3"/> Ask Vani</button>
                      </div>
                    )}
                  </div>
                  {notif.unread && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
            <button className="text-xs font-semibold text-green-600 hover:text-green-700">View All Notifications</button>
          </div>
        </div>
      )}
    </div>
  );
}

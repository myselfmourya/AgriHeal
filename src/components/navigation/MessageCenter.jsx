import React, { useState } from 'react';
import { MessageSquare, Search, Edit3, Bot, Users, Headset } from 'lucide-react';

const CHATS = [
  { id: 1, name: 'Vani (AI Assistant)', msg: 'Here is the weather forecast you asked for.', time: 'Just now', unread: 1, type: 'ai', avatar: 'bg-green-100', icon: Bot, color: 'text-green-600' },
  { id: 2, name: 'Dr. Sharma (Expert)', msg: 'Yes, that looks like early blight. Apply copper fungicide.', time: '2 hrs ago', unread: 0, type: 'expert', avatar: 'bg-blue-100', icon: Users, color: 'text-blue-600' },
  { id: 3, name: 'AgriHeal Support', msg: 'Your ticket #1209 has been resolved.', time: 'Yesterday', unread: 0, type: 'support', avatar: 'bg-purple-100', icon: Headset, color: 'text-purple-600' }
];

export default function MessageCenter({ isActive, setActive }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const unreadCount = CHATS.reduce((acc, chat) => acc + chat.unread, 0);

  return (
    <div className="relative">
      {/* Trigger */}
      <button 
        onClick={() => setActive(!isActive)}
        className={`relative p-2.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
      >
        <MessageSquare className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full border-2 border-white ring-2 ring-white ring-opacity-50"></span>
        )}
      </button>

      {/* Panel */}
      {isActive && (
        <div className="absolute top-full right-0 mt-2 w-[340px] md:w-[380px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50">
          
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">Messages</h3>
              <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="New Message">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            
            {/* Search within messages */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input type="text" placeholder="Search conversations..." className="w-full pl-9 pr-3 py-1.5 bg-gray-50 rounded-lg text-sm border-none focus:ring-2 focus:ring-green-500/20 outline-none" />
            </div>
          </div>

          <div className="flex overflow-x-auto scrollbar-hide px-2 border-b border-gray-100 py-2 gap-1">
            {['All', 'Experts', 'Community', 'Support', 'AI'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeFilter === tab ? 'bg-gray-900 text-white' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="max-h-[350px] overflow-y-auto p-2 space-y-1">
            {CHATS.map(chat => (
              <button key={chat.id} className="w-full text-left p-2.5 rounded-xl transition-all hover:bg-gray-50 flex items-center gap-3 group">
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${chat.avatar}`}>
                  <chat.icon className={`w-5 h-5 ${chat.color}`} />
                  {chat.unread > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className={`text-sm font-semibold truncate ${chat.unread ? 'text-gray-900' : 'text-gray-700'}`}>{chat.name}</h4>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{chat.time}</span>
                  </div>
                  <p className={`text-xs truncate ${chat.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{chat.msg}</p>
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
            <button className="text-xs font-semibold text-green-600 hover:text-green-700">Open Message Center</button>
          </div>
        </div>
      )}
    </div>
  );
}

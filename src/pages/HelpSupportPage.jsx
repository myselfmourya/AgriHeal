import React, { useState } from 'react';
import { 
  Headset, Search, Clock, Users,
  CheckCircle, ArrowRight
} from 'lucide-react';
import { 
  QUICK_CATEGORIES, POPULAR_ARTICLES, 
  SYSTEM_STATUS, CONTACT_OPTIONS 
} from '../data/helpSupportData';
import { useVani } from '../contexts/VaniContext';

export default function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { setOverlay } = useVani();

  return (
    <div className="absolute inset-0 flex flex-col bg-[#f4f7f5] overflow-hidden">
      
      {/* Top Header (Mobile Only) */}
      <div className="md:hidden bg-white px-4 py-4 shadow-sm relative z-20 flex items-center justify-between shrink-0 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Headset className="w-6 h-6 text-green-700" />
          <h1 className="text-xl font-black text-slate-800">Help & Support</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-8 pb-12">
          
          {/* Main Content (Left) */}
          <div className="flex-1 flex flex-col gap-8 min-w-0">
            
            {/* Hero Section */}
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col gap-6">
              <div className="relative z-10 w-full max-w-3xl">
                <div className="flex items-center gap-3 mb-3">
                  <Headset className="w-8 h-8 text-green-700" />
                  <h1 className="text-3xl font-black text-gray-900">Help & Support</h1>
                </div>
                <p className="text-gray-600 mb-8 text-lg">We're here to help you at every step of your farming journey</p>
                
                <div className="relative flex items-center w-full">
                  <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search help articles, guides, issues..." 
                    className="w-full pl-12 pr-24 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 text-gray-800 placeholder-gray-400 font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="absolute right-2 px-6 py-2 bg-green-700 text-white rounded-full font-bold hover:bg-green-800 transition-colors">
                    Search
                  </button>
                </div>
              </div>
              
              {/* Decorative elements for premium feel */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
              <div className="absolute right-40 -bottom-20 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
            </div>

            {/* Quick Categories */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">How can we help you today?</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {QUICK_CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button key={cat.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md hover:border-green-200 transition-all group">
                      <div className={`w-14 h-14 ${cat.bg} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-7 h-7 ${cat.color}`} />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">{cat.label}</h3>
                      <p className="text-xs text-gray-500 font-medium">{cat.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Popular Articles */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Popular Help Articles</h2>
                <button className="text-sm font-bold text-green-700 hover:text-green-800 flex items-center gap-1">
                  View all articles <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {POPULAR_ARTICLES.map(article => {
                  const Icon = article.icon;
                  return (
                    <button key={article.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:border-green-300 transition-colors text-left group">
                      <div className="w-12 h-12 bg-[#f4f7f5] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-green-50 transition-colors">
                        <Icon className="w-6 h-6 text-green-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 leading-snug">{article.title}</h3>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">{article.type}</span>
                          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {article.readTime}
                          </span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>



          </div>

          {/* Right Sidebar */}
          <div className="w-full xl:w-[340px] shrink-0 flex flex-col gap-6">
            
            {/* Contact Us */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Contact Us</h2>
              <p className="text-sm text-gray-500 mb-6 font-medium">We're here for you</p>
              
              <div className="flex flex-col gap-1">
                {CONTACT_OPTIONS.map((contact, idx) => {
                  const Icon = contact.icon;
                  return (
                    <button 
                      key={contact.id} 
                      onClick={() => contact.id === 'contact1' && setOverlay('vani')}
                      className={`flex items-start gap-4 p-3 rounded-xl hover:bg-[#f4f7f5] transition-colors text-left ${idx !== CONTACT_OPTIONS.length - 1 ? 'border-b border-gray-50' : ''}`}
                    >
                      <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-green-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm mb-0.5">{contact.title}</h3>
                        <p className="text-xs text-gray-500 font-medium whitespace-pre-line leading-relaxed">{contact.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-1">System Status</h2>
              <p className="text-sm text-green-600 font-bold mb-5 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> All systems operational
              </p>
              
              <div className="flex flex-col gap-3 mb-5">
                {SYSTEM_STATUS.map(sys => (
                  <div key={sys.id} className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> {sys.name}
                    </span>
                    <span className="text-xs font-bold text-green-600">{sys.status}</span>
                  </div>
                ))}
              </div>
              <button className="w-full text-center text-sm font-bold text-green-700 hover:text-green-800 flex items-center justify-center gap-1">
                View detailed status <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Community Help */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Community Help</h2>
              <p className="text-sm text-gray-500 mb-4 font-medium">Get help from other farmers</p>
              
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-green-700" />
                </div>
                <p className="text-xs font-medium text-gray-600 leading-relaxed">
                  Join our farmer community. Share experiences, ask questions and learn together.
                </p>
              </div>
              <button className="w-full py-2 border border-green-200 text-green-700 rounded-xl font-bold text-sm hover:bg-green-50 transition-colors">
                Visit Community Forum
              </button>
            </div>



          </div>
        </div>
      </div>
    </div>
  );
}

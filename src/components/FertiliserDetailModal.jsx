import React, { useState } from 'react'
import { X, CheckCircle2, AlertTriangle, Leaf, Droplets, ShoppingCart, Star, Clock, ShieldAlert, Truck } from 'lucide-react'

export default function FertiliserDetailModal({ isOpen, onClose, fertiliser }) {
  const [activeTab, setActiveTab] = useState('overview') // overview, application, pros-cons, alternatives, buy

  if (!isOpen || !fertiliser) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#f4f7f5] w-full sm:max-w-4xl rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-[90vh] animate-slide-up sm:animate-scale-in overflow-hidden">
        
        {/* Header (Sticky) */}
        <div className="bg-white px-6 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
              <img src={fertiliser.image} alt={fertiliser.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">{fertiliser.name}</h2>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">{fertiliser.type}</span>
              </div>
              <p className="text-sm text-slate-500 font-medium mt-0.5">By {fertiliser.brand} • <span className="text-yellow-500 flex inline-flex items-center"><Star className="w-3 h-3 fill-current mr-1"/>{fertiliser.rating}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 px-2 overflow-x-auto hide-scrollbar">
          {['overview', 'application', 'pros-cons', 'alternatives', 'faqs', 'buy'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'border-green-600 text-green-700' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-200'
              }`}
            >
              {tab === 'pros-cons' ? 'Pros & Cons' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Price Overview</h3>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-3xl font-black text-slate-800">{fertiliser.price.perBag}</span>
                    <span className="text-sm font-bold text-slate-500 mb-1">/ {fertiliser.price.bagSize}</span>
                  </div>
                  <p className="text-sm font-medium text-green-700">{fertiliser.price.perKg} per kg</p>
                </div>
                
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Best Suited For</h3>
                  <div className="flex flex-wrap gap-2">
                    {(fertiliser.bestCrops || []).map(c => (
                      <span key={c} className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-bold">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: APPLICATION GUIDE */}
          {activeTab === 'application' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-xl">✨</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-800 mb-1">AI Recommendation</h4>
                  <p className="text-sm font-medium text-blue-900 leading-relaxed">Based on your crops, apply <strong>{fertiliser.application?.quantity}</strong> during the <strong>{fertiliser.application?.stage}</strong> stage using <strong>{fertiliser.application?.method}</strong>.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0"><Leaf className="w-5 h-5 text-green-600"/></div>
                  <div>
                    <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Best Growth Stage</span>
                    <span className="font-bold text-slate-800">{fertiliser.application?.stage}</span>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center shrink-0"><Droplets className="w-5 h-5 text-orange-600"/></div>
                  <div>
                    <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Quantity Per Acre</span>
                    <span className="font-bold text-slate-800">{fertiliser.application?.quantity}</span>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0"><Clock className="w-5 h-5 text-blue-600"/></div>
                  <div>
                    <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Best Time</span>
                    <span className="font-bold text-slate-800">{fertiliser.application?.bestTime}</span>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center shrink-0"><CheckCircle2 className="w-5 h-5 text-purple-600"/></div>
                  <div>
                    <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Application Method</span>
                    <span className="font-bold text-slate-800">{fertiliser.application?.method}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROS & CONS */}
          {activeTab === 'pros-cons' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
                  <h3 className="text-sm font-bold text-green-800 flex items-center gap-2 mb-4"><CheckCircle2 className="w-5 h-5"/> Advantages</h3>
                  <ul className="space-y-3">
                    {(fertiliser.advantages || []).map((adv, i) => (
                      <li key={i} className="flex gap-3 text-sm font-medium text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" /> {adv}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                  <h3 className="text-sm font-bold text-red-800 flex items-center gap-2 mb-4"><AlertTriangle className="w-5 h-5"/> Disadvantages</h3>
                  <ul className="space-y-3">
                    {(fertiliser.disadvantages || []).map((dis, i) => (
                      <li key={i} className="flex gap-3 text-sm font-medium text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" /> {dis}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {fertiliser.notRecommendedFor && fertiliser.notRecommendedFor.length > 0 && (
                <div className="bg-orange-50 border border-orange-100 p-5 rounded-2xl flex gap-4 items-start">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-orange-800 mb-1">Not Recommended For</h4>
                    <p className="text-sm font-medium text-orange-900">{fertiliser.notRecommendedFor.join(', ')}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: ORGANIC ALTERNATIVES */}
          {activeTab === 'alternatives' && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-sm font-medium text-slate-600 bg-white p-4 rounded-xl border border-gray-100">Consider these organic alternatives to improve long-term soil health while achieving similar results.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(fertiliser.organicAlternatives || []).map((alt, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                    <Leaf className="absolute top-4 right-4 w-5 h-5 text-green-500" />
                    <h4 className="text-lg font-black text-slate-800 mb-2 relative z-10">{alt.name}</h4>
                    <p className="text-sm font-medium text-slate-600 mb-4 relative z-10">{alt.benefits}</p>
                    <div className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs font-bold relative z-10">
                      Cost: {alt.cost}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FAQS */}
          {activeTab === 'faqs' && (
            <div className="space-y-4 animate-fade-in">
              {fertiliser.faqs && fertiliser.faqs.length > 0 ? (
                <div className="grid gap-4">
                  {fertiliser.faqs.map((faq, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                        {faq.q}
                      </h4>
                      <p className="text-sm font-medium text-slate-600 pl-3.5 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-8">No FAQs available for this product.</p>
              )}
            </div>
          )}

          {/* TAB: BUY */}
          {activeTab === 'buy' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-800 mb-2">Price Comparison</h3>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Seller</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(fertiliser.prices || []).map((p, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-4">
                            <span className="text-sm font-bold text-slate-800">{p.seller}</span>
                            {p.seller.includes('Online') && <span className="block text-[10px] text-green-600 font-bold flex items-center mt-1"><Truck className="w-3 h-3 mr-1"/> Delivery Available</span>}
                          </td>
                          <td className="py-4 px-4">
                            <span className="flex items-center text-sm font-bold text-slate-700"><Star className="w-3.5 h-3.5 text-yellow-500 fill-current mr-1"/> {p.rating}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm font-black text-slate-800">{p.price}</span>
                          </td>
                          <td className="py-4 px-4">
                            <button 
                              onClick={() => p.url ? window.open(p.url, '_blank') : alert('Link unavailable')}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors whitespace-nowrap"
                            >
                              <ShoppingCart className="w-3.5 h-3.5"/> Buy Now
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

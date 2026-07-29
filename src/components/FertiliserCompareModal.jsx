import React from 'react'
import { X, CheckCircle2, ShieldAlert, Star } from 'lucide-react'

export default function FertiliserCompareModal({ isOpen, onClose, compareList }) {
  if (!isOpen || compareList.length === 0) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#f4f7f5] w-full sm:w-fit sm:max-w-[95vw] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-[90vh] sm:h-[80vh] animate-slide-up sm:animate-scale-in overflow-hidden">
        
        {/* Header */}
        <div className="bg-white px-6 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Compare Fertilisers</h2>
            <p className="text-sm text-slate-500 font-medium mt-0.5">Comparing {compareList.length} products</p>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 custom-scrollbar">
          <div className="flex gap-4 min-w-max">
            {compareList.map(fert => (
              <div key={fert.id} className="w-72 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col shrink-0">
                {/* Image & Type */}
                <div className="h-40 bg-gray-100 relative overflow-hidden shrink-0">
                  <img src={fert.image} alt={fert.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-green-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm">
                    {fert.type}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-4">
                    <h3 className="text-lg font-black text-slate-800 leading-tight">{fert.name}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-1">{fert.brand}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-bold text-slate-700">{fert.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Price */}
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Price</h4>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span className="text-xl font-black text-slate-800">{fert.price.perBag}</span>
                        <span className="text-xs font-bold text-slate-400 ml-1">/ {fert.price.bagSize}</span>
                        <div className="text-xs font-medium text-green-700 mt-1">{fert.price.perKg} per kg</div>
                      </div>
                    </div>

                    {/* Application */}
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Application</h4>
                      <ul className="text-sm font-medium text-slate-600 space-y-1.5 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <li><strong className="text-slate-800">Method:</strong> {fert.application.method}</li>
                        <li><strong className="text-slate-800">Stage:</strong> {fert.application.stage}</li>
                        <li><strong className="text-slate-800">Dose:</strong> {fert.application.quantity}</li>
                      </ul>
                    </div>

                    {/* Best For */}
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Best For</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {fert.bestCrops.map(c => (
                          <span key={c} className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-[10px] font-bold">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Advantages */}
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Advantages</h4>
                      <ul className="space-y-2">
                        {fert.advantages.map((adv, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-sm font-medium text-slate-600 leading-tight">{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Disadvantages */}
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Things to note</h4>
                      <ul className="space-y-2">
                        {fert.disadvantages.map((dis, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <ShieldAlert className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                            <span className="text-sm font-medium text-slate-600 leading-tight">{dis}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

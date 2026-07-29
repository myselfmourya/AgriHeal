import React from 'react'
import { X, Wheat, Activity, MapPin, Calendar, CheckCircle2, TrendingUp, Settings2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CropQuickViewModal({ isOpen, onClose, crop }) {
  const navigate = useNavigate()
  if (!isOpen || !crop) return null

  const progressPercent = Math.round((crop.daysSinceSowing / (crop.daysSinceSowing + crop.daysLeftToHarvest)) * 100) || 0

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#f4f7f5] w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-slide-up sm:animate-scale-in overflow-hidden">
        
        {/* Header with Image */}
        <div className="relative h-48 shrink-0">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${crop.image}')` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors backdrop-blur-md">
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight leading-tight">{crop.name}</h2>
              {crop.variety && <p className="text-sm text-white/80 font-medium mt-1">{crop.variety}</p>}
            </div>
            <div className="flex flex-col items-end">
               <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                 {crop.stage || 'Vegetative'}
               </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Area</p>
                <p className="text-sm font-bold text-slate-800">{crop.area || '1.0'} Acres</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Est. Yield</p>
                <p className="text-sm font-bold text-slate-800">{crop.expectedYield || '20'} Qtl</p>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-800 mb-1">Growth Progress</h3>
                <p className="text-[10px] font-medium text-slate-500">Day {crop.daysSinceSowing || 0} of cycle</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-green-600">{progressPercent}%</span>
              </div>
            </div>
            
            <div className="relative h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            <div className="flex justify-between mt-3">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Sown: {crop.sowingDate ? new Date(crop.sowingDate).toLocaleDateString() : 'N/A'}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600">
                <Wheat className="w-3.5 h-3.5 text-orange-400" />
                Harvest in: {crop.daysLeftToHarvest || 0} days
              </div>
            </div>
          </div>

          {/* Health Status */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center ${crop.health === 'Excellent' ? 'bg-green-50' : crop.health === 'Good' ? 'bg-blue-50' : 'bg-orange-50'}`}>
                 <Activity className={`w-5 h-5 ${crop.health === 'Excellent' ? 'text-green-500' : crop.health === 'Good' ? 'text-blue-500' : 'text-orange-500'}`} />
               </div>
               <div>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Health Status</p>
                 <p className={`text-sm font-bold ${crop.health === 'Excellent' ? 'text-green-600' : crop.health === 'Good' ? 'text-blue-600' : 'text-orange-600'}`}>
                   {crop.health || 'Good'}
                 </p>
               </div>
             </div>
             <CheckCircle2 className="w-6 h-6 text-green-500 opacity-20" />
          </div>

        </div>
        
        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-100 flex gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <button 
            onClick={() => { onClose(); navigate('/crops', { state: { openCropId: crop.id } }); }}
            className="flex-[2] py-3.5 rounded-xl font-bold text-sm bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Settings2 className="w-4 h-4" />
            Manage Crop
          </button>
        </div>

      </div>
    </div>
  )
}

import React from 'react'
import { X, Droplet, TrendingUp, CloudSun, Leaf, Bot } from 'lucide-react'
import { useFarmer } from '../contexts/FarmerContext'
import { generateCropDetails } from '../pages/CropManagement'
import { allCrops } from './HealMarketplace'
import { useNavigate } from 'react-router-dom'

export default function DashboardQuickAccessModal({ type, onClose }) {
  const { myCrops, profile, marketFavorites } = useFarmer()
  const navigate = useNavigate()
  
  if (!type) return null

  const displayCrops = myCrops.map(generateCropDetails)

  const renderContent = () => {
    switch(type) {
      case 'Crops':
        return (
          <div className="space-y-4">
            {displayCrops.map(crop => (
               <div key={crop.id} onClick={() => { onClose(); navigate('/crops', { state: { openCropId: crop.id } }); }} className="cursor-pointer bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 hover:border-green-200 transition-colors">
                 <div className="w-12 h-12 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url('${crop.image}')` }} />
                 <div className="flex-1">
                   <h4 className="text-sm font-bold text-slate-800">{crop.name}</h4>
                   <p className="text-xs font-medium text-slate-500">{crop.area} acres • {crop.stage || 'Growing'}</p>
                 </div>
               </div>
            ))}
            <button onClick={() => { onClose(); navigate('/crops'); }} className="w-full py-3 bg-green-50 text-green-700 font-bold rounded-xl text-sm">
              Manage All Crops
            </button>
          </div>
        )
      case 'Growth':
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-2xl border border-green-200">
               <h4 className="text-sm font-bold text-green-800 mb-2">AI Growth Analysis</h4>
               <p className="text-xs text-green-700 leading-relaxed mb-3">
                 Hello {profile.name}, based on recent satellite and local data, your {displayCrops.map(c => c.name).join(', ')} crops are progressing exactly on schedule. 
               </p>
               <div className="space-y-2">
                 {displayCrops.map(crop => (
                   <div key={crop.id} className="bg-white/60 p-3 rounded-xl">
                     <p className="text-xs font-bold text-slate-800">{crop.name}</p>
                     <p className="text-[10px] text-slate-600 mt-1 flex justify-between">
                       <span>Yield Est:</span>
                       <span className="font-bold">{crop.expectedYield} Qtl</span>
                     </p>
                     <div className="w-full bg-white/50 h-1.5 mt-2 rounded-full overflow-hidden">
                       <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.round((crop.daysSinceSowing / (crop.daysSinceSowing + crop.daysLeftToHarvest)) * 100) || 0}%` }} />
                     </div>
                   </div>
                 ))}
               </div>
            </div>
            <button onClick={() => { onClose(); navigate('/crops'); }} className="w-full py-3 bg-green-50 text-green-700 font-bold rounded-xl text-sm">
               Detailed Growth Metrics
            </button>
          </div>
        )
      case 'Irrigation':
        return (
          <div className="space-y-4">
             <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
               <h4 className="text-sm font-bold text-blue-800 mb-2">Water Management</h4>
               <p className="text-xs text-blue-700 mb-4">Soil moisture levels are currently optimal. No immediate irrigation required for the next 48 hours.</p>
               <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm">
                 <div className="flex items-center gap-3">
                   <Droplet className="w-8 h-8 text-blue-500" />
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase">Avg Moisture</p>
                     <p className="text-sm font-bold text-slate-800">42%</p>
                   </div>
                 </div>
                 <span className="text-xs font-bold text-green-500">Good</span>
               </div>
             </div>
             <button onClick={() => { onClose(); navigate('/farm-care'); }} className="w-full py-3 bg-blue-50 text-blue-700 font-bold rounded-xl text-sm">
               View Farm Care
             </button>
          </div>
        )
      case 'Fertilizer':
        const cropsWithFertilisers = displayCrops.filter(c => c.fertilisers && c.fertilisers.trim().length > 0)
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800">Your Recent Fertilizers</h4>
            
            {cropsWithFertilisers.length > 0 ? (
              cropsWithFertilisers.map((crop, idx) => (
                <div key={crop.id || idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                     <Leaf className="w-5 h-5 text-green-500" />
                   </div>
                   <div className="flex-1">
                     <h4 className="text-sm font-bold text-slate-800">{crop.fertilisers}</h4>
                     <p className="text-xs font-medium text-slate-500">Applied on {crop.name}</p>
                   </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center text-sm text-gray-500">
                No fertilizers recorded. Add them when managing crops!
              </div>
            )}
            
            <button onClick={() => { onClose(); navigate('/fertilisers'); }} className="w-full py-3 bg-green-50 text-green-700 font-bold rounded-xl text-sm">
               Manage Fertilizers
            </button>
          </div>
        )
      case 'Pest & Disease':
        return (
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
               <h4 className="text-sm font-bold text-red-800 mb-2">Current Alerts</h4>
               <p className="text-xs text-red-700 mb-4">High risk of Brown Plant Hopper detected in surrounding areas.</p>
               <div className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-3">
                 <Bot className="w-8 h-8 text-red-500" />
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase">Affected Crop</p>
                   <p className="text-sm font-bold text-slate-800">Paddy</p>
                 </div>
               </div>
            </div>
            <button onClick={() => { onClose(); navigate('/scan'); }} className="w-full py-3 bg-red-50 text-red-700 font-bold rounded-xl text-sm">
               Run AgriShield Scan
            </button>
          </div>
        )
      case 'Market Prices':
        return (
          <div className="space-y-4">
             <h4 className="text-sm font-bold text-slate-800">Favorite Crops</h4>
             {marketFavorites.map(cropName => {
               const marketCrop = allCrops.find(c => c.name === cropName)
               if (!marketCrop) return null
               return (
                 <div key={cropName} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${marketCrop.bg}`}>
                       <TrendingUp className={`w-4 h-4 ${marketCrop.color}`} />
                     </div>
                     <div>
                       <h4 className="text-sm font-bold text-slate-800">{marketCrop.emoji} {marketCrop.name}</h4>
                       <p className="text-[10px] text-slate-500">Local Mandi</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className={`text-sm font-bold ${marketCrop.color}`}>₹{marketCrop.price}</p>
                     <p className={`text-[10px] font-bold ${marketCrop.color}`}>{marketCrop.increase ? '+' : '-'}{marketCrop.percent}</p>
                   </div>
                 </div>
               )
             })}
             <button onClick={() => { onClose(); navigate('/market'); }} className="w-full py-3 bg-orange-50 text-orange-700 font-bold rounded-xl text-sm">
               View All Markets
             </button>
          </div>
        )
      case 'Weather':
        return (
          <div className="space-y-4">
             <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-4">
               <CloudSun className="w-12 h-12 text-blue-500" />
               <div>
                 <h4 className="text-xl font-bold text-blue-900">32°C</h4>
                 <p className="text-xs font-medium text-blue-700">Partly Cloudy, 10% Rain</p>
               </div>
             </div>
             <p className="text-xs text-slate-600 bg-white p-4 rounded-2xl border border-gray-100">
               Optimal weather for spraying pesticides today. Wind speeds are low (4 km/h) and no rain is expected in the next 12 hours.
             </p>
             <button onClick={() => { onClose(); navigate('/farm-care'); }} className="w-full py-3 bg-blue-50 text-blue-700 font-bold rounded-xl text-sm">
               Detailed Weather Intelligence
             </button>
          </div>
        )
      default:
        return null;
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#f4f7f5] w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-slide-up sm:animate-scale-in overflow-hidden">
        
        {/* Header */}
        <div className="bg-white px-6 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">{type} Summary</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Quick Access View</p>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar pb-8">
          {renderContent()}
        </div>
        
      </div>
    </div>
  )
}

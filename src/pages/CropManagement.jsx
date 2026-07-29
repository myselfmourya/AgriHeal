import React, { useState } from 'react'
import {   Bug, AlertTriangle, CheckCircle2, Sprout, Wheat, Calendar, TrendingUp, Calendar as CalendarIcon, ClipboardList } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AddCropModal from '../components/AddCropModal'
import EditCropModal from '../components/EditCropModal'
import { useFarmer } from '../contexts/FarmerContext'

// Fallback logic for new crops added without full details
export const generateCropDetails = (crop) => {
  return {
    ...crop,
    image: crop.image || 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=800',
    stage: crop.stage || 'Seedling',
    health: crop.health || 'Good',
    daysSinceSowing: crop.daysSinceSowing || 5,
    daysLeftToHarvest: crop.daysLeftToHarvest || 110,
    expectedHarvest: crop.expectedHarvest || 'Pending',
    pestStatus: crop.pestStatus || 'No Problems',
    progress: crop.progress || 5,
    aiAdvice: crop.aiAdvice || 'Monitor soil moisture regularly in this early stage.'
  }
}

const getHealthBadge = (health) => {
  switch(health) {
    case 'Good': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div> Good</span>
    case 'Average': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Average</span>
    case 'Poor': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div> Poor</span>
    default: return null
  }
}

const getPestBadge = (status) => {
  switch(status) {
    case 'No Problems': return <span className="text-green-600 flex items-center gap-1.5 text-sm font-bold"><CheckCircle2 className="w-4 h-4" /> No Problems</span>
    case 'Pest Detected': return <span className="text-orange-500 flex items-center gap-1.5 text-sm font-bold"><Bug className="w-4 h-4" /> Pest Detected</span>
    case 'Disease Detected': return <span className="text-red-500 flex items-center gap-1.5 text-sm font-bold"><AlertTriangle className="w-4 h-4" /> Disease Detected</span>
    default: return null
  }
}

export default function CropManagement() {
  const { myCrops, notifications } = useFarmer()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCrop, setEditingCrop] = useState(null)
  const navigate = useNavigate()
  
  const displayCrops = myCrops.map(generateCropDetails)
  const reminderTasks = notifications.filter(n => n.type === 'Reminder')

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Crop Management</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Track and manage your farm's crops</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm shadow-green-200"
        >
          + Add New Crop
        </button>
      </div>

      {/* Global Tasks Section */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-500" />
            Scheduled Crop Activities & Tasks
          </h2>
          <button 
            onClick={() => navigate('/notifications')}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 hover:bg-indigo-100 px-4 py-1.5 rounded-lg"
          >
            Manage All
          </button>
        </div>
        
        {reminderTasks.length === 0 ? (
          <p className="text-sm text-slate-500 font-medium py-4 text-center bg-gray-50 rounded-2xl">No upcoming activities scheduled.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {reminderTasks.slice(0, 3).map(task => {
              const d = new Date(task.scheduledTime);
              return (
                <div 
                  key={task.id}
                  onClick={() => navigate('/notifications')}
                  className="flex items-center gap-4 bg-gray-50 hover:bg-indigo-50/50 p-4 rounded-2xl cursor-pointer transition-colors border border-transparent hover:border-indigo-100"
                >
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                    <CalendarIcon className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 truncate">{task.title}</h4>
                    <p className="text-xs font-medium text-slate-500 truncate">{task.message}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-xs font-black text-indigo-600">{d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span className="block text-[10px] font-bold text-slate-400 mt-0.5">{d.toLocaleDateString([], {month: 'short', day: 'numeric'})}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Crop Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayCrops.map((crop) => (
          <div 
            key={crop.id} 
            onClick={() => navigate(`/crops/${crop.id}`)}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer"
          >
            {/* Last Photo Header */}
            <div className="h-48 relative bg-cover bg-center" style={{ backgroundImage: `url('${crop.image}')` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute top-4 right-4 flex gap-2">
                {getHealthBadge(crop.health)}
                <button 
                  onClick={(e) => { e.stopPropagation(); setEditingCrop(crop); }}
                  className="bg-white/90 hover:bg-white text-slate-700 p-1.5 rounded-full shadow-sm backdrop-blur-sm transition-colors"
                  title="Edit Crop"
                >
                  <span className="text-xs font-bold px-2">Edit</span>
                </button>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    {crop.name} <span className="text-xl">{crop.emoji}</span>
                  </h2>
                  <p className="text-white/80 text-sm font-medium mt-1 flex items-center gap-1.5">
                    <Sprout className="w-4 h-4" /> {crop.stage} Stage
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-6">
              {/* Simple AI Advice */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-blue-600 text-lg">✨</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">AI Advice</h4>
                  <p className="text-sm font-medium text-blue-900 leading-snug">{crop.aiAdvice}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-700">Crop Progress</span>
                  <span className="font-bold text-green-600">{crop.progress}% Completed</span>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${crop.progress}%` }}
                  />
                </div>
              </div>

              {/* Grid of Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="text-xs font-bold text-slate-500">Since Sowing</span>
                  </div>
                  <span className="text-lg font-black text-slate-800">{crop.daysSinceSowing} Days</span>
                </div>

                <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-xs font-bold text-green-700">Left to Harvest</span>
                  </div>
                  <span className="text-lg font-black text-green-800">{crop.daysLeftToHarvest} Days</span>
                </div>

                <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <Wheat className="w-4 h-4 text-orange-500" />
                    </div>
                    <span className="text-xs font-bold text-orange-600">Expected Yield</span>
                  </div>
                  <span className="text-lg font-black text-orange-700">{crop.expectedHarvest}</span>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col justify-center">
                  <span className="text-xs font-bold text-slate-500 mb-1">Health Status</span>
                  {getPestBadge(crop.pestStatus)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddCropModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <EditCropModal 
        isOpen={!!editingCrop} 
        onClose={() => setEditingCrop(null)} 
        cropData={editingCrop} 
      />
    </div>
  )
}

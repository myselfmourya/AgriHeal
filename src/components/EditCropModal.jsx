import React, { useState, useEffect } from 'react'
import { X, Save, Trash2 } from 'lucide-react'
import { useFarmer } from '../contexts/FarmerContext'

export default function EditCropModal({ isOpen, onClose, cropData }) {
  const { updateMyCrop, deleteMyCrop } = useFarmer()
  
  const [formData, setFormData] = useState({})

  useEffect(() => {
    if (cropData) {
      setFormData(cropData)
    }
  }, [cropData])

  if (!isOpen || !cropData) return null

  const handleSave = () => {
    updateMyCrop(cropData.id, formData)
    onClose()
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this crop?")) {
      deleteMyCrop(cropData.id)
      onClose()
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#f4f7f5] w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-slide-up sm:animate-scale-in overflow-hidden">
        
        {/* Header */}
        <div className="bg-white px-6 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Edit Crop Details</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">{formData.name}</p>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-5 pb-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Crop Name</label>
              <input 
                type="text" 
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Variety (Optional)</label>
              <input 
                type="text" 
                value={formData.variety || ''}
                placeholder="e.g. Sona Masuri"
                onChange={(e) => handleChange('variety', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Area (Acres)</label>
              <input 
                type="number" 
                step="0.1"
                value={formData.area || ''}
                onChange={(e) => handleChange('area', parseFloat(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Expected Yield (Quintals)</label>
              <input 
                type="number" 
                value={formData.expectedYield || ''}
                onChange={(e) => handleChange('expectedYield', parseInt(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Stage</label>
            <select
              value={formData.stage || 'Seedling'}
              onChange={(e) => handleChange('stage', e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            >
              <option value="Seedling">Seedling</option>
              <option value="Vegetative">Vegetative</option>
              <option value="Flowering">Flowering</option>
              <option value="Fruiting">Fruiting</option>
              <option value="Harvesting">Harvesting</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Health Status</label>
            <select
              value={formData.health || 'Good'}
              onChange={(e) => handleChange('health', e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            >
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Sowing Date</label>
              <input 
                type="date" 
                value={formData.sowingDate || ''}
                onChange={(e) => handleChange('sowingDate', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Progress (%)</label>
              <input 
                type="number" 
                min="0" max="100"
                value={formData.progress || 0}
                onChange={(e) => handleChange('progress', parseInt(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Fertilisers Used</label>
            <input 
              type="text" 
              value={formData.fertilisers || ''}
              onChange={(e) => handleChange('fertilisers', e.target.value)}
              placeholder="e.g. Urea, DAP, Organic Compost..."
              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Pest Status</label>
            <select
              value={formData.pestStatus || 'No Problems'}
              onChange={(e) => handleChange('pestStatus', e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            >
              <option value="No Problems">No Problems</option>
              <option value="Pest Detected">Pest Detected</option>
              <option value="Disease Detected">Disease Detected</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">AI Advice Override</label>
            <textarea 
              value={formData.aiAdvice || ''}
              onChange={(e) => handleChange('aiAdvice', e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              rows={2}
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-white p-4 sm:px-6 sm:py-5 border-t border-gray-100 shrink-0 flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
          <button 
            onClick={handleDelete}
            className="w-full sm:w-auto justify-center px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Delete Crop
          </button>
          <div className="flex w-full sm:w-auto gap-3">
            <button 
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 sm:flex-none justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

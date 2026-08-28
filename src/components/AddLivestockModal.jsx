import React, { useState } from 'react'
import { X, Calendar, Activity, Info, Tag } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useFarmer } from '../contexts/FarmerContext'

export default function AddLivestockModal({ isOpen, onClose, onSuccess }) {
  const { profile } = useFarmer()
  const [species, setSpecies] = useState('')
  const [breed, setBreed] = useState('')
  const [headCount, setHeadCount] = useState('')
  const [healthStatus, setHealthStatus] = useState('Healthy')
  const [averageTemp, setAverageTemp] = useState('')
  const [lastVaccination, setLastVaccination] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  
  if (!isOpen) return null

  const handleFinish = async () => {
    if (!species.trim() || !breed.trim() || !headCount || !averageTemp) {
      setError('Please fill all required fields')
      return
    }

    setIsSaving(true)

    try {
      const { data, error: insertError } = await supabase
        .from('livestock')
        .insert([{
          farmer_id: profile.id,
          species,
          breed,
          head_count: parseInt(headCount),
          health_status: healthStatus,
          average_temp: parseFloat(averageTemp),
          last_vaccination: lastVaccination || null
        }])
        .select()

      if (insertError) throw insertError

      if (onSuccess) {
        onSuccess(data[0])
      }
      onClose()
    } catch (err) {
      console.error("Error adding livestock:", err)
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#FDFCF7] rounded-3xl overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Tag className="w-4 h-4 text-green-700" />
            </div>
            <h2 className="text-xl font-black text-slate-800">Add Livestock</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 font-medium flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Species</label>
              <select 
                value={species} 
                onChange={(e) => setSpecies(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
              >
                <option value="">Select Species</option>
                <option value="Cattle">Cattle</option>
                <option value="Poultry">Poultry</option>
                <option value="Goat">Goat</option>
                <option value="Sheep">Sheep</option>
                <option value="Pig">Pig</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Breed</label>
              <input 
                type="text" 
                value={breed} 
                onChange={(e) => setBreed(e.target.value)}
                placeholder="e.g. Holstein Friesian, Murrah"
                className="w-full p-3 bg-white border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none placeholder:text-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Head Count</label>
                <input 
                  type="number" 
                  value={headCount} 
                  onChange={(e) => setHeadCount(e.target.value)}
                  placeholder="Total animals"
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Average Temp (°C)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={averageTemp} 
                  onChange={(e) => setAverageTemp(e.target.value)}
                  placeholder="e.g. 38.5"
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Health Status</label>
              <select 
                value={healthStatus} 
                onChange={(e) => setHealthStatus(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
              >
                <option value="Healthy">Healthy</option>
                <option value="Attention Required">Attention Required</option>
                <option value="Sick">Sick</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Last Vaccination Date</label>
              <div className="relative">
                <Calendar className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                <input 
                  type="date" 
                  value={lastVaccination} 
                  onChange={(e) => setLastVaccination(e.target.value)}
                  className="w-full pl-10 p-3 bg-white border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-3 font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleFinish}
            disabled={isSaving}
            className="px-6 py-3 font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-70 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Add Livestock'
            )}
          </button>
        </div>

      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { X, Mic, ChevronRight, ChevronLeft, Check, Camera, Search, MapPin, Calendar, Sprout, Droplets, Image as ImageIcon } from 'lucide-react'
import { useVani } from '../contexts/VaniContext'
import { useFarmer } from '../contexts/FarmerContext'

export default function AddCropModal({ isOpen, onClose }) {
  const { startVaniSession } = useVani()
  const { addMyCrop } = useFarmer()
  const [step, setStep] = useState(1)
  const [cropName, setCropName] = useState('')
  const [field, setField] = useState('')
  const [area, setArea] = useState('')
  const [sowDate, setSowDate] = useState('')
  const [plantingMethod, setPlantingMethod] = useState('')
  const [irrigation, setIrrigation] = useState('')
  const [fertilisers, setFertilisers] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  
  if (!isOpen) return null

  const handleTalkToVani = () => {
    onClose()
    // Open a full LiveKit session with context so the agent knows
    // the user wants to add a crop.
    startVaniSession({ intent: 'add_crop' })
  }

  const handleNext = () => {
    if (step === 1) {
      if (!cropName.trim() || !field.trim() || !area.trim()) {
        setError('Please fill all required fields (*)')
        return
      }
    }
    if (step === 2) {
      if (!sowDate || !plantingMethod.trim() || !irrigation.trim()) {
        setError('Please fill all required fields (*)')
        return
      }
    }
    setError('')
    setStep(s => Math.min(3, s + 1))
  }

  const handlePrev = () => {
    setError('')
    setStep(s => Math.max(1, s - 1))
  }
  
  const handleFinish = async () => {
    setIsSaving(true)
    let imageUrl = null
    try {
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(cropName)}&pithumbsize=500&format=json&origin=*`)
      const data = await res.json()
      const pages = data.query?.pages
      if (pages) {
        const pageId = Object.keys(pages)[0]
        imageUrl = pages[pageId]?.thumbnail?.source || null
      }
    } catch (e) {
      console.error("Failed to fetch image", e)
    }

    addMyCrop({ 
      name: cropName || 'New Crop', 
      emoji: '🌱',
      image: imageUrl,
      fertilisers: fertilisers || ''
    })
    setIsSaving(false)
    onClose()
    setStep(1)
    setCropName('')
    setField('')
    setArea('')
    setSowDate('')
    setPlantingMethod('')
    setIrrigation('')
    setFertilisers('')
    setError('')
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#f4f7f5] w-full sm:w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-slide-up sm:animate-scale-in overflow-hidden">
        
        {/* Header */}
        <div className="bg-white px-6 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Add New Crop</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Step {step} of 3</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleTalkToVani}
              className="hidden sm:flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border border-green-200"
            >
              <Mic className="w-3.5 h-3.5" />
              Talk to Vani
            </button>
            <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-gray-100 shrink-0">
          <div 
            className="h-full bg-green-500 transition-all duration-300" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
          
          {/* Mobile Vani Button */}
          <button 
            onClick={handleTalkToVani}
            className="sm:hidden w-full flex items-center justify-center gap-2 bg-green-50 active:bg-green-100 text-green-700 p-3 rounded-2xl text-sm font-bold transition-colors border border-green-200"
          >
            <Mic className="w-4 h-4" />
            Talk to Vani instead
          </button>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold border border-red-100">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Sprout className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="font-bold text-slate-800">Crop Basics</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Which crop are you growing? <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={cropName}
                      onChange={(e) => setCropName(e.target.value)}
                      placeholder="e.g. Paddy, Cotton, Tomato (Type anything...)" 
                      className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1.5 ml-1">Powered by AI: We'll instantly recognize any Indian crop you enter.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Which variety is it? <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. BPT 5204, IR64, etc." 
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Which field? <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        value={field}
                        onChange={(e) => setField(e.target.value)}
                        placeholder="e.g. North Field" 
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-9 pr-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Area planted? <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. 2.5 Acres" 
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-800">Planting Details</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">When did you sow the crop? <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    value={sowDate}
                    onChange={(e) => setSowDate(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">How was it planted? <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={plantingMethod}
                    onChange={(e) => setPlantingMethod(e.target.value)}
                    placeholder="e.g. Direct Sowing, Transplanting, Nursery..." 
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">What is the irrigation method? <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                    <input 
                      type="text" 
                      value={irrigation}
                      onChange={(e) => setIrrigation(e.target.value)}
                      placeholder="e.g. Rain-fed, Drip, Sprinkler, Flood..." 
                      className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-9 pr-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Fertilisers Used <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input 
                    type="text" 
                    value={fertilisers}
                    onChange={(e) => setFertilisers(e.target.value)}
                    placeholder="e.g. Urea, DAP, Organic Compost..." 
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="font-bold text-slate-800">Media & Extras <span className="text-gray-400 font-normal text-xs">(All Optional)</span></h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Upload a photo</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 bg-white flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-green-300 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Camera className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Take Photo or Upload</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Helps AI monitor crop growth and detect diseases later.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Soil Type</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Black, Red, Sandy..." 
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Expected Harvest</label>
                    <input 
                      type="text" 
                      placeholder="e.g. October" 
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Any current problems?</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Yellow Leaves, Pests..." 
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-white p-4 sm:px-6 sm:py-5 border-t border-gray-100 shrink-0 flex justify-between items-center">
          {step > 1 ? (
            <button 
              onClick={handlePrev}
              className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button 
              onClick={handleNext}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-1 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleFinish}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 transition-colors"
            >
              <Check className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Crop'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

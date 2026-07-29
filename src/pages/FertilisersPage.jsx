import React, { useState, useEffect } from 'react'
import { Search, Leaf, Star, ChevronRight, X, HelpCircle, ChevronDown } from 'lucide-react'
import { useFarmer } from '../contexts/FarmerContext'
import FertiliserDetailModal from '../components/FertiliserDetailModal'
import FertiliserCompareModal from '../components/FertiliserCompareModal'
import { FERTILISERS, CROP_FAQS } from '../data/fertilisers'

export default function FertilisersPage() {
  const { myCrops } = useFarmer()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCrop, setSelectedCrop] = useState(myCrops[0] || { name: 'Paddy' })
  const [selectedFertiliser, setSelectedFertiliser] = useState(null)
  const [compareList, setCompareList] = useState([])
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState(null)

  // Ensure selectedCrop syncs if myCrops changes
  useEffect(() => {
    if (myCrops.length > 0 && !myCrops.find(c => c.id === selectedCrop?.id)) {
      setSelectedCrop(myCrops[0])
    }
  }, [myCrops])

  // FILTERING LOGIC
  let filteredFertilisers = FERTILISERS.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Only show fertilisers that match the currently selected crop tab, 
    // or if the user is searching, let them search across all.
    // If there's a search query, show any crop match. If no search, restrict to tab.
    const matchesCrop = searchQuery ? true : f.bestCrops.some(c => c.toLowerCase() === selectedCrop?.name?.toLowerCase());

    return matchesSearch && matchesCrop;
  })

  // Auto-generate AI recommendations if no fertilisers found for the specific crop
  if (filteredFertilisers.length === 0 && !searchQuery && selectedCrop) {
    filteredFertilisers = [
      {
        id: `ai-urea-${selectedCrop.name}`,
        name: `Nano Urea for ${selectedCrop.name}`,
        brand: 'IFFCO (AI Recommended)',
        type: 'Nitrogen',
        price: { perBag: '₹225', bagSize: '500ml', perKg: '₹450' },
        rating: 4.8,
        image: '/fertilisers/nano-urea.jpg',
        bestCrops: [selectedCrop.name],
        description: `Highly efficient nano urea optimized specifically for ${selectedCrop.name} growth. Reduces urea application by 50%.`,
        url: 'https://www.bighaat.com/products/iffco-nano-urea',
        faqs: [
          { q: 'How to apply?', a: 'Mix 2-4 ml per liter of water and spray on leaves.' }
        ],
        application: { quantity: '500ml/acre', stage: 'Vegetative', method: 'Foliar Spray', bestTime: 'Morning/Evening' },
        advantages: ['Reduces conventional urea use', 'Environment friendly', 'Higher nutrient use efficiency'],
        disadvantages: ['Requires proper spraying equipment'],
        notRecommendedFor: ['Soil application'],
        organicAlternatives: [{ name: 'Jivamrut', benefits: 'Enriches soil microbes', cost: 'Low' }],
        prices: [{ seller: 'BigHaat (Direct)', rating: 4.8, price: '₹225', url: 'https://www.bighaat.com/products/iffco-nano-urea' }]
      },
      {
        id: `ai-npk-${selectedCrop.name}`,
        name: `Premium NPK 19-19-19 for ${selectedCrop.name}`,
        brand: 'Mahadhan (AI Recommended)',
        type: 'Water Soluble',
        price: { perBag: '₹180', bagSize: '1kg', perKg: '₹180' },
        rating: 4.6,
        image: '/fertilisers/mahadhan-19.jpg',
        bestCrops: [selectedCrop.name],
        description: `Balanced NPK fertilizer providing essential nutrients for overall ${selectedCrop.name} development.`,
        url: 'https://www.bighaat.com/products/katyayani-npk-19-19-19-water-soluble-fertilizer',
        faqs: [
          { q: 'When to use?', a: 'During active growth and early flowering stages.' }
        ],
        application: { quantity: '1kg/acre', stage: 'Active Growth', method: 'Fertigation/Foliar', bestTime: 'Morning' },
        advantages: ['100% water soluble', 'Provides all 3 major nutrients'],
        disadvantages: ['Can cause leaf burn if over-applied'],
        notRecommendedFor: ['Application during rain'],
        organicAlternatives: [{ name: 'Compost Tea', benefits: 'Balanced natural nutrients', cost: 'Very Low' }],
        prices: [{ seller: 'BigHaat (Direct)', rating: 4.6, price: '₹180', url: 'https://www.bighaat.com/products/katyayani-npk-19-19-19-water-soluble-fertilizer' }]
      },
      {
        id: `ai-zinc-${selectedCrop.name}`,
        name: `Chelated Zinc (Zinc EDTA) for ${selectedCrop.name}`,
        brand: 'Aries (AI Recommended)',
        type: 'Micronutrient',
        price: { perBag: '₹350', bagSize: '500g', perKg: '₹700' },
        rating: 4.9,
        image: '/fertilisers/aries-chelamin.jpg',
        bestCrops: [selectedCrop.name],
        description: `Prevents and corrects zinc deficiency in ${selectedCrop.name}, improving crop yield.`,
        url: 'https://www.bighaat.com/products/katyayani-zinc-sulphate-33-fertilizer',
        faqs: [
          { q: 'Can I mix it with pesticides?', a: 'Yes, it is compatible with most agrochemicals.' }
        ],
        application: { quantity: '500g/acre', stage: 'Pre-flowering', method: 'Soil/Foliar', bestTime: 'Anytime' },
        advantages: ['Easily absorbed by plants', 'Compatible with other inputs'],
        disadvantages: ['Slightly more expensive than zinc sulphate'],
        notRecommendedFor: ['Mixing with phosphorus rich fertilizers directly'],
        organicAlternatives: [{ name: 'Enriched Compost', benefits: 'Provides diverse micronutrients', cost: 'Medium' }],
        prices: [{ seller: 'BigHaat (Direct)', rating: 4.9, price: '₹350', url: 'https://www.bighaat.com/products/katyayani-zinc-sulphate-33-fertilizer' }]
      }
    ]
  }

  const toggleCompare = (e, fertiliser) => {
    e.stopPropagation()
    setCompareList(prev => {
      if (prev.find(f => f.id === fertiliser.id)) {
        return prev.filter(f => f.id !== fertiliser.id)
      }
      if (prev.length >= 3) return prev
      return [...prev, fertiliser]
    })
  }

  // AI Recommendation text based on selected crop
  const getAiRecommendation = () => {
    if (selectedCrop?.name === 'Paddy') return "Your paddy crop is at the tillering stage. Apply Urea (25-30 kg/acre) within the next 3 days."
    if (selectedCrop?.name === 'Cotton') return "Cotton is in the growing stage. Ensure adequate phosphorus levels; avoid heavy nitrogen right now."
    if (selectedCrop?.name === 'Tomato') return "Tomatoes are fruiting. Potassium (NPK 19:19:19) is recommended to improve fruit size and quality."
    return "Check crop health for specific fertiliser needs."
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-32">
      
      {/* Header & Centered Search */}
      <div className="flex flex-col items-center justify-center pt-4 sm:pt-8 pb-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight mb-8">Fertilisers</h1>
        
        <div className="w-full max-w-2xl relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-green-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search any fertiliser by name or crop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-white border-2 border-gray-100 rounded-full shadow-sm hover:shadow-md focus:outline-none focus:border-green-500 focus:shadow-lg focus:shadow-green-500/10 text-lg font-medium text-slate-700 transition-all placeholder:text-gray-400"
          />
        </div>
      </div>


      {/* AI Advice Banner */}
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Leaf className="w-4 h-4"/> Filter by your crops
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {myCrops.map(crop => (
            <button
              key={crop.id}
              onClick={() => setSelectedCrop(crop)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${
                selectedCrop?.id === crop.id 
                  ? 'bg-green-600 text-white shadow-green-600/20 scale-105' 
                  : 'bg-white text-slate-600 border border-gray-100 hover:border-green-300 hover:bg-green-50'
              }`}
            >
              <span className="text-lg">{crop.emoji || '🌱'}</span>
              {crop.name}
            </button>
          ))}
        </div>
      </div>

      {/* Fertiliser Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFertilisers.length > 0 ? filteredFertilisers.map(fertiliser => (
          <div 
            key={fertiliser.id}
            onClick={() => setSelectedFertiliser(fertiliser)}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer group flex flex-col"
          >
            {/* Image & Type */}
            <div className="h-40 bg-gray-100 relative overflow-hidden shrink-0">
              <img 
                src={fertiliser.image} 
                alt={fertiliser.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 flex justify-end">
                <label 
                  onClick={(e) => e.stopPropagation()}
                  className={`flex shrink-0 items-center gap-2 px-3 py-1.5 rounded-full shadow-sm cursor-pointer transition-all border ${
                    compareList.find(f => f.id === fertiliser.id)
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'bg-white/90 border-white/90 backdrop-blur-sm text-slate-700 hover:bg-white hover:scale-105'
                  }`}
                >
                  <input 
                    type="checkbox"
                    checked={!!compareList.find(f => f.id === fertiliser.id)}
                    onChange={(e) => toggleCompare(e, fertiliser)}
                    className="w-3.5 h-3.5 rounded text-green-600 focus:ring-green-500 border-gray-300 cursor-pointer"
                  />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    {compareList.find(f => f.id === fertiliser.id) ? 'Added' : 'Compare'}
                  </span>
                </label>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2 gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-slate-800 leading-tight truncate">{fertiliser.name}</h3>
                  <p className="text-xs font-bold text-slate-400 mt-0.5">{fertiliser.brand}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-bold text-yellow-700">{fertiliser.rating}</span>
                </div>
              </div>

              {/* Best Crops Chips */}
              <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
                {fertiliser.bestCrops.slice(0, 3).map(c => (
                  <span key={c} className="bg-gray-50 text-slate-500 border border-gray-100 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">
                    {c}
                  </span>
                ))}
                {fertiliser.bestCrops.length > 3 && (
                  <span className="bg-gray-50 text-slate-500 border border-gray-100 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">
                    +{fertiliser.bestCrops.length - 3} more
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs font-medium text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                {fertiliser.description}
              </p>

              {/* Price & Action */}
              <div className="mt-auto flex items-end justify-between pt-4 border-t border-gray-50">
                <div>
                  <span className="text-2xl font-black text-slate-800">{fertiliser.price.perBag}</span>
                  <span className="text-xs font-bold text-slate-400 ml-1">/ {fertiliser.price.bagSize}</span>
                </div>
                <button className="bg-slate-800 hover:bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-600">No fertilisers found</h3>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or select a different crop.</p>
          </div>
        )}
      </div>

      {/* General FAQs Section */}
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-100 p-2 rounded-xl">
            <HelpCircle className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Frequently Asked Questions</h2>
            <p className="text-sm font-medium text-slate-500">Common questions about {selectedCrop?.name || 'crop'} fertilisers</p>
          </div>
        </div>
        <div className="space-y-3">
          {(CROP_FAQS[selectedCrop?.name] || CROP_FAQS.Default).map((faq, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md"
            >
              <button 
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-slate-800 pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${expandedFaq === index ? 'rotate-180' : ''}`} />
              </button>
              <div 
                className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${expandedFaq === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-slate-600 text-sm font-medium leading-relaxed border-t border-gray-100 pt-3">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendation Banner (Moved to Bottom) */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center max-w-4xl mx-auto">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0 border border-blue-50">
          <span className="text-3xl">✨</span>
        </div>
        <div>
          <h3 className="text-lg font-black text-blue-900 mb-1">AI Recommendation for {selectedCrop?.name}</h3>
          <p className="text-blue-800/80 font-medium leading-relaxed text-sm sm:text-base">
            {getAiRecommendation()}
          </p>
        </div>
      </div>

      {/* Comparison Bottom Bar (Floating) */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-50 animate-slide-up">
          <div className="flex flex-col">
            <span className="text-sm font-bold">{compareList.length} Selected</span>
            <span className="text-xs text-slate-400">Select up to 3 to compare</span>
          </div>
          <div className="flex gap-2">
            {compareList.map(f => (
              <div key={f.id} className="bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                {f.name}
                <button onClick={(e) => toggleCompare(e, f)} className="text-slate-400 hover:text-white"><X className="w-3 h-3"/></button>
              </div>
            ))}
          </div>
          <button 
            className="bg-green-500 hover:bg-green-600 text-slate-900 px-5 py-2.5 rounded-xl text-sm font-black transition-colors shadow-sm ml-2"
            onClick={() => setIsCompareModalOpen(true)}
          >
            Compare Now
          </button>
        </div>
      )}

      <FertiliserDetailModal 
        isOpen={!!selectedFertiliser} 
        onClose={() => setSelectedFertiliser(null)}
        fertiliser={selectedFertiliser}
      />

      <FertiliserCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        compareList={compareList}
      />
    </div>
  )
}

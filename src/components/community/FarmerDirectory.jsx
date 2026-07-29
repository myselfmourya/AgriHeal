import React, { useState } from 'react';
import { Search, MapPin, MessageCircle, Star, Phone } from 'lucide-react';
import { MOCK_FARMERS } from './communityData';

export default function FarmerDirectory() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFarmers = MOCK_FARMERS.filter(farmer => 
    farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    farmer.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farmer.crops.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-gradient-to-r from-teal-500 to-green-600 rounded-2xl p-6 text-white shadow-sm">
        <h2 className="text-xl md:text-2xl font-black mb-2">Connect with Nearby Farmers</h2>
        <p className="text-teal-50 text-sm mb-4">Find farmers in your area, share knowledge, and build your local network.</p>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name, village, or crop..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-gray-800 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFarmers.map(farmer => (
          <div key={farmer.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col hover:border-green-200 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-3">
                <div className="relative">
                  <img src={farmer.avatar} alt={farmer.name} className="w-14 h-14 rounded-full bg-gray-50 border-2 border-white shadow-sm" />
                  {farmer.isExpert && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 p-0.5 rounded-full border-2 border-white">
                      <Star className="w-3 h-3 text-white fill-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 flex items-center gap-1">
                    {farmer.name}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {farmer.village}
                  </div>
                  <div className="text-xs text-green-600 font-medium mt-1">
                    Exp: {farmer.experience}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4 flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Crops Grown</p>
              <div className="flex flex-wrap gap-1.5">
                {farmer.crops.map(crop => (
                  <span key={crop} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md">
                    {crop}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
              <button className="flex-1 bg-green-50 text-green-700 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-100 transition-colors">
                <MessageCircle className="w-4 h-4" />
                Message
              </button>
              <button className="flex-1 bg-white border border-gray-200 text-slate-600 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <Phone className="w-4 h-4" />
                Call
              </button>
            </div>
          </div>
        ))}
        
        {filteredFarmers.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No farmers found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}

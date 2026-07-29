import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sprout, Droplets, Leaf, Bug, 
  ChevronLeft, Settings, Info, Calendar, ThermometerSun
} from 'lucide-react';
import { useFarmer } from '../../contexts/FarmerContext';

import CropGrowth from './CropGrowth';
import CropIrrigation from './CropIrrigation';
import CropFertilizer from './CropFertilizer';
import CropPestDisease from './CropPestDisease';

const CropWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { myCrops } = useFarmer();
  
  const [activeTab, setActiveTab] = useState('growth');

  const crop = myCrops?.find(c => c.id.toString() === id) || {
    id: 'unknown',
    name: 'Unknown Crop',
    variety: 'N/A',
    area: 'N/A',
    plantedDate: 'N/A',
    status: 'Growing'
  };

  const tabs = [
    { id: 'growth', label: 'Growth', icon: Sprout },
    { id: 'irrigation', label: 'Irrigation', icon: Droplets },
    { id: 'fertilizer', label: 'Nutrition', icon: Leaf },
    { id: 'pest', label: 'Pests & Disease', icon: Bug },
  ];

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 shadow-sm pt-4 pb-2 px-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">{crop.name} Workspace</h1>
          <button className="p-2 -mr-2 rounded-full hover:bg-slate-100">
            <Settings className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Crop Quick Info */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
            <Info className="w-4 h-4" />
            {crop.variety}
          </div>
          <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
            <Calendar className="w-4 h-4" />
            Planted: {crop.plantedDate}
          </div>
          <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-medium border border-orange-100">
            <ThermometerSun className="w-4 h-4" />
            {crop.area}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex w-full mt-2 border-b border-slate-200">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 flex flex-col items-center gap-1 border-b-2 transition-colors ${
                  isActive ? 'border-brand-green text-brand-green' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-green' : ''}`} />
                <span className="text-[10px] font-semibold uppercase tracking-wide">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'growth' && <CropGrowth crop={crop} />}
          {activeTab === 'irrigation' && <CropIrrigation crop={crop} />}
          {activeTab === 'fertilizer' && <CropFertilizer crop={crop} />}
          {activeTab === 'pest' && <CropPestDisease crop={crop} />}
        </motion.div>
      </div>
    </div>
  );
};

export default CropWorkspace;

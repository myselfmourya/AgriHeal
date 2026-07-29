import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { ChevronRight, Droplets, Leaf, Calendar, Map, ClipboardList, Package } from 'lucide-react';

export default function CropFarmSettings() {
  const { settings, updateSetting } = useSettings();
  const { cropFarm } = settings;

  const MenuItem = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center justify-between p-3 border-b border-gray-100  hover:bg-gray-50 rounded-xl cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-green-50  rounded-full flex items-center justify-center text-green-700">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 ">{title}</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full pb-10">
      <div className="bg-white  rounded-2xl p-2 shadow-sm border border-gray-100 ">
        
        <MenuItem 
          icon={Leaf} 
          title="Manage Crops" 
          subtitle="Add, edit or remove crops" 
        />
        
        <MenuItem 
          icon={Calendar} 
          title="Crop Calendar" 
          subtitle="View crops wise activities" 
        />
        
        <MenuItem 
          icon={Map} 
          title="Farm Details" 
          subtitle="Soil type, farm size, location" 
        />
        
        <MenuItem 
          icon={ClipboardList} 
          title="Soil Health Records" 
          subtitle="View soil test history" 
        />
        
        <MenuItem 
          icon={Droplets} 
          title="Custom Reminders" 
          subtitle="Set crop specific reminders" 
        />
        
        <MenuItem 
          icon={Package} 
          title="Input Usage Records" 
          subtitle="Track seeds, fertilizer, etc." 
        />

      </div>
    </div>
  );
}

import React from 'react';
import { Bug, Camera, ShieldAlert, CheckCircle, Search } from 'lucide-react';

const CropPestDisease = ({ crop }) => {
  return (
    <div className="space-y-6">
      {/* Scanner Action */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute -left-6 -top-6 opacity-10">
          <Search className="w-32 h-32 text-white" />
        </div>
        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 relative z-10 border border-white/30">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2 relative z-10">Scan for Disease</h2>
        <p className="text-slate-300 text-sm mb-6 relative z-10 max-w-[200px]">
          Take a photo of any suspicious leaves, bugs, or damage.
        </p>
        <button className="w-full bg-brand-green text-white font-bold py-3.5 rounded-xl shadow-lg relative z-10">
          Open Camera
        </button>
      </div>

      {/* Active Threats */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          Active Threats
        </h3>
        
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-red-200 rounded-lg overflow-hidden shrink-0">
              {/* Placeholder image */}
              <div className="w-full h-full bg-red-200 flex items-center justify-center">
                <Bug className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <div>
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-bold text-red-900">Fall Armyworm</h4>
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">High</span>
              </div>
              <p className="text-xs text-red-700 line-clamp-2 mb-2">
                Detected 2 days ago. Causes severe damage to leaves and whorls. Immediate action required.
              </p>
              <button className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1.5 rounded-lg">
                View Treatment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Prevention Schedule */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-3">Prevention Schedule</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 flex items-center gap-4 border-b border-slate-50 opacity-60">
            <div className="w-6 h-6 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center shrink-0">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm line-through">Neem Oil Spray</h4>
              <p className="text-xs text-slate-500">Completed 10 days ago</p>
            </div>
          </div>
          
          <div className="p-4 flex items-center gap-4 border-l-4 border-blue-500 bg-blue-50/50">
            <div className="w-6 h-6 rounded-full border-2 border-slate-300 shrink-0"></div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-slate-800 text-sm">Fungicide Application</h4>
                <span className="text-xs font-medium text-blue-600">In 5 Days</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Preventive measure before monsoon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropPestDisease;

import React from 'react';
import { Droplets, CloudRain, ThermometerSun, AlertCircle } from 'lucide-react';

const CropIrrigation = ({ crop }) => {
  return (
    <div className="space-y-6">
      {/* Current Status */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 opacity-20">
          <Droplets className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <h2 className="text-lg font-medium opacity-90 mb-1">Soil Moisture</h2>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-bold">42%</span>
            <span className="text-blue-100 font-medium mb-1">Optimal</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm bg-blue-800/40 w-max px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <AlertCircle className="w-4 h-4 text-blue-200" />
            <span>Next watering in 2 days</span>
          </div>
        </div>
      </div>

      {/* Weather context */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <CloudRain className="w-8 h-8 text-blue-400 mb-2" />
          <span className="text-2xl font-bold text-slate-800">12<span className="text-sm text-slate-500 ml-1">mm</span></span>
          <span className="text-xs font-medium text-slate-500 mt-1">Expected Rain Today</span>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <ThermometerSun className="w-8 h-8 text-orange-400 mb-2" />
          <span className="text-2xl font-bold text-slate-800">32<span className="text-sm text-slate-500 ml-1">°C</span></span>
          <span className="text-xs font-medium text-slate-500 mt-1">High Evaporation</span>
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <Droplets className="w-5 h-5 text-blue-600" />
          AI Recommendation
        </h3>
        <p className="text-sm text-blue-800 leading-relaxed mb-4">
          Due to the expected rainfall of 12mm today and current moisture levels being optimal at 42%, we recommend skipping today's scheduled irrigation to save water and prevent waterlogging.
        </p>
        <div className="flex gap-3">
          <button className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-lg shadow-sm text-sm">
            Skip Schedule
          </button>
          <button className="flex-1 bg-white text-blue-600 border border-blue-200 font-semibold py-2.5 rounded-lg shadow-sm text-sm">
            Water Anyway
          </button>
        </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Irrigation Log</h3>
        <div className="space-y-4">
          {[
            { date: 'Yesterday, 6:00 AM', amount: '15L', type: 'Drip', manual: false },
            { date: '3 Days Ago, 5:30 AM', amount: '20L', type: 'Rain', manual: true },
            { date: '5 Days Ago, 6:15 AM', amount: '15L', type: 'Drip', manual: false },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${log.type === 'Rain' ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'}`}>
                  {log.type === 'Rain' ? <CloudRain className="w-5 h-5" /> : <Droplets className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">{log.type} Irrigation</h4>
                  <p className="text-xs text-slate-500">{log.date}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-800 block">{log.amount}</span>
                {log.manual && <span className="text-[10px] font-medium text-slate-400">Manual log</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CropIrrigation;

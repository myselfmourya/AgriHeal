import React from 'react';
import { Leaf, Calendar, CheckCircle, Info } from 'lucide-react';

const CropFertilizer = ({ crop }) => {
  return (
    <div className="space-y-6">
      {/* NPK Status */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Estimated Soil NPK</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-slate-700">Nitrogen (N)</span>
              <span className="text-orange-600 font-bold">Low</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-slate-700">Phosphorus (P)</span>
              <span className="text-green-600 font-bold">Optimal</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-slate-700">Potassium (K)</span>
              <span className="text-green-600 font-bold">Optimal</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Applications */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">Schedule</h3>
          <button className="text-brand-green font-semibold text-sm">Add New</button>
        </div>
        
        <div className="space-y-3">
          <div className="border border-orange-200 bg-orange-50 rounded-xl p-4 flex gap-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-800">Urea Application</h4>
                <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2 py-1 rounded-md">Today</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">20 kg/acre broadcast method</p>
              <button className="mt-3 flex items-center gap-1 text-sm font-semibold text-orange-700">
                <CheckCircle className="w-4 h-4" /> Mark as Applied
              </button>
            </div>
          </div>

          <div className="border border-slate-100 bg-slate-50 rounded-xl p-4 flex gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-slate-400 flex items-center justify-center shrink-0 shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-800">Micronutrient Spray</h4>
                <span className="text-xs font-medium text-slate-500">In 14 days</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">Zinc & Boron foliar spray</p>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Advice */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-5 text-white shadow-md">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <Info className="w-5 h-5" />
          AI Nutrition Advice
        </h3>
        <p className="text-emerald-50 text-sm leading-relaxed mb-4">
          The vegetative stage requires higher Nitrogen. Applying Urea today will boost leaf growth. Wait for the soil to dry slightly before broadcasting for best absorption.
        </p>
      </div>
    </div>
  );
};

export default CropFertilizer;

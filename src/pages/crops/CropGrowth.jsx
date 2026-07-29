import React from 'react';
import { TrendingUp, Camera, CheckCircle2, Clock } from 'lucide-react';

const CropGrowth = ({ crop }) => {
  // Mock data for demonstration
  const growthStages = [
    { id: 1, name: 'Sowing', completed: true, date: '15 Days ago' },
    { id: 2, name: 'Germination', completed: true, date: '10 Days ago' },
    { id: 3, name: 'Vegetative', completed: true, date: 'Present' },
    { id: 4, name: 'Flowering', completed: false, date: 'In 14 Days' },
    { id: 5, name: 'Harvest', completed: false, date: 'In 45 Days' }
  ];

  const currentStageIndex = 2; // Vegetative

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Current Stage</h3>
            <p className="text-slate-500 text-sm">Vegetative Growth</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
        
        <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
          <div className="bg-brand-green h-2 rounded-full" style={{ width: '45%' }}></div>
        </div>
        <div className="flex justify-between text-xs text-slate-500 font-medium">
          <span>Day 28 of 120</span>
          <span>45% Complete</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">Growth Timeline</h3>
        </div>
        
        <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[1.2rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200">
          {growthStages.map((stage, index) => (
            <div key={stage.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pb-6 last:pb-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                {stage.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-brand-green" />
                ) : index === currentStageIndex ? (
                  <Clock className="w-5 h-5 text-brand-blue" />
                ) : (
                  <div className="w-2.5 h-2.5 bg-slate-300 rounded-full"></div>
                )}
              </div>
              <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl shadow-sm border ${
                index === currentStageIndex ? 'bg-blue-50 border-blue-100' : 'bg-white border-slate-100'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-bold ${stage.completed ? 'text-slate-800' : index === currentStageIndex ? 'text-brand-blue' : 'text-slate-500'}`}>
                    {stage.name}
                  </h4>
                  <span className="text-xs font-medium text-slate-500">{stage.date}</span>
                </div>
                {index === currentStageIndex && (
                  <p className="text-xs text-slate-600 mt-2">
                    Ensure adequate nitrogen supply during this phase for optimal leaf development.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full bg-brand-green text-white font-semibold py-4 rounded-xl shadow-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
        <Camera className="w-5 h-5" />
        Log Growth Photo
      </button>
    </div>
  );
};

export default CropGrowth;

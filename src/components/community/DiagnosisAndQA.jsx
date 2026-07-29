import React from 'react';
import { Camera, Bot, Users, CheckCircle2, Search, ArrowRight } from 'lucide-react';

export default function DiagnosisAndQA() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold mb-4">
            <Bot className="w-4 h-4" />
            Powered by Vani AI
          </div>
          <h2 className="text-2xl md:text-3xl font-black mb-2">Crop Photo Diagnosis</h2>
          <p className="text-green-50 font-medium text-sm md:text-base mb-6 opacity-90 leading-relaxed">
            Upload a photo of your diseased crop. Our AI will analyze it instantly, and expert farmers from the community will provide treatment suggestions.
          </p>
          <button className="bg-white text-green-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-green-50 transition-colors flex items-center gap-2 shadow-sm">
            <Camera className="w-5 h-5" />
            Upload Photo for Diagnosis
          </button>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
          <Search className="w-64 h-64" />
        </div>
      </div>

      {/* Recent Diagnoses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-slate-800">Recent Community Diagnoses</h3>
          <button className="text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mock Diagnosis Card 1 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group cursor-pointer hover:border-green-200 transition-colors">
            <div className="h-40 bg-gray-100 relative">
              <img src="https://placehold.co/800x400/e6f4ea/2f855a?text=Paddy+Leaf+Disease" alt="Paddy leaf" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                High Priority
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">Paddy</span>
                <span className="text-xs text-slate-400">2h ago</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-1 leading-snug">Yellowing of leaves starting from the tips</h4>
              <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">
                Noticed this yellowing on my 40-day old paddy. Is this nitrogen deficiency or a disease?
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-green-600" />
                  <span className="text-[10px] font-bold text-green-600">AI Analyzed</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Expert Replied</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mock Diagnosis Card 2 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group cursor-pointer hover:border-green-200 transition-colors">
            <div className="h-40 bg-gray-100 relative">
              <img src="https://placehold.co/800x400/fff3cd/975a16?text=Cotton+Pest" alt="Cotton pest" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">Cotton</span>
                <span className="text-xs text-slate-400">5h ago</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-1 leading-snug">Small insects on the underside of cotton leaves</h4>
              <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">
                Found these tiny white insects. Are they whiteflies? What is the best organic spray?
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-500">4 Community Answers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ask Expert banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-4 md:justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Have a generic question?</h4>
            <p className="text-sm text-slate-600">Ask our panel of verified agricultural experts.</p>
          </div>
        </div>
        <button className="w-full md:w-auto px-6 py-2.5 bg-white border border-blue-200 text-blue-700 font-bold rounded-xl text-sm shadow-sm hover:bg-blue-50 transition-colors whitespace-nowrap">
          Ask an Expert
        </button>
      </div>
    </div>
  );
}

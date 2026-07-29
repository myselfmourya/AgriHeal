import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ShieldCheck, CheckCircle2, XCircle, FileText, Landmark, Clock, MapPin, Banknote } from 'lucide-react';

export default function SchemeDetailModal({ isOpen, onClose, scheme }) {
  return (
    <AnimatePresence>
      {(isOpen && scheme) && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-[32px] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative border border-white/50"
          >
            {/* Header Area */}
            <div className={`p-6 sm:p-8 bg-gradient-to-br ${scheme.color || 'from-indigo-500 to-purple-600'} text-white relative shrink-0`}>
              <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 transform translate-x-8 -translate-y-8 pointer-events-none">
                <Landmark size={120} />
              </div>
              
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="relative z-10">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                    {scheme.category}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                    {scheme.source}
                  </span>
                </div>
                
                <h2 className="text-2xl sm:text-4xl font-black mb-3 leading-tight pr-12">{scheme.name}</h2>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Information */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Description & Overview */}
                  <section>
                    <h3 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-indigo-500"/> Scheme Overview
                    </h3>
                    <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
                      <p className="text-slate-700 text-[15px] leading-relaxed font-medium mb-4">
                        {scheme.desc}
                      </p>
                      <div className="h-px w-full bg-indigo-100 my-4"></div>
                      <h4 className="text-sm font-bold text-slate-900 mb-2">What it covers:</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {scheme.whatItCovers || 'Comprehensive agricultural support as per government guidelines.'}
                      </p>
                    </div>
                  </section>

                  {/* Eligibility & Requirements */}
                  <section>
                    <h3 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500"/> Eligibility Requirements
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {scheme.category === 'Central Govt' && (
                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> 
                          <span className="text-sm text-slate-700 font-medium">Available to all eligible farmers across India.</span>
                        </div>
                      )}
                      {scheme.states && scheme.states[0] !== 'All' && (
                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> 
                          <span className="text-sm text-slate-700 font-medium">Resident of {scheme.states.join(', ')}.</span>
                        </div>
                      )}
                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> 
                        <span className="text-sm text-slate-700 font-medium">Must have valid land records (Pattadar passbook).</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> 
                        <span className="text-sm text-slate-700 font-medium">Aadhaar card linked with active bank account.</span>
                      </div>
                    </div>
                  </section>
                  
                  {/* Application Process */}
                  <section className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full"></div>
                    <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-black mb-2">Ready to Apply?</h3>
                        <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                          {scheme.howToApply || 'Submit your application to the nearest agricultural department office.'}
                        </p>
                        <div className="bg-white/10 p-3 rounded-xl border border-white/20 inline-block">
                          <span className="block text-slate-400 text-xs font-bold uppercase mb-0.5">Where to apply</span>
                          <span className="block font-bold text-sm">{scheme.whereToApply || 'State Agriculture Portal'}</span>
                        </div>
                      </div>
                      {scheme.websiteLink && (
                        <a href={scheme.websiteLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl text-sm font-black transition-all hover:bg-slate-100 whitespace-nowrap shrink-0">
                          Visit Official Website <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </section>
                </div>

                {/* Right Column: Sidebar */}
                <div className="space-y-6">
                  {/* Quick Stats Block */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Banknote size={12}/> Benefit</span>
                        <span className="font-extrabold text-slate-800 text-sm">{scheme.benefit}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Clock size={12}/> Deadline</span>
                        <span className="font-extrabold text-slate-800 text-sm">{scheme.deadline}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><MapPin size={12}/> Region</span>
                        <span className="font-extrabold text-slate-800 text-sm truncate" title={scheme.states?.join(', ')}>{scheme.states?.join(', ')}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><FileText size={12}/> Application</span>
                        <span className="font-extrabold text-slate-800 text-sm">Online/Offline</span>
                     </div>
                  </div>

                  {/* Pros and Cons */}
                  <div>
                    <h3 className="text-xs font-black text-emerald-700 mb-2 uppercase tracking-wider">Advantages</h3>
                    <ul className="space-y-2 mb-4">
                      {(scheme.pros || ['Financial security', 'Government backed', 'Direct transfer']).map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/50">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"/> {pro}
                        </li>
                      ))}
                    </ul>
                    <h3 className="text-xs font-black text-rose-700 mb-2 uppercase tracking-wider">Things to Note</h3>
                    <ul className="space-y-2">
                      {(scheme.cons || ['Complex documentation', 'Processing time varies']).map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium bg-rose-50/50 p-2 rounded-lg border border-rose-100/50">
                          <XCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0"/> {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

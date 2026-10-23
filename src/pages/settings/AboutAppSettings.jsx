import React from 'react';

export default function AboutAppSettings() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full pb-10">
      <div className="bg-white  rounded-2xl p-6 shadow-sm border border-gray-100  text-center flex flex-col items-center justify-center">
        <div className="w-24 h-24 mb-2 flex items-center justify-center">
          <img src="/app-logo.jpg" alt="AgriHeal Logo" className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 ">AgriHeal</h2>
        
        <div className="w-full h-px bg-slate-50  my-6"></div>
        
        <div className="w-full flex flex-col gap-2">
          <button className="w-full py-3 bg-gray-50  rounded-xl text-sm font-bold text-gray-700  hover:bg-slate-50 transition-colors">Check for Updates</button>
          <button className="w-full py-3 bg-gray-50  rounded-xl text-sm font-bold text-gray-700  hover:bg-slate-50 transition-colors">Terms of Service</button>
          <button className="w-full py-3 bg-gray-50  rounded-xl text-sm font-bold text-gray-700  hover:bg-slate-50 transition-colors">Privacy Policy</button>
          <button className="w-full py-3 bg-gray-50  rounded-xl text-sm font-bold text-gray-700  hover:bg-slate-50 transition-colors">Open Source Licenses</button>
        </div>
        
        <p className="text-xs text-slate-400  mt-8">© 2026 AgriHeal Inc. All rights reserved.</p>
      </div>
    </div>
  );
}

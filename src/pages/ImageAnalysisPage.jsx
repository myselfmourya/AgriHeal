import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Upload, FileText, History, ChevronRight, CheckCircle, HelpCircle, Leaf, Sun, Droplet, MapPin, Download, Share2, Bell } from 'lucide-react';
import {  CURRENT_ANALYSIS, RECOMMENDED_ACTIONS, SUGGESTED_TREATMENTS, AI_CONTEXT } from '../components/image-analysis/imageAnalysisData';

export default function ImageAnalysisPage() {
  const [activeTab, setActiveTab] = useState('upload');
  const [treatmentTab, setTreatmentTab] = useState('chemical');
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef(null);

  return (
    <div className="absolute inset-0 flex flex-col bg-[#f4f7f5] overflow-hidden">
      
      {/* Top Header */}
      <div className="bg-white px-4 md:px-8 py-4 shadow-sm relative z-20 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 border-b border-gray-100">
        <div className="flex flex-col w-full md:w-auto text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-black text-slate-800">Image Analysis</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">Upload, analyze and get smart insights about your crops</p>
        </div>
        
        {/* Mode Switcher */}
        <div className="flex items-center gap-4 w-full md:w-auto">

          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors ml-auto md:ml-0">
            <HelpCircle className="w-4 h-4" /> <span className="hidden sm:inline">How it works?</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-8 pb-8">
          
          {/* Left / Main Workspace */}
          <div className="flex-1 flex flex-col gap-8 min-w-0">
            
            {/* Tabs */}
            <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
              {[
                { id: 'upload', icon: Upload, label: 'Upload Image' },
                { id: 'camera', icon: Camera, label: 'Camera' },
                { id: 'gallery', icon: ImageIcon, label: 'Gallery' },
                { id: 'history', icon: History, label: 'History' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'upload' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dropzone */}
                <div 
                  className="border-2 border-dashed border-green-300 rounded-2xl bg-green-50/50 flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-green-50 transition-colors h-64"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Upload className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-gray-800 font-bold mb-2">Drag & drop an image here</h3>
                  <span className="text-gray-500 text-sm mb-4">or</span>
                  <button className="px-6 py-2 bg-white border border-green-600 text-green-700 font-bold rounded-full hover:bg-green-50 transition-colors">
                    Choose File
                  </button>
                  <p className="text-xs text-gray-400 mt-4">Supports: JPG, PNG, WebP (Max 10MB)</p>
                  <input type="file" className="hidden" ref={fileInputRef} accept="image/*" />
                </div>

                {/* Tips */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col h-64">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-green-800">Tips for better results</h3>
                    <Leaf className="w-5 h-5 text-green-600" />
                  </div>
                  <ul className="space-y-4 flex-1 overflow-y-auto">
                    {[
                      'Capture clear and focused images',
                      'Include affected parts of the plant',
                      'Use natural light for better accuracy',
                      'Include multiple leaves if possible'
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'camera' && (
              <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center p-12 text-center h-64">
                 <Camera className="w-12 h-12 text-gray-400 mb-4" />
                 <p className="text-gray-500 font-bold mb-4">Camera interface will open here</p>
                 <button className="px-6 py-2 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors">Open Camera</button>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center p-12 text-center h-64">
                 <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
                 <p className="text-gray-500 font-bold mb-4">Select from your device gallery</p>
                 <button onClick={() => fileInputRef.current?.click()} className="px-6 py-2 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors">Open Gallery</button>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center p-12 text-center h-64">
                 <History className="w-12 h-12 text-gray-400 mb-4" />
                 <p className="text-gray-500 font-bold mb-4">View your recent analyses history</p>
                 <button className="px-6 py-2 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors">Load History</button>
              </div>
            )}

            {/* Analysis Result Card */}
            <div>
              <h2 className="text-lg font-black text-gray-800 mb-4">Analysis Result</h2>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-8">
                
                {/* Image Section */}
                <div className="w-full xl:w-1/2 relative rounded-xl overflow-hidden group">
                  <img src={CURRENT_ANALYSIS.mainImage} alt="Analysis" className="w-full h-full object-cover min-h-[300px]" />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    Original Image
                  </div>
                  <button className="absolute bottom-4 right-4 p-2 bg-black/60 backdrop-blur-sm text-white rounded-lg hover:bg-black/80 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                  </button>
                </div>

                {/* Details Section */}
                <div className="w-full xl:w-1/2 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-6">
                      <h3 className="text-xl font-black text-gray-900">{CURRENT_ANALYSIS.title}</h3>
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">High Confidence</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                      <div>
                        <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wide">Confidence Score</p>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-black text-green-600">{CURRENT_ANALYSIS.confidence}%</span>
                          <svg className="w-8 h-8 text-green-600" viewBox="0 0 36 36">
                            <path
                              className="stroke-current text-gray-200"
                              fill="none"
                              strokeWidth="3"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="stroke-current"
                              fill="none"
                              strokeWidth="3"
                              strokeDasharray={`${CURRENT_ANALYSIS.confidence}, 100`}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                        </div>
                        <p className="text-xs font-bold text-gray-500 mt-2">Severity</p>
                        <p className="text-orange-500 font-black">{CURRENT_ANALYSIS.severity}</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wide">Likely Cause</p>
                          <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <Leaf className="w-4 h-4 text-green-600 shrink-0" /> {CURRENT_ANALYSIS.likelyCause}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wide">Detected On</p>
                            <p className="text-sm font-bold text-gray-800 flex items-center gap-1"><img src="https://cdn-icons-png.flaticon.com/128/1202/1202125.png" alt="tomato" className="w-4 h-4 shrink-0" /> {CURRENT_ANALYSIS.detectedOn}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wide">Affected Area</p>
                            <p className="text-sm font-bold text-gray-800 flex items-center gap-1"><Leaf className="w-4 h-4 text-gray-400 shrink-0"/> {CURRENT_ANALYSIS.affectedArea}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-xs text-gray-500 font-bold mb-2 uppercase tracking-wide">Description</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{CURRENT_ANALYSIS.description}</p>
                      <button className="text-green-600 text-sm font-bold mt-2 hover:underline flex items-center gap-1">Read More <ChevronRight className="w-4 h-4" /></button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 font-medium">Was this analysis helpful?</span>
                      <button onClick={(e) => { e.currentTarget.classList.toggle('text-green-600'); e.currentTarget.classList.toggle('bg-green-50') }} className="p-1 rounded-md text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514"></path></svg></button>
                      <button onClick={(e) => { e.currentTarget.classList.toggle('text-red-600'); e.currentTarget.classList.toggle('bg-red-50') }} className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.514"></path></svg></button>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <button className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-green-600"><FileText className="w-4 h-4" /> <span className="hidden sm:inline">Save Report</span></button>
                      <button className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-green-600"><Download className="w-4 h-4" /> <span className="hidden sm:inline">Download PDF</span></button>
                      <button className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-green-600"><Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Share</span></button>
                      <button className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-green-600"><Bell className="w-4 h-4" /> <span className="hidden sm:inline">Add Reminder</span></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* Right Panel - Context & Treatments */}
          <div className="w-full xl:w-[340px] shrink-0 flex flex-col gap-6">
            
            {/* Recommended Actions */}
            <div>
              <h2 className="text-lg font-black text-gray-800 mb-4">Recommended Actions</h2>
              <div className="space-y-4">
                {RECOMMENDED_ACTIONS.map((action, i) => (
                  <div key={action.id} className="flex gap-3">
                    <div className="mt-0.5 shrink-0">
                      <CheckCircle className={`w-5 h-5 ${i === 2 ? 'text-green-600 bg-green-50 rounded-full' : 'text-gray-300'}`} />
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${i === 2 ? 'text-gray-900' : 'text-gray-700'}`}>{action.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2.5 bg-white border border-gray-200 rounded-xl text-green-700 font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                View Detailed Guide <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Suggested Treatments */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-gray-800">Suggested Treatments</h2>
                <button className="text-green-600 font-bold text-sm hover:underline">View All</button>
              </div>
              
              <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
                <button 
                  onClick={() => setTreatmentTab('chemical')}
                  className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-colors ${treatmentTab === 'chemical' ? 'bg-green-100 text-green-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Chemical
                </button>
                <button 
                  onClick={() => setTreatmentTab('organic')}
                  className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-colors ${treatmentTab === 'organic' ? 'bg-green-100 text-green-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Organic
                </button>
              </div>

              <div className="space-y-3">
                {SUGGESTED_TREATMENTS[treatmentTab].map(treatment => (
                  <div key={treatment.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <img src={treatment.image} alt="Medicine" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 truncate mb-1">{treatment.name}</h4>
                      <p className="text-xs text-gray-600 mb-0.5">Dose: <span className="font-medium text-gray-800">{treatment.dose}</span></p>
                      <p className="text-xs text-gray-600 mb-2">{treatment.instructions}</p>
                      <button className="text-green-600 text-xs font-bold hover:underline flex items-center gap-1">View Alternatives <ChevronRight className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Context */}
            <div>
              <h2 className="text-lg font-black text-gray-800 mb-4">AI Context</h2>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 divide-y divide-gray-100">
                <div className="flex items-center gap-3 py-3 first:pt-1 last:pb-1">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <img src="https://cdn-icons-png.flaticon.com/128/1202/1202125.png" alt="Crop" className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <p className="text-xs text-gray-500 font-bold">Current Crop</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{AI_CONTEXT.crop}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-3 first:pt-1 last:pb-1">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <p className="text-xs text-gray-500 font-bold">Location</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{AI_CONTEXT.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-3 first:pt-1 last:pb-1">
                  <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                    <Sun className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <p className="text-xs text-gray-500 font-bold">Weather</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{AI_CONTEXT.weather}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-3 first:pt-1 last:pb-1">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Droplet className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <p className="text-xs text-gray-500 font-bold">Last Irrigation</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{AI_CONTEXT.lastIrrigation}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

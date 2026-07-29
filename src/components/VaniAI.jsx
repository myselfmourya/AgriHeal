import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Globe,
  Leaf,
  
  PhoneCall,
  
  AlertTriangle,
  X,
  
  
  Droplet
} from 'lucide-react';

const LANGUAGES = [
  { code: 'hi-IN', name: 'हिंदी (Hindi)' },
  { code: 'te-IN', name: 'తెలుగు (Telugu)' },
  { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
  { code: 'en-IN', name: 'English' }
];

const SUGGESTIONS = [
  'My cotton leaves are curling',
  'When should I irrigate my paddy?',
  'What is the heat risk for tomorrow?',
  'Is my well water safe for crops?',
  'Check mandi price for maize'
];

export default function VaniAI({ onNavigate }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'vani', text: 'Namaskaram! I am Vani, your Agricultural Expert. How can I assist with your farm today?', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLang, setCurrentLang] = useState('en-IN');
  const [transcript, setTranscript] = useState('');
  const [showEmergency, setShowEmergency] = useState(false);
  
  const recognitionRef = useRef(null);
  const synthesisRef = window.speechSynthesis;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, transcript]);

  // Simulated Speech API Hookup
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          handleUserInput(finalTranscript);
        } else {
          setTranscript(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        if (event.error !== 'no-speech') setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) recognitionRef.current.start();
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthesisRef) synthesisRef.cancel();
    };
  }, [isListening]);

  useEffect(() => {
    if (recognitionRef.current) recognitionRef.current.lang = currentLang;
  }, [currentLang]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setTranscript('');
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const stopSpeaking = () => {
    synthesisRef.cancel();
    setIsSpeaking(false);
  };

  const speak = (text) => {
    if (!synthesisRef) return;
    synthesisRef.cancel();
    const chunks = text.match(/[^.!?]+[.!?]+/g) || [text];
    chunks.forEach((chunk, index) => {
      const utterance = new SpeechSynthesisUtterance(chunk.trim());
      utterance.lang = currentLang;
      if (index === 0) utterance.onstart = () => setIsSpeaking(true);
      if (index === chunks.length - 1) utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synthesisRef.speak(utterance);
    });
  };

  const handleUserInput = (text) => {
    const cleanText = text.trim();
    if (!cleanText) return;
    setTranscript('');
    const userMsg = { id: Date.now(), sender: 'user', text: cleanText, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setTimeout(() => generateResponse(cleanText.toLowerCase()), 800);
  };

  const generateResponse = (input) => {
    let responseText = '';
    
    if (input.includes('scan') || input.includes('crop') || input.includes('leaf') || input.includes('curling') || input.includes('spot')) {
      responseText = 'It sounds like a pest or fungal issue. Let me open the Crop Scan tool so you can take a picture of the affected leaves.';
      setTimeout(() => onNavigate && onNavigate('CropScan'), 2500);
    }
    else if (input.includes('water') || input.includes('well') || input.includes('irrigate')) {
      responseText = 'Soil moisture levels are currently at 42%. Opening the Satellite Water Monitor for detailed mapping of your fields.';
      setTimeout(() => onNavigate && onNavigate('WaterSafety'), 2500);
    }
    else if (input.includes('weather') || input.includes('heat') || input.includes('temperature')) {
      responseText = 'The forecasted high today is 38°C. Please check ThermaPlan for safe field working hours and livestock heat stress risks.';
      setTimeout(() => onNavigate && onNavigate('ThermaPlan'), 2500);
    }
    else if (input.includes('price') || input.includes('market')) {
      responseText = 'Maize is currently trading at ₹2,200 per quintal in the Warangal Mandi. Would you like me to open the marketplace?';
    }
    else if (input.includes('emergency') || input.includes('hazard') || input.includes('spill')) {
      setShowEmergency(true);
      responseText = 'Farm emergency protocol activated. Displaying immediate hazard response and local agricultural officer contacts.';
    }
    else {
      responseText = 'I am processing your query. Please provide more details regarding your crop, soil, or machinery.';
    }

    const vaniMsg = { id: Date.now() + 1, sender: 'vani', text: responseText, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, vaniMsg]);
    speak(responseText);
  };

  return (
    <div className="w-full min-h-screen bg-stone-50 text-stone-900 flex flex-col relative overflow-hidden font-sans">
      
      {/* Background Graphic Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-200/40 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-200/30 blur-[100px] rounded-full pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-10 px-6 py-6 bg-white/80 backdrop-blur-xl border-b border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/30">
            <Leaf className="text-white" size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-stone-800">Vani Agronomist</h1>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-[10px] font-bold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE
              </span>
            </div>
            <p className="text-sm font-medium text-stone-500">AI Farm Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <select 
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-sm font-bold text-stone-700 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={stopSpeaking}
            className={`p-2.5 rounded-xl border transition-colors ${isSpeaking ? 'bg-amber-100 border-amber-200 text-amber-700' : 'bg-stone-100 border-stone-200 text-stone-500'}`}
          >
            {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>

      {/* EMERGENCY PANEL */}
      <AnimatePresence>
        {showEmergency && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-20 mx-4 md:mx-auto max-w-3xl mt-4"
          >
            <div className="bg-amber-50 border border-amber-200 rounded-[24px] p-5 shadow-lg relative overflow-hidden">
              <button onClick={() => setShowEmergency(false)} className="absolute top-4 right-4 p-2 text-amber-500 hover:bg-amber-100 rounded-full transition-colors">
                <X size={20} />
              </button>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-[16px] animate-pulse">
                  <AlertTriangle size={28} />
                </div>
                <div>
                  <h3 className="font-black text-amber-800 text-lg">Farm Hazard Alert</h3>
                  <p className="text-sm text-amber-700 mt-1 mb-4">Immediate protocol for pesticide spill or severe weather hazard.</p>
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-amber-700 transition-colors text-sm">
                      <PhoneCall size={18} /> Contact Agri-Officer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 relative z-10 pb-40 max-w-4xl mx-auto w-full hide-scrollbar">
        {messages.map((msg, idx) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-end gap-2 max-w-[85%] md:max-w-[70%]">
              {msg.sender === 'vani' && (
                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 mb-1">
                  <Leaf size={14} className="text-emerald-600" />
                </div>
              )}
              
              <div 
                className={`p-4 shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-emerald-600 text-white rounded-[24px] rounded-br-[8px]' 
                    : 'bg-white text-stone-800 rounded-[24px] rounded-bl-[8px] border border-stone-200'
                }`}
              >
                <p className="text-sm md:text-base leading-relaxed font-medium">{msg.text}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-stone-400 mt-2 px-10 uppercase tracking-wider">
              {msg.timestamp}
            </span>
          </motion.div>
        ))}
        
        {/* Active Transcript Bubble */}
        <AnimatePresence>
          {transcript && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-end">
              <div className="max-w-[85%] md:max-w-[70%] p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-[24px] rounded-br-[8px]">
                <p className="text-sm italic font-medium">"{transcript}"</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* INPUT AREA */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-white via-white/95 to-transparent pt-12 pb-6 px-4 md:px-8 z-30">
        <div className="max-w-4xl mx-auto relative">
          
          {/* Suggestions */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-6 mask-fade-edges">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => handleUserInput(s)}
                className="whitespace-nowrap px-4 py-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-full text-xs font-bold text-stone-600 shadow-sm transition-colors shrink-0"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Mic Controls */}
          <div className="flex items-center justify-center gap-6">
            <div className="w-16 flex justify-end">
              <AnimatePresence>
                {isSpeaking && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-end gap-1 h-8">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-1.5 bg-emerald-500 rounded-full animate-pulse" style={{ height: `${Math.random() * 20 + 8}px`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              {isListening && (
                <div className="absolute inset-[-20px] bg-emerald-200 rounded-full animate-ping pointer-events-none" />
              )}
              <button
                onClick={toggleListening}
                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
                  isListening 
                    ? 'bg-rose-500 scale-95 shadow-rose-500/40' 
                    : 'bg-emerald-600 hover:scale-105 shadow-emerald-600/30'
                }`}
              >
                {isListening ? <MicOff size={32} className="text-white" /> : <Mic size={32} className="text-white" />}
              </button>
            </div>

            <div className="w-16">
               {isListening && <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider animate-pulse">Listening...</span>}
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}

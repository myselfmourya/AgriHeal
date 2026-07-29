import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Leaf } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const slides = [
  {
    id: 1,
    title: 'Smart Farming\nBetter Tomorrow',
    description: 'AI powered insights, expert advice and smart tools to grow better every day.',
    image: '/assets/onboarding-1.jpg',
  },
  {
    id: 2,
    title: 'All-in-One\nFarming Solution',
    description: 'Weather, crop care, market prices, store, community and more - everything you need in one app.',
    image: '/assets/onboarding-2.jpg',
  },
  {
    id: 3,
    title: 'AI Voice Assistant\nfor Farmers',
    description: 'Ask anything in your language and get instant, simple and accurate answers.',
    image: '/assets/onboarding-3.jpg',
  }
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      completeOnboarding();
      navigate('/lang');
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#FDFCF7] overflow-hidden lg:flex-row lg:h-screen">
      
      {/* Text Section (Top on mobile, Left on desktop) */}
      <div className="pt-12 px-8 flex flex-col z-20 lg:w-1/2 lg:justify-center lg:px-16">
        <div className="flex items-center gap-2 mb-1">
          <Leaf className="w-7 h-7 text-green-600 fill-current" />
          <span className="text-2xl font-bold text-green-800">AgriHeal</span>
        </div>
        <p className="text-sm font-medium text-green-700 mb-12">AI Voice Farming Assistant</p>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight leading-[1.1] whitespace-pre-line">
              {slides[currentSlide].title}
            </h1>
            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Image Section (Bottom on mobile, Right on desktop) */}
      <div className="flex-1 relative w-full lg:w-1/2 mt-8 lg:mt-0 lg:h-full lg:bg-green-50 overflow-hidden rounded-t-[60px] lg:rounded-none lg:rounded-l-[60px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] lg:shadow-[-10px_0_40px_rgba(0,0,0,0.05)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
              src={slides[currentSlide].image} 
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover object-bottom lg:object-center"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* White Wave Overlay at bottom to blend buttons area on mobile */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-10 lg:hidden pointer-events-none" />
      </div>

      {/* Bottom Controls (Fixed at bottom on all screens) */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-between z-30 lg:justify-end lg:gap-12">
        {/* Page Indicators (Centered on mobile, left-aligned on desktop inside the container) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex gap-2 lg:static lg:translate-x-0">
          {slides.map((_, idx) => (
            <div 
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-6 bg-green-600' : 'w-2 bg-green-200'
              }`}
            />
          ))}
        </div>
        
        {/* Next/FAB Button */}
        <button 
          onClick={handleNext}
          className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(22,163,74,0.3)] hover:bg-green-700 hover:scale-105 active:scale-95 transition-all ml-auto"
        >
          <ArrowRight className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

    </div>
  );
}

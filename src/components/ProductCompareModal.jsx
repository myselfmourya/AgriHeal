import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, CheckCircle2 } from 'lucide-react';

export default function ProductCompareModal({ isOpen, onClose, productA, productB }) {
  if (!isOpen || !productA || !productB) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
            <h2 className="text-xl font-extrabold text-slate-900">Compare Products</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-3 gap-6">
              
              {/* Feature Column */}
              <div className="space-y-6 pt-32 font-bold text-slate-500 text-sm">
                <div className="h-10 flex items-center">Price</div>
                <div className="h-10 flex items-center">Rating</div>
                <div className="h-10 flex items-center">Brand</div>
                <div className="h-10 flex items-center">Category</div>
                <div className="flex items-start pt-2 h-20">Suitable For</div>
                <div className="flex items-start pt-2">Key Benefits</div>
              </div>

              {/* Product A */}
              <div className="space-y-6">
                <div className="h-32 rounded-xl overflow-hidden mb-4 border border-slate-100 shadow-sm relative">
                  <img src={productA.image} alt={productA.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-md rounded-lg p-2 shadow-sm">
                    <p className="text-sm font-bold text-slate-900 truncate">{productA.name}</p>
                  </div>
                </div>

                <div className="h-10 flex items-center font-black text-slate-900">
                  ₹{productA.price}
                </div>
                
                <div className="h-10 flex items-center">
                  <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-md">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-sm">{productA.rating}</span>
                  </div>
                </div>

                <div className="h-10 flex items-center text-sm font-semibold text-slate-700">
                  {productA.brand}
                </div>

                <div className="h-10 flex items-center text-sm font-semibold text-slate-700 capitalize">
                  {productA.category.replace('-', ' ')}
                </div>

                <div className="flex flex-wrap gap-1 items-start pt-2 h-20">
                  {productA.suitableFor?.map((c, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
                      {c}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-2 items-start pt-2">
                  {productA.benefits?.map((b, i) => (
                    <div key={i} className="text-xs text-slate-600 flex gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product B */}
              <div className="space-y-6">
                <div className="h-32 rounded-xl overflow-hidden mb-4 border border-slate-100 shadow-sm relative">
                  <img src={productB.image} alt={productB.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-md rounded-lg p-2 shadow-sm">
                    <p className="text-sm font-bold text-slate-900 truncate">{productB.name}</p>
                  </div>
                </div>

                <div className="h-10 flex items-center font-black text-slate-900">
                  ₹{productB.price}
                </div>
                
                <div className="h-10 flex items-center">
                  <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-md">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-sm">{productB.rating}</span>
                  </div>
                </div>

                <div className="h-10 flex items-center text-sm font-semibold text-slate-700">
                  {productB.brand}
                </div>

                <div className="h-10 flex items-center text-sm font-semibold text-slate-700 capitalize">
                  {productB.category.replace('-', ' ')}
                </div>

                <div className="flex flex-wrap gap-1 items-start pt-2 h-20">
                  {productB.suitableFor?.map((c, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
                      {c}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-2 items-start pt-2">
                  {productB.benefits?.map((b, i) => (
                    <div key={i} className="text-xs text-slate-600 flex gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

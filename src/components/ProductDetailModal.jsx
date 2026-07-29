import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Truck, ShieldAlert, CheckCircle2, MapPin } from 'lucide-react';

export default function ProductDetailModal({ isOpen, onClose, product }) {
  if (!isOpen || !product) return null;

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
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header Image */}
          <div className="relative h-64 bg-slate-100 shrink-0">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {product.discount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                  {product.discount}% OFF
                </span>
              )}
              <button 
                onClick={onClose}
                className="p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-4 left-6 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-green-300 mb-1 block">
                {product.brand}
              </span>
              <h2 className="text-2xl font-extrabold">{product.name}</h2>
            </div>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar">
            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2.5 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-sm">{product.rating}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 text-sm font-medium">
                <Truck className="w-4 h-4" />
                {product.deliveryTime}
              </div>
              <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                In Stock ({product.stock})
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Suitable For</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.suitableFor?.map((crop, idx) => (
                      <span key={idx} className="bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-md">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Usage Information</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{product.usage}</p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Key Benefits</h3>
                  <ul className="space-y-2">
                    {product.benefits?.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                {product.warnings && product.warnings.length > 0 && (
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      Warnings & Precautions
                    </h3>
                    <ul className="space-y-1">
                      {product.warnings.map((warning, idx) => (
                        <li key={idx} className="text-xs text-amber-700 flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1" />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.seller && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Nearby Seller Option</h3>
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold text-slate-800">{product.seller.name}</p>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="w-4 h-4" /> {product.seller.distance} away
                      </div>
                      <p className="text-slate-600">Contact: {product.seller.contact}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
            <div>
              <p className="text-sm text-slate-500 font-medium">Price</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-slate-900">₹{product.price}</span>
                {product.discount > 0 && (
                  <span className="text-sm text-slate-400 line-through mb-1">
                    ₹{Math.round(product.price * (1 + product.discount / 100))}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  alert("Added to cart!");
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl text-green-600 bg-green-50 hover:bg-green-100 font-bold text-sm transition-colors"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => {
                  alert("Proceeding to Buy Now checkout!");
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-colors shadow-sm"
              >
                Buy Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

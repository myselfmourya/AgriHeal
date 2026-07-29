import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, ShoppingCart, TrendingUp, Sparkles, Truck, 
  Star, Package, MapPin, X
} from 'lucide-react';
import { useFarmer } from '../contexts/FarmerContext';
import { CATEGORIES, PRODUCTS_DATA, RENTAL_TOOLS } from '../data/storeProducts';
import ProductDetailModal from '../components/ProductDetailModal';
import ProductCompareModal from '../components/ProductCompareModal';

export default function ToolsStore() {
  const { profile, myCrops } = useFarmer();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Cart State
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // AI Search State
  const [isFetchingAI, setIsFetchingAI] = useState(false);
  const [aiProducts, setAiProducts] = useState([]);
  
  // For Comparison
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === productId) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleAISearch = async () => {
    if (!searchQuery) return;
    setIsFetchingAI(true);
    try {
      // Simulate API call and fetch from Wikipedia for image
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(searchQuery)}&prop=pageimages&format=json&pithumbsize=400&origin=*`);
      const data = await res.json();
      const pages = data.query?.pages;
      let imgUrl = 'https://images.unsplash.com/photo-1592837330528-98e9b422a550?auto=format&fit=crop&q=80&w=400';
      
      if (pages) {
        const pageId = Object.keys(pages)[0];
        if (pageId !== '-1' && pages[pageId].thumbnail) {
          imgUrl = pages[pageId].thumbnail.source;
        }
      }

      const newProduct = {
        id: `ai-${Date.now()}`,
        name: `AI Found: ${searchQuery}`,
        brand: 'SmartAgri AI',
        category: 'ai-generated',
        price: Math.floor(Math.random() * 500) + 100,
        discount: 0,
        rating: (4 + Math.random()).toFixed(1),
        stock: 10,
        deliveryTime: '2-3 days',
        image: imgUrl,
        suitableFor: ['All crops'],
        usage: `Generated usage instructions for ${searchQuery}.`,
        benefits: ['AI Recommended', 'High Efficiency'],
        warnings: ['Verify before use'],
        seller: { name: 'AI Global Suppliers', distance: 'N/A', contact: '1800-AI-FARM' }
      };

      setAiProducts(prev => [...prev, newProduct]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingAI(false);
    }
  };

  // Derive Recommended Products based on user's crops
  const recommendedProducts = useMemo(() => {
    if (myCrops.length === 0) return PRODUCTS_DATA.slice(0, 4);
    
    const cropNames = myCrops.map(c => c.name.toLowerCase());
    const recs = PRODUCTS_DATA.filter(product => 
      product.suitableFor?.some(crop => cropNames.includes(crop.toLowerCase()) || crop.toLowerCase() === 'all crops')
    );
    
    // Return top 4 recommended, fallback to top 4 of all
    return recs.length > 0 ? recs.slice(0, 4) : PRODUCTS_DATA.slice(0, 4);
  }, [myCrops]);

  // Filter main product list
  const filteredProducts = useMemo(() => {
    const allProducts = [...PRODUCTS_DATA, ...aiProducts];
    return allProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, aiProducts]);

  React.useEffect(() => {
    if (searchQuery && filteredProducts.length === 0 && !isFetchingAI) {
      const timer = setTimeout(() => {
        handleAISearch();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, filteredProducts.length, isFetchingAI]);

  const toggleCompare = (product) => {
    if (compareList.find(p => p.id === product.id)) {
      setCompareList(compareList.filter(p => p.id !== product.id));
    } else {
      if (compareList.length < 2) {
        setCompareList([...compareList, product]);
      } else {
        alert("You can only compare 2 products at a time!");
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-24 pt-6 space-y-8 px-4 md:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Farmer Tools & Store</h1>
          <p className="text-zinc-500 font-medium mt-1">Buy, rent, and compare high-quality agricultural products.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCompareMode(!compareMode)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${compareMode ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-gray-200 text-slate-700 hover:bg-gray-50'}`}
          >
            {compareMode ? 'Cancel Compare' : 'Compare Products'}
          </button>
          
          <button 
            onClick={() => setShowCart(true)}
            className="relative p-2.5 bg-white border border-gray-200 rounded-xl text-slate-700 hover:bg-gray-50 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Compare Banner */}
      {compareMode && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between shadow-sm"
        >
          <div>
            <h3 className="font-bold text-indigo-900">Compare Mode Active</h3>
            <p className="text-sm text-indigo-700">Select up to 2 products to compare their features.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-bold text-indigo-800 bg-white px-3 py-1.5 rounded-lg border border-indigo-100">
              {compareList.length} / 2 Selected
            </div>
            <button 
              disabled={compareList.length !== 2}
              onClick={() => setShowCompareModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50 transition-opacity"
            >
              Compare Now
            </button>
          </div>
        </motion.div>
      )}

      {/* AI Suggestion Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[32px] shadow-xl p-8 bg-gradient-to-br from-green-500 to-emerald-600 text-white"
      >
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <Sparkles className="w-32 h-32" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold mb-4">
            <Sparkles className="w-4 h-4" /> AI Recommendations
          </div>
          <h2 className="text-3xl font-extrabold mb-2">Tailored for your farm</h2>
          <p className="text-green-50 text-lg opacity-90 font-medium">
            Based on your {myCrops.length > 0 ? myCrops.map(c => c.name).join(', ') : 'profile'} crops, we suggest preparing crop protection measures early to maximize yield.
          </p>
        </div>
      </motion.div>

      {/* Search and Categories */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search for fertilisers, seeds, tools..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar hide-scrollbar-mobile">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                selectedCategory === cat.id 
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                  : 'bg-white text-slate-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Section */}
      {selectedCategory === 'all' && !searchQuery && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-zinc-900">
            <TrendingUp className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold tracking-tight">Recommended For You</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => setSelectedProduct(product)}
                compareMode={compareMode}
                isSelected={compareList.some(p => p.id === product.id)}
                onToggleCompare={() => toggleCompare(product)}
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Rental Section */}
      {selectedCategory === 'all' && !searchQuery && (
        <div className="space-y-4 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 text-zinc-900">
            <Package className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold tracking-tight">Rental Tools Nearby</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RENTAL_TOOLS.map(tool => (
              <div key={tool.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow flex gap-4">
                <img src={tool.image} alt={tool.name} className="w-24 h-24 rounded-xl object-cover shrink-0" />
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{tool.type}</span>
                    <h3 className="font-bold text-slate-900 line-clamp-1">{tool.name}</h3>
                    <div className="text-sm font-semibold text-slate-700 mt-1">₹{tool.pricePerDay} / day</div>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                    <MapPin className="w-3 h-3" /> {tool.distance}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Products Grid */}
      <div className="space-y-4 pt-6 border-t border-gray-100">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
          {selectedCategory === 'all' ? 'All Products' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
        </h2>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 border-dashed">
            <p className="text-slate-500 font-medium mb-4">No products found for "{searchQuery}".</p>
            {isFetchingAI ? (
              <div className="flex items-center justify-center gap-2 text-indigo-600 font-medium">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span>Searching AI...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-slate-400 font-medium">
                <Sparkles className="w-5 h-5" />
                <span>AI will search shortly...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => setSelectedProduct(product)}
                compareMode={compareMode}
                isSelected={compareList.some(p => p.id === product.id)}
                onToggleCompare={() => toggleCompare(product)}
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductDetailModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
        onAddToCart={addToCart}
      />

      <ProductCompareModal 
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        productA={compareList[0]}
        productB={compareList[1]}
      />

      <CartModal 
        isOpen={showCart} 
        onClose={() => setShowCart(false)} 
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        clearCart={() => setCartItems([])}
      />
    </div>
  );
}

// ── Helper Components ─────────────────────────────────────────

function ProductCard({ product, onClick, compareMode, isSelected, onToggleCompare, onAddToCart }) {
  return (
    <div 
      className={`group bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col relative
        ${compareMode && isSelected ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20' : 'border-gray-200 hover:border-green-300 hover:shadow-xl hover:-translate-y-1'}
      `}
      onClick={compareMode ? onToggleCompare : onClick}
    >
      {/* Discount Badge */}
      {product.discount > 0 && !compareMode && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg z-10 shadow-sm">
          {product.discount}% OFF
        </div>
      )}

      {/* Compare Checkbox */}
      {compareMode && (
        <div className={`absolute top-3 left-3 w-6 h-6 rounded-full border-2 z-10 flex items-center justify-center transition-colors
          ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'bg-white border-gray-300'}
        `}>
          {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
        </div>
      )}

      <div className="h-48 overflow-hidden bg-slate-100 relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1 block">
          {product.brand}
        </span>
        <h3 className="font-bold text-slate-900 leading-tight mb-2 line-clamp-2 flex-1">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5 text-yellow-500 bg-yellow-50 px-1.5 py-0.5 rounded text-xs font-bold">
            <Star className="w-3 h-3 fill-current" /> {product.rating}
          </div>
          <span className="text-xs font-medium text-slate-400">•</span>
          <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
            <Truck className="w-3 h-3" /> {product.deliveryTime}
          </div>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div>
            <div className="text-lg font-black text-slate-900">₹{product.price}</div>
            {product.discount > 0 && (
              <div className="text-xs text-slate-400 line-through font-medium">
                ₹{Math.round(product.price * (1 + product.discount / 100))}
              </div>
            )}
          </div>
          
          {!compareMode && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if(onAddToCart) onAddToCart();
              }}
              className="bg-zinc-100 hover:bg-green-600 hover:text-white text-zinc-700 w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Cart Modal Component ───────────────────────────────────────

function CartModal({ isOpen, onClose, cartItems, updateQuantity, clearCart }) {
  if (!isOpen) return null;
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        className="w-full max-w-md bg-white h-full shadow-2xl relative flex flex-col"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" /> Your Cart
          </h2>
          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button 
                onClick={clearCart} 
                className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors px-3 py-1 bg-red-50 hover:bg-red-100 rounded-lg"
              >
                Clear Cart
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-slate-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-medium">Your cart is empty.</div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex gap-4 items-center bg-slate-50 p-3 rounded-xl border border-gray-100">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{item.name}</h3>
                  <div className="text-green-600 font-black text-sm">₹{item.price}</div>
                </div>
                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-sm">
                  <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-500 hover:text-red-500 font-bold px-1.5 transition-colors">−</button>
                  <span className="font-bold text-sm text-slate-900 w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-500 hover:text-green-500 font-bold px-1.5 transition-colors">+</button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-6 border-t border-gray-100 bg-slate-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 font-medium">Total Amount</span>
            <span className="text-2xl font-black text-slate-900">₹{total}</span>
          </div>
          <button 
            disabled={cartItems.length === 0}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg transition-colors disabled:opacity-50"
          >
            Proceed to Checkout
          </button>
        </div>
      </motion.div>
    </div>
  );
}

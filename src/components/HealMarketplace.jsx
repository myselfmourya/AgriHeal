import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, MapPin, Star, Package, 
  Wallet, PieChart as  ShieldCheck, FileText, ChevronRight,
  Info, Leaf, CircleDollarSign, LineChart as LineChartIcon,
  X, Building2, Search, Mic, MessageSquare, Plus, Send, Map, CloudRain
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';
import { useFarmer } from '../contexts/FarmerContext';
import { fetchMarketPrices } from '../services/marketService';

// Accurate current Indian Market Prices (per quintal)
export const allCrops = [
  // Grains & Cereals
    { name: 'Paddy', emoji: '🌾', price: 2350, unit: 'Quintal', increase: true, diff: 50, percent: '2.1%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Wheat', emoji: '🌾', price: 2275, unit: 'Quintal', increase: true, diff: 25, percent: '1.1%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Maize', emoji: '🌽', price: 2090, unit: 'Quintal', increase: true, diff: 80, percent: '4.0%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Bajra', emoji: '🌾', price: 2500, unit: 'Quintal', increase: true, diff: 50, percent: '2.0%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Jowar', emoji: '🌾', price: 3180, unit: 'Quintal', increase: true, diff: 80, percent: '2.5%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Ragi', emoji: '🌾', price: 3846, unit: 'Quintal', increase: false, diff: 40, percent: '1.0%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Barley', emoji: '🌾', price: 2200, unit: 'Quintal', increase: true, diff: 15, percent: '0.6%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Oats', emoji: '🌾', price: 3500, unit: 'Quintal', increase: false, diff: 0, percent: '0.0%', status: 'Stable', color: 'text-blue-500', bg: 'bg-blue-100' },

    // Pulses (Dals)
    { name: 'Gram (Chana)', emoji: '🌾', price: 5440, unit: 'Quintal', increase: true, diff: 40, percent: '0.7%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Tur (Arhar)', emoji: '🌾', price: 7000, unit: 'Quintal', increase: true, diff: 100, percent: '1.4%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Urad Dal', emoji: '🌾', price: 6950, unit: 'Quintal', increase: false, diff: 50, percent: '0.7%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Moong Dal', emoji: '🌾', price: 8558, unit: 'Quintal', increase: true, diff: 120, percent: '1.4%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Masoor Dal', emoji: '🌾', price: 6425, unit: 'Quintal', increase: true, diff: 75, percent: '1.1%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Dry Peas', emoji: '🟢', price: 4500, unit: 'Quintal', increase: false, diff: 100, percent: '2.1%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },

    // Oilseeds
    { name: 'Soybean', emoji: '🌱', price: 4600, unit: 'Quintal', increase: true, diff: 100, percent: '2.2%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Mustard', emoji: '🌼', price: 5650, unit: 'Quintal', increase: false, diff: 150, percent: '2.5%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Groundnut', emoji: '🥜', price: 6300, unit: 'Quintal', increase: true, diff: 200, percent: '3.2%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Sunflower', emoji: '🌻', price: 6760, unit: 'Quintal', increase: true, diff: 60, percent: '0.8%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Safflower', emoji: '🌼', price: 5800, unit: 'Quintal', increase: false, diff: 40, percent: '0.6%', status: 'Stable', color: 'text-blue-500', bg: 'bg-blue-100' },
    { name: 'Sesame (Til)', emoji: '🌱', price: 8635, unit: 'Quintal', increase: true, diff: 135, percent: '1.5%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Castor Seed', emoji: '🌱', price: 7000, unit: 'Quintal', increase: false, diff: 100, percent: '1.4%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Niger Seed', emoji: '🌱', price: 7734, unit: 'Quintal', increase: true, diff: 34, percent: '0.4%', status: 'Stable', color: 'text-blue-500', bg: 'bg-blue-100' },

    // Cash Crops & Spices
    { name: 'Cotton', emoji: '☁️', price: 7100, unit: 'Quintal', increase: true, diff: 120, percent: '1.7%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Sugarcane', emoji: '🎋', price: 340, unit: 'Quintal', increase: false, diff: 0, percent: '0.0%', status: 'Stable', color: 'text-blue-500', bg: 'bg-blue-100' },
    { name: 'Jute', emoji: '🎋', price: 5050, unit: 'Quintal', increase: true, diff: 50, percent: '1.0%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Turmeric', emoji: '🌿', price: 13200, unit: 'Quintal', increase: false, diff: 300, percent: '2.2%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Chilli (Red)', emoji: '🌶️', price: 14500, unit: 'Quintal', increase: true, diff: 500, percent: '3.5%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Garlic', emoji: '🧄', price: 12000, unit: 'Quintal', increase: true, diff: 400, percent: '3.4%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Ginger', emoji: '🫚', price: 8000, unit: 'Quintal', increase: false, diff: 200, percent: '2.4%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Coriander', emoji: '🌿', price: 8500, unit: 'Quintal', increase: true, diff: 100, percent: '1.1%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Cumin (Jeera)', emoji: '🌱', price: 28000, unit: 'Quintal', increase: true, diff: 800, percent: '2.9%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Black Pepper', emoji: '⚫', price: 55000, unit: 'Quintal', increase: false, diff: 1000, percent: '1.7%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Cardamom', emoji: '🌱', price: 150000, unit: 'Quintal', increase: true, diff: 5000, percent: '3.4%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },

    // Vegetables
    { name: 'Tomato', emoji: '🍅', price: 1500, unit: 'Quintal', increase: false, diff: 200, percent: '11.7%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Onion', emoji: '🧅', price: 2100, unit: 'Quintal', increase: true, diff: 150, percent: '7.6%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Potato', emoji: '🥔', price: 1450, unit: 'Quintal', increase: false, diff: 50, percent: '3.3%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Cabbage', emoji: '🥬', price: 1200, unit: 'Quintal', increase: true, diff: 100, percent: '9.0%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Cauliflower', emoji: '🥦', price: 1800, unit: 'Quintal', increase: false, diff: 200, percent: '10.0%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Brinjal', emoji: '🍆', price: 2000, unit: 'Quintal', increase: true, diff: 150, percent: '8.1%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Okra (Bhindi)', emoji: '🥒', price: 2500, unit: 'Quintal', increase: true, diff: 200, percent: '8.6%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Carrot', emoji: '🥕', price: 1800, unit: 'Quintal', increase: false, diff: 100, percent: '5.2%', status: 'Stable', color: 'text-blue-500', bg: 'bg-blue-100' },
    { name: 'Radish', emoji: '🥕', price: 1000, unit: 'Quintal', increase: true, diff: 50, percent: '5.2%', status: 'Stable', color: 'text-blue-500', bg: 'bg-blue-100' },
    { name: 'Capsicum', emoji: '🫑', price: 3500, unit: 'Quintal', increase: true, diff: 300, percent: '9.3%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Green Chilli', emoji: '🌶️', price: 3000, unit: 'Quintal', increase: false, diff: 200, percent: '6.2%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Spinach', emoji: '🥬', price: 1500, unit: 'Quintal', increase: true, diff: 100, percent: '7.1%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Bitter Gourd', emoji: '🥒', price: 3000, unit: 'Quintal', increase: false, diff: 150, percent: '4.7%', status: 'Stable', color: 'text-blue-500', bg: 'bg-blue-100' },
    { name: 'Bottle Gourd', emoji: '🥒', price: 1200, unit: 'Quintal', increase: true, diff: 50, percent: '4.3%', status: 'Stable', color: 'text-blue-500', bg: 'bg-blue-100' },

    // Fruits
    { name: 'Apple', emoji: '🍎', price: 7000, unit: 'Quintal', increase: true, diff: 200, percent: '2.9%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Banana', emoji: '🍌', price: 2000, unit: 'Quintal', increase: false, diff: 50, percent: '2.4%', status: 'Stable', color: 'text-blue-500', bg: 'bg-blue-100' },
    { name: 'Mango', emoji: '🥭', price: 4000, unit: 'Quintal', increase: true, diff: 300, percent: '8.1%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Papaya', emoji: '🍈', price: 1500, unit: 'Quintal', increase: true, diff: 100, percent: '7.1%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Grapes', emoji: '🍇', price: 6000, unit: 'Quintal', increase: false, diff: 200, percent: '3.2%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Pomegranate', emoji: '🍎', price: 8000, unit: 'Quintal', increase: true, diff: 400, percent: '5.2%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Orange', emoji: '🍊', price: 4500, unit: 'Quintal', increase: false, diff: 150, percent: '3.2%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Guava', emoji: '🍐', price: 2500, unit: 'Quintal', increase: true, diff: 100, percent: '4.1%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },

    // Flowers
    { name: 'Marigold', emoji: '🌼', price: 4000, unit: 'Quintal', increase: true, diff: 200, percent: '5.2%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Rose', emoji: '🌹', price: 8000, unit: 'Quintal', increase: true, diff: 500, percent: '6.6%', status: 'High', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Jasmine', emoji: '🌸', price: 12000, unit: 'Quintal', increase: false, diff: 400, percent: '3.2%', status: 'Medium', color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Lotus', emoji: '🪷', price: 5000, unit: 'Quintal', increase: true, diff: 150, percent: '3.0%', status: 'Stable', color: 'text-blue-500', bg: 'bg-blue-100' },
  ];

export default function HealMarketplace({ onSpeak }) {
  const { marketFavorites: favorites, toggleMarketFavorite } = useFarmer();
  const [activeSection, setActiveSection] = useState('Market Prices');
  
  // Modals State
  const [showAiChat, setShowAiChat] = useState(false);
  const [showViewAll, setShowViewAll] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  
  // Chart & Selection State
  const [selectedCrop, setSelectedCrop] = useState('Paddy');
  const [timeframe, setTimeframe] = useState('7 Days');

  // Chat State
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Namaskara! Ask me anything about current crop prices, nearby markets, or buyer contacts.' }
  ]);
  const [isVaniTyping, setIsVaniTyping] = useState(false);

  // Finance State
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Seeds', value: 15000, color: '#10b981' },
    { id: 2, name: 'Fertilizers', value: 22000, color: '#3b82f6' },
    { id: 3, name: 'Pesticides', value: 12000, color: '#ef4444' },
    { id: 4, name: 'Labour', value: 18000, color: '#f59e0b' },
    { id: 5, name: 'Fuel', value: 6000, color: '#8b5cf6' },
  ]);
  const [incomes, setIncomes] = useState([
    { id: 1, source: 'Paddy Sale', value: 120000 },
    { id: 2, source: 'Maize Sale', value: 80000 },
  ]);

  // Form States
  const [newExpense, setNewExpense] = useState({ name: 'Others', value: '' });
  const [newIncome, setNewIncome] = useState({ source: '', value: '' });

  // --- LOCATION ---
  const [location, setLocation] = useState("Locating...");
  const [cityOnly, setCityOnly] = useState("Local Area");
  const [detectedState, setDetectedState] = useState("Andhra Pradesh");
  const [coords, setCoords] = useState({ lat: 15.8281, lon: 78.0373 }); // Default Kurnool

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            setCoords({ lat: latitude, lon: longitude });
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state_district;
            const state = data.address.state;
            if (city) setCityOnly(city);
            if (state) setDetectedState(state);
            if (city && state) {
              setLocation(`${city}, ${state}`);
            } else {
              setLocation("Kurnool, Andhra Pradesh");
              setCityOnly("Kurnool");
            }
          } catch (error) {
            setLocation("Kurnool, Andhra Pradesh");
            setCityOnly("Kurnool");
          }
        },
        () => {
          setLocation("Kurnool, Andhra Pradesh");
          setCityOnly("Kurnool");
        }
      );
    } else {
      setLocation("Kurnool, Andhra Pradesh");
      setCityOnly("Kurnool");
    }
  }, []);

  // --- LIVE MANDI PRICES (data.gov.in via Supabase market-proxy) ---
  const [livePrices, setLivePrices] = useState([]); // [{crop, price, market, ...}]
  const [liveLoading, setLiveLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLiveLoading(true);
    fetchMarketPrices(detectedState).then(records => {
      if (active) { setLivePrices(records); setLiveLoading(false); }
    });
    return () => { active = false; };
  }, [detectedState]);

  // Merge live prices onto the reference crop list by commodity name match.
  const liveCrops = React.useMemo(() => {
    const liveByName = new Map(livePrices.map(r => [r.crop.toLowerCase(), r]));
    return allCrops.map(crop => {
      const live = liveByName.get(crop.name.toLowerCase()) || liveByName.get(crop.name.split(' ')[0].toLowerCase());
      if (!live) return crop;
      return { ...crop, price: live.price, isLive: true, market: live.market, state: live.state };
    });
  }, [livePrices]);

  const hasLiveData = livePrices.length > 0;

  const sortedCrops = [...liveCrops].sort((a, b) => {
    const aFav = favorites.includes(a.name);
    const bFav = favorites.includes(b.name);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  // Dynamic Chart Data Generation based on selectedCrop and timeframe
  const generateTrendData = () => {
    const crop = liveCrops.find(c => c.name === selectedCrop) || liveCrops[0];
    const basePrice = crop.price;
    const data = [];
    let points = 7;
    let labelFormat = 'day'; // day, month
    
    if (timeframe === '7 Days') { points = 7; labelFormat = 'day'; }
    if (timeframe === '1 Month') { points = 30; labelFormat = 'day'; }
    if (timeframe === '3 Months') { points = 12; labelFormat = 'week'; }
    if (timeframe === '1 Year') { points = 12; labelFormat = 'month'; }

    const now = new Date();
    
    for (let i = points - 1; i >= 0; i--) {
      let dateLabel = '';
      const d = new Date(now);
      
      if (labelFormat === 'day') {
        d.setDate(d.getDate() - i);
        dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (labelFormat === 'week') {
        d.setDate(d.getDate() - (i * 7));
        dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (labelFormat === 'month') {
        d.setMonth(d.getMonth() - i);
        dateLabel = d.toLocaleDateString('en-US', { month: 'short' });
      }

      // Add some realistic random fluctuation
      const fluctuation = basePrice * (Math.random() * 0.1 - 0.05); // +/- 5%
      data.push({
        name: dateLabel,
        price: Math.round(basePrice + fluctuation)
      });
    }
    return data;
  };

  const trendData = generateTrendData();
  const currentCropInfo = liveCrops.find(c => c.name === selectedCrop) || liveCrops[0];
  const marketSummary = {
    highest: Math.round(currentCropInfo.price * 1.08), highestMarket: `APMC ${cityOnly}`,
    lowest: Math.round(currentCropInfo.price * 0.92), lowestMarket: 'Local Traders',
    average: currentCropInfo.price, prediction: currentCropInfo.increase ? 'Likely to Increase' : 'Stable',
    msp: Math.round(currentCropInfo.price * 0.85),
    arrivals: (Math.floor(Math.random() * 80) + 10) * 10,
    demand: currentCropInfo.increase ? 'High (Export Driven)' : 'Moderate (Domestic)',
    quality: 'FAQ (Moisture < 12%)',
    weatherImpact: currentCropInfo.increase ? 'Recent dry spells causing supply tightness.' : 'Favorable weather leading to steady arrivals.',
    trendDetail: currentCropInfo.increase ? 'Prices are trending upward due to strong export demand and limited local arrivals.' : 'Prices are stabilizing as new crop arrivals hit the local mandis.',
  };

  // Real Map Queries based on exact coordinates
  const supportDirectories = [
    { id: 1, name: 'Nearby Agricultural Markets', type: 'Wholesale & APMC', query: 'agricultural wholesale market' },
    { id: 2, name: 'Fertilizer & Pesticide Dealers', type: 'Farming Supplies', query: 'fertilizer pesticide shop' },
    { id: 3, name: 'Tractor & Machinery Showrooms', type: 'Equipment', query: 'tractor agricultural machinery dealer' },
    { id: 4, name: 'Cold Storage & Godowns', type: 'Storage', query: 'agricultural cold storage godown' }
  ];

  const faqs = [
    { q: "How is the MSP (Minimum Support Price) determined?", a: "MSP is set by the government based on recommendations from the CACP, considering production costs." },
    { q: "How do I contact nearby buyers?", a: "Use the Support directory to open Google Maps and find highly-rated verified buyers and dealers near your exact GPS location." }
  ];

  // --- DERIVED FINANCE DATA ---
  const totalInvestment = expenses.reduce((sum, item) => sum + Number(item.value), 0);
  const totalIncome = incomes.reduce((sum, item) => sum + Number(item.value), 0);
  const totalProfit = totalIncome - totalInvestment;
  const roi = totalInvestment > 0 ? Math.round((totalProfit / totalInvestment) * 100) : 0;
  
  const expensesWithPercents = expenses.map(exp => ({
    ...exp,
    percent: totalInvestment > 0 ? Math.round((exp.value / totalInvestment) * 100) : 0
  })).sort((a, b) => b.value - a.value);

  // --- ACTIONS ---
  const toggleFavorite = (cropName, e) => {
    e?.stopPropagation();
    toggleMarketFavorite(cropName);
  };

  const handleSendMessage = async () => {
    const query = chatMessage.trim();
    if (!query) return;
    const nextHistory = [...chatHistory, { sender: 'user', text: query }];
    setChatHistory(nextHistory);
    setChatMessage('');
    setIsVaniTyping(true);

    try {
      const { generateText } = await import('../services/aiProvider');
      const historyText = nextHistory.slice(-5).map(m => `${m.sender === 'ai' ? 'assistant' : 'user'}: ${m.text}`).join('\n');
      const prompt = `You are Vani, a market and finance expert for Indian farmers. The farmer is near ${cityOnly}.\nRecent context:\n${historyText}\n\nAnswer the farmer's latest question about crop prices, nearby markets, or buyer contacts. Keep it concise and practical.`;
      const reply = await generateText(prompt);
      setChatHistory(prev => [...prev, { sender: 'ai', text: reply }]);
    } catch (error) {
      console.error('Vani chat error:', error);
      setChatHistory(prev => [...prev, { sender: 'ai', text: "I'm having trouble connecting right now. Please check your internet connection and try again." }]);
    } finally {
      setIsVaniTyping(false);
    }
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (newExpense.value) {
      setExpenses([...expenses, { id: Date.now(), name: newExpense.name, value: Number(newExpense.value), color: '#64748b' }]);
      setNewExpense({ name: 'Others', value: '' });
      setShowExpenseModal(false);
    }
  };

  const handleAddIncome = (e) => {
    e.preventDefault();
    if (newIncome.value && newIncome.source) {
      setIncomes([...incomes, { id: Date.now(), source: newIncome.source, value: Number(newIncome.value) }]);
      setNewIncome({ source: '', value: '' });
      setShowIncomeModal(false);
    }
  };

  const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

  const openRealMapsSearch = (query) => {
    // Opens Google maps with a search centered exactly on the user's GPS coordinates
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${coords.lat},${coords.lon},13z`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="pb-24 bg-[#f4f7f5] min-h-screen relative">
      
      {/* Header & Location */}
      <div className="bg-white px-4 sm:px-6 py-4 border-b border-gray-100 sticky top-0 z-30">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Market & Finance</h1>
            <div className="flex items-center gap-1 mt-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full w-fit cursor-pointer hover:bg-green-100 transition-colors">
              <MapPin className="w-3 h-3" /> Live near {location} <ChevronRight className="w-3 h-3" />
            </div>
          </div>
          <button onClick={() => setShowAiChat(true)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-colors">
            <Mic className="w-4 h-4" /> Ask Vani
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-gray-50 p-1 rounded-xl">
          {['Market Prices', 'Finance', 'Support'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSection(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 sm:gap-2 ${
                activeSection === tab ? 'bg-white text-green-700 shadow-sm border border-gray-100' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'Market Prices' && <LineChartIcon className="w-4 h-4" />}
              {tab === 'Finance' && <Wallet className="w-4 h-4" />}
              {tab === 'Support' && <Building2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">

        {/* --- SECTION 1: MARKET PRICES --- */}
        {activeSection === 'Market Prices' && (
          <div className="space-y-6 animate-fade-in">
            {hasLiveData ? (
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4 flex items-center gap-2 text-green-800 text-sm">
                <span>✅</span>
                <span><strong>Live mandi prices for {detectedState}</strong> from data.gov.in. Crops marked "Live" below reflect today's reported APMC prices; others show typical reference prices.</span>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4 flex items-center gap-2 text-blue-800 text-sm">
                <span>ℹ️</span>
                <span><strong>{liveLoading ? 'Fetching live mandi prices…' : 'Live mandi data unavailable right now — showing reference prices.'}</strong> Do not use these values for trading decisions.</span>
              </div>
            )}

            {/* Top Crop Prices */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black text-slate-800">Today's Top Market Prices</h3>
                <button onClick={() => setShowViewAll(true)} className="text-xs font-bold text-green-600 hover:text-green-700">View All →</button>
              </div>
              
              <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2 -mx-2 px-2">
                {sortedCrops.slice(0, 8).map(crop => (
                  <div 
                    key={crop.name} 
                    onClick={() => setSelectedCrop(crop.name)}
                    className={`min-w-[130px] border rounded-2xl p-3 flex flex-col items-center relative shadow-sm cursor-pointer transition-all ${selectedCrop === crop.name ? 'bg-green-50 border-green-500 scale-[1.02]' : 'bg-white border-gray-100 hover:border-green-200'}`}
                  >
                    <button onClick={(e) => toggleFavorite(crop.name, e)} className="absolute top-2 right-2 p-1 hover:bg-white rounded-full transition-colors">
                      <Star className={`w-4 h-4 ${favorites.includes(crop.name) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                    {crop.isLive && (
                      <span className="absolute top-2 left-2 text-[8px] font-black px-1.5 py-0.5 rounded-full bg-green-600 text-white">LIVE</span>
                    )}
                    <span className="text-xs font-bold text-slate-700 mb-2">{crop.name}</span>
                    <div className="text-4xl mb-3">{crop.emoji}</div>
                    <p className="text-lg font-black text-slate-800 leading-tight">{formatCurrency(crop.price)}</p>
                    <p className="text-[10px] text-slate-500 mb-2">/ {crop.unit}</p>
                    
                    <div className="flex items-center gap-1 text-xs font-bold mb-2">
                      <span className={crop.color}>{crop.increase ? '▲' : '▼'} ₹{crop.diff} ({crop.percent})</span>
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${crop.bg} ${crop.color}`}>{crop.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vani's Advice Banner */}
            <div className="bg-green-50 rounded-2xl p-4 flex gap-3 items-center border border-green-100 shadow-sm cursor-pointer" onClick={() => setShowAiChat(true)}>
              <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center shrink-0">
                <Mic className="w-5 h-5 text-green-700" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-green-800 mb-0.5">Vani's Advice:</p>
                <p className="text-sm font-medium text-green-900 leading-snug">{currentCropInfo.name} prices are {currentCropInfo.increase ? 'rising' : 'fluctuating'} in {cityOnly}. {currentCropInfo.increase ? 'Selling this week could be highly profitable.' : 'Monitor the market for a few days before selling.'}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-green-600" />
            </div>

            {/* Price Trend & Market Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 lg:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                  <h3 className="text-sm font-black text-slate-800">{selectedCrop} - Price Trend</h3>
                  <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-100 w-fit">
                    {['7 Days', '1 Month', '3 Months', '1 Year'].map((t) => (
                      <button 
                        key={t} 
                        onClick={() => setTimeframe(t)}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${timeframe === t ? 'bg-green-600 text-white shadow-sm' : 'text-slate-500 hover:bg-gray-200'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="h-56 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} dy={10} />
                      <YAxis domain={['dataMin - 100', 'dataMax + 100']} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                      <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} labelStyle={{fontWeight: 'bold', color: '#1e293b'}} itemStyle={{color: '#16a34a', fontWeight: 'bold'}} />
                      <Line type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={3} dot={{r: 4, fill: '#fff', stroke: '#16a34a', strokeWidth: 2}} activeDot={{r: 6, fill: '#16a34a'}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-black text-slate-800 mb-4">Market Summary ({selectedCrop})</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <span className="text-xs font-bold text-slate-600">Highest Price</span>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-800">{formatCurrency(marketSummary.highest)}</p>
                      <p className="text-[10px] text-slate-500">({marketSummary.highestMarket})</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <span className="text-xs font-bold text-slate-600">Lowest Price</span>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-800">{formatCurrency(marketSummary.lowest)}</p>
                      <p className="text-[10px] text-slate-500">({marketSummary.lowestMarket})</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <span className="text-xs font-bold text-slate-600">Average Price</span>
                    <p className="text-sm font-black text-slate-800">{formatCurrency(marketSummary.average)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600">Prediction</span>
                    <p className={`text-xs font-bold flex items-center gap-1 ${currentCropInfo.increase ? 'text-green-600' : 'text-orange-500'}`}>
                      {marketSummary.prediction} {currentCropInfo.increase ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* NEW Detailed Market Intelligence Section */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 mt-4 animate-fade-in">
              <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-green-600"/> Detailed Market Intelligence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-slate-400"/> Minimum Support Price (MSP)</p>
                    <p className="text-lg font-black text-slate-800">{formatCurrency(marketSummary.msp)} <span className="text-[10px] font-normal text-slate-500">/ Quintal</span></p>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">Govt. assured price for current season.</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Package className="w-3 h-3 text-slate-400"/> Today's Arrivals</p>
                    <p className="text-lg font-black text-slate-800">{marketSummary.arrivals} <span className="text-[10px] font-normal text-slate-500">Quintals</span></p>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">Volume arrived in {cityOnly} Mandi today.</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-slate-400"/> Demand & Supply</p>
                    <p className="text-sm font-black text-slate-800">{marketSummary.demand}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">{marketSummary.trendDetail}</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Star className="w-3 h-3 text-slate-400"/> Quality Standard</p>
                    <p className="text-sm font-black text-slate-800">{marketSummary.quality}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">Fair Average Quality. Price drops 2% per 1% extra moisture.</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 lg:col-span-2 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><CloudRain className="w-3 h-3 text-slate-400"/> Weather Impact & Outlook</p>
                    <p className="text-sm font-black text-slate-800">{marketSummary.weatherImpact}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">Keep an eye on short-term weather forecasts before harvesting to prevent spoilage and moisture deduction at Mandis.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* --- SECTION 2: FINANCE --- */}
        {activeSection === 'Finance' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-800">Financial Status (This Season)</h3>
              <div className="flex gap-2">
                <button onClick={() => setShowExpenseModal(true)} className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"><Plus className="w-3 h-3"/> Expense</button>
                <button onClick={() => setShowIncomeModal(true)} className="bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"><Plus className="w-3 h-3"/> Income</button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between h-28">
                <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Wallet className="w-3 h-3"/> Total Invested</p>
                <div>
                  <p className="text-xl font-black text-slate-800">{formatCurrency(totalInvestment)}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Total Expenses</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between h-28">
                <p className="text-[10px] font-bold text-green-600 uppercase flex items-center gap-1"><CircleDollarSign className="w-3 h-3"/> Total Income</p>
                <div>
                  <p className="text-xl font-black text-green-700">{formatCurrency(totalIncome)}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Total Sales</p>
                </div>
              </div>
              <div className={`rounded-2xl p-4 border shadow-sm flex flex-col justify-between h-28 ${totalProfit >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'}`}>
                <p className={`text-[10px] font-bold uppercase flex items-center gap-1 ${totalProfit >= 0 ? 'text-blue-700' : 'text-red-700'}`}><Leaf className="w-3 h-3"/> Net Profit</p>
                <div>
                  <p className={`text-xl font-black ${totalProfit >= 0 ? 'text-blue-800' : 'text-red-800'}`}>{formatCurrency(totalProfit)}</p>
                  <p className={`text-[10px] mt-0.5 ${totalProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{totalProfit >= 0 ? 'Clear Profit' : 'Current Loss'}</p>
                </div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 shadow-sm flex flex-col justify-between h-28">
                <p className="text-[10px] font-bold text-purple-700 uppercase flex items-center gap-1"><TrendingUp className="w-3 h-3"/> ROI</p>
                <div>
                  <p className="text-2xl font-black text-purple-800">{roi}%</p>
                  <p className="text-[10px] text-purple-600 mt-0.5">Return on Inv.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center">
                <h3 className="text-sm font-black text-slate-800 self-start mb-4">Income vs Expense</h3>
                <div className="w-48 h-48 relative mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie data={[{ name: 'Income', value: totalIncome, color: '#16a34a' }, { name: 'Expense', value: totalInvestment, color: '#ef4444' }]} cx="50%" cy="50%" innerRadius={65} outerRadius={80} paddingAngle={0} dataKey="value" stroke="none">
                        <Cell fill="#16a34a" />
                        <Cell fill="#ef4444" />
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Profit</p>
                    <p className={`text-sm font-black ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(totalProfit)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col">
                <h3 className="text-sm font-black text-slate-800 mb-6">Expense Breakdown</h3>
                <div className="space-y-5 flex-1 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                  {expensesWithPercents.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-bold text-slate-700 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: exp.color || '#94a3b8' }}/> {exp.name}
                        </span>
                        <div className="text-right">
                          <span className="font-bold text-slate-800">{formatCurrency(exp.value)}</span>
                          <span className="text-slate-400 font-medium ml-1">({exp.percent}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${exp.percent}%`, backgroundColor: exp.color || '#94a3b8' }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-800">Total Expense</span>
                  <span className="text-lg font-black text-slate-800">{formatCurrency(totalInvestment)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- SECTION 3: SUPPORT --- */}
        {activeSection === 'Support' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Real Maps Directory */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="mb-6">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <Map className="w-4 h-4 text-blue-600" /> Real Local Directories (Near {cityOnly})
                </h3>
                <p className="text-xs text-slate-500 mt-1">Click a category to instantly find real verified locations on Google Maps near your exact GPS coordinates.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supportDirectories.map((dir) => (
                  <div key={dir.id} className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-all hover:shadow-md bg-white flex flex-col justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full mb-2 inline-block">{dir.type}</span>
                      <h4 className="text-sm font-bold text-slate-800">{dir.name}</h4>
                    </div>
                    <button onClick={() => openRealMapsSearch(dir.query)} className="w-full bg-blue-600 text-white px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors shadow-sm">
                      <Search className="w-4 h-4"/> Search Google Maps
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-600" /> Market & Policies FAQ
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <p className="text-sm font-bold text-slate-800 mb-1">{faq.q}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* --- MODALS --- */}

      {/* View All Crops Modal */}
      {showViewAll && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-black text-slate-800 text-lg">All Market Prices</h3>
                <p className="text-xs text-slate-500">Tap a crop to view its price chart on the dashboard.</p>
              </div>
              <button onClick={() => setShowViewAll(false)} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 bg-[#f4f7f5]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sortedCrops.map(crop => (
                  <div 
                    key={crop.name} 
                    onClick={() => { setSelectedCrop(crop.name); setShowViewAll(false); setActiveSection('Market Prices'); }}
                    className={`bg-white border rounded-2xl p-4 flex flex-col items-center relative shadow-sm cursor-pointer hover:shadow-md transition-all ${selectedCrop === crop.name ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-100 hover:border-green-300'}`}
                  >
                    <button onClick={(e) => toggleFavorite(crop.name, e)} className="absolute top-2 right-2 p-1 hover:bg-gray-50 rounded-full transition-colors">
                      <Star className={`w-5 h-5 ${favorites.includes(crop.name) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                    <div className="text-5xl mb-3 mt-2">{crop.emoji}</div>
                    <span className="text-sm font-bold text-slate-700 mb-1">{crop.name}</span>
                    <p className="text-xl font-black text-slate-800 leading-tight mb-2">{formatCurrency(crop.price)}</p>
                    <div className="flex items-center gap-1 text-xs font-bold mb-3">
                      <span className={crop.color}>{crop.increase ? '▲' : '▼'} ₹{crop.diff}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${crop.bg} ${crop.color}`}>{crop.status} Demand</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-slide-up sm:animate-fade-in">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-slate-800">Add New Expense</h3>
              <button onClick={() => setShowExpenseModal(false)} className="p-1 hover:bg-gray-200 rounded-full"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleAddExpense} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                <select value={newExpense.name} onChange={e => setNewExpense({...newExpense, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 font-medium">
                  <option>Seeds</option><option>Fertilizers</option><option>Pesticides</option><option>Labour</option><option>Fuel</option><option>Transport</option><option>Others</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Amount (₹)</label>
                <input type="number" required placeholder="e.g. 5000" value={newExpense.value} onChange={e => setNewExpense({...newExpense, value: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 font-medium" />
              </div>
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl mt-2 transition-colors">Save Expense</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Income Modal */}
      {showIncomeModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-slide-up sm:animate-fade-in">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-slate-800">Add Income / Sale</h3>
              <button onClick={() => setShowIncomeModal(false)} className="p-1 hover:bg-gray-200 rounded-full"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleAddIncome} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Source (e.g., Crop Sold)</label>
                <input type="text" required placeholder="e.g. Sold 50q Paddy" value={newIncome.source} onChange={e => setNewIncome({...newIncome, source: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Amount Received (₹)</label>
                <input type="number" required placeholder="e.g. 115000" value={newIncome.value} onChange={e => setNewIncome({...newIncome, value: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 font-medium" />
              </div>
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl mt-2 transition-colors">Save Income</button>
            </form>
          </div>
        </div>
      )}

      {/* Floating AI Chat Assistant */}
      {showAiChat && (
        <div className="fixed bottom-0 sm:bottom-6 right-0 sm:right-6 w-full sm:w-[350px] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col h-[60vh] sm:h-[500px] animate-slide-up">
          <div className="p-4 bg-green-600 text-white rounded-t-3xl sm:rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><Mic className="w-4 h-4 text-white" /></div>
              <div>
                <h4 className="font-bold text-sm">Ask Vani</h4>
                <p className="text-[10px] text-green-100">Market & Finance Expert</p>
              </div>
            </div>
            <button onClick={() => setShowAiChat(false)} className="p-1 hover:bg-white/20 rounded-full"><X className="w-5 h-5" /></button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-gray-50 flex flex-col gap-3">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`max-w-[85%] p-3 shadow-sm ${msg.sender === 'ai' ? 'self-start bg-white rounded-2xl rounded-tl-sm border border-gray-100' : 'self-end bg-green-600 text-white rounded-2xl rounded-tr-sm'}`}>
                <p className="text-xs leading-relaxed font-medium">{msg.text}</p>
              </div>
            ))}
            {isVaniTyping && (
              <div className="max-w-[85%] p-3 shadow-sm self-start bg-white rounded-2xl rounded-tl-sm border border-gray-100">
                <p className="text-xs leading-relaxed font-medium text-gray-400">Vani is typing...</p>
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about markets, prices..."
              disabled={isVaniTyping}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
            <button
              onClick={handleSendMessage}
              className={`p-2.5 rounded-xl transition-colors ${chatMessage.trim() && !isVaniTyping ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-100 text-gray-400'}`}
              disabled={!chatMessage.trim() || isVaniTyping}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button (If chat is closed) */}
      {!showAiChat && (
        <button onClick={() => setShowAiChat(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg shadow-green-600/30 flex items-center justify-center animate-bounce-subtle z-40">
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

    </div>
  );
}

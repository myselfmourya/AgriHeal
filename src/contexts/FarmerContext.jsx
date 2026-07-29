import { createContext, useContext, useState } from 'react'

const FarmerContext = createContext(null)

const DEFAULT_PROFILE = {
  name: 'Ravi Kumar', village: 'Narsampet', district: 'Warangal',
  state: 'Telangana', phone: '+91-9876543210', language: 'te',
  farmSize: '3.5 acres', crops: ['Rice', 'Cotton', 'Pearl Millet'],
  livestock: ['2 Cows', '1 Buffalo', '3 Goats'],
  experience: '12 years', avatar: 'RK',
  lat: 17.9784, lon: 79.5941,
  safetyScore: 82, healthScore: 85,
  schemes: ['PM-KISAN', 'Ayushman Bharat'],
  joined: '2024-01-15',
}

export function FarmerProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ah-profile')) || DEFAULT_PROFILE }
    catch { return DEFAULT_PROFILE }
  })
  const [cropHistory, setCropHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ah-crop-history')) || [] }
    catch { return [] }
  })
  
  const [myCrops, setMyCrops] = useState(() => {
    try { 
      const saved = localStorage.getItem('ah-my-crops')
      return saved ? JSON.parse(saved) : [
        { 
          id: 1, name: 'Paddy', emoji: '🌾', area: 5.0, stage: 'Flowering', health: 92, daysSinceSowing: 32, daysLeftToHarvest: 88, expectedHarvest: '110 Quintal', progress: 26, aiAdvice: 'Irrigation not needed today. Paddy crop is healthy.',
          image: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=800',
          growth: {
            status: 'Good', height: '85 cm', leafAreaIndex: 3.2, biomass: '+12%', rootDevelopment: 'Healthy', tillering: '18 tillers/m²',
          },
          irrigation: {
            moisture: 72, moistureStatus: 'Good', recommendation: 'No irrigation needed', nextIrrigation: 'In 2 Days', method: 'Drip Irrigation', source: 'Borewell', usageThisWeek: '12,450 L'
          },
          fertilizer: {
            status: 'Good', nitrogen: 'Adequate', phosphorus: 'Adequate', potassium: 'Slightly Low', sulphur: 'Adequate', zinc: 'Adequate',
            recommendation: [{ name: 'Urea (46% N)', qty: '20 kg/acre', time: 'Apply in 3 days' }, { name: 'MOP (60% K2O)', qty: '10 kg/acre', time: 'Apply in 5 days' }]
          },
          pest: {
            overallRisk: 'Low', observations: [{ name: 'Leaf Blast', risk: 'Low' }, { name: 'Brown Plant Hopper', risk: 'Low' }, { name: 'Stem Borer', risk: 'Low' }, { name: 'Leaf Folder', risk: 'Low' }]
          },
          soil: { score: 85, ph: 6.8, carbon: 0.75, nitrogen: 290, phosphorus: 22, potassium: 210 },
          yield: { expectedYield: 22, totalYield: 110, price: 2350, revenue: 258500 },
          expenses: { total: 18450, breakdown: { Fertilizer: 40, Seeds: 20, Pesticides: 15, Labor: 15, Others: 10 } },
          inputs: [
            { id: 101, type: 'Fertilizer', name: 'Urea (46% N)', qty: '20 kg/acre', date: '25 Apr 2025' },
            { id: 102, type: 'Fertilizer', name: 'DAP (18:46:0)', qty: '15 kg/acre', date: '10 Apr 2025' },
            { id: 103, type: 'Fertilizer', name: 'MOP (60% K2O)', qty: '10 kg/acre', date: '5 Apr 2025' },
            { id: 104, type: 'Fertilizer', name: 'Zinc Sulphate', qty: '5 kg/acre', date: '20 Mar 2025' },
          ],
          calendar: [
            { id: 201, task: 'Land Preparation', date: '1 - 15 Jun', status: 'Upcoming' },
            { id: 202, task: 'Sowing / Transplanting', date: '16 - 30 Jun', status: 'Upcoming' },
            { id: 203, task: 'Top Dressing', date: '25 Jul - 5 Aug', status: 'Upcoming' },
            { id: 204, task: 'Flowering', date: '16 - 30 Sep', status: 'Upcoming' },
            { id: 205, task: 'Harvesting', date: '20 - 30 Oct', status: 'Upcoming' },
          ]
        },
        { 
          id: 2, name: 'Cotton', emoji: '🌿', area: 3.0, stage: 'Vegetative', health: 86, daysSinceSowing: 72, daysLeftToHarvest: 108, expectedHarvest: '30 Quintal', progress: 40, aiAdvice: 'Watch out for pink bollworm.',
          image: 'https://images.unsplash.com/photo-1596704104273-5a02e6044719?auto=format&fit=crop&q=80&w=800',
          growth: { status: 'Average', height: '110 cm', leafAreaIndex: 2.8, biomass: '+5%', rootDevelopment: 'Average', tillering: 'N/A' },
          irrigation: { moisture: 45, moistureStatus: 'Low', recommendation: 'Irrigate tomorrow', nextIrrigation: 'Tomorrow', method: 'Furrow', source: 'Canal', usageThisWeek: '8,000 L' },
          fertilizer: { status: 'Average', nitrogen: 'Low', phosphorus: 'Adequate', potassium: 'Adequate', sulphur: 'Adequate', zinc: 'Low', recommendation: [] },
          pest: { overallRisk: 'High', observations: [{ name: 'Pink Bollworm', risk: 'High' }] },
          soil: { score: 70, ph: 7.2, carbon: 0.5, nitrogen: 180, phosphorus: 18, potassium: 150 },
          yield: { expectedYield: 10, totalYield: 30, price: 7000, revenue: 210000 },
          expenses: { total: 12000, breakdown: { Fertilizer: 30, Seeds: 25, Pesticides: 30, Labor: 10, Others: 5 } },
          inputs: [], calendar: []
        },
        { 
          id: 3, name: 'Tomato', emoji: '🍅', area: 1.5, stage: 'Fruiting', health: 89, daysSinceSowing: 60, daysLeftToHarvest: 18, expectedHarvest: '45 Quintal', progress: 77, aiAdvice: 'Ready for first picking in 5 days.',
          image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=800',
          growth: { status: 'Good', height: '65 cm', leafAreaIndex: 3.5, biomass: '+18%', rootDevelopment: 'Good', tillering: 'N/A' },
          irrigation: { moisture: 65, moistureStatus: 'Optimal', recommendation: 'Maintain schedule', nextIrrigation: 'Today', method: 'Drip', source: 'Borewell', usageThisWeek: '4,500 L' },
          fertilizer: { status: 'Good', nitrogen: 'Adequate', phosphorus: 'Adequate', potassium: 'High', sulphur: 'Adequate', zinc: 'Adequate', recommendation: [] },
          pest: { overallRisk: 'Medium', observations: [{ name: 'Fruit Borer', risk: 'Medium' }] },
          soil: { score: 82, ph: 6.5, carbon: 0.8, nitrogen: 240, phosphorus: 30, potassium: 250 },
          yield: { expectedYield: 30, totalYield: 45, price: 1500, revenue: 67500 },
          expenses: { total: 8000, breakdown: { Fertilizer: 20, Seeds: 15, Pesticides: 20, Labor: 35, Others: 10 } },
          inputs: [], calendar: []
        },
      ]
    } catch { return [] }
  })

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('ah-notifications')
      return saved ? JSON.parse(saved) : [
        { id: 1, title: 'Rice Blast Alert', message: 'High risk of Rice Blast detected in your area.', type: 'Critical', category: 'Crop', time: '2h ago', group: 'Today', unread: true },
        { id: 2, title: 'Vaccination Due - Lakshmi Cow', message: 'Lakshmi Cow needs FMD vaccination.', type: 'Reminder', category: 'Livestock', time: '5h ago', group: 'Today', unread: true, scheduledTime: new Date(Date.now() + 86400000).toISOString() },
        { id: 3, title: 'Cotton Price Up 12%', message: 'Cotton prices have increased at the local mandi.', type: 'Info', category: 'Market', time: '1d ago', group: 'Yesterday', unread: false }
      ]
    } catch { return [] }
  })

  const [marketFavorites, setMarketFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('ah-market-favorites')
      return saved ? JSON.parse(saved) : ['Paddy', 'Tomato']
    } catch { return ['Paddy', 'Tomato'] }
  })

  const updateProfile = (data) => {
    const updated = { ...profile, ...data }
    setProfile(updated)
    localStorage.setItem('ah-profile', JSON.stringify(updated))
  }

  const addDiagnosis = (diagnosis) => {
    const updated = [{ ...diagnosis, id: Date.now() }, ...cropHistory].slice(0, 50)
    setCropHistory(updated)
    localStorage.setItem('ah-crop-history', JSON.stringify(updated))
  }

  const addMyCrop = (crop) => {
    const updated = [...myCrops, { id: Date.now(), ...crop }]
    setMyCrops(updated)
    localStorage.setItem('ah-my-crops', JSON.stringify(updated))
  }

  const updateMyCrop = (cropId, updatedFields) => {
    const updated = myCrops.map(c => c.id === cropId ? { ...c, ...updatedFields } : c)
    setMyCrops(updated)
    localStorage.setItem('ah-my-crops', JSON.stringify(updated))
  }

  const deleteMyCrop = (cropId) => {
    const updated = myCrops.filter(c => c.id !== cropId)
    setMyCrops(updated)
    localStorage.setItem('ah-my-crops', JSON.stringify(updated))
  }

  const markNotificationRead = (id) => {
    const updated = notifications.map(x => x.id === id ? { ...x, unread: false } : x)
    setNotifications(updated)
    localStorage.setItem('ah-notifications', JSON.stringify(updated))
  }

  const markAllNotificationsRead = () => {
    const updated = notifications.map(x => ({ ...x, unread: false }))
    setNotifications(updated)
    localStorage.setItem('ah-notifications', JSON.stringify(updated))
  }

  const addNotification = (notif) => {
    const updated = [{ ...notif, id: Date.now(), group: 'Today', unread: true }, ...notifications]
    setNotifications(updated)
    localStorage.setItem('ah-notifications', JSON.stringify(updated))
  }

  const updateNotification = (id, updatedFields) => {
    const updated = notifications.map(n => n.id === id ? { ...n, ...updatedFields } : n)
    setNotifications(updated)
    localStorage.setItem('ah-notifications', JSON.stringify(updated))
  }

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id)
    setNotifications(updated)
    localStorage.setItem('ah-notifications', JSON.stringify(updated))
  }

  const toggleMarketFavorite = (cropName) => {
    setMarketFavorites(prev => {
      const updated = prev.includes(cropName) ? prev.filter(c => c !== cropName) : [...prev, cropName]
      localStorage.setItem('ah-market-favorites', JSON.stringify(updated))
      return updated
    })
  }

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <FarmerContext.Provider value={{
      profile, updateProfile,
      cropHistory, addDiagnosis,
      myCrops, addMyCrop, updateMyCrop, deleteMyCrop,
      notifications, markNotificationRead, markAllNotificationsRead, addNotification, updateNotification, deleteNotification,
      marketFavorites, toggleMarketFavorite, unreadCount,
    }}>
      {children}
    </FarmerContext.Provider>
  )
}

export function useFarmer() {
  const context = useContext(FarmerContext)
  if (!context) throw new Error('useFarmer must be used within FarmerProvider')
  return context
}

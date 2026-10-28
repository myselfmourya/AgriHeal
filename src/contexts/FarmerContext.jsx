import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const FarmerContext = createContext(null)

const DEFAULT_PROFILE = {
  name: '', village: '', district: '',
  state: '', phone: '', language: 'en',
  farmSize: '', crops: [],
  livestock: [],
  experience: '', avatar: '',
  lat: null, lon: null,
  safetyScore: 80, healthScore: 80,
  schemes: [],
  joined: '',
}

const DEFAULT_CROP_DETAILS = {
  growth: { status: 'Average', height: 'N/A', leafAreaIndex: 2.0, biomass: 'N/A', rootDevelopment: 'Average', tillering: 'N/A' },
  irrigation: { moisture: 50, moistureStatus: 'Moderate', recommendation: 'Monitor moisture', nextIrrigation: 'Check in 2 days', method: 'Drip', source: 'Borewell', usageThisWeek: '2,000 L' },
  fertilizer: { status: 'Average', nitrogen: 'Adequate', phosphorus: 'Adequate', potassium: 'Adequate', sulphur: 'Adequate', zinc: 'Adequate', recommendation: [] },
  pest: { overallRisk: 'Low', observations: [] },
  soil: { score: 75, ph: 7.0, carbon: 0.6, nitrogen: 200, phosphorus: 20, potassium: 180 },
  yield: { expectedYield: 0, totalYield: 0, price: 0, revenue: 0 },
  expenses: { total: 0, breakdown: { Fertilizer: 0, Seeds: 0, Pesticides: 0, Labor: 0, Others: 0 } },
  inputs: [],
  calendar: []
}

export function FarmerProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const [profile, setProfile] = useState({ ...DEFAULT_PROFILE })
  const [myCrops, setMyCrops] = useState([])
  const [cropHistory, setCropHistory] = useState([])
  const [notifications, setNotifications] = useState([])
  const [marketFavorites, setMarketFavorites] = useState(['Paddy', 'Tomato'])
  const [isLoading, setIsLoading] = useState(true)

  const loadFarmerProfile = async () => {
    try {
      const saved = localStorage.getItem('ah-farmer-profile');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    if (!user?.id) return null;
    const { data: farmer } = await supabase.from('farmers').select('*').eq('id', user.id).single();
    return farmer;
  };

  // Called after ProfileSettings saves — refreshes profile across app
  const refreshProfile = async () => {
    const farmer = await loadFarmerProfile();
    if (farmer) {
      setProfile(prev => ({
        ...prev,
        id: farmer.id,
        name: farmer.full_name || user?.email?.split('@')[0] || 'Farmer',
        village: farmer.village || '',
        district: farmer.district || '',
        state: farmer.state || '',
        phone: farmer.phone || '',
        farmSize: farmer.farm_size_acres ? `${farmer.farm_size_acres} acres` : '',
        experience: farmer.experience_years ? `${farmer.experience_years} years` : '',
      }));
    }
  };

  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
        if (!isAuthenticated || !user) {
          setIsLoading(false);
          return;
        }

        // Fetch Profile
        const farmer = await loadFarmerProfile();
        let currentFarmerId = null;
        
        if (farmer) {
          currentFarmerId = farmer.id;
          setProfile(prev => ({
            ...prev,
            id: farmer.id,
            name: farmer.full_name || user?.email?.split('@')[0] || 'Farmer',
            village: farmer.village || '',
            district: farmer.district || '',
            state: farmer.state || '',
            phone: farmer.phone || '',
            farmSize: farmer.farm_size_acres ? `${farmer.farm_size_acres} acres` : '',
            experience: farmer.experience_years ? `${farmer.experience_years} years` : '',
          }));
        } else {
          // No farmer row yet — use email username as display name
          setProfile(prev => ({
            ...prev,
            id: user.id,
            name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Farmer',
          }));
          currentFarmerId = user.id;
        }

        // Fetch Crops
        if (currentFarmerId) {
          const { data: cropsData, error: cropsError } = await supabase.from('crops').select('*').eq('farmer_id', currentFarmerId)
          if (cropsData && cropsData.length > 0) {
            const mappedCrops = cropsData.map(c => ({
              id: c.id,
              name: c.name,
              emoji: c.emoji || '🌿',
              area: c.area_acres || 1.0,
              stage: c.stage || 'Vegetative',
              health: c.health_score || 80,
              daysSinceSowing: c.days_since_sowing || 30,
              daysLeftToHarvest: 60,
              expectedHarvest: c.expected_harvest || '20 Quintal',
              progress: 50,
              aiAdvice: c.ai_advice || 'Crop is growing well.',
              image: c.image_url || 'https://images.unsplash.com/photo-1596704104273-5a02e6044719?auto=format&fit=crop&q=80&w=800',
              ...DEFAULT_CROP_DETAILS
            }))
            setMyCrops(mappedCrops)
          } else {
            setMyCrops(getLocalCrops())
          }
        } else {
           setMyCrops(getLocalCrops())
        }

        // Notifications are real, user-generated alerts saved locally —
        // no notifications saved means no notifications yet, not placeholder ones.
        const savedNotifs = localStorage.getItem('ah-notifications')
        setNotifications(savedNotifs ? JSON.parse(savedNotifs) : [])

      } catch (e) {
        console.error("Supabase fetch error:", e)
        setMyCrops(getLocalCrops())
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSupabaseData()
  }, [user, isAuthenticated])

  // Real crops saved locally (e.g. added before a farmer_id existed) — never
  // fabricated placeholder data. No local save means no crops yet.
  const getLocalCrops = () => {
    try {
      const saved = localStorage.getItem('ah-my-crops')
      if (saved) return JSON.parse(saved)
    } catch {}
    return []
  }

  const updateProfile = async (data) => {
    const updated = { ...profile, ...data }
    setProfile(updated)
    if (profile.id) {
       await supabase.from('farmers').update({ full_name: updated.name, village: updated.village }).eq('id', profile.id)
    }
  }

  const addDiagnosis = (diagnosis) => {
    const updated = [{ ...diagnosis, id: Date.now() }, ...cropHistory].slice(0, 50)
    setCropHistory(updated)
  }

  const addMyCrop = async (crop) => {
    // Insert first and use the real Supabase row id locally — a client-
    // generated id (Date.now()) would never match the DB's uuid, so
    // deleteMyCrop could never actually delete a crop added this session.
    if (profile.id) {
      const { data, error } = await supabase.from('crops').insert([{
        farmer_id: profile.id,
        name: crop.name,
        emoji: crop.emoji || '🌱',
        area_acres: crop.area,
        stage: crop.stage,
        health_score: crop.health || 100,
        days_since_sowing: crop.daysSinceSowing || 0
      }]).select().single();

      if (!error && data) {
        const newCrop = { ...crop, ...DEFAULT_CROP_DETAILS, id: data.id };
        setMyCrops([...myCrops, newCrop]);
        return newCrop;
      }
    }

    // No profile yet, or the insert failed — keep the crop visible locally
    // rather than silently dropping it; it just won't persist to Supabase.
    const newCrop = { id: Date.now(), ...crop, ...DEFAULT_CROP_DETAILS };
    setMyCrops([...myCrops, newCrop]);
    return newCrop;
  }

  const updateMyCrop = (cropId, updatedFields) => {
    const updated = myCrops.map(c => c.id === cropId ? { ...c, ...updatedFields } : c)
    setMyCrops(updated)
  }

  const deleteMyCrop = async (cropId) => {
    const updated = myCrops.filter(c => c.id !== cropId)
    setMyCrops(updated)
    if (typeof cropId === 'string') { // real crops now always have a Supabase uuid
      await supabase.from('crops').delete().eq('id', cropId)
    }
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
      return updated
    })
  }

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <FarmerContext.Provider value={{
      profile, updateProfile, refreshProfile,
      cropHistory, addDiagnosis,
      myCrops, addMyCrop, updateMyCrop, deleteMyCrop,
      notifications, markNotificationRead, markAllNotificationsRead, addNotification, updateNotification, deleteNotification,
      marketFavorites, toggleMarketFavorite, unreadCount,
      isLoading
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

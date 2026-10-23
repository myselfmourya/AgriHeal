import { supabase } from '../lib/supabase';

const generateFallbackVendors = (lat, lon) => {
  const offset1 = (Math.random() - 0.5) * 0.04;
  const offset2 = (Math.random() - 0.5) * 0.04;
  const offset3 = (Math.random() - 0.5) * 0.04;

  return [
    {
      id: 1,
      name: "Kisan Seva Kendra",
      category: "Fertilizers & Seeds",
      rating: 4.5,
      position: lat && lon ? [lat + offset1, lon + offset1] : [17.3850, 78.4867],
      open: true,
      phone: "+91 98765 43210",
      icon: "🏪"
    },
    {
      id: 2,
      name: "AgriTech Equipment Sales",
      category: "Farming Machinery",
      rating: 4.8,
      position: lat && lon ? [lat - offset2, lon + offset2] : [17.4050, 78.4967],
      open: true,
      phone: "+91 98765 43211",
      icon: "🚜"
    },
    {
      id: 3,
      name: "Green Earth Pesticides",
      category: "Agrochemicals",
      rating: 4.2,
      position: lat && lon ? [lat + offset3, lon - offset3] : [17.3950, 78.4767],
      open: false,
      phone: "+91 98765 43212",
      icon: "🧪"
    }
  ];
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return "Unknown";
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const distance = R * c;
  return distance.toFixed(1) + " km";
}

function processVendorsWithDistance(vendors, userLat, userLon) {
  if (!userLat || !userLon) return vendors;
  
  return vendors.map(vendor => {
    if (vendor.position && vendor.position.length === 2) {
      const dist = calculateDistance(userLat, userLon, vendor.position[0], vendor.position[1]);
      return { ...vendor, distance: dist };
    }
    return vendor;
  }).sort((a, b) => {
    const distA = parseFloat(a.distance);
    const distB = parseFloat(b.distance);
    if (!isNaN(distA) && !isNaN(distB)) return distA - distB;
    return 0;
  });
}

export const vendorsService = {
  getNearbyVendors: async (lat, lon) => {
    try {
      const { data: vendorsData, error } = await supabase.from('vendors').select('*');
      
      if (error) throw error;
      
      if (vendorsData && vendorsData.length > 0) {
        const mappedVendors = vendorsData.map(v => ({
          id: v.id,
          name: v.name,
          category: v.category || 'General',
          rating: v.rating || 4.0,
          position: [v.latitude, v.longitude],
          open: v.is_open,
          phone: v.phone || '+91 00000 00000',
          icon: v.icon || '🏪'
        }));
        return processVendorsWithDistance(mappedVendors, lat, lon);
      }
      
      // If no data in Supabase, fetch real data from Overpass API (OpenStreetMap)
      const overpassQuery = `[out:json];
node(around:15000,${lat},${lon})["shop"~"hardware|agrarian|farm|garden_centre|supermarket"];
out 10;`;
      
      const overpassRes = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
      const overpassData = await overpassRes.json();
      
      if (overpassData && overpassData.elements && overpassData.elements.length > 0) {
        const mappedRealVendors = overpassData.elements.map((el, i) => ({
          id: el.id,
          name: el.tags.name || el.tags.brand || "Local Agri Store",
          category: el.tags.shop === 'supermarket' ? 'General Produce' : 'Agri Hardware/Seeds',
          rating: 4.0 + (Math.random()),
          position: [el.lat, el.lon],
          open: true,
          phone: el.tags.phone || 'Available locally',
          icon: el.tags.shop === 'supermarket' ? '🏪' : '🚜'
        }));
        return processVendorsWithDistance(mappedRealVendors, lat, lon);
      }
      
      return processVendorsWithDistance([], lat, lon);
    } catch (err) {
      console.error("Vendor fetch error:", err);
      return processVendorsWithDistance([], lat, lon);
    }
  }
};

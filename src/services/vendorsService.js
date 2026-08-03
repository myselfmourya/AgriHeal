/**
 * Service for Local Vendors & Markets
 */

import { supabase } from '../lib/supabase';

const generateFallbackVendors = (lat, lon) => {
  // Add some small random offsets to simulate nearby vendors (0.01 to 0.05 degrees is roughly 1-5km)
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
    // Sort by distance (parsing "2.5 km" float)
    const distA = parseFloat(a.distance);
    const distB = parseFloat(b.distance);
    if (!isNaN(distA) && !isNaN(distB)) return distA - distB;
    return 0;
  });
}

export const vendorsService = {
  getNearbyVendors: async (lat, lon) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.warn('Vendors Service: No active session, using fallback.');
        return processVendorsWithDistance(generateFallbackVendors(lat, lon), lat, lon);
      }

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vendors-proxy?lat=${lat}&lon=${lon}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
         console.warn(`Vendor API failed with status ${response.status}, using fallback.`);
         return processVendorsWithDistance(generateFallbackVendors(lat, lon), lat, lon);
      }
      
      const result = await response.json();
      const vendorsToProcess = result.vendors?.length ? result.vendors : generateFallbackVendors(lat, lon);
      return processVendorsWithDistance(vendorsToProcess, lat, lon);
    } catch (err) {
      console.warn("Vendor fetch error:", err);
      return processVendorsWithDistance(generateFallbackVendors(lat, lon), lat, lon); // Graceful fallback
    }
  }
};

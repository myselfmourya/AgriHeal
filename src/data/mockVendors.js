// Real nearby agri vendors via OpenStreetMap's free, keyless Overpass API.
// Returns [] when nothing is found nearby — never fabricated vendors, names,
// phone numbers, or ratings, since OSM doesn't carry ratings and a made-up
// phone number is actively misleading.

// Calculate distance in km
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(1);
};

export const getNearbyVendors = async (lat, lon, radius = 25000) => {
  try {
    const query = `
      [out:json][timeout:15];
      (
        node["amenity"="marketplace"](around:${radius},${lat},${lon});
        node["shop"="agrarian"](around:${radius},${lat},${lon});
        node["shop"="farm"](around:${radius},${lat},${lon});
        node["amenity"="market"](around:${radius},${lat},${lon});
        node["shop"="hardware"](around:${radius},${lat},${lon});
        node["shop"="seed"](around:${radius},${lat},${lon});
        node["shop"="fertilizer"](around:${radius},${lat},${lon});
        node["shop"="agricultural_supplies"](around:${radius},${lat},${lon});
        node["shop"="garden_centre"](around:${radius},${lat},${lon});
      );
      out body 20;
    `;
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });

    if (!res.ok) throw new Error('Network error');

    const data = await res.json();

    if (data.elements && data.elements.length > 0) {
      return data.elements.map(el => {
        const type = el.tags.shop === 'agrarian' || el.tags.shop === 'farm' ? 'Retailer' : 'Mandi';
        return {
          id: el.id,
          name: el.tags.name || (type === 'Mandi' ? 'Local Market' : 'Agri Store'),
          type,
          address: el.tags['addr:full'] || el.tags['addr:street'] || el.tags['addr:city'] || 'Location mapped nearby',
          lat: el.lat,
          lon: el.lon,
          distance: getDistance(lat, lon, el.lat, el.lon),
          phone: el.tags.phone || el.tags['contact:phone'] || null,
          rating: null, // OSM carries no ratings — never fabricate one
        };
      }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }

    // No vendors found nearby — return an honest empty list, not fake entries.
    return [];
  } catch (err) {
    console.error('Vendor fetch failed:', err);
    return [];
  }
};

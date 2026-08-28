import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  MapPin, Navigation, Search, Phone, Star, 
  Map as MapIcon
} from 'lucide-react';
import { vendorsService } from '../services/vendorsService';
import LoadingState from '../components/ui/LoadingState';

// Fix Leaflet's default icon path issues with bundlers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to recenter map when location changes
function RecenterAutomatically({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

export default function LocalVendorsPage() {
  const [position, setPosition] = useState(null); // {lat, lng}
  const [locationName, setLocationName] = useState("Locating...");
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Custom user icon
  const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  useEffect(() => {
    const fetchLocationAndVendors = async () => {
      setIsLoading(true);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const { latitude, longitude } = pos.coords;
              setPosition({ lat: latitude, lng: longitude });
              
              // Reverse Geocode
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const data = await res.json();
              const city = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state_district;
              setLocationName(city ? `${city}, ${data.address.state}` : 'Your Location');
              
              // Fetch Mock Vendors
              const nearbyVendors = await vendorsService.getNearbyVendors(latitude, longitude);
              setVendors(nearbyVendors);
              
              setIsLoading(false);
            } catch (err) {
              console.error("Geocoding or vendor fetch failed:", err);
              // Fallback to default location
              executeFallback();
            }
          },
          (err) => {
            console.error("Geolocation denied or failed:", err);
            executeFallback();
          },
          { timeout: 10000 }
        );
      } else {
        executeFallback();
      }
    };
    
    fetchLocationAndVendors();
  }, []);
  
  const executeFallback = async (errorMsg) => {
    setError(errorMsg || "Could not fetch location or vendors.");
    setIsLoading(false);
  };
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-6 min-h-screen">
        <LoadingState 
          message="Locating you..." 
          subMessage="Finding the best agricultural vendors near you"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 min-h-screen text-center">
        <MapPin className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Error Locating Vendors</h2>
        <p className="text-slate-500 max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-[#f4f7f5] min-h-screen relative flex flex-col">


      {/* Header */}
      <div className="bg-white px-4 sm:px-6 py-4 border-b border-gray-100 z-30 shadow-sm shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <MapIcon className="w-6 h-6 text-green-600" /> Local Vendors
            </h1>
            <div className="flex items-center gap-1 mt-1 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-full w-fit">
              <Navigation className="w-3 h-3" /> Showing results near {locationName}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 sm:p-6 gap-6 h-[calc(100vh-140px)]">
        
        {/* Left: Map */}
        <div className="w-full lg:w-2/3 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[400px] lg:min-h-0 flex-shrink-0 z-0">
          {position && (
            <MapContainer 
              center={[position.lat, position.lng]} 
              zoom={13} 
              scrollWheelZoom={true} 
              className="h-full w-full absolute inset-0 z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <RecenterAutomatically lat={position.lat} lng={position.lng} />
              
              {/* User Location */}
              <Marker position={[position.lat, position.lng]} icon={userIcon}>
                <Popup>
                  <div className="font-bold text-green-700">You are here</div>
                </Popup>
              </Marker>
              
              {/* Vendors */}
              {vendors.map(v => (
                <Marker key={v.id} position={v.position}>
                  <Popup>
                    <div className="p-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{v.icon}</span>
                        <span className="font-black text-sm text-slate-800">{v.name}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-bold mb-2">{v.category}</p>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="flex items-center gap-1 text-yellow-600 font-bold"><Star className="w-3 h-3 fill-yellow-400" /> {v.rating}</span>
                        <span className="flex items-center gap-1 text-slate-500"><MapPin className="w-3 h-3" /> {v.distance}</span>
                      </div>
                      <button 
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${v.position[0]},${v.position[1]}`, '_blank')}
                        className="w-full bg-blue-600 text-white py-1.5 rounded-lg text-[10px] font-bold hover:bg-blue-700"
                      >
                        Get Directions
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Right: Vendor List */}
        <div className="w-full lg:w-1/3 flex flex-col h-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden shrink-0">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" /> Explore Nearby ({vendors.length})
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {vendors.map(v => (
              <div key={v.id} className="p-4 border border-gray-100 rounded-2xl hover:border-green-300 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-xl shadow-sm border border-green-100 group-hover:scale-110 transition-transform">
                      {v.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-800">{v.name}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">{v.category}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${v.open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {v.open ? 'OPEN' : 'CLOSED'}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50 text-xs font-medium text-slate-600">
                  <span className="flex items-center gap-1 text-yellow-600 font-bold"><Star className="w-3.5 h-3.5 fill-yellow-400" /> {v.rating}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {v.distance}</span>
                </div>
                
                <div className="mt-3 flex gap-2">
                  <a href={`tel:${v.phone.replace(/\s+/g, '')}`} className="flex-1 bg-green-50 text-green-700 py-2 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1 hover:bg-green-100 transition-colors">
                    <Phone className="w-3 h-3" /> Call
                  </a>
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${v.position[0]},${v.position[1]}`, '_blank')}
                    className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1 hover:bg-blue-100 transition-colors"
                  >
                    <Navigation className="w-3 h-3" /> Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

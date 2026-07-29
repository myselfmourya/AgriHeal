import { motion } from 'framer-motion';
import { useVani } from '../../contexts/VaniContext';
import { CloudRain, Sun, Wind, Droplets } from 'lucide-react';

export default function CropWeather() {
  const { speak } = useVani();

  return (
    <div className="page-content">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Local Weather</h1>
        <p className="text-sm text-gray-500">Forecast for your farm location</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl mb-6 shadow-lg"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="text-5xl font-bold mb-2">28°C</div>
            <div className="text-blue-100 flex items-center gap-2">
              <CloudRain className="w-4 h-4" /> Light Rain
            </div>
          </div>
          <Sun className="w-16 h-16 text-yellow-300" />
        </div>
        
        <div className="grid grid-cols-3 gap-4 border-t border-blue-400/30 pt-4">
          <div className="text-center">
            <div className="text-blue-200 text-xs mb-1 flex justify-center items-center gap-1"><Wind className="w-3 h-3"/> Wind</div>
            <div className="font-semibold text-sm">12 km/h</div>
          </div>
          <div className="text-center border-l border-blue-400/30">
            <div className="text-blue-200 text-xs mb-1 flex justify-center items-center gap-1"><Droplets className="w-3 h-3"/> Humidity</div>
            <div className="font-semibold text-sm">65%</div>
          </div>
          <div className="text-center border-l border-blue-400/30">
            <div className="text-blue-200 text-xs mb-1 flex justify-center items-center gap-1"><CloudRain className="w-3 h-3"/> Rain</div>
            <div className="font-semibold text-sm">40%</div>
          </div>
        </div>
      </motion.div>

      <h3 className="font-bold text-lg mb-4">Weekly Forecast</h3>
      <div className="space-y-3">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
          <div key={day} className="flex items-center justify-between p-4 card hover:shadow-md transition-shadow">
            <span className="font-medium w-12">{day}</span>
            <div className="flex items-center gap-3 text-blue-500">
              {i % 2 === 0 ? <Sun className="w-5 h-5 text-yellow-500" /> : <CloudRain className="w-5 h-5" />}
              <span className="text-sm font-medium text-gray-700">{i % 2 === 0 ? 'Sunny' : 'Rainy'}</span>
            </div>
            <span className="font-semibold">24° / 32°</span>
          </div>
        ))}
      </div>
    </div>
  );
}

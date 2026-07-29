import { motion } from 'framer-motion';
import { useVani } from '../../contexts/VaniContext';
import { useFarmer } from '../../contexts/FarmerContext';
import { Sprout, TestTube, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function CropSoilHealth() {
  const { speak } = useVani();
  const { profile } = useFarmer();

  const metrics = [
    { label: 'Nitrogen (N)', value: 'High', ideal: 'Medium', icon: ArrowUpCircle, color: 'text-red-500' },
    { label: 'Phosphorus (P)', value: 'Optimal', ideal: 'Optimal', icon: Sprout, color: 'text-green-500' },
    { label: 'Potassium (K)', value: 'Low', ideal: 'Medium', icon: ArrowDownCircle, color: 'text-amber-500' },
    { label: 'pH Level', value: '6.5', ideal: '6.0-7.0', icon: TestTube, color: 'text-blue-500' },
  ];

  return (
    <div className="page-content">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Soil Health</h1>
          <p className="text-sm text-gray-500">Latest test results: Oct 15, 2023</p>
        </div>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={() => speak('Upload new soil test report')}
        >
          <TestTube className="w-4 h-4" />
          New Test
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {metrics.map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="stat-card p-4 bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <m.icon className={`w-5 h-5 ${m.color}`} />
              <span className="font-medium text-sm text-gray-600">{m.label}</span>
            </div>
            <div className="text-xl font-bold mb-1">{m.value}</div>
            <div className="text-xs text-gray-400">Ideal: {m.ideal}</div>
          </motion.div>
        ))}
      </div>

      <div className="section-card p-6">
        <h3 className="section-title mb-4 flex items-center gap-2">
          <Sprout className="w-5 h-5 text-brand-green" />
          Recommendations
        </h3>
        <ul className="space-y-3">
          <li className="flex gap-3 items-start p-3 bg-amber-50 rounded-lg text-amber-800 text-sm">
            <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
            <p>Reduce urea application by 15% due to high Nitrogen levels.</p>
          </li>
          <li className="flex gap-3 items-start p-3 bg-green-50 rounded-lg text-green-800 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
            <p>Apply Muriate of Potash (MOP) to address Potassium deficiency.</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

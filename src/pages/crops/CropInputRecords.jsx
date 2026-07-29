import { motion } from 'framer-motion';
import { useVani } from '../../contexts/VaniContext';
import { Droplet, Bug, Plus } from 'lucide-react';

export default function CropInputRecords() {
  const { speak } = useVani();

  const records = [
    { id: 1, type: 'Fertilizer', name: 'Urea', amount: '50 kg', date: 'Oct 20, 2023', cost: '₹1,200', icon: Droplet, color: 'text-blue-500' },
    { id: 2, type: 'Pesticide', name: 'Neem Oil', amount: '2 L', date: 'Oct 05, 2023', cost: '₹400', icon: Bug, color: 'text-red-500' },
  ];

  return (
    <div className="page-content">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Input Records</h1>
          <p className="text-sm text-gray-500">Track fertilizers and pesticides</p>
        </div>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={() => speak('Log new input')}
        >
          <Plus className="w-4 h-4" />
          Log Input
        </button>
      </div>

      <div className="space-y-4">
        {records.map((rec, i) => (
          <motion.div 
            key={rec.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-4 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full bg-gray-50 ${rec.color}`}>
                <rec.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{rec.name}</h3>
                <div className="text-xs text-gray-500 flex gap-2">
                  <span>{rec.type}</span> • <span>{rec.date}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-800">{rec.amount}</div>
              <div className="text-xs text-green-600 font-medium">{rec.cost}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

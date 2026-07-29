import { motion } from 'framer-motion';
import { useVani } from '../../contexts/VaniContext';
import { Calendar as CalendarIcon, CheckCircle2, Clock } from 'lucide-react';

export default function CropCalendar() {
  const { speak } = useVani();

  const events = [
    { id: 1, title: 'Seed Sowing', date: 'Oct 01, 2023', status: 'completed' },
    { id: 2, title: 'First Fertilizer Application', date: 'Oct 20, 2023', status: 'completed' },
    { id: 3, title: 'Weeding Phase 1', date: 'Nov 05, 2023', status: 'upcoming' },
    { id: 4, title: 'Pesticide Spray', date: 'Nov 15, 2023', status: 'upcoming' },
    { id: 5, title: 'Expected Harvest', date: 'Feb 10, 2024', status: 'upcoming' },
  ];

  return (
    <div className="page-content">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Crop Calendar</h1>
          <p className="text-sm text-gray-500">Schedule and milestones</p>
        </div>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={() => speak('Add new schedule')}
        >
          <CalendarIcon className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="relative border-l-2 border-brand-green/30 ml-4 space-y-6 pb-4">
        {events.map((evt, i) => (
          <motion.div 
            key={evt.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative pl-6"
          >
            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${evt.status === 'completed' ? 'bg-brand-green' : 'bg-gray-300'}`}></div>
            <div className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`font-semibold ${evt.status === 'completed' ? 'text-gray-800' : 'text-gray-600'}`}>{evt.title}</h3>
                {evt.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <p className="text-sm text-gray-500">{evt.date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { useVani } from '../../contexts/VaniContext';
import { useFarmer } from '../../contexts/FarmerContext';
import { 
  Sprout, 
  CloudSun, 
  Calendar, 
  Droplet, 
  Calculator, 
  IndianRupee, 
  FileText, 
  StickyNote,
  ChevronRight
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function CropMoreTools() {
  const { speak } = useVani();
  const { profile, myCrops } = useFarmer();
  const navigate = useNavigate();
  const { cropId } = useParams();

  const tools = [
    { id: 'soil-health', title: 'Soil Health', icon: Sprout, color: 'text-amber-600', path: 'soil-health', desc: 'NPK status & test reports' },
    { id: 'weather', title: 'Weather Forecast', icon: CloudSun, color: 'text-blue-500', path: 'weather', desc: 'Local weather & alerts' },
    { id: 'calendar', title: 'Crop Calendar', icon: Calendar, color: 'text-green-600', path: 'calendar', desc: 'Schedule & milestones' },
    { id: 'input-records', title: 'Input Records', icon: Droplet, color: 'text-cyan-500', path: 'input-records', desc: 'Fertilizer & pesticide logs' },
    { id: 'yield-estimator', title: 'Yield Estimator', icon: Calculator, color: 'text-purple-500', path: 'yield-estimator', desc: 'Predict harvest output' },
    { id: 'farm-expenses', title: 'Farm Expenses', icon: IndianRupee, color: 'text-red-500', path: 'farm-expenses', desc: 'Cost & revenue tracking' },
    { id: 'reports', title: 'Reports', icon: FileText, color: 'text-indigo-500', path: 'reports', desc: 'Detailed crop analytics' },
    { id: 'notes', title: 'Farm Notes', icon: StickyNote, color: 'text-yellow-600', path: 'notes', desc: 'Personal observations' },
  ];

  return (
    <div className="page-content">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Management Tools</h1>
        <p className="text-gray-500 text-sm">Select a tool to manage your crop</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool, index) => (
          <motion.div 
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              speak(`Opening ${tool.title}`);
              navigate(`/crops/${cropId}/${tool.path}`);
            }}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gray-100 ${tool.color}`}>
                <tool.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{tool.title}</h3>
                <p className="text-sm text-gray-500">{tool.desc}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

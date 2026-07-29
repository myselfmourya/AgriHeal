import { motion } from 'framer-motion';
import { useVani } from '../../contexts/VaniContext';
import { Calculator, TrendingUp, AlertTriangle } from 'lucide-react';

export default function CropYieldEstimator() {
  const { speak } = useVani();

  return (
    <div className="page-content">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Yield Estimator</h1>
        <p className="text-sm text-gray-500">AI-powered harvest prediction</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-6 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl mb-6 shadow-lg relative overflow-hidden"
      >
        <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-purple-100">
            <Calculator className="w-5 h-5" />
            <span className="font-medium text-sm">Estimated Total Yield</span>
          </div>
          <div className="text-4xl font-bold mb-1">24.5 <span className="text-xl font-normal text-purple-200">Quintals</span></div>
          <div className="text-sm text-purple-200 flex items-center gap-1 mt-4">
            <TrendingUp className="w-4 h-4 text-green-300" />
            <span className="text-green-300 font-medium">+5%</span> vs last season
          </div>
        </div>
      </motion.div>

      <div className="section-card p-6">
        <h3 className="section-title mb-4">Influencing Factors</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm border-b pb-2">
            <span className="text-gray-600">Current Weather Impact</span>
            <span className="text-green-600 font-medium">+ Positive</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b pb-2">
            <span className="text-gray-600">Soil Health Score</span>
            <span className="text-amber-600 font-medium">Neutral</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Pest Threat Level</span>
            <span className="text-green-600 font-medium">Low</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
        <p className="text-xs text-amber-800">
          Estimate based on current data. Sudden weather changes or pest attacks may alter the final yield.
        </p>
      </div>
    </div>
  );
}

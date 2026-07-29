import { motion } from 'framer-motion';
import { useVani } from '../../contexts/VaniContext';
import {  PieChart, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function CropFarmExpenses() {
  const { speak } = useVani();

  const transactions = [
    { id: 1, title: 'Urea Fertilizer', date: 'Oct 20, 2023', amount: 1200, type: 'expense' },
    { id: 2, title: 'Tractor Rent', date: 'Oct 02, 2023', amount: 3500, type: 'expense' },
    { id: 3, title: 'Seed Subsidy', date: 'Sep 25, 2023', amount: 1500, type: 'income' },
  ];

  return (
    <div className="page-content">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Farm Expenses</h1>
          <p className="text-sm text-gray-500">Track costs and revenues</p>
        </div>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={() => speak('Add new transaction')}
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="stat-card p-4 bg-red-50 border border-red-100 rounded-xl"
        >
          <div className="text-red-600 text-xs font-semibold mb-1 flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> Total Expenses</div>
          <div className="text-xl font-bold text-red-700">₹4,700</div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stat-card p-4 bg-green-50 border border-green-100 rounded-xl"
        >
          <div className="text-green-600 text-xs font-semibold mb-1 flex items-center gap-1"><ArrowDownRight className="w-3 h-3"/> Total Income</div>
          <div className="text-xl font-bold text-green-700">₹1,500</div>
        </motion.div>
      </div>

      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <PieChart className="w-5 h-5 text-gray-400" />
        Recent Transactions
      </h3>
      
      <div className="space-y-3">
        {transactions.map((t, i) => (
          <motion.div 
            key={t.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-4 flex items-center justify-between"
          >
            <div>
              <div className="font-semibold text-gray-800 text-sm">{t.title}</div>
              <div className="text-xs text-gray-500">{t.date}</div>
            </div>
            <div className={`font-bold ${t.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
              {t.type === 'expense' ? '-' : '+'}₹{t.amount}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

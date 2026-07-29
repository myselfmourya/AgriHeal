import { motion } from 'framer-motion';
import { useVani } from '../../contexts/VaniContext';
import { FileText, Download, Share2 } from 'lucide-react';

export default function CropReports() {
  const { speak } = useVani();

  const reports = [
    { id: 1, title: 'Soil Test Report', date: 'Oct 15, 2023', size: '1.2 MB' },
    { id: 2, title: 'Mid-Season Health Analysis', date: 'Nov 02, 2023', size: '2.4 MB' },
  ];

  return (
    <div className="page-content">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Reports</h1>
        <p className="text-sm text-gray-500">Download and share crop documents</p>
      </div>

      <div className="space-y-4">
        {reports.map((report, i) => (
          <motion.div 
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{report.title}</h3>
              <p className="text-xs text-gray-500">{report.date} • {report.size}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="p-2 text-gray-400 hover:text-brand-green transition-colors"
                onClick={() => speak(`Downloading ${report.title}`)}
              >
                <Download className="w-5 h-5" />
              </button>
              <button 
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                onClick={() => speak(`Sharing ${report.title}`)}
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

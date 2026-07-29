import { motion } from 'framer-motion';
import { useVani } from '../../contexts/VaniContext';
import { StickyNote, Plus } from 'lucide-react';

export default function CropNotes() {
  const { speak } = useVani();

  const notes = [
    { id: 1, title: 'Observed yellowing leaves', date: 'Oct 28, 2023', content: 'Noticed slight yellowing on the lower leaves in the north field. Might need to check Nitrogen levels.' },
    { id: 2, title: 'Heavy rain last night', date: 'Oct 25, 2023', content: 'Field is waterlogged. Need to ensure proper drainage today to avoid root rot.' },
  ];

  return (
    <div className="page-content">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Farm Notes</h1>
          <p className="text-sm text-gray-500">Personal observations</p>
        </div>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={() => speak('Create a new note')}
        >
          <Plus className="w-4 h-4" />
          New Note
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map((note, i) => (
          <motion.div 
            key={note.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="card p-5 bg-yellow-50/50 border border-yellow-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-800 pr-4">{note.title}</h3>
              <StickyNote className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            </div>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{note.content}</p>
            <div className="text-xs text-gray-400 font-medium">{note.date}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

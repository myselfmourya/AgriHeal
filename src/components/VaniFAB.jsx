import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { useVani } from '../contexts/VaniContext'

export default function VaniFAB() {
  const { openVani, listening, speaking, wakeActive } = useVani()
  const location = useLocation()

  if (location.pathname === '/notifications') return null;

  return (
    <motion.button
      className="fixed bottom-6 right-6 w-14 h-14 bg-[#1b5e20] hover:bg-[#144d18] text-white rounded-full shadow-[0_8px_30px_rgb(27,94,32,0.3)] flex items-center justify-center z-40"
      onClick={openVani}
      aria-label="Open Vani Chat"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 15, delay: 0.2 }}
    >
      <MessageSquare className="w-6 h-6" />
    </motion.button>
  )
}

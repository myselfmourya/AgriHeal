import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mic, MicOff, Volume2 } from 'lucide-react'
import { useVani } from '../contexts/VaniContext'

export default function VaniFAB() {
  const { startListening, stopListening, isListening, isSpeaking, isActivated } = useVani()
  const location = useLocation()

  if (location.pathname === '/notifications') return null;

  const handleClick = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const isActive = isListening || isSpeaking || isActivated

  return (
    <motion.button
      className={`fixed bottom-6 right-6 w-14 h-14 text-white rounded-full shadow-[0_8px_30px_rgb(27,94,32,0.3)] flex items-center justify-center z-40 transition-colors ${
        isSpeaking
          ? 'bg-blue-600 hover:bg-blue-700'
          : isActivated
            ? 'bg-green-500 hover:bg-green-600'
            : isListening
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-[#1b5e20] hover:bg-[#144d18]'
      }`}
      onClick={handleClick}
      aria-label={isListening ? 'Stop Vani' : 'Start Vani'}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 15, delay: 0.2 }}
    >
      {isActive && (
        <span className={`absolute inset-0 rounded-full animate-ping opacity-50 ${isSpeaking ? 'bg-blue-400' : 'bg-green-400'}`} />
      )}
      {isSpeaking
        ? <Volume2 className="w-6 h-6 relative z-10 animate-pulse" />
        : isListening
          ? <MicOff className="w-6 h-6 relative z-10" />
          : <Mic className="w-6 h-6 relative z-10" />
      }
    </motion.button>
  )
}


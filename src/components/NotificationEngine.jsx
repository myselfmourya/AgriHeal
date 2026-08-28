import { useEffect, useRef, useState } from 'react';
import { useFarmer } from '../contexts/FarmerContext';

// Standard short alarm sound
const ALARM_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

export default function NotificationEngine() {
  const { notifications, updateNotification } = useFarmer();
  const [activeAlarms, setActiveAlarms] = useState([]);
  const audioRef = useRef(null);
  const audioUnlocked = useRef(false);

  useEffect(() => {
    // Create an audio element
    audioRef.current = new Audio(ALARM_SOUND);
    audioRef.current.loop = true; // loop until dismissed

    const unlockAudio = () => {
      if (!audioUnlocked.current && audioRef.current) {
        // Mute before unlocking to prevent split-second beep
        audioRef.current.muted = true;
        audioRef.current.play().then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.muted = false;
          audioUnlocked.current = true;
        }).catch(() => {
          audioRef.current.muted = false;
        });
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
      }
    };

    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);

    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      // Check for notifications that need to trigger an alarm
      const triggered = notifications.filter(n => {
        if (n.type !== 'Reminder' || !n.scheduledTime || n.alarmTriggered) return false;
        const scheduled = new Date(n.scheduledTime);
        return now >= scheduled;
      });

      if (triggered.length > 0) {
        triggered.forEach(t => {
          // Mark as triggered so we don't trigger again
          updateNotification(t.id, { alarmTriggered: true, unread: true });
        });
        
        setActiveAlarms(prev => [...prev, ...triggered]);
        
        // Attempt to play sound (might fail if user hasn't interacted)
        audioRef.current.play().catch(e => console.log('Audio autoplay blocked:', e));
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [notifications, updateNotification]);

  const dismissAlarm = (id) => {
    setActiveAlarms(prev => {
      const updated = prev.filter(a => a.id !== id);
      if (updated.length === 0) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return updated;
    });
  };

  if (activeAlarms.length === 0) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[100] flex flex-col items-center gap-4 pt-10 px-4 pointer-events-none">
      {activeAlarms.map(alarm => (
        <div key={alarm.id} className="pointer-events-auto w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden flex flex-col animate-bounce">
          <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
            <h3 className="text-white font-extrabold flex items-center gap-2">
              <span className="text-xl">⏰</span> Reminder Alert!
            </h3>
          </div>
          <div className="px-6 py-5 flex flex-col gap-2">
            <h4 className="text-xl font-bold text-zinc-900">{alarm.title}</h4>
            <p className="text-zinc-600 font-medium">{alarm.message}</p>
          </div>
          <div className="px-6 pb-6">
            <button 
              onClick={() => dismissAlarm(alarm.id)}
              className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-3.5 rounded-xl transition-colors"
            >
              Dismiss Alarm
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { 
  LiveKitRoom, 
  RoomAudioRenderer, 
  VoiceAssistantControlBar, 
  BarVisualizer, 
  useVoiceAssistant,
  useLocalParticipant
} from '@livekit/components-react';
import '@livekit/components-styles';
import { supabase } from '../../lib/supabase';
import { useVani } from '../../contexts/VaniContext';
import { useFarmer } from '../../contexts/FarmerContext';
import { useWeather } from '../../contexts/WeatherContext';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

const VoiceUI = () => {
  const { state, audioTrack } = useVoiceAssistant();
  const { setIsLiveKitActive, sessionIntent } = useVani();
  const { localParticipant } = useLocalParticipant();
  const { profile } = useFarmer();
  const { weatherData } = useWeather();
  const location = useLocation();
  const { i18n } = useTranslation();

  // Auto-disconnect on silence (15 seconds of 'listening' state)
  useEffect(() => {
    let timeout;
    if (state === 'listening') {
      timeout = setTimeout(() => {
        setIsLiveKitActive(false);
      }, 15000);
    }
    return () => clearTimeout(timeout);
  }, [state, setIsLiveKitActive]);

  // Register the RPC method to supply context to the backend
  useEffect(() => {
    if (localParticipant) {
      console.log('Registering RPC method "get_app_context"');
      localParticipant.registerRpcMethod('get_app_context', async () => {
        const contextData = {
            route: location.pathname,
            auth: profile,
            weather: weatherData,
            language: i18n.language,
            intent: sessionIntent,
        };
        console.log("Supplying context to backend via RPC:", contextData);
        return JSON.stringify(contextData);
      });

      return () => {
        try {
          localParticipant.unregisterRpcMethod('get_app_context');
        } catch (e) {
          console.error("Failed to unregister RPC method", e);
        }
      };
    }
  }, [localParticipant, location.pathname, profile, weatherData, i18n.language]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      {/* Visualizer for Voice */}
      <div className="h-24 w-full max-w-sm flex items-center justify-center bg-black/20 rounded-2xl overflow-hidden mx-auto">
        <BarVisualizer 
          state={state} 
          trackRef={audioTrack} 
          barCount={7} 
          options={{ minHeight: 16 }} 
        />
      </div>
      
      {/* Status Text */}
      <div className="text-sm font-semibold text-white/90 uppercase tracking-widest text-center mt-2">
        {state === 'connecting' ? 'Connecting...' : 
         state === 'listening' ? 'Vani is Listening...' : 
         state === 'speaking' ? 'Vani is Speaking' : 'Vani is Active'}
      </div>

      <div className="flex justify-center items-center gap-4 mt-2">
        <VoiceAssistantControlBar controls={{ leave: false }} />
        
        {/* Custom Leave Button */}
        <button 
          onClick={() => setIsLiveKitActive(false)}
          className="bg-red-500/80 hover:bg-red-500 text-white p-3 rounded-full transition-all shadow-md"
          title="End Conversation"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default function AmbientVoiceOverlay() {
  const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const { isLiveKitActive, setIsLiveKitActive } = useVani();
  const { profile } = useFarmer();

  // Guard: if VITE_LIVEKIT_URL is not set, show config error instead of connecting
  const isMisconfigured = !LIVEKIT_URL;

  useEffect(() => {
    if (!isLiveKitActive) {
        setToken(null);
        setError(null);
        return;
    }

    let mounted = true;
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('livekit-token', {
          body: { roomName: `vani-room-${profile?.id || 'guest'}`, participantName: profile?.name || 'Farmer' }
        });
        
        if (error) throw error;
        if (data?.token && mounted) {
          setToken(data.token);
        } else if (mounted) {
          throw new Error('No token returned');
        }
      } catch (err) {
        console.error('Error fetching LiveKit token:', err);
        if (mounted) setError(err.message);
      }
    };
    
    fetchToken();
    return () => { mounted = false; };
  }, [isLiveKitActive, profile]);

  if (!isLiveKitActive) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={() => setIsLiveKitActive(false)} />
      
      {/* Bottom Sheet */}
      <div className="relative w-full max-w-2xl bg-slate-900/90 backdrop-blur-xl rounded-t-3xl border-t border-white/20 p-6 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] pointer-events-auto animate-in slide-in-from-bottom-full duration-300 ease-out">
        
        {isMisconfigured ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-yellow-400 font-bold mb-2">Vani not configured</p>
            <p className="text-white/60 text-sm text-center mb-4">VITE_LIVEKIT_URL is not set. Check your .env file.</p>
            <button onClick={() => setIsLiveKitActive(false)} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white font-medium transition-colors">
              Close
            </button>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-red-400 font-bold mb-4">Failed to connect to Vani</p>
            <button onClick={() => setIsLiveKitActive(false)} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white font-medium transition-colors">
              Close
            </button>
          </div>
        ) : !token ? (
          <div className="flex flex-col items-center justify-center py-10 text-white">
            <div className="flex gap-2 mb-4">
               <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></span>
               <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
               <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <p className="text-sm font-semibold tracking-wide text-green-100">Waking up Vani...</p>
          </div>
        ) : (
          <LiveKitRoom
            token={token}
            serverUrl={LIVEKIT_URL}
            connect={true}
            onDisconnected={() => setIsLiveKitActive(false)}
          >
            <RoomAudioRenderer />
            <VoiceUI />
          </LiveKitRoom>
        )}
      </div>
    </div>
  );
}

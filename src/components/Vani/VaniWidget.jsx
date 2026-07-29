import React from 'react';
import { useVani } from '../../contexts/VaniContext';
import { Mic, Volume2 } from 'lucide-react';

export default function VaniWidget() {
  const { isVoiceModeEnabled, isListening, isSpeaking, startListening, stopListening, transcript } = useVani();

  if (!isVoiceModeEnabled) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2">
      {/* Transcript bubble when listening */}
      {isListening && transcript && (
        <div className="bg-black/80 backdrop-blur-md text-white text-sm px-4 py-2 rounded-2xl rounded-br-none shadow-lg max-w-[200px] break-words">
          "{transcript}"
        </div>
      )}
      
      {/* Main Orb Button */}
      <button 
        onClick={isListening ? stopListening : startListening}
        className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${
          isSpeaking 
            ? 'bg-blue-600 scale-110' 
            : isListening 
              ? 'bg-green-600 scale-110' 
              : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {/* Ripple effects when listening or speaking */}
        {(isListening || isSpeaking) && (
          <>
            <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${isSpeaking ? 'bg-blue-400' : 'bg-green-400'}`}></div>
            <div className={`absolute inset-[-8px] rounded-full animate-pulse opacity-50 ${isSpeaking ? 'bg-blue-300' : 'bg-green-300'}`}></div>
          </>
        )}
        
        {isSpeaking ? (
          <Volume2 className="w-8 h-8 text-white relative z-10 animate-pulse" />
        ) : (
          <Mic className="w-8 h-8 text-white relative z-10" />
        )}
      </button>
    </div>
  );
}

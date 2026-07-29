import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useTranslation } from 'react-i18next';

export const LANGS = [
  { code: 'hi', label: 'Hindi' },
  { code: 'en', label: 'English' },
  { code: 'te', label: 'Telugu' },
  { code: 'ta', label: 'Tamil' },
  { code: 'mr', label: 'Marathi' }
];

const VaniContext = createContext();

export const useVani = () => useContext(VaniContext);

export const VaniProvider = ({ children }) => {
  const [isVoiceModeEnabled, setIsVoiceModeEnabled] = useState(() => {
    return localStorage.getItem('ah-voice-mode') === 'true';
  });
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('Listening...');
  
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  // Initialize Speech Recognition once
  const recognition = useMemo(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    return rec;
  }, []);

  useEffect(() => {
    if (recognition) {
      // Set language based on app language
      recognition.lang = i18n.language === 'te' ? 'te-IN' : i18n.language === 'hi' ? 'hi-IN' : 'en-IN';
    }
  }, [recognition, i18n.language]);

  const toggleVoiceMode = (enabled) => {
    setIsVoiceModeEnabled(enabled);
    localStorage.setItem('ah-voice-mode', enabled);
    if (!enabled) {
      stopListening();
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = i18n.language === 'te' ? 'te-IN' : i18n.language === 'hi' ? 'hi-IN' : 'en-IN';
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [i18n.language]);

  const processCommandWithGemini = async (text) => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("No API Key");
      }
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
        You are Vani, a helpful local farming expert voice assistant for the AgriHeal app.
        Keep responses very short, simple, and conversational.
        Do not use complicated terminology.
        Respond in the same language as the user's prompt.
        
        The user said: "${text}"
        
        You can navigate the app. Available routes:
        /dashboard, /crops, /market, /weather, /community, /store, /profile, /image-analysis.
        
        Return a strict JSON object with this exact format:
        {
          "speech": "What you want to say to the farmer",
          "action": "NAVIGATE" | "NONE",
          "target": "/route-if-navigate-or-null"
        }
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let textResponse = response.text();
      
      // Clean markdown formatting if present
      textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(textResponse);
      
    } catch (error) {
      console.warn("Gemini API not configured or failed. Using fallback.", error);
      // Fallback logic for prototype when no API key is provided
      const textLower = text.toLowerCase();
      let route = null;
      let speech = i18n.language === 'hi' ? "मुझे समझ नहीं आया।" : i18n.language === 'te' ? "నాకు సరిగ్గా అర్థం కాలేదు." : "I didn't quite catch that.";
      
      if (textLower.includes('market') || textLower.includes('price') || textLower.includes('మార్కెట్') || textLower.includes('ధర')) {
        route = '/market';
        speech = "I've opened the market page for you.";
      } else if (textLower.includes('crop') || textLower.includes('plant') || textLower.includes('పంట')) {
        route = '/crops';
        speech = i18n.language === 'te' ? "ఇవిగో మీ పంటలు." : "Here are your crops.";
      } else if (textLower.includes('weather') || textLower.includes('rain') || textLower.includes('వాతావరణం') || textLower.includes('వర్షం')) {
        route = '/weather';
        speech = i18n.language === 'te' ? "వాతావరణ సూచన ఇక్కడ ఉంది." : "Here is the weather forecast.";
      } else if (textLower.includes('camera') || textLower.includes('scan') || textLower.includes('photo') || textLower.includes('disease') || textLower.includes('స్కాన్') || textLower.includes('వ్యాధి')) {
        route = '/image-analysis';
        speech = i18n.language === 'te' ? "దయచేసి మీ కెమెరాను వ్యాధిగ్రస్తులైన పంటపై ఉంచండి." : "Please point your camera at the affected crop.";
      }
      
      return {
        speech: speech,
        action: route ? "NAVIGATE" : "NONE",
        target: route
      };
    }
  };

  const handleVoiceInput = useCallback(async (text) => {
    setTranscript(text);
    
    // Send to Gemini (or fallback)
    const response = await processCommandWithGemini(text);
    
    // Speak the response
    if (response.speech) {
      setTimeout(() => speak(response.speech), 100);
    }
    
    // Execute action
    if (response.action === 'NAVIGATE' && response.target) {
      navigate(response.target);
    }
  }, [navigate, speak, i18n.language]);

  useEffect(() => {
    if (recognition) {
      recognition.onresult = (event) => {
        let currentText = "";
        let isFinal = false;
        
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }
        
        setTranscript(currentText);
        
        if (isFinal) {
          console.log("Final speech recognized:", currentText);
          handleVoiceInput(currentText);
        }
      };
      
      recognition.onstart = () => {
        console.log("Speech recognition started");
        setIsListening(true);
      };
      
      recognition.onend = () => {
        console.log("Speech recognition ended");
        setIsListening(false);
      };
      
      recognition.onerror = (e) => {
        console.error("Speech recognition error", e.error, e.message);
        if (e.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone permissions in your browser to use Vani.');
        }
        setIsListening(false);
      };
    }
  }, [recognition, handleVoiceInput]);

  const startListening = () => {
    if (!recognition) {
      alert("Voice recognition is not supported in your browser. Try using Google Chrome.");
      return;
    }
    
    // Unlock speech synthesis on user gesture for Safari/iOS
    if (window.speechSynthesis) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
    }
    
    setTranscript('');
    
    try {
      recognition.start();
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const greet = (name, weather) => {
    if (!isVoiceModeEnabled) return;
    const greeting = i18n.language === 'hi' 
      ? `नमस्ते ${name}, आज मौसम है ${weather}`
      : i18n.language === 'te'
      ? `నమస్తే ${name}, ఈ రోజు వాతావరణం ${weather}`
      : `Hello ${name}, today's weather is ${weather}`;
    speak(greeting);
  };

  const startWakeWord = () => {
    // For future expansion: a lightweight listener for the wake word "Vani"
  };

  return (
    <VaniContext.Provider value={{
      isVoiceModeEnabled,
      toggleVoiceMode,
      isListening,
      isSpeaking,
      startListening,
      stopListening,
      transcript,
      speak,
      greet,
      startWakeWord
    }}>
      {children}
    </VaniContext.Provider>
  );
};

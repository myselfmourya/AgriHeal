/**
 * VaniContext — AgriHeal Voice Assistant State
 *
 * Two voice modes:
 *  1. SIMPLE: Browser SpeechRecognition → ai-proxy Edge Function → browser TTS
 *     (light, no LiveKit, good for quick commands)
 *
 *  2. LIVEKIT: Full real-time voice session with Gladia STT + Claude LLM + Cartesia TTS
 *     Triggered by startVaniSession({ intent }) from any component.
 *     AmbientVoiceOverlay handles the LiveKit room connection.
 *
 * All AI keys stay server-side. This file makes zero direct API calls.
 */

import React, {
  createContext, useContext, useState, useEffect,
  useCallback, useMemo, useRef
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { generateText } from '../services/aiProvider';

// ── Language config ────────────────────────────────────────────────────────
export const LANGS = [
  { code: 'hi', label: 'Hindi' },
  { code: 'en', label: 'English' },
  { code: 'te', label: 'Telugu' },
  { code: 'ta', label: 'Tamil' },
  { code: 'mr', label: 'Marathi' },
];

const LANG_BCP = { hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN', mr: 'mr-IN', en: 'en-IN' };

// ── Context ────────────────────────────────────────────────────────────────
const VaniContext = createContext(null);
export const useVani = () => useContext(VaniContext);

// ── Provider ───────────────────────────────────────────────────────────────
export const VaniProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  // Settings
  const [isVoiceModeEnabled, setIsVoiceModeEnabled] = useState(
    () => localStorage.getItem('ah-voice-mode') === 'true'
  );

  // Simple mode state
  const [isListening, setIsListening]   = useState(false);
  const [isSpeaking, setIsSpeaking]     = useState(false);
  const [transcript, setTranscript]     = useState('');

  // LiveKit session state
  const [isLiveKitActive, setIsLiveKitActive] = useState(false);
  const [sessionIntent, setSessionIntent]     = useState(null);

  // Mic consent state (separate from micConsentRef for re-render)
  const micConsentRef = useRef(false);   // true once getUserMedia succeeded
  const [micDenied, setMicDenied] = useState(false);

  // Read autoListen / wakeWord prefs from the same localStorage key SettingsContext writes
  const getVaniPrefs = () => {
    try {
      const saved = localStorage.getItem('agriheal-settings');
      if (saved) {
        const { voiceAssistant: va } = JSON.parse(saved);
        return {
          autoListen:      va?.autoListen      ?? false,
          wakeWordEnabled: va?.wakeWord        ?? true,
        };
      }
    } catch { /* ignore */ }
    return { autoListen: false, wakeWordEnabled: true };
  };

  // ── Speech Recognition (simple mode) ─────────────────────────────────
  const recognition = useMemo(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.continuous    = false;
    rec.interimResults = true;
    return rec;
  }, []);

  useEffect(() => {
    if (recognition) {
      recognition.lang = LANG_BCP[i18n.language] ?? 'en-IN';
    }
  }, [recognition, i18n.language]);

  // Read voice speed/volume from SettingsContext localStorage (VaniProvider sits
  // outside SettingsProvider so we cannot call useSettings() directly).
  const getVoicePrefs = () => {
    try {
      const saved = localStorage.getItem('agriheal-settings');
      if (saved) {
        const { voiceAssistant: va } = JSON.parse(saved);
        return {
          rate:   va?.voiceSpeed  ?? 1.0,
          volume: (va?.voiceVolume ?? 80) / 100,
        };
      }
    } catch { /* ignore */ }
    return { rate: 1.0, volume: 0.8 };
  };

  // ── TTS (simple mode) ─────────────────────────────────────────────────
  const speak = useCallback((text) => {
    if (!window.speechSynthesis || !isVoiceModeEnabled) return;
    window.speechSynthesis.cancel();
    const { rate, volume } = getVoicePrefs();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang   = LANG_BCP[i18n.language] ?? 'en-IN';
    utter.rate   = rate;
    utter.volume = volume;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend   = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  }, [i18n.language, isVoiceModeEnabled]);


  // ── Voice command processor (routes through server proxy) ─────────────
  const processVoiceCommand = async (text) => {
    const lang = i18n.language;
    // ⚠️  Routes here MUST match the actual React Router routes in App.jsx:
    //   /home  /crops  /market  /records  /community  /experts
    //   /news  /profile  /settings  /analysis  /schemes  /help
    // Note: weather is embedded in FarmCare (/crops/weather), not a top-level route.
    const prompt = `
You are Vani, a concise voice assistant for AgriHeal, an agriculture app for rural Indian farmers.
User said: "${text}"
Respond in the SAME language as the user (currently: ${lang}).
Keep reply short and conversational (1-2 sentences max). No markdown.
Available navigation routes (use EXACTLY these paths):
  /home         - dashboard/home page
  /crops        - crop management
  /market       - market prices
  /records      - farm records (livestock, equipment)
  /community    - community feed
  /experts      - expert consultations
  /news         - news center
  /profile      - farmer profile
  /settings     - app settings
  /analysis     - plant disease image scanner
  /schemes      - government schemes
  /help         - help and support
Return ONLY a JSON object, no markdown fences:
{"speech": "...", "action": "NAVIGATE" | "NONE", "target": "/exact-route-or-null"}
`.trim();

    try {
      const raw = await generateText(prompt);
      const cleaned = raw.trim().replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleaned);
      // Safety: reject any target that isn't a known valid route
      const VALID_ROUTES = new Set([
        '/home', '/crops', '/market', '/records', '/community',
        '/experts', '/news', '/profile', '/settings', '/analysis',
        '/schemes', '/help'
      ]);
      if (parsed.action === 'NAVIGATE' && !VALID_ROUTES.has(parsed.target)) {
        parsed.action = 'NONE';
        parsed.target = null;
      }
      return parsed;
    } catch {
      // Offline / proxy unavailable — keyword fallback (corrected routes)
      const t = text.toLowerCase();
      if (t.includes('market') || t.includes('price') || t.includes('मंडी') || t.includes('ధర'))
        return { speech: 'Opening market prices.', action: 'NAVIGATE', target: '/market' };
      if (t.includes('crop') || t.includes('plant') || t.includes('పంట') || t.includes('फसल'))
        return { speech: 'Here are your crops.', action: 'NAVIGATE', target: '/crops' };
      if (t.includes('weather') || t.includes('rain') || t.includes('వాతావరణం') || t.includes('मौसम'))
        return { speech: 'Showing farm weather info.', action: 'NAVIGATE', target: '/crops' };
      if (t.includes('scan') || t.includes('disease') || t.includes('camera') || t.includes('వ్యాధి'))
        return { speech: 'Opening plant scanner.', action: 'NAVIGATE', target: '/analysis' };
      if (t.includes('record') || t.includes('livestock') || t.includes('equipment'))
        return { speech: 'Opening farm records.', action: 'NAVIGATE', target: '/records' };
      if (t.includes('news') || t.includes('alert'))
        return { speech: 'Opening news center.', action: 'NAVIGATE', target: '/news' };
      return {
        speech: lang === 'hi' ? 'मुझे समझ नहीं आया।'
               : lang === 'te' ? 'నాకు అర్థం కాలేదు.'
               : "I didn't catch that. Try saying 'open crops' or 'scan disease'.",
        action: 'NONE', target: null
      };
    }
  };

  // ── Handle incoming transcript ─────────────────────────────────────────
  const handleVoiceInput = useCallback(async (text) => {
    setTranscript(text);
    const response = await processVoiceCommand(text);
    if (response.speech) setTimeout(() => speak(response.speech), 100);
    if (response.action === 'NAVIGATE' && response.target) navigate(response.target);
  }, [navigate, speak, i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Wire recognition events ────────────────────────────────────────────
  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      let current = '';
      let final = false;
      for (let i = 0; i < event.results.length; i++) {
        current += event.results[i][0].transcript;
        if (event.results[i].isFinal) final = true;
      }
      setTranscript(current);
      if (final) handleVoiceInput(current);
    };

    recognition.onstart  = () => setIsListening(true);
    recognition.onend    = () => setIsListening(false);
    recognition.onerror  = (e) => {
      console.error('[Vani] Speech error:', e.error);
      setIsListening(false);
      if (e.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone permissions to use Vani.');
      }
    };
  }, [recognition, handleVoiceInput]);

  // ── Public API ─────────────────────────────────────────────────────────

  const toggleVoiceMode = (enabled) => {
    setIsVoiceModeEnabled(enabled);
    localStorage.setItem('ah-voice-mode', String(enabled));
    if (!enabled) {
      stopListening();
      setIsLiveKitActive(false);
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  };

  // ── Explicit mic permission request ────────────────────────────────────
  // Must be called inside a user-gesture handler (button click).
  // Returns true if permission was granted, false if denied.
  const requestMicPermission = async () => {
    if (micConsentRef.current) return true; // already granted this session
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Immediately stop the stream — we only needed the permission grant
      stream.getTracks().forEach(t => t.stop());
      micConsentRef.current = true;
      setMicDenied(false);
      // Unlock speech synthesis on first user gesture (Safari/iOS)
      window.speechSynthesis?.speak(new SpeechSynthesisUtterance(''));
      return true;
    } catch (err) {
      console.warn('[Vani] Mic permission denied:', err);
      setMicDenied(true);
      return false;
    }
  };

  const startListening = async () => {
    if (!isVoiceModeEnabled) return;
    if (!recognition) {
      alert('Voice recognition is not supported in this browser. Please use Google Chrome.');
      return;
    }
    // Always request explicit permission before starting recognition
    const granted = await requestMicPermission();
    if (!granted) {
      speak('Microphone access was denied. Please allow microphone in your browser settings.');
      return;
    }
    setTranscript('');
    try { recognition.start(); } catch { /* already started */ }
  };

  const stopListening = () => {
    try { recognition?.stop(); } catch { /* already stopped */ }
  };

  /**
   * startVaniSession — opens the full LiveKit voice session.
   * Requests mic permission on the user gesture before opening LiveKit.
   * @param {Object} options
   * @param {string} [options.intent] - e.g. 'add_crop', 'dashboard_help', 'general'
   */
  const startVaniSession = async ({ intent = 'general' } = {}) => {
    if (!isVoiceModeEnabled) {
      // Inform the user rather than silently failing
      speak('Please enable the voice assistant in Settings first.');
      return;
    }
    const granted = await requestMicPermission();
    if (!granted) {
      speak('Microphone access was denied. Please allow microphone in your browser settings to use Vani.');
      return;
    }
    setSessionIntent(intent);
    setIsLiveKitActive(true);
  };

  // NOTE: Auto-listen via setTimeout was removed because browsers require an
  // explicit user gesture (tap/click) before granting microphone access.
  // Instead: components that support auto-listen should render a
  // 'Tap to speak' button when isVoiceModeEnabled && autoListenPref is true,
  // and call startListening() in that button's onClick handler.
  // The autoListenPref is readable via getVaniPrefs().autoListen.

  const greet = (name, weather) => {
    if (!isVoiceModeEnabled) return;
    const msg = i18n.language === 'hi' ? `नमस्ते ${name}, आज मौसम है ${weather}`
              : i18n.language === 'te' ? `నమస్తే ${name}, ఈ రోజు వాతావరణం ${weather}`
              : `Hello ${name}, today's weather is ${weather}.`;
    speak(msg);
  };

  return (
    <VaniContext.Provider value={{
      // Settings
      isVoiceModeEnabled,
      toggleVoiceMode,
      micDenied,
      // Simple mode
      isListening,
      isSpeaking,
      transcript,
      startListening,
      stopListening,
      speak,
      greet,
      requestMicPermission,
      // LiveKit session
      isLiveKitActive,
      setIsLiveKitActive,
      sessionIntent,
      startVaniSession,
    }}>
      {children}
    </VaniContext.Provider>
  );
};

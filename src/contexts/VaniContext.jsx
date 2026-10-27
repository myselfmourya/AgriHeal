/**
 * VaniContext — Siri-like Voice Assistant
 *
 * Two-phase recognition:
 *   Phase 1 (IDLE)      — background listening for "hey vani"
 *   Phase 2 (ACTIVATED) — play beep, collect command, detect silence → process
 *
 * "Change command mid-way" works because we only process on silence (500ms)
 * or isFinal — whichever comes first. User can speak, pause, re-speak;
 * the LAST thing said before 500ms silence is processed.
 *
 * Noise-robustness improvements:
 *   - maxAlternatives=3: checks all 3 hypotheses, not just the top guess.
 *     In noisy / low-voice conditions the correct word often appears in alt #2 or #3.
 *   - Expanded WAKE[] with 25+ real-world phonetic mis-recognitions.
 *   - Minimum command length guard (≤2 chars → noise burst, skip).
 *   - Silence timer reduced from 700ms → 500ms (eliminates perceived lag).
 *   - Restart gap fixed: 0ms → 50ms prevents Chrome InvalidStateError on slow devices.
 *   - Full NAV_MAP coverage for every app route + crop sub-pages + multi-language.
 */

import React, {
  createContext, useContext, useState, useEffect,
  useCallback, useMemo, useRef
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { generateVaniResponse } from '../services/aiService';
import { getGlobalContext } from '../services/contextService';
import { supabase } from '../lib/supabase';

export const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'te', label: 'Telugu' },
  { code: 'ta', label: 'Tamil' },
  { code: 'mr', label: 'Marathi' },
];

const LANG_BCP = { hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN', mr: 'mr-IN', en: 'en-IN' };

// ── Wake word variants ──────────────────────────────────────────────────────
// Covers real-world phonetic mis-recognitions of "Hey Vani" in noisy,
// accented, or low-volume speech across all supported languages.
const WAKE = [
  // Standard
  'hey vani', 'ok vani', 'okay vani',
  // Common mis-recognitions (English ASR noise)
  'hey bani', 'hey wani', 'ey vani', 'hay vani',
  'hey bonnie', 'hey bunny', 'hey nani', 'hey fanny',
  'hey barni', 'hey boney', 'hey money', 'hey honey',
  'hey banee', 'hey vanee', 'hey vonnie', 'a vani',
  'vani', 'wani', 'bani',
  // Hindi / Hinglish variants
  'हे वाणी', 'हे वाणि', 'ओके वाणी', 'ओके वाणि',
  // Telugu
  'హే వాణి', 'ఓకే వాణి',
  // Tamil
  'ஹே வாணி', 'வாணி',
  // Marathi
  'हे वाणी',
];

// ── Navigation map ─────────────────────────────────────────────────────────
// Every app route is covered. Keywords span English + Hindi + Telugu + Tamil + Marathi.
// Sorted most-specific first to avoid shadowing.
const NAV_MAP = [
  // ── Crop sub-pages ───────────────────────────────────────────────────────
  { route: '/crops',          keys: ['crop','crops','plant','farming','fasal','फसल','పంట','பயிர்','पीक'] },
  { route: '/assistant',      keys: ['scan','disease','scanner','agrishield','leaf scan','crop scan','crop photo','disease check','image analysis','photo analysis','ai analysis','రోగ స్కాన్','పంట స్కాన్','நோய்','بیماری','agri shield', 'chat','assistant','ai chat','ai help','ask ai','smart chat','vani chat','सहायक','సహాయకుడు','உதவியாளர்','सहाय्यक'] },
  { route: '/toxi',           keys: ['toxic','toxicity','poison','chemical','toxi','toxi guard','toxiguard','pesticide check','chemical risk','pesticide risk','కెమికల్','విషం','நச்சு','किटकनाशक'] },
  { route: '/nutri',          keys: ['nutrition','nutrient','nutri','nutri match','crop nutrition','soil nutrition','పోషణ','ఆహారం','ஊட்டச்சத்து','पोषण','पोषक'] },
  { route: '/therma',         keys: ['thermal','heat','therma','therma plan','heat plan','heat risk','thermal plan','temperature risk','ఉష్ణ','வெப்பம்','गर्मी','उष्णता'] },
  { route: '/water',          keys: ['water','irrigation','sat water','water safety','water monitor','water check','water quality','पानी','సేద్యం','నీరు','தண்ணீர்','सिंचाई'] },

  // ── Main pages ───────────────────────────────────────────────────────────
  { route: '/home',           keys: ['home','dashboard','main','start','होम','ghar','హోమ్','முகப்பு','मुख्यपृष्ठ'] },
  { route: '/farm-care',      keys: ['farm care','farmcare','satellite','farm map','my farm','खेत','వ్యవసాయం','ఫార్మ్','பண்ணை','शेत'] },
  { route: '/livestock',      keys: ['livestock','animal','cow','buffalo','goat','sheep','cattle','poultry','hen','bull','bullock','पशु','मवेशी','పశువులు','கால்நடை','जनावरे'] },
  { route: '/market',         keys: ['market','price','mandi','sell','sell crop','crop price','market rate','मंडी','बाजार','ధర','మార్కెట్','விலை','बाजार'] },
  { route: '/fertilisers',    keys: ['fertilizer','fertiliser','manure','khad','organic','खाद','उर्वरक','ఎరువు','உரம்','खत'] },
  { route: '/schemes',        keys: ['scheme','government','yojana','योजना','subsidy','pm kisan','pm fasal','kisan scheme','subsidy check','పథకాలు','திட்டங்கள்','सरकारी योजना','अनुदान'] },
  { route: '/records',        keys: ['record','document','locker','farm locker','file','my records','రికార్డ్','పత్రాలు','பதிவு','कागजपत्र','दस्तावेज'] },
  { route: '/news',           keys: ['news','alert','agri news','farm news','समाचार','వార్తలు','செய்தி','बातम्या'] },
  { route: '/settings',       keys: ['setting','settings','configuration','preference','सेटिंग','సెట్టింగ్','அமைப்புகள்','सेटिंग्ज'] },
  { route: '/community',      keys: ['community','forum','social','farmer forum','kisan samaj','discussion','समुदाय','సమాజం','சமூகம்','शेतकरी मंच'] },
  { route: '/profile',        keys: ['profile','account','my profile','my account','प्रोफाइल','ప్రొఫైల్','சுயவிவரம்','प्रोफाइल'] },
  { route: '/notifications',  keys: ['notification','notify','alerts','सूचना','నోటిఫికేషన్','அறிவிப்பு','सूचना'] },
  { route: '/store',          keys: ['store','shop','tool','equipment','buy tools','agri store','दुकान','కొనుగోలు','దుకాణం','கடை','शेत साहित्य'] },
  { route: '/help',           keys: ['help','support','guide','faq','contact support','सहायता','సహాయం','உதவி','मदत'] },
];

// ── Helpers ────────────────────────────────────────────────────────────────
const conditionLabel = (c = '') => {
  const s = c.toLowerCase();
  if (s.includes('clear') || s.includes('sunny')) return 'sunny ☀️';
  if (s.includes('cloud'))  return 'cloudy ⛅';
  if (s.includes('rain') || s.includes('drizzle')) return 'rainy 🌧️';
  if (s.includes('storm') || s.includes('thunder')) return 'stormy ⛈️';
  if (s.includes('snow'))   return 'snowy ❄️';
  if (s.includes('fog') || s.includes('mist')) return 'foggy 🌫️';
  return c;
};

// Beep to signal Vani is listening (pure Web Audio, no file needed)
const playActivationBeep = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  } catch { /* AudioContext not available */ }
};

// ── Multi-alternative text scanner ────────────────────────────────────────
// Scans up to maxAlternatives=3 hypotheses from a recognition result entry.
// Returns the FIRST hypothesis text that matches any of the target strings,
// or falls back to the top hypothesis. This is the key noise-robustness trick:
// in noisy conditions the correct word is often alt #2 or #3.
const bestMatch = (result, targets) => {
  for (let a = 0; a < result.length; a++) {
    const txt = result[a].transcript.toLowerCase();
    if (targets.some(t => txt.includes(t))) return txt;
  }
  return result[0].transcript.toLowerCase(); // top guess fallback
};

// ── Context ────────────────────────────────────────────────────────────────
const VaniContext = createContext(null);
export const useVani = () => useContext(VaniContext);

// ── Provider ───────────────────────────────────────────────────────────────
export const VaniProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const navigate  = useNavigate();

  const [isVoiceModeEnabled, setIsVoiceModeEnabled] = useState(
    () => localStorage.getItem('ah-voice-mode') === 'true'
  );
  const [isListening,  setIsListening]  = useState(false);
  const [isActivated,  setIsActivated]  = useState(false); // "hey vani" heard
  const [isSpeaking,   setIsSpeaking]   = useState(false);
  const [transcript,   setTranscript]   = useState('');
  const [statusText,   setStatusText]   = useState('');
  const [micDenied,    setMicDenied]    = useState(false);

  // LiveKit compat
  const [isLiveKitActive, setIsLiveKitActive] = useState(false);
  const [sessionIntent,   setSessionIntent]   = useState(null);

  // Internal refs
  const micGrantedRef    = useRef(false);
  const shouldRunRef     = useRef(false);  // controls the restart loop
  const activatedRef     = useRef(false);  // mirrors isActivated for use inside callbacks
  const silenceTimerRef  = useRef(null);
  const commandBufRef    = useRef('');     // accumulates command text after wake word
  const processingRef    = useRef(false);
  const weatherCacheRef  = useRef(null);
  const weatherTimeRef   = useRef(0);
  const recRef           = useRef(null);   // current recognition instance
  const audioRef         = useRef(null);
  const isSpeakingRef    = useRef(false);
  const currentSpeechIdRef = useRef(0);

  // ── Prefs ────────────────────────────────────────────────────────────────
  const getVoicePrefs = () => {
    try {
      const s = localStorage.getItem('agriheal-settings');
      if (s) {
        const { voiceAssistant: va } = JSON.parse(s);
        return { rate: va?.voiceSpeed ?? 1.1, volume: (va?.voiceVolume ?? 85) / 100, lang: va?.vaniLanguage || 'auto' };
      }
    } catch { /* ignore */ }
    return { rate: 1.1, volume: 0.85, lang: 'auto' };
  };

  // ── TTS ──────────────────────────────────────────────────────────────────
  // Browser speechSynthesis fallback — used when the ElevenLabs proxy is
  // unreachable (offline / slow rural network) or returns an error.
  const browserSpeak = useCallback((text, forceLang) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    setIsSpeaking(true);
    isSpeakingRef.current = true;

    const { rate, volume, lang } = getVoicePrefs();
    const utter = new SpeechSynthesisUtterance(text);

    let targetLang = lang;
    if (lang === 'auto') {
      targetLang = forceLang || i18n.language || 'en';
    }

    const voices = window.speechSynthesis.getVoices();
    let voice = voices.find(v => v.lang.startsWith(targetLang) && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('veena') || v.name.toLowerCase().includes('aditi')));
    if (!voice) voice = voices.find(v => v.lang.startsWith(targetLang));
    if (!voice && targetLang === 'hi') voice = voices.find(v => v.lang.startsWith('hi-IN'));
    if (!voice && targetLang === 'te') voice = voices.find(v => v.lang.startsWith('te-IN'));
    if (!voice && targetLang === 'ta') voice = voices.find(v => v.lang.startsWith('ta-IN'));
    if (!voice && targetLang === 'mr') voice = voices.find(v => v.lang.startsWith('mr-IN'));

    if (voice) utter.voice = voice;
    utter.rate = rate;
    utter.volume = volume;

    utter.onstart = () => {
      setIsSpeaking(true);
      isSpeakingRef.current = true;
    };

    utter.onend = () => {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
    };

    utter.onerror = () => {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
    };

    window._vani_tts_utterance = utter; // Prevent GC bug
    window.speechSynthesis.speak(utter);

    setTimeout(() => {
      if (isSpeakingRef.current) {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
      }
    }, 10000);
  }, [i18n.language, getVoicePrefs]);

  // Human ElevenLabs voice via the server-side tts-proxy Edge Function.
  // Falls back to the browser's built-in speechSynthesis on any failure.
  const speak = useCallback((text, forceLang) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    window.speechSynthesis?.cancel();

    setIsSpeaking(true);
    isSpeakingRef.current = true;

    const speechId = ++currentSpeechIdRef.current;
    const { volume } = getVoicePrefs();

    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('No session');

        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tts-proxy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) throw new Error(`tts-proxy ${res.status}`);
        if (speechId !== currentSpeechIdRef.current) return; // superseded by a newer speak() call

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.volume = volume;
        audioRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
          isSpeakingRef.current = false;
          URL.revokeObjectURL(url);
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          isSpeakingRef.current = false;
          URL.revokeObjectURL(url);
        };

        await audio.play();
      } catch (e) {
        if (speechId !== currentSpeechIdRef.current) return;
        browserSpeak(text, forceLang);
      }
    })();

    setTimeout(() => {
      if (isSpeakingRef.current && speechId === currentSpeechIdRef.current) {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
      }
    }, 15000);
  }, [getVoicePrefs, browserSpeak]);

  // ── Weather ──────────────────────────────────────────────────────────────
  const fetchWeatherByLocation = useCallback(async () => {
    const now = Date.now();
    if (weatherCacheRef.current && now - weatherTimeRef.current < 300000) return weatherCacheRef.current;
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) { reject(new Error('no geo')); return; }
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const key  = import.meta.env.VITE_WEATHER_API_KEY;
          const res  = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
          const data = await res.json();
          const w = { temp: Math.round(data.main.temp), condition: data.weather[0].main, city: data.name, humidity: data.main.humidity };
          weatherCacheRef.current = w;
          weatherTimeRef.current  = now;
          resolve(w);
        } catch (e) { reject(e); }
      }, reject, { timeout: 8000, maximumAge: 300000, enableHighAccuracy: false });
    });
  }, []);

  const processCommand = useCallback(async (text) => {
    const t = text.toLowerCase().trim();
    if (!t) return { speech: "Yes? I am listening.", action: 'NONE', target: null };

    try {
      setStatusText('Processing command...');
      const ctx = getGlobalContext();
      
      let weather = weatherCacheRef.current;
      if (!weather || (Date.now() - weatherTimeRef.current > 300000)) {
         // Fire and forget; don't block the AI response waiting for location/weather
         fetchWeatherByLocation().catch(() => {});
      }

      // Read the user's preferred language from settings
      let targetLang = 'en-IN';
      try {
        const { lang } = getVoicePrefs();
        targetLang = lang !== 'auto' ? lang : (i18n.language || 'en');
        targetLang = targetLang === 'hi' ? 'Hindi' : (targetLang === 'te' ? 'Telugu' : (targetLang === 'ta' ? 'Tamil' : 'English'));
      } catch (e) {}

      // FAST PATH: local intent matching for instant UI navigation without AI lag
      const navTokens = ['open ', 'go to ', 'show ', 'navigate ', 'take me to '];
      let isNav = navTokens.some(tok => t.includes(tok));
      
      // If it doesn't have an action verb, check if the ENTIRE command is just a route name
      let directMatch = false;
      if (!isNav) {
         for (const nav of NAV_MAP) {
            if (nav.keys.includes(t)) {
                isNav = true;
                directMatch = true;
                break;
            }
         }
      }

      if (isNav) {
        for (const nav of NAV_MAP) {
          if (nav.keys.some(k => t.includes(k) || (directMatch && k === t))) {
             return {
                speech: `Opening ${nav.keys[0]}.`,
                action: 'NAVIGATE',
                target: nav.route
             };
          }
        }
      }

      // Pass the query directly to Mistral for 100% flexible AI-driven control!
      const aiResponse = await generateVaniResponse(t, { farmer: ctx, weather }, targetLang);
      
      return { 
        speech: aiResponse.text, 
        action: aiResponse.action?.action || 'NONE', 
        target: aiResponse.action?.payload?.target || null 
      };
    } catch (e) {
      console.error("AI engine processing failed:", e);
      return { speech: "My network connection is a bit slow right now. Could you repeat that?", action: 'NONE', target: null };
    }
  }, [fetchWeatherByLocation]);

  // ── Handle command (after silence / final result) ─────────────────────────
  const handleCommand = useCallback(async (cmd) => {
    const clean = cmd.trim();
    if (!clean || processingRef.current) return;
    processingRef.current = true;

    // Reset activated state — go back to wake-word phase
    activatedRef.current = false;
    setIsActivated(false);
    commandBufRef.current = '';

    setStatusText('Processing...');
    setTranscript('');

    try {
      const res = await processCommand(clean);
      setStatusText(res.speech);
      speak(res.speech);
      if (res.action === 'NAVIGATE' && res.target) setTimeout(() => navigate(res.target), 100);
    } catch {
      speak('Sorry, I had an error.');
    } finally {
      processingRef.current = false;
      setTimeout(() => setStatusText(''), 5000);
    }
  }, [processCommand, speak, navigate]);

  // ── Mic permission ────────────────────────────────────────────────────────
  const requestMicPermission = async () => {
    if (micGrantedRef.current) return true;
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      s.getTracks().forEach(t => t.stop());
      micGrantedRef.current = true;
      setMicDenied(false);
      if (window.speechSynthesis) window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
      return true;
    } catch {
      setMicDenied(true);
      return false;
    }
  };

  // ── Core recognition loop ─────────────────────────────────────────────────
  // One-shot sessions (continuous=false) restart instantly after each result.
  // This is the most reliable pattern for Chrome's Web Speech API.
  //
  // NOISE ROBUSTNESS: maxAlternatives=3 means the browser returns up to 3
  // guesses per word. We scan all of them for wake words and commands, so
  // Vani catches speech that the top guess missed. Zero extra latency.
  const startLoop = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR || !shouldRunRef.current) return;

    const rec = new SR();
    const { lang } = getVoicePrefs();
    rec.lang            = (lang && lang !== 'auto') ? (LANG_BCP[lang] ?? 'en-IN') : (LANG_BCP[i18n.language] ?? 'en-IN');
    rec.continuous      = false;   // one-shot — most reliable
    rec.interimResults  = true;    // needed for silence detection & live display
    rec.maxAlternatives = 3;       // ★ check top-3 hypotheses for noise robustness
    recRef.current = rec;

    rec.onresult = (e) => {
      // ★ If Vani is currently speaking, ignore incoming audio (prevents self-trigger loop)
      if (isSpeakingRef.current) return;

      let interim = '';
      let finalText = '';

      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          // ★ Use bestMatch to find the hypothesis that matches a known keyword
          finalText += bestMatch(e.results[i], [
            ...WAKE,
            ...NAV_MAP.flatMap(n => n.keys),
            'weather','mausam','temperature','help','hello','hi','namaste',
          ]);
        } else {
          // Interim: use top guess (bestMatch not needed for live display)
          interim += e.results[i][0].transcript;
        }
      }

      // ★ Noise burst guard: ignore if heard text is ≤2 characters
      const raw = (finalText || interim);
      if (raw.trim().length <= 2) return;

      const heard = raw.toLowerCase();

      // ── Phase 1: Check for wake word ──────────────────────────────────
      if (!activatedRef.current) {
        // ★ For interim, also scan all alternatives for wake word
        let woke = WAKE.some(w => heard.includes(w));

        // If not matched on top guess, try other alternatives for wake word
        if (!woke && e.results.length > 0) {
          for (let i = e.resultIndex; i < e.results.length; i++) {
            for (let a = 0; a < e.results[i].length; a++) {
              const alt = e.results[i][a].transcript.toLowerCase();
              if (WAKE.some(w => alt.includes(w))) {
                woke = true;
                break;
              }
            }
            if (woke) break;
          }
        }

        if (woke) {
          activatedRef.current = true;
          setIsActivated(true);
          playActivationBeep();
          setStatusText('🎙️ Listening...');

          // Extract command from same utterance (e.g. "Hey Vani open crops")
          let cmd = heard;
          WAKE.forEach(w => { cmd = cmd.replace(w, ''); });
          cmd = cmd.trim();
          commandBufRef.current = cmd;
          if (cmd) setTranscript(cmd);
        }
        // Not activated and no wake word → ignore
        return;
      }

      // ── Phase 2: Collect command after wake word ──────────────────────
      // Strip any re-occurrence of wake word mid-command
      let cmdPart = heard.replace(/\b(hey|ok|okay)?\s*(vani|bani|wani)\b/gi, '').trim();
      if (cmdPart) {
        commandBufRef.current = cmdPart;
        setTranscript(cmdPart);
      }

      // Reset silence timer on ANY speech. Use a long 1500ms timeout so we don't cut off
      // users in noisy environments. We will rely on rec.onend for "instant" execution.
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        const cmd = commandBufRef.current;
        if (cmd) handleCommand(cmd);
      }, 1500);
    };

    rec.onend = () => {
      setIsListening(false);
      // If activated but no command came (e.g. user just said "hey vani"), prompt them
      if (activatedRef.current && !processingRef.current) {
        const hasCmd = commandBufRef.current.trim();
        if (!hasCmd) {
          speak("Yes? What would you like to do?");
          activatedRef.current = false;
          setIsActivated(false);
          commandBufRef.current = '';
        } else {
          // The browser detected silence and ended recognition. Execute INSTANTLY!
          clearTimeout(silenceTimerRef.current);
          handleCommand(hasCmd);
        }
      }
      // ★ 50ms gap (was 0ms) — prevents Chrome InvalidStateError on slow devices
      if (shouldRunRef.current) {
        setTimeout(startLoop, 50);
      }
    };

    rec.onerror = (e) => {
      setIsListening(false);
      if (e.error === 'not-allowed') {
        setMicDenied(true);
        shouldRunRef.current = false;
        return;
      }
      // no-speech / aborted / network → restart
      if (shouldRunRef.current) setTimeout(startLoop, 100);
    };

    rec.onstart = () => setIsListening(true);

    try {
      rec.start();
    } catch {
      if (shouldRunRef.current) setTimeout(startLoop, 500);
    }
  }, [i18n.language, handleCommand, speak]);

  // ── Start / Stop ──────────────────────────────────────────────────────────
  const startListening = useCallback(async () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert('Voice recognition requires Chrome or Edge browser.');
      return;
    }
    const granted = await requestMicPermission();
    if (!granted) { speak('Microphone access was denied. Please allow it in browser settings.'); return; }
    shouldRunRef.current = true;
    startLoop();
  }, [startLoop, speak]);

  const stopListening = useCallback(() => {
    shouldRunRef.current = false;
    activatedRef.current = false;
    commandBufRef.current = '';
    clearTimeout(silenceTimerRef.current);
    try { recRef.current?.stop(); } catch { /* ignore */ }
    setIsListening(false);
    setIsActivated(false);
    setTranscript('');
    setStatusText('');
    isSpeakingRef.current = false; // Force reset
    setIsSpeaking(false);
  }, []);

  // ── Toggle voice mode ─────────────────────────────────────────────────────
  const toggleVoiceMode = useCallback(async (enabled) => {
    setIsVoiceModeEnabled(enabled);
    localStorage.setItem('ah-voice-mode', String(enabled));

    if (enabled) {
      const granted = await requestMicPermission();
      if (granted) {
        shouldRunRef.current = true;
        startLoop();
      } else {
        setIsVoiceModeEnabled(false);
      }
    } else {
      stopListening();
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      setIsLiveKitActive(false);
    }
  }, [i18n.language, startListening, stopListening]);

  // ── Auto-start on app load if Vani was already on ────────────────────────
  useEffect(() => {
    if (isVoiceModeEnabled) {
      // Delay slightly so page fully loads first
      const t = setTimeout(() => startListening(), 1200);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only on mount

  // ── Greet helper ──────────────────────────────────────────────────────────
  const greet = useCallback((name, weather) => {
    if (!isVoiceModeEnabled) return;
    const msg = `Hello ${name}! ${weather ? `Today's weather is ${weather}.` : ''} Say Hey Vani anytime.`;
    speak(msg);
  }, [isVoiceModeEnabled, speak]);

  // ── startVaniSession — launches the full LiveKit voice conversation ───────
  const startVaniSession = useCallback(async ({ intent = 'general' } = {}) => {
    const granted = await requestMicPermission();
    if (!granted) {
      speak('Microphone access was denied. Please allow microphone in your browser settings to use Vani.');
      return;
    }
    setSessionIntent(intent);
    setIsLiveKitActive(true);
  }, [speak]);

  return (
    <VaniContext.Provider value={{
      isVoiceModeEnabled, toggleVoiceMode,
      micDenied,
      isListening, isActivated, isSpeaking,
      transcript, statusText,
      startListening, stopListening,
      speak, greet,
      requestMicPermission,
      fetchWeatherByLocation,
      isLiveKitActive, setIsLiveKitActive,
      sessionIntent, startVaniSession,
      // compat
      overlay: isLiveKitActive,
      closeVani: () => setIsLiveKitActive(false),
    }}>
      {children}
    </VaniContext.Provider>
  );
};

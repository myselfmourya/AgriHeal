import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Radio } from 'lucide-react';

export default function VaniVoiceBar({ selectedDialect, onExecuteVoiceCommand, lastSpokenText }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Spoken Dialect Greetings
  const dialectGreetings = {
    'hi-IN': 'नमस्ते किसान भाई, वाणी AI तैयार है। आप क्या जांचना चाहते हैं?',
    'te-IN': 'నమస్కారం రైతు సోదరా, వాణి AI సిద్ధంగా ఉంది. ఏం పరిశీలించాలి?',
    'ta-IN': 'வணக்கம் விவசாயி, வாணி AI தயார். என்ன பார்க்க வேண்டும்?',
    'pa-IN': 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ, ਵਾਣੀ AI ਤਿਆਰ ਹੈ।',
    'mr-IN': 'नमस्कार बळीराजा, वाणी AI सज्ज आहे.',
    'kn-IN': 'ನಮಸ್ಕಾರ ರೈತ ಬಂಧುವೇ, ವಾಣಿ AI ಸಿದ್ಧವಾಗಿದೆ.',
    'en-IN': 'Greetings farmer friend! Vani Voice AI is active. How can I assist you?'
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedDialect;
    utterance.rate = 0.95;
    
    // Try to find a female voice
    const voices = window.speechSynthesis.getVoices();
    const isFemale = (name) => {
      const n = name.toLowerCase();
      return n.includes('female') || n.includes('woman') || ['samantha', 'zira', 'karen', 'victoria', 'tessa'].some(f => n.includes(f));
    };
    let femaleVoice = voices.find(v => v.lang === utterance.lang && isFemale(v.name));
    if (!femaleVoice) femaleVoice = voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]) && isFemale(v.name));
    if (!femaleVoice) femaleVoice = voices.find(v => v.lang.startsWith('en') && isFemale(v.name));
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (lastSpokenText) {
      speakText(lastSpokenText);
    }
  }, [lastSpokenText]);

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Web Speech API recognition is not supported in this browser window, but you can click the quick voice command chips!");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedDialect;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('Listening in ' + selectedDialect + '...');
      };

      recognition.onresult = (event) => {
        const text = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setTranscript(text);
        if (event.results[0].isFinal) {
          handleRecognizedText(text);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setTranscript('Listening ended. Click microphone to try again.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleRecognizedText = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('scan') || lower.includes('disease') || lower.includes('crop') || lower.includes('बीमारी') || lower.includes('పంట')) {
      onExecuteVoiceCommand('crop-scan');
    } else if (lower.includes('pesticide') || lower.includes('toxic') || lower.includes('poison') || lower.includes('दवा') || lower.includes('మందు')) {
      onExecuteVoiceCommand('toxi-guard');
    } else if (lower.includes('health') || lower.includes('nutri') || lower.includes('diet') || lower.includes('पोषण') || lower.includes('ఆరోగ్యం')) {
      onExecuteVoiceCommand('nutri-match');
    } else if (lower.includes('heat') || lower.includes('water') || lower.includes('break') || lower.includes('गर्मी') || lower.includes('ఎండ')) {
      onExecuteVoiceCommand('therma-plan');
    } else if (lower.includes('market') || lower.includes('cert') || lower.includes('price') || lower.includes('बीमा') || lower.includes('భీమా')) {
      onExecuteVoiceCommand('heal-marketplace');
    }
  };

  const triggerPresetCommand = (commandKey, label, speechOutput) => {
    setTranscript(`Voice Command: "${label}"`);
    speakText(speechOutput);
    onExecuteVoiceCommand(commandKey);
  };

  return (
    <div className="vani-voice-bar">
      <div className="vani-info">
        <button 
          className={`vani-mic-btn ${isListening ? 'listening' : ''}`}
          onClick={toggleListening}
          title="Click to talk to Vani AI"
        >
          {isListening ? <MicOff size={26} /> : <Mic size={26} />}
        </button>

        <div className="vani-status-text">
          <div className="vani-status-title">
            <Radio size={16} color="#34d399" /> Vani Voice AI Assistant
            {isSpeaking && <Volume2 size={16} color="#f59e0b" className="animate-pulse" />}
          </div>
          <div className="vani-status-sub">
            {transcript || dialectGreetings[selectedDialect] || dialectGreetings['en-IN']}
          </div>
        </div>

        <div className="vani-waveform-container">
          <div className={`wave-bar ${isListening || isSpeaking ? 'active' : ''}`} style={{ animationDelay: '0s' }}></div>
          <div className={`wave-bar ${isListening || isSpeaking ? 'active' : ''}`} style={{ animationDelay: '0.15s' }}></div>
          <div className={`wave-bar ${isListening || isSpeaking ? 'active' : ''}`} style={{ animationDelay: '0.3s' }}></div>
          <div className={`wave-bar ${isListening || isSpeaking ? 'active' : ''}`} style={{ animationDelay: '0.45s' }}></div>
          <div className={`wave-bar ${isListening || isSpeaking ? 'active' : ''}`} style={{ animationDelay: '0.6s' }}></div>
        </div>
      </div>

      <div className="voice-command-chips">
        <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>Quick Voice Triggers:</span>
        
        <button 
          className="chip-btn"
          onClick={() => triggerPresetCommand('crop-scan', 'Scan Crop Disease', 'Opening Agri Shield scanner. Scanning leaf photos for plant sickness.')}
        >
          🍃 "Scan Sick Crop"
        </button>

        <button 
          className="chip-btn"
          onClick={() => triggerPresetCommand('toxi-guard', 'Check Chemical Toxicity', 'Toxi Guard calculated safe spraying limit. Caution for chemical absorption.')}
        >
          ☣️ "Check Pesticide Exposure"
        </button>

        <button 
          className="chip-btn"
          onClick={() => triggerPresetCommand('nutri-match', 'Match Crops with Health Needs', 'Nutri Match matrix active. Showing iron-rich crops for local anemia prevention.')}
        >
          🌾 "Recommend Safe Crops"
        </button>

        <button 
          className="chip-btn"
          onClick={() => triggerPresetCommand('sat-water', 'Trace Well Water Runoff', 'Sat-Water Monitor connected. Well water within 2 km radius is safe.')}
        >
          💧 "Water Safety Check"
        </button>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, CheckCircle, Leaf, ShieldAlert, RefreshCw, Volume2, Sprout, Wind, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_RESULTS = {
  disease: "Tomato Early Blight",
  confidence: 94.2,
  severity: "High",
  cause: "Alternaria solani fungus",
  action: "Apply copper-based fungicide immediately. Remove lower infected leaves to improve air circulation.",
  organicAlternative: "Neem oil extract (2% solution) spray every 7 days.",
  weatherContext: "High humidity next 3 days will accelerate spread."
};
import { analyzeCropImage } from '../services/aiService';

export default function AgriShield({ onSpeak }) {
  const [scanState, setScanState] = useState('idle'); // idle, scanning, results
  const [stream, setStream] = useState(null);
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      setScanState('idle');
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access denied or unavailable", err);
      // Fallback to idle without stream
    }
  };

  const processImage = async (base64Data) => {
    setScanState('scanning');
    setErrorMsg('');
    try {
      // Analyze with AI
      const aiResults = await analyzeCropImage(base64Data, "unknown plant", "en-IN");
      setResults(aiResults);
      setScanState('results');
      if (onSpeak) {
        onSpeak(`Scan complete. Detected ${aiResults.disease} with ${aiResults.confidence}% confidence. Critical action required: ${aiResults.action}`);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Analysis failed. Please try again or check your API key.');
      setScanState('idle');
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg');
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    processImage(base64Image);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      processImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const resetScan = () => {
    setScanState('idle');
    setResults(null);
    setStream(null);
  };

  // Aesthetic Colors
  const colors = {
    emerald: '#059669',
    vibrantGreen: '#10b981',
    earthBrown: '#b45309',
    gold: '#d97706',
    cream: '#fefce8',
    slateGreen: '#0f766e',
    textDark: '#1c1917',
    textLight: '#78716c',
    surface: '#ffffff',
    bg: '#f0fdf4'
  };

  return (
    <div className="page-body" style={{ backgroundColor: colors.bg, minHeight: '100vh', paddingBottom: '80px', color: colors.textDark, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ 
        background: `linear-gradient(135deg, ${colors.emerald} 0%, ${colors.slateGreen} 100%)`, 
        padding: '24px 20px 32px',
        borderBottomLeftRadius: '32px',
        borderBottomRightRadius: '32px',
        boxShadow: '0 4px 20px rgba(5, 150, 105, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Organic background shapes */}
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '150px', height: '150px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-30%', left: '-10%', width: '100px', height: '100px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Leaf size={24} /> AgriShield
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '14px', fontWeight: '500' }}>Smart Crop Diagnostics</p>
          </div>
          {onSpeak && (
            <button 
              onClick={() => onSpeak("AgriShield crop scanner. Point your camera at a diseased plant leaf to identify the problem and get treatment advice.")}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '10px', borderRadius: '50%', color: 'white', cursor: 'pointer' }}
              aria-label="Read instructions"
            >
              <Volume2 size={20} />
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '20px', marginTop: '-15px', position: 'relative', zIndex: 2 }}>
        
        <AnimatePresence mode="wait">
          {scanState === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ 
                backgroundColor: colors.surface, 
                borderRadius: '24px', 
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                border: `1px solid ${colors.cream}`
              }}>
                {stream ? (
                  <div style={{ position: 'relative', width: '100%', height: '350px', backgroundColor: '#000' }}>
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '70%', height: '70%', border: `3px dashed ${colors.vibrantGreen}`, borderRadius: '16px', opacity: 0.7 }} />
                    </div>
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream }}>
                    <Sprout size={64} color={colors.emerald} style={{ opacity: 0.2, marginBottom: '16px' }} />
                    <p style={{ color: colors.textLight, textAlign: 'center', padding: '0 32px', fontWeight: '500' }}>Ready to scan your crops for disease, pests, or nutrient deficiencies.</p>
                  </div>
                )}
                
                <div style={{ padding: '20px' }}>
                  {!stream ? (
                    <button 
                      onClick={startCamera}
                      style={{ 
                        width: '100%', padding: '16px', borderRadius: '16px', 
                        backgroundColor: colors.emerald, color: 'white', 
                        border: 'none', fontSize: '16px', fontWeight: '600',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        cursor: 'pointer', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                      }}
                    >
                      <Camera size={20} /> Open Camera
                    </button>
                  ) : (
                    <button 
                      onClick={handleCapture}
                      style={{ 
                        width: '100%', padding: '16px', borderRadius: '16px', 
                        backgroundColor: colors.earthBrown, color: 'white', 
                        border: 'none', fontSize: '16px', fontWeight: '600',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        cursor: 'pointer', boxShadow: '0 4px 12px rgba(180, 83, 9, 0.3)'
                      }}
                    >
                      <ShieldAlert size={20} /> Analyze Leaf
                    </button>
                  )}
                  
                  <label style={{ 
                    width: '100%', padding: '14px', borderRadius: '16px', 
                    backgroundColor: 'transparent', color: colors.emerald, 
                    border: `1px solid ${colors.emerald}`, fontSize: '16px', fontWeight: '600',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    marginTop: '12px', cursor: 'pointer'
                  }}>
                    <Upload size={20} /> Upload Photo
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      ref={fileInputRef}
                      onChange={handleFileUpload} 
                    />
                  </label>
                  
                  {errorMsg && (
                    <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '12px', fontSize: '14px', textAlign: 'center', border: '1px solid #fecaca' }}>
                      {errorMsg}
                    </div>
                  )}
                </div>
              </div>

              {/* Tips Section */}
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 12px 0', color: colors.slateGreen }}>Scanning Tips</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ backgroundColor: colors.surface, padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(5, 150, 105, 0.1)' }}>
                    <div style={{ backgroundColor: colors.cream, padding: '8px', borderRadius: '50%', color: colors.gold }}><Wind size={20} /></div>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>Avoid blurry movement</span>
                  </div>
                  <div style={{ backgroundColor: colors.surface, padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(5, 150, 105, 0.1)' }}>
                    <div style={{ backgroundColor: colors.cream, padding: '8px', borderRadius: '50%', color: colors.emerald }}><Droplets size={20} /></div>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>Ensure good lighting</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {scanState === 'scanning' && (
            <motion.div 
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', minHeight: '400px' }}
            >
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: '80px', height: '80px', backgroundColor: colors.cream, borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: `0 0 30px rgba(5, 150, 105, 0.3)` }}
              >
                <RefreshCw size={36} color={colors.emerald} />
              </motion.div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', color: colors.slateGreen }}>Analyzing Plant Health...</h2>
              <p style={{ margin: 0, color: colors.textLight, textAlign: 'center', fontWeight: '500' }}>Cross-referencing symptoms with agricultural database</p>
            </motion.div>
          )}

          {scanState === 'results' && results && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              {/* Alert Banner */}
              <div style={{ backgroundColor: '#fef2f2', borderLeft: `6px solid #ef4444`, padding: '16px 20px', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '20px', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)' }}>
                <ShieldAlert size={28} color="#ef4444" style={{ marginTop: '2px' }} />
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#991b1b' }}>{results.disease}</h3>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#b91c1c' }}>Severity: {results.severity}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: colors.emerald }}>{results.confidence}% Match</span>
                  </div>
                </div>
              </div>

              {/* Action Card */}
              <div style={{ backgroundColor: colors.surface, borderRadius: '24px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '24px', border: '1px solid rgba(5, 150, 105, 0.1)' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: colors.slateGreen, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={20} color={colors.emerald} /> Recommended Actions
                </h4>
                
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', color: colors.earthBrown, marginBottom: '4px' }}>Immediate Treatment</div>
                  <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.5', color: colors.textDark }}>{results.action}</p>
                </div>
                
                <div style={{ backgroundColor: colors.cream, padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', color: colors.gold, marginBottom: '4px' }}>Organic Alternative</div>
                  <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.5', color: colors.textDark }}>{results.organicAlternative}</p>
                </div>

                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ backgroundColor: '#e0f2fe', padding: '8px', borderRadius: '50%', color: '#0369a1' }}><Droplets size={16} /></div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: colors.textDark }}>Weather Context</div>
                      <div style={{ fontSize: '13px', color: colors.textLight }}>{results.weatherContext}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={resetScan}
                  style={{ 
                    flex: 1, padding: '16px', borderRadius: '16px', 
                    backgroundColor: colors.emerald, color: 'white', 
                    border: 'none', fontSize: '16px', fontWeight: '600',
                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                  }}
                >
                  Scan Another Plant
                </button>
                {onSpeak && (
                  <button 
                    onClick={() => onSpeak(`Action required: ${results.action}`)}
                    style={{ 
                      padding: '16px', borderRadius: '16px', 
                      backgroundColor: colors.surface, color: colors.emerald, 
                      border: `2px solid ${colors.emerald}`,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    aria-label="Read results aloud"
                  >
                    <Volume2 size={24} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

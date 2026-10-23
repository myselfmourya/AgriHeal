import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Delete } from 'lucide-react';

export default function VerifyOTP() {
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(25);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleKeyPress = (num) => {
    if (code.length < 6) {
      setCode(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setCode(prev => prev.slice(0, -1));
  };

  const handleVerify = () => {
    if (code.length === 6) {
      navigate('/setup');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] bg-[#FDFCF7] lg:h-screen overflow-hidden">
      
      {/* Graphic Section for Desktop */}
      <div className="hidden lg:flex relative w-1/2 rounded-r-[60px] overflow-hidden bg-green-50 shadow-xl items-center justify-center p-12">
        <img 
          src="/assets/welcome-hero.jpg"
          alt="AgriHeal Farmer" 
          className="w-full h-full object-contain object-center drop-shadow-md"
        />
        <div className="absolute top-12 left-0 right-0 flex justify-center items-center gap-2">
          <div className="flex items-center gap-2">
            <img src="/app-logo.jpg" alt="AgriHeal Logo" className="w-10 h-10 object-contain mix-blend-multiply" /> <span className="text-2xl font-bold text-green-800">AgriHeal</span>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 lg:w-1/2 flex flex-col h-full overflow-hidden">
        <div className="w-full max-w-sm mx-auto flex flex-col h-full">
          
          {/* Header */}
          <div className="pt-12 px-6 pb-2">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 mb-6 -ml-2 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-slate-800" />
            </button>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Verify OTP</h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Enter the 6-digit code sent to<br/>
              <span className="text-green-600 font-bold">+91 98765 43210</span>
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-6">
            
            {/* Graphic */}
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-10 shadow-sm border border-gray-100 bg-white overflow-hidden p-2">
              <img src="/assets/otp-shield.jpg" alt="OTP Shield" className="w-full h-full object-contain mix-blend-multiply" />
            </div>

            {/* OTP Inputs */}
            <div className="flex gap-2 mb-6 w-full justify-between max-w-[320px]">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div 
                  key={idx}
                  className={`w-[46px] h-[54px] flex items-center justify-center text-[22px] font-black rounded-2xl border-2 transition-all ${
                    code.length === idx 
                      ? 'border-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.1)]' 
                      : code.length > idx
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-200 text-slate-800 bg-white'
                  }`}
                >
                  {code[idx] || ''}
                </div>
              ))}
            </div>

            {/* Resend Timer */}
            <div className="text-[13px] font-bold text-slate-500 mb-8">
              {timer > 0 ? (
                <span>Resend OTP in 00:{timer.toString().padStart(2, '0')}</span>
              ) : (
                <button className="text-green-600 hover:text-green-700 transition-colors">Resend OTP Now</button>
              )}
            </div>

            {/* Verify Button */}
            <button 
              onClick={handleVerify}
              disabled={code.length !== 6}
              className={`w-full max-w-[320px] py-4 rounded-full font-bold text-lg shadow-lg transition-all ${
                code.length === 6 
                  ? 'bg-green-600 text-white shadow-[0_8px_20px_rgba(22,163,74,0.3)] hover:bg-green-700 active:scale-[0.98]' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              Verify & Continue
            </button>
          </div>

          {/* Custom Numpad */}
          <div className="bg-white border-t border-gray-100 px-6 py-6 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] mt-auto">
            <div className="grid grid-cols-3 gap-y-4 gap-x-4 max-w-[320px] mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button 
                  key={num}
                  onClick={() => handleKeyPress(num.toString())}
                  className="text-2xl font-bold text-slate-800 py-3 active:bg-gray-100 hover:bg-gray-50 rounded-2xl transition-colors"
                >
                  {num}
                </button>
              ))}
              <div className="py-3"></div>
              <button 
                onClick={() => handleKeyPress('0')}
                className="text-2xl font-bold text-slate-800 py-3 active:bg-gray-100 hover:bg-gray-50 rounded-2xl transition-colors"
              >
                0
              </button>
              <button 
                onClick={handleDelete}
                className="flex items-center justify-center text-slate-600 py-3 active:bg-gray-100 hover:bg-gray-50 rounded-2xl transition-colors"
              >
                <Delete className="w-6 h-6" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

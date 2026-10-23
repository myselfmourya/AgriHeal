import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft } from 'lucide-react';
import { HiOutlineLockClosed } from 'react-icons/hi';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  useEffect(() => {
    // Check if the user is in a recovery session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login');
      }
    });
  }, [navigate]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(password);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
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
          <div className="pt-12 px-6 pb-8">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Create New Password</h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Enter a new secure password for your account.
            </p>
          </div>

          <div className="flex-1 px-6 pt-2 flex flex-col items-center">
            
            {/* Graphic */}
            <div className="mb-10 w-40 h-40">
              <img src="/assets/otp-shield.jpg" alt="Reset Password" className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm" />
            </div>

            {error && (
              <div className="w-full mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-semibold border border-red-100 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-6 w-full max-w-[320px]">
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HiOutlineLockClosed className="w-[22px] h-[22px] text-green-600" />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium text-slate-800 placeholder:text-slate-400 text-[15px]"
                    placeholder="New Password"
                    required
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HiOutlineLockClosed className="w-[22px] h-[22px] text-green-600" />
                  </div>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium text-slate-800 placeholder:text-slate-400 text-[15px]"
                    placeholder="Confirm New Password"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-full bg-green-600 text-white font-bold text-lg shadow-[0_8px_20px_rgba(22,163,74,0.3)] hover:bg-green-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Check } from 'lucide-react';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // Supabase OAuth handles redirect, so we don't navigate immediately.
    } catch (err) {
      setError(err.message);
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
      <div className="flex-1 lg:w-1/2 flex flex-col overflow-y-auto">
        <div className="w-full max-w-sm mx-auto flex flex-col min-h-full">
          
          {/* Header */}
          <div className="pt-12 px-6 pb-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 mb-6 -ml-2 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-slate-800" />
            </button>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">{t('login')}</h1>
            <p className="text-sm text-slate-500 font-medium">{t('login_subtitle')}</p>
          </div>

          {error && (
            <div className="mx-6 mb-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="flex-1 px-6 pb-6">
            <form onSubmit={handleLogin} className="space-y-5">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">{t('email_phone')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HiOutlineMail className="w-[22px] h-[22px] text-green-600" />
                  </div>
                  <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium text-slate-800 placeholder:text-slate-400 text-[15px]"
                    placeholder={t('enter_email_phone')}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">{t('password')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HiOutlineLockClosed className="w-[22px] h-[22px] text-green-600" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-12 pr-12 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium text-slate-800 placeholder:text-slate-400 text-[15px]"
                    placeholder={t('enter_password')}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    rememberMe ? 'bg-green-600 border-green-600' : 'bg-white border-gray-300'
                  }`}>
                    {rememberMe && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-600">{t('remember_me')}</span>
                </label>

                <Link to="/forgot" className="text-sm font-bold text-green-600 hover:text-green-700 transition-colors">
                  {t('forgot_password')}
                </Link>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-8 rounded-full bg-green-600 text-white font-bold text-lg shadow-[0_8px_20px_rgba(22,163,74,0.3)] hover:bg-green-700 active:scale-[0.98] transition-all disabled:opacity-70"
              >
                {loading ? 'Logging in...' : t('login')}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('or_continue')}</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <button 
                  onClick={handleGoogleLogin} 
                  type="button" 
                  className="flex items-center justify-center gap-2 py-3.5 bg-white border border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all font-bold text-sm text-slate-700"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                  Google
                </button>
                <button 
                  onClick={async () => {
                    try {
                      await loginWithFacebook();
                    } catch (error) {
                      setError(error.message || "Facebook login failed");
                    }
                  }} 
                  type="button"
                  className="flex items-center justify-center gap-2 py-3.5 bg-white border border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all font-bold text-sm text-slate-700"
                >
                  <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5" />
                  Facebook
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 text-center pb-8 mt-auto">
            <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
              {t('terms_policy')}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

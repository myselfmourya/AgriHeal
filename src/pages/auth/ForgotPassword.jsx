import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { HiOutlineMail } from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await sendPasswordReset(email.trim());
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset link. Please try again.');
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
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 mb-6 -ml-2 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-slate-800" />
            </button>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Forgot Password?</h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Enter your account email and we'll send you a reset link.
            </p>
          </div>

          <div className="flex-1 px-6 pt-2 flex flex-col items-center">

            {/* Graphic */}
            <div className="mb-10 w-40 h-40">
              <img src="/assets/forgot-envelope.jpg" alt="Forgot Password Envelope" className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm" />
            </div>

            {sent ? (
              <div className="w-full max-w-[320px] text-center space-y-4">
                <div className="p-4 rounded-2xl bg-green-50 text-green-700 text-sm font-semibold border border-green-100">
                  Reset link sent to {email}. Check your inbox (and spam folder).
                </div>
                <Link to="/login" className="inline-block w-full py-4 rounded-full bg-green-600 text-white font-bold text-lg shadow-[0_8px_20px_rgba(22,163,74,0.3)] hover:bg-green-700 active:scale-[0.98] transition-all">
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-6 w-full max-w-[320px]">
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-semibold border border-red-100 text-center">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HiOutlineMail className="w-[22px] h-[22px] text-green-600" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium text-slate-800 placeholder:text-slate-400 text-[15px]"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-full bg-green-600 text-white font-bold text-lg shadow-[0_8px_20px_rgba(22,163,74,0.3)] hover:bg-green-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>
            )}
          </div>

          <div className="px-6 text-center pb-8 mt-auto">
            <p className="text-[13px] font-semibold text-slate-600">
              Remember your password? <Link to="/login" className="text-green-600 hover:text-green-700 underline">Log in</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

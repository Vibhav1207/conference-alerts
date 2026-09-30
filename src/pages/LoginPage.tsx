import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { animateGoogleBtnHover } from '../lib/animations';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login, loginGoogle, loginFirebase } = useAuth();
  const navigate = useNavigate();
  const googleBtnRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      try {
        await login(email, password);
      } catch {
        // Fallback to Firebase Email auth
        await loginFirebase(email, password);
      }
      navigate('/profile');
    } catch (err: any) {
      setError(err?.message || err?.response?.data?.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginGoogle();
      navigate('/profile');
    } catch (err: any) {
      setError(err?.message || 'Google Sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] font-sans">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="bg-white border border-[#DDE2E7] shadow-academic rounded-2xl max-w-md w-full p-8 space-y-6 animate-scale-in">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#0B1F33] text-[#FAF8F3] flex items-center justify-center mx-auto font-display text-2xl font-bold border border-[#D9A441]/40 rounded-xl shadow-sm">
              PT
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#10243A]">Welcome Back Scholar</h2>
            <p className="text-xs text-[#5F6B7A] font-medium">Access your saved alerts, bookmarks & profile</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 font-medium rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Google Sign-In with Firebase Auth */}
          <button
            ref={googleBtnRef}
            type="button"
            onClick={handleGoogleSignIn}
            onMouseEnter={() => animateGoogleBtnHover(googleBtnRef.current)}
            disabled={googleLoading}
            className="w-full py-3 px-4 bg-white text-[#10243A] font-semibold text-xs border border-[#DDE2E7] rounded-xl shadow-sm hover:bg-[#FAF8F3] hover:border-[#0B1F33] transition-all flex items-center justify-center gap-3 relative group"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-[#0B1F33] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {/* SVG Google Logo */}
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Firebase Google Auth</span>
                <span className="ml-auto bg-[#F5E8CD] text-[#10243A] text-[9px] px-1.5 py-0.5 rounded border border-[#D9A441]/40 font-mono font-medium">
                  1-Click
                </span>
              </>
            )}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-[#DDE2E7]" />
            <span className="text-[10px] font-mono font-bold text-[#8A94A3] uppercase">OR EMAIL LOGIN</span>
            <div className="flex-1 h-[1px] bg-[#DDE2E7]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="brutal-label text-xs font-semibold text-[#10243A]">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A94A3] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="author@university.edu"
                  className="brutal-input pl-10"
                />
              </div>
            </div>
            <div>
              <label className="brutal-label text-xs font-semibold text-[#10243A]">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8A94A3] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="brutal-input pl-10"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full brutal-btn-primary py-3">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>Log In</span>
            </button>
          </form>

          <div className="text-center text-xs text-[#5F6B7A] font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#0B1F33] hover:text-[#D9A441] hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

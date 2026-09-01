import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { UserPlus, Mail, Lock, User, Building, Globe, AlertCircle } from 'lucide-react';
import { animateGoogleBtnHover } from '../lib/animations';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, registerFirebase, loginGoogle } = useAuth();
  const navigate = useNavigate();
  const googleBtnRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      try {
        await register({ name, email, password, institution, country });
      } catch {
        await registerFirebase({ name, email, password, institution, country });
      }
      navigate('/profile');
    } catch (err: any) {
      setError(err?.message || err?.response?.data?.message || 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginGoogle();
      navigate('/profile');
    } catch (err: any) {
      setError(err?.message || 'Google Registration failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brutal-cream font-sans">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="bg-white border-4 border-brutal-black shadow-brutal-xl max-w-md w-full p-8 space-y-6 animate-scale-in">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-brutal-green text-white flex items-center justify-center mx-auto font-display text-3xl font-bold border-3 border-brutal-black shadow-brutal-sm">
              N
            </div>
            <h2 className="font-serif text-2xl font-bold text-brutal-black">Create Scholar Profile</h2>
            <p className="text-xs text-brutal-black/60 font-medium">Subscribe to verified call-for-papers & bookmarks</p>
          </div>

          {error && (
            <div className="p-3 bg-brutal-red/10 border-3 border-brutal-red text-xs text-brutal-red font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Google Registration */}
          <button
            ref={googleBtnRef}
            type="button"
            onClick={handleGoogleRegister}
            onMouseEnter={() => animateGoogleBtnHover(googleBtnRef.current)}
            disabled={googleLoading}
            className="w-full py-3 px-4 bg-white text-brutal-black font-bold text-xs border-3 border-brutal-black shadow-brutal hover:bg-brutal-cream transition-all flex items-center justify-center gap-3 relative"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-brutal-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
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
                <span>Quick Register with Google</span>
                <span className="ml-auto bg-brutal-green text-white text-[9px] px-1.5 py-0.5 font-mono uppercase font-bold">
                  Fast
                </span>
              </>
            )}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-[2px] bg-brutal-black/20" />
            <span className="text-[10px] font-mono font-bold text-brutal-black/40 uppercase">OR REGISTER WITH EMAIL</span>
            <div className="flex-1 h-[2px] bg-brutal-black/20" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="brutal-label">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-brutal-black/30 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Alexander Wright"
                  className="brutal-input pl-10"
                />
              </div>
            </div>
            <div>
              <label className="brutal-label">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brutal-black/30 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@ethz.ch"
                  className="brutal-input pl-10"
                />
              </div>
            </div>
            <div>
              <label className="brutal-label">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brutal-black/30 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="brutal-input pl-10"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="brutal-label">Institution</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-brutal-black/30 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="ETH Zurich"
                    className="brutal-input pl-10 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="brutal-label">Country</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-brutal-black/30 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Switzerland"
                    className="brutal-input pl-10 text-xs"
                  />
                </div>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full brutal-btn-primary py-3 bg-brutal-green text-white border-brutal-black hover:bg-brutal-green/90">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              <span>Create Account</span>
            </button>
          </form>

          <div className="text-center text-xs text-brutal-black/60 font-medium">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-brutal-blue hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

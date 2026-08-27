import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid login credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brutal-cream">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="bg-white border-4 border-brutal-black shadow-brutal-xl max-w-md w-full p-8 space-y-6 animate-scale-in">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-brutal-yellow text-brutal-black flex items-center justify-center mx-auto font-display text-3xl font-bold border-3 border-brutal-black shadow-brutal-sm">
              N
            </div>
            <h2 className="font-serif text-2xl font-bold text-brutal-black">Welcome Back</h2>
            <p className="text-xs text-brutal-black/50 font-medium">Access your bookmarks and alerts</p>
          </div>

          {error && (
            <div className="p-3 bg-brutal-red/10 border-3 border-brutal-red text-xs text-brutal-red font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-brutal-cream border-2 border-brutal-black/20 text-[11px] text-brutal-black/70 space-y-1 font-medium">
            <p className="font-bold text-brutal-black">Demo Credentials:</p>
            <p>Admin: <code className="font-mono text-brutal-blue">admin@nitinsir.org</code> / <code className="font-mono text-brutal-blue">AdminPassword123!</code></p>
            <p>User: <code className="font-mono text-brutal-blue">sarah.jenkins@university.edu</code> / <code className="font-mono text-brutal-blue">UserPassword123!</code></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="brutal-label">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brutal-black/30 absolute left-3.5 top-3.5" />
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="author@university.edu"
                  className="brutal-input pl-10"
                />
              </div>
            </div>
            <div>
              <label className="brutal-label">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brutal-black/30 absolute left-3.5 top-3.5" />
                <input
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="brutal-input pl-10"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full brutal-btn-primary py-3">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <LogIn className="w-4 h-4" />}
              <span>Log In</span>
            </button>
          </form>

          <div className="text-center text-xs text-brutal-black/50 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brutal-blue hover:underline">Create Account</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

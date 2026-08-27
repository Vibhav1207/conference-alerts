import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { UserPlus, Mail, Lock, User, Building, Globe, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password, institution, country });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brutal-cream">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="bg-white border-4 border-brutal-black shadow-brutal-xl max-w-md w-full p-8 space-y-6 animate-scale-in">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-brutal-green text-white flex items-center justify-center mx-auto font-display text-3xl font-bold border-3 border-brutal-black shadow-brutal-sm">
              N
            </div>
            <h2 className="font-serif text-2xl font-bold text-brutal-black">Create Profile</h2>
            <p className="text-xs text-brutal-black/50 font-medium">Subscribe to conference alerts & bookmarks</p>
          </div>

          {error && (
            <div className="p-3 bg-brutal-red/10 border-3 border-brutal-red text-xs text-brutal-red font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="brutal-label">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-brutal-black/30 absolute left-3.5 top-3.5" />
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Alexander Wright" className="brutal-input pl-10" />
              </div>
            </div>
            <div>
              <label className="brutal-label">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brutal-black/30 absolute left-3.5 top-3.5" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@ethz.ch" className="brutal-input pl-10" />
              </div>
            </div>
            <div>
              <label className="brutal-label">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brutal-black/30 absolute left-3.5 top-3.5" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="brutal-input pl-10" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="brutal-label">Institution</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-brutal-black/30 absolute left-3.5 top-3.5" />
                  <input type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="ETH Zurich" className="brutal-input pl-10 text-xs" />
                </div>
              </div>
              <div>
                <label className="brutal-label">Country</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-brutal-black/30 absolute left-3.5 top-3.5" />
                  <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Switzerland" className="brutal-input pl-10 text-xs" />
                </div>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full brutal-btn-primary py-3 bg-brutal-green border-brutal-green hover:bg-brutal-green/90">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
              <span>Register Account</span>
            </button>
          </form>

          <div className="text-center text-xs text-brutal-black/50 font-medium">
            Already registered? <Link to="/login" className="font-bold text-brutal-blue hover:underline">Log In</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

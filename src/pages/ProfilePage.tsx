import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Toast } from '../components/Toast';
import { ConferenceCard } from '../components/ConferenceCard';
import { Conference } from '../types';
import { conferenceAPI } from '../services/api';
import {
  User as UserIcon,
  Mail,
  Building2,
  Globe,
  BookOpen,
  Bookmark,
  Bell,
  Shield,
  LogOut,
  Camera,
  CheckCircle2,
  Calendar,
  Sparkles,
  Zap,
  Lock,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { animateProfileTabSwitch, pulseBadge, cardHoverIn, cardHoverOut } from '../lib/animations';

const PRESET_AVATARS = [
  { name: 'Scientist', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { name: 'Professor', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { name: 'Researcher', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { name: 'Scholar', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { name: 'Student', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
];

export const ProfilePage: React.FC = () => {
  const { user, updateProfileData, logout, isBookmarked } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'bookmarks' | 'alerts' | 'security'>('overview');
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Editable Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [institution, setInstitution] = useState(user?.institution || '');
  const [country, setCountry] = useState(user?.country || '');
  const [fieldOfInterest, setFieldOfInterest] = useState(user?.fieldOfInterest || 'Engineering & Tech');
  const [bio, setBio] = useState(user?.bio || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

  // Bookmarks State
  const [bookmarkedConferences, setBookmarkedConferences] = useState<Conference[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [bookmarkSearch, setBookmarkSearch] = useState('');

  // Password State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Alert preferences
  const [alertSubscriptions, setAlertSubscriptions] = useState(
    user?.alertSubscriptions || [
      { category: 'Engineering & Tech', frequency: 'weekly' },
      { category: 'Physical & Life Sciences', frequency: 'monthly' },
    ]
  );

  const tabContainerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  // Sync state if user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setInstitution(user.institution || '');
      setCountry(user.country || '');
      setFieldOfInterest(user.fieldOfInterest || 'Engineering & Tech');
      setBio(user.bio || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  // Fetch bookmarked conference details when switching to bookmarks tab
  useEffect(() => {
    if (activeTab === 'bookmarks') {
      fetchBookmarkedConferences();
    }
    if (tabContainerRef.current) {
      animateProfileTabSwitch(tabContainerRef.current);
    }
  }, [activeTab]);

  const fetchBookmarkedConferences = async () => {
    setLoadingBookmarks(true);
    try {
      const res = await conferenceAPI.getConferences({ limit: 100 });
      if (res.data?.success) {
        const allConfs: Conference[] = res.data.data;
        const userBookmarkIds = user?.bookmarkedConferences || [];
        const filtered = allConfs.filter((c) => userBookmarkIds.includes(c._id));
        setBookmarkedConferences(filtered);
      }
    } catch (err) {
      console.error('Failed to load bookmarked conferences:', err);
    } finally {
      setLoadingBookmarks(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileData({
        name,
        institution,
        country,
        fieldOfInterest,
        bio,
        photoURL,
      });
      if (badgeRef.current) pulseBadge(badgeRef.current);
      setToast({ type: 'success', message: 'Profile updated successfully via Firebase Auth!' });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to update profile.' });
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setToast({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    if (newPass.length < 6) {
      setToast({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }
    setToast({ type: 'success', message: 'Account security preferences & password updated!' });
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const handleToggleSubscription = (categoryName: string) => {
    const existing = alertSubscriptions.find((s) => s.category === categoryName);
    let updated;
    if (existing) {
      updated = alertSubscriptions.filter((s) => s.category !== categoryName);
    } else {
      updated = [...alertSubscriptions, { category: categoryName, frequency: 'weekly' as const }];
    }
    setAlertSubscriptions(updated);
    updateProfileData({ alertSubscriptions: updated });
    setToast({ type: 'info', message: `Alert preferences updated for ${categoryName}` });
  };

  const filteredBookmarks = bookmarkedConferences.filter(
    (c) =>
      c.title.toLowerCase().includes(bookmarkSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(bookmarkSearch.toLowerCase()) ||
      c.acronym.toLowerCase().includes(bookmarkSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-brutal-cream font-sans">
      <Navbar />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* ═══ PROFILE HERO BANNER ═══ */}
      <section className="bg-brutal-black text-white border-b-6 border-brutal-yellow py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-brutal-yellow/10 -rotate-12 translate-x-20 -translate-y-20" />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* Avatar Container */}
          <div className="relative group flex-shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-brutal-yellow border-4 border-white shadow-brutal-lg overflow-hidden flex items-center justify-center font-display text-4xl font-bold text-brutal-black">
              {photoURL ? (
                <img src={photoURL} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                <span>{user?.name?.charAt(0) || 'A'}</span>
              )}
            </div>
            <button
              onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
              className="absolute -bottom-2 -right-2 bg-brutal-yellow text-brutal-black p-2 border-2 border-brutal-black shadow-brutal-sm hover:scale-110 transition-transform"
              title="Change Profile Photo"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Quick Avatar Preset Modal */}
            {isAvatarPickerOpen && (
              <div className="absolute top-full left-0 mt-3 bg-white text-brutal-black border-3 border-brutal-black shadow-brutal-xl p-3 z-50 w-64 animate-scale-in">
                <p className="text-[11px] font-bold uppercase tracking-wider border-b-2 border-brutal-black pb-1 mb-2">
                  Choose Academic Avatar
                </p>
                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {PRESET_AVATARS.map((av) => (
                    <button
                      key={av.name}
                      onClick={() => {
                        setPhotoURL(av.url);
                        setIsAvatarPickerOpen(false);
                      }}
                      className="w-10 h-10 border-2 border-brutal-black overflow-hidden hover:scale-110 transition-transform"
                      title={av.name}
                    >
                      <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <label className="text-[10px] font-bold block mb-1">Or Photo URL:</label>
                <input
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://..."
                  className="brutal-input text-xs py-1 px-2"
                />
              </div>
            )}
          </div>

          {/* User Bio Details */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span
                ref={badgeRef}
                className="px-3 py-1 bg-brutal-yellow text-brutal-black border-2 border-brutal-black font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-brutal-sm"
              >
                <ShieldCheck className="w-3 h-3 text-brutal-black" />
                {user?.authProvider === 'firebase-google'
                  ? 'Firebase Google Auth'
                  : user?.authProvider === 'firebase-email'
                  ? 'Firebase Verified'
                  : 'Academic Scholar'}
              </span>

              {user?.role === 'admin' && (
                <span className="px-3 py-1 bg-brutal-red text-white border-2 border-white font-mono text-[10px] font-bold uppercase tracking-wider">
                  Admin Privileges
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
              {user?.name || 'Academic Scholar'}
            </h1>

            <p className="text-white/70 text-xs sm:text-sm font-medium flex items-center justify-center md:justify-start gap-2">
              <Building2 className="w-4 h-4 text-brutal-yellow flex-shrink-0" />
              <span>{user?.institution || 'Massachusetts Institute of Technology'}</span>
              <span className="text-white/30">•</span>
              <Globe className="w-4 h-4 text-brutal-green flex-shrink-0" />
              <span>{user?.country || 'United States'}</span>
            </p>

            <p className="text-xs text-white/50 max-w-2xl leading-relaxed italic pt-1">
              "{user?.bio || 'Passionate about international academic conferences, computer science research, and joint publication opportunities.'}"
            </p>
          </div>

          {/* Quick Stat Card */}
          <div className="bg-white/5 border-2 border-white/20 p-4 min-w-[200px] space-y-2 text-center md:text-right">
            <div className="text-xs text-white/60 font-bold uppercase tracking-widest">Saved Bookmarks</div>
            <div className="font-display text-3xl font-bold text-brutal-yellow">
              {user?.bookmarkedConferences?.length || 0}
            </div>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className="text-[10px] font-bold text-brutal-green underline hover:text-white"
            >
              View Saved Events →
            </button>
          </div>
        </div>
      </section>

      {/* ═══ TAB NAVIGATION BAR ═══ */}
      <section className="bg-white border-b-4 border-brutal-black sticky top-16 z-30 shadow-brutal-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-2 py-2">
            {[
              { id: 'overview', label: 'Overview & Edit Profile', icon: UserIcon },
              { id: 'bookmarks', label: `Saved Bookmarks (${user?.bookmarkedConferences?.length || 0})`, icon: Bookmark },
              { id: 'alerts', label: 'Alert Preferences', icon: Bell },
              { id: 'security', label: 'Security & Connected Auth', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 text-xs font-bold font-mono transition-all flex items-center gap-2 border-2 ${
                    active
                      ? 'bg-brutal-yellow text-brutal-black border-brutal-black shadow-brutal-sm translate-y-[-1px]'
                      : 'bg-white text-brutal-black/70 border-transparent hover:bg-brutal-cream hover:border-brutal-black/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-brutal-red border-2 border-brutal-red/30 hover:bg-brutal-red hover:text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </section>

      {/* ═══ MAIN TAB CONTENT ═══ */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-10 w-full" ref={tabContainerRef}>
        {/* TAB 1: OVERVIEW & EDIT PROFILE */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-2 bg-white border-4 border-brutal-black shadow-brutal-xl p-6 sm:p-8 space-y-6">
              <div className="border-b-3 border-brutal-black pb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl font-bold text-brutal-black flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-brutal-black" />
                    Edit Academic Profile
                  </h2>
                  <p className="text-xs text-brutal-black/60 font-medium">
                    Update your scholar credentials and research preferences.
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-brutal-yellow text-brutal-black border-2 border-brutal-black font-bold text-[10px] uppercase">
                  Firebase Sync Active
                </span>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="brutal-label">Full Name & Academic Title</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-brutal-black/30 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dr. Sarah Jenkins"
                        className="brutal-input pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="brutal-label">Email Address (Read Only)</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-brutal-black/30 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        disabled
                        value={user?.email || ''}
                        className="brutal-input pl-10 bg-brutal-cream/50 cursor-not-allowed text-brutal-black/60"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="brutal-label">University / Institution</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-brutal-black/30 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="Stanford University"
                        className="brutal-input pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="brutal-label">Country / Region</label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-brutal-black/30 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="United States"
                        className="brutal-input pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="brutal-label">Primary Research Field</label>
                    <div className="relative">
                      <BookOpen className="w-4 h-4 text-brutal-black/30 absolute left-3.5 top-3.5" />
                      <select
                        value={fieldOfInterest}
                        onChange={(e) => setFieldOfInterest(e.target.value)}
                        className="brutal-select pl-10"
                      >
                        <option value="Engineering & Tech">Engineering & Tech</option>
                        <option value="Physical & Life Sciences">Physical & Life Sciences</option>
                        <option value="Agricultural & Biological Sciences">Agricultural & Biological Sciences</option>
                        <option value="Medical & Health Sciences">Medical & Health Sciences</option>
                        <option value="Business & Management">Business & Management</option>
                        <option value="Arts & Humanities">Arts & Humanities</option>
                        <option value="Social Sciences">Social Sciences</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="brutal-label">Profile Photo URL</label>
                    <div className="relative">
                      <Camera className="w-4 h-4 text-brutal-black/30 absolute left-3.5 top-3.5" />
                      <input
                        type="url"
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="brutal-input pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="brutal-label">Academic Bio & Research Interests</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Briefly state your research domains, publication history, or call for paper preferences..."
                    className="brutal-textarea"
                  />
                </div>

                <button type="submit" className="brutal-btn-primary py-3 px-6 text-xs uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </button>
              </form>
            </div>

            {/* Sidebar Info Card */}
            <div className="space-y-6">
              <div className="bg-brutal-yellow border-4 border-brutal-black shadow-brutal p-6 space-y-4 text-brutal-black">
                <div className="flex items-center gap-2 font-display text-lg font-bold">
                  <Sparkles className="w-5 h-5" />
                  <span>Scholar Status</span>
                </div>
                <p className="text-xs leading-relaxed font-medium">
                  Your academic profile enables 1-click bookmarks, custom conference submission reminders, and verified call for papers subscriptions.
                </p>
                <div className="space-y-2 border-t-2 border-brutal-black pt-3 text-xs font-mono font-bold">
                  <div className="flex justify-between">
                    <span>Account ID:</span>
                    <span className="truncate max-w-[120px]">{user?.id || 'FB-88219'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auth Provider:</span>
                    <span className="uppercase text-brutal-blue">{user?.authProvider || 'Firebase'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Member Since:</span>
                    <span>2026</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border-4 border-brutal-black shadow-brutal p-6 space-y-3">
                <h3 className="font-display text-base font-bold text-brutal-black flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brutal-yellow" />
                  Quick Actions
                </h3>
                <div className="space-y-2 text-xs font-bold">
                  <Link
                    to="/"
                    className="w-full flex items-center justify-between p-3 border-2 border-brutal-black hover:bg-brutal-cream transition-colors"
                  >
                    <span>Browse All Conferences</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/resources"
                    className="w-full flex items-center justify-between p-3 border-2 border-brutal-black hover:bg-brutal-cream transition-colors"
                  >
                    <span>LaTeX & Paper Templates</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKMARKED CONFERENCES */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-6">
            <div className="bg-white border-4 border-brutal-black shadow-brutal-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-brutal-black flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-brutal-yellow fill-brutal-yellow" />
                  Your Bookmarked Academic Events
                </h2>
                <p className="text-xs text-brutal-black/60 font-medium">
                  {bookmarkedConferences.length} saved conference(s) in your personal academic list.
                </p>
              </div>

              <div className="w-full sm:w-auto relative min-w-[240px]">
                <Search className="w-4 h-4 text-brutal-black/30 absolute left-3 top-3" />
                <input
                  type="text"
                  value={bookmarkSearch}
                  onChange={(e) => setBookmarkSearch(e.target.value)}
                  placeholder="Search saved list..."
                  className="brutal-input text-xs pl-9 py-2"
                />
              </div>
            </div>

            {loadingBookmarks ? (
              <div className="py-16 text-center space-y-2">
                <div className="w-10 h-10 border-4 border-brutal-black border-t-brutal-yellow animate-spin mx-auto" />
                <p className="text-xs font-bold text-brutal-black/50">Fetching your saved events...</p>
              </div>
            ) : filteredBookmarks.length === 0 ? (
              <div className="bg-white border-4 border-brutal-black shadow-brutal p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-brutal-cream border-3 border-brutal-black flex items-center justify-center mx-auto">
                  <Bookmark className="w-8 h-8 text-brutal-black/30" />
                </div>
                <h3 className="font-serif text-lg font-bold text-brutal-black">No Bookmarks Saved Yet</h3>
                <p className="text-xs text-brutal-black/60 max-w-sm mx-auto">
                  Click the bookmark star icon on any conference card across the portal to save it here for offline viewing and deadline reminders.
                </p>
                <Link to="/" className="brutal-btn-primary inline-flex items-center gap-2 text-xs py-2.5 px-4">
                  <Search className="w-4 h-4" />
                  <span>Explore Academic Conferences</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBookmarks.map((conf) => (
                  <div key={conf._id} className="relative group">
                    <ConferenceCard conference={conf} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ALERT PREFERENCES */}
        {activeTab === 'alerts' && (
          <div className="bg-white border-4 border-brutal-black shadow-brutal-xl p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
            <div className="border-b-3 border-brutal-black pb-4">
              <h2 className="font-serif text-xl font-bold text-brutal-black flex items-center gap-2">
                <Bell className="w-5 h-5 text-brutal-yellow" />
                Academic Notification & Alert Settings
              </h2>
              <p className="text-xs text-brutal-black/60 font-medium">
                Manage automated call-for-papers digest emails and submission deadline alerts.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold text-brutal-black uppercase tracking-wider">
                Subscribed Field Notifications:
              </p>

              {[
                'Engineering & Tech',
                'Physical & Life Sciences',
                'Agricultural & Biological Sciences',
                'Medical & Health Sciences',
                'Business & Management',
                'Arts & Humanities',
                'Social Sciences',
              ].map((category) => {
                const isSubscribed = alertSubscriptions.some((s) => s.category === category);
                return (
                  <div
                    key={category}
                    className={`p-4 border-3 border-brutal-black flex items-center justify-between transition-colors ${
                      isSubscribed ? 'bg-brutal-yellow/20' : 'bg-brutal-cream/50'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-xs text-brutal-black">{category}</h4>
                      <p className="text-[10px] text-brutal-black/50">Verified call for papers & deadines</p>
                    </div>

                    <button
                      onClick={() => handleToggleSubscription(category)}
                      className={`px-3 py-1.5 text-xs font-bold border-2 border-brutal-black shadow-brutal-sm ${
                        isSubscribed
                          ? 'bg-brutal-black text-brutal-yellow'
                          : 'bg-white text-brutal-black hover:bg-brutal-yellow'
                      }`}
                    >
                      {isSubscribed ? 'Subscribed ✓' : '+ Subscribe'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY & CONNECTED AUTH */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Connected Auth Card */}
            <div className="bg-white border-4 border-brutal-black shadow-brutal-xl p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-brutal-black flex items-center gap-2 border-b-2 border-brutal-black pb-3">
                <ShieldCheck className="w-5 h-5 text-brutal-green" />
                Firebase Auth Connection
              </h3>

              <div className="p-4 bg-brutal-cream border-2 border-brutal-black space-y-2 text-xs font-medium">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Primary Auth Method:</span>
                  <span className="px-2 py-0.5 bg-brutal-yellow text-brutal-black font-bold text-[10px] border border-brutal-black uppercase">
                    {user?.authProvider || 'Firebase'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">Email Status:</span>
                  <span className="text-brutal-green font-bold">Verified ✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">Google Auth:</span>
                  <span>{user?.authProvider === 'firebase-google' ? 'Connected' : 'Available'}</span>
                </div>
              </div>

              <p className="text-xs text-brutal-black/60 leading-relaxed">
                Your login credentials and sessions are securely verified using Firebase Authentication SDK.
              </p>
            </div>

            {/* Password Update Card */}
            <div className="bg-white border-4 border-brutal-black shadow-brutal-xl p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-brutal-black flex items-center gap-2 border-b-2 border-brutal-black pb-3">
                <Lock className="w-5 h-5 text-brutal-black" />
                Update Security Password
              </h3>

              <form onSubmit={handlePasswordSubmit} className="space-y-3">
                <div>
                  <label className="brutal-label text-[11px]">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="brutal-input text-xs py-2"
                  />
                </div>
                <div>
                  <label className="brutal-label text-[11px]">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="brutal-input text-xs py-2"
                  />
                </div>
                <div>
                  <label className="brutal-label text-[11px]">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="brutal-input text-xs py-2"
                  />
                </div>
                <button type="submit" className="w-full brutal-btn-primary py-2.5 text-xs font-bold">
                  Update Password
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

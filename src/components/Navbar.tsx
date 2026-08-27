import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Bell, User, LogOut, Bookmark, LayoutDashboard, Menu, X,
  FileText, Briefcase, GraduationCap, CalendarCheck, CheckCircle2,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('Engineering & Tech');
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isNavActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubscribedSuccess(true);
      setTimeout(() => {
        setSubscribedSuccess(false);
        setAlertModalOpen(false);
        setEmailInput('');
      }, 2000);
    }, 600);
  };

  const navLinks = [
    { to: '/', label: 'Browse All', icon: CalendarCheck, query: '' },
    { to: '/?eventType=Journals', label: 'Journals', icon: GraduationCap, query: 'eventType=Journals' },
    { to: '/?eventType=Conference', label: 'Conferences', icon: CalendarCheck, query: 'eventType=Conference' },
    { to: '/?eventType=Internship', label: 'Internships', icon: Briefcase, query: 'eventType=Internship' },
    { to: '/?eventType=FAP', label: 'FAP', icon: GraduationCap, query: 'eventType=FAP' },
    { to: '/?category=FDP', label: 'FDP', icon: GraduationCap, query: 'category=FDP' },
    { to: '/resources', label: 'Resources', icon: FileText, query: 'resources' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-brutal-black text-white border-b-4 border-brutal-yellow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-brutal-yellow text-brutal-black flex items-center justify-center font-display text-2xl font-bold border-3 border-brutal-black shadow-brutal-sm group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-brutal transition-all">
                N
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold tracking-tight text-white leading-tight">
                  Nitin Sir
                </span>
                <span className="text-[9px] font-bold tracking-widest text-brutal-yellow uppercase">
                  Academic Alerts 2026
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 font-bold text-xs">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active =
                  link.query === ''
                    ? isNavActive('/') && !location.search
                    : location.search.includes(link.query);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-2 transition-all flex items-center gap-1.5 border-2 ${
                      active
                        ? 'bg-brutal-yellow text-brutal-black border-brutal-yellow shadow-brutal-sm'
                        : 'border-transparent text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setAlertModalOpen(true)}
                className="brutal-btn-secondary text-xs py-2 px-3"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Alerts</span>
              </button>

              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 border-2 border-white/20 hover:border-brutal-yellow transition-colors"
                  >
                    <div className="w-7 h-7 bg-brutal-yellow text-brutal-black flex items-center justify-center font-bold text-xs border-2 border-brutal-black">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-xs font-bold hidden md:inline">{user?.name}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border-3 border-brutal-black shadow-brutal-lg z-50 animate-slide-down">
                      <div className="px-4 py-3 border-b-2 border-brutal-black bg-brutal-yellow/10">
                        <p className="text-xs font-bold text-brutal-black">{user?.name}</p>
                        <p className="text-[10px] text-brutal-black/60 truncate">{user?.email}</p>
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-brutal-black hover:bg-brutal-yellow/20 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-brutal-red hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="brutal-btn-outline text-xs py-2 px-3"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="brutal-btn-secondary text-xs py-2 px-3"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 border-2 border-white/20 hover:border-brutal-yellow transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t-2 border-white/10 bg-brutal-black px-4 pt-3 pb-6 space-y-1 animate-slide-down">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-white/80 hover:bg-white/10 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-brutal-yellow"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-brutal-red"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 text-sm font-bold text-white border-2 border-white/20 hover:bg-white/10"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 text-sm font-bold bg-brutal-yellow text-brutal-black border-2 border-brutal-black"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Alert Modal */}
      {alertModalOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setAlertModalOpen(false); }}
          className="brutal-overlay"
        >
          <div className="bg-white border-4 border-brutal-black shadow-brutal-xl max-w-md w-full p-6 sm:p-8 relative animate-scale-in my-auto">
            <button
              onClick={() => setAlertModalOpen(false)}
              className="absolute top-3 right-3 p-2 border-2 border-brutal-black hover:bg-brutal-black hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {subscribedSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 bg-brutal-green border-3 border-brutal-black flex items-center justify-center mx-auto shadow-brutal">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-serif text-xl font-bold text-brutal-black">Subscription Active!</h3>
                <p className="text-xs text-brutal-black/70">
                  You'll receive alerts for <strong>{categoryInput}</strong>.
                </p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-brutal-yellow border-3 border-brutal-black flex items-center justify-center mb-4 shadow-brutal-sm">
                  <Bell className="w-6 h-6 text-brutal-black" />
                </div>
                <h3 className="font-serif text-xl font-bold text-brutal-black mb-1">
                  Subscribe to Alerts
                </h3>
                <p className="text-xs text-brutal-black/60 mb-5 leading-relaxed">
                  Get verified notifications for Conferences, Internships, and Journals.
                </p>
                <form onSubmit={handleSubscribe} className="space-y-4 text-xs">
                  <div>
                    <label className="brutal-label">Email Address</label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="author@university.edu"
                      className="brutal-input"
                    />
                  </div>
                  <div>
                    <label className="brutal-label">Field of Interest</label>
                    <select
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      className="brutal-select"
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
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full brutal-btn-primary py-3"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Activate Free Alerts</span>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

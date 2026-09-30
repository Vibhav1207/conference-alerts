import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Bell, User, CircleUser, LogOut, Bookmark, LayoutDashboard, Menu, X,
  FileText, Briefcase, GraduationCap, CalendarCheck, CheckCircle2,
  ChevronDown, Award,
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
    { to: '/?eventType=FDP', label: 'FDPs', icon: Award, query: 'eventType=FDP' },
    { to: '/resources', label: 'Resources', icon: FileText, query: 'resources' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white text-[#10243A] border-b border-[#DDE2E7] shadow-[0_1px_3px_0_rgba(11,31,51,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#0B1F33] text-white flex items-center justify-center font-sans text-lg font-bold rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                PT
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-tight text-[#0B1F33] leading-tight">
                  Publication Track
                </span>
                <span className="text-[9px] font-bold tracking-widest text-[#8A94A3] uppercase font-mono">
                  Academic Alerts 2026
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5 font-bold text-xs">
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
                    className={`px-3 py-2 transition-all flex items-center gap-1.5 rounded-lg text-xs font-semibold ${
                      active
                        ? 'bg-[#F5E8CD] text-[#10243A] border border-[#D9A441]/40 shadow-sm font-bold'
                        : 'border border-transparent text-[#10243A] hover:text-[#0B1F33] hover:bg-[#FAF2DF]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#D9A441]' : 'text-[#5F6B7A]'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setAlertModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#10243A] border border-[#DDE2E7] hover:bg-[#FAF8F3] rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                <Bell className="w-3.5 h-3.5 text-[#D9A441]" />
                <span className="hidden md:inline">Alerts</span>
              </button>

              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 border border-[#DDE2E7] hover:border-[#0B1F33] rounded-lg transition-colors bg-[#FAF8F3]"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#0B1F33] text-white flex items-center justify-center font-bold text-xs border border-[#DDE2E7] overflow-hidden flex-shrink-0">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <CircleUser className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#10243A] hidden md:inline truncate max-w-[120px]">{user?.name}</span>
                    <ChevronDown className="w-3 h-3 text-[#5F6B7A]" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-[#DDE2E7] rounded-xl shadow-academic-lg z-50 animate-slide-down overflow-hidden">
                      <div className="px-4 py-3 border-b border-[#DDE2E7] bg-[#FAF8F3]">
                        <p className="text-xs font-bold text-[#10243A] truncate">{user?.name}</p>
                        <p className="text-[10px] text-[#5F6B7A] truncate">{user?.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[#10243A] hover:bg-[#FAF2DF] transition-colors border-b border-[#DDE2E7]/50"
                      >
                        <User className="w-4 h-4 text-[#0B1F33]" />
                        <span>My Academic Profile</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[#10243A] hover:bg-[#FAF2DF] transition-colors border-b border-[#DDE2E7]/50"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#0B1F33]" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[#C53030] hover:bg-red-50 text-left"
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
                    className="inline-flex items-center justify-center px-3.5 py-2 bg-white text-[#10243A] border border-[#0B1F33] hover:bg-[#FAF8F3] rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-4 py-2 bg-[#0B1F33] text-white hover:bg-[#132B45] rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
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
                className="p-2 border border-[#DDE2E7] text-[#10243A] hover:bg-[#FAF8F3] rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#DDE2E7] bg-white px-4 pt-3 pb-6 space-y-1 animate-slide-down shadow-lg">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-[#10243A] hover:bg-[#FAF2DF] rounded-lg transition-colors"
                >
                  <Icon className="w-4 h-4 text-[#5F6B7A]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2.5 px-3 py-2 border-b border-[#DDE2E7] mb-1">
                  <div className="w-8 h-8 rounded-full bg-[#0B1F33] text-white flex items-center justify-center font-bold text-xs border border-[#DDE2E7] overflow-hidden flex-shrink-0">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <CircleUser className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#10243A] truncate">{user?.name}</p>
                    <p className="text-[10px] text-[#5F6B7A] truncate">{user?.email}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-[#0B1F33]"
                >
                  <User className="w-4 h-4" />
                  My Academic Profile
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-[#10243A]"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-[#C53030]"
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
                  className="text-center px-4 py-2.5 text-sm font-bold text-[#10243A] border border-[#0B1F33] hover:bg-[#FAF8F3] rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 text-sm font-bold bg-[#0B1F33] text-white hover:bg-[#132B45] rounded-lg"
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
          <div className="bg-white border border-[#DDE2E7] shadow-academic-xl rounded-xl max-w-md w-full p-6 sm:p-8 relative animate-scale-in my-auto">
            <button
              onClick={() => setAlertModalOpen(false)}
              className="absolute top-3 right-3 p-2 border border-[#DDE2E7] text-[#5F6B7A] hover:text-[#0B1F33] hover:bg-[#FAF8F3] rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {subscribedSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 bg-[#2A7A56] rounded-xl flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#10243A]">Subscription Active!</h3>
                <p className="text-xs text-[#5F6B7A]">
                  You'll receive alerts for <strong>{categoryInput}</strong>.
                </p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-[#F5E8CD] border border-[#D9A441]/40 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <Bell className="w-6 h-6 text-[#D9A441]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#10243A] mb-1">
                  Subscribe to Alerts
                </h3>
                <p className="text-xs text-[#5F6B7A] mb-5 leading-relaxed">
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
                    className="w-full bg-[#0B1F33] hover:bg-[#132B45] text-white py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
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

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Bell,
  Search,
  User,
  LogOut,
  Bookmark,
  PlusCircle,
  LayoutDashboard,
  Menu,
  X,
  FileText,
  Briefcase,
  GraduationCap,
  CalendarCheck,
  CheckCircle2,
  Loader2,
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

  const isNavActive = (path: string) => location.pathname === path;

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

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-navy-900 to-navy-800 text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md shadow-navy-900/20 group-hover:scale-105 transition-transform">
                N
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-tight text-navy-900 leading-tight">
                  Nitin Sir
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-emerald-800 uppercase">
                  Academic Alerts 2026
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 font-medium text-xs sm:text-sm text-slate-700">
              <Link
                to="/"
                className={`px-3.5 py-2 rounded-xl transition-colors ${
                  isNavActive('/') && !location.search
                    ? 'bg-navy-900 text-white font-semibold shadow-xs'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                Browse All
              </Link>

              <Link
                to="/?eventType=Conference"
                className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  location.search.includes('eventType=Conference')
                    ? 'bg-navy-900 text-white font-semibold shadow-xs'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <CalendarCheck className="w-4 h-4 text-emerald-700" />
                <span>Conferences</span>
              </Link>

              <Link
                to="/?eventType=Internship"
                className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  location.search.includes('eventType=Internship')
                    ? 'bg-navy-900 text-white font-semibold shadow-xs'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>Internships</span>
              </Link>

              <Link
                to="/?eventType=Call for Papers"
                className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  location.search.includes('eventType=Call%20for%20Papers')
                    ? 'bg-navy-900 text-white font-semibold shadow-xs'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <span>Call for Papers</span>
              </Link>

              <Link
                to="/resources"
                className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  isNavActive('/resources')
                    ? 'bg-navy-900 text-white font-semibold shadow-xs'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Resources</span>
              </Link>
            </nav>

            {/* Action Buttons & Profile */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => setAlertModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-all shadow-xs"
              >
                <Bell className="w-4 h-4 text-emerald-700" />
                <span>Get Alerts</span>
              </button>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="text-left text-xs">
                      <p className="font-semibold text-slate-900 leading-tight">{user?.name}</p>
                      <p className="text-[10px] text-slate-500 capitalize">{user?.role}</p>
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-navy-900 hover:bg-slate-50"
                        >
                          <LayoutDashboard className="w-4 h-4 text-navy-700" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left"
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
                    className="px-4 py-2 text-xs font-semibold text-navy-900 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2.5 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-850 rounded-xl shadow-md shadow-navy-900/10 transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Browse All Events
            </Link>
            <Link
              to="/?eventType=Conference"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Conferences
            </Link>
            <Link
              to="/?eventType=Internship"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Internships
            </Link>
            <Link
              to="/?eventType=Call for Papers"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Call for Papers
            </Link>
            <Link
              to="/resources"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Resource Library
            </Link>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-navy-900 bg-slate-50"
                  >
                    Admin Control Center
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-semibold text-red-600"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 text-sm font-semibold text-navy-900 bg-slate-100 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 text-sm font-semibold text-white bg-navy-900 rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Top-Level Modal Outside Header to ensure exact viewport centering & no stacking clipping */}
      {alertModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setAlertModalOpen(false);
          }}
          className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200 my-auto">
            <button
              onClick={() => setAlertModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {subscribedSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-navy-900">Subscription Active!</h3>
                <p className="text-xs text-slate-600">
                  You will now receive verified academic and internship alerts for <strong>{categoryInput}</strong>.
                </p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 shadow-sm">
                  <Bell className="w-6 h-6 text-emerald-700" />
                </div>
                <h3 className="font-serif text-xl font-bold text-navy-900 mb-1">
                  Subscribe to Academic Alerts
                </h3>
                <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                  Get verified notifications for upcoming Conferences, Research Internships, and Call for Papers directly in your inbox.
                </p>

                <form onSubmit={handleSubscribe} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="author@university.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Field of Interest</label>
                    <select
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800 bg-white font-medium text-slate-800"
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
                    className="w-full py-3 text-xs font-bold text-white bg-navy-900 hover:bg-navy-850 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
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

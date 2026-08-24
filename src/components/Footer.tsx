import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Globe, ShieldCheck, FileCheck, Award, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900 text-slate-300 pt-16 pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-navy-800/60">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-serif text-2xl font-bold">
                N
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold text-white tracking-tight">
                  Nitin Sir
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Academic Alerts 2026
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The premier platform for verified academic conference alerts, Scopus indexed journal updates, and research manuscript resources.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-800/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                Scopus & WOS Verified
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Browse All Conferences
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-emerald-400 transition-colors">
                  IEEE & Springer Templates
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-emerald-400 transition-colors">
                  Scopus Indexing Guide
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Author Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition-colors">
                  Register Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Disciplines */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Popular Disciplines
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/?category=Computer Science" className="hover:text-emerald-400 transition-colors">
                  Computer Science & AI
                </Link>
              </li>
              <li>
                <Link to="/?category=Medical & Healthcare" className="hover:text-emerald-400 transition-colors">
                  Medical & Bio-Engineering
                </Link>
              </li>
              <li>
                <Link to="/?category=Sustainable Energy" className="hover:text-emerald-400 transition-colors">
                  Sustainable Energy & Clean Tech
                </Link>
              </li>
              <li>
                <Link to="/?category=Engineering & Tech" className="hover:text-emerald-400 transition-colors">
                  Robotics & Automation
                </Link>
              </li>
              <li>
                <Link to="/?category=Business & Mgmt" className="hover:text-emerald-400 transition-colors">
                  FinTech & Digital Economy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Admin Portal */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Organizers & Admins
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you a conference organizer or committee member? Submit your event for verification and global listing.
            </p>
            <div className="pt-2">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-800 hover:bg-navy-700 text-white font-semibold text-xs rounded-xl border border-navy-700 transition-all shadow-sm"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Admin Control Center</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Nitin Sir Academic Portal. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Scopus Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

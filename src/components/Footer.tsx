import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Globe, ShieldCheck, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brutal-black text-white border-t-4 border-brutal-yellow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12 border-b-2 border-white/10">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brutal-yellow text-brutal-black flex items-center justify-center font-display text-2xl font-bold border-2 border-brutal-black">
                N
              </div>
              <div>
                <span className="font-display text-lg font-bold text-white block leading-tight">
                  Nitin Sir
                </span>
                <span className="text-[9px] font-bold text-brutal-yellow uppercase tracking-widest">
                  Academic Alerts 2026
                </span>
              </div>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              The premier platform for verified academic conference alerts, Scopus indexed journal updates, and research resources.
            </p>
            <span className="brutal-badge bg-brutal-green/20 text-brutal-green border-brutal-green">
              <ShieldCheck className="w-3 h-3" />
              Scopus & WOS Verified
            </span>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-brutal-yellow uppercase tracking-widest border-b-2 border-brutal-yellow/30 pb-2">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-white/60">
              {[
                { to: '/', label: 'Browse All Conferences' },
                { to: '/resources', label: 'Templates & Resources' },
                { to: '/login', label: 'Author Login' },
                { to: '/register', label: 'Register Account' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-brutal-yellow transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disciplines */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-brutal-yellow uppercase tracking-widest border-b-2 border-brutal-yellow/30 pb-2">
              Disciplines
            </h4>
            <ul className="space-y-2 text-xs text-white/60">
              {[
                { to: '/?category=Computer Science', label: 'Computer Science & AI' },
                { to: '/?category=Medical & Healthcare', label: 'Medical & Bio-Engineering' },
                { to: '/?category=Sustainable Energy', label: 'Clean Tech & Energy' },
                { to: '/?category=Engineering & Tech', label: 'Robotics & Automation' },
                { to: '/?category=Business & Mgmt', label: 'FinTech & Digital Economy' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-brutal-yellow transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-brutal-yellow uppercase tracking-widest border-b-2 border-brutal-yellow/30 pb-2">
              For Organizers
            </h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Conference organizer? Submit your event for verification and global listing.
            </p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-brutal-yellow hover:text-brutal-black text-white font-bold text-xs border-2 border-white/20 hover:border-brutal-black transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <p>© {new Date().getFullYear()} Nitin Sir Academic Portal. All Rights Reserved.</p>
          <div className="flex items-center gap-6 font-medium">
            <span className="hover:text-white/70 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white/70 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white/70 cursor-pointer transition-colors">Scopus Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

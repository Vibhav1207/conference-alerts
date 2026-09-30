import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B1F33] text-white border-t-2 border-[#D9A441]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12 border-b border-white/10">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#132B45] text-[#EBCB8B] flex items-center justify-center font-display text-xl font-bold border border-[#D9A441]/40 rounded-lg shadow-sm">
                PT
              </div>
              <div>
                <span className="font-display text-lg font-bold text-[#FAF8F3] block leading-tight">
                  Publication Track
                </span>
                <span className="text-[10px] font-bold text-[#D9A441] uppercase tracking-widest">
                  Academic Alerts 2026
                </span>
              </div>
            </div>
            <p className="text-xs text-[#8A94A3] leading-relaxed">
              The premier platform for verified academic conference alerts, Scopus indexed journal updates, and research resources.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-[#EBCB8B] uppercase tracking-widest border-b border-white/10 pb-2">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#8A94A3]">
              {[
                { to: '/', label: 'Browse All Conferences' },
                { to: '/resources', label: 'Templates & Resources' },
                { to: '/login', label: 'Author Login' },
                { to: '/register', label: 'Register Account' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-[#D9A441] transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disciplines */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-[#EBCB8B] uppercase tracking-widest border-b border-white/10 pb-2">
              Disciplines
            </h4>
            <ul className="space-y-2 text-xs text-[#8A94A3]">
              {[
                { to: '/?category=Computer Science', label: 'Computer Science & AI' },
                { to: '/?category=Medical & Healthcare', label: 'Medical & Bio-Engineering' },
                { to: '/?category=Sustainable Energy', label: 'Clean Tech & Energy' },
                { to: '/?category=Engineering & Tech', label: 'Robotics & Automation' },
                { to: '/?category=Business & Mgmt', label: 'FinTech & Digital Economy' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-[#D9A441] transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-[#EBCB8B] uppercase tracking-widest border-b border-white/10 pb-2">
              For Organizers
            </h4>
            <p className="text-xs text-[#8A94A3] leading-relaxed">
              Conference organizer? Submit your event for verification and global listing.
            </p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#132B45] hover:bg-[#D9A441] hover:text-[#0B1F33] text-[#FAF8F3] font-bold text-xs rounded-lg border border-white/10 hover:border-[#D9A441] transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A94A3] gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Publication Track Academic Portal. All Rights Reserved.</p>
            <span className="hidden sm:inline text-white/20">•</span>
            <p>
              Developed by{' '}
              <a
                href="https://vibhavpatel.site"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#EBCB8B] hover:text-[#FAF8F3] font-semibold underline decoration-[#D9A441]/50 underline-offset-4 hover:decoration-[#FAF8F3] transition-colors"
              >
                Vibhav Patel
              </a>
            </p>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <span className="hover:text-[#FAF8F3] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-[#FAF8F3] cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-[#FAF8F3] cursor-pointer transition-colors">Scopus Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

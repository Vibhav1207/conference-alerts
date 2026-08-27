import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, PlusCircle, FileText, LogOut, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Conferences', path: '/admin/conferences', icon: CalendarCheck },
    { label: 'Add Event', path: '/admin/conferences/new', icon: PlusCircle },
    { label: 'Resources', path: '/admin/resources', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-brutal-black text-white min-h-screen flex flex-col border-r-4 border-brutal-yellow">
      {/* Brand */}
      <div className="p-5 border-b-2 border-white/10">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brutal-yellow text-brutal-black flex items-center justify-center font-display font-bold text-xl border-2 border-brutal-black">
            N
          </div>
          <div>
            <span className="font-display font-bold text-white text-sm block leading-tight">
              Nitin Sir Admin
            </span>
            <span className="text-[9px] font-bold text-brutal-yellow uppercase tracking-widest">
              Control Center
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[9px] font-bold text-white/30 uppercase tracking-widest">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3.5 py-2.5 font-bold text-xs transition-all border-l-4 ${
                isActive
                  ? 'bg-brutal-yellow text-brutal-black border-brutal-yellow'
                  : 'text-white/60 hover:text-white hover:bg-white/5 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5" />}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t-2 border-white/10 space-y-2">
        <Link
          to="/"
          className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white/60 border-2 border-white/10 hover:bg-white/5 transition-colors"
        >
          <span>Return to Portal</span>
        </Link>
        <div className="flex items-center justify-between p-3 border-2 border-white/10">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 bg-brutal-yellow text-brutal-black flex items-center justify-center font-bold text-xs border-2 border-brutal-black flex-shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="truncate text-xs">
              <p className="font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 text-white/40 hover:text-brutal-red transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

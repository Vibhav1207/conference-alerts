import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  PlusCircle,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { label: 'Admin Control Center', path: '/admin', icon: LayoutDashboard },
    { label: 'Manage Conferences', path: '/admin/conferences', icon: CalendarCheck },
    { label: 'Add New Event', path: '/admin/conferences/new', icon: PlusCircle },
    { label: 'Resource Library', path: '/admin/resources', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-navy-950 text-slate-300 min-h-screen flex flex-col border-r border-navy-850">
      {/* Top Brand */}
      <div className="p-6 border-b border-navy-850/80">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-serif font-bold text-xl">
            N
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-white tracking-tight text-base">
              Nitin Sir Admin
            </span>
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">
              Control Center
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Main Dashboard
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-xs transition-all ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/40'
                  : 'text-slate-400 hover:bg-navy-850 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-200" />}
            </Link>
          );
        })}
      </div>

      {/* Admin User Card & Return */}
      <div className="p-4 border-t border-navy-850/80 space-y-3">
        <Link
          to="/"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold text-slate-300 bg-navy-850 hover:bg-navy-800 rounded-xl border border-navy-750 transition-colors"
        >
          <span>Return to Public Portal</span>
        </Link>

        <div className="flex items-center justify-between p-3 bg-navy-900/90 rounded-2xl border border-navy-850">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="truncate text-xs">
              <p className="font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-navy-850 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, PlusCircle, FileText, LogOut, ChevronRight, Menu, X, Tag, CircleUser,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminSidebarProps {
  mobileOpen: boolean;
  onToggle: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, onToggle }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'All Listings', path: '/admin/conferences', icon: CalendarCheck },
    { label: 'Add Event', path: '/admin/conferences/new', icon: PlusCircle },
    { label: 'Categories', path: '/admin/categories', icon: Tag },
    { label: 'Resources', path: '/admin/resources', icon: FileText },
  ];

  const sidebarContent = (
    <aside className="w-64 bg-[#0B1F33] text-white h-screen flex flex-col justify-between border-r border-white/10 overflow-y-auto">
      {/* Brand */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-3" onClick={onToggle}>
          <div className="w-9 h-9 bg-[#132B45] text-[#EBCB8B] flex items-center justify-center font-display font-bold text-sm border border-[#D9A441]/40 rounded-lg shadow-sm">
            PT
          </div>
          <div>
            <span className="font-display font-bold text-[#FAF8F3] text-sm block leading-tight">
              Publication Track Admin
            </span>
            <span className="text-[9px] font-bold text-[#D9A441] uppercase tracking-widest">
              Control Center
            </span>
          </div>
        </Link>
        <button onClick={onToggle} className="lg:hidden p-1.5 text-white/60 hover:text-white">
          <X className="w-5 h-5" />
        </button>
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
              onClick={onToggle}
              className={`flex items-center justify-between px-3.5 py-2.5 font-bold text-xs rounded-lg transition-all border-l-4 ${
                isActive
                  ? 'bg-[#132B45] text-[#FAF8F3] border-[#D9A441]'
                  : 'text-[#8A94A3] hover:text-[#FAF8F3] hover:bg-white/5 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D9A441]' : ''}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#D9A441]" />}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t-2 border-white/10 space-y-2">
        <Link
          to="/"
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white/60 border-2 border-white/10 hover:bg-white/5 transition-colors"
        >
          <span>Return to Portal</span>
        </Link>
        <div className="flex items-center justify-between p-3 border-2 border-white/10">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs border border-white/20 overflow-hidden flex-shrink-0">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <CircleUser className="w-6 h-6 text-slate-300" />
              )}
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

  return (
    <>
      {/* Desktop fixed sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen flex-shrink-0 z-30">{sidebarContent}</div>

      {/* Mobile overlay + drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-brutal-black/60 backdrop-blur-sm lg:hidden"
              onClick={onToggle}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

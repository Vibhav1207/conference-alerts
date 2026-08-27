import React from 'react';
import { ShieldCheck, PlusCircle, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onMenuToggle?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle, onMenuToggle }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-brutal-black text-white border-b-4 border-brutal-yellow px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3 min-w-0">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 border-2 border-white/20 hover:border-brutal-yellow transition-colors flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="font-display text-lg sm:text-xl font-bold text-white leading-tight truncate">
            {title}
          </h1>
          {subtitle && <p className="text-[10px] sm:text-[11px] text-white/50 mt-0.5 font-medium truncate">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <div className="hidden md:flex items-center gap-2 bg-brutal-green/20 text-brutal-green border-2 border-brutal-green/40 px-3 py-1.5 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>System Active</span>
        </div>
        <Link
          to="/admin/conferences/new"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-brutal-yellow text-brutal-black font-bold text-xs border-2 border-brutal-black shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Add Event</span>
        </Link>
      </div>
    </motion.header>
  );
};

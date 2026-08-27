import React from 'react';
import { ShieldCheck, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="bg-brutal-black text-white border-b-4 border-brutal-yellow px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-xl font-bold text-white leading-tight">
          {title}
        </h1>
        {subtitle && <p className="text-[11px] text-white/50 mt-0.5 font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-brutal-green/20 text-brutal-green border-2 border-brutal-green/40 px-3 py-1.5 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>System Active</span>
        </div>
        <Link
          to="/admin/conferences/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brutal-yellow text-brutal-black font-bold text-xs border-2 border-brutal-black shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Event</span>
        </Link>
      </div>
    </header>
  );
};

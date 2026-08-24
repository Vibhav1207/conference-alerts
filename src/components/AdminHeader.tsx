import React from 'react';
import { Bell, Search, PlusCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="font-serif text-2xl font-bold text-navy-900 leading-tight">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3 py-1.5 rounded-xl text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>System Verified & Active</span>
        </div>

        <Link
          to="/admin/conferences/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-800/10 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Event</span>
        </Link>
      </div>
    </header>
  );
};

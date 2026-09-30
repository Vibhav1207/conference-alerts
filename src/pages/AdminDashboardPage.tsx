import React, { useState, useEffect, useRef } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { AdminStats } from '../types';
import { adminAPI } from '../services/api';
import { Link } from 'react-router-dom';
import {
  CalendarCheck, Clock, FileText, Download, Users, PlusCircle, TrendingUp, ShieldCheck, ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await adminAPI.getStats();
        if (res.data.success) setStats(res.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#FAF8F3]">
        <AdminSidebar mobileOpen={mobileSidebarOpen} onToggle={() => setMobileSidebarOpen(false)} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0B1F33]/20 border-t-[#D9A441] rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#5F6B7A]">Loading metrics...</p>
        </div>
      </div>
    );
  }

  const m = stats?.metrics;

  const metricCards = [
    { label: 'Total Conferences', value: m?.totalConferences || 0, icon: CalendarCheck, color: 'bg-[#0B1F33] text-white border-[#0B1F33]', sub: `${m?.publishedConferences || 0} Published`, subColor: 'text-[#D9A441]' },
    { label: 'Pending Approvals', value: m?.pendingConferences || 0, icon: Clock, color: 'bg-[#132B45] text-[#EBCB8B] border-[#132B45]', sub: 'Requires Review', subColor: 'text-[#5F6B7A]' },
    { label: 'Total Resources', value: m?.totalResources || 0, icon: FileText, color: 'bg-[#FAF2DF] text-[#10243A] border-[#D9A441]/40', sub: `${m?.totalDownloads || 0} Downloads`, subColor: 'text-[#5F6B7A]' },
    { label: 'Registered Users', value: m?.totalUsers || 0, icon: Users, color: 'bg-[#0B1F33] text-[#FAF8F3] border-[#0B1F33]', sub: 'Active Subscribers', subColor: 'text-[#5F6B7A]' },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAF8F3]">
      <AdminSidebar mobileOpen={mobileSidebarOpen} onToggle={() => setMobileSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader title="Admin Dashboard" subtitle="System Overview & Event Management" onMenuToggle={() => setMobileSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 flex-1">
          {/* Stats Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            {metricCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div key={idx} variants={item} className="bg-white border border-[#DDE2E7] shadow-sm rounded-xl p-4 sm:p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#5F6B7A]">{card.label}</span>
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border ${card.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-[#10243A]">{card.value.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-[10px] font-semibold">
                    <TrendingUp className="w-3 h-3 text-[#D9A441]" />
                    <span className={card.subColor}>{card.sub}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Quick Actions & Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="bg-[#0B1F33] text-white border border-[#132B45] shadow-academic rounded-xl p-4 sm:p-5 space-y-4"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#D9A441]" />
                <h3 className="font-display text-sm font-bold text-[#FAF8F3]">Quick Actions</h3>
              </div>
              <p className="text-[11px] text-[#8A94A3] leading-relaxed">
                Publish events, manage records, or update author guides.
              </p>
              <div className="space-y-2 pt-2">
                <Link to="/admin/conferences/new" className="w-full flex items-center justify-between p-3 bg-[#D9A441] hover:bg-[#EBCB8B] text-[#0B1F33] font-bold text-xs rounded-lg shadow-sm transition-all">
                  <div className="flex items-center gap-2"><PlusCircle className="w-4 h-4" /><span>New Event</span></div>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link to="/admin/conferences" className="w-full flex items-center justify-between p-3 bg-white/5 text-white font-bold text-xs rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2"><CalendarCheck className="w-4 h-4 text-[#D9A441]" /><span>Manage Events</span></div>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </Link>
                <Link to="/admin/resources" className="w-full flex items-center justify-between p-3 bg-white/5 text-white font-bold text-xs rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-[#D9A441]" /><span>Resources</span></div>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </Link>
              </div>
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="bg-white border border-[#DDE2E7] shadow-sm rounded-xl p-4 sm:p-5 space-y-4 lg:col-span-2"
            >
              <h3 className="font-display text-sm font-bold text-[#10243A] border-b border-[#DDE2E7] pb-3">
                Conferences by Domain
              </h3>
              <div className="space-y-3">
                {stats?.categoryBreakdown?.map((cat) => {
                  const pct = Math.round((cat.count / (m?.totalConferences || 1)) * 100);
                  return (
                    <div key={cat._id} className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold text-[#10243A]">
                        <span>{cat._id}</span>
                        <span className="text-[#5F6B7A]">{cat.count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#FAF8F3] border border-[#DDE2E7] rounded-full overflow-hidden">
                        <div className="h-full bg-[#0B1F33] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Recent Submissions Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="bg-white border-3 border-brutal-black shadow-brutal overflow-hidden"
          >
            <div className="flex items-center justify-between border-b-3 border-brutal-black p-4 sm:p-5">
              <div className="min-w-0">
                <h3 className="font-display text-sm font-bold text-brutal-black">Recent Submissions</h3>
                <p className="text-[10px] text-brutal-black/50 font-medium">Latest events added to the system</p>
              </div>
              <Link to="/admin/conferences" className="text-[11px] font-bold text-brutal-blue hover:underline flex-shrink-0">View All →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="brutal-table">
                <thead>
                  <tr>
                    <th>Conference</th>
                    <th className="hidden sm:table-cell">Category</th>
                    <th className="hidden md:table-cell">Venue</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentSubmissions?.map((conf) => (
                    <tr key={conf._id}>
                      <td>
                        <span className="font-bold text-brutal-black block text-sm">{conf.acronym}</span>
                        <span className="text-brutal-black/50 truncate max-w-[200px] block text-[11px]">{conf.title}</span>
                      </td>
                      <td className="hidden sm:table-cell font-medium text-brutal-black/70">{conf.category}</td>
                      <td className="hidden md:table-cell text-brutal-black/60 text-[11px]">{conf.venue?.city}, {conf.venue?.country}</td>
                      <td>
                        <span className={`brutal-badge text-[9px] ${
                          conf.status === 'Published' ? 'bg-brutal-green/10 text-brutal-green border-brutal-green' :
                          conf.status === 'Pending' ? 'bg-brutal-orange/10 text-brutal-orange border-brutal-orange' :
                          'bg-brutal-cream text-brutal-black/60 border-brutal-black/20'
                        }`}>{conf.status}</span>
                      </td>
                      <td className="text-right">
                        <Link to={`/conference/${conf._id}`} className="font-bold text-brutal-blue text-xs hover:underline">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

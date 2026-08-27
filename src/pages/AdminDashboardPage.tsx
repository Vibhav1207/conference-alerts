import React, { useState, useEffect, useRef } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { AdminStats } from '../types';
import { adminAPI } from '../services/api';
import { Link } from 'react-router-dom';
import {
  CalendarCheck, Clock, FileText, Download, Users, PlusCircle, TrendingUp, ShieldCheck, ChevronRight,
} from 'lucide-react';
import { staggerReveal, animateCounter } from '../lib/animations';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const metricsRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (stats && metricsRef.current) {
      const counters = Array.from(metricsRef.current.querySelectorAll<HTMLElement>('[data-counter]'));
      counters.forEach((el) => {
        const target = parseInt(el.dataset.counter || '0', 10);
        animateCounter(el, target);
      });
      const cards = Array.from(metricsRef.current.querySelectorAll<HTMLElement>('.metric-card'));
      staggerReveal(cards);
    }
  }, [stats]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-brutal-cream">
        <AdminSidebar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-brutal-black border-t-brutal-yellow animate-spin" />
          <p className="text-xs font-bold text-brutal-black/50">Loading metrics...</p>
        </div>
      </div>
    );
  }

  const m = stats?.metrics;

  const metricCards = [
    { label: 'Total Conferences', value: m?.totalConferences || 0, icon: CalendarCheck, color: 'bg-brutal-yellow text-brutal-black border-brutal-yellow', sub: `${m?.publishedConferences || 0} Published`, subColor: 'text-brutal-green' },
    { label: 'Pending Approvals', value: m?.pendingConferences || 0, icon: Clock, color: 'bg-brutal-orange text-white border-brutal-orange', sub: 'Requires Review', subColor: 'text-brutal-black/50' },
    { label: 'Total Resources', value: m?.totalResources || 0, icon: FileText, color: 'bg-brutal-blue text-white border-brutal-blue', sub: `${m?.totalDownloads || 0} Downloads`, subColor: 'text-brutal-black/50' },
    { label: 'Registered Users', value: m?.totalUsers || 0, icon: Users, color: 'bg-brutal-green text-white border-brutal-green', sub: 'Active Subscribers', subColor: 'text-brutal-black/50' },
  ];

  return (
    <div className="flex min-h-screen bg-brutal-cream">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader title="Admin Dashboard" subtitle="System Overview & Event Management" />

        <main className="p-8 space-y-8 flex-1" ref={metricsRef}>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metricCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="metric-card bg-white border-3 border-brutal-black shadow-brutal p-5 space-y-2" style={{ opacity: 0 }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brutal-black/50">{card.label}</span>
                    <div className={`w-9 h-9 flex items-center justify-center border-2 border-brutal-black ${card.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="font-display text-3xl font-bold text-brutal-black" data-counter={card.value}>0</p>
                  <div className="flex items-center gap-1 text-[10px] font-bold">
                    <TrendingUp className="w-3 h-3" />
                    <span className={card.subColor}>{card.sub}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions & Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="bg-brutal-black text-white border-3 border-brutal-black shadow-brutal p-5 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brutal-yellow" />
                <h3 className="font-display text-sm font-bold">Quick Actions</h3>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                Publish events, manage records, or update author guides.
              </p>
              <div className="space-y-2 pt-2">
                <Link to="/admin/conferences/new" className="w-full flex items-center justify-between p-3 bg-brutal-yellow text-brutal-black font-bold text-xs border-2 border-brutal-black hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
                  <div className="flex items-center gap-2"><PlusCircle className="w-4 h-4" /><span>New Event</span></div>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link to="/admin/conferences" className="w-full flex items-center justify-between p-3 bg-white/5 text-white font-bold text-xs border-2 border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2"><CalendarCheck className="w-4 h-4" /><span>Manage Events</span></div>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </Link>
                <Link to="/admin/resources" className="w-full flex items-center justify-between p-3 bg-white/5 text-white font-bold text-xs border-2 border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2"><FileText className="w-4 h-4" /><span>Resources</span></div>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </Link>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white border-3 border-brutal-black shadow-brutal p-5 space-y-4 lg:col-span-2">
              <h3 className="font-display text-sm font-bold text-brutal-black border-b-3 border-brutal-black pb-3">
                Conferences by Domain
              </h3>
              <div className="space-y-3">
                {stats?.categoryBreakdown?.map((cat) => {
                  const pct = Math.round((cat.count / (m?.totalConferences || 1)) * 100);
                  return (
                    <div key={cat._id} className="space-y-1 text-xs">
                      <div className="flex justify-between font-bold text-brutal-black">
                        <span>{cat._id}</span>
                        <span className="text-brutal-black/50">{cat.count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-3 bg-brutal-cream border-2 border-brutal-black/20">
                        <div className="h-full bg-brutal-yellow border-r-2 border-brutal-black transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Submissions Table */}
          <div className="bg-white border-3 border-brutal-black shadow-brutal overflow-hidden">
            <div className="flex items-center justify-between border-b-3 border-brutal-black p-5">
              <div>
                <h3 className="font-display text-sm font-bold text-brutal-black">Recent Submissions</h3>
                <p className="text-[10px] text-brutal-black/50 font-medium">Latest events added to the system</p>
              </div>
              <Link to="/admin/conferences" className="text-[11px] font-bold text-brutal-blue hover:underline">View All →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="brutal-table">
                <thead>
                  <tr>
                    <th>Conference</th>
                    <th>Category</th>
                    <th>Venue</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentSubmissions?.map((conf) => (
                    <tr key={conf._id}>
                      <td>
                        <span className="font-bold text-brutal-black block text-sm">{conf.acronym}</span>
                        <span className="text-brutal-black/50 truncate max-w-xs block text-[11px]">{conf.title}</span>
                      </td>
                      <td className="font-medium text-brutal-black/70">{conf.category}</td>
                      <td className="text-brutal-black/60 text-[11px]">{conf.venue?.city}, {conf.venue?.country}</td>
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
          </div>
        </main>
      </div>
    </div>
  );
};

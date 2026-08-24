import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { AdminStats } from '../types';
import { adminAPI } from '../services/api';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Clock,
  FileText,
  Download,
  Users,
  PlusCircle,
  TrendingUp,
  Loader2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await adminAPI.getStats();
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-800" />
          <p className="text-xs font-semibold text-slate-600">Loading control center metrics...</p>
        </div>
      </div>
    );
  }

  const metrics = stats?.metrics;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Nitin Sir — Admin Control Center"
          subtitle="System Overview & Academic Event Management Console"
        />

        <main className="p-8 space-y-8 flex-1">
          {/* Top Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Conferences
                </span>
                <div className="w-9 h-9 rounded-xl bg-navy-100 text-navy-900 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5" />
                </div>
              </div>
              <p className="font-serif text-3xl font-bold text-navy-900">{metrics?.totalConferences || 0}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{metrics?.publishedConferences} Verified Published</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Pending Approvals
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <p className="font-serif text-3xl font-bold text-amber-900">{metrics?.pendingConferences || 0}</p>
              <p className="text-[11px] text-slate-500">Requires Committee Review</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Resources
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <p className="font-serif text-3xl font-bold text-emerald-900">{metrics?.totalResources || 0}</p>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>{metrics?.totalDownloads} Total Downloads</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Registered Users
                </span>
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="font-serif text-3xl font-bold text-slate-900">{metrics?.totalUsers || 0}</p>
              <p className="text-[11px] text-slate-500">Active Alert Subscribers</p>
            </div>
          </div>

          {/* Middle Row: Quick Actions & Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions Panel */}
            <div className="bg-navy-900 text-white rounded-3xl p-6 border border-navy-800 shadow-lg space-y-4 lg:col-span-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-serif text-lg font-bold text-white">Quick Operations</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Publish new conference events, edit Scopus indexing rules, or update downloadable author guides.
              </p>

              <div className="space-y-2.5 pt-2">
                <Link
                  to="/admin/conferences/new"
                  className="w-full flex items-center justify-between p-3.5 bg-emerald-800 hover:bg-emerald-700 rounded-xl font-bold text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <PlusCircle className="w-4 h-4" />
                    <span>Create New Event</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-200" />
                </Link>

                <Link
                  to="/admin/conferences"
                  className="w-full flex items-center justify-between p-3.5 bg-navy-800 hover:bg-navy-750 rounded-xl font-semibold text-xs transition-colors border border-navy-700"
                >
                  <div className="flex items-center gap-2.5">
                    <CalendarCheck className="w-4 h-4 text-slate-300" />
                    <span>Manage All Conferences</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  to="/admin/resources"
                  className="w-full flex items-center justify-between p-3.5 bg-navy-800 hover:bg-navy-750 rounded-xl font-semibold text-xs transition-colors border border-navy-700"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-slate-300" />
                    <span>Resource Library Manager</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>
            </div>

            {/* Category Breakdown Progress */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 lg:col-span-2">
              <h3 className="font-serif text-lg font-bold text-navy-900 border-b border-slate-100 pb-3">
                Conferences by Academic Domain
              </h3>

              <div className="space-y-4">
                {stats?.categoryBreakdown?.map((cat) => {
                  const percentage = Math.round((cat.count / (metrics?.totalConferences || 1)) * 100);
                  return (
                    <div key={cat._id} className="space-y-1.5 text-xs">
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>{cat._id}</span>
                        <span className="text-slate-500">
                          {cat.count} Conferences ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-800 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Submissions Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-navy-900">
                  Recent Submissions
                </h3>
                <p className="text-xs text-slate-500">Latest academic events added to the system</p>
              </div>
              <Link
                to="/admin/conferences"
                className="text-xs font-bold text-emerald-800 hover:underline"
              >
                View Full Table →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-3.5 rounded-l-xl">Conference Acronym & Title</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Venue</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 rounded-r-xl text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats?.recentSubmissions?.map((conf) => (
                    <tr key={conf._id} className="hover:bg-slate-50">
                      <td className="p-3.5">
                        <span className="font-bold text-navy-900 block">{conf.acronym}</span>
                        <span className="text-slate-500 truncate max-w-xs block">{conf.title}</span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-700">{conf.category}</td>
                      <td className="p-3.5 text-slate-600">
                        {conf.venue?.city}, {conf.venue?.country}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                            conf.status === 'Published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : conf.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {conf.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          to={`/conference/${conf._id}`}
                          className="font-bold text-navy-900 hover:underline"
                        >
                          View
                        </Link>
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

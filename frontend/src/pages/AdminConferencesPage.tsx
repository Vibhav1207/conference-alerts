import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { Conference, FilterState } from '../types';
import { conferenceAPI } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Archive,
  Eye,
  Loader2,
  Filter,
} from 'lucide-react';

export const AdminConferencesPage: React.FC = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchConferences = async () => {
    setLoading(true);
    try {
      const res = await conferenceAPI.getAdminConferences({
        status: activeTab === 'All' ? undefined : activeTab,
        search: searchTerm,
        limit: 50,
      });
      if (res.data.success) {
        setConferences(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin conferences:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConferences();
  }, [activeTab, searchTerm]);

  const handleStatusUpdate = async (id: string, status: 'Draft' | 'Pending' | 'Published' | 'Archived') => {
    try {
      await conferenceAPI.updateStatus(id, status);
      fetchConferences();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        await conferenceAPI.deleteConference(id);
        fetchConferences();
      } catch (err) {
        console.error('Failed to delete conference:', err);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Manage Conferences"
          subtitle="Review, approve, edit, and publish academic conference listings"
        />

        <main className="p-8 space-y-6 flex-1">
          {/* Top Bar: Tabs & Search */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {['All', 'Published', 'Pending', 'Draft', 'Archived'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-navy-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search acronym, title..."
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
              />
            </div>
          </div>

          {/* Conferences Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-800" />
                <p className="text-xs font-semibold text-slate-600">Loading conference records...</p>
              </div>
            ) : conferences.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No conferences found under this filter status.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <th className="p-4">Acronym & Title</th>
                      <th className="p-4">Category & Mode</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Submission Deadline</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {conferences.map((conf) => (
                      <tr key={conf._id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <span className="font-bold text-navy-900 block text-sm">{conf.acronym}</span>
                          <span className="text-slate-600 line-clamp-1 max-w-sm">{conf.title}</span>
                        </td>

                        <td className="p-4">
                          <span className="font-semibold text-slate-800 block">{conf.category}</span>
                          <span className="text-[10px] text-slate-500 uppercase">{conf.mode}</span>
                        </td>

                        <td className="p-4 text-slate-700">
                          {conf.venue.city}, {conf.venue.country}
                        </td>

                        <td className="p-4 font-medium text-slate-800">
                          {new Date(conf.dates.submissionDeadline).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                              conf.status === 'Published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : conf.status === 'Pending'
                                ? 'bg-amber-100 text-amber-800'
                                : conf.status === 'Draft'
                                ? 'bg-slate-200 text-slate-700'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {conf.status}
                          </span>
                        </td>

                        <td className="p-4 text-right space-x-1">
                          <Link
                            to={`/conference/${conf._id}`}
                            target="_blank"
                            title="View Public Page"
                            className="inline-flex p-1.5 text-slate-500 hover:text-navy-900 hover:bg-slate-100 rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => navigate(`/admin/conferences/edit/${conf._id}`)}
                            title="Edit Event"
                            className="inline-flex p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {conf.status !== 'Published' && (
                            <button
                              onClick={() => handleStatusUpdate(conf._id, 'Published')}
                              title="Approve & Publish"
                              className="inline-flex p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {conf.status !== 'Archived' && (
                            <button
                              onClick={() => handleStatusUpdate(conf._id, 'Archived')}
                              title="Archive Event"
                              className="inline-flex p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(conf._id, conf.title)}
                            title="Delete Event"
                            className="inline-flex p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

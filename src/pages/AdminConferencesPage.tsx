import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { Conference } from '../types';
import { conferenceAPI } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Edit, Trash2, CheckCircle, Archive, Eye, Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const rowVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }),
};

export const AdminConferencesPage: React.FC = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const fetchConferences = async () => {
    setLoading(true);
    try {
      const res = await conferenceAPI.getAdminConferences({
        status: activeTab === 'All' ? undefined : activeTab,
        search: searchTerm,
        limit: 50,
      });
      if (res.data.success) setConferences(res.data.data);
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
    <div className="flex min-h-screen bg-brutal-cream">
      <AdminSidebar mobileOpen={mobileSidebarOpen} onToggle={() => setMobileSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Manage Conferences"
          subtitle="Review, approve, edit, and publish academic conference listings"
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 flex-1">
          {/* Top Bar: Tabs & Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-3 border-brutal-black shadow-brutal p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4"
          >
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {['All', 'Published', 'Pending', 'Draft', 'Archived'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-4 py-2 text-xs font-bold transition-all whitespace-nowrap border-2 border-brutal-black ${
                    activeTab === tab
                      ? 'bg-brutal-black text-brutal-yellow shadow-brutal-sm'
                      : 'bg-white text-brutal-black hover:bg-brutal-cream'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-brutal-black/40 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search acronym, title..."
                className="brutal-input pl-9 pr-3.5 py-2 text-xs"
              />
            </div>
          </motion.div>

          {/* Conferences Data Table */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
            className="bg-white border-3 border-brutal-black shadow-brutal overflow-hidden"
          >
            {loading ? (
              <div className="py-16 sm:py-20 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-brutal-black border-t-brutal-yellow animate-spin" />
                <p className="text-xs font-bold text-brutal-black/50">Loading conference records...</p>
              </div>
            ) : conferences.length === 0 ? (
              <div className="p-8 sm:p-12 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 border-3 border-brutal-black bg-brutal-cream flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-7 h-7 sm:w-8 sm:h-8 text-brutal-black/30" />
                </div>
                <p className="text-sm font-bold text-brutal-black">No conferences found</p>
                <p className="text-xs text-brutal-black/50 mt-1">No results match the current filter status.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="brutal-table">
                  <thead>
                    <tr>
                      <th>Acronym & Title</th>
                      <th className="hidden lg:table-cell">Category & Mode</th>
                      <th className="hidden md:table-cell">Location</th>
                      <th className="hidden sm:table-cell">Deadline</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {conferences.map((conf, idx) => (
                        <motion.tr
                          key={conf._id}
                          custom={idx}
                          variants={rowVariant}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <td>
                            <span className="font-bold text-brutal-black block text-sm">{conf.acronym}</span>
                            <span className="text-brutal-black/50 line-clamp-1 max-w-[200px] lg:max-w-sm block text-[11px]">{conf.title}</span>
                          </td>

                          <td className="hidden lg:table-cell">
                            <span className="font-semibold text-brutal-black block text-xs">{conf.category}</span>
                            <span className="text-[10px] text-brutal-black/50 uppercase">{conf.mode}</span>
                          </td>

                          <td className="hidden md:table-cell text-brutal-black/70 text-xs">
                            {conf.venue.city}, {conf.venue.country}
                          </td>

                          <td className="hidden sm:table-cell font-medium text-brutal-black text-xs">
                            {new Date(conf.dates.submissionDeadline).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric',
                            })}
                          </td>

                          <td>
                            <span
                              className={`brutal-badge text-[9px] ${
                                conf.status === 'Published'
                                  ? 'bg-brutal-green/10 text-brutal-green border-brutal-green'
                                  : conf.status === 'Pending'
                                  ? 'bg-brutal-orange/10 text-brutal-orange border-brutal-orange'
                                  : conf.status === 'Draft'
                                  ? 'bg-brutal-cream text-brutal-black/60 border-brutal-black/20'
                                  : 'bg-brutal-red/10 text-brutal-red border-brutal-red'
                              }`}
                            >
                              {conf.status}
                            </span>
                          </td>

                          <td className="text-right space-x-1">
                            <Link
                              to={`/conference/${conf._id}`}
                              target="_blank"
                              title="View Public Page"
                              className="inline-flex p-1.5 text-brutal-black/50 hover:text-brutal-black hover:bg-brutal-cream transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => navigate(`/admin/conferences/edit/${conf._id}`)}
                              title="Edit Event"
                              className="inline-flex p-1.5 text-brutal-blue hover:bg-brutal-blue/10 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {conf.status !== 'Published' && (
                              <button
                                onClick={() => handleStatusUpdate(conf._id, 'Published')}
                                title="Approve & Publish"
                                className="inline-flex p-1.5 text-brutal-green hover:bg-brutal-green/10 transition-colors"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}

                            {conf.status !== 'Archived' && (
                              <button
                                onClick={() => handleStatusUpdate(conf._id, 'Archived')}
                                title="Archive Event"
                                className="inline-flex p-1.5 text-brutal-orange hover:bg-brutal-orange/10 transition-colors"
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(conf._id, conf.title)}
                              title="Delete Event"
                              className="inline-flex p-1.5 text-brutal-red hover:bg-brutal-red/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

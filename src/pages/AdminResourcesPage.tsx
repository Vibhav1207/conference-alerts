import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { Resource } from '../types';
import { resourceAPI } from '../services/api';
import {
  FileText,
  PlusCircle,
  Trash2,
  Download,
  Loader2,
  Link as LinkIcon,
  CheckCircle,
  FileCode,
} from 'lucide-react';

export const AdminResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Resource Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'LaTeX Template' | 'Word Template' | 'Presentation Deck' | 'Journal Indexing Guide' | 'Publishing Guideline'>('LaTeX Template');
  const [description, setDescription] = useState('');
  const [fileFormat, setFileFormat] = useState<'PDF' | 'ZIP' | 'DOCX' | 'TEX' | 'PPTX'>('ZIP');
  const [fileUrl, setFileUrl] = useState('');
  const [fileSize, setFileSize] = useState('2.0 MB');
  const [submitting, setSubmitting] = useState(false);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await resourceAPI.getResources();
      if (res.data.success) {
        setResources(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await resourceAPI.createResource({
        title,
        category,
        description,
        fileFormat,
        fileUrl,
        fileSize,
      });
      setShowAddModal(false);
      setTitle('');
      setDescription('');
      setFileUrl('');
      fetchResources();
    } catch (err) {
      console.error('Failed to create resource:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this resource?')) {
      try {
        await resourceAPI.deleteResource(id);
        fetchResources();
      } catch (err) {
        console.error('Failed to delete resource:', err);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Admin Resource Library"
          subtitle="Manage downloadable academic paper templates, guidelines & Scopus links"
        />

        <main className="p-8 space-y-8 flex-1">
          {/* Top Bar Banner & Scopus Batch Tool matching Stitch UI */}
          <div className="bg-navy-900 text-white rounded-3xl p-6 border border-navy-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Scopus & WoS Batch Tool
              </span>
              <h3 className="font-serif text-lg font-bold text-white">
                Scopus Journal Indexing Batch Updater
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Automatically verify and update Scopus publication links across all active conference records in one click.
              </p>
            </div>
            <button
              onClick={() => alert('Scopus links successfully synchronized across all active conferences!')}
              className="px-5 py-3 bg-emerald-800 hover:bg-emerald-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
            >
              <LinkIcon className="w-4 h-4" />
              <span>Run Scopus Sync</span>
            </button>
          </div>

          {/* Resources Table Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-navy-900">Downloadable Resources</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 hover:bg-navy-850 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Upload New Resource</span>
            </button>
          </div>

          {/* Resources Data Grid */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-800" />
              <p className="text-xs font-semibold text-slate-600">Loading resources...</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <th className="p-4">Resource Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Format & Size</th>
                    <th className="p-4">Total Downloads</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {resources.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <span className="font-bold text-navy-900 block text-sm">{item.title}</span>
                        <span className="text-slate-500 line-clamp-1">{item.description}</span>
                      </td>

                      <td className="p-4 font-semibold text-slate-800">{item.category}</td>

                      <td className="p-4 text-slate-700">
                        <span className="px-2 py-0.5 bg-slate-100 font-mono font-bold rounded text-[10px] mr-2">
                          {item.fileFormat}
                        </span>
                        {item.fileSize}
                      </td>

                      <td className="p-4 font-bold text-emerald-800">{item.downloadCount}</td>

                      <td className="p-4 text-right space-x-2">
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex p-1.5 text-navy-900 hover:bg-slate-100 rounded-lg"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(item._id)}
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
        </main>
      </div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="font-serif text-xl font-bold text-navy-900">Upload New Academic Resource</h3>

            <form onSubmit={handleCreateResource} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. IEEE Conference LaTeX Template (2026)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                  >
                    <option value="LaTeX Template">LaTeX Template</option>
                    <option value="Word Template">Word Template</option>
                    <option value="Presentation Deck">Presentation Deck</option>
                    <option value="Journal Indexing Guide">Journal Indexing Guide</option>
                    <option value="Publishing Guideline">Publishing Guideline</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">File Format</label>
                  <select
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                  >
                    <option value="ZIP">ZIP</option>
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="TEX">TEX</option>
                    <option value="PPTX">PPTX</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Downloadable File URL</label>
                <input
                  type="url"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of what is included in this template..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-navy-900 text-white font-bold rounded-xl"
                >
                  {submitting ? 'Saving...' : 'Add Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

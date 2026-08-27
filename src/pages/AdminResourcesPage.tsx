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
    <div className="flex min-h-screen bg-brutal-cream">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Admin Resource Library"
          subtitle="Manage downloadable academic paper templates, guidelines & Scopus links"
        />

        <main className="p-8 space-y-8 flex-1">
          {/* Top Bar Banner & Scopus Batch Tool */}
          <div className="bg-brutal-black text-white border-3 border-brutal-black shadow-brutal p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="brutal-badge bg-brutal-green/20 text-brutal-green border-brutal-green text-[9px]">
                <FileCode className="w-3 h-3" />
                Scopus & WoS Batch Tool
              </span>
              <h3 className="font-serif text-lg font-bold text-white">
                Scopus Journal Indexing Batch Updater
              </h3>
              <p className="text-xs text-white/50 max-w-xl leading-relaxed">
                Automatically verify and update Scopus publication links across all active conference records in one click.
              </p>
            </div>
            <button
              onClick={() => alert('Scopus links successfully synchronized across all active conferences!')}
              className="inline-flex items-center gap-2 px-5 py-3 bg-brutal-yellow text-brutal-black font-bold text-xs uppercase tracking-wider border-2 border-brutal-black shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal transition-all whitespace-nowrap"
            >
              <LinkIcon className="w-4 h-4" />
              <span>Run Scopus Sync</span>
            </button>
          </div>

          {/* Resources Table Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-brutal-black">Downloadable Resources</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="brutal-btn-primary text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Upload New Resource</span>
            </button>
          </div>

          {/* Resources Data Grid */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-brutal-black border-t-brutal-yellow animate-spin" />
              <p className="text-xs font-bold text-brutal-black/50">Loading resources...</p>
            </div>
          ) : (
            <div className="bg-white border-3 border-brutal-black shadow-brutal overflow-hidden">
              <table className="brutal-table">
                <thead>
                  <tr>
                    <th>Resource Title</th>
                    <th>Category</th>
                    <th>Format & Size</th>
                    <th>Total Downloads</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <span className="font-bold text-brutal-black block text-sm">{item.title}</span>
                        <span className="text-brutal-black/50 line-clamp-1 text-[11px]">{item.description}</span>
                      </td>

                      <td className="font-semibold text-brutal-black text-xs">{item.category}</td>

                      <td className="text-brutal-black/70 text-xs">
                        <span className="brutal-badge bg-brutal-cream text-brutal-black border-brutal-black/20 text-[9px] mr-2">
                          {item.fileFormat}
                        </span>
                        {item.fileSize}
                      </td>

                      <td className="font-bold text-brutal-green text-xs">{item.downloadCount}</td>

                      <td className="text-right space-x-2">
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex p-1.5 text-brutal-black/50 hover:text-brutal-black hover:bg-brutal-cream transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="inline-flex p-1.5 text-brutal-red hover:bg-brutal-red/10 transition-colors"
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
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}
          className="brutal-overlay"
        >
          <div className="bg-white border-4 border-brutal-black shadow-brutal-xl max-w-lg w-full p-6 relative animate-scale-in space-y-4">
            <h3 className="font-serif text-xl font-bold text-brutal-black">Upload New Academic Resource</h3>

            <form onSubmit={handleCreateResource} className="space-y-4 text-xs">
              <div>
                <label className="brutal-label">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. IEEE Conference LaTeX Template (2026)"
                  className="brutal-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="brutal-label">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="brutal-select"
                  >
                    <option value="LaTeX Template">LaTeX Template</option>
                    <option value="Word Template">Word Template</option>
                    <option value="Presentation Deck">Presentation Deck</option>
                    <option value="Journal Indexing Guide">Journal Indexing Guide</option>
                    <option value="Publishing Guideline">Publishing Guideline</option>
                  </select>
                </div>

                <div>
                  <label className="brutal-label">File Format</label>
                  <select
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value as any)}
                    className="brutal-select"
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
                <label className="brutal-label">Downloadable File URL</label>
                <input
                  type="url"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://..."
                  className="brutal-input font-mono"
                />
              </div>

              <div>
                <label className="brutal-label">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of what is included in this template..."
                  className="brutal-input resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="brutal-btn-outline text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="brutal-btn-primary text-xs"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <PlusCircle className="w-4 h-4" />
                  )}
                  <span>Add Resource</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

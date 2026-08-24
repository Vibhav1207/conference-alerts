import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Resource } from '../types';
import { resourceAPI } from '../services/api';
import {
  FileText,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Loader2,
  FileCode,
  FileSpreadsheet,
} from 'lucide-react';

export const ResourceLibraryPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await resourceAPI.getResources({
        category: selectedCategory,
        search: searchTerm,
      });
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
  }, [selectedCategory, searchTerm]);

  const handleDownload = async (id: string, fileUrl: string) => {
    try {
      await resourceAPI.downloadResource(id);
      window.open(fileUrl, '_blank');
      fetchResources();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const getFormatBadge = (format: string) => {
    switch (format) {
      case 'TEX':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DOCX':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PPTX':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-navy-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Academic Author Center</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Academic Resource & Template Library
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Download free IEEE LaTeX double-column templates, Springer LNCS Word formatting guides, Scopus journal verification checklists, and presentation decks.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto bg-white rounded-2xl p-2 shadow-xl border border-white/20 flex items-center gap-2 mt-6">
            <div className="flex-1 flex items-center gap-2 px-3 py-1">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates, IEEE, Scopus checklist..."
                className="w-full text-xs text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 space-y-8">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            'All',
            'LaTeX Template',
            'Word Template',
            'Presentation Deck',
            'Journal Indexing Guide',
            'Publishing Guideline',
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-navy-900 text-white shadow-md shadow-navy-900/10'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resource Cards */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-800" />
            <p className="text-xs font-semibold text-slate-600">Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-navy-900">No Resources Found</h3>
            <p className="text-xs text-slate-500">No downloadable resource matches your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-academic p-6 flex flex-col justify-between space-y-4 hover:shadow-academic-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${getFormatBadge(
                        item.fileFormat
                      )}`}
                    >
                      {item.fileFormat}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">{item.fileSize}</span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-navy-900 leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-semibold text-slate-500">
                    {item.downloadCount} Downloads
                  </span>

                  <button
                    onClick={() => handleDownload(item._id, item.fileUrl)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-800/10 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

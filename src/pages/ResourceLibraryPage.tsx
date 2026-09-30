import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Resource } from '../types';
import { resourceAPI } from '../services/api';
import { Download, Search, BookOpen, Sparkles } from 'lucide-react';
import { staggerReveal } from '../lib/animations';

export const ResourceLibraryPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await resourceAPI.getResources({ category: selectedCategory, search: searchTerm });
      if (res.data.success) setResources(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchResources(); }, [selectedCategory, searchTerm]);

  useEffect(() => {
    if (gridRef.current && resources.length > 0) {
      const cards = Array.from(gridRef.current.querySelectorAll<HTMLElement>('.resource-card'));
      setTimeout(() => staggerReveal(cards), 100);
    }
  }, [resources]);

  const handleDownload = async (id: string, fileUrl: string) => {
    try { await resourceAPI.downloadResource(id); window.open(fileUrl, '_blank'); fetchResources(); }
    catch (err) { console.error(err); }
  };

  const formatBadge = (format: string) => {
    switch (format) {
      case 'TEX': return 'bg-purple-100 text-purple-800 border-purple-500';
      case 'DOCX': return 'bg-brutal-blue/10 text-brutal-blue border-brutal-blue';
      case 'PPTX': return 'bg-brutal-orange/10 text-brutal-orange border-brutal-orange';
      default: return 'bg-brutal-green/10 text-brutal-green border-brutal-green';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brutal-cream">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0B1F33] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#D9A441]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9A441]/5 rounded-full blur-3xl -translate-y-16 translate-x-16" />
        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F5E8CD] text-[#10243A] rounded-full border border-[#D9A441]/40 font-bold text-[10px] uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            <span>Author Center</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Resource & Template Library
          </h1>
          <p className="text-[#8A94A3] text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Download free IEEE LaTeX templates, Springer LNCS guides, Scopus checklists, and presentation decks.
          </p>
          <div className="max-w-xl mx-auto bg-white border border-[#DDE2E7] rounded-xl shadow-sm p-2 flex items-center gap-2 mt-6">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-4 h-4 text-[#8A94A3]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates, IEEE, Scopus..."
                className="w-full text-sm text-[#10243A] bg-transparent focus:outline-none placeholder:text-[#8A94A3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 space-y-8">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {['All', 'LaTeX Template', 'Word Template', 'Presentation Deck', 'Journal Indexing Guide', 'Publishing Guideline'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                selectedCategory === cat
                  ? 'bg-[#F5E8CD] text-[#10243A] border-[#D9A441] shadow-sm'
                  : 'bg-white text-[#10243A] border-[#DDE2E7] hover:bg-[#FAF2DF]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-[#0B1F33]/20 border-t-[#D9A441] rounded-full animate-spin" />
            <p className="text-xs font-semibold text-[#5F6B7A]">Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="bg-white border border-[#DDE2E7] shadow-sm rounded-xl p-12 text-center space-y-3 max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-[#8A94A3] mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#10243A]">No Resources Found</h3>
            <p className="text-xs text-[#5F6B7A]">No resource matches your criteria.</p>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {resources.map((item) => (
              <div key={item._id} className="resource-card bg-white border border-[#DDE2E7] shadow-sm rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-[#D9A441]/50 hover:shadow-academic transition-all" style={{ opacity: 0 }}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded bg-[#FAF8F3] text-[#10243A] border border-[#DDE2E7]">{item.fileFormat}</span>
                    <span className="text-[10px] font-medium text-[#8A94A3]">{item.fileSize}</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#10243A] leading-snug line-clamp-2">{item.title}</h3>
                  <p className="text-xs text-[#5F6B7A] line-clamp-3 leading-relaxed">{item.description}</p>
                </div>
                <div className="pt-3 border-t border-[#DDE2E7] flex items-center justify-between gap-3">
                  <span className="text-[10px] font-medium text-[#8A94A3]">{item.downloadCount} Downloads</span>
                  <button
                    onClick={() => handleDownload(item._id, item.fileUrl)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B1F33] hover:bg-[#132B45] text-white font-bold text-xs rounded-lg shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-[#EBCB8B]" />
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

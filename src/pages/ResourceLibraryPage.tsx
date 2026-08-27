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
      <section className="bg-brutal-black text-white py-14 px-4 sm:px-6 lg:px-8 border-b-6 border-brutal-yellow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brutal-yellow/5 -rotate-12 translate-x-16 -translate-y-16" />
        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brutal-yellow text-brutal-black border-2 border-brutal-black font-bold text-[10px] uppercase tracking-widest shadow-brutal-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Author Center</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Resource & Template Library
          </h1>
          <p className="text-white/50 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Download free IEEE LaTeX templates, Springer LNCS guides, Scopus checklists, and presentation decks.
          </p>
          <div className="max-w-xl mx-auto bg-white border-4 border-brutal-black shadow-brutal-lg p-2 flex items-center gap-2 mt-6">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-4 h-4 text-brutal-black/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates, IEEE, Scopus..."
                className="w-full text-sm text-brutal-black bg-transparent focus:outline-none placeholder:text-brutal-black/30"
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
              className={`px-4 py-2 text-xs font-bold border-2 border-brutal-black transition-all ${
                selectedCategory === cat
                  ? 'bg-brutal-black text-brutal-yellow shadow-brutal-sm'
                  : 'bg-white text-brutal-black hover:bg-brutal-cream shadow-brutal-sm hover:shadow-brutal'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-brutal-black border-t-brutal-yellow animate-spin" />
            <p className="text-xs font-bold text-brutal-black/50">Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="bg-white border-3 border-brutal-black shadow-brutal p-12 text-center space-y-3 max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-brutal-black/30 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-brutal-black">No Resources Found</h3>
            <p className="text-xs text-brutal-black/50">No resource matches your criteria.</p>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {resources.map((item) => (
              <div key={item._id} className="resource-card bg-white border-3 border-brutal-black shadow-brutal p-5 flex flex-col justify-between space-y-4 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-lg transition-all" style={{ opacity: 0 }}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`brutal-badge border-2 ${formatBadge(item.fileFormat)}`}>{item.fileFormat}</span>
                    <span className="text-[10px] font-bold text-brutal-black/40">{item.fileSize}</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-brutal-black leading-snug line-clamp-2">{item.title}</h3>
                  <p className="text-xs text-brutal-black/60 line-clamp-3 leading-relaxed">{item.description}</p>
                </div>
                <div className="pt-3 border-t-2 border-brutal-black/10 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold text-brutal-black/40">{item.downloadCount} Downloads</span>
                  <button
                    onClick={() => handleDownload(item._id, item.fileUrl)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-brutal-green text-white font-bold text-xs border-2 border-brutal-black shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal transition-all"
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

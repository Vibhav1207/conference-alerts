import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ConferenceCard } from '../components/ConferenceCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { Conference, FilterState } from '../types';
import { conferenceAPI } from '../services/api';
import {
  Search, Globe, Loader2, CheckCircle2, Bell, Cpu, HeartPulse, Leaf,
  Layers, Briefcase, GraduationCap, FlaskConical, MapPin, Calendar, BookOpen, ArrowRight, Zap,
} from 'lucide-react';
import { staggerReveal, setupScrollReveal } from '../lib/animations';
import { PUBLISHER_LOGOS } from '../utils/logos';

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const eventTypeParam = searchParams.get('eventType') || 'All';
  const categoryParam = searchParams.get('category') || 'All';

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: categoryParam,
    eventType: eventTypeParam,
    continent: 'All',
    country: 'All',
    city: 'All',
    mode: 'All',
    month: 'All',
    page: 1,
    limit: 6,
    sortBy: 'createdAt',
    order: 'desc',
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const eventGridRef = useRef<HTMLDivElement>(null);
  const listingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, eventType: eventTypeParam, category: categoryParam, page: 1 }));
  }, [eventTypeParam, categoryParam]);

  // Auto-scroll to listings when filters change from URL params
  useEffect(() => {
    if ((eventTypeParam !== 'All' || categoryParam !== 'All') && listingsRef.current) {
      setTimeout(() => {
        listingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [eventTypeParam, categoryParam]);

  // Scroll reveal
  useEffect(() => {
    if (!scrollRef.current) return;
    const els = Array.from(scrollRef.current.querySelectorAll<HTMLElement>('[data-reveal]'));
    const cleanup = setupScrollReveal(els);
    return () => { if (typeof cleanup === 'function') cleanup(); };
  }, [conferences]);

  // Stagger card animations
  useEffect(() => {
    if (eventGridRef.current && conferences.length > 0) {
      const cards = Array.from(eventGridRef.current.querySelectorAll<HTMLElement>('.conf-card'));
      setTimeout(() => staggerReveal(cards), 100);
    }
  }, [conferences]);

  const fetchConferences = useCallback(async () => {
    setLoading(true);
    try {
      const res = await conferenceAPI.getConferences(filters);
      if (res.data.success) {
        setConferences(res.data.data);
        setTotal(res.data.pagination.total);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchConferences(); }, [fetchConferences]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setFilters({
      search: '', category: 'All', eventType: 'All', continent: 'All', country: 'All',
      city: 'All', mode: 'All', month: 'All', page: 1, limit: 6, sortBy: 'createdAt', order: 'desc',
    });
  };

  const continents = ['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Australia / Oceania'];

  const topics = [
    { label: 'Engineering & Tech', icon: Cpu },
    { label: 'Physical & Life Sciences', icon: FlaskConical },
    { label: 'Agricultural & Biological Sciences', icon: Leaf },
    { label: 'Medical & Health Sciences', icon: HeartPulse },
    { label: 'Business & Management', icon: BookOpen },
    { label: 'Arts & Humanities', icon: GraduationCap },
    { label: 'Social Sciences', icon: Layers },
  ];

  const eventTabs = [
    { label: 'All', icon: Zap },
    { label: 'Journals', icon: GraduationCap },
    { label: 'Conference', icon: Calendar },
    { label: 'Internship', icon: Briefcase },
    { label: 'Workshop / Seminar', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3]" ref={scrollRef}>
      <Navbar />

      {/* ═══ HERO SECTION ═══ */}
      <section className="bg-[#FAF8F3] text-[#10243A] relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#DDE2E7]">
        {/* Subtle abstract geometric decorations matching the reference */}
        {/* Left Side: Navy Arc, Gold Contour Arc & Muted Gold Dots */}
        <div className="absolute -bottom-24 -left-20 w-72 h-72 md:w-96 md:h-96 rounded-full bg-[#0B1F33] opacity-95 pointer-events-none" />
        <div className="absolute -bottom-28 -left-16 w-80 h-80 md:w-[26rem] md:h-[26rem] rounded-full border border-[#D9A441]/35 pointer-events-none" />
        <div className="absolute top-10 left-4 md:left-14 pointer-events-none opacity-60">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <defs>
              <pattern id="dot-pattern-left" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="1.5" fill="#D9A441" />
              </pattern>
            </defs>
            <rect width="72" height="72" fill="url(#dot-pattern-left)" />
          </svg>
        </div>

        {/* Right Side: Navy Arc, Champagne Arc & Gold Matrix Dots */}
        <div className="absolute -top-24 -right-20 w-72 h-72 md:w-96 md:h-96 rounded-full bg-[#0B1F33] opacity-95 pointer-events-none" />
        <div className="absolute -bottom-28 -right-16 w-80 h-80 md:w-[26rem] md:h-[26rem] rounded-full bg-[#F5E8CD]/60 pointer-events-none" />
        <div className="absolute -top-20 -right-12 w-80 h-80 md:w-[26rem] md:h-[26rem] rounded-full border border-[#D9A441]/30 pointer-events-none" />
        <div className="absolute top-20 right-4 md:right-14 pointer-events-none opacity-80 z-10">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <defs>
              <pattern id="dot-pattern-right" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="1.5" fill="#D9A441" />
              </pattern>
            </defs>
            <rect width="72" height="72" fill="url(#dot-pattern-right)" />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-20 space-y-6">
          {/* Subtle Champagne Gold Hub Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F5E8CD] text-[#10243A] border border-[#D9A441]/40 rounded-md font-bold text-[10px] uppercase tracking-widest shadow-sm">
            <Zap className="w-3.5 h-3.5 text-[#D9A441] fill-[#D9A441]" />
            <span>Publication Track — Academic Information Hub 2026</span>
          </div>

          {/* Large Editorial Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#10243A] tracking-tight leading-[1.15] max-w-4xl mx-auto text-balance">
            Discover Verified{' '}
            <span className="bg-[#E5C384] text-[#10243A] px-3.5 py-0.5 rounded-lg inline-block font-serif shadow-sm">
              Academic
            </span>{' '}
            Conferences,{' '}
            <span className="bg-[#0B1F33] text-white px-3.5 py-0.5 rounded-lg inline-block font-serif shadow-sm">
              Internships
            </span>{' '}
            & Call for Papers
          </h1>

          <p className="text-[#5F6B7A] text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-sans">
            The single informational portal to search international symposia, research fellowships, paper submission deadlines, and direct official application links.
          </p>

          {/* Event Type Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            {eventTabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = filters.eventType === tab.label;
              return (
                <button
                  key={tab.label}
                  onClick={() => handleFilterChange({ eventType: tab.label, page: 1 })}
                  className={`px-4 py-2.5 text-xs rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm border ${
                    isSelected
                      ? 'bg-[#E5C384] text-[#10243A] border-[#D9A441]/60 shadow-[0_2px_8px_-1px_rgba(217,164,65,0.3)]'
                      : 'bg-white text-[#10243A] border-[#DDE2E7] hover:bg-[#FAF2DF] hover:border-[#D9A441]/30'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-[#10243A]' : 'text-[#5F6B7A]'}`} />
                  <span>{tab.label === 'All' ? 'All Events' : tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white border border-[#DDE2E7] rounded-2xl shadow-[0_4px_25px_-3px_rgba(11,31,51,0.06)] p-2 flex flex-col sm:flex-row items-stretch gap-2 mt-4">
            <div className="flex-1 flex items-center gap-3 px-3 py-1.5">
              <Search className="w-5 h-5 text-[#5F6B7A] flex-shrink-0" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value, page: 1 })}
                placeholder="Search by topic, keyword, city, country, or acronym..."
                className="w-full text-sm text-[#10243A] bg-transparent focus:outline-none placeholder:text-[#8A94A3] font-medium"
              />
            </div>
            <button
              onClick={fetchConferences}
              className="w-full sm:w-auto px-6 py-3 bg-[#0B1F33] hover:bg-[#132B45] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 flex-shrink-0"
            >
              <Search className="w-4 h-4 text-white" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══ INFO NOTICE ═══ */}
      <section className="bg-[#F5E8CD]/50 border-b border-[#DDE2E7] py-3 px-4 text-center text-xs text-[#10243A] font-medium flex items-center justify-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-[#D9A441] flex-shrink-0" />
        <span>
          Official Informational Portal: Click <strong className="font-bold text-[#0B1F33]">"Apply"</strong> to visit the verified official organizer portal.
        </span>
      </section>

      {/* ═══ PUBLISHER & INDEXING LOGOS SLIDER ═══ */}
      <section className="bg-white border-b border-[#DDE2E7] py-4 overflow-hidden relative shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#10243A] uppercase tracking-wider">
            <span className="w-2.5 h-2.5 bg-[#D9A441] rounded-full inline-block animate-pulse" />
            <span>Indexing & Publishing Index Partners</span>
          </div>
          <span className="text-[10px] font-bold text-[#8A94A3] uppercase font-mono hidden sm:inline">
            Verified Academic Databases & Publishing Indexes
          </span>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee-left flex items-center gap-4 py-1.5 px-2">
            {[...PUBLISHER_LOGOS, ...PUBLISHER_LOGOS, ...PUBLISHER_LOGOS].map((logo, idx) => (
              <div
                key={`${logo.id}-${idx}`}
                className="w-60 flex-shrink-0 bg-[#FAF8F3] border border-[#DDE2E7] rounded-xl p-3 shadow-subtle hover:border-[#D9A441]/60 hover:bg-[#FAF2DF] transition-all flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-14 h-10 bg-white border border-[#DDE2E7] rounded-md p-1 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                  <img src={logo.src} alt={logo.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="overflow-hidden min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-xs text-[#10243A] truncate">{logo.shortName}</h4>
                    <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-[#0B1F33] text-white rounded uppercase flex-shrink-0">
                      Verified
                    </span>
                  </div>
                  <p className="text-[9px] font-mono text-[#5F6B7A] truncate">{logo.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTINENTS ═══ */}
      <section className="py-8 bg-[#FAF8F3] border-b border-[#DDE2E7]" data-reveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#10243A] flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#D9A441]" />
                Browse by Continent
              </h2>
              <p className="text-[11px] text-[#5F6B7A] mt-0.5 font-medium">Filter conferences & symposia by region</p>
            </div>
            {filters.continent !== 'All' && (
              <button
                onClick={() => handleFilterChange({ continent: 'All', country: 'All', city: 'All', page: 1 })}
                className="text-[11px] font-bold text-[#C53030] hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {continents.map((cont) => {
              const isSelected = filters.continent === cont;
              return (
                <button
                  key={cont}
                  onClick={() => handleFilterChange({ continent: cont, country: 'All', city: 'All', page: 1 })}
                  className={`p-3 border rounded-xl text-center transition-all ${
                    isSelected
                      ? 'bg-[#0B1F33] text-white border-[#0B1F33] shadow-sm'
                      : 'bg-white hover:bg-[#FAF2DF] hover:border-[#D9A441]/40 text-[#10243A] border-[#DDE2E7] shadow-subtle'
                  }`}
                >
                  <MapPin className={`w-4 h-4 mx-auto mb-1 ${isSelected ? 'text-[#D9A441]' : 'text-[#8A94A3]'}`} />
                  <span className="font-bold text-[11px] block truncate">{cont}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ TOPICS ═══ */}
      <section className="py-10 bg-white border-b border-[#DDE2E7]" data-reveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="font-serif text-xl font-bold text-[#10243A]">
              Academic Topics & Fields
            </h2>
            <p className="text-[11px] text-[#5F6B7A] mt-1 font-medium">
              Select your domain to filter conferences, internships, and call for papers.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {topics.map((item) => {
              const Icon = item.icon;
              const isSelected = filters.category === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => handleFilterChange({ category: item.label, page: 1 })}
                  className={`p-3.5 border rounded-xl text-left transition-all group ${
                    isSelected
                      ? 'bg-[#F5E8CD] text-[#10243A] border-[#D9A441]/60 shadow-sm'
                      : 'bg-[#FAF8F3] hover:bg-[#FAF2DF] hover:border-[#D9A441]/40 text-[#10243A] border-[#DDE2E7] shadow-subtle'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 border transition-all ${
                    isSelected
                      ? 'bg-white text-[#D9A441] border-[#D9A441]/30 shadow-sm'
                      : 'bg-white text-[#10243A] border-[#DDE2E7] group-hover:border-[#D9A441]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-[11px] leading-tight line-clamp-2">{item.label}</h3>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ MAIN CONTENT ═══ */}
      <section ref={listingsRef} className="py-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} />
          </div>

          {/* Events Grid */}
          <div className="lg:col-span-3 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE2E7]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#10243A]">
                  {filters.eventType === 'All' ? 'All Academic Listings' : filters.eventType}
                </h3>
                <p className="text-[11px] text-[#5F6B7A] font-medium">
                  Showing <strong className="text-[#10243A]">{conferences.length}</strong> of{' '}
                  <strong className="text-[#10243A]">{total}</strong> verified listings
                </p>
              </div>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                className="brutal-select text-xs py-2 px-3 w-auto"
              >
                <option value="createdAt">Recent</option>
                <option value="dates.submissionDeadline">Deadline</option>
                <option value="viewsCount">Most Viewed</option>
              </select>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-3 border-[#DDE2E7] border-t-[#0B1F33] rounded-full animate-spin" />
                <p className="text-xs font-bold text-[#5F6B7A]">Loading verified events...</p>
              </div>
            ) : conferences.length === 0 ? (
              <div className="bg-white border border-[#DDE2E7] rounded-xl shadow-subtle p-12 text-center space-y-4">
                <div className="w-16 h-16 border border-[#DDE2E7] rounded-full bg-[#FAF8F3] flex items-center justify-center mx-auto text-[#8A94A3]">
                  <Search className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#10243A]">No Results Found</h4>
                <p className="text-xs text-[#5F6B7A] max-w-sm mx-auto">
                  No listing matches your current filters. Try adjusting your search criteria.
                </p>
                <button onClick={handleResetFilters} className="brutal-btn-primary text-xs">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div ref={eventGridRef} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {conferences.map((conf) => (
                  <div key={conf._id} className="conf-card" style={{ opacity: 0 }}>
                    <ConferenceCard conference={conf} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ SUBSCRIBE BANNER ═══ */}
      <section className="bg-[#0B1F33] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-[#132B45]" data-reveal>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-12 h-12 bg-[#D9A441] rounded-xl flex items-center justify-center mx-auto shadow-sm text-[#0B1F33]">
            <Bell className="w-6 h-6 text-[#0B1F33]" />
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold">
            Stay Updated with{' '}
            <span className="text-[#EBCB8B]">Verified Alerts</span>
          </h2>
          <p className="text-[#8A94A3] text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Get instant email notifications for new international research fellowships, paper deadlines, and conferences.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="your@email.edu"
              className="flex-1 px-4 py-3 text-sm border border-[#132B45] rounded-lg bg-white text-[#10243A] placeholder-[#8A94A3] focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
            />
            <button className="px-6 py-3 bg-[#D9A441] hover:bg-[#EBCB8B] text-[#0B1F33] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

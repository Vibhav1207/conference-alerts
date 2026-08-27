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
      city: 'All', mode: 'All', page: 1, limit: 6, sortBy: 'createdAt', order: 'desc',
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
    <div className="min-h-screen flex flex-col bg-brutal-cream" ref={scrollRef}>
      <Navbar />

      {/* ═══ HERO SECTION ═══ */}
      <section className="bg-brutal-black text-white relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b-6 border-brutal-yellow">
        {/* Decorative geometric elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brutal-yellow/5 -rotate-12 translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brutal-blue/5 rotate-12 -translate-x-10 translate-y-10" />
        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-brutal-yellow rotate-45" />
        <div className="absolute top-1/3 left-1/6 w-3 h-3 bg-brutal-red rotate-45" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brutal-yellow text-brutal-black border-3 border-brutal-black shadow-brutal-sm font-bold text-[10px] uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5" />
            <span>Nitin Sir — Academic Information Hub 2026</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto text-balance">
            Discover Verified{' '}
            <span className="bg-brutal-yellow text-brutal-black px-2 inline-block -rotate-1">Academic</span>{' '}
            Conferences,{' '}
            <span className="bg-brutal-green text-brutal-black px-2 inline-block rotate-1">Internships</span>{' '}
            & Call for Papers
          </h1>

          <p className="text-white/60 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            The single informational portal to search international symposia, research fellowships, paper submission deadlines, and direct official application links.
          </p>

          {/* Event Type Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {eventTabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = filters.eventType === tab.label;
              return (
                <button
                  key={tab.label}
                  onClick={() => handleFilterChange({ eventType: tab.label, page: 1 })}
                  className={`px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 border-2 ${
                    isSelected
                      ? 'bg-brutal-yellow text-brutal-black border-brutal-yellow shadow-brutal-sm'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white hover:border-white/30'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label === 'All' ? 'All Events' : tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white border-4 border-brutal-black shadow-brutal-lg p-2 flex flex-col sm:flex-row items-stretch gap-2 mt-6">
            <div className="flex-1 flex items-center gap-3 px-4 py-2">
              <Search className="w-5 h-5 text-brutal-black/40 flex-shrink-0" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value, page: 1 })}
                placeholder="Search by topic, keyword, city, country, or acronym..."
                className="w-full text-sm text-brutal-black bg-transparent focus:outline-none placeholder:text-brutal-black/30"
              />
            </div>
            <button
              onClick={fetchConferences}
              className="w-full sm:w-auto px-6 py-3 bg-brutal-yellow text-brutal-black font-bold text-xs uppercase tracking-wider border-2 border-brutal-black hover:translate-x-[-1px] hover:translate-y-[-1px] shadow-brutal-sm hover:shadow-brutal transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══ INFO NOTICE ═══ */}
      <section className="bg-brutal-yellow border-b-3 border-brutal-black py-3 px-4 text-center text-xs text-brutal-black font-bold flex items-center justify-center gap-2">
        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        <span>
          Informational Portal: Click <strong>"Apply"</strong> to visit the official organizer portal.
        </span>
      </section>

      {/* ═══ CONTINENTS ═══ */}
      <section className="py-8 bg-white border-b-3 border-brutal-black" data-reveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-lg font-bold text-brutal-black flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Browse by Continent
              </h2>
              <p className="text-[11px] text-brutal-black/50 mt-0.5 font-medium">Filter by region</p>
            </div>
            {filters.continent !== 'All' && (
              <button
                onClick={() => handleFilterChange({ continent: 'All', country: 'All', city: 'All', page: 1 })}
                className="text-[11px] font-bold text-brutal-red hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {continents.map((cont) => {
              const isSelected = filters.continent === cont;
              return (
                <button
                  key={cont}
                  onClick={() => handleFilterChange({ continent: cont, country: 'All', city: 'All', page: 1 })}
                  className={`p-3 border-3 border-brutal-black text-center transition-all ${
                    isSelected
                      ? 'bg-brutal-black text-brutal-yellow shadow-brutal-sm'
                      : 'bg-white hover:bg-brutal-cream text-brutal-black shadow-brutal hover:shadow-brutal-lg'
                  }`}
                >
                  <MapPin className={`w-4 h-4 mx-auto mb-1 ${isSelected ? 'text-brutal-yellow' : 'text-brutal-black/40'}`} />
                  <span className="font-bold text-[11px] block truncate">{cont}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ TOPICS ═══ */}
      <section className="py-10 bg-brutal-cream border-b-3 border-brutal-black" data-reveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="font-display text-xl font-bold text-brutal-black">
              Academic Topics & Fields
            </h2>
            <p className="text-[11px] text-brutal-black/50 mt-1 font-medium">
              Select your domain to filter conferences, internships, and papers.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {topics.map((item) => {
              const Icon = item.icon;
              const isSelected = filters.category === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => handleFilterChange({ category: item.label, page: 1 })}
                  className={`p-4 border-3 border-brutal-black text-left transition-all group ${
                    isSelected
                      ? 'bg-brutal-black text-white shadow-brutal'
                      : 'bg-white hover:bg-brutal-yellow/20 text-brutal-black shadow-brutal-sm hover:shadow-brutal'
                  }`}
                >
                  <div className={`w-8 h-8 flex items-center justify-center mb-2 border-2 transition-all ${
                    isSelected
                      ? 'bg-brutal-yellow text-brutal-black border-brutal-yellow'
                      : 'bg-brutal-cream text-brutal-black border-brutal-black/10 group-hover:border-brutal-black'
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
            <div className="flex items-center justify-between pb-3 border-b-3 border-brutal-black">
              <div>
                <h3 className="font-display text-lg font-bold text-brutal-black">
                  {filters.eventType === 'All' ? 'All Listings' : filters.eventType}
                </h3>
                <p className="text-[11px] text-brutal-black/50 font-medium">
                  Showing <strong className="text-brutal-black">{conferences.length}</strong> of{' '}
                  <strong className="text-brutal-black">{total}</strong> verified listings
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
                <div className="w-10 h-10 border-4 border-brutal-black border-t-brutal-yellow animate-spin" />
                <p className="text-xs font-bold text-brutal-black/50">Loading...</p>
              </div>
            ) : conferences.length === 0 ? (
              <div className="bg-white border-3 border-brutal-black shadow-brutal p-12 text-center space-y-4">
                <div className="w-16 h-16 border-3 border-brutal-black bg-brutal-cream flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-brutal-black/30" />
                </div>
                <h4 className="font-serif text-lg font-bold text-brutal-black">No Results Found</h4>
                <p className="text-xs text-brutal-black/50 max-w-sm mx-auto">
                  No listing matches your current filters. Try adjusting your criteria.
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
      <section className="bg-brutal-black text-white py-16 px-4 sm:px-6 lg:px-8 border-t-6 border-brutal-yellow" data-reveal>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-12 h-12 bg-brutal-yellow border-3 border-brutal-black flex items-center justify-center mx-auto shadow-brutal">
            <Bell className="w-6 h-6 text-brutal-black" />
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold">
            Stay Updated with{' '}
            <span className="bg-brutal-yellow text-brutal-black px-2">Verified Alerts</span>
          </h2>
          <p className="text-white/50 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Get instant email notifications for new international research fellowships, paper deadlines, and conferences.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="your@email.edu"
              className="flex-1 px-4 py-3 text-sm border-3 border-brutal-black bg-white text-brutal-black focus:outline-none"
            />
            <button className="px-6 py-3 bg-brutal-yellow text-brutal-black font-bold text-xs uppercase tracking-wider border-3 border-brutal-black shadow-brutal-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

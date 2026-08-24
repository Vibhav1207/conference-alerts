import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ConferenceCard } from '../components/ConferenceCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { Conference, FilterState } from '../types';
import { conferenceAPI } from '../services/api';
import { CATEGORIES, CONTINENTS, EVENT_TYPES } from '../utils/locationData';
import {
  Search,
  Calendar,
  Globe,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Bell,
  Cpu,
  HeartPulse,
  Leaf,
  Layers,
  Briefcase,
  GraduationCap,
  FlaskConical,
  ExternalLink,
  MapPin,
} from 'lucide-react';

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

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      eventType: eventTypeParam,
      category: categoryParam,
      page: 1,
    }));
  }, [eventTypeParam, categoryParam]);

  const fetchConferences = async () => {
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
  };

  useEffect(() => {
    fetchConferences();
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setFilters({
      search: '',
      category: 'All',
      eventType: 'All',
      continent: 'All',
      country: 'All',
      city: 'All',
      mode: 'All',
      page: 1,
      limit: 6,
      sortBy: 'createdAt',
      order: 'desc',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section matching Stitch styling */}
      <section className="bg-gradient-to-b from-navy-950 via-navy-900 to-navy-850 text-white relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#006c49_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider shadow-inner">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Nitin Sir — Academic Information Hub 2026</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Discover Verified Academic Conferences, Internships & Call for Papers
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto font-sans leading-relaxed">
            The single informational portal to search international symposia, research student fellowships, paper submission deadlines, and direct official application links.
          </p>

          {/* Event Type Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { label: 'All', icon: Calendar },
              { label: 'Conference', icon: Calendar },
              { label: 'Internship', icon: Briefcase },
              { label: 'Call for Papers', icon: GraduationCap },
              { label: 'Workshop / Seminar', icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = filters.eventType === tab.label;
              return (
                <button
                  key={tab.label}
                  onClick={() => handleFilterChange({ eventType: tab.label, page: 1 })}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-950/40'
                      : 'bg-navy-850/90 text-slate-300 hover:bg-navy-800 border border-navy-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label === 'All' ? 'All Event Types' : tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Search Bar */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-2.5 shadow-2xl shadow-navy-950/50 border border-white/20 flex flex-col sm:flex-row items-center gap-2 mt-6">
            <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value, page: 1 })}
                placeholder="Search by topic, keyword, city, country, or acronym..."
                className="w-full text-xs sm:text-sm text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={fetchConferences}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Search Listings</span>
            </button>
          </div>
        </div>
      </section>

      {/* Info Portal Notice Banner */}
      <section className="bg-emerald-50 border-b border-emerald-200/80 py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-emerald-900 font-medium flex items-center justify-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
        <span>
          <strong>Informational Portal Notice:</strong> Nitin Sir Portal provides verified event summaries. When ready to apply or register, click <strong>"Apply on Official Site"</strong> to visit the official organizer portal.
        </span>
      </section>

      {/* Continents Grid Section */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-navy-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-800" />
                <span>Browse Listings by Continent</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Filter international opportunities by region.
              </p>
            </div>
            {filters.continent !== 'All' && (
              <button
                onClick={() => handleFilterChange({ continent: 'All', country: 'All', city: 'All', page: 1 })}
                className="text-xs font-bold text-slate-500 hover:text-navy-900"
              >
                Clear Region Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Australia / Oceania'].map((cont) => {
              const isSelected = filters.continent === cont;
              return (
                <button
                  key={cont}
                  onClick={() => handleFilterChange({ continent: cont, country: 'All', city: 'All', page: 1 })}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-navy-900 text-white border-navy-900 shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                  }`}
                >
                  <MapPin className={`w-4 h-4 mx-auto mb-1.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="font-bold text-xs block truncate">{cont}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Topics / Domains Section */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-bold text-navy-900">
              Explore Academic Topics & Fields
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your academic domain to filter conferences, research internships, and call for papers.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'Engineering & Tech', icon: Cpu },
              { label: 'Physical & Life Sciences', icon: FlaskConical },
              { label: 'Agricultural & Biological Sciences', icon: Leaf },
              { label: 'Medical & Health Sciences', icon: HeartPulse },
              { label: 'Business & Management', icon: BookOpen },
              { label: 'Arts & Humanities', icon: GraduationCap },
              { label: 'Social Sciences', icon: Layers },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = filters.category === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => handleFilterChange({ category: item.label, page: 1 })}
                  className={`p-4 rounded-2xl border text-left transition-all group ${
                    isSelected
                      ? 'bg-navy-900 text-white border-navy-900 shadow-lg shadow-navy-900/10'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200/80'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105 ${
                      isSelected ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-navy-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-[11px] leading-tight line-clamp-2">{item.label}</h3>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area: Sidebar + Events Grid */}
      <section className="py-12 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filter */}
          <div className="lg:col-span-1">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Events List Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header info */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-serif text-xl font-bold text-navy-900">
                  {filters.eventType === 'All' ? 'All Verified Opportunities' : filters.eventType}
                </h3>
                <p className="text-xs text-slate-500">
                  Showing <strong className="text-slate-900">{conferences.length}</strong> of{' '}
                  <strong className="text-slate-900">{total}</strong> verified listings
                </p>
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none"
                >
                  <option value="createdAt">Recently Added</option>
                  <option value="dates.submissionDeadline">Upcoming Deadline</option>
                  <option value="viewsCount">Most Viewed</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-800" />
                <p className="text-xs font-semibold text-slate-600">Loading verified opportunities...</p>
              </div>
            ) : conferences.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-lg font-bold text-navy-900">No Opportunities Found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We couldn't find any listing matching your current filters. Try resetting your criteria.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-navy-900 text-white text-xs font-semibold rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {conferences.map((conf) => (
                  <ConferenceCard key={conf._id} conference={conf} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Alert Subscription Banner */}
      <section className="bg-navy-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-navy-800">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-lg">
            <Bell className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold">
            Subscribe to Verified Academic & Internship Alerts
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Get instant email notifications whenever new international research fellowships, paper submission deadlines, or conferences are posted.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your academic email..."
              className="flex-1 px-4 py-3 text-xs rounded-xl text-slate-900 bg-white focus:outline-none"
            />
            <button
              onClick={() => alert('Subscribed successfully to Nitin Sir Academic Alerts!')}
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              Subscribe Free
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

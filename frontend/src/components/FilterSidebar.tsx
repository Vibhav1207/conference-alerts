import React from 'react';
import { FilterState } from '../types';
import { EVENT_TYPES, CATEGORIES, CONTINENTS, LOCATION_HIERARCHY } from '../utils/locationData';
import { Filter, RotateCcw, MapPin, Globe, Layers, Briefcase } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange, onReset }) => {
  // Available countries based on selected continent
  const availableCountries = React.useMemo(() => {
    if (!filters.continent || filters.continent === 'All') return [];
    const map = LOCATION_HIERARCHY[filters.continent];
    return map ? Object.keys(map) : [];
  }, [filters.continent]);

  // Available cities based on selected continent and country
  const availableCities = React.useMemo(() => {
    if (!filters.continent || filters.continent === 'All' || !filters.country || filters.country === 'All') return [];
    const map = LOCATION_HIERARCHY[filters.continent];
    return map && map[filters.country] ? map[filters.country] : [];
  }, [filters.continent, filters.country]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 font-serif text-lg font-bold text-navy-900">
          <Filter className="w-5 h-5 text-emerald-800" />
          <span>Filter Listings</span>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-navy-900 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Event Type Dropdown Filter */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-emerald-800" />
          <span>Listing Type</span>
        </label>
        <select
          value={filters.eventType}
          onChange={(e) => onFilterChange({ eventType: e.target.value, page: 1 })}
          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium text-slate-800"
        >
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type === 'All' ? 'All Event Types' : type}
            </option>
          ))}
        </select>
      </div>

      {/* Continent Dropdown */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-emerald-800" />
          <span>Continent</span>
        </label>
        <select
          value={filters.continent}
          onChange={(e) => onFilterChange({ continent: e.target.value, country: 'All', city: 'All', page: 1 })}
          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium text-slate-800"
        >
          {CONTINENTS.map((cont) => (
            <option key={cont} value={cont}>
              {cont === 'All' ? 'All Continents' : cont}
            </option>
          ))}
        </select>
      </div>

      {/* Country Dropdown (Conditional) */}
      {filters.continent !== 'All' && availableCountries.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-800" />
            <span>Country</span>
          </label>
          <select
            value={filters.country}
            onChange={(e) => onFilterChange({ country: e.target.value, city: 'All', page: 1 })}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium text-slate-800"
          >
            <option value="All">All Countries in {filters.continent}</option>
            {availableCountries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* City Dropdown (Conditional) */}
      {filters.country !== 'All' && availableCities.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-800" />
            <span>City</span>
          </label>
          <select
            value={filters.city}
            onChange={(e) => onFilterChange({ city: e.target.value, page: 1 })}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium text-slate-800"
          >
            <option value="All">All Cities in {filters.country}</option>
            {availableCities.map((ct) => (
              <option key={ct} value={ct}>
                {ct}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Academic Domain Dropdown */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-800" />
          <span>Academic Field</span>
        </label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value, page: 1 })}
          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium text-slate-800"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'All' ? 'All Disciplines & Domains' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Attendance Mode */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Attendance Mode
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {['All', 'Hybrid', 'In-Person', 'Online'].map((m) => (
            <button
              key={m}
              onClick={() => onFilterChange({ mode: m, page: 1 })}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors text-center ${
                filters.mode === m
                  ? 'bg-navy-900 text-white font-semibold shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

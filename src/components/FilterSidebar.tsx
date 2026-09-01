import React from 'react';
import { FilterState } from '../types';
import { EVENT_TYPES, CATEGORIES, CONTINENTS, MONTHS, LOCATION_HIERARCHY } from '../utils/locationData';
import { Filter, RotateCcw, MapPin, Globe, Layers, Briefcase, Calendar } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange, onReset }) => {
  const availableCountries = React.useMemo(() => {
    if (!filters.continent || filters.continent === 'All') return [];
    const map = LOCATION_HIERARCHY[filters.continent];
    return map ? Object.keys(map) : [];
  }, [filters.continent]);

  const availableCities = React.useMemo(() => {
    if (!filters.continent || filters.continent === 'All' || !filters.country || filters.country === 'All') return [];
    const map = LOCATION_HIERARCHY[filters.continent];
    return map && map[filters.country] ? map[filters.country] : [];
  }, [filters.continent, filters.country]);

  return (
    <div className="bg-white border-3 border-brutal-black shadow-brutal p-5 space-y-5 sticky top-20">
      <div className="flex items-center justify-between pb-3 border-b-3 border-brutal-black">
        <div className="flex items-center gap-2 font-display text-sm font-bold text-brutal-black">
          <Filter className="w-4 h-4 text-brutal-black" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="brutal-btn-ghost text-[10px] text-brutal-black/50"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Event Type */}
      <div className="space-y-1.5">
        <label className="brutal-label flex items-center gap-1.5">
          <Briefcase className="w-3 h-3" />
          <span>Listing Type</span>
        </label>
        <select
          value={filters.eventType}
          onChange={(e) => onFilterChange({ eventType: e.target.value, page: 1 })}
          className="brutal-select text-xs"
        >
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type === 'All' ? 'All Event Types' : type}
            </option>
          ))}
        </select>
      </div>

      {/* Event Month */}
      <div className="space-y-1.5">
        <label className="brutal-label flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-brutal-black" />
          <span>Event Month</span>
        </label>
        <select
          value={filters.month || 'All'}
          onChange={(e) => onFilterChange({ month: e.target.value, page: 1 })}
          className="brutal-select text-xs font-medium"
        >
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {m === 'All' ? 'All Months' : m}
            </option>
          ))}
        </select>
      </div>

      {/* Continent */}
      <div className="space-y-1.5">
        <label className="brutal-label flex items-center gap-1.5">
          <Globe className="w-3 h-3" />
          <span>Continent</span>
        </label>
        <select
          value={filters.continent}
          onChange={(e) => onFilterChange({ continent: e.target.value, country: 'All', city: 'All', page: 1 })}
          className="brutal-select text-xs"
        >
          {CONTINENTS.map((cont) => (
            <option key={cont} value={cont}>
              {cont === 'All' ? 'All Continents' : cont}
            </option>
          ))}
        </select>
      </div>

      {/* Country */}
      {filters.continent !== 'All' && availableCountries.length > 0 && (
        <div className="space-y-1.5">
          <label className="brutal-label flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            <span>Country</span>
          </label>
          <select
            value={filters.country}
            onChange={(e) => onFilterChange({ country: e.target.value, city: 'All', page: 1 })}
            className="brutal-select text-xs"
          >
            <option value="All">All Countries</option>
            {availableCountries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      )}

      {/* City */}
      {filters.country !== 'All' && availableCities.length > 0 && (
        <div className="space-y-1.5">
          <label className="brutal-label flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            <span>City</span>
          </label>
          <select
            value={filters.city}
            onChange={(e) => onFilterChange({ city: e.target.value, page: 1 })}
            className="brutal-select text-xs"
          >
            <option value="All">All Cities</option>
            {availableCities.map((ct) => (
              <option key={ct} value={ct}>{ct}</option>
            ))}
          </select>
        </div>
      )}

      {/* Academic Domain */}
      <div className="space-y-1.5">
        <label className="brutal-label flex items-center gap-1.5">
          <Layers className="w-3 h-3" />
          <span>Academic Field</span>
        </label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value, page: 1 })}
          className="brutal-select text-xs"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'All' ? 'All Fields' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Attendance Mode */}
      <div className="space-y-1.5">
        <label className="brutal-label">Mode</label>
        <div className="grid grid-cols-2 gap-1.5">
          {['All', 'Hybrid', 'In-Person', 'Online'].map((m) => (
            <button
              key={m}
              onClick={() => onFilterChange({ mode: m, page: 1 })}
              className={`px-3 py-2 text-[11px] font-bold border-2 border-brutal-black transition-all ${
                filters.mode === m
                  ? 'bg-brutal-black text-brutal-yellow shadow-brutal-sm'
                  : 'bg-white text-brutal-black hover:bg-brutal-cream'
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

import React from 'react';
import { Link } from 'react-router-dom';
import { Conference } from '../types';
import { MapPin, Calendar, Clock, Bookmark, ExternalLink, ShieldCheck, ChevronRight, Briefcase, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ConferenceCardProps {
  conference: Conference;
}

export const ConferenceCard: React.FC<ConferenceCardProps> = ({ conference }) => {
  const { toggleBookmark, isBookmarked, isAuthenticated } = useAuth();
  const bookmarked = isBookmarked(conference._id);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Calculate days remaining for deadline
  const daysLeft = Math.ceil(
    (new Date(conference.dates.submissionDeadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
  );

  const getEventTypeBadge = (eventType: string) => {
    switch (eventType) {
      case 'Internship':
        return 'bg-blue-900 text-white';
      case 'Call for Papers':
        return 'bg-purple-900 text-white';
      case 'Workshop / Seminar':
        return 'bg-amber-800 text-white';
      default:
        return 'bg-navy-900 text-white';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-academic hover:shadow-academic-lg transition-all duration-200 p-6 flex flex-col justify-between group relative overflow-hidden">
      {/* Top Tag Bar */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-3 py-1 font-bold text-xs rounded-lg tracking-wider ${getEventTypeBadge(conference.eventType)}`}>
            {conference.eventType || 'Conference'}
          </span>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold text-[11px] rounded-lg">
            {conference.acronym}
          </span>
          <span
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg ${
              conference.mode === 'Hybrid'
                ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
                : conference.mode === 'Online'
                ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                : 'bg-amber-50 text-amber-700 border border-amber-200/60'
            }`}
          >
            {conference.mode}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            if (!isAuthenticated) {
              alert('Please log in to save items to your bookmarks');
              return;
            }
            toggleBookmark(conference._id);
          }}
          className={`p-2 rounded-xl transition-colors ${
            bookmarked
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200/60'
          }`}
          title={bookmarked ? 'Remove Bookmark' : 'Save to Bookmarks'}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-emerald-800' : ''}`} />
        </button>
      </div>

      {/* Main Title & Organizer */}
      <div className="space-y-2 mb-4">
        <Link to={`/conference/${conference._id}`} className="block group-hover:text-emerald-800 transition-colors">
          <h3 className="font-serif text-lg font-bold text-navy-900 leading-snug line-clamp-2">
            {conference.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="line-clamp-1">Organized by: <strong className="text-slate-700">{conference.organizer}</strong></span>
        </div>
      </div>

      {/* Domain Badge */}
      <div className="mb-4">
        <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold text-[10px] uppercase tracking-wider rounded-md border border-emerald-200/60">
          {conference.category}
        </span>
      </div>

      {/* Location & Details Grid */}
      <div className="bg-slate-50/80 rounded-xl p-3.5 space-y-2.5 text-xs text-slate-600 mb-5 border border-slate-100">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="font-medium text-slate-800 truncate">
            {conference.venue.city}, {conference.venue.country} ({conference.venue.continent || 'Global'})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span>
            {formatDate(conference.dates.startDate)} - {formatDate(conference.dates.endDate)}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Deadline: <strong className="text-slate-900">{formatDate(conference.dates.submissionDeadline)}</strong></span>
          </div>
          {daysLeft > 0 ? (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 rounded-md">
              {daysLeft} days left
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-200 text-slate-600 rounded-md">
              Closed
            </span>
          )}
        </div>
      </div>

      {/* Footer Action Bar: Info Link + External Apply Redirect Link */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
        <Link
          to={`/conference/${conference._id}`}
          className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-navy-900 hover:bg-slate-100 rounded-xl transition-colors"
        >
          View Overview
        </Link>

        {conference.externalApplyUrl ? (
          <a
            href={conference.externalApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-md transition-all"
          >
            <span>Apply / Register</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <Link
            to={`/conference/${conference._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-navy-900 hover:bg-navy-850 rounded-xl transition-all"
          >
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
};

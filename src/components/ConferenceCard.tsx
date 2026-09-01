import React, { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Conference } from '../types';
import { MapPin, Calendar, Clock, Bookmark, ExternalLink, ChevronRight, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cardHoverIn, cardHoverOut } from '../lib/animations';
import { getLogosByIds } from '../utils/logos';

interface ConferenceCardProps {
  conference: Conference;
}

export const ConferenceCard: React.FC<ConferenceCardProps> = ({ conference }) => {
  const { toggleBookmark, isBookmarked, isAuthenticated } = useAuth();
  const bookmarked = isBookmarked(conference._id);
  const cardRef = useRef<HTMLDivElement>(null);

  // Match all selected publisher logos or fallback keyword
  const logos = getLogosByIds(
    conference.publisherLogos || conference.publisherLogo,
    `${conference.acronym} ${conference.title} ${conference.organizer}`
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const daysLeft = Math.ceil(
    (new Date(conference.dates.submissionDeadline).getTime() - Date.now()) / (1000 * 3600 * 24)
  );

  const eventTypeStyle = (eventType: string) => {
    switch (eventType) {
      case 'Internship':
        return 'bg-brutal-blue text-white border-brutal-blue';
      case 'Journals':
        return 'bg-purple-600 text-white border-purple-600';
      case 'Workshop / Seminar':
        return 'bg-brutal-orange text-white border-brutal-orange';
      default:
        return 'bg-brutal-black text-white border-brutal-black';
    }
  };

  const handleMouseEnter = useCallback(() => {
    if (cardRef.current) cardHoverIn(cardRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) cardHoverOut(cardRef.current);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-white border-3 border-brutal-black shadow-brutal p-5 flex flex-col justify-between group relative overflow-hidden"
    >
      {/* Publisher / Indexing Logos Top Banner */}
      {logos.length > 0 && (
        <div className="mb-3 p-2 bg-brutal-cream border-2 border-brutal-black flex flex-wrap items-center justify-between gap-2 shadow-brutal-sm">
          <div className="flex flex-wrap items-center gap-2 overflow-hidden">
            {logos.map((logo) => (
              <div key={logo.id} className="flex items-center gap-1.5 bg-white border border-brutal-black px-1.5 py-0.5" title={logo.name}>
                <img src={logo.src} alt={logo.name} className="h-4 object-contain" />
                <span className="text-[9px] font-bold font-mono text-brutal-black">{logo.shortName}</span>
              </div>
            ))}
          </div>
          <span className="text-[8px] font-bold px-1.5 py-0.5 bg-brutal-black text-brutal-yellow uppercase border border-brutal-black">
            Indexed
          </span>
        </div>
      )}

      {/* Top Tag Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`brutal-badge border-2 ${eventTypeStyle(conference.eventType)}`}>
            {conference.eventType || 'Conference'}
          </span>
          <span className="brutal-badge bg-white text-brutal-black">{conference.acronym}</span>
          {conference.conferenceScope && (
            <span className="brutal-badge bg-brutal-blue/10 text-brutal-blue border-brutal-blue">
              {conference.conferenceScope}
            </span>
          )}
          <span
            className={`brutal-badge ${
              conference.mode === 'Hybrid'
                ? 'bg-purple-100 text-purple-800 border-purple-400'
                : conference.mode === 'Online'
                ? 'bg-brutal-blue/10 text-brutal-blue border-brutal-blue'
                : 'bg-brutal-yellow/20 text-brutal-black border-brutal-orange'
            }`}
          >
            {conference.mode}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            if (!isAuthenticated) {
              alert('Please log in to save bookmarks');
              return;
            }
            toggleBookmark(conference._id);
          }}
          className={`p-1.5 border-2 transition-all ${
            bookmarked
              ? 'bg-brutal-yellow border-brutal-black text-brutal-black'
              : 'bg-white border-brutal-black/20 text-brutal-black/40 hover:border-brutal-black hover:text-brutal-black'
          }`}
          title={bookmarked ? 'Remove Bookmark' : 'Save'}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-brutal-black' : ''}`} />
        </button>
      </div>

      {/* Title & Organizer */}
      <div className="space-y-1.5 mb-3">
        <Link to={`/conference/${conference._id}`} className="block group-hover:text-brutal-blue transition-colors">
          <h3 className="font-serif text-base font-bold text-brutal-black leading-snug line-clamp-2">
            {conference.title}
          </h3>
        </Link>
        <p className="text-[11px] text-brutal-black/50 font-medium">
          by <strong className="text-brutal-black/70">{conference.organizer}</strong>
        </p>
      </div>

      {/* Category Badge */}
      <div className="mb-3">
        <span className="brutal-badge bg-brutal-cream text-brutal-black border-brutal-black/20">
          {conference.category}
        </span>
      </div>

      {/* Details */}
      <div className="bg-brutal-cream border-2 border-brutal-black/10 p-3 space-y-2 text-[11px] text-brutal-black/70 mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-brutal-black/40 flex-shrink-0" />
          <span className="font-medium truncate">
            {conference.venue.city}, {conference.venue.country}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-brutal-black/40 flex-shrink-0" />
          <span>
            {formatDate(conference.dates.startDate)} – {formatDate(conference.dates.endDate)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t-2 border-brutal-black/10">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-brutal-red flex-shrink-0" />
            <span>
              Deadline: <strong className="text-brutal-black">{formatDate(conference.dates.submissionDeadline)}</strong>
            </span>
          </div>
          {daysLeft > 0 ? (
            <span className="brutal-badge bg-brutal-yellow text-brutal-black border-brutal-black text-[9px]">
              {daysLeft}d left
            </span>
          ) : (
            <span className="brutal-badge bg-brutal-black/10 text-brutal-black/50 border-brutal-black/20 text-[9px]">
              Closed
            </span>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t-2 border-brutal-black/10">
        <Link to={`/conference/${conference._id}`} className="brutal-btn-ghost text-xs">
          View Overview
        </Link>
        {conference.externalApplyUrl ? (
          <a
            href={conference.externalApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brutal-green border-2 border-brutal-black shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal transition-all"
          >
            <span>Apply</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <Link
            to={`/conference/${conference._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brutal-black border-2 border-brutal-black shadow-brutal-sm hover:bg-navy-900 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal transition-all"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
};

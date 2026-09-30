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
        return 'bg-[#0B1F33] text-white border-[#0B1F33]';
      case 'Journals':
        return 'bg-[#F5E8CD] text-[#10243A] border-[#D9A441]/40 font-bold';
      case 'FDP':
        return 'bg-[#FAF2DF] text-[#10243A] border-[#D9A441]/30';
      case 'Workshop / Seminar':
        return 'bg-[#F3F5F7] text-[#10243A] border-[#DDE2E7]';
      default:
        return 'bg-[#F3F5F7] text-[#10243A] border-[#DDE2E7]';
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
      className="bg-white border border-[#DDE2E7] hover:border-[#D9A441]/60 rounded-xl shadow-subtle hover:shadow-academic p-5 flex flex-col justify-between group relative overflow-hidden transition-all duration-200"
    >
      {/* Publisher / Indexing Logos Top Banner */}
      {logos.length > 0 && (
        <div className="mb-3 p-2 bg-[#FAF8F3] border border-[#DDE2E7] rounded-lg flex flex-wrap items-center justify-between gap-2 shadow-none">
          <div className="flex flex-wrap items-center gap-2 overflow-hidden">
            {logos.map((logo) => (
              <div key={logo.id} className="flex items-center gap-1.5 bg-white border border-[#DDE2E7] rounded px-1.5 py-0.5" title={logo.name}>
                <img src={logo.src} alt={logo.name} className="h-4 object-contain" />
                <span className="text-[9px] font-bold font-mono text-[#10243A]">{logo.shortName}</span>
              </div>
            ))}
          </div>
          <span className="text-[8px] font-bold px-1.5 py-0.5 bg-[#0B1F33] text-[#EBCB8B] uppercase rounded">
            Indexed
          </span>
        </div>
      )}

      {/* Top Tag Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`brutal-badge border ${eventTypeStyle(conference.eventType)}`}>
            {conference.eventType || 'Conference'}
          </span>
          <span className="brutal-badge bg-white text-[#10243A] border border-[#DDE2E7]">{conference.acronym}</span>
          {conference.conferenceScope && (
            <span className="brutal-badge bg-[#F5E8CD] text-[#10243A] border border-[#D9A441]/30">
              {conference.conferenceScope}
            </span>
          )}
          <span className="brutal-badge bg-[#F3F5F7] text-[#5F6B7A] border border-[#DDE2E7]">
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
          className={`p-1.5 border rounded-lg transition-all ${
            bookmarked
              ? 'bg-[#0B1F33] border-[#0B1F33] text-white shadow-sm'
              : 'bg-white border-[#DDE2E7] text-[#8A94A3] hover:border-[#0B1F33] hover:text-[#0B1F33]'
          }`}
          title={bookmarked ? 'Remove Bookmark' : 'Save'}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Title & Organizer */}
      <div className="space-y-1.5 mb-3">
        <Link to={`/conference/${conference._id}`} className="block group-hover:text-[#D9A441] transition-colors">
          <h3 className="font-serif text-base font-bold text-[#10243A] leading-snug line-clamp-2">
            {conference.title}
          </h3>
        </Link>
        <p className="text-[11px] text-[#5F6B7A] font-medium">
          by <strong className="text-[#10243A]">{conference.organizer}</strong>
        </p>
      </div>

      {/* Category Badge */}
      <div className="mb-3">
        <span className="brutal-badge bg-[#FAF8F3] text-[#10243A] border border-[#DDE2E7]">
          {conference.category}
        </span>
      </div>

      {/* Details */}
      <div className="bg-[#FAF8F3] border border-[#DDE2E7] rounded-lg p-3 space-y-2 text-[11px] text-[#5F6B7A] mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#8A94A3] flex-shrink-0" />
          <span className="font-medium truncate text-[#10243A]">
            {conference.venue.city}, {conference.venue.country}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[#8A94A3] flex-shrink-0" />
          <span>
            {formatDate(conference.dates.startDate)} – {formatDate(conference.dates.endDate)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-[#DDE2E7]">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#D9A441] flex-shrink-0" />
            <span>
              Deadline: <strong className="text-[#10243A]">{formatDate(conference.dates.submissionDeadline)}</strong>
            </span>
          </div>
          {daysLeft > 0 ? (
            <span className="brutal-badge bg-[#F5E8CD] text-[#10243A] border border-[#D9A441]/40 text-[9px] font-bold">
              {daysLeft}d left
            </span>
          ) : (
            <span className="brutal-badge bg-[#F3F5F7] text-[#8A94A3] border border-[#DDE2E7] text-[9px]">
              Closed
            </span>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#DDE2E7]">
        <Link to={`/conference/${conference._id}`} className="text-xs font-bold text-[#10243A] hover:text-[#D9A441] transition-colors py-1">
          View Overview
        </Link>
        {conference.externalApplyUrl ? (
          <a
            href={conference.externalApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0B1F33] hover:bg-[#132B45] rounded-lg shadow-sm transition-all"
          >
            <span>Apply</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <Link
            to={`/conference/${conference._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0B1F33] hover:bg-[#132B45] rounded-lg shadow-sm transition-all"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Conference } from '../types';
import { conferenceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  MapPin, Calendar, Clock, Bookmark, ExternalLink, ChevronLeft,
  ArrowRight,
} from 'lucide-react';
import { staggerReveal, revealElement } from '../lib/animations';

export const ConferenceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [conference, setConference] = useState<Conference | null>(null);
  const [loading, setLoading] = useState(true);
  const { toggleBookmark, isBookmarked, isAuthenticated } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConference = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await conferenceAPI.getConferenceById(id);
        if (res.data.success) setConference(res.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchConference();
  }, [id]);

  useEffect(() => {
    if (contentRef.current && conference) {
      const els = Array.from(contentRef.current.querySelectorAll<HTMLElement>('[data-reveal]'));
      els.forEach((el) => revealElement(el));
    }
  }, [conference]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-brutal-cream">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-10 h-10 border-4 border-brutal-black border-t-brutal-yellow animate-spin" />
          <p className="text-xs font-bold text-brutal-black/50">Loading details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!conference) {
    return (
      <div className="min-h-screen flex flex-col bg-brutal-cream">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4 text-center px-4">
          <h2 className="font-serif text-2xl font-bold text-brutal-black">Not Found</h2>
          <p className="text-xs text-brutal-black/50 max-w-sm">This opportunity could not be found.</p>
          <Link to="/" className="brutal-btn-primary text-xs">Return to Listings</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const bookmarked = isBookmarked(conference._id);
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'TBA';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getCategoryHeader = () => {
    switch (conference.eventType) {
      case 'Internship':
        return { badge: 'RESEARCH INTERNSHIP', aboutTitle: 'About the Internship', topicsTitle: 'Focus & Skills', applyText: 'Apply for Internship', ctaSubtext: 'Full stipend & accommodation. Direct official application.' };
      case 'Journals':
        return { badge: 'JOURNALS', aboutTitle: 'About the Journal', topicsTitle: 'Submission Tracks', applyText: 'Submit Paper', ctaSubtext: 'Peer-reviewed submission on official publisher site.' };
      case 'Workshop / Seminar':
        return { badge: 'WORKSHOP / SEMINAR', aboutTitle: 'About the Workshop', topicsTitle: 'Topics & Modules', applyText: 'Register', ctaSubtext: 'Interactive session with certificate included.' };
      default:
        return { badge: 'ACADEMIC SYMPOSIUM', aboutTitle: 'About the Conference', topicsTitle: 'Conference Topics', applyText: 'Register Now', ctaSubtext: 'Early bird registration open. Limited capacity.' };
    }
  };

  const catMeta = getCategoryHeader();

  return (
    <div className="min-h-screen flex flex-col bg-brutal-cream font-sans">
      <Navbar />

      {/* ═══ HERO HEADER ═══ */}
      <section className="bg-brutal-black text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b-6 border-brutal-yellow">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brutal-yellow/5 -rotate-12 translate-x-16 -translate-y-16" />
        <div className="max-w-7xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white mb-6 font-medium transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Listings</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="brutal-badge bg-brutal-yellow/20 text-brutal-yellow border-brutal-yellow text-[9px]">
                  {catMeta.badge}
                </span>
                {conference.conferenceScope && (
                  <span className="brutal-badge bg-brutal-blue/20 text-brutal-blue border-brutal-blue text-[9px]">
                    {conference.conferenceScope}
                  </span>
                )}
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                {conference.title} ({conference.acronym})
              </h1>
              <p className="text-white/50 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Organized by <strong className="text-white">{conference.organizer}</strong>.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="brutal-badge bg-white/10 text-white border-white/20">{conference.category}</span>
                <span className="brutal-badge bg-brutal-blue/20 text-brutal-blue border-brutal-blue">{conference.mode}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white/10 border-2 border-white/15 p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-brutal-black flex items-center justify-center border-2 border-brutal-yellow text-brutal-yellow">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Event Dates</p>
                  <p className="font-bold text-xs sm:text-sm">{formatDate(conference.dates.startDate)} – {formatDate(conference.dates.endDate)}</p>
                </div>
              </div>
              <div className="bg-white/10 border-2 border-white/15 p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-brutal-black flex items-center justify-center border-2 border-brutal-green text-brutal-green">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Location</p>
                  <p className="font-bold text-xs sm:text-sm">{conference.venue.city}, {conference.venue.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1" ref={contentRef}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* About */}
            <section data-reveal className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-1 bg-brutal-yellow" />
                <h2 className="font-serif text-xl font-bold text-brutal-black">{catMeta.aboutTitle}</h2>
              </div>
              <p className="text-brutal-black/70 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-white border-3 border-brutal-black shadow-brutal-sm p-6">
                {conference.description}
              </p>
            </section>

          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Apply Card */}
            <div className="bg-brutal-yellow border-4 border-brutal-black shadow-brutal-lg p-6 space-y-5">
              <div className="space-y-1.5">
                <h3 className="font-serif text-xl font-bold text-brutal-black">{catMeta.applyText}</h3>
                <p className="text-xs text-brutal-black/60 leading-relaxed">{catMeta.ctaSubtext}</p>
              </div>
              {conference.externalApplyUrl ? (
                <a
                  href={conference.externalApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-brutal-black text-brutal-yellow font-bold text-xs uppercase tracking-wider border-3 border-brutal-black shadow-brutal-sm flex items-center justify-center gap-2 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal transition-all"
                >
                  <span>{catMeta.applyText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <button className="w-full py-3.5 bg-white text-brutal-black font-bold text-xs uppercase tracking-wider border-3 border-brutal-black shadow-brutal-sm">
                  Register Interest
                </button>
              )}
              <p className="text-[9px] text-center text-brutal-black/40 font-bold uppercase tracking-wider">
                Official external portal
              </p>
            </div>

            {/* Dates Timeline */}
            <div className="bg-white border-3 border-brutal-black shadow-brutal-sm p-6 space-y-5">
              <h3 className="font-display text-sm font-bold text-brutal-black border-b-3 border-brutal-black pb-3">
                Important Dates
              </h3>
              <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-brutal-black/20">
                <div className="relative pl-6 space-y-0.5">
                  <div className="absolute left-0 top-1 w-3.5 h-3.5 bg-brutal-black border-2 border-brutal-yellow" />
                  <p className="text-[11px] font-bold text-brutal-black">Application / Submission</p>
                  <p className="text-[10px] text-brutal-black/50">{formatDate(conference.dates.submissionDeadline)}</p>
                </div>
                <div className="relative pl-6 space-y-0.5">
                  <div className="absolute left-0 top-1 w-3.5 h-3.5 bg-brutal-black/30 border-2 border-white" />
                  <p className="text-[11px] font-bold text-brutal-black/70">Selection Notification</p>
                  <p className="text-[10px] text-brutal-black/50">{conference.dates.notificationDate ? formatDate(conference.dates.notificationDate) : 'Rolling Basis'}</p>
                </div>
                <div className="relative pl-6 space-y-0.5">
                  <div className="absolute left-0 top-1 w-3.5 h-3.5 bg-brutal-black/30 border-2 border-white" />
                  <p className="text-[11px] font-bold text-brutal-black/70">Early Registration</p>
                  <p className="text-[10px] text-brutal-black/50">{conference.dates.cameraReadyDeadline ? formatDate(conference.dates.cameraReadyDeadline) : 'Prior to event'}</p>
                </div>
                <div className="relative pl-6 space-y-0.5">
                  <div className="absolute left-0 top-1 w-3.5 h-3.5 bg-brutal-yellow border-2 border-brutal-black" />
                  <p className="text-[11px] font-bold text-brutal-black">{conference.eventType === 'Internship' ? 'Internship Begins' : 'Conference Begins'}</p>
                  <p className="text-[10px] font-bold text-brutal-black">{formatDate(conference.dates.startDate)}</p>
                </div>
              </div>
            </div>

            {/* Bookmark / Share */}
            <div className="bg-white border-3 border-brutal-black shadow-brutal-sm p-4 flex items-center justify-between">
              <button
                onClick={() => { if (!isAuthenticated) { alert('Please log in to save bookmarks'); return; } toggleBookmark(conference._id); }}
                className="brutal-btn-ghost text-xs"
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-brutal-black' : ''}`} />
                <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }}
                className="brutal-btn-ghost text-xs"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

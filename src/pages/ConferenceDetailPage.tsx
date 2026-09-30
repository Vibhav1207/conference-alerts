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
import { getLogosByIds } from '../utils/logos';

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
      <div className="min-h-screen flex flex-col bg-[#FAF8F3]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-10 h-10 border-4 border-[#0B1F33]/20 border-t-[#D9A441] rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#5F6B7A]">Loading details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!conference) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F3]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4 text-center px-4">
          <h2 className="font-serif text-2xl font-bold text-[#10243A]">Not Found</h2>
          <p className="text-xs text-[#5F6B7A] max-w-sm">This opportunity could not be found.</p>
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
      case 'FDP':
        return { badge: 'FACULTY DEVELOPMENT PROGRAM', aboutTitle: 'About the FDP', topicsTitle: 'FDP Modules & Tracks', applyText: 'Register for FDP', ctaSubtext: 'Certified faculty & professional development training.' };
      case 'Workshop / Seminar':
        return { badge: 'WORKSHOP / SEMINAR', aboutTitle: 'About the Workshop', topicsTitle: 'Topics & Modules', applyText: 'Register', ctaSubtext: 'Interactive session with certificate included.' };
      default:
        return { badge: 'ACADEMIC SYMPOSIUM', aboutTitle: 'About the Conference', topicsTitle: 'Conference Topics', applyText: 'Register Now', ctaSubtext: 'Early bird registration open. Limited capacity.' };
    }
  };

  const catMeta = getCategoryHeader();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] font-sans">
      <Navbar />

      {/* ═══ HERO HEADER ═══ */}
      <section className="bg-[#0B1F33] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-[#D9A441]/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9A441]/5 rounded-full blur-3xl -translate-y-16 translate-x-16" />
        <div className="max-w-7xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-[#8A94A3] hover:text-[#FAF8F3] mb-6 font-medium transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Listings</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              {(() => {
                const logos = getLogosByIds(
                  conference.publisherLogos || conference.publisherLogo,
                  `${conference.acronym} ${conference.title} ${conference.organizer}`
                );
                return logos.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {logos.map((logo) => (
                      <div
                        key={logo.id}
                        className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-white text-[#10243A] border border-[#DDE2E7] rounded-lg shadow-sm"
                      >
                        <img src={logo.src} alt={logo.name} className="h-6 object-contain max-w-[100px]" />
                        <div className="flex flex-col">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#10243A] leading-none">
                            {logo.shortName}
                          </span>
                          <span className="text-[8px] text-[#5F6B7A] font-mono font-medium">Indexed</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null;
              })()}

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold tracking-wider rounded bg-[#F5E8CD] text-[#10243A] border border-[#D9A441]/40 uppercase">
                  {catMeta.badge}
                </span>
                {conference.conferenceScope && (
                  <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-semibold rounded bg-white/10 text-[#EBCB8B] border border-white/20">
                    {conference.conferenceScope}
                  </span>
                )}
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                {conference.title} ({conference.acronym})
              </h1>
              <p className="text-[#8A94A3] text-xs sm:text-sm max-w-2xl leading-relaxed">
                Organized by <strong className="text-[#FAF8F3]">{conference.organizer}</strong>.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-2.5 py-1 rounded bg-white/10 text-white text-xs font-medium border border-white/15">{conference.category}</span>
                <span className="px-2.5 py-1 rounded bg-[#132B45] text-[#EBCB8B] text-xs font-semibold border border-[#D9A441]/30">{conference.mode}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-[#132B45]/70 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#0B1F33] flex items-center justify-center border border-[#D9A441]/40 text-[#D9A441]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#8A94A3]">Event Dates</p>
                  <p className="font-bold text-xs sm:text-sm text-[#FAF8F3]">{formatDate(conference.dates.startDate)} – {formatDate(conference.dates.endDate)}</p>
                </div>
              </div>
              <div className="bg-[#132B45]/70 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#0B1F33] flex items-center justify-center border border-[#D9A441]/40 text-[#D9A441]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#8A94A3]">Location</p>
                  <p className="font-bold text-xs sm:text-sm text-[#FAF8F3]">{conference.venue.city}, {conference.venue.country}</p>
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
          <div className="lg:col-span-2 space-y-8">
            {/* Indexing & Publisher Accreditation Section inside Info */}
            {(() => {
              const logos = getLogosByIds(
                conference.publisherLogos || conference.publisherLogo,
                `${conference.acronym} ${conference.title} ${conference.organizer}`
              );
              return logos.length > 0 ? (
                <section data-reveal className="bg-white border border-[#DDE2E7] shadow-sm rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#DDE2E7] pb-3">
                    <h3 className="font-serif text-base font-bold text-[#10243A] flex items-center gap-2">
                      <span className="w-3 h-3 bg-[#D9A441] rounded-sm" />
                      Official Indexing & Publisher Accreditations
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#0B1F33] text-[#FAF8F3] rounded uppercase">
                      {logos.length} Verified Partner(s)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {logos.map((logo) => (
                      <div
                        key={logo.id}
                        className="p-3 bg-[#FAF8F3] border border-[#DDE2E7] rounded-lg flex items-center gap-3 shadow-none hover:border-[#D9A441]/50 transition-colors"
                      >
                        <div className="w-16 h-12 bg-white border border-[#DDE2E7] rounded p-1 flex items-center justify-center flex-shrink-0">
                          <img src={logo.src} alt={logo.name} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-[#10243A] truncate">{logo.name}</h4>
                          <p className="text-[10px] text-[#5F6B7A] truncate font-mono">{logo.tagline}</p>
                          <span className="inline-block mt-1 text-[8px] font-bold px-1.5 py-0.5 rounded bg-[#F5E8CD] text-[#10243A] border border-[#D9A441]/40 uppercase">
                            Official Indexing
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;
            })()}

            {/* About Section */}
            <section data-reveal className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-1 bg-[#D9A441] rounded" />
                <h2 className="font-serif text-xl font-bold text-[#10243A]">{catMeta.aboutTitle}</h2>
              </div>
              <p className="text-[#10243A]/80 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-white border border-[#DDE2E7] rounded-xl shadow-sm p-6">
                {conference.description}
              </p>
            </section>

          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Apply Card */}
            <div className="bg-[#0B1F33] border border-[#132B45] shadow-academic rounded-xl p-6 space-y-5 text-white">
              <div className="space-y-1.5">
                <h3 className="font-serif text-xl font-bold text-[#FAF8F3]">{catMeta.applyText}</h3>
                <p className="text-xs text-[#8A94A3] leading-relaxed">{catMeta.ctaSubtext}</p>
              </div>
              {conference.externalApplyUrl ? (
                <a
                  href={conference.externalApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-[#D9A441] hover:bg-[#EBCB8B] text-[#0B1F33] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <span>{catMeta.applyText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <button className="w-full py-3.5 bg-white text-[#0B1F33] hover:bg-[#FAF8F3] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm">
                  Register Interest
                </button>
              )}
              <p className="text-[10px] text-center text-[#8A94A3] font-bold uppercase tracking-wider">
                Official external portal
              </p>
            </div>

            {/* Dates Timeline */}
            <div className="bg-white border border-[#DDE2E7] shadow-sm rounded-xl p-6 space-y-5">
              <h3 className="font-display text-sm font-bold text-[#10243A] border-b border-[#DDE2E7] pb-3">
                Important Dates
              </h3>
              <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DDE2E7]">
                <div className="relative pl-6 space-y-0.5">
                  <div className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full bg-[#0B1F33] border-2 border-white ring-1 ring-[#D9A441]" />
                  <p className="text-[11px] font-bold text-[#10243A]">Application / Submission</p>
                  <p className="text-[10px] text-[#5F6B7A]">{formatDate(conference.dates.submissionDeadline)}</p>
                </div>
                <div className="relative pl-6 space-y-0.5">
                  <div className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full bg-[#8A94A3] border-2 border-white" />
                  <p className="text-[11px] font-semibold text-[#10243A]/80">Selection Notification</p>
                  <p className="text-[10px] text-[#5F6B7A]">{conference.dates.notificationDate ? formatDate(conference.dates.notificationDate) : 'Rolling Basis'}</p>
                </div>
                <div className="relative pl-6 space-y-0.5">
                  <div className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full bg-[#8A94A3] border-2 border-white" />
                  <p className="text-[11px] font-semibold text-[#10243A]/80">Early Registration</p>
                  <p className="text-[10px] text-[#5F6B7A]">{conference.dates.cameraReadyDeadline ? formatDate(conference.dates.cameraReadyDeadline) : 'Prior to event'}</p>
                </div>
                <div className="relative pl-6 space-y-0.5">
                  <div className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full bg-[#D9A441] border-2 border-white ring-1 ring-[#0B1F33]" />
                  <p className="text-[11px] font-bold text-[#10243A]">{conference.eventType === 'Internship' ? 'Internship Begins' : 'Conference Begins'}</p>
                  <p className="text-[10px] font-bold text-[#0B1F33]">{formatDate(conference.dates.startDate)}</p>
                </div>
              </div>
            </div>

            {/* Bookmark / Share */}
            <div className="bg-white border border-[#DDE2E7] shadow-sm rounded-xl p-4 flex items-center justify-between">
              <button
                onClick={() => { if (!isAuthenticated) { alert('Please log in to save bookmarks'); return; } toggleBookmark(conference._id); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#10243A] hover:text-[#D9A441] transition-colors"
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-[#0B1F33] text-[#0B1F33]' : 'text-[#5F6B7A]'}`} />
                <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#5F6B7A] hover:text-[#0B1F33] transition-colors"
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

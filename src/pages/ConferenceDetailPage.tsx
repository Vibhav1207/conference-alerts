import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Conference } from '../types';
import { conferenceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Calendar,
  Clock,
  Bookmark,
  ExternalLink,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Cpu,
  Sparkles,
  ShieldCheck,
  Building,
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export const ConferenceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [conference, setConference] = useState<Conference | null>(null);
  const [loading, setLoading] = useState(true);
  const { toggleBookmark, isBookmarked, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchConference = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await conferenceAPI.getConferenceById(id);
        if (res.data.success) {
          setConference(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConference();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-800" />
          <p className="text-xs font-semibold text-slate-600">Loading details from Stitch UI engine...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!conference) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4 text-center px-4">
          <h2 className="font-serif text-2xl font-bold text-navy-900">Listing Not Found</h2>
          <p className="text-xs text-slate-500 max-w-sm">
            The requested opportunity could not be found.
          </p>
          <Link to="/" className="px-4 py-2 bg-navy-900 text-white text-xs font-semibold rounded-xl">
            Return to All Opportunities
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const bookmarked = isBookmarked(conference._id);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'TBA';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryHeader = () => {
    switch (conference.eventType) {
      case 'Internship':
        return {
          badge: 'GLOBAL RESEARCH INTERNSHIP',
          aboutTitle: 'About the Internship',
          topicsTitle: 'Internship Focus & Skills',
          speakersTitle: 'Program Directors & Mentors',
          applyText: 'Apply for Internship',
          ctaSubtext: 'Full stipend & accommodation support. Direct official application portal.',
        };
      case 'Call for Papers':
        return {
          badge: 'CALL FOR PAPERS & SPECIAL ISSUE',
          aboutTitle: 'About the Call for Papers',
          topicsTitle: 'Submission Tracks & Scope',
          speakersTitle: 'Editorial Board & Guest Editors',
          applyText: 'Submit Paper on Publisher Site',
          ctaSubtext: 'Peer-reviewed manuscript submission directly on official journal portal.',
        };
      case 'Workshop / Seminar':
        return {
          badge: 'SPECIALIZED WORKSHOP / SEMINAR',
          aboutTitle: 'About the Workshop',
          topicsTitle: 'Hands-On Topics & Modules',
          speakersTitle: 'Workshop Instructors & Facilitators',
          applyText: 'Register for Workshop',
          ctaSubtext: 'Interactive live session & certificate of participation included.',
        };
      default:
        return {
          badge: 'ANNUAL ACADEMIC SYMPOSIUM',
          aboutTitle: 'About the Conference',
          topicsTitle: 'Conference Topics',
          speakersTitle: 'Keynote Speakers',
          applyText: 'Register Now',
          ctaSubtext: 'Early bird registration open. Limited capacity available.',
        };
    }
  };

  const catMeta = getCategoryHeader();

  // Pre-populated default speakers/mentors if empty to match Stitch 4-card layout
  const speakersList =
    conference.keynoteSpeakers && conference.keynoteSpeakers.length > 0
      ? conference.keynoteSpeakers
      : [
          {
            name: 'Dr. Elena Rostova',
            title: 'Quantum Architecture Lead',
            institution: 'Institute of Advanced Computation',
            avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
          },
          {
            name: 'Prof. Amit Patel',
            title: 'Director of AI Ethics',
            institution: 'Global Tech University',
            avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
          },
          {
            name: 'Sarah Jenkins, PhD',
            title: 'Senior ML Engineer',
            institution: 'Nexus Quantum Lab',
            avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
          },
          {
            name: 'Dr. Chen Wei',
            title: 'Pioneer in Algorithmic Theory',
            institution: 'Shanghai Institute of Tech',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          },
        ];

  // Pre-populated topics cards matching Stitch 2x2 grid
  const topicCards =
    conference.topics && conference.topics.length > 0
      ? conference.topics.map((t, idx) => ({
          title: t,
          desc: `Cutting-edge developments, benchmarks, and applications in ${t.toLowerCase()}.`,
          icon: idx % 4 === 0 ? Cpu : idx % 4 === 1 ? Sparkles : idx % 4 === 2 ? ShieldCheck : Layers,
        }))
      : [
          {
            title: 'Quantum Algorithms',
            desc: 'Design and optimization of hybrid quantum-classical algorithms for machine learning tasks.',
            icon: Cpu,
          },
          {
            title: 'AI Integration',
            desc: 'Architectural frameworks bridging traditional deep learning with quantum processors.',
            icon: Sparkles,
          },
          {
            title: 'Ethics in Computing',
            desc: 'Addressing bias, security, and the socio-economic impacts of next-generation AI models.',
            icon: ShieldCheck,
          },
          {
            title: 'Quantum Cryptography',
            desc: 'Securing AI data pipelines against post-quantum cryptographic threats.',
            icon: Layers,
          },
        ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Header matching Stitch dark slate navy background (#001c3b) */}
      <section className="bg-[#001c3b] text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-navy-900">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Opportunities</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Title & Description Left Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-block">
                <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950/80 px-3 py-1 rounded-md border border-emerald-500/30">
                  {catMeta.badge}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                {conference.title} ({conference.acronym})
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Explore the frontier where academic excellence meets real-world application. Organized by{' '}
                <strong className="text-white">{conference.organizer}</strong>.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="px-3 py-1 bg-navy-800 text-slate-200 text-xs font-semibold rounded-lg border border-navy-700">
                  Category: {conference.category}
                </span>
                <span className="px-3 py-1 bg-purple-950 text-purple-200 text-xs font-semibold rounded-lg border border-purple-800/60">
                  {conference.mode} Attendance
                </span>
              </div>
            </div>

            {/* Pill Cards Right Column in Hero (matching Stitch design) */}
            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex items-center gap-4 text-white shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                    Event Dates
                  </p>
                  <p className="font-bold text-xs sm:text-sm">
                    {formatDate(conference.dates.startDate)} – {formatDate(conference.dates.endDate)}
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex items-center gap-4 text-white shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                    Location
                  </p>
                  <p className="font-bold text-xs sm:text-sm">
                    {conference.venue.city}, {conference.venue.country} &amp; {conference.mode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout (2-Column) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: About, Topics Grid, Keynote Speakers */}
          <div className="lg:col-span-2 space-y-12">
            {/* Section 1: About the Opportunity */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-0.5 bg-navy-900"></div>
                <h2 className="font-serif text-2xl font-bold text-navy-900">
                  {catMeta.aboutTitle}
                </h2>
              </div>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                {conference.description}
              </p>
            </section>

            {/* Section 2: Topics / Tracks (Matching Stitch 2x2 Grid) */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-0.5 bg-navy-900"></div>
                <h2 className="font-serif text-2xl font-bold text-navy-900">
                  {catMeta.topicsTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topicCards.map((topic, idx) => {
                  const Icon = topic.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-slate-100/80 rounded-2xl p-6 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all space-y-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-navy-900 text-white flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-navy-900 text-sm">{topic.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{topic.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 3: Keynote Speakers / Mentors (Matching Stitch 4-Card Grid) */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-0.5 bg-navy-900"></div>
                  <h2 className="font-serif text-2xl font-bold text-navy-900">
                    {catMeta.speakersTitle}
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-semibold">4 Leaders</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {speakersList.map((speaker, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-4 border border-slate-200 text-center space-y-3 shadow-xs hover:shadow-md transition-all group"
                  >
                    <div className="relative w-24 h-24 mx-auto overflow-hidden rounded-xl border-2 border-slate-100 group-hover:border-emerald-800 transition-colors">
                      <img
                        src={speaker.avatarUrl}
                        alt={speaker.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-navy-900 text-xs sm:text-sm line-clamp-1">
                        {speaker.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-emerald-800 line-clamp-1">
                        {speaker.title}
                      </p>
                      <p className="text-[10px] text-slate-500 line-clamp-2">
                        {speaker.institution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar Cards (Matching Stitch UI 1-to-1) */}
          <div className="space-y-6">
            {/* Card 1: "Secure Your Spot / Apply" (Light Blue Container with Emerald Button) */}
            <div className="bg-[#eef2fd] rounded-3xl p-6 border border-blue-100 shadow-sm space-y-5">
              <div className="space-y-1.5">
                <h3 className="font-serif text-xl font-bold text-navy-900">
                  {catMeta.applyText}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{catMeta.ctaSubtext}</p>
              </div>

              {conference.externalApplyUrl ? (
                <a
                  href={conference.externalApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-[#006c49] hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
                >
                  <span>{catMeta.applyText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              ) : (
                <button
                  onClick={() => alert('Official registration link will be updated soon.')}
                  className="w-full py-3.5 bg-navy-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
                >
                  <span>Register Interest</span>
                </button>
              )}

              <p className="text-[10px] text-center text-slate-400 font-semibold">
                Official external registration portal
              </p>
            </div>

            {/* Card 2: "Important Dates" Timeline (Matching Stitch Vertical Dots) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
              <h3 className="font-serif text-lg font-bold text-navy-900 border-b border-slate-100 pb-3">
                Important Dates
              </h3>

              <div className="space-y-5 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {/* Timeline Item 1: Submission / Application Deadline */}
                <div className="relative pl-7 space-y-0.5">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-navy-900 border-2 border-white"></div>
                  <p className="text-xs font-bold text-navy-900">Application / Submission</p>
                  <p className="text-[11px] text-slate-500">
                    {formatDate(conference.dates.submissionDeadline)}
                  </p>
                </div>

                {/* Timeline Item 2: Notification */}
                <div className="relative pl-7 space-y-0.5">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-slate-400 border-2 border-white"></div>
                  <p className="text-xs font-bold text-slate-700">Author / Selection Notification</p>
                  <p className="text-[11px] text-slate-500">
                    {conference.dates.notificationDate
                      ? formatDate(conference.dates.notificationDate)
                      : 'Rolling Basis'}
                  </p>
                </div>

                {/* Timeline Item 3: Camera Ready / Early Reg */}
                <div className="relative pl-7 space-y-0.5">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-slate-400 border-2 border-white"></div>
                  <p className="text-xs font-bold text-slate-700">Early Registration</p>
                  <p className="text-[11px] text-slate-500">
                    {conference.dates.cameraReadyDeadline
                      ? formatDate(conference.dates.cameraReadyDeadline)
                      : 'Prior to event start'}
                  </p>
                </div>

                {/* Timeline Item 4: Program Start (Emerald Highlighted) */}
                <div className="relative pl-7 space-y-0.5">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-[#006c49] border-2 border-white ring-2 ring-emerald-100"></div>
                  <p className="text-xs font-bold text-[#006c49]">
                    {conference.eventType === 'Internship' ? 'Internship Begins' : 'Conference Begins'}
                  </p>
                  <p className="text-[11px] font-bold text-[#006c49]">
                    {formatDate(conference.dates.startDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Bookmark & Share Action Box */}
            <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    alert('Please log in to save bookmarks');
                    return;
                  }
                  toggleBookmark(conference._id);
                }}
                className="inline-flex items-center gap-2 text-xs font-bold text-navy-900 hover:text-emerald-800"
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-navy-900' : ''}`} />
                <span>{bookmarked ? 'Saved to Bookmarks' : 'Bookmark Listing'}</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Listing link copied to clipboard!');
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Share Link
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

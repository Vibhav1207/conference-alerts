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
  Share2,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Building,
  Mail,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  FileText,
  DollarSign,
  Globe,
  Info,
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
          <p className="text-xs font-semibold text-slate-600">Loading details...</p>
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
            The requested event or internship listing could not be found.
          </p>
          <Link to="/" className="px-4 py-2 bg-navy-900 text-white text-xs font-semibold rounded-xl">
            Return to All Listings
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
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const daysLeft = Math.ceil(
    (new Date(conference.dates.submissionDeadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-navy-900 text-white py-12 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Opportunities</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-emerald-800 text-white font-bold text-xs rounded-lg tracking-wider">
                  {conference.eventType || 'Conference'}
                </span>
                <span className="px-2.5 py-1 bg-navy-800 text-slate-300 font-semibold text-xs rounded-lg border border-navy-700">
                  {conference.acronym}
                </span>
                <span className="px-2.5 py-1 bg-purple-950 text-purple-300 font-semibold text-xs rounded-lg border border-purple-800/60">
                  {conference.category}
                </span>
                <span className="px-2.5 py-1 bg-slate-800 text-slate-300 font-semibold text-xs rounded-lg">
                  {conference.mode}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
                {conference.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-emerald-400" />
                  <span>{conference.organizer}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>
                    {conference.venue.city}, {conference.venue.country} ({conference.venue.continent || 'Global'})
                  </span>
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    alert('Please log in to save bookmarks');
                    return;
                  }
                  toggleBookmark(conference._id);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                  bookmarked
                    ? 'bg-emerald-800 text-white shadow-md'
                    : 'bg-navy-800 text-slate-200 hover:bg-navy-750 border border-navy-700'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-white' : ''}`} />
                <span>{bookmarked ? 'Bookmarked' : 'Save Event'}</span>
              </button>

              {conference.externalApplyUrl && (
                <a
                  href={conference.externalApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  <span>Apply on Official Site</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Official Redirect Notice Bar */}
      <div className="bg-amber-50 border-b border-amber-200 py-3.5 px-4 sm:px-6 lg:px-8 text-center text-xs text-amber-900 font-medium flex items-center justify-center gap-2">
        <Info className="w-4 h-4 text-amber-700 flex-shrink-0" />
        <span>
          <strong>Application Information:</strong> This is an informational summary. Submissions & registrations take place directly on the official organizer website. Click <strong>"Apply on Official Site"</strong> below to proceed.
        </span>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Body Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-navy-900 border-b border-slate-100 pb-3">
                Overview & Guidelines
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {conference.description}
              </p>
            </div>

            {/* Topics / Research Tracks */}
            {conference.topics && conference.topics.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-navy-900 border-b border-slate-100 pb-3">
                  Scope & Research Tracks
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {conference.topics.map((topic, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-800 flex-shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Keynote Speakers */}
            {conference.keynoteSpeakers && conference.keynoteSpeakers.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-navy-900 border-b border-slate-100 pb-3">
                  Keynote Speakers & Committee Leaders
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {conference.keynoteSpeakers.map((speaker, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/60"
                    >
                      <img
                        src={
                          speaker.avatarUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                        }
                        alt={speaker.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-emerald-800"
                      />
                      <div className="text-xs space-y-0.5">
                        <h4 className="font-bold text-navy-900 text-sm">{speaker.name}</h4>
                        <p className="text-slate-600 font-medium">{speaker.title}</p>
                        <p className="text-slate-400 text-[11px]">{speaker.institution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fee Structure */}
            {conference.registrationFees && conference.registrationFees.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-navy-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                  <span>Fee / Stipend Details</span>
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
                        <th className="p-3.5 rounded-l-xl">Category</th>
                        <th className="p-3.5 rounded-r-xl text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {conference.registrationFees.map((fee, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3.5 font-semibold text-slate-900">{fee.category}</td>
                          <td className="p-3.5 text-right font-bold text-emerald-800 text-sm">
                            {fee.currency} ${fee.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">
            {/* Key Deadlines Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <h3 className="font-serif text-lg font-bold text-navy-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>Important Deadlines</span>
              </h3>

              {daysLeft > 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-1">
                  <span className="text-[11px] uppercase font-bold text-amber-800 tracking-wider">
                    Application Closes In
                  </span>
                  <p className="font-serif text-3xl font-bold text-amber-900">{daysLeft} Days</p>
                </div>
              ) : (
                <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-center">
                  <span className="text-xs font-bold text-slate-600">Applications Closed</span>
                </div>
              )}

              <div className="space-y-3.5 text-xs text-slate-700">
                <div className="flex items-start justify-between">
                  <span className="text-slate-500 font-medium">Application / Submission:</span>
                  <strong className="text-navy-900 font-bold">{formatDate(conference.dates.submissionDeadline)}</strong>
                </div>

                <div className="flex items-start justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-500 font-medium">Event Dates:</span>
                  <strong className="text-emerald-800 font-bold">
                    {formatDate(conference.dates.startDate)}
                  </strong>
                </div>
              </div>

              {/* Apply Official External Link Button */}
              {conference.externalApplyUrl && (
                <a
                  href={conference.externalApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Apply on Official Site</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Venue & Location */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-navy-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-800" />
                <span>Venue & Location</span>
              </h3>

              <div className="space-y-2 text-xs text-slate-700">
                <p className="font-bold text-navy-900 text-sm">
                  {conference.venue.city}, {conference.venue.country}
                </p>
                <p className="text-slate-500 font-medium">Continent: {conference.venue.continent || 'Global'}</p>
                {conference.venue.address && (
                  <p className="text-slate-500 leading-relaxed">{conference.venue.address}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

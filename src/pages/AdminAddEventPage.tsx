import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { conferenceAPI } from '../services/api';
import { EVENT_TYPES, CATEGORIES, CONTINENTS, LOCATION_HIERARCHY } from '../utils/locationData';
import { Save, ChevronLeft, Plus, Trash2, Loader2, AlertCircle, Link as LinkIcon } from 'lucide-react';

export const AdminAddEventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    acronym: '',
    eventType: 'Conference' as typeof EVENT_TYPES[number],
    organizer: '',
    category: 'Engineering & Tech' as typeof CATEGORIES[number],
    mode: 'In-Person' as 'Hybrid' | 'In-Person' | 'Online',
    continent: 'Asia' as typeof CONTINENTS[number],
    country: 'Japan',
    city: 'Tokyo',
    address: '',
    mapUrl: '',
    startDate: '',
    endDate: '',
    submissionDeadline: '',
    notificationDate: '',
    cameraReadyDeadline: '',
    description: '',
    topicsString: '',
    externalApplyUrl: '',
    websiteUrl: '',
    contactEmail: '',
    status: 'Published' as 'Draft' | 'Pending' | 'Published' | 'Archived',
    featured: false,
    registrationFees: [{ category: 'Participant / Student', amount: 300, currency: 'USD' }],
  });

  // Available countries based on selected continent
  const availableCountries = React.useMemo(() => {
    const map = LOCATION_HIERARCHY[formData.continent];
    return map ? Object.keys(map) : [];
  }, [formData.continent]);

  // Available cities based on selected continent and country
  const availableCities = React.useMemo(() => {
    const map = LOCATION_HIERARCHY[formData.continent];
    return map && map[formData.country] ? map[formData.country] : [];
  }, [formData.continent, formData.country]);

  // Handle continent change
  const handleContinentChange = (newContinent: any) => {
    const map = LOCATION_HIERARCHY[newContinent];
    const defaultCountry = map ? Object.keys(map)[0] : '';
    const defaultCity = map && defaultCountry ? map[defaultCountry][0] : '';

    setFormData((prev) => ({
      ...prev,
      continent: newContinent,
      country: defaultCountry,
      city: defaultCity,
    }));
  };

  // Handle country change
  const handleCountryChange = (newCountry: string) => {
    const map = LOCATION_HIERARCHY[formData.continent];
    const defaultCity = map && map[newCountry] ? map[newCountry][0] : '';

    setFormData((prev) => ({
      ...prev,
      country: newCountry,
      city: defaultCity,
    }));
  };

  useEffect(() => {
    if (isEditing && id) {
      const fetchConference = async () => {
        setLoading(true);
        try {
          const res = await conferenceAPI.getConferenceById(id);
          if (res.data.success) {
            const conf = res.data.data;
            setFormData({
              title: conf.title,
              acronym: conf.acronym,
              eventType: conf.eventType || 'Conference',
              organizer: conf.organizer,
              category: (conf.category as any) || 'Engineering & Tech',
              mode: conf.mode,
              continent: (conf.venue.continent as any) || 'Asia',
              country: conf.venue.country || 'Japan',
              city: conf.venue.city || 'Tokyo',
              address: conf.venue.address || '',
              mapUrl: conf.venue.mapUrl || '',
              startDate: conf.dates.startDate ? new Date(conf.dates.startDate).toISOString().split('T')[0] : '',
              endDate: conf.dates.endDate ? new Date(conf.dates.endDate).toISOString().split('T')[0] : '',
              submissionDeadline: conf.dates.submissionDeadline
                ? new Date(conf.dates.submissionDeadline).toISOString().split('T')[0]
                : '',
              notificationDate: conf.dates.notificationDate
                ? new Date(conf.dates.notificationDate).toISOString().split('T')[0]
                : '',
              cameraReadyDeadline: conf.dates.cameraReadyDeadline
                ? new Date(conf.dates.cameraReadyDeadline).toISOString().split('T')[0]
                : '',
              description: conf.description,
              topicsString: conf.topics ? conf.topics.join(', ') : '',
              externalApplyUrl: conf.externalApplyUrl || '',
              websiteUrl: conf.websiteUrl || '',
              contactEmail: conf.contactEmail || '',
              status: conf.status,
              featured: conf.featured,
              registrationFees: conf.registrationFees || [],
            });
          }
        } catch (err) {
          console.error('Failed to load event:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchConference();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      title: formData.title,
      acronym: formData.acronym,
      eventType: formData.eventType,
      organizer: formData.organizer,
      category: formData.category,
      mode: formData.mode,
      venue: {
        continent: formData.continent,
        country: formData.country,
        city: formData.city,
        address: formData.address,
        mapUrl: formData.mapUrl,
      },
      dates: {
        startDate: formData.startDate,
        endDate: formData.endDate,
        submissionDeadline: formData.submissionDeadline,
        notificationDate: formData.notificationDate || undefined,
        cameraReadyDeadline: formData.cameraReadyDeadline || undefined,
      },
      description: formData.description,
      topics: formData.topicsString.split(',').map((t) => t.trim()).filter(Boolean),
      registrationFees: formData.registrationFees,
      externalApplyUrl: formData.externalApplyUrl,
      websiteUrl: formData.websiteUrl,
      contactEmail: formData.contactEmail,
      status: formData.status,
      featured: formData.featured,
    };

    try {
      if (isEditing && id) {
        await conferenceAPI.updateConference(id, payload as any);
        alert('Listing updated successfully!');
      } else {
        await conferenceAPI.createConference(payload as any);
        alert('New academic opportunity created successfully!');
      }
      navigate('/admin/conferences');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save listing. Please verify all dropdown selections.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-800" />
          <p className="text-xs font-semibold text-slate-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title={isEditing ? 'Edit Academic Opportunity' : 'Post New Academic Opportunity'}
          subtitle="Publish Conferences, Research Internships, Call for Papers, and Workshops with official redirect links"
        />

        <main className="p-8 max-w-4xl space-y-8">
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* General Information Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-navy-900 border-b border-slate-100 pb-3">
                General Information & Type
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Listing Type</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-semibold text-emerald-900"
                  >
                    {EVENT_TYPES.filter((t) => t !== 'All').map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Listing Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. CERN International Research Internship in Quantum Physics"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Acronym / Code</label>
                  <input
                    type="text"
                    required
                    value={formData.acronym}
                    onChange={(e) => setFormData({ ...formData, acronym: e.target.value })}
                    placeholder="e.g. CERN-INT 2026"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Academic Category / Domain</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Attendance Mode</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                  >
                    <option value="In-Person">In-Person</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Organizing Body / Institution</label>
                <input
                  type="text"
                  required
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  placeholder="e.g. European Organization for Nuclear Research (CERN)"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Overview & Scope</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide a comprehensive summary of the scope, eligibility, and themes..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                />
              </div>
            </div>

            {/* Official Redirect Link Section */}
            <div className="bg-emerald-50/80 rounded-3xl p-6 border border-emerald-200 shadow-sm space-y-3">
              <h3 className="font-serif text-lg font-bold text-emerald-950 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-emerald-800" />
                <span>Official External Application / Registration Link</span>
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Applicants are redirected to this URL when clicking "Apply on Official Site".
              </p>
              <input
                type="url"
                required
                value={formData.externalApplyUrl}
                onChange={(e) => setFormData({ ...formData, externalApplyUrl: e.target.value })}
                placeholder="https://official-conference-site.org/register"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-800 bg-white font-mono"
              />
            </div>

            {/* Location Hierarchy Dropdowns Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-navy-900 border-b border-slate-100 pb-3">
                Location Hierarchy Dropdowns
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Continent</label>
                  <select
                    value={formData.continent}
                    onChange={(e) => handleContinentChange(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium text-slate-800"
                  >
                    {CONTINENTS.filter((c) => c !== 'All').map((cont) => (
                      <option key={cont} value={cont}>
                        {cont}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Host Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium text-slate-800"
                  >
                    {availableCountries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Host City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium text-slate-800"
                  >
                    {availableCities.map((ct) => (
                      <option key={ct} value={ct}>
                        {ct}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Specific Venue / Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. CERN Science Gateway, Esplanade des Particules 1"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                />
              </div>
            </div>

            {/* Key Deadlines */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-navy-900 border-b border-slate-100 pb-3">
                Key Deadlines & Dates
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Application / Paper Deadline</label>
                  <input
                    type="date"
                    required
                    value={formData.submissionDeadline}
                    onChange={(e) => setFormData({ ...formData, submissionDeadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/admin/conferences')}
                className="px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isEditing ? 'Save Changes' : 'Publish Opportunity'}</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

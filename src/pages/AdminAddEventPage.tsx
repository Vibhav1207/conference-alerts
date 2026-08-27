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
    conferenceScope: '' as '' | 'International' | 'National',
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
              conferenceScope: (conf.conferenceScope as any) || '',
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
      conferenceScope: formData.conferenceScope || undefined,
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
      <div className="flex min-h-screen bg-brutal-cream">
        <AdminSidebar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-brutal-black border-t-brutal-yellow animate-spin" />
          <p className="text-xs font-bold text-brutal-black/50">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-brutal-cream">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title={isEditing ? 'Edit Academic Opportunity' : 'Post New Academic Opportunity'}
          subtitle="Publish Conferences, Research Internships, Journals, and Workshops with official redirect links"
        />

        <main className="p-8 max-w-4xl space-y-8">
          {error && (
            <div className="p-4 bg-brutal-red/10 border-3 border-brutal-red text-xs text-brutal-red font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* General Information Section */}
            <div className="bg-white border-3 border-brutal-black shadow-brutal p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b-3 border-brutal-black">
                <div className="w-3 h-6 bg-brutal-yellow" />
                <h3 className="font-serif text-lg font-bold text-brutal-black">
                  General Information & Type
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="brutal-label">Listing Type</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value as any })}
                    className="brutal-select text-xs"
                  >
                    {EVENT_TYPES.filter((t) => t !== 'All').map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="brutal-label">Full Listing Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. CERN International Research Internship in Quantum Physics"
                    className="brutal-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="brutal-label">Acronym / Code</label>
                  <input
                    type="text"
                    required
                    value={formData.acronym}
                    onChange={(e) => setFormData({ ...formData, acronym: e.target.value })}
                    placeholder="e.g. CERN-INT 2026"
                    className="brutal-input"
                  />
                </div>

                <div>
                  <label className="brutal-label">Academic Category / Domain</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="brutal-select text-xs"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="brutal-label">Attendance Mode</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value as any })}
                    className="brutal-select text-xs"
                  >
                    <option value="In-Person">In-Person</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Online">Online</option>
                  </select>
                </div>

                {formData.eventType === 'Conference' && (
                  <div>
                    <label className="brutal-label">Conference Scope</label>
                    <select
                      value={formData.conferenceScope}
                      onChange={(e) => setFormData({ ...formData, conferenceScope: e.target.value as '' | 'International' | 'National' })}
                      className="brutal-select text-xs"
                    >
                      <option value="">Not Applicable</option>
                      <option value="International">International</option>
                      <option value="National">National</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="brutal-label">Organizing Body / Institution</label>
                <input
                  type="text"
                  required
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  placeholder="e.g. European Organization for Nuclear Research (CERN)"
                  className="brutal-input"
                />
              </div>

              <div>
                <label className="brutal-label">Overview & Scope</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide a comprehensive summary of the scope, eligibility, and themes..."
                  className="brutal-input resize-none"
                />
              </div>
            </div>

            {/* Official Redirect Link Section */}
            <div className="bg-brutal-yellow/20 border-3 border-brutal-black shadow-brutal p-6 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b-3 border-brutal-black">
                <div className="w-3 h-6 bg-brutal-green" />
                <h3 className="font-serif text-lg font-bold text-brutal-black flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  <span>Official External Application / Registration Link</span>
                </h3>
              </div>
              <p className="text-xs text-brutal-black/60 leading-relaxed">
                Applicants are redirected to this URL when clicking "Apply on Official Site".
              </p>
              <input
                type="url"
                required
                value={formData.externalApplyUrl}
                onChange={(e) => setFormData({ ...formData, externalApplyUrl: e.target.value })}
                placeholder="https://official-conference-site.org/register"
                className="brutal-input font-mono text-xs"
              />
            </div>

            {/* Location Hierarchy Dropdowns Section */}
            <div className="bg-white border-3 border-brutal-black shadow-brutal p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b-3 border-brutal-black">
                <div className="w-3 h-6 bg-brutal-blue" />
                <h3 className="font-serif text-lg font-bold text-brutal-black">
                  Location Hierarchy Dropdowns
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="brutal-label">Continent</label>
                  <select
                    value={formData.continent}
                    onChange={(e) => handleContinentChange(e.target.value as any)}
                    className="brutal-select text-xs"
                  >
                    {CONTINENTS.filter((c) => c !== 'All').map((cont) => (
                      <option key={cont} value={cont}>
                        {cont}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="brutal-label">Host Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="brutal-select text-xs"
                  >
                    {availableCountries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="brutal-label">Host City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="brutal-select text-xs"
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
                <label className="brutal-label">Specific Venue / Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. CERN Science Gateway, Esplanade des Particules 1"
                  className="brutal-input"
                />
              </div>
            </div>

            {/* Key Deadlines */}
            <div className="bg-white border-3 border-brutal-black shadow-brutal p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b-3 border-brutal-black">
                <div className="w-3 h-6 bg-brutal-red" />
                <h3 className="font-serif text-lg font-bold text-brutal-black">
                  Key Deadlines & Dates
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="brutal-label">Application / Paper Deadline</label>
                  <input
                    type="date"
                    required
                    value={formData.submissionDeadline}
                    onChange={(e) => setFormData({ ...formData, submissionDeadline: e.target.value })}
                    className="brutal-input"
                  />
                </div>

                <div>
                  <label className="brutal-label">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="brutal-input"
                  />
                </div>

                <div>
                  <label className="brutal-label">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="brutal-input"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/admin/conferences')}
                className="brutal-btn-outline text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="brutal-btn-primary text-xs"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isEditing ? 'Save Changes' : 'Publish Opportunity'}</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

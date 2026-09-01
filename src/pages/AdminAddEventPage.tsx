import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { conferenceAPI, Category } from '../services/api';
import { EVENT_TYPES, CONTINENTS, LOCATION_HIERARCHY } from '../utils/locationData';
import { PUBLISHER_LOGOS } from '../utils/logos';
import { Save, Plus, Trash2, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const sectionVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export const AdminAddEventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch dynamic categories
  useEffect(() => {
    conferenceAPI.getCategories().then((res) => {
      if (res.data.success) setCategories(res.data.data);
    }).catch(() => {});
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    acronym: '',
    publisherLogos: ['ieee', 'scopus'] as string[],
    eventType: 'Conference' as typeof EVENT_TYPES[number],
    organizer: '',
    category: 'Engineering & Tech',
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
              publisherLogos: conf.publisherLogos || (conf.publisherLogo ? conf.publisherLogo.split(',') : ['ieee', 'scopus']),
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
      publisherLogos: formData.publisherLogos,
      publisherLogo: formData.publisherLogos.join(','),
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
        <AdminSidebar mobileOpen={mobileSidebarOpen} onToggle={() => setMobileSidebarOpen(false)} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-brutal-black border-t-brutal-yellow animate-spin" />
          <p className="text-xs font-bold text-brutal-black/50">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-brutal-cream">
      <AdminSidebar mobileOpen={mobileSidebarOpen} onToggle={() => setMobileSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title={isEditing ? 'Edit Academic Opportunity' : 'Post New Academic Opportunity'}
          subtitle="Publish Conferences, Research Internships, Journals, and Workshops"
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6 sm:space-y-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-brutal-red/10 border-3 border-brutal-red text-xs text-brutal-red font-bold flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* General Information Section */}
            <motion.div custom={0} variants={sectionVariant} initial="hidden" animate="visible" className="bg-white border-3 border-brutal-black shadow-brutal p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b-3 border-brutal-black">
                <div className="w-3 h-6 bg-brutal-yellow" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-brutal-black">
                  General Information & Type
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="brutal-label">Listing Type</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value as any })}
                    className="brutal-select text-xs"
                  >
                    {EVENT_TYPES.filter((t) => t !== 'All').map((type) => (
                      <option key={type} value={type}>{type}</option>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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
                  <label className="brutal-label">Academic Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="brutal-select text-xs"
                  >
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))
                    ) : (
                      <option value="Engineering & Tech">Engineering & Tech</option>
                    )}
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

              {/* Publisher / Indexing Logo Multi-Picker */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="brutal-label mb-0">Publisher & Indexing Logos (Select Multiple)</label>
                  <span className="text-[10px] font-mono font-bold text-brutal-black/60">
                    {formData.publisherLogos.length} Selected
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {PUBLISHER_LOGOS.map((logo) => {
                    const isSelected = formData.publisherLogos.includes(logo.id);
                    return (
                      <button
                        type="button"
                        key={logo.id}
                        onClick={() => {
                          const exists = formData.publisherLogos.includes(logo.id);
                          const updated = exists
                            ? formData.publisherLogos.filter((id) => id !== logo.id)
                            : [...formData.publisherLogos, logo.id];
                          setFormData({ ...formData, publisherLogos: updated });
                        }}
                        className={`p-3 border-3 border-brutal-black text-center transition-all flex flex-col items-center justify-between gap-1.5 ${
                          isSelected
                            ? 'bg-brutal-yellow shadow-brutal translate-y-[-2px]'
                            : 'bg-white hover:bg-brutal-cream shadow-brutal-sm opacity-60'
                        }`}
                      >
                        <img src={logo.src} alt={logo.name} className="h-6 object-contain" />
                        <span className="text-[10px] font-bold font-mono text-brutal-black">{logo.shortName}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 border border-brutal-black uppercase ${
                            isSelected ? 'bg-brutal-black text-brutal-yellow' : 'bg-brutal-cream text-brutal-black/50'
                          }`}
                        >
                          {isSelected ? 'Selected ✓' : '+ Add'}
                        </span>
                      </button>
                    );
                  })}
                </div>
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
            </motion.div>

            {/* Official Redirect Link Section */}
            <motion.div custom={1} variants={sectionVariant} initial="hidden" animate="visible" className="bg-brutal-yellow/20 border-3 border-brutal-black shadow-brutal p-4 sm:p-6 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b-3 border-brutal-black">
                <div className="w-3 h-6 bg-brutal-green" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-brutal-black flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  <span>External Application / Registration Link</span>
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
            </motion.div>

            {/* Location Section */}
            <motion.div custom={2} variants={sectionVariant} initial="hidden" animate="visible" className="bg-white border-3 border-brutal-black shadow-brutal p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b-3 border-brutal-black">
                <div className="w-3 h-6 bg-brutal-blue" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-brutal-black">
                  Location Hierarchy
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="brutal-label">Continent</label>
                  <select
                    value={formData.continent}
                    onChange={(e) => handleContinentChange(e.target.value as any)}
                    className="brutal-select text-xs"
                  >
                    {CONTINENTS.filter((c) => c !== 'All').map((cont) => (
                      <option key={cont} value={cont}>{cont}</option>
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
                      <option key={c} value={c}>{c}</option>
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
                      <option key={ct} value={ct}>{ct}</option>
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
            </motion.div>

            {/* Key Deadlines */}
            <motion.div custom={3} variants={sectionVariant} initial="hidden" animate="visible" className="bg-white border-3 border-brutal-black shadow-brutal p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b-3 border-brutal-black">
                <div className="w-3 h-6 bg-brutal-red" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-brutal-black">
                  Key Deadlines & Dates
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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
            </motion.div>

            {/* Submit Action Bar */}
            <motion.div custom={4} variants={sectionVariant} initial="hidden" animate="visible" className="flex items-center justify-end gap-3 pt-4">
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
            </motion.div>
          </form>
        </main>
      </div>
    </div>
  );
};

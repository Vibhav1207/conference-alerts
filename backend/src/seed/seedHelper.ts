import { User } from '../models/User';
import { Conference } from '../models/Conference';
import { Resource } from '../models/Resource';

export const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return; // Database already seeded
    }

    console.log('[AutoSeed] Database is empty. Creating default Admin & initial data...');

    // 1. Create Admin User
    const adminUser = await User.create({
      name: 'Nitin Sir (Admin)',
      email: 'admin@nitinsir.org',
      password: 'AdminPassword123!',
      role: 'admin',
      institution: 'Global Academic Research Institute',
      country: 'India',
    });

    // 2. Create Initial Opportunities
    const events = [
      {
        title: 'Intl. Conference on Quantum Computing and Artificial Intelligence',
        acronym: 'ICQCAI 2026',
        eventType: 'Conference',
        organizer: 'IEEE Computer Society & Nitin Sir Academic Forum',
        category: 'Engineering & Tech',
        mode: 'Hybrid',
        venue: {
          continent: 'Europe',
          country: 'Switzerland',
          city: 'Zurich',
          address: 'Swiss Federal Institute of Technology (ETH Zurich)',
        },
        dates: {
          startDate: new Date('2026-10-14'),
          endDate: new Date('2026-10-18'),
          submissionDeadline: new Date('2026-06-15'),
        },
        description:
          'ICQCAI 2026 brings together international researchers, industry pioneers, and academic leaders to share developments in Quantum Algorithms & Machine Learning.',
        topics: ['Quantum Neural Networks & Machine Learning', 'Fault-Tolerant Quantum Algorithms'],
        registrationFees: [{ category: 'Academic Researcher', amount: 550, currency: 'USD' }],
        externalApplyUrl: 'https://easychair.org/conferences/?conf=icqcai2026',
        status: 'Published',
        featured: true,
        createdById: adminUser._id,
      },
      {
        title: 'CERN International Research Internship in Quantum Physics & Life Sciences',
        acronym: 'CERN-INT 2026',
        eventType: 'Internship',
        organizer: 'European Organization for Nuclear Research (CERN)',
        category: 'Physical & Life Sciences',
        mode: 'In-Person',
        venue: {
          continent: 'Europe',
          country: 'Switzerland',
          city: 'Geneva',
          address: 'CERN Science Gateway',
        },
        dates: {
          startDate: new Date('2026-06-01'),
          endDate: new Date('2026-08-31'),
          submissionDeadline: new Date('2026-03-31'),
        },
        description:
          'A fully-funded 3-month research internship at CERN for undergraduate and master students in physics, computer science, and bio-engineering.',
        topics: ['High Energy Physics Simulation', 'Biophysics & Sensors'],
        registrationFees: [{ category: 'Stipend Provided to Interns', amount: 0, currency: 'CHF' }],
        externalApplyUrl: 'https://careers.cern/summer-student-programme',
        status: 'Published',
        featured: true,
        createdById: adminUser._id,
      },
      {
        title: 'Call for Papers: IEEE Special Issue on AI in Agricultural & Biological Engineering',
        acronym: 'CFP-AIAGRI 2026',
        eventType: 'Call for Papers',
        organizer: 'IEEE Transactions on Agricultural & Biological Engineering',
        category: 'Agricultural & Biological Sciences',
        mode: 'Online',
        venue: {
          continent: 'Asia',
          country: 'Japan',
          city: 'Tokyo',
        },
        dates: {
          startDate: new Date('2026-09-01'),
          endDate: new Date('2026-09-05'),
          submissionDeadline: new Date('2026-07-15'),
        },
        description:
          'Inviting original research papers and review articles on computer vision for crop disease detection, precision irrigation sensors, and automated harvesting robotics.',
        topics: ['Precision Agriculture Sensor Networks', 'Hyperspectral Imaging'],
        registrationFees: [{ category: 'Open Access APC', amount: 1200, currency: 'USD' }],
        externalApplyUrl: 'https://ieee.org/publications/submit-agri-2026',
        status: 'Published',
        featured: false,
        createdById: adminUser._id,
      },
      {
        title: 'Global Summit on Telemedicine, AI Diagnostics & Clinical Imaging',
        acronym: 'GSTAD 2026',
        eventType: 'Conference',
        organizer: 'World Healthcare Federation',
        category: 'Medical & Health Sciences',
        mode: 'In-Person',
        venue: {
          continent: 'North America',
          country: 'United States',
          city: 'Boston',
        },
        dates: {
          startDate: new Date('2026-11-05'),
          endDate: new Date('2026-11-08'),
          submissionDeadline: new Date('2026-07-20'),
        },
        description:
          'Exploring transformative AI diagnostic algorithms, remote patient monitoring devices, and ethics in AI-assisted surgical procedures.',
        topics: ['Computer Vision in Medical Imaging', 'AI Clinical Decision Support'],
        registrationFees: [{ category: 'Regular Participant', amount: 600, currency: 'USD' }],
        externalApplyUrl: 'https://gstad2026.med.org/register',
        status: 'Published',
        featured: true,
        createdById: adminUser._id,
      },
      {
        title: 'Workshop on Digital Economy & FinTech Risk Modeling',
        acronym: 'WSFADE-WS 2026',
        eventType: 'Workshop / Seminar',
        organizer: 'Global Business & Management Forum',
        category: 'Business & Management',
        mode: 'Online',
        venue: {
          continent: 'Europe',
          country: 'United Kingdom',
          city: 'London',
        },
        dates: {
          startDate: new Date('2026-11-20'),
          endDate: new Date('2026-11-22'),
          submissionDeadline: new Date('2026-09-01'),
        },
        description:
          'Hands-on workshop addressing algorithmic trading risk models, decentralized finance regulatory frameworks, and AI in central bank digital currencies.',
        topics: ['High-Frequency Algorithmic Trading', 'Decentralized Finance'],
        registrationFees: [{ category: 'Virtual Attendee', amount: 150, currency: 'USD' }],
        externalApplyUrl: 'https://wsfade2026.org/workshop-register',
        status: 'Published',
        featured: false,
        createdById: adminUser._id,
      },
    ];

    await Conference.insertMany(events);

    // 3. Create Resources
    const resources = [
      {
        title: 'IEEE Standard Two-Column Paper Template (2026 Edition)',
        category: 'LaTeX Template',
        description: 'Official IEEE double-column conference paper manuscript template with predefined styles.',
        fileFormat: 'TEX',
        fileUrl: 'https://www.ieee.org/content/dam/ieee-org/ieee/web/org/pubs/conference-latex-template.zip',
        fileSize: '2.4 MB',
        createdById: adminUser._id,
      },
      {
        title: 'Springer LNCS Author Manuscript Guidelines & Word Template',
        category: 'Word Template',
        description: 'Formatted Microsoft Word template adhering to Springer LNCS guidelines.',
        fileFormat: 'DOCX',
        fileUrl: 'https://www.springer.com/gp/computer-science/lncs/word-template.docx',
        fileSize: '1.8 MB',
        createdById: adminUser._id,
      },
      {
        title: 'Scopus & Web of Science Indexing Verification Checklist',
        category: 'Journal Indexing Guide',
        description: 'Step-by-step guide to verify whether a conference proceeding is indexed in Scopus or WoS.',
        fileFormat: 'PDF',
        fileUrl: 'https://nitinsir.org/assets/scopus-wos-indexing-guide.pdf',
        fileSize: '850 KB',
        createdById: adminUser._id,
      },
    ];

    await Resource.insertMany(resources);

    console.log('[AutoSeed] Successfully seeded Admin user & initial database content!');
  } catch (err) {
    console.error('[AutoSeed] Error auto seeding:', err);
  }
};

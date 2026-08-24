"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("../config/db");
const User_1 = require("../models/User");
const Conference_1 = require("../models/Conference");
const Resource_1 = require("../models/Resource");
dotenv_1.default.config();
const seedData = async () => {
    try {
        console.log('[Seed] Connecting to database...');
        await (0, db_1.connectDB)();
        console.log('[Seed] Clearing existing collections...');
        await User_1.User.deleteMany({});
        await Conference_1.Conference.deleteMany({});
        await Resource_1.Resource.deleteMany({});
        console.log('[Seed] Creating admin user & default user...');
        const adminUser = await User_1.User.create({
            name: 'Nitin Sir (Admin)',
            email: 'admin@nitinsir.org',
            password: 'AdminPassword123!',
            role: 'admin',
            institution: 'Global Academic Research Institute',
            country: 'India',
        });
        const demoUser = await User_1.User.create({
            name: 'Dr. Sarah Jenkins',
            email: 'sarah.jenkins@university.edu',
            password: 'UserPassword123!',
            role: 'user',
            institution: 'Stanford University',
            country: 'United States',
        });
        console.log('[Seed] Creating academic events (Conferences, Internships, Call for Papers, Workshops)...');
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
                    address: 'Swiss Federal Institute of Technology (ETH Zurich), Auditorium Maximum',
                    mapUrl: 'https://maps.google.com/?q=ETH+Zurich',
                },
                dates: {
                    startDate: new Date('2026-10-14'),
                    endDate: new Date('2026-10-18'),
                    submissionDeadline: new Date('2026-06-15'),
                    notificationDate: new Date('2026-07-25'),
                    cameraReadyDeadline: new Date('2026-08-30'),
                },
                description: 'ICQCAI 2026 brings together international researchers, industry pioneers, and academic leaders to share groundbreaking developments at the intersection of Quantum Algorithms, Machine Learning Architectures, and Quantum Hardware acceleration.',
                topics: [
                    'Quantum Neural Networks & Machine Learning',
                    'Fault-Tolerant Quantum Algorithms',
                    'Quantum Key Distribution & Cryptography',
                ],
                keynoteSpeakers: [
                    {
                        name: 'Prof. Elena Rostova',
                        title: 'Head of Quantum Research',
                        institution: 'ETH Zurich & CERN Quantum Initiative',
                        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
                    },
                ],
                registrationFees: [
                    { category: 'Full Time Student', amount: 350, currency: 'USD' },
                    { category: 'Academic Author / Researcher', amount: 550, currency: 'USD' },
                ],
                externalApplyUrl: 'https://easychair.org/conferences/?conf=icqcai2026',
                websiteUrl: 'https://icqcai2026.org',
                contactEmail: 'contact@icqcai2026.org',
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
                    address: 'CERN Science Gateway, Esplanade des Particules 1',
                    mapUrl: 'https://maps.google.com/?q=CERN+Geneva',
                },
                dates: {
                    startDate: new Date('2026-06-01'),
                    endDate: new Date('2026-08-31'),
                    submissionDeadline: new Date('2026-03-31'),
                },
                description: 'A fully-funded 3-month research internship at CERN for undergraduate and master students in physics, computer science, and bio-engineering to work on high-energy particle simulation and biophysics.',
                topics: [
                    'High Energy Physics Simulation',
                    'Biophysics & Medical Radiation Sensors',
                    'Distributed Grid Computing',
                ],
                keynoteSpeakers: [],
                registrationFees: [
                    { category: 'Stipend Provided to Interns', amount: 0, currency: 'CHF' },
                ],
                externalApplyUrl: 'https://careers.cern/summer-student-programme',
                websiteUrl: 'https://home.cern',
                contactEmail: 'internships@cern.ch',
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
                    address: 'Tokyo University of Agriculture and Technology',
                },
                dates: {
                    startDate: new Date('2026-09-01'),
                    endDate: new Date('2026-09-05'),
                    submissionDeadline: new Date('2026-07-15'),
                },
                description: 'Inviting original research papers and review articles on computer vision for crop disease detection, precision irrigation sensors, and automated harvesting robotics.',
                topics: [
                    'Precision Agriculture Sensor Networks',
                    'Hyperspectral Imaging for Crop Diagnostics',
                    'Autonomous Agricultural Drones',
                ],
                keynoteSpeakers: [],
                registrationFees: [
                    { category: 'Open Access APC (upon acceptance)', amount: 1200, currency: 'USD' },
                ],
                externalApplyUrl: 'https://ieee.org/publications/submit-agri-2026',
                websiteUrl: 'https://ieee.org/agri-ai-2026',
                contactEmail: 'editor@ieee-agri.org',
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
                    address: 'Harvard Medical Center Convention Hall, Boston MA',
                    mapUrl: 'https://maps.google.com/?q=Boston+Medical+Center',
                },
                dates: {
                    startDate: new Date('2026-11-05'),
                    endDate: new Date('2026-11-08'),
                    submissionDeadline: new Date('2026-07-20'),
                    notificationDate: new Date('2026-08-30'),
                    cameraReadyDeadline: new Date('2026-09-25'),
                },
                description: 'Exploring transformative AI diagnostic algorithms, remote patient monitoring devices, and ethics in AI-assisted surgical procedures.',
                topics: [
                    'Computer Vision in Medical Imaging',
                    'AI-Powered Clinical Decision Support Systems',
                ],
                keynoteSpeakers: [
                    {
                        name: 'Dr. Aris Thorne',
                        title: 'Director of Telemedicine',
                        institution: 'Johns Hopkins School of Medicine',
                        avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
                    },
                ],
                registrationFees: [
                    { category: 'Regular Participant', amount: 600, currency: 'USD' },
                ],
                externalApplyUrl: 'https://gstad2026.med.org/register',
                websiteUrl: 'https://gstad2026.med.org',
                contactEmail: 'info@gstad2026.org',
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
                    address: 'Virtual Conference Center & LSE Campus',
                },
                dates: {
                    startDate: new Date('2026-11-20'),
                    endDate: new Date('2026-11-22'),
                    submissionDeadline: new Date('2026-09-01'),
                },
                description: 'Hands-on workshop addressing algorithmic trading risk models, decentralized finance regulatory frameworks, and AI in central bank digital currencies.',
                topics: [
                    'High-Frequency Algorithmic Trading',
                    'Decentralized Autonomous Organizations (DAOs)',
                ],
                keynoteSpeakers: [],
                registrationFees: [
                    { category: 'Virtual Attendee', amount: 150, currency: 'USD' },
                ],
                externalApplyUrl: 'https://wsfade2026.org/workshop-register',
                websiteUrl: 'https://wsfade2026.org',
                contactEmail: 'support@wsfade2026.org',
                status: 'Published',
                featured: false,
                createdById: adminUser._id,
            },
        ];
        await Conference_1.Conference.insertMany(events);
        console.log('[Seed] Creating academic resources...');
        const resources = [
            {
                title: 'IEEE Standard Two-Column Paper Template (2026 Edition)',
                category: 'LaTeX Template',
                description: 'Official IEEE double-column conference paper manuscript template with predefined styles, citations, and figure formatting.',
                fileFormat: 'TEX',
                fileUrl: 'https://www.ieee.org/content/dam/ieee-org/ieee/web/org/pubs/conference-latex-template.zip',
                fileSize: '2.4 MB',
                downloadCount: 1420,
                createdById: adminUser._id,
            },
            {
                title: 'Springer LNCS Author Manuscript Guidelines & Word Template',
                category: 'Word Template',
                description: 'Formatted Microsoft Word template adhering to Springer Lecture Notes in Computer Science (LNCS) proceedings guidelines.',
                fileFormat: 'DOCX',
                fileUrl: 'https://www.springer.com/gp/computer-science/lncs/word-template.docx',
                fileSize: '1.8 MB',
                downloadCount: 980,
                createdById: adminUser._id,
            },
            {
                title: 'Scopus & Web of Science Indexing Verification Checklist',
                category: 'Journal Indexing Guide',
                description: 'Step-by-step guide to verify whether a conference proceeding is truly indexed in Scopus, Ei Compendex, or Web of Science Core Collection.',
                fileFormat: 'PDF',
                fileUrl: 'https://nitinsir.org/assets/scopus-wos-indexing-guide.pdf',
                fileSize: '850 KB',
                downloadCount: 3120,
                createdById: adminUser._id,
            },
        ];
        await Resource_1.Resource.insertMany(resources);
        console.log('==================================================');
        console.log('[Seed] Database seeding completed successfully!');
        console.log(`[Seed] Admin User: admin@nitinsir.org / AdminPassword123!`);
        console.log(`[Seed] Events created: ${events.length}`);
        console.log(`[Seed] Resources created: ${resources.length}`);
        console.log('==================================================');
        await (0, db_1.closeDB)();
    }
    catch (error) {
        console.error('[Seed] Database seeding failed:', error);
        process.exit(1);
    }
};
seedData();

import { User } from '../models/User';
import { Category } from '../models/Category';

const DEFAULT_CATEGORIES = [
  'Engineering & Tech',
  'Physical & Life Sciences',
  'Agricultural & Biological Sciences',
  'Medical & Health Sciences',
  'Business & Management',
  'Arts & Humanities',
  'Social Sciences',
  'FDP',
];

export const autoSeedIfEmpty = async () => {
  try {
    // Seed default categories if none exist
    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      console.log('[Init] Seeding default academic categories...');
      for (const name of DEFAULT_CATEGORIES) {
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        await Category.create({ name, slug, isActive: true });
      }
      console.log(`[Init] ${DEFAULT_CATEGORIES.length} categories seeded.`);
    }

    // 1. FRESH RESET ADMIN ACCOUNTS SO LOGIN WITH AdminPassword123! NEVER FAILS
    await User.deleteMany({
      email: { $in: ['admin@nitinsir.org', 'admin@conferencealerts.com'] },
    });

    console.log('[Init] Creating fresh Admin account admin@nitinsir.org...');
    await User.create({
      name: 'Nitin Sir (Admin)',
      email: 'admin@nitinsir.org',
      password: 'AdminPassword123!',
      role: 'admin',
      institution: 'Global Academic Research Institute',
      country: 'India',
    });

    await User.create({
      name: 'Portal Administrator',
      email: 'admin@conferencealerts.com',
      password: 'AdminPassword123!',
      role: 'admin',
      institution: 'Nitin Sir Academic Portal',
      country: 'Global',
    });

    console.log('[Init] Admin user admin@nitinsir.org freshly created & ready for login!');
  } catch (err) {
    console.error('[Init] Error initializing admin accounts:', err);
  }
};

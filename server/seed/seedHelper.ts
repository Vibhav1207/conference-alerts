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
];

export const autoSeedIfEmpty = async () => {
  try {
    // Seed default categories if none exist
    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      console.log('[Init] Seeding default academic categories...');
      for (const name of DEFAULT_CATEGORIES) {
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        await Category.create({ name, slug, isActive: true }).catch(() => {});
      }
      console.log(`[Init] ${DEFAULT_CATEGORIES.length} categories seeded.`);
    }

    // Ensure Admin Accounts exist without duplicate key errors on concurrent cold starts
    const adminAccounts = [
      {
        name: 'Nitin Sir (Admin)',
        email: 'admin@nitinsir.org',
        password: 'AdminPassword123!',
        role: 'admin' as const,
        institution: 'Global Academic Research Institute',
        country: 'India',
      },
      {
        name: 'Portal Administrator',
        email: 'admin@conferencealerts.com',
        password: 'AdminPassword123!',
        role: 'admin' as const,
        institution: 'Nitin Sir Academic Portal',
        country: 'Global',
      },
    ];

    for (const adminData of adminAccounts) {
      const existing = await User.findOne({ email: adminData.email });
      if (!existing) {
        try {
          await User.create(adminData);
          console.log(`[Init] Admin user ${adminData.email} created.`);
        } catch (err: any) {
          if (err.code !== 11000) {
            console.error(`[Init] Error creating ${adminData.email}:`, err);
          }
        }
      }
    }
  } catch (err) {
    console.error('[Init] Error in autoSeedIfEmpty:', err);
  }
};

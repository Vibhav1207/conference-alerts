import { User } from '../models/User';

export const autoSeedIfEmpty = async () => {
  try {
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

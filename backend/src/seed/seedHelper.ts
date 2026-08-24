import { User } from '../models/User';

export const autoSeedIfEmpty = async () => {
  try {
    // ONLY GUARANTEE ADMIN USER EXISTS WITH KNOWN PRODUCTION CREDENTIALS
    let adminUser = await User.findOne({ email: 'admin@nitinsir.org' }).select('+password');

    if (!adminUser) {
      console.log('[Init] Admin account missing. Creating default Admin user...');
      adminUser = await User.create({
        name: 'Nitin Sir (Admin)',
        email: 'admin@nitinsir.org',
        password: 'AdminPassword123!',
        role: 'admin',
        institution: 'Global Academic Research Institute',
        country: 'India',
      });
      console.log('[Init] Admin user admin@nitinsir.org created successfully!');
    } else {
      const matches = await adminUser.comparePassword('AdminPassword123!');
      if (!matches) {
        console.log('[Init] Updating Admin password to AdminPassword123!...');
        adminUser.password = 'AdminPassword123!';
        adminUser.role = 'admin';
        await adminUser.save();
      }
    }

    // Ensure secondary admin alias also exists
    let secondaryAdmin = await User.findOne({ email: 'admin@conferencealerts.com' });
    if (!secondaryAdmin) {
      await User.create({
        name: 'Portal Administrator',
        email: 'admin@conferencealerts.com',
        password: 'AdminPassword123!',
        role: 'admin',
        institution: 'Nitin Sir Academic Portal',
        country: 'Global',
      });
    }

    console.log('[Init] Admin user accounts initialized. Zero mock data seeded.');
  } catch (err) {
    console.error('[Init] Error initializing admin accounts:', err);
  }
};

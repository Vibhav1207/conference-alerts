import dotenv from 'dotenv';
import { connectDB, closeDB } from '../config/db';
import { User } from '../models/User';
import { Conference } from '../models/Conference';
import { Resource } from '../models/Resource';

dotenv.config();

const clearMockDataAndEnsureAdmin = async () => {
  try {
    console.log('[Clean] Connecting to database...');
    await connectDB();

    console.log('[Clean] Removing all mock events and resources...');
    await Conference.deleteMany({});
    await Resource.deleteMany({});

    console.log('[Clean] Ensuring clean Admin user exists...');
    await User.deleteMany({ email: { $ne: 'admin@nitinsir.org' } });

    let adminUser = await User.findOne({ email: 'admin@nitinsir.org' }).select('+password');
    if (!adminUser) {
      await User.create({
        name: 'Nitin Sir (Admin)',
        email: 'admin@nitinsir.org',
        password: 'AdminPassword123!',
        role: 'admin',
        institution: 'Global Academic Research Institute',
        country: 'India',
      });
    } else {
      adminUser.password = 'AdminPassword123!';
      adminUser.role = 'admin';
      await adminUser.save();
    }

    console.log('==================================================');
    console.log('[Clean] All mock data removed! System is clean & production-ready.');
    console.log('[Clean] Admin User: admin@nitinsir.org / AdminPassword123!');
    console.log('==================================================');

    await closeDB();
  } catch (error) {
    console.error('[Clean] Cleanup failed:', error);
    process.exit(1);
  }
};

clearMockDataAndEnsureAdmin();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoSeedIfEmpty = void 0;
const User_1 = require("../models/User");
const autoSeedIfEmpty = async () => {
    try {
        // ONLY GUARANTEE ADMIN USER EXISTS WITH KNOWN PRODUCTION CREDENTIALS
        let adminUser = await User_1.User.findOne({ email: 'admin@nitinsir.org' }).select('+password');
        if (!adminUser) {
            console.log('[Init] Admin account missing. Creating default Admin user...');
            adminUser = await User_1.User.create({
                name: 'Nitin Sir (Admin)',
                email: 'admin@nitinsir.org',
                password: 'AdminPassword123!',
                role: 'admin',
                institution: 'Global Academic Research Institute',
                country: 'India',
            });
            console.log('[Init] Admin user admin@nitinsir.org created successfully!');
        }
        else {
            const matches = await adminUser.comparePassword('AdminPassword123!');
            if (!matches) {
                console.log('[Init] Updating Admin password to AdminPassword123!...');
                adminUser.password = 'AdminPassword123!';
                adminUser.role = 'admin';
                await adminUser.save();
            }
        }
        // Ensure secondary admin alias also exists
        let secondaryAdmin = await User_1.User.findOne({ email: 'admin@conferencealerts.com' });
        if (!secondaryAdmin) {
            await User_1.User.create({
                name: 'Portal Administrator',
                email: 'admin@conferencealerts.com',
                password: 'AdminPassword123!',
                role: 'admin',
                institution: 'Nitin Sir Academic Portal',
                country: 'Global',
            });
        }
        console.log('[Init] Admin user accounts initialized. Zero mock data seeded.');
    }
    catch (err) {
        console.error('[Init] Error initializing admin accounts:', err);
    }
};
exports.autoSeedIfEmpty = autoSeedIfEmpty;

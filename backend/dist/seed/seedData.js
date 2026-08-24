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
const clearMockDataAndEnsureAdmin = async () => {
    try {
        console.log('[Clean] Connecting to database...');
        await (0, db_1.connectDB)();
        console.log('[Clean] Removing all mock events and resources...');
        await Conference_1.Conference.deleteMany({});
        await Resource_1.Resource.deleteMany({});
        console.log('[Clean] Ensuring clean Admin user exists...');
        await User_1.User.deleteMany({ email: { $ne: 'admin@nitinsir.org' } });
        let adminUser = await User_1.User.findOne({ email: 'admin@nitinsir.org' }).select('+password');
        if (!adminUser) {
            await User_1.User.create({
                name: 'Nitin Sir (Admin)',
                email: 'admin@nitinsir.org',
                password: 'AdminPassword123!',
                role: 'admin',
                institution: 'Global Academic Research Institute',
                country: 'India',
            });
        }
        else {
            adminUser.password = 'AdminPassword123!';
            adminUser.role = 'admin';
            await adminUser.save();
        }
        console.log('==================================================');
        console.log('[Clean] All mock data removed! System is clean & production-ready.');
        console.log('[Clean] Admin User: admin@nitinsir.org / AdminPassword123!');
        console.log('==================================================');
        await (0, db_1.closeDB)();
    }
    catch (error) {
        console.error('[Clean] Cleanup failed:', error);
        process.exit(1);
    }
};
clearMockDataAndEnsureAdmin();

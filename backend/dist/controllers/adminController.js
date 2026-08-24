"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminStats = void 0;
const Conference_1 = require("../models/Conference");
const Resource_1 = require("../models/Resource");
const User_1 = require("../models/User");
const getAdminStats = async (req, res, next) => {
    try {
        const totalConferences = await Conference_1.Conference.countDocuments();
        const publishedConferences = await Conference_1.Conference.countDocuments({ status: 'Published' });
        const pendingConferences = await Conference_1.Conference.countDocuments({ status: 'Pending' });
        const draftConferences = await Conference_1.Conference.countDocuments({ status: 'Draft' });
        const archivedConferences = await Conference_1.Conference.countDocuments({ status: 'Archived' });
        const totalUsers = await User_1.User.countDocuments();
        const totalResources = await Resource_1.Resource.countDocuments();
        // Aggregating download stats
        const resourceDownloadsResult = await Resource_1.Resource.aggregate([
            { $group: { _id: null, totalDownloads: { $sum: '$downloadCount' } } },
        ]);
        const totalDownloads = resourceDownloadsResult[0]?.totalDownloads || 0;
        // Aggregating category breakdown
        const categoryBreakdown = await Conference_1.Conference.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);
        const recentSubmissions = await Conference_1.Conference.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title acronym category status venue dates createdAt');
        res.json({
            success: true,
            data: {
                metrics: {
                    totalConferences,
                    publishedConferences,
                    pendingConferences,
                    draftConferences,
                    archivedConferences,
                    totalUsers,
                    totalResources,
                    totalDownloads,
                },
                categoryBreakdown,
                recentSubmissions,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAdminStats = getAdminStats;

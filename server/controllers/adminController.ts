import { Request, Response, NextFunction } from 'express';
import { Conference } from '../models/Conference';
import { Resource } from '../models/Resource';
import { User } from '../models/User';

export const getAdminStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalConferences = await Conference.countDocuments();
    const publishedConferences = await Conference.countDocuments({ status: 'Published' });
    const pendingConferences = await Conference.countDocuments({ status: 'Pending' });
    const draftConferences = await Conference.countDocuments({ status: 'Draft' });
    const archivedConferences = await Conference.countDocuments({ status: 'Archived' });
    const totalUsers = await User.countDocuments();
    const totalResources = await Resource.countDocuments();

    // Aggregating download stats
    const resourceDownloadsResult = await Resource.aggregate([
      { $group: { _id: null, totalDownloads: { $sum: '$downloadCount' } } },
    ]);
    const totalDownloads = resourceDownloadsResult[0]?.totalDownloads || 0;

    // Aggregating category breakdown
    const categoryBreakdown = await Conference.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const recentSubmissions = await Conference.find()
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
  } catch (error) {
    next(error);
  }
};

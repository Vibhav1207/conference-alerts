import { Request, Response, NextFunction } from 'express';
import { Conference } from '../models/Conference';
import { Resource } from '../models/Resource';
import { User } from '../models/User';
import { Category } from '../models/Category';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const getPublicCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Category name must be at least 2 characters' });
    }
    const slug = name.trim().toLowerCase().replace(/\s+/g, '-');
    const existing = await Category.findOne({ $or: [{ name: name.trim() }, { slug }] });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }
    const category = await Category.create({ name: name.trim(), slug });
    res.status(201).json({ success: true, message: 'Category created', data: category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    await Category.findByIdAndDelete(id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

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

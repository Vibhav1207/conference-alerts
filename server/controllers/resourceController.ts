import { Request, Response, NextFunction } from 'express';
import { Resource } from '../models/Resource';
import { AuthRequest } from '../middleware/auth';

export const getResources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search, fileFormat } = req.query;
    const query: any = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (fileFormat && fileFormat !== 'All') {
      query.fileFormat = fileFormat;
    }

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const resources = await Resource.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: resources,
    });
  } catch (error) {
    next(error);
  }
};

export const downloadResource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    resource.downloadCount += 1;
    await resource.save();

    res.json({
      success: true,
      message: 'Download incremented',
      data: {
        fileUrl: resource.fileUrl,
        downloadCount: resource.downloadCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createResource = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const resourceData = req.body;
    if (req.user) {
      resourceData.createdById = req.user._id;
    }

    const resource = await Resource.create(resourceData);

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

export const updateResource = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    res.json({
      success: true,
      message: 'Resource updated successfully',
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByIdAndDelete(id);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    res.json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

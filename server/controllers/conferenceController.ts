import { Request, Response, NextFunction } from 'express';
import { Conference } from '../models/Conference';
import { AuthRequest } from '../middleware/auth';

export const getConferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      search,
      category,
      eventType,
      continent,
      country,
      city,
      mode,
      month,
      status,
      featured,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query: any = {};

    // Filter by status (public defaults to Published)
    if (status) {
      query.status = status;
    } else if (!req.url.includes('/admin')) {
      query.status = 'Published';
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (eventType && eventType !== 'All') {
      query.eventType = eventType;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (continent && continent !== 'All') {
      query['venue.continent'] = continent;
    }

    if (country && country !== 'All') {
      query['venue.country'] = new RegExp(`^${country}$`, 'i');
    }

    if (city && city !== 'All') {
      query['venue.city'] = new RegExp(`^${city}$`, 'i');
    }

    if (mode && mode !== 'All') {
      query.mode = mode;
    }

    if (month && month !== 'All') {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthIndex = monthNames.indexOf(month as string) + 1;
      if (monthIndex > 0) {
        query.$expr = {
          $eq: [{ $month: '$dates.startDate' }, monthIndex],
        };
      }
    }

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      query.$or = [
        { title: searchRegex },
        { acronym: searchRegex },
        { organizer: searchRegex },
        { description: searchRegex },
        { topics: searchRegex },
        { 'venue.city': searchRegex },
        { 'venue.country': searchRegex },
        { 'venue.continent': searchRegex },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions: any = { [sortBy as string]: sortOrder };

    const total = await Conference.countDocuments(query);
    const conferences = await Conference.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: conferences,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getConferenceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const conference = await Conference.findById(id);

    if (!conference) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Increment views count asynchronously
    conference.viewsCount += 1;
    await conference.save();

    res.json({
      success: true,
      data: conference,
    });
  } catch (error) {
    next(error);
  }
};

export const createConference = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const conferenceData = req.body;
    if (req.user) {
      conferenceData.createdById = req.user._id;
    }

    const conference = await Conference.create(conferenceData);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: conference,
    });
  } catch (error) {
    next(error);
  }
};

export const updateConference = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const conference = await Conference.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!conference) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: conference,
    });
  } catch (error) {
    next(error);
  }
};

export const updateConferenceStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Draft', 'Pending', 'Published', 'Archived'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const conference = await Conference.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!conference) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({
      success: true,
      message: `Event status updated to ${status}`,
      data: conference,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteConference = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const conference = await Conference.findByIdAndDelete(id);

    if (!conference) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

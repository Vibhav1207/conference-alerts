import { z } from 'zod';
import { EVENT_TYPES, CATEGORIES, CONTINENTS } from '../utils/locationData';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  institution: z.string().optional(),
  country: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const conferenceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  acronym: z.string().min(2, 'Acronym is required'),
  eventType: z.enum(EVENT_TYPES).default('Conference'),
  organizer: z.string().min(2, 'Organizer is required'),
  category: z.enum(CATEGORIES),
  mode: z.enum(['Hybrid', 'In-Person', 'Online']),
  venue: z.object({
    continent: z.enum(CONTINENTS),
    country: z.string().min(1, 'Country is required'),
    city: z.string().min(1, 'City is required'),
    address: z.string().optional(),
    mapUrl: z.string().optional(),
  }),
  dates: z.object({
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
    submissionDeadline: z.string().or(z.date()),
    notificationDate: z.string().or(z.date()).optional(),
    cameraReadyDeadline: z.string().or(z.date()).optional(),
  }),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  topics: z.array(z.string()).default([]),
  keynoteSpeakers: z
    .array(
      z.object({
        name: z.string(),
        title: z.string().optional(),
        institution: z.string().optional(),
        avatarUrl: z.string().optional(),
      })
    )
    .default([]),
  registrationFees: z
    .array(
      z.object({
        category: z.string(),
        amount: z.number(),
        currency: z.string().default('USD'),
      })
    )
    .default([]),
  externalApplyUrl: z.string().min(1, 'Official apply link is required'),
  websiteUrl: z.string().optional(),
  contactEmail: z.string().optional(),
  status: z.enum(['Draft', 'Pending', 'Published', 'Archived']).default('Published'),
  featured: z.boolean().default(false),
});

export const resourceSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  category: z.enum(['LaTeX Template', 'Word Template', 'Presentation Deck', 'Journal Indexing Guide', 'Publishing Guideline']),
  description: z.string().min(5, 'Description is required'),
  fileFormat: z.enum(['PDF', 'ZIP', 'DOCX', 'TEX', 'PPTX']),
  fileUrl: z.string().min(1, 'File URL is required'),
  fileSize: z.string().default('1.5 MB'),
});

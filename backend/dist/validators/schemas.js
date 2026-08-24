"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceSchema = exports.conferenceSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const locationData_1 = require("../utils/locationData");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    institution: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.conferenceSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Title must be at least 3 characters'),
    acronym: zod_1.z.string().min(2, 'Acronym is required'),
    eventType: zod_1.z.enum(locationData_1.EVENT_TYPES).default('Conference'),
    organizer: zod_1.z.string().min(2, 'Organizer is required'),
    category: zod_1.z.enum(locationData_1.CATEGORIES),
    mode: zod_1.z.enum(['Hybrid', 'In-Person', 'Online']),
    venue: zod_1.z.object({
        continent: zod_1.z.enum(locationData_1.CONTINENTS),
        country: zod_1.z.string().min(1, 'Country is required'),
        city: zod_1.z.string().min(1, 'City is required'),
        address: zod_1.z.string().optional(),
        mapUrl: zod_1.z.string().optional(),
    }),
    dates: zod_1.z.object({
        startDate: zod_1.z.string().or(zod_1.z.date()),
        endDate: zod_1.z.string().or(zod_1.z.date()),
        submissionDeadline: zod_1.z.string().or(zod_1.z.date()),
        notificationDate: zod_1.z.string().or(zod_1.z.date()).optional(),
        cameraReadyDeadline: zod_1.z.string().or(zod_1.z.date()).optional(),
    }),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
    topics: zod_1.z.array(zod_1.z.string()).default([]),
    keynoteSpeakers: zod_1.z
        .array(zod_1.z.object({
        name: zod_1.z.string(),
        title: zod_1.z.string().optional(),
        institution: zod_1.z.string().optional(),
        avatarUrl: zod_1.z.string().optional(),
    }))
        .default([]),
    registrationFees: zod_1.z
        .array(zod_1.z.object({
        category: zod_1.z.string(),
        amount: zod_1.z.number(),
        currency: zod_1.z.string().default('USD'),
    }))
        .default([]),
    externalApplyUrl: zod_1.z.string().min(1, 'Official apply link is required'),
    websiteUrl: zod_1.z.string().optional(),
    contactEmail: zod_1.z.string().optional(),
    status: zod_1.z.enum(['Draft', 'Pending', 'Published', 'Archived']).default('Published'),
    featured: zod_1.z.boolean().default(false),
});
exports.resourceSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Title is required'),
    category: zod_1.z.enum(['LaTeX Template', 'Word Template', 'Presentation Deck', 'Journal Indexing Guide', 'Publishing Guideline']),
    description: zod_1.z.string().min(5, 'Description is required'),
    fileFormat: zod_1.z.enum(['PDF', 'ZIP', 'DOCX', 'TEX', 'PPTX']),
    fileUrl: zod_1.z.string().min(1, 'File URL is required'),
    fileSize: zod_1.z.string().default('1.5 MB'),
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conference = void 0;
const mongoose_1 = require("mongoose");
const locationData_1 = require("../utils/locationData");
const ConferenceSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true, index: true },
    acronym: { type: String, required: true, trim: true },
    eventType: {
        type: String,
        enum: locationData_1.EVENT_TYPES,
        required: true,
        default: 'Conference',
        index: true,
    },
    organizer: { type: String, required: true, trim: true },
    category: {
        type: String,
        enum: locationData_1.CATEGORIES,
        required: true,
        index: true,
    },
    mode: { type: String, enum: ['Hybrid', 'In-Person', 'Online'], required: true, default: 'In-Person' },
    venue: {
        continent: { type: String, enum: locationData_1.CONTINENTS, required: true, index: true, default: 'Asia' },
        country: { type: String, required: true, index: true },
        city: { type: String, required: true, index: true },
        address: { type: String, default: '' },
        mapUrl: { type: String, default: '' },
    },
    dates: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        submissionDeadline: { type: Date, required: true, index: true },
        notificationDate: { type: Date },
        cameraReadyDeadline: { type: Date },
    },
    description: { type: String, required: true },
    topics: [{ type: String }],
    keynoteSpeakers: [
        {
            name: { type: String, required: true },
            title: { type: String, default: '' },
            institution: { type: String, default: '' },
            avatarUrl: { type: String, default: '' },
        },
    ],
    registrationFees: [
        {
            category: { type: String, required: true },
            amount: { type: Number, required: true },
            currency: { type: String, default: 'USD' },
        },
    ],
    externalApplyUrl: { type: String, required: true, trim: true },
    websiteUrl: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    status: {
        type: String,
        enum: ['Draft', 'Pending', 'Published', 'Archived'],
        default: 'Published',
        index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    viewsCount: { type: Number, default: 0 },
    createdById: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
exports.Conference = (0, mongoose_1.model)('Conference', ConferenceSchema);

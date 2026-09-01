import { Schema, model, Document } from 'mongoose';
import { EVENT_TYPES, CATEGORIES, CONTINENTS } from '../utils/locationData';

export interface IRegistrationFee {
  category: string;
  amount: number;
  currency: string;
}

export interface IConference extends Document {
  title: string;
  acronym: string;
  eventType: 'Conference' | 'Internship' | 'Journals' | 'Workshop / Seminar' | 'FDP';
  organizer: string;
  category: string;
  mode: 'Hybrid' | 'In-Person' | 'Online';
  conferenceScope?: 'International' | 'National';
  venue: {
    continent: string;
    country: string;
    city: string;
    address?: string;
    mapUrl?: string;
  };
  dates: {
    startDate: Date;
    endDate: Date;
    submissionDeadline: Date;
    notificationDate?: Date;
    cameraReadyDeadline?: Date;
  };
  description: string;
  topics: string[];
  registrationFees: IRegistrationFee[];
  externalApplyUrl: string; // Official external application/registration URL
  websiteUrl?: string;
  contactEmail?: string;
  publisherLogo?: string;
  publisherLogos?: string[];
  status: 'Draft' | 'Pending' | 'Published' | 'Archived';
  featured: boolean;
  viewsCount: number;
  createdById?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ConferenceSchema = new Schema<IConference>(
  {
    title: { type: String, required: true, trim: true, index: true },
    acronym: { type: String, required: true, trim: true },
    eventType: {
      type: String,
      enum: EVENT_TYPES,
      required: true,
      default: 'Conference',
      index: true,
    },
    organizer: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: CATEGORIES,
      required: true,
      index: true,
    },
    mode: { type: String, enum: ['Hybrid', 'In-Person', 'Online'], required: true, default: 'In-Person' },
    conferenceScope: { type: String, enum: ['International', 'National'], default: undefined },
    venue: {
      continent: { type: String, enum: CONTINENTS, required: true, index: true, default: 'Asia' },
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
    registrationFees: [
      {
        category: { type: String, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'USD' },
      },
    ],
    externalApplyUrl: { type: String, default: '', trim: true },
    websiteUrl: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    publisherLogo: { type: String, default: '' },
    publisherLogos: [{ type: String }],
    status: {
      type: String,
      enum: ['Draft', 'Pending', 'Published', 'Archived'],
      default: 'Published',
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    viewsCount: { type: Number, default: 0 },
    createdById: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Conference = model<IConference>('Conference', ConferenceSchema);

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  institution?: string;
  country?: string;
  bookmarkedConferences?: string[];
  alertSubscriptions?: Array<{
    category: string;
    country?: string;
    frequency: 'daily' | 'weekly' | 'monthly';
  }>;
}

export interface RegistrationFee {
  category: string;
  amount: number;
  currency: string;
}

export interface Conference {
  _id: string;
  title: string;
  acronym: string;
  eventType: 'Conference' | 'Internship' | 'Journals' | 'Workshop / Seminar';
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
    startDate: string;
    endDate: string;
    submissionDeadline: string;
    notificationDate?: string;
    cameraReadyDeadline?: string;
  };
  description: string;
  topics: string[];
  registrationFees: RegistrationFee[];
  externalApplyUrl: string;
  websiteUrl?: string;
  contactEmail?: string;
  status: 'Draft' | 'Pending' | 'Published' | 'Archived';
  featured: boolean;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  _id: string;
  title: string;
  category: 'LaTeX Template' | 'Word Template' | 'Presentation Deck' | 'Journal Indexing Guide' | 'Publishing Guideline';
  description: string;
  fileFormat: 'PDF' | 'ZIP' | 'DOCX' | 'TEX' | 'PPTX';
  fileUrl: string;
  fileSize: string;
  downloadCount: number;
  createdAt: string;
}

export interface FilterState {
  search: string;
  category: string;
  eventType: string;
  continent: string;
  country: string;
  city: string;
  mode: string;
  status?: string;
  featured?: boolean;
  page: number;
  limit: number;
  sortBy: string;
  order: 'asc' | 'desc';
}

export interface AdminStats {
  metrics: {
    totalConferences: number;
    publishedConferences: number;
    pendingConferences: number;
    draftConferences: number;
    archivedConferences: number;
    totalUsers: number;
    totalResources: number;
    totalDownloads: number;
  };
  categoryBreakdown: Array<{ _id: string; count: number }>;
  recentSubmissions: Array<Partial<Conference>>;
}

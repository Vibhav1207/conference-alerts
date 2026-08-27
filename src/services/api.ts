import axios from 'axios';
import { Conference, Resource, FilterState, AdminStats, User } from '../types';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    API.post<{ success: boolean; data: { token: string; user: User }; message: string }>('/auth/login', credentials),
  
  register: (userData: { name: string; email: string; password: string; institution?: string; country?: string }) =>
    API.post<{ success: boolean; data: { token: string; user: User }; message: string }>('/auth/register', userData),

  getMe: () =>
    API.get<{ success: boolean; data: User }>('/auth/me'),

  toggleBookmark: (conferenceId: string) =>
    API.post<{ success: boolean; message: string; data: { bookmarked: boolean; bookmarkedConferences: string[] } }>(
      `/auth/bookmarks/${conferenceId}`
    ),
};

export const conferenceAPI = {
  getConferences: (params?: Partial<FilterState>) =>
    API.get<{
      success: boolean;
      data: Conference[];
      pagination: { total: number; page: number; limit: number; totalPages: number };
    }>('/conferences', { params }),

  getAdminConferences: (params?: Partial<FilterState>) =>
    API.get<{
      success: boolean;
      data: Conference[];
      pagination: { total: number; page: number; limit: number; totalPages: number };
    }>('/conferences/admin', { params }),

  getConferenceById: (id: string) =>
    API.get<{ success: boolean; data: Conference }>(`/conferences/${id}`),

  createConference: (data: Partial<Conference>) =>
    API.post<{ success: boolean; message: string; data: Conference }>('/conferences', data),

  updateConference: (id: string, data: Partial<Conference>) =>
    API.put<{ success: boolean; message: string; data: Conference }>(`/conferences/${id}`, data),

  updateStatus: (id: string, status: 'Draft' | 'Pending' | 'Published' | 'Archived') =>
    API.patch<{ success: boolean; message: string; data: Conference }>(`/conferences/${id}/status`, { status }),

  deleteConference: (id: string) =>
    API.delete<{ success: boolean; message: string }>(`/conferences/${id}`),

  getCategories: () =>
    API.get<{ success: boolean; data: Category[] }>('/conferences/categories'),
};

export const resourceAPI = {
  getResources: (params?: { category?: string; search?: string; fileFormat?: string }) =>
    API.get<{ success: boolean; data: Resource[] }>('/resources', { params }),

  downloadResource: (id: string) =>
    API.post<{ success: boolean; data: { fileUrl: string; downloadCount: number } }>(`/resources/${id}/download`),

  createResource: (data: Partial<Resource>) =>
    API.post<{ success: boolean; message: string; data: Resource }>('/resources', data),

  updateResource: (id: string, data: Partial<Resource>) =>
    API.put<{ success: boolean; message: string; data: Resource }>(`/resources/${id}`, data),

  deleteResource: (id: string) =>
    API.delete<{ success: boolean; message: string }>(`/resources/${id}`),
};

export interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
}

export const adminAPI = {
  getStats: () =>
    API.get<{ success: boolean; data: AdminStats }>('/admin/stats'),

  getCategories: () =>
    API.get<{ success: boolean; data: Category[] }>('/admin/categories'),

  createCategory: (name: string) =>
    API.post<{ success: boolean; message: string; data: Category }>('/admin/categories', { name }),

  deleteCategory: (id: string) =>
    API.delete<{ success: boolean; message: string }>(`/admin/categories/${id}`),
};

export default API;

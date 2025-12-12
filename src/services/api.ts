import axios from 'axios';
import type {
  TutorDetails,
  TutorsResponse,
  TutorFilters,
  CreateTutorDto,
  UpdateTutorDto,
} from '@/types/tutor';
import { mockTutors, mockTutorDetails } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API methods for tutors
export const tutorsApi = {
  // Fetch all tutors with optional filters
  fetchTutors: async (filters?: TutorFilters): Promise<TutorsResponse> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      let filteredTutors = [...mockTutors];

      if (filters?.price_max) {
        filteredTutors = filteredTutors.filter(
          (t) => t.price_per_hour <= filters.price_max!
        );
      }

      return {
        items: filteredTutors,
        page: filters?.page || 1,
        page_size: filters?.page_size || 20,
        total: filteredTutors.length,
      };
    }

    const response = await api.get<TutorsResponse>('/tutors', {
      params: filters,
    });
    return response.data;
  },

  // Fetch single tutor by ID
  fetchTutorById: async (id: number): Promise<TutorDetails> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const tutor = mockTutorDetails[id];
      if (!tutor) {
        throw new Error('Tutor not found');
      }
      return tutor;
    }

    const response = await api.get<TutorDetails>(`/tutors/${id}`);
    return response.data;
  },

  // Create new tutor
  createTutor: async (data: CreateTutorDto): Promise<TutorDetails> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const newTutor: TutorDetails = {
        id: Date.now(),
        user_id: Date.now(),
        first_name: 'Новый',
        last_name: 'Репетитор',
        ...data,
        avg_rating: 0,
        reviews_count: 0,
        status: 'PENDING',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subjects: [],
        levels: [],
      };
      return newTutor;
    }

    const response = await api.post<TutorDetails>('/tutors/me', data);
    return response.data;
  },

  // Update tutor
  updateTutor: async (
    id: number,
    data: UpdateTutorDto
  ): Promise<TutorDetails> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const existingTutor = mockTutorDetails[id];
      if (!existingTutor) {
        throw new Error('Tutor not found');
      }
      return {
        ...existingTutor,
        ...data,
        updated_at: new Date().toISOString(),
      };
    }

    const response = await api.put<TutorDetails>(`/tutors/me`, data);
    return response.data;
  },

  // Delete tutor
  deleteTutor: async (id: number): Promise<void> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return;
    }

    await api.delete(`/tutors/${id}`);
  },
};

export default api;

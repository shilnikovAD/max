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

// Runtime storage for created/updated tutors (only for mock mode)
const runtimeTutors: Map<number, TutorDetails> = new Map();

// API methods for tutors
export const tutorsApi = {
  // Fetch all tutors with optional filters
  fetchTutors: async (filters?: TutorFilters): Promise<TutorsResponse> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      // Combine mock tutors with runtime created tutors
      const runtimeTutorsArray = Array.from(runtimeTutors.values()).map(
        (details) => ({
          id: details.id,
          user_id: details.user_id,
          first_name: details.first_name,
          last_name: details.last_name,
          photo_url: details.photo_url,
          bio: details.bio,
          education: details.education,
          faculty: details.faculty,
          graduation_year: details.graduation_year,
          experience_years: details.experience_years,
          price_per_hour: details.price_per_hour,
          format: details.format,
          city: details.city,
          avg_rating: details.avg_rating,
          reviews_count: details.reviews_count,
          status: details.status,
          created_at: details.created_at,
          updated_at: details.updated_at,
        })
      );

      let filteredTutors = [...mockTutors, ...runtimeTutorsArray];

      // Фильтр по цене
      if (filters?.price_max) {
        filteredTutors = filteredTutors.filter(
          (t) => t.price_per_hour <= filters.price_max!
        );
      }

      // Фильтр по предмету
      if (filters?.subject_id) {
        filteredTutors = filteredTutors.filter((tutor) => {
          // Проверяем есть ли у репетитора этот предмет
          const tutorDetails = mockTutorDetails[tutor.id];
          if (!tutorDetails) return false;
          return tutorDetails.subjects.some(
            (subject) => subject.subject_id === filters.subject_id
          );
        });
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

      // Check runtime storage first (for newly created tutors)
      if (runtimeTutors.has(id)) {
        return runtimeTutors.get(id)!;
      }

      // Then check mock data
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
      const timestamp = Date.now();
      const newTutor: TutorDetails = {
        id: timestamp,
        user_id: timestamp + 1000, // Offset to ensure unique ID
        first_name: 'Новый',
        last_name: 'Репетитор',
        photo_url: '',
        ...data,
        avg_rating: 0,
        reviews_count: 0,
        status: 'APPROVED', // Auto-approve in demo mode
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subjects: data.subject_ids.map((id) => ({
          subject_id: id,
          subject_name: 'Предмет',
        })),
        levels: data.level_codes.map((code) => ({
          level_code: code,
          level_name: code.toUpperCase(),
        })),
      };

      // Save to runtime storage so it can be fetched later
      runtimeTutors.set(newTutor.id, newTutor);

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

      // Check runtime storage first
      let existingTutor = runtimeTutors.get(id);

      // If not in runtime, check mock data
      if (!existingTutor) {
        existingTutor = mockTutorDetails[id];
      }

      if (!existingTutor) {
        throw new Error('Tutor not found');
      }

      const updatedTutor = {
        ...existingTutor,
        ...data,
        updated_at: new Date().toISOString(),
      };

      // Save to runtime storage
      runtimeTutors.set(id, updatedTutor);

      return updatedTutor;
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

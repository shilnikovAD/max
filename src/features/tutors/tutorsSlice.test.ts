import tutorsReducer, {
  setFilters,
  clearCurrentTutor,
  clearError,
  fetchTutors,
  deleteTutor,
} from './tutorsSlice';
import type { TutorFilters } from '@/types/tutor';

// Mock the API module
jest.mock('@/services/api');

describe('tutors reducer', () => {
  const initialState = {
    tutors: [],
    currentTutor: null,
    filters: {
      page: 1,
      page_size: 20,
    },
    total: 0,
    page: 1,
    pageSize: 20,
    status: 'idle' as const,
    error: null,
  };

  it('should return the initial state', () => {
    expect(tutorsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setFilters', () => {
    const filters: TutorFilters = { price_max: 2000, format: 'ONLINE' };
    const actual = tutorsReducer(initialState, setFilters(filters));
    expect(actual.filters).toEqual({
      page: 1,
      page_size: 20,
      price_max: 2000,
      format: 'ONLINE',
    });
  });

  it('should handle clearCurrentTutor', () => {
    const stateWithTutor = {
      ...initialState,
      currentTutor: {
        id: 1,
        user_id: 101,
        first_name: 'Test',
        last_name: 'Tutor',
        bio: 'Test bio',
        education: 'Test education',
        experience_years: 5,
        price_per_hour: 2000,
        format: 'BOTH' as const,
        avg_rating: 4.5,
        reviews_count: 10,
        status: 'APPROVED' as const,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
        subjects: [],
        levels: [],
      },
    };
    const actual = tutorsReducer(stateWithTutor, clearCurrentTutor());
    expect(actual.currentTutor).toBeNull();
  });

  it('should handle clearError', () => {
    const stateWithError = {
      ...initialState,
      error: 'Test error',
    };
    const actual = tutorsReducer(stateWithError, clearError());
    expect(actual.error).toBeNull();
  });

  describe('fetchTutors', () => {
    it('should set status to loading when fetchTutors is pending', () => {
      const actual = tutorsReducer(initialState, {
        type: fetchTutors.pending.type,
      });
      expect(actual.status).toBe('loading');
      expect(actual.error).toBeNull();
    });

    it('should set tutors and status when fetchTutors is fulfilled', () => {
      const mockResponse = {
        items: [
          {
            id: 1,
            user_id: 101,
            first_name: 'Test',
            last_name: 'Tutor',
            bio: 'Bio',
            education: 'Education',
            experience_years: 5,
            price_per_hour: 2000,
            format: 'BOTH' as const,
            avg_rating: 4.5,
            reviews_count: 10,
            status: 'APPROVED' as const,
            created_at: '2023-01-01',
            updated_at: '2023-01-01',
          },
        ],
        page: 1,
        page_size: 20,
        total: 1,
      };
      const actual = tutorsReducer(initialState, {
        type: fetchTutors.fulfilled.type,
        payload: mockResponse,
      });
      expect(actual.status).toBe('succeeded');
      expect(actual.tutors).toEqual(mockResponse.items);
      expect(actual.total).toBe(1);
    });

    it('should set error when fetchTutors is rejected', () => {
      const actual = tutorsReducer(initialState, {
        type: fetchTutors.rejected.type,
        error: { message: 'Network error' },
      });
      expect(actual.status).toBe('failed');
      expect(actual.error).toBe('Network error');
    });
  });

  describe('deleteTutor', () => {
    it('should remove tutor from list when deleteTutor is fulfilled', () => {
      const stateWithTutors = {
        ...initialState,
        tutors: [
          {
            id: 1,
            user_id: 101,
            first_name: 'Test1',
            last_name: 'Tutor1',
            bio: 'Bio',
            education: 'Education',
            experience_years: 5,
            price_per_hour: 2000,
            format: 'BOTH' as const,
            avg_rating: 4.5,
            reviews_count: 10,
            status: 'APPROVED' as const,
            created_at: '2023-01-01',
            updated_at: '2023-01-01',
          },
          {
            id: 2,
            user_id: 102,
            first_name: 'Test2',
            last_name: 'Tutor2',
            bio: 'Bio',
            education: 'Education',
            experience_years: 3,
            price_per_hour: 1500,
            format: 'ONLINE' as const,
            avg_rating: 4.8,
            reviews_count: 5,
            status: 'APPROVED' as const,
            created_at: '2023-01-01',
            updated_at: '2023-01-01',
          },
        ],
      };
      const actual = tutorsReducer(stateWithTutors, {
        type: deleteTutor.fulfilled.type,
        payload: 1,
      });
      expect(actual.tutors).toHaveLength(1);
      expect(actual.tutors[0].id).toBe(2);
    });
  });
});

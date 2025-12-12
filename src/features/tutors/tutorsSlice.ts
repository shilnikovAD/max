import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tutorsApi } from '@/services/api';
import type {
  Tutor,
  TutorDetails,
  TutorFilters,
  CreateTutorDto,
  UpdateTutorDto,
} from '@/types/tutor';

interface TutorsState {
  tutors: Tutor[];
  currentTutor: TutorDetails | null;
  filters: TutorFilters;
  total: number;
  page: number;
  pageSize: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TutorsState = {
  tutors: [],
  currentTutor: null,
  filters: {
    page: 1,
    page_size: 20,
  },
  total: 0,
  page: 1,
  pageSize: 20,
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchTutors = createAsyncThunk(
  'tutors/fetchAll',
  async (filters?: TutorFilters) => {
    const response = await tutorsApi.fetchTutors(filters);
    return response;
  }
);

export const fetchTutorById = createAsyncThunk(
  'tutors/fetchById',
  async (id: number) => {
    const response = await tutorsApi.fetchTutorById(id);
    return response;
  }
);

export const createTutor = createAsyncThunk(
  'tutors/create',
  async (data: CreateTutorDto) => {
    const response = await tutorsApi.createTutor(data);
    return response;
  }
);

export const updateTutor = createAsyncThunk(
  'tutors/update',
  async ({ id, data }: { id: number; data: UpdateTutorDto }) => {
    const response = await tutorsApi.updateTutor(id, data);
    return response;
  }
);

export const deleteTutor = createAsyncThunk(
  'tutors/delete',
  async (id: number) => {
    await tutorsApi.deleteTutor(id);
    return id;
  }
);

const tutorsSlice = createSlice({
  name: 'tutors',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<TutorFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentTutor: (state) => {
      state.currentTutor = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tutors
      .addCase(fetchTutors.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTutors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tutors = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.page_size;
      })
      .addCase(fetchTutors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch tutors';
      })
      // Fetch tutor by ID
      .addCase(fetchTutorById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTutorById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentTutor = action.payload;
      })
      .addCase(fetchTutorById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch tutor';
      })
      // Create tutor
      .addCase(createTutor.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createTutor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentTutor = action.payload;
      })
      .addCase(createTutor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create tutor';
      })
      // Update tutor
      .addCase(updateTutor.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateTutor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentTutor = action.payload;
        // Update in list if exists
        const index = state.tutors.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tutors[index] = action.payload;
        }
      })
      .addCase(updateTutor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update tutor';
      })
      // Delete tutor
      .addCase(deleteTutor.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteTutor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tutors = state.tutors.filter((t) => t.id !== action.payload);
        if (state.currentTutor?.id === action.payload) {
          state.currentTutor = null;
        }
      })
      .addCase(deleteTutor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete tutor';
      });
  },
});

export const { setFilters, clearCurrentTutor, clearError } =
  tutorsSlice.actions;

export default tutorsSlice.reducer;

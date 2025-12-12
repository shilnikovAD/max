import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  tutorIds: number[];
}

// Load favorites from localStorage
const loadFavoritesFromStorage = (): number[] => {
  try {
    const stored = localStorage.getItem('favorites');
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    // Validate that parsed data is an array of numbers
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'number')) {
      return parsed;
    }
    console.warn('Invalid favorites data in localStorage, resetting to empty array');
    return [];
  } catch (error) {
    console.error('Failed to load favorites from localStorage:', error);
    return [];
  }
};

// Save favorites to localStorage
const saveFavoritesToStorage = (tutorIds: number[]): void => {
  try {
    localStorage.setItem('favorites', JSON.stringify(tutorIds));
  } catch (error) {
    console.error('Failed to save favorites to localStorage:', error);
  }
};

const initialState: FavoritesState = {
  tutorIds: loadFavoritesFromStorage(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<number>) => {
      const tutorId = action.payload;
      if (!state.tutorIds.includes(tutorId)) {
        state.tutorIds.push(tutorId);
        saveFavoritesToStorage(state.tutorIds);
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      const tutorId = action.payload;
      state.tutorIds = state.tutorIds.filter((id) => id !== tutorId);
      saveFavoritesToStorage(state.tutorIds);
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const tutorId = action.payload;
      if (state.tutorIds.includes(tutorId)) {
        state.tutorIds = state.tutorIds.filter((id) => id !== tutorId);
      } else {
        state.tutorIds.push(tutorId);
      }
      saveFavoritesToStorage(state.tutorIds);
    },
    clearFavorites: (state) => {
      state.tutorIds = [];
      saveFavoritesToStorage([]);
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;

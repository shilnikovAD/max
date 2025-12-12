import { configureStore } from '@reduxjs/toolkit';
import tutorsReducer from '@/features/tutors/tutorsSlice';
import favoritesReducer from '@/features/favorites/favoritesSlice';

export const store = configureStore({
  reducer: {
    tutors: tutorsReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

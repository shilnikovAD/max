import { configureStore } from '@reduxjs/toolkit';
import tutorsReducer from '@/features/tutors/tutorsSlice';
import favoritesReducer from '@/features/favorites/favoritesSlice';
import authReducer from '@/features/auth/authSlice';
import chatReducer from '@/features/chat/chatSlice';

export const store = configureStore({
  reducer: {
    tutors: tutorsReducer,
    favorites: favoritesReducer,
    auth: authReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

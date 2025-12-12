import { RootState } from '@/app/store';

export const selectFavorites = (state: RootState) => state.favorites.tutorIds;

export const selectIsFavorite = (tutorId: number) => (state: RootState) =>
  state.favorites.tutorIds.includes(tutorId);

export const selectFavoritesCount = (state: RootState) =>
  state.favorites.tutorIds.length;

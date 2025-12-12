import { RootState } from '@/app/store';

export const selectTutors = (state: RootState) => state.tutors.tutors;
export const selectCurrentTutor = (state: RootState) =>
  state.tutors.currentTutor;
export const selectTutorsStatus = (state: RootState) => state.tutors.status;
export const selectTutorsError = (state: RootState) => state.tutors.error;
export const selectTutorsFilters = (state: RootState) => state.tutors.filters;
export const selectTutorsPagination = (state: RootState) => ({
  page: state.tutors.page,
  pageSize: state.tutors.pageSize,
  total: state.tutors.total,
});

export const tutorsApi = {
  fetchTutors: jest.fn(),
  fetchTutorById: jest.fn(),
  createTutor: jest.fn(),
  updateTutor: jest.fn(),
  deleteTutor: jest.fn(),
};

const api = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

export default api;

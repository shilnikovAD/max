import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'STUDENT' | 'TUTOR' | 'ADMIN';
  created_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
  status: 'idle',
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    // Симуляция API запроса
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock данные для демонстрации
    const mockUsers: Record<string, { user: User; password: string }> = {
      'student@test.com': {
        user: {
          id: 1,
          email: 'student@test.com',
          name: 'Иван Студентов',
          role: 'STUDENT',
          created_at: new Date().toISOString(),
        },
        password: 'student123',
      },
      'tutor@test.com': {
        user: {
          id: 2,
          email: 'tutor@test.com',
          name: 'Алексей Репетиторов',
          role: 'TUTOR',
          created_at: new Date().toISOString(),
        },
        password: 'tutor123',
      },
    };

    const userData = mockUsers[credentials.email];

    if (!userData || userData.password !== credentials.password) {
      throw new Error('Неверный email или пароль');
    }

    const token = `mock_token_${Date.now()}`;

    return {
      user: userData.user,
      token,
    };
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: {
    email: string;
    password: string;
    name: string;
    role: 'STUDENT' | 'TUTOR';
  }) => {
    // Симуляция API запроса
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user: User = {
      id: Date.now(),
      email: data.email,
      name: data.name,
      role: data.role,
      created_at: new Date().toISOString(),
    };

    const token = `mock_token_${Date.now()}`;

    return { user, token };
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('auth_token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Ошибка входа';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('auth_token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Ошибка регистрации';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;


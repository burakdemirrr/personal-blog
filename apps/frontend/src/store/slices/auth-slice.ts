import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthState = {
  token: string | null;
  role: 'admin' | 'user' | null;
  isAuthenticated: boolean;
};

const getInitialState = (): AuthState => {
  if (typeof window === 'undefined') {
    return { token: null, role: null, isAuthenticated: false };
  }
  const saved = window.localStorage.getItem('auth');
  if (!saved) {
    return { token: null, role: null, isAuthenticated: false };
  }
  try {
    const parsed = JSON.parse(saved) as AuthState;
    return { ...parsed, isAuthenticated: Boolean(parsed.token) };
  } catch {
    return { token: null, role: null, isAuthenticated: false };
  }
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; role: 'admin' | 'user' }>) {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('auth', JSON.stringify(state));
      }
    },
    logout(state) {
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('auth');
      }
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;

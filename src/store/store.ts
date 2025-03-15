import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Auth slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  default_location_id?: string;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser } = authSlice.actions;

// Settings slice
interface SettingsState {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

const initialSettingsState: SettingsState = {
  theme: 'light',
  notifications: true,
  language: 'en'
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialSettingsState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    }
  }
});

export const { setTheme, toggleNotifications, setLanguage } = settingsSlice.actions;

// Root reducer
const rootReducer = combineReducers({
  auth: authSlice.reducer,
  settings: settingsSlice.reducer,
});

// Store configuration
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
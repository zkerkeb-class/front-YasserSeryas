import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginMode: 'login', // 'login' or 'signup'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      
      // Sauvegarder dans localStorage
      if (action.payload.token) {
        localStorage.setItem('authToken', action.payload.token);
        localStorage.setItem('userData', JSON.stringify({
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role
        }));
      }
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    signupStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    signupSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      
      // Sauvegarder dans localStorage
      if (action.payload.token) {
        localStorage.setItem('authToken', action.payload.token);
        // localStorage.setItem('userData', JSON.stringify({
        //   id: action.payload.id,
        //   name: action.payload.name,
        //   email: action.payload.email,
        //   role: action.payload.role
        // }));
      }
    },
    signupFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      
      // Nettoyer localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('redirectAfterAuth');
    },
    setLoginMode: (state, action) => {
      state.loginMode = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  logout,
  setLoginMode,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
} from '../slices/authSlice';
import { showSnackbar } from '../slices/uiSlice';

// Mock API calls - remplacez par vos vraies API calls
const authAPI = {
  login: async (credentials) => {
    // Simuler un délai d'API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
      return {
        id: 1,
        name: 'John Doe',
        email: credentials.email,
        role: 'user',
        token: 'mock-jwt-token',
      };
    } else {
      throw new Error('Identifiants invalides');
    }
  },
  
  signup: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock validation
    if (userData.email && userData.password && userData.firstName && userData.lastName) {
      return {
        id: Date.now(),
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        role: 'user',
        token: 'mock-jwt-token',
      };
    } else {
      throw new Error('Données utilisateur invalides');
    }
  },
  
  socialLogin: async (platform, token) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      id: Date.now(),
      name: `${platform} User`,
      email: `user@${platform}.com`,
      role: 'user',
      token: 'mock-jwt-token',
    };
  },
};

// Thunk pour la connexion
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(loginStart());
      const user = await authAPI.login(credentials);
      dispatch(loginSuccess(user));
      dispatch(showSnackbar({
        message: 'Connexion réussie !',
        severity: 'success'
      }));
      return user;
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la connexion';
      dispatch(loginFailure(errorMessage));
      dispatch(showSnackbar({
        message: errorMessage,
        severity: 'error'
      }));
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk pour l'inscription
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(signupStart());
      const user = await authAPI.signup(userData);
      dispatch(signupSuccess(user));
      dispatch(showSnackbar({
        message: 'Inscription réussie ! Bienvenue !',
        severity: 'success'
      }));
      return user;
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de l\'inscription';
      dispatch(signupFailure(errorMessage));
      dispatch(showSnackbar({
        message: errorMessage,
        severity: 'error'
      }));
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk pour la connexion sociale
export const socialLogin = createAsyncThunk(
  'auth/socialLogin',
  async ({ platform, token }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(loginStart());
      const user = await authAPI.socialLogin(platform, token);
      dispatch(loginSuccess(user));
      dispatch(showSnackbar({
        message: `Connexion ${platform} réussie !`,
        severity: 'success'
      }));
      return user;
    } catch (error) {
      const errorMessage = error.message || `Erreur lors de la connexion ${platform}`;
      dispatch(loginFailure(errorMessage));
      dispatch(showSnackbar({
        message: errorMessage,
        severity: 'error'
      }));
      return rejectWithValue(errorMessage);
    }
  }
);

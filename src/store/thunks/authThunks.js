import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
} from "../slices/authSlice";
import { showSnackbar } from "../slices/uiSlice";

// Mock API calls - remplacez par vos vraies API calls
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await fetch("http://localhost:3002/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Identifiants invalides");
        } else if (response.status === 404) {
          throw new Error("Service d'authentification non disponible");
        } else if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Données invalides");
        } else {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
      }

      const userData = await response.json();

      // Retourner les données dans un format cohérent
      return {
        id: userData.data?.id || Date.now(),
        name: userData.data?.lastName || userData.data?.name,
        email: userData.data?.email,
        role: userData.data?.role || "client",
        token: userData.token,
        provider: "local",
      };
    } catch (error) {
      console.error("Erreur lors de l'appel API login:", error);

      if (error.message.includes("fetch")) {
        throw new Error("Impossible de contacter le serveur");
      }
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      const response = await fetch("http://localhost:3002/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phoneNumber: userData.phoneNumber || "",
          address: {
            city: userData?.location || "",
          },
        }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Données invalides");
        } else if (response.status === 409) {
          throw new Error("Un compte existe déjà avec cette adresse email");
        } else if (response.status === 404) {
          throw new Error("Service d'inscription non disponible");
        } else {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
      }

      const responseData = await response.json();

      // Retourner les données dans un format cohérent
      return {
        name:
          responseData.user?.lastName ||
          `${userData.firstName} ${userData.lastName}`,
        email: responseData.user?.email || userData.email,
        role: responseData.user?.role || "client",
        // token: responseData.token || 'mock-token'
      };
    } catch (error) {
      console.error("Erreur lors de l'appel API signup:", error);

      if (error.message.includes("fetch")) {
        throw new Error("Impossible de contacter le serveur");
      }
      throw error;
    }
  },

  socialLogin: async (platform) => {
    // Redirection vers l'authentification Google
    if (platform === "google") {
      // Sauvegarder l'état actuel si nécessaire
      const currentUrl = window.location.pathname;
      localStorage.setItem("redirectAfterAuth", currentUrl);

      // Rediriger vers l'API Google OAuth
      window.location.href = "http://localhost:3002/auth/google";
      return { redirected: true };
    }

    // Pour les autres plateformes (Facebook, GitHub), vous pouvez ajouter ici
    if (platform === "facebook") {
      // TODO: Implémenter Facebook OAuth
      throw new Error("Facebook OAuth non encore implémenté");
    }

    if (platform === "github") {
      // TODO: Implémenter GitHub OAuth
      throw new Error("GitHub OAuth non encore implémenté");
    }

    throw new Error(`Plateforme ${platform} non supportée`);
  },

  // Nouvelle fonction pour gérer le callback OAuth
  handleOAuthCallback: async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const error = urlParams.get("error");

      if (error) {
        throw new Error(decodeURIComponent(error));
      }

      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      // Vérifier le token avec votre API
      const response = await fetch("http://localhost:3002/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur de vérification: ${response.status}`);
      }

      const userData = await response.json();
      console.log("Données utilisateur récupérées:", userData);
      // Stocker le token
      localStorage.setItem("authToken", token);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          name: userData.user.lastName,
          email: userData.user.email,
          role: userData.user.role,
        })
      );
      return {
        ...userData,
        token,
      };
    } catch (error) {
      console.error("Erreur lors du callback OAuth:", error);
      throw error;
    }
  },
};

// Thunk pour la connexion
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(loginStart());
      const user = await authAPI.login(credentials);
      dispatch(loginSuccess(user));
      dispatch(
        showSnackbar({
          message: "Connexion réussie !",
          severity: "success",
        })
      );
      return user;
    } catch (error) {
      const errorMessage = error.message || "Erreur lors de la connexion";
      dispatch(loginFailure(errorMessage));
      dispatch(
        showSnackbar({
          message: errorMessage,
          severity: "error",
        })
      );
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk pour l'inscription
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(signupStart());
      const user = await authAPI.signup(userData);
      dispatch(signupSuccess(user));
      dispatch(
        showSnackbar({
          message: "Inscription réussie ! Bienvenue !",
          severity: "success",
        })
      );
      return user;
    } catch (error) {
      const errorMessage = error.message || "Erreur lors de l'inscription";
      dispatch(signupFailure(errorMessage));
      dispatch(
        showSnackbar({
          message: errorMessage,
          severity: "error",
        })
      );
      return rejectWithValue(errorMessage);
    }
  }
);

export const socialLogin = createAsyncThunk(
  "auth/socialLogin",
  async ({ platform }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(loginStart());

      if (platform === "google") {
        // Redirection vers Google OAuth
        await authAPI.socialLogin(platform);
        return { redirected: true };
      }

      // Pour les autres plateformes
      throw new Error(`Plateforme ${platform} non supportée`);
    } catch (error) {
      dispatch(loginFailure(error.message));
      dispatch(
        showSnackbar({
          message: error.message,
          severity: "error",
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

// Thunk pour gérer le callback OAuth
export const handleOAuthCallback = createAsyncThunk(
  "auth/handleOAuthCallback",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(loginStart());
      const user = await authAPI.handleOAuthCallback();
      dispatch(loginSuccess(user));
      dispatch(
        showSnackbar({
          message: "Connexion Google réussie !",
          severity: "success",
        })
      );

      // Rediriger vers la page d'origine ou l'accueil
      const redirectUrl = localStorage.getItem("redirectAfterAuth") || "/";
      localStorage.removeItem("redirectAfterAuth");
      window.history.replaceState({}, "", redirectUrl);

      return user;
    } catch (error) {
      const errorMessage =
        error.message || "Erreur lors de la connexion Google";
      dispatch(loginFailure(errorMessage));
      dispatch(
        showSnackbar({
          message: errorMessage,
          severity: "error",
        })
      );
      return rejectWithValue(errorMessage);
    }
  }
);

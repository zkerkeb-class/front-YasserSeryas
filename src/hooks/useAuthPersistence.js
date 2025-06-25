import { useEffect } from 'react';
import { useAppDispatch } from './useRedux';
import { loginSuccess } from '../store/slices/authSlice';

// Hook pour gérer l'authentification persistante
export const useAuthPersistence = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Vérifier si un token existe au démarrage
    const checkStoredAuth = () => {
      const token = localStorage.getItem('authToken');
      const userString = localStorage.getItem('userData');
      
      if (token && userString) {
        try {
          const userData = JSON.parse(userString);
          dispatch(loginSuccess({
            ...userData,
            token
          }));
        } catch (error) {
          console.error('Erreur lors de la restauration des données utilisateur:', error);
          // Nettoyer les données corrompues
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
    };

    checkStoredAuth();
  }, [dispatch]);

  // Fonction pour nettoyer les données d'authentification
  const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('redirectAfterAuth');
  };

  return { clearAuthData };
};

export default useAuthPersistence;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useAppDispatch, useAuth } from '../hooks/useRedux';
import { handleOAuthCallback } from '../store/thunks/authThunks';

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      // Vérifier si nous avons des paramètres de callback
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const errorParam = urlParams.get('error');

      if (errorParam) {
        console.error('Erreur OAuth:', errorParam);
        navigate('/login?error=' + encodeURIComponent(errorParam));
        return;
      }

      if (token) {
        try {
          await dispatch(handleOAuthCallback()).unwrap();
          // La redirection est gérée dans le thunk
          navigate('/');
        } catch (error) {
          console.error('Erreur lors du traitement du callback:', error);
          navigate('/login?error=' + encodeURIComponent('Erreur de connexion'));
        }
      } else {
        // Pas de token, rediriger vers login
        navigate('/login?error=' + encodeURIComponent('Authentification échouée'));
      }
    };

    processCallback();
  }, [dispatch, navigate]);

  // Si l'utilisateur est déjà authentifié, rediriger
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        padding: 2,
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          maxWidth: 400,
          width: '100%',
        }}
      >
        {isLoading && (
          <>
            <CircularProgress size={60} sx={{ mb: 3, color: '#3b82f6' }} />
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Connexion en cours...
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              Veuillez patienter pendant que nous finalisons votre connexion.
            </Typography>
          </>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default OAuthCallbackPage;

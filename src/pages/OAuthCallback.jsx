import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authAPI } from '../store/thunks/authThunks';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
} from '../store/slices/authSlice';
import { showSnackbar } from '../store/slices/uiSlice';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        dispatch(loginStart());
        
        const userData = await authAPI.handleOAuthCallback();
        
        dispatch(loginSuccess(userData));
        dispatch(showSnackbar({
          message: 'Connexion Google réussie !',
          severity: 'success'
        }));
        
        navigate('/dashboard'); // Redirection après succès
        
      } catch (error) {
        const errorMessage = error.message || 'Erreur lors de la connexion Google';
        dispatch(loginFailure(errorMessage));
        dispatch(showSnackbar({
          message: errorMessage,
          severity: 'error'
        }));
        navigate('/login'); // Redirection en cas d'erreur
      }
    };

    handleCallback();
  }, [navigate, dispatch]);

  return <div>Connexion en cours...</div>;
};

export default OAuthCallback;

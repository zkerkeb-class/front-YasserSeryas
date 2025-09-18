import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
  GitHub,
  Person,
  AdminPanelSettings,
  Email,
  Lock,
} from '@mui/icons-material';
import { useAuth, useAppDispatch } from '../hooks/useRedux';
import { loginUser, socialLogin } from '../store/thunks/authThunks';
import { clearError } from '../store/slices/authSlice';
import { showSnackbar } from '../store/slices/uiSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAuth();
  
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    rememberMe: false,
  });
  const [validationErrors, setValidationErrors] = useState({});
  // Rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Nettoyer les erreurs au démontage
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Gérer les erreurs OAuth depuis les paramètres URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthError = urlParams.get('error');
    
    if (oauthError) {
      dispatch(showSnackbar({
        message: decodeURIComponent(oauthError),
        severity: 'error'
      }));
      // Nettoyer l'URL
      window.history.replaceState({}, '', '/login');
    }
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setValidationErrors({});
    dispatch(clearError());
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: e.target.type === 'checkbox' ? checked : value
    });
    // Clear error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };
  const validateForm = () => {
    const newErrors = {};
    
    if (activeTab === 0) { // Client
      if (!formData.email) {
        newErrors.email = 'L\'email est requis';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'L\'email n\'est pas valide';
      }
    } else { // Admin
      if (!formData.username) {
        newErrors.username = 'Le nom d\'utilisateur est requis';
      }
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      return;
    }
    
    const credentials = {
      email: activeTab === 0 ? formData.email : `${formData.username}@admin.com`,
      password: formData.password,
      isAdmin: activeTab === 1,
    };
    
    try {
      await dispatch(loginUser(credentials)).unwrap();
      // La redirection se fait automatiquement via useEffect
    } catch (error) {
      // L'erreur est gérée automatiquement par Redux
    }
  };
  const handleSocialLogin = async (provider) => {
    try {
      const result = await dispatch(socialLogin({ platform: provider })).unwrap();
      
      if (result.redirected) {
        // La redirection a eu lieu, pas besoin de faire autre chose
        console.log(`Redirection vers ${provider} OAuth`);
      }
    } catch (error) {
      console.error('Erreur de connexion sociale:', error);
      // L'erreur est déjà gérée par Redux (snackbar)
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4,
      px: 2
    }}>
      <Container maxWidth="sm">
        <Paper sx={{ 
          p: 4, 
          borderRadius: '24px', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}>          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                background: 'linear-gradient(45deg, #1e40af, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Connexion
            </Typography>
            <Typography variant="body1" sx={{ color: '#6b7280' }}>
              Accédez à votre compte Book My Event
            </Typography>
          </Box>          {/* Tabs */}
          <Box sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              centered
              sx={{
                borderBottom: '1px solid #e5e7eb',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  minWidth: 120,
                  py: 2,
                },
                '& .Mui-selected': {
                  color: '#3b82f6',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#3b82f6',
                  height: 3,
                  borderRadius: '2px',
                },
              }}
            >              <Tab
                icon={<Person />}
                iconPosition="start"
                label="Espace Client"
                sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}
              />
              {/* <Tab
                icon={<AdminPanelSettings />}
                iconPosition="start"
                label="Administration"
                sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}
              /> */}
            </Tabs>
          </Box>          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {activeTab === 0 ? (
              // Client Login
              <TextField
                fullWidth
                type="email"
                name="email"
                label="Adresse email"
                value={formData.email}
                onChange={handleChange}                error={!!validationErrors.email}
                helperText={validationErrors.email}InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#9ca3af' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                  },
                }}
              />
            ) : (
              // Admin Login
              <TextField
                fullWidth
                name="username"
                label="Nom d'utilisateur"
                value={formData.username}
                onChange={handleChange}                error={!!validationErrors.username}
                helperText={validationErrors.username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#9ca3af' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                  },
                }}
              />
            )}

            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              name="password"
              label="Mot de passe"
              value={formData.password}
              onChange={handleChange}              error={!!validationErrors.password}
              helperText={validationErrors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#9ca3af' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                },
              }}
            />            {/* Remember Me & Forgot Password */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Se souvenir de moi"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
              <Link
                href="#"
                variant="body2"
                sx={{ 
                  color: '#3b82f6', 
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Mot de passe oublié ?
              </Link>            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 600,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                mt: 2,
                '&:hover': {
                  background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  background: '#9ca3af',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </Box>          {/* Divider */}
          <Box sx={{ my: 3 }}>
            <Divider>
              <Typography variant="body2" sx={{ color: '#6b7280', px: 2 }}>
                ou
              </Typography>
            </Divider>
          </Box>

          {/* Social Login */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={() => handleSocialLogin('google')}
              sx={{
                borderColor: '#e5e7eb',
                color: '#374151',
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#fef2f2',
                  borderColor: '#fca5a5',
                },
              }}
            >
              Continuer avec Google
            </Button>
            {/* <Button
              fullWidth
              variant="outlined"
              startIcon={<Facebook />}
              onClick={() => handleSocialLogin('Facebook')}
              sx={{
                borderColor: '#e5e7eb',
                color: '#374151',
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#eff6ff',
                  borderColor: '#93c5fd',
                },
              }}
            >
              Continuer avec Facebook
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GitHub />}
              onClick={() => handleSocialLogin('GitHub')}
              sx={{
                borderColor: '#e5e7eb',
                color: '#374151',
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#f9fafb',
                  borderColor: '#d1d5db',
                },
              }}
            >
              Continuer avec GitHub
            </Button> */}
          </Box>

          {/* Sign Up Link */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              Pas encore de compte ?{' '}              <Link
                component={RouterLink}
                to="/signup"
                sx={{ 
                  color: '#3b82f6', 
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                S'inscrire gratuitement
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;

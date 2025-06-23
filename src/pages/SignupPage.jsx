import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
  GitHub,
  Person,
  Email,
  Lock,
  Phone,
  LocationOn,
  ArrowBack,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';

const SignupPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Étape 1 - Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Étape 2 - Compte
    password: '',
    confirmPassword: '',
    // Étape 3 - Préférences
    location: '',
    interests: [],
    newsletter: true,
    terms: false,
  });
  const [errors, setErrors] = useState({});

  const steps = ['Informations personnelles', 'Créer votre compte', 'Préférences'];

  const interestOptions = [
    'Concert', 'Théâtre', 'Sport', 'Conférence', 'Festival', 'Exposition', 'Comédie', 'Danse'
  ];

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: e.target.type === 'checkbox' ? checked : value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleInterestToggle = (interest) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    
    setFormData({
      ...formData,
      interests: newInterests
    });
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0:
        if (!formData.firstName) newErrors.firstName = 'Le prénom est requis';
        if (!formData.lastName) newErrors.lastName = 'Le nom est requis';
        if (!formData.email) {
          newErrors.email = 'L\'email est requis';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'L\'email n\'est pas valide';
        }
        if (!formData.phone) newErrors.phone = 'Le téléphone est requis';
        break;
      
      case 1:
        if (!formData.password) {
          newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
        }
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Confirmez votre mot de passe';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }
        break;
      
      case 2:
        if (!formData.terms) {
          newErrors.terms = 'Vous devez accepter les conditions d\'utilisation';
        }
        break;
    }
    
    return newErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(activeStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setErrors({});
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const stepErrors = validateStep(activeStep);
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    console.log('Inscription:', formData);
    // Simulate successful registration
    setTimeout(() => {
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    }, 1000);
  };

  const handleSocialSignup = (provider) => {
    console.log(`Inscription avec ${provider}`);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="Prénom"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#9ca3af' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="Nom"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#9ca3af' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            
            <TextField
              fullWidth
              type="email"
              name="email"
              label="Adresse email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#9ca3af' }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              name="phone"
              label="Téléphone"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone sx={{ color: '#9ca3af' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              name="password"
              label="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password || 'Au moins 8 caractères'}
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
              }}
            />
            
            <TextField
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              label="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#9ca3af' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              name="location"
              label="Ville (optionnel)"
              value={formData.location}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn sx={{ color: '#9ca3af' }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Centres d'intérêt
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {interestOptions.map((interest) => (
                  <Chip
                    key={interest}
                    label={interest}
                    onClick={() => handleInterestToggle(interest)}
                    color={formData.interests.includes(interest) ? 'primary' : 'default'}
                    variant={formData.interests.includes(interest) ? 'filled' : 'outlined'}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Box>
            
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Recevoir les newsletters et promotions"
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    J'accepte les{' '}
                    <Link href="#" sx={{ color: '#3b82f6' }}>
                      conditions d'utilisation
                    </Link>{' '}
                    et la{' '}
                    <Link href="#" sx={{ color: '#3b82f6' }}>
                      politique de confidentialité
                    </Link>
                  </Typography>
                }
              />
              {errors.terms && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {errors.terms}
                </Typography>
              )}
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4,
      px: 2
    }}>
      <Container maxWidth="md">
        <Paper sx={{ 
          p: 4, 
          borderRadius: '24px', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar sx={{ 
              width: 60, 
              height: 60, 
              mx: 'auto', 
              mb: 2,
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)' 
            }}>
              <Person sx={{ fontSize: 30 }} />
            </Avatar>
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
              Créer un compte
            </Typography>
            <Typography variant="body1" sx={{ color: '#6b7280' }}>
              Rejoignez Book My Event et découvrez les meilleurs événements
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Form Content */}
          <Box component="form" onSubmit={activeStep === steps.length - 1 ? handleSubmit : undefined}>
            {renderStepContent(activeStep)}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<ArrowBack />}
                sx={{ 
                  visibility: activeStep === 0 ? 'hidden' : 'visible',
                  color: '#6b7280'
                }}
              >
                Précédent
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<CheckCircle />}
                  sx={{
                    background: 'linear-gradient(45deg, #16a34a, #059669)',
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #15803d, #047857)',
                    },
                  }}
                >
                  Créer mon compte
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                    },
                  }}
                >
                  Suivant
                </Button>
              )}
            </Box>
          </Box>

          {/* Social Login */}
          {activeStep === 0 && (
            <>
              <Box sx={{ my: 4 }}>
                <Divider>
                  <Typography variant="body2" sx={{ color: '#6b7280', px: 2 }}>
                    ou s'inscrire avec
                  </Typography>
                </Divider>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Google />}
                  onClick={() => handleSocialSignup('Google')}
                  sx={{
                    borderColor: '#e5e7eb',
                    color: '#374151',
                    '&:hover': {
                      backgroundColor: '#fef2f2',
                      borderColor: '#fca5a5',
                    },
                  }}
                >
                  Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Facebook />}
                  onClick={() => handleSocialSignup('Facebook')}
                  sx={{
                    borderColor: '#e5e7eb',
                    color: '#374151',
                    '&:hover': {
                      backgroundColor: '#eff6ff',
                      borderColor: '#93c5fd',
                    },
                  }}
                >
                  Facebook
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GitHub />}
                  onClick={() => handleSocialSignup('GitHub')}
                  sx={{
                    borderColor: '#e5e7eb',
                    color: '#374151',
                    '&:hover': {
                      backgroundColor: '#f9fafb',
                      borderColor: '#d1d5db',
                    },
                  }}
                >
                  GitHub
                </Button>
              </Box>
            </>
          )}

          {/* Login Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              Vous avez déjà un compte ?{' '}              <Link
                component={RouterLink}
                to="/login"
                sx={{ 
                  color: '#3b82f6', 
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Se connecter
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignupPage;

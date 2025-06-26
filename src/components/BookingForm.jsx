import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Divider,
  Card,
  CardContent,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Payment,
  CreditCard,
  AccountBalance,
  Apple,
  CheckCircle,
} from '@mui/icons-material';

const BookingForm = ({ setStep }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    paymentMethod: ''
  });

  const [errors, setErrors] = useState({});

  const paymentMethods = [
    { value: 'card', label: 'Carte bancaire', icon: <CreditCard /> },
    { value: 'paypal', label: 'PayPal', icon: <Payment /> },
    { value: 'transfer', label: 'Virement bancaire', icon: <AccountBalance /> },
    { value: 'apple', label: 'Apple Pay', icon: <Apple /> },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Veuillez choisir un mode de paiement';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setStep('summary');
    }
  };

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', p: 2 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 4,
          border: '1px solid #e2e8f0',
          borderRadius: 3
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 1, 
            fontWeight: 600, 
            color: '#1e293b',
            textAlign: 'center'
          }}
        >
          Finaliser votre réservation
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#64748b', 
            mb: 4,
            textAlign: 'center'
          }}
        >
          Veuillez remplir vos informations pour confirmer votre réservation
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Informations personnelles */}
          <Card 
            elevation={0}
            sx={{ 
              mb: 3,
              border: '1px solid #e2e8f0',
              borderRadius: 2
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Person sx={{ color: '#3b82f6', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Vos informations
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
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
                          <Person sx={{ color: '#64748b' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                      }
                    }}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="lastName"
                    label="Nom de famille"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#64748b' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                      }
                    }}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Adresse email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: '#64748b' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                      }
                    }}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="phone"
                    label="Numéro de téléphone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone sx={{ color: '#64748b' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                      }
                    }}
                    required
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Paiement */}
          <Card 
            elevation={0}
            sx={{ 
              mb: 4,
              border: '1px solid #e2e8f0',
              borderRadius: 2
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Payment sx={{ color: '#3b82f6', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Mode de paiement
                </Typography>
              </Box>
              
              <TextField
                fullWidth
                select
                name="paymentMethod"
                label="Choisissez votre mode de paiement"
                value={formData.paymentMethod}
                onChange={handleChange}
                error={!!errors.paymentMethod}
                helperText={errors.paymentMethod}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  }
                }}
                required
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method.value} value={method.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {method.icon}
                      {method.label}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>

              {formData.paymentMethod && (
                <Alert 
                  severity="info" 
                  sx={{ 
                    mt: 2,
                    borderRadius: '10px',
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #bfdbfe'
                  }}
                >
                  Vous serez redirigé vers la page de paiement sécurisée après confirmation.
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Bouton de soumission */}
          <Box sx={{ textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<CheckCircle />}
              sx={{
                background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                borderRadius: '25px',
                px: 6,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Confirmer la réservation
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default BookingForm;

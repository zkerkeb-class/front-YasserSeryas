import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReservation } from '../store/thunks/eventsThunks';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Payment,
  CreditCard,
  AccountBalance,
  Apple,
  CheckCircle,
} from '@mui/icons-material';

const BookingForm = ({ eventId, ticketTypeId, setStep,price }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    paymentMethod: '',
    quantity: 1, // Par défaut 1 billet
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

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
    
    // Clear API error
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Veuillez choisir un mode de paiement';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleReservation = async () => {
    try {
      const reservationData = {
        eventId: eventId,
        ticketTypeId: ticketTypeId,
        quantity: formData.quantity || 1, // Par défaut 1 billet
        // paymentMethod: formData.paymentMethod
      };

      // Utiliser le thunk Redux pour créer la réservation
      const result = await dispatch(createReservation(reservationData)).unwrap();
      
      console.log('Réservation créée avec succès:', result);
      
      // Rediriger vers l'étape suivante ou afficher un message de succès
      if (setStep) {
        setStep('success');
      }

      return result;
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      await handleReservation();
    } catch (error) {
      setApiError(error.message || 'Une erreur est survenue lors de la réservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: '600px', mx: 'auto', p: 2 }}>
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
          Choisissez votre mode de paiement pour confirmer votre réservation
        </Typography>

        {apiError && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: '10px',
            }}
          >
            {apiError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Mode de paiement */}
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
  
  {/* Champ Quantité */}
  <TextField
    fullWidth
    type="number"
    name="quantity"
    label="Quantité de billets"
    value={formData.quantity}
    onChange={handleChange}
    error={!!errors.quantity}
    helperText={errors.quantity}
    disabled={loading}
    
    inputProps={{
      min: 1,
      max: 50
    }}
    sx={{
      mb: 2,
      '& .MuiOutlinedInput-root': {
        borderRadius: '10px',
      }
    }}
    required
  />
  
  {/* Champ Mode de paiement */}
  <TextField
    fullWidth
    select
    name="paymentMethod"
    label="Choisissez votre mode de paiement"
    value={formData.paymentMethod}
    onChange={handleChange}
    error={!!errors.paymentMethod}
    helperText={errors.paymentMethod}
    disabled={loading}
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

  {formData.paymentMethod && !loading && (
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
  {price && (
    <Box sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        Total à payer :
      </Typography>
      <Typography variant="h6" sx={{ color: '#3b82f6', fontWeight: 700 }}>
        {typeof price === 'number'
          ? `${(price * (formData.quantity || 1)).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`
          : '--'}
      </Typography>
    </Box>
  )}
</CardContent>

          </Card>

          {/* Bouton de soumission */}
          <Box sx={{ textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !formData.paymentMethod}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
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
                  transform: loading ? 'none' : 'translateY(-2px)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                },
                '&:disabled': {
                  background: '#94a3b8',
                  transform: 'none',
                },
                transition: 'all 0.3s ease',
              }}
            >

              {loading ? 'Traitement en cours...' : 'Confirmer la réservation'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default BookingForm;

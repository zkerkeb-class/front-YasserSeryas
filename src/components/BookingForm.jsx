import React, { useMemo, useState } from 'react';
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
  CheckCircle,
} from '@mui/icons-material';

// Stripe
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

// Gestion sécurisée de la clé publique Stripe
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '';
console.log('STRIPE_PUBLISHABLE_KEY loaded:', !!STRIPE_PUBLISHABLE_KEY);

// Ne charger Stripe que si la clé est présente
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

// URL de ton backend option B
const API_BASE = 'http://localhost:3003';

const CardPaymentSection = ({ totalEuros, onPaid }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [statusMsg, setStatusMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) {
      setStatusMsg('Stripe n\'est pas encore chargé, veuillez patienter.');
      return;
    }

    // Validation du montant
    if (!Number.isFinite(totalEuros) || totalEuros <= 0) {
      setStatusMsg('Montant total invalide');
      return;
    }

    setLoading(true);
    setStatusMsg('');

    try {
      // 1) Créer le PaymentIntent côté serveur
      const resp = await fetch(`${API_BASE}/payments/create-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalEuros,
          currency: 'eur'
        })
      });

      const data = await resp.json();
      
      if (!resp.ok || data.error) {
        throw new Error(data.error || 'Erreur lors de la création du PaymentIntent');
      }

      if (!data.clientSecret) {
        throw new Error('Réponse serveur invalide: clientSecret manquant');
      }

      const clientSecret = data.clientSecret;

      // 2) Confirmer le paiement avec la carte saisie
      const card = elements.getElement(CardElement);
      
      if (!card) {
        throw new Error('Champ carte introuvable');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card }
      });

      if (error) {
        throw new Error(error.message || 'Erreur de confirmation de paiement');
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Nettoyer la carte pour une meilleure UX
        card.clear();
        setStatusMsg('Paiement réussi ✔');
        // Callback pour prévenir le parent que le paiement est ok
        onPaid?.(paymentIntent);
      } else {
        setStatusMsg(`Statut du paiement: ${paymentIntent?.status ?? 'inconnu'}`);
      }
    } catch (e) {
      console.error('Erreur paiement:', e);
      setStatusMsg(e.message || 'Une erreur est survenue pendant le paiement');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = useMemo(() => ({
    style: {
      base: {
        fontSize: '16px',
        color: '#1e293b',
        '::placeholder': { color: '#94a3b8' }
      },
      invalid: { color: '#ef4444' }
    }
  }), []);

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ mb: 1, color: '#64748b' }}>
        Saisissez vos informations de carte pour payer{' '}
        {totalEuros.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
      </Box>
      <Box sx={{ p: 1.5, border: '1px solid #e2e8f0', borderRadius: '10px' }}>
        <CardElement options={cardStyle} />
      </Box>

      <Button
        onClick={handlePay}
        variant="contained"
        size="large"
        disabled={loading || !stripe || !elements}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
        sx={{
          mt: 2,
          background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
          borderRadius: '25px',
          px: 6,
          py: 1.5,
          fontSize: '1.05rem',
          fontWeight: 600,
          '&:hover': {
            background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
            transform: loading ? 'none' : 'translateY(-2px)',
          },
          '&:disabled': {
            background: '#94a3b8',
            transform: 'none',
          },
          transition: 'all 0.3s ease',
        }}
      >
        {loading ? 'Paiement en cours...' : 'Payer maintenant'}
      </Button>

      {statusMsg && (
        <Alert 
          severity={statusMsg.includes('réussi') ? 'success' : 'error'} 
          sx={{ mt: 2, borderRadius: '10px' }}
        >
          {statusMsg}
        </Alert>
      )}
    </Box>
  );
};

const BookingForm = ({ eventId, ticketTypeId, setStep, price }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    paymentMethod: '',
    quantity: 1,
  });

  const [errors, setErrors] = useState({});
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [apiError, setApiError] = useState('');

  const paymentMethods = [
    { value: 'card', label: 'Carte bancaire', icon: <CreditCard /> },
    // autres méthodes plus tard...
  ];

  const total = useMemo(() => {
    const q = Number(formData.quantity || 1);
    return (typeof price === 'number' ? price : 0) * (Number.isFinite(q) ? q : 1);
  }, [price, formData.quantity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const v = name === 'quantity' ? Math.max(1, Number(value)) : value;

    setFormData(prev => ({ ...prev, [name]: v }));

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Veuillez choisir un mode de paiement';
    if (!formData.quantity || Number(formData.quantity) < 1) newErrors.quantity = 'Quantité invalide';
    if (!total || total <= 0) newErrors.total = 'Montant total invalide';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Création de réservation après paiement réussi
  const handleAfterPaid = async (paymentIntent) => {
    try {
      setLoadingSubmit(true);
      const reservationData = {
        eventId,
        ticketTypeId,
        quantity: formData.quantity || 1,
        // payment: paymentIntent?.id
      };
      const result = await dispatch(createReservation(reservationData)).unwrap();
      console.log('Réservation créée avec succès:', result);
      if (setStep) setStep('success');
      return result;
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      setApiError(error.message || 'Une erreur est survenue lors de la réservation');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    // Si l'utilisateur a choisi "Carte bancaire", le paiement se fait via CardPaymentSection
    if (formData.paymentMethod === 'card') {
      return;
    }

    // Autres méthodes de paiement à implémenter plus tard
  };

  // Vérifier si Stripe est disponible
  if (!stripePromise) {
    return (
      <Box sx={{ maxWidth: '600px', mx: 'auto', p: 2 }}>
        <Alert severity="error" sx={{ borderRadius: '10px' }}>
          Configuration Stripe manquante. Veuillez vérifier la variable d'environnement REACT_APP_STRIPE_PUBLISHABLE_KEY.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '600px', mx: 'auto', p: 2 }}>
      <Paper
        elevation={0}
        sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 3 }}
      >
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600, color: '#1e293b', textAlign: 'center' }}>
          Finaliser votre réservation
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', mb: 4, textAlign: 'center' }}>
          Choisissez votre mode de paiement pour confirmer votre réservation
        </Typography>

        {apiError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
            {apiError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card elevation={0} sx={{ mb: 4, border: '1px solid #e2e8f0', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Payment sx={{ color: '#3b82f6', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Mode de paiement
                </Typography>
              </Box>

              {/* Quantité */}
              <TextField
                fullWidth
                type="number"
                name="quantity"
                label="Quantité de billets"
                value={formData.quantity}
                onChange={handleChange}
                error={!!errors.quantity}
                helperText={errors.quantity}
                disabled={loadingSubmit}
                inputProps={{ min: 1, max: 50 }}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                required
              />

              {/* Mode de paiement */}
              <TextField
                fullWidth
                select
                name="paymentMethod"
                label="Choisissez votre mode de paiement"
                value={formData.paymentMethod}
                onChange={handleChange}
                error={!!errors.paymentMethod}
                helperText={errors.paymentMethod}
                disabled={loadingSubmit}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
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

              {typeof price === 'number' && (
                <Box sx={{ mt: 2, mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">Prix unitaire :</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Total à payer :</Typography>
                    <Typography variant="h6" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                      {total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Info quand "Carte bancaire" est sélectionné */}
              {formData.paymentMethod === 'card' && (
                <Alert severity="info"
                  sx={{ mt: 2, borderRadius: '10px', backgroundColor: '#f0f9ff', border: '1px solid #bfdbfe' }}>
                  Vous allez payer sur cette page via une carte bancaire sécurisée.
                </Alert>
              )}

              {/* Formulaire carte - Seulement si Stripe est chargé ET méthode = card */}
              {formData.paymentMethod === 'card' && stripePromise && (
                <Elements stripe={stripePromise}>
                  <CardPaymentSection
                    totalEuros={total || 0}
                    onPaid={handleAfterPaid}
                  />
                </Elements>
              )}
            </CardContent>
          </Card>

          {/* Bouton de soumission principal - Désactivé pour "card" */}
          {formData.paymentMethod !== 'card' && (
            <Box sx={{ textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loadingSubmit || !formData.paymentMethod}
                startIcon={loadingSubmit ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                sx={{
                  background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                  borderRadius: '25px',
                  px: 6,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                    transform: loadingSubmit ? 'none' : 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: '#94a3b8',
                    transform: 'none',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loadingSubmit ? 'Traitement en cours...' : 'Confirmer la réservation'}
              </Button>
            </Box>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default BookingForm;

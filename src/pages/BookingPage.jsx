import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  EventNote,
  Payment,
  CheckCircle,
  ConfirmationNumber,
} from '@mui/icons-material';
import BookingForm from '../components/BookingForm';
import BookingSummary from '../components/BookingSummary';
import BookingConfirmation from '../components/BookingConfirmation';
import { fetchEventById, createReservation } from '../store/thunks/eventsThunks';

const BookingPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentEvent, isLoading, error, confirmationNumber } = useSelector((state) => state.events);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [step, setStep] = useState('form'); // 'form', 'summary', 'confirmation', 'success'
  const [selectedTicketType, setSelectedTicketType] = useState(null);

  useEffect(() => {
    // Rediriger si non authentifié
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Récupérer les données de l'événement si pas déjà chargées
    if (eventId && (!currentEvent || currentEvent._id !== eventId)) {
      dispatch(fetchEventById(eventId));
    }
  }, [dispatch, eventId, currentEvent, isAuthenticated, navigate]);

  // États de chargement et d'erreur
  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des informations de l'événement...
        </Typography>
      </Container>
    );
  }

  if (error || !currentEvent) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => navigate('/events')}
            >
              Retour aux événements
            </Button>
          }
        >
          {error || "Impossible de charger les informations de l'événement"}
        </Alert>
      </Container>
    );
  }

  const steps = ['Sélection du billet', 'Paiement', 'Confirmation'];
  const activeStep = step === 'form' ? 0 : step === 'summary' ? 1 : 2;

  const getTicketTypes = () => {
    if (currentEvent?.pricing?.ticketTypes && currentEvent.pricing.ticketTypes.length > 0) {
      return currentEvent.pricing.ticketTypes;
    }
    return currentEvent?.ticketTypes || [];
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return 'Gratuit';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const handleTicketSelection = (ticketType) => {
    setSelectedTicketType(ticketType);
    setStep('summary');
  };

  const renderTicketSelection = () => (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Choisissez votre type de billet
      </Typography>
      
      {/* Informations sur l'événement */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: 'grey.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <EventNote color="primary" />
          <Typography variant="h6">{currentEvent.name}</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {new Date(currentEvent.startDate).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {currentEvent.location?.name}, {currentEvent.location?.address?.city}
        </Typography>
      </Paper>

      {/* Types de billets */}
      <Grid container spacing={3}>
        {getTicketTypes().map((ticket, index) => (
          <Grid item xs={12} md={6} key={ticket._id || index}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                }
              }}
              onClick={() => handleTicketSelection(ticket)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {ticket.name}
                  </Typography>
                  <Chip 
                    label={`${ticket.quantity || ticket.initialQuantity || 0} disponibles`}
                    color="primary"
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {ticket.description}
                </Typography>
                
                {ticket.benefits && ticket.benefits.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Inclus :
                    </Typography>
                    {ticket.benefits.slice(0, 3).map((benefit, idx) => (
                      <Typography key={idx} variant="body2" sx={{ color: 'success.main', fontSize: '0.85rem' }}>
                        • {benefit}
                      </Typography>
                    ))}
                    {ticket.benefits.length > 3 && (
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                        +{ticket.benefits.length - 3} autres avantages...
                      </Typography>
                    )}
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    {formatPrice(ticket.price)}
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<ConfirmationNumber />}
                    disabled={!ticket.isAvailable || (ticket.quantity || 0) === 0}
                  >
                    {(ticket.quantity || 0) > 0 ? 'Choisir' : 'Épuisé'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header avec navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(`/events/${eventId}`)}
          sx={{ mr: 2 }}
        >
          Retour à l'événement
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Finaliser ma réservation
        </Typography>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Contenu selon l'étape */}
      {step === 'form' && renderTicketSelection()}
      
      {step === 'summary' && selectedTicketType && (
        <BookingForm 
          eventId={currentEvent._id}
          ticketTypeId={selectedTicketType._id || selectedTicketType.id}
          selectedTicket={selectedTicketType}
          currentEvent={currentEvent}
          setStep={setStep}
          price={currentEvent.price}
        />
      )}
      
      {step === 'confirmation' && (
        <BookingSummary 
          eventId={currentEvent._id}
          selectedTicket={selectedTicketType}
          currentEvent={currentEvent}
          setStep={setStep} 
        />
      )}
      
      {step === 'success' && (
        <BookingConfirmation 
          currentEvent={currentEvent}
          selectedTicket={selectedTicketType}
          confirmationNumber={confirmationNumber}
        />
      )}
    </Container>
  );
};

export default BookingPage;

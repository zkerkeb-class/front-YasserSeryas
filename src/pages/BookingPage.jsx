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
  Divider,
  useTheme,
  useMediaQuery,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
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

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleTicketSelection = (ticketType) => {
    setSelectedTicketType(ticketType);
    setStep('summary');
  };

  const renderTicketSelection = () => (
    <Box>
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          mb: { xs: 2, md: 4 },
          fontSize: { xs: '1.25rem', md: '2rem' }
        }}
      >
        Choisissez votre type de billet
      </Typography>
      
      {/* Informations sur l'événement */}
      <Paper sx={{ 
        p: { xs: 2, md: 3 }, 
        mb: { xs: 2, md: 4 }, 
        bgcolor: 'grey.50' 
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, md: 2 }, 
          mb: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <EventNote color="primary" />
          <Typography 
            variant="h6"
            sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}
          >
            {currentEvent.name}
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            fontSize: { xs: '0.85rem', md: '0.875rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          {new Date(currentEvent.startDate).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            fontSize: { xs: '0.85rem', md: '0.875rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          {currentEvent.location?.name}, {currentEvent.location?.address?.city}
        </Typography>
      </Paper>

      {/* Types de billets */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {getTicketTypes().map((ticket, index) => (
          <Grid item xs={12} md={6} key={ticket._id || index}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: { xs: 'none', md: 'translateY(-4px)' },
                  boxShadow: { xs: 2, md: '0 8px 25px rgba(0,0,0,0.15)' },
                }
              }}
              onClick={() => handleTicketSelection(ticket)}
            >
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start', 
                  mb: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1, sm: 0 }
                }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}
                  >
                    {ticket.name}
                  </Typography>
                  <Chip 
                    label={`${ticket.quantity || ticket.initialQuantity || 0} disponibles`}
                    color="primary"
                    size={isMobile ? "small" : "medium"}
                  />
                </Box>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  paragraph
                  sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}
                >
                  {ticket.description}
                </Typography>
                
                {ticket.benefits && ticket.benefits.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      variant="subtitle2" 
                      gutterBottom
                      sx={{ fontSize: { xs: '0.9rem', md: '0.875rem' } }}
                    >
                      Inclus :
                    </Typography>
                    {ticket.benefits.slice(0, isMobile ? 2 : 3).map((benefit, idx) => (
                      <Typography 
                        key={idx} 
                        variant="body2" 
                        sx={{ 
                          color: 'success.main', 
                          fontSize: { xs: '0.8rem', md: '0.85rem' }
                        }}
                      >
                        • {benefit}
                      </Typography>
                    ))}
                    {ticket.benefits.length > (isMobile ? 2 : 3) && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary', 
                          fontSize: { xs: '0.8rem', md: '0.85rem' }
                        }}
                      >
                        +{ticket.benefits.length - (isMobile ? 2 : 3)} autres avantages...
                      </Typography>
                    )}
                  </Box>
                )}
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mt: 'auto',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1, sm: 0 }
                }}>
                  <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    color="primary" 
                    fontWeight="bold"
                    sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }}
                  >
                    {formatPrice(ticket.price)}
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<ConfirmationNumber />}
                    disabled={!ticket.isAvailable || (ticket.quantity || 0) === 0}
                    size={isMobile ? "small" : "medium"}
                    fullWidth={isMobile}
                    sx={{ 
                      minWidth: { xs: '100%', sm: 'auto' },
                      mt: { xs: 1, sm: 0 }
                    }}
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
    <Container maxWidth={isMobile ? "sm" : "lg"} sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
      {/* Header avec navigation */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        flexDirection: { xs: 'column', sm: 'row' },
        mb: { xs: 2, md: 4 },
        gap: { xs: 1, sm: 0 }
      }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(`/events/${eventId}`)}
          sx={{ 
            mr: { sm: 2 },
            mb: { xs: 1, sm: 0 },
            alignSelf: { xs: 'flex-start', sm: 'auto' }
          }}
          size={isMobile ? "small" : "medium"}
        >
          {isMobile ? "Retour" : "Retour à l'événement"}
        </Button>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          sx={{ 
            fontWeight: 600,
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
          }}
        >
          {isMobile ? "Ma réservation" : "Finaliser ma réservation"}
        </Typography>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: { xs: 2, md: 4 } }}>
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel={!isMobile}
          orientation={isMobile ? "vertical" : "horizontal"}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <Typography variant={isMobile ? "body2" : "body1"}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Contenu selon l'étape */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, md: 3 }, mb: { xs: 2, md: 0 } }}>
            {step === 'form' && renderTicketSelection()}
            
            {step === 'summary' && selectedTicketType && (
              <BookingForm 
                eventId={currentEvent._id}
                ticketTypeId={selectedTicketType._id || selectedTicketType.id}
                selectedTicket={selectedTicketType}
                currentEvent={currentEvent}
                setStep={setStep}
                // Utiliser le prix réel du type de billet sélectionné
                price={selectedTicketType.price}
              />
            )}
            
            {step === 'confirmation' && selectedTicketType && (
              <BookingSummary 
                selectedTicket={selectedTicketType}
                currentEvent={currentEvent}
                setStep={setStep}
                quantity={1}
              />
            )}
            
            {step === 'success' && (
              <BookingConfirmation 
                currentEvent={currentEvent}
                selectedTicket={selectedTicketType}
                confirmationNumber={confirmationNumber}
              />
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: { xs: 2, md: 3 }, 
            position: { md: 'sticky' },
            top: { md: 24 },
            height: 'fit-content'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2,
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              Récapitulatif
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {/* Informations événement */}
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 1,
                  fontSize: { xs: '0.95rem', md: '1rem' }
                }}
              >
                {currentEvent?.name || currentEvent?.title}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}
              >
                📅 {formatDate(currentEvent?.startDate)}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}
              >
                📍 {currentEvent?.location?.name}
              </Typography>
            </Box>

            {/* Récapitulatif commande */}
            {selectedTicketType && (
              <Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    fontSize: { xs: '0.95rem', md: '1rem' }
                  }}
                >
                  Votre commande
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 1,
                  flexWrap: { xs: 'wrap', sm: 'nowrap' }
                }}>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      fontSize: { xs: '0.85rem', md: '0.875rem' },
                      flex: 1,
                      minWidth: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    {selectedTicketType.name} × 1
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.85rem', md: '0.875rem' },
                      mt: { xs: 0.5, sm: 0 }
                    }}
                  >
                    {formatPrice(selectedTicketType.price)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  flexWrap: { xs: 'wrap', sm: 'nowrap' }
                }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      flex: 1,
                      minWidth: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    Total
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: 'primary.main',
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      mt: { xs: 0.5, sm: 0 }
                    }}
                  >
                    {formatPrice(selectedTicketType.price)}
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookingPage;

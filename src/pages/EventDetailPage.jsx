import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Avatar,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Breadcrumbs,
  IconButton,
  Badge,
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  Person,
  Euro,
  AccessTime,
  Share,
  Favorite,
  FavoriteBorder,
  ArrowBack,
  ConfirmationNumber,
  Info,
  Schedule,
  Group,
  CheckCircle,
  MusicNote,
  Star,
  LocalActivity,
} from '@mui/icons-material';
import { fetchEventById } from '../store/thunks/eventsThunks';
import { clearCurrentEvent } from '../store/slices/eventsSlice';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentEvent, isLoading, error } = useSelector((state) => state.events);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventById(eventId));
    }

    // Nettoyage à la sortie du composant
    return () => {
      dispatch(clearCurrentEvent());
    };
  }, [dispatch, eventId]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${eventId}`);
  };

  const handleShare = async () => {
    if (navigator.share && currentEvent) {
      try {
        await navigator.share({
          title: currentEvent.name,
          text: currentEvent.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Erreur de partage:', error);
      }
    } else {
      // Fallback: copier l'URL
      navigator.clipboard.writeText(window.location.href);
      // Vous pouvez ajouter une notification ici
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implémenter la logique pour sauvegarder en favoris
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start.toDateString() === end.toDateString()) {
      // Même jour
      return `${start.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })} de ${start.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })} à ${end.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } else {
      // Plusieurs jours
      return `Du ${formatDate(startDate)} au ${formatDate(endDate)}`;
    }
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return 'Gratuit';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const getOrganizerName = (organizer) => {
    if (organizer && organizer.firstName && organizer.lastName) {
      return `${organizer.firstName} ${organizer.lastName}`;
    }
    return organizer?.email || 'Non spécifié';
  };

  const getLocationText = (location) => {
    if (location?.name && location?.address) {
      return `${location.name}, ${location.address.city} (${location.address.postalCode})`;
    }
    return location?.name || location?.address?.city || 'Lieu non spécifié';
  };

  const getEventPrice = () => {
    if (currentEvent?.pricing?.minPrice && currentEvent?.pricing?.maxPrice) {
      if (currentEvent.pricing.minPrice === currentEvent.pricing.maxPrice) {
        return formatPrice(currentEvent.pricing.minPrice);
      } else {
        return `${formatPrice(currentEvent.pricing.minPrice)} - ${formatPrice(currentEvent.pricing.maxPrice)}`;
      }
    }
    return formatPrice(currentEvent?.pricing?.avgPrice || currentEvent?.price);
  };

  const getAvailableTickets = () => {
    if (currentEvent?.pricing?.totalAvailableTickets) {
      return currentEvent.pricing.totalAvailableTickets;
    }
    return currentEvent?.remainingCapacity || 0;
  };

  const getTicketTypes = () => {
    if (currentEvent?.pricing?.ticketTypes && currentEvent.pricing.ticketTypes.length > 0) {
      return currentEvent.pricing.ticketTypes;
    }
    return currentEvent?.ticketTypes || [];
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="rectangular" width="100%" height={400} sx={{ mt: 2 }} />
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" width="100%" height={60} />
            <Skeleton variant="text" width="100%" height={200} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" width="100%" height={300} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !currentEvent) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          Événement non trouvé
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {error || "L'événement que vous recherchez n'existe pas ou a été supprimé."}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/events')}
        >
          Retour aux événements
        </Button>
      </Container>
    );
  }

  const ticketTypes = getTicketTypes();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Navigation & Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/events')} sx={{ bgcolor: 'grey.100' }}>
            <ArrowBack />
          </IconButton>
          <Breadcrumbs>
            <Link to="/events" style={{ textDecoration: 'none', color: 'inherit' }}>
              Événements
            </Link>
            <Typography color="text.primary">{currentEvent.name}</Typography>
          </Breadcrumbs>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={toggleFavorite} color={isFavorite ? 'error' : 'default'}>
            {isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <IconButton onClick={handleShare}>
            <Share />
          </IconButton>
        </Box>
      </Box>

      {/* Image principale ou placeholder pour concert R&B */}
      <Box
        sx={{
          width: '100%',
          height: 400,
          backgroundImage: currentEvent.images && currentEvent.images.length > 0 
            ? `url(${currentEvent.images[0]})` 
            : 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #45B7D1 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2,
          mb: 4,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {(!currentEvent.images || currentEvent.images.length === 0) && (
          <MusicNote sx={{ fontSize: 120, color: 'rgba(255,255,255,0.3)' }} />
        )}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            color: 'white',
            p: 3,
            borderRadius: '0 0 8px 8px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Chip
              label={currentEvent.category}
              sx={{ bgcolor: 'error.main', color: 'white' }}
            />
            {/* <Chip
              icon={<Star />}
              label="Événement Premium"
              sx={{ bgcolor: 'warning.main', color: 'white' }}
            /> */}
          </Box>
          <Typography variant="h3" component="h1" fontWeight="bold">
            {currentEvent.name}
          </Typography>
          
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Contenu principal */}
        <Grid item xs={12} md={8}>
          {/* Informations de base */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Info color="primary" />
              Informations du concert
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CalendarToday color="action" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date et heure
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDateRange(currentEvent.startDate, currentEvent.endDate)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <LocationOn color="action" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Lieu
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {getLocationText(currentEvent.location)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Person color="action" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Organisateur
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {getOrganizerName(currentEvent.organizer)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Group color="action" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Capacité
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {currentEvent.totalCapacity} personnes
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Description */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              À propos du concert
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
              {currentEvent.description}
            </Typography>
            
            {/* Artistes invités
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Star color="primary" />
                Artistes à l'affiche
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Card variant="outlined" sx={{ bgcolor: 'primary.50' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <MusicNote sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h6" color="primary">
                        Chris Brown
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Artiste principal
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <MusicNote sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                      <Typography variant="h6" color="secondary">
                        Summer Walker
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Artiste invité
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <MusicNote sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                      <Typography variant="h6" color="info">
                        Bryson Tiller
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Artiste invité
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box> */}
            
            {currentEvent.tags && currentEvent.tags.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Genres musicaux :
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {currentEvent.tags.map((tag, index) => (
                    <Chip key={index} label={tag} variant="outlined" size="small" />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>

          {/* Types de billets */}
          {ticketTypes.length > 0 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ConfirmationNumber color="primary" />
                Billets disponibles
              </Typography>
              <Grid container spacing={2}>
                {ticketTypes.map((ticket, index) => (
                  <Grid item xs={12} sm={6} key={ticket._id || index}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            {ticket.name}
                          </Typography>
                          <Badge 
                            badgeContent={ticket.quantity} 
                            color="primary"
                            max={999}
                          >
                            <LocalActivity color="action" />
                          </Badge>
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {ticket.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                          <Typography variant="h5" color="primary">
                            {formatPrice(ticket.price)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Max {ticket.maxPerPurchase} par commande
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Vente jusqu'au {formatDate(ticket.saleEndDate)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </Grid>

        {/* Sidebar de réservation */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h4" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Euro />
              {getEventPrice()}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ConfirmationNumber />
                {getAvailableTickets()} billets disponibles
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Statut : {currentEvent.status}
              </Typography>
              {currentEvent.pricing && (
                <Typography variant="body2" color="info.main" sx={{ mt: 1 }}>
                  Prix moyen : {formatPrice(currentEvent.pricing.avgPrice)}
                </Typography>
              )}
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleBookNow}
              disabled={getAvailableTickets() === 0}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF5252 30%, #26A69A 90%)',
                },
              }}
            >
              {getAvailableTickets() > 0 ? 'Réserver maintenant' : 'Complet'}
            </Button>

            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              {!isAuthenticated && 'Connectez-vous pour réserver'}
            </Typography>

            {/* Informations supplémentaires */}
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" gutterBottom>
                Détails du concert
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Créé le :</strong> {formatDate(currentEvent.createdAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                <strong>Dernière mise à jour :</strong> {formatDate(currentEvent.updatedAt)}
              </Typography>
              
              {/* Informations pratiques */}
              <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Informations pratiques
                </Typography>
                <List dense>
                  <ListItem sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Ouverture des portes 1h avant" />
                  </ListItem>
                  <ListItem sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Vestiaire disponible" />
                  </ListItem>
                  <ListItem sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Bar et restauration sur place" />
                  </ListItem>
                  <ListItem sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Accès transports en commun" />
                  </ListItem>
                </List>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EventDetailPage;

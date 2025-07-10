import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Box,
  Chip,
  Avatar,
  Rating,
} from '@mui/material';
import {
  LocationOn,
  CalendarToday,
  Person,
  Favorite,
  Share,
  LocalOffer,
} from '@mui/icons-material';
import { useEvents } from '../hooks/useRedux';

const FeaturedEvents = () => {
  const navigate = useNavigate();
  const { featuredEvents, isLoading } = useEvents();

  return (
    <Box sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{ fontWeight: 'bold', color: '#111827', mb: 2 }}
        >
          Événements en vedette
        </Typography>
        <Typography
          variant="h6"
          sx={{ 
            color: '#6b7280', 
            maxWidth: '600px', 
            mx: 'auto',
            fontSize: { xs: '1rem', md: '1.25rem' }
          }}
        >
          Découvrez notre sélection d'événements exceptionnels, choisis avec soin pour vous offrir des expériences inoubliables
        </Typography>
      </Box>

      <Grid container spacing={4}>        {featuredEvents.map((event) => (
          <Grid item xs={12} md={6} lg={4} key={event.id}>
            <Card 
              sx={{
                height: '100%',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                },
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={event.image}
                  alt={event.title}
                  sx={{ objectFit: 'cover' }}
                />
                <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                  <Chip
                    label={event.category}
                    color="primary"
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#2563eb',
                      fontWeight: 600
                    }}
                  />
                </Box>
                <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    sx={{
                      minWidth: 32,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#ef4444',
                      '&:hover': {
                        backgroundColor: '#fef2f2',
                      },
                    }}
                  >
                    <Favorite fontSize="small" />
                  </Button>
                  <Button
                    size="small"
                    sx={{
                      minWidth: 32,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#6b7280',
                      '&:hover': {
                        backgroundColor: '#f9fafb',
                      },
                    }}
                  >
                    <Share fontSize="small" />
                  </Button>
                </Box>                {/* Chip de réduction - adapté pour le format Redux */}
                <Box sx={{ position: 'absolute', bottom: 16, left: 16 }}>
                  <Chip
                    icon={<LocalOffer />}
                    label="Populaire"
                    color="error"
                    size="small"
                    sx={{ 
                      backgroundColor: '#ef4444',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Box>              <CardContent sx={{ p: 3 }}>                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#111827',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      flex: 1,
                      mr: 1
                    }}
                  >
                    {event.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Rating value={4.5} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      4.5
                    </Typography>
                  </Box>
                </Box>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#6b7280', 
                    mb: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {event.description}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                    <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                    <LocationOn fontSize="small" sx={{ mr: 1 }} />
                    <Typography 
                      variant="body2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {event.location}
                    </Typography>
                  </Box>                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                    <Person fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {event.availableTickets} places disponibles
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#059669' }}>
                      {event.price}€
                    </Typography>
                  </Box>
                  <Avatar sx={{ width: 32, height: 32, backgroundColor: '#dbeafe', color: '#2563eb', fontSize: '0.75rem' }}>
                    {event.organizer.charAt(0)}
                  </Avatar>
                </Box>
              </CardContent>

              <CardActions sx={{ p: 3, pt: 0, display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  onClick={() => navigate(`/events/${event.id}`)}
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    fontWeight: 600,
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    '&:hover': {
                      borderColor: '#2563eb',
                      backgroundColor: 'rgba(59, 130, 246, 0.04)',
                    },
                  }}
                >
                  Voir détails
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => navigate(`/booking/${event.id}`)}
                  sx={{
                    background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                    py: 1.5,
                    borderRadius: '12px',
                    fontWeight: 600,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Réserver
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturedEvents;

import React from 'react';
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

const FeaturedEvents = ({ setCurrentPage }) => {
  const featuredEvents = [
    {
      id: 1,
      title: "Festival Jazz & Blues",
      date: "2025-07-15",
      location: "Salle Pleyel, Paris",
      price: "45€",
      originalPrice: "60€",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Concert",
      rating: 4.8,
      attendees: 1200,
      artist: "Miles Davis Tribute",
      description: "Une soirée exceptionnelle dédiée aux légendes du jazz"
    },
    {
      id: 2,
      title: "Théâtre Classique",
      date: "2025-07-20",
      location: "Comédie Française, Paris",
      price: "35€",
      originalPrice: "45€",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Théâtre",
      rating: 4.6,
      attendees: 800,
      artist: "Troupe Molière",
      description: "Une adaptation moderne des grands classiques"
    },
    {
      id: 3,
      title: "Conférence Tech 2025",
      date: "2025-08-05",
      location: "Palais des Congrès, Paris",
      price: "89€",
      originalPrice: "120€",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Conférence",
      rating: 4.9,
      attendees: 2000,
      artist: "Leaders Tech",
      description: "Les dernières innovations technologiques"
    }
  ];
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
                </Box>
                {event.originalPrice && (
                  <Box sx={{ position: 'absolute', bottom: 16, left: 16 }}>
                    <Chip
                      icon={<LocalOffer />}
                      label={`-${Math.round(((parseFloat(event.originalPrice.replace('€', '')) - parseFloat(event.price.replace('€', ''))) / parseFloat(event.originalPrice.replace('€', ''))) * 100)}%`}
                      color="error"
                      size="small"
                      sx={{ 
                        backgroundColor: '#ef4444',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                )}
              </Box>              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
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
                    <Rating value={event.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      {event.rating}
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
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                    <Person fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {event.attendees.toLocaleString()} personnes intéressées
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#059669' }}>
                      {event.price}
                    </Typography>
                    {event.originalPrice && (
                      <Typography
                        variant="body2"
                        sx={{ 
                          color: '#6b7280',
                          textDecoration: 'line-through'
                        }}
                      >
                        {event.originalPrice}
                      </Typography>
                    )}
                  </Box>
                  <Avatar sx={{ width: 32, height: 32, backgroundColor: '#dbeafe', color: '#2563eb', fontSize: '0.75rem' }}>
                    {event.artist.charAt(0)}
                  </Avatar>
                </Box>
              </CardContent>

              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => setCurrentPage('booking')}
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
                  Réserver maintenant
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

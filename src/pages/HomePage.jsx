import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from '@mui/material';
import {
  Search,
  Event,
  LocationOn,
  CalendarToday,
  Star,
} from '@mui/icons-material';
import { useAppDispatch, useEvents } from '../hooks/useRedux';
import { fetchFeaturedEvents } from '../store/thunks/eventsThunks';
import SearchBar from '../components/SearchBar';
import FeaturedEvents from '../components/FeaturedEvents.jsx';

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { featuredEvents, isLoading } = useEvents();

  useEffect(() => {
    // Les événements mis en avant sont déjà chargés dans App.js, 
    // mais on peut recharger si nécessaire
    if (featuredEvents.length === 0) {
      dispatch(fetchFeaturedEvents());
    }
  }, [dispatch, featuredEvents.length]);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #faf5ff 100%)' }}>
      {/* Hero Section */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 600,
                    color: '#111827',
                    mb: 2,
                    background: 'linear-gradient(45deg, #1e40af, #7c3aed)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                    lineHeight: 1.2,
                  }}
                >
                  Découvrez les meilleurs événements
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#6b7280',
                    mb: 3,
                    lineHeight: 1.6,
                    fontSize: { xs: '0.95rem', md: '1.1rem' },
                    maxWidth: '90%',
                    mx: { xs: 'auto', md: 0 },
                  }}
                >
                  Réservez vos billets pour concerts, théâtres, conférences et plus encore.
                  Une expérience unique vous attend !
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  gap: 2, 
                  justifyContent: { xs: 'center', md: 'flex-start' } 
                }}>                  <Button
                    variant="contained"
                    size="medium"
                    startIcon={<Search />}
                    onClick={() => navigate('/events')}
                    sx={{
                      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                      borderRadius: '20px',
                      px: 3,
                      py: 1.2,
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      boxShadow: '0 6px 12px -2px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.15)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Parcourir les événements
                  </Button>
                  <Button
                    variant="outlined"
                    size="medium"
                    startIcon={<Event />}
                    sx={{
                      borderColor: '#d1d5db',
                      color: '#374151',
                      borderRadius: '20px',
                      px: 3,
                      py: 1.2,
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      borderWidth: '1.5px',
                      '&:hover': {
                        borderColor: '#8b5cf6',
                        color: '#7c3aed',
                        backgroundColor: '#faf5ff',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Créer un événement
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', mt: { xs: 4, md: 0 } }}>
                <Card 
                  sx={{
                    transform: 'rotate(2deg)',
                    transition: 'transform 0.3s ease',
                    boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.2)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    maxWidth: '400px',
                    mx: 'auto',
                    '&:hover': {
                      transform: 'rotate(0deg)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Concert"
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                        Concert Jazz Festival
                      </Typography>
                      <Chip
                        label="Populaire"
                        color="primary"
                        size="small"
                        icon={<Star />}
                        sx={{ fontSize: '0.7rem', height: '24px' }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#6b7280', mb: 0.5 }}>
                      <LocationOn fontSize="small" sx={{ mr: 1, fontSize: '1rem' }} />
                      <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Paris, Zenith</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                      <CalendarToday fontSize="small" sx={{ mr: 1, fontSize: '1rem' }} />
                      <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>15 Juillet 2025</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Search Section */}
      <Container maxWidth="md" sx={{ py: 3 }}>
        <SearchBar />
      </Container>      {/* Featured Events */}
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <FeaturedEvents />
      </Container>
    </Box>
  );
};

export default HomePage;

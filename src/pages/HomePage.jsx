import React from 'react';
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
import SearchBar from '../components/SearchBar';
import FeaturedEvents from '../components/FeaturedEvents.jsx';

const HomePage = ({ setCurrentPage }) => {
  return (    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #faf5ff 100%)' }}>
      {/* Hero Section */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 'bold',
                    color: '#111827',
                    mb: 2,
                    background: 'linear-gradient(45deg, #1e40af, #7c3aed)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '2rem', md: '2.5rem' },
                  }}
                >
                  Découvrez les meilleurs événements
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#6b7280',
                    mb: 4,
                    lineHeight: 1.7,
                    fontSize: { xs: '1rem', md: '1.25rem' },
                  }}
                >
                  Réservez vos billets pour concerts, théâtres, conférences et plus encore.
                  Une expérience unique vous attend !
                </Typography><Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Search />}
                    onClick={() => setCurrentPage('events')}
                    sx={{
                      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                      borderRadius: '25px',
                      px: 4,
                      py: 1.5,
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Parcourir les événements
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Event />}
                    sx={{
                      borderColor: '#d1d5db',
                      color: '#374151',
                      borderRadius: '25px',
                      px: 4,
                      py: 1.5,
                      borderWidth: '2px',
                      '&:hover': {
                        borderColor: '#8b5cf6',
                        color: '#7c3aed',
                        backgroundColor: '#faf5ff',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Créer un événement
                  </Button>
                </Box>
              </Box>
            </Grid>            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative' }}>
                <Card 
                  sx={{
                    transform: 'rotate(3deg)',
                    transition: 'transform 0.3s ease',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'rotate(0deg)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="250"
                    image="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Concert"
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Concert Jazz Festival
                      </Typography>
                      <Chip
                        label="Populaire"
                        color="primary"
                        size="small"
                        icon={<Star />}
                        sx={{ fontSize: '0.75rem' }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#6b7280', mb: 0.5 }}>
                      <LocationOn fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">Paris, Zenith</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                      <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">15 Juillet 2025</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>      {/* Search Section */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <SearchBar />
      </Container>

      {/* Featured Events */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <FeaturedEvents setCurrentPage={setCurrentPage} />
      </Container>
    </Box>
  );
};

export default HomePage;

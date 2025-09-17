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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search,
  Event,
  LocationOn,
  CalendarToday,
  Star,
  ConfirmationNumber,
  Theaters,
  MusicNote,
} from '@mui/icons-material';
import { useState } from 'react';

const HomePage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  useEffect(() => {
    const storedRole = localStorage.getItem("userData");
    const parsedRole = storedRole ? JSON.parse(storedRole) : {};
    setRole(parsedRole.role || "client");
  }, []);
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #faf5ff 100%)' }}>
      {/* Hero Section */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: '#111827',
                    mb: 3,
                    background: 'linear-gradient(45deg, #1e40af, #7c3aed)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                    lineHeight: 1.1,
                  }}
                >
                  Book My Event
                </Typography>
                
                <Typography
                  variant="h5"
                  sx={{
                    color: '#4f46e5',
                    mb: 3,
                    fontWeight: 500,
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                  }}
                >
                  Plateforme de réservation et billeterie en ligne
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: '#6b7280',
                    mb: 4,
                    lineHeight: 1.8,
                    fontSize: { xs: '1rem', md: '1.15rem' },
                    maxWidth: '95%',
                    mx: { xs: 'auto', md: 0 },
                  }}
                >
                  Découvrez et réservez vos billets pour les meilleurs événements : 
                  concerts, spectacles, conférences, festivals et bien plus encore. 
                  Une expérience de réservation simple, rapide et sécurisée.
                </Typography>

                {/* Features Icons */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  gap: { xs: 2, sm: 4 },
                  mb: 4,
                  flexWrap: 'wrap'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MusicNote sx={{ color: '#8b5cf6', fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                    <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                      Concerts
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Theaters sx={{ color: '#8b5cf6', fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                    <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                      Spectacles
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ConfirmationNumber sx={{ color: '#8b5cf6', fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                    <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                      Festivals
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  gap: { xs: 2, sm: 3 }, 
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  alignItems: { xs: 'stretch', sm: 'center' }
                }}>
                  <Button
                    variant="contained"
                    size={isMobile ? "medium" : "large"}
                    startIcon={<Search />}
                    onClick={() => navigate('/events')}
                    sx={{
                      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                      borderRadius: '25px',
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1.2, sm: 1.5 },
                      fontSize: { xs: '0.95rem', sm: '1.05rem' },
                      fontWeight: 600,
                      boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.2)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Découvrir les événements
                  </Button>
                   {role == "organisateur" && (
                  <Button
                    variant="outlined"
                    size={isMobile ? "medium" : "large"}
                    startIcon={<Event />}
                    onClick={() => navigate('/admin')}
                    sx={{
                      borderColor: '#8b5cf6',
                      color: '#7c3aed',
                      borderRadius: '25px',
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1.2, sm: 1.5 },
                      fontSize: { xs: '0.95rem', sm: '1.05rem' },
                      fontWeight: 600,
                      borderWidth: '2px',
                      '&:hover': {
                        borderColor: '#7c3aed',
                        backgroundColor: '#faf5ff',
                        transform: 'translateY(-2px)',
                        borderWidth: '2px',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isMobile ? "Organiser" : "Organiser un événement"}
                  </Button>)}
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', mt: { xs: 6, md: 0 } }}>
                {/* Carte d'exemple principale */}
                {/* <Card 
                  sx={{
                    transform: 'rotate(3deg)',
                    transition: 'transform 0.4s ease',
                    boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.25)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    maxWidth: '350px',
                    mx: 'auto',
                    position: 'relative',
                    zIndex: 2,
                    '&:hover': {
                      transform: 'rotate(0deg) scale(1.02)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="220"
                    image="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Concert Jazz Festival"
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#111827' }}>
                        Concert Jazz Festival
                      </Typography>
                      <Chip
                        label="Populaire"
                        color="primary"
                        size="small"
                        icon={<Star />}
                        sx={{ 
                          fontSize: '0.75rem', 
                          height: '26px',
                          background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#6b7280', mb: 1 }}>
                      <LocationOn fontSize="small" sx={{ mr: 1, fontSize: '1.1rem' }} />
                      <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        Paris, Zénith
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#6b7280', mb: 2 }}>
                      <CalendarToday fontSize="small" sx={{ mr: 1, fontSize: '1.1rem' }} />
                      <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        15 Juillet 2025
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                        À partir de 35€
                      </Typography>
                      <Button 
                        size="small" 
                        variant="contained"
                        sx={{
                          background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                          borderRadius: '15px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          px: 2
                        }}
                      >
                        Réserver
                      </Button>
                    </Box>
                  </CardContent>
                </Card> */}

                {/* Carte secondaire en arrière-plan */}
                {/* <Card 
                  sx={{
                    position: 'absolute',
                    top: '40px',
                    right: '-20px',
                    transform: 'rotate(-5deg)',
                    maxWidth: '280px',
                    zIndex: 1,
                    opacity: 0.7,
                    boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.2)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: { xs: 'none', md: 'block' }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Théâtre"
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                      Théâtre Classique
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Comédie-Française • 20 Sept
                    </Typography>
                  </CardContent>
                </Card> */}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Section des avantages */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#111827', mb: 2 }}>
            Pourquoi choisir Book My Event ?
          </Typography>
          <Typography variant="body1" sx={{ color: '#6b7280', maxWidth: '600px', mx: 'auto' }}>
            Une plateforme moderne et sécurisée pour tous vos besoins en billetterie
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ 
                background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                borderRadius: '50%',
                width: 80,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <Search sx={{ color: 'white', fontSize: '2rem' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Recherche facile
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trouvez rapidement l'événement parfait grâce à notre système de recherche avancé
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ 
                background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                borderRadius: '50%',
                width: 80,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <ConfirmationNumber sx={{ color: 'white', fontSize: '2rem' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Réservation sécurisée
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Paiement 100% sécurisé et billets électroniques instantanés
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ 
                background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                borderRadius: '50%',
                width: 80,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <Event sx={{ color: 'white', fontSize: '2rem' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Large sélection
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Des milliers d'événements dans toute la France, pour tous les goûts
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;

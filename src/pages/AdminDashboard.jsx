import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Button,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard,
  Event,
  BookOnline,
  Add,
  Logout,
  People,
  Euro,
  EventAvailable,
} from '@mui/icons-material';
import AddEventForm from '../components/AddEventForm';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [role, setRole] = useState(null);

  // États pour les réservations
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [errorReservations, setErrorReservations] = useState(null);

  // États pour les événements
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [errorEvents, setErrorEvents] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("userData");
    const parsedRole = storedRole ? JSON.parse(storedRole) : {};
    setRole(parsedRole.role || "client");
  }, []);

  // Récupération des réservations (toujours)
  useEffect(() => {
    const fetchReservations = async () => {
      setLoadingReservations(true);
      setErrorReservations(null);
      try {
        const token = localStorage.getItem("authToken");

        const response = await fetch('http://localhost:3000/api/reservations', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des réservations');
        }
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        setErrorReservations(error.message);
      } finally {
        setLoadingReservations(false);
      }
    };

    fetchReservations();
  }, []);

  // Récupération des événements (seulement si organisateur ou admin)
  useEffect(() => {
    if (role === "organisateur" || role === "admin") {
      const fetchEvents = async () => {
        setLoadingEvents(true);
        setErrorEvents(null);
        try {
          const token = localStorage.getItem("authToken");
         
          const response = await fetch('http://localhost:3000/api/events/my', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération des événements');
          }
          const data = await response.json();
          setEvents(data);
        } catch (error) {
          setErrorEvents(error.message);
        } finally {
          setLoadingEvents(false);
        }
      };

      fetchEvents();
    }
  }, [role]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const statsData = [
    {
      title: 'Événements',
      value: '12',
      icon: <EventAvailable />,
      color: '#3b82f6',
      change: '+3 ce mois',
    },
    {
      title: 'Réservations',
      value: '248',
      icon: <People />,
      color: '#10b981',
      change: '+12% vs mois dernier',
    },
    {
      title: 'Chiffre d\'affaires',
      value: '15,420€',
      icon: <Euro />,
      color: '#f59e0b',
      change: '+8.2% vs mois dernier',
    },
  ];

  // Détermine les onglets à afficher selon le rôle
  const tabs = [];
  if (role !== "client") {
    tabs.push({
      label: "Gestion des événements",
      icon: <Event />,
    });
  }
  tabs.push({
    label: "Réservations",
    icon: <BookOnline />,
  });

  // Calcul de l'index du tab "Réservations" selon le rôle
  const reservationsTabIndex = role !== "client" ? 1 : 0;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <Paper elevation={0} sx={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ backgroundColor: '#3b82f6' }}>
                <Dashboard />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Dashboard 
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Gérez vos événements et réservations
                </Typography>
              </Box>
            </Box>
            {/* <Button
              variant="outlined"
              startIcon={<Logout />}
              sx={{
                borderColor: '#e2e8f0',
                color: '#64748b',
                '&:hover': {
                  borderColor: '#dc2626',
                  color: '#dc2626',
                  backgroundColor: '#fef2f2',
                },
              }}
            >
              Déconnexion
            </Button> */}
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsData.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Avatar sx={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                      {stat.icon}
                    </Avatar>
                  </Box>
                  <Chip
                    label={stat.change}
                    size="small"
                    sx={{
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      fontSize: '0.75rem',
                      height: '24px',
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Navigation Tabs */}
        <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              '& .MuiTab-root': {
                minHeight: '56px',
                fontWeight: 500,
              },
            }}
          >
            {tabs.map((tab, idx) => (
              <Tab
                key={tab.label}
                icon={tab.icon}
                label={tab.label}
                iconPosition="start"
              />
            ))}
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            {/* Gestion des événements */}
            {role !== "client" && activeTab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    Événements
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setShowAddEvent(true)}
                    sx={{
                      backgroundColor: '#3b82f6',
                      borderRadius: '8px',
                      px: 3,
                      '&:hover': {
                        backgroundColor: '#2563eb',
                      },
                    }}
                  >
                    Ajouter un événement
                  </Button>
                </Box>

                {showAddEvent && (
                  <Box sx={{ mt: 3 }}>
                    <AddEventForm onClose={() => setShowAddEvent(false)} />
                  </Box>
                )}

                {/* Liste des événements */}
                {!showAddEvent && (
  loadingEvents ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
      <CircularProgress />
    </Box>
  ) : errorEvents ? (
    <Paper sx={{ p: 4, backgroundColor: '#fef2f2', color: '#dc2626' }}>
      {errorEvents}
    </Paper>
  ) : events && events.length > 0 ? (
    <Box>
      {events.map((event, idx) => (
        <Paper
          key={event._id || idx}
          elevation={1}
          sx={{
            mb: 2,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            backgroundColor: '#fff',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {event.name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            {event.description}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Catégorie : {event.category}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Date : {new Date(event.startDate).toLocaleString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Lieu : {event.location?.name} — {event.location?.address?.street}, {event.location?.address?.city}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Capacité totale : {event.totalCapacity}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Statut : {event.status}
          </Typography>
        </Paper>
      ))}
    </Box>
  ) : (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: 'center',
        border: '2px dashed #e2e8f0',
        borderRadius: 2,
        backgroundColor: '#f8fafc'
      }}
    >
      <Typography variant="body1" sx={{ color: '#64748b' }}>
        Aucun événement pour le moment.
      </Typography>
      <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
        Cliquez sur "Ajouter un événement" pour créer votre premier événement.
      </Typography>
    </Paper>
  )
)}

              </Box>
            )}

            {/* Réservations */}
            {activeTab === reservationsTabIndex && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                  Réservations
                </Typography>
                {loadingReservations ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                    <CircularProgress />
                  </Box>
                ) : errorReservations ? (
                  <Paper sx={{ p: 4, backgroundColor: '#fef2f2', color: '#dc2626' }}>
                    {errorReservations}
                  </Paper>
                ) : reservations && reservations.length > 0 ? (
                  <Box>
                    {reservations.map((reservation, idx) => (
                      <Paper
                        key={reservation.id || idx}
                        elevation={1}
                        sx={{
                          mb: 2,
                          p: 3,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          backgroundColor: '#fff',
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {reservation.nomClient} — {reservation.eventTitle}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          Date : {reservation.date}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          Statut : {reservation.statut}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                ) : (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      border: '2px dashed #e2e8f0',
                      borderRadius: 2,
                      backgroundColor: '#f8fafc'
                    }}
                  >
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                      Aucune réservation pour le moment.
                    </Typography>
                  </Paper>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminDashboard;

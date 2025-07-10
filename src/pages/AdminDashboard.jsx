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
  Menu,
  MenuItem,
  IconButton,
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
  Edit,
  MoreVert, // Icône pour le menu de statut
  Circle, // Pour les indicateurs de statut
} from '@mui/icons-material';
import AddEventForm from '../components/AddEventForm';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [role, setRole] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // **NOUVEAUX ÉTATS pour le menu de statut**
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [selectedEventForStatus, setSelectedEventForStatus] = useState(null);
  const [loadingStatusUpdate, setLoadingStatusUpdate] = useState(false);

  // États pour les réservations
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [errorReservations, setErrorReservations] = useState(null);

  // États pour les événements
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [errorEvents, setErrorEvents] = useState(null);

  // **CONFIGURATION DES STATUTS**
  const statusOptions = [
    { value: 'brouillon', label: 'Brouillon', color: '#64748b' },
    { value: 'publié', label: 'Publié', color: '#10b981' },
    { value: 'annulé', label: 'Annulé', color: '#ef4444' },
    { value: 'complet', label: 'Complet', color: '#f59e0b' },
    { value: 'terminé', label: 'Terminé', color: '#6b7280' }
  ];

  // **FONCTION pour obtenir la couleur du statut**
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : '#64748b';
  };

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

  // Fonction pour récupérer un événement par ID
  const fetchEventById = async (eventId) => {
    try {
      const token = localStorage.getItem("authToken");
      
      const response = await fetch(`http://localhost:3000/api/events/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'événement');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  // **NOUVELLE FONCTION pour modifier le statut**
  const updateEventStatus = async (eventId, newStatus) => {
    setLoadingStatusUpdate(true);
    try {
      const token = localStorage.getItem("authToken");
      
      const response = await fetch(`http://localhost:3000/api/events/${eventId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du statut');
      }

      const result = await response.json();
      
      // Mettre à jour la liste des événements
      await fetchEvents();
      
      // Notification de succès
      alert(`Statut de l'événement mis à jour vers "${newStatus}"`);
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setLoadingStatusUpdate(false);
      setStatusMenuAnchor(null);
      setSelectedEventForStatus(null);
    }
  };

  // **FONCTIONS pour gérer le menu de statut**
  const handleStatusMenuOpen = (event, eventData) => {
    setStatusMenuAnchor(event.currentTarget);
    setSelectedEventForStatus(eventData);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchor(null);
    setSelectedEventForStatus(null);
  };

  const handleStatusChange = (newStatus) => {
    if (selectedEventForStatus) {
      updateEventStatus(selectedEventForStatus._id, newStatus);
    }
  };

  // Fonction pour gérer l'édition d'un événement
  const handleEditEvent = async (eventId) => {
    try {
      const eventData = await fetchEventById(eventId);
      setSelectedEvent(eventData);
      setShowAddEvent(true);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'événement:', error);
    }
  };

  // Fonction pour fermer le modal et réinitialiser
  const handleCloseModal = () => {
    setShowAddEvent(false);
    setSelectedEvent(null);
    fetchEvents();
  };

  useEffect(() => {
    if (role === "organisateur" || role === "admin") {
      fetchEvents();
    }
  }, [role]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const statsData = [
    {
      title: 'Événements',
      value: events?.count,
      icon: <EventAvailable />,
      color: '#3b82f6',
      change: '0% vs mois dernier',
    },
    {
      title: 'Réservations',
      value: reservations?.count,
      icon: <People />,
      color: '#10b981',
      change: '+12% vs mois dernier',
    },
    // {
    //   title: 'Chiffre d\'affaires',
    //   value: '15,420€',
    //   icon: <Euro />,
    //   color: '#f59e0b',
    //   change: '+8.2% vs mois dernier',
    // },
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
                    onClick={() => {
                      setSelectedEvent(null);
                      setShowAddEvent(true);
                    }}
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
                    <AddEventForm 
                      onClose={handleCloseModal}
                      eventData={selectedEvent}
                    />
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
                  ) : events && events?.events?.length > 0 ? (
                    <Box>
                      {events.events.map((event, idx) => (
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
                          {/* **SECTION MODIFIÉE : Header avec boutons d'action** */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {event.name}
                              </Typography>
                              {/* **NOUVEAU : Chip de statut avec couleur** */}
                              <Chip
                                icon={<Circle sx={{ fontSize: '12px !important' }} />}
                                label={event.status}
                                size="small"
                                sx={{
                                  backgroundColor: `${getStatusColor(event.status)}15`,
                                  color: getStatusColor(event.status),
                                  fontWeight: 500,
                                  '& .MuiChip-icon': {
                                    color: getStatusColor(event.status)
                                  }
                                }}
                              />
                            </Box>
                            
                            {/* **SECTION MODIFIÉE : Boutons d'action** */}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                variant="outlined"
                                startIcon={<Edit />}
                                onClick={() => handleEditEvent(event._id)}
                                sx={{
                                  borderColor: '#3b82f6',
                                  color: '#3b82f6',
                                  '&:hover': {
                                    backgroundColor: '#eff6ff',
                                    borderColor: '#2563eb',
                                  },
                                }}
                              >
                                Modifier
                              </Button>
                              
                              {/* **NOUVEAU : Bouton de modification du statut** */}
                              <IconButton
                                onClick={(e) => handleStatusMenuOpen(e, event)}
                                disabled={loadingStatusUpdate}
                                sx={{
                                  border: '1px solid #e2e8f0',
                                  borderRadius: 1,
                                  color: '#64748b',
                                  '&:hover': {
                                    backgroundColor: '#f8fafc',
                                    borderColor: '#d1d5db',
                                  },
                                }}
                              >
                                <MoreVert />
                              </IconButton>
                            </Box>
                          </Box>
                          
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
    ) : reservations?.data && reservations.data.length > 0 ? (
      <Box>
        <Typography variant="body2" sx={{ mb: 3, color: '#64748b' }}>
          {reservations.count} réservation(s) trouvée(s)
        </Typography>
        {reservations.data.map((reservation, idx) => (
          <Paper
            key={reservation._id || idx}
            elevation={1}
            sx={{
              mb: 2,
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 2,
            }}
          >
            {/* En-tête de la réservation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Réservation #{reservation.reservationNumber}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                  {reservation.event?.location?.name || 'Lieu non spécifié'}
                </Typography>
              </Box>
              <Chip 
                label={reservation.status} 
                color={reservation.status === 'confirmée' ? 'success' : 'default'}
                size="small"
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>

            {/* Informations sur l'événement */}
            <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" sx={{ color: '#475569', mb: 1 }}>
                <strong>Date de l'événement :</strong> {' '}
                {new Date(reservation.event?.startDate).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569' }}>
                <strong>Lieu :</strong> {' '}
                {reservation.event?.location?.name}, {reservation.event?.location?.address?.city} ({reservation.event?.location?.address?.postalCode})
              </Typography>
            </Box>

            {/* Détails des billets */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#374151' }}>
                Billets ({reservation.tickets?.length || 0})
              </Typography>
              {reservation.tickets?.map((ticket, ticketIdx) => (
                <Box 
                  key={ticket._id || ticketIdx}
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    py: 1,
                    px: 2,
                    bgcolor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 1,
                    mb: 1
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {ticket.ticketType?.name || 'Billet'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280' }}>
                      {ticket.ticketNumber}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: ticket.currency || 'EUR',
                      }).format(ticket.price)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: ticket.isUsed ? '#dc2626' : '#059669' }}>
                      {ticket.isUsed ? 'Utilisé' : 'Valide'}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Total et informations de réservation */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              pt: 2,
              borderTop: '1px solid #e5e7eb'
            }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Réservé le {new Date(reservation.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Total : {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: reservation.currency || 'EUR',
                  }).format(reservation.totalAmount)}
                </Typography>
              </Box>
            </Box>
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

        {/* **NOUVEAU : Menu pour changer le statut** */}
        <Menu
          anchorEl={statusMenuAnchor}
          open={Boolean(statusMenuAnchor)}
          onClose={handleStatusMenuClose}
          PaperProps={{
            sx: {
              minWidth: '200px',
              mt: 1,
            }
          }}
        >
          <MenuItem disabled sx={{ fontWeight: 600, color: '#374151' }}>
            Changer le statut
          </MenuItem>
          {statusOptions.map((status) => (
            <MenuItem
              key={status.value}
              onClick={() => handleStatusChange(status.value)}
              disabled={selectedEventForStatus?.status === status.value || loadingStatusUpdate}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 1,
              }}
            >
              <Circle 
                sx={{ 
                  fontSize: '12px', 
                  color: status.color 
                }} 
              />
              <Typography variant="body2">
                {status.label}
              </Typography>
              {selectedEventForStatus?.status === status.value && (
                <Typography variant="caption" sx={{ ml: 'auto', color: '#64748b' }}>
                  (actuel)
                </Typography>
              )}
            </MenuItem>
          ))}
        </Menu>
      </Container>
    </Box>
  );
};

export default AdminDashboard;

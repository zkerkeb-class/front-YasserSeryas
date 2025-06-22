import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { Home, Event } from '@mui/icons-material';
import EventFilters from '../components/EventFilters';
import EventList from '../components/EventList.jsx';

const EventsPage = () => {
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    dateRange: '',
    priceRange: [0, 200],
  });

  return (
    <Box className="min-h-screen bg-gray-50">
      <Container maxWidth="xl" className="py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs className="mb-6">
          <Link
            underline="hover"
            color="inherit"
            href="#"
            className="flex items-center"
          >
            <Home className="mr-1" fontSize="small" />
            Accueil
          </Link>
          <Typography color="text.primary" className="flex items-center">
            <Event className="mr-1" fontSize="small" />
            Événements
          </Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box className="text-center mb-8">
          <Typography
            variant="h3"
            component="h1"
            className="font-bold text-gray-900 mb-4"
          >
            Tous les événements
          </Typography>
          <Typography
            variant="h6"
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Explorez notre catalogue complet d'événements et trouvez celui qui vous correspond
          </Typography>
        </Box>

        {/* Content */}
        <Grid container spacing={4}>
          <Grid item xs={12} lg={3}>
            <EventFilters filters={filters} setFilters={setFilters} />
          </Grid>
          <Grid item xs={12} lg={9}>
            <EventList filters={filters} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EventsPage;

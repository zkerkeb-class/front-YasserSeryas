import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  Paper,
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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            underline="hover"
            color="inherit"
            href="#"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="small" />
            Accueil
          </Link>
          <Typography 
            color="text.primary" 
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Event sx={{ mr: 0.5 }} fontSize="small" />
            Événements
          </Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 600,
              color: '#111827',
              mb: 2,
              fontSize: { xs: '1.75rem', md: '2rem' }
            }}
          >
            Tous les événements
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#6b7280',
              maxWidth: '600px',
              mx: 'auto',
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}
          >
            Explorez notre catalogue complet d'événements et trouvez celui qui vous correspond
          </Typography>
        </Box>

        {/* Content avec Flexbox */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          alignItems: 'flex-start'
        }}>
          {/* Sidebar Filters */}
          <Box sx={{ 
            width: { xs: '100%', md: '300px' },
            flexShrink: 0,
            position: { md: 'sticky' },
            top: { md: 20 }
          }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 2,
                border: '1px solid #e5e7eb',
                backgroundColor: '#ffffff'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 600,
                  color: '#374151'
                }}
              >
                Filtres
              </Typography>
              <EventFilters filters={filters} setFilters={setFilters} />
            </Paper>
          </Box>

          {/* Main Content */}
          <Box sx={{ 
            flex: 1,
            width: { xs: '100%', md: 'calc(100% - 300px - 24px)' },
            minHeight: '500px'
          }}>
            <EventList filters={filters} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default EventsPage;

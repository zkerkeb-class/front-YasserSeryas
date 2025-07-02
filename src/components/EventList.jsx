import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Chip } from '@mui/material';
const categoryImages = {
  concert: [
    'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
  ],
  sport: [
    'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    'https://images.pexels.com/photos/209841/pexels-photo-209841.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
  ],
  conference: [
    'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
  ],
  festival: [
    'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    'https://images.pexels.com/photos/1540338/pexels-photo-1540338.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'
  ]
};


function getRandomImage(category) {
  const images = categoryImages[category] || ['https://source.unsplash.com/800x400/?event'];
  return images[Math.floor(Math.random() * images.length)];
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
}

function formatHour(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function getPrice(event) {
  if (event.minPrice === null || event.minPrice === undefined) return 'Gratuit';
  return `${event.minPrice} ${event.currency || '€'}`;
}

const EventList = ({ filters }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Construire la query string pour les filtres
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.location) params.append('location', filters.location);
    if (filters.dateRange) {
      const [start, end] = filters.dateRange.split(' - ');
      if (start) params.append('startDate_gte', start);
      if (end) params.append('endDate_lte', end);
    }
    if (filters.priceRange && filters.priceRange[0] > 0) {
      params.append('minPrice_gte', filters.priceRange[0]);
    }
    if (filters.priceRange && filters.priceRange[1] < 200) {
      params.append('minPrice_lte', filters.priceRange[1]);
    }

    fetch(`http://localhost:3000/api/events/?${params.toString()}`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(() => setEvents([]));
  }, [filters]);

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {events.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          Aucun événement trouvé pour ces critères.
        </Typography>
      ) : (
        events.map(event => (
          <Card key={event._id} sx={{ display: 'flex', alignItems: 'stretch', mb: 2 }} onClick={() => window.location.href = `/events/${event._id}`}>
            <CardMedia
              component="img"
              sx={{ width: 220, height: 140, objectFit: 'cover' }}
              image={getRandomImage(event.category)}
              alt={event.category}
            />
            <CardContent sx={{ flex: 1 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {event.name}
                </Typography>
                <Chip label={event.category} color="primary" size="small" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                <strong>Date :</strong> {formatDate(event.startDate)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Heure :</strong> {formatHour(event.startDate)} - {formatHour(event.endDate)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Lieu :</strong> {event.location?.name}, {event.location?.address?.city}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Prix :</strong> {getPrice(event)}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default EventList;

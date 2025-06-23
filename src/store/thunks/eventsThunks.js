import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchEventsStart,
  fetchEventsSuccess,
  fetchEventsFailure,
  fetchFeaturedEventsSuccess,
} from '../slices/eventsSlice';
import { showSnackbar } from '../slices/uiSlice';

// Mock données d'événements
const mockEvents = [
  {
    id: 1,
    title: 'Concert de Jazz Fusion',
    description: 'Une soirée exceptionnelle avec les meilleurs artistes de jazz fusion',
    date: '2025-07-15T20:00:00Z',
    location: 'Salle Pleyel, Paris',
    price: 45,
    category: 'Musique',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
    organizer: 'Jazz Events',
    availableTickets: 150,
    featured: true,
  },
  {
    id: 2,
    title: 'Conférence Tech Innovation 2025',
    description: 'Les dernières tendances en technologie et innovation',
    date: '2025-08-10T09:00:00Z',
    location: 'Palais des Congrès, Lyon',
    price: 120,
    category: 'Technologie',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500',
    organizer: 'TechConf',
    availableTickets: 300,
    featured: true,
  },
  {
    id: 3,
    title: 'Festival Gastronomique',
    description: 'Découvrez les saveurs du monde avec des chefs renommés',
    date: '2025-09-05T12:00:00Z',
    location: 'Parc des Expositions, Marseille',
    price: 35,
    category: 'Gastronomie',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500',
    organizer: 'Gastro Events',
    availableTickets: 200,
    featured: false,
  },
  {
    id: 4,
    title: 'Exposition d\'Art Contemporain',
    description: 'Une collection exceptionnelle d\'œuvres contemporaines',
    date: '2025-07-20T10:00:00Z',
    location: 'Musée d\'Art Moderne, Paris',
    price: 18,
    category: 'Art',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
    organizer: 'Art Gallery',
    availableTickets: 100,
    featured: true,
  },
  {
    id: 5,
    title: 'Marathon de Paris 2025',
    description: 'Participez au plus grand marathon de France',
    date: '2025-10-15T08:00:00Z',
    location: 'Champs-Élysées, Paris',
    price: 85,
    category: 'Sport',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
    organizer: 'Paris Marathon',
    availableTickets: 1000,
    featured: false,
  },
];

// Mock API
const eventsAPI = {
  fetchEvents: async (filters = {}, page = 1, limit = 10) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredEvents = [...mockEvents];
    
    // Appliquer les filtres
    if (filters.search) {
      filteredEvents = filteredEvents.filter(event =>
        event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.category) {
      filteredEvents = filteredEvents.filter(event =>
        event.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    if (filters.location) {
      filteredEvents = filteredEvents.filter(event =>
        event.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.priceRange) {
      filteredEvents = filteredEvents.filter(event =>
        event.price >= filters.priceRange[0] && event.price <= filters.priceRange[1]
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);
    
    return {
      events: paginatedEvents,
      totalCount: filteredEvents.length,
      hasNextPage: endIndex < filteredEvents.length,
      currentPage: page,
    };
  },
  
  fetchFeaturedEvents: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockEvents.filter(event => event.featured);
  },
  
  fetchEventById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const event = mockEvents.find(event => event.id === parseInt(id));
    if (!event) {
      throw new Error('Événement non trouvé');
    }
    return event;
  },
};

// Thunk pour récupérer les événements
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async ({ filters, page = 1 }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchEventsStart());
      const result = await eventsAPI.fetchEvents(filters, page);
      dispatch(fetchEventsSuccess({
        events: result.events,
        page: result.currentPage,
        hasNextPage: result.hasNextPage,
      }));
      return result;
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors du chargement des événements';
      dispatch(fetchEventsFailure(errorMessage));
      dispatch(showSnackbar({
        message: errorMessage,
        severity: 'error'
      }));
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk pour récupérer les événements mis en avant
export const fetchFeaturedEvents = createAsyncThunk(
  'events/fetchFeaturedEvents',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const featuredEvents = await eventsAPI.fetchFeaturedEvents();
      dispatch(fetchFeaturedEventsSuccess(featuredEvents));
      return featuredEvents;
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors du chargement des événements mis en avant';
      dispatch(showSnackbar({
        message: errorMessage,
        severity: 'error'
      }));
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk pour récupérer un événement par ID
export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (eventId, { dispatch, rejectWithValue }) => {
    try {
      const event = await eventsAPI.fetchEventById(eventId);
      return event;
    } catch (error) {
      const errorMessage = error.message || 'Événement non trouvé';
      dispatch(showSnackbar({
        message: errorMessage,
        severity: 'error'
      }));
      return rejectWithValue(errorMessage);
    }
  }
);

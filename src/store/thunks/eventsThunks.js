import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchEventsStart,
  fetchEventsSuccess,
  fetchEventsFailure,
  fetchFeaturedEventsSuccess,
  setCurrentEvent,
  setConfirmationNumber,
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
      dispatch(fetchEventsStart());
      
      // Essayer d'abord l'API réelle avec les données de pricing
      try {
        const response = await fetch(`http://localhost:3000/api/events/${eventId}/pricing`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          // Adapter les données selon le format de votre API avec pricing
          const eventData = {
            _id: data._id,
            name: data.name,
            description: data.description,
            category: data.category,
            startDate: data.startDate,
            endDate: data.endDate,
            location: data.location,
            organizer: data.organizer,
            images: data.images || [],
            totalCapacity: data.totalCapacity,
            remainingCapacity: data.remainingCapacity,
            status: data.status,
            isPublic: data.isPublic,
            tags: data.tags || [],
            ticketTypes: data.ticketTypes || [],
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            
            // Intégration des données de pricing
            pricing: data.pricing || {
              minPrice: data.ticketTypes?.[0]?.price || 0,
              maxPrice: data.ticketTypes?.reduce((max, ticket) => 
                Math.max(max, ticket.price || 0), 0) || 0,
              avgPrice: data.ticketTypes?.length > 0 ? 
                data.ticketTypes.reduce((sum, ticket) => sum + (ticket.price || 0), 0) / data.ticketTypes.length : 0,
              currency: data.ticketTypes?.[0]?.currency || 'EUR',
              totalAvailableTickets: data.ticketTypes?.reduce((sum, ticket) => 
                sum + (ticket.quantity || 0), 0) || 0,
              ticketTypes: data.ticketTypes || []
            },
            
            // Propriétés adaptées pour la compatibilité avec l'interface existante
            id: data._id,
            title: data.name,
            date: data.startDate,
            price: data.pricing?.minPrice || data.ticketTypes?.[0]?.price || null,
            image: data.images?.[0] || null,
            availableTickets: data.pricing?.totalAvailableTickets || data.remainingCapacity,
            featured: data.featured || false,
            
            // Informations sur l'organisateur formatées
            organizerName: data.organizer ? 
              `${data.organizer.firstName} ${data.organizer.lastName}` : 
              'Non spécifié',
            organizerEmail: data.organizer?.email,
            
            // Informations sur la localisation formatées
            venue: data.location?.name,
            address: data.location?.address ? 
              `${data.location.address.street}, ${data.location.address.city} ${data.location.address.postalCode}` : 
              null,
            city: data.location?.address?.city,
            postalCode: data.location?.address?.postalCode,
            country: data.location?.address?.country,
          };

          dispatch(setCurrentEvent(eventData));
          return eventData;
        }
      } catch (apiError) {
        console.log('API non disponible, utilisation des données mock:', apiError.message);
      }
      
      // Fallback vers les données mock
      const event = await eventsAPI.fetchEventById(eventId);
      if (!event) {
        throw new Error('Événement non trouvé');
      }
      
      // Ajouter des données fictives supplémentaires spécifiques au concert de Chris Brown
      const enhancedEvent = {
        ...event,
        longDescription: event.description + "\n\nVivez une expérience musicale exceptionnelle avec Chris Brown dans le cadre de sa tournée mondiale 'Breezy Bowl XX'. Ce concert anniversaire célèbre 20 ans de carrière avec des performances époustouflantes, des chorégraphies spectaculaires et des invités de prestige comme Summer Walker et Bryson Tiller.",
        
        duration: "3h30 avec entracte",
        
        // Programme adapté pour le concert de Chris Brown
        agenda: [
          { 
            time: "18:30", 
            title: "Ouverture des portes", 
            description: "Accueil du public et vérification des billets" 
          },
          { 
            time: "19:30", 
            title: "Première partie - Bryson Tiller", 
            description: "Performance de 45 minutes de l'artiste R&B" 
          },
          { 
            time: "20:30", 
            title: "Summer Walker", 
            description: "Set de 45 minutes de la sensation R&B" 
          },
          { 
            time: "21:30", 
            title: "Entracte", 
            description: "Pause de 30 minutes - Bar ouvert" 
          },
          { 
            time: "22:00", 
            title: "Chris Brown - Breezy Bowl XX", 
            description: "Concert principal de 90 minutes avec les plus grands hits" 
          },
          { 
            time: "23:30", 
            title: "Rappel et final", 
            description: "Dernières performances et remerciements" 
          },
        ],
        
        // Artistes et intervenants pour le concert
        speakers: [
          { 
            name: "Chris Brown", 
            title: "Artiste Principal", 
            company: "RCA Records", 
            photo: "https://i.pravatar.cc/150?img=10" 
          },
          { 
            name: "Summer Walker", 
            title: "Artiste Invitée", 
            company: "LVRN/Interscope", 
            photo: "https://i.pravatar.cc/150?img=11" 
          },
          { 
            name: "Bryson Tiller", 
            title: "Artiste Invité", 
            company: "RCA Records", 
            photo: "https://i.pravatar.cc/150?img=12" 
          },
        ],
        
        // Tags spécifiques au concert R&B
        tags: ["R&B", "Pop", "Hip-Hop", "Concert", "Chris Brown", "Tournée", "Anniversaire"],
        
        // Informations pratiques pour le concert
        requirements: [
          "Billet obligatoire - contrôle à l'entrée",
          "Interdiction des appareils photo/vidéo professionnels",
          "Vestiaire payant disponible",
          "Bar et restauration sur place",
          "Accès PMR - places réservées"
        ],
        
        // Informations supplémentaires pour le concert
        practicalInfo: {
          parking: "Parking payant à proximité - 15€",
          catering: "Bar et snacks disponibles",
          accessibility: "Accès PMR avec places dédiées",
          weather: "Événement en intérieur",
          security: "Contrôle de sécurité obligatoire",
          ageLimit: "Tout âge - mineurs accompagnés"
        },
        
        // Structure de pricing complète pour le concert
        pricing: {
          minPrice: 25,
          maxPrice: 150,
          avgPrice: 75,
          currency: "EUR",
          totalAvailableTickets: 100,
          ticketTypes: [
            {
              _id: "std_ticket_001",
              name: "Standard",
              description: "Billet d'accès standard - Placement libre debout",
              price: 25,
              currency: "EUR",
              quantity: 40,
              initialQuantity: 50,
              maxPerPurchase: 10,
              isAvailable: true,
              saleStartDate: new Date().toISOString(),
              saleEndDate: event.endDate || new Date(Date.now() + 86400000).toISOString(),
              benefits: ["Accès au concert", "Accès aux bars"]
            },
            {
              _id: "premium_ticket_001",
              name: "Premium",
              description: "Places assises numérotées - Vue optimale",
              price: 75,
              currency: "EUR",
              quantity: 30,
              initialQuantity: 40,
              maxPerPurchase: 8,
              isAvailable: true,
              saleStartDate: new Date().toISOString(),
              saleEndDate: event.endDate || new Date(Date.now() + 86400000).toISOString(),
              benefits: ["Places assises", "Accès prioritaire", "Programme collector"]
            },
            {
              _id: "vip_ticket_001",
              name: "VIP Experience",
              description: "Expérience VIP complète avec meet & greet",
              price: 150,
              currency: "EUR",
              quantity: 30,
              initialQuantity: 10,
              maxPerPurchase: 4,
              isAvailable: true,
              saleStartDate: new Date().toISOString(),
              saleEndDate: event.endDate || new Date(Date.now() + 86400000).toISOString(),
              benefits: [
                "Places VIP front stage",
                "Meet & greet avec Chris Brown",
                "Photo souvenir",
                "Merchandise exclusif",
                "Accès lounge VIP",
                "Boissons incluses"
              ]
            }
          ]
        },
        
        // Types de billets avec structure enrichie
        ticketTypes: [
          {
            name: "Standard",
            description: "Billet d'accès standard - Placement libre debout",
            price: 25,
            available: true,
            quantity: 40,
            maxPerPurchase: 10,
            benefits: ["Accès au concert", "Accès aux bars"]
          },
          {
            name: "Premium",
            description: "Places assises numérotées - Vue optimale",
            price: 75,
            available: true,
            quantity: 30,
            maxPerPurchase: 8,
            benefits: ["Places assises", "Accès prioritaire", "Programme collector"]
          },
          {
            name: "VIP Experience",
            description: "Expérience VIP complète avec meet & greet",
            price: 150,
            available: true,
            quantity: 30,
            maxPerPurchase: 4,
            benefits: [
              "Places VIP front stage",
              "Meet & greet avec Chris Brown",
              "Photo souvenir",
              "Merchandise exclusif",
              "Accès lounge VIP",
              "Boissons incluses"
            ]
          }
        ],
      };
      
      dispatch(setCurrentEvent(enhancedEvent));
      return enhancedEvent;
      
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'événement:', error);
      
      const errorMessage = error.message || 'Erreur lors de la récupération de l\'événement';
      dispatch(showSnackbar({
        message: errorMessage,
        severity: 'error'
      }));
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk pour créer une réservation
export const createReservation = createAsyncThunk(
  'events/createReservation',
  async (reservationData, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Vous devez être connecté pour effectuer une réservation');
        } else if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Données de réservation invalides');
        } else if (response.status === 404) {
          throw new Error('Événement non trouvé');
        } else if (response.status === 409) {
          throw new Error('Plus de places disponibles pour cet événement');
        } else {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
      }

      const responseData = await response.json();
      console.log('Réponse de réservation:', responseData);

      // Extraire le numéro de réservation depuis la réponse
      const reservationNumber = responseData.data?.reservationNumber || responseData.summary?.reservationNumber;
      
      if (reservationNumber) {
        // Sauvegarder le numéro de confirmation dans le store
        dispatch(setConfirmationNumber(reservationNumber));
      }

      // Afficher un message de succès
      dispatch(showSnackbar({
        message: 'Réservation créée avec succès !',
        severity: 'success'
      }));

      // Retourner toutes les données de la réservation
      return {
        reservationNumber,
        reservationData: responseData.data,
        summary: responseData.summary,
        tickets: responseData.data?.tickets || [],
        totalAmount: responseData.data?.totalAmount || responseData.summary?.totalAmount,
      };
      
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      
      const errorMessage = error.message || 'Erreur lors de la création de la réservation';
      dispatch(showSnackbar({
        message: errorMessage,
        severity: 'error'
      }));
      
      return rejectWithValue(errorMessage);
    }
  }
);



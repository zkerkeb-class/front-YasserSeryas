import React, { useState, useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  Rating,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Select,
  FormControl,
  InputLabel,
  Badge,
} from '@mui/material';
import {
  LocationOn,
  CalendarToday,
  AccessTime,
  Person,
  Favorite,
  Share,
  MoreVert,
  ViewModule,
  ViewList,
  Sort,
  LocalOffer,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const EventList = ({ filters }) => {
  const navigate = useNavigate();
  const [events] = useState([
    {
      id: 1,
      title: "Concert Jazz Fusion",
      date: "2025-07-10",
      time: "20:00",
      location: "Blue Note, Paris",
      category: "Concert",
      price: "40€",
      originalPrice: "55€",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      rating: 4.7,
      attendees: 150,
      artist: "Jazz Collective",
      description: "Une soirée de jazz fusion avec les meilleurs musiciens",
      accessibility: true,
      parking: true,
    },
    {
      id: 2,
      title: "Conférence Tech Innovation",
      date: "2025-07-25",
      time: "14:00",
      location: "Centre des Congrès, Lyon",
      category: "Conférence",
      price: "25€",
      originalPrice: "35€",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      attendees: 300,
      artist: "Tech Leaders",
      description: "Les dernières innovations dans le monde de la tech",
      accessibility: true,
      parking: false,
    },
    {
      id: 3,
      title: "Spectacle de Danse Contemporaine",
      date: "2025-08-05",
      time: "19:30",
      location: "Opéra Bastille, Paris",
      category: "Danse",
      price: "65€",
      originalPrice: "80€",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      rating: 4.8,
      attendees: 800,
      artist: "Compagnie Moderne",
      description: "Un spectacle de danse contemporaine époustouflant",
      accessibility: true,
      parking: true,
    },
    {
      id: 4,
      title: "Festival Électro",
      date: "2025-08-15",
      time: "18:00",
      location: "Parc des Expositions, Marseille",
      category: "Festival",
      price: "89€",
      originalPrice: "120€",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      rating: 4.6,
      attendees: 2000,
      artist: "DJ Collective",
      description: "Le plus grand festival électro de la région",
      accessibility: false,
      parking: true,
    },
  ]);

  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const eventsPerPage = 6;

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter(event => {
      if (filters.category && event.category !== filters.category) return false;
      if (filters.location && !event.location.includes(filters.location)) return false;
      if (filters.accessibility && !event.accessibility) return false;
      if (filters.parking && !event.parking) return false;
      
      const eventPrice = parseInt(event.price.replace('€', ''));
      if (eventPrice < filters.priceRange[0] || eventPrice > filters.priceRange[1]) return false;
      
      return true;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'price':
          return parseInt(a.price.replace('€', '')) - parseInt(b.price.replace('€', ''));
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
          return b.attendees - a.attendees;
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, filters, sortBy]);

  const paginatedEvents = useMemo(() => {
    const startIndex = (page - 1) * eventsPerPage;
    return filteredAndSortedEvents.slice(startIndex, startIndex + eventsPerPage);
  }, [filteredAndSortedEvents, page]);

  const totalPages = Math.ceil(filteredAndSortedEvents.length / eventsPerPage);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      {/* Toolbar */}
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 p-4 bg-white rounded-xl shadow-sm">
        <Typography variant="h6" className="text-gray-700 mb-2 sm:mb-0">
          {filteredAndSortedEvents.length} événements trouvés
        </Typography>
        
        <Box className="flex items-center space-x-4">
          <FormControl size="small" className="min-w-32">
            <InputLabel>Trier par</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Trier par"
            >
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="price">Prix</MenuItem>
              <MenuItem value="rating">Note</MenuItem>
              <MenuItem value="popularity">Popularité</MenuItem>
            </Select>
          </FormControl>
          
          <Box className="flex border rounded-lg">
            <IconButton
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : ''}
            >
              <ViewModule />
            </IconButton>
            <IconButton
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-blue-100 text-blue-600' : ''}
            >
              <ViewList />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Events Grid */}
      <Grid container spacing={3}>
        {paginatedEvents.map((event) => (
          <Grid 
            item 
            xs={12} 
            sm={viewMode === 'grid' ? 6 : 12} 
            lg={viewMode === 'grid' ? 4 : 12} 
            key={event.id}
          >
            <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl overflow-hidden">
              {viewMode === 'grid' ? (
                <>
                  <Box className="relative">
                    <CardMedia
                      component="img"
                      height="200"
                      image={event.image}
                      alt={event.title}
                      className="h-48 object-cover"
                    />
                    <Box className="absolute top-4 left-4">
                      <Chip
                        label={event.category}
                        color="primary"
                        size="small"
                        className="bg-white/90 text-blue-600 font-semibold"
                      />
                    </Box>
                    <Box className="absolute top-4 right-4 flex space-x-1">
                      <IconButton
                        size="small"
                        className="bg-white/90 text-red-500 hover:bg-red-50"
                      >
                        <Favorite fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        className="bg-white/90 text-gray-600 hover:bg-gray-50"
                      >
                        <Share fontSize="small" />
                      </IconButton>
                    </Box>
                    {event.originalPrice && (
                      <Box className="absolute bottom-4 left-4">
                        <Chip
                          icon={<LocalOffer />}
                          label={`-${Math.round(((parseFloat(event.originalPrice.replace('€', '')) - parseFloat(event.price.replace('€', ''))) / parseFloat(event.originalPrice.replace('€', ''))) * 100)}%`}
                          color="error"
                          size="small"
                        />
                      </Box>
                    )}
                  </Box>
                  <CardContent className="p-4">
                    <Box className="flex justify-between items-start mb-2">
                      <Typography variant="h6" className="font-bold text-gray-900 line-clamp-2">
                        {event.title}
                      </Typography>
                      <Box className="flex items-center space-x-1">
                        <Rating value={event.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="body2" className="text-gray-600">
                          {event.rating}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" className="text-gray-600 mb-3 line-clamp-2">
                      {event.description}
                    </Typography>

                    <Box className="space-y-1 mb-4">
                      <Box className="flex items-center text-gray-600">
                        <CalendarToday fontSize="small" className="mr-2" />
                        <Typography variant="body2">
                          {new Date(event.date).toLocaleDateString('fr-FR')}
                        </Typography>
                        <AccessTime fontSize="small" className="ml-4 mr-1" />
                        <Typography variant="body2">{event.time}</Typography>
                      </Box>
                      <Box className="flex items-center text-gray-600">
                        <LocationOn fontSize="small" className="mr-2" />
                        <Typography variant="body2" className="line-clamp-1">
                          {event.location}
                        </Typography>
                      </Box>
                      <Box className="flex items-center text-gray-600">
                        <Person fontSize="small" className="mr-2" />
                        <Typography variant="body2">
                          {event.attendees} intéressés
                        </Typography>
                      </Box>
                    </Box>

                    <Box className="flex justify-between items-center">
                      <Box className="flex items-center space-x-2">
                        <Typography variant="h6" className="font-bold text-green-600">
                          {event.price}
                        </Typography>
                        {event.originalPrice && (
                          <Typography variant="body2" className="text-gray-500 line-through">
                            {event.originalPrice}
                          </Typography>
                        )}
                      </Box>
                      <Avatar className="w-8 h-8 bg-blue-100 text-blue-600 text-xs">
                        {event.artist.charAt(0)}
                      </Avatar>
                    </Box>
                  </CardContent>
                  <CardActions className="p-4 pt-0">
                    <Button
                     onClick={() => navigate(`/booking/${event.id}`)}
                      variant="contained"
                      fullWidth
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-2 rounded-lg"
                    >
                      Réserver
                    </Button>
                  </CardActions>
                </>
              ) : (
                <Box className="flex">
                  <CardMedia
                    component="img"
                    sx={{ width: 200 }}
                    image={event.image}
                    alt={event.title}
                    className="h-48 object-cover"
                  />
                  <Box className="flex flex-col flex-1">
                    <CardContent className="flex-1 p-4">
                      <Box className="flex justify-between items-start mb-2">
                        <Box>
                          <Typography variant="h6" className="font-bold text-gray-900 mb-1">
                            {event.title}
                          </Typography>
                          <Box className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <Box className="flex items-center">
                              <CalendarToday fontSize="small" className="mr-1" />
                              {new Date(event.date).toLocaleDateString('fr-FR')}
                            </Box>
                            <Box className="flex items-center">
                              <AccessTime fontSize="small" className="mr-1" />
                              {event.time}
                            </Box>
                            <Chip label={event.category} size="small" />
                          </Box>
                          <Box className="flex items-center text-gray-600 mb-2">
                            <LocationOn fontSize="small" className="mr-1" />
                            <Typography variant="body2">{event.location}</Typography>
                          </Box>
                          <Typography variant="body2" className="text-gray-600 line-clamp-2">
                            {event.description}
                          </Typography>
                        </Box>
                        <Box className="text-right">
                          <Box className="flex items-center space-x-1 mb-2">
                            <Rating value={event.rating} precision={0.1} size="small" readOnly />
                            <Typography variant="body2" className="text-gray-600">
                              {event.rating}
                            </Typography>
                          </Box>
                          <Box className="flex items-center space-x-2">
                            <Typography variant="h6" className="font-bold text-green-600">
                              {event.price}
                            </Typography>
                            {event.originalPrice && (
                              <Typography variant="body2" className="text-gray-500 line-through">
                                {event.originalPrice}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions className="p-4 pt-0">
                      <Button
                        variant="contained"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        Réserver
                      </Button>
                      <Box className="flex-1" />
                      <IconButton>
                        <Favorite className="text-gray-400" />
                      </IconButton>
                      <IconButton>
                        <Share className="text-gray-400" />
                      </IconButton>
                    </CardActions>
                  </Box>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box className="flex justify-center mt-8">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            size="large"
            className="bg-white rounded-lg shadow-sm p-2"
          />
        </Box>
      )}
    </Box>
  );
};

export default EventList;

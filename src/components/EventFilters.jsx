import React from 'react';
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Slider,
  Chip,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  TextField,
} from '@mui/material';
import {
  FilterList,
  Clear,
  Category,
  LocationOn,
  AttachMoney,
  CalendarToday,
  AccessTime,
} from '@mui/icons-material';

const EventFilters = ({ filters, setFilters }) => {
  const categories = [
    'Concert', 'Théâtre', 'Conférence', 'Sport', 'Festival', 'Exposition', 'Comédie', 'Danse'
  ];

  const cities = [
    'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Bordeaux', 'Lille', 'Strasbourg'
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      dateRange: '',
      priceRange: [0, 200],
      timeSlot: '',
      accessibility: false,
      parking: false,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.location) count++;
    if (filters.dateRange) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200) count++;
    if (filters.timeSlot) count++;
    if (filters.accessibility) count++;
    if (filters.parking) count++;
    return count;
  };

  return (
    <Paper className="p-6 rounded-2xl shadow-lg sticky top-24">
      <Box className="flex items-center justify-between mb-6">
        <Box className="flex items-center">
          <FilterList className="mr-2 text-gray-600" />
          <Typography variant="h6" className="font-semibold">
            Filtres
          </Typography>
          {getActiveFiltersCount() > 0 && (
            <Chip
              label={getActiveFiltersCount()}
              size="small"
              color="primary"
              className="ml-2"
            />
          )}
        </Box>
        <Button
          size="small"
          onClick={clearFilters}
          startIcon={<Clear />}
          className="text-gray-600 hover:text-red-600"
        >
          Effacer
        </Button>
      </Box>

      <Box className="space-y-6">
        {/* Category Filter */}
        <Box>
          <Box className="flex items-center mb-3">
            <Category className="mr-2 text-gray-600" fontSize="small" />
            <Typography variant="subtitle2" className="font-medium">
              Catégorie
            </Typography>
          </Box>
          <FormControl fullWidth size="small">
            <Select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              displayEmpty
              className="bg-gray-50"
            >
              <MenuItem value="">
                <em>Toutes les catégories</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider />

        {/* Location Filter */}
        <Box>
          <Box className="flex items-center mb-3">
            <LocationOn className="mr-2 text-gray-600" fontSize="small" />
            <Typography variant="subtitle2" className="font-medium">
              Ville
            </Typography>
          </Box>
          <FormControl fullWidth size="small">
            <Select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              displayEmpty
              className="bg-gray-50"
            >
              <MenuItem value="">
                <em>Toutes les villes</em>
              </MenuItem>
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider />

        {/* Date Filter */}
        <Box>
          <Box className="flex items-center mb-3">
            <CalendarToday className="mr-2 text-gray-600" fontSize="small" />
            <Typography variant="subtitle2" className="font-medium">
              Date
            </Typography>
          </Box>
          <FormControl fullWidth size="small">
            <Select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              displayEmpty
              className="bg-gray-50"
            >
              <MenuItem value="">
                <em>Toutes les dates</em>
              </MenuItem>
              <MenuItem value="today">Aujourd'hui</MenuItem>
              <MenuItem value="tomorrow">Demain</MenuItem>
              <MenuItem value="this-week">Cette semaine</MenuItem>
              <MenuItem value="this-weekend">Ce week-end</MenuItem>
              <MenuItem value="next-week">Semaine prochaine</MenuItem>
              <MenuItem value="this-month">Ce mois</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider />

        {/* Price Range Filter */}
        <Box>
          <Box className="flex items-center mb-3">
            <AttachMoney className="mr-2 text-gray-600" fontSize="small" />
            <Typography variant="subtitle2" className="font-medium">
              Prix (€)
            </Typography>
          </Box>
          <Box className="px-2">
            <Slider
              value={filters.priceRange}
              onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={200}
              step={5}
              className="text-primary-600"
            />
            <Box className="flex justify-between text-sm text-gray-600 mt-1">
              <span>{filters.priceRange[0]}€</span>
              <span>{filters.priceRange[1]}€</span>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Time Slot Filter */}
        <Box>
          <Box className="flex items-center mb-3">
            <AccessTime className="mr-2 text-gray-600" fontSize="small" />
            <Typography variant="subtitle2" className="font-medium">
              Heure
            </Typography>
          </Box>
          <FormControl fullWidth size="small">
            <Select
              value={filters.timeSlot}
              onChange={(e) => handleFilterChange('timeSlot', e.target.value)}
              displayEmpty
              className="bg-gray-50"
            >
              <MenuItem value="">
                <em>Toutes les heures</em>
              </MenuItem>
              <MenuItem value="morning">Matin (8h-12h)</MenuItem>
              <MenuItem value="afternoon">Après-midi (12h-18h)</MenuItem>
              <MenuItem value="evening">Soirée (18h-22h)</MenuItem>
              <MenuItem value="night">Nuit (22h+)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider />

        {/* Additional Filters */}
        <Box>
          <Typography variant="subtitle2" className="font-medium mb-3">
            Options
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.accessibility}
                  onChange={(e) => handleFilterChange('accessibility', e.target.checked)}
                  color="primary"
                />
              }
              label="Accessible PMR"
              className="text-sm"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.parking}
                  onChange={(e) => handleFilterChange('parking', e.target.checked)}
                  color="primary"
                />
              }
              label="Parking disponible"
              className="text-sm"
            />
          </FormGroup>
        </Box>
      </Box>
    </Paper>
  );
};

export default EventFilters;

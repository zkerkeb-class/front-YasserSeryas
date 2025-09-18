import React from 'react';
import { Box, TextField, MenuItem, Slider, Typography } from '@mui/material';

const categories = [
  { value: '', label: 'Toutes' },
  { value: 'concert', label: 'Concert' },
  { value: 'sport', label: 'Sport' },
  { value: 'conference', label: 'Conférence' },
  { value: 'festival', label: 'Festival' },
  { value: 'theatre', label: 'Théâtre' },
  { value: 'exposition', label: 'Exposition' }
];

const EventFilters = ({ filters, setFilters }) => {
  const handleCategoryChange = (event) => {
    setFilters(prev => ({ ...prev, category: event.target.value }));
  };

  const handleLocationChange = (event) => {
    setFilters(prev => ({ ...prev, location: event.target.value }));
  };

  const handleDateRangeChange = (event) => {
    setFilters(prev => ({ ...prev, dateRange: event.target.value }));
  };

  const handlePriceRangeChange = (event, newValue) => {
    setFilters(prev => ({ ...prev, priceRange: newValue }));
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        select
        label="Catégorie"
        value={filters.category}
        onChange={handleCategoryChange}
        size="small"
        fullWidth
      >
        {categories.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Lieu"
        value={filters.location}
        onChange={handleLocationChange}
        size="small"
        fullWidth
        placeholder="Ville ou lieu"
      />

      {/* <TextField
        label="Plage de dates"
        value={filters.dateRange}
        onChange={handleDateRangeChange}
        size="small"
        fullWidth
        placeholder="YYYY-MM-DD - YYYY-MM-DD"
        helperText="Format: 2025-07-01 - 2025-07-31"
      /> */}

      <Box>
        <Typography gutterBottom sx={{ fontWeight: 500 }}>
          Prix (EUR): {filters.priceRange[0]}€ - {filters.priceRange[1]}€
        </Typography>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="auto"
          min={0}
          max={200}
          step={5}
        />
      </Box>
    </Box>
  );
};

export default EventFilters;

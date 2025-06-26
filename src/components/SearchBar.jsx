import React, { useState } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  Chip,
  TextField,
  Autocomplete,
  Button,
} from '@mui/material';
import {
  Search,
  LocationOn,
  CalendarToday,
  Category,
} from '@mui/icons-material';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  const categories = [
    'Concert', 'Théâtre', 'Conférence', 'Sport', 'Festival', 'Exposition'
  ];

  const locations = [
    'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Bordeaux'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Recherche:', { searchTerm, location, category });
  };
  return (
    <Paper
      component="form"
      onSubmit={handleSearch}
      sx={{
        p: 3,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        borderRadius: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(229, 231, 235, 0.8)',
      }}
    >
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, 
        gap: 2, 
        alignItems: 'center' 
      }}>        {/* Search Input */}
        <Box sx={{ position: 'relative' }}>
          <Search sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <TextField
            fullWidth
            placeholder="Rechercher un événement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            InputProps={{
              sx: {
                pl: 6,
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                '& fieldset': {
                  borderColor: '#e5e7eb',
                },
                '&:hover fieldset': {
                  borderColor: '#3b82f6',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3b82f6',
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                },
              },
            }}
          />
        </Box>        {/* Location */}
        <Autocomplete
          options={locations}
          value={location}
          onChange={(event, newValue) => setLocation(newValue || '')}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Ville"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <LocationOn sx={{ color: '#9ca3af', mr: 1 }} />
                    {params.InputProps.startAdornment}
                  </>
                ),
                sx: {
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: '#e5e7eb',
                  },
                  '&:hover fieldset': {
                    borderColor: '#3b82f6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                  },
                },
              }}
            />
          )}
        />

        {/* Category */}
        <Autocomplete
          options={categories}
          value={category}
          onChange={(event, newValue) => setCategory(newValue || '')}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Catégorie"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <Category sx={{ color: '#9ca3af', mr: 1 }} />
                    {params.InputProps.startAdornment}
                  </>
                ),
                sx: {
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: '#e5e7eb',
                  },
                  '&:hover fieldset': {
                    borderColor: '#3b82f6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                  },
                },
              }}
            />
          )}
        />

        {/* Search Button */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
            borderRadius: '8px',
            p: 2,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <Search />
        </Button>
      </Box>      {/* Quick Filters */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 3 }}>
        <Chip
          icon={<CalendarToday />}
          label="Aujourd'hui"
          variant="outlined"
          clickable
          sx={{
            '&:hover': {
              backgroundColor: '#eff6ff',
              borderColor: '#3b82f6',
            },
          }}
        />
        <Chip
          icon={<CalendarToday />}
          label="Ce week-end"
          variant="outlined"
          clickable
          sx={{
            '&:hover': {
              backgroundColor: '#eff6ff',
              borderColor: '#3b82f6',
            },
          }}
        />
        <Chip
          label="Gratuit"
          variant="outlined"
          clickable
          sx={{
            '&:hover': {
              backgroundColor: '#f0fdf4',
              borderColor: '#16a34a',
            },
          }}
        />
        <Chip
          label="En ligne"
          variant="outlined"
          clickable
          sx={{
            '&:hover': {
              backgroundColor: '#faf5ff',
              borderColor: '#8b5cf6',
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default SearchBar;

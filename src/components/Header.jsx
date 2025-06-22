import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  Box,
  Container,
} from '@mui/material';
import {
  ShoppingCart,
  Event,
  Home,
  Login,
} from '@mui/icons-material';

const Header = ({ currentPage, setCurrentPage, cartCount }) => {
  const menuItems = [
    { key: 'home', label: 'Accueil', icon: <Home /> },
    { key: 'events', label: 'Événements', icon: <Event /> },
    { key: 'login', label: 'Connexion', icon: <Login /> },
  ];

  return (
    <AppBar 
      position="fixed" 
      className="bg-white shadow-lg border-b border-gray-200"
      elevation={0}
      sx={{ bgcolor: 'white', color: 'text.primary' }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
          {/* Logo - À gauche */}
          <Typography
            variant="h5"
            component="div"
            className="font-bold text-primary-600 cursor-pointer"
            onClick={() => setCurrentPage('home')}
            sx={{ 
              background: 'linear-gradient(45deg, #0ea5e9, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
            }}
          >
            Book My Event
          </Typography>

          {/* Tous les éléments à droite dans un seul conteneur */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Navigation */}
            {menuItems.map((item) => (
              <Button
                key={item.key}
                startIcon={item.icon}
                onClick={() => setCurrentPage(item.key)}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: currentPage === item.key ? 600 : 400,
                  color: currentPage === item.key ? '#1976d2' : '#666',
                  backgroundColor: currentPage === item.key ? '#e3f2fd' : 'transparent',
                  '&:hover': {
                    backgroundColor: currentPage === item.key ? '#e3f2fd' : '#f5f5f5',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
            
            {/* Signup Button */}
            <Button
              variant="contained"
              onClick={() => setCurrentPage('signup')}
              sx={{
                background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                px: 3,
                py: 1,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                ml: 1,
                '&:hover': {
                  background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                },
              }}
            >
              S'inscrire
            </Button>

            {/* Cart */}
            <Box sx={{ ml: 2 }}>
              <Badge
                badgeContent={cartCount}
                color="primary"
                sx={{ cursor: 'pointer' }}
              >
                <ShoppingCart 
                  sx={{ 
                    color: '#666',
                    '&:hover': { color: '#1976d2' },
                    transition: 'color 0.2s',
                  }} 
                />
              </Badge>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

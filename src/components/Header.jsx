import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ShoppingCart,
  Event,
  Home,
  Login,
  AccountCircle,
  Logout,
} from '@mui/icons-material';
import { useAuth, useAppDispatch, useBooking } from '../hooks/useRedux';
import { logout } from '../store/slices/authSlice';

const Header = ({ isAuthenticated: propIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAuth();
  const { currentBooking } = useBooking();
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Debug: Afficher l'état d'authentification
  useEffect(() => {
    console.log('Header - État d\'authentification:', {
      isAuthenticated,
      user,
      propIsAuthenticated
    });
  }, [isAuthenticated, user, propIsAuthenticated]);

  useEffect(() => {
    document.title = `Book My Event - ${location.pathname === '/' ? 'Accueil' : location.pathname.replace('/', '')}`;
  }, [location.pathname]);

  const userIsAuthenticated = isAuthenticated || propIsAuthenticated;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/');
  };

  const menuItems = [
    { key: '/', label: 'Accueil', icon: <Home /> },
    { key: '/events', label: 'Événements', icon: <Event /> },
  ];

  const cartCount = currentBooking.tickets.reduce((total, ticket) => total + ticket.quantity, 0);

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ bgcolor: 'white', color: 'text.primary' }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{ 
              background: 'linear-gradient(45deg, #0ea5e9, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              textDecoration: 'none',
            }}
          >
            Book My Event
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {menuItems.map((item) => (
              <Button
                key={item.key}
                component={Link}
                to={item.key}
                startIcon={item.icon}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: location.pathname === item.key ? 600 : 400,
                  color: location.pathname === item.key ? '#1976d2' : '#666',
                  backgroundColor: location.pathname === item.key ? '#e3f2fd' : 'transparent',
                  textDecoration: 'none',
                  '&:hover': {
                    backgroundColor: location.pathname === item.key ? '#e3f2fd' : '#f5f5f5',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}

            {!userIsAuthenticated ? (
              <>
                <Button
                  component={Link}
                  to="/login"
                  startIcon={<Login />}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 400,
                    color: '#666',
                    textDecoration: 'none',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  Connexion
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                    px: 3,
                    py: 1,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    ml: 1,
                    textDecoration: 'none',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                    },
                  }}
                >
                  S'inscrire
                </Button>
              </>
            ) : (
              <>
                <Button
                  startIcon={<AccountCircle />}
                  onClick={handleMenuOpen}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                    color: '#666',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  {user?.name || user?.user?.lastName || 'Mon compte'}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/admin'); }}>
                    <AccountCircle sx={{ mr: 1 }} />
                    Mon profil
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} />
                    Déconnexion
                  </MenuItem>
                </Menu>
              </>
            )}

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

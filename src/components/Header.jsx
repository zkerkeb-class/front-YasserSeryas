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
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ShoppingCart,
  Event,
  Home,
  Login,
  AccountCircle,
  Logout,
  Settings,
  Menu as MenuIcon,
  Close,
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
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Debug: Afficher l'état d'authentification
  useEffect(() => {
    console.log('Header - État d\'authentification:', {
      isAuthenticated,
      
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

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const renderMobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          bgcolor: 'background.default',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Menu</Typography>
        <IconButton onClick={() => setMobileMenuOpen(false)}>
          <Close />
        </IconButton>
      </Box>
      
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.key}
            component={Link}
            to={item.key}
            onClick={() => setMobileMenuOpen(false)}
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              bgcolor: location.pathname === item.key ? 'primary.light' : 'transparent',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.key ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        
        {!userIsAuthenticated ? (
          <>
            <ListItem 
              component={Link}
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              sx={{ color: 'inherit', textDecoration: 'none' }}
            >
              <ListItemIcon><Login /></ListItemIcon>
              <ListItemText primary="Connexion" />
            </ListItem>
            <ListItem 
              component={Link}
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              sx={{ color: 'inherit', textDecoration: 'none' }}
            >
              <ListItemIcon><AccountCircle /></ListItemIcon>
              <ListItemText primary="S'inscrire" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem 
              component={Link}
              to="/tickets"
              onClick={() => setMobileMenuOpen(false)}
              sx={{ color: 'inherit', textDecoration: 'none' }}
            >
              <ListItemIcon><Event /></ListItemIcon>
              <ListItemText primary="Mes billets" />
            </ListItem>
            {(user?.role === 'admin' || user?.role === 'administrateur' || user?.role === 'organisateur' || user?.role === 'organizer') && (
              <ListItem 
                component={Link}
                to="/events"
                onClick={() => setMobileMenuOpen(false)}
                sx={{ color: 'inherit', textDecoration: 'none' }}
              >
                <ListItemIcon><Settings /></ListItemIcon>
                <ListItemText primary="Gérer les types de billets" />
              </ListItem>
            )}
            <ListItem 
              component={Link}
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              sx={{ color: 'inherit', textDecoration: 'none' }}
            >
              <ListItemIcon><AccountCircle /></ListItemIcon>
              <ListItemText primary="Mon profil" />
            </ListItem>
            <ListItem 
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemIcon><Logout /></ListItemIcon>
              <ListItemText primary="Déconnexion" />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ bgcolor: 'white', color: 'text.primary' }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, minHeight: { xs: 56, sm: 64 } }}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            component={Link}
            to="/"
            sx={{ 
              background: 'linear-gradient(45deg, #0ea5e9, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              textDecoration: 'none',
              fontSize: { xs: '1.1rem', sm: '1.5rem' },
            }}
          >
            {isMobile ? "BME" : "Book My Event"}
          </Typography>

          {/* Desktop Menu */}
          {!isMobile && (
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
                    <MenuItem onClick={() => { handleMenuClose(); navigate('/tickets'); }}>
                      <Event sx={{ mr: 1 }} />
                      Mes billets
                    </MenuItem>
                    {(user?.role === 'admin' || user?.role === 'administrateur' || user?.role === 'organisateur' || user?.role === 'organizer') && (
                      <MenuItem onClick={() => { handleMenuClose(); navigate('/events'); }}>
                        <Settings sx={{ mr: 1 }} />
                        Gérer les types de billets
                      </MenuItem>
                    )}
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
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuToggle}
              sx={{ color: '#666' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>
      
      {/* Mobile Menu Drawer */}
      {renderMobileMenu()}
    </AppBar>
  );
};

export default Header;

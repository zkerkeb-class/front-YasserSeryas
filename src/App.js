import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Snackbar, Alert } from '@mui/material';
import { store } from './store';
import { useAppSelector, useAppDispatch } from './hooks/useRedux';
import { hideSnackbar } from './store/slices/uiSlice';
import { fetchFeaturedEvents } from './store/thunks/eventsThunks';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import theme from './theme';
import './App.css';

// Composant App interne qui utilise Redux
function AppContent() {
  const dispatch = useAppDispatch();
  const { snackbar } = useAppSelector(state => state.ui);
  const { isAuthenticated } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Charger les événements mis en avant au démarrage
    dispatch(fetchFeaturedEvents());
  }, [dispatch]);

  const handleCloseSnackbar = () => {
    dispatch(hideSnackbar());
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
          <Header isAuthenticated={isAuthenticated} />
          
          <Box component="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/booking/:eventId" element={<BookingPage />} />
              <Route 
                path="/login" 
                element={
                  isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
                } 
              />
              <Route 
                path="/signup" 
                element={
                  isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />
                } 
              />
              <Route 
                path="/admin" 
                element={
                  isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" replace />
                } 
              />
              {/* Route de fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>

          {/* Snackbar global pour les notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert 
              onClose={handleCloseSnackbar} 
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

// Composant App principal qui wrap avec le Provider Redux
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;

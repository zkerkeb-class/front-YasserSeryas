import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import theme from './theme';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cartCount, setCartCount] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        {/* Show header only for main pages, not for login/signup */}
        {!['login', 'signup'].includes(currentPage) && (
          <Header 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage}
            cartCount={cartCount}
          />
        )}
        
        <Box 
          component="main" 
          sx={{ 
            pt: !['login', 'signup'].includes(currentPage) ? '64px' : 0 
          }}
        >
          {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
          {currentPage === 'events' && <EventsPage />}
          {currentPage === 'booking' && <BookingPage />}
          {currentPage === 'login' && <LoginPage setCurrentPage={setCurrentPage} />}
          {currentPage === 'signup' && <SignupPage setCurrentPage={setCurrentPage} />}
          {currentPage === 'admin' && <AdminDashboard />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

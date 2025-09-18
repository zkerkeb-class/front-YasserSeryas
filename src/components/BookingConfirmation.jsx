import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
  DownloadForOffline,
  Home,
  ConfirmationNumber,
  Email,
} from '@mui/icons-material';

const BookingConfirmation = ({ confirmationNumber, currentEvent, selectedTicket }) => {
  const navigate = useNavigate();

  const handleDownloadTicket = () => {
    // TODO: Implémenter le téléchargement du billet
    console.log('Télécharger le billet pour la réservation:', confirmationNumber);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box sx={{ maxWidth: '600px', mx: 'auto', p: 2 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 4,
          border: '1px solid #e2e8f0',
          borderRadius: 3,
          textAlign: 'center'
        }}
      >
        {/* Icône de succès */}
        <Box sx={{ mb: 3 }}>
          <CheckCircle 
            sx={{ 
              fontSize: 80, 
              color: 'success.main',
              mb: 2
            }} 
          />
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: 'success.main',
              mb: 1
            }}
          >
            Réservation confirmée !
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Merci pour votre réservation. Votre billet a été confirmé.
          </Typography>
        </Box>

        {/* Numéro de confirmation */}
        {confirmationNumber && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <ConfirmationNumber />
              <Typography variant="h6" fontWeight="bold">
                {confirmationNumber}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Numéro de réservation
            </Typography>
          </Alert>
        )}

        {/* Détails de l'événement */}
        {currentEvent && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {currentEvent.title || currentEvent.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {new Date(currentEvent.startDate || currentEvent.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentEvent.location?.name || currentEvent.location}
              </Typography>
              {selectedTicket && (
                <Chip 
                  label={`Type: ${selectedTicket.name || 'Standard'}`}
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Informations importantes */}
        <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Email sx={{ mt: 0.5 }} />
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Email de confirmation envoyé
              </Typography>
              <Typography variant="body2">
                Un email de confirmation avec votre billet électronique vous a été envoyé. 
                Vérifiez également vos courriers indésirables.
              </Typography>
            </Box>
          </Box>
        </Alert>

        <Divider sx={{ my: 3 }} />

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<DownloadForOffline />}
            onClick={handleDownloadTicket}
            disabled={!confirmationNumber}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1FB8E8 90%)',
              },
            }}
          >
            Télécharger le billet
          </Button>
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={handleGoHome}
          >
            Retour à l'accueil
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default BookingConfirmation;

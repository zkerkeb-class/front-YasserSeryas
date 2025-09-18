import React from 'react';
import { Box, Paper, Typography, Divider, Button, Stack } from '@mui/material';

const BookingSummary = ({ setStep, selectedTicket, currentEvent, quantity = 1 }) => {
  const formatPrice = (price) => {
    if (price === undefined || price === null) return 'Gratuit';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  const unitPrice = selectedTicket?.price ?? 0;
  const total = unitPrice * (quantity || 1);

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }} elevation={0}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Récapitulatif
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Détails de l'événement
        </Typography>
        <Box sx={{ mb: 2 }}>
          <DetailRow label="Événement" value={currentEvent?.name} />
          <DetailRow label="Date" value={new Date(currentEvent?.startDate).toLocaleDateString('fr-FR', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })} />
          <DetailRow label="Heure" value={new Date(currentEvent?.startDate).toLocaleTimeString('fr-FR', {
            hour: '2-digit', minute: '2-digit'
          })} />
          <DetailRow label="Lieu" value={`${currentEvent?.location?.name || ''} ${currentEvent?.location?.address?.city || ''}`} />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Réservation
        </Typography>
        <Box sx={{ mb: 2 }}>
          <DetailRow label="Type de billet" value={selectedTicket?.name} />
          <DetailRow label="Prix unitaire" value={formatPrice(unitPrice)} />
          <DetailRow label="Quantité" value={quantity} />
          <DetailRow label="Total" value={formatPrice(total)} highlight />
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button variant="text" onClick={() => setStep('form')}>Modifier</Button>
          <Button variant="contained" onClick={() => setStep('success')}>Confirmer</Button>
        </Stack>
      </Paper>
    </Box>
  );
};

const DetailRow = ({ label, value, highlight = false }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{label}</Typography>
    <Typography variant="body2" sx={{ fontWeight: highlight ? 700 : 500 }}>
      {value || '—'}
    </Typography>
  </Box>
);

export default BookingSummary;

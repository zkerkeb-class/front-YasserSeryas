import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  CircularProgress,
  Stack,
  Button
} from '@mui/material';
import { useAppDispatch } from '../hooks/useRedux';
import { useAuth, useTickets } from '../hooks/useRedux';
import { fetchMyTickets } from '../store/thunks/ticketsThunks';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

const statusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'confirmée':
    case 'valid':
      return 'success';
    case 'used':
    case 'utilisé':
      return 'warning';
    case 'transferred':
    case 'transféré':
      return 'info';
    default:
      return 'default';
  }
};

const TicketsListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, isLoading, error } = useTickets();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyTickets());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
        <Typography variant="h5" gutterBottom>Mes billets</Typography>
        <Typography>Vous devez être connecté pour voir vos billets.</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/login')}>Se connecter</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Mes billets</Typography>

      {isLoading && (
        <Stack alignItems="center" sx={{ py: 6 }}>
          <CircularProgress />
        </Stack>
      )}

      {error && !isLoading && (
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
      )}

      {!isLoading && items.length === 0 && (
        <Typography>Aucun billet pour le moment.</Typography>
      )}

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {items.map(ticket => (
          <Grid item xs={12} sm={6} md={4} key={ticket._id}>
            <Card variant="outlined" sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardActionArea onClick={() => navigate(`/tickets/${ticket._id}`)} sx={{ flexGrow: 1 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {ticket.event?.name || 'Événement'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {ticket.event?.location?.name} — {ticket.event?.location?.address?.city}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Le {dayjs(ticket.event?.startDate).format('DD MMMM YYYY à HH:mm')}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Code billet : {ticket.ticketNumber || '—'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Prix : {ticket.price} {ticket.currency}
                  </Typography>

                  <Chip
                    size="small"
                    label={ticket.reservation?.status || 'inconnu'}
                    color={statusColor(ticket.reservation?.status)}
                    sx={{ textTransform: 'capitalize', mt: 1 }}
                  />
                </CardContent>
              </CardActionArea>

              {ticket.isTransferable && (
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate(`/tickets/${ticket._id}/transfer`)}
                  >
                    Transférer
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TicketsListPage;

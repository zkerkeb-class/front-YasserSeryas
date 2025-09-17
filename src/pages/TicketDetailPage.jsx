import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useAppDispatch } from '../hooks/useRedux';
import { useAuth, useTickets } from '../hooks/useRedux';
import { fetchTicketById, transferTicket, validateTicket } from '../store/thunks/ticketsThunks';
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

const TicketDetailPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { currentTicket: ticket, isLoading, transferLoading, validateLoading, error } = useTickets();

  const [transferOpen, setTransferOpen] = useState(false);
  const [transferEmail, setTransferEmail] = useState('');

  useEffect(() => {
    if (isAuthenticated && id) {
      dispatch(fetchTicketById(id));
    }
  }, [dispatch, id, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
        <Typography variant="h5" gutterBottom>Détail du billet</Typography>
        <Typography>Vous devez être connecté pour voir ce billet.</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/login')}>Se connecter</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: 2, py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight={700}>Billet</Typography>
        {ticket && (
          <Chip
            label={ticket.reservation?.status || 'inconnu'}
            color={statusColor(ticket.reservation?.status)}
            sx={{ textTransform: 'capitalize' }}
          />
        )}
      </Stack>

      {isLoading && (
        <Stack alignItems="center" sx={{ py: 6 }}>
          <CircularProgress />
        </Stack>
      )}

      {error && !isLoading && (
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
      )}

      {!isLoading && ticket && (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          {/* Nom de l'événement */}
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {ticket.event?.name}
          </Typography>

          {/* Lieu */}
          <Typography variant="body2" color="text.secondary">
            {ticket.event?.location?.name} — {ticket.event?.location?.address?.city}
          </Typography>

          {/* Dates */}
          <Typography variant="body2" sx={{ mb: 1 }}>
            Du {dayjs(ticket.event?.startDate).format('DD MMMM YYYY HH:mm')}  
            au {dayjs(ticket.event?.endDate).format('DD MMMM YYYY HH:mm')}
          </Typography>

          {/* Code billet */}
          <Typography variant="body1" sx={{ mb: 1 }}>
            Code billet : <strong>{ticket.ticketNumber}</strong>
          </Typography>

          {/* Acheteur */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Acheteur : {ticket.owner?.firstName} {ticket.owner?.lastName} ({ticket.owner?.email})
          </Typography>

          {/* Prix */}
          <Typography variant="body2" sx={{ mb: 1 }}>
            Prix : {ticket.price} {ticket.currency}
          </Typography>

          {/* Validation usage */}
          <Typography variant="body2" sx={{ mb: 2 }}>
            Utilisé : {ticket.isUsed ? 'Oui' : 'Non'}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Actions */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {ticket.isTransferable && (
              <Button
                variant="contained"
                onClick={() => setTransferOpen(true)}
                disabled={transferLoading}
              >
                {transferLoading ? 'Transfert...' : 'Transférer'}
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={() => dispatch(validateTicket(ticket._id))}
              disabled={validateLoading}
            >
              {validateLoading ? 'Validation...' : 'Valider'}
            </Button>
            <Button onClick={() => navigate('/tickets')}>Retour</Button>
          </Stack>
        </Paper>
      )}

      {/* Dialog transfert */}
      <Dialog open={transferOpen} onClose={() => setTransferOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Transférer le billet</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email du nouveau propriétaire"
            value={transferEmail}
            onChange={(e) => setTransferEmail(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferOpen(false)}>Annuler</Button>
          <Button
            onClick={() => {
              dispatch(transferTicket({ ticketId: ticket?._id, newOwnerEmail: transferEmail }));
              setTransferOpen(false);
            }}
            disabled={transferLoading || !transferEmail}
            variant="contained"
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TicketDetailPage;

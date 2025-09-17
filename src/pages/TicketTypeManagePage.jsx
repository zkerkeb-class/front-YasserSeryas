import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
  Tooltip,
  Divider,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Add, Delete, Edit, Save, ArrowBack, ContentCopy } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useAppDispatch } from '../hooks/useRedux';
import { useAuth, useTickets } from '../hooks/useRedux';
import { fetchEventTicketTypes, createTicketTypeThunk, updateTicketTypeThunk, deleteTicketTypeThunk, bulkCreateTicketTypesThunk } from '../store/thunks/ticketTypesThunks';
import { useAppSelector } from '../hooks/useRedux';

const emptyType = (eventId) => ({
  eventId,
  name: '',
  description: '',
  price: 0,
  quantity: 0,
  maxPerPurchase: 10,
  saleStartDate: dayjs().toISOString(),
  saleEndDate: ''
});

const TicketTypeManagePage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAuth();
  const { items: ticketTypes, isLoading, saving, deleting, error } = useAppSelector(s => s.ticketTypes);

  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyType(eventId));
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkText, setBulkText] = useState(`VIP;Accès privilégié;150;100;4\nStandard;Billet standard;50;500;10`);

  useEffect(() => {
    if (eventId) dispatch(fetchEventTicketTypes(eventId));
  }, [dispatch, eventId]);

  const canManage = useMemo(() => {
    if (!user) return false;
    return ['administrateur', 'admin', 'organisateur', 'organizer'].includes(user.role);
  }, [user]);

  const handleEdit = (tt) => {
    setSelected(tt._id || tt.id);
    setForm({
      eventId,
      name: tt.name || '',
      description: tt.description || '',
      price: tt.price || 0,
      quantity: tt.initialQuantity || tt.quantity || 0,
      maxPerPurchase: tt.maxPerPurchase || 10,
      saleStartDate: tt.saleStartDate ? dayjs(tt.saleStartDate).toISOString() : dayjs().toISOString(),
      saleEndDate: tt.saleEndDate ? dayjs(tt.saleEndDate).toISOString() : ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Supprimer ce type de billet ?')) {
      dispatch(deleteTicketTypeThunk(id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return;
    const payload = { ...form, price: Number(form.price), quantity: Number(form.quantity), maxPerPurchase: Number(form.maxPerPurchase) };
    if (selected) {
      dispatch(updateTicketTypeThunk({ id: selected, updates: payload })).then(() => {
        setSelected(null);
        setForm(emptyType(eventId));
      });
    } else {
      dispatch(createTicketTypeThunk(payload)).then(() => setForm(emptyType(eventId)));
    }
  };

  const parseBulk = () => {
    // Format: name;description;price;quantity;maxPerPurchase
    return bulkText.split(/\n+/).map(line => {
      const [name, description, price, quantity, maxPerPurchase] = line.split(';');
      return {
        eventId,
        name: name?.trim(),
        description: description?.trim(),
        price: Number(price),
        quantity: Number(quantity),
        maxPerPurchase: Number(maxPerPurchase || 10)
      };
    }).filter(tt => tt.name && !Number.isNaN(tt.price));
  };

  const handleBulkCreate = () => {
    const parsed = parseBulk();
    if (parsed.length === 0) return;
    dispatch(bulkCreateTicketTypesThunk({ eventId, ticketTypes: parsed })).then(() => {
      setBulkDialogOpen(false);
    });
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
        <Typography>Veuillez vous connecter.</Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate('/login')}>Connexion</Button>
      </Box>
    );
  }

  if (!canManage) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
        <Typography>Vous n'êtes pas autorisé à gérer ces types de billets.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
        <Typography variant="h4" fontWeight={700}>Gestion des types de billets</Typography>
        <Chip label={`Événement ${eventId}`} size="small" />
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }} component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {selected ? 'Modifier le type' : 'Nouveau type de billet'}
            </Typography>
            <Stack spacing={2}>
              <TextField label="Nom" name="name" value={form.name} onChange={handleChange} required fullWidth />
              <TextField label="Description" name="description" value={form.description} onChange={handleChange} multiline rows={3} fullWidth />
              <Stack direction="row" spacing={2}>
                <TextField label="Prix (€)" name="price" type="number" value={form.price} onChange={handleChange} required fullWidth />
                <TextField label="Quantité" name="quantity" type="number" value={form.quantity} onChange={handleChange} required fullWidth />
              </Stack>
              <TextField label="Max par achat" name="maxPerPurchase" type="number" value={form.maxPerPurchase} onChange={handleChange} fullWidth />
              <TextField label="Début vente" name="saleStartDate" type="datetime-local" value={dayjs(form.saleStartDate).format('YYYY-MM-DDTHH:mm')} onChange={(e) => setForm(f => ({ ...f, saleStartDate: dayjs(e.target.value).toISOString() }))} fullWidth />
              <TextField label="Fin vente" name="saleEndDate" type="datetime-local" value={form.saleEndDate ? dayjs(form.saleEndDate).format('YYYY-MM-DDTHH:mm') : ''} onChange={(e) => setForm(f => ({ ...f, saleEndDate: dayjs(e.target.value).toISOString() }))} fullWidth />
              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained" startIcon={<Save />} disabled={saving}>
                  {saving ? 'Enregistrement...' : (selected ? 'Mettre à jour' : 'Créer')}
                </Button>
                {selected && (
                  <Button variant="text" onClick={() => { setSelected(null); setForm(emptyType(eventId)); }}>Annuler</Button>
                )}
              </Stack>
            </Stack>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>Création multiple</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Format: Nom;Description;Prix;Quantité;MaxParAchat (une ligne par type)
            </Typography>
            <TextField multiline minRows={4} fullWidth value={bulkText} onChange={(e) => setBulkText(e.target.value)} />
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button variant="outlined" startIcon={<Add />} onClick={handleBulkCreate} disabled={saving}>Créer en lot</Button>
              <Button onClick={() => setBulkDialogOpen(true)}>Prévisualiser</Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>Types existants</Typography>
              <Button size="small" variant="outlined" onClick={() => dispatch(fetchEventTicketTypes(eventId))}>Rafraîchir</Button>
            </Stack>
            {isLoading && <CircularProgress />}
            {!isLoading && ticketTypes.length === 0 && <Typography>Aucun type pour le moment.</Typography>}
            <Stack spacing={2}>
              {ticketTypes.map(tt => {
                const sold = (tt.initialQuantity || 0) - (tt.quantity || 0);
                const soldOut = (tt.quantity || 0) === 0;
                return (
                  <Paper key={tt._id || tt.id} variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>{tt.name}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{tt.description}</Typography>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                          <Chip label={`${tt.price} €`} size="small" />
                          <Chip label={`Vendus: ${sold}`} size="small" />
                          <Chip label={`Restants: ${tt.quantity}`} size="small" color={soldOut ? 'error' : 'default'} />
                          {tt.saleStartDate && <Chip label={`Début: ${dayjs(tt.saleStartDate).format('DD/MM HH:mm')}`} size="small" />}
                          {tt.saleEndDate && <Chip label={`Fin: ${dayjs(tt.saleEndDate).format('DD/MM HH:mm')}`} size="small" />}
                          {soldOut && <Chip label="Complet" color="error" size="small" />}
                        </Stack>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Éditer">
                          <IconButton onClick={() => handleEdit(tt)} size="small"><Edit fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Dupliquer">
                          <IconButton onClick={() => setForm({ ...form, ...tt, name: `${tt.name} (copie)` })} size="small"><ContentCopy fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton onClick={() => handleDelete(tt._id || tt.id)} size="small" disabled={deleting}><Delete fontSize="small" /></IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={bulkDialogOpen} onClose={() => setBulkDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Aperçu création multiple</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            {parseBulk().map((tt, idx) => (
              <Paper key={idx} variant="outlined" sx={{ p: 1 }}>
                <Typography variant="subtitle2">{tt.name} - {tt.price} € ({tt.quantity})</Typography>
                <Typography variant="caption" color="text.secondary">{tt.description}</Typography>
              </Paper>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDialogOpen(false)}>Fermer</Button>
          <Button onClick={handleBulkCreate} variant="contained" disabled={saving || parseBulk().length === 0}>Confirmer</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default TicketTypeManagePage;

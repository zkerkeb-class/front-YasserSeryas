import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ticketsRequestStart,
  ticketsRequestFailure,
  setUserTickets,
  setCurrentTicket,
  setEventTickets,
  transferStart,
  transferSuccess,
  transferFailure,
  validateStart,
  validateSuccess,
  validateFailure,
} from '../slices/ticketsSlice';
import { showSnackbar } from '../slices/uiSlice';

const API_BASE = 'http://localhost:3000/api';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
});

export const fetchMyTickets = createAsyncThunk(
  'tickets/fetchMyTickets',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(ticketsRequestStart());
      const res = await fetch(`${API_BASE}/tickets/my`, { headers: authHeaders() });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      dispatch(setUserTickets(data.data || data));
      return data.data || data;
    } catch (err) {
      const msg = err.message || 'Erreur de récupération des billets';
      dispatch(ticketsRequestFailure(msg));
      dispatch(showSnackbar({ message: msg, severity: 'error' }));
      return rejectWithValue(msg);
    }
  }
);

export const fetchTicketById = createAsyncThunk(
  'tickets/fetchTicketById',
  async (ticketId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(ticketsRequestStart());
      const res = await fetch(`${API_BASE}/tickets/${ticketId}`, { headers: authHeaders() });
      if (res.status === 404) throw new Error('Billet non trouvé');
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      dispatch(setCurrentTicket(data.data || data));
      return data.data || data;
    } catch (err) {
      const msg = err.message || 'Erreur de récupération du billet';
      dispatch(ticketsRequestFailure(msg));
      dispatch(showSnackbar({ message: msg, severity: 'error' }));
      return rejectWithValue(msg);
    }
  }
);

export const fetchEventTickets = createAsyncThunk(
  'tickets/fetchEventTickets',
  async (eventId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(ticketsRequestStart());
      const res = await fetch(`${API_BASE}/events/${eventId}/tickets`, { headers: authHeaders() });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      dispatch(setEventTickets({ eventId, tickets: data.data || data }));
      return data.data || data;
    } catch (err) {
      const msg = err.message || 'Erreur de récupération des billets de l\'événement';
      dispatch(ticketsRequestFailure(msg));
      dispatch(showSnackbar({ message: msg, severity: 'error' }));
      return rejectWithValue(msg);
    }
  }
);

export const transferTicket = createAsyncThunk(
  'tickets/transferTicket',
  async ({ ticketId, newOwnerEmail }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(transferStart());
      const res = await fetch(`${API_BASE}/tickets/${ticketId}/transfer`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ newOwnerEmail })
      });
      if (!res.ok) {
        if (res.status === 400) {
          const errData = await res.json();
          throw new Error(errData.message || 'Transfert impossible');
        }
        throw new Error(`Erreur ${res.status}`);
      }
      const data = await res.json();
      dispatch(transferSuccess('Billet transféré avec succès'));
      dispatch(showSnackbar({ message: 'Billet transféré', severity: 'success' }));
      if (data.data) dispatch(setCurrentTicket(data.data));
      return data.data || data;
    } catch (err) {
      const msg = err.message || 'Erreur pendant le transfert';
      dispatch(transferFailure(msg));
      dispatch(showSnackbar({ message: msg, severity: 'error' }));
      return rejectWithValue(msg);
    }
  }
);

export const validateTicket = createAsyncThunk(
  'tickets/validateTicket',
  async (ticketId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(validateStart());
      const res = await fetch(`${API_BASE}/tickets/${ticketId}/validate`, {
        method: 'PUT',
        headers: authHeaders()
        
      });
      if (!res.ok) {
        if (res.status === 400) {
          const errData = await res.json();
          throw new Error(errData.message || 'Validation impossible');
        }
        throw new Error(`Erreur ${res.status}`);
      }
      const data = await res.json();
      dispatch(validateSuccess('Billet validé'));
      dispatch(showSnackbar({ message: 'Billet validé', severity: 'success' }));
      if (data.data) dispatch(setCurrentTicket(data.data));
      return data.data || data;
    } catch (err) {
      const msg = err.message || 'Erreur lors de la validation';
      dispatch(validateFailure(msg));
      dispatch(showSnackbar({ message: msg, severity: 'error' }));
      return rejectWithValue(msg);
    }
  }
);

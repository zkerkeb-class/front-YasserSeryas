import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ttRequestStart,
  ttRequestFailure,
  setTicketTypes,
  createStart,
  createSuccess,
  createFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure,
} from '../slices/ticketTypesSlice';
import { showSnackbar } from '../slices/uiSlice';

const API_BASE = 'http://localhost:3000/api';
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
});

export const fetchEventTicketTypes = createAsyncThunk(
  'ticketTypes/fetchEventTicketTypes',
  async (eventId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(ttRequestStart());
      const res = await fetch(`${API_BASE}/ticket-types/event/${eventId}`);
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      dispatch(setTicketTypes(data.data || data));
      return data.data || data;
    } catch (err) {
      const msg = err.message || 'Erreur de récupération des types de billets';
      dispatch(ttRequestFailure(msg));
      dispatch(showSnackbar({ message: msg, severity: 'error' }));
      return rejectWithValue(msg);
    }
  }
);

export const createTicketTypeThunk = createAsyncThunk(
  'ticketTypes/create',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      dispatch(createStart());
      const res = await fetch(`${API_BASE}/ticket-types`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Erreur ${res.status}`);
      }
      const data = await res.json();
      dispatch(createSuccess(data.data || data));
      dispatch(showSnackbar({ message: 'Type de billet créé', severity: 'success' }));
      return data.data || data;
    } catch (err) {
      const msg = err.message || 'Erreur de création';
      dispatch(createFailure(msg));
      dispatch(showSnackbar({ message: msg, severity: 'error' }));
      return rejectWithValue(msg);
    }
  }
);

export const updateTicketTypeThunk = createAsyncThunk(
  'ticketTypes/update',
  async ({ id, updates }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(updateStart());
      const res = await fetch(`${API_BASE}/ticket-types/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Erreur ${res.status}`);
      }
      const data = await res.json();
      dispatch(updateSuccess(data.data || data));
      dispatch(showSnackbar({ message: 'Type de billet mis à jour', severity: 'success' }));
      return data.data || data;
    } catch (err) {
      const msg = err.message || 'Erreur de mise à jour';
      dispatch(updateFailure(msg));
      dispatch(showSnackbar({ message: msg, severity: 'error' }));
      return rejectWithValue(msg);
    }
  }
);

export const deleteTicketTypeThunk = createAsyncThunk(
  'ticketTypes/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(deleteStart());
      const res = await fetch(`${API_BASE}/ticket-types/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Erreur ${res.status}`);
      }
      await res.json().catch(() => ({}));
      dispatch(deleteSuccess(id));
      dispatch(showSnackbar({ message: 'Type de billet supprimé', severity: 'success' }));
      return id;
    } catch (err) {
      const msg = err.message || 'Erreur de suppression';
      dispatch(deleteFailure(msg));
      dispatch(showSnackbar({ message: msg, severity: 'error' }));
      return rejectWithValue(msg);
    }
  }
);

export const bulkCreateTicketTypesThunk = createAsyncThunk(
  'ticketTypes/bulkCreate',
  async ({ eventId, ticketTypes }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(createStart());
      const res = await fetch(`${API_BASE}/ticket-types/event/${eventId}/bulk`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ ticketTypes }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Erreur ${res.status}`);
      }
      const data = await res.json();
      // Ajouter tous les types créés
      (data.data || data).forEach(tt => dispatch(createSuccess(tt)));
      dispatch(showSnackbar({ message: `${(data.data || data).length} types créés`, severity: 'success' }));
      return data.data || data;
    } catch (err) {
      const msg = err.message || 'Erreur de création multiple';
      dispatch(createFailure(msg));
      dispatch(showSnackbar({ message: msg, severity: 'error' }));
      return rejectWithValue(msg);
    }
  }
);

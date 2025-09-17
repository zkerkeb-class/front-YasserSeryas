import { createSlice } from '@reduxjs/toolkit';

// Tickets slice: gestion des billets utilisateur + opérations (transfert, validation)
const initialState = {
  items: [],            // billets de l'utilisateur connecté
  eventTickets: {},     // billets par événement (admin / organisateur)
  currentTicket: null,  // billet détaillé
  isLoading: false,
  error: null,
  transferLoading: false,
  validateLoading: false,
  lastActionMessage: null,
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    ticketsRequestStart: (state) => { state.isLoading = true; state.error = null; },
    ticketsRequestFailure: (state, action) => { state.isLoading = false; state.error = action.payload; },
    setUserTickets: (state, action) => { state.isLoading = false; state.items = action.payload; state.error = null; },
    setCurrentTicket: (state, action) => { state.isLoading = false; state.currentTicket = action.payload; state.error = null; },
    clearCurrentTicket: (state) => { state.currentTicket = null; },
    setEventTickets: (state, action) => { const { eventId, tickets } = action.payload; state.eventTickets[eventId] = tickets; },
    transferStart: (state) => { state.transferLoading = true; state.lastActionMessage = null; },
    transferSuccess: (state, action) => { state.transferLoading = false; state.lastActionMessage = action.payload; },
    transferFailure: (state, action) => { state.transferLoading = false; state.error = action.payload; },
    validateStart: (state) => { state.validateLoading = true; state.lastActionMessage = null; },
    validateSuccess: (state, action) => { state.validateLoading = false; state.lastActionMessage = action.payload; },
    validateFailure: (state, action) => { state.validateLoading = false; state.error = action.payload; },
    clearTicketMessages: (state) => { state.lastActionMessage = null; },
  }
});

export const {
  ticketsRequestStart,
  ticketsRequestFailure,
  setUserTickets,
  setCurrentTicket,
  clearCurrentTicket,
  setEventTickets,
  transferStart,
  transferSuccess,
  transferFailure,
  validateStart,
  validateSuccess,
  validateFailure,
  clearTicketMessages,
} = ticketsSlice.actions;

export default ticketsSlice.reducer;

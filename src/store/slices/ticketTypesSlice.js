import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  saving: false,
  deleting: false,
  lastUpdatedId: null,
};

const ticketTypesSlice = createSlice({
  name: 'ticketTypes',
  initialState,
  reducers: {
    ttRequestStart: (state) => { state.isLoading = true; state.error = null; },
    ttRequestFailure: (state, action) => { state.isLoading = false; state.error = action.payload; },
    setTicketTypes: (state, action) => { state.isLoading = false; state.items = action.payload; state.error = null; },
    createStart: (state) => { state.saving = true; state.error = null; },
    createSuccess: (state, action) => { state.saving = false; state.items.push(action.payload); },
    createFailure: (state, action) => { state.saving = false; state.error = action.payload; },
    updateStart: (state) => { state.saving = true; state.error = null; },
    updateSuccess: (state, action) => {
      state.saving = false; 
      const idx = state.items.findIndex(t => t._id === action.payload._id || t.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      state.lastUpdatedId = action.payload._id || action.payload.id;
    },
    updateFailure: (state, action) => { state.saving = false; state.error = action.payload; },
    deleteStart: (state) => { state.deleting = true; state.error = null; },
    deleteSuccess: (state, action) => {
      state.deleting = false; 
      state.items = state.items.filter(t => (t._id || t.id) !== action.payload);
    },
    deleteFailure: (state, action) => { state.deleting = false; state.error = action.payload; },
    clearTicketTypes: (state) => { state.items = []; state.error = null; },
  }
});

export const {
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
  clearTicketTypes,
} = ticketTypesSlice.actions;

export default ticketTypesSlice.reducer;

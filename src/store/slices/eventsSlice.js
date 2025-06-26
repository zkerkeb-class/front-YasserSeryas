import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  featuredEvents: [],
  currentEvent: null,
  filters: {
    search: '',
    category: '',
    location: '',
    date: '',
    priceRange: [0, 1000],
  },
  isLoading: false,
  error: null,
  hasNextPage: true,
  currentPage: 1,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    fetchEventsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchEventsSuccess: (state, action) => {
      state.isLoading = false;
      const { events, page, hasNextPage } = action.payload;
      
      if (page === 1) {
        state.events = events;
      } else {
        state.events = [...state.events, ...events];
      }
      
      state.currentPage = page;
      state.hasNextPage = hasNextPage;
      state.error = null;
    },
    fetchEventsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchFeaturedEventsSuccess: (state, action) => {
      state.featuredEvents = action.payload;
    },
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.currentPage = 1;
    },
    addEvent: (state, action) => {
      state.events.unshift(action.payload);
    },
    updateEvent: (state, action) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
  },
});

export const {
  fetchEventsStart,
  fetchEventsSuccess,
  fetchEventsFailure,
  fetchFeaturedEventsSuccess,
  setCurrentEvent,
  updateFilters,
  clearFilters,
  addEvent,
  updateEvent,
  deleteEvent,
} = eventsSlice.actions;

export default eventsSlice.reducer;

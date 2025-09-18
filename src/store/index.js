import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventsReducer from './slices/eventsSlice';
import bookingReducer from './slices/bookingSlice';
import uiReducer from './slices/uiSlice';
import ticketsReducer from './slices/ticketsSlice';
import ticketTypesReducer from './slices/ticketTypesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    booking: bookingReducer,
    ui: uiReducer,
  tickets: ticketsReducer,
  ticketTypes: ticketTypesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

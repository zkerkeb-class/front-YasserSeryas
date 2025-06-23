import { useSelector, useDispatch } from 'react-redux';

// Hook personnalisé pour utiliser le dispatch
export const useAppDispatch = () => useDispatch();

// Hook personnalisé pour utiliser le selector avec type safety
export const useAppSelector = (selector) => useSelector(selector);

// Hooks spécifiques pour chaque slice
export const useAuth = () => {
  return useAppSelector(state => state.auth);
};

export const useEvents = () => {
  return useAppSelector(state => state.events);
};

export const useBooking = () => {
  return useAppSelector(state => state.booking);
};

export const useUI = () => {
  return useAppSelector(state => state.ui);
};

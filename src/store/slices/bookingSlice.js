import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentBooking: {
    event: null,
    tickets: [],
    totalAmount: 0,
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    paymentInfo: {
      method: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
  },
  bookingHistory: [],
  isLoading: false,
  error: null,
  bookingStep: 1, // 1: Event Selection, 2: Ticket Selection, 3: Personal Info, 4: Payment, 5: Confirmation
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    startBooking: (state, action) => {
      state.currentBooking.event = action.payload;
      state.bookingStep = 2;
      state.error = null;
    },
    updateTickets: (state, action) => {
      state.currentBooking.tickets = action.payload;
      state.currentBooking.totalAmount = action.payload.reduce(
        (total, ticket) => total + (ticket.price * ticket.quantity), 
        0
      );
    },
    updatePersonalInfo: (state, action) => {
      state.currentBooking.personalInfo = {
        ...state.currentBooking.personalInfo,
        ...action.payload,
      };
    },
    updatePaymentInfo: (state, action) => {
      state.currentBooking.paymentInfo = {
        ...state.currentBooking.paymentInfo,
        ...action.payload,
      };
    },
    setBookingStep: (state, action) => {
      state.bookingStep = action.payload;
    },
    nextStep: (state) => {
      if (state.bookingStep < 5) {
        state.bookingStep += 1;
      }
    },
    previousStep: (state) => {
      if (state.bookingStep > 1) {
        state.bookingStep -= 1;
      }
    },
    bookingStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    bookingSuccess: (state, action) => {
      state.isLoading = false;
      state.bookingHistory.unshift(action.payload);
      state.bookingStep = 5;
      state.error = null;
    },
    bookingFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetBooking: (state) => {
      state.currentBooking = initialState.currentBooking;
      state.bookingStep = 1;
      state.error = null;
    },
    fetchBookingHistorySuccess: (state, action) => {
      state.bookingHistory = action.payload;
    },
  },
});

export const {
  startBooking,
  updateTickets,
  updatePersonalInfo,
  updatePaymentInfo,
  setBookingStep,
  nextStep,
  previousStep,
  bookingStart,
  bookingSuccess,
  bookingFailure,
  resetBooking,
  fetchBookingHistorySuccess,
} = bookingSlice.actions;

export default bookingSlice.reducer;

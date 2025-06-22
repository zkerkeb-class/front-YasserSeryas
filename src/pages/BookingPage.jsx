import React, { useState } from 'react';
import BookingForm from '../components/BookingForm';
import BookingSummary from '../components/BookingSummary';
import BookingConfirmation from '../components/BookingConfirmation';

const BookingPage = () => {
  const [step, setStep] = useState('form'); // 'form', 'summary', 'confirmation'

  return (
    <div className="booking-page">
      <h2>Finaliser ma réservation</h2>
      {step === 'form' && <BookingForm setStep={setStep} />}
      {step === 'summary' && <BookingSummary setStep={setStep} />}
      {step === 'confirmation' && <BookingConfirmation />}
    </div>
  );
};

export default BookingPage;

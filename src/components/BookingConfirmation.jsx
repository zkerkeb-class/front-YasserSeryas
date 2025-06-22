import React from 'react';

const BookingConfirmation = () => {
  const confirmationNumber = "BME" + Date.now().toString().slice(-6);

  return (
    <div className="booking-confirmation">
      <div className="confirmation-icon">✓</div>
      <h3>Réservation confirmée</h3>
      
      <div className="confirmation-details">
        <p>Merci pour votre réservation !</p>
        <p>Numéro de confirmation: <strong>{confirmationNumber}</strong></p>
        <p>Un email de confirmation vous a été envoyé.</p>
      </div>

      <div className="confirmation-actions">
        <button className="btn-primary">
          Télécharger le billet
        </button>
        <button onClick={() => window.location.reload()}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;

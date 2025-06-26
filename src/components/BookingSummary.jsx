import React from 'react';

const BookingSummary = ({ setStep }) => {
  const bookingData = {
    event: "Concert Rock",
    date: "15 Juillet 2025",
    time: "20h00",
    location: "Salle Pleyel",
    tickets: 2,
    price: "45€",
    total: "90€"
  };

  return (
    <div className="booking-summary">
      <h3>Récapitulatif</h3>
      
      <div className="summary-section">
        <h4>Détails de l'événement</h4>
        <div className="summary-item">
          <span>Événement:</span>
          <span>{bookingData.event}</span>
        </div>
        <div className="summary-item">
          <span>Date:</span>
          <span>{bookingData.date}</span>
        </div>
        <div className="summary-item">
          <span>Heure:</span>
          <span>{bookingData.time}</span>
        </div>
        <div className="summary-item">
          <span>Lieu:</span>
          <span>{bookingData.location}</span>
        </div>
      </div>

      <div className="summary-section">
        <h4>Réservation</h4>
        <div className="summary-item">
          <span>Nombre de billets:</span>
          <span>{bookingData.tickets}</span>
        </div>
        <div className="summary-item">
          <span>Prix unitaire:</span>
          <span>{bookingData.price}</span>
        </div>
        <div className="summary-item total">
          <span>Total:</span>
          <span>{bookingData.total}</span>
        </div>
      </div>

      <div className="summary-actions">
        <button onClick={() => setStep('form')}>
          Modifier
        </button>
        <button 
          className="btn-primary"
          onClick={() => setStep('confirmation')}
        >
          Payer
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;

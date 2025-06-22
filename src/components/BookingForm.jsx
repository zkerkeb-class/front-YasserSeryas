import React, { useState } from 'react';

const BookingForm = ({ setStep }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    paymentMethod: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('summary');
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <section className="customer-info">
        <h3>Vos informations</h3>
        <input
          type="text"
          name="firstName"
          placeholder="Prénom"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Nom"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Téléphone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </section>

      <section className="payment-section">
        <h3>Paiement</h3>
        <label>Mode de paiement</label>
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          required
        >
          <option value="">Choisir...</option>
          <option value="card">Carte bancaire</option>
          <option value="paypal">PayPal</option>
          <option value="transfer">Virement</option>
          <option value="apple">Apple Pay</option>
        </select>
      </section>

      <button type="submit" className="btn-primary">
        Confirmer la réservation
      </button>
    </form>
  );
};

export default BookingForm;

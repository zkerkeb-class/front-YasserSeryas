import React, { useState } from 'react';

const AddEventForm = ({ onClose }) => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    capacity: ''
  });

  const handleChange = (e) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nouvel événement:', eventData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Ajouter un événement</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Titre"
            value={eventData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={eventData.description}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="time"
            value={eventData.time}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Lieu"
            value={eventData.location}
            onChange={handleChange}
            required
          />
          <select
            name="category"
            value={eventData.category}
            onChange={handleChange}
            required
          >
            <option value="">Choisir...</option>
            <option value="concert">Concert</option>
            <option value="theatre">Théâtre</option>
            <option value="conference">Conférence</option>
          </select>
          <input
            type="number"
            name="capacity"
            placeholder="Capacité"
            value={eventData.capacity}
            onChange={handleChange}
            required
          />
          <div className="form-actions">
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-primary">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventForm;

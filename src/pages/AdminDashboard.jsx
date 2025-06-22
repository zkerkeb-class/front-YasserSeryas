import React, { useState } from 'react';
import AddEventForm from '../components/AddEventForm';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddEvent, setShowAddEvent] = useState(false);

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h2>Dashboard Administrateur</h2>
        <button className="btn-logout">Déconnexion</button>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Événements</h3>
          <span className="stat-number">0</span>
        </div>
        <div className="stat-card">
          <h3>Réservations</h3>
          <span className="stat-number">0</span>
        </div>
        <div className="stat-card">
          <h3>Chiffre d'affaires</h3>
          <span className="stat-number">0€</span>
        </div>
      </div>

      <nav className="admin-nav">
        <button 
          className={activeTab === 'events' ? 'active' : ''}
          onClick={() => setActiveTab('events')}
        >
          Gestion des événements
        </button>
        <button 
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          Réservations
        </button>
      </nav>

      {activeTab === 'events' && (
        <div className="events-management">
          <button 
            className="btn-primary"
            onClick={() => setShowAddEvent(true)}
          >
            Ajouter un événement
          </button>
          {showAddEvent && (
            <AddEventForm onClose={() => setShowAddEvent(false)} />
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

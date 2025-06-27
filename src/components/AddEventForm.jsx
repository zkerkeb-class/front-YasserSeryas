import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';

const AddEventForm = ({ onClose }) => {
  const [eventData, setEventData] = useState({
    // Informations de l'événement
    title: '',
    description: '',
    date: '',
    time: '',
    location: {
      address: {
        street: '',
        city: '',
      postalCode: '',
      country: 'France',
        },
   

    },
    category: '',
    totalCapacity: '',
    
    // Configuration du ticket type automatique "Standard"
    defaultTicketPrice: 25,
    defaultTicketQuantity: 100,
    currency: 'EUR',
    maxPerPurchase: 10,
    
    // Options avancées (optionnelles)
    saleStartDate: '',
    saleEndDate: '',
    createBasicTicket: true // Option pour créer ou non le ticket automatique
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

 const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  // Pour les cases à cocher
  const fieldValue = type === 'checkbox' ? checked : value;

  // Gère les champs imbriqués avec la notation "a.b.c"
  const keys = name.split('.');
  setEventData(prev => {
    let updated = { ...prev };
    let obj = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      // Crée l'objet intermédiaire si besoin
      obj[keys[i]] = { ...obj[keys[i]] };
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = fieldValue;
    return updated;
  });
};


  const formatEventDataForAPI = () => {
    const formattedData = {
      // Données de l'événement
      name: eventData.title,
      description: eventData.description,
      startDate: new Date(`${eventData.date}T${eventData.time}`).toISOString(),
      endDate: new Date(`${eventData.endDate}T${eventData.time}`).toISOString(), // Même date/heure pour simplifier
location: {
    ...eventData.location,
    address: {
      ...eventData.location.address
      
    }
  },
      category: eventData.category,
      totalCapacity: parseInt(eventData.totalCapacity),
      
      // Configuration du ticket type automatique (si activé)
      ...(eventData.createBasicTicket && {
        defaultTicketPrice: parseFloat(eventData.defaultTicketPrice),
        defaultTicketQuantity: parseInt(eventData.defaultTicketQuantity),
        currency: eventData.currency,
        maxPerPurchase: parseInt(eventData.maxPerPurchase),
        saleStartDate: eventData.saleStartDate || new Date().toISOString(),
        saleEndDate: new Date(`${eventData.endDate}T${eventData.time}`).toISOString() || null
      })
    };

    return formattedData;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const formattedData = formatEventDataForAPI();
    
    // Appel à l'API avec l'URL complète
    const response = await fetch('http://localhost:3000/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(formattedData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la création de l\'événement');
    }

    const result = await response.json();
    alert(`Événement "${result.title}" créé avec succès ! ${eventData.createBasicTicket ? 'Un ticket "Standard" a été automatiquement ajouté.' : ''}`);
    onClose();
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-blue-600 mb-6 text-center">Ajouter un événement</h3>
        
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Informations principales de l'événement */}
          <Typography variant="h6" className="text-gray-700 font-semibold">
            📅 Informations de l'événement
          </Typography>
          
          <TextField
            label="Titre de l'événement"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            placeholder="Ex: Festival Jazz 2025"
          />
          
          <TextField
            label="Description"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            fullWidth
            required
            multiline
            minRows={3}
            variant="outlined"
            placeholder="Décrivez votre événement..."
          />
          
          <Box className="flex gap-4">
            <TextField
              label="Date"
              name="date"
              type="date"
              value={eventData.date}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
             <TextField
              label="Date de fin"
              name="endDate"
              type="date"
              value={eventData.endDate}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
            <TextField
              label="Heure"
              name="time"
              type="time"
              value={eventData.time}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Box>

          {/* Localisation */}
          <Box className="flex gap-4">
             <TextField
              label="Nom du lieu"
              name="location.name"
              value={eventData.location.name}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              placeholder="123 rue de la Paix"
            />
            <TextField
              label="Adresse"
              name="location.address.street"
              value={eventData.location.address.street}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              placeholder="123 rue de la Paix"
            />
            <TextField
              label="Ville"
              name="location.address.city"
              value={eventData.location.address.city}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              placeholder="Paris"
            />
              <TextField
              label="Code postal"
              name="location.address.postalCode"
              value={eventData.location.address.postalCode}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              placeholder="Paris"
            />
          </Box>

          <Box className="flex gap-4">
            <FormControl fullWidth required>
              <InputLabel id="category-label">Catégorie</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={eventData.category}
                label="Catégorie"
                onChange={handleChange}
              >
                <MenuItem value=""><em>Choisir...</em></MenuItem>
                <MenuItem value="concert">Concert</MenuItem>
                <MenuItem value="theatre">Théâtre</MenuItem>
                <MenuItem value="conference">Conférence</MenuItem>
                <MenuItem value="festival">Festival</MenuItem>
                <MenuItem value="spectacle">Spectacle</MenuItem>
                <MenuItem value="sport">Sport</MenuItem>
                <MenuItem value="autre">Autre</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Capacité totale"
              name="totalCapacity"
              type="number"
              value={eventData.totalCapacity}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              inputProps={{ min: 1 }}
              placeholder="1000"
            />
          </Box>

          <Divider className="my-6" />

          {/* Configuration du ticket automatique */}
          <Typography variant="h6" className="text-gray-700 font-semibold">
            🎫 Configuration du ticket Standard (automatique)
          </Typography>
          
          <FormControlLabel
            control={
              <Checkbox
                checked={eventData.createBasicTicket}
                onChange={handleChange}
                name="createBasicTicket"
                color="primary"
              />
            }
            label="Créer automatiquement un ticket 'Standard' pour cet événement"
          />

          {eventData.createBasicTicket && (
            <Box className="bg-blue-50 p-4 rounded-lg space-y-4">
              <Typography variant="body2" className="text-gray-600 mb-3">
                Un ticket type "Standard" sera automatiquement créé avec les paramètres suivants :
              </Typography>
              
              <Box className="flex gap-4">
                <TextField
                  label="Prix du ticket Standard"
                  name="defaultTicketPrice"
                  type="number"
                  value={eventData.defaultTicketPrice}
                  onChange={handleChange}
                  variant="outlined"
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    endAdornment: <span className="text-gray-500">€</span>
                  }}
                />
                
                <TextField
                  label="Quantité disponible"
                  name="defaultTicketQuantity"
                  type="number"
                  value={eventData.defaultTicketQuantity}
                  onChange={handleChange}
                  variant="outlined"
                  inputProps={{ min: 1 }}
                />
              </Box>

              <Box className="flex gap-4">
                <FormControl>
                  <InputLabel id="currency-label">Devise</InputLabel>
                  <Select
                    labelId="currency-label"
                    name="currency"
                    value={eventData.currency}
                    label="Devise"
                    onChange={handleChange}
                    style={{ minWidth: 120 }}
                  >
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="GBP">GBP (£)</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Max par achat"
                  name="maxPerPurchase"
                  type="number"
                  value={eventData.maxPerPurchase}
                  onChange={handleChange}
                  variant="outlined"
                  inputProps={{ min: 1, max: 50 }}
                />
              </Box>

              <Typography variant="body2" className="text-green-600 mt-2">
                ✨ Vous pourrez ajouter d'autres types de billets (VIP, Étudiant, etc.) après la création de l'événement.
              </Typography>
            </Box>
          )}

          {/* Boutons d'action */}
          <div className="flex justify-end gap-3 pt-6">
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer l\'événement'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventForm;
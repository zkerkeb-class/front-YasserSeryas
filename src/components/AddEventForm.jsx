import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';

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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <h3 className="text-2xl font-bold text-blue-600 mb-6 text-center">Ajouter un événement</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <TextField
            label="Titre"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
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
          <TextField
            label="Lieu"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />
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
            </Select>
          </FormControl>
          <TextField
            label="Capacité"
            name="capacity"
            type="number"
            value={eventData.capacity}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            inputProps={{ min: 0 }}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Ajouter
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventForm;

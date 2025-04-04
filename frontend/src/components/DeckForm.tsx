import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Container, Typography, Alert, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import deckService from '../services/deckService';
import authService from '../services/authService';

const DeckForm: React.FC = () => {
  const navigate = useNavigate();
  const { deckId } = useParams<{ deckId: string }>();
  const [deck, setDeck] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (deckId) {
      setIsEdit(true);
      const fetchDeck = async () => {
        try {
          setLoading(true);
          const response = await deckService.getById(parseInt(deckId));
          setDeck({
            title: response.data.title || '',
            description: response.data.description || ''
          });
          setLoading(false);
        } catch (err) {
          console.error('Error fetching deck:', err);
          setError('Failed to load deck information');
          setLoading(false);
        }
      };
      fetchDeck();
    }
  }, [deckId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deck.title.trim()) {
      setError('Please enter a deck title');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Get the current user
      const currentUser = authService.getCurrentUser();
      
      // Add user_id to the deck data
      const deckWithUser = {
        ...deck,
        user_id: currentUser?.id ? parseInt(currentUser.id) : 1 // Use current user ID if available, fallback to test user
      };
      
      if (isEdit && deckId) {
        await deckService.update(parseInt(deckId), deckWithUser);
        navigate('/decks');
      } else {
        await deckService.create(deckWithUser);
        navigate('/decks');
      }
    } catch (error: any) {
      console.error('Error saving deck:', error);
      
      // Extract more specific error information
      let errorMessage = 'Failed to save deck. Please try again.';
      
      if (error.response) {
        // The server responded with an error status
        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid deck information. Please check your inputs.';
        } else if (error.response.status === 409) {
          errorMessage = 'A deck with this information already exists.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Unable to connect to the server. Please check your connection.';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEdit ? 'Edit Deck' : 'Create New Deck'}
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Deck Title"
            fullWidth
            required
            margin="normal"
            value={deck.title}
            onChange={(e) => setDeck({ ...deck, title: e.target.value })}
            disabled={loading}
            error={!deck.title && error !== ''}
            helperText={!deck.title && error !== '' ? 'Title is required' : ''}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={deck.description}
            onChange={(e) => setDeck({ ...deck, description: e.target.value })}
            disabled={loading}
          />
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ mt: 2 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : (isEdit ? 'Update Deck' : 'Create Deck')}
          </Button>
          <Button
            variant="outlined"
            sx={{ mt: 2, ml: 2 }}
            onClick={() => navigate('/decks')}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default DeckForm; 
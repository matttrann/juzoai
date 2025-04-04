import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import deckService, { Flashcard } from '../services/deckService';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';

interface FlashcardInput {
  front: string;
  back: string;
}

const FlashcardForm: React.FC = () => {
  const navigate = useNavigate();
  const { deckId } = useParams<{ deckId: string }>();
  const [flashcard, setFlashcard] = useState<FlashcardInput>({ front: '', back: '' });
  const [existingCards, setExistingCards] = useState<Flashcard[]>([]);
  const [deckTitle, setDeckTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingCardId, setEditingCardId] = useState<number | null>(null);

  useEffect(() => {
    if (!deckId) {
      navigate('/decks');
      return;
    }

    const fetchDeckAndCards = async () => {
      try {
        setLoading(true);
        // Fetch deck info
        const deckResponse = await deckService.getById(parseInt(deckId));
        setDeckTitle(deckResponse.data.title || 'Deck');
        
        // Fetch cards
        const cardsResponse = await deckService.getFlashcards(parseInt(deckId));
        setExistingCards(cardsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching deck or cards:', error);
        setError('Failed to load deck information and cards');
        setLoading(false);
      }
    };
    
    fetchDeckAndCards();
  }, [deckId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deckId) return;
    
    if (!flashcard.front.trim() || !flashcard.back.trim()) {
      setError('Both front and back content are required');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (editingCardId !== null) {
        // Update existing card
        await deckService.updateFlashcard(
          parseInt(deckId), 
          editingCardId, 
          { ...flashcard, id: editingCardId }
        );
        setSuccess('Flashcard updated successfully');
      } else {
        // Create new card
        await deckService.addFlashcard(parseInt(deckId), flashcard);
        setSuccess('Flashcard added successfully');
      }
      
      // Refresh cards list
      const cardsResponse = await deckService.getFlashcards(parseInt(deckId));
      setExistingCards(cardsResponse.data);
      
      // Reset form
      setFlashcard({ front: '', back: '' });
      setEditingCardId(null);
      setLoading(false);
    } catch (error: any) {
      console.error('Error saving flashcard:', error);
      
      let errorMessage = 'Failed to save flashcard. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleEditCard = (card: Flashcard) => {
    setFlashcard({ front: card.front, back: card.back });
    setEditingCardId(card.id ?? null);
    setError('');
    setSuccess('');
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!deckId || !window.confirm('Are you sure you want to delete this flashcard?')) return;
    
    try {
      setLoading(true);
      await deckService.deleteFlashcard(parseInt(deckId), cardId);
      
      // Refresh cards list
      const cardsResponse = await deckService.getFlashcards(parseInt(deckId));
      setExistingCards(cardsResponse.data);
      
      setSuccess('Flashcard deleted successfully');
      setLoading(false);
    } catch (error: any) {
      console.error('Error deleting flashcard:', error);
      setError('Failed to delete flashcard. Please try again.');
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFlashcard({ front: '', back: '' });
    setEditingCardId(null);
    setError('');
    setSuccess('');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3 
        }}>
          <Typography variant="h4" component="h1">
            {deckTitle} - Manage Flashcards
          </Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/decks')}
            variant="outlined"
          >
            Back to Decks
          </Button>
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {editingCardId ? 'Edit Flashcard' : 'Add New Flashcard'}
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Front (Question)"
              fullWidth
              required
              margin="normal"
              value={flashcard.front}
              onChange={(e) => setFlashcard({ ...flashcard, front: e.target.value })}
              disabled={loading}
              multiline
              rows={2}
            />
            <TextField
              label="Back (Answer)"
              fullWidth
              required
              margin="normal"
              value={flashcard.back}
              onChange={(e) => setFlashcard({ ...flashcard, back: e.target.value })}
              disabled={loading}
              multiline
              rows={2}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : (editingCardId ? <EditIcon /> : <AddIcon />)}
              >
                {loading ? 'Saving...' : (editingCardId ? 'Update Flashcard' : 'Add Flashcard')}
              </Button>
              
              {editingCardId && (
                <Button
                  variant="outlined"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Cancel Edit
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Flashcards in this Deck ({existingCards.length})
          </Typography>
          
          {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 3 }} />}
          
          {!loading && existingCards.length === 0 && (
            <Alert severity="info">
              No flashcards added yet. Create your first flashcard above.
            </Alert>
          )}
          
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2,
            mt: 2
          }}>
            {existingCards.map((card) => (
              <Card 
                key={card.id} 
                sx={{ 
                  minWidth: 300, 
                  flex: '1 1 calc(50% - 16px)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Front:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                    {card.front}
                  </Typography>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Back:
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {card.back}
                  </Typography>
                </CardContent>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                  <IconButton onClick={() => handleEditCard(card)} title="Edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => card.id !== undefined ? handleDeleteCard(card.id) : null} 
                    title="Delete"
                    disabled={card.id === undefined}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/decks`)}
          >
            Back to Decks
          </Button>
          
          <Button 
            variant="contained" 
            startIcon={<SchoolIcon />}
            onClick={() => navigate(`/decks/${deckId}/study`)}
            color="primary"
            disabled={existingCards.length === 0}
          >
            Study This Deck
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default FlashcardForm; 
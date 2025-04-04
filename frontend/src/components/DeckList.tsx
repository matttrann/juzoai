import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  TextField,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import deckService, { Deck } from '../services/deckService';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { exportDeck, parseImportedDeck } from '../utils/deckExporter';
import { useAppLoadingBar, useLoadingApi } from '../contexts/LoadingBarContext';
import { withLoading } from '../utils/loadingUtils';

const DeckList: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importError, setImportError] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadingBar = useAppLoadingBar();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('title');

  // Use the loading API
  const api = useLoadingApi();

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        setLoading(true);
        // Use the loading API instead of direct API call
        const response = await api.get<Deck[]>('/decks');
        const decks = response.data;
        
        // Your existing code to handle the response
        // ...
        
        setDecks(decks);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching decks:', error);
        setError('Failed to load decks. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDecks();
  }, [searchTerm, sortOption, api]);

  const handleExportDeck = async (deck: Deck) => {
    try {
      if (!deck.id) {
        setError('Cannot export deck: missing ID');
        return;
      }
      
      // Fetch flashcards for this deck
      const response = await deckService.getFlashcards(deck.id);
      const flashcards = response.data;
      
      // Export the deck with its flashcards
      await exportDeck(deck, flashcards);
    } catch (error) {
      console.error('Error exporting deck:', error);
      setError('Failed to export deck. Please try again.');
    }
  };

  const handleImportClick = () => {
    setImportDialogOpen(true);
    setImportError('');
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setImportLoading(true);
    setImportError('');
    
    try {
      const importedDeck = await parseImportedDeck(file);
      
      // Create the deck
      const newDeck: Deck = {
        title: importedDeck.title,
        description: importedDeck.description
      };
      
      const deckResponse = await deckService.create(newDeck);
      const createdDeck = deckResponse.data;
      
      // Add flashcards to the deck
      const promises = importedDeck.flashcards.map(card => 
        deckService.addFlashcard(createdDeck.id!, { 
          front: card.front, 
          back: card.back 
        })
      );
      
      await Promise.all(promises);
      
      // Refresh decks list
      const response = await deckService.getAll();
      setDecks(response.data);
      
      setImportDialogOpen(false);
      setImportLoading(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error importing deck:', error);
      setImportError('Failed to import deck. Please check the file format.');
      setImportLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ pt: 2 }}>
        <Typography>Loading decks...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ pt: 2 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="xl" sx={{ pt: { xs: 1, sm: 2 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: { xs: 2, sm: 3 }
        }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1"
            sx={{ mb: { xs: 2, sm: 0 } }}
          >
            My Decks
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {!isMobile && (
              <>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/decks/new')}
                >
                  Create New Deck
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FileUploadIcon />}
                  onClick={handleImportClick}
                >
                  Import Deck
                </Button>
              </>
            )}
          </Box>
        </Box>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {decks.map((deck) => (
            <div
              key={deck.id}
              style={{
                width: isMobile ? '100%' : '350px',
                flexGrow: 0,
                flexShrink: 0,
                margin: '8px'
              }}
            >
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[6]
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {deck.title}
                  </Typography>
                  <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                    {deck.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {deck.cardCount} cards
                  </Typography>
                </CardContent>
                <Box sx={{ 
                  p: 2, 
                  pt: 0,
                  display: 'flex', 
                  justifyContent: 'flex-start',
                  gap: 1,
                  flexWrap: 'wrap'
                }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<SchoolIcon />}
                    onClick={() => navigate(`/decks/${deck.id}/study`)}
                  >
                    Study
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/decks/${deck.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => navigate(`/decks/${deck.id}/flashcards/new`)}
                  >
                    Cards
                  </Button>
                  <Tooltip title="Export Deck">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<FileDownloadIcon />}
                      onClick={() => handleExportDeck(deck)}
                    >
                      Export
                    </Button>
                  </Tooltip>
                </Box>
              </Card>
            </div>
          ))}
        </div>
      </Container>
      
      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)}>
        <DialogTitle>Import Deck</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Import a flashcard deck from a JSON file. The file should contain a title, description, and a list of flashcards.
          </Typography>
          
          {importError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {importError}
            </Alert>
          )}
          
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleFileSelect}
              startIcon={<FileUploadIcon />}
              disabled={importLoading}
            >
              {importLoading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Importing...
                </>
              ) : (
                'Select File'
              )}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)} disabled={importLoading}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Floating action button for mobile */}
      {isMobile && (
        <>
          <Fab 
            color="primary" 
            aria-label="add deck"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={() => navigate('/decks/new')}
          >
            <AddIcon />
          </Fab>
          <Fab 
            color="secondary" 
            aria-label="import deck"
            sx={{ position: 'fixed', bottom: 16, right: 80 }}
            onClick={handleImportClick}
          >
            <FileUploadIcon />
          </Fab>
        </>
      )}
    </>
  );
};

export default DeckList; 
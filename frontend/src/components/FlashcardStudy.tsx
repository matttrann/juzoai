import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Divider,
  LinearProgress,
  Chip,
  ButtonGroup,
  Snackbar
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import EditIcon from '@mui/icons-material/Edit';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';
import RepeatIcon from '@mui/icons-material/Repeat';
import deckService, { Flashcard } from '../services/deckService';
import performanceService from '../services/performanceService';
import { useAuth } from '../contexts/AuthContext';
import './FlashcardStudy.css';

interface StudyState {
  currentIndex: number;
  isFlipped: boolean;
  completed: boolean;
  shuffleMode: boolean;
  cards: Flashcard[];
  originalOrder: number[];
  progress: number;
  totalCards: number;
  cardsReviewed: number;
  correctAnswers: number;
}

const FlashcardStudy: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deckTitle, setDeckTitle] = useState('');
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const [studyState, setStudyState] = useState<StudyState>({
    currentIndex: 0,
    isFlipped: false,
    completed: false,
    shuffleMode: false,
    cards: [],
    originalOrder: [],
    progress: 0,
    totalCards: 0,
    cardsReviewed: 0,
    correctAnswers: 0
  });

  useEffect(() => {
    const fetchCards = async () => {
      if (!deckId) return;
      
      try {
        setLoading(true);
        
        // Fetch deck info
        const deckResponse = await deckService.getById(parseInt(deckId));
        setDeckTitle(deckResponse.data.title || 'Flashcards');
        
        // Fetch flashcards
        const response = await deckService.getFlashcards(parseInt(deckId));
        const cards = response.data;
        
        if (cards.length === 0) {
          setError('This deck has no flashcards. Add some first!');
          setLoading(false);
          return;
        }
        
        // Initialize original order
        const originalOrder = cards.map((_, index) => index);
        
        setStudyState(prev => ({
          ...prev,
          cards,
          originalOrder,
          totalCards: cards.length,
          progress: 0
        }));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        setError('Failed to load flashcards. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchCards();
  }, [deckId]);

  useEffect(() => {
    // Update username when user changes
    if (user?.username) {
      // We don't need to set username anymore since we removed that state
      // This effect can be removed or kept empty for future use
    }
  }, [user]);

  useEffect(() => {
    // Automatically save progress when study is completed
    const autoSaveProgress = async () => {
      // Check if study is completed and score hasn't been submitted yet
      if (studyState.completed && !scoreSubmitted) {
        // Don't need to check for username anymore, as we have the user from auth context
        if (user) {
          // Use the authenticated user to automatically submit the score
          try {
            const score = Math.round((studyState.correctAnswers / studyState.totalCards) * 100);
            
            await performanceService.submitScore({
              username: user.username,
              score: score,
              deckId: parseInt(deckId || '0'),
              deckTitle: deckTitle,
              timestamp: new Date().toISOString(),
              cards_studied: studyState.totalCards,
              cards_correct: studyState.correctAnswers,
              study_duration: 0 // We're not tracking duration yet
            });
            
            setScoreSubmitted(true);
            setSnackbarMessage('Progress automatically saved!');
            setSnackbarOpen(true);
          } catch (error) {
            console.error('Error auto-saving progress:', error);
            setSnackbarMessage('Error saving progress. Your results may not be recorded.');
            setSnackbarOpen(true);
          }
        } else {
          // If no user is logged in, use a guest name
          try {
            const guestName = localStorage.getItem('flashcardUsername') || 'Guest';
            const score = Math.round((studyState.correctAnswers / studyState.totalCards) * 100);
            
            await performanceService.submitScore({
              username: guestName,
              score: score,
              deckId: parseInt(deckId || '0'),
              deckTitle: deckTitle,
              timestamp: new Date().toISOString(),
              cards_studied: studyState.totalCards,
              cards_correct: studyState.correctAnswers,
              study_duration: 0 // We're not tracking duration yet
            });
            
            setScoreSubmitted(true);
            setSnackbarMessage('Progress saved as guest!');
            setSnackbarOpen(true);
          } catch (error) {
            console.error('Error auto-saving progress:', error);
            setSnackbarMessage('Error saving progress. Your results may not be recorded.');
            setSnackbarOpen(true);
          }
        }
      }
    };
    
    autoSaveProgress();
  }, [studyState.completed, scoreSubmitted, studyState.correctAnswers, studyState.totalCards, deckId, deckTitle, user]);

  const handleFlip = () => {
    setStudyState(prev => ({
      ...prev,
      isFlipped: !prev.isFlipped
    }));
  };

  const handlePrevious = () => {
    if (studyState.currentIndex > 0) {
      setStudyState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1,
        isFlipped: false
      }));
    }
  };

  const handleNext = () => {
    const nextIndex = studyState.currentIndex + 1;
    
    if (nextIndex < studyState.cards.length) {
      setStudyState(prev => ({
        ...prev,
        currentIndex: nextIndex,
        isFlipped: false,
        cardsReviewed: prev.cardsReviewed + 1,
        progress: (nextIndex / prev.totalCards) * 100
      }));
    } else {
      // Study session completed
      setStudyState(prev => ({
        ...prev,
        completed: true,
        cardsReviewed: prev.totalCards,
        progress: 100
      }));
      
      // Show completion message
      setSnackbarMessage('Study session completed! Progress is being saved automatically.');
      setSnackbarOpen(true);
    }
  };

  const handleSelfRating = (isCorrect: boolean) => {
    const nextIndex = studyState.currentIndex + 1;
    const newCorrectAnswers = isCorrect 
      ? studyState.correctAnswers + 1 
      : studyState.correctAnswers;
    
    if (nextIndex < studyState.cards.length) {
      setStudyState(prev => ({
        ...prev,
        currentIndex: nextIndex,
        isFlipped: false,
        cardsReviewed: prev.cardsReviewed + 1,
        correctAnswers: newCorrectAnswers,
        progress: (nextIndex / prev.totalCards) * 100
      }));
    } else {
      // Study session completed
      setStudyState(prev => ({
        ...prev,
        completed: true,
        cardsReviewed: prev.totalCards,
        correctAnswers: newCorrectAnswers,
        progress: 100
      }));
      
      // Show completion message
      setSnackbarMessage('Study session completed! Progress is being saved automatically.');
      setSnackbarOpen(true);
    }
  };

  const toggleShuffleMode = () => {
    if (studyState.shuffleMode) {
      // Turn off shuffle - restore original order
      const sortedCards = new Array(studyState.cards.length);
      studyState.originalOrder.forEach((originalIndex, currentIndex) => {
        // Find the card with the matching original index
        const card = studyState.cards.find((_, i) => 
          studyState.originalOrder[i] === currentIndex
        );
        if (card) {
          sortedCards[currentIndex] = card;
        }
      });
      
      setStudyState(prev => ({
        ...prev,
        shuffleMode: false,
        cards: sortedCards,
        currentIndex: 0,
        isFlipped: false
      }));
    } else {
      // Turn on shuffle - randomize cards
      const shuffledCards = [...studyState.cards];
      const newOriginalOrder = studyState.cards.map((_, index) => index);
      
      // Fisher-Yates shuffle algorithm
      for (let i = shuffledCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
        [newOriginalOrder[i], newOriginalOrder[j]] = [newOriginalOrder[j], newOriginalOrder[i]];
      }
      
      setStudyState(prev => ({
        ...prev,
        shuffleMode: true,
        cards: shuffledCards,
        originalOrder: newOriginalOrder,
        currentIndex: 0,
        isFlipped: false
      }));
    }
  };

  const resetStudy = () => {
    // If in shuffle mode, restore original order first
    let resetCards = studyState.cards;
    if (studyState.shuffleMode) {
      resetCards = new Array(studyState.cards.length);
      studyState.originalOrder.forEach((originalIndex, currentIndex) => {
        const card = studyState.cards.find((_, i) => 
          studyState.originalOrder[i] === currentIndex
        );
        if (card) {
          resetCards[currentIndex] = card;
        }
      });
    }
    
    setStudyState(prev => ({
      ...prev,
      currentIndex: 0,
      isFlipped: false,
      completed: false,
      progress: 0,
      cardsReviewed: 0,
      correctAnswers: 0,
      shuffleMode: false,
      cards: resetCards,
      originalOrder: resetCards.map((_, index) => index)
    }));
    setScoreSubmitted(false);
  };

  const handleViewPerformance = () => {
    navigate(deckId ? `/performance/deck/${deckId}` : '/performance');
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading flashcards...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (studyState.completed) {
    const score = Math.round((studyState.correctAnswers / studyState.totalCards) * 100);
    
    return (
      <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 } }}>
        <Card>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              Study Session Complete!
            </Typography>
            
            <Box sx={{ 
              my: 3, 
              textAlign: 'center',
              bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(0, 200, 83, 0.1)' 
                : 'rgba(0, 200, 83, 0.05)',
              p: 3,
              borderRadius: 2
            }}>
              <Typography 
                variant="h5" 
                color="primary" 
                gutterBottom
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: 1
                }}
              >
                <EmojiEventsIcon fontSize="large" /> Your Score: {score}%
              </Typography>
              <Typography variant="body1">
                You got {studyState.correctAnswers} out of {studyState.totalCards} cards correct.
              </Typography>
              
              {scoreSubmitted && (
                <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                  Progress saved automatically!
                </Typography>
              )}
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center', 
              flexWrap: 'wrap',
              gap: 2, 
              mt: 4 
            }}>
              <Button
                variant="contained"
                onClick={resetStudy}
              >
                Study Again
              </Button>
              
              {!scoreSubmitted ? (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<EmojiEventsIcon />}
                  onClick={handleViewPerformance}
                >
                  View Performance
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<BarChartIcon />}
                  onClick={handleViewPerformance}
                >
                  View Performance
                </Button>
              )}
              
              <Button
                variant="outlined"
                onClick={() => navigate(`/decks/${deckId}/flashcards/new`)}
              >
                Add Flashcards
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 } }}>
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            {deckTitle} - Study
          </Typography>
          
          <Box sx={{ my: 3 }}>
            <LinearProgress 
              variant="determinate" 
              value={studyState.progress} 
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary" align="center">
              Card {studyState.currentIndex + 1} of {studyState.totalCards}
            </Typography>
          </Box>
          
          {/* Flashcard display */}
          <Box
            className={`flashcard ${studyState.isFlipped ? 'flipped' : ''}`}
            onClick={handleFlip}
            sx={{
              height: { xs: '200px', sm: '250px', md: '300px' },
              width: { xs: '100%', sm: '90%', md: '80%' },
              mx: 'auto',
              perspective: '1000px',
              my: 4,
              cursor: 'pointer'
            }}
          >
            <Box className="flashcard-inner" sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s',
              transform: studyState.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              boxShadow: 3,
              borderRadius: 2
            }}>
              <Box className="flashcard-front" sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper
              }}>
                <Typography variant="h5" align="center">
                  {studyState.cards[studyState.currentIndex]?.front || 'No content'}
                </Typography>
              </Box>
              <Box className="flashcard-back" sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                borderRadius: 2,
                backgroundColor: theme.palette.mode === 'dark' ? '#2d3748' : '#f5f5f5'
              }}>
                <Typography variant="h5" align="center">
                  {studyState.cards[studyState.currentIndex]?.back || 'No content'}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }}>
            <Chip label={studyState.isFlipped ? "ANSWER" : "QUESTION"} />
          </Divider>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            mt: 2,
            mb: 1
          }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handlePrevious}
              disabled={studyState.currentIndex === 0}
            >
              Previous
            </Button>
            
            <Button
              variant="contained"
              onClick={handleFlip}
              sx={{ minWidth: '120px' }}
            >
              {studyState.isFlipped ? 'Show Front' : 'Show Back'}
            </Button>
            
            <Button
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              onClick={handleNext}
              disabled={studyState.currentIndex === studyState.cards.length - 1}
            >
              Next
            </Button>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: 2, 
            mt: 4 
          }}>
            <Button
              variant="outlined"
              startIcon={<ShuffleIcon />}
              onClick={toggleShuffleMode}
              color={studyState.shuffleMode ? "secondary" : "primary"}
            >
              {studyState.shuffleMode ? 'Turn Off Shuffle' : 'Shuffle Cards'}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<RepeatIcon />}
              onClick={resetStudy}
            >
              Reset Study
            </Button>
          </Box>
          
          {studyState.isFlipped && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body1" gutterBottom>
                Rate your knowledge:
              </Typography>
              <ButtonGroup variant="contained" sx={{ mt: 1 }}>
                <Button 
                  color="error" 
                  onClick={() => handleSelfRating(false)}
                >
                  Incorrect
                </Button>
                <Button 
                  color="success" 
                  onClick={() => handleSelfRating(true)}
                >
                  Correct
                </Button>
              </ButtonGroup>
            </Box>
          )}
        </CardContent>
      </Card>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default FlashcardStudy;
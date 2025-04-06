import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import CasinoIcon from '@mui/icons-material/Casino';

interface PracticeProblem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  submissions?: number;
  successRate?: number;
  likes?: number;
  path: string;
  category: string;
  isBlind75: boolean;
  implemented?: boolean;
}

const ProblemRoulette: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [blind75Only, setBlind75Only] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<PracticeProblem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const rouletteWrapperRef = useRef<HTMLDivElement>(null);

  // Blind 75 Problems List (same as in Problems.tsx)
  const practiceProblems: PracticeProblem[] = [
    // Arrays & Hashing
    { id: 1, title: 'Two Sum', difficulty: 'Easy', submissions: 35100, successRate: 100, likes: 98, path: 'two-sum', category: 'Arrays & Hashing', isBlind75: true, implemented: true },
    { id: 2, title: 'Contains Duplicate', difficulty: 'Easy', submissions: 16700, successRate: 99, likes: 97, path: 'contains-duplicate', category: 'Arrays & Hashing', isBlind75: true, implemented: true },
    { id: 3, title: 'Valid Anagram', difficulty: 'Easy', submissions: 14700, successRate: 99, likes: 99, path: 'valid-anagram', category: 'Arrays & Hashing', isBlind75: true, implemented: true },
    { id: 4, title: 'Group Anagrams', difficulty: 'Medium', submissions: 4200, successRate: 96, likes: 95, path: 'group-anagrams', category: 'Arrays & Hashing', isBlind75: true, implemented: false },
    { id: 5, title: 'Top K Frequent Elements', difficulty: 'Medium', submissions: 5400, successRate: 96, likes: 94, path: 'top-k-frequent', category: 'Arrays & Hashing', isBlind75: true, implemented: false },
    
    // Two Pointers
    { id: 10, title: 'Valid Palindrome', difficulty: 'Easy', submissions: 6100, successRate: 100, likes: 96, path: 'valid-palindrome', category: 'Two Pointers', isBlind75: true, implemented: true },
    
    // Sliding Window
    { id: 15, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', submissions: 5100, successRate: 100, likes: 98, path: 'best-time-to-buy-sell-stock', category: 'Sliding Window', isBlind75: true, implemented: true },
    
    // Stack
    { id: 19, title: 'Valid Parentheses', difficulty: 'Easy', submissions: 4000, successRate: 100, likes: 99, path: 'valid-parentheses', category: 'Stack', isBlind75: true, implemented: true },
    
    // Binary Search
    { id: 26, title: 'Binary Search', difficulty: 'Easy', submissions: 7900, successRate: 99, likes: 98, path: 'binary-search', category: 'Binary Search', isBlind75: true, implemented: true },
    
    // Linked List
    { id: 30, title: 'Reverse Linked List', difficulty: 'Easy', submissions: 8700, successRate: 98, likes: 99, path: 'reverse-linked-list', category: 'Linked List', isBlind75: true, implemented: true },
    { id: 31, title: 'Merge Two Sorted Lists', difficulty: 'Easy', submissions: 2500, successRate: 100, likes: 98, path: 'merge-two-lists', category: 'Linked List', isBlind75: true, implemented: true },
    
    // Trees
    { id: 34, title: 'Invert Binary Tree', difficulty: 'Easy', submissions: 9800, successRate: 99, likes: 100, path: 'invert-binary-tree', category: 'Trees', isBlind75: true, implemented: true },
    { id: 35, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', submissions: 9500, successRate: 100, likes: 99, path: 'max-depth-binary-tree', category: 'Trees', isBlind75: true, implemented: true },
    { id: 36, title: 'Same Tree', difficulty: 'Easy', submissions: 1900, successRate: 100, likes: 96, path: 'same-tree', category: 'Trees', isBlind75: true, implemented: true },
    
    // Math
    { id: 39, title: 'Palindrome Number', difficulty: 'Easy', submissions: 1600, successRate: 97, likes: 92, path: 'palindrome-number', category: 'Math', isBlind75: false, implemented: true },
    { id: 40, title: 'Fizz Buzz', difficulty: 'Easy', submissions: 1400, successRate: 98, likes: 91, path: 'fizz-buzz', category: 'Math', isBlind75: false, implemented: true },
    { id: 41, title: 'Roman to Integer', difficulty: 'Easy', submissions: 1100, successRate: 95, likes: 90, path: 'roman-to-integer', category: 'Math', isBlind75: false, implemented: true },
  ];

  const getDifficultyColor = (difficulty: string): string => {
    switch(difficulty) {
      case 'Easy': return '#90caf9';  // Blue (primary color)
      case 'Medium': return '#ffb74d'; // Orange
      case 'Hard': return '#f48fb1';   // Pink (secondary color)
      default: return '#90caf9';
    }
  };

  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setDifficultyFilter(event.target.value);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };

  const handleBlind75FilterChange = (event: SelectChangeEvent) => {
    setBlind75Only(event.target.value === 'true');
  };

  // Get all unique categories
  const categories = ['All', ...Array.from(new Set(practiceProblems.map(problem => problem.category)))];

  // Filter problems based on filters
  const filteredProblems = practiceProblems.filter(problem => {
    const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === 'All' || problem.category === categoryFilter;
    const matchesBlind75 = !blind75Only || problem.isBlind75;
    return matchesDifficulty && matchesCategory && matchesBlind75 && problem.implemented === true;
  });

  // Define initWheel as a useCallback to fix the dependency warning
  const initWheel = useCallback(() => {
    if (!wheelRef.current) return;
    
    // Clear existing content
    wheelRef.current.innerHTML = '';
    
    // Create row with problem cards
    const row = document.createElement('div');
    row.className = 'roulette-row';
    
    // Add each problem as a card
    filteredProblems.forEach(problem => {
      const card = document.createElement('div');
      card.className = `roulette-card ${problem.difficulty === 'Easy' ? 'green' : problem.difficulty === 'Medium' ? 'black' : 'red'}`;
      card.setAttribute('data-id', problem.id.toString());
      card.textContent = problem.id.toString();
      row.appendChild(card);
    });
    
    // Add multiple rows for better visual effect
    for (let i = 0; i < 20; i++) {
      wheelRef.current.appendChild(row.cloneNode(true));
    }
  }, [filteredProblems]);

  // Initialize wheel with problem cards
  useEffect(() => {
    initWheel();
  }, [filteredProblems, initWheel]);

  // Add CSS to document head
  useEffect(() => {
    // Create style element
    const style = document.createElement('style');
    style.innerHTML = `
      .roulette-row {
        display: flex;
      }
      .roulette-card {
        height: 75px;
        width: 75px;
        margin: 3px;
        border-radius: 8px;
        border-bottom: 3px solid rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 1.5em;
        box-shadow: 0 3px 5px rgba(0,0,0,0.2);
        transition: transform 0.2s;
      }
      .roulette-wrapper {
        position: relative;
        overflow: hidden;
        height: 100px;
        width: 100%;
        background: #1e1e1e;
        border-radius: 8px;
        box-shadow: inset 0 0 10px rgba(0,0,0,0.3);
        margin-bottom: 20px;
      }
      .selector {
        position: absolute;
        top: 0;
        left: 50%;
        height: 100%;
        width: 4px;
        background: #90caf9;
        transform: translateX(-50%);
        z-index: 10;
        box-shadow: 0 0 10px rgba(144, 202, 249, 0.6), 0 0 20px rgba(144, 202, 249, 0.4);
      }
      .selector::before, .selector::after {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
      }
      .selector::before {
        top: 0;
        border-top: 8px solid #90caf9;
      }
      .selector::after {
        bottom: 0;
        border-bottom: 8px solid #90caf9;
      }
      .roulette-card.red {
        background: #f48fb1;
      }
      .roulette-card.black {
        background: #ffb74d;
      }
      .roulette-card.green {
        background: #90caf9;
      }
      .roulette-card.highlighted {
        transform: scale(1.05);
        box-shadow: 0 0 15px rgba(144, 202, 249, 0.8);
        z-index: 5;
      }
      @keyframes spin-glow {
        0%, 100% { box-shadow: 0 0 8px rgba(144, 202, 249, 0.6); }
        50% { box-shadow: 0 0 15px rgba(144, 202, 249, 0.9); }
      }
      .spin-active .selector {
        animation: spin-glow 0.5s infinite;
      }
      @keyframes bounce {
        0%, 100% { transform: translateX(-50%); }
        25% { transform: translateX(-47%); }
        50% { transform: translateX(-50%); }
        75% { transform: translateX(-53%); }
      }
      .landing-bounce .selector {
        animation: bounce 0.6s ease-in-out;
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup on unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const spinWheel = () => {
    if (spinning || !wheelRef.current || filteredProblems.length === 0) return;
    
    setSpinning(true);
    
    // Add spin-active class to the wrapper for glow effect
    if (rouletteWrapperRef.current) {
      rouletteWrapperRef.current.classList.add('spin-active');
    }
    
    // Randomly select a problem
    const randomIndex = Math.floor(Math.random() * filteredProblems.length);
    const selectedProblem = filteredProblems[randomIndex];
    
    // Calculate landing position
    const cardWidth = 75 + 6; // card width + margin
    const totalSpins = 4; // Complete spins before landing
    
    // Find the position of the problem in the array
    const problemIndex = filteredProblems.findIndex(p => p.id === selectedProblem.id);
    
    // Calculate landing position - center the selected card exactly
    // Total width of all cards * number of spins + position of the selected card
    const landingPosition = (filteredProblems.length * cardWidth * totalSpins) + (problemIndex * cardWidth);
    
    // Add some randomness to the landing position (smaller range for more accurate landing)
    const randomize = Math.floor(Math.random() * (cardWidth / 4)) - (cardWidth / 8);
    
    // Apply animation with easing for a more realistic spin - with a bounce at the end
    wheelRef.current.style.transition = 'transform 8s cubic-bezier(0.2, 0.1, 0.1, 1.0)';
    wheelRef.current.style.transform = `translate3d(-${landingPosition + randomize}px, 0px, 0px)`;
    
    // Save selected problem
    setSelectedProblem(selectedProblem);
    
    // Add bounce effect to the selector when landing
    setTimeout(() => {
      if (rouletteWrapperRef.current) {
        rouletteWrapperRef.current.classList.remove('spin-active');
        rouletteWrapperRef.current.classList.add('landing-bounce');
      }
    }, 7800); // Just before the animation finishes
    
    // Highlight the selected card after it lands
    setTimeout(() => {
      if (wheelRef.current) {
        const selectedCards = wheelRef.current.querySelectorAll(`[data-id="${selectedProblem.id}"]`);
        selectedCards.forEach(card => {
          card.classList.add('highlighted');
        });
      }
      
      if (rouletteWrapperRef.current) {
        rouletteWrapperRef.current.classList.remove('landing-bounce');
      }
      
      setSpinning(false);
      
      // Show dialog after a short delay
      setTimeout(() => {
        setDialogOpen(true);
      }, 500);
    }, 8000); // Match the transition duration
  };

  const handleNavigate = () => {
    if (selectedProblem) {
      navigate(`/${selectedProblem.path}`);
    }
    setDialogOpen(false);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Problem Roulette
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        Can't decide which coding problem to tackle next? Let the roulette decide for you!
        Spin the wheel to get a random problem based on your filters.
      </Typography>

      {/* Filters */}
      <Box component={Paper} elevation={1} sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid sx={{ gridColumn: {xs: 'span 12', sm: 'span 4'} }}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficultyFilter}
                label="Difficulty"
                onChange={handleDifficultyChange}
              >
                <MenuItem value="All">All Difficulties</MenuItem>
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid sx={{ gridColumn: {xs: 'span 12', sm: 'span 4'} }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={handleCategoryChange}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid sx={{ gridColumn: {xs: 'span 12', sm: 'span 4'} }}>
            <FormControl fullWidth>
              <InputLabel>Problem Set</InputLabel>
              <Select
                value={blind75Only ? 'true' : 'false'}
                label="Problem Set"
                onChange={handleBlind75FilterChange}
              >
                <MenuItem value="false">All Problems</MenuItem>
                <MenuItem value="true">Blind 75 Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Roulette Section */}
      <Box sx={{ mb: 4 }}>
        <div 
          ref={rouletteWrapperRef}
          className="roulette-wrapper"
        >
          <div className="selector" ref={selectorRef}></div>
          <div 
            ref={wheelRef}
            style={{
              display: 'flex',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          ></div>
        </div>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<CasinoIcon />}
            onClick={spinWheel}
            disabled={spinning || filteredProblems.length === 0}
            sx={{ minWidth: '180px' }}
          >
            {spinning ? 'Spinning...' : 'Spin the Wheel'}
          </Button>
        </Box>

        {filteredProblems.length === 0 && (
          <Typography variant="body1" color="error" sx={{ textAlign: 'center', mt: 2 }}>
            No problems match the selected filters. Please adjust your filters to continue.
          </Typography>
        )}
      </Box>

      {/* Available Problems */}
      <Box component={Paper} elevation={1} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Available Problems ({filteredProblems.length})
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {filteredProblems.map(problem => (
            <Chip
              key={problem.id}
              label={`${problem.id}. ${problem.title}`}
              onClick={() => navigate(`/${problem.path}`)}
              sx={{
                bgcolor: getDifficultyColor(problem.difficulty),
                color: 'white',
                ':hover': {
                  bgcolor: theme.palette.mode === 'dark' 
                    ? `${getDifficultyColor(problem.difficulty)}80` 
                    : `${getDifficultyColor(problem.difficulty)}d0`,
                  cursor: 'pointer'
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Result Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="roulette-result-dialog"
      >
        <DialogTitle id="roulette-result-dialog">
          Your Random Problem
        </DialogTitle>
        <DialogContent>
          {selectedProblem && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedProblem.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip 
                  label={selectedProblem.difficulty} 
                  sx={{ bgcolor: getDifficultyColor(selectedProblem.difficulty), color: 'white' }} 
                />
                <Chip label={selectedProblem.category} />
                {selectedProblem.isBlind75 && <Chip label="Blind 75" color="primary" />}
              </Box>
              <Typography variant="body1">
                Ready to solve this problem? Click "Solve Problem" to get started!
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleNavigate} color="primary" variant="contained">
            Solve Problem
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProblemRoulette; 
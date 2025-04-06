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
  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true);
  // Store the last selected problem ID to prevent the wheel from resetting
  const lastSelectedProblemRef = useRef<number | null>(null);

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

  // Function to determine if a problem should use the 'even' or 'odd' style
  const getCheckerStyle = (index: number): string => {
    return index % 2 === 0 ? '#90caf9' : '#424242';
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

  // Add CSS to document head
  useEffect(() => {
    // Create style element
    const style = document.createElement('style');
    style.innerHTML = `
      .roulette-wrapper {
        position: relative;
        overflow: hidden;
        height: 100px;
        width: 100%;
        background: #1e1e1e;
        border-radius: 8px;
        box-shadow: inset 0 0 10px rgba(0,0,0,0.3);
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
      }
      .selector {
        position: absolute;
        top: 0;
        left: 50%;
        height: 100%;
        width: 4px;
        background: white;
        transform: translateX(-50%);
        z-index: 2;
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
        border-top: 8px solid white;
      }
      .selector::after {
        bottom: 0;
        border-bottom: 8px solid white;
      }
      .wheel {
        position: absolute;
        display: flex;
        align-items: center;
        height: 100%;
        left: 0;
        will-change: transform;
        transform-style: preserve-3d;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }
      .row {
        display: flex;
        height: 100%;
        align-items: center;
      }
      .card {
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
        flex-shrink: 0;
        transition: transform 0.3s ease;
      }
      .card.even {
        background: #90caf9;
      }
      .card.odd {
        background: #424242;
      }
      .card.highlighted {
        transform: scale(1.1);
        z-index: 5;
      }
      
      /* Critical styles to isolate dialog */
      .MuiBackdrop-root {
        position: fixed !important;
      }
      .MuiDialog-root {
        position: fixed !important;
        z-index: 1300 !important;
      }
      .MuiDialog-container {
        position: fixed !important;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
      .roulette-dialog-root {
        position: fixed !important;
        isolation: isolate !important;
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup on unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Define initWheel as a useCallback to fix the dependency warning
  const initWheel = useCallback(() => {
    if (!wheelRef.current || filteredProblems.length === 0) return;
    
    // Store current position and highlighted card ID before clearing
    const currentTransform = wheelRef.current.style.transform;
    let currentPosition = currentTransform ? 
      parseInt(currentTransform.match(/-?\d+/)?.[0] || '0') : 0;
    
    let highlightedCardId: number | null = null;
    const highlightedCard = wheelRef.current.querySelector('.highlighted');
    if (highlightedCard) {
      highlightedCardId = parseInt((highlightedCard as HTMLElement).getAttribute('data-id') || '0');
    }
    
    // Clear existing content
    wheelRef.current.innerHTML = '';
    
    // Calculate how many repeats we need to fill the viewport plus extra for smooth spinning
    const cardWidth = 81; // 75px + 6px margins
    const viewportWidth = window.innerWidth;
    
    // We need enough cards to cover from the leftmost visible point to the rightmost point after the longest possible spin
    const rotations = 12; // Match the number of rotations in spinWheel
    const totalSpinDistance = rotations * filteredProblems.length * cardWidth;
    
    // Calculate cards needed on the left side for initial positioning
    const leftPaddingCount = Math.ceil(viewportWidth / cardWidth);
    
    // Calculate total cards needed on the right for the full spin
    const rightPaddingCount = Math.ceil(totalSpinDistance / cardWidth) + leftPaddingCount;
    
    // Total repeats needed to ensure continuous display (adding extra safety margin)
    const minimumRepeats = Math.max(40, Math.ceil((leftPaddingCount + rightPaddingCount) / filteredProblems.length));
    
    // Create all card rows that will be needed
    const createRow = (prefix = '') => {
      const row = document.createElement('div');
      row.className = 'row';
      filteredProblems.forEach((problem, index) => {
        const card = document.createElement('div');
        card.className = `card ${index % 2 === 0 ? 'even' : 'odd'}`;
        card.setAttribute('data-id', problem.id.toString());
        card.textContent = problem.id.toString();
        // Restore highlight if this is the previously highlighted card
        if (problem.id === highlightedCardId) {
          card.classList.add('highlighted');
        }
        row.appendChild(card);
      });
      return row;
    };
    
    // Add enough rows to ensure continuous display during the entire spin
    for (let i = 0; i < minimumRepeats; i++) {
      wheelRef.current.appendChild(createRow());
    }
    
    // Try to restore previous position from localStorage with more sophisticated parsing
    let persistedPosition = 0;
    let persistedCardId = null;
    
    try {
      const positionDataString = localStorage.getItem('wheelPosition');
      if (positionDataString) {
        const positionData = JSON.parse(positionDataString);
        
        // Check if the data is still valid (not older than 24 hours)
        const currentTime = new Date().getTime();
        const isRecent = (currentTime - positionData.timestamp) < 86400000; // 24 hours
        
        // Check if the problem ID still exists in our filteredProblems
        const problemStillExists = filteredProblems.some(p => p.id === positionData.problemId);
        
        if (isRecent && problemStillExists) {
          persistedPosition = positionData.position;
          persistedCardId = positionData.problemId;
        }
      }
    } catch (e) {
      // If parsing fails, ignore the persisted position
      console.warn('Failed to parse persisted wheel position', e);
    }
    
    // If highlighted card ID not set but we have a valid persisted card ID, use that
    if (highlightedCardId === null && persistedCardId !== null) {
      highlightedCardId = persistedCardId;
    }
    
    // If there was a highlighted card, ensure it stays centered
    if (highlightedCardId !== null) {
      // Find the first instance of the highlighted card
      const highlightedCard = wheelRef.current.querySelector(`[data-id="${highlightedCardId}"]`);
      const selector = document.querySelector('.selector');
      
      if (highlightedCard && selector && persistedPosition) {
        // Use the persisted position
        currentPosition = persistedPosition;
      } else if (highlightedCard && selector) {
        // Calculate the position needed to center this card
        const cardRect = highlightedCard.getBoundingClientRect();
        const selectorRect = selector.getBoundingClientRect();
        const offset = cardRect.left - selectorRect.left + (cardRect.width / 2) - (selectorRect.width / 2);
        
        // Ensure we have a position that won't reset
        currentPosition = offset + (leftPaddingCount * cardWidth);
      }
    } else if (persistedPosition) {
      // Use persisted position if available
      currentPosition = persistedPosition;
    } else {
      // Start with cards near the center
      currentPosition = leftPaddingCount * cardWidth;
    }
    
    // Apply the position - always non-zero to prevent resets
    if (wheelRef.current) {
      wheelRef.current.style.transition = 'none';
      wheelRef.current.style.transform = `translate3d(-${currentPosition}px, 0px, 0px)`;
      void wheelRef.current.offsetWidth;
    }
  }, [filteredProblems]);

  // Initialize wheel only on mount with position persistence
  useEffect(() => {
    // Add global event listener to watch for position resets
    const wheelPositionWatcher = () => {
      // If the wheel exists but has no transform, restore from global storage
      if (wheelRef.current && 
          (!wheelRef.current.style.transform || wheelRef.current.style.transform === 'translate3d(0px, 0px, 0px)') && 
          (window as any).__wheelFinalPosition) {
        
        // Restore position from our global variable
        const position = (window as any).__wheelFinalPosition;
        wheelRef.current.style.transition = 'none';
        wheelRef.current.style.transform = `translate3d(-${position}px, 0px, 0px)`;
        
        // Trigger reflow
        void wheelRef.current.offsetWidth;
      }
    };
    
    // Run initial setup
    initWheel();
    isFirstRender.current = false;
    
    // Add watcher at frequent intervals
    const watchInterval = setInterval(wheelPositionWatcher, 100);
    
    // Cleanup on unmount
    return () => {
      clearInterval(watchInterval);
    };
  }, []); // Only run on mount

  // Add a dedicated effect to handle when the dialog opens/closes
  useEffect(() => {
    if (dialogOpen) {
      // When dialog opens, make sure we preserve the wheel position
      if (wheelRef.current && (window as any).__wheelPosition) {
        // Ensure wheel position is maintained
        wheelRef.current.style.transition = 'none';
        wheelRef.current.style.transform = (window as any).__wheelPosition;
      }
    } else {
      // When dialog closes, also ensure wheel position is maintained
      if (wheelRef.current && (window as any).__wheelPosition) {
        // Add a slight delay to let DOM settle
        setTimeout(() => {
          wheelRef.current!.style.transition = 'none';
          wheelRef.current!.style.transform = (window as any).__wheelPosition;
        }, 50);
      }
    }
  }, [dialogOpen]);
  
  // Handle filter changes separately
  useEffect(() => {
    if (!isFirstRender.current) {
      // When filters change, initialize wheel but preserve position
      const savedPosition = (window as any).__wheelFinalPosition || 
                           (window as any).__wheelPosition;
      
      // Initialize wheel with new filters
      initWheel();
      
      // Restore position if available
      if (savedPosition && wheelRef.current) {
        setTimeout(() => {
          if (wheelRef.current) {
            wheelRef.current.style.transition = 'none';
            wheelRef.current.style.transform = `translate3d(-${savedPosition}px, 0px, 0px)`;
            void wheelRef.current.offsetWidth;
          }
        }, 50);
      }
    }
  }, [filteredProblems, initWheel]);

  const spinWheel = () => {
    if (spinning || !wheelRef.current || filteredProblems.length === 0) {
      return;
    }
    
    setSpinning(true);
    
    // Remove any previously highlighted cards
    const highlightedCards = wheelRef.current.querySelectorAll('.highlighted');
    highlightedCards.forEach(card => card.classList.remove('highlighted'));
    
    // Select a random problem from the filtered list
    const randomIndex = Math.floor(Math.random() * filteredProblems.length);
    const selectedProblem = filteredProblems[randomIndex];
    
    // Calculate card width (including margins)
    const cardWidth = 81; // 75px + 6px margins
    const totalWidth = cardWidth * filteredProblems.length;
    
    // Get current position
    const currentTransform = wheelRef.current.style.transform;
    let currentPosition = currentTransform ? 
      parseInt(currentTransform.match(/-?\d+/)?.[0] || '0') : 0;
    
    // Calculate spin distance with more rotations for a longer spin
    const rotations = 12; // Increased for a stronger spin
    const basePosition = rotations * totalWidth;
    
    // Add a random offset to make it land at different positions within the card
    const randomOffset = Math.floor(Math.random() * cardWidth * 0.8) - (cardWidth * 0.4);
    const targetPosition = (randomIndex * cardWidth) + randomOffset;
    
    // Calculate final position based on current position
    // Use the actual current position to prevent resetting
    const finalPosition = currentPosition + basePosition + targetPosition;
    
    // Store starting position to persist globally
    (window as any).__wheelStartPosition = currentPosition;
    
    // Start the animation
    requestAnimationFrame(() => {
      if (wheelRef.current) {
        // Spin the wheel with a more dramatic animation
        // Using a custom cubic-bezier for a faster start and longer deceleration
        wheelRef.current.style.transition = `transform 10s cubic-bezier(0.05, 0.8, 0, 1)`;
        wheelRef.current.style.transform = `translate3d(-${finalPosition}px, 0px, 0px)`;
        
        // Store the target position 
        (window as any).__wheelTargetPosition = finalPosition;
      }
    });
    
    // After animation completes
    setTimeout(() => {
      if (!wheelRef.current) return;
      
      // Check if animation completed properly
      const currentTransform = wheelRef.current.style.transform;
      const actualPosition = currentTransform ? 
        parseInt(currentTransform.match(/-?\d+/)?.[0] || '0') : 0;
        
      // If the position isn't close to the target position, something went wrong
      if (Math.abs(actualPosition - finalPosition) > 100) {
        // Restore the intended position without animation
        wheelRef.current.style.transition = 'none';
        wheelRef.current.style.transform = `translate3d(-${finalPosition}px, 0px, 0px)`;
        void wheelRef.current.offsetWidth;
      }
      
      // Find the card that's closest to the selector
      const selector = document.querySelector('.selector');
      if (selector) {
        const selectorRect = selector.getBoundingClientRect();
        const selectorCenter = selectorRect.left + (selectorRect.width / 2);
        
        // Get all cards
        const allCards = wheelRef.current.querySelectorAll('.card');
        let closestCard: Element | null = null;
        let minDistance = Infinity;
        
        allCards.forEach(card => {
          // Skip hidden cards
          if ((card as HTMLElement).style.visibility === 'hidden') return;
          
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + (rect.width / 2);
          const distance = Math.abs(cardCenter - selectorCenter);
          
          if (distance < minDistance) {
            minDistance = distance;
            closestCard = card;
          }
        });
        
        if (closestCard) {
          // Add highlight without illumination
          (closestCard as HTMLElement).classList.add('highlighted');
          
          // Get the problem ID from the card
          const cardId = parseInt((closestCard as HTMLElement).getAttribute('data-id') || '0');
          // Store the selected problem ID
          lastSelectedProblemRef.current = cardId;
          
          // Find the matching problem and update the selected problem state
          const matchingProblem = filteredProblems.find(p => p.id === cardId);
          if (matchingProblem) {
            setSelectedProblem(matchingProblem);
            
            // Adjust position to center the card perfectly
            const card = closestCard as HTMLElement;
            const cardRect = card.getBoundingClientRect();
            const selectorRect = selector.getBoundingClientRect();
            
            // Calculate the exact offset needed to center the card on the marker
            const offset = cardRect.left - selectorRect.left + (cardRect.width / 2) - (selectorRect.width / 2);
            
            // Apply the centering adjustment
            const currentTransform = wheelRef.current.style.transform;
            const currentPosition = currentTransform ? 
              parseInt(currentTransform.match(/-?\d+/)?.[0] || '0') : 0;
            const adjustedPosition = currentPosition + offset;
            
            // Apply the adjustment with a short animation to center the card perfectly
            wheelRef.current.style.transition = 'transform 0.5s ease-out';
            wheelRef.current.style.transform = `translate3d(-${adjustedPosition}px, 0px, 0px)`;
            
            // Force a reflow to ensure the transition is applied
            void wheelRef.current.offsetWidth;
            
            // Store final position globally
            (window as any).__wheelFinalPosition = adjustedPosition;
            
            // Save the position to localStorage AFTER applying the adjusted position
            // Include the selected problem ID to ensure we can verify it's still valid
            const positionData = {
              position: adjustedPosition,
              problemId: cardId,
              timestamp: new Date().getTime()
            };
            localStorage.setItem('wheelPosition', JSON.stringify(positionData));
            
            // Also set it as a data attribute for easier retrieval
            wheelRef.current.setAttribute('data-persisted-position', adjustedPosition.toString());
            wheelRef.current.setAttribute('data-persisted-card-id', cardId.toString());
            
            // Show the dialog after the centering animation completes
            // BUT preserve the wheel position
            setTimeout(() => {
              // Store the wheel transform before opening dialog
              (window as any).__wheelPosition = wheelRef.current?.style.transform || '';
              
              // Set dialog open without modifying the wheel position
              openDialog();
            }, 600);
          }
        }
      }
      
      // Only update spinning state
      setSpinning(false);
    }, 10000); // Matches the animation duration
  };

  // Define custom dialog open function to prevent position reset
  const openDialog = useCallback(() => {
    // Store the wheel position in a global variable to ensure it's not affected
    (window as any).__wheelPosition = wheelRef.current?.style.transform || '';
    
    // Now we can safely set the dialog open state
    setDialogOpen(true);
  }, []);

  // Define custom dialog close function that preserves wheel position
  const closeDialog = useCallback(() => {
    // Just close the dialog without touching the wheel
    setDialogOpen(false);
    
    // Force a reflow then restore wheel position from global storage 
    setTimeout(() => {
      if (wheelRef.current && (window as any).__wheelPosition) {
        wheelRef.current.style.transition = 'none';
        wheelRef.current.style.transform = (window as any).__wheelPosition;
      }
    }, 10);
  }, []);

  // Special handler for dialog navigation
  const handleNavigate = useCallback(() => {
    if (selectedProblem) {
      // Store current position before navigation
      const currentTransform = wheelRef.current?.style.transform || '';
      (window as any).__wheelPosition = currentTransform;
      
      // Close dialog first
      setDialogOpen(false);
      
      // Then navigate after a delay to ensure position is preserved
      setTimeout(() => {
        navigate(`/${selectedProblem.path}`);
      }, 50);
    } else {
      closeDialog();
    }
  }, [selectedProblem, navigate, closeDialog]);

  // Completely isolated dialog that doesn't affect wheel position
  const ResultDialog = () => (
    <Dialog
      open={dialogOpen}
      onClose={() => {}} // Prevent closing on backdrop click or escape key
      aria-labelledby="roulette-result-dialog"
      disableEscapeKeyDown
      style={{ position: 'fixed' }} // Use fixed to avoid affecting layout
      BackdropProps={{
        style: { position: 'fixed' } // Ensure backdrop doesn't shift layout
      }}
      // Use lower z-index to avoid covering wheel
      classes={{
        root: 'roulette-dialog-root'
      }}
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
        <Button onClick={handleNavigate} color="primary" variant="contained" fullWidth>
          Solve Problem
        </Button>
      </DialogActions>
    </Dialog>
  );

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
        <div className="roulette-wrapper" ref={rouletteWrapperRef}>
          <div className="selector" ref={selectorRef}></div>
          <div className="wheel" ref={wheelRef}></div>
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
          {filteredProblems.map((problem, index) => (
            <Chip
              key={problem.id}
              label={`${problem.id}. ${problem.title}`}
              onClick={() => navigate(`/${problem.path}`)}
              sx={{
                bgcolor: getCheckerStyle(index),
                color: 'white',
                ':hover': {
                  bgcolor: theme.palette.mode === 'dark' 
                    ? `${getCheckerStyle(index)}80` 
                    : `${getCheckerStyle(index)}d0`,
                  cursor: 'pointer'
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Result Dialog */}
      <ResultDialog />
    </Container>
  );
};

export default ProblemRoulette; 
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
  const [blind75Only, setBlind75Only] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<PracticeProblem | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [showWheel, setShowWheel] = useState(true);
  const wheelRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const rouletteWrapperRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const lastSelectedProblemRef = useRef<number | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

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
        opacity: 1;
        transition: opacity 0.3s ease-out;
      }
      .roulette-wrapper.hidden {
        opacity: 0;
        pointer-events: none;
      }
      .roulette-section {
        transition: all 0.3s ease-out;
        opacity: 1;
        transform: translateY(0);
      }
      .roulette-section.hidden {
        opacity: 0;
        transform: translateY(20px);
        pointer-events: none;
        position: absolute;
        left: -9999px;
      }
      .selected-problem {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease-out;
      }
      .selected-problem.visible {
        opacity: 1;
        transform: translateY(0);
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
    // Define a one-time setup function
    const setupWheel = () => {
      // Clear any existing transform first
      if (wheelRef.current) {
        wheelRef.current.style.transition = 'none';
        wheelRef.current.style.transform = '';
        void wheelRef.current.offsetWidth;
      }
      
      // Run initial setup
      initWheel();
      isFirstRender.current = false;
    };
    
    // Run setup with a small delay to ensure DOM is ready
    const setupTimeout = setTimeout(setupWheel, 50);
    
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
    
    // Add watcher at frequent intervals
    const watchInterval = setInterval(wheelPositionWatcher, 100);
    
    // Add a resize handler to prevent glitches on window resize
    const handleResize = () => {
      if (!spinning) {
        // Reinitialize wheel on resize, but wait for resize to complete
        clearTimeout((window as any).__resizeTimeout);
        (window as any).__resizeTimeout = setTimeout(() => {
          initWheel();
        }, 300);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => {
      clearTimeout(setupTimeout);
      clearInterval(watchInterval);
      clearTimeout((window as any).__resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Only run on mount

  // Add a dedicated effect to handle when the dialog opens/closes
  useEffect(() => {
    if (selectedProblem) {
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
  }, [selectedProblem]);
  
  // Handle filter changes separately with better stability
  useEffect(() => {
    if (!isFirstRender.current && !spinning) {
      // Capture last position from wheel if it exists
      let lastPosition = null;
      let lastCardId = null;
      
      if (wheelRef.current) {
        const transform = wheelRef.current.style.transform;
        if (transform) {
          lastPosition = parseInt(transform.match(/-?\d+/)?.[0] || '0');
        }
        
        const highlightedCard = wheelRef.current.querySelector('.highlighted');
        if (highlightedCard) {
          lastCardId = parseInt((highlightedCard as HTMLElement).getAttribute('data-id') || '0');
        }
      }
      
      // Store the captured position
      const savedPosition = lastPosition;
      const savedCardId = lastCardId || lastSelectedProblemRef.current;
      
      // Remember this data for after reinitializing
      const filterChangeData = {
        position: savedPosition,
        cardId: savedCardId
      };
      
      // Initialize wheel with new filters
      initWheel();
      
      // If we had a position, and the wheel now exists, restore it with a delay
      if (savedPosition && wheelRef.current) {
        setTimeout(() => {
          if (wheelRef.current) {
            // Find if our previous card still exists in the new filtered problems
            const cardStillExists = filteredProblems.some(p => p.id === savedCardId);
            
            if (cardStillExists && savedCardId) {
              // Find the first matching card element
              const matchingCard = wheelRef.current.querySelector(`[data-id="${savedCardId}"]`);
              if (matchingCard) {
                // Highlight it
                matchingCard.classList.add('highlighted');
                lastSelectedProblemRef.current = savedCardId;
                
                // Find the matching problem
                const matchingProblem = filteredProblems.find(p => p.id === savedCardId);
                if (matchingProblem) {
                  setSelectedProblem(matchingProblem);
                }
              }
            }
            
            // Apply saved position, slightly delayed to ensure all measurements are ready
            wheelRef.current.style.transition = 'none';
            wheelRef.current.style.transform = `translate3d(-${savedPosition}px, 0px, 0px)`;
            void wheelRef.current.offsetWidth;
          }
        }, 100);
      }
    }
  }, [filteredProblems, initWheel, spinning]);
  
  // Cleanup function to prevent memory leaks and glitches
  useEffect(() => {
    // Cleanup function that runs when component unmounts
    return () => {
      // Clear any running timeouts or intervals
      const highestId = window.setTimeout(() => {}, 0);
      for (let i = 0; i < highestId; i++) {
        window.clearTimeout(i);
      }
      
      // Save final wheel position to localStorage
      if (wheelRef.current) {
        const currentTransform = wheelRef.current.style.transform;
        const position = currentTransform ? 
          parseInt(currentTransform.match(/-?\d+/)?.[0] || '0') : 0;
          
        if (position && lastSelectedProblemRef.current) {
          const positionData = {
            position: position,
            problemId: lastSelectedProblemRef.current,
            timestamp: new Date().getTime()
          };
          localStorage.setItem('wheelPosition', JSON.stringify(positionData));
        }
        
        // Stop any transitions
        wheelRef.current.style.transition = 'none';
      }
    };
  }, []);

  // Add refresh on navigation
  useEffect(() => {
    // Check if this is a fresh navigation (not a refresh)
    const isRefresh = window.performance
      .getEntriesByType('navigation')
      .some((nav) => (nav as PerformanceNavigationTiming).type === 'reload');

    // Only refresh if we're not already coming from a refresh
    if (!isRefresh && window.location.pathname === '/problem-roulette') {
      window.location.reload();
    }
  }, []);

  // Add effect to reset hasSpun when returning to the page
  useEffect(() => {
    // Reset hasSpun when component mounts
    setShowWheel(true);
    setSelectedProblem(null);
  }, []);

  const spinWheel = () => {
    if (spinning || !wheelRef.current || filteredProblems.length === 0) {
      return;
    }

    setSpinning(true);
    setSelectedProblem(null);

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

    // Reset position if it's too large to prevent performance issues
    if (Math.abs(currentPosition) > totalWidth * 2) {
      currentPosition = currentPosition % totalWidth;
      wheelRef.current.style.transform = `translate3d(-${currentPosition}px, 0px, 0px)`;
      void wheelRef.current.offsetWidth;
    }

    // Calculate spin distance
    const rotations = 8; // Reduced number of rotations for more stability
    const baseSpinDistance = rotations * totalWidth;
    
    // Add random offset within the card width
    const randomOffset = Math.floor(Math.random() * (cardWidth * 0.6)) - (cardWidth * 0.3);
    const targetPosition = (randomIndex * cardWidth) + randomOffset;
    
    // Calculate final position
    const finalPosition = currentPosition + baseSpinDistance + targetPosition;

    // Store starting position
    (window as any).__wheelStartPosition = currentPosition;

    // Start the animation
    requestAnimationFrame(() => {
      if (wheelRef.current) {
        wheelRef.current.style.transition = 'transform 8s cubic-bezier(0.2, 0.5, 0.1, 1)';
        wheelRef.current.style.transform = `translate3d(-${finalPosition}px, 0px, 0px)`;
      }
    });

    // After animation completes
    const animationTimeout = setTimeout(() => {
      if (!wheelRef.current) return;

      // Check if animation completed properly
      const currentTransform = wheelRef.current.style.transform;
      const actualPosition = currentTransform ? 
        parseInt(currentTransform.match(/-?\d+/)?.[0] || '0') : 0;

      // If position is wrong, fix it
      if (Math.abs(actualPosition - finalPosition) > 10) {
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
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + (rect.width / 2);
          const distance = Math.abs(cardCenter - selectorCenter);

          if (distance < minDistance) {
            minDistance = distance;
            closestCard = card;
          }
        });

        if (closestCard) {
          (closestCard as HTMLElement).classList.add('highlighted');
          
          const cardId = parseInt((closestCard as HTMLElement).getAttribute('data-id') || '0');
          lastSelectedProblemRef.current = cardId;
          
          const matchingProblem = filteredProblems.find(p => p.id === cardId);
          if (matchingProblem) {
            // Add the hidden class to start the fade out
            if (rouletteWrapperRef.current) {
              rouletteWrapperRef.current.classList.add('hidden');
            }
            
            // Set the selected problem after a short delay to allow for fade out
            setTimeout(() => {
              setSelectedProblem(matchingProblem);
            }, 300);
          }
        }
      }
      
      setSpinning(false);
    }, 10000);

    (window as any).__spinAnimationTimeout = animationTimeout;
  };

  const handleTryAgain = () => {
    setShowWheel(true);
    setSelectedProblem(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Problem Roulette
      </Typography>
      
      <div className={`roulette-section ${selectedProblem ? 'hidden' : ''}`}>
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
          <div className={`roulette-wrapper`} ref={rouletteWrapperRef}>
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

            {filteredProblems.length === 0 && (
              <Typography variant="body1" color="error" sx={{ textAlign: 'center', mt: 2 }}>
                No problems match the selected filters. Please adjust your filters to continue.
              </Typography>
            )}
          </Box>
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
      </div>

      {/* Selected Problem Section */}
      {selectedProblem && (
        <Box 
          component={Paper} 
          elevation={3} 
          className={`selected-problem ${selectedProblem ? 'visible' : ''}`}
          sx={{ p: 4, maxWidth: 600, mx: 'auto', textAlign: 'center' }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Selected Problem
          </Typography>
          <Typography variant="h6" gutterBottom>
            {selectedProblem.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
            <Chip 
              label={selectedProblem.difficulty} 
              sx={{ bgcolor: getDifficultyColor(selectedProblem.difficulty), color: 'white' }} 
            />
            <Chip label={selectedProblem.category} />
            {selectedProblem.isBlind75 && <Chip label="Blind 75" color="primary" />}
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate(`/${selectedProblem.path}`)}
            sx={{ minWidth: '200px' }}
          >
            Go to Question
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default ProblemRoulette; 
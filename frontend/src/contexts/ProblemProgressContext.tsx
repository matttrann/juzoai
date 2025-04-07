import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

// Rank levels with number keys
export const RANKS: Record<number, string> = {
  0: 'Novice',
  5: 'Beginner',
  10: 'Apprentice',
  20: 'Intermediate',
  30: 'Advanced',
  50: 'Expert',
  75: 'Master',
  100: 'Grandmaster'
};

// XP values for different difficulty levels
export const XP_VALUES = {
  'Easy': 10,
  'Medium': 20,
  'Hard': 40
};

// XP needed for each level (starting at level 1)
export const XP_PER_LEVEL = 50;

// Key for localStorage
const STORAGE_KEY = 'problemProgress';

interface ProblemProgressContextProps {
  xp: number;
  level: number;
  rank: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  addXp: (amount: number, difficulty: 'Easy' | 'Medium' | 'Hard') => void;
  getCurrentLevelProgress: () => number; // Returns progress percentage toward next level
  getXpToNextLevel: () => number;
  resetProgress: () => void; // Added reset function for testing
}

interface ProgressData {
  xp: number;
  level: number;
  rank: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  lastUpdated: number;
  // Tracking if the user has seen the XP booster for this level
  boosterLevelsShown: number[];
}

const ProblemProgressContext = createContext<ProblemProgressContextProps | undefined>(undefined);

export const useProblemProgress = () => {
  const context = useContext(ProblemProgressContext);
  if (!context) {
    throw new Error('useProblemProgress must be used within a ProblemProgressProvider');
  }
  return context;
};

interface ProblemProgressProviderProps {
  children: ReactNode;
}

export const ProblemProgressProvider: React.FC<ProblemProgressProviderProps> = ({ children }) => {
  const [xp, setXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [rank, setRank] = useState<string>(RANKS[0]);
  const [totalSolved, setTotalSolved] = useState<number>(0);
  const [easySolved, setEasySolved] = useState<number>(0);
  const [mediumSolved, setMediumSolved] = useState<number>(0);
  const [hardSolved, setHardSolved] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  // New state for XP Booster
  const [boosterLevelsShown, setBoosterLevelsShown] = useState<number[]>([]);

  // Calculate rank based on level
  const calculateRank = useCallback((currentLevel: number): string => {
    // Log current level and RANKS for debugging
    console.log('Calculating rank for level:', currentLevel);
    console.log('Available ranks:', RANKS);
    
    const rankLevels = Object.keys(RANKS).map(Number).sort((a, b) => a - b);
    console.log('Rank levels (sorted):', rankLevels);
    
    let newRank = RANKS[0];
    
    for (let i = rankLevels.length - 1; i >= 0; i--) {
      const rankLevel = rankLevels[i];
      console.log('Checking rank level:', rankLevel);
      
      if (currentLevel >= rankLevel) {
        newRank = RANKS[rankLevel];
        console.log('Found matching rank:', newRank, 'for level:', currentLevel);
        break;
      }
    }
    
    console.log('Final calculated rank:', newRank);
    return newRank;
  }, []);

  // Load stored progress from localStorage on mount
  useEffect(() => {
    try {
      const storedProgress = localStorage.getItem(STORAGE_KEY);
      console.log('Reading from localStorage:', storedProgress);
      
      if (storedProgress) {
        const progress: ProgressData = JSON.parse(storedProgress);
        console.log('Parsed progress data:', progress);
        
        setXp(progress.xp || 0);
        setLevel(progress.level || 1);
        setRank(progress.rank || RANKS[0]);
        setTotalSolved(progress.totalSolved || 0);
        setEasySolved(progress.easySolved || 0);
        setMediumSolved(progress.mediumSolved || 0);
        setHardSolved(progress.hardSolved || 0);
        
        // Load booster levels shown state
        if (progress.boosterLevelsShown) {
          setBoosterLevelsShown(progress.boosterLevelsShown);
        }
      }
      
      // Mark as initialized after loading
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading progress from localStorage:', error);
      setIsInitialized(true); // Still mark as initialized to allow saving later
    }
  }, []);

  // Calculate and update rank based on level
  useEffect(() => {
    if (!isInitialized) return;
    
    console.log('Level changed to:', level, 'calculating new rank');
    
    // Use timeout to ensure this happens after level updates are fully processed
    const timeoutId = setTimeout(() => {
      const newRank = calculateRank(level);
      console.log('Setting rank from', rank, 'to', newRank);
      
      // Only update if the rank actually changed to avoid unnecessary rerenders
      if (newRank !== rank) {
        setRank(newRank);
      } else {
        console.log('Rank remained the same, skipping update');
      }
    }, 10);
    
    return () => clearTimeout(timeoutId);
  }, [level, calculateRank, isInitialized, rank]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;
    
    // Use timeout to ensure this happens after state updates are committed
    const timeoutId = setTimeout(() => {
      console.log('Saving progress to localStorage with current state:');
      console.log('XP:', xp, 'Level:', level, 'Rank:', rank);
      
      const progressData: ProgressData = {
        xp,
        level,
        rank,
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        lastUpdated: Date.now(),
        boosterLevelsShown
      };
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
        console.log('Progress saved to localStorage:', progressData);
      } catch (error) {
        console.error('Failed to save progress to localStorage:', error);
      }
    }, 50); // Small delay to ensure state is fully updated
    
    return () => clearTimeout(timeoutId);
  }, [xp, level, rank, totalSolved, easySolved, mediumSolved, hardSolved, boosterLevelsShown, isInitialized]);

  // Add XP and update level
  const addXp = useCallback((amount: number, difficulty: 'Easy' | 'Medium' | 'Hard') => {
    console.log(`Adding ${amount} XP for solving ${difficulty} problem`);
    
    // Use a more reliable pattern for state updates that depend on each other
    setXp(prevXp => {
      const newXp = prevXp + amount;
      console.log(`XP updated from ${prevXp} to ${newXp}`);
      
      // Calculate new level based on XP
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
      console.log(`Calculated new level: ${newLevel}, current level: ${level}`);
      
      // Update level in a separate effect to avoid race conditions
      if (newLevel > level) {
        console.log(`Will update level from ${level} to ${newLevel}`);
        // Use setTimeout to ensure this runs in the next event loop
        // after the XP update has been processed
        setTimeout(() => {
          setLevel(newLevel);
        }, 0);
      }
      
      return newXp;
    });
    
    // Update problem counts
    setTotalSolved(prev => prev + 1);
    if (difficulty === 'Easy') {
      setEasySolved(prev => prev + 1);
    } else if (difficulty === 'Medium') {
      setMediumSolved(prev => prev + 1);
    } else {
      setHardSolved(prev => prev + 1);
    }
  }, [level]);

  // Calculate progress percentage toward next level
  const getCurrentLevelProgress = useCallback(() => {
    const xpForCurrentLevel = (level - 1) * XP_PER_LEVEL;
    const xpForNextLevel = level * XP_PER_LEVEL;
    const currentLevelXp = xp - xpForCurrentLevel;
    const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
    return (currentLevelXp / xpNeededForNextLevel) * 100;
  }, [xp, level]);

  // Get XP needed for next level
  const getXpToNextLevel = useCallback(() => {
    const xpForNextLevel = level * XP_PER_LEVEL;
    return xpForNextLevel - xp;
  }, [xp, level]);

  // Reset progress (for testing)
  const resetProgress = useCallback(() => {
    setXp(0);
    setLevel(1);
    setRank(RANKS[0]);
    setTotalSolved(0);
    setEasySolved(0);
    setMediumSolved(0);
    setHardSolved(0);
    setBoosterLevelsShown([]);
    
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);
    console.log('Progress reset');
  }, []);

  // Set up window storage event listener to sync between tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const newProgress: ProgressData = JSON.parse(event.newValue);
          console.log('Storage event detected, updating state:', newProgress);
          
          setXp(newProgress.xp);
          setLevel(newProgress.level);
          setRank(newProgress.rank);
          setTotalSolved(newProgress.totalSolved);
          setEasySolved(newProgress.easySolved);
          setMediumSolved(newProgress.mediumSolved);
          setHardSolved(newProgress.hardSolved);
          
          // Update booster levels shown state
          if (newProgress.boosterLevelsShown) {
            setBoosterLevelsShown(newProgress.boosterLevelsShown);
          }
        } catch (error) {
          console.error('Error parsing storage event data:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <ProblemProgressContext.Provider
      value={{
        xp,
        level,
        rank,
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        addXp,
        getCurrentLevelProgress,
        getXpToNextLevel,
        resetProgress
      }}
    >
      {children}
    </ProblemProgressContext.Provider>
  );
}; 
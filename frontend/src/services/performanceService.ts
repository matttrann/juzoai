import api from './api';

export interface PerformanceEntry {
  id?: number;
  username: string;
  score: number;
  deckId: number;
  deckTitle?: string;
  timestamp?: string;
  cards_studied?: number;
  cards_correct?: number;
  study_duration?: number;
}

export interface PerformanceStats {
  totalUsers: number;
  averageScore: number;
  highestScore: number;
  yourRank?: number;
}

// Local storage keys for fallback
const PERFORMANCE_STORAGE_KEY = 'flashcard_performance_data';

// Helper to get performance data from localStorage (for fallback only)
const getStoredPerformanceData = (): PerformanceEntry[] => {
  try {
    const storedData = localStorage.getItem(PERFORMANCE_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Error reading performance data from localStorage:', error);
    return [];
  }
};

// Helper to save performance data to localStorage (for fallback only)
const savePerformanceData = (data: PerformanceEntry[]): void => {
  try {
    localStorage.setItem(PERFORMANCE_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving performance data to localStorage:', error);
  }
};

// Helper to calculate stats from entries
const calculateStats = (entries: PerformanceEntry[]): PerformanceStats => {
  if (entries.length === 0) {
    return {
      totalUsers: 0,
      averageScore: 0,
      highestScore: 0,
      yourRank: 0
    };
  }
  
  // Get unique usernames
  const usernamesMap: Record<string, boolean> = {};
  entries.forEach(entry => {
    usernamesMap[entry.username] = true;
  });
  const uniqueUsers = Object.keys(usernamesMap).length;
  
  // Calculate average score
  const totalScore = entries.reduce((sum, entry) => sum + entry.score, 0);
  const averageScore = totalScore / entries.length;
  
  // Find highest score
  const highestScore = Math.max(...entries.map(entry => entry.score));
  
  return {
    totalUsers: uniqueUsers,
    averageScore,
    highestScore,
    yourRank: 1 // Not implementing ranking for localStorage version
  };
};

const performanceService = {
  // Get performance entries for a specific deck
  getEntriesForDeck: (deckId: number) => {
    return api.get<PerformanceEntry[]>(`/performance/deck/${deckId}`);
  },
  
  // Get global performance entries (across all decks)
  getGlobalEntries: () => {
    return api.get<PerformanceEntry[]>('/performance');
  },
  
  // Get performance statistics for a specific deck
  getStatsForDeck: (deckId: number) => {
    return api.get<PerformanceStats>(`/performance/deck/${deckId}/stats`);
  },
  
  // Get global performance statistics
  getGlobalStats: () => {
    return api.get<PerformanceStats>('/performance/stats');
  },
  
  // Submit a new score to track performance
  submitScore: async (entry: PerformanceEntry) => {
    try {
      // Format the entry for the API
      const apiEntry = {
        score: entry.score,
        deckId: entry.deckId,
        deckTitle: entry.deckTitle || 'Unknown Deck',
        cards_studied: entry.cards_studied || 0,
        cards_correct: entry.cards_correct || 0,
        study_duration: entry.study_duration || 0
      };
      
      // Submit to API
      const response = await api.post<PerformanceEntry>('/performance', apiEntry);
      
      // Also save to localStorage as backup
      const allEntries = getStoredPerformanceData();
      const newEntry = { ...entry, id: entry.id || allEntries.length + 1 };
      allEntries.push(newEntry);
      savePerformanceData(allEntries);
      
      return response;
    } catch (error) {
      console.error('Error submitting performance data:', error);
      
      // Fallback to localStorage only
      const allEntries = getStoredPerformanceData();
      const newEntry = { ...entry, id: entry.id || allEntries.length + 1 };
      allEntries.push(newEntry);
      savePerformanceData(allEntries);
      
      // Create a mock response
      return Promise.resolve({ 
        data: newEntry,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      });
    }
  },
  
  // Get your personal best scores for each deck
  getPersonalBests: (username: string) => {
    return api.get<PerformanceEntry[]>(`/performance/user/${username}`);
  },
  
  // Mock data function for development without backend
  getMockPerformance: (deckId?: number): PerformanceEntry[] => {
    // Return stored data instead of empty array
    const allEntries = getStoredPerformanceData();
    return deckId 
      ? allEntries.filter(entry => entry.deckId === deckId)
      : allEntries;
  },
  
  // Mock statistics function for development
  getMockStats: (deckId?: number): PerformanceStats => {
    const allEntries = getStoredPerformanceData();
    const relevantEntries = deckId 
      ? allEntries.filter(entry => entry.deckId === deckId)
      : allEntries;
      
    return calculateStats(relevantEntries);
  }
};

export default performanceService; 
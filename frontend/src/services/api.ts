import axios from 'axios';

// Define API base URL - adjust this based on where your Spring Boot server runs
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Token storage keys
const TOKEN_KEY = 'auth_token';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 10000,
});

// Add request interceptor for auth
api.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }
    
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', 
        error.response?.status || 'Network Error', 
        error.config?.url,
        error.response?.data || error.message
      );
    }
    
    // Handle common errors
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem(TOKEN_KEY);
      // Instead of direct redirect, dispatch an event to be handled by auth context
      window.dispatchEvent(new Event('auth_token_expired'));
    }
    
    // Enhance error with more details
    const enhancedError = {
      ...error,
      isApiError: true,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      timestamp: new Date().toISOString(),
    };
    
    return Promise.reject(enhancedError);
  }
);

export interface Deck {
  id: number;
  title: string;
  description: string;
  cardCount: number;
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
}

// Export services as objects with methods
export const deckService = {
  getAll: () => api.get<Deck[]>('/decks'),
  getById: (id: number) => api.get<Deck>(`/decks/${id}`),
  create: (deck: Omit<Deck, 'id' | 'cardCount'>) => api.post<Deck>('/decks', deck),
  update: (id: number, deck: Partial<Deck>) => api.put<Deck>(`/decks/${id}`, deck),
  delete: (id: number) => api.delete(`/decks/${id}`),
  getFlashcards: (deckId: number) => api.get<Flashcard[]>(`/decks/${deckId}/flashcards`),
};

export const flashcardService = {
  create: (deckId: number, flashcard: Omit<Flashcard, 'id'>) =>
    api.post<Flashcard>(`/decks/${deckId}/flashcards`, flashcard),
  update: (deckId: number, flashcardId: number, flashcard: Partial<Flashcard>) =>
    api.put<Flashcard>(`/decks/${deckId}/flashcards/${flashcardId}`, flashcard),
  delete: (deckId: number, flashcardId: number) =>
    api.delete(`/decks/${deckId}/flashcards/${flashcardId}`),
};

// Export auth helper functions to set and clear token
export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export default api; 
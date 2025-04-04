import api from './api';

export interface Deck {
  id?: number;
  title: string;
  description: string;
  cardCount?: number;
}

export interface Flashcard {
  id?: number;
  front: string;
  back: string;
  deckId?: number;
}

const deckService = {
  // Get all decks
  getAll: () => api.get<Deck[]>('/decks'),
  
  // Get single deck by ID
  getById: (id: number) => api.get<Deck>(`/decks/${id}`),
  
  // Create a new deck
  create: (deck: Deck) => api.post<Deck>('/decks', deck),
  
  // Update an existing deck
  update: (id: number, deck: Deck) => api.put<Deck>(`/decks/${id}`, deck),
  
  // Delete a deck
  delete: (id: number) => api.delete(`/decks/${id}`),
  
  // Get all flashcards for a deck
  getFlashcards: (deckId: number) => api.get<Flashcard[]>(`/decks/${deckId}/flashcards`),
  
  // Add a flashcard to a deck
  addFlashcard: (deckId: number, flashcard: Flashcard) => 
    api.post<Flashcard>(`/decks/${deckId}/flashcards`, flashcard),
  
  // Update a flashcard
  updateFlashcard: (deckId: number, cardId: number, flashcard: Flashcard) => 
    api.put<Flashcard>(`/decks/${deckId}/flashcards/${cardId}`, flashcard),
  
  // Delete a flashcard
  deleteFlashcard: (deckId: number, cardId: number) => 
    api.delete(`/decks/${deckId}/flashcards/${cardId}`)
};

export default deckService; 
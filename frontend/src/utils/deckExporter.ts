import { Deck, Flashcard } from '../services/deckService';

/**
 * Interface for the structure of an exported deck
 */
export interface ExportedDeck {
  title: string;
  description: string;
  flashcards: Flashcard[];
  exportDate: string;
  version: string;
}

/**
 * Exports a deck and its flashcards to a JSON file
 * @param deck The deck to export
 * @param flashcards The flashcards associated with the deck
 */
export const exportDeck = async (deck: Deck, flashcards: Flashcard[]): Promise<void> => {
  try {
    // Create the export structure
    const exportData: ExportedDeck = {
      title: deck.title,
      description: deck.description,
      flashcards: flashcards.map(card => ({
        front: card.front,
        back: card.back
      })),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create a blob for download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link and trigger it
    const link = document.createElement('a');
    const fileName = `${deck.title.replace(/\s+/g, '_').toLowerCase()}_deck.json`;
    
    link.download = fileName;
    link.href = url;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting deck:', error);
    throw new Error('Failed to export deck');
  }
};

/**
 * Parses an imported deck file and validates its format
 * @param file The JSON file containing the deck data
 * @returns The parsed deck data
 */
export const parseImportedDeck = (file: File): Promise<ExportedDeck> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target || !event.target.result) {
          throw new Error('Failed to read file');
        }
        
        const jsonString = event.target.result as string;
        const importedData = JSON.parse(jsonString);
        
        // Validate the imported data
        if (!importedData.title || typeof importedData.title !== 'string') {
          throw new Error('Invalid deck: missing or invalid title');
        }
        
        if (!importedData.description || typeof importedData.description !== 'string') {
          throw new Error('Invalid deck: missing or invalid description');
        }
        
        if (!Array.isArray(importedData.flashcards)) {
          throw new Error('Invalid deck: flashcards must be an array');
        }
        
        // Make sure all flashcards have required properties
        importedData.flashcards.forEach((card: any, index: number) => {
          if (!card.front || typeof card.front !== 'string') {
            throw new Error(`Invalid flashcard at index ${index}: missing or invalid front`);
          }
          
          if (!card.back || typeof card.back !== 'string') {
            throw new Error(`Invalid flashcard at index ${index}: missing or invalid back`);
          }
        });
        
        resolve(importedData as ExportedDeck);
      } catch (error) {
        console.error('Error parsing deck file:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}; 
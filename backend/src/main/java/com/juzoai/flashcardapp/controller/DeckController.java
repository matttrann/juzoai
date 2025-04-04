package com.juzoai.flashcardapp.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.juzoai.flashcardapp.model.Deck;
import com.juzoai.flashcardapp.repository.DeckRepository;

@RestController
@RequestMapping("/api/decks")
@CrossOrigin(origins = "http://localhost:3000")
public class DeckController {
    private final DeckRepository deckRepository;

    public DeckController(DeckRepository deckRepository) {
        this.deckRepository = deckRepository;
    }
    
    // Simple DTO to avoid lazy loading issues
    public static class DeckDTO {
        private Long id;
        private String title;
        private String description;
        private int cardCount;
        
        public DeckDTO(Deck deck) {
            this.id = deck.getId();
            this.title = deck.getTitle();
            this.description = deck.getDescription();
            this.cardCount = deck.getCardCount();
        }

        public Long getId() { return id; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public int getCardCount() { return cardCount; }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllDecks() {
        try {
            List<Deck> decks = deckRepository.findAll();
            // Convert to DTOs to avoid lazy loading issues
            List<DeckDTO> deckDTOs = decks.stream()
                    .map(DeckDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(deckDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error retrieving decks: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getDeckById(@PathVariable Long id) {
        try {
            return deckRepository.findById(id)
                    .<ResponseEntity<?>>map(deck -> {
                        DeckDTO deckDTO = new DeckDTO(deck);
                        return ResponseEntity.ok().body(deckDTO);
                    })
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of("message", "Deck not found with id: " + id)));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error retrieving deck: " + e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getDecksByUser(@PathVariable Long userId) {
        try {
            List<Deck> decks = deckRepository.findByUserId(userId);
            List<DeckDTO> deckDTOs = decks.stream()
                    .map(DeckDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(deckDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error retrieving decks for user: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createDeck(@RequestBody Deck deck) {
        try {
            // Log incoming request
            System.out.println("Creating deck: " + deck.getTitle());
            
            if (deck.getTitle() == null || deck.getTitle().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Deck title cannot be empty"));
            }
            
            // Make sure ID is null to avoid constraint violations
            deck.setId(null);
            
            // Set default card count
            if (deck.getCardCount() < 0) {
                deck.setCardCount(0);
            }
            
            Deck savedDeck = deckRepository.save(deck);
            System.out.println("Deck saved successfully with ID: " + savedDeck.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(new DeckDTO(savedDeck));
            
        } catch (DataAccessException e) {
            e.printStackTrace();
            String errorMsg = e.getMessage();
            
            // Check for specific constraint violations
            if (errorMsg.contains("constraint") || errorMsg.contains("violation") || errorMsg.contains("integrity")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "A deck with this information already exists"));
            }
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Database error: " + errorMsg));
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("DETAILED ERROR: " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("CAUSED BY: " + e.getCause().getMessage());
            }
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error creating deck: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDeck(@PathVariable Long id, @RequestBody Deck deck) {
        try {
            return deckRepository.findById(id)
                    .<ResponseEntity<?>>map(existingDeck -> {
                        existingDeck.setTitle(deck.getTitle());
                        existingDeck.setDescription(deck.getDescription());
                        Deck updated = deckRepository.save(existingDeck);
                        return ResponseEntity.ok().body(new DeckDTO(updated));
                    })
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of("message", "Deck not found with id: " + id)));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error updating deck: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDeck(@PathVariable Long id) {
        try {
            if (!deckRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Deck not found with id: " + id));
            }
            
            deckRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error deleting deck: " + e.getMessage()));
        }
    }
} 
package com.juzoai.flashcardapp.controller;

import java.util.List;
import java.util.Optional;

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
import com.juzoai.flashcardapp.model.Flashcard;
import com.juzoai.flashcardapp.repository.DeckRepository;
import com.juzoai.flashcardapp.repository.FlashcardRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class FlashcardController {
    private final FlashcardRepository flashcardRepository;
    private final DeckRepository deckRepository;

    public FlashcardController(FlashcardRepository flashcardRepository, DeckRepository deckRepository) {
        this.flashcardRepository = flashcardRepository;
        this.deckRepository = deckRepository;
    }

    @GetMapping("/decks/{deckId}/flashcards")
    public ResponseEntity<List<Flashcard>> getFlashcardsByDeck(@PathVariable Long deckId) {
        if (!deckRepository.existsById(deckId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(flashcardRepository.findByDeckId(deckId));
    }

    @GetMapping("/flashcards/{id}")
    public ResponseEntity<Flashcard> getFlashcardById(@PathVariable Long id) {
        return flashcardRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/decks/{deckId}/flashcards")
    public ResponseEntity<Flashcard> createFlashcard(@PathVariable Long deckId, @RequestBody Flashcard flashcard) {
        Optional<Deck> deckOpt = deckRepository.findById(deckId);
        if (deckOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        flashcard.setDeck(deckOpt.get());
        Flashcard savedFlashcard = flashcardRepository.save(flashcard);
        
        // Update card count on the deck
        Deck deck = deckOpt.get();
        int cardCount = flashcardRepository.countByDeckId(deckId);
        deck.setCardCount(cardCount);
        deckRepository.save(deck);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(savedFlashcard);
    }

    @PutMapping("/decks/{deckId}/flashcards/{id}")
    public ResponseEntity<Flashcard> updateFlashcard(
            @PathVariable Long deckId,
            @PathVariable Long id,
            @RequestBody Flashcard flashcard) {
        
        if (!deckRepository.existsById(deckId)) {
            return ResponseEntity.notFound().build();
        }
        
        return flashcardRepository.findById(id)
                .map(existingFlashcard -> {
                    existingFlashcard.setFront(flashcard.getFront());
                    existingFlashcard.setBack(flashcard.getBack());
                    return ResponseEntity.ok(flashcardRepository.save(existingFlashcard));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/decks/{deckId}/flashcards/{id}")
    public ResponseEntity<Void> deleteFlashcard(
            @PathVariable Long deckId,
            @PathVariable Long id) {
        
        Optional<Deck> deckOpt = deckRepository.findById(deckId);
        if (deckOpt.isEmpty() || !flashcardRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        flashcardRepository.deleteById(id);
        
        // Update card count on the deck
        Deck deck = deckOpt.get();
        int cardCount = flashcardRepository.countByDeckId(deckId);
        deck.setCardCount(cardCount);
        deckRepository.save(deck);
        
        return ResponseEntity.noContent().build();
    }
} 
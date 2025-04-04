package com.juzoai.flashcardapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.juzoai.flashcardapp.model.Flashcard;

public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    List<Flashcard> findByDeckId(Long deckId);
    int countByDeckId(Long deckId);
} 
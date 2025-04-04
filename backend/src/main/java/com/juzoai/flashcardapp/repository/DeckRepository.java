package com.juzoai.flashcardapp.repository;

import com.juzoai.flashcardapp.model.Deck;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeckRepository extends JpaRepository<Deck, Long> {
    List<Deck> findByUserId(Long userId);
} 
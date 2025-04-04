package com.juzoai.flashcardapp.controller;

import com.juzoai.flashcardapp.config.JwtConfig;
import com.juzoai.flashcardapp.model.User;
import com.juzoai.flashcardapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtConfig jwtConfig;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registrationRequest) {
        try {
            String username = registrationRequest.get("username");
            String email = registrationRequest.get("email");
            String password = registrationRequest.get("password");
            
            // Validate input
            if (username == null || email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Username, email, and password are required"));
            }
            
            // Check if user already exists
            if (userRepository.existsByEmail(email) || userRepository.existsByUsername(username)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "User already exists"));
            }
            
            // Create new user
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            
            User savedUser = userRepository.save(user);
            
            // Generate JWT token
            String token = jwtConfig.generateToken(
                savedUser.getUsername(), 
                savedUser.getId(), 
                savedUser.getEmail()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", Map.of(
                "id", savedUser.getId(),
                "username", savedUser.getUsername(),
                "email", savedUser.getEmail()
            ));
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");
            
            // Find user by email
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("Invalid credentials"));
                
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), password)
            );
            
            // Generate JWT token
            String token = jwtConfig.generateToken(
                user.getUsername(), 
                user.getId(), 
                user.getEmail()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail()
            ));
            
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid credentials"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Login failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/oauth/callback")
    public ResponseEntity<?> oauthCallback(@RequestBody Map<String, String> oauthRequest) {
        try {
            String email = oauthRequest.get("email");
            String name = oauthRequest.get("name");
            String provider = oauthRequest.get("provider");
            
            if (email == null || name == null || provider == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email, name, and provider are required"));
            }
            
            // Find or create user
            User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User(name, email, provider);
                    return userRepository.save(newUser);
                });
            
            // Generate JWT token
            String token = jwtConfig.generateToken(
                user.getUsername(), 
                user.getId(), 
                user.getEmail()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail()
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "OAuth callback failed: " + e.getMessage()));
        }
    }
} 
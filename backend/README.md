# Flashcard Application Backend

This is the backend API for the Flashcard Application. It is built using Spring Boot, Spring Data JPA, and Spring Security with JWT authentication.

## Technologies Used

- Java 17
- Spring Boot 3.2.3
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL / H2 Database
- Maven

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven
- PostgreSQL (for production)

### Development Setup

1. Clone the repository
2. Navigate to the `backend` directory
3. Run the application using Maven:

```bash
mvn spring-boot:run
```

This will start the application in development mode with an H2 in-memory database.

### Production Setup

For production, you'll need to set the following environment variables:

- `DATABASE_URL`: Your PostgreSQL JDBC URL
- `DATABASE_USERNAME`: Your PostgreSQL username
- `DATABASE_PASSWORD`: Your PostgreSQL password
- `JWT_SECRET`: A secret key for JWT token generation
- `SPRING_PROFILES_ACTIVE=prod`: To use the production profile

Then run:

```bash
mvn spring-boot:run -Dspring.profiles.active=prod
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/oauth/callback` - Handle OAuth authentication

### Decks

- `GET /api/decks` - Get all decks
- `GET /api/decks/{id}` - Get a deck by ID
- `POST /api/decks` - Create a new deck
- `PUT /api/decks/{id}` - Update a deck
- `DELETE /api/decks/{id}` - Delete a deck

### Flashcards

- `GET /api/decks/{deckId}/flashcards` - Get all flashcards for a deck
- `POST /api/decks/{deckId}/flashcards` - Create a new flashcard
- `PUT /api/decks/{deckId}/flashcards/{id}` - Update a flashcard
- `DELETE /api/decks/{deckId}/flashcards/{id}` - Delete a flashcard

## Database Schema

The application uses the following database schema:

- `users` - User data for authentication
- `decks` - Flashcard decks
- `flashcards` - Individual flashcards

## Security

The application uses JWT tokens for authentication. All API endpoints except authentication endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Frontend Integration

The frontend can be configured to use this backend by setting the `REACT_APP_API_URL` environment variable to the backend URL (default: `http://localhost:8080/api`). 
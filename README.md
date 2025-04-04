# FlashCard Study App

A modern flashcard application designed to help you study and track your learning progress. Create custom flashcard decks, study with an interactive interface, track your performance over time, and visualise algorithms and data structures.

## Features

- **Flashcard Management**: Create, edit, and organise flashcards into decks
- **Study Mode**: Interactive study sessions with card flipping and progress tracking
- **Performance Analytics**: Track study performance over time with detailed metrics
- **Data Structure & Algorithm Visualiser**: Interactive visualisations for common DSA concepts
- **Responsive Design**: Optimised for desktop, tablet, and mobile devices
- **Dark Mode**: Enhanced visual experience with dark mode support
- **Import/Export**: Save and share your flashcard decks as JSON files
- **Local Storage**: Performance data is stored locally, no account required

## Tech Stack

### Frontend
- React 19.0.0
- TypeScript 4.9.5
- Material UI 7.0.0
- React Router 7.4.0
- Axios for API requests
- CSS for custom styling

### Backend
- Java 17
- Spring Boot 3.2.3
- Spring Security with JWT authentication
- Spring Data JPA
- H2 Database (development)
- PostgreSQL (production)
- Maven

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Java 17
- Maven
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/flashcard-app.git
cd flashcard-app
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Environment Setup
```bash
# Frontend environment setup (only needed for API URL configuration)
# The default settings should work for local development
# Edit .env file if you need to change API URL
```

4. Start the application

**Backend**:
```bash
cd ../backend
# Run with Maven
mvn spring-boot:run

# Or on Windows, use the provided batch file from the project root
./start-backend.bat
```

**Frontend**:
```bash
cd ../frontend
npm start
```

5. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- H2 Database Console: http://localhost:8080/h2-console (credentials in application.properties)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with credentials

### Decks
- `GET /api/decks` - Get all decks
- `GET /api/decks/{id}` - Get a specific deck
- `POST /api/decks` - Create a new deck
- `PUT /api/decks/{id}` - Update a deck
- `DELETE /api/decks/{id}` - Delete a deck

### Flashcards
- `GET /api/decks/{deckId}/flashcards` - Get all flashcards in a deck
- `POST /api/decks/{deckId}/flashcards` - Create a new flashcard
- `PUT /api/decks/{deckId}/flashcards/{id}` - Update a flashcard
- `DELETE /api/decks/{deckId}/flashcards/{id}` - Delete a flashcard

## Project Structure

```
.
├── backend/                # Spring Boot backend
│   ├── src/                # Java source code
│   │   ├── main/java/      # Main application code
│   │   │   └── com/juzoai/flashcardapp/
│   │   │       ├── config/       # Security and app configuration
│   │   │       ├── controller/   # REST API controllers
│   │   │       ├── model/        # Entity classes
│   │   │       ├── repository/   # JPA repositories
│   │   │       └── service/      # Business logic 
│   │   └── main/resources/ # Application properties and resources
│   ├── pom.xml             # Maven configuration
│
├── frontend/               # React frontend
│   ├── public/             # Static files
│   └── src/                # Source code
│       ├── components/     # React components 
│       ├── contexts/       # React contexts (Auth, etc.)
│       ├── services/       # API service calls
│       ├── utils/          # Utility functions
│       └── App.tsx         # Main application component
│
└── start-backend.bat       # Batch file to start Spring Boot backend (Windows)
```

## Key Application Components

- **DeckList**: View, search, and manage your flashcard decks
- **DeckForm**: Create and edit flashcard decks
- **FlashcardStudy**: Interactive study session with flashcards
- **PerformanceDashboard**: View study performance metrics and progress
- **DSAVisualiser**: Visual representations of data structures and algorithms

## Local Storage

The application uses localStorage to persist:
- User authentication state
- Study performance data
- Recently viewed decks

## Development Notes

- For development, the backend uses an H2 in-memory database
- For production deployment, configure PostgreSQL in application-prod.properties
- The application includes pre-configured JWT authentication
- Default development credentials can be found in schema.sql and data.sql

## Security Considerations

- Default JWT secret should be changed in production
- Password hashing is implemented with BCrypt
- HTTPS is recommended for production deployments

## License

This project is licensed under the MIT License - see the LICENSE file for details.
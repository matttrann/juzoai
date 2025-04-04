# FlashCard Study App

A modern flashcard application designed to help users study and track their learning progress. This application allows you to create custom flashcard decks, study with an interactive interface, track your performance over time, and visualize algorithms and data structures.

## Features

- **Flashcard Management**: Create, edit, and organize flashcards into decks
- **Study Mode**: Interactive study sessions with card flipping and progress tracking
- **Performance Analytics**: Track study performance over time with detailed metrics
- **Data Structure & Algorithm Visualizer**: Interactive visualizations for common DSA concepts
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
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
The backend is implemented with Spring Boot:

- Java 17
- Spring Boot 3.2.3
- Spring Security with JWT authentication
- Spring Data JPA
- PostgreSQL / H2 Database
- Maven

## Getting Started

### Prerequisites
- Node.js (v14 or higher) for running the frontend
- Java 17 for running the Spring Boot backend
- Maven for building the backend
- PostgreSQL (v12 or higher)
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/flashcard-app.git
cd flashcard-app
```

2. Install dependencies
```bash
# Install frontend dependencies
cd frontend
npm install
```

3. Environment Setup
```bash
# Copy the example environment file in the backend directory
cd ../backend
cp .env.example .env

# Copy the example environment file in the frontend directory
cd ../frontend
cp .env.example .env

# Edit the .env files with your configuration settings
```

4. Database Setup
```bash
# Create the database
psql -U postgres -c "CREATE DATABASE flashcards_db;"
```

5. Start the application
```bash
# Start the Spring Boot backend (from the backend directory)
cd ../backend
mvn spring-boot:run

# In Windows, you can also use the provided batch file
# From the project root
./start-backend.bat

# Start the frontend dev server (from the frontend directory)
cd ../frontend
npm start
```

6. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api

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
│   └── .env                # Environment variables
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
- **DSAVisualizer**: Visual representations of data structures and algorithms

## Local Storage

The application uses localStorage to persist:
- User authentication state
- Study performance data
- Recently viewed decks

## Security Considerations

- Environment variables are used for all sensitive configuration
- Password hashing is implemented with BCrypt
- Spring Security provides robust authentication and authorization
- HTTPS is recommended for production deployments

## License

This project is licensed under the MIT License - see the LICENSE file for details.
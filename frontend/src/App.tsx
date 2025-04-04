import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Home from './components/Home';
import DeckList from './components/DeckList';
import FlashcardStudy from './components/FlashcardStudy';
import DeckForm from './components/DeckForm';
import FlashcardForm from './components/FlashcardForm';
import PerformanceDashboard from './components/PerformanceDashboard';
import DSAVisualizer from './components/DSAVisualizer';
import Problems from './components/Problems';
import ProblemDetail from './components/ProblemDetail';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingBarProvider } from './contexts/LoadingBarContext';

function App() {
  // Define dark theme
  const darkTheme = useMemo(() => 
    createTheme({
      palette: {
        mode: 'dark',
        primary: {
          main: '#90caf9',
        },
        secondary: {
          main: '#f48fb1',
        },
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 8,
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 6,
              textTransform: 'none',
            },
          },
        },
      },
    }),
  []);

  return (
    <AuthProvider>
      <ThemeProvider theme={darkTheme}>
        <LoadingBarProvider>
          <CssBaseline />
          <Router>
            <Routes>
              {/* Main application routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="decks" element={<DeckList />} />
                <Route path="decks/new" element={<DeckForm />} />
                <Route path="decks/:deckId/study" element={<FlashcardStudy />} />
                <Route path="decks/:deckId/edit" element={<DeckForm />} />
                <Route path="decks/:deckId/flashcards/new" element={<FlashcardForm />} />
                <Route path="performance" element={<PerformanceDashboard />} />
                <Route path="performance/deck/:deckId" element={<PerformanceDashboard />} />
                <Route path="performance/:deckId" element={<PerformanceDashboard />} />
                <Route path="dsa-visualizer" element={<DSAVisualizer />} />
                <Route path="problems" element={<Problems />} />
                <Route path="problems/:problemId" element={<ProblemDetail />} />
                
                {/* Redirect login/register routes to home */}
                <Route path="login" element={<Navigate replace to="/" />} />
                <Route path="register" element={<Navigate replace to="/" />} />
              </Route>
            </Routes>
          </Router>
        </LoadingBarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

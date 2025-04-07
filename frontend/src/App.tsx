import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, responsiveFontSizes, CssBaseline } from '@mui/material';
import { blue, amber } from '@mui/material/colors';
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
import ProblemRoulette from './components/ProblemRoulette';
import PlinkoGame from './components/PlinkoGame';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingBarProvider } from './contexts/LoadingBarContext';
import { ProblemProgressProvider } from './contexts/ProblemProgressContext';

function App() {
  // Define dark theme
  const theme = useMemo(() => 
    responsiveFontSizes(
      createTheme({
        palette: {
          mode: 'dark',
          primary: {
            main: blue[300],
          },
          secondary: {
            main: amber[500],
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
                backgroundColor: '#1e1e1e',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 15px rgba(0, 0, 0, 0.3)',
                },
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: '#121212',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
              },
              containedPrimary: {
                '&:hover': {
                  boxShadow: '0 8px 16px rgba(33, 150, 243, 0.3)',
                },
              },
            },
          },
        },
      })
    ),
  []);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingBarProvider>
          <ProblemProgressProvider>
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
                  <Route path="problem-roulette" element={<ProblemRoulette />} />
                  <Route path="xp-booster" element={<PlinkoGame />} />
                  <Route path="problems/:problemId" element={<ProblemDetail />} />
                  <Route path=":problemId" element={<ProblemDetail />} />
                  
                  {/* Redirect login/register routes to home */}
                  <Route path="login" element={<Navigate replace to="/" />} />
                  <Route path="register" element={<Navigate replace to="/" />} />
                </Route>
              </Routes>
            </Router>
          </ProblemProgressProvider>
        </LoadingBarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

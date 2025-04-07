import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StyleIcon from '@mui/icons-material/Style';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CodeIcon from '@mui/icons-material/Code';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CasinoIcon from '@mui/icons-material/Casino';
import StarIcon from '@mui/icons-material/Star';
import authService from '../services/authService';

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    setIsLoggedIn(authService.isAuthenticated());
  }, []);

  // Define routes and their corresponding icons
  const routes = [
    {
      name: isLoggedIn ? 'My Decks' : 'Flashcard Decks',
      path: '/decks',
      icon: <StyleIcon />,
      primary: true
    },
    {
      name: 'DSA Visualizer',
      path: '/dsa-visualizer',
      icon: <CodeIcon />,
      primary: false
    },
    {
      name: 'Coding Problems',
      path: '/problems',
      icon: <AssignmentIcon />,
      primary: true
    },
    {
      name: 'Problem Roulette',
      path: '/problem-roulette',
      icon: <CasinoIcon />,
      primary: false
    },
    {
      name: 'Performance Dashboard',
      path: '/performance',
      icon: <EmojiEventsIcon />,
      primary: true
    },
    {
      name: 'XP Booster',
      path: '/xp-booster',
      icon: <StarIcon />,
      primary: false
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        pt: { xs: 4, sm: 8 }, 
        pb: { xs: 6, sm: 10 },
        textAlign: 'center'
      }}>
        <Typography
          component="h1"
          variant={isMobile ? "h4" : "h2"}
          color="text.primary"
          fontWeight="bold"
          gutterBottom
        >
          Rote Learning and DSA Made Easy
        </Typography>
        
        <Typography 
          variant={isMobile ? "body1" : "h6"} 
          color="text.secondary"
          paragraph
          sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}
        >
          This open source app makes learning effortless by combining flashcards for rote memorisation with interactive coding challenges to reinforce your understanding. 
          Quickly review key concepts, test yourself, and apply what you've learned with real coding problems — all in one place!
        </Typography>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          useFlexGap
          flexWrap="wrap"
          justifyContent="center"
          sx={{ mb: 6, gap: 2 }}
        >
          {routes.map((route, index) => (
            <Button 
              key={index}
              variant={route.primary ? "contained" : "outlined"}
              size="large"
              onClick={() => navigate(route.path)}
              startIcon={route.icon}
              sx={{ minWidth: '200px' }}
            >
              {route.name}
            </Button>
          ))}
        </Stack>
      </Box>
    </Container>
  );
};

export default Home; 
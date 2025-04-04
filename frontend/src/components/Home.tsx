import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StyleIcon from '@mui/icons-material/Style';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CodeIcon from '@mui/icons-material/Code';
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

  const features = [
    {
      title: "Create Flashcard Decks",
      description: "Build custom flashcard decks for any subject, complete with titles and descriptions.",
      icon: <StyleIcon fontSize="large" color="primary" />,
      action: () => navigate('/decks')
    },
    {
      title: "Import & Export Decks",
      description: "Save your decks as JSON files to share with friends or import decks created by others.",
      icon: <CloudDownloadIcon fontSize="large" color="primary" />,
      action: () => navigate('/decks')
    },
    {
      title: "Performance Dashboard",
      description: "Track your personal progress with detailed statistics and performance metrics for each deck.",
      icon: <EmojiEventsIcon fontSize="large" color="primary" />,
      action: () => navigate('/performance')
    },
    {
      title: "DSA Visualizer",
      description: "Interactive visualizations for algorithms and data structures including arrays, linked lists, trees, and more.",
      icon: <CodeIcon fontSize="large" color="primary" />,
      action: () => navigate('/dsa-visualizer')
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
          Master Any Subject with Flashcards
        </Typography>
        
        <Typography 
          variant={isMobile ? "body1" : "h6"} 
          color="text.secondary"
          paragraph
          sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}
        >
          Our intelligent flashcard app helps you study more effectively with spaced repetition,
          progress tracking, and interactive visualizations. Create your own decks, import from others,
          and track your progress as you learn.
        </Typography>
        
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          justifyContent: 'center',
          mb: 6
        }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/decks')}
          >
            {isLoggedIn ? 'My Decks' : 'Explore App'}
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate('/dsa-visualizer')}
          >
            Explore Visualizations
          </Button>
        </Box>
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid component="div" sx={{ gridColumn: {xs: 'span 12', sm: 'span 6', md: 'span 3'} }} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[6]
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button size="small" onClick={feature.action}>Learn More</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <Box component={Paper} elevation={2} sx={{ p: 4, mt: 4, mb: 6, borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          New Features
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid component="div" sx={{ gridColumn: {xs: 'span 12', md: 'span 6'} }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                <CloudUploadIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Import & Export Functionality
              </Typography>
              <Typography variant="body2">
                Save your carefully crafted flashcard decks as JSON files and share them with friends or students.
                Import decks from others to expand your learning library without creating cards from scratch.
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                <EmojiEventsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Personal Performance Tracking
              </Typography>
              <Typography variant="body2">
                Monitor your study progress with detailed statistics and performance metrics. Track your improvement over time
                for each deck and identify areas where you need more practice to optimize your learning.
              </Typography>
            </Box>
          </Grid>
          
          <Grid component="div" sx={{ gridColumn: {xs: 'span 12', md: 'span 6'} }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                <CodeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Comprehensive DSA Visualizations
              </Typography>
              <Typography variant="body2">
                Master Data Structures and Algorithms with our interactive visualizations. Explore sorting algorithms, arrays, strings,
                hashing, linked lists, stacks, queues, trees, graphs, heaps, and advanced topics like greedy algorithms, binary search,
                backtracking, and dynamic programming.
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="h6" gutterBottom>
                <StyleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Enhanced Study Experience
              </Typography>
              <Typography variant="body2">
                Study more effectively with our enhanced flashcard system featuring self-assessment, progress tracking,
                and shuffle mode. Rate your knowledge after each card to focus on areas that need improvement.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
        Welcome to our modern flashcard application! Create custom decks for any subject,
        study with interactive flashcards, track your progress, and master new concepts.
        Explore our new import/export feature, visualize algorithms and data structures,
        and improve your learning with detailed performance analytics.
      </Typography>
    </Container>
  );
};

export default Home; 
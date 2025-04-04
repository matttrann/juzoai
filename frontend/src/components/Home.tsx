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

  interface Feature {
    title: string;
    description: string;
    icon: React.ReactNode;
    action: () => void;
  }

  const features: Feature[] = [
    // Features removed as requested
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
    </Container>
  );
};

export default Home; 
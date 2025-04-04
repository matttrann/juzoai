import React from 'react';
import { Box, Typography, Link, useTheme, useMediaQuery, Container } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 4,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.grey[100],
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center"
        >
          Juzo.AI is open source. Contribute on{' '}
          <Link 
            href="https://github.com/matttrann/juzoai" 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{ 
              display: 'inline-flex',
              alignItems: 'center',
              '&:hover': { color: theme.palette.primary.main }
            }}
          >
            <GitHubIcon sx={{ fontSize: '1rem', ml: 0.5, mr: 0.5 }} />
            GitHub
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 
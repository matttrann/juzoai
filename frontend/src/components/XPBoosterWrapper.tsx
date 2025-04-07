import React, { useState, useEffect } from 'react';
import { useProblemProgress } from '../contexts/ProblemProgressContext';
import { Snackbar, Button, Alert, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';

const XPBoosterWrapper: React.FC = () => {
  const { showLevelUpBooster, recentLevelUp, closeLevelUpBooster } = useProblemProgress();
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // When a level up is detected, show the notification instead of the dialog
    if (showLevelUpBooster && recentLevelUp) {
      setShowNotification(true);
      // Close the original booster as we're not using it directly anymore
      closeLevelUpBooster();
    }
  }, [showLevelUpBooster, recentLevelUp, closeLevelUpBooster]);
  
  const handleClose = () => {
    setShowNotification(false);
  };
  
  const goToXPBooster = () => {
    navigate('/xp-booster');
    setShowNotification(false);
  };
  
  return (
    <Snackbar
      open={showNotification}
      autoHideDuration={15000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        severity="success" 
        variant="filled"
        sx={{ 
          width: '100%',
          maxWidth: '500px',
          boxShadow: 4,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
        onClose={handleClose}
        icon={<StarIcon />}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Congratulations! You've reached Level {recentLevelUp}!
          </Typography>
          <Typography variant="body2">
            Visit the XP Booster to earn bonus XP with Plinko!
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button 
              variant="contained" 
              color="warning" 
              size="small" 
              onClick={goToXPBooster}
              sx={{ fontWeight: 'bold' }}
            >
              Play XP Booster Now
            </Button>
          </Box>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default XPBoosterWrapper; 
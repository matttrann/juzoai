import React, { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab, useTheme, useMediaQuery } from '@mui/material';
import DataStructuresVisualizer from './DataStructuresVisualizer';
import AlgorithmsVisualizer from './AlgorithmsVisualizer';

const DSAVisualizer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mainTab, setMainTab] = useState(0);

  const handleMainTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setMainTab(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ pt: { xs: 2, sm: 4 } }}>
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          component="h1"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 4 }}
        >
          Data Structures & Algorithms Visualizer
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs
            value={mainTab}
            onChange={handleMainTabChange}
            aria-label="main dsa visualizer tabs"
            centered={!isMobile}
            variant={isMobile ? 'fullWidth' : 'standard'}
          >
            <Tab label="Data Structures" />
            <Tab label="Algorithms" />
          </Tabs>
        </Box>
        {mainTab === 0 && <DataStructuresVisualizer />}
        {mainTab === 1 && <AlgorithmsVisualizer />}
      </Box>
    </Container>
  );
};

export default DSAVisualizer; 
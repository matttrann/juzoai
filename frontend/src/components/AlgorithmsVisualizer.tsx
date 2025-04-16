import React, { useState } from 'react';
import { Box, Tabs, Tab, Card, CardContent } from '@mui/material';
// Import visualizer components from the dedicated file
import { 
  RecursionVisualizer, 
  SortingVisualizer, 
  BacktrackingVisualizer,
  DynamicProgrammingVisualizer, 
  BitManipulationVisualizer,
  SetAlgorithmsVisualizer,
  SearchAlgorithmsVisualizer,
  StringSearchVisualizer,
  GraphAlgorithmsVisualizer
} from './VisualizerComponents';

const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`alg-tabpanel-${index}`}
      aria-labelledby={`alg-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `alg-tab-${index}`,
    'aria-controls': `alg-tabpanel-${index}`,
  };
};

const AlgorithmsVisualizer: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  return (
    <Card>
      <CardContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" aria-label="algorithms tabs">
            <Tab label="Sorting" {...a11yProps(0)} />
            <Tab label="Search" {...a11yProps(1)} />
            <Tab label="Set Algorithms" {...a11yProps(2)} />
            <Tab label="String Search" {...a11yProps(3)} />
            <Tab label="Graph Algorithms" {...a11yProps(4)} />
            <Tab label="Recursion" {...a11yProps(5)} />
            <Tab label="Dynamic Programming" {...a11yProps(6)} />
            <Tab label="Bit Manipulation" {...a11yProps(7)} />
            <Tab label="Backtracking" {...a11yProps(8)} />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}><SortingVisualizer /></TabPanel>
        <TabPanel value={tabValue} index={1}><SearchAlgorithmsVisualizer /></TabPanel>
        <TabPanel value={tabValue} index={2}><SetAlgorithmsVisualizer /></TabPanel>
        <TabPanel value={tabValue} index={3}><StringSearchVisualizer /></TabPanel>
        <TabPanel value={tabValue} index={4}><GraphAlgorithmsVisualizer /></TabPanel>
        <TabPanel value={tabValue} index={5}><RecursionVisualizer /></TabPanel>
        <TabPanel value={tabValue} index={6}><DynamicProgrammingVisualizer /></TabPanel>
        <TabPanel value={tabValue} index={7}><BitManipulationVisualizer /></TabPanel>
        <TabPanel value={tabValue} index={8}><BacktrackingVisualizer /></TabPanel>
      </CardContent>
    </Card>
  );
};

export default AlgorithmsVisualizer; 
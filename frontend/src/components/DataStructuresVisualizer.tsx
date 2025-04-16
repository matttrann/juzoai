import React, { useState } from 'react';
import { Box, Tabs, Tab, Card, CardContent } from '@mui/material';
// Import visualizer components from the dedicated file
import { ArraysVisualizer, LinkedListsVisualizer, TreesVisualizer, HeapVisualizer, HashingVisualizer, GraphsVisualizer } from './VisualizerComponents';

const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ds-tabpanel-${index}`}
      aria-labelledby={`ds-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `ds-tab-${index}`,
    'aria-controls': `ds-tabpanel-${index}`,
  };
};

const DataStructuresVisualizer: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  return (
    <Card>
      <CardContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" aria-label="data structures tabs">
            <Tab label="Arrays" {...a11yProps(0)} />
            <Tab label="Linked Lists" {...a11yProps(1)} />
            <Tab label="Trees" {...a11yProps(2)} />
            <Tab label="Heap/Priority Queue" {...a11yProps(3)} />
            <Tab label="Hashing" {...a11yProps(4)} />
            <Tab label="Graphs" {...a11yProps(5)} />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}><ArraysVisualizer /></TabPanel>
        <TabPanel value={tabValue} index={1}><LinkedListsVisualizer /></TabPanel>
        <TabPanel value={tabValue} index={2}><TreesVisualizer /></TabPanel>
        <TabPanel value={tabValue} index={3}><HeapVisualizer /></TabPanel>
        <TabPanel value={tabValue} index={4}><HashingVisualizer /></TabPanel>
        <TabPanel value={tabValue} index={5}><GraphsVisualizer /></TabPanel>
      </CardContent>
    </Card>
  );
};

export default DataStructuresVisualizer; 
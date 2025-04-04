import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Slider,
  Divider,
  Paper,
  Grid
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dsa-tabpanel-${index}`}
      aria-labelledby={`dsa-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `dsa-tab-${index}`,
    'aria-controls': `dsa-tabpanel-${index}`,
  };
};

// Array visualization component
const ArrayVisualizer: React.FC = () => {
  const theme = useTheme();
  const [array, setArray] = useState<number[]>([23, 45, 12, 8, 67, 34, 19]);
  const [inputValue, setInputValue] = useState('');
  const [animationSpeed, setAnimationSpeed] = useState<number>(50);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState('bubbleSort');
  const [highlightIndices, setHighlightIndices] = useState<number[]>([]);
  const [sortingStep, setSortingStep] = useState(0);
  const [sortingSteps, setSortingSteps] = useState<{array: number[], highlights: number[]}[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddValue = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      setArray([...array, value]);
      setInputValue('');
    }
  };

  const handleRandomize = () => {
    const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100));
    setArray(newArray);
    resetAnimation();
  };

  const handleAlgorithmChange = (event: SelectChangeEvent) => {
    setCurrentAlgorithm(event.target.value);
    resetAnimation();
  };

  const handleSpeedChange = (event: Event, newValue: number | number[]) => {
    setAnimationSpeed(newValue as number);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setHighlightIndices([]);
    setSortingStep(0);
    setSortingSteps([]);
  };

  const generateSortingSteps = () => {
    if (currentAlgorithm === 'bubbleSort') {
      return generateBubbleSortSteps();
    } else if (currentAlgorithm === 'selectionSort') {
      return generateSelectionSortSteps();
    } else if (currentAlgorithm === 'insertionSort') {
      return generateInsertionSortSteps();
    }
    return [];
  };

  const generateBubbleSortSteps = () => {
    const steps: {array: number[], highlights: number[]}[] = [];
    const arr = [...array];
    const n = arr.length;
    
    steps.push({array: [...arr], highlights: [0, 1]});
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({array: [...arr], highlights: [j, j+1]});
        
        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          steps.push({array: [...arr], highlights: [j, j+1]});
        }
      }
    }
    
    steps.push({array: [...arr], highlights: []});
    return steps;
  };

  const generateSelectionSortSteps = () => {
    const steps: {array: number[], highlights: number[]}[] = [];
    const arr = [...array];
    const n = arr.length;
    
    for (let i = 0; i < n; i++) {
      let minIdx = i;
      steps.push({array: [...arr], highlights: [i, minIdx]});
      
      for (let j = i + 1; j < n; j++) {
        steps.push({array: [...arr], highlights: [minIdx, j]});
        
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          steps.push({array: [...arr], highlights: [i, minIdx]});
        }
      }
      
      if (minIdx !== i) {
        const temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
        steps.push({array: [...arr], highlights: [i, minIdx]});
      }
    }
    
    steps.push({array: [...arr], highlights: []});
    return steps;
  };

  const generateInsertionSortSteps = () => {
    const steps: {array: number[], highlights: number[]}[] = [];
    const arr = [...array];
    const n = arr.length;
    
    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;
      
      steps.push({array: [...arr], highlights: [i]});
      
      while (j >= 0 && arr[j] > key) {
        steps.push({array: [...arr], highlights: [j, j+1]});
        arr[j + 1] = arr[j];
        j--;
        steps.push({array: [...arr], highlights: [j+1]});
      }
      
      arr[j + 1] = key;
      steps.push({array: [...arr], highlights: [j+1]});
    }
    
    steps.push({array: [...arr], highlights: []});
    return steps;
  };

  const startAnimation = () => {
    if (sortingSteps.length === 0) {
      const steps = generateSortingSteps();
      setSortingSteps(steps);
    }
    
    setIsAnimating(true);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
  };

  const resetVisualizer = () => {
    resetAnimation();
  };

  React.useEffect(() => {
    if (isAnimating && sortingSteps.length > 0) {
      if (sortingStep >= sortingSteps.length) {
        setIsAnimating(false);
        return;
      }
      
      const timeout = setTimeout(() => {
        const currentStep = sortingSteps[sortingStep];
        setArray(currentStep.array);
        setHighlightIndices(currentStep.highlights);
        setSortingStep(sortingStep + 1);
      }, 1000 - (animationSpeed * 9)); // Adjust timing: 100ms (fast) to 1000ms (slow)
      
      return () => clearTimeout(timeout);
    }
  }, [isAnimating, sortingStep, sortingSteps, animationSpeed]);
  
  return (
    <Box>
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Controls</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="algorithm-select-label">Algorithm</InputLabel>
              <Select
                labelId="algorithm-select-label"
                id="algorithm-select"
                value={currentAlgorithm}
                label="Algorithm"
                onChange={handleAlgorithmChange}
              >
                <MenuItem value="bubbleSort">Bubble Sort</MenuItem>
                <MenuItem value="selectionSort">Selection Sort</MenuItem>
                <MenuItem value="insertionSort">Insertion Sort</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              label="Add Number"
              variant="outlined"
              fullWidth
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAddValue();
              }}
              margin="normal"
              type="number"
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleAddValue}
                sx={{ mr: 1 }}
                disabled={isAnimating || inputValue === ''}
              >
                Add
              </Button>
              <Button
                variant="outlined"
                onClick={handleRandomize}
                disabled={isAnimating}
                sx={{ mr: 1 }}
              >
                Randomize
              </Button>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ display: 'flex', mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<PlayArrowIcon />}
                onClick={startAnimation}
                disabled={isAnimating}
                sx={{ mr: 1 }}
              >
                Start
              </Button>
              
              <Button 
                variant="outlined" 
                color="secondary"
                startIcon={<StopIcon />}
                onClick={stopAnimation}
                disabled={!isAnimating}
                sx={{ mr: 1 }}
              >
                Stop
              </Button>
              
              <Button 
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={resetVisualizer}
              >
                Reset
              </Button>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12 }}>
            <Typography id="speed-slider" gutterBottom>
              Animation Speed
            </Typography>
            <Slider
              value={animationSpeed}
              onChange={handleSpeedChange}
              aria-labelledby="speed-slider"
              valueLabelDisplay="auto"
              step={10}
              marks
              min={10}
              max={100}
              disabled={isAnimating}
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, minHeight: '250px' }}>
        <Typography variant="h6" gutterBottom align="center">
          {currentAlgorithm === 'bubbleSort' ? 'Bubble Sort' :
           currentAlgorithm === 'selectionSort' ? 'Selection Sort' :
           currentAlgorithm === 'insertionSort' ? 'Insertion Sort' : ''}
          {sortingStep > 0 && ` (Step ${sortingStep} of ${sortingSteps.length})`}
        </Typography>
        
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          minHeight: '180px',
          mt: 3
        }}>
          {array.map((value, index) => (
            <Box
              key={index}
              sx={{
                width: '40px',
                height: `${Math.max(30, value * 1.5)}px`,
                backgroundColor: highlightIndices.includes(index) ? theme.palette.secondary.main : theme.palette.primary.main,
                m: '0 4px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                pb: 1,
                color: '#fff',
                transition: 'all 0.3s ease',
                boxShadow: highlightIndices.includes(index) ? '0 0 8px rgba(0,0,0,0.5)' : 'none',
                position: 'relative',
                borderRadius: '4px 4px 0 0'
              }}
            >
              {value}
            </Box>
          ))}
        </Box>
      </Paper>
      
      <Paper elevation={2} sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Algorithm Description</Typography>
        <Typography variant="body2">
          {currentAlgorithm === 'bubbleSort' && (
            <>
              <strong>Bubble Sort</strong> is one of the simplest sorting algorithms. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This process is repeated until the list is sorted. Time complexity: O(n²).
            </>
          )}
          {currentAlgorithm === 'selectionSort' && (
            <>
              <strong>Selection Sort</strong> works by finding the minimum element from the unsorted part of the array and putting it at the beginning. The algorithm maintains two subarrays: a sorted subarray and an unsorted subarray. Time complexity: O(n²).
            </>
          )}
          {currentAlgorithm === 'insertionSort' && (
            <>
              <strong>Insertion Sort</strong> builds the final sorted array one item at a time. It takes one element from the input data and finds the location it belongs in the sorted list, then inserts it there. Time complexity: O(n²) in the worst case.
            </>
          )}
        </Typography>
      </Paper>
    </Box>
  );
};

// Binary Search Tree Visualizer component placeholder
const BSTVisualizer: React.FC = () => {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Binary Search Tree Visualization
        </Typography>
        <Typography variant="body1" sx={{ mt: 8 }}>
          Binary Search Tree visualization will be implemented in a future update.
        </Typography>
      </Paper>
    </Box>
  );
};

// Linked List Visualizer component placeholder
const LinkedListVisualizer: React.FC = () => {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Linked List Visualization
        </Typography>
        <Typography variant="body1" sx={{ mt: 8 }}>
          Linked List visualization will be implemented in a future update.
        </Typography>
      </Paper>
    </Box>
  );
};

// Additional placeholder components for new visualization sections
const ArraysAndStringsVisualizer: React.FC = () => {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Arrays and Strings Visualization
        </Typography>
        <Typography variant="body1" sx={{ mt: 8 }}>
          Arrays and Strings visualizations will be implemented in a future update.
          Topics will include common operations, searching, pattern matching, and string manipulation algorithms.
        </Typography>
      </Paper>
    </Box>
  );
};

const HashingVisualizer: React.FC = () => {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Hashing Visualization
        </Typography>
        <Typography variant="body1" sx={{ mt: 8 }}>
          Hashing visualizations will be implemented in a future update.
          Topics will include hash functions, collision resolution strategies, and hash table operations.
        </Typography>
      </Paper>
    </Box>
  );
};

const StacksQueuesVisualizer: React.FC = () => {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Stacks and Queues Visualization
        </Typography>
        <Typography variant="body1" sx={{ mt: 8 }}>
          Stack and Queue visualizations will be implemented in a future update.
          Topics will include push/pop operations, enqueue/dequeue operations, and real-world applications.
        </Typography>
      </Paper>
    </Box>
  );
};

const TreesGraphsVisualizer: React.FC = () => {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Trees and Graphs Visualization
        </Typography>
        <Typography variant="body1" sx={{ mt: 8 }}>
          Tree and Graph visualizations will be implemented in a future update.
          Topics will include traversal algorithms, balancing, shortest path algorithms, and MST.
        </Typography>
      </Paper>
    </Box>
  );
};

const HeapsVisualizer: React.FC = () => {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Heaps Visualization
        </Typography>
        <Typography variant="body1" sx={{ mt: 8 }}>
          Heap visualizations will be implemented in a future update.
          Topics will include min/max heap operations, heapify, and heap sort.
        </Typography>
      </Paper>
    </Box>
  );
};

const GreedyVisualizer: React.FC = () => {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Greedy Algorithms Visualization
        </Typography>
        <Typography variant="body1" sx={{ mt: 8 }}>
          Greedy algorithm visualizations will be implemented in a future update.
          Topics will include activity selection, Huffman coding, and Dijkstra's algorithm.
        </Typography>
      </Paper>
    </Box>
  );
};

const BinarySearchVisualizer: React.FC = () => {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Binary Search Visualization
        </Typography>
        <Typography variant="body1" sx={{ mt: 8 }}>
          Binary search visualizations will be implemented in a future update.
          Topics will include iterative and recursive implementations, variations, and applications.
        </Typography>
      </Paper>
    </Box>
  );
};

const BacktrackingVisualizer: React.FC = () => {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Backtracking Visualization
        </Typography>
        <Typography variant="body1" sx={{ mt: 8 }}>
          Backtracking visualizations will be implemented in a future update.
          Topics will include N-Queens, Sudoku solver, and permutation generation.
        </Typography>
      </Paper>
    </Box>
  );
};

const DynamicProgrammingVisualizer: React.FC = () => {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Dynamic Programming Visualization
        </Typography>
        <Typography variant="body1" sx={{ mt: 8 }}>
          Dynamic programming visualizations will be implemented in a future update.
          Topics will include memoization, tabulation, and classic DP problems.
        </Typography>
      </Paper>
    </Box>
  );
};

// Main DSA Visualizer component
const DSAVisualizer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ pt: { xs: 2, sm: 4 } }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1"
          align="center"
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            mb: 4
          }}
        >
          Data Structures & Algorithms Visualizer
        </Typography>
        
        <Card>
          <CardContent>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="dsa visualizer tabs"
              >
                <Tab label="Sorting Algorithms" {...a11yProps(0)} />
                <Tab label="Arrays & Strings" {...a11yProps(1)} />
                <Tab label="Hashing" {...a11yProps(2)} />
                <Tab label="Linked Lists" {...a11yProps(3)} />
                <Tab label="Stacks & Queues" {...a11yProps(4)} />
                <Tab label="Trees & Graphs" {...a11yProps(5)} />
                <Tab label="Heaps" {...a11yProps(6)} />
                <Tab label="Greedy Algorithms" {...a11yProps(7)} />
                <Tab label="Binary Search" {...a11yProps(8)} />
                <Tab label="Backtracking" {...a11yProps(9)} />
                <Tab label="Dynamic Programming" {...a11yProps(10)} />
              </Tabs>
            </Box>
            
            <TabPanel value={tabValue} index={0}>
              <ArrayVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <ArraysAndStringsVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <HashingVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={3}>
              <LinkedListVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={4}>
              <StacksQueuesVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={5}>
              <TreesGraphsVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={6}>
              <HeapsVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={7}>
              <GreedyVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={8}>
              <BinarySearchVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={9}>
              <BacktrackingVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={10}>
              <DynamicProgrammingVisualizer />
            </TabPanel>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default DSAVisualizer; 
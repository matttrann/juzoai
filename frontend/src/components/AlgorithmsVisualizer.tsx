import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Card, 
  CardContent, 
  styled, 
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Grid,
  Paper,
  Button,
  Slider,
  ButtonGroup,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import CodeIcon from '@mui/icons-material/Code';
import InfoIcon from '@mui/icons-material/Info';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';

// Import visualizer components from the dedicated file
import { 
  RecursionVisualizer, 
  SortingVisualizer, 
  BacktrackingVisualizer,
  DynamicProgrammingVisualizer, 
  BitManipulationVisualizer,
  SetAlgorithmsVisualizer,
  SearchAlgorithmsVisualizer,
  StringSearchVisualizerPlaceholder as StringSearchVisualizer,
  GraphAlgorithmsVisualizer,
  SearchAlgorithmsVisualizerPlaceholder,
  GraphAlgorithmsVisualizerPlaceholder,
  DijkstraAlgorithmVisualizer,
  PrimAlgorithmVisualizer,
  AStarAlgorithmVisualizer,
  VisualizerProps
} from './VisualizerComponents';

// Style the tabs to prevent movement on hover
const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: '48px',
  padding: '12px 16px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transition: 'background-color 0.3s'
  }
}));

const CategoryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6]
  }
}));

const VisualizationContainer = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  minHeight: '300px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default
}));

const CodeBlock = styled(Box)(({ theme }) => ({
  fontFamily: 'monospace',
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  overflowX: 'auto',
  fontSize: '0.9rem',
  lineHeight: 1.5
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  flexWrap: 'wrap'
}));

const InstructionsAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '&:before': {
    display: 'none',
  },
}));

const a11yProps = (index: number) => {
  return {
    id: `alg-tab-${index}`,
    'aria-controls': `alg-tabpanel-${index}`,
  };
};

// Type definitions for algorithm data
interface PseudocodeMap {
  [key: string]: string[];
}

interface ExplanationMap {
  [key: string]: string;
}

interface InstructionMap {
  [key: string]: {
    title: string;
    steps: string[];
    tips: string[];
  };
}

interface Algorithm {
  name: string;
  component: React.FC | React.FC<VisualizerProps>;
}

interface AlgorithmCategory {
  name: string;
  description: string;
  algorithms: Algorithm[];
}

// Sample pseudocode for algorithms
const samplePseudocode: PseudocodeMap = {
  "Heapsort": [
    "BUILD-MAX-HEAP(A)",
    "for i = A.length downto 2",
    "    swap A[1] with A[i]",
    "    A.heap-size = A.heap-size - 1",
    "    MAX-HEAPIFY(A, 1)"
  ],
  "Quicksort": [
    "if p < r",
    "    q = PARTITION(A, p, r)",
    "    QUICKSORT(A, p, q-1)",
    "    QUICKSORT(A, q+1, r)"
  ],
  "Binary Search": [
    "low = 0, high = n-1",
    "while low <= high:",
    "    mid = floor((low + high) / 2)",
    "    if A[mid] < target:",
    "        low = mid + 1",
    "    else if A[mid] > target:",
    "        high = mid - 1",
    "    else:",
    "        return mid",
    "return -1"
  ],
  "Depth First Search": [
    "DFS(G, v)",
    "    mark v as visited",
    "    for all neighbors w of v in Graph G:",
    "        if w is not visited:",
    "            DFS(G, w)"
  ]
};

// Algorithm explanation samples
const algorithmExplanations: ExplanationMap = {
  "Heapsort": "Heapsort is a comparison-based sorting algorithm that uses a binary heap data structure. It divides the input into a sorted and an unsorted region, and iteratively shrinks the unsorted region by extracting the largest element and moving it to the sorted region.",
  "Quicksort": "Quicksort is an efficient, divide-and-conquer sorting algorithm that works by selecting a 'pivot' element and partitioning the array around the pivot so that elements less than the pivot are on the left and elements greater are on the right.",
  "Binary Search": "Binary search is an efficient algorithm for finding a target value within a sorted array. It works by repeatedly dividing in half the portion of the list that could contain the item, until the possible locations are reduced to just one.",
  "Depth First Search": "Depth-first search (DFS) is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node and explores as far as possible along each branch before backtracking."
};

// Step-by-step instructions for algorithms
const algorithmInstructions: InstructionMap = {
  "Heapsort": {
    title: "How to Visualize Heapsort",
    steps: [
      "Start by examining the initial array that needs to be sorted",
      "Watch as the array is transformed into a max heap structure",
      "Observe how the largest element (root) is swapped with the last unsorted element",
      "See the heap size decrease and the max-heapify operation restore the heap property",
      "Continue until all elements are sorted in ascending order"
    ],
    tips: [
      "Pay attention to how the heap property is maintained after each swap",
      "Notice that the sorted portion grows from right to left",
      "The algorithm has O(n log n) time complexity"
    ]
  },
  "Quicksort": {
    title: "How to Visualize Quicksort",
    steps: [
      "Begin with the unsorted array and observe the selection of a pivot element",
      "Watch as elements are partitioned around the pivot (smaller elements to the left, larger to the right)",
      "Follow the recursive calls on the left and right subarrays",
      "Notice how the pivot elements are placed in their final sorted positions",
      "Continue until the entire array is sorted"
    ],
    tips: [
      "The choice of pivot affects the efficiency of quicksort",
      "In the worst case (already sorted array with first/last element as pivot), complexity is O(n²)",
      "Average case performance is O(n log n)"
    ]
  },
  "Binary Search": {
    title: "How to Visualize Binary Search",
    steps: [
      "Start with a sorted array and the target value to find",
      "Observe the middle element being compared to the target",
      "Watch how the search space is halved in each step",
      "Follow the algorithm as it focuses on either the left or right half",
      "Continue until the target is found or determined to be absent"
    ],
    tips: [
      "Binary search only works on sorted arrays",
      "The algorithm has O(log n) time complexity",
      "Pay attention to how the low and high pointers move in each step"
    ]
  },
  "Depth First Search": {
    title: "How to Visualize Depth First Search",
    steps: [
      "Begin at the starting vertex and mark it as visited",
      "Follow the algorithm as it explores as far as possible along a branch",
      "Observe the recursive calls that explore each unvisited neighbor",
      "Watch the backtracking when a vertex has no more unvisited neighbors",
      "Continue until all reachable vertices are visited"
    ],
    tips: [
      "DFS can be implemented recursively or iteratively with a stack",
      "Pay attention to the order in which vertices are visited",
      "DFS has O(V + E) time complexity where V is vertices and E is edges"
    ]
  }
};

// Definition of algorithm categories with their subcategories
const algorithmCategories: AlgorithmCategory[] = [
  {
    name: "Sorting",
    description: "Algorithms that arrange elements in a specific order",
    algorithms: [
      { name: "Heapsort", component: SortingVisualizer },
      { name: "Quicksort", component: SortingVisualizer },
      { name: "Quicksort (Median of 3)", component: SortingVisualizer },
      { name: "Merge Sort (top-down)", component: SortingVisualizer },
      { name: "Merge Sort (bottom-up)", component: SortingVisualizer },
      { name: "Merge Sort (natural)", component: SortingVisualizer },
      { name: "Radix Sort (MSD/Exchange)", component: SortingVisualizer },
      { name: "Radix Sort (LSD/Straight)", component: SortingVisualizer }
    ]
  },
  {
    name: "Searching",
    description: "Algorithms for finding elements within data structures",
    algorithms: [
      { name: "Binary Search", component: SearchAlgorithmsVisualizer },
      { name: "Binary Search Tree", component: SearchAlgorithmsVisualizerPlaceholder },
      { name: "AVL Tree", component: SearchAlgorithmsVisualizerPlaceholder },
      { name: "2-3-4 Tree", component: SearchAlgorithmsVisualizerPlaceholder },
      { name: "Hashing (Linear Probing)", component: SearchAlgorithmsVisualizerPlaceholder },
      { name: "Hashing (Double Hashing)", component: SearchAlgorithmsVisualizerPlaceholder },
      { name: "Hashing (Chaining)", component: SearchAlgorithmsVisualizerPlaceholder }
    ]
  },
  {
    name: "String Searching",
    description: "Algorithms for finding patterns in text",
    algorithms: [
      { name: "Brute Force", component: StringSearchVisualizer },
      { name: "Horspool's", component: StringSearchVisualizer }
    ]
  },
  {
    name: "Graph Algorithms",
    description: "Algorithms that operate on graph data structures",
    algorithms: [
      { name: "Depth First Search", component: GraphAlgorithmsVisualizer },
      { name: "DFS (iterative)", component: GraphAlgorithmsVisualizer },
      { name: "Breadth First Search", component: GraphAlgorithmsVisualizer },
      { name: "Dijkstra's (shortest path)", component: DijkstraAlgorithmVisualizer },
      { name: "A* (heuristic search)", component: AStarAlgorithmVisualizer },
      { name: "Prim's (min. spanning tree)", component: PrimAlgorithmVisualizer },
      { name: "Prim's (simpler code)", component: PrimAlgorithmVisualizer },
      { name: "Kruskal's (min. spanning tree)", component: GraphAlgorithmsVisualizerPlaceholder },
      { name: "Warshall's (transitive closure)", component: GraphAlgorithmsVisualizerPlaceholder }
    ]
  },
  {
    name: "Set Algorithms",
    description: "Algorithms that operate on sets of elements",
    algorithms: [
      { name: "Union Find", component: SetAlgorithmsVisualizer }
    ]
  },
  {
    name: "Recursion & Backtracking",
    description: "Algorithms that solve problems by recursively breaking them down",
    algorithms: [
      { name: "Recursion", component: RecursionVisualizer },
      { name: "Backtracking", component: BacktrackingVisualizer }
    ]
  },
  {
    name: "Advanced Techniques",
    description: "Complex algorithmic paradigms for solving challenging problems",
    algorithms: [
      { name: "Dynamic Programming", component: DynamicProgrammingVisualizer },
      { name: "Bit Manipulation", component: BitManipulationVisualizer }
    ]
  }
];

// Step explanations for select algorithms
const stepExplanations: Record<string, string[]> = {
  "Heapsort": [
    "Building a max heap from the input array",
    "Swapping the root (maximum element) with the last unsorted element",
    "Decreasing the heap size and running max-heapify to restore heap property",
    "Continuing the process until all elements are sorted",
    "The array is now sorted in ascending order"
  ],
  "Quicksort": [
    "Selecting a pivot element from the array",
    "Partitioning the array around the pivot",
    "Recursively sorting the subarray with elements less than the pivot",
    "Recursively sorting the subarray with elements greater than the pivot",
    "Combining the sorted subarrays to get the final sorted array"
  ],
  "Binary Search": [
    "Initializing search boundaries to cover the entire array",
    "Finding the middle element and comparing with the target value",
    "Narrowing down the search space to either the left or right half",
    "Repeating the process with the new boundaries until the target is found",
    "Either returning the found index or indicating that the target doesn't exist"
  ],
  "Depth First Search": [
    "Starting at the initial vertex and marking it as visited",
    "Exploring the first unvisited neighbor and recursively visiting its neighbors",
    "Backtracking when a vertex has no more unvisited neighbors",
    "Continuing the exploration from the next unvisited neighbor",
    "Completing the traversal when all reachable vertices have been visited"
  ]
};

const AlgorithmsVisualizer: React.FC = () => {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [algorithmIndex, setAlgorithmIndex] = useState(0);
  const [showCode, setShowCode] = useState(true);
  const [showExplanation, setShowExplanation] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  // For pseudocode highlighting
  const [currentStep, setCurrentStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(5);
  
  const handleCategoryChange = (event: React.SyntheticEvent, newValue: number) => {
    setCategoryIndex(newValue);
    setAlgorithmIndex(0); // Reset algorithm index when changing category
  };

  const handleAlgorithmSelect = (index: number) => {
    setAlgorithmIndex(index);
  };

  const toggleCode = () => {
    setShowCode(!showCode);
  };

  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };
  
  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  // Main view that shows all categories
  const MainCategoryView = () => (
    <Grid container spacing={3}>
      {algorithmCategories.map((category, index) => (
        <Grid item xs={12} sm={6} md={4} key={category.name}>
          <CategoryCard 
            elevation={3} 
            onClick={() => setCategoryIndex(index)}
            sx={{ cursor: 'pointer' }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              {category.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {category.description}
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Typography variant="caption" color="primary">
                {category.algorithms.length} algorithm{category.algorithms.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </CategoryCard>
        </Grid>
      ))}
    </Grid>
  );

  // Selected category with its algorithms
  const CategoryView = () => {
    const category = algorithmCategories[categoryIndex];
    const selectedAlgorithm = category.algorithms[algorithmIndex];
    
    // Get algorithm-specific data with fallbacks
    const pseudocode = samplePseudocode[selectedAlgorithm.name] || ["// Pseudocode not available"];
    const explanation = algorithmExplanations[selectedAlgorithm.name] || "Explanation not available for this algorithm.";
    const instructions = algorithmInstructions[selectedAlgorithm.name] || {
      title: `How to Visualize ${selectedAlgorithm.name}`,
      steps: ["Follow along with the visualization steps"],
      tips: ["No specific tips available for this algorithm"]
    };
    
    // Get step-specific explanation
    const stepExplanationsForAlgorithm = stepExplanations[selectedAlgorithm.name] || 
      Array(maxSteps).fill("No detailed explanation available for this step");
    const currentStepExplanation = stepExplanationsForAlgorithm[currentStep] || 
      "No explanation available for this step";
    
    // Use a type to handle the component with props
    const SelectedVisualizerComponent = selectedAlgorithm.component as React.FC<VisualizerProps>;
    
    // Determine if the component accepts algorithmName prop
    const isInteractiveVisualizer = 
      selectedAlgorithm.component === SortingVisualizer || 
      selectedAlgorithm.component === SearchAlgorithmsVisualizer || 
      selectedAlgorithm.component === GraphAlgorithmsVisualizer;
      
    return (
      <Grid container spacing={3}>
        {/* Sidebar with algorithm list */}
        <Grid item xs={12} sm={4} md={3}>
          <Paper elevation={2} sx={{ height: '100%' }}>
            <Typography variant="h6" sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
              {category.name}
            </Typography>
            <List component="nav" dense>
              {category.algorithms.map((algorithm, index) => (
                <React.Fragment key={algorithm.name}>
                  <ListItemButton
                    selected={algorithmIndex === index}
                    onClick={() => handleAlgorithmSelect(index)}
                  >
                    <ListItemText primary={algorithm.name} />
                  </ListItemButton>
                  {index < category.algorithms.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {category.description}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Main content area */}
        <Grid item xs={12} sm={8} md={9}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" color="primary.main">
                  {selectedAlgorithm.name}
                </Typography>
                <Button
                  startIcon={<HelpOutlineIcon />}
                  variant="outlined"
                  size="small"
                  onClick={toggleInstructions}
                >
                  Instructions
                </Button>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              {/* Instructions section */}
              {showInstructions && (
                <InstructionsAccordion expanded={showInstructions}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="instructions-content"
                    id="instructions-header"
                  >
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                      <SchoolIcon sx={{ mr: 1 }} />
                      {instructions.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="subtitle1" gutterBottom>Steps to Follow:</Typography>
                    <ol>
                      {instructions.steps.map((step, idx) => (
                        <li key={idx}>
                          <Typography variant="body1" paragraph>
                            {step}
                          </Typography>
                        </li>
                      ))}
                    </ol>
                    
                    <Typography variant="subtitle1" gutterBottom>Tips:</Typography>
                    <ul>
                      {instructions.tips.map((tip, idx) => (
                        <li key={idx}>
                          <Typography variant="body1">
                            {tip}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </AccordionDetails>
                </InstructionsAccordion>
              )}
              
              {/* Algorithm visualization container */}
              <VisualizationContainer sx={{ mb: 3 }}>
                {isInteractiveVisualizer ? (
                  <SelectedVisualizerComponent algorithmName={selectedAlgorithm.name} />
                ) : (
                  selectedAlgorithm.component({})
                )}
              </VisualizationContainer>
              
              {/* Information toggle controls */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <IconButton 
                  color={showCode ? "primary" : "default"} 
                  onClick={toggleCode}
                  aria-label="Toggle pseudocode"
                >
                  <CodeIcon />
                </IconButton>
                <IconButton 
                  color={showExplanation ? "primary" : "default"} 
                  onClick={toggleExplanation}
                  aria-label="Toggle explanation"
                >
                  <InfoIcon />
                </IconButton>
              </Box>
              
              {/* Pseudocode and explanation section */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {/* Pseudocode section */}
                {showCode && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Pseudocode
                    </Typography>
                    <CodeBlock>
                      {pseudocode.map((line: string, index: number) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            p: 0.5, 
                            borderLeft: '3px solid', 
                            borderColor: index === currentStep ? 'primary.main' : 'transparent',
                            bgcolor: index === currentStep ? 'action.hover' : 'transparent',
                            pl: 1
                          }}
                        >
                          {line}
                        </Box>
                      ))}
                    </CodeBlock>
                  </Grid>
                )}
                
                {/* Explanation section */}
                {showExplanation && (
                  <Grid item xs={12} md={showCode ? 6 : 12}>
                    <Typography variant="h6" gutterBottom>
                      Explanation
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="body1" paragraph>
                        {explanation}
                      </Typography>
                      
                      {/* Step-specific explanation */}
                      <Box sx={{ mt: 2, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Current step explanation:
                        </Typography>
                        <Typography variant="body2">
                          {currentStepExplanation}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={categoryIndex} 
            onChange={handleCategoryChange} 
            variant="scrollable" 
            scrollButtons="auto" 
            aria-label="algorithm categories tabs"
          >
            {algorithmCategories.map((category, index) => (
              <StyledTab key={category.name} label={category.name} {...a11yProps(index)} />
            ))}
          </Tabs>
        </Box>

        {categoryIndex === -1 ? <MainCategoryView /> : <CategoryView />}
      </CardContent>
    </Card>
  );
};

export default AlgorithmsVisualizer; 
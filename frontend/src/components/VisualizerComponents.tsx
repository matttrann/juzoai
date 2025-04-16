import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';

// Helper function to create placeholder visualizer components
const createPlaceholderVisualizer = (name: string) => {
  const Component: React.FC = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>{name}</Typography>
      <Typography variant="body1" paragraph>
        This visualizer helps you understand {name.toLowerCase()} concepts through interactive visualizations.
      </Typography>
      <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1">
          {name} visualization is currently under development.
        </Typography>
      </Paper>
    </Box>
  );
  return Component;
};

// Helper function to create algorithm category visualizers with lists of specific algorithms
const createAlgorithmCategoryVisualizer = (name: string, algorithms: string[]) => {
  const Component: React.FC = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>{name}</Typography>
      <Typography variant="body1" paragraph>
        This section contains visualizations for various {name.toLowerCase()} algorithms.
      </Typography>
      <Paper elevation={3} sx={{ p: 3, minHeight: '300px' }}>
        <Typography variant="h6" gutterBottom>Available Algorithms:</Typography>
        <List>
          {algorithms.map((algorithm, index) => (
            <React.Fragment key={algorithm}>
              <ListItem>
                <ListItemText 
                  primary={algorithm} 
                  secondary="Select to view algorithm visualization" 
                />
              </ListItem>
              {index < algorithms.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Click on an algorithm to view its detailed visualization.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
  return Component;
};

// Data Structures Visualizers
export const ArraysVisualizer = createPlaceholderVisualizer('Arrays');
export const LinkedListsVisualizer = createPlaceholderVisualizer('Linked Lists');
export const TreesVisualizer = createPlaceholderVisualizer('Trees');
export const HeapVisualizer = createPlaceholderVisualizer('Heap/Priority Queue');
export const HashingVisualizer = createPlaceholderVisualizer('Hashing');
export const GraphsVisualizer = createPlaceholderVisualizer('Graphs');

// Sort Algorithms
export const SortingVisualizer = createAlgorithmCategoryVisualizer('Sorting Algorithms', [
  'Heapsort',
  'Quicksort',
  'Quicksort (Median of 3)',
  'Merge Sort (top-down)',
  'Merge Sort (bottom-up)',
  'Merge Sort (natural)',
  'Radix Sort (MSD/Exchange)',
  'Radix Sort (LSD/Straight)'
]);

// Set Algorithms
export const SetAlgorithmsVisualizer = createAlgorithmCategoryVisualizer('Set Algorithms', [
  'Union Find'
]);

// Insert/Search Algorithms
export const SearchAlgorithmsVisualizer = createAlgorithmCategoryVisualizer('Search Algorithms', [
  'Binary Search Tree',
  'AVL Tree',
  '2-3-4 Tree',
  'Hashing (Linear Probing)',
  'Hashing (Double Hashing)',
  'Hashing (Chaining)',
  'Binary Search'
]);

// String Search Algorithms
export const StringSearchVisualizer = createAlgorithmCategoryVisualizer('String Search Algorithms', [
  'Brute Force',
  'Horspool\'s'
]);

// Graph Algorithms
export const GraphAlgorithmsVisualizer = createAlgorithmCategoryVisualizer('Graph Algorithms', [
  'Depth First Search',
  'DFS (iterative)',
  'Breadth First Search',
  'Dijkstra\'s (shortest path)',
  'A* (heuristic search)',
  'Prim\'s (min. spanning tree)',
  'Prim\'s (simpler code)',
  'Kruskal\'s (min. spanning tree)',
  'Warshall\'s (transitive closure)'
]);

// Other Algorithm Visualizers
export const RecursionVisualizer = createPlaceholderVisualizer('Recursion');
export const BacktrackingVisualizer = createPlaceholderVisualizer('Backtracking');
export const DynamicProgrammingVisualizer = createPlaceholderVisualizer('Dynamic Programming');
export const BitManipulationVisualizer = createPlaceholderVisualizer('Bit Manipulation'); 
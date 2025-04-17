import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Button, Slider, ButtonGroup, Grid, TextField, Chip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import ShuffleIcon from '@mui/icons-material/Shuffle';

// Interface for visualizer components with algorithm name prop
export interface VisualizerProps {
  algorithmName?: string;
}

// Interface for graph node with position and state
interface Node {
  id: number;
  x: number;
  y: number;
  visited: boolean;
  inQueue: boolean;
  inStack: boolean;
  distance: number;
  parent: number | null;
}

// Interface for weighted edge
interface Edge {
  target: number;
  weight: number;
}

// Interface for adjacency list representation of a graph
interface AdjacencyList {
  [key: number]: Edge[];
}

// Priority Queue implementation for Dijkstra's algorithm
class PriorityQueue<T> {
  private items: T[];
  private comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.items = [];
    this.comparator = comparator;
  }

  enqueue(item: T): void {
    // Add the item to the end
    this.items.push(item);
    // Sort the array based on the comparator
    this.items.sort(this.comparator);
  }

  dequeue(): T | undefined {
    // Remove and return the first item (highest priority)
    return this.items.shift();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

// Helper function to create placeholder visualizer components
const createPlaceholderVisualizer = (name: string, description?: string) => {
  const Component: React.FC = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>{name}</Typography>
      <Typography variant="body1" paragraph>
        {description || `This visualizer helps you understand ${name.toLowerCase()} concepts through interactive visualizations.`}
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

// Delay function for animations
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Actual implementation of the SortingVisualizer
export const SortingVisualizer: React.FC<VisualizerProps> = ({ algorithmName = "Quicksort" }) => {
  const [array, setArray] = useState<number[]>([]);
  const [sorting, setSorting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [size, setSize] = useState(50);
  const [algorithm, setAlgorithm] = useState(algorithmName);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [pivotIndex, setPivotIndex] = useState<number | null>(null);
  
  const sortingRef = useRef(false);
  const animationSpeedRef = useRef(100);
  
  // Initialize array
  useEffect(() => {
    resetArray();
  }, [size]);
  
  // Update animation speed when slider changes
  useEffect(() => {
    animationSpeedRef.current = 101 - speed;
  }, [speed]);
  
  // Reset array with new random values
  const resetArray = () => {
    if (sorting) return;
    
    const newArray = [];
    for (let i = 0; i < size; i++) {
      newArray.push(Math.floor(Math.random() * 100) + 5);
    }
    setArray(newArray);
    setCompleted(false);
    setComparingIndices([]);
    setSwappingIndices([]);
    setPivotIndex(null);
  };
  
  // Start sorting
  const startSorting = async () => {
    if (sorting || completed) return;
    
    setSorting(true);
    sortingRef.current = true;
    
    switch (algorithm) {
      case "Quicksort":
        await quickSort(array, 0, array.length - 1);
        break;
      case "Heapsort":
        await heapSort([...array]);
        break;
      case "Merge Sort (top-down)":
        await mergeSort([...array], 0, array.length - 1);
        break;
      // Add other algorithms as needed
      default:
        await quickSort(array, 0, array.length - 1);
    }
    
    if (sortingRef.current) {
      setCompleted(true);
      setSorting(false);
      sortingRef.current = false;
    }
  };
  
  // Stop sorting
  const stopSorting = () => {
    sortingRef.current = false;
    setSorting(false);
    setComparingIndices([]);
    setSwappingIndices([]);
    setPivotIndex(null);
  };
  
  // Quicksort implementation
  const quickSort = async (arr: number[], low: number, high: number) => {
    if (low < high && sortingRef.current) {
      const pivotIndex = await partition(arr, low, high);
      await quickSort(arr, low, pivotIndex - 1);
      await quickSort(arr, pivotIndex + 1, high);
    }
    return arr;
  };
  
  // Partition function for quicksort
  const partition = async (arr: number[], low: number, high: number) => {
    const pivot = arr[high];
    setPivotIndex(high);
    
    let i = low - 1;
    
    for (let j = low; j < high && sortingRef.current; j++) {
      setComparingIndices([j, high]);
      await sleep(animationSpeedRef.current);
      
      if (arr[j] < pivot) {
        i++;
        
        // Swap arr[i] and arr[j]
        setSwappingIndices([i, j]);
        await sleep(animationSpeedRef.current);
        
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        
        await sleep(animationSpeedRef.current);
        setSwappingIndices([]);
      }
    }
    
    // Swap arr[i+1] and arr[high]
    setSwappingIndices([i + 1, high]);
    await sleep(animationSpeedRef.current);
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    
    await sleep(animationSpeedRef.current);
    setSwappingIndices([]);
    setPivotIndex(null);
    
    return i + 1;
  };
  
  // Heapsort implementation
  const heapSort = async (arr: number[]) => {
    const n = arr.length;
    
    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0 && sortingRef.current; i--) {
      await heapify(arr, n, i);
    }
    
    // Extract elements from heap one by one
    for (let i = n - 1; i > 0 && sortingRef.current; i--) {
      setSwappingIndices([0, i]);
      await sleep(animationSpeedRef.current);
      
      // Move current root to end
      [arr[0], arr[i]] = [arr[i], arr[0]];
      setArray([...arr]);
      
      await sleep(animationSpeedRef.current);
      setSwappingIndices([]);
      
      // Call max heapify on the reduced heap
      await heapify(arr, i, 0);
    }
    
    return arr;
  };
  
  // Heapify function for heapsort
  const heapify = async (arr: number[], n: number, i: number) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    // Check if left child is larger than root
    if (left < n) {
      setComparingIndices([largest, left]);
      await sleep(animationSpeedRef.current);
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }
    
    // Check if right child is larger than largest so far
    if (right < n) {
      setComparingIndices([largest, right]);
      await sleep(animationSpeedRef.current);
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }
    
    // If largest is not root
    if (largest !== i && sortingRef.current) {
      setSwappingIndices([i, largest]);
      await sleep(animationSpeedRef.current);
      
      // Swap
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      setArray([...arr]);
      
      await sleep(animationSpeedRef.current);
      setSwappingIndices([]);
      
      // Recursively heapify the affected sub-tree
      await heapify(arr, n, largest);
    }
    
    setComparingIndices([]);
  };
  
  // Merge sort implementation
  const mergeSort = async (arr: number[], left: number, right: number) => {
    if (left < right && sortingRef.current) {
      const mid = Math.floor((left + right) / 2);
      
      await mergeSort(arr, left, mid);
      await mergeSort(arr, mid + 1, right);
      
      await merge(arr, left, mid, right);
    }
    
    return arr;
  };
  
  // Merge function for merge sort
  const merge = async (arr: number[], left: number, mid: number, right: number) => {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    
    // Create temp arrays
    const L = arr.slice(left, left + n1);
    const R = arr.slice(mid + 1, mid + 1 + n2);
    
    // Merge the temp arrays back into arr
    let i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2 && sortingRef.current) {
      setComparingIndices([left + i, mid + 1 + j]);
      await sleep(animationSpeedRef.current);
      
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      
      setArray([...arr]);
      k++;
      await sleep(animationSpeedRef.current / 2);
    }
    
    // Copy remaining elements of L if any
    while (i < n1 && sortingRef.current) {
      arr[k] = L[i];
      i++;
      k++;
      setArray([...arr]);
      await sleep(animationSpeedRef.current / 2);
    }
    
    // Copy remaining elements of R if any
    while (j < n2 && sortingRef.current) {
      arr[k] = R[j];
      j++;
      k++;
      setArray([...arr]);
      await sleep(animationSpeedRef.current / 2);
    }
    
    setComparingIndices([]);
  };
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Sorting Visualization: {algorithm}</Typography>
      
      <Box sx={{ mb: 3 }}>
        <ButtonGroup variant="contained" sx={{ mb: 2 }}>
          <Button 
            startIcon={sorting ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={sorting ? stopSorting : startSorting}
            color={sorting ? "warning" : "primary"}
            disabled={completed}
          >
            {sorting ? "Pause" : "Start Sort"}
          </Button>
          <Button 
            startIcon={<StopIcon />}
            onClick={resetArray}
            disabled={sorting}
          >
            Reset
          </Button>
          <Button 
            startIcon={<ShuffleIcon />}
            onClick={resetArray}
            disabled={sorting}
          >
            Shuffle
          </Button>
        </ButtonGroup>
        
        <Box sx={{ width: '100%', display: 'flex', gap: 4, mt: 2, mb: 2 }}>
          <Box sx={{ width: '45%' }}>
            <Typography id="size-slider" gutterBottom>
              Array Size: {size}
            </Typography>
            <Slider
              value={size}
              onChange={(_, newValue) => setSize(newValue as number)}
              aria-labelledby="size-slider"
              min={5}
              max={100}
              disabled={sorting}
            />
          </Box>
          <Box sx={{ width: '45%' }}>
            <Typography id="speed-slider" gutterBottom>
              Animation Speed: {speed}
            </Typography>
            <Slider
              value={speed}
              onChange={(_, newValue) => setSpeed(newValue as number)}
              aria-labelledby="speed-slider"
              min={1}
              max={100}
            />
          </Box>
        </Box>
      </Box>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          minHeight: '300px', 
          display: 'flex', 
          alignItems: 'flex-end', 
          justifyContent: 'center',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-end', 
          height: '250px', 
          width: '100%'
        }}>
          {array.map((value, idx) => (
            <Box 
              key={idx}
              sx={{
                height: `${value * 2}px`,
                width: `${Math.max(2, 80 / size)}px`,
                marginX: '1px',
                backgroundColor: swappingIndices.includes(idx) 
                  ? '#ff4081' 
                  : comparingIndices.includes(idx)
                    ? '#2196f3'
                    : pivotIndex === idx
                      ? '#4caf50'
                      : completed
                        ? '#4caf50'
                        : '#3f51b5',
                transition: 'height 0.2s ease',
              }}
            />
          ))}
        </Box>
      </Paper>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          <strong>Color Legend:</strong> 
          <span style={{ color: '#3f51b5' }}> Normal</span> | 
          <span style={{ color: '#2196f3' }}> Comparing</span> | 
          <span style={{ color: '#ff4081' }}> Swapping</span> | 
          <span style={{ color: '#4caf50' }}> Pivot/Sorted</span>
        </Typography>
      </Box>
    </Box>
  );
};

// String Search Algorithms
export const StringSearchVisualizerPlaceholder = createAlgorithmCategoryVisualizer('String Search Algorithms', [
  'Brute Force',
  'Horspool\'s'
]);

// Graph Algorithms (placeholder version)
export const GraphAlgorithmsVisualizerPlaceholder = createAlgorithmCategoryVisualizer('Graph Algorithms', [
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
export const SetAlgorithmsVisualizer = createPlaceholderVisualizer('Set Algorithms');
// Search algorithms (placeholder version)
export const SearchAlgorithmsVisualizerPlaceholder = createAlgorithmCategoryVisualizer('Search Algorithms', [
  'Binary Search',
  'Binary Search Tree',
  'AVL Tree',
  '2-3-4 Tree',
  'Hashing (Linear Probing)',
  'Hashing (Double Hashing)',
  'Hashing (Chaining)'
]);

// Data Structure Visualizers
export const ArraysVisualizer = createPlaceholderVisualizer('Arrays',
  'Arrays are fixed-size collections of elements stored in contiguous memory locations.');
export const LinkedListsVisualizer = createPlaceholderVisualizer('Linked Lists',
  'Linked lists are dynamic data structures where elements are stored in nodes containing data and a reference to the next node.');
export const TreesVisualizer = createPlaceholderVisualizer('Trees',
  'Trees are hierarchical data structures with a root node and branches leading to child nodes.');
export const HeapVisualizer = createPlaceholderVisualizer('Heap',
  'A heap is a specialized tree-based data structure that satisfies the heap property.');
export const HashingVisualizer = createPlaceholderVisualizer('Hashing',
  'Hashing is a technique to convert a large data set to a smaller one with a fixed size.');
export const GraphsVisualizer = createPlaceholderVisualizer('Graphs',
  'Graphs are non-linear data structures consisting of nodes and edges.');

// Specific Data Structure Visualizers
export const StaticArrayVisualizer = createPlaceholderVisualizer('Static Arrays',
  'Static arrays have a fixed size that must be declared at initialization time.');
export const SortedArrayVisualizer = createPlaceholderVisualizer('Sorted Arrays',
  'Sorted arrays maintain elements in sorted order, enabling efficient search operations like binary search with O(log n) time complexity.');
export const DynamicArrayVisualizer = createPlaceholderVisualizer('Dynamic Arrays',
  'Dynamic arrays can grow or shrink in size during program execution.');
export const SinglyLinkedListVisualizer = createPlaceholderVisualizer('Singly Linked Lists',
  'Each node in a singly linked list contains data and a pointer to the next node in the sequence.');
export const DoublyLinkedListVisualizer = createPlaceholderVisualizer('Doubly Linked Lists',
  'Each node in a doubly linked list contains data and pointers to both the next and previous nodes.');
export const CircularLinkedListVisualizer = createPlaceholderVisualizer('Circular Linked Lists',
  'In a circular linked list, the last node points back to the first node, forming a circle.');
export const StackVisualizer = createPlaceholderVisualizer('Stack',
  'A stack is a LIFO (Last In, First Out) data structure with push and pop operations.');
export const QueueVisualizer = createPlaceholderVisualizer('Queue',
  'A queue is a FIFO (First In, First Out) data structure with enqueue and dequeue operations.');
export const PriorityQueueVisualizer = createPlaceholderVisualizer('Priority Queue',
  'A priority queue is a queue where elements have associated priorities and are dequeued in priority order.');
export const BinarySearchTreeVisualizer = createPlaceholderVisualizer('Binary Search Tree',
  'A binary search tree is a binary tree where nodes are ordered: left child < parent < right child.');
export const BalancedTreeVisualizer = createPlaceholderVisualizer('Balanced Trees',
  'Balanced trees maintain a balance factor to ensure O(log n) operations.');
export const DictionaryVisualizer = createPlaceholderVisualizer('Dictionary',
  'A dictionary is an abstract data type that stores key-value pairs.');
export const HashTableVisualizer = createPlaceholderVisualizer('Hash Table',
  'A hash table uses a hash function to map keys to array indices for fast data retrieval.');
export const ADTVisualizer = createPlaceholderVisualizer('Abstract Data Types',
  'ADTs are mathematical models for data types where the behavior is defined by operations, not implementation.');
export const BagVisualizer = createPlaceholderVisualizer('Bag',
  'A Bag is a simple container ADT that allows adding items without ordering them, similar to a physical bag.');

// Actual implementation of the SearchAlgorithmsVisualizer for Binary Search
export const SearchAlgorithmsVisualizer: React.FC<VisualizerProps> = ({ algorithmName = "Binary Search" }) => {
  const [array, setArray] = useState<number[]>([]);
  const [searching, setSearching] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [found, setFound] = useState(false);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [speed, setSpeed] = useState(50);
  const [size, setSize] = useState(15);
  const [algorithm, setAlgorithm] = useState(algorithmName);
  const [targetValue, setTargetValue] = useState<number>(0);
  const [lowIndex, setLowIndex] = useState<number | null>(null);
  const [highIndex, setHighIndex] = useState<number | null>(null);
  const [midIndex, setMidIndex] = useState<number | null>(null);
  
  const searchingRef = useRef(false);
  const animationSpeedRef = useRef(100);
  
  // Initialize array
  useEffect(() => {
    resetArray();
  }, [size]);
  
  // Update animation speed when slider changes
  useEffect(() => {
    animationSpeedRef.current = 101 - speed;
  }, [speed]);
  
  // Reset array with new sorted values
  const resetArray = () => {
    if (searching) return;
    
    // Generate a sorted array
    const newArray = [];
    for (let i = 0; i < size; i++) {
      newArray.push(Math.floor(Math.random() * 100) + 5);
    }
    
    // Sort the array for binary search
    newArray.sort((a, b) => a - b);
    setArray(newArray);
    
    // Choose a random value for the target (75% chance of being in the array)
    if (Math.random() < 0.75 && newArray.length > 0) {
      setTargetValue(newArray[Math.floor(Math.random() * newArray.length)]);
    } else {
      // Choose a value not in the array (likely)
      setTargetValue(Math.floor(Math.random() * 100) + 5);
    }
    
    setCompleted(false);
    setFound(false);
    setFoundIndex(null);
    setLowIndex(null);
    setHighIndex(null);
    setMidIndex(null);
  };
  
  // Start searching
  const startSearching = async () => {
    if (searching || completed) return;
    
    setSearching(true);
    setCompleted(false);
    setFound(false);
    setFoundIndex(null);
    searchingRef.current = true;
    
    switch (algorithm) {
      case "Binary Search":
        const result = await binarySearch(array, targetValue);
        if (searchingRef.current) {
          setFoundIndex(result);
          setFound(result !== -1);
        }
        break;
      // Add other search algorithms as needed
      default:
        const defaultResult = await binarySearch(array, targetValue);
        if (searchingRef.current) {
          setFoundIndex(defaultResult);
          setFound(defaultResult !== -1);
        }
    }
    
    if (searchingRef.current) {
      setCompleted(true);
      setSearching(false);
      searchingRef.current = false;
    }
  };
  
  // Stop searching
  const stopSearching = () => {
    searchingRef.current = false;
    setSearching(false);
    setLowIndex(null);
    setHighIndex(null);
    setMidIndex(null);
  };
  
  // Binary search implementation
  const binarySearch = async (arr: number[], target: number): Promise<number> => {
    let low = 0;
    let high = arr.length - 1;
    
    setLowIndex(low);
    setHighIndex(high);
    
    while (low <= high && searchingRef.current) {
      // Update the current boundaries
      setLowIndex(low);
      setHighIndex(high);
      
      await sleep(animationSpeedRef.current * 2);
      
      const mid = Math.floor((low + high) / 2);
      setMidIndex(mid);
      
      await sleep(animationSpeedRef.current * 2);
      
      if (arr[mid] === target) {
        return mid; // Found the target
      } else if (arr[mid] < target) {
        low = mid + 1; // Target is in the right half
      } else {
        high = mid - 1; // Target is in the left half
      }
      
      await sleep(animationSpeedRef.current);
    }
    
    return -1; // Target not found
  };
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Search Visualization: {algorithm}</Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1">
          Target Value: <strong>{targetValue}</strong>
        </Typography>
        
        <ButtonGroup variant="contained" sx={{ mb: 2, mt: 2 }}>
          <Button 
            startIcon={searching ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={searching ? stopSearching : startSearching}
            color={searching ? "warning" : "primary"}
            disabled={completed}
          >
            {searching ? "Pause" : "Start Search"}
          </Button>
          <Button 
            startIcon={<StopIcon />}
            onClick={resetArray}
            disabled={searching}
          >
            New Array & Target
          </Button>
        </ButtonGroup>
        
        <Box sx={{ width: '100%', display: 'flex', gap: 4, mt: 2, mb: 2 }}>
          <Box sx={{ width: '45%' }}>
            <Typography id="size-slider" gutterBottom>
              Array Size: {size}
            </Typography>
            <Slider
              value={size}
              onChange={(_, newValue) => setSize(newValue as number)}
              aria-labelledby="size-slider"
              min={5}
              max={20}
              disabled={searching}
            />
          </Box>
          <Box sx={{ width: '45%' }}>
            <Typography id="speed-slider" gutterBottom>
              Animation Speed: {speed}
            </Typography>
            <Slider
              value={speed}
              onChange={(_, newValue) => setSpeed(newValue as number)}
              aria-labelledby="speed-slider"
              min={1}
              max={100}
            />
          </Box>
        </Box>
      </Box>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          minHeight: '250px', 
          backgroundColor: '#f5f5f5'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          width: '100%'
        }}>
          {/* Array visualization */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            width: '100%',
            mb: 4
          }}>
            {array.map((value, idx) => (
              <Box 
                key={idx}
                sx={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  margin: '0 2px',
                  backgroundColor: 
                    completed && idx === foundIndex
                      ? '#4caf50' // Green if found
                      : idx === midIndex
                        ? '#ff9800' // Orange for mid
                        : (lowIndex !== null && highIndex !== null && idx >= lowIndex && idx <= highIndex)
                          ? '#2196f3' // Blue for current search range
                          : '#e0e0e0', // Gray for eliminated elements
                  color: '#000',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                }}
              >
                {value}
              </Box>
            ))}
          </Box>
          
          {/* Search range indicators */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            width: '100%',
            mb: 2
          }}>
            {array.map((_, idx) => (
              <Box 
                key={idx}
                sx={{
                  width: '40px',
                  margin: '0 2px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: 
                    idx === lowIndex ? '#2196f3' : 
                    idx === highIndex ? '#2196f3' : 
                    idx === midIndex ? '#ff9800' : 'transparent'
                }}
              >
                {idx === lowIndex ? 'L' : idx === highIndex ? 'H' : idx === midIndex ? 'M' : ''}
              </Box>
            ))}
          </Box>
          
          {/* Result display */}
          {completed && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="h6" color={found ? 'success.main' : 'error.main'}>
                {found 
                  ? `Target ${targetValue} found at index ${foundIndex}!` 
                  : `Target ${targetValue} not found in the array.`}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          <strong>Color Legend:</strong> 
          <span style={{ color: '#e0e0e0' }}> Eliminated</span> | 
          <span style={{ color: '#2196f3' }}> Current Range</span> | 
          <span style={{ color: '#ff9800' }}> Middle Element</span> | 
          <span style={{ color: '#4caf50' }}> Found Element</span>
        </Typography>
      </Box>
    </Box>
  );
};

// Actual implementation of the GraphAlgorithmsVisualizer for graph traversal
export const GraphAlgorithmsVisualizer: React.FC<VisualizerProps> = ({ algorithmName = "Breadth First Search" }) => {
  type GraphNode = {
    id: number;
    x: number;
    y: number;
    connections: number[];
    visited: boolean;
    inQueue?: boolean;
    inStack?: boolean;
    distance?: number;
    parent?: number | null;
  };

  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [adjacencyList, setAdjacencyList] = useState<number[][]>([]);
  const [algorithm, setAlgorithm] = useState(algorithmName);
  const [traversing, setTraversing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [startNode, setStartNode] = useState<number>(0);
  const [currentNode, setCurrentNode] = useState<number | null>(null);
  const [visitedOrder, setVisitedOrder] = useState<number[]>([]);
  const [speed, setSpeed] = useState(50);
  
  const traversingRef = useRef(false);
  const animationSpeedRef = useRef(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Update animation speed when slider changes
  useEffect(() => {
    animationSpeedRef.current = 101 - speed;
  }, [speed]);
  
  // Set up the graph
  useEffect(() => {
    generateRandomGraph();
  }, []);
  
  // Draw the graph
  useEffect(() => {
    drawGraph();
  }, [nodes, currentNode, visitedOrder, algorithm, traversing, completed]);
  
  // Generate a random graph
  const generateRandomGraph = () => {
    if (traversing) return;
    
    const newNodes: GraphNode[] = [];
    const numNodes = 10;
    
    // Create nodes in a circular layout
    for (let i = 0; i < numNodes; i++) {
      const angle = (i / numNodes) * 2 * Math.PI;
      const radius = 120;
      const x = 200 + radius * Math.cos(angle);
      const y = 150 + radius * Math.sin(angle);
      
      newNodes.push({
        id: i,
        x,
        y,
        connections: [],
        visited: false
      });
    }
    
    // Create random connections (ensuring the graph is connected)
    // First, create a spanning tree to ensure connectedness
    for (let i = 1; i < numNodes; i++) {
      const parentNode = Math.floor(Math.random() * i);
      newNodes[parentNode].connections.push(i);
      newNodes[i].connections.push(parentNode);
    }
    
    // Add some extra random edges (not too many to keep the graph readable)
    const extraEdges = Math.floor(numNodes * 0.3);
    for (let i = 0; i < extraEdges; i++) {
      const node1 = Math.floor(Math.random() * numNodes);
      let node2 = Math.floor(Math.random() * numNodes);
      
      // Avoid self-loops and duplicate edges
      if (node1 !== node2 && !newNodes[node1].connections.includes(node2)) {
        newNodes[node1].connections.push(node2);
        newNodes[node2].connections.push(node1);
      }
    }
    
    setNodes(newNodes);
    setStartNode(0);
    setCurrentNode(null);
    setVisitedOrder([]);
    setCompleted(false);
    
    // Create adjacency list representation
    const adjList: number[][] = [];
    for (let i = 0; i < numNodes; i++) {
      adjList.push([...newNodes[i].connections]);
    }
    setAdjacencyList(adjList);
  };
  
  // Draw the graph on canvas
  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges
    ctx.lineWidth = 2;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      for (const connectedNodeId of node.connections) {
        const connectedNode = nodes[connectedNodeId];
        
        // Determine if this edge is part of the traversal path
        const isPath = node.parent === connectedNodeId || connectedNode.parent === i;
        
        // Set edge color based on traversal status
        if (completed && isPath) {
          ctx.strokeStyle = '#4caf50'; // Green for path
        } else if ((node.visited && connectedNode.visited) || 
                  (visitedOrder.includes(i) && visitedOrder.includes(connectedNodeId))) {
          ctx.strokeStyle = '#9c27b0'; // Purple for visited connections
        } else {
          ctx.strokeStyle = '#ccc'; // Gray for unvisited
        }
        
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(connectedNode.x, connectedNode.y);
        ctx.stroke();
      }
    }
    
    // Draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      
      // Different colors based on node status
      if (i === startNode) {
        ctx.fillStyle = '#2196f3'; // Blue for start node
      } else if (i === currentNode) {
        ctx.fillStyle = '#ff9800'; // Orange for current node
      } else if (node.inQueue) {
        ctx.fillStyle = '#ffeb3b'; // Yellow for nodes in queue (BFS)
      } else if (node.inStack) {
        ctx.fillStyle = '#ff5722'; // Deep orange for nodes in stack (DFS)
      } else if (node.visited || visitedOrder.includes(i)) {
        ctx.fillStyle = '#9c27b0'; // Purple for visited nodes
      } else {
        ctx.fillStyle = '#e0e0e0'; // Gray for unvisited nodes
      }
      
      // Draw circle for node
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw node border
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw node ID
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i.toString(), node.x, node.y);
    }
  };
  
  // Start traversal
  const startTraversal = async () => {
    if (traversing || completed) return;
    
    setTraversing(true);
    traversingRef.current = true;
    setCompleted(false);
    setCurrentNode(null);
    setVisitedOrder([]);
    
    // Reset the graph
    const resetNodes = nodes.map(node => ({
      ...node,
      visited: false,
      inQueue: false,
      inStack: false,
      distance: undefined,
      parent: undefined
    }));
    setNodes(resetNodes);
    
    switch (algorithm) {
      case "Breadth First Search":
        await bfs(startNode);
        break;
      case "Depth First Search":
        await dfs(startNode);
        break;
      case "DFS (iterative)":
        await dfsIterative(startNode);
        break;
      default:
        await bfs(startNode);
    }
    
    if (traversingRef.current) {
      setCompleted(true);
      setTraversing(false);
      traversingRef.current = false;
    }
  };
  
  // Stop traversal
  const stopTraversal = () => {
    traversingRef.current = false;
    setTraversing(false);
    setCurrentNode(null);
  };
  
  // Breadth-First Search implementation
  const bfs = async (start: number) => {
    const queue: number[] = [start];
    const visited: boolean[] = new Array(nodes.length).fill(false);
    const visitOrder: number[] = [];
    const distances: number[] = new Array(nodes.length).fill(Infinity);
    const parents: (number | null)[] = new Array(nodes.length).fill(null);
    
    // Mark the start node
    visited[start] = true;
    distances[start] = 0;
    
    // Update the node states
    const updatedNodes = [...nodes];
    updatedNodes[start].visited = true;
    updatedNodes[start].inQueue = true;
    updatedNodes[start].distance = 0;
    setNodes(updatedNodes);
    setCurrentNode(start);
    
    await sleep(animationSpeedRef.current * 3);
    
    while (queue.length > 0 && traversingRef.current) {
      const current = queue.shift()!;
      visitOrder.push(current);
      setVisitedOrder([...visitOrder]);
      
      // Update current node and show it's being processed
      setCurrentNode(current);
      const processingNodes = [...nodes];
      processingNodes[current].inQueue = false;
      setNodes(processingNodes);
      
      await sleep(animationSpeedRef.current * 2);
      
      // Process neighbors
      for (const neighbor of adjacencyList[current]) {
        if (!visited[neighbor] && traversingRef.current) {
          visited[neighbor] = true;
          queue.push(neighbor);
          distances[neighbor] = distances[current] + 1;
          parents[neighbor] = current;
          
          // Update neighbor state
          const updatedNodes = [...nodes];
          updatedNodes[neighbor].visited = true;
          updatedNodes[neighbor].inQueue = true;
          updatedNodes[neighbor].distance = distances[neighbor];
          updatedNodes[neighbor].parent = current;
          setNodes(updatedNodes);
          
          await sleep(animationSpeedRef.current);
        }
      }
    }
    
    // Update final state with distances and parents
    if (traversingRef.current) {
      const finalNodes = [...nodes];
      for (let i = 0; i < finalNodes.length; i++) {
        finalNodes[i].inQueue = false;
        finalNodes[i].distance = distances[i] === Infinity ? undefined : distances[i];
        finalNodes[i].parent = parents[i];
      }
      setNodes(finalNodes);
    }
  };
  
  // Recursive Depth-First Search implementation
  const dfs = async (current: number, visited: boolean[] = []) => {
    if (!traversingRef.current) return;
    
    // Initialize visited array on first call
    if (visited.length === 0) {
      visited = new Array(nodes.length).fill(false);
    }
    
    // Mark current node as visited
    visited[current] = true;
    setCurrentNode(current);
    setVisitedOrder([...visitedOrder, current]);
    
    // Update node state
    const updatedNodes = [...nodes];
    updatedNodes[current].visited = true;
    setNodes(updatedNodes);
    
    await sleep(animationSpeedRef.current * 2);
    
    // Visit all neighbors
    for (const neighbor of adjacencyList[current]) {
      if (!visited[neighbor] && traversingRef.current) {
        // Update parent
        const updatedNodes = [...nodes];
        updatedNodes[neighbor].parent = current;
        setNodes(updatedNodes);
        
        await dfs(neighbor, visited);
      }
    }
  };
  
  // Iterative Depth-First Search implementation
  const dfsIterative = async (start: number) => {
    const stack: number[] = [start];
    const visited: boolean[] = new Array(nodes.length).fill(false);
    const visitOrder: number[] = [];
    const parents: (number | null)[] = new Array(nodes.length).fill(null);
    
    while (stack.length > 0 && traversingRef.current) {
      const current = stack.pop()!;
      
      if (!visited[current]) {
        visited[current] = true;
        visitOrder.push(current);
        setVisitedOrder([...visitOrder]);
        
        // Update current node
        setCurrentNode(current);
        const updatedNodes = [...nodes];
        updatedNodes[current].visited = true;
        updatedNodes[current].inStack = false;
        setNodes(updatedNodes);
        
        await sleep(animationSpeedRef.current * 2);
        
        // Add neighbors to stack in reverse order so they're processed in original order
        for (let i = adjacencyList[current].length - 1; i >= 0; i--) {
          const neighbor = adjacencyList[current][i];
          if (!visited[neighbor] && traversingRef.current) {
            stack.push(neighbor);
            parents[neighbor] = current;
            
            // Update neighbor state
            const updatedNodes = [...nodes];
            updatedNodes[neighbor].inStack = true;
            updatedNodes[neighbor].parent = current;
            setNodes(updatedNodes);
            
            await sleep(animationSpeedRef.current);
          }
        }
      }
    }
    
    // Update final state
    if (traversingRef.current) {
      const finalNodes = [...nodes];
      for (let i = 0; i < finalNodes.length; i++) {
        finalNodes[i].inStack = false;
        finalNodes[i].parent = parents[i];
      }
      setNodes(finalNodes);
    }
  };
  
  // Handle click on node to set start node
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (traversing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if click is on a node
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
      
      if (distance <= 20) {
        setStartNode(i);
        setCompleted(false);
        setVisitedOrder([]);
        
        // Reset all nodes
        const resetNodes = nodes.map(node => ({
          ...node,
          visited: false,
          inQueue: false,
          inStack: false,
          distance: undefined,
          parent: undefined
        }));
        setNodes(resetNodes);
        
        break;
      }
    }
  };
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Graph Traversal: {algorithm}</Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1">
          Start Node: <strong>{startNode}</strong> (Click on a node to change the start node)
        </Typography>
        
        <ButtonGroup variant="contained" sx={{ mb: 2, mt: 2 }}>
          <Button 
            startIcon={traversing ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={traversing ? stopTraversal : startTraversal}
            color={traversing ? "warning" : "primary"}
            disabled={completed}
          >
            {traversing ? "Pause" : "Start Traversal"}
          </Button>
          <Button 
            startIcon={<StopIcon />}
            onClick={generateRandomGraph}
            disabled={traversing}
          >
            New Graph
          </Button>
        </ButtonGroup>
        
        <Box sx={{ width: '45%', mt: 2, mb: 2 }}>
          <Typography id="speed-slider" gutterBottom>
            Animation Speed: {speed}
          </Typography>
          <Slider
            value={speed}
            onChange={(_, newValue) => setSpeed(newValue as number)}
            aria-labelledby="speed-slider"
            min={1}
            max={100}
          />
        </Box>
      </Box>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          backgroundColor: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={300}
          onClick={handleCanvasClick}
          style={{ cursor: traversing ? 'default' : 'pointer' }}
        />
        
        {/* Result display */}
        {completed && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">
              Traversal completed!
            </Typography>
            <Typography variant="body1">
              Visit order: {visitedOrder.join(' → ')}
            </Typography>
          </Box>
        )}
      </Paper>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          <strong>Color Legend:</strong> 
          <span style={{ color: '#2196f3' }}> Start Node</span> | 
          <span style={{ color: '#e0e0e0' }}> Unvisited Node</span> | 
          <span style={{ color: '#9c27b0' }}> Visited Node</span> | 
          <span style={{ color: '#ff9800' }}> Current Node</span> | 
          <span style={{ color: '#ffeb3b' }}> Node in Queue (BFS)</span> |
          <span style={{ color: '#ff5722' }}> Node in Stack (DFS)</span> |
          <span style={{ color: '#4caf50' }}> Path Taken</span>
        </Typography>
      </Box>
    </Box>
  );
};

// Actual implementation of the StringSearchVisualizer for pattern matching algorithms
export const StringSearchVisualizer: React.FC<VisualizerProps> = ({ algorithmName = "Brute Force" }) => {
  const [text, setText] = useState<string>("Here is some example text to search through for pattern matching demonstrations");
  const [pattern, setPattern] = useState<string>("pattern");
  const [searching, setSearching] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState(algorithmName);
  const [matches, setMatches] = useState<number[]>([]);
  const [comparingPositions, setComparingPositions] = useState<[number, number]>([0, 0]);
  
  const searchingRef = useRef(false);
  const animationSpeedRef = useRef(100);
  
  // Update selected algorithm when prop changes
  useEffect(() => {
    setAlgorithm(algorithmName);
  }, [algorithmName]);
  
  // Update animation speed when slider changes
  useEffect(() => {
    animationSpeedRef.current = 101 - speed;
  }, [speed]);
  
  // Start searching
  const startSearching = async () => {
    if (searching || text.length === 0 || pattern.length === 0) return;
    
    setSearching(true);
    setCompleted(false);
    setMatches([]);
    searchingRef.current = true;
    
    switch (algorithm) {
      case "Brute Force":
        await bruteForceSearch(text, pattern);
        break;
      case "Horspool's":
        await horspoolSearch(text, pattern);
        break;
      default:
        await bruteForceSearch(text, pattern);
    }
    
    if (searchingRef.current) {
      setCompleted(true);
      setSearching(false);
      searchingRef.current = false;
    }
  };
  
  // Stop searching
  const stopSearching = () => {
    searchingRef.current = false;
    setSearching(false);
    setComparingPositions([0, 0]);
  };
  
  // Reset search
  const resetSearch = () => {
    if (searching) return;
    
    setMatches([]);
    setCompleted(false);
    setComparingPositions([0, 0]);
  };
  
  // Brute Force string search implementation
  const bruteForceSearch = async (text: string, pattern: string) => {
    const foundMatches: number[] = [];
    
    for (let i = 0; i <= text.length - pattern.length && searchingRef.current; i++) {
      let match = true;
      
      for (let j = 0; j < pattern.length && match && searchingRef.current; j++) {
        setComparingPositions([i + j, j]);
        await sleep(animationSpeedRef.current);
        
        if (text[i + j] !== pattern[j]) {
          match = false;
        }
      }
      
      if (match && searchingRef.current) {
        foundMatches.push(i);
        setMatches([...foundMatches]);
        await sleep(animationSpeedRef.current * 2);
      }
    }
    
    setComparingPositions([-1, -1]);
    return foundMatches;
  };
  
  // Horspool's algorithm for string search
  const horspoolSearch = async (text: string, pattern: string) => {
    const foundMatches: number[] = [];
    
    if (pattern.length === 0) return foundMatches;
    
    // Preprocessing - Build bad character skip table
    const skipTable: { [key: string]: number } = {};
    for (let i = 0; i < pattern.length - 1; i++) {
      skipTable[pattern[i]] = pattern.length - 1 - i;
    }
    
    // Display the skip table
    console.log("Skip table:", skipTable);
    
    let i = pattern.length - 1;
    
    while (i < text.length && searchingRef.current) {
      let j = pattern.length - 1;
      let k = i;
      
      while (j >= 0 && text[k] === pattern[j] && searchingRef.current) {
        setComparingPositions([k, j]);
        await sleep(animationSpeedRef.current);
        k--;
        j--;
      }
      
      if (j === -1 && searchingRef.current) {
        // Found a match
        foundMatches.push(k + 1);
        setMatches([...foundMatches]);
        await sleep(animationSpeedRef.current * 2);
        i += pattern.length;
      } else {
        // Skip based on bad character rule
        const badChar = text[i];
        const skip = skipTable[badChar] || pattern.length;
        i += skip;
      }
    }
    
    setComparingPositions([-1, -1]);
    return foundMatches;
  };
  
  // Highlight matches and current comparison in the text
  const highlightText = () => {
    if (text.length === 0) return [];
    
    const textChars = text.split('');
    const highlightedChars = textChars.map((char, index) => {
      // Character is part of a match
      const isPartOfMatch = matches.some(matchStart => 
        index >= matchStart && index < matchStart + pattern.length
      );
      
      // Character is currently being compared
      const isBeingCompared = comparingPositions[0] === index;
      
      return (
        <Box
          component="span"
          key={index}
          sx={{
            backgroundColor: isPartOfMatch 
              ? '#4caf50'  // Green for matches
              : isBeingCompared 
                ? '#2196f3' // Blue for current comparison
                : 'transparent',
            padding: '2px 0',
            borderRadius: '2px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            fontWeight: isPartOfMatch || isBeingCompared ? 'bold' : 'normal',
          }}
        >
          {char}
        </Box>
      );
    });
    
    return highlightedChars;
  };
  
  // Highlight pattern character being compared
  const highlightPattern = () => {
    if (pattern.length === 0) return [];
    
    const patternChars = pattern.split('');
    return patternChars.map((char, index) => (
      <Box
        component="span"
        key={index}
        sx={{
          backgroundColor: comparingPositions[1] === index ? '#ff9800' : 'transparent', // Orange for current comparison
          padding: '2px 0',
          borderRadius: '2px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          fontWeight: comparingPositions[1] === index ? 'bold' : 'normal',
        }}
      >
        {char}
      </Box>
    ));
  };
  
  return (
    <Box sx={{ p: 2, width: '100%' }}>
      <Typography variant="h5" gutterBottom>String Search: {algorithm}</Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>Text:</Typography>
          <Paper
            variant="outlined"
            sx={{ 
              p: 2, 
              minHeight: '100px',
              fontFamily: 'monospace',
              backgroundColor: '#f8f9fa'
            }}
          >
            <TextField
              fullWidth
              multiline
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={searching}
              variant="outlined"
              placeholder="Enter text to search through"
              InputProps={{
                style: { fontFamily: 'monospace' }
              }}
              sx={{ mb: 2 }}
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>Pattern to Search:</Typography>
          <Paper
            variant="outlined"
            sx={{ 
              p: 2, 
              minHeight: '100px',
              fontFamily: 'monospace',
              backgroundColor: '#f8f9fa'
            }}
          >
            <TextField
              fullWidth
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              disabled={searching}
              variant="outlined"
              placeholder="Enter pattern to search for"
              InputProps={{
                style: { fontFamily: 'monospace' }
              }}
              sx={{ mb: 2 }}
            />
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mb: 3 }}>
        <ButtonGroup variant="contained" sx={{ mb: 2 }}>
          <Button 
            startIcon={searching ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={searching ? stopSearching : startSearching}
            color={searching ? "warning" : "primary"}
            disabled={completed || text.length === 0 || pattern.length === 0}
          >
            {searching ? "Pause" : "Start Search"}
          </Button>
          <Button 
            startIcon={<StopIcon />}
            onClick={resetSearch}
            disabled={searching}
          >
            Reset
          </Button>
        </ButtonGroup>
        
        <Box sx={{ width: '45%', mt: 2, mb: 2 }}>
          <Typography id="speed-slider" gutterBottom>
            Animation Speed: {speed}
          </Typography>
          <Slider
            value={speed}
            onChange={(_, newValue) => setSpeed(newValue as number)}
            aria-labelledby="speed-slider"
            min={1}
            max={100}
          />
        </Box>
      </Box>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          minHeight: '200px', 
          backgroundColor: '#f5f5f5',
          mb: 3
        }}
      >
        <Typography variant="h6" gutterBottom>Visualization:</Typography>
        
        <Box sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 1, bgcolor: 'background.paper' }}>
          <Typography variant="subtitle2" gutterBottom>Text:</Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, letterSpacing: '0.5px' }}>
            {highlightText()}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 1, bgcolor: 'background.paper' }}>
          <Typography variant="subtitle2" gutterBottom>Pattern:</Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, letterSpacing: '0.5px' }}>
            {highlightPattern()}
          </Typography>
        </Box>
        
        {/* Results section */}
        {completed && (
          <Box sx={{ mt: 3, p: 2, border: '1px solid #ddd', borderRadius: 1, bgcolor: 'background.paper' }}>
            <Typography variant="h6" color={matches.length > 0 ? 'success.main' : 'error.main'}>
              {matches.length > 0 
                ? `Found ${matches.length} match${matches.length !== 1 ? 'es' : ''}!` 
                : `No matches found for "${pattern}"`}
            </Typography>
            {matches.length > 0 && (
              <Typography variant="body1">
                Positions: {matches.join(', ')}
              </Typography>
            )}
          </Box>
        )}
      </Paper>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          <strong>Algorithm Information:</strong>&nbsp;
          {algorithm === "Brute Force" ? (
            "The Brute Force algorithm checks every possible position in the text where the pattern might match."
          ) : algorithm === "Horspool's" ? (
            "Horspool's algorithm uses preprocessed skip tables for more efficient matching. It's a simplified variant of the Boyer-Moore algorithm."
          ) : (
            "Select an algorithm to see its description."
          )}
        </Typography>
      </Box>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          <strong>Color Legend:</strong> 
          <span style={{ color: '#2196f3' }}> Current Text Character</span> | 
          <span style={{ color: '#ff9800' }}> Current Pattern Character</span> | 
          <span style={{ color: '#4caf50' }}> Match</span>
        </Typography>
      </Box>
    </Box>
  );
};

// Actual implementation of the DijkstraAlgorithmVisualizer
export const DijkstraAlgorithmVisualizer: React.FC<VisualizerProps> = ({ algorithmName = "Dijkstra's (shortest path)" }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [adjacencyList, setAdjacencyList] = useState<AdjacencyList>({});
  const [startNode, setStartNode] = useState<number>(0);
  const [traversing, setTraversing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [visitedOrder, setVisitedOrder] = useState<number[]>([]);
  const [shortestPaths, setShortestPaths] = useState<{[key: number]: number}>({});
  const [previousNodes, setPreviousNodes] = useState<{[key: number]: number | null}>({});
  const [currentNode, setCurrentNode] = useState<number | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const traversingRef = useRef(false);
  const animationSpeedRef = useRef(100);
  
  // Initialize graph
  useEffect(() => {
    generateRandomGraph();
  }, []);
  
  // Update animation speed when slider changes
  useEffect(() => {
    animationSpeedRef.current = 101 - speed;
  }, [speed]);
  
  // Draw the graph whenever nodes or paths change
  useEffect(() => {
    if (canvasRef.current) {
      drawGraph();
    }
  }, [nodes, shortestPaths, previousNodes, currentNode, completed]);
  
  // Generate a random graph
  const generateRandomGraph = () => {
    if (traversing) return;
    
    const numNodes = Math.floor(Math.random() * 5) + 6; // 6-10 nodes
    const newNodes: Node[] = [];
    const newAdjacencyList: AdjacencyList = {};
    
    // Create nodes with random positions
    for (let i = 0; i < numNodes; i++) {
      const x = 50 + Math.random() * 300;
      const y = 50 + Math.random() * 200;
      
      newNodes.push({
        id: i,
        x,
        y,
        visited: false,
        inQueue: false,
        inStack: false,
        distance: Infinity,
        parent: null
      });
      
      newAdjacencyList[i] = [];
    }
    
    // Create random edges with weights
    for (let i = 0; i < numNodes; i++) {
      const numEdges = Math.floor(Math.random() * 3) + 1; // 1-3 edges per node
      
      for (let j = 0; j < numEdges; j++) {
        const target = Math.floor(Math.random() * numNodes);
        
        // Avoid self-loops and duplicate edges
        if (target !== i && !newAdjacencyList[i].some(edge => edge.target === target)) {
          // Calculate Euclidean distance for edge weight (rounded to integer)
          const weight = Math.round(
            Math.sqrt(
              Math.pow(newNodes[i].x - newNodes[target].x, 2) + 
              Math.pow(newNodes[i].y - newNodes[target].y, 2)
            ) / 10
          ) + 1; // Adding 1 to ensure positive weight
          
          newAdjacencyList[i].push({ target, weight });
          
          // Add reverse edge with some probability to make the graph not too directed
          if (Math.random() > 0.3) {
            newAdjacencyList[target].push({ target: i, weight });
          }
        }
      }
    }
    
    // Ensure the graph is connected
    for (let i = 1; i < numNodes; i++) {
      const source = Math.floor(Math.random() * i);
      
      if (!newAdjacencyList[source].some(edge => edge.target === i) && 
          !newAdjacencyList[i].some(edge => edge.target === source)) {
        const weight = Math.round(
          Math.sqrt(
            Math.pow(newNodes[i].x - newNodes[source].x, 2) + 
            Math.pow(newNodes[i].y - newNodes[source].y, 2)
          ) / 10
        ) + 1;
        
        newAdjacencyList[source].push({ target: i, weight });
        newAdjacencyList[i].push({ target: source, weight });
      }
    }
    
    setNodes(newNodes);
    setAdjacencyList(newAdjacencyList);
    setStartNode(0);
    setCompleted(false);
    setVisitedOrder([]);
    setShortestPaths({});
    setPreviousNodes({});
    setCurrentNode(null);
  };
  
  // Draw the graph on canvas
  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges
    for (let nodeId in adjacencyList) {
      const source = parseInt(nodeId);
      const sourceNode = nodes[source];
      
      for (const edge of adjacencyList[source]) {
        const targetNode = nodes[edge.target];
        
        // Check if this edge is part of the shortest path
        const isShortestPath = 
          previousNodes[edge.target] === source || 
          previousNodes[source] === edge.target;
        
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        
        // Styling for edges
        if (isShortestPath && completed) {
          ctx.strokeStyle = '#4caf50'; // Green for shortest path
          ctx.lineWidth = 2.5;
        } else {
          ctx.strokeStyle = '#888';
          ctx.lineWidth = 1;
        }
        
        ctx.stroke();
        
        // Draw edge weight
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;
        
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText(edge.weight.toString(), midX, midY);
      }
    }
    
    // Draw nodes
    nodes.forEach((node, i) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI);
      
      // Node fill color based on state
      if (i === startNode) {
        ctx.fillStyle = '#2196f3'; // Blue for start node
      } else if (i === currentNode) {
        ctx.fillStyle = '#ff9800'; // Orange for current node
      } else if (node.visited) {
        ctx.fillStyle = '#9c27b0'; // Purple for visited nodes
      } else if (node.inQueue) {
        ctx.fillStyle = '#ffeb3b'; // Yellow for nodes in queue
      } else {
        ctx.fillStyle = '#e0e0e0'; // Light gray for unvisited nodes
      }
      
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw node ID
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i.toString(), node.x, node.y);
      
      // Draw distance if calculated
      if (shortestPaths[i] !== undefined && shortestPaths[i] !== Infinity) {
        ctx.fillStyle = '#000';
        ctx.font = '10px Arial';
        ctx.fillText(`d=${shortestPaths[i]}`, node.x, node.y - 20);
      }
    });
  };
  
  // Start Dijkstra's algorithm
  const startTraversal = async () => {
    if (traversing || completed) return;
    
    setTraversing(true);
    traversingRef.current = true;
    
    await dijkstraAlgorithm(startNode);
    
    if (traversingRef.current) {
      setCompleted(true);
      setTraversing(false);
      traversingRef.current = false;
    }
  };
  
  // Stop traversal
  const stopTraversal = () => {
    traversingRef.current = false;
    setTraversing(false);
  };
  
  // Dijkstra's algorithm implementation
  const dijkstraAlgorithm = async (start: number) => {
    // Initialize distances and priority queue
    const distances: {[key: number]: number} = {};
    const previous: {[key: number]: number | null} = {};
    const visited: number[] = [];
    const pq = new PriorityQueue<{vertex: number, distance: number}>(
      (a, b) => a.distance - b.distance
    );
    
    // Reset all nodes
    const resetNodes = nodes.map(node => ({
      ...node,
      visited: false,
      inQueue: false,
      distance: Infinity
    }));
    
    // Set start node distance to 0
    resetNodes[start].distance = 0;
    resetNodes[start].inQueue = true;
    setNodes(resetNodes);
    
    // Initialize all distances to Infinity
    nodes.forEach((_, i) => {
      distances[i] = i === start ? 0 : Infinity;
      previous[i] = null;
    });
    
    // Add start node to priority queue
    pq.enqueue({ vertex: start, distance: 0 });
    
    while (!pq.isEmpty() && traversingRef.current) {
      const { vertex } = pq.dequeue()!;
      
      // Skip if already visited
      if (resetNodes[vertex].visited) continue;
      
      // Mark as visited
      resetNodes[vertex].visited = true;
      resetNodes[vertex].inQueue = false;
      visited.push(vertex);
      
      setCurrentNode(vertex);
      setVisitedOrder([...visited]);
      setNodes([...resetNodes]);
      setShortestPaths({...distances});
      setPreviousNodes({...previous});
      
      await sleep(animationSpeedRef.current * 3);
      
      // Check all neighbors
      for (const edge of adjacencyList[vertex] || []) {
        const neighbor = edge.target;
        const weight = edge.weight;
        
        // Calculate new distance
        const newDistance = distances[vertex] + weight;
        
        // If we found a shorter path
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = vertex;
          resetNodes[neighbor].distance = newDistance;
          
          // Add to priority queue
          pq.enqueue({ vertex: neighbor, distance: newDistance });
          
          // Mark as in queue
          if (!resetNodes[neighbor].visited) {
            resetNodes[neighbor].inQueue = true;
          }
          
          setNodes([...resetNodes]);
          setShortestPaths({...distances});
          setPreviousNodes({...previous});
          
          await sleep(animationSpeedRef.current);
        }
      }
    }
    
    setCurrentNode(null);
    return { distances, previous, visited };
  };
  
  // Handle canvas click to select start node
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (traversing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Find clicked node
    for (let i = 0; i < nodes.length; i++) {
      const distance = Math.sqrt(
        Math.pow(nodes[i].x - x, 2) + Math.pow(nodes[i].y - y, 2)
      );
      
      if (distance <= 20) {
        setStartNode(i);
        setCompleted(false);
        setVisitedOrder([]);
        setShortestPaths({});
        setPreviousNodes({});
        
        // Reset all nodes
        const resetNodes = nodes.map(node => ({
          ...node,
          visited: false,
          inQueue: false,
          inStack: false,
          distance: Infinity,
          parent: null
        }));
        setNodes(resetNodes);
        
        break;
      }
    }
  };
  
  // Helper function for constructing the shortest path
  const getShortestPathTo = (target: number): number[] => {
    const path: number[] = [];
    let current: number | null = target;
    
    while (current !== null) {
      path.unshift(current);
      current = previousNodes[current];
    }
    
    return path;
  };
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Shortest Path: {algorithmName}</Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1">
          Start Node: <strong>{startNode}</strong> (Click on a node to change the start node)
        </Typography>
        
        <ButtonGroup variant="contained" sx={{ mb: 2, mt: 2 }}>
          <Button 
            startIcon={traversing ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={traversing ? stopTraversal : startTraversal}
            color={traversing ? "warning" : "primary"}
            disabled={completed}
          >
            {traversing ? "Pause" : "Start Dijkstra's Algorithm"}
          </Button>
          <Button 
            startIcon={<StopIcon />}
            onClick={generateRandomGraph}
            disabled={traversing}
          >
            New Graph
          </Button>
        </ButtonGroup>
        
        <Box sx={{ width: '45%', mt: 2, mb: 2 }}>
          <Typography id="speed-slider" gutterBottom>
            Animation Speed: {speed}
          </Typography>
          <Slider
            value={speed}
            onChange={(_, newValue) => setSpeed(newValue as number)}
            aria-labelledby="speed-slider"
            min={1}
            max={100}
          />
        </Box>
      </Box>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          backgroundColor: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={300}
          onClick={handleCanvasClick}
          style={{ cursor: traversing ? 'default' : 'pointer' }}
        />
        
        {/* Result display */}
        {completed && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">
              Algorithm completed!
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Shortest distances from node {startNode}:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 1 }}>
              {Object.entries(shortestPaths).map(([node, distance]) => (
                <Chip 
                  key={node} 
                  label={`Node ${node}: ${distance === Infinity ? '∞' : distance}`}
                  color={distance === Infinity ? 'default' : 'primary'}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          <strong>Color Legend:</strong> 
          <span style={{ color: '#2196f3' }}> Start Node</span> | 
          <span style={{ color: '#e0e0e0' }}> Unvisited Node</span> | 
          <span style={{ color: '#9c27b0' }}> Visited Node</span> | 
          <span style={{ color: '#ff9800' }}> Current Node</span> | 
          <span style={{ color: '#ffeb3b' }}> Node in Queue</span> |
          <span style={{ color: '#4caf50' }}> Shortest Path</span>
        </Typography>
      </Box>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          <strong>Algorithm Information:</strong> Dijkstra's algorithm finds the shortest path from a single source node to all other nodes in a weighted graph with non-negative edge weights.
        </Typography>
      </Box>
    </Box>
  );
};

// Actual implementation of the PrimAlgorithmVisualizer
export const PrimAlgorithmVisualizer: React.FC<VisualizerProps> = ({ algorithmName = "Prim's (min. spanning tree)" }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [adjacencyList, setAdjacencyList] = useState<AdjacencyList>({});
  const [startNode, setStartNode] = useState<number>(0);
  const [traversing, setTraversing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [visitedOrder, setVisitedOrder] = useState<number[]>([]);
  const [mstEdges, setMstEdges] = useState<{from: number, to: number, weight: number}[]>([]);
  const [currentNode, setCurrentNode] = useState<number | null>(null);
  const [currentEdge, setCurrentEdge] = useState<{from: number, to: number} | null>(null);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const traversingRef = useRef(false);
  const animationSpeedRef = useRef(100);
  
  // Initialize graph
  useEffect(() => {
    generateRandomGraph();
  }, []);
  
  // Update animation speed when slider changes
  useEffect(() => {
    animationSpeedRef.current = 101 - speed;
  }, [speed]);
  
  // Draw the graph whenever nodes or MST changes
  useEffect(() => {
    if (canvasRef.current) {
      drawGraph();
    }
  }, [nodes, mstEdges, currentNode, currentEdge, completed]);
  
  // Generate a random graph
  const generateRandomGraph = () => {
    if (traversing) return;
    
    const numNodes = Math.floor(Math.random() * 5) + 6; // 6-10 nodes
    const newNodes: Node[] = [];
    const newAdjacencyList: AdjacencyList = {};
    
    // Create nodes with random positions
    for (let i = 0; i < numNodes; i++) {
      const x = 50 + Math.random() * 300;
      const y = 50 + Math.random() * 200;
      
      newNodes.push({
        id: i,
        x,
        y,
        visited: false,
        inQueue: false,
        inStack: false,
        distance: Infinity,
        parent: null
      });
      
      newAdjacencyList[i] = [];
    }
    
    // Create random edges with weights
    for (let i = 0; i < numNodes; i++) {
      const numEdges = Math.floor(Math.random() * 3) + 1; // 1-3 edges per node
      
      for (let j = 0; j < numEdges; j++) {
        const target = Math.floor(Math.random() * numNodes);
        
        // Avoid self-loops and duplicate edges
        if (target !== i && !newAdjacencyList[i].some(edge => edge.target === target)) {
          // Calculate Euclidean distance for edge weight (rounded to integer)
          const weight = Math.round(
            Math.sqrt(
              Math.pow(newNodes[i].x - newNodes[target].x, 2) + 
              Math.pow(newNodes[i].y - newNodes[target].y, 2)
            ) / 10
          ) + 1; // Adding 1 to ensure positive weight
          
          newAdjacencyList[i].push({ target, weight });
          newAdjacencyList[target].push({ target: i, weight }); // Ensure undirected graph
        }
      }
    }
    
    // Ensure the graph is connected
    for (let i = 1; i < numNodes; i++) {
      const source = Math.floor(Math.random() * i);
      
      if (!newAdjacencyList[source].some(edge => edge.target === i) && 
          !newAdjacencyList[i].some(edge => edge.target === source)) {
        const weight = Math.round(
          Math.sqrt(
            Math.pow(newNodes[i].x - newNodes[source].x, 2) + 
            Math.pow(newNodes[i].y - newNodes[source].y, 2)
          ) / 10
        ) + 1;
        
        newAdjacencyList[source].push({ target: i, weight });
        newAdjacencyList[i].push({ target: source, weight });
      }
    }
    
    setNodes(newNodes);
    setAdjacencyList(newAdjacencyList);
    setStartNode(0);
    setCompleted(false);
    setVisitedOrder([]);
    setMstEdges([]);
    setCurrentNode(null);
    setCurrentEdge(null);
    setTotalWeight(0);
  };
  
  // Draw the graph on canvas
  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all edges first (non-MST)
    for (let nodeId in adjacencyList) {
      const source = parseInt(nodeId);
      const sourceNode = nodes[source];
      
      for (const edge of adjacencyList[source]) {
        const targetNode = nodes[edge.target];
        
        // Skip drawing edges twice in undirected graph
        if (source > edge.target) continue;
        
        // Check if this edge is in the MST or is the current edge being considered
        const isInMST = mstEdges.some(e => 
          (e.from === source && e.to === edge.target) || 
          (e.from === edge.target && e.to === source)
        );
        
        const isCurrentEdge = currentEdge && 
          ((currentEdge.from === source && currentEdge.to === edge.target) ||
           (currentEdge.from === edge.target && currentEdge.to === source));
        
        // Skip MST edges for now, we'll draw them last
        if (isInMST) continue;
        
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        
        // Styling for edges
        if (isCurrentEdge) {
          ctx.strokeStyle = '#ff9800'; // Orange for current edge
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = '#ccc';
          ctx.lineWidth = 1;
        }
        
        ctx.stroke();
        
        // Draw edge weight
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;
        
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText(edge.weight.toString(), midX, midY);
      }
    }
    
    // Draw MST edges on top
    for (const edge of mstEdges) {
      const sourceNode = nodes[edge.from];
      const targetNode = nodes[edge.to];
      
      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      
      ctx.strokeStyle = '#4caf50'; // Green for MST edges
      ctx.lineWidth = 2.5;
      ctx.stroke();
      
      // Draw edge weight
      const midX = (sourceNode.x + targetNode.x) / 2;
      const midY = (sourceNode.y + targetNode.y) / 2;
      
      ctx.fillStyle = '#4caf50';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(edge.weight.toString(), midX, midY);
    }
    
    // Draw nodes
    nodes.forEach((node, i) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI);
      
      // Node fill color based on state
      if (i === startNode) {
        ctx.fillStyle = '#2196f3'; // Blue for start node
      } else if (i === currentNode) {
        ctx.fillStyle = '#ff9800'; // Orange for current node
      } else if (node.visited) {
        ctx.fillStyle = '#9c27b0'; // Purple for visited nodes
      } else if (node.inQueue) {
        ctx.fillStyle = '#ffeb3b'; // Yellow for nodes in queue
      } else {
        ctx.fillStyle = '#e0e0e0'; // Light gray for unvisited nodes
      }
      
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw node ID
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i.toString(), node.x, node.y);
    });
  };
  
  // Start Prim's algorithm
  const startTraversal = async () => {
    if (traversing || completed) return;
    
    setTraversing(true);
    traversingRef.current = true;
    
    await primAlgorithm(startNode);
    
    if (traversingRef.current) {
      setCompleted(true);
      setTraversing(false);
      traversingRef.current = false;
    }
  };
  
  // Stop traversal
  const stopTraversal = () => {
    traversingRef.current = false;
    setTraversing(false);
  };
  
  // Prim's algorithm implementation
  const primAlgorithm = async (start: number) => {
    // Reset all nodes
    const resetNodes = nodes.map(node => ({
      ...node,
      visited: false,
      inQueue: false,
      distance: Infinity
    }));
    
    const visited: number[] = [];
    const mst: {from: number, to: number, weight: number}[] = [];
    let totalMstWeight = 0;
    
    // Priority queue for edges
    const pq = new PriorityQueue<{from: number, to: number, weight: number}>(
      (a, b) => a.weight - b.weight
    );
    
    // Add all edges from start node to the priority queue
    resetNodes[start].visited = true;
    visited.push(start);
    setCurrentNode(start);
    setNodes([...resetNodes]);
    setVisitedOrder([...visited]);
    
    await sleep(animationSpeedRef.current * 2);
    
    // Add the edges from the start node to the priority queue
    for (const edge of adjacencyList[start]) {
      pq.enqueue({ from: start, to: edge.target, weight: edge.weight });
      resetNodes[edge.target].inQueue = true;
    }
    
    setNodes([...resetNodes]);
    
    // Main loop - keep adding edges until all nodes are in the MST
    while (!pq.isEmpty() && visited.length < nodes.length && traversingRef.current) {
      // Get the minimum weight edge
      const nextEdge = pq.dequeue()!;
      
      // If the destination is already visited, skip
      if (resetNodes[nextEdge.to].visited) continue;
      
      setCurrentEdge({ from: nextEdge.from, to: nextEdge.to });
      await sleep(animationSpeedRef.current * 2);
      
      // Add to MST
      mst.push(nextEdge);
      totalMstWeight += nextEdge.weight;
      
      // Mark destination as visited
      resetNodes[nextEdge.to].visited = true;
      resetNodes[nextEdge.to].inQueue = false;
      visited.push(nextEdge.to);
      
      setCurrentNode(nextEdge.to);
      setMstEdges([...mst]);
      setTotalWeight(totalMstWeight);
      setNodes([...resetNodes]);
      setVisitedOrder([...visited]);
      
      await sleep(animationSpeedRef.current * 3);
      
      // Add all edges from the new node to the priority queue
      for (const edge of adjacencyList[nextEdge.to]) {
        if (!resetNodes[edge.target].visited) {
          pq.enqueue({ from: nextEdge.to, to: edge.target, weight: edge.weight });
          
          // Mark as in queue if not already visited
          if (!resetNodes[edge.target].visited) {
            resetNodes[edge.target].inQueue = true;
          }
        }
      }
      
      setNodes([...resetNodes]);
      setCurrentEdge(null);
      await sleep(animationSpeedRef.current);
    }
    
    setCurrentNode(null);
    setCurrentEdge(null);
    return { mst, totalWeight: totalMstWeight };
  };
  
  // Handle canvas click to select start node
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (traversing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Find clicked node
    for (let i = 0; i < nodes.length; i++) {
      const distance = Math.sqrt(
        Math.pow(nodes[i].x - x, 2) + Math.pow(nodes[i].y - y, 2)
      );
      
      if (distance <= 20) {
        setStartNode(i);
        setCompleted(false);
        setVisitedOrder([]);
        setMstEdges([]);
        setTotalWeight(0);
        
        // Reset all nodes
        const resetNodes = nodes.map(node => ({
          ...node,
          visited: false,
          inQueue: false,
          inStack: false,
          distance: Infinity,
          parent: null
        }));
        setNodes(resetNodes);
        
        break;
      }
    }
  };
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Minimum Spanning Tree: {algorithmName}</Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1">
          Start Node: <strong>{startNode}</strong> (Click on a node to change the start node)
        </Typography>
        
        <ButtonGroup variant="contained" sx={{ mb: 2, mt: 2 }}>
          <Button 
            startIcon={traversing ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={traversing ? stopTraversal : startTraversal}
            color={traversing ? "warning" : "primary"}
            disabled={completed}
          >
            {traversing ? "Pause" : "Start Prim's Algorithm"}
          </Button>
          <Button 
            startIcon={<StopIcon />}
            onClick={generateRandomGraph}
            disabled={traversing}
          >
            New Graph
          </Button>
        </ButtonGroup>
        
        <Box sx={{ width: '45%', mt: 2, mb: 2 }}>
          <Typography id="speed-slider" gutterBottom>
            Animation Speed: {speed}
          </Typography>
          <Slider
            value={speed}
            onChange={(_, newValue) => setSpeed(newValue as number)}
            aria-labelledby="speed-slider"
            min={1}
            max={100}
          />
        </Box>
      </Box>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          backgroundColor: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={300}
          onClick={handleCanvasClick}
          style={{ cursor: traversing ? 'default' : 'pointer' }}
        />
        
        {/* Result display */}
        {completed && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">
              Minimum Spanning Tree completed!
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              MST Total Weight: <strong>{totalWeight}</strong>
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>
              Edges in MST:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 1 }}>
              {mstEdges.map((edge, index) => (
                <Chip 
                  key={index} 
                  label={`${edge.from} — ${edge.to} (${edge.weight})`}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          <strong>Color Legend:</strong> 
          <span style={{ color: '#2196f3' }}> Start Node</span> | 
          <span style={{ color: '#e0e0e0' }}> Unvisited Node</span> | 
          <span style={{ color: '#9c27b0' }}> Node in MST</span> | 
          <span style={{ color: '#ff9800' }}> Current Node</span> | 
          <span style={{ color: '#ffeb3b' }}> Node in Queue</span> |
          <span style={{ color: '#4caf50' }}> MST Edge</span>
        </Typography>
      </Box>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          <strong>Algorithm Information:</strong> Prim's algorithm builds a minimum spanning tree by always adding the lowest weight edge that connects a node in the tree to a node outside the tree.
        </Typography>
      </Box>
    </Box>
  );
};

// Actual implementation of the AStarAlgorithmVisualizer
export const AStarAlgorithmVisualizer: React.FC<VisualizerProps> = ({ algorithmName = "A* (heuristic search)" }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [adjacencyList, setAdjacencyList] = useState<AdjacencyList>({});
  const [startNode, setStartNode] = useState<number>(0);
  const [endNode, setEndNode] = useState<number>(0);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [traversing, setTraversing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [visitedOrder, setVisitedOrder] = useState<number[]>([]);
  const [shortestPath, setShortestPath] = useState<number[]>([]);
  const [costs, setCosts] = useState<{[key: number]: {g: number, h: number, f: number}}>({});
  const [currentNode, setCurrentNode] = useState<number | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const traversingRef = useRef(false);
  const animationSpeedRef = useRef(100);
  
  // Initialize graph
  useEffect(() => {
    generateRandomGraph();
  }, []);
  
  // Update animation speed when slider changes
  useEffect(() => {
    animationSpeedRef.current = 101 - speed;
  }, [speed]);
  
  // Draw the graph whenever relevant states change
  useEffect(() => {
    if (canvasRef.current) {
      drawGraph();
    }
  }, [nodes, shortestPath, currentNode, completed, startNode, endNode, selectingEnd]);
  
  // Generate a random graph
  const generateRandomGraph = () => {
    if (traversing) return;
    
    const numNodes = Math.floor(Math.random() * 5) + 6; // 6-10 nodes
    const newNodes: Node[] = [];
    const newAdjacencyList: AdjacencyList = {};
    
    // Create nodes with random positions on a grid structure
    const gridSize = Math.ceil(Math.sqrt(numNodes));
    const cellWidth = 300 / gridSize;
    const cellHeight = 200 / gridSize;
    
    let nodeId = 0;
    for (let row = 0; row < gridSize && nodeId < numNodes; row++) {
      for (let col = 0; col < gridSize && nodeId < numNodes; col++) {
        // Add some randomness to positions within grid cells
        const x = (col * cellWidth) + (cellWidth * 0.5) + (Math.random() * cellWidth * 0.5) - (cellWidth * 0.25) + 50;
        const y = (row * cellHeight) + (cellHeight * 0.5) + (Math.random() * cellHeight * 0.5) - (cellHeight * 0.25) + 50;
        
        newNodes.push({
          id: nodeId,
          x,
          y,
          visited: false,
          inQueue: false,
          inStack: false,
          distance: Infinity,
          parent: null
        });
        
        newAdjacencyList[nodeId] = [];
        nodeId++;
      }
    }
    
    // Create edges connecting nodes, favoring grid-like connections
    for (let i = 0; i < numNodes; i++) {
      // Try to connect to neighbors in cardinal directions with higher probability
      for (let j = 0; j < numNodes; j++) {
        if (i === j) continue;
        
        const dx = Math.abs(newNodes[i].x - newNodes[j].x);
        const dy = Math.abs(newNodes[i].y - newNodes[j].y);
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Prefer connections to closer nodes
        if (dist < 100 && Math.random() < 0.7) {
          // Calculate edge weight as euclidean distance
          const weight = Math.round(dist / 10) + 1;
          
          // Add edge if it doesn't already exist
          if (!newAdjacencyList[i].some(edge => edge.target === j)) {
            newAdjacencyList[i].push({ target: j, weight });
          }
          
          // Add reverse edge for undirected graph
          if (!newAdjacencyList[j].some(edge => edge.target === i)) {
            newAdjacencyList[j].push({ target: i, weight });
          }
        }
      }
    }
    
    // Ensure the graph is connected
    for (let i = 1; i < numNodes; i++) {
      if (newAdjacencyList[i-1].some(edge => edge.target === i)) continue;
      
      const weight = Math.round(
        Math.sqrt(
          Math.pow(newNodes[i].x - newNodes[i-1].x, 2) + 
          Math.pow(newNodes[i].y - newNodes[i-1].y, 2)
        ) / 10
      ) + 1;
      
      newAdjacencyList[i-1].push({ target: i, weight });
      newAdjacencyList[i].push({ target: i-1, weight });
    }
    
    setNodes(newNodes);
    setAdjacencyList(newAdjacencyList);
    
    // Set start and end nodes to opposite corners
    setStartNode(0);
    setEndNode(numNodes - 1);
    setSelectingEnd(false);
    setCompleted(false);
    setVisitedOrder([]);
    setShortestPath([]);
    setCosts({});
    setCurrentNode(null);
  };
  
  // Draw the graph on canvas
  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges
    for (let nodeId in adjacencyList) {
      const source = parseInt(nodeId);
      const sourceNode = nodes[source];
      
      for (const edge of adjacencyList[source]) {
        const targetNode = nodes[edge.target];
        
        // Skip drawing edges twice in undirected graph
        if (source > edge.target) continue;
        
        // Check if this edge is part of the shortest path
        const isShortestPath = 
          shortestPath.includes(source) && 
          shortestPath.includes(edge.target) &&
          Math.abs(shortestPath.indexOf(source) - shortestPath.indexOf(edge.target)) === 1;
        
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        
        // Styling for edges
        if (isShortestPath) {
          ctx.strokeStyle = '#4caf50'; // Green for shortest path
          ctx.lineWidth = 2.5;
        } else {
          ctx.strokeStyle = '#ccc';
          ctx.lineWidth = 1;
        }
        
        ctx.stroke();
        
        // Draw edge weight
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;
        
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText(edge.weight.toString(), midX, midY);
      }
    }
    
    // Draw nodes
    nodes.forEach((node, i) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI);
      
      // Node fill color based on state
      if (i === startNode) {
        ctx.fillStyle = '#2196f3'; // Blue for start node
      } else if (i === endNode) {
        ctx.fillStyle = '#e91e63'; // Pink for end node
      } else if (shortestPath.includes(i)) {
        ctx.fillStyle = '#4caf50'; // Green for path nodes
      } else if (i === currentNode) {
        ctx.fillStyle = '#ff9800'; // Orange for current node
      } else if (node.visited) {
        ctx.fillStyle = '#9c27b0'; // Purple for visited nodes
      } else if (node.inQueue) {
        ctx.fillStyle = '#ffeb3b'; // Yellow for nodes in open set
      } else {
        ctx.fillStyle = '#e0e0e0'; // Light gray for unvisited nodes
      }
      
      ctx.fill();
      
      // Special border for node being selected
      if (selectingEnd) {
        ctx.strokeStyle = '#e91e63'; // Pink for end node selection
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
      }
      
      ctx.stroke();
      
      // Draw node ID
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i.toString(), node.x, node.y);
      
      // Draw costs for nodes if available
      if (costs[i]) {
        const { g, h, f } = costs[i];
        ctx.fillStyle = '#000';
        ctx.font = '10px Arial';
        const costText = `g=${g.toFixed(0)} h=${h.toFixed(0)} f=${f.toFixed(0)}`;
        ctx.fillText(costText, node.x, node.y - 20);
      }
    });
    
    // Draw selection instructions if in selection mode
    if (selectingEnd) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, 30);
      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Click on a node to set it as the DESTINATION node', canvas.width / 2, 20);
    }
  };
  
  // Start A* algorithm
  const startTraversal = async () => {
    if (traversing || completed) return;
    
    setTraversing(true);
    traversingRef.current = true;
    
    await aStarAlgorithm(startNode, endNode);
    
    if (traversingRef.current) {
      setCompleted(true);
      setTraversing(false);
      traversingRef.current = false;
    }
  };
  
  // Stop traversal
  const stopTraversal = () => {
    traversingRef.current = false;
    setTraversing(false);
  };
  
  // Heuristic function (Euclidean distance)
  const heuristic = (nodeIndex: number, goalIndex: number): number => {
    const node = nodes[nodeIndex];
    const goal = nodes[goalIndex];
    return Math.sqrt(
      Math.pow(node.x - goal.x, 2) + 
      Math.pow(node.y - goal.y, 2)
    ) / 10;
  };
  
  // A* algorithm implementation
  const aStarAlgorithm = async (start: number, goal: number) => {
    // Reset all nodes
    const resetNodes = nodes.map(node => ({
      ...node,
      visited: false,
      inQueue: false,
      distance: Infinity
    }));
    
    const visited: number[] = [];
    const openSet: number[] = [start];
    const previousNode: {[key: number]: number | null} = {};
    
    // Track costs
    const gScore: {[key: number]: number} = {}; // Cost from start to node
    const fScore: {[key: number]: number} = {}; // Estimated total cost (g + h)
    const hValues: {[key: number]: number} = {}; // Heuristic values
    const nodeCosts: {[key: number]: {g: number, h: number, f: number}} = {};
    
    // Initialize costs
    for (let i = 0; i < nodes.length; i++) {
      gScore[i] = i === start ? 0 : Infinity;
      const h = heuristic(i, goal);
      hValues[i] = h;
      fScore[i] = i === start ? h : Infinity;
      
      if (i === start) {
        nodeCosts[i] = { g: 0, h, f: h };
      }
      
      previousNode[i] = null;
    }
    
    // Mark start node as in queue
    resetNodes[start].inQueue = true;
    setNodes([...resetNodes]);
    setCosts({...nodeCosts});
    
    // Main loop
    while (openSet.length > 0 && traversingRef.current) {
      // Find node with lowest fScore
      let current = openSet[0];
      let lowestFScore = fScore[current];
      
      for (let i = 1; i < openSet.length; i++) {
        if (fScore[openSet[i]] < lowestFScore) {
          current = openSet[i];
          lowestFScore = fScore[current];
        }
      }
      
      // If we reached the goal
      if (current === goal) {
        // Reconstruct path
        const path: number[] = [];
        let temp = current;
        path.push(temp);
        
        while (previousNode[temp] !== null) {
          temp = previousNode[temp]!;
          path.unshift(temp);
        }
        
        setShortestPath(path);
        return path;
      }
      
      // Remove current from openSet
      openSet.splice(openSet.indexOf(current), 1);
      
      // Mark as visited
      resetNodes[current].visited = true;
      resetNodes[current].inQueue = false;
      visited.push(current);
      
      setCurrentNode(current);
      setVisitedOrder([...visited]);
      setNodes([...resetNodes]);
      
      await sleep(animationSpeedRef.current * 3);
      
      // Check neighbors
      for (const edge of adjacencyList[current] || []) {
        const neighbor = edge.target;
        
        // Skip if already visited
        if (resetNodes[neighbor].visited) continue;
        
        // Calculate tentative gScore
        const tentativeGScore = gScore[current] + edge.weight;
        
        // If this path is better than any previous one
        if (tentativeGScore < gScore[neighbor]) {
          // Update path and scores
          previousNode[neighbor] = current;
          gScore[neighbor] = tentativeGScore;
          const h = hValues[neighbor];
          fScore[neighbor] = gScore[neighbor] + h;
          
          // Update costs for visualization
          nodeCosts[neighbor] = { 
            g: gScore[neighbor], 
            h, 
            f: fScore[neighbor] 
          };
          
          // Add to open set if not already there
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
            resetNodes[neighbor].inQueue = true;
          }
        }
      }
      
      // Update UI
      setCosts({...nodeCosts});
      setNodes([...resetNodes]);
      
      await sleep(animationSpeedRef.current);
    }
    
    // No path found
    setCurrentNode(null);
    return [];
  };
  
  // Toggle end node selection mode
  const toggleEndNodeSelection = () => {
    if (traversing) return;
    setSelectingEnd(!selectingEnd);
  };
  
  // Handle canvas click to select start/end node
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (traversing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Find clicked node
    for (let i = 0; i < nodes.length; i++) {
      const distance = Math.sqrt(
        Math.pow(nodes[i].x - x, 2) + Math.pow(nodes[i].y - y, 2)
      );
      
      if (distance <= 20) {
        if (selectingEnd) {
          // Set end node
          if (i !== startNode) {
            setEndNode(i);
            setSelectingEnd(false);
          }
        } else {
          // Set start node
          if (i !== endNode) {
            setStartNode(i);
          }
        }
        
        // Reset visualization
        setCompleted(false);
        setVisitedOrder([]);
        setShortestPath([]);
        setCosts({});
        
        // Reset all nodes
        const resetNodes = nodes.map(node => ({
          ...node,
          visited: false,
          inQueue: false,
          inStack: false,
          distance: Infinity,
          parent: null
        }));
        setNodes(resetNodes);
        
        break;
      }
    }
  };
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Pathfinding: {algorithmName}</Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1">
          Start Node: <strong>{startNode}</strong> | Destination Node: <strong>{endNode}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          (Click on a node to change the start node, or use the button below to change the destination)
        </Typography>
        
        <ButtonGroup variant="contained" sx={{ mb: 2, mt: 2 }}>
          <Button 
            startIcon={traversing ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={traversing ? stopTraversal : startTraversal}
            color={traversing ? "warning" : "primary"}
            disabled={completed || startNode === endNode}
          >
            {traversing ? "Pause" : "Find Path"}
          </Button>
          <Button 
            startIcon={<StopIcon />}
            onClick={generateRandomGraph}
            disabled={traversing}
          >
            New Graph
          </Button>
          <Button
            color={selectingEnd ? "secondary" : "primary"}
            onClick={toggleEndNodeSelection}
            disabled={traversing}
            variant={selectingEnd ? "contained" : "outlined"}
          >
            Set Destination
          </Button>
        </ButtonGroup>
        
        <Box sx={{ width: '45%', mt: 2, mb: 2 }}>
          <Typography id="speed-slider" gutterBottom>
            Animation Speed: {speed}
          </Typography>
          <Slider
            value={speed}
            onChange={(_, newValue) => setSpeed(newValue as number)}
            aria-labelledby="speed-slider"
            min={1}
            max={100}
          />
        </Box>
      </Box>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          backgroundColor: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={300}
          onClick={handleCanvasClick}
          style={{ cursor: traversing ? 'default' : 'pointer' }}
        />
        
        {/* Result display */}
        {completed && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="h6" color={shortestPath.length > 0 ? "success.main" : "error.main"}>
              {shortestPath.length > 0 ? "Path found!" : "No path exists between these nodes!"}
            </Typography>
            {shortestPath.length > 0 && (
              <>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Path Length: <strong>{shortestPath.length - 1} steps</strong> | 
                  Total Cost: <strong>{costs[endNode]?.g || "N/A"}</strong>
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  Path: {shortestPath.join(' → ')}
                </Typography>
              </>
            )}
          </Box>
        )}
      </Paper>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          <strong>Color Legend:</strong> 
          <span style={{ color: '#2196f3' }}> Start Node</span> | 
          <span style={{ color: '#e91e63' }}> Destination Node</span> | 
          <span style={{ color: '#e0e0e0' }}> Unvisited Node</span> | 
          <span style={{ color: '#9c27b0' }}> Visited Node</span> | 
          <span style={{ color: '#ff9800' }}> Current Node</span> | 
          <span style={{ color: '#ffeb3b' }}> Node in Open Set</span> |
          <span style={{ color: '#4caf50' }}> Path</span>
        </Typography>
      </Box>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          <strong>Algorithm Information:</strong> A* combines Dijkstra's algorithm with heuristic search. 
          It uses a cost function f(n) = g(n) + h(n), where g(n) is the cost from start to node n, and h(n) is 
          a heuristic estimate of the cost from n to the goal. A* finds the shortest path if h(n) never overestimates
          the actual cost.
        </Typography>
      </Box>
    </Box>
  );
};
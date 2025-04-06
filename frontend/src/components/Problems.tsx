import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SearchIcon from '@mui/icons-material/Search';
import CasinoIcon from '@mui/icons-material/Casino';

interface PracticeProblem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  submissions?: number;
  successRate?: number;
  likes?: number;
  path: string;
  category: string;
  isBlind75: boolean;
  implemented?: boolean;
}

const Problems: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [blind75Only, setBlind75Only] = useState(true);

  // Blind 75 Problems List
  const practiceProblems: PracticeProblem[] = [
    // Arrays & Hashing
    { id: 1, title: 'Two Sum', difficulty: 'Easy', submissions: 35100, successRate: 100, likes: 98, path: 'two-sum', category: 'Arrays & Hashing', isBlind75: true, implemented: true },
    { id: 2, title: 'Contains Duplicate', difficulty: 'Easy', submissions: 16700, successRate: 99, likes: 97, path: 'contains-duplicate', category: 'Arrays & Hashing', isBlind75: true, implemented: true },
    { id: 3, title: 'Valid Anagram', difficulty: 'Easy', submissions: 14700, successRate: 99, likes: 99, path: 'valid-anagram', category: 'Arrays & Hashing', isBlind75: true, implemented: true },
    { id: 4, title: 'Group Anagrams', difficulty: 'Medium', submissions: 4200, successRate: 96, likes: 95, path: 'group-anagrams', category: 'Arrays & Hashing', isBlind75: true, implemented: false },
    { id: 5, title: 'Top K Frequent Elements', difficulty: 'Medium', submissions: 5400, successRate: 96, likes: 94, path: 'top-k-frequent', category: 'Arrays & Hashing', isBlind75: true, implemented: false },
    { id: 6, title: 'Product of Array Except Self', difficulty: 'Medium', submissions: 6100, successRate: 98, likes: 97, path: 'product-except-self', category: 'Arrays & Hashing', isBlind75: true, implemented: false },
    { id: 7, title: 'Valid Sudoku', difficulty: 'Medium', submissions: 1300, successRate: 100, likes: 95, path: 'valid-sudoku', category: 'Arrays & Hashing', isBlind75: true, implemented: false },
    { id: 8, title: 'Encode and Decode Strings', difficulty: 'Medium', submissions: 5400, successRate: 96, likes: 94, path: 'encode-decode-strings', category: 'Arrays & Hashing', isBlind75: true, implemented: false },
    { id: 9, title: 'Longest Consecutive Sequence', difficulty: 'Medium', submissions: 6100, successRate: 98, likes: 97, path: 'longest-consecutive', category: 'Arrays & Hashing', isBlind75: true, implemented: false },
    
    // Two Pointers
    { id: 10, title: 'Valid Palindrome', difficulty: 'Easy', submissions: 6100, successRate: 100, likes: 96, path: 'valid-palindrome', category: 'Two Pointers', isBlind75: true, implemented: true },
    { id: 11, title: 'Two Sum II', difficulty: 'Medium', submissions: 751, successRate: 100, likes: 94, path: 'two-sum-ii', category: 'Two Pointers', isBlind75: true, implemented: false },
    { id: 12, title: '3Sum', difficulty: 'Medium', submissions: 4900, successRate: 98, likes: 97, path: '3sum', category: 'Two Pointers', isBlind75: true, implemented: false },
    { id: 13, title: 'Container With Most Water', difficulty: 'Medium', submissions: 4300, successRate: 99, likes: 95, path: 'container-with-most-water', category: 'Two Pointers', isBlind75: true, implemented: false },
    { id: 14, title: 'Trapping Rain Water', difficulty: 'Hard', submissions: 1200, successRate: 82, likes: 96, path: 'trapping-rain-water', category: 'Two Pointers', isBlind75: true, implemented: false },
    
    // Sliding Window
    { id: 15, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', submissions: 5100, successRate: 100, likes: 98, path: 'best-time-to-buy-sell-stock', category: 'Sliding Window', isBlind75: true, implemented: true },
    { id: 16, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', submissions: 3400, successRate: 100, likes: 99, path: 'longest-substring', category: 'Sliding Window', isBlind75: true, implemented: false },
    { id: 17, title: 'Longest Repeating Character Replacement', difficulty: 'Medium', submissions: 2700, successRate: 96, likes: 95, path: 'longest-repeating-character', category: 'Sliding Window', isBlind75: true, implemented: false },
    { id: 18, title: 'Minimum Window Substring', difficulty: 'Hard', submissions: 2300, successRate: 98, likes: 97, path: 'minimum-window-substring', category: 'Sliding Window', isBlind75: true, implemented: false },
    
    // Stack
    { id: 19, title: 'Valid Parentheses', difficulty: 'Easy', submissions: 4000, successRate: 100, likes: 99, path: 'valid-parentheses', category: 'Stack', isBlind75: true, implemented: true },
    { id: 20, title: 'Min Stack', difficulty: 'Medium', submissions: 2100, successRate: 95, likes: 93, path: 'min-stack', category: 'Stack', isBlind75: true, implemented: false },
    { id: 21, title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', submissions: 1800, successRate: 92, likes: 91, path: 'evaluate-rpn', category: 'Stack', isBlind75: true, implemented: false },
    { id: 22, title: 'Generate Parentheses', difficulty: 'Medium', submissions: 2500, successRate: 94, likes: 96, path: 'generate-parentheses', category: 'Stack', isBlind75: true, implemented: false },
    { id: 23, title: 'Daily Temperatures', difficulty: 'Medium', submissions: 475, successRate: 100, likes: 97, path: 'daily-temperatures', category: 'Stack', isBlind75: true, implemented: false },
    { id: 24, title: 'Car Fleet', difficulty: 'Medium', submissions: 396, successRate: 100, likes: 92, path: 'car-fleet', category: 'Stack', isBlind75: true, implemented: false },
    { id: 25, title: 'Largest Rectangle in Histogram', difficulty: 'Hard', submissions: 950, successRate: 85, likes: 94, path: 'largest-rectangle', category: 'Stack', isBlind75: true, implemented: false },
    
    // Binary Search
    { id: 26, title: 'Binary Search', difficulty: 'Easy', submissions: 7900, successRate: 99, likes: 98, path: 'binary-search', category: 'Binary Search', isBlind75: true, implemented: true },
    { id: 27, title: 'Search a 2D Matrix', difficulty: 'Medium', submissions: 3100, successRate: 97, likes: 95, path: 'search-2d-matrix', category: 'Binary Search', isBlind75: true, implemented: false },
    { id: 28, title: 'Koko Eating Bananas', difficulty: 'Medium', submissions: 809, successRate: 100, likes: 96, path: 'koko-eating-bananas', category: 'Binary Search', isBlind75: true, implemented: false },
    { id: 29, title: 'Search in Rotated Sorted Array', difficulty: 'Medium', submissions: 2400, successRate: 95, likes: 97, path: 'search-rotated-array', category: 'Binary Search', isBlind75: true, implemented: false },
    
    // Linked List
    { id: 30, title: 'Reverse Linked List', difficulty: 'Easy', submissions: 8700, successRate: 98, likes: 99, path: 'reverse-linked-list', category: 'Linked List', isBlind75: true, implemented: true },
    { id: 31, title: 'Merge Two Sorted Lists', difficulty: 'Easy', submissions: 2500, successRate: 100, likes: 98, path: 'merge-two-lists', category: 'Linked List', isBlind75: true, implemented: true },
    { id: 32, title: 'Reorder List', difficulty: 'Medium', submissions: 1800, successRate: 100, likes: 96, path: 'reorder-list', category: 'Linked List', isBlind75: true, implemented: false },
    { id: 33, title: 'Remove Nth Node From End of List', difficulty: 'Medium', submissions: 1700, successRate: 98, likes: 95, path: 'remove-nth-node', category: 'Linked List', isBlind75: true, implemented: false },
    
    // Trees
    { id: 34, title: 'Invert Binary Tree', difficulty: 'Easy', submissions: 9800, successRate: 99, likes: 100, path: 'invert-binary-tree', category: 'Trees', isBlind75: true, implemented: true },
    { id: 35, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', submissions: 9500, successRate: 100, likes: 99, path: 'max-depth-binary-tree', category: 'Trees', isBlind75: true, implemented: true },
    { id: 36, title: 'Same Tree', difficulty: 'Easy', submissions: 1900, successRate: 100, likes: 96, path: 'same-tree', category: 'Trees', isBlind75: true, implemented: true },
    { id: 37, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', submissions: 1500, successRate: 98, likes: 96, path: 'level-order-traversal', category: 'Trees', isBlind75: true, implemented: false },
    { id: 38, title: 'Validate Binary Search Tree', difficulty: 'Medium', submissions: 2000, successRate: 91, likes: 93, path: 'validate-bst', category: 'Trees', isBlind75: true, implemented: false },
    
    // Non-Blind 75 problems for variety
    { id: 39, title: 'Palindrome Number', difficulty: 'Easy', submissions: 1600, successRate: 97, likes: 92, path: 'palindrome-number', category: 'Math', isBlind75: false, implemented: true },
    { id: 40, title: 'Fizz Buzz', difficulty: 'Easy', submissions: 1400, successRate: 98, likes: 91, path: 'fizz-buzz', category: 'Math', isBlind75: false, implemented: true },
    { id: 41, title: 'Roman to Integer', difficulty: 'Easy', submissions: 1100, successRate: 95, likes: 90, path: 'roman-to-integer', category: 'Math', isBlind75: false, implemented: true },
    { id: 42, title: 'Count Primes', difficulty: 'Medium', submissions: 3800, successRate: 89, likes: 90, path: 'count-primes', category: 'Math', isBlind75: false, implemented: false },
    { id: 43, title: 'Pow(x, n)', difficulty: 'Medium', submissions: 2900, successRate: 85, likes: 89, path: 'pow-x-n', category: 'Math', isBlind75: false, implemented: false }
  ];

  const getDifficultyColor = (difficulty: string): string => {
    switch(difficulty) {
      case 'Easy': return '#00b8a3';
      case 'Medium': return '#ffc01e';
      case 'Hard': return '#ff375f';
      default: return '#00b8a3';
    }
  };

  const formatNumber = (num: number): string => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();
  };

  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setDifficultyFilter(event.target.value);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleBlind75FilterChange = (event: SelectChangeEvent) => {
    setBlind75Only(event.target.value === 'true');
  };

  // Get all unique categories
  const categories = ['All', ...Array.from(new Set(practiceProblems.map(problem => problem.category)))];

  // Filter problems based on search and filters
  const filteredProblems = practiceProblems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === 'All' || problem.category === categoryFilter;
    const matchesBlind75 = !blind75Only || problem.isBlind75;
    return matchesSearch && matchesDifficulty && matchesCategory && matchesBlind75;
  });

  // Add navigation handler that checks if problem is implemented
  const handleProblemClick = (problem: PracticeProblem) => {
    if (problem.implemented) {
      navigate(problem.path);
    } else {
      // Show an alert for unimplemented problems
      alert(`This problem (${problem.title}) is not yet implemented. Please try the 'Two Sum' or 'Contains Duplicate' problems which are fully functional.`);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Coding Interview Practice
      </Typography>
      
      <Typography variant="h6" color="primary" gutterBottom>
        Blind 75 LeetCode Questions
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        Practise data structures and algorithms with this curated collection of the famous "Blind 75" LeetCode questions.
        These are the most frequently asked coding interview problems at top tech companies like Google, Facebook, Amazon, and Microsoft.
        Practice these problems in Python and try to implement the most optimal solutions to prepare effectively for technical interviews.
      </Typography>

      {/* Problem Roulette Link */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          onClick={() => navigate('/problem-roulette')}
          startIcon={<CasinoIcon />}
          sx={{ py: 1.5, px: 3, borderRadius: 2 }}
        >
          Can't Decide? Try Problem Roulette!
        </Button>
      </Box>

      {/* Filters and Search */}
      <Box component={Paper} elevation={1} sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid component="div" sx={{ gridColumn: {xs: 'span 12', sm: 'span 3'} }}>
            <TextField
              fullWidth
              label="Search Problems"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid component="div" sx={{ gridColumn: {xs: 'span 12', sm: 'span 3'} }}>
            <FormControl fullWidth>
              <InputLabel id="difficulty-select-label">Difficulty</InputLabel>
              <Select
                labelId="difficulty-select-label"
                id="difficulty-select"
                value={difficultyFilter}
                label="Difficulty"
                onChange={handleDifficultyChange}
              >
                <MenuItem value="All">All Difficulties</MenuItem>
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid component="div" sx={{ gridColumn: {xs: 'span 12', sm: 'span 3'} }}>
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                value={categoryFilter}
                label="Category"
                onChange={handleCategoryChange}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid component="div" sx={{ gridColumn: {xs: 'span 12', sm: 'span 3'} }}>
            <FormControl fullWidth>
              <InputLabel id="blind75-select-label">Problem Set</InputLabel>
              <Select
                labelId="blind75-select-label"
                id="blind75-select"
                value={blind75Only.toString()}
                label="Problem Set"
                onChange={handleBlind75FilterChange}
              >
                <MenuItem value="true">Blind 75 Only</MenuItem>
                <MenuItem value="false">All Problems</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      
      {/* Updated Problems Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table aria-label="practice problems table">
          <TableHead sx={{ 
            bgcolor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.main,
          }}>
            <TableRow>
              <TableCell sx={{ 
                fontWeight: 'bold', 
                color: 'white',
                fontSize: '1rem'
              }}>Problem</TableCell>
              <TableCell align="center" sx={{ 
                fontWeight: 'bold', 
                color: 'white',
                fontSize: '1rem'
              }}>Difficulty</TableCell>
              <TableCell align="center" sx={{ 
                fontWeight: 'bold', 
                color: 'white',
                fontSize: '1rem'
              }}>Category</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProblems.map((problem) => (
              <TableRow 
                key={problem.id}
                hover
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: theme.palette.action.hover },
                  opacity: problem.implemented ? 1 : 0.7
                }}
                onClick={() => handleProblemClick(problem)}
              >
                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {problem.title}
                    {problem.isBlind75 && (
                      <Chip 
                        label="Blind 75" 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                    {!problem.implemented && (
                      <Chip 
                        label="Coming Soon" 
                        size="small" 
                        color="default" 
                        variant="outlined"
                        sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={problem.difficulty} 
                    size="small"
                    sx={{ 
                      bgcolor: getDifficultyColor(problem.difficulty),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
                <TableCell align="center">{problem.category}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {filteredProblems.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No problems found matching your criteria
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search or filters
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Problems; 
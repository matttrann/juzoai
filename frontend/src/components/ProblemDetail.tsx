import React, { useState, useEffect, Suspense } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  Divider,
  CircularProgress,
  useTheme,
  Alert,
  Snackbar,
  Grid,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';
import CodeIcon from '@mui/icons-material/Code';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}

interface ProblemData {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: TestCase[];
  constraints: string[];
  starterCode: string;
  solution: string;
  hints: string[];
}

// Mock API call - In real app, this would call an actual backend
const fetchProblem = async (problemId: string): Promise<ProblemData> => {
  // This simulates a network request
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return the problem based on ID
  const problems: Record<string, ProblemData> = {
    'two-sum': {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      category: 'Arrays',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0,1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
        },
        {
          input: 'nums = [3,2,4], target = 6',
          output: '[1,2]'
        },
        {
          input: 'nums = [3,3], target = 6',
          output: '[0,1]'
        }
      ],
      constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9',
        'Only one valid answer exists.'
      ],
      starterCode: `def twoSum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Your code here
    `,
      solution: `def twoSum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    hash_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hash_map:
            return [hash_map[complement], i]
        hash_map[num] = i
    return []`,
      hints: [
        'A brute force approach would be to check every possible pair of numbers in the array.',
        'To optimize, consider using a hash table. What would you store in it?',
        'While iterating through the array, check if the complement (target - current number) exists in your hash table.'
      ]
    },
    'contains-duplicate': {
      id: 2,
      title: 'Contains Duplicate',
      difficulty: 'Easy',
      category: 'Arrays',
      description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
      examples: [
        {
          input: 'nums = [1,2,3,1]',
          output: 'true'
        },
        {
          input: 'nums = [1,2,3,4]',
          output: 'false'
        },
        {
          input: 'nums = [1,1,1,3,3,4,3,2,4,2]',
          output: 'true'
        }
      ],
      constraints: [
        '1 <= nums.length <= 10^5',
        '-10^9 <= nums[i] <= 10^9'
      ],
      starterCode: `def containsDuplicate(nums):
    """
    :type nums: List[int]
    :rtype: bool
    """
    # Your code here
    `,
      solution: `def containsDuplicate(nums):
    """
    :type nums: List[int]
    :rtype: bool
    """
    return len(nums) != len(set(nums))`,
      hints: [
        'Consider using a data structure that can help check for duplicates efficiently.',
        'Sets in Python only contain unique elements. How could you use this property?',
        'Compare the length of the original array with the length of a set containing the same elements.'
      ]
    }
  };
  
  if (problemId in problems) {
    return problems[problemId];
  }
  
  // For unimplemented problems, throw a more specific error
  throw new Error(`This problem (${problemId}) is not yet implemented. Please try the 'two-sum' or 'contains-duplicate' problems which are fully functional.`);
};

// Mock submission evaluator
const evaluateSubmission = async (code: string, problemId: string): Promise<{success: boolean; results: any[]; error?: string}> => {
  // Simulates a network request to a code execution API
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, this would send the code to a backend API for evaluation
  // Here we just do a basic check against expected outcomes
  
  if (problemId === 'two-sum') {
    if (code.includes('hash_map') || code.includes('dict(') || code.includes('{}')) {
      return {
        success: true,
        results: [
          {testCase: '[2,7,11,15], 9', expected: '[0,1]', actual: '[0,1]', passed: true},
          {testCase: '[3,2,4], 6', expected: '[1,2]', actual: '[1,2]', passed: true},
          {testCase: '[3,3], 6', expected: '[0,1]', actual: '[0,1]', passed: true}
        ]
      };
    } else {
      return {
        success: false,
        results: [
          {testCase: '[2,7,11,15], 9', expected: '[0,1]', actual: '[0,1]', passed: true},
          {testCase: '[3,2,4], 6', expected: '[1,2]', actual: '[1,2]', passed: true},
          {testCase: '[3,3], 6', expected: '[0,1]', actual: 'TypeError: function took too long', passed: false}
        ],
        error: 'Your solution works for small inputs but might be inefficient for larger arrays. Consider using a hash map for O(n) time complexity.'
      };
    }
  } else if (problemId === 'contains-duplicate') {
    if (code.includes('set(') || code.includes('{}')) {
      return {
        success: true,
        results: [
          {testCase: '[1,2,3,1]', expected: 'true', actual: 'true', passed: true},
          {testCase: '[1,2,3,4]', expected: 'false', actual: 'false', passed: true},
          {testCase: '[1,1,1,3,3,4,3,2,4,2]', expected: 'true', actual: 'true', passed: true}
        ]
      };
    } else {
      return {
        success: false,
        results: [
          {testCase: '[1,2,3,1]', expected: 'true', actual: 'true', passed: true},
          {testCase: '[1,2,3,4]', expected: 'false', actual: 'false', passed: true},
          {testCase: '[1,1,1,3,3,4,3,2,4,2]', expected: 'true', actual: 'Runtime Error: Maximum recursion depth exceeded', passed: false}
        ],
        error: 'Your solution works for small inputs but might be inefficient for larger arrays. Consider using a set for O(n) time complexity.'
      };
    }
  }
  
  return {
    success: false,
    results: [],
    error: 'Failed to evaluate submission'
  };
};

// Declare the CodeEditor component type
let CodeEditor: any = null;

const ProblemDetail: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [problem, setProblem] = useState<ProblemData | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [submissionResults, setSubmissionResults] = useState<any | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });
  const [editorLoaded, setEditorLoaded] = useState(false);
  
  // Load the code editor component
  useEffect(() => {
    const loadEditor = async () => {
      try {
        // Dynamic import
        const editor = await import('@uiw/react-textarea-code-editor');
        CodeEditor = editor.default;
        setEditorLoaded(true);
      } catch (error) {
        console.error('Failed to load code editor:', error);
      }
    };
    
    loadEditor();
  }, []);
  
  useEffect(() => {
    const loadProblem = async () => {
      try {
        if (!problemId) {
          setError('Problem ID is required');
          setLoading(false);
          return;
        }
        
        const problemData = await fetchProblem(problemId);
        setProblem(problemData);
        setCode(problemData.starterCode);
        setLoading(false);
      } catch (err) {
        console.error('Error loading problem:', err);
        setError('Failed to load problem details');
        setLoading(false);
      }
    };
    
    loadProblem();
  }, [problemId]);
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };
  
  const handleSubmit = async () => {
    if (!problemId) return;
    
    setSubmitting(true);
    setSubmissionResults(null);
    
    try {
      const results = await evaluateSubmission(code, problemId);
      setSubmissionResults(results);
      
      setSnackbar({
        open: true,
        message: results.success 
          ? 'All test cases passed! Great job!' 
          : 'Some test cases failed. Check the results below.',
        severity: results.success ? 'success' : 'error'
      });
    } catch (err) {
      console.error('Error submitting solution:', err);
      setSnackbar({
        open: true,
        message: 'Failed to evaluate solution',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  const handleResetCode = () => {
    if (problem) {
      setCode(problem.starterCode);
      setSnackbar({
        open: true,
        message: 'Code reset to starter template',
        severity: 'info'
      });
    }
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (error || !problem) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" color="error" gutterBottom>
            {error || 'Problem not found'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Please try one of our implemented problems instead.
          </Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/problems')}
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            Back to Problems
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/problems')}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        Back to Problems
      </Button>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {problem.title}
        </Typography>
        <Chip 
          label={problem.difficulty} 
          size="medium"
          sx={{ 
            ml: 2,
            bgcolor: problem.difficulty === 'Easy' 
              ? '#00b8a3' 
              : problem.difficulty === 'Medium' 
                ? '#ffc01e' 
                : '#ff375f',
            color: 'white',
            fontWeight: 'bold'
          }}
        />
        <Chip 
          label={problem.category}
          variant="outlined"
          size="small"
          sx={{ ml: 1 }}
        />
      </Box>
      
      <Grid component="div" container spacing={2}>
        <Grid component="div" sx={{ gridColumn: {xs: 'span 12', md: 'span 6'} }}>
          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Problem Description
            </Typography>
            <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
              {problem.description}
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              Examples:
            </Typography>
            {problem.examples.map((example, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, bgcolor: theme.palette.action.hover, borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
                  <strong>Input:</strong> {example.input}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: example.explanation ? 1 : 0 }}>
                  <strong>Output:</strong> {example.output}
                </Typography>
                {example.explanation && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                    <strong>Explanation:</strong> {example.explanation}
                  </Typography>
                )}
              </Box>
            ))}
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Constraints:
            </Typography>
            <ul style={{ paddingLeft: '20px', marginTop: 0 }}>
              {problem.constraints.map((constraint, index) => (
                <li key={index}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {constraint}
                  </Typography>
                </li>
              ))}
            </ul>
            
            {problem.hints.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Button 
                  variant="text" 
                  color="primary"
                  startIcon={<InfoIcon />}
                  onClick={() => setShowHints(!showHints)}
                >
                  {showHints ? 'Hide Hints' : 'Show Hints'}
                </Button>
                
                {showHints && (
                  <Box sx={{ mt: 1, p: 2, bgcolor: theme.palette.background.default, borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Hints:
                    </Typography>
                    <ol style={{ paddingLeft: '20px', marginTop: 0 }}>
                      {problem.hints.map((hint, index) => (
                        <li key={index}>
                          <Typography variant="body2">
                            {hint}
                          </Typography>
                        </li>
                      ))}
                    </ol>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
          
          {submissionResults && (
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Test Results:
              </Typography>
              
              {submissionResults.results.map((result: any, index: number) => (
                <Box 
                  key={index} 
                  sx={{ 
                    mb: 2, 
                    p: 2, 
                    bgcolor: result.passed ? 'rgba(76, 175, 80, 0.08)' : 'rgba(244, 67, 54, 0.08)', 
                    borderRadius: 1,
                    border: `1px solid ${result.passed ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {result.passed ? (
                      <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                    ) : (
                      <ErrorIcon color="error" fontSize="small" sx={{ mr: 1 }} />
                    )}
                    <Typography variant="subtitle2">
                      Test Case {index + 1}: {result.passed ? 'Passed' : 'Failed'}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 1 }}>
                    <strong>Input:</strong> {result.testCase}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    <strong>Expected:</strong> {result.expected}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    <strong>Actual:</strong> {result.actual}
                  </Typography>
                </Box>
              ))}
              
              {submissionResults.error && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  {submissionResults.error}
                </Alert>
              )}
            </Paper>
          )}
        </Grid>
        
        <Grid component="div" sx={{ gridColumn: {xs: 'span 12', md: 'span 6'} }}>
          <Paper elevation={1} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6">
                <CodeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Python Solution
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Write your solution in Python 3
              </Typography>
            </Box>
            
            <Box sx={{ flexGrow: 1, p: 0, position: 'relative' }}>
              {editorLoaded && CodeEditor ? (
                <CodeEditor
                  value={code}
                  language="python"
                  placeholder="Write your Python solution here..."
                  onChange={handleCodeChange}
                  padding={15}
                  style={{
                    fontSize: 14,
                    fontFamily: 'monospace',
                    minHeight: '400px',
                    height: '100%',
                    backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                  }}
                  data-testid="code-editor"
                />
              ) : (
                <textarea
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="Write your Python solution here..."
                  style={{
                    width: '100%',
                    minHeight: '400px',
                    height: '100%',
                    fontSize: 14,
                    fontFamily: 'monospace',
                    backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    color: theme.palette.text.primary,
                    padding: '15px',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              )}
            </Box>
            
            <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={handleResetCode}
                disabled={submitting}
              >
                Reset Code
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Running...' : 'Submit Solution'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProblemDetail; 
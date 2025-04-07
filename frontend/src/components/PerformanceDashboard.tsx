import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Chip,
  useTheme,
  useMediaQuery,
  Tooltip,
  Divider,
  LinearProgress,
  Grid,
  Button,
  Snackbar
} from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import performanceService, { PerformanceEntry, PerformanceStats } from '../services/performanceService';
import deckService from '../services/deckService';
import { useProblemProgress } from '../contexts/ProblemProgressContext';
import { styled } from '@mui/material/styles';

// Helper function to format date
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  } catch (error) {
    return 'Invalid date';
  }
};

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
      id={`performance-tabpanel-${index}`}
      aria-labelledby={`performance-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `performance-tab-${index}`,
    'aria-controls': `performance-tabpanel-${index}`,
  };
};

// Mock study session data for visualization
interface StudySession {
  id: number;
  date: string;
  deckId: number;
  deckTitle: string;
  score: number;
  duration: number; // in minutes
  cardsStudied: number;
  cardsCorrect: number;
}

const generateMockSessions = (deckId?: number): StudySession[] => {
  // Return an empty array instead of mock data
  return [];
};

// Create styled components to replace Grid
const GridContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  margin: theme.spacing(-1.5),
  width: 'calc(100% + 24px)',
}));

const GridItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  flexGrow: 0,
  maxWidth: '100%',
  flexBasis: '100%',
  [theme.breakpoints.up('md')]: {
    flexBasis: '50%',
    maxWidth: '50%',
  },
}));

const GridItemFull = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  flexGrow: 0,
  maxWidth: '100%',
  flexBasis: '100%',
}));

const GridItemThird = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5),
  flexGrow: 0,
  maxWidth: '33.33%',
  flexBasis: '33.33%',
}));

const PerformanceDashboard: React.FC = () => {
  // Access parameters from the URL - handles both /performance/:deckId and /performance/deck/:deckId
  const params = useParams<{ deckId?: string }>();
  // Get deckId from params
  const deckId = params.deckId;
  
  // Log the current route for debugging
  useEffect(() => {
    console.log('Performance Dashboard - Current URL:', window.location.pathname);
    console.log('Route parameters:', params);
    console.log('Using deckId:', deckId);
  }, [params, deckId]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deckTitle, setDeckTitle] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'info' | 'warning'
  });

  // Get problem progress data
  const { 
    level, 
    rank, 
    xp, 
    totalSolved, 
    easySolved, 
    mediumSolved, 
    hardSolved,
    getCurrentLevelProgress,
    resetProgress
  } = useProblemProgress();

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        console.log('Performance Dashboard - Fetching data:');
        console.log('- URL:', window.location.pathname);
        console.log('- Params:', params);
        console.log('- DeckId parameter:', deckId);
        
        setLoading(true);
        setError('');
        
        if (deckId) {
          console.log('Fetching data for specific deck ID:', deckId);
          const deckIdNum = parseInt(deckId, 10);
          
          if (isNaN(deckIdNum)) {
            console.error('Invalid deck ID, not a number:', deckId);
            setError('Invalid deck ID provided');
            setLoading(false);
            return;
          }
          
          try {
            // Try to get deck info for the title
            const deckResponse = await deckService.getById(deckIdNum);
            setDeckTitle(deckResponse.data.title);
          } catch (error) {
            console.error('Error fetching deck info:', error);
            setDeckTitle(`Deck #${deckId}`);
          }
          
          // Use localStorage data instead of API calls
          try {
            console.log('Using localStorage data for performance entries');
            // Get entries from localStorage
            const entries = performanceService.getMockPerformance(deckIdNum);
            
            // Transform data to match component expectations
            const transformedSessions = entries.map((entry, index) => ({
              id: entry.id || index,
              date: entry.timestamp || new Date().toISOString(),
              deckId: entry.deckId,
              deckTitle: entry.deckTitle || deckTitle,
              score: entry.score,
              duration: entry.study_duration || 0,
              cardsStudied: entry.cards_studied || 0,
              cardsCorrect: entry.cards_correct || 0
            }));
            
            setSessions(transformedSessions);
            
            // Get stats from localStorage
            const stats = performanceService.getMockStats(deckIdNum);
            setStats(stats);
          } catch (error) {
            console.error('Error getting localStorage performance data:', error);
            setError('Failed to load performance data. Please try again later.');
          }
        } else {
          // Global performance data
          try {
            console.log('Using localStorage data for global performance');
            // Get all entries from localStorage
            const entries = performanceService.getMockPerformance();
            
            // Transform data
            const transformedSessions = entries.map((entry, index) => ({
              id: entry.id || index,
              date: entry.timestamp || new Date().toISOString(),
              deckId: entry.deckId,
              deckTitle: entry.deckTitle || 'Unknown Deck',
              score: entry.score,
              duration: entry.study_duration || 0,
              cardsStudied: entry.cards_studied || 0,
              cardsCorrect: entry.cards_correct || 0
            }));
            
            setSessions(transformedSessions);
            
            // Get global stats
            const stats = performanceService.getMockStats();
            setStats(stats);
            
            setDeckTitle('All Decks');
          } catch (error) {
            console.error('Error getting global performance data:', error);
            setError('Failed to load performance data. Please try again later.');
          }
        }
        
        setLoading(false);
        
        // Show snackbar message about local storage on first load
        setSnackbar({
          open: true,
          message: 'Your progress is saved in your browser local storage',
          severity: 'info'
        });
      } catch (error) {
        console.error('Error fetching performance data:', error);
        setError('Failed to load performance data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPerformanceData();
  }, [deckId, deckTitle]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ pt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2 }}>Loading performance data...</Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // Calculate progress metrics
  const totalSessions = sessions.length;
  const totalCards = sessions.reduce((sum, session) => sum + session.cardsStudied, 0);
  const averageScore = sessions.length > 0 
    ? sessions.reduce((sum, session) => sum + session.score, 0) / sessions.length 
    : 0;
  const latestScore = sessions.length > 0 
    ? sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].score 
    : 0;
  const improvement = sessions.length >= 2 
    ? latestScore - sessions[0].score 
    : 0;

  // Show a helpful message if there's no data yet
  if (sessions.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Alert severity="info" sx={{ maxWidth: '600px', mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              No performance data available yet
            </Typography>
            <Typography variant="body1">
              Complete a study session to see your performance statistics here.
            </Typography>
          </Alert>
          
          <Typography sx={{ mt: 4 }}>
            Your progress will be automatically saved when you complete flashcard study sessions.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 2, sm: 4 } }}>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        component="h1"
        align="center"
        gutterBottom
        sx={{ 
          fontWeight: 'bold',
          pb: 2
        }}
      >
        {deckId ? `${deckTitle} Performance` : 'Your Learning Performance'}
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Card 
          elevation={3}
          sx={{
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(145deg, #2D3748 30%, #1A202C 90%)'
              : 'linear-gradient(145deg, #f5f7fa 30%, #e4e7eb 90%)',
            borderRadius: 2
          }}
        >
          <CardContent>
            {stats ? (
              <Box 
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  gap: 3
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    <SchoolIcon sx={{ mr: 0.5, verticalAlign: 'text-bottom' }}/>
                    Study Sessions
                  </Typography>
                  <Typography variant="h4">
                    {totalSessions}
                  </Typography>
                </Box>
                
                <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    <EqualizerIcon sx={{ mr: 0.5, verticalAlign: 'text-bottom' }}/>
                    Average Score
                  </Typography>
                  <Typography variant="h4">
                    {averageScore.toFixed(1)}%
                  </Typography>
                </Box>
                
                <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    <TrendingUpIcon sx={{ mr: 0.5, verticalAlign: 'text-bottom' }}/>
                    Improvement
                  </Typography>
                  <Typography variant="h4" color={improvement >= 0 ? 'success.main' : 'error.main'}>
                    {improvement >= 0 ? '+' : ''}{improvement.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography>No performance data available</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
      
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="performance tabs"
            variant={isMobile ? 'scrollable' : 'fullWidth'}
            scrollButtons={isMobile ? 'auto' : false}
          >
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label="Flashcard Stats" {...a11yProps(1)} />
            <Tab label="Coding Stats" {...a11yProps(2)} />
            <Tab label="History" {...a11yProps(3)} />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          {sessions.length > 0 ? (
            <TableContainer component={Paper} elevation={2}>
              <Table aria-label="study history table">
                <TableHead sx={{ bgcolor: theme.palette.primary.main }}>
                  <TableRow>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Date</TableCell>
                    {!deckId && (
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Deck</TableCell>
                    )}
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Score</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Cards</TableCell>
                    {!isMobile && (
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Time Spent</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow 
                      key={session.id} 
                      sx={{ 
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover
                        }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DateRangeIcon sx={{ mr: 1, fontSize: '1rem', color: theme.palette.text.secondary }} />
                          <Typography variant="body2">{formatDate(session.date)}</Typography>
                        </Box>
                      </TableCell>
                      
                      {!deckId && (
                        <TableCell>
                          <Chip 
                            label={session.deckTitle} 
                            size="small" 
                            sx={{ 
                              maxWidth: '150px', 
                              fontWeight: 'medium',
                              bgcolor: theme.palette.primary.light,
                              color: theme.palette.primary.contrastText
                            }} 
                          />
                        </TableCell>
                      )}
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography fontWeight="bold">{session.score}%</Typography>
                          <Box sx={{ ml: 1, width: '50px', display: 'flex', alignItems: 'center' }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={session.score} 
                              sx={{ 
                                width: '100%',
                                height: 8,
                                borderRadius: 5,
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                              }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Typography>
                          {session.cardsCorrect}/{session.cardsStudied}
                        </Typography>
                      </TableCell>
                      
                      {!isMobile && (
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TimerIcon sx={{ mr: 1, fontSize: '1rem', color: theme.palette.text.secondary }} />
                            <Typography variant="body2">{session.duration} min</Typography>
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Alert severity="info" sx={{ maxWidth: '600px', mx: 'auto' }}>
                <Typography variant="body1">
                  You haven't completed any study sessions yet.
                </Typography>
              </Alert>
              
              <Typography sx={{ mt: 4 }}>
                Study some flashcards to start tracking your performance!
              </Typography>
            </Box>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {sessions.length > 0 ? (
            <Box>
              <GridContainer>
                <GridItem>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <CalendarViewMonthIcon sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                        Study Activity
                      </Typography>
                      
                      <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="body2">
                          Total cards studied: <strong>{totalCards}</strong>
                        </Typography>
                        <Typography variant="body2">
                          Average cards per session: <strong>{(totalCards / totalSessions).toFixed(1)}</strong>
                        </Typography>
                        <Typography variant="body2">
                          Total study time: <strong>{sessions.reduce((sum, s) => sum + s.duration, 0)} min</strong>
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </GridItem>
                
                <GridItem>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <EmojiEventsIcon sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                        Progress
                      </Typography>
                      
                      <Box sx={{ pt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          First session score: <strong>{sessions[0].score}%</strong>
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Latest session score: <strong>{latestScore}%</strong>
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Improvement rate: 
                          <strong style={{ color: improvement >= 0 ? '#4caf50' : '#f44336' }}>
                            {improvement >= 0 ? ' +' : ' '}{improvement}%
                          </strong>
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </GridItem>
                
                <GridItemFull sx={{ mt: 3 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <SchoolIcon sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                        Card Accuracy
                      </Typography>
                      
                      <Box sx={{ pt: 2 }}>
                        {/* Calculate the total correct cards across all sessions */}
                        {(() => {
                          const totalCorrect = sessions.reduce((sum, session) => sum + session.cardsCorrect, 0);
                          const accuracy = totalCards > 0 ? (totalCorrect / totalCards) * 100 : 0;
                          
                          return (
                            <>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Total cards correct:</Typography>
                                <Typography variant="body2"><strong>{totalCorrect}</strong> out of <strong>{totalCards}</strong></Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Overall accuracy:</Typography>
                                <Typography variant="body2" fontWeight="bold">{accuracy.toFixed(1)}%</Typography>
                              </Box>
                              
                              <Box sx={{ mt: 2, mb: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={accuracy}
                                  sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                                  }}
                                />
                              </Box>
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Your accuracy has {
                                    sessions.length >= 2 ? 
                                      (accuracy > sessions[0].score ? "improved" : "decreased") 
                                      : "been recorded"
                                  } since your first session.
                                </Typography>
                              </Box>
                            </>
                          );
                        })()}
                      </Box>
                    </CardContent>
                  </Card>
                </GridItemFull>
              </GridContainer>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Alert severity="info" sx={{ maxWidth: '600px', mx: 'auto' }}>
                <Typography variant="body1">
                  Complete some study sessions to see your analytics.
                </Typography>
              </Alert>
              
              <Typography sx={{ mt: 4 }}>
                Your personal statistics and progress will appear here once you've completed studying some decks.
              </Typography>
            </Box>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <GridContainer>
            {/* Rank and Level Card */}
            <GridItem>
              <Card 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                  color: 'white'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StarIcon fontSize="large" sx={{ mr: 2 }} />
                  <Typography variant="h5" fontWeight="bold">
                    Rank: {rank}
                  </Typography>
                </Box>
                
                <Typography variant="body1" gutterBottom>
                  Level {level} Coder
                </Typography>
                
                <Box sx={{ mt: 3, mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    Level Progress
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {Math.round(getCurrentLevelProgress())}%
                  </Typography>
                </Box>
                
                <LinearProgress 
                  variant="determinate" 
                  value={getCurrentLevelProgress()} 
                  sx={{ 
                    height: 10,
                    borderRadius: 5,
                    mb: 2,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'rgba(255,255,255,0.9)'
                    }
                  }}
                />
                
                <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
                  XP: {xp} points
                </Typography>
              </Card>
            </GridItem>
            
            {/* Problems Solved Card */}
            <GridItem>
              <Card elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Problems Solved
                </Typography>
                
                <Typography variant="h3" color="primary" fontWeight="bold" sx={{ my: 2 }}>
                  {totalSolved}
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', mx: -0.5 }}>
                    <GridItemThird>
                      <Card 
                        elevation={0} 
                        sx={{ 
                          p: 1.5, 
                          borderRadius: 2, 
                          bgcolor: '#90caf9',
                          color: 'white',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="h6" fontWeight="bold">
                          {easySolved}
                        </Typography>
                        <Typography variant="caption">
                          Easy
                        </Typography>
                      </Card>
                    </GridItemThird>
                    <GridItemThird>
                      <Card 
                        elevation={0} 
                        sx={{ 
                          p: 1.5, 
                          borderRadius: 2, 
                          bgcolor: '#ffb74d',
                          color: 'white',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="h6" fontWeight="bold">
                          {mediumSolved}
                        </Typography>
                        <Typography variant="caption">
                          Medium
                        </Typography>
                      </Card>
                    </GridItemThird>
                    <GridItemThird>
                      <Card 
                        elevation={0} 
                        sx={{ 
                          p: 1.5, 
                          borderRadius: 2, 
                          bgcolor: '#f48fb1',
                          color: 'white',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="h6" fontWeight="bold">
                          {hardSolved}
                        </Typography>
                        <Typography variant="caption">
                          Hard
                        </Typography>
                      </Card>
                    </GridItemThird>
                  </Box>
                </Box>
              </Card>
            </GridItem>
            
            {/* XP Breakdown Card */}
            <GridItemFull>
              <Card elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  XP Breakdown
                </Typography>
                
                <TableContainer component={Paper} elevation={0} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Difficulty</TableCell>
                        <TableCell align="center">Solved</TableCell>
                        <TableCell align="center">XP per Problem</TableCell>
                        <TableCell align="right">Total XP</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Chip 
                            label="Easy" 
                            size="small" 
                            sx={{ bgcolor: '#90caf9', color: 'white' }} 
                          />
                        </TableCell>
                        <TableCell align="center">{easySolved}</TableCell>
                        <TableCell align="center">10</TableCell>
                        <TableCell align="right">{easySolved * 10}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Chip 
                            label="Medium" 
                            size="small" 
                            sx={{ bgcolor: '#ffb74d', color: 'white' }} 
                          />
                        </TableCell>
                        <TableCell align="center">{mediumSolved}</TableCell>
                        <TableCell align="center">20</TableCell>
                        <TableCell align="right">{mediumSolved * 20}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Chip 
                            label="Hard" 
                            size="small" 
                            sx={{ bgcolor: '#f48fb1', color: 'white' }} 
                          />
                        </TableCell>
                        <TableCell align="center">{hardSolved}</TableCell>
                        <TableCell align="center">40</TableCell>
                        <TableCell align="right">{hardSolved * 40}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3}>
                          <Typography variant="subtitle2">Total XP</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1" fontWeight="bold">
                            {xp}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </GridItemFull>

            {/* Reset Progress Button */}
            <GridItemFull>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
                      resetProgress();
                      // Show a notification and refresh the page
                      setSnackbar({
                        open: true,
                        message: 'All progress has been reset successfully',
                        severity: 'success'
                      });
                      setTimeout(() => window.location.reload(), 1500);
                    }
                  }}
                  startIcon={<DeleteIcon />}
                  sx={{ mt: 2 }}
                >
                  Reset All Progress
                </Button>
              </Box>
            </GridItemFull>
          </GridContainer>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          {sessions.length > 0 ? (
            <TableContainer component={Paper} elevation={2}>
              <Table aria-label="study history table">
                <TableHead sx={{ bgcolor: theme.palette.primary.main }}>
                  <TableRow>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Date</TableCell>
                    {!deckId && (
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Deck</TableCell>
                    )}
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Score</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Cards</TableCell>
                    {!isMobile && (
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Time Spent</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow 
                      key={session.id} 
                      sx={{ 
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover
                        }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DateRangeIcon sx={{ mr: 1, fontSize: '1rem', color: theme.palette.text.secondary }} />
                          <Typography variant="body2">{formatDate(session.date)}</Typography>
                        </Box>
                      </TableCell>
                      
                      {!deckId && (
                        <TableCell>
                          <Chip 
                            label={session.deckTitle} 
                            size="small" 
                            sx={{ 
                              maxWidth: '150px', 
                              fontWeight: 'medium',
                              bgcolor: theme.palette.primary.light,
                              color: theme.palette.primary.contrastText
                            }} 
                          />
                        </TableCell>
                      )}
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography fontWeight="bold">{session.score}%</Typography>
                          <Box sx={{ ml: 1, width: '50px', display: 'flex', alignItems: 'center' }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={session.score} 
                              sx={{ 
                                width: '100%',
                                height: 8,
                                borderRadius: 5,
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                              }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Typography>
                          {session.cardsCorrect}/{session.cardsStudied}
                        </Typography>
                      </TableCell>
                      
                      {!isMobile && (
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TimerIcon sx={{ mr: 1, fontSize: '1rem', color: theme.palette.text.secondary }} />
                            <Typography variant="body2">{session.duration} min</Typography>
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Alert severity="info" sx={{ maxWidth: '600px', mx: 'auto' }}>
                <Typography variant="body1">
                  You haven't completed any study sessions yet.
                </Typography>
              </Alert>
              
              <Typography sx={{ mt: 4 }}>
                Study some flashcards to start tracking your performance!
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Box>
    </Container>
  );
};

export default PerformanceDashboard; 
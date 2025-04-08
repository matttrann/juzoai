import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Paper,
  Alert,
  Fade,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DSA_QUIZZES } from '../data/dsaQuizzes';
import { QuizQuestion, QuizTopic } from '../types/quiz';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const DSAQuiz: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [currentTopic, setCurrentTopic] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([]);
  const navigate = useNavigate();

  const currentTopicQuestions = DSA_QUIZZES.find(topic => topic.name === currentTopic)?.questions || [];
  const currentQuestion = currentTopicQuestions[currentQuestionIndex];

  const handleAnswerSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(Number(event.target.value));
  };

  const handleCheckAnswer = () => {
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Update the answered questions array
    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestionIndex] = true;
    setAnsweredQuestions(newAnsweredQuestions);
    
    // Update the correct answers array
    const newCorrectAnswers = [...correctAnswers];
    newCorrectAnswers[currentQuestionIndex] = correct;
    setCorrectAnswers(newCorrectAnswers);
  };

  const handleNextQuestion = () => {
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowFeedback(false);

    if (currentQuestionIndex < currentTopicQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
      setQuizCompleted(true);
    }
  };

  const handleTopicSelect = (topic: string) => {
    setCurrentTopic(topic);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizCompleted(false);
    setShowFeedback(false);
    setAnsweredQuestions(Array(DSA_QUIZZES.find(t => t.name === topic)?.questions.length || 0).fill(false));
    setCorrectAnswers(Array(DSA_QUIZZES.find(t => t.name === topic)?.questions.length || 0).fill(false));
  };

  const progress = ((currentQuestionIndex + 1) / currentTopicQuestions.length) * 100;

  return (
    <Box sx={{ 
      maxWidth: 800, 
      mx: 'auto', 
      p: { xs: 1.5, sm: 2, md: 3 }
    }}>
      <Typography 
        variant={isMobile ? "h5" : "h4"}
        gutterBottom
      >
        DSA Quiz Practice
      </Typography>

      {!currentTopic ? (
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: { xs: 1, sm: 1.5, md: 2 },
          justifyContent: { xs: 'center', sm: 'flex-start' }
        }}>
          {DSA_QUIZZES.map((topic) => (
            <Card
              key={topic.name}
              sx={{ 
                width: { xs: '45%', sm: 180, md: 200 },
                height: { xs: 100, sm: 110, md: 120 },
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minWidth: { xs: 140, sm: 160 }
              }}
              onClick={() => handleTopicSelect(topic.name)}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography 
                  variant={isMobile ? "subtitle1" : "h6"} 
                  align="center" 
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' },
                    wordBreak: 'break-word'
                  }}
                >
                  {topic.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  align="center"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  {topic.questions.length} questions
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Topic: {currentTopic}
            </Typography>
            
            {/* Progress indicators */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                justifyContent: 'space-between', 
                mb: 1,
                gap: { xs: 0.5, sm: 0 }
              }}>
                <Typography variant="body2">
                  Question {currentQuestionIndex + 1} of {currentTopicQuestions.length}
                </Typography>
                <Typography variant="body2">
                  Score: {score}/{currentQuestionIndex + (showFeedback && isCorrect ? 1 : 0)}
                </Typography>
              </Box>
              
              <LinearProgress variant="determinate" value={progress} sx={{ mb: 2, height: 8, borderRadius: 4 }} />
              
              {/* Hide stepper on very small screens */}
              {!isMobile && (
                <Stepper 
                  activeStep={currentQuestionIndex} 
                  alternativeLabel
                  sx={{ 
                    overflowX: 'auto',
                    '& .MuiStepConnector-root': {
                      top: { xs: 8, sm: 10 } 
                    }
                  }}
                >
                  {currentTopicQuestions.map((_, index) => (
                    <Step key={index} completed={answeredQuestions[index]}>
                      <StepLabel 
                        StepIconProps={{
                          icon: answeredQuestions[index] ? 
                            (correctAnswers[index] ? 
                              <CheckCircleOutlineIcon color="success" /> : 
                              <CancelOutlinedIcon color="error" />) : 
                            index + 1
                        }}
                      />
                    </Step>
                  ))}
                </Stepper>
              )}
            </Box>
            
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                fontWeight: 'medium',
                lineHeight: 1.4
              }}
            >
              {currentQuestion?.question}
            </Typography>

            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <RadioGroup value={selectedAnswer} onChange={handleAnswerSelect}>
                {currentQuestion?.options.map((option: string, index: number) => (
                  <FormControlLabel
                    key={index}
                    value={index}
                    control={<Radio />}
                    label={option}
                    sx={{
                      mb: { xs: 1, sm: 0.5 },
                      '& .MuiFormControlLabel-label': {
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      },
                      ...(showFeedback && {
                        color: index === currentQuestion.correctAnswer ? 'success.main' : 
                                (index === selectedAnswer ? 'error.main' : 'inherit'),
                        fontWeight: index === currentQuestion.correctAnswer ? 'bold' : 'normal'
                      })
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {/* Feedback alert */}
            {showFeedback && (
              <Fade in={showFeedback}>
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Alert 
                    severity={isCorrect ? "success" : "error"}
                    icon={isCorrect ? <CheckCircleOutlineIcon /> : <CancelOutlinedIcon />}
                  >
                    {isCorrect 
                      ? "Correct! Well done!" 
                      : `Incorrect. The correct answer is: ${currentQuestion.options[currentQuestion.correctAnswer]}`}
                  </Alert>
                </Box>
              </Fade>
            )}

            <Box sx={{ 
              mt: 2,
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 }
            }}>
              {!showFeedback ? (
                <Button
                  variant="contained"
                  onClick={handleCheckAnswer}
                  disabled={selectedAnswer === null}
                  color="primary"
                  fullWidth={isMobile}
                  sx={{ mr: { sm: 1 } }}
                >
                  Check Answer
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNextQuestion}
                  color="primary"
                  fullWidth={isMobile}
                >
                  {currentQuestionIndex < currentTopicQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </Button>
              )}
              
              <Button
                variant="outlined"
                onClick={() => setCurrentTopic("")}
                fullWidth={isMobile}
                sx={{ ml: { sm: 1 }, mt: { xs: 1, sm: 0 } }}
              >
                Choose Different Topic
              </Button>
            </Box>
          </Paper>

          {showResult && (
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom>
                Quiz Results
              </Typography>
              <Typography variant="body1">
                Your score: {score} out of {currentTopicQuestions.length}
              </Typography>
              <Typography variant="body1">
                Percentage: {((score / currentTopicQuestions.length) * 100).toFixed(1)}%
              </Typography>
              
              {!isMobile && (
                <Box sx={{ mt: 4 }}>
                  <Stepper activeStep={-1} alternativeLabel>
                    {currentTopicQuestions.map((question, index) => (
                      <Step key={index} completed={answeredQuestions[index]}>
                        <StepLabel 
                          StepIconProps={{
                            icon: correctAnswers[index] ? 
                              <CheckCircleOutlineIcon color="success" /> : 
                              <CancelOutlinedIcon color="error" />
                          }}
                        >
                          Question {index + 1}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              )}
              
              <Box sx={{ 
                mt: 3,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 2 }
              }}>
                <Button
                  variant="contained"
                  onClick={() => handleTopicSelect(currentTopic)}
                  fullWidth={isMobile}
                >
                  Try Again
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setCurrentTopic("")}
                  fullWidth={isMobile}
                  sx={{ mt: { xs: 0, sm: 0 } }}
                >
                  Choose Different Topic
                </Button>
              </Box>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default DSAQuiz; 
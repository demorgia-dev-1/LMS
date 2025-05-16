import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Stepper,
  Step,
  StepButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';

const QuizAttempt = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/student/quizzes/${quizId}`);
        setQuiz(response.data);
        // Initialize answers object
        const initialAnswers = {};
        response.data.questions.forEach((_, index) => {
          initialAnswers[index] = '';
        });
        setAnswers(initialAnswers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Failed to load quiz. Please try again later.');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAnswerChange = (event) => {
    setAnswers({
      ...answers,
      [currentQuestion]: event.target.value
    });
  };

  const handleQuestionChange = (index) => {
    setCurrentQuestion(index);
  };

  const handleNext = () => {
    setCurrentQuestion(prev => Math.min(prev + 1, quiz.questions.length - 1));
  };

  const handlePrevious = () => {
    setCurrentQuestion(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([questionIndex, answer]) => ({
        questionId: quiz.questions[questionIndex]._id,
        answer
      }));

      await axios.post(`/api/student/quizzes/${quizId}/submit`, {
        answers: formattedAnswers
      });

      navigate(`/student/quizzes/${quizId}/results`);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
      setConfirmSubmit(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading quiz...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!quiz) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">Quiz not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {quiz.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Course: {quiz.course.title}
        </Typography>

        <Box sx={{ mt: 4, mb: 4 }}>
          <Stepper nonLinear activeStep={currentQuestion}>
            {quiz.questions.map((_, index) => (
              <Step key={index} completed={answers[index] !== ''}>
                <StepButton onClick={() => handleQuestionChange(index)}>
                  Q{index + 1}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ mt: 4 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </FormLabel>
            <Typography variant="h6" sx={{ mt: 2, mb: 3 }}>
              {quiz.questions[currentQuestion].text}
            </Typography>
            <RadioGroup
              value={answers[currentQuestion] || ''}
              onChange={handleAnswerChange}
            >
              {quiz.questions[currentQuestion].options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Box>
            {currentQuestion === quiz.questions.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setConfirmSubmit(true)}
                disabled={Object.values(answers).some(answer => !answer)}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={confirmSubmit}
        onClose={() => setConfirmSubmit(false)}
      >
        <DialogTitle>Submit Quiz</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit your quiz? You won't be able to change your answers after submission.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmSubmit(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Confirm Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuizAttempt;
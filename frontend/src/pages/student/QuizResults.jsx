import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Chip
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

const QuizResults = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`/api/student/quizzes/${quizId}/results`);
        setResults(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching quiz results:', err);
        setError('Failed to load quiz results. Please try again later.');
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading quiz results...
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

  if (!results) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">Results not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quiz Results: {results.quiz.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Course: {results.quiz.course.title}
        </Typography>

        <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
          <Typography variant="h2" color="primary" gutterBottom>
            {results.score}%
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {results.correctAnswers} out of {results.totalQuestions} questions correct
          </Typography>
          <Chip
            label={results.passed ? 'Passed' : 'Failed'}
            color={results.passed ? 'success' : 'error'}
            sx={{ mt: 2 }}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          Question Review
        </Typography>

        <List>
          {results.questions.map((question, index) => (
            <Box key={index}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1">
                        Question {index + 1}:
                      </Typography>
                      {question.correct ? (
                        <CheckIcon color="success" sx={{ ml: 1 }} />
                      ) : (
                        <CloseIcon color="error" sx={{ ml: 1 }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body1" gutterBottom>
                        {question.text}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={question.correct ? 'success.main' : 'error.main'}
                      >
                        Your Answer: {question.userAnswer}
                      </Typography>
                      {!question.correct && (
                        <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                          Correct Answer: {question.correctAnswer}
                        </Typography>
                      )}
                      {question.feedback && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1, fontStyle: 'italic' }}
                        >
                          Feedback: {question.feedback}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
              {index < results.questions.length - 1 && <Divider />}
            </Box>
          ))}
        </List>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            component={Link}
            to="/student/quizzes"
            variant="outlined"
          >
            Back to Quizzes
          </Button>
          <Button
            component={Link}
            to={`/courses/${results.quiz.course._id}`}
            variant="contained"
          >
            Continue Course
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default QuizResults;
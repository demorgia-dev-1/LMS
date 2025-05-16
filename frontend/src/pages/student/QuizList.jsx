import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizService } from '../../services';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { Assessment as AssessmentIcon } from '@mui/icons-material';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await quizService.getStudentQuizzes();
        setQuizzes(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError('Failed to load quizzes. Please try again later.');
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading quizzes...
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <AssessmentIcon sx={{ mr: 2 }} />
        <Typography variant="h4" component="h1">
          My Quizzes
        </Typography>
      </Box>

      {quizzes.length === 0 ? (
        <Alert severity="info">
          No quizzes available at the moment. Please check back later.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {quizzes.map((quiz) => (
            <Grid item key={quiz._id} xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {quiz.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Course: {quiz.course.title}
                  </Typography>
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Chip
                      label={quiz.status}
                      color={
                        quiz.status === 'completed' ? 'success' :
                        quiz.status === 'in_progress' ? 'warning' : 'primary'
                      }
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {quiz.dueDate && (
                      <Chip
                        label={`Due: ${new Date(quiz.dueDate).toLocaleDateString()}`}
                        color="default"
                        size="small"
                      />
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">
                      Questions: {quiz.totalQuestions}
                    </Typography>
                    <Button
                      variant="contained"
                      component={Link}
                      to={`/student/quizzes/${quiz._id}`}
                      size="small"
                    >
                      {quiz.status === 'completed' ? 'View Results' : 'Take Quiz'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default QuizList;
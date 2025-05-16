import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const QuizManagement = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    text: '',
    options: ['', '', '', ''],
    correctOption: '0'
  });

  useEffect(() => {
    fetchQuizDetails();
  }, [quizId]);

  const fetchQuizDetails = async () => {
    try {
      const response = await axios.get(`/api/instructor/quizzes/${quizId}`);
      setQuiz(response.data.data.quiz);
      setQuestions(response.data.data.questions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quiz details:', error);
      setError('Failed to load quiz details. Please try again later.');
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setQuestionForm({
      text: '',
      options: ['', '', '', ''],
      correctOption: '0'
    });
  };

  const handleQuestionTextChange = (e) => {
    setQuestionForm(prev => ({
      ...prev,
      text: e.target.value
    }));
  };

  const handleOptionChange = (index, value) => {
    setQuestionForm(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const handleCorrectOptionChange = (e) => {
    setQuestionForm(prev => ({
      ...prev,
      correctOption: e.target.value
    }));
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/instructor/quizzes/${quizId}/questions`, {
        text: questionForm.text,
        options: questionForm.options,
        correctOption: parseInt(questionForm.correctOption)
      });
      setQuestions(prev => [...prev, response.data.data]);
      handleCloseDialog();
    } catch (error) {
      console.error('Error creating question:', error);
      setError('Failed to create question. Please try again.');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(`/api/instructor/questions/${questionId}`);
      setQuestions(prev => prev.filter(question => question._id !== questionId));
    } catch (error) {
      console.error('Error deleting question:', error);
      setError('Failed to delete question. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading quiz details...
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          {quiz?.title}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Question
        </Button>
      </Box>

      <Typography variant="body1" paragraph>
        {quiz?.description}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          Time Limit: {quiz?.timeLimit} minutes
        </Typography>
        <Typography variant="body2">
          Passing Score: {quiz?.passingScore}%
        </Typography>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Questions
      </Typography>

      <List>
        {questions.map((question, index) => (
          <div key={question._id}>
            <ListItem>
              <ListItemText
                primary={`${index + 1}. ${question.text}`}
                secondary={
                  <Box sx={{ mt: 1 }}>
                    {question.options.map((option, optIndex) => (
                      <Typography
                        key={optIndex}
                        variant="body2"
                        color={optIndex === question.correctOption ? 'success.main' : 'text.secondary'}
                      >
                        {String.fromCharCode(65 + optIndex)}. {option}
                      </Typography>
                    ))}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  component="a"
                  href={`/instructor/questions/${question._id}/edit`}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteQuestion(question._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>

      {/* Create Question Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Question</DialogTitle>
        <form onSubmit={handleCreateQuestion}>
          <DialogContent>
            <TextField
              label="Question Text"
              fullWidth
              required
              margin="normal"
              value={questionForm.text}
              onChange={handleQuestionTextChange}
              multiline
              rows={2}
            />

            {questionForm.options.map((option, index) => (
              <TextField
                key={index}
                label={`Option ${String.fromCharCode(65 + index)}`}
                fullWidth
                required
                margin="normal"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
            ))}

            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Correct Answer
              </Typography>
              <RadioGroup
                value={questionForm.correctOption}
                onChange={handleCorrectOptionChange}
              >
                {questionForm.options.map((_, index) => (
                  <FormControlLabel
                    key={index}
                    value={index.toString()}
                    control={<Radio />}
                    label={`Option ${String.fromCharCode(65 + index)}`}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Add Question
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default QuizManagement;
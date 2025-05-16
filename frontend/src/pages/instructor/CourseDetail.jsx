import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openLessonDialog, setOpenLessonDialog] = useState(false);
  const [openQuizDialog, setOpenQuizDialog] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    content: '',
    duration: '',
    videoUrl: ''
  });
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    timeLimit: '',
    passingScore: ''
  });

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`/api/instructor/courses/${courseId}`);
      setCourse(response.data.data.course);
      setLessons(response.data.data.lessons);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setError('Failed to load course details. Please try again later.');
      setLoading(false);
    }
  };

  const handleOpenLessonDialog = () => {
    setOpenLessonDialog(true);
  };

  const handleCloseLessonDialog = () => {
    setOpenLessonDialog(false);
    setLessonForm({
      title: '',
      description: '',
      content: '',
      duration: '',
      videoUrl: ''
    });
  };

  const handleOpenQuizDialog = () => {
    setOpenQuizDialog(true);
  };

  const handleCloseQuizDialog = () => {
    setOpenQuizDialog(false);
    setQuizForm({
      title: '',
      description: '',
      timeLimit: '',
      passingScore: ''
    });
  };

  const handleLessonInputChange = (e) => {
    const { name, value } = e.target;
    setLessonForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuizInputChange = (e) => {
    const { name, value } = e.target;
    setQuizForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/instructor/courses/${courseId}/lessons`, lessonForm);
      setLessons(prev => [...prev, response.data.data]);
      handleCloseLessonDialog();
    } catch (error) {
      console.error('Error creating lesson:', error);
      setError('Failed to create lesson. Please try again.');
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/instructor/lessons/${courseId}/quizzes`, quizForm);
      // Update lessons to include the new quiz
      fetchCourseDetails();
      handleCloseQuizDialog();
    } catch (error) {
      console.error('Error creating quiz:', error);
      setError('Failed to create quiz. Please try again.');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      await axios.delete(`/api/instructor/lessons/${lessonId}`);
      setLessons(prev => prev.filter(lesson => lesson._id !== lessonId));
    } catch (error) {
      console.error('Error deleting lesson:', error);
      setError('Failed to delete lesson. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading course details...
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
          {course?.title}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenLessonDialog}
        >
          Add Lesson
        </Button>
      </Box>

      <Typography variant="body1" paragraph>
        {course?.description}
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Lessons
      </Typography>

      <List>
        {lessons.map((lesson) => (
          <div key={lesson._id}>
            <ListItem>
              <ListItemText
                primary={lesson.title}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      Duration: {lesson.duration} minutes
                    </Typography>
                    <br />
                    {lesson.description}
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="add quiz"
                  onClick={handleOpenQuizDialog}
                  sx={{ mr: 1 }}
                >
                  <AddIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  component="a"
                  href={`/instructor/lessons/${lesson._id}/edit`}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteLesson(lesson._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>

      {/* Create Lesson Dialog */}
      <Dialog open={openLessonDialog} onClose={handleCloseLessonDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Lesson</DialogTitle>
        <form onSubmit={handleCreateLesson}>
          <DialogContent>
            <TextField
              name="title"
              label="Lesson Title"
              fullWidth
              required
              margin="normal"
              value={lessonForm.title}
              onChange={handleLessonInputChange}
            />
            <TextField
              name="description"
              label="Lesson Description"
              fullWidth
              required
              margin="normal"
              multiline
              rows={4}
              value={lessonForm.description}
              onChange={handleLessonInputChange}
            />
            <TextField
              name="content"
              label="Lesson Content"
              fullWidth
              required
              margin="normal"
              multiline
              rows={6}
              value={lessonForm.content}
              onChange={handleLessonInputChange}
            />
            <TextField
              name="duration"
              label="Duration (minutes)"
              type="number"
              fullWidth
              required
              margin="normal"
              value={lessonForm.duration}
              onChange={handleLessonInputChange}
            />
            <TextField
              name="videoUrl"
              label="Video URL"
              fullWidth
              margin="normal"
              value={lessonForm.videoUrl}
              onChange={handleLessonInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLessonDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Create Lesson
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Create Quiz Dialog */}
      <Dialog open={openQuizDialog} onClose={handleCloseQuizDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Quiz</DialogTitle>
        <form onSubmit={handleCreateQuiz}>
          <DialogContent>
            <TextField
              name="title"
              label="Quiz Title"
              fullWidth
              required
              margin="normal"
              value={quizForm.title}
              onChange={handleQuizInputChange}
            />
            <TextField
              name="description"
              label="Quiz Description"
              fullWidth
              required
              margin="normal"
              multiline
              rows={4}
              value={quizForm.description}
              onChange={handleQuizInputChange}
            />
            <TextField
              name="timeLimit"
              label="Time Limit (minutes)"
              type="number"
              fullWidth
              required
              margin="normal"
              value={quizForm.timeLimit}
              onChange={handleQuizInputChange}
            />
            <TextField
              name="passingScore"
              label="Passing Score (%)"
              type="number"
              fullWidth
              required
              margin="normal"
              value={quizForm.passingScore}
              onChange={handleQuizInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseQuizDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Create Quiz
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default CourseDetail;
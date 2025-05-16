import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services';
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
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseService.getInstructorCourses();
      setCourses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again later.');
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCourseForm({
      title: '',
      description: '',
      category: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/instructor/courses', courseForm);
      setCourses(prev => [...prev, response.data.data]);
      handleCloseDialog();
    } catch (error) {
      console.error('Error creating course:', error);
      setError('Failed to create course. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading courses...
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
          My Courses
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Create Course
        </Button>
      </Box>

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} md={6} lg={4} key={course._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {course.description}
                </Typography>
                <Box mt={2} mb={1}>
                  <Chip
                    label={course.category}
                    size="small"
                    color="primary"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={course.isPublished ? 'Published' : 'Draft'}
                    size="small"
                    color={course.isPublished ? 'success' : 'default'}
                  />
                </Box>
                <Typography variant="body2">
                  Start Date: {new Date(course.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  End Date: {new Date(course.endDate).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  component={Link}
                  to={`/instructor/courses/${course._id}`}
                  startIcon={<EditIcon />}
                >
                  Manage Course
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Course</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              name="title"
              label="Course Title"
              fullWidth
              required
              margin="normal"
              value={courseForm.title}
              onChange={handleInputChange}
            />
            <TextField
              name="description"
              label="Course Description"
              fullWidth
              required
              margin="normal"
              multiline
              rows={4}
              value={courseForm.description}
              onChange={handleInputChange}
            />
            <TextField
              name="category"
              label="Category"
              fullWidth
              required
              margin="normal"
              select
              value={courseForm.category}
              onChange={handleInputChange}
            >
              <MenuItem value="Programming">Programming</MenuItem>
              <MenuItem value="Web Development">Web Development</MenuItem>
              <MenuItem value="Data Science">Data Science</MenuItem>
              <MenuItem value="Design">Design</MenuItem>
            </TextField>
            <TextField
              name="startDate"
              label="Start Date"
              type="date"
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={courseForm.startDate}
              onChange={handleInputChange}
            />
            <TextField
              name="endDate"
              label="End Date"
              type="date"
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={courseForm.endDate}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Create Course
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default CourseManagement;
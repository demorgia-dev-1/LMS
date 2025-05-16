import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Chip
} from '@mui/material';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useContext(AuthContext);
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/api/courses/${id}`);
        setCourse(response.data);
        
        // Check if user is already enrolled
        if (currentUser && userRole === 'student') {
          const enrollmentCheck = await axios.get(`/api/enrollments/check/${id}`);
          setEnrolled(enrollmentCheck.data.enrolled);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course details. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, currentUser, userRole]);

  const handleEnroll = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setEnrolling(true);
    try {
      await axios.post('/api/enrollments', { courseId: id });
      setEnrolled(true);
      setEnrolling(false);
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError('Failed to enroll in course. Please try again.');
      setEnrolling(false);
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

  if (!course) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">Course not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ mb: 4 }}>
        <CardMedia
          component="img"
          height="300"
          image={course.imageUrl || 'https://source.unsplash.com/random?education'}
          alt={course.title}
        />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">
              {course.title}
            </Typography>
            <Chip 
              label={course.category} 
              color="primary" 
              variant="outlined" 
            />
          </Box>
          
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Instructor: {course.instructor.name}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body1" paragraph>
            {course.description}
          </Typography>
          
          {userRole === 'student' && (
            <Box sx={{ mt: 3 }}>
              {enrolled ? (
                <Alert severity="success" sx={{ mb: 2 }}>
                  You are enrolled in this course
                </Alert>
              ) : (
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </Button>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Course Content
            </Typography>
            <List>
              {course.modules && course.modules.map((module, index) => (
                <ListItem key={index} divider={index < course.modules.length - 1}>
                  <ListItemText
                    primary={module.title}
                    secondary={module.description}
                  />
                </ListItem>
              ))}
              {(!course.modules || course.modules.length === 0) && (
                <ListItem>
                  <ListItemText primary="No content available yet" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Course Details
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Duration" secondary={course.duration || 'Not specified'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Level" secondary={course.level || 'All Levels'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Prerequisites" secondary={course.prerequisites || 'None'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Enrollment" secondary={`${course.enrollmentCount || 0} students`} />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetail;
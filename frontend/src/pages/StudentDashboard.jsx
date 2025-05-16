import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Button,
  LinearProgress,
  CircularProgress,
  Alert
} from '@mui/material';

const StudentDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState({
    enrolledCourses: [],
    upcomingAssignments: [],
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real application, you would fetch this data from your API
        // For now, we'll simulate it with mock data
        
        // Simulate API call delay
        setTimeout(() => {
          setDashboardData({
            enrolledCourses: [
              { id: 1, title: 'Introduction to React', instructor: 'Jane Smith', progress: 65, lastAccessed: '2023-06-12' },
              { id: 2, title: 'JavaScript Fundamentals', instructor: 'Mike Wilson', progress: 40, lastAccessed: '2023-06-10' },
              { id: 3, title: 'Web Development Bootcamp', instructor: 'Sarah Brown', progress: 25, lastAccessed: '2023-06-08' },
            ],
            upcomingAssignments: [
              { id: 1, title: 'React Hooks Exercise', course: 'Introduction to React', dueDate: '2023-06-20' },
              { id: 2, title: 'Final Project', course: 'JavaScript Fundamentals', dueDate: '2023-06-25' },
              { id: 3, title: 'Portfolio Website', course: 'Web Development Bootcamp', dueDate: '2023-06-30' },
            ],
            recentActivities: [
              { id: 1, type: 'assignment_submitted', description: 'You submitted "React Components Assignment"', date: '2023-06-11' },
              { id: 2, type: 'course_progress', description: 'You completed Module 3 in "JavaScript Fundamentals"', date: '2023-06-09' },
              { id: 3, type: 'course_enrolled', description: 'You enrolled in "Web Development Bootcamp"', date: '2023-06-08' },
            ]
          });
          setLoading(false);
        }, 1000);
        
        // In a real application, you would make actual API calls like this:
        // const response = await axios.get('/api/student/dashboard-stats');
        // setDashboardData(response.data);
        // setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading dashboard data...
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
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Student Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Welcome back, {currentUser?.name || 'Student'}!
      </Typography>

      {/* Quick Actions */}
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography variant="h5" gutterBottom>Quick Actions</Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="contained" component={Link} to="/courses">
              Browse Courses
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" component={Link} to="/student/assignments">
              View Assignments
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Enrolled Courses */}
      <Typography variant="h5" gutterBottom>Your Courses</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardData.enrolledCourses.map((course) => (
          <Grid item xs={12} md={4} key={course.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>{course.title}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Instructor: {course.instructor}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress variant="determinate" value={course.progress} />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{`${course.progress}%`}</Typography>
                  </Box>
                </Box>
                <Typography variant="caption" display="block">
                  Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}
                </Typography>
                <Button 
                  size="small" 
                  component={Link} 
                  to={`/courses/${course.id}`} 
                  sx={{ mt: 2 }}
                >
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Upcoming Assignments and Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Upcoming Assignments</Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {dashboardData.upcomingAssignments.map((assignment) => (
                  <Box key={assignment.id}>
                    <ListItem>
                      <ListItemText
                        primary={assignment.title}
                        secondary={
                          <>
                            Course: {assignment.course}
                            <Typography variant="caption" display="block" color="error">
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </Box>
                ))}
              </List>
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button component={Link} to="/student/assignments" size="small">
                  View All Assignments
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Activity</Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {dashboardData.recentActivities.map((activity) => (
                  <Box key={activity.id}>
                    <ListItem>
                      <ListItemText
                        primary={activity.description}
                        secondary={
                          <Typography variant="caption" display="block">
                            {new Date(activity.date).toLocaleDateString()}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard;
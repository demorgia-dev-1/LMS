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
  CircularProgress,
  Alert
} from '@mui/material';

const InstructorDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    totalStudents: 0,
    recentCourses: [],
    pendingAssignments: []
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
            totalCourses: 5,
            totalStudents: 87,
            recentCourses: [
              { id: 1, title: 'Introduction to React', enrollments: 32, lastUpdated: '2023-06-10' },
              { id: 2, title: 'JavaScript Fundamentals', enrollments: 28, lastUpdated: '2023-06-05' },
              { id: 3, title: 'Web Development Bootcamp', enrollments: 45, lastUpdated: '2023-05-28' },
            ],
            pendingAssignments: [
              { id: 1, title: 'React Hooks Exercise', course: 'Introduction to React', submissions: 18, dueDate: '2023-06-20' },
              { id: 2, title: 'Final Project', course: 'JavaScript Fundamentals', submissions: 15, dueDate: '2023-06-25' },
              { id: 3, title: 'Portfolio Website', course: 'Web Development Bootcamp', submissions: 22, dueDate: '2023-06-30' },
            ]
          });
          setLoading(false);
        }, 1000);
        
        // In a real application, you would make actual API calls like this:
        // const response = await axios.get('/api/instructor/dashboard-stats');
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
        Instructor Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Welcome back, {currentUser?.name || 'Instructor'}!
      </Typography>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Typography variant="h6" color="text.secondary">Your Courses</Typography>
            <Typography variant="h3" sx={{ mt: 2 }}>{dashboardData.totalCourses}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Typography variant="h6" color="text.secondary">Total Students</Typography>
            <Typography variant="h3" sx={{ mt: 2 }}>{dashboardData.totalStudents}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>Quick Actions</Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="contained" component={Link} to="/instructor/courses/create">
              Create New Course
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" component={Link} to="/instructor/assignments">
              Manage Assignments
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Your Recent Courses</Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {dashboardData.recentCourses.map((course) => (
                  <Box key={course.id}>
                    <ListItem>
                      <ListItemText
                        primary={course.title}
                        secondary={
                          <>
                            Enrollments: {course.enrollments}
                            <Typography variant="caption" display="block">
                              Last Updated: {new Date(course.lastUpdated).toLocaleDateString()}
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
                <Button component={Link} to="/instructor/courses" size="small">
                  View All Courses
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Pending Assignments</Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {dashboardData.pendingAssignments.map((assignment) => (
                  <Box key={assignment.id}>
                    <ListItem>
                      <ListItemText
                        primary={assignment.title}
                        secondary={
                          <>
                            Course: {assignment.course} • Submissions: {assignment.submissions}
                            <Typography variant="caption" display="block">
                              Due Date: {new Date(assignment.dueDate).toLocaleDateString()}
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
                <Button component={Link} to="/instructor/assignments" size="small">
                  View All Assignments
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default InstructorDashboard;
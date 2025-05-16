import { useState, useEffect, useContext } from 'react';
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
  CircularProgress
} from '@mui/material';

const AdminDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    recentUsers: [],
    recentCourses: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real application, you would fetch this data from your API
        // For now, we'll simulate it with mock data
        
        // Simulate API call delay
        setTimeout(() => {
          setStats({
            totalUsers: 125,
            totalCourses: 42,
            totalEnrollments: 350,
            recentUsers: [
              { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student', createdAt: '2023-06-15' },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'instructor', createdAt: '2023-06-14' },
              { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'student', createdAt: '2023-06-13' },
            ],
            recentCourses: [
              { id: 1, title: 'Introduction to React', instructor: 'Jane Smith', enrollments: 45, createdAt: '2023-06-10' },
              { id: 2, title: 'Advanced JavaScript', instructor: 'Mike Wilson', enrollments: 32, createdAt: '2023-06-08' },
              { id: 3, title: 'Node.js Fundamentals', instructor: 'Sarah Brown', enrollments: 28, createdAt: '2023-06-05' },
            ]
          });
          setLoading(false);
        }, 1000);
        
        // In a real application, you would make actual API calls like this:
        // const response = await axios.get('/api/admin/dashboard-stats');
        // setStats(response.data);
        // setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
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

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Welcome back, {currentUser?.name || 'Admin'}!
      </Typography>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Typography variant="h6" color="text.secondary">Total Users</Typography>
            <Typography variant="h3" sx={{ mt: 2 }}>{stats.totalUsers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Typography variant="h6" color="text.secondary">Total Courses</Typography>
            <Typography variant="h3" sx={{ mt: 2 }}>{stats.totalCourses}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Typography variant="h6" color="text.secondary">Total Enrollments</Typography>
            <Typography variant="h3" sx={{ mt: 2 }}>{stats.totalEnrollments}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Users</Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {stats.recentUsers.map((user) => (
                  <Box key={user.id}>
                    <ListItem>
                      <ListItemText
                        primary={user.name}
                        secondary={
                          <>
                            {user.email} • {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            <Typography variant="caption" display="block">
                              Joined: {new Date(user.createdAt).toLocaleDateString()}
                            </Typography>
                          </>
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
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Courses</Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {stats.recentCourses.map((course) => (
                  <Box key={course.id}>
                    <ListItem>
                      <ListItemText
                        primary={course.title}
                        secondary={
                          <>
                            Instructor: {course.instructor} • Enrollments: {course.enrollments}
                            <Typography variant="caption" display="block">
                              Created: {new Date(course.createdAt).toLocaleDateString()}
                            </Typography>
                          </>
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

export default AdminDashboard;
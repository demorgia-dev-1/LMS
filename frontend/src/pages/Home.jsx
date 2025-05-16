// src/pages/Home.jsx
import './Home.css';

import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions
} from '@mui/material';



import studentsImg    from '../assets/students.jpg';
import instructorsImg from '../assets/instructors.jpg';
import featuresImg    from '../assets/features.jpg';

const Home = () => {
  const { isAuthenticated, userRole } = useContext(AuthContext);
  const navigate = useNavigate();

  // Function to navigate to the appropriate dashboard based on user role
  const navigateToDashboard = () => {
    if (userRole === 'admin') {
      navigate('/admin/dashboard');
    } else if (userRole === 'instructor') {
      navigate('/instructor/dashboard');
    } else if (userRole === 'student') {
      navigate('/student/dashboard');
    }
  };

  return (
    <Container maxWidth="lg" className="home-container">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Learning Management System
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          A comprehensive platform for online education and course management
        </Typography>
        
        <Box sx={{ mt: 4, mb: 6 }} className="home-hero">
          {isAuthenticated ? (
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={navigateToDashboard}
            >
              Go to Dashboard
            </Button>
          ) : (
            <Box>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                component={Link}
                to="/login"
                sx={{ mx: 1 }}
              >
                Login
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                size="large"
                component={Link}
                to="/register"
                sx={{ mx: 1 }}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <Grid container spacing={4} className="home-cards">
        <Grid item xs={12} md={12}>
          <Card sx={{ height: '100%' }} className="home-card">
            <CardMedia
              component="img"
              height="400"
              width= "100%"
              image= {studentsImg} 
              alt="Students"
              className="home-card-media"/>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                For Students
              </Typography>
              <Typography>
                Access a wide range of courses, track your progress, submit assignments, and interact with instructors.
              </Typography>
            </CardContent>
            <CardActions>
              {!isAuthenticated && (
                <Button size="small" component={Link} to="/register">
                  Register as Student
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={12}>
          <Card sx={{ height: '100%' }} className="home-card">
            <CardMedia
              component="img"
              height="400"
              width="100%"
              image= {instructorsImg} 
              alt="Instructors"
              className="home-card-media"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                For Instructors
              </Typography>
              <Typography>
                Create and manage courses, track student progress, grade assignments, and provide feedback.
              </Typography>
            </CardContent>
            <CardActions>
              {!isAuthenticated && (
                <Button size="small" component={Link} to="/register">
                  Register as Instructor
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={12}>
          <Card sx={{ height: '100%' }} className="home-card">
            <CardMedia
              component="img"
              height="400"
              image={featuresImg}  
              alt="Features"
              className="home-card-media"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Key Features
              </Typography>
              <Typography>
                Interactive courses, real-time progress tracking, assignment management, and seamless communication.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/courses">
                Browse Courses
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
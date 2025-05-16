import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Import actual components
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CourseList from './pages/CourseList';
import StudentCourseDetail from './pages/CourseDetail';

// Import layout components
import AdminLayout from './layouts/AdminLayout';
import InstructorLayout from './layouts/InstructorLayout';
import StudentLayout from './layouts/StudentLayout';

// Import dashboard components
import AdminDashboard from './pages/AdminDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import StudentDashboard from './pages/StudentDashboard';

// Import instructor components
import CourseManagement from './pages/instructor/CourseManagement';
import InstructorCourseDetail from './pages/instructor/CourseDetail';
import QuizManagement from './pages/instructor/QuizManagement';

// Import student components
import QuizList from './pages/student/QuizList';
import QuizAttempt from './pages/student/QuizAttempt';
import QuizResults from './pages/student/QuizResults';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              {/* Add more admin routes here */}
            </Route>
          </Route>
          
          {/* Instructor routes */}
          <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
            <Route element={<InstructorLayout />}>
              <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
              <Route path="/instructor/courses" element={<CourseManagement />} />
              <Route path="/instructor/courses/:courseId" element={<InstructorCourseDetail />} />
              <Route path="/instructor/quizzes/:quizId" element={<QuizManagement />} />
            </Route>
          </Route>
          
          {/* Student routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route element={<StudentLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/courses/:id" element={<StudentCourseDetail />} />
              <Route path="/student/quizzes" element={<QuizList />} />
              <Route path="/student/quizzes/:quizId" element={<QuizAttempt />} />
              <Route path="/student/quizzes/:quizId/results" element={<QuizResults />} />
            </Route>
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

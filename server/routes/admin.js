const express = require('express');
const router = express.Router();
const { verifyToken, adminOnly } = require('../middleware/auth');
const {
  // Course management
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  
  // Instructor management
  assignInstructor,
  unassignInstructor,
  getAllInstructors,
  
  // User & enrollment management
  getAllUsers,
  getAllEnrollments,
  getCourseEnrollments
} = require('../controllers/adminController');

// Apply authentication and admin-only middleware to all routes
router.use(verifyToken, adminOnly);

// Course management routes
router.route('/courses')
  .post(createCourse)
  .get(getAllCourses);

router.route('/courses/:id')
  .get(getCourseById)
  .put(updateCourse)
  .delete(deleteCourse);

// Instructor management routes
router.get('/instructors', getAllInstructors);
router.put('/courses/:courseId/instructor/:instructorId', assignInstructor);
router.delete('/courses/:courseId/instructor', unassignInstructor);

// User & enrollment management routes
router.get('/users', getAllUsers);
router.get('/enrollments', getAllEnrollments);
router.get('/courses/:courseId/enrollments', getCourseEnrollments);

module.exports = router;
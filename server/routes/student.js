const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/auth');
const {
  enrollInCourse,
  getEnrolledCourses,
  getCourseContent,
  getLessonContent,
  markLessonCompleted,
  getQuizWithQuestions,
  startQuizAttempt,
  submitQuizAnswers
} = require('../controllers/studentController');

// Apply authentication middleware to all routes
// router.use(protect);
router.use(authorize('student'));

// Course routes
router.get('/courses', getEnrolledCourses);
router.get('/courses/:courseId', getCourseContent);
router.post('/courses/:courseId/enroll', enrollInCourse);

// Lesson routes
router.get('/lessons/:lessonId', getLessonContent);
router.put('/lessons/:lessonId/complete', markLessonCompleted);

// Quiz routes
router.get('/quizzes/:quizId', getQuizWithQuestions);
router.post('/quizzes/:quizId/start', startQuizAttempt);
router.post('/quizzes/attempts/:attemptId/submit', submitQuizAnswers);

module.exports = router;
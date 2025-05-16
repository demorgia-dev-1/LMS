const express = require('express');
const router = express.Router();
const { verifyToken, instructorOnly } = require('../middleware/auth');
const instructorController = require('../controllers/instructorController');

// Apply authentication middleware to all instructor routes
router.use(verifyToken);
router.use(instructorOnly);

// Course routes
router.get('/courses', instructorController.getInstructorCourses);
router.get('/courses/:courseId', instructorController.getCourseWithLessons);

// Lesson routes
router.post('/courses/:courseId/lessons', instructorController.createLesson);
router.put('/lessons/:lessonId', instructorController.updateLesson);
router.delete('/lessons/:lessonId', instructorController.deleteLesson);

// Quiz routes
router.post('/lessons/:lessonId/quizzes', instructorController.createQuiz);
router.post('/quizzes/:quizId/questions', instructorController.addQuestionToQuiz);
router.get('/quizzes/:quizId', instructorController.getQuizWithQuestions);

// Student and enrollment routes
router.get('/courses/:courseId/enrollments', instructorController.getCourseEnrollments);
router.get('/quizzes/:quizId/results', instructorController.getQuizResults);
router.get('/courses/:courseId/students/:studentId', instructorController.getStudentPerformance);

module.exports = router;
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Enrollment = require('../models/Enrollment');
const QuizAttempt = require('../models/QuizAttempt');
const LessonProgress = require('../models/LessonProgress');

// @desc    Enroll in a course
// @route   POST /api/student/courses/:courseId/enroll
// @access  Private (Student)
exports.enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      userId,
      courseId,
      enrollmentDate: Date.now(),
      progress: 0,
      isCompleted: false
    });

    res.status(201).json({
      success: true,
      data: enrollment,
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get enrolled courses for student
// @route   GET /api/student/courses
// @access  Private (Student)
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await Enrollment.find({ userId })
      .populate({
        path: 'courseId',
        select: 'title description startDate endDate category isPublished'
      });

    // Format response
    const courses = enrollments.map(enrollment => {
      return {
        _id: enrollment.courseId._id,
        title: enrollment.courseId.title,
        description: enrollment.courseId.description,
        startDate: enrollment.courseId.startDate,
        endDate: enrollment.courseId.endDate,
        category: enrollment.courseId.category,
        enrollmentId: enrollment._id,
        enrollmentDate: enrollment.enrollmentDate,
        progress: enrollment.progress,
        isCompleted: enrollment.isCompleted
      };
    });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get course content (lessons and quizzes)
// @route   GET /api/student/courses/:courseId
// @access  Private (Student)
exports.getCourseContent = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Get lessons with progress
    const lessons = await Lesson.find({ courseId }).sort('order');
    
    // Get lesson progress for this user
    const lessonProgress = await LessonProgress.find({ 
      userId, 
      lessonId: { $in: lessons.map(lesson => lesson._id) }
    });

    // Create a map for quick lookup
    const progressMap = {};
    lessonProgress.forEach(progress => {
      progressMap[progress.lessonId.toString()] = progress;
    });

    // Format lessons with progress
    const lessonsWithProgress = lessons.map(lesson => {
      const progress = progressMap[lesson._id.toString()];
      return {
        _id: lesson._id,
        title: lesson.title,
        description: lesson.description,
        order: lesson.order,
        duration: lesson.duration,
        videoUrl: lesson.videoUrl,
        attachments: lesson.attachments,
        isCompleted: progress ? progress.isCompleted : false,
        lastAccessed: progress ? progress.lastAccessed : null
      };
    });

    // Get quizzes for this course's lessons
    const quizzes = await Quiz.find({
      lessonId: { $in: lessons.map(lesson => lesson._id) }
    }).select('_id title description lessonId timeLimit passingScore');

    // Get quiz attempts for this user
    const quizAttempts = await QuizAttempt.find({
      userId,
      quizId: { $in: quizzes.map(quiz => quiz._id) }
    });

    // Create a map for quick lookup
    const attemptsMap = {};
    quizAttempts.forEach(attempt => {
      if (!attemptsMap[attempt.quizId.toString()]) {
        attemptsMap[attempt.quizId.toString()] = [];
      }
      attemptsMap[attempt.quizId.toString()].push(attempt);
    });

    // Format quizzes with attempts
    const quizzesWithAttempts = quizzes.map(quiz => {
      const attempts = attemptsMap[quiz._id.toString()] || [];
      return {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        lessonId: quiz.lessonId,
        timeLimit: quiz.timeLimit,
        passingScore: quiz.passingScore,
        attempts: attempts.map(attempt => ({
          _id: attempt._id,
          startTime: attempt.startTime,
          endTime: attempt.endTime,
          score: attempt.score,
          isPassed: attempt.isPassed
        })),
        bestScore: attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : null,
        isPassed: attempts.some(a => a.isPassed)
      };
    });

    res.status(200).json({
      success: true,
      data: {
        course: {
          _id: course._id,
          title: course.title,
          description: course.description,
          startDate: course.startDate,
          endDate: course.endDate,
          category: course.category
        },
        enrollment: {
          enrollmentDate: enrollment.enrollmentDate,
          progress: enrollment.progress,
          isCompleted: enrollment.isCompleted
        },
        lessons: lessonsWithProgress,
        quizzes: quizzesWithAttempts
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get lesson content
// @route   GET /api/student/lessons/:lessonId
// @access  Private (Student)
exports.getLessonContent = async (req, res) => {
  try {
    const lessonId = req.params.lessonId;
    const userId = req.user.id;

    // Get lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({ 
      userId, 
      courseId: lesson.courseId 
    });
    
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    // Update or create lesson progress
    let progress = await LessonProgress.findOne({ userId, lessonId });
    if (!progress) {
      progress = await LessonProgress.create({
        userId,
        lessonId,
        lastAccessed: Date.now(),
        isCompleted: false
      });
    } else {
      progress.lastAccessed = Date.now();
      await progress.save();
    }

    res.status(200).json({
      success: true,
      data: {
        _id: lesson._id,
        title: lesson.title,
        description: lesson.description,
        content: lesson.content,
        order: lesson.order,
        duration: lesson.duration,
        videoUrl: lesson.videoUrl,
        attachments: lesson.attachments,
        progress: {
          isCompleted: progress.isCompleted,
          lastAccessed: progress.lastAccessed
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Mark lesson as completed
// @route   PUT /api/student/lessons/:lessonId/complete
// @access  Private (Student)
exports.markLessonCompleted = async (req, res) => {
  try {
    const lessonId = req.params.lessonId;
    const userId = req.user.id;

    // Get lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({ 
      userId, 
      courseId: lesson.courseId 
    });
    
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    // Update or create lesson progress
    let progress = await LessonProgress.findOne({ userId, lessonId });
    if (!progress) {
      progress = await LessonProgress.create({
        userId,
        lessonId,
        lastAccessed: Date.now(),
        isCompleted: true
      });
    } else {
      progress.isCompleted = true;
      progress.lastAccessed = Date.now();
      await progress.save();
    }

    // Update course progress
    await updateCourseProgress(userId, lesson.courseId);

    res.status(200).json({
      success: true,
      data: progress,
      message: 'Lesson marked as completed'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get quiz with questions
// @route   GET /api/student/quizzes/:quizId
// @access  Private (Student)
exports.getQuizWithQuestions = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const userId = req.user.id;

    // Get quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Get lesson to check enrollment
    const lesson = await Lesson.findById(quiz.lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Associated lesson not found'
      });
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({ 
      userId, 
      courseId: lesson.courseId 
    });
    
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    // Get questions but don't include correct answers
    const questions = await Question.find({ quizId })
      .select('-options.isCorrect -correctAnswer')
      .sort('order');

    // Get previous attempts
    const attempts = await QuizAttempt.find({ userId, quizId })
      .sort('-startTime');

    res.status(200).json({
      success: true,
      data: {
        quiz: {
          _id: quiz._id,
          title: quiz.title,
          description: quiz.description,
          timeLimit: quiz.timeLimit,
          passingScore: quiz.passingScore,
          totalQuestions: questions.length,
          totalPoints: questions.reduce((sum, q) => sum + q.points, 0)
        },
        questions,
        previousAttempts: attempts.map(attempt => ({
          _id: attempt._id,
          startTime: attempt.startTime,
          endTime: attempt.endTime,
          score: attempt.score,
          isPassed: attempt.isPassed
        }))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Start quiz attempt
// @route   POST /api/student/quizzes/:quizId/start
// @access  Private (Student)
exports.startQuizAttempt = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const userId = req.user.id;

    // Get quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Get lesson to check enrollment
    const lesson = await Lesson.findById(quiz.lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Associated lesson not found'
      });
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({ 
      userId, 
      courseId: lesson.courseId 
    });
    
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    // Create a new attempt
    const attempt = await QuizAttempt.create({
      userId,
      quizId,
      startTime: Date.now(),
      answers: [],
      score: 0,
      isPassed: false
    });

    res.status(201).json({
      success: true,
      data: {
        attemptId: attempt._id,
        startTime: attempt.startTime,
        timeLimit: quiz.timeLimit
      },
      message: 'Quiz attempt started'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Submit quiz answers
// @route   POST /api/student/quizzes/attempts/:attemptId/submit
// @access  Private (Student)
exports.submitQuizAnswers = async (req, res) => {
  try {
    const attemptId = req.params.attemptId;
    const userId = req.user.id;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide answers array'
      });
    }

    // Get the attempt
    const attempt = await QuizAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Quiz attempt not found'
      });
    }

    // Verify this is the user's attempt
    if (attempt.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit for this attempt'
      });
    }

    // Check if already submitted
    if (attempt.endTime) {
      return res.status(400).json({
        success: false,
        message: 'This attempt has already been submitted'
      });
    }

    // Get the quiz
    const quiz = await Quiz.findById(attempt.quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Get all questions for this quiz
    const questions = await Question.find({ quizId: quiz._id });
    const questionMap = {};
    questions.forEach(q => {
      questionMap[q._id.toString()] = q;
    });

    // Process answers and calculate score
    let totalPoints = 0;
    let earnedPoints = 0;
    const processedAnswers = [];

    for (const answer of answers) {
      const question = questionMap[answer.questionId];
      if (!question) continue;

      totalPoints += question.points;
      let isCorrect = false;
      let pointsEarned = 0;

      // Check if answer is correct based on question type
      if (question.questionType === 'multiple-choice') {
        // For multiple choice, find the correct option
        const correctOption = question.options.find(opt => opt.isCorrect);
        isCorrect = correctOption && answer.answer === correctOption.text;
      } else if (question.questionType === 'true-false') {
        // For true/false, compare with correctAnswer
        isCorrect = answer.answer === question.correctAnswer;
      }

      if (isCorrect) {
        pointsEarned = question.points;
        earnedPoints += pointsEarned;
      }

      processedAnswers.push({
        questionId: question._id,
        userAnswer: answer.answer,
        isCorrect,
        pointsEarned
      });
    }

    // Calculate score as percentage
    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const isPassed = score >= quiz.passingScore;

    // Update the attempt
    attempt.answers = processedAnswers;
    attempt.endTime = Date.now();
    attempt.score = score;
    attempt.isPassed = isPassed;
    await attempt.save();

    // If passed, update lesson progress
    if (isPassed) {
      const lesson = await Lesson.findById(quiz.lessonId);
      if (lesson) {
        let progress = await LessonProgress.findOne({ userId, lessonId: lesson._id });
        if (!progress) {
          progress = await LessonProgress.create({
            userId,
            lessonId: lesson._id,
            lastAccessed: Date.now(),
            isCompleted: true
          });
        } else if (!progress.isCompleted) {
          progress.isCompleted = true;
          progress.lastAccessed = Date.now();
          await progress.save();
        }

        // Update course progress
        await updateCourseProgress(userId, lesson.courseId);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        attemptId: attempt._id,
        startTime: attempt.startTime,
        endTime: attempt.endTime,
        score,
        isPassed,
        totalQuestions: questions.length,
        correctAnswers: processedAnswers.filter(a => a.isCorrect).length,
        feedback: processedAnswers.map(answer => {
          const question = questionMap[answer.questionId];
          return {
            questionId: answer.questionId,
            questionText: question ? question.questionText : '',
            userAnswer: answer.userAnswer,
            isCorrect: answer.isCorrect,
            pointsEarned: answer.pointsEarned,
            correctAnswer: question ? 
              (question.questionType === 'multiple-choice' ? 
                question.options.find(opt => opt.isCorrect)?.text : 
                question.correctAnswer) : 
              ''
          };
        })
      },
      message: `Quiz submitted. Your score: ${score}%. ${isPassed ? 'Congratulations! You passed!' : 'You did not pass the minimum score.'}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Helper function to update course progress
async function updateCourseProgress(userId, courseId) {
  try {
    // Get all lessons for this course
    const lessons = await Lesson.find({ courseId });
    if (lessons.length === 0) return;

    // Get completed lessons
    const completedLessons = await LessonProgress.find({
      userId,
      lessonId: { $in: lessons.map(lesson => lesson._id) },
      isCompleted: true
    });

    // Calculate progress percentage
    const progress = Math.round((completedLessons.length / lessons.length) * 100);
    const isCompleted = progress === 100;

    // Update enrollment
    await Enrollment.findOneAndUpdate(
      { userId, courseId },
      { progress, isCompleted }
    );

    return { progress, isCompleted };
  } catch (error) {
    console.error('Error updating course progress:', error);
    throw error;
  }
}
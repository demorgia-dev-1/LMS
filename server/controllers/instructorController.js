const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const User = require('../models/User');
const QuizAttempt = require('../models/QuizAttempt');
const Enrollment = require('../models/Enrollment');

// Helper function to check if instructor owns the course
const validateInstructorCourse = async (instructorId, courseId) => {
  const course = await Course.findOne({ _id: courseId, instructor: instructorId });
  return course ? true : false;
};

// Get all courses taught by the instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .select('title description startDate endDate isPublished category');

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get a specific course with lessons
exports.getCourseWithLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Verify instructor owns this course
    const isOwner = await validateInstructorCourse(req.user._id, courseId);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this course'
      });
    }

    const course = await Course.findById(courseId)
      .select('title description startDate endDate isPublished category');
    
    const lessons = await Lesson.find({ courseId })
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: {
        course,
        lessons
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create a new lesson
exports.createLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, content, order, duration, videoUrl, attachments, isPublished } = req.body;

    // Verify instructor owns this course
    const isOwner = await validateInstructorCourse(req.user._id, courseId);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this course'
      });
    }

    // Find the highest order number to place new lesson at the end if order not specified
    let lessonOrder = order;
    if (!lessonOrder) {
      const lastLesson = await Lesson.findOne({ courseId }).sort({ order: -1 });
      lessonOrder = lastLesson ? lastLesson.order + 1 : 1;
    }

    const lesson = new Lesson({
      courseId,
      title,
      description,
      content,
      order: lessonOrder,
      duration,
      videoUrl,
      attachments,
      isPublished: isPublished !== undefined ? isPublished : false
    });

    await lesson.save();

    res.status(201).json({
      success: true,
      data: lesson,
      message: 'Lesson created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update a lesson
exports.updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const updateData = req.body;

    // Find the lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Verify instructor owns the course this lesson belongs to
    const isOwner = await validateInstructorCourse(req.user._id, lesson.courseId);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this lesson'
      });
    }

    // Update the lesson
    Object.keys(updateData).forEach(key => {
      lesson[key] = updateData[key];
    });

    await lesson.save();

    res.status(200).json({
      success: true,
      data: lesson,
      message: 'Lesson updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete a lesson
exports.deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Find the lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Verify instructor owns the course this lesson belongs to
    const isOwner = await validateInstructorCourse(req.user._id, lesson.courseId);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this lesson'
      });
    }

    // Delete any quizzes associated with this lesson
    const quizzes = await Quiz.find({ lessonId });
    for (const quiz of quizzes) {
      // Delete questions associated with each quiz
      await Question.deleteMany({ quizId: quiz._id });
      // Delete quiz attempts
      await QuizAttempt.deleteMany({ quizId: quiz._id });
    }
    await Quiz.deleteMany({ lessonId });

    // Delete the lesson
    await lesson.remove();

    res.status(200).json({
      success: true,
      message: 'Lesson and associated quizzes deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create a quiz for a lesson
exports.createQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { title, description, timeLimit, passingScore, isPublished } = req.body;

    // Find the lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Verify instructor owns the course this lesson belongs to
    const isOwner = await validateInstructorCourse(req.user._id, lesson.courseId);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this lesson'
      });
    }

    const quiz = new Quiz({
      lessonId,
      title,
      description,
      timeLimit,
      passingScore,
      isPublished: isPublished !== undefined ? isPublished : false,
      questions: []
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      data: quiz,
      message: 'Quiz created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Add a question to a quiz
exports.addQuestionToQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { questionText, questionType, options, correctAnswer, points, order } = req.body;

    // Find the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Find the lesson
    const lesson = await Lesson.findById(quiz.lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Verify instructor owns the course this quiz belongs to
    const isOwner = await validateInstructorCourse(req.user._id, lesson.courseId);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this quiz'
      });
    }

    // Find the highest order number to place new question at the end if order not specified
    let questionOrder = order;
    if (!questionOrder) {
      const lastQuestion = await Question.findOne({ quizId }).sort({ order: -1 });
      questionOrder = lastQuestion ? lastQuestion.order + 1 : 1;
    }

    const question = new Question({
      quizId,
      questionText,
      questionType,
      options: questionType === 'multiple-choice' ? options : [],
      correctAnswer: questionType !== 'multiple-choice' ? correctAnswer : undefined,
      points: points || 1,
      order: questionOrder
    });

    await question.save();

    // Add question to quiz
    quiz.questions.push(question._id);
    await quiz.save();

    res.status(201).json({
      success: true,
      data: question,
      message: 'Question added to quiz successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get a quiz with all questions
exports.getQuizWithQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Find the lesson
    const lesson = await Lesson.findById(quiz.lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Verify instructor owns the course this quiz belongs to
    const isOwner = await validateInstructorCourse(req.user._id, lesson.courseId);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this quiz'
      });
    }

    const questions = await Question.find({ quizId })
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: {
        quiz,
        questions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get enrolled students for a course
exports.getCourseEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Verify instructor owns this course
    const isOwner = await validateInstructorCourse(req.user._id, courseId);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this course'
      });
    }

    const enrollments = await Enrollment.find({ courseId })
      .populate({
        path: 'userId',
        select: 'firstName lastName email'
      })
      .select('enrollmentDate progress isCompleted');

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get quiz results for a specific quiz
exports.getQuizResults = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Find the lesson
    const lesson = await Lesson.findById(quiz.lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Verify instructor owns the course this quiz belongs to
    const isOwner = await validateInstructorCourse(req.user._id, lesson.courseId);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this quiz'
      });
    }

    const quizAttempts = await QuizAttempt.find({ quizId })
      .populate({
        path: 'userId',
        select: 'firstName lastName email'
      })
      .select('startTime endTime score isPassed answers');

    res.status(200).json({
      success: true,
      count: quizAttempts.length,
      data: quizAttempts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get student performance for a course
exports.getStudentPerformance = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    // Verify instructor owns this course
    const isOwner = await validateInstructorCourse(req.user._id, courseId);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this course'
      });
    }

    // Get student info
    const student = await User.findById(studentId).select('firstName lastName email');
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get enrollment info
    const enrollment = await Enrollment.findOne({ courseId, userId: studentId });
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Student not enrolled in this course'
      });
    }

    // Get lessons for this course
    const lessons = await Lesson.find({ courseId }).select('_id title');
    
    // Get quizzes for these lessons
    const lessonIds = lessons.map(lesson => lesson._id);
    const quizzes = await Quiz.find({ lessonId: { $in: lessonIds } }).select('_id title lessonId');
    
    // Get quiz attempts for this student
    const quizIds = quizzes.map(quiz => quiz._id);
    const quizAttempts = await QuizAttempt.find({
      quizId: { $in: quizIds },
      userId: studentId
    }).select('quizId startTime endTime score isPassed');

    res.status(200).json({
      success: true,
      data: {
        student,
        enrollment,
        quizAttempts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
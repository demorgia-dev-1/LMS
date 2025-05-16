/**
 * Learning Management System (LMS) Database Schema
 * 
 * This file defines the relational database schema for the LMS system,
 * including tables, fields, relationships, and data types.
 */

/**
 * Users Table
 * - Stores information about all users in the system
 * - Includes role-based access control
 * 
 * Primary Key: _id (MongoDB ObjectId)
 * Indexes: email (unique)
 */
const UserSchema = {
  _id: { type: 'ObjectId', auto: true }, // Primary Key
  firstName: { type: 'String', required: true },
  lastName: { type: 'String', required: true },
  email: { type: 'String', required: true, unique: true },
  password: { type: 'String', required: true }, // Stored as hashed
  role: { type: 'String', enum: ['student', 'instructor', 'admin'], default: 'student' },
  bio: { type: 'String' },
  profilePicture: { type: 'String' }, // URL to profile picture
  lastLogin: { type: 'Date' },
  createdAt: { type: 'Date', default: 'Date.now' },
  updatedAt: { type: 'Date', default: 'Date.now' }
};

/**
 * Courses Table
 * - Stores information about courses offered in the LMS
 * 
 * Primary Key: _id (MongoDB ObjectId)
 * Foreign Keys: instructorId (references Users._id)
 */
const CourseSchema = {
  _id: { type: 'ObjectId', auto: true }, // Primary Key
  title: { type: 'String', required: true },
  description: { type: 'String', required: true },
  instructorId: { type: 'ObjectId', ref: 'User', required: true }, // Foreign Key to Users
  thumbnail: { type: 'String' }, // URL to course thumbnail
  category: { type: 'String' },
  level: { type: 'String', enum: ['beginner', 'intermediate', 'advanced'] },
  duration: { type: 'Number' }, // Duration in hours
  isPublished: { type: 'Boolean', default: false },
  price: { type: 'Number', default: 0 }, // 0 for free courses
  enrollmentCount: { type: 'Number', default: 0 },
  rating: { type: 'Number', default: 0 },
  createdAt: { type: 'Date', default: 'Date.now' },
  updatedAt: { type: 'Date', default: 'Date.now' }
};

/**
 * Enrollments Table
 * - Tracks student enrollments in courses
 * - Represents many-to-many relationship between Users and Courses
 * 
 * Primary Key: _id (MongoDB ObjectId)
 * Foreign Keys: userId (references Users._id), courseId (references Courses._id)
 * Composite Unique Index: [userId, courseId]
 */
const EnrollmentSchema = {
  _id: { type: 'ObjectId', auto: true }, // Primary Key
  userId: { type: 'ObjectId', ref: 'User', required: true }, // Foreign Key to Users
  courseId: { type: 'ObjectId', ref: 'Course', required: true }, // Foreign Key to Courses
  enrollmentDate: { type: 'Date', default: 'Date.now' },
  completionDate: { type: 'Date' },
  progress: { type: 'Number', default: 0 }, // Percentage of course completed
  isCompleted: { type: 'Boolean', default: false },
  certificateIssued: { type: 'Boolean', default: false },
  lastAccessedAt: { type: 'Date' }
};

/**
 * Lessons Table
 * - Stores individual lessons within courses
 * 
 * Primary Key: _id (MongoDB ObjectId)
 * Foreign Keys: courseId (references Courses._id)
 */
const LessonSchema = {
  _id: { type: 'ObjectId', auto: true }, // Primary Key
  courseId: { type: 'ObjectId', ref: 'Course', required: true }, // Foreign Key to Courses
  title: { type: 'String', required: true },
  description: { type: 'String' },
  content: { type: 'String', required: true }, // Rich text content
  order: { type: 'Number', required: true }, // Order within the course
  duration: { type: 'Number' }, // Duration in minutes
  videoUrl: { type: 'String' }, // URL to video content if any
  attachments: [{ type: 'String' }], // Array of attachment URLs
  isPublished: { type: 'Boolean', default: false },
  createdAt: { type: 'Date', default: 'Date.now' },
  updatedAt: { type: 'Date', default: 'Date.now' }
};

/**
 * Quizzes Table
 * - Stores quizzes associated with lessons
 * 
 * Primary Key: _id (MongoDB ObjectId)
 * Foreign Keys: lessonId (references Lessons._id)
 */
const QuizSchema = {
  _id: { type: 'ObjectId', auto: true }, // Primary Key
  lessonId: { type: 'ObjectId', ref: 'Lesson', required: true }, // Foreign Key to Lessons
  title: { type: 'String', required: true },
  description: { type: 'String' },
  timeLimit: { type: 'Number' }, // Time limit in minutes, null for no limit
  passingScore: { type: 'Number', default: 70 }, // Percentage required to pass
  isPublished: { type: 'Boolean', default: false },
  createdAt: { type: 'Date', default: 'Date.now' },
  updatedAt: { type: 'Date', default: 'Date.now' }
};

/**
 * Questions Table
 * - Stores individual questions within quizzes
 * 
 * Primary Key: _id (MongoDB ObjectId)
 * Foreign Keys: quizId (references Quizzes._id)
 */
const QuestionSchema = {
  _id: { type: 'ObjectId', auto: true }, // Primary Key
  quizId: { type: 'ObjectId', ref: 'Quiz', required: true }, // Foreign Key to Quizzes
  questionText: { type: 'String', required: true },
  questionType: { type: 'String', enum: ['multiple-choice', 'true-false', 'short-answer'], required: true },
  options: [{
    text: { type: 'String' },
    isCorrect: { type: 'Boolean' }
  }], // For multiple-choice questions
  correctAnswer: { type: 'String' }, // For true-false and short-answer questions
  points: { type: 'Number', default: 1 },
  order: { type: 'Number', required: true }, // Order within the quiz
  createdAt: { type: 'Date', default: 'Date.now' },
  updatedAt: { type: 'Date', default: 'Date.now' }
};

/**
 * QuizAttempts Table
 * - Tracks student attempts at quizzes
 * 
 * Primary Key: _id (MongoDB ObjectId)
 * Foreign Keys: userId (references Users._id), quizId (references Quizzes._id)
 */
const QuizAttemptSchema = {
  _id: { type: 'ObjectId', auto: true }, // Primary Key
  userId: { type: 'ObjectId', ref: 'User', required: true }, // Foreign Key to Users
  quizId: { type: 'ObjectId', ref: 'Quiz', required: true }, // Foreign Key to Quizzes
  startTime: { type: 'Date', default: 'Date.now' },
  endTime: { type: 'Date' },
  score: { type: 'Number' },
  isPassed: { type: 'Boolean' },
  answers: [{
    questionId: { type: 'ObjectId', ref: 'Question' },
    userAnswer: { type: 'String' },
    isCorrect: { type: 'Boolean' },
    pointsEarned: { type: 'Number' }
  }]
};

/**
 * LessonProgress Table
 * - Tracks student progress through individual lessons
 * 
 * Primary Key: _id (MongoDB ObjectId)
 * Foreign Keys: userId (references Users._id), lessonId (references Lessons._id)
 * Composite Unique Index: [userId, lessonId]
 */
const LessonProgressSchema = {
  _id: { type: 'ObjectId', auto: true }, // Primary Key
  userId: { type: 'ObjectId', ref: 'User', required: true }, // Foreign Key to Users
  lessonId: { type: 'ObjectId', ref: 'Lesson', required: true }, // Foreign Key to Lessons
  isCompleted: { type: 'Boolean', default: false },
  lastAccessedAt: { type: 'Date', default: 'Date.now' },
  timeSpent: { type: 'Number', default: 0 } // Time spent in minutes
};

// Export all schemas
module.exports = {
  UserSchema,
  CourseSchema,
  EnrollmentSchema,
  LessonSchema,
  QuizSchema,
  QuestionSchema,
  QuizAttemptSchema,
  LessonProgressSchema
};
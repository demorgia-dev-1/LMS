const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  userAnswer: {
    type: mongoose.Schema.Types.Mixed, // Can be string or array depending on question type
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  pointsEarned: {
    type: Number,
    default: 0
  }
});

const quizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  score: {
    type: Number,
    default: 0
  },
  isPassed: {
    type: Boolean,
    default: false
  },
  answers: [answerSchema]
}, {
  timestamps: true
});

// Virtual for calculating percentage score
quizAttemptSchema.virtual('percentageScore').get(function() {
  if (!this.answers.length) return 0;
  
  const totalPoints = this.answers.reduce((sum, answer) => sum + answer.pointsEarned, 0);
  const maxPoints = this.answers.length; // Assuming each question is worth 1 point by default
  
  return (totalPoints / maxPoints) * 100;
});

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

module.exports = QuizAttempt;
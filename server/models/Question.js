const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true,
    default: false
  }
});

const questionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer'],
    required: true
  },
  options: [optionSchema], // For multiple-choice questions
  correctAnswer: {
    type: String // For true-false and short-answer questions
  },
  points: {
    type: Number,
    default: 1
  },
  order: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
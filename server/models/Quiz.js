const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  timeLimit: {
    type: Number, // Time limit in minutes, null for no limit
    default: null
  },
  passingScore: {
    type: Number,
    default: 70, // Percentage required to pass
    min: 0,
    max: 100
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }]
}, {
  timestamps: true
});

// Virtual for getting the number of questions
quizSchema.virtual('questionCount').get(function() {
  return this.questions.length;
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
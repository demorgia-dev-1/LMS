const mongoose = require('mongoose');

const lessonProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  timeSpent: {
    type: Number,
    default: 0 // Time spent in minutes
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Create a compound index to ensure unique progress tracking per user and lesson
lessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

const LessonProgress = mongoose.model('LessonProgress', lessonProgressSchema);

module.exports = LessonProgress;
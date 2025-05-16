const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
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
  content: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 0 // Duration in minutes
  },
  videoUrl: {
    type: String,
    default: ''
  },
  attachments: [{
    type: String
  }],
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
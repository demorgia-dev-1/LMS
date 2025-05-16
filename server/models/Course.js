const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  modules: [{
    title: String,
    description: String,
    content: [{
      type: {
        type: String,
        enum: ['video', 'document', 'assignment', 'quiz'],
        required: true
      },
      title: String,
      description: String,
      url: String,
      dueDate: Date,
      points: Number
    }]
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  prerequisites: [{
    type: String
  }],
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Virtual for getting course duration in weeks
courseSchema.virtual('duration').get(function() {
  const diffTime = Math.abs(this.endDate - this.startDate);
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  return diffWeeks;
});

// Method to check if a student is enrolled
courseSchema.methods.isStudentEnrolled = function(studentId) {
  return this.enrolledStudents.includes(studentId);
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
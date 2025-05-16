const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

// ===== COURSE MANAGEMENT =====

/**
 * Create a new course
 * @route POST /api/admin/courses
 */
const createCourse = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      instructor, 
      startDate, 
      endDate, 
      category,
      prerequisites,
      tags,
      isPublished
    } = req.body;

    // Verify instructor exists and is an instructor
    const instructorUser = await User.findById(instructor);
    if (!instructorUser || instructorUser.role !== 'instructor') {
      return res.status(400).json({ message: 'Invalid instructor ID' });
    }

    const newCourse = new Course({
      title,
      description,
      instructor,
      startDate,
      endDate,
      category,
      prerequisites: prerequisites || [],
      tags: tags || [],
      isPublished: isPublished || false
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      data: newCourse,
      message: 'Course created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: error.message
    });
  }
};

/**
 * Get all courses
 * @route GET /api/admin/courses
 */
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'firstName lastName email')
      .select('-modules');

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message
    });
  }
};

/**
 * Get a single course by ID
 * @route GET /api/admin/courses/:id
 */
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'firstName lastName email')
      .populate('enrolledStudents', 'firstName lastName email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course',
      error: error.message
    });
  }
};

/**
 * Update a course
 * @route PUT /api/admin/courses/:id
 */
const updateCourse = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      instructor, 
      startDate, 
      endDate, 
      category,
      prerequisites,
      tags,
      isPublished
    } = req.body;

    // If instructor is being updated, verify they exist and are an instructor
    if (instructor) {
      const instructorUser = await User.findById(instructor);
      if (!instructorUser || instructorUser.role !== 'instructor') {
        return res.status(400).json({ message: 'Invalid instructor ID' });
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('instructor', 'firstName lastName email');

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedCourse,
      message: 'Course updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update course',
      error: error.message
    });
  }
};

/**
 * Delete a course
 * @route DELETE /api/admin/courses/:id
 */
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Delete all enrollments for this course
    await Enrollment.deleteMany({ courseId: req.params.id });
    
    // Delete the course
    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course and related enrollments deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete course',
      error: error.message
    });
  }
};

// ===== INSTRUCTOR MANAGEMENT =====

/**
 * Assign instructor to a course
 * @route PUT /api/admin/courses/:courseId/instructor/:instructorId
 */
const assignInstructor = async (req, res) => {
  try {
    const { courseId, instructorId } = req.params;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Verify instructor exists and is an instructor
    const instructor = await User.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    if (instructor.role !== 'instructor') {
      return res.status(400).json({
        success: false,
        message: 'User is not an instructor'
      });
    }

    // Update course with new instructor
    course.instructor = instructorId;
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Instructor assigned to course successfully',
      data: {
        courseId: course._id,
        instructorId: instructor._id,
        instructorName: `${instructor.firstName} ${instructor.lastName}`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to assign instructor',
      error: error.message
    });
  }
};

/**
 * Unassign instructor from a course
 * @route DELETE /api/admin/courses/:courseId/instructor
 */
const unassignInstructor = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Store the current instructor for the response
    const currentInstructorId = course.instructor;
    
    // Remove instructor from course
    course.instructor = null;
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Instructor unassigned from course successfully',
      data: {
        courseId: course._id,
        previousInstructorId: currentInstructorId
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to unassign instructor',
      error: error.message
    });
  }
};

/**
 * Get all instructors
 * @route GET /api/admin/instructors
 */
const getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' })
      .select('-password -__v')
      .populate('courses', 'title');

    res.status(200).json({
      success: true,
      count: instructors.length,
      data: instructors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch instructors',
      error: error.message
    });
  }
};

// ===== USER & ENROLLMENT MANAGEMENT =====

/**
 * Get all users
 * @route GET /api/admin/users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -__v')
      .populate('courses', 'title');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

/**
 * Get all enrollments
 * @route GET /api/admin/enrollments
 */
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('userId', 'firstName lastName email')
      .populate('courseId', 'title');

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollments',
      error: error.message
    });
  }
};

/**
 * Get enrollments for a specific course
 * @route GET /api/admin/courses/:courseId/enrollments
 */
const getCourseEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const enrollments = await Enrollment.find({ courseId })
      .populate('userId', 'firstName lastName email')
      .populate('courseId', 'title');

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course enrollments',
      error: error.message
    });
  }
};

module.exports = {
  // Course management
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  
  // Instructor management
  assignInstructor,
  unassignInstructor,
  getAllInstructors,
  
  // User & enrollment management
  getAllUsers,
  getAllEnrollments,
  getCourseEnrollments
};
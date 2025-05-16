import api from './api';

const courseService = {
  /**
   * Get all courses (public)
   * @returns {Promise} - Response with list of courses
   */
  getAllCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  /**
   * Get course details by ID
   * @param {string} courseId - Course ID
   * @returns {Promise} - Response with course details
   */
  getCourseById: async (courseId) => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },

  /**
   * Get instructor's courses
   * @returns {Promise} - Response with instructor's courses
   */
  getInstructorCourses: async () => {
    const response = await api.get('/instructor/courses');
    return response.data;
  },

  /**
   * Create a new course (instructor only)
   * @param {Object} courseData - Course data
   * @returns {Promise} - Response with created course
   */
  createCourse: async (courseData) => {
    const response = await api.post('/instructor/courses', courseData);
    return response.data;
  },

  /**
   * Update a course (instructor only)
   * @param {string} courseId - Course ID
   * @param {Object} courseData - Updated course data
   * @returns {Promise} - Response with updated course
   */
  updateCourse: async (courseId, courseData) => {
    const response = await api.put(`/instructor/courses/${courseId}`, courseData);
    return response.data;
  },

  /**
   * Delete a course (instructor only)
   * @param {string} courseId - Course ID
   * @returns {Promise} - Response with success message
   */
  deleteCourse: async (courseId) => {
    const response = await api.delete(`/instructor/courses/${courseId}`);
    return response.data;
  },

  /**
   * Enroll in a course (student only)
   * @param {string} courseId - Course ID
   * @returns {Promise} - Response with enrollment details
   */
  enrollCourse: async (courseId) => {
    const response = await api.post(`/student/courses/${courseId}/enroll`);
    return response.data;
  },

  /**
   * Get student's enrolled courses
   * @returns {Promise} - Response with enrolled courses
   */
  getEnrolledCourses: async () => {
    const response = await api.get('/student/courses');
    return response.data;
  }
};

export default courseService;
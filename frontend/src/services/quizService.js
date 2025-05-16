import api from './api';

const quizService = {
  /**
   * Get all quizzes for a course (instructor view)
   * @param {string} courseId - Course ID
   * @returns {Promise} - Response with list of quizzes
   */
  getCourseQuizzes: async (courseId) => {
    const response = await api.get(`/instructor/courses/${courseId}/quizzes`);
    return response.data;
  },

  /**
   * Get student's available quizzes
   * @returns {Promise} - Response with list of available quizzes
   */
  getStudentQuizzes: async () => {
    const response = await api.get('/student/quizzes');
    return response.data;
  },

  /**
   * Get quiz details by ID
   * @param {string} quizId - Quiz ID
   * @returns {Promise} - Response with quiz details
   */
  getQuizById: async (quizId) => {
    const response = await api.get(`/quizzes/${quizId}`);
    return response.data;
  },

  /**
   * Create a new quiz (instructor only)
   * @param {string} courseId - Course ID
   * @param {Object} quizData - Quiz data
   * @returns {Promise} - Response with created quiz
   */
  createQuiz: async (courseId, quizData) => {
    const response = await api.post(`/instructor/courses/${courseId}/quizzes`, quizData);
    return response.data;
  },

  /**
   * Update a quiz (instructor only)
   * @param {string} quizId - Quiz ID
   * @param {Object} quizData - Updated quiz data
   * @returns {Promise} - Response with updated quiz
   */
  updateQuiz: async (quizId, quizData) => {
    const response = await api.put(`/instructor/quizzes/${quizId}`, quizData);
    return response.data;
  },

  /**
   * Delete a quiz (instructor only)
   * @param {string} quizId - Quiz ID
   * @returns {Promise} - Response with success message
   */
  deleteQuiz: async (quizId) => {
    const response = await api.delete(`/instructor/quizzes/${quizId}`);
    return response.data;
  },

  /**
   * Start a quiz attempt (student only)
   * @param {string} quizId - Quiz ID
   * @returns {Promise} - Response with quiz questions and attempt details
   */
  startQuizAttempt: async (quizId) => {
    const response = await api.post(`/student/quizzes/${quizId}/attempt`);
    return response.data;
  },

  /**
   * Submit quiz answers (student only)
   * @param {string} attemptId - Attempt ID
   * @param {Object} answers - Quiz answers
   * @returns {Promise} - Response with quiz results
   */
  submitQuizAttempt: async (attemptId, answers) => {
    const response = await api.post(`/student/quiz-attempts/${attemptId}/submit`, { answers });
    return response.data;
  },

  /**
   * Get quiz results (student only)
   * @param {string} attemptId - Attempt ID
   * @returns {Promise} - Response with quiz results
   */
  getQuizResults: async (attemptId) => {
    const response = await api.get(`/student/quiz-attempts/${attemptId}/results`);
    return response.data;
  },

  /**
   * Get all quiz attempts for a student
   * @returns {Promise} - Response with list of quiz attempts
   */
  getStudentQuizAttempts: async () => {
    const response = await api.get('/student/quiz-attempts');
    return response.data;
  }
};

export default quizService;
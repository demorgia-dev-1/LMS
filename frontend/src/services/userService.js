import api from './api';

const userService = {
  /**
   * Get all users (admin only)
   * @returns {Promise} - Response with list of users
   */
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  /**
   * Get user by ID (admin only)
   * @param {string} userId - User ID
   * @returns {Promise} - Response with user details
   */
  getUserById: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  /**
   * Create a new user (admin only)
   * @param {Object} userData - User data
   * @returns {Promise} - Response with created user
   */
  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  /**
   * Update a user (admin only)
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} - Response with updated user
   */
  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  /**
   * Delete a user (admin only)
   * @param {string} userId - User ID
   * @returns {Promise} - Response with success message
   */
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  /**
   * Get instructors list
   * @returns {Promise} - Response with list of instructors
   */
  getInstructors: async () => {
    const response = await api.get('/admin/instructors');
    return response.data;
  },

  /**
   * Get students list
   * @returns {Promise} - Response with list of students
   */
  getStudents: async () => {
    const response = await api.get('/admin/students');
    return response.data;
  }
};

export default userService;
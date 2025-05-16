import api from './api';
import axios from 'axios';

const authService = {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Response with token and user data
   */
  // login: async (email, password) => {
  //   console.log("fvjnrfkj")
  //   const response = await api.post('/auth/login', { email, password });
  //   return response.data;
  // },

  // in authService.login
login: async (email, password) => {
  console.log('Calling login API with', email);
  const response = await axios.post('/api/auth/login', { email, password });
  console.log('Login API response:', response.data);
  return response.data;
},
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Response with user data
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Logout current user
   */
  logout: () => {
    localStorage.removeItem('token');
  },

  /**
   * Get current user profile
   * @returns {Promise} - Response with user profile data
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - Response with updated user data
   */
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  /**
   * Change user password
   * @param {Object} passwordData - Old and new password data
   * @returns {Promise} - Response with success message
   */
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/password', passwordData);
    return response.data;
  }
};

export default authService;
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

// Verify JWT token middleware
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Role-based access control middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied: insufficient permissions'
      });
    }
    next();
  };
};

// Admin only access middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Access denied: admin only'
    });
  }
  next();
};

// Instructor access middleware
const instructorOnly = (req, res, next) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Access denied: instructor only'
    });
  }
  next();
};

module.exports = {
  verifyToken,
  authorize,
  adminOnly,
  instructorOnly
};
const config = {
  // MongoDB connection string
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/lms',

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '24h'
  },

  // Server configuration
  server: {
    port: process.env.PORT || 5000
  },

  // Cors configuration
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  },

  // File upload configuration
  upload: {
    limits: {
      fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
    },
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf']
  }
};

module.exports = config;
# Learning Management System (LMS)

A comprehensive Learning Management System built with React and Node.js, featuring role-based access control for Admins, Instructors, and Students.

## Environment Variables

This project uses environment variables for configuration. These are stored in a `.env` file in the root directory.

### Available Environment Variables

| Variable | Description | Default |
|----------|-------------|--------|
| `MONGO_URI` | MongoDB connection string | mongodb://localhost:27017/lms |
| `JWT_SECRET` | Secret key for JWT token generation | (secure random string) |
| `PORT` | Port on which the server runs | 5000 |
| `CLIENT_URL` | URL of the client for CORS configuration | http://localhost:5173 |
| `NODE_ENV` | Environment mode (development, production, test) | development |
| `MAX_FILE_SIZE` | Maximum file upload size in bytes | 5242880 (5MB) |

### Setting Up Environment Variables

1. Create a `.env` file in the root directory of the project
2. Copy the variables from the table above and set their values
3. For production, make sure to:
   - Use a secure MongoDB connection string
   - Generate a strong random JWT secret
   - Set NODE_ENV to "production"

### Generating a Secure JWT Secret

For production, generate a secure random string for JWT_SECRET using Node.js:

```javascript
require('crypto').randomBytes(64).toString('hex')
```

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components
- Redux Toolkit for state management
- React Router for navigation
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- bcrypt for password hashing

## Project Structure
```
├── client/                 # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── features/       # Redux slices and logic
│   │   ├── services/       # API service calls
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Helper functions
│   └── package.json
├── server/                 # Backend Node.js application
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── utils/             # Helper functions
└── package.json           # Root package.json
```

## Features & Milestones

### Phase 1: Setup & Authentication
- Project structure setup
- User authentication system
- Role-based access control
- User profile management

### Phase 2: Course Management
- Course CRUD operations
- Course enrollment system
- Content management system
- Assignment creation and submission

### Phase 3: Learning Features
- Discussion forums
- Progress tracking
- Grade management
- File upload/download

### Phase 4: Advanced Features
- Real-time notifications
- Analytics dashboard
- Report generation
- Calendar integration

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:full
   ```
3. Set up environment variables:
   - Create `.env` file in root directory
   - Add necessary environment variables

4. Start the development servers:
   ```bash
   npm run dev:full
   ```

## User Roles

### Admin
- User management
- System configuration
- Analytics access
- Course oversight

### Instructor
- Course creation
- Content management
- Assignment management
- Grade management

### Student
- Course enrollment
- Assignment submission
- Progress tracking
- Discussion participation

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the ISC License - see the LICENSE file for details.
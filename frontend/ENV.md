# Frontend Environment Variables

This document describes the environment variables used in the frontend application.

## Configuration

Create a `.env` file in the frontend directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:5000    # Backend API URL

# Authentication Endpoints
VITE_AUTH_ENDPOINT=/api/auth          # Base auth endpoint
VITE_LOGIN_ENDPOINT=/api/auth/login   # Login endpoint
VITE_REGISTER_ENDPOINT=/api/auth/register # Registration endpoint

# Other Configuration
VITE_APP_NAME="Learning Management System" # Application name
VITE_APP_VERSION=1.0.0                # Application version
```

## Important Notes

1. All environment variables in Vite must be prefixed with `VITE_` to be exposed to the client-side code.
2. The values shown above are for development. Adjust them according to your environment.
3. Make sure to add `.env` to your `.gitignore` file to prevent sensitive information from being committed.
4. For production, use appropriate URLs and endpoints based on your deployment setup.

## Usage in Code

Access these variables in your React components using:

```javascript
import.meta.env.VITE_API_URL
import.meta.env.VITE_AUTH_ENDPOINT
// etc.
```
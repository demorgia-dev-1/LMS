# Admin API Documentation

This document provides examples of requests and responses for the Admin API endpoints.

## Authentication

All admin routes require authentication with a valid JWT token and admin role.

```
Header: Authorization: Bearer <jwt_token>
```

## Course Management

### Create Course

**Endpoint:** `POST /api/admin/courses`

**Request:**
```json
{
  "title": "Introduction to JavaScript",
  "description": "Learn the fundamentals of JavaScript programming",
  "instructor": "60d0fe4f5311236168a109ca",
  "startDate": "2023-09-01T00:00:00.000Z",
  "endDate": "2023-12-15T00:00:00.000Z",
  "category": "Programming",
  "prerequisites": ["Basic HTML knowledge"],
  "tags": ["javascript", "web development", "programming"],
  "isPublished": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109cb",
    "title": "Introduction to JavaScript",
    "description": "Learn the fundamentals of JavaScript programming",
    "instructor": "60d0fe4f5311236168a109ca",
    "startDate": "2023-09-01T00:00:00.000Z",
    "endDate": "2023-12-15T00:00:00.000Z",
    "category": "Programming",
    "prerequisites": ["Basic HTML knowledge"],
    "tags": ["javascript", "web development", "programming"],
    "isPublished": false,
    "enrolledStudents": [],
    "modules": [],
    "createdAt": "2023-08-15T10:30:00.000Z",
    "updatedAt": "2023-08-15T10:30:00.000Z"
  },
  "message": "Course created successfully"
}
```

### Get All Courses

**Endpoint:** `GET /api/admin/courses`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d0fe4f5311236168a109cb",
      "title": "Introduction to JavaScript",
      "description": "Learn the fundamentals of JavaScript programming",
      "instructor": {
        "_id": "60d0fe4f5311236168a109ca",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com"
      },
      "startDate": "2023-09-01T00:00:00.000Z",
      "endDate": "2023-12-15T00:00:00.000Z",
      "category": "Programming",
      "isPublished": false
    },
    {
      "_id": "60d0fe4f5311236168a109cc",
      "title": "Advanced React Development",
      "description": "Master React and Redux for frontend development",
      "instructor": {
        "_id": "60d0fe4f5311236168a109cd",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane.smith@example.com"
      },
      "startDate": "2023-10-01T00:00:00.000Z",
      "endDate": "2024-01-15T00:00:00.000Z",
      "category": "Web Development",
      "isPublished": true
    }
  ]
}
```

### Get Course by ID

**Endpoint:** `GET /api/admin/courses/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109cb",
    "title": "Introduction to JavaScript",
    "description": "Learn the fundamentals of JavaScript programming",
    "instructor": {
      "_id": "60d0fe4f5311236168a109ca",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    },
    "enrolledStudents": [
      {
        "_id": "60d0fe4f5311236168a109ce",
        "firstName": "Alice",
        "lastName": "Johnson",
        "email": "alice@example.com"
      }
    ],
    "modules": [
      {
        "title": "JavaScript Basics",
        "description": "Introduction to JavaScript syntax",
        "content": [
          {
            "type": "video",
            "title": "Variables and Data Types",
            "url": "https://example.com/videos/js-basics"
          }
        ]
      }
    ],
    "startDate": "2023-09-01T00:00:00.000Z",
    "endDate": "2023-12-15T00:00:00.000Z",
    "category": "Programming",
    "prerequisites": ["Basic HTML knowledge"],
    "tags": ["javascript", "web development", "programming"],
    "isPublished": false
  }
}
```

### Update Course

**Endpoint:** `PUT /api/admin/courses/:id`

**Request:**
```json
{
  "title": "Introduction to JavaScript Programming",
  "isPublished": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109cb",
    "title": "Introduction to JavaScript Programming",
    "description": "Learn the fundamentals of JavaScript programming",
    "instructor": {
      "_id": "60d0fe4f5311236168a109ca",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    },
    "startDate": "2023-09-01T00:00:00.000Z",
    "endDate": "2023-12-15T00:00:00.000Z",
    "category": "Programming",
    "prerequisites": ["Basic HTML knowledge"],
    "tags": ["javascript", "web development", "programming"],
    "isPublished": true
  },
  "message": "Course updated successfully"
}
```

### Delete Course

**Endpoint:** `DELETE /api/admin/courses/:id`

**Response:**
```json
{
  "success": true,
  "message": "Course and related enrollments deleted successfully"
}
```

## Instructor Management

### Get All Instructors

**Endpoint:** `GET /api/admin/instructors`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d0fe4f5311236168a109ca",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "instructor",
      "bio": "Experienced JavaScript developer with 10 years of teaching experience",
      "courses": [
        {
          "_id": "60d0fe4f5311236168a109cb",
          "title": "Introduction to JavaScript"
        }
      ]
    },
    {
      "_id": "60d0fe4f5311236168a109cd",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "role": "instructor",
      "bio": "Frontend specialist with focus on React and modern JavaScript",
      "courses": [
        {
          "_id": "60d0fe4f5311236168a109cc",
          "title": "Advanced React Development"
        }
      ]
    }
  ]
}
```

### Assign Instructor to Course

**Endpoint:** `PUT /api/admin/courses/:courseId/instructor/:instructorId`

**Response:**
```json
{
  "success": true,
  "message": "Instructor assigned to course successfully",
  "data": {
    "courseId": "60d0fe4f5311236168a109cb",
    "instructorId": "60d0fe4f5311236168a109cd",
    "instructorName": "Jane Smith"
  }
}
```

### Unassign Instructor from Course

**Endpoint:** `DELETE /api/admin/courses/:courseId/instructor`

**Response:**
```json
{
  "success": true,
  "message": "Instructor unassigned from course successfully",
  "data": {
    "courseId": "60d0fe4f5311236168a109cb",
    "previousInstructorId": "60d0fe4f5311236168a109cd"
  }
}
```

## User & Enrollment Management

### Get All Users

**Endpoint:** `GET /api/admin/users`

**Response:**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "_id": "60d0fe4f5311236168a109ca",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "instructor",
      "courses": [
        {
          "_id": "60d0fe4f5311236168a109cb",
          "title": "Introduction to JavaScript"
        }
      ]
    },
    {
      "_id": "60d0fe4f5311236168a109cd",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "role": "instructor",
      "courses": [
        {
          "_id": "60d0fe4f5311236168a109cc",
          "title": "Advanced React Development"
        }
      ]
    },
    {
      "_id": "60d0fe4f5311236168a109ce",
      "firstName": "Alice",
      "lastName": "Johnson",
      "email": "alice@example.com",
      "role": "student",
      "courses": [
        {
          "_id": "60d0fe4f5311236168a109cb",
          "title": "Introduction to JavaScript"
        }
      ]
    },
    {
      "_id": "60d0fe4f5311236168a109cf",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@example.com",
      "role": "admin",
      "courses": []
    }
  ]
}
```

### Get All Enrollments

**Endpoint:** `GET /api/admin/enrollments`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d0fe4f5311236168a109d0",
      "userId": {
        "_id": "60d0fe4f5311236168a109ce",
        "firstName": "Alice",
        "lastName": "Johnson",
        "email": "alice@example.com"
      },
      "courseId": {
        "_id": "60d0fe4f5311236168a109cb",
        "title": "Introduction to JavaScript"
      },
      "enrollmentDate": "2023-08-20T00:00:00.000Z",
      "progress": 25,
      "isCompleted": false
    },
    {
      "_id": "60d0fe4f5311236168a109d1",
      "userId": {
        "_id": "60d0fe4f5311236168a109d2",
        "firstName": "Bob",
        "lastName": "Williams",
        "email": "bob@example.com"
      },
      "courseId": {
        "_id": "60d0fe4f5311236168a109cc",
        "title": "Advanced React Development"
      },
      "enrollmentDate": "2023-08-15T00:00:00.000Z",
      "progress": 10,
      "isCompleted": false
    }
  ]
}
```

### Get Course Enrollments

**Endpoint:** `GET /api/admin/courses/:courseId/enrollments`

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "60d0fe4f5311236168a109d0",
      "userId": {
        "_id": "60d0fe4f5311236168a109ce",
        "firstName": "Alice",
        "lastName": "Johnson",
        "email": "alice@example.com"
      },
      "courseId": {
        "_id": "60d0fe4f5311236168a109cb",
        "title": "Introduction to JavaScript"
      },
      "enrollmentDate": "2023-08-20T00:00:00.000Z",
      "progress": 25,
      "isCompleted": false
    }
  ]
}
```
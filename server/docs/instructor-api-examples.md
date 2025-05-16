# Instructor API Documentation

This document provides examples of requests and responses for the Instructor API endpoints.

## Authentication

All instructor routes require authentication with a valid JWT token and instructor role.

```
Header: Authorization: Bearer <jwt_token>
```

## Course Management

### Get Instructor Courses

**Endpoint:** `GET /api/instructor/courses`

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
      "startDate": "2023-09-01T00:00:00.000Z",
      "endDate": "2023-12-15T00:00:00.000Z",
      "category": "Programming",
      "isPublished": false
    },
    {
      "_id": "60d0fe4f5311236168a109cc",
      "title": "Advanced React Development",
      "description": "Master React and Redux for frontend development",
      "startDate": "2023-10-01T00:00:00.000Z",
      "endDate": "2024-01-15T00:00:00.000Z",
      "category": "Web Development",
      "isPublished": true
    }
  ]
}
```

### Get Course with Lessons

**Endpoint:** `GET /api/instructor/courses/:courseId`

**Response:**
```json
{
  "success": true,
  "data": {
    "course": {
      "_id": "60d0fe4f5311236168a109cb",
      "title": "Introduction to JavaScript",
      "description": "Learn the fundamentals of JavaScript programming",
      "startDate": "2023-09-01T00:00:00.000Z",
      "endDate": "2023-12-15T00:00:00.000Z",
      "category": "Programming",
      "isPublished": false
    },
    "lessons": [
      {
        "_id": "60d0fe4f5311236168a109d3",
        "courseId": "60d0fe4f5311236168a109cb",
        "title": "JavaScript Basics",
        "description": "Introduction to JavaScript syntax",
        "content": "<p>JavaScript is a programming language...</p>",
        "order": 1,
        "duration": 45,
        "videoUrl": "https://example.com/videos/js-basics",
        "attachments": ["https://example.com/files/js-cheatsheet.pdf"],
        "isPublished": true,
        "createdAt": "2023-08-15T10:30:00.000Z",
        "updatedAt": "2023-08-15T10:30:00.000Z"
      }
    ]
  }
}
```

## Lesson Management

### Create Lesson

**Endpoint:** `POST /api/instructor/courses/:courseId/lessons`

**Request:**
```json
{
  "title": "Variables and Data Types",
  "description": "Learn about JavaScript variables and primitive data types",
  "content": "<p>In this lesson, we will cover variables and data types in JavaScript...</p>",
  "order": 2,
  "duration": 30,
  "videoUrl": "https://example.com/videos/js-variables",
  "attachments": ["https://example.com/files/variables-cheatsheet.pdf"],
  "isPublished": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109d4",
    "courseId": "60d0fe4f5311236168a109cb",
    "title": "Variables and Data Types",
    "description": "Learn about JavaScript variables and primitive data types",
    "content": "<p>In this lesson, we will cover variables and data types in JavaScript...</p>",
    "order": 2,
    "duration": 30,
    "videoUrl": "https://example.com/videos/js-variables",
    "attachments": ["https://example.com/files/variables-cheatsheet.pdf"],
    "isPublished": false,
    "createdAt": "2023-08-16T10:30:00.000Z",
    "updatedAt": "2023-08-16T10:30:00.000Z"
  },
  "message": "Lesson created successfully"
}
```

### Update Lesson

**Endpoint:** `PUT /api/instructor/lessons/:lessonId`

**Request:**
```json
{
  "title": "JavaScript Variables and Data Types",
  "isPublished": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109d4",
    "courseId": "60d0fe4f5311236168a109cb",
    "title": "JavaScript Variables and Data Types",
    "description": "Learn about JavaScript variables and primitive data types",
    "content": "<p>In this lesson, we will cover variables and data types in JavaScript...</p>",
    "order": 2,
    "duration": 30,
    "videoUrl": "https://example.com/videos/js-variables",
    "attachments": ["https://example.com/files/variables-cheatsheet.pdf"],
    "isPublished": true,
    "createdAt": "2023-08-16T10:30:00.000Z",
    "updatedAt": "2023-08-16T11:15:00.000Z"
  },
  "message": "Lesson updated successfully"
}
```

### Delete Lesson

**Endpoint:** `DELETE /api/instructor/lessons/:lessonId`

**Response:**
```json
{
  "success": true,
  "message": "Lesson and associated quizzes deleted successfully"
}
```

## Quiz Management

### Create Quiz

**Endpoint:** `POST /api/instructor/lessons/:lessonId/quizzes`

**Request:**
```json
{
  "title": "JavaScript Variables Quiz",
  "description": "Test your knowledge of JavaScript variables and data types",
  "timeLimit": 15,
  "passingScore": 80,
  "isPublished": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109d5",
    "lessonId": "60d0fe4f5311236168a109d4",
    "title": "JavaScript Variables Quiz",
    "description": "Test your knowledge of JavaScript variables and data types",
    "timeLimit": 15,
    "passingScore": 80,
    "isPublished": false,
    "questions": [],
    "createdAt": "2023-08-16T14:30:00.000Z",
    "updatedAt": "2023-08-16T14:30:00.000Z"
  },
  "message": "Quiz created successfully"
}
```

### Add Question to Quiz

**Endpoint:** `POST /api/instructor/quizzes/:quizId/questions`

**Request for Multiple Choice Question:**
```json
{
  "questionText": "Which of the following is NOT a primitive data type in JavaScript?",
  "questionType": "multiple-choice",
  "options": [
    { "text": "String", "isCorrect": false },
    { "text": "Number", "isCorrect": false },
    { "text": "Boolean", "isCorrect": false },
    { "text": "Array", "isCorrect": true }
  ],
  "points": 2,
  "order": 1
}
```

**Request for True/False Question:**
```json
{
  "questionText": "JavaScript is a statically typed language.",
  "questionType": "true-false",
  "correctAnswer": "false",
  "points": 1,
  "order": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109d6",
    "quizId": "60d0fe4f5311236168a109d5",
    "questionText": "Which of the following is NOT a primitive data type in JavaScript?",
    "questionType": "multiple-choice",
    "options": [
      { "text": "String", "isCorrect": false },
      { "text": "Number", "isCorrect": false },
      { "text": "Boolean", "isCorrect": false },
      { "text": "Array", "isCorrect": true }
    ],
    "points": 2,
    "order": 1,
    "createdAt": "2023-08-16T14:45:00.000Z",
    "updatedAt": "2023-08-16T14:45:00.000Z"
  },
  "message": "Question added to quiz successfully"
}
```

### Get Quiz with Questions

**Endpoint:** `GET /api/instructor/quizzes/:quizId`

**Response:**
```json
{
  "success": true,
  "data": {
    "quiz": {
      "_id": "60d0fe4f5311236168a109d5",
      "lessonId": "60d0fe4f5311236168a109d4",
      "title": "JavaScript Variables Quiz",
      "description": "Test your knowledge of JavaScript variables and data types",
      "timeLimit": 15,
      "passingScore": 80,
      "isPublished": false,
      "questions": ["60d0fe4f5311236168a109d6", "60d0fe4f5311236168a109d7"],
      "createdAt": "2023-08-16T14:30:00.000Z",
      "updatedAt": "2023-08-16T15:00:00.000Z"
    },
    "questions": [
      {
        "_id": "60d0fe4f5311236168a109d6",
        "quizId": "60d0fe4f5311236168a109d5",
        "questionText": "Which of the following is NOT a primitive data type in JavaScript?",
        "questionType": "multiple-choice",
        "options": [
          { "text": "String", "isCorrect": false },
          { "text": "Number", "isCorrect": false },
          { "text": "Boolean", "isCorrect": false },
          { "text": "Array", "isCorrect": true }
        ],
        "points": 2,
        "order": 1
      },
      {
        "_id": "60d0fe4f5311236168a109d7",
        "quizId": "60d0fe4f5311236168a109d5",
        "questionText": "JavaScript is a statically typed language.",
        "questionType": "true-false",
        "correctAnswer": "false",
        "points": 1,
        "order": 2
      }
    ]
  }
}
```

## Student and Enrollment Management

### Get Course Enrollments

**Endpoint:** `GET /api/instructor/courses/:courseId/enrollments`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d0fe4f5311236168a109d8",
      "userId": {
        "_id": "60d0fe4f5311236168a109ce",
        "firstName": "Alice",
        "lastName": "Johnson",
        "email": "alice@example.com"
      },
      "enrollmentDate": "2023-08-20T00:00:00.000Z",
      "progress": 25,
      "isCompleted": false
    },
    {
      "_id": "60d0fe4f5311236168a109d9",
      "userId": {
        "_id": "60d0fe4f5311236168a109d2",
        "firstName": "Bob",
        "lastName": "Williams",
        "email": "bob@example.com"
      },
      "enrollmentDate": "2023-08-15T00:00:00.000Z",
      "progress": 10,
      "isCompleted": false
    }
  ]
}
```

### Get Quiz Results

**Endpoint:** `GET /api/instructor/quizzes/:quizId/results`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d0fe4f5311236168a109da",
      "userId": {
        "_id": "60d0fe4f5311236168a109ce",
        "firstName": "Alice",
        "lastName": "Johnson",
        "email": "alice@example.com"
      },
      "startTime": "2023-08-25T14:30:00.000Z",
      "endTime": "2023-08-25T14:42:00.000Z",
      "score": 85,
      "isPassed": true,
      "answers": [
        {
          "questionId": "60d0fe4f5311236168a109d6",
          "userAnswer": "Array",
          "isCorrect": true,
          "pointsEarned": 2
        },
        {
          "questionId": "60d0fe4f5311236168a109d7",
          "userAnswer": "false",
          "isCorrect": true,
          "pointsEarned": 1
        }
      ]
    },
    {
      "_id": "60d0fe4f5311236168a109db",
      "userId": {
        "_id": "60d0fe4f5311236168a109d2",
        "firstName": "Bob",
        "lastName": "Williams",
        "email": "bob@example.com"
      },
      "startTime": "2023-08-26T10:15:00.000Z",
      "endTime": "2023-08-26T10:25:00.000Z",
      "score": 50,
      "isPassed": false,
      "answers": [
        {
          "questionId": "60d0fe4f5311236168a109d6",
          "userAnswer": "String",
          "isCorrect": false,
          "pointsEarned": 0
        },
        {
          "questionId": "60d0fe4f5311236168a109d7",
          "userAnswer": "false",
          "isCorrect": true,
          "pointsEarned": 1
        }
      ]
    }
  ]
}
```

### Get Student Performance

**Endpoint:** `GET /api/instructor/courses/:courseId/students/:studentId`

**Response:**
```json
{
  "success": true,
  "data": {
    "student": {
      "_id": "60d0fe4f5311236168a109ce",
      "firstName": "Alice",
      "lastName": "Johnson",
      "email": "alice@example.com"
    },
    "enrollment": {
      "_id": "60d0fe4f5311236168a109d8",
      "enrollmentDate": "2023-08-20T00:00:00.000Z",
      "progress": 25,
      "isCompleted": false
    },
    "quizAttempts": [
      {
        "_id": "60d0fe4f5311236168a109da",
        "quizId": "60d0fe4f5311236168a109d5",
        "startTime": "2023-08-25T14:30:00.000Z",
        "endTime": "2023-08-25T14:42:00.000Z",
        "score": 85,
        "isPassed": true
      }
    ]
  }
}
```
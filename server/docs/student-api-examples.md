# Student API Documentation

This document provides examples of requests and responses for the Student API endpoints.

## Authentication

All student routes require authentication with a valid JWT token and student role.

```
Header: Authorization: Bearer <jwt_token>
```

## Course Management

### Enroll in a Course

**Endpoint:** `POST /api/student/courses/:courseId/enroll`

**Request:** No request body needed

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109d8",
    "userId": "60d0fe4f5311236168a109ce",
    "courseId": "60d0fe4f5311236168a109cb",
    "enrollmentDate": "2023-08-20T00:00:00.000Z",
    "progress": 0,
    "isCompleted": false
  },
  "message": "Successfully enrolled in course"
}
```

### Get Enrolled Courses

**Endpoint:** `GET /api/student/courses`

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
      "enrollmentId": "60d0fe4f5311236168a109d8",
      "enrollmentDate": "2023-08-20T00:00:00.000Z",
      "progress": 25,
      "isCompleted": false
    },
    {
      "_id": "60d0fe4f5311236168a109cc",
      "title": "Advanced React Development",
      "description": "Master React and Redux for frontend development",
      "startDate": "2023-10-01T00:00:00.000Z",
      "endDate": "2024-01-15T00:00:00.000Z",
      "category": "Web Development",
      "enrollmentId": "60d0fe4f5311236168a109d9",
      "enrollmentDate": "2023-08-15T00:00:00.000Z",
      "progress": 10,
      "isCompleted": false
    }
  ]
}
```

### Get Course Content

**Endpoint:** `GET /api/student/courses/:courseId`

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
      "category": "Programming"
    },
    "enrollment": {
      "enrollmentDate": "2023-08-20T00:00:00.000Z",
      "progress": 25,
      "isCompleted": false
    },
    "lessons": [
      {
        "_id": "60d0fe4f5311236168a109d3",
        "title": "JavaScript Basics",
        "description": "Introduction to JavaScript syntax",
        "order": 1,
        "duration": 45,
        "videoUrl": "https://example.com/videos/js-basics",
        "attachments": ["https://example.com/files/js-cheatsheet.pdf"],
        "isCompleted": true,
        "lastAccessed": "2023-08-25T14:30:00.000Z"
      },
      {
        "_id": "60d0fe4f5311236168a109d4",
        "title": "Variables and Data Types",
        "description": "Learn about JavaScript variables and primitive data types",
        "order": 2,
        "duration": 30,
        "videoUrl": "https://example.com/videos/js-variables",
        "attachments": ["https://example.com/files/variables-cheatsheet.pdf"],
        "isCompleted": false,
        "lastAccessed": null
      }
    ],
    "quizzes": [
      {
        "_id": "60d0fe4f5311236168a109d5",
        "title": "JavaScript Variables Quiz",
        "description": "Test your knowledge of JavaScript variables and data types",
        "lessonId": "60d0fe4f5311236168a109d4",
        "timeLimit": 15,
        "passingScore": 80,
        "attempts": [
          {
            "_id": "60d0fe4f5311236168a109da",
            "startTime": "2023-08-25T14:30:00.000Z",
            "endTime": "2023-08-25T14:42:00.000Z",
            "score": 85,
            "isPassed": true
          }
        ],
        "bestScore": 85,
        "isPassed": true
      }
    ]
  }
}
```

## Lesson Management

### Get Lesson Content

**Endpoint:** `GET /api/student/lessons/:lessonId`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109d3",
    "title": "JavaScript Basics",
    "description": "Introduction to JavaScript syntax",
    "content": "<p>JavaScript is a programming language...</p>",
    "order": 1,
    "duration": 45,
    "videoUrl": "https://example.com/videos/js-basics",
    "attachments": ["https://example.com/files/js-cheatsheet.pdf"],
    "progress": {
      "isCompleted": true,
      "lastAccessed": "2023-08-25T14:30:00.000Z"
    }
  }
}
```

### Mark Lesson as Completed

**Endpoint:** `PUT /api/student/lessons/:lessonId/complete`

**Request:** No request body needed

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109e1",
    "userId": "60d0fe4f5311236168a109ce",
    "lessonId": "60d0fe4f5311236168a109d3",
    "lastAccessed": "2023-08-25T15:30:00.000Z",
    "isCompleted": true
  },
  "message": "Lesson marked as completed"
}
```

## Quiz Management

### Get Quiz with Questions

**Endpoint:** `GET /api/student/quizzes/:quizId`

**Response:**
```json
{
  "success": true,
  "data": {
    "quiz": {
      "_id": "60d0fe4f5311236168a109d5",
      "title": "JavaScript Variables Quiz",
      "description": "Test your knowledge of JavaScript variables and data types",
      "timeLimit": 15,
      "passingScore": 80,
      "totalQuestions": 2,
      "totalPoints": 3
    },
    "questions": [
      {
        "_id": "60d0fe4f5311236168a109d6",
        "questionText": "Which of the following is NOT a primitive data type in JavaScript?",
        "questionType": "multiple-choice",
        "options": [
          { "text": "String" },
          { "text": "Number" },
          { "text": "Boolean" },
          { "text": "Array" }
        ],
        "points": 2,
        "order": 1
      },
      {
        "_id": "60d0fe4f5311236168a109d7",
        "questionText": "JavaScript is a statically typed language.",
        "questionType": "true-false",
        "points": 1,
        "order": 2
      }
    ],
    "previousAttempts": [
      {
        "_id": "60d0fe4f5311236168a109da",
        "startTime": "2023-08-25T14:30:00.000Z",
        "endTime": "2023-08-25T14:42:00.000Z",
        "score": 85,
        "isPassed": true
      }
    ]
  }
}
```

### Start Quiz Attempt

**Endpoint:** `POST /api/student/quizzes/:quizId/start`

**Request:** No request body needed

**Response:**
```json
{
  "success": true,
  "data": {
    "attemptId": "60d0fe4f5311236168a109db",
    "startTime": "2023-08-26T10:15:00.000Z",
    "timeLimit": 15
  },
  "message": "Quiz attempt started"
}
```

### Submit Quiz Answers

**Endpoint:** `POST /api/student/quizzes/attempts/:attemptId/submit`

**Request:**
```json
{
  "answers": [
    {
      "questionId": "60d0fe4f5311236168a109d6",
      "answer": "Array"
    },
    {
      "questionId": "60d0fe4f5311236168a109d7",
      "answer": "false"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "attemptId": "60d0fe4f5311236168a109db",
    "startTime": "2023-08-26T10:15:00.000Z",
    "endTime": "2023-08-26T10:25:00.000Z",
    "score": 100,
    "isPassed": true,
    "totalQuestions": 2,
    "correctAnswers": 2,
    "feedback": [
      {
        "questionId": "60d0fe4f5311236168a109d6",
        "questionText": "Which of the following is NOT a primitive data type in JavaScript?",
        "userAnswer": "Array",
        "isCorrect": true,
        "pointsEarned": 2,
        "correctAnswer": "Array"
      },
      {
        "questionId": "60d0fe4f5311236168a109d7",
        "questionText": "JavaScript is a statically typed language.",
        "userAnswer": "false",
        "isCorrect": true,
        "pointsEarned": 1,
        "correctAnswer": "false"
      }
    ]
  },
  "message": "Quiz submitted. Your score: 100%. Congratulations! You passed!"
}
```
# Job Board API

A RESTful API for a job board platform that connects job seekers with employers.

## Features

- User authentication with JWT
- Role-based access control (candidates and companies)
- Job posting and application management
- Profile management for users
- Job search and filtering capabilities
- Saved jobs functionality for candidates

## Technologies

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v14+)
- MongoDB

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/job-board-backend.git
cd job-board-backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job-board
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

4. Start the development server
```bash
npm run dev
```

## API Documentation

### Authentication

#### Register a New User

```
POST /api/auth/register
```

Create a new user account (candidate or company).

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "candidate" // Optional, defaults to "candidate" if not provided
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5e4a378f6e7a7a8f4a7c3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate"
  }
}
```

#### Login

```
POST /api/auth/login
```

Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5e4a378f6e7a7a8f4a7c3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate"
  }
}
```

#### Get Current User

```
GET /api/auth/me
```

Retrieve the authenticated user's details.

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "60d5e4a378f6e7a7a8f4a7c3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate",
    "profilePicture": "https://example.com/profile.jpg",
    "skills": ["JavaScript", "React", "Node.js"],
    "savedJobs": ["60d5e4a378f6e7a7a8f4a7c4"]
  }
}
```

### User Management

#### Update Profile

```
PUT /api/users/profile
```

Update authenticated user's profile information.

**Request Body (Candidate):**
```json
{
  "name": "John Smith",
  "profilePicture": "https://example.com/profile.jpg",
  "skills": ["JavaScript", "React", "Node.js"]
}
```

**Request Body (Company):**
```json
{
  "name": "Acme Inc",
  "companyName": "Acme Corporation",
  "logo": "https://example.com/logo.jpg",
  "description": "Leading technology company",
  "website": "https://acme.com",
  "location": "San Francisco, CA"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5e4a378f6e7a7a8f4a7c3",
    "name": "John Smith",
    "email": "john@example.com",
    "role": "candidate",
    "profilePicture": "https://example.com/profile.jpg",
    "skills": ["JavaScript", "React", "Node.js"]
  }
}
```

#### Save a Job (Candidates Only)

```
POST /api/users/jobs/:jobId/save
```

Save a job posting to favorites.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Job saved successfully"
}
```

#### Unsave a Job (Candidates Only)

```
DELETE /api/users/jobs/:jobId/unsave
```

Remove a job from saved jobs.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Job removed from saved jobs"
}
```

#### Get Saved Jobs (Candidates Only)

```
GET /api/users/saved-jobs
```

Get all jobs saved by the authenticated candidate.

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d5e4a378f6e7a7a8f4a7c4",
      "title": "Frontend Developer",
      "location": "San Francisco, CA",
      "jobType": "full-time",
      "salary": 120000,
      "postedDate": "2023-08-15T18:30:00.000Z",
      "companyId": {
        "companyName": "Acme Corporation",
        "logo": "https://example.com/logo.jpg"
      }
    }
  ]
}
```

### Jobs

#### Create a Job (Companies Only)

```
POST /api/jobs
```

Create a new job posting.

**Request Body:**
```json
{
  "title": "Frontend Developer",
  "description": "We are looking for a skilled Frontend Developer...",
  "location": "San Francisco, CA",
  "jobType": "full-time",
  "salary": 120000,
  "requiredSkills": ["JavaScript", "React", "CSS"],
  "deadlineDate": "2023-09-30T23:59:59.999Z"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5e4a378f6e7a7a8f4a7c4",
    "title": "Frontend Developer",
    "description": "We are looking for a skilled Frontend Developer...",
    "companyId": "60d5e4a378f6e7a7a8f4a7c3",
    "location": "San Francisco, CA",
    "jobType": "full-time",
    "salary": 120000,
    "requiredSkills": ["JavaScript", "React", "CSS"],
    "postedDate": "2023-08-15T18:30:00.000Z",
    "deadlineDate": "2023-09-30T23:59:59.999Z",
    "isActive": true
  }
}
```

#### Get All Jobs

```
GET /api/jobs
```

Retrieve all active job listings with optional filtering.

**Query Parameters:**
- `search`: Search by title, description, or skills
- `location`: Filter by location
- `jobType`: Filter by job type (full-time, part-time, contract, internship, remote)
- `skills`: Filter by required skills (comma-separated)
- `page`: Page number for pagination (default: 1)
- `limit`: Number of results per page (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "total": 25,
  "pagination": {
    "currentPage": 1,
    "totalPages": 3
  },
  "data": [
    {
      "_id": "60d5e4a378f6e7a7a8f4a7c4",
      "title": "Frontend Developer",
      "companyId": {
        "name": "Acme Inc",
        "companyName": "Acme Corporation",
        "logo": "https://example.com/logo.jpg",
        "location": "San Francisco, CA"
      },
      "location": "San Francisco, CA",
      "jobType": "full-time",
      "salary": 120000,
      "postedDate": "2023-08-15T18:30:00.000Z"
    }
  ]
}
```

#### Get a Single Job

```
GET /api/jobs/:id
```

Retrieve a specific job by ID.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5e4a378f6e7a7a8f4a7c4",
    "title": "Frontend Developer",
    "description": "We are looking for a skilled Frontend Developer...",
    "companyId": {
      "name": "Acme Inc",
      "companyName": "Acme Corporation",
      "logo": "https://example.com/logo.jpg",
      "location": "San Francisco, CA",
      "description": "Leading technology company",
      "website": "https://acme.com"
    },
    "requiredSkills": ["JavaScript", "React", "CSS"],
    "location": "San Francisco, CA",
    "jobType": "full-time",
    "salary": 120000,
    "postedDate": "2023-08-15T18:30:00.000Z",
    "deadlineDate": "2023-09-30T23:59:59.999Z",
    "isActive": true
  }
}
```

#### Update a Job (Companies Only)

```
PUT /api/jobs/:id
```

Update a job posting.

**Request Body:**
```json
{
  "title": "Senior Frontend Developer",
  "salary": 140000,
  "isActive": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5e4a378f6e7a7a8f4a7c4",
    "title": "Senior Frontend Developer",
    "description": "We are looking for a skilled Frontend Developer...",
    "salary": 140000,
    "isActive": true
    // other job fields
  }
}
```

#### Delete a Job (Companies Only)

```
DELETE /api/jobs/:id
```

Delete a job posting.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {}
}
```

#### Get Company Jobs (Companies Only)

```
GET /api/jobs/company/myjobs
```

Get all jobs posted by the authenticated company.

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d5e4a378f6e7a7a8f4a7c4",
      "title": "Frontend Developer",
      "location": "San Francisco, CA",
      "jobType": "full-time",
      "salary": 120000,
      "postedDate": "2023-08-15T18:30:00.000Z",
      "isActive": true
    }
  ]
}
```

### Applications

#### Apply for a Job (Candidates Only)

```
POST /api/applications/jobs/:jobId/apply
```

Submit a job application.

**Request Body:**
```json
{
  "coverLetter": "I am excited to apply for this position...",
  "resumeLink": "https://example.com/resume.pdf"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5e4a378f6e7a7a8f4a7c5",
    "jobId": "60d5e4a378f6e7a7a8f4a7c4",
    "candidateId": "60d5e4a378f6e7a7a8f4a7c3",
    "coverLetter": "I am excited to apply for this position...",
    "resumeLink": "https://example.com/resume.pdf",
    "status": "pending",
    "appliedDate": "2023-08-16T10:15:30.000Z"
  }
}
```

#### Get My Applications (Candidates Only)

```
GET /api/applications/my-applications
```

Get all applications submitted by the authenticated candidate.

**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "60d5e4a378f6e7a7a8f4a7c5",
      "jobId": {
        "title": "Frontend Developer",
        "location": "San Francisco, CA",
        "jobType": "full-time",
        "salary": 120000,
        "companyId": {
          "companyName": "Acme Corporation",
          "logo": "https://example.com/logo.jpg"
        }
      },
      "status": "pending",
      "appliedDate": "2023-08-16T10:15:30.000Z"
    }
  ]
}
```

#### Get Job Applications (Companies Only)

```
GET /api/applications/jobs/:jobId
```

Get all applications for a specific job posted by the authenticated company.

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d5e4a378f6e7a7a8f4a7c5",
      "jobId": "60d5e4a378f6e7a7a8f4a7c4",
      "candidateId": {
        "name": "John Doe",
        "email": "john@example.com",
        "profilePicture": "https://example.com/profile.jpg",
        "skills": ["JavaScript", "React", "Node.js"]
      },
      "status": "pending",
      "appliedDate": "2023-08-16T10:15:30.000Z"
    }
  ]
}
```

#### Update Application Status (Companies Only)

```
PUT /api/applications/:id/status
```

Update the status of a job application.

**Request Body:**
```json
{
  "status": "reviewed" // Options: pending, reviewed, rejected, accepted
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5e4a378f6e7a7a8f4a7c5",
    "jobId": "60d5e4a378f6e7a7a8f4a7c4",
    "candidateId": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "status": "reviewed",
    "appliedDate": "2023-08-16T10:15:30.000Z"
  }
}
```

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error message describing the issue"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## License

MIT

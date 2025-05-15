# FILE ROUGE FINAL

# Job Board - Plateforme de Recherche d'Emploi

### Job Board Backend API

- A feature-rich RESTful API built with Express.js and MongoDB for a job board application where companies can post jobs and candidates can apply.

### Job Board Frontend

- A modern job marketplace application connecting job seekers with employers. This React-based frontend application provides a comprehensive interface for job searching, application management, and job posting.

## Table of Contents

- [FILE ROUGE FINAL](#file-rouge-final)
- [Job Board - Plateforme de Recherche d'Emploi](#job-board---plateforme-de-recherche-demploi)
    - [Job Board Backend API](#job-board-backend-api)
    - [Job Board Frontend](#job-board-frontend)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Key Features](#key-features)
    - [Front-end](#front-end)
    - [Back-end](#back-end)
  - [Tech Stack](#tech-stack)
    - [Front-end](#front-end-1)
    - [Back-end](#back-end-1)
  - [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
    - [Jobs](#jobs)
    - [Applications](#applications)
    - [Users](#users)
  - [Database Models](#database-models)
    - [User](#user)
    - [Job](#job)
    - [Application](#application)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Running the Server](#running-the-server)
    - [Authentication API](#authentication-api)
      - [Register a new user](#register-a-new-user)
      - [Login a user](#login-a-user)
    - [Jobs API](#jobs-api)
      - [Get all jobs (with filtering)](#get-all-jobs-with-filtering)
      - [Create a new job (company only)](#create-a-new-job-company-only)
  - [Project Structure](#project-structure)
  - [Authentication and Authorization](#authentication-and-authorization)
  - [Error Handling](#error-handling)
  - [Development](#development)
  - [License](#license)
- [Author: Youssef HAMMANI ](#author-youssef-hammani-)

## Overview
Job Board is a web application that connects job seekers with employers. The application allows companies to post jobs
and candidates to apply for these jobs. The application is built using React for the frontend and Express.js
for the backend.

## Key Features

### Front-end

- **For Job Seekers**
  - Browse and search jobs with advanced filtering
  - Save favorite job listings
  - Apply to jobs with resume and cover letter
  - Track application status
  - Manage personal profile and skills

- **For Employers**
  - Create and manage job postings
  - View and evaluate applicants
  - Update application status (reviewed, accepted, rejected)
  - Company profile management

### Back-end

- **Authentication**
  - User registration (candidates and companies)
  - User login with JWT
  - Protected routes with role-based access control

- **User Management**
  - Profile management
  - Role-based permissions

- **Job Management**
  - Create, read, update, and delete jobs
  - Advanced job search with filters (title, location, skills, job type)
  - Pagination for job listings

- **Application Management**
  - Apply for jobs
  - Track application status
  - Manage applications (for companies)

- **Additional Features**
  - Save/unsave jobs for candidates
  - Company job management dashboard

## Tech Stack

### Front-end

- **React 19** - UI library
- **React Router v7** - Routing
- **Tailwind CSS** - Styling
- **Axios** - API requests
- **Vite** - Build tool and development server### Front-end

### Back-end

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling tool
- **JWT** - Authentication mechanism
- **bcrypt** - Password encryption

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user profile

### Jobs

- `GET /api/jobs` - Get all jobs (with filtering)
- `GET /api/jobs/:id` - Get a specific job
- `POST /api/jobs` - Create a new job (company only)
- `PUT /api/jobs/:id` - Update a job (company only)
- `DELETE /api/jobs/:id` - Delete a job (company only)
- `GET /api/jobs/company/myjobs` - Get all jobs posted by the company (company only)

### Applications

- `POST /api/applications/jobs/:jobId/apply` - Apply for a job (candidate only)
- `GET /api/applications/my-applications` - Get all applications submitted by the candidate (candidate only)
- `GET /api/applications/jobs/:jobId` - Get all applications for a specific job (company only)
- `PUT /api/applications/:id/status` - Update application status (company only)

### Users

- `PUT /api/users/profile` - Update user profile
- `POST /api/users/jobs/:jobId/save` - Save a job (candidate only)
- `DELETE /api/users/jobs/:jobId/unsave` - Unsave a job (candidate only)
- `GET /api/users/saved-jobs` - Get all saved jobs (candidate only)

## Database Models

### User

- General fields: name, email, password, role, profilePicture
- Company-specific fields: companyName, description, logo, location, website
- Candidate-specific fields: skills, resume, savedJobs

### Job

- Basic info: title, description, location, jobType
- Details: requiredSkills, salary, postedDate, deadlineDate, isActive
- Relationships: companyId, applications (virtual)

### Application

- Core data: jobId, candidateId, status
- Details: coverLetter, resumeLink, appliedDate

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- MongoDB instance (local or Atlas)
- npm or yarn package manager

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/youssefhammani/file-rouge-final.git

   cd file-rouge-final.git
   ```

2. Install dependencies

   ```bash
   # Install Backend dependencies
    cd job-board-backend

    npm install

    # Install Frontend dependencies
    cd ../job-board-frontend
    
    npm install
   ```

### Environment Variables

- **Back-end `.env`**

  - Create a `.env` file in the root directory with the following variables:

    ```bash
    # Server Configuration
    PORT=5000
    NODE_ENV=development

    # MongoDB Configuration
    MONGODB_URI=mongodb://localhost:27017/job-board

    # JWT Configuration
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRE=30d
    ```

- **Front-end `.env`**

  - Create a `.env` file in the root directory and add the API URL

    ```bash
    VITE_API_URL=http://localhost:5000/api
    # or your deployed backend URL
    ```

### Running the Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

- **Note:**

  - *Frontend: Open your browser and navigate to http://localhost:5173 to view the frontend application.*

  - *Backend: Ensure the server is running by navigating to http://localhost:5000 or using tools like `Postman` to test the API endpoints.*

### Authentication API

#### Register a new user

```http
POST /api/auth/register
```

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "candidate" // or "company"
}
```

Response:

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate"
  }
}
```

#### Login a user

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate"
  }
}
```

### Jobs API

#### Get all jobs (with filtering)

```http
GET /api/jobs?search=developer&location=remote&jobType=full-time&skills=javascript,react&page=1&limit=10
```

Response:

```json
{
  "success": true,
  "count": 5,
  "total": 25,
  "pagination": {
    "currentPage": 1,
    "totalPages": 3
  },
  "data": [
    {
      "id": "job_id",
      "title": "Frontend Developer",
      "description": "Job description...",
      "requiredSkills": ["JavaScript", "React", "CSS"],
      "location": "Remote",
      "jobType": "full-time",
      "salary": 80000,
      "companyId": {
        "name": "Tech Company",
        "companyName": "Tech Inc.",
        "logo": "logo_url",
        "location": "New York"
      },
      "postedDate": "2023-05-15T00:00:00.000Z"
    },
    // More jobs...
  ]
}
```

#### Create a new job (company only)

```http
POST /api/jobs
```

Request body:

```json
{
  "title": "Frontend Developer",
  "description": "Detailed job description...",
  "requiredSkills": ["JavaScript", "React", "CSS"],
  "location": "Remote",
  "jobType": "full-time",
  "salary": 80000,
  "deadlineDate": "2023-06-30T00:00:00.000Z"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "job_id",
    "title": "Frontend Developer",
    "description": "Detailed job description...",
    "requiredSkills": ["JavaScript", "React", "CSS"],
    "location": "Remote",
    "jobType": "full-time",
    "salary": 80000,
    "companyId": "company_user_id",
    "postedDate": "2023-05-15T00:00:00.000Z",
    "deadlineDate": "2023-06-30T00:00:00.000Z",
    "isActive": true
  }
}
```

## Project Structure

```bash
file-rouge-final/
├── job-board-backend/              # Backend built with Node.js + Express
│   ├── src/
│   │   ├── controllers/            # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── job.controller.js
│   │   │   ├── application.controller.js
│   │   │   └── user.controller.js
│   │   ├── models/                # Mongoose models
│   │   │   ├── user.model.js
│   │   │   ├── job.model.js
│   │   │   └── application.model.js
│   │   ├── middleware/            # Middleware functions
│   │   │   └── auth.middleware.js
│   │   └── routes/                # API routes
│   │       ├── auth.routes.js
│   │       ├── job.routes.js
│   │       ├── application.routes.js
│   │       └── user.routes.js
│   |
│   ├── .env                      # Environment variables configuration
│   ├── app.js                    # Entry point for the application
│   ├── package-lock.json         # Auto-generated lock file for dependencies
│   ├── package.json              # Project dependencies and scripts

├── job-board-frontend/            # Frontend built with React + Vite
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── applications/      # Application-related components
│   │   │   ├── auth/              # Authentication components
│   │   │   ├── jobs/              # Job listing components
│   │   │   ├── layout/            # Layout (Header, Footer)
│   │   │   ├── profile/           # User profile components
│   │   │   └── ui/                # Common UI elements
│   │   ├── contexts/              # React contexts (e.g., AuthContext)
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── pages/                 # Page components
│   │   ├── services/              # API service modules
│   │   ├── utils/                 # Utility functions
│   │   ├── App.jsx                # Main App component
│   │   ├── main.jsx               # Application entry point
│   │   └── index.css              # Global styles
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── README.md
```

## Authentication and Authorization

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT in the Authorization header.

Example:

```http
GET /api/jobs/company/myjobs
Authorization: Bearer your_jwt_token_here
```

Role-based access control is implemented to restrict certain endpoints to specific user roles (candidate or company).

## Error Handling

The API has a centralized error handling middleware that catches all errors and returns appropriate responses.

## Development

Available npm scripts:

- `npm start` - Start the server
- `npm run dev` - Start the server with nodemon (auto-reload on changes)
- `npm run lint` - Run ESLint to check code style
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run prettier` - Format code with Prettier
- `npm run format` - Run both Prettier and ESLint fixes

## License

ISC


# Author: [Youssef HAMMANI ](https://github.com/youssefhammani)

// routes/application.routes.js
const express = require('express');
const {
  applyForJob,
  getJobApplications,
  getUserApplications,
  updateApplicationStatus
} = require('../controllers/application.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Candidate routes
router.post('/jobs/:jobId/apply', restrictTo('candidate'), applyForJob);
router.get('/my-applications', restrictTo('candidate'), getUserApplications);

// Company routes
router.get('/jobs/:jobId', restrictTo('company'), getJobApplications);
router.put('/:id/status', restrictTo('company'), updateApplicationStatus);

module.exports = router;

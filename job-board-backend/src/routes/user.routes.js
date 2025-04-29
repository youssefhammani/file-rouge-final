// routes/user.routes.js
const express = require('express');
const {
  updateProfile,
  saveJob,
  unsaveJob,
  getSavedJobs
} = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// General user routes
router.put('/profile', updateProfile);

// Candidate only routes
router.post('/jobs/:jobId/save', restrictTo('candidate'), saveJob);
router.delete('/jobs/:jobId/unsave', restrictTo('candidate'), unsaveJob);
router.get('/saved-jobs', restrictTo('candidate'), getSavedJobs);

module.exports = router;

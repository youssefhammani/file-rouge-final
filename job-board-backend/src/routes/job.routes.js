// routes/job.routes.js
const express = require('express');
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getCompanyJobs
} = require('../controllers/job.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);

// Protected routes
router.use(protect);

// Company only routes
router.post('/', restrictTo('company'), createJob);
router.put('/:id', restrictTo('company'), updateJob);
router.delete('/:id', restrictTo('company'), deleteJob);
router.get('/company/myjobs', restrictTo('company'), getCompanyJobs);

module.exports = router;

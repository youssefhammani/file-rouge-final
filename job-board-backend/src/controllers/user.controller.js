// controllers/user.controller.js
const User = require('../models/user.model');
const Job = require('../models/job.model');

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    // Fields that are not allowed to be updated
    const notAllowed = ['password', 'role'];
    
    // Check if request contains not allowed fields
    const requestedUpdates = Object.keys(req.body);
    const isValidOperation = requestedUpdates.every(
      (update) => !notAllowed.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update these fields',
      });
    }

    // Update user
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Save a job to user's saved jobs
exports.saveJob = async (req, res) => {
  try {
    // Check if job exists
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if job is already saved
    const user = await User.findById(req.user.id);
    if (user.savedJobs.includes(req.params.jobId)) {
      return res.status(400).json({
        success: false,
        message: 'Job already saved',
      });
    }

    // Add job to saved jobs
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { savedJobs: req.params.jobId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Job saved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Unsave a job from user's saved jobs
exports.unsaveJob = async (req, res) => {
  try {
    // Remove job from saved jobs
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { savedJobs: req.params.jobId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Job removed from saved jobs',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user's saved jobs
exports.getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'savedJobs',
      select: 'title companyId location jobType salary postedDate',
      populate: {
        path: 'companyId',
        select: 'companyName logo',
      },
    });

    res.status(200).json({
      success: true,
      count: user.savedJobs.length,
      data: user.savedJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

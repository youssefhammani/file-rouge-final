// controllers/application.controller.js
const Application = require('../models/application.model');
const Job = require('../models/job.model');
const User = require('../models/user.model');

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    // Check if job exists and is active
    const job = await Job.findOne({ _id: req.params.jobId, isActive: true });
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or no longer active',
      });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      jobId: req.params.jobId,
      candidateId: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job',
      });
    }

    // Create application
    const application = await Application.create({
      jobId: req.params.jobId,
      candidateId: req.user.id,
      coverLetter: req.body.coverLetter,
      resumeLink: req.body.resumeLink,
    });

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get applications for a specific job (for company/admin)
exports.getJobApplications = async (req, res) => {
  try {
    // Check if job exists and belongs to company
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Only job poster can see applications
    if (job.companyId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these applications',
      });
    }

    // Get applications
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('candidateId', 'name email profilePicture skills')
      .sort({ appliedDate: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get applications submitted by current user
exports.getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user.id })
      .populate({
        path: 'jobId',
        select: 'title companyId location jobType salary',
        populate: {
          path: 'companyId',
          select: 'companyName logo',
        },
      })
      .sort({ appliedDate: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update application status (for company/admin)
exports.updateApplicationStatus = async (req, res) => {
  try {
    let application = await Application.findById(req.params.id)
      .populate('jobId');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if job belongs to company
    if (
      application.jobId.companyId.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    // Update status
    application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).populate('candidateId', 'name email');

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

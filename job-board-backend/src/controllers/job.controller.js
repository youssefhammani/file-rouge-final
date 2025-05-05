// controllers/job.controller.js
const Job = require('../models/job.model');

// Create a new job
exports.createJob = async (req, res) => {
  try {
    // Make sure company ID is set to current user
    req.body.companyId = req.user.id;

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all jobs with filtering
exports.getJobs = async (req, res) => {
  try {
    let query = {};

    // Filter by job title, description or skills (text search)
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Filter by location
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' };
    }

    // Filter by job type
    if (req.query.jobType) {
      query.jobType = req.query.jobType;
    }

    // Filter by required skills
    if (req.query.skills) {
      // Convert comma-separated skills to array
      const skills = req.query.skills.split(',');
      query.requiredSkills = { $in: skills };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Find jobs and populate company details
    const jobs = await Job.find(query)
      .where('isActive').equals(true)
      .populate('companyId', 'name companyName logo location')
      .sort({ postedDate: -1 })
      .skip(startIndex)
      .limit(limit);

    // Get total count
    const total = await Job.countDocuments(query).where('isActive').equals(true);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single job
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('companyId', 'name companyName logo location description website')
      .populate({
        path: 'applications',
        select: 'candidateId status appliedDate',
        populate: {
          path: 'candidateId',
          select: 'name email profilePicture',
        },
      });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update job
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if user is job owner
    if (job.companyId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job',
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if user is job owner
    if (job.companyId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job',
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get jobs posted by current company
exports.getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ companyId: req.user.id })
      .sort({ postedDate: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

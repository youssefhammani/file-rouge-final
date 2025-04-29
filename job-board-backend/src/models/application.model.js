// models/application.model.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job is required'],
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Candidate is required'],
  },
  coverLetter: {
    type: String,
  },
  resumeLink: {
    type: String,
    required: [true, 'Resume link is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'rejected', 'accepted'],
    default: 'pending',
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Unique constraint so a user can't apply multiple times to the same job
applicationSchema.index({
  jobId: 1,
  candidateId: 1
}, {
  unique: true
});

module.exports = mongoose.model('Application', applicationSchema);
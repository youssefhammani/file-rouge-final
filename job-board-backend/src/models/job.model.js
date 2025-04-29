// models/job.model.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Job description is required'],
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Company is required'],
    },
    requiredSkills: {
        type: [String],
        default: [],
    },
    location: {
        type: String,
        required: [true, 'Job location is required'],
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
        default: 'full-time',
    },
    salary: {
        type: Number,
    },
    postedDate: {
        type: Date,
        default: Date.now,
    },
    deadlineDate: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
});

// Virtual for applications to this job
jobSchema.virtual('applications', {
    ref: 'Application',
    localField: '_id',
    foreignField: 'jobId',
    justOne: false,
});

// Create text index for title, description, and required skills
jobSchema.index({
    title: 'text',
    description: 'text',
    requiredSkills: 'text'
}, {
    name: 'job_search_index'
});

module.exports = mongoose.model('Job', jobSchema);
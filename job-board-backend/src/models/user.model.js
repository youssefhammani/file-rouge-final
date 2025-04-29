// models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false,
    },
    role: {
        type: String,
        enum: ['candidate', 'company'],
        default: 'candidate',
    },
    profilePicture: {
        type: String,
        default: '',
    },
    // Company specific fields
    companyName: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
    },
    logo: {
        type: String,
    },
    location: {
        type: String,
    },
    website: {
        type: String,
    },
    // Candidate specific fields
    skills: [String],
    resume: {
        type: String,
    },
    savedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    }, ],
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
});

// Virtual for job applications by candidate
userSchema.virtual('applications', {
    ref: 'Application',
    localField: '_id',
    foreignField: 'candidateId',
    justOne: false,
});

// Virtual for jobs posted by company
userSchema.virtual('postedJobs', {
    ref: 'Job',
    localField: '_id',
    foreignField: 'companyId',
    justOne: false,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateToken = function () {
    return jwt.sign({
        id: this._id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

module.exports = mongoose.model('User', userSchema);
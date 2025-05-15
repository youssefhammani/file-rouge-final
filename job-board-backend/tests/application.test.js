const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../src/models/user.model');
const Job = require('../src/models/job.model');
const Application = require('../src/models/application.model');

let candidateToken;
let companyToken;
let jobId;
let applicationId;

// Setup test database
beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});

    // Create a company user
    const companyResponse = await request(app)
        .post('/api/auth/register')
        .send({
            name: 'Test Company',
            email: 'company@example.com',
            password: 'password123',
            role: 'company',
            companyName: 'Test Corp'
        });

    companyToken = companyResponse.body.token;

    // Create a candidate user
    const candidateResponse = await request(app)
        .post('/api/auth/register')
        .send({
            name: 'Test Candidate',
            email: 'candidate@example.com',
            password: 'password123'
        });

    candidateToken = candidateResponse.body.token;

    // Create a job
    const jobResponse = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${companyToken}`)
        .send({
            title: 'Software Engineer',
            description: 'Building awesome software',
            location: 'Remote',
            jobType: 'full-time',
            salary: 80000
        });

    jobId = jobResponse.body.data._id;
});

// Clear database after tests
afterAll(async () => {
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await mongoose.connection.close();
});

describe('Application Endpoints', () => {
    // Test job application
    test('should apply for a job', async () => {
        const response = await request(app)
            .post(`/api/applications/jobs/${jobId}/apply`)
            .set('Authorization', `Bearer ${candidateToken}`)
            .send({
                coverLetter: 'I am excited about this opportunity',
                resumeLink: 'https://example.com/resume.pdf'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.jobId).toBe(jobId);
        expect(response.body.data.status).toBe('pending');

        applicationId = response.body.data._id;
    });

    // Test getting candidate applications
    test('should get candidate applications', async () => {
        const response = await request(app)
            .get('/api/applications/my-applications')
            .set('Authorization', `Bearer ${candidateToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(1);
    });

    // Test getting job applications (for company)
    test('should get job applications for company', async () => {
        const response = await request(app)
            .get(`/api/applications/jobs/${jobId}`)
            .set('Authorization', `Bearer ${companyToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(1);
    });

    // Test updating application status
    test('should update application status', async () => {
        const response = await request(app)
            .put(`/api/applications/${applicationId}/status`)
            .set('Authorization', `Bearer ${companyToken}`)
            .send({
                status: 'reviewed'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.status).toBe('reviewed');
    });
});
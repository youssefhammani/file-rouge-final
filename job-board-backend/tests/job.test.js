const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Job = require('../src/models/job.model');
const User = require('../src/models/user.model');

let companyToken;
let jobId;

// Setup test database
beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.deleteMany({});
    await Job.deleteMany({});

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
});

// Clear database after tests
afterAll(async () => {
    await User.deleteMany({});
    await Job.deleteMany({});
    await mongoose.connection.close();
});

describe('Job Endpoints', () => {
    // Test job creation
    test('should create a job listing', async () => {
        const response = await request(app)
            .post('/api/jobs')
            .set('Authorization', `Bearer ${companyToken}`)
            .send({
                title: 'Software Engineer',
                description: 'Building awesome software',
                location: 'Remote',
                jobType: 'full-time',
                salary: 80000,
                requiredSkills: ['JavaScript', 'Node.js', 'MongoDB']
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe('Software Engineer');

        jobId = response.body.data._id;
    });

    // Test getting all jobs
    test('should get all jobs', async () => {
        const response = await request(app)
            .get('/api/jobs');

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(1);
    });

    // Test getting a specific job
    test('should get a specific job', async () => {
        const response = await request(app)
            .get(`/api/jobs/${jobId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe('Software Engineer');
    });

    // Test updating a job
    test('should update a job', async () => {
        const response = await request(app)
            .put(`/api/jobs/${jobId}`)
            .set('Authorization', `Bearer ${companyToken}`)
            .send({
                title: 'Senior Software Engineer',
                salary: 100000
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe('Senior Software Engineer');
        expect(response.body.data.salary).toBe(100000);
    });
});
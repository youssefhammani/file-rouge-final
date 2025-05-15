const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../src/models/user.model');

// Setup test database
beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
});

// Clear database after tests
afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe('Auth Endpoints', () => {
    // Test user registration
    test('should register a new candidate user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body).toHaveProperty('token');
        expect(response.body.user.name).toBe('Test User');
        expect(response.body.user.role).toBe('candidate');
    });

    // Test user login
    test('should login with valid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body).toHaveProperty('token');
    });

    // Test invalid login
    test('should not login with invalid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });
});
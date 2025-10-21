const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Company = require('../src/models/Company');
const { createTestUser, createTestCompany } = require('./helpers/testHelpers');

describe('Authentication Routes', () => {
  describe('POST /auth/signup', () => {
    it('should create a new user and company', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        companyName: 'New Company'
      };

      const response = await request(app)
        .post('/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).toHaveProperty('company');
      expect(response.body.user.company).toHaveProperty('name', userData.companyName);

      // Verify user was created in database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user.password).not.toBe(userData.password); // Should be hashed

      // Verify company was created
      const company = await Company.findById(user.companyId);
      expect(company).toBeTruthy();
      expect(company.name).toBe(userData.companyName);
    });

    it('should return 400 for duplicate email', async () => {
      await createTestUser({ email: 'existing@example.com' });

      const response = await request(app)
        .post('/auth/signup')
        .send({
          email: 'existing@example.com',
          password: 'password123',
          companyName: 'Another Company'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          email: 'invalid-email',
          password: 'password123',
          companyName: 'Test Company'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for short password', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          password: '123',
          companyName: 'Test Company'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const company = await createTestCompany();
      const user = await createTestUser({
        email: 'login@example.com',
        companyId: company._id
      });

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'login@example.com');
      expect(response.body.user).toHaveProperty('company');
    });

    it('should return 401 for invalid email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for invalid password', async () => {
      await createTestUser({ email: 'test@example.com' });

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /auth/me', () => {
    it('should return user data with valid token', async () => {
      const company = await createTestCompany();
      const user = await createTestUser({
        email: 'me@example.com',
        companyId: company._id
      });

      // Login to get token
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: 'me@example.com',
          password: 'password123'
        });

      const token = loginResponse.body.token;

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', 'me@example.com');
      expect(response.body).toHaveProperty('company');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});
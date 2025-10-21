const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const { createTestUser, createTestCompany } = require('./helpers/testHelpers');

describe('Middleware Tests', () => {
  describe('Authentication Middleware', () => {
    it('should allow access with valid token', async () => {
      const company = await createTestCompany();
      const user = await createTestUser({ companyId: company._id });
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'test-secret');

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', user.email);
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject request with expired token', async () => {
      const user = await createTestUser();
      const expiredToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '-1h' } // Expired 1 hour ago
      );

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject request with malformed authorization header', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Error Handling Middleware', () => {
    it('should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle validation errors', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          // Missing required fields
          email: 'test@example.com'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('CORS Middleware', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/auth/me')
        .expect(401); // Will fail auth but should have CORS headers

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    it('should handle preflight requests', async () => {
      const response = await request(app)
        .options('/auth/login')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-methods');
    });
  });

  describe('Rate Limiting Middleware', () => {
    it('should allow requests within rate limit', async () => {
      // Make multiple requests quickly
      const promises = Array(5).fill().map(() => 
        request(app).get('/auth/me')
      );

      const responses = await Promise.all(promises);
      
      // All should get through (though they'll be 401 due to no auth)
      responses.forEach(response => {
        expect([200, 401]).toContain(response.status);
      });
    });

    // Note: Testing actual rate limiting is complex in unit tests
    // as it requires making many requests quickly and may be flaky
  });

  describe('Request Parsing Middleware', () => {
    it('should parse JSON request bodies', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123',
          companyName: 'Test Company'
        })
        .expect(201);

      expect(response.body).toHaveProperty('user');
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Security Headers Middleware', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/auth/me')
        .expect(401);

      // Check for common security headers (if using helmet)
      expect(response.headers).toHaveProperty('x-content-type-options');
    });
  });
});
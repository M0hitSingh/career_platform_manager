const request = require('supertest');
const app = require('../src/app');
const Company = require('../src/models/Company');
const { createAuthenticatedUser } = require('./helpers/testHelpers');

describe('Companies Routes', () => {
  let authUser, authToken, company;

  beforeEach(async () => {
    const auth = await createAuthenticatedUser();
    authUser = auth.user;
    authToken = auth.token;
    company = auth.company;
  });

  describe('GET /companies/:id', () => {
    it('should return company data for authenticated user', async () => {
      const response = await request(app)
        .get(`/companies/${company._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body._id).toBe(company._id.toString());
      expect(response.body.name).toBe(company.name);
      expect(response.body.slug).toBe(company.slug);
      expect(response.body).toHaveProperty('branding');
    });

    it('should return 404 for non-existent company', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/companies/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get(`/companies/${company._id}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 403 for unauthorized company access', async () => {
      // Create another user with different company
      const otherAuth = await createAuthenticatedUser({
        email: 'other@example.com'
      });

      const response = await request(app)
        .get(`/companies/${company._id}`)
        .set('Authorization', `Bearer ${otherAuth.token}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /companies/:id', () => {
    it('should update company information', async () => {
      const updateData = {
        name: 'Updated Company Name',
        slug: 'updated-company-slug'
      };

      const response = await request(app)
        .put(`/companies/${company._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.slug).toBe(updateData.slug);

      // Verify update in database
      const updatedCompany = await Company.findById(company._id);
      expect(updatedCompany.name).toBe(updateData.name);
      expect(updatedCompany.slug).toBe(updateData.slug);
    });

    it('should return 400 for duplicate slug', async () => {
      // Create another company with a specific slug
      await Company.create({
        name: 'Another Company',
        slug: 'existing-slug',
        branding: { primaryColor: '#000000' }
      });

      const response = await request(app)
        .put(`/companies/${company._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ slug: 'existing-slug' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent company', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/companies/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 403 for unauthorized company update', async () => {
      const otherAuth = await createAuthenticatedUser({
        email: 'other@example.com'
      });

      const response = await request(app)
        .put(`/companies/${company._id}`)
        .set('Authorization', `Bearer ${otherAuth.token}`)
        .send({ name: 'Unauthorized Update' })
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /companies/:id/branding', () => {
    it('should update company branding', async () => {
      const brandingData = {
        primaryColor: '#FF5733',
        secondaryColor: '#33FF57',
        logo: 'https://example.com/logo.png'
      };

      const response = await request(app)
        .put(`/companies/${company._id}/branding`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(brandingData)
        .expect(200);

      expect(response.body.branding.primaryColor).toBe(brandingData.primaryColor);
      expect(response.body.branding.secondaryColor).toBe(brandingData.secondaryColor);
      expect(response.body.branding.logo).toBe(brandingData.logo);

      // Verify update in database
      const updatedCompany = await Company.findById(company._id);
      expect(updatedCompany.branding.primaryColor).toBe(brandingData.primaryColor);
    });

    it('should return 400 for invalid color format', async () => {
      const response = await request(app)
        .put(`/companies/${company._id}/branding`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          primaryColor: 'invalid-color',
          secondaryColor: '#33FF57'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent company', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/companies/${fakeId}/branding`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          primaryColor: '#FF5733',
          secondaryColor: '#33FF57'
        })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 403 for unauthorized branding update', async () => {
      const otherAuth = await createAuthenticatedUser({
        email: 'other@example.com'
      });

      const response = await request(app)
        .put(`/companies/${company._id}/branding`)
        .set('Authorization', `Bearer ${otherAuth.token}`)
        .send({
          primaryColor: '#FF5733',
          secondaryColor: '#33FF57'
        })
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });
  });
});
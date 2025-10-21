const request = require('supertest');
const app = require('../src/app');
const CareerPage = require('../src/models/CareerPage');
const { createAuthenticatedUser } = require('./helpers/testHelpers');

describe('Career Pages Routes', () => {
  let authUser, authToken, company;

  beforeEach(async () => {
    const auth = await createAuthenticatedUser();
    authUser = auth.user;
    authToken = auth.token;
    company = auth.company;
  });

  describe('GET /career-pages/:companyId', () => {
    it('should return career page for company', async () => {
      // Create a career page
      const careerPage = await CareerPage.create({
        companyId: company._id,
        components: [
          {
            id: 'comp-1',
            type: 'CompanyBanner',
            props: { title: 'Join Our Team' },
            position: 0
          }
        ],
        isPublished: false
      });

      const response = await request(app)
        .get(`/career-pages/${company._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body._id).toBe(careerPage._id.toString());
      expect(response.body.companyId).toBe(company._id.toString());
      expect(response.body.components).toHaveLength(1);
      expect(response.body.components[0].type).toBe('CompanyBanner');
    });

    it('should create empty career page if none exists', async () => {
      const response = await request(app)
        .get(`/career-pages/${company._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.companyId).toBe(company._id.toString());
      expect(response.body.components).toEqual([]);
      expect(response.body.isPublished).toBe(false);

      // Verify it was created in database
      const careerPage = await CareerPage.findOne({ companyId: company._id });
      expect(careerPage).toBeTruthy();
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get(`/career-pages/${company._id}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 403 for unauthorized company access', async () => {
      const otherAuth = await createAuthenticatedUser({
        email: 'other@example.com'
      });

      const response = await request(app)
        .get(`/career-pages/${company._id}`)
        .set('Authorization', `Bearer ${otherAuth.token}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /career-pages/:companyId', () => {
    let careerPage;

    beforeEach(async () => {
      careerPage = await CareerPage.create({
        companyId: company._id,
        components: [],
        isPublished: false
      });
    });

    it('should update career page components', async () => {
      const updateData = {
        components: [
          {
            id: 'comp-1',
            type: 'CompanyBanner',
            props: { 
              title: 'Welcome to Our Company',
              subtitle: 'Join our amazing team'
            },
            position: 0
          },
          {
            id: 'comp-2',
            type: 'AboutSection',
            props: { 
              content: 'We are a great company to work for'
            },
            position: 1
          }
        ]
      };

      const response = await request(app)
        .put(`/career-pages/${company._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.components).toHaveLength(2);
      expect(response.body.components[0].type).toBe('CompanyBanner');
      expect(response.body.components[1].type).toBe('AboutSection');

      // Verify update in database
      const updatedPage = await CareerPage.findById(careerPage._id);
      expect(updatedPage.components).toHaveLength(2);
    });

    it('should return 400 for invalid component data', async () => {
      const response = await request(app)
        .put(`/career-pages/${company._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          components: [
            {
              // Missing required fields
              type: 'CompanyBanner'
            }
          ]
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 403 for unauthorized company access', async () => {
      const otherAuth = await createAuthenticatedUser({
        email: 'other@example.com'
      });

      const response = await request(app)
        .put(`/career-pages/${company._id}`)
        .set('Authorization', `Bearer ${otherAuth.token}`)
        .send({ components: [] })
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /career-pages/:companyId/publish', () => {
    let careerPage;

    beforeEach(async () => {
      careerPage = await CareerPage.create({
        companyId: company._id,
        components: [
          {
            id: 'comp-1',
            type: 'CompanyBanner',
            props: { title: 'Join Us' },
            position: 0
          }
        ],
        isPublished: false
      });
    });

    it('should publish career page', async () => {
      const response = await request(app)
        .post(`/career-pages/${company._id}/publish`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.isPublished).toBe(true);
      expect(response.body).toHaveProperty('publishedAt');

      // Verify update in database
      const publishedPage = await CareerPage.findById(careerPage._id);
      expect(publishedPage.isPublished).toBe(true);
      expect(publishedPage.publishedAt).toBeTruthy();
    });

    it('should return 400 for empty career page', async () => {
      // Create empty career page
      await CareerPage.findByIdAndUpdate(careerPage._id, {
        components: []
      });

      const response = await request(app)
        .post(`/career-pages/${company._id}/publish`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent career page', async () => {
      const otherAuth = await createAuthenticatedUser({
        email: 'other@example.com'
      });

      const response = await request(app)
        .post(`/career-pages/${otherAuth.company._id}/publish`)
        .set('Authorization', `Bearer ${otherAuth.token}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 403 for unauthorized company access', async () => {
      const otherAuth = await createAuthenticatedUser({
        email: 'other@example.com'
      });

      const response = await request(app)
        .post(`/career-pages/${company._id}/publish`)
        .set('Authorization', `Bearer ${otherAuth.token}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });
  });
});
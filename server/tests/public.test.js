const request = require('supertest');
const app = require('../src/app');
const Job = require('../src/models/Job');
const CareerPage = require('../src/models/CareerPage');
const Application = require('../src/models/Application');
const { createTestCompany } = require('./helpers/testHelpers');

describe('Public Routes', () => {
  let company;

  beforeEach(async () => {
    company = await createTestCompany({
      name: 'Public Test Company',
      slug: 'public-test-company'
    });
  });

  describe('GET /public/:slug/careers', () => {
    it('should return published career page', async () => {
      // Create and publish career page
      await CareerPage.create({
        companyId: company._id,
        components: [
          {
            id: 'comp-1',
            type: 'CompanyBanner',
            props: { title: 'Join Our Team' },
            position: 0
          }
        ],
        isPublished: true,
        publishedAt: new Date()
      });

      const response = await request(app)
        .get(`/public/${company.slug}/careers`)
        .expect(200);

      expect(response.text).toContain('Join Our Team');
      expect(response.text).toContain(company.name);
    });

    it('should return 404 for non-existent company', async () => {
      const response = await request(app)
        .get('/public/non-existent-company/careers')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for unpublished career page', async () => {
      // Create unpublished career page
      await CareerPage.create({
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
        .get(`/public/${company.slug}/careers`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /public/:slug/jobs', () => {
    beforeEach(async () => {
      // Create test jobs
      await Job.create([
        {
          companyId: company._id,
          title: 'Software Engineer',
          description: 'We are looking for a software engineer',
          location: 'San Francisco, CA',
          type: 'full-time',
          status: 'active',
          salary: { min: 80000, max: 120000, currency: 'USD' }
        },
        {
          companyId: company._id,
          title: 'Product Manager',
          description: 'We need a product manager',
          location: 'Remote',
          type: 'full-time',
          status: 'active',
          salary: { min: 90000, max: 130000, currency: 'USD' }
        },
        {
          companyId: company._id,
          title: 'Designer',
          description: 'Looking for a designer',
          location: 'New York, NY',
          type: 'contract',
          status: 'draft' // This should not appear in public results
        }
      ]);
    });

    it('should return active jobs for company', async () => {
      const response = await request(app)
        .get(`/public/${company.slug}/jobs`)
        .expect(200);

      expect(response.body).toHaveLength(2); // Only active jobs
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('description');
      expect(response.body[0]).toHaveProperty('location');
      expect(response.body[0].status).toBe('active');
    });

    it('should filter jobs by location', async () => {
      const response = await request(app)
        .get(`/public/${company.slug}/jobs?location=Remote`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].location).toBe('Remote');
    });

    it('should filter jobs by type', async () => {
      const response = await request(app)
        .get(`/public/${company.slug}/jobs?type=full-time`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      response.body.forEach(job => {
        expect(job.type).toBe('full-time');
      });
    });

    it('should search jobs by title', async () => {
      const response = await request(app)
        .get(`/public/${company.slug}/jobs?search=Engineer`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toContain('Engineer');
    });

    it('should return 404 for non-existent company', async () => {
      const response = await request(app)
        .get('/public/non-existent-company/jobs')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /public/:slug/jobs/:id/apply', () => {
    let job;

    beforeEach(async () => {
      job = await Job.create({
        companyId: company._id,
        title: 'Software Engineer',
        description: 'We are looking for a software engineer',
        location: 'San Francisco, CA',
        type: 'full-time',
        status: 'active'
      });
    });

    it('should create job application', async () => {
      const applicationData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        coverLetter: 'I am very interested in this position...'
      };

      const response = await request(app)
        .post(`/public/${company.slug}/jobs/${job._id}/apply`)
        .send(applicationData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe(applicationData.name);
      expect(response.body.email).toBe(applicationData.email);
      expect(response.body.jobId).toBe(job._id.toString());
      expect(response.body.status).toBe('new');

      // Verify application was created in database
      const application = await Application.findById(response.body._id);
      expect(application).toBeTruthy();
      expect(application.name).toBe(applicationData.name);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post(`/public/${company.slug}/jobs/${job._id}/apply`)
        .send({
          name: 'John Doe'
          // Missing email
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post(`/public/${company.slug}/jobs/${job._id}/apply`)
        .send({
          name: 'John Doe',
          email: 'invalid-email',
          phone: '+1234567890'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent job', async () => {
      const fakeJobId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .post(`/public/${company.slug}/jobs/${fakeJobId}/apply`)
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890'
        })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for inactive job', async () => {
      // Update job to inactive
      await Job.findByIdAndUpdate(job._id, { status: 'inactive' });

      const response = await request(app)
        .post(`/public/${company.slug}/jobs/${job._id}/apply`)
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent company', async () => {
      const response = await request(app)
        .post(`/public/non-existent-company/jobs/${job._id}/apply`)
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890'
        })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });
});
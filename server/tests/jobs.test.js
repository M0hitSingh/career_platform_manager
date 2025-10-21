const request = require('supertest');
const app = require('../src/app');
const Job = require('../src/models/Job');
const { createAuthenticatedUser } = require('./helpers/testHelpers');

describe('Jobs Routes', () => {
  let authUser, authToken, company;

  beforeEach(async () => {
    const auth = await createAuthenticatedUser();
    authUser = auth.user;
    authToken = auth.token;
    company = auth.company;
  });

  describe('POST /jobs', () => {
    it('should create a new job', async () => {
      const jobData = {
        title: 'Software Engineer',
        description: 'We are looking for a talented software engineer...',
        location: 'San Francisco, CA',
        type: 'full-time',
        salary: {
          min: 80000,
          max: 120000,
          currency: 'USD'
        },
        requirements: ['JavaScript', 'React', 'Node.js'],
        benefits: ['Health insurance', 'Remote work']
      };

      const response = await request(app)
        .post('/jobs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(jobData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.title).toBe(jobData.title);
      expect(response.body.companyId).toBe(company._id.toString());
      expect(response.body.status).toBe('draft');

      // Verify job was created in database
      const job = await Job.findById(response.body._id);
      expect(job).toBeTruthy();
      expect(job.title).toBe(jobData.title);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/jobs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Software Engineer'
          // Missing description and other required fields
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/jobs')
        .send({
          title: 'Software Engineer',
          description: 'Job description'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /jobs', () => {
    beforeEach(async () => {
      // Create test jobs
      await Job.create([
        {
          companyId: company._id,
          title: 'Frontend Developer',
          description: 'Frontend job',
          location: 'Remote',
          type: 'full-time',
          status: 'active'
        },
        {
          companyId: company._id,
          title: 'Backend Developer',
          description: 'Backend job',
          location: 'New York',
          type: 'contract',
          status: 'draft'
        }
      ]);
    });

    it('should return jobs for authenticated user company', async () => {
      const response = await request(app)
        .get('/jobs')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('companyId', company._id.toString());
    });

    it('should filter jobs by status', async () => {
      const response = await request(app)
        .get('/jobs?status=active')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].status).toBe('active');
    });

    it('should search jobs by title', async () => {
      const response = await request(app)
        .get('/jobs?search=Frontend')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toContain('Frontend');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/jobs')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /jobs/:id', () => {
    let job;

    beforeEach(async () => {
      job = await Job.create({
        companyId: company._id,
        title: 'Test Job',
        description: 'Test description',
        location: 'Test Location',
        type: 'full-time',
        status: 'active'
      });
    });

    it('should return job by id', async () => {
      const response = await request(app)
        .get(`/jobs/${job._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body._id).toBe(job._id.toString());
      expect(response.body.title).toBe(job.title);
    });

    it('should return 404 for non-existent job', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/jobs/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get(`/jobs/${job._id}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /jobs/:id', () => {
    let job;

    beforeEach(async () => {
      job = await Job.create({
        companyId: company._id,
        title: 'Original Title',
        description: 'Original description',
        location: 'Original Location',
        type: 'full-time',
        status: 'draft'
      });
    });

    it('should update job', async () => {
      const updateData = {
        title: 'Updated Title',
        description: 'Updated description',
        location: 'Updated Location'
      };

      const response = await request(app)
        .put(`/jobs/${job._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.description).toBe(updateData.description);

      // Verify update in database
      const updatedJob = await Job.findById(job._id);
      expect(updatedJob.title).toBe(updateData.title);
    });

    it('should return 404 for non-existent job', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/jobs/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Title' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /jobs/:id', () => {
    let job;

    beforeEach(async () => {
      job = await Job.create({
        companyId: company._id,
        title: 'Job to Delete',
        description: 'Description',
        location: 'Location',
        type: 'full-time',
        status: 'draft'
      });
    });

    it('should delete job', async () => {
      const response = await request(app)
        .delete(`/jobs/${job._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');

      // Verify deletion in database
      const deletedJob = await Job.findById(job._id);
      expect(deletedJob).toBeNull();
    });

    it('should return 404 for non-existent job', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/jobs/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PATCH /jobs/:id/status', () => {
    let job;

    beforeEach(async () => {
      job = await Job.create({
        companyId: company._id,
        title: 'Status Test Job',
        description: 'Description',
        location: 'Location',
        type: 'full-time',
        status: 'draft'
      });
    });

    it('should update job status', async () => {
      const response = await request(app)
        .patch(`/jobs/${job._id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'active' })
        .expect(200);

      expect(response.body.status).toBe('active');

      // Verify update in database
      const updatedJob = await Job.findById(job._id);
      expect(updatedJob.status).toBe('active');
    });

    it('should return 400 for invalid status', async () => {
      const response = await request(app)
        .patch(`/jobs/${job._id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'invalid-status' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});
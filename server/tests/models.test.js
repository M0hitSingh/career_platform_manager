const User = require('../src/models/User');
const Company = require('../src/models/Company');
const Job = require('../src/models/Job');
const CareerPage = require('../src/models/CareerPage');
const Application = require('../src/models/Application');
const bcrypt = require('bcryptjs');

describe('Model Tests', () => {
  describe('User Model', () => {
    let company;

    beforeEach(async () => {
      company = new Company({
        name: 'Test Company',
        slug: 'test-company',
        branding: { primaryColor: '#000000' }
      });
      await company.save();
    });

    it('should create a user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedpassword123',
        companyId: company._id
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.password).not.toBe(userData.password); // Should be hashed
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });

    it('should require email field', async () => {
      const user = new User({
        password: 'hashedpassword123',
        companyId: company._id
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should require unique email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'hashedpassword123',
        companyId: company._id
      };

      const user1 = new User(userData);
      await user1.save();

      const user2 = new User(userData);
      await expect(user2.save()).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const user = new User({
        email: 'invalid-email',
        password: 'hashedpassword123',
        companyId: company._id
      });

      await expect(user.save()).rejects.toThrow();
    });
  });

  describe('Company Model', () => {
    it('should create a company with valid data', async () => {
      const companyData = {
        name: 'Test Company',
        slug: 'test-company',
        branding: {
          primaryColor: '#3B82F6',
          secondaryColor: '#8B5CF6'
        }
      };

      const company = new Company(companyData);
      const savedCompany = await company.save();

      expect(savedCompany._id).toBeDefined();
      expect(savedCompany.name).toBe(companyData.name);
      expect(savedCompany.slug).toBe(companyData.slug);
      expect(savedCompany.branding.primaryColor).toBe(companyData.branding.primaryColor);
    });

    it('should require name field', async () => {
      const company = new Company({
        slug: 'test-company'
      });

      await expect(company.save()).rejects.toThrow();
    });

    it('should require unique slug', async () => {
      const companyData = {
        name: 'Test Company',
        slug: 'duplicate-slug',
        branding: { primaryColor: '#000000' }
      };

      const company1 = new Company(companyData);
      await company1.save();

      const company2 = new Company({
        ...companyData,
        name: 'Another Company'
      });
      await expect(company2.save()).rejects.toThrow();
    });

    it('should have default branding values', async () => {
      const company = new Company({
        name: 'Test Company',
        slug: 'test-company'
      });

      const savedCompany = await company.save();
      expect(savedCompany.branding).toBeDefined();
    });
  });

  describe('Job Model', () => {
    let company;

    beforeEach(async () => {
      company = new Company({
        name: 'Test Company',
        slug: 'test-company',
        branding: { primaryColor: '#000000' }
      });
      await company.save();
    });

    it('should create a job with valid data', async () => {
      const jobData = {
        companyId: company._id,
        title: 'Software Engineer',
        slug: 'software-engineer',
        description: 'We are looking for a software engineer',
        location: 'San Francisco, CA',
        employmentType: 'Full time'
      };

      const job = new Job(jobData);
      const savedJob = await job.save();

      expect(savedJob._id).toBeDefined();
      expect(savedJob.title).toBe(jobData.title);
      expect(savedJob.companyId.toString()).toBe(company._id.toString());
      expect(savedJob.status).toBe('draft'); // Default status
    });

    it('should require title field', async () => {
      const job = new Job({
        companyId: company._id,
        description: 'Job description'
      });

      await expect(job.save()).rejects.toThrow();
    });

    it('should validate employment type enum', async () => {
      const job = new Job({
        companyId: company._id,
        title: 'Test Job',
        slug: 'test-job',
        description: 'Job description',
        location: 'Location',
        employmentType: 'invalid-type'
      });

      await expect(job.save()).rejects.toThrow();
    });

    it('should validate status enum', async () => {
      const job = new Job({
        companyId: company._id,
        title: 'Test Job',
        slug: 'test-job',
        description: 'Job description',
        location: 'Location',
        employmentType: 'Full time',
        status: 'invalid-status'
      });

      await expect(job.save()).rejects.toThrow();
    });
  });

  describe('CareerPage Model', () => {
    let company;

    beforeEach(async () => {
      company = new Company({
        name: 'Test Company',
        slug: 'test-company',
        branding: { primaryColor: '#000000' }
      });
      await company.save();
    });

    it('should create a career page with valid data', async () => {
      const careerPageData = {
        companyId: company._id,
        components: [
          {
            id: 'comp-1',
            type: 'banner',
            config: { title: 'Join Our Team' },
            order: 0
          }
        ],
        isPublished: false
      };

      const careerPage = new CareerPage(careerPageData);
      const savedCareerPage = await careerPage.save();

      expect(savedCareerPage._id).toBeDefined();
      expect(savedCareerPage.companyId.toString()).toBe(company._id.toString());
      expect(savedCareerPage.components).toHaveLength(1);
      expect(savedCareerPage.isPublished).toBe(false);
    });

    it('should require companyId field', async () => {
      const careerPage = new CareerPage({
        components: [],
        isPublished: false
      });

      await expect(careerPage.save()).rejects.toThrow();
    });

    it('should have default values', async () => {
      const careerPage = new CareerPage({
        companyId: company._id
      });

      const savedCareerPage = await careerPage.save();
      expect(savedCareerPage.components).toEqual([]);
      expect(savedCareerPage.isPublished).toBe(false);
    });
  });

  describe('Application Model', () => {
    let company, job;

    beforeEach(async () => {
      company = new Company({
        name: 'Test Company',
        slug: 'test-company',
        branding: { primaryColor: '#000000' }
      });
      await company.save();

      job = new Job({
        companyId: company._id,
        title: 'Software Engineer',
        slug: 'software-engineer',
        description: 'Job description',
        location: 'Location',
        employmentType: 'Full time'
      });
      await job.save();
    });

    it('should create an application with valid data', async () => {
      const applicationData = {
        jobId: job._id,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        coverLetter: 'I am interested in this position'
      };

      const application = new Application(applicationData);
      const savedApplication = await application.save();

      expect(savedApplication._id).toBeDefined();
      expect(savedApplication.jobId.toString()).toBe(job._id.toString());
      expect(savedApplication.name).toBe(applicationData.name);
      expect(savedApplication.email).toBe(applicationData.email);
      expect(savedApplication.status).toBe('new'); // Default status
    });

    it('should require name field', async () => {
      const application = new Application({
        jobId: job._id,
        email: 'john@example.com'
      });

      await expect(application.save()).rejects.toThrow();
    });

    it('should require email field', async () => {
      const application = new Application({
        jobId: job._id,
        name: 'John Doe'
      });

      await expect(application.save()).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const application = new Application({
        jobId: job._id,
        name: 'John Doe',
        email: 'invalid-email'
      });

      await expect(application.save()).rejects.toThrow();
    });

    it('should validate status enum', async () => {
      const application = new Application({
        jobId: job._id,
        name: 'John Doe',
        email: 'john@example.com',
        status: 'invalid-status'
      });

      await expect(application.save()).rejects.toThrow();
    });
  });
});
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireCompanyAccess } from '../middleware/companyAuth.js';
import Job from '../models/Job.js';
import Company from '../models/Company.js';
import { generateUniqueJobSlug } from '../utils/generateSlug.js';

const router = express.Router();

/**
 * GET /api/jobs
 * Get all jobs for the authenticated user's company with pagination and filtering
 * Protected route - requires authentication
 * Query params: page, limit, status, location, department, employmentType
 */
router.get('/jobs', authenticate, requireCompanyAccess, async (req, res) => {
  try {
    // Use company ID from the authenticated user's token
    const companyId = req.companyId;
    const {
      page = 1,
      limit = 10,
      status,
      location,
      department,
      employmentType
    } = req.query;

    console.log('[GET /jobs] Fetching jobs for company:', companyId);
    console.log('[GET /jobs] Query params:', { page, limit, status, location, department, employmentType });

    // Build filter query
    const filter = { companyId };
    if (status && status !== 'all') filter.status = status;
    if (location && location !== 'all') filter.location = location;
    if (department && department !== 'all') filter.department = department;
    if (employmentType && employmentType !== 'all') filter.employmentType = employmentType;

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Fetch total count for pagination
    const totalJobs = await Job.countDocuments(filter);
    console.log('[GET /jobs] Total jobs matching filter:', totalJobs);

    // Fetch paginated jobs
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    console.log('[GET /jobs] Returning', jobs.length, 'jobs for page', pageNum);

    // Get counts by status for all jobs (not just current page)
    const statusCounts = await Job.aggregate([
      { $match: { companyId: filter.companyId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const summary = {
      total: totalJobs,
      active: statusCounts.find(s => s._id === 'active')?.count || 0,
      draft: statusCounts.find(s => s._id === 'draft')?.count || 0,
      inactive: statusCounts.find(s => s._id === 'inactive')?.count || 0
    };

    // Group jobs by status for backward compatibility
    const jobsByStatus = {
      active: [],
      draft: [],
      inactive: []
    };

    jobs.forEach(job => {
      const jobData = job.toJSON();
      jobsByStatus[job.status].push(jobData);
    });

    res.json({
      jobs: jobsByStatus,
      summary,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalJobs / limitNum),
        totalJobs,
        jobsPerPage: limitNum,
        hasNextPage: pageNum < Math.ceil(totalJobs / limitNum),
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      error: 'Failed to fetch jobs',
      code: 'FETCH_JOBS_ERROR'
    });
  }
});

/**
 * GET /api/jobs/filters
 * Get unique filter values for jobs (locations, departments, types)
 * Protected route - requires authentication
 */
router.get('/jobs/filters', authenticate, requireCompanyAccess, async (req, res) => {
  try {
    // Use company ID from the authenticated user's token
    const companyId = req.companyId;
    console.log('[GET /jobs/filters] Fetching filter options for company:', companyId);

    // Get unique values for each filter field
    const locations = await Job.distinct('location', { companyId, location: { $ne: null, $ne: '' } });
    const departments = await Job.distinct('department', { companyId, department: { $ne: null, $ne: '' } });
    const employmentTypes = await Job.distinct('employmentType', { companyId, employmentType: { $ne: null, $ne: '' } });

    console.log('[GET /jobs/filters] Found filters:', {
      locations: locations.length,
      departments: departments.length,
      employmentTypes: employmentTypes.length
    });

    res.json({
      locations: locations.sort(),
      departments: departments.sort(),
      employmentTypes: employmentTypes.sort()
    });
  } catch (error) {
    console.error('Error fetching job filters:', error);
    res.status(500).json({
      error: 'Failed to fetch job filters',
      code: 'FETCH_FILTERS_ERROR'
    });
  }
});

export default router;

/**
 * POST /api/jobs
 * Create a new job for the authenticated user's company
 * Protected route - requires authentication
 */
router.post('/jobs', authenticate, requireCompanyAccess, async (req, res) => {
  try {
    // Use company ID from the authenticated user's token
    const companyId = req.companyId;
    console.log('[POST /jobs] Creating job for company:', companyId);
    console.log('[POST /jobs] Request body:', JSON.stringify(req.body, null, 2));

    const {
      title,
      workPolicy,
      location,
      department,
      employmentType,
      experienceLevel,
      jobType,
      salaryRange,
      description,
      status
    } = req.body;

    // Validate required fields
    if (!title) {
      console.log('[POST /jobs] Error: Missing title');
      return res.status(400).json({
        error: 'Job title is required',
        code: 'MISSING_TITLE'
      });
    }

    // Generate unique slug for the job
    const slug = await generateUniqueJobSlug(title, companyId, Job);
    console.log('[POST /jobs] Generated slug:', slug);

    // Create new job
    const job = new Job({
      companyId,
      title,
      workPolicy,
      location,
      department,
      employmentType,
      experienceLevel,
      jobType,
      salaryRange,
      slug,
      description,
      status: status || 'draft'
    });

    await job.save();
    console.log('[POST /jobs] Job created successfully:', job._id);

    res.status(201).json(job.toJSON());
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      error: 'Failed to create job',
      code: 'CREATE_JOB_ERROR'
    });
  }
});

/**
 * POST /api/jobs/bulk
 * Bulk create jobs for the authenticated user's company
 * Protected route - requires authentication
 */
router.post('/jobs/bulk', authenticate, requireCompanyAccess, async (req, res) => {
  try {
    // Use company ID from the authenticated user's token
    const companyId = req.companyId;
    const { jobs } = req.body;
    console.log('[POST /jobs/bulk] Bulk creating jobs for company:', companyId);
    console.log('[POST /jobs/bulk] Number of jobs to create:', jobs?.length);

    // Validate input
    if (!Array.isArray(jobs) || jobs.length === 0) {
      console.log('[POST /jobs/bulk] Error: Invalid input');
      return res.status(400).json({
        error: 'Jobs array is required and must not be empty',
        code: 'INVALID_INPUT'
      });
    }

    // Validate each job has required fields
    const invalidJobs = jobs.filter(job => !job.title);
    if (invalidJobs.length > 0) {
      console.log('[POST /jobs/bulk] Error: Jobs missing title:', invalidJobs.length);
      return res.status(400).json({
        error: 'All jobs must have a title',
        code: 'MISSING_TITLE'
      });
    }

    // Create jobs with unique slugs
    const createdJobs = [];
    const errors = [];
    console.log('[POST /jobs/bulk] Starting job creation...');

    for (const jobData of jobs) {
      try {
        // Generate unique slug for each job
        const slug = await generateUniqueJobSlug(jobData.title, companyId, Job);

        // Create new job
        const job = new Job({
          companyId,
          title: jobData.title,
          workPolicy: jobData.workPolicy,
          location: jobData.location,
          department: jobData.department,
          employmentType: jobData.employmentType,
          experienceLevel: jobData.experienceLevel,
          jobType: jobData.jobType,
          salaryRange: jobData.salaryRange,
          slug,
          description: jobData.description || 'Job description to be added',
          requirements: jobData.requirements || 'Requirements to be added',
          responsibilities: jobData.responsibilities || 'Responsibilities to be added',
          status: jobData.status || 'draft'
        });

        await job.save();
        createdJobs.push(job.toJSON());
      } catch (error) {
        console.log('[POST /jobs/bulk] Failed to create job:', jobData.title, error.message);
        errors.push({
          title: jobData.title,
          error: error.message
        });
      }
    }

    console.log('[POST /jobs/bulk] Bulk creation complete. Created:', createdJobs.length, 'Failed:', errors.length);

    res.status(201).json({
      message: `Successfully created ${createdJobs.length} jobs`,
      created: createdJobs.length,
      failed: errors.length,
      jobs: createdJobs,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error bulk creating jobs:', error);
    res.status(500).json({
      error: 'Failed to bulk create jobs',
      code: 'BULK_CREATE_ERROR'
    });
  }
});

/**
 * Middleware to check if job belongs to user's company
 */
const validateJobAccess = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        error: 'Job not found',
        code: 'JOB_NOT_FOUND'
      });
    }
    
    if (job.companyId.toString() !== req.companyId) {
      return res.status(403).json({
        error: 'Access denied. This job does not belong to your company',
        code: 'UNAUTHORIZED_JOB_ACCESS'
      });
    }
    
    req.job = job;
    next();
  } catch (error) {
    console.error('Job validation error:', error);
    return res.status(500).json({
      error: 'Failed to validate job access',
      code: 'JOB_VALIDATION_ERROR'
    });
  }
};

/**
 * PUT /api/jobs/:id
 * Update an existing job
 * Protected route - requires authentication and job authorization
 */
router.put('/jobs/:id', authenticate, requireCompanyAccess, validateJobAccess, async (req, res) => {
  try {
    const job = req.job; // Attached by authorizeJobAccess middleware
    console.log('[PUT /jobs/:id] Updating job:', req.params.id, 'Title:', job.title);
    console.log('[PUT /jobs/:id] Request body:', JSON.stringify(req.body, null, 2));

    const {
      title,
      workPolicy,
      location,
      department,
      employmentType,
      experienceLevel,
      jobType,
      salaryRange,
      description,
      status
    } = req.body;

    // If title is being updated, regenerate slug
    if (title && title !== job.title) {
      job.title = title;
      job.slug = await generateUniqueJobSlug(title, job.companyId, Job, job._id);
      console.log('[PUT /jobs/:id] Title updated, new slug:', job.slug);
    }

    // Update other fields if provided
    if (workPolicy !== undefined) job.workPolicy = workPolicy;
    if (location !== undefined) job.location = location;
    if (department !== undefined) job.department = department;
    if (employmentType !== undefined) job.employmentType = employmentType;
    if (experienceLevel !== undefined) job.experienceLevel = experienceLevel;
    if (jobType !== undefined) job.jobType = jobType;
    if (salaryRange !== undefined) job.salaryRange = salaryRange;
    if (description !== undefined) job.description = description;
    if (status !== undefined) job.status = status;

    await job.save();
    console.log('[PUT /jobs/:id] Job updated successfully');

    res.json(job.toJSON());
  } catch (error) {
    console.error('[PUT /jobs/:id] Error updating job:', error);
    res.status(500).json({
      error: 'Failed to update job',
      code: 'UPDATE_JOB_ERROR'
    });
  }
});

/**
 * DELETE /api/jobs/:id
 * Delete a job
 * Protected route - requires authentication and job authorization
 */
router.delete('/jobs/:id', authenticate, requireCompanyAccess, validateJobAccess, async (req, res) => {
  try {
    const job = req.job; // Attached by authorizeJobAccess middleware
    console.log('[DELETE /jobs/:id] Deleting job:', req.params.id, 'Title:', job.title);

    await Job.findByIdAndDelete(job._id);
    console.log('[DELETE /jobs/:id] Job deleted successfully');

    res.json({
      message: 'Job deleted successfully',
      jobId: job._id
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      error: 'Failed to delete job',
      code: 'DELETE_JOB_ERROR'
    });
  }
});

/**
 * PATCH /api/jobs/:id/status
 * Update job status
 * Protected route - requires authentication and job authorization
 * Sets postedDate when status changes to 'active'
 */
router.patch('/jobs/:id/status', authenticate, requireCompanyAccess, validateJobAccess, async (req, res) => {
  try {
    const job = req.job; // Attached by authorizeJobAccess middleware
    const { status } = req.body;
    console.log('[PATCH /jobs/:id/status] Updating status for job:', req.params.id, 'From:', job.status, 'To:', status);

    // Validate status
    if (!status) {
      console.log('[PATCH /jobs/:id/status] Error: Missing status');
      return res.status(400).json({
        error: 'Status is required',
        code: 'MISSING_STATUS'
      });
    }

    const validStatuses = ['active', 'draft', 'inactive'];
    if (!validStatuses.includes(status)) {
      console.log('[PATCH /jobs/:id/status] Error: Invalid status:', status);
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        code: 'INVALID_STATUS'
      });
    }

    // Validate status transitions
    const currentStatus = job.status;

    // Define valid transitions
    const validTransitions = {
      draft: ['active', 'inactive'],
      active: ['inactive'],
      inactive: ['active', 'draft']
    };

    if (!validTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        error: `Cannot transition from ${currentStatus} to ${status}`,
        code: 'INVALID_STATUS_TRANSITION',
        details: {
          currentStatus,
          requestedStatus: status,
          allowedTransitions: validTransitions[currentStatus]
        }
      });
    }

    // Update status
    job.status = status;

    // Set postedDate when job is activated for the first time
    if (status === 'active' && !job.postedDate) {
      job.postedDate = new Date();
      console.log('[PATCH /jobs/:id/status] Setting postedDate for newly active job');
    }

    await job.save();
    console.log('[PATCH /jobs/:id/status] Status updated successfully');

    res.json(job.toJSON());
  } catch (error) {
    console.error('[PATCH /jobs/:id/status] Error updating job status:', error);
    res.status(500).json({
      error: 'Failed to update job status',
      code: 'UPDATE_STATUS_ERROR'
    });
  }
});

/**
 * GET /api/companies/:slug/jobs/public
 * Get all active jobs for a company (public endpoint)
 * No authentication required
 * Query params: page, limit, location, department, employmentType
 */
router.get('/companies/:slug/jobs/public', async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      page = 1,
      limit = 10,
      location,
      department,
      employmentType
    } = req.query;

    console.log('[GET /companies/:slug/jobs/public] Fetching public jobs for company slug:', slug);
    console.log('[GET /companies/:slug/jobs/public] Query params:', { page, limit, location, department, employmentType });

    // Find company by slug
    const company = await Company.findOne({ slug });

    if (!company) {
      console.log('[GET /companies/:slug/jobs/public] Company not found:', slug);
      return res.status(404).json({
        error: 'Company not found',
        code: 'COMPANY_NOT_FOUND'
      });
    }

    // Build filter query
    const filter = {
      companyId: company._id,
      status: 'active'
    };
    if (location && location !== 'all') filter.location = location;
    if (department && department !== 'all') filter.department = department;
    if (employmentType && employmentType !== 'all') filter.employmentType = employmentType;

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Fetch total count for pagination
    const totalJobs = await Job.countDocuments(filter);
    console.log('[GET /companies/:slug/jobs/public] Total active jobs matching filter:', totalJobs);

    // Fetch paginated jobs
    const jobs = await Job.find(filter)
      .sort({ postedDate: -1 })
      .skip(skip)
      .limit(limitNum);

    console.log('[GET /companies/:slug/jobs/public] Returning', jobs.length, 'jobs for page', pageNum);

    res.json({
      company: {
        name: company.name,
        slug: company.slug,
        logo: company.logo
      },
      jobs: jobs.map(job => job.toJSON()),
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalJobs / limitNum),
        totalJobs,
        jobsPerPage: limitNum,
        hasNextPage: pageNum < Math.ceil(totalJobs / limitNum),
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error fetching public jobs:', error);
    res.status(500).json({
      error: 'Failed to fetch jobs',
      code: 'FETCH_PUBLIC_JOBS_ERROR'
    });
  }
});

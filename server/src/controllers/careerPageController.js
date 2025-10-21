import CareerPage from '../models/CareerPage.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import { validationResult } from 'express-validator';

/**
 * Get career page endpoint
 * GET /api/career-pages
 */
export const getCareerPage = async (req, res) => {
  try {
    // Use company ID from the authenticated user's token
    const companyId = req.companyId;

    // Find career page for the company
    const careerPage = await CareerPage.findOne({ companyId });
    
    // Get company branding as fallback
    const company = await Company.findById(companyId);

    if (!careerPage) {
      // Return empty career page structure if not found
      return res.status(200).json({
        careerPage: {
          companyId,
          components: [],
          branding: company?.branding || {},
          isPublished: false,
          publishedAt: null
        }
      });
    }

    // Use draft branding if available, otherwise fall back to company branding
    const draftBranding = careerPage.draftBranding && Object.keys(careerPage.draftBranding).length > 0 
      ? careerPage.draftBranding 
      : company?.branding || {};

    res.status(200).json({
      careerPage: {
        id: careerPage._id,
        companyId: careerPage.companyId,
        components: careerPage.components,
        branding: draftBranding,
        isPublished: careerPage.isPublished,
        publishedAt: careerPage.publishedAt,
        createdAt: careerPage.createdAt,
        updatedAt: careerPage.updatedAt
      }
    });
  } catch (error) {
    console.error('Get career page error:', error);
    res.status(500).json({ 
      error: 'Failed to get career page',
      code: 'GET_CAREER_PAGE_ERROR'
    });
  }
};

/**
 * Update career page endpoint
 * PUT /api/career-pages
 */
export const updateCareerPage = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors.array()
      });
    }

    // Use company ID from the authenticated user's token
    const companyId = req.companyId;
    const { components, branding } = req.body;

    console.log('Career page update - Company ID:', companyId);
    console.log('Career page update - Branding received:', branding);

    // Validate component types
    const validTypes = ['about', 'jobs', 'banner', 'image', 'video', 'html', 'text', 'footer'];
    
    if (components && Array.isArray(components)) {
      for (const component of components) {
        if (!validTypes.includes(component.type)) {
          return res.status(400).json({ 
            error: `Invalid component type: ${component.type}. Must be one of: ${validTypes.join(', ')}`,
            code: 'INVALID_COMPONENT_TYPE'
          });
        }

        // Validate required fields
        if (!component.id || component.order === undefined) {
          return res.status(400).json({ 
            error: 'Each component must have an id and order',
            code: 'INVALID_COMPONENT_STRUCTURE'
          });
        }
      }
    }

    // Prepare update data
    const updateData = {
      companyId,
      components: components || []
    };

    // Helper function to clean and validate hex colors
    const cleanHexColor = (color) => {
      if (!color) return color;
      
      // Trim whitespace
      let cleanColor = color.trim();
      
      // Add # if missing
      if (cleanColor && !cleanColor.startsWith('#')) {
        cleanColor = '#' + cleanColor;
      }
      
      // Validate hex color format
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      if (cleanColor && !hexColorRegex.test(cleanColor)) {
        throw new Error(`Invalid hex color format: ${color}. Must be in format #RRGGBB`);
      }
      
      return cleanColor;
    };

    // Save branding to draft if provided
    if (branding) {
      console.log('Saving branding to draft...');
      
      // Clean and validate all colors
      const cleanedBranding = {
        primaryColor: cleanHexColor(branding.primaryColor),
        secondaryColor: cleanHexColor(branding.secondaryColor),
        buttonColor: cleanHexColor(branding.buttonColor),
        textColor: cleanHexColor(branding.textColor),
        backgroundColor: cleanHexColor(branding.backgroundColor),
        headingColor: cleanHexColor(branding.headingColor)
      };
      
      updateData.draftBranding = cleanedBranding;
      console.log('Draft branding to save:', updateData.draftBranding);
    }

    // Update or create career page
    const careerPage = await CareerPage.findOneAndUpdate(
      { companyId },
      updateData,
      { 
        new: true, 
        upsert: true,
        runValidators: true
      }
    );

    res.status(200).json({
      message: 'Career page updated successfully',
      careerPage: {
        id: careerPage._id,
        companyId: careerPage.companyId,
        components: careerPage.components,
        isPublished: careerPage.isPublished,
        publishedAt: careerPage.publishedAt,
        createdAt: careerPage.createdAt,
        updatedAt: careerPage.updatedAt
      }
    });
  } catch (error) {
    console.error('Update career page error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: error.message,
        code: 'VALIDATION_ERROR'
      });
    }

    res.status(500).json({ 
      error: 'Failed to update career page',
      code: 'UPDATE_CAREER_PAGE_ERROR'
    });
  }
};

/**
 * Publish career page endpoint
 * POST /api/career-pages/publish
 */
export const publishCareerPage = async (req, res) => {
  try {
    // Use company ID from the authenticated user's token
    const companyId = req.companyId;

    // Find career page
    const careerPage = await CareerPage.findOne({ companyId });

    if (!careerPage) {
      return res.status(404).json({ 
        error: 'Career page not found. Please create a career page before publishing.',
        code: 'CAREER_PAGE_NOT_FOUND'
      });
    }

    // Copy draft content to published content
    careerPage.publishedComponents = careerPage.components;
    
    // Copy draft branding to published branding and update company branding
    if (careerPage.draftBranding && Object.keys(careerPage.draftBranding).length > 0) {
      console.log('Publishing draft branding...');
      careerPage.publishedBranding = careerPage.draftBranding;
      
      // Update company branding with published branding
      await Company.findByIdAndUpdate(
        companyId,
        { 
          $set: {
            'branding.primaryColor': careerPage.draftBranding.primaryColor,
            'branding.secondaryColor': careerPage.draftBranding.secondaryColor,
            'branding.buttonColor': careerPage.draftBranding.buttonColor,
            'branding.textColor': careerPage.draftBranding.textColor,
            'branding.backgroundColor': careerPage.draftBranding.backgroundColor
          }
        },
        { runValidators: true }
      );
      console.log('Company branding updated with published branding');
    }

    // Update isPublished and publishedAt
    careerPage.isPublished = true;
    careerPage.publishedAt = new Date();
    await careerPage.save();

    // Get company info for the public URL
    const company = await Company.findById(companyId);

    res.status(200).json({
      message: 'Career page published successfully',
      careerPage: {
        id: careerPage._id,
        companyId: careerPage.companyId,
        components: careerPage.components,
        isPublished: careerPage.isPublished,
        publishedAt: careerPage.publishedAt,
        updatedAt: careerPage.updatedAt
      },
      publicUrl: `/${company.slug}/careers`
    });
  } catch (error) {
    console.error('Publish career page error:', error);
    res.status(500).json({ 
      error: 'Failed to publish career page',
      code: 'PUBLISH_CAREER_PAGE_ERROR'
    });
  }
};

/**
 * Get public career page data endpoint
 * GET /api/career-pages/public/:slug
 * No authentication required
 */
export const getPublicCareerPage = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find company by slug
    const company = await Company.findOne({ slug });

    if (!company) {
      return res.status(404).json({ 
        error: 'Company not found',
        code: 'COMPANY_NOT_FOUND'
      });
    }

    // Find published career page
    const careerPage = await CareerPage.findOne({ 
      companyId: company._id,
      isPublished: true 
    });

    if (!careerPage) {
      return res.status(404).json({ 
        error: 'Career page not found or not published',
        code: 'CAREER_PAGE_NOT_PUBLISHED'
      });
    }

    // Get active jobs for the company
    const jobs = await Job.find({ 
      companyId: company._id,
      status: 'active'
    }).select('-__v');

    // Use published branding if available, otherwise fall back to company branding
    const publicBranding = careerPage.publishedBranding && Object.keys(careerPage.publishedBranding).length > 0
      ? careerPage.publishedBranding
      : company.branding;

    res.status(200).json({
      company: {
        id: company._id,
        name: company.name,
        slug: company.slug,
        logo: company.logo,
        branding: publicBranding
      },
      careerPage: {
        id: careerPage._id,
        components: careerPage.publishedComponents.length > 0 ? careerPage.publishedComponents : careerPage.components,
        publishedAt: careerPage.publishedAt
      },
      jobs: jobs.map(job => ({
        id: job._id,
        title: job.title,
        workPolicy: job.workPolicy,
        location: job.location,
        department: job.department,
        employmentType: job.employmentType,
        experienceLevel: job.experienceLevel,
        jobType: job.jobType,
        salaryRange: job.salaryRange,
        slug: job.slug,
        description: job.description,
        postedDate: job.postedDate
      }))
    });
  } catch (error) {
    console.error('Get public career page error:', error);
    res.status(500).json({ 
      error: 'Failed to get career page',
      code: 'GET_PUBLIC_CAREER_PAGE_ERROR'
    });
  }
};

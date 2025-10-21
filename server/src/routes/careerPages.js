import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { requireCompanyAccess } from '../middleware/companyAuth.js';
import { getCareerPage, updateCareerPage, publishCareerPage, getPublicCareerPage } from '../controllers/careerPageController.js';

const router = express.Router();

/**
 * GET /api/career-pages/public/:slug
 * Get published career page with company and jobs data
 * Public route - no authentication required
 * Note: This route must be defined before /:companyId to avoid route conflicts
 */
router.get(
  '/public/:slug',
  getPublicCareerPage
);

/**
 * GET /api/career-pages
 * Get career page configuration with components for the authenticated user's company
 * Protected route - requires authentication
 */
router.get(
  '/',
  authenticate,
  requireCompanyAccess,
  getCareerPage
);

/**
 * PUT /api/career-pages
 * Update or create career page configuration for the authenticated user's company
 * Protected route - requires authentication
 */
router.put(
  '/',
  authenticate,
  requireCompanyAccess,
  [
    body('components')
      .optional()
      .isArray()
      .withMessage('Components must be an array')
  ],
  updateCareerPage
);

/**
 * POST /api/career-pages/publish
 * Publish career page (set isPublished to true) for the authenticated user's company
 * Protected route - requires authentication
 */
router.post(
  '/publish',
  authenticate,
  requireCompanyAccess,
  publishCareerPage
);

export default router;

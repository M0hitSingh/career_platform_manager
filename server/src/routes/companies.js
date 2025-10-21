import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireCompanyAccess } from '../middleware/companyAuth.js';
import { updateBranding, updateLogo } from '../controllers/companyController.js';

const router = express.Router();

// PATCH /api/companies/branding - Update company branding (no ID needed - uses token)
router.patch('/branding', authenticate, requireCompanyAccess, updateBranding);

// POST /api/companies/logo - Update company logo (no ID needed - uses token)
router.post('/logo', authenticate, requireCompanyAccess, updateLogo);

export default router;

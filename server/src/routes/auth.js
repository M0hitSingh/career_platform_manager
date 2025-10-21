import express from 'express';
import { body } from 'express-validator';
import { signup, login, getCurrentUser } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/signup
 * Create new recruiter account
 */
router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('companyName')
      .trim()
      .notEmpty()
      .withMessage('Company name is required')
      .isLength({ min: 2 })
      .withMessage('Company name must be at least 2 characters long')
  ],
  signup
);

/**
 * POST /api/auth/login
 * Authenticate user and get JWT token
 */
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  login
);

/**
 * GET /api/auth/me
 * Get current authenticated user info
 */
router.get('/me', authenticate, getCurrentUser);

export default router;

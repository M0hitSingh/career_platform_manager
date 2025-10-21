import User from '../models/User.js';
import Company from '../models/Company.js';
import { generateUniqueCompanySlug } from '../utils/generateSlug.js';
import { generateToken } from '../utils/jwt.js';
import { validationResult } from 'express-validator';

/**
 * Signup endpoint - Create new recruiter account
 * POST /api/auth/signup
 */
export const signup = async (req, res) => {
  try {
    console.log('[POST /api/auth/signup] Signup request received');
    console.log('[POST /api/auth/signup] Email:', req.body.email, 'Company:', req.body.companyName);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('[POST /api/auth/signup] Validation failed:', errors.array());
      return res.status(400).json({ 
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors.array()
      });
    }

    const { email, password, companyName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('[POST /api/auth/signup] Email already exists:', email);
      return res.status(400).json({ 
        error: 'Email already registered',
        code: 'EMAIL_EXISTS'
      });
    }

    // Generate unique company slug
    const slug = await generateUniqueCompanySlug(companyName, Company);
    console.log('[POST /api/auth/signup] Generated company slug:', slug);

    // Create company
    const company = await Company.create({
      name: companyName,
      slug
    });

    // Create user
    const user = await User.create({
      email,
      password,
      companyId: company._id,
      role: 'recruiter'
    });

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      companyId: company._id,
      role: user.role
    });

    // Return response
    console.log('[POST /api/auth/signup] Account created successfully. User ID:', user._id, 'Company ID:', company._id);
    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        company: {
          id: company._id,
          name: company.name,
          slug: company.slug
        }
      }
    });
  } catch (error) {
    console.error('[POST /api/auth/signup] Signup error:', error);
    res.status(500).json({ 
      error: 'Failed to create account',
      code: 'SIGNUP_ERROR'
    });
  }
};

/**
 * Login endpoint - Authenticate user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    console.log('[POST /api/auth/login] Login request received');
    console.log('[POST /api/auth/login] Email:', req.body.email);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('[POST /api/auth/login] Validation failed:', errors.array());
      return res.status(400).json({ 
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).populate('companyId');
    
    if (!user) {
      console.log('[POST /api/auth/login] User not found:', email);
      return res.status(401).json({ 
        error: 'Email not found. Please check your email or sign up.',
        code: 'EMAIL_NOT_FOUND'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log('[POST /api/auth/login] Invalid password for user:', email);
      return res.status(401).json({ 
        error: 'Incorrect password. Please try again.',
        code: 'INCORRECT_PASSWORD'
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      companyId: user.companyId._id,
      role: user.role
    });

    // Return response
    console.log('[POST /api/auth/login] Login successful. User ID:', user._id, 'Company:', user.companyId.name);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        company: {
          id: user.companyId._id,
          name: user.companyId.name,
          slug: user.companyId.slug
        }
      }
    });
  } catch (error) {
    console.error('[POST /api/auth/login] Login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      code: 'LOGIN_ERROR'
    });
  }
};

/**
 * Get current user endpoint
 * GET /api/auth/me
 */
export const getCurrentUser = async (req, res) => {
  try {
    // User info is already attached by authenticate middleware
    const user = await User.findById(req.user.userId)
      .select('-password')
      .populate('companyId');

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        company: {
          id: user.companyId._id,
          name: user.companyId.name,
          slug: user.companyId.slug,
          logo: user.companyId.logo,
          branding: user.companyId.branding
        }
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      error: 'Failed to get user info',
      code: 'GET_USER_ERROR'
    });
  }
};

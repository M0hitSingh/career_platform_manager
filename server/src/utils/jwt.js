import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for authenticated user
 * @param {Object} payload - Token payload containing userId, companyId, role
 * @returns {string} - JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

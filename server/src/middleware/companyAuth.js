/**
 * Simple company authorization middleware
 * Uses the company ID from the authenticated user's token
 * No need to pass company ID in URL - it's automatically derived from the token
 */

/**
 * Middleware that ensures user can only access their own company's resources
 * Automatically uses the company ID from the JWT token
 */
export const requireCompanyAccess = (req, res, next) => {
  // Company ID is already set by the auth middleware
  if (!req.companyId) {
    return res.status(401).json({
      error: 'Authentication required',
      code: 'NO_COMPANY_ACCESS'
    });
  }
  
  next();
};

/**
 * Middleware that validates a company ID parameter matches the user's company
 * Use this when you need to validate a company ID in the URL
 */
export const validateCompanyParam = (paramName = 'companyId') => {
  return (req, res, next) => {
    const requestedCompanyId = req.params[paramName];
    
    if (!requestedCompanyId) {
      return res.status(400).json({
        error: `${paramName} parameter is required`,
        code: 'MISSING_COMPANY_PARAM'
      });
    }
    
    if (req.companyId !== requestedCompanyId) {
      return res.status(403).json({
        error: 'Access denied. You can only access your own company\'s resources',
        code: 'UNAUTHORIZED_COMPANY_ACCESS'
      });
    }
    
    next();
  };
};

export default {
  requireCompanyAccess,
  validateCompanyParam
};
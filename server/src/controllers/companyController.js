import Company from '../models/Company.js';

/**
 * Update company branding configuration
 * PATCH /api/companies/:id/branding
 */
export const updateBranding = async (req, res) => {
  try {
    // Use company ID from the authenticated user's token
    const companyId = req.companyId;
    const { primaryColor, secondaryColor, buttonColor, textColor, backgroundColor } = req.body;

    // Validate that at least one color is provided
    if (!primaryColor && !secondaryColor && !buttonColor && !textColor && !backgroundColor) {
      return res.status(400).json({
        error: 'At least one color field must be provided',
        code: 'NO_BRANDING_DATA'
      });
    }

    // Build branding update object
    const brandingUpdate = {};
    if (primaryColor) brandingUpdate['branding.primaryColor'] = primaryColor;
    if (secondaryColor) brandingUpdate['branding.secondaryColor'] = secondaryColor;
    if (buttonColor) brandingUpdate['branding.buttonColor'] = buttonColor;
    if (textColor) brandingUpdate['branding.textColor'] = textColor;
    if (backgroundColor) brandingUpdate['branding.backgroundColor'] = backgroundColor;

    // Update company branding
    const company = await Company.findByIdAndUpdate(
      companyId,
      { $set: brandingUpdate },
      { 
        new: true, 
        runValidators: true // This will validate hex color format
      }
    );

    if (!company) {
      return res.status(404).json({
        error: 'Company not found',
        code: 'COMPANY_NOT_FOUND'
      });
    }

    res.json({
      message: 'Branding updated successfully',
      branding: company.branding
    });
  } catch (error) {
    console.error('Update branding error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Invalid branding data',
        code: 'VALIDATION_ERROR',
        details: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to update branding',
      code: 'UPDATE_BRANDING_ERROR'
    });
  }
};

/**
 * Update company logo
 * POST /api/companies/:id/logo
 */
export const updateLogo = async (req, res) => {
  try {
    // Use company ID from the authenticated user's token
    const companyId = req.companyId;
    const { logo } = req.body;

    if (!logo) {
      return res.status(400).json({
        error: 'Logo URL or base64 data is required',
        code: 'NO_LOGO_DATA'
      });
    }

    // Update company logo
    const company = await Company.findByIdAndUpdate(
      companyId,
      { logo },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({
        error: 'Company not found',
        code: 'COMPANY_NOT_FOUND'
      });
    }

    res.json({
      message: 'Logo updated successfully',
      logo: company.logo
    });
  } catch (error) {
    console.error('Update logo error:', error);
    res.status(500).json({
      error: 'Failed to update logo',
      code: 'UPDATE_LOGO_ERROR'
    });
  }
};

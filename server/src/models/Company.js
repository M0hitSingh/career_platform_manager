const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Company slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  logo: {
    type: String,
    default: null
  },
  branding: {
    primaryColor: {
      type: String,
      default: '#3B82F6',
      match: [/^#[0-9A-Fa-f]{6}$/, 'Primary color must be a valid hex color']
    },
    secondaryColor: {
      type: String,
      default: '#10B981',
      match: [/^#[0-9A-Fa-f]{6}$/, 'Secondary color must be a valid hex color']
    },
    buttonColor: {
      type: String,
      default: '#EF4444',
      match: [/^#[0-9A-Fa-f]{6}$/, 'Button color must be a valid hex color']
    },
    textColor: {
      type: String,
      default: '#1F2937',
      match: [/^#[0-9A-Fa-f]{6}$/, 'Text color must be a valid hex color']
    },
    backgroundColor: {
      type: String,
      default: '#F3F4F6',
      match: [/^#[0-9A-Fa-f]{6}$/, 'Background color must be a valid hex color']
    }
  }
}, {
  timestamps: true
});

// Create unique index on slug field
companySchema.index({ slug: 1 }, { unique: true });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;

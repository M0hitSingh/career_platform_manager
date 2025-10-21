const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required']
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  workPolicy: {
    type: String,
    enum: ['Remote', 'Hybrid', 'On-site'],
    default: 'On-site'
  },
  location: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  employmentType: {
    type: String,
    enum: ['Full time', 'Part time', 'Contract'],
    default: 'Full time'
  },
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior', 'Lead'],
    default: 'Mid'
  },
  jobType: {
    type: String,
    enum: ['Permanent', 'Temporary', 'Internship'],
    default: 'Permanent'
  },
  salaryRange: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Job slug is required'],
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'inactive'],
    default: 'draft'
  },
  applicationCount: {
    type: Number,
    default: 0,
    min: 0
  },
  postedDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index on companyId and status for efficient queries
jobSchema.index({ companyId: 1, status: 1 });

// Virtual field for calculating posted_days_ago
jobSchema.virtual('postedDaysAgo').get(function() {
  if (!this.postedDate) {
    return null;
  }
  const now = new Date();
  const diffTime = Math.abs(now - this.postedDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Ensure virtuals are included when converting to JSON
jobSchema.set('toJSON', { virtuals: true });
jobSchema.set('toObject', { virtuals: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;

const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['about', 'jobs', 'banner', 'image', 'video', 'html', 'text', 'footer'],
    validate: {
      validator: function(value) {
        return ['about', 'jobs', 'banner', 'image', 'video', 'html', 'text', 'footer'].includes(value);
      },
      message: 'Invalid component type. Must be one of: about, jobs, banner, image, video, html, text, footer'
    }
  },
  order: {
    type: Number,
    required: true,
    min: 0
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { _id: false });

const brandingSchema = new mongoose.Schema({
  primaryColor: {
    type: String,
    default: '#3B82F6',
    match: [/^#[0-9A-Fa-f]{6}$/, 'Primary color must be a valid hex color']
  },
  headingColor: {
    type: String,
    default: '#3B82F6',
    match: [/^#[0-9A-Fa-f]{6}$/, 'Heading color must be a valid hex color']
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
}, { _id: false });

const careerPageSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required'],
    unique: true
  },
  components: {
    type: [componentSchema],
    default: []
  },
  draftBranding: {
    type: brandingSchema,
    default: {}
  },
  publishedComponents: {
    type: [componentSchema],
    default: []
  },
  publishedBranding: {
    type: brandingSchema,
    default: {}
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Validate component types before saving
careerPageSchema.pre('save', function(next) {
  const validTypes = ['about', 'jobs', 'banner', 'image', 'video', 'html', 'text', 'footer'];
  
  for (const component of this.components) {
    if (!validTypes.includes(component.type)) {
      return next(new Error(`Invalid component type: ${component.type}`));
    }
  }
  
  next();
});

const CareerPage = mongoose.model('CareerPage', careerPageSchema);

module.exports = CareerPage;

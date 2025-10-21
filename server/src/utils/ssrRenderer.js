import React from 'react';
import { renderToString } from 'react-dom/server';

/**
 * SSR utility function to render React components to HTML string
 * This creates a complete HTML document with meta tags and structured data
 */

// Simple server-side versions of career page components
const ComponentWrapper = ({ primaryColor, secondaryColor, textColor, buttonColor, backgroundColor, children, className = '' }) => {
  const style = {
    '--primary-color': primaryColor,
    '--secondary-color': secondaryColor,
    '--text-color': textColor,
    '--button-color': buttonColor,
    '--background-color': backgroundColor,
    padding: 0,
    margin: 0
  };

  return React.createElement('div', {
    className: `component-wrapper ${className}`,
    style
  }, children);
};

const AboutSection = ({ config = {}, branding = {} }) => {
  const {
    heading = '',
    text = '',
    alignment = 'start'
  } = config;

  // Map alignment values to CSS classes
  const alignmentMap = {
    start: 'text-left',
    center: 'text-center',
    end: 'text-right'
  };

  const alignmentClass = alignmentMap[alignment] || 'text-left';

  return React.createElement(ComponentWrapper, {
    ...branding,
    className: 'about-section'
  },
    React.createElement('div', {
      className: 'w-full',
      style: {
        backgroundColor: branding.backgroundColor ? `${branding.backgroundColor}F0` : '#FFFFFFF0',
        minHeight: '200px'
      }
    },
      React.createElement('div', {
        className: 'w-full max-w-4xl mx-auto px-6 py-12'
      },
        React.createElement('div', {
          className: `space-y-6 ${alignmentClass}`
        },
          // Heading
          heading && React.createElement('h2', {
            className: 'text-2xl md:text-3xl font-bold',
            style: { color: branding.textColor }
          }, heading),

          // Text content
          text && React.createElement('div', {
            className: 'text-base md:text-lg leading-relaxed whitespace-pre-line',
            style: { color: branding.textColor }
          }, text),

          // Empty state
          !heading && !text && React.createElement('div', {
            className: 'text-center py-24 border-2 border-dashed rounded-lg',
            style: { borderColor: branding.primaryColor || '#3B82F6' }
          },
            React.createElement('p', {
              style: { color: branding.textColor || '#374151' }
            }, 'No content available')
          )
        )
      )
    )
  );
};

const JobSection = ({ config = {}, jobs = [], branding = {} }) => {
  // Extract unique filter options from jobs
  const filterOptions = {
    departments: [...new Set(jobs.map(job => job.department).filter(Boolean))],
    locations: [...new Set(jobs.map(job => job.location).filter(Boolean))],
    workPolicies: [...new Set(jobs.map(job => job.workPolicy).filter(Boolean))],
    employmentTypes: [...new Set(jobs.map(job => job.employmentType).filter(Boolean))],
    experienceLevels: [...new Set(jobs.map(job => job.experienceLevel).filter(Boolean))]
  };

  const JobListItem = ({ job }) => {
    return React.createElement('div', {
      className: 'bg-white border rounded-lg p-6 hover:shadow-md transition-shadow',
      style: { borderColor: branding.primaryColor }
    },
      React.createElement('div', {
        className: 'flex justify-between items-start'
      },
        React.createElement('div', {
          className: 'flex-1'
        },
          React.createElement('h3', {
            className: 'text-xl font-semibold mb-2',
            style: { color: branding.primaryColor }
          }, job.title),

          React.createElement('div', {
            className: 'flex flex-wrap gap-4 text-sm mb-3',
            style: { color: branding.textColor }
          },
            job.department && React.createElement('span', {
              className: 'flex items-center'
            }, job.department),

            job.location && React.createElement('span', {
              className: 'flex items-center'
            }, job.location),

            job.workPolicy && React.createElement('span', {
              className: 'flex items-center'
            }, job.workPolicy),

            job.employmentType && React.createElement('span', {
              className: 'flex items-center'
            }, job.employmentType),

            job.experienceLevel && React.createElement('span', {
              className: 'flex items-center'
            }, job.experienceLevel)
          ),

          job.salaryRange && React.createElement('p', {
            className: 'text-sm font-semibold mb-2',
            style: { color: branding.textColor }
          }, job.salaryRange),

          job.postedDate && React.createElement('p', {
            className: 'text-xs',
            style: { color: branding.textColor, opacity: 0.7 }
          }, `Posted ${getPostedDaysAgo(job.postedDate)}`)
        ),

        React.createElement('div', {
          className: 'ml-4'
        },
          React.createElement('button', {
            className: 'px-4 py-2 rounded-md font-medium text-white transition-colors',
            style: { backgroundColor: branding.buttonColor || branding.primaryColor }
          }, 'Apply')
        )
      )
    );
  };

  return React.createElement(ComponentWrapper, {
    ...branding,
    className: 'job-section'
  },
    React.createElement('div', {
      className: 'w-full',
      style: { backgroundColor: branding.backgroundColor ? `${branding.backgroundColor}F0` : '#FFFFFFF0' }
    },
      React.createElement('div', {
        className: 'w-full max-w-6xl mx-auto px-6 py-12'
      },
        React.createElement('h2', {
          className: 'text-3xl font-bold mb-8',
          style: { color: branding.primaryColor }
        }, 'Open Positions'),

        // Search and Sort Controls
        React.createElement('div', {
          className: 'mb-6 space-y-4'
        },
          React.createElement('div', {
            className: 'flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'
          },
            // Search Input
            React.createElement('div', {
              className: 'flex-1 max-w-md'
            },
              React.createElement('input', {
                type: 'text',
                placeholder: 'Search jobs by title, department, location...',
                className: 'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50',
                style: { borderColor: branding.primaryColor },
                id: 'job-search'
              })
            ),

            // Sort Dropdown
            React.createElement('div', {
              className: 'flex items-center gap-2'
            },
              React.createElement('label', {
                className: 'text-sm font-medium',
                style: { color: branding.textColor },
                htmlFor: 'job-sort'
              }, 'Sort by:'),
              React.createElement('select', {
                className: 'px-3 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50',
                style: { borderColor: branding.primaryColor },
                id: 'job-sort'
              },
                React.createElement('option', { value: 'newest' }, 'Newest First'),
                React.createElement('option', { value: 'oldest' }, 'Oldest First'),
                React.createElement('option', { value: 'title' }, 'Job Title A-Z')
              )
            )
          )
        ),

        // Filter Controls
        React.createElement('div', {
          className: 'mb-8 p-6 bg-gray-50 rounded-lg'
        },
          React.createElement('div', {
            className: 'flex items-center justify-between mb-4'
          },
            React.createElement('h3', {
              className: 'text-lg font-semibold',
              style: { color: branding.textColor }
            }, 'Filter Jobs'),
            React.createElement('button', {
              className: 'text-sm underline hover:no-underline',
              style: { color: branding.secondaryColor },
              id: 'clear-filters'
            }, 'Clear all filters')
          ),

          React.createElement('div', {
            className: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'
          },
            // Department Filter
            React.createElement('select', {
              className: 'px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50',
              style: { borderColor: branding.primaryColor },
              id: 'filter-department'
            },
              React.createElement('option', { value: '' }, 'All Departments'),
              ...filterOptions.departments.map(dept =>
                React.createElement('option', { key: dept, value: dept }, dept)
              )
            ),

            // Location Filter
            React.createElement('select', {
              className: 'px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50',
              style: { borderColor: branding.primaryColor },
              id: 'filter-location'
            },
              React.createElement('option', { value: '' }, 'All Locations'),
              ...filterOptions.locations.map(loc =>
                React.createElement('option', { key: loc, value: loc }, loc)
              )
            ),

            // Work Policy Filter
            React.createElement('select', {
              className: 'px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50',
              style: { borderColor: branding.primaryColor },
              id: 'filter-workPolicy'
            },
              React.createElement('option', { value: '' }, 'All Work Policies'),
              ...filterOptions.workPolicies.map(policy =>
                React.createElement('option', { key: policy, value: policy }, policy)
              )
            ),

            // Employment Type Filter
            React.createElement('select', {
              className: 'px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50',
              style: { borderColor: branding.primaryColor },
              id: 'filter-employmentType'
            },
              React.createElement('option', { value: '' }, 'All Types'),
              ...filterOptions.employmentTypes.map(type =>
                React.createElement('option', { key: type, value: type }, type)
              )
            ),

            // Experience Level Filter
            React.createElement('select', {
              className: 'px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50',
              style: { borderColor: branding.primaryColor },
              id: 'filter-experienceLevel'
            },
              React.createElement('option', { value: '' }, 'All Levels'),
              ...filterOptions.experienceLevels.map(level =>
                React.createElement('option', { key: level, value: level }, level)
              )
            )
          ),

          React.createElement('p', {
            className: 'mt-4 text-sm',
            style: { color: branding.textColor },
            id: 'job-count'
          }, `Showing ${jobs.length} of ${jobs.length} jobs`)
        ),

        // Job Listings
        jobs.length === 0
          ? React.createElement('div', {
            className: 'text-center py-12 border-2 border-dashed rounded-lg',
            style: { borderColor: branding.primaryColor }
          },
            React.createElement('p', {
              style: { color: branding.textColor }
            }, 'No open positions at this time')
          )
          : React.createElement('div', {
            className: 'space-y-4',
            id: 'job-listings'
          },
            ...jobs.map(job => React.createElement(JobListItem, { key: job._id, job }))
          )
      )
    )
  );
};

const CompanyBanner = ({ config = {}, branding = {} }) => {
  const {
    imageUrl = '',
    text = '',
    description = '',
    buttonText = '',
    buttonLink = '',
    textPosition = { horizontal: 'center', vertical: 'mid' },
    height = 50
  } = config;

  const horizontalAlignmentMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end'
  };

  const verticalAlignmentMap = {
    up: 'items-start',
    mid: 'items-center',
    down: 'items-end'
  };

  const textAlignmentMap = {
    start: 'text-left',
    center: 'text-center',
    end: 'text-right'
  };

  const horizontalClass = horizontalAlignmentMap[textPosition.horizontal] || 'justify-center';
  const verticalClass = verticalAlignmentMap[textPosition.vertical] || 'items-center';
  const textAlign = textAlignmentMap[textPosition.horizontal] || 'text-center';

  const backgroundStyle = imageUrl
    ? `url(${imageUrl})`
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

  return React.createElement(ComponentWrapper, {
    ...branding,
    className: 'company-banner'
  },
    React.createElement('div', {
      className: `relative w-full bg-center flex ${horizontalClass} ${verticalClass}`,
      style: {
        backgroundImage: backgroundStyle,
        height: `${height}vh`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    },
      React.createElement('div', {
        className: 'absolute inset-0'
      }),
      React.createElement('div', {
        className: `relative z-10 w-full h-full flex flex-col ${horizontalClass} ${verticalClass} p-8 space-y-6 max-w-4xl mx-auto`
      },
        text && React.createElement('h1', {
          className: `text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg ${textAlign}`,
          style: { color: branding.textColor === '#1F2937' ? '#FFFFFF' : branding.textColor }
        }, text),

        description && React.createElement('p', {
          className: `text-sm md:text-base text-white drop-shadow-lg max-w-2xl whitespace-pre-line ${textAlign}`,
          style: { color: branding.textColor === '#1F2937' ? '#FFFFFF' : branding.textColor }
        }, description),

        buttonText && React.createElement('div', {
          className: `flex ${horizontalClass}`
        },
          React.createElement('a', {
            href: buttonLink || '#',
            className: 'px-6 py-3 rounded-md font-medium text-white transition-colors shadow-lg',
            style: { backgroundColor: branding.buttonColor || '#3B82F6' }
          }, buttonText)
        ),

        // Show placeholder if no content
        !text && !description && !buttonText && React.createElement('h1', {
          className: `text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg ${textAlign}`,
          style: { color: branding.textColor === '#1F2937' ? '#FFFFFF' : branding.textColor }
        }, 'Welcome')
      )
    )
  );
};

const ImageBox = ({ config = {}, branding = {} }) => {
  const { images = [] } = config;

  if (images.length === 0) {
    return React.createElement(ComponentWrapper, {
      ...branding,
      className: 'image-box'
    },
      React.createElement('div', {
        className: 'w-full py-12',
        style: { backgroundColor: branding.backgroundColor ? `${branding.backgroundColor}F0` : '#FFFFFFF0' }
      },
        React.createElement('div', {
          className: 'w-full max-w-6xl mx-auto px-6 text-center'
        },
          React.createElement('p', {
            style: { color: branding.textColor }
          }, 'No images to display')
        )
      )
    );
  }

  return React.createElement(ComponentWrapper, {
    ...branding,
    className: 'image-box'
  },
    React.createElement('div', {
      className: 'w-full py-12',
      style: { backgroundColor: branding.backgroundColor ? `${branding.backgroundColor}F0` : '#FFFFFFF0' }
    },
      React.createElement('div', {
        className: 'w-full max-w-6xl mx-auto px-6'
      },
        React.createElement('div', {
          className: images.length > 3 ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex justify-around items-center gap-6 flex-wrap'
        },
          ...images.map((image, index) =>
            React.createElement('div', {
              key: index,
              className: 'text-center'
            },
              React.createElement('img', {
                src: image.url,
                alt: image.caption || `Image ${index + 1}`,
                className: 'w-full h-64 object-cover rounded-lg shadow-md'
              }),
              image.caption && React.createElement('p', {
                className: 'mt-2 text-sm',
                style: { color: branding.textColor }
              }, image.caption)
            )
          )
        )
      )
    )
  );
};

const VideoBox = ({ config = {}, branding = {} }) => {
  const { videoUrl } = config;

  if (!videoUrl) {
    return React.createElement(ComponentWrapper, {
      ...branding,
      className: 'video-box'
    },
      React.createElement('div', {
        className: 'w-full py-12',
        style: { backgroundColor: branding.backgroundColor ? `${branding.backgroundColor}F0` : '#FFFFFFF0' }
      },
        React.createElement('div', {
          className: 'w-full max-w-6xl mx-auto px-6 text-center'
        },
          React.createElement('p', {
            style: { color: branding.textColor }
          }, 'No video to display')
        )
      )
    );
  }

  return React.createElement(ComponentWrapper, {
    ...branding,
    className: 'video-box'
  },
    React.createElement('div', {
      className: 'w-full py-12',
      style: { backgroundColor: branding.backgroundColor ? `${branding.backgroundColor}F0` : '#FFFFFFF0' }
    },
      React.createElement('div', {
        className: 'w-full max-w-4xl mx-auto px-6'
      },
        React.createElement('div', {
          className: 'aspect-video'
        },
          React.createElement('iframe', {
            src: videoUrl,
            className: 'w-full h-full rounded-lg',
            frameBorder: '0',
            allowFullScreen: true
          })
        )
      )
    )
  );
};

const TextComponent = ({ config = {}, branding = {} }) => {
  const { heading, subheading, text, alignment = 'start' } = config;

  const alignmentClasses = {
    start: 'text-left',
    center: 'text-center',
    end: 'text-right'
  };

  return React.createElement(ComponentWrapper, {
    ...branding,
    className: 'text-component'
  },
    React.createElement('div', {
      className: 'w-full py-12',
      style: { backgroundColor: branding.backgroundColor ? `${branding.backgroundColor}F0` : '#FFFFFFF0' }
    },
      React.createElement('div', {
        className: `w-full max-w-6xl mx-auto px-6 ${alignmentClasses[alignment]}`
      },
        heading && React.createElement('h2', {
          className: 'text-3xl font-bold mb-4',
          style: { color: branding.primaryColor }
        }, heading),

        subheading && React.createElement('h3', {
          className: 'text-xl font-semibold mb-6',
          style: { color: branding.secondaryColor }
        }, subheading),

        text && React.createElement('div', {
          className: 'prose max-w-none',
          style: { color: branding.textColor },
          dangerouslySetInnerHTML: { __html: text }
        })
      )
    )
  );
};

const HtmlBox = ({ config = {}, branding = {} }) => {
  const { html } = config;

  return React.createElement(ComponentWrapper, {
    ...branding,
    className: 'html-box'
  },
    React.createElement('div', {
      className: 'w-full py-12',
      style: { backgroundColor: branding.backgroundColor ? `${branding.backgroundColor}F0` : '#FFFFFFF0' }
    },
      React.createElement('div', {
        className: 'w-full max-w-6xl mx-auto px-6'
      },
        React.createElement('div', {
          dangerouslySetInnerHTML: { __html: html || '' }
        })
      )
    )
  );
};

// Helper function to calculate days ago
const getPostedDaysAgo = (postedDate) => {
  const now = new Date();
  const posted = new Date(postedDate);
  const diffTime = Math.abs(now - posted);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  return `${diffDays} days ago`;
};

// Component type mapping
const componentMap = {
  about: AboutSection,
  jobs: JobSection,
  banner: CompanyBanner,
  image: ImageBox,
  video: VideoBox,
  text: TextComponent,
  html: HtmlBox
};

/**
 * Renders a career page component based on type
 */
const renderComponent = (component, jobs, branding) => {
  const ComponentType = componentMap[component.type];
  if (!ComponentType) {
    return null;
  }

  const config = component.config || {};

  // Get padding from config (matching ComponentRenderer.jsx)
  const paddingLeft = config.paddingLeft || 0;
  const paddingRight = config.paddingRight || 0;

  // Wrap component with padding container (matching ComponentRenderer.jsx)
  return React.createElement('div', {
    key: component.id,
    style: {
      paddingLeft: `${paddingLeft}%`,
      paddingRight: `${paddingRight}%`
    }
  },
    React.createElement(ComponentType, {
      config,
      jobs: component.type === 'jobs' ? jobs : undefined,
      branding
    })
  );
};

/**
 * Renders the complete career page
 */
const CareerPageRenderer = ({ careerPage, jobs, company }) => {
  const branding = {
    primaryColor: company.branding?.primaryColor || '#3B82F6',
    secondaryColor: company.branding?.secondaryColor || '#10B981',
    textColor: company.branding?.textColor || '#1F2937',
    buttonColor: company.branding?.buttonColor || '#EF4444',
    backgroundColor: company.branding?.backgroundColor || '#F3F4F6'
  };

  // Sort components by order
  const sortedComponents = [...(careerPage.components || [])].sort((a, b) => a.order - b.order);

  return React.createElement('div', {
    className: 'career-page',
    style: { backgroundColor: branding.backgroundColor }
  },
    // Page components
    ...sortedComponents.map(component => renderComponent(component, jobs, branding)),
    // Copyright footer
    React.createElement('footer', {
      className: 'w-full py-8 mt-12 border-t',
      style: {
        borderColor: branding.primaryColor + '20',
        backgroundColor: branding.backgroundColor
      }
    },
      React.createElement('div', {
        className: 'max-w-6xl mx-auto px-6 text-center'
      },
        React.createElement('p', {
          className: 'text-sm',
          style: { color: branding.textColor, opacity: 0.7 }
        }, `© 2025 ${company.name}. All rights reserved.`)
      )
    )
  );
};

/**
 * Generates SEO meta tags
 */
const generateMetaTags = (company, jobs) => {
  const jobCount = jobs.length;
  const title = `${company.name} - Careers`;
  const description = `Join ${company.name}. ${jobCount > 0 ? `${jobCount} open position${jobCount > 1 ? 's' : ''} available.` : 'Explore career opportunities.'} Find your next role with us.`;

  // Get unique departments and locations for keywords
  const departments = [...new Set(jobs.map(job => job.department).filter(Boolean))];
  const locations = [...new Set(jobs.map(job => job.location).filter(Boolean))];
  const keywords = [
    company.name,
    'careers',
    'jobs',
    'employment',
    'opportunities',
    ...departments,
    ...locations
  ].join(', ');

  return {
    title,
    description,
    keywords,
    favicon: company.logo || '',
    ogTitle: title,
    ogDescription: description,
    ogImage: company.logo || '',
    ogUrl: `https://yourplatform.com/${company.slug}/careers`,
    ogSiteName: 'Career Platform Manager',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: company.logo || '',
    canonical: `https://yourplatform.com/${company.slug}/careers`
  };
};

/**
 * Generates structured data for jobs (JSON-LD)
 */
const generateJobStructuredData = (jobs, company) => {
  if (!jobs || jobs.length === 0) {
    return [];
  }

  return jobs.map(job => {
    // Calculate valid through date (30 days from posted date or current date)
    const postedDate = job.postedDate ? new Date(job.postedDate) : new Date();
    const validThrough = new Date(postedDate);
    validThrough.setDate(validThrough.getDate() + 30);

    // Map employment types to schema.org values
    const employmentTypeMap = {
      'Full time': 'FULL_TIME',
      'Part time': 'PART_TIME',
      'Contract': 'CONTRACTOR',
      'Temporary': 'TEMPORARY',
      'Internship': 'INTERN'
    };

    // Create base job posting object
    const jobPosting = {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": job.title,
      "description": job.description || `${job.title} position at ${company.name}. ${job.department ? `Department: ${job.department}.` : ''} ${job.experienceLevel ? `Experience level: ${job.experienceLevel}.` : ''}`,
      "identifier": {
        "@type": "PropertyValue",
        "name": company.name,
        "value": job._id || job.id
      },
      "datePosted": postedDate.toISOString().split('T')[0],
      "validThrough": validThrough.toISOString().split('T')[0],
      "employmentType": employmentTypeMap[job.employmentType] || job.employmentType,
      "hiringOrganization": {
        "@type": "Organization",
        "name": company.name,
        "sameAs": `https://yourplatform.com/${company.slug}/careers`,
        ...(company.logo && { "logo": company.logo })
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": job.location || "Remote"
        }
      },
      "applicantLocationRequirements": {
        "@type": "Country",
        "name": "US"
      }
    };

    // Add optional fields if they exist
    if (job.department) {
      jobPosting.industry = job.department;
    }

    if (job.experienceLevel) {
      jobPosting.experienceRequirements = job.experienceLevel;
    }

    if (job.workPolicy) {
      jobPosting.jobLocationType = job.workPolicy === 'Remote' ? 'TELECOMMUTE' : 'PHYSICAL';
    }

    if (job.salaryRange) {
      // Try to parse salary range
      const salaryMatch = job.salaryRange.match(/\$?([\d,]+)\s*-?\s*\$?([\d,]+)?/);
      if (salaryMatch) {
        const minSalary = parseInt(salaryMatch[1].replace(/,/g, ''));
        const maxSalary = salaryMatch[2] ? parseInt(salaryMatch[2].replace(/,/g, '')) : minSalary;

        jobPosting.baseSalary = {
          "@type": "MonetaryAmount",
          "currency": "USD",
          "value": {
            "@type": "QuantitativeValue",
            "minValue": minSalary,
            "maxValue": maxSalary,
            "unitText": "YEAR"
          }
        };
      } else {
        // If we can't parse it, just include as text
        jobPosting.baseSalary = {
          "@type": "MonetaryAmount",
          "currency": "USD",
          "value": {
            "@type": "QuantitativeValue",
            "value": job.salaryRange
          }
        };
      }
    }

    // Add job benefits if available (placeholder for future enhancement)
    jobPosting.jobBenefits = "Competitive salary and benefits package";

    // Add application URL (would link to application form in real implementation)
    jobPosting.url = `https://yourplatform.com/${company.slug}/careers#job-${job._id || job.id}`;

    return jobPosting;
  });
};

/**
 * Creates complete HTML document with SSR content
 */
const createHTMLDocument = (content, metaTags, structuredData, backgroundColor) => {
  // Escape HTML attributes to prevent XSS
  const escapeHtml = (text) => {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(metaTags.title)}</title>
    <meta name="description" content="${escapeHtml(metaTags.description)}">
    <meta name="keywords" content="${escapeHtml(metaTags.keywords)}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="${escapeHtml(metaTags.title)}">
    
    <!-- Favicon -->
    ${metaTags.favicon ? `<link rel="icon" type="image/png" href="${escapeHtml(metaTags.favicon)}">` : ''}
    ${metaTags.favicon ? `<link rel="apple-touch-icon" href="${escapeHtml(metaTags.favicon)}">` : ''}
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${escapeHtml(metaTags.canonical)}">
    
    <!-- Open Graph tags -->
    <meta property="og:title" content="${escapeHtml(metaTags.ogTitle)}">
    <meta property="og:description" content="${escapeHtml(metaTags.ogDescription)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${escapeHtml(metaTags.ogUrl)}">
    <meta property="og:site_name" content="${escapeHtml(metaTags.ogSiteName)}">
    ${metaTags.ogImage ? `<meta property="og:image" content="${escapeHtml(metaTags.ogImage)}">` : ''}
    ${metaTags.ogImage ? `<meta property="og:image:alt" content="${escapeHtml(metaTags.title)} Logo">` : ''}
    
    <!-- Twitter Card tags -->
    <meta name="twitter:card" content="${escapeHtml(metaTags.twitterCard)}">
    <meta name="twitter:title" content="${escapeHtml(metaTags.twitterTitle)}">
    <meta name="twitter:description" content="${escapeHtml(metaTags.twitterDescription)}">
    ${metaTags.twitterImage ? `<meta name="twitter:image" content="${escapeHtml(metaTags.twitterImage)}">` : ''}
    ${metaTags.twitterImage ? `<meta name="twitter:image:alt" content="${escapeHtml(metaTags.title)} Logo">` : ''}
    
    <!-- Additional SEO tags -->
    <meta name="theme-color" content="#3B82F6">
    <meta name="msapplication-TileColor" content="#3B82F6">
    
    <!-- Structured Data -->
    ${structuredData.length > 0 ? `
    <script type="application/ld+json">
    ${JSON.stringify(structuredData, null, 2)}
    </script>
    ` : ''}
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <style>
        .component-wrapper {
            width: 100%;
            margin: 0;
            padding: 0;
        }
        
        .career-page {
            min-height: 100vh;
            margin: 0;
            padding: 0;
        }
        
        body {
            margin: 0;
            padding: 0;
            background-color: ${backgroundColor || '#F3F4F6'};
            overflow-x: hidden;
        }
        
        .hidden {
            display: none !important;
        }
        
        /* Fix width overflow issues */
        * {
            box-sizing: border-box;
        }
        
        .career-page > * {
            max-width: 100vw;
            overflow-x: hidden;
        }
        
        /* Mobile responsiveness improvements */
        @media (max-width: 768px) {
            .job-section .grid {
                grid-template-columns: 1fr;
                gap: 0.75rem;
            }
            
            .job-section .flex-col {
                gap: 0.75rem;
            }
            
            .job-section .px-6 {
                padding-left: 1rem;
                padding-right: 1rem;
            }
            
            .job-section .py-12 {
                padding-top: 2rem;
                padding-bottom: 2rem;
            }
            
            .job-section .text-3xl {
                font-size: 1.875rem;
                line-height: 2.25rem;
            }
            
            .job-section .p-6 {
                padding: 1rem;
            }
        }
        
        @media (max-width: 640px) {
            .job-section .grid {
                grid-template-columns: 1fr;
            }
            
            .job-section .flex-wrap {
                flex-direction: column;
                align-items: stretch;
            }
            
            .job-section .max-w-md {
                max-width: 100%;
            }
            
            .job-section select,
            .job-section input {
                width: 100%;
                min-width: 0;
            }
        }
        
        /* Prevent horizontal overflow on all screen sizes */
        .max-w-6xl {
            max-width: min(72rem, calc(100vw - 3rem));
        }
        
        .component-wrapper > div {
            max-width: 100%;
            overflow-x: hidden;
        }
        
        /* Improve loading performance */
        img {
            loading: lazy;
        }
        
        /* Accessibility improvements */
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
    </style>
</head>
<body>
    <div id="root">${content}</div>
    
    <!-- Schema.org Organization markup -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "${escapeHtml(metaTags.title.replace(' - Careers', ''))}",
        "url": "${escapeHtml(metaTags.canonical)}",
        ${metaTags.ogImage ? `"logo": "${escapeHtml(metaTags.ogImage)}",` : ''}
        "sameAs": []
    }
    </script>
    
    <!-- Job Filtering JavaScript -->
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const searchInput = document.getElementById('job-search');
        const sortSelect = document.getElementById('job-sort');
        const departmentFilter = document.getElementById('filter-department');
        const locationFilter = document.getElementById('filter-location');
        const workPolicyFilter = document.getElementById('filter-workPolicy');
        const employmentTypeFilter = document.getElementById('filter-employmentType');
        const experienceLevelFilter = document.getElementById('filter-experienceLevel');
        const clearFiltersBtn = document.getElementById('clear-filters');
        const jobListings = document.getElementById('job-listings');
        const jobCount = document.getElementById('job-count');
        
        if (!jobListings) return; // No job section on this page
        
        const allJobs = Array.from(jobListings.children);
        let filteredJobs = [...allJobs];
        
        function getJobData(jobElement) {
            const title = jobElement.querySelector('h3').textContent.toLowerCase();
            const details = jobElement.querySelectorAll('span');
            let department = '', location = '', workPolicy = '', employmentType = '', experienceLevel = '';
            
            details.forEach(span => {
                const text = span.textContent.trim();
                // Simple heuristic to categorize job details
                if (text.includes('Department') || text.match(/Engineering|Marketing|Sales|HR|Finance|Operations|Design|Product/i)) {
                    department = text.toLowerCase();
                } else if (text.includes('Remote') || text.includes('Hybrid') || text.includes('On-site') || text.match(/New York|San Francisco|London|Remote|Hybrid/i)) {
                    if (text.includes('Remote') || text.includes('Hybrid') || text.includes('On-site')) {
                        workPolicy = text.toLowerCase();
                    } else {
                        location = text.toLowerCase();
                    }
                } else if (text.includes('Full') || text.includes('Part') || text.includes('Contract') || text.includes('Temporary') || text.includes('Internship')) {
                    employmentType = text.toLowerCase();
                } else if (text.includes('Entry') || text.includes('Mid') || text.includes('Senior') || text.includes('Lead') || text.includes('Junior')) {
                    experienceLevel = text.toLowerCase();
                }
            });
            
            return { title, department, location, workPolicy, employmentType, experienceLevel };
        }
        
        function filterJobs() {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const selectedDepartment = departmentFilter ? departmentFilter.value.toLowerCase() : '';
            const selectedLocation = locationFilter ? locationFilter.value.toLowerCase() : '';
            const selectedWorkPolicy = workPolicyFilter ? workPolicyFilter.value.toLowerCase() : '';
            const selectedEmploymentType = employmentTypeFilter ? employmentTypeFilter.value.toLowerCase() : '';
            const selectedExperienceLevel = experienceLevelFilter ? experienceLevelFilter.value.toLowerCase() : '';
            
            filteredJobs = allJobs.filter(job => {
                const jobData = getJobData(job);
                
                // Text search
                if (searchTerm && !jobData.title.includes(searchTerm) && 
                    !jobData.department.includes(searchTerm) && 
                    !jobData.location.includes(searchTerm)) {
                    return false;
                }
                
                // Filter by department
                if (selectedDepartment && !jobData.department.includes(selectedDepartment)) {
                    return false;
                }
                
                // Filter by location
                if (selectedLocation && !jobData.location.includes(selectedLocation)) {
                    return false;
                }
                
                // Filter by work policy
                if (selectedWorkPolicy && !jobData.workPolicy.includes(selectedWorkPolicy)) {
                    return false;
                }
                
                // Filter by employment type
                if (selectedEmploymentType && !jobData.employmentType.includes(selectedEmploymentType)) {
                    return false;
                }
                
                // Filter by experience level
                if (selectedExperienceLevel && !jobData.experienceLevel.includes(selectedExperienceLevel)) {
                    return false;
                }
                
                return true;
            });
            
            renderJobs();
        }
        
        function sortJobs() {
            const sortBy = sortSelect ? sortSelect.value : 'newest';
            
            filteredJobs.sort((a, b) => {
                const titleA = getJobData(a).title;
                const titleB = getJobData(b).title;
                
                switch (sortBy) {
                    case 'title':
                        return titleA.localeCompare(titleB);
                    case 'oldest':
                        // For SSR, we'll just reverse the default order
                        return Array.from(jobListings.children).indexOf(b) - Array.from(jobListings.children).indexOf(a);
                    case 'newest':
                    default:
                        return Array.from(jobListings.children).indexOf(a) - Array.from(jobListings.children).indexOf(b);
                }
            });
            
            renderJobs();
        }
        
        function renderJobs() {
            // Hide all jobs first
            allJobs.forEach(job => job.classList.add('hidden'));
            
            // Show filtered jobs
            filteredJobs.forEach(job => job.classList.remove('hidden'));
            
            // Update job count
            if (jobCount) {
                jobCount.textContent = \`Showing \${filteredJobs.length} of \${allJobs.length} jobs\`;
            }
            
            // Show "no results" message if no jobs match
            let noResultsMsg = document.getElementById('no-results-message');
            if (filteredJobs.length === 0) {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.id = 'no-results-message';
                    noResultsMsg.className = 'text-center py-12';
                    noResultsMsg.innerHTML = '<p class="text-lg">No jobs match your filters. Try adjusting your search criteria.</p>';
                    jobListings.appendChild(noResultsMsg);
                }
                noResultsMsg.classList.remove('hidden');
            } else if (noResultsMsg) {
                noResultsMsg.classList.add('hidden');
            }
        }
        
        function clearFilters() {
            if (searchInput) searchInput.value = '';
            if (sortSelect) sortSelect.value = 'newest';
            if (departmentFilter) departmentFilter.value = '';
            if (locationFilter) locationFilter.value = '';
            if (workPolicyFilter) workPolicyFilter.value = '';
            if (employmentTypeFilter) employmentTypeFilter.value = '';
            if (experienceLevelFilter) experienceLevelFilter.value = '';
            
            filteredJobs = [...allJobs];
            renderJobs();
        }
        
        // Event listeners
        if (searchInput) {
            searchInput.addEventListener('input', filterJobs);
        }
        
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                filterJobs();
                sortJobs();
            });
        }
        
        if (departmentFilter) departmentFilter.addEventListener('change', filterJobs);
        if (locationFilter) locationFilter.addEventListener('change', filterJobs);
        if (workPolicyFilter) workPolicyFilter.addEventListener('change', filterJobs);
        if (employmentTypeFilter) employmentTypeFilter.addEventListener('change', filterJobs);
        if (experienceLevelFilter) experienceLevelFilter.addEventListener('change', filterJobs);
        
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', clearFilters);
        }
        
        // Initial render
        renderJobs();
    });
    </script>
</body>
</html>`;
};

/**
 * Main SSR function - renders career page to complete HTML
 */
export const renderCareerPageToHTML = (careerPage, jobs, company) => {
  try {
    // Get background color from company branding
    const backgroundColor = company.branding?.backgroundColor || '#F3F4F6';

    // Render React components to string
    const content = renderToString(
      React.createElement(CareerPageRenderer, {
        careerPage,
        jobs,
        company
      })
    );

    // Generate meta tags and structured data
    const metaTags = generateMetaTags(company, jobs);
    const structuredData = generateJobStructuredData(jobs, company);

    // Create complete HTML document
    return createHTMLDocument(content, metaTags, structuredData, backgroundColor);
  } catch (error) {
    console.error('SSR rendering error:', error);
    throw new Error('Failed to render career page');
  }
};

export default {
  renderCareerPageToHTML,
  generateMetaTags,
  generateJobStructuredData
};
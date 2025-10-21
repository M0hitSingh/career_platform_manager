import React, { useState, useMemo } from 'react';
import ComponentWrapper from './ComponentWrapper';

/**
 * JobSection component displays job listings with filtering
 * @param {Object} props
 * @param {Object} props.config - Component configuration
 * @param {Array} props.jobs - Array of job objects
 * @param {Object} props.branding - Branding colors
 * @param {boolean} props.isBuilder - Whether in builder mode
 * @param {string} props.viewMode - View mode (desktop/mobile)
 */
const JobSection = ({ config = {}, jobs = [], branding = {}, isBuilder = false, viewMode = 'desktop' }) => {
  const [filters, setFilters] = useState({
    department: '',
    location: '',
    workPolicy: '',
    employmentType: '',
    experienceLevel: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, title

  // Get effective colors (custom overrides or global branding)
  const effectiveColors = {
    headingColor: branding.headingColor || branding.primaryColor,
    textColor: branding.textColor,
    buttonColor: branding.buttonColor,
    backgroundColor: branding.backgroundColor,
    primaryColor: branding.primaryColor
  };

  // Extract unique filter options from jobs
  const filterOptions = useMemo(() => {
    return {
      departments: [...new Set(jobs.map(job => job.department).filter(Boolean))],
      locations: [...new Set(jobs.map(job => job.location).filter(Boolean))],
      workPolicies: [...new Set(jobs.map(job => job.workPolicy).filter(Boolean))],
      employmentTypes: [...new Set(jobs.map(job => job.employmentType).filter(Boolean))],
      experienceLevels: [...new Set(jobs.map(job => job.experienceLevel).filter(Boolean))]
    };
  }, [jobs]);

  // Filter and sort jobs based on selected filters
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter(job => {
      // Text search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = [
          job.title,
          job.department,
          job.location,
          job.description,
          job.employmentType,
          job.experienceLevel
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) return false;
      }
      
      // Other filters
      if (filters.department && job.department !== filters.department) return false;
      if (filters.location && job.location !== filters.location) return false;
      if (filters.workPolicy && job.workPolicy !== filters.workPolicy) return false;
      if (filters.employmentType && job.employmentType !== filters.employmentType) return false;
      if (filters.experienceLevel && job.experienceLevel !== filters.experienceLevel) return false;
      return true;
    });

    // Sort jobs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.postedDate || a.createdAt) - new Date(b.postedDate || b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.postedDate || b.createdAt) - new Date(a.postedDate || a.createdAt);
      }
    });

    return filtered;
  }, [jobs, filters, sortBy]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      department: '',
      location: '',
      workPolicy: '',
      employmentType: '',
      experienceLevel: '',
      search: ''
    });
    setSortBy('newest');
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || sortBy !== 'newest';

  return (
    <ComponentWrapper
      primaryColor={branding.primaryColor}
      secondaryColor={branding.secondaryColor}
      textColor={branding.textColor}
      buttonColor={branding.buttonColor}
      backgroundColor={branding.backgroundColor}
      className="job-section"
    >
      <div 
        className="w-full bg-white bg-opacity-95 overflow-hidden"
        style={{ backgroundColor: branding.backgroundColor ? `${branding.backgroundColor}F0` : '#FFFFFFF0' }}
      >
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h2 className="text-3xl font-bold mb-8" style={{ color: effectiveColors.headingColor }}>
          Open Positions
        </h2>

        {/* Search and Sort Controls */}
        <div className="mb-6 space-y-3 sm:space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="flex-1 w-full sm:max-w-md">
              <input
                type="text"
                placeholder={viewMode === 'mobile' ? "Search jobs..." : "Search jobs by title, department, location..."}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-opacity-50"
                style={{ borderColor: effectiveColors.primaryColor }}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs sm:text-sm font-medium whitespace-nowrap" style={{ color: effectiveColors.textColor }}>
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 sm:flex-none px-2 py-2 sm:px-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-opacity-50"
                style={{ borderColor: effectiveColors.primaryColor }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Job Title A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-8 p-4 sm:p-6 rounded-lg" style={{ backgroundColor: `${effectiveColors.primaryColor}15` }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-semibold" style={{ color: effectiveColors.headingColor }}>
              Filter Jobs
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm underline hover:no-underline self-start sm:self-auto"
                style={{ color: effectiveColors.primaryColor }}
              >
                Clear all filters
              </button>
            )}
          </div>
          
          <div className={`grid gap-3 sm:gap-4 ${
            viewMode === 'mobile' 
              ? 'grid-cols-1' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
          }`}>
            {/* Department Filter */}
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-opacity-50"
              style={{ borderColor: effectiveColors.primaryColor }}
            >
              <option value="">All Departments</option>
              {filterOptions.departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            {/* Location Filter */}
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-opacity-50"
              style={{ borderColor: effectiveColors.primaryColor }}
            >
              <option value="">All Locations</option>
              {filterOptions.locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            {/* Work Policy Filter */}
            <select
              value={filters.workPolicy}
              onChange={(e) => handleFilterChange('workPolicy', e.target.value)}
              className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-opacity-50"
              style={{ borderColor: effectiveColors.primaryColor }}
            >
              <option value="">All Work Policies</option>
              {filterOptions.workPolicies.map(policy => (
                <option key={policy} value={policy}>{policy}</option>
              ))}
            </select>

            {/* Employment Type Filter */}
            <select
              value={filters.employmentType}
              onChange={(e) => handleFilterChange('employmentType', e.target.value)}
              className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-opacity-50"
              style={{ borderColor: effectiveColors.primaryColor }}
            >
              <option value="">All Types</option>
              {filterOptions.employmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Experience Level Filter */}
            <select
              value={filters.experienceLevel}
              onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
              className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-opacity-50"
              style={{ borderColor: effectiveColors.primaryColor }}
            >
              <option value="">All Levels</option>
              {filterOptions.experienceLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium" style={{ color: effectiveColors.textColor }}>
            Showing {filteredAndSortedJobs.length} of {jobs.length} jobs
          </p>
        </div>

        {/* Job Listings */}
        {jobs.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg" style={{ borderColor: effectiveColors.primaryColor }}>
            <p style={{ color: effectiveColors.textColor }}>
              {isBuilder ? 'Jobs will appear here when published' : 'No open positions at this time'}
            </p>
          </div>
        ) : filteredAndSortedJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: effectiveColors.textColor }}>
              No jobs match your filters. Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedJobs.map(job => (
              <JobListItem key={job._id || job.id} job={job} branding={branding} />
            ))}
          </div>
        )}
        </div>
      </div>
    </ComponentWrapper>
  );
};

/**
 * JobListItem component displays individual job details in list format
 */
const JobListItem = ({ job, branding }) => {
  return (
    <div 
      className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
      style={{ borderColor: effectiveColors.primaryColor }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2" style={{ color: effectiveColors.primaryColor }}>
            {job.title}
          </h3>
          
          <div className="flex flex-wrap gap-4 text-sm mb-3" style={{ color: branding.textColor }}>
            {job.department && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {job.department}
              </span>
            )}
            {job.location && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </span>
            )}
            {job.workPolicy && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {job.workPolicy}
              </span>
            )}
            {job.employmentType && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {job.employmentType}
              </span>
            )}
            {job.experienceLevel && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                {job.experienceLevel}
              </span>
            )}
          </div>

          {job.salaryRange && (
            <p className="text-sm font-semibold mb-2" style={{ color: branding.textColor }}>
              {job.salaryRange}
            </p>
          )}

          {job.postedDate && (
            <p className="text-xs" style={{ color: branding.textColor, opacity: 0.7 }}>
              Posted {getPostedDaysAgo(job.postedDate)}
            </p>
          )}
        </div>

        <div className="ml-4">
          <button
            className="px-4 py-2 rounded-md font-medium text-white transition-colors"
            style={{ backgroundColor: effectiveColors.buttonColor || effectiveColors.primaryColor }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
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

export default JobSection;

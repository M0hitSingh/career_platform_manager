import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';

const JobList = ({ onEdit, onDelete, onStatusChange }) => {
  const { user } = useAuth();
  const companyId = user?.company?.id;
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  console.log('[JobList] User object:', user);

  // Fetch filter options
  const { data: filterOptions } = useQuery({
    queryKey: ['jobFilters'],
    queryFn: async () => {
      console.log('[JobList] Fetching filter options');
      const response = await api.get(`/jobs/filters`);
      console.log('[JobList] Filter options:', response.data);
      return response.data;
    },
    enabled: !!user,
  });

  // Fetch jobs from API with pagination and filters
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['jobs', currentPage, statusFilter, locationFilter, departmentFilter, typeFilter],
    queryFn: async () => {
      console.log('[JobList] Fetching jobs');
      const params = new URLSearchParams({
        page: currentPage,
        limit: jobsPerPage,
      });
      
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (locationFilter !== 'all') params.append('location', locationFilter);
      if (departmentFilter !== 'all') params.append('department', departmentFilter);
      if (typeFilter !== 'all') params.append('employmentType', typeFilter);
      
      const response = await api.get(`/jobs?${params.toString()}`);
      console.log('[JobList] API response:', response.data);
      return response.data;
    },
    enabled: !!user,
  });

  // Extract jobs from grouped response
  const currentJobs = data?.jobs ? [
    ...(data.jobs.active || []),
    ...(data.jobs.draft || []),
    ...(data.jobs.inactive || [])
  ] : [];

  // Get pagination info from backend
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    jobsPerPage: jobsPerPage,
    hasNextPage: false,
    hasPrevPage: false
  };

  const summary = data?.summary || {
    total: 0,
    active: 0,
    draft: 0,
    inactive: 0
  };

  // Get filter options from backend
  const uniqueLocations = filterOptions?.locations || [];
  const uniqueDepartments = filterOptions?.departments || [];
  const uniqueTypes = filterOptions?.employmentTypes || [];

  console.log('[JobList] Current page jobs:', currentJobs.length);
  console.log('[JobList] Pagination:', pagination);

  // Reset to page 1 when any filter changes
  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  const handleLocationChange = (location) => {
    setLocationFilter(location);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (department) => {
    setDepartmentFilter(department);
    setCurrentPage(1);
  };

  const handleTypeChange = (type) => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setStatusFilter('all');
    setLocationFilter('all');
    setDepartmentFilter('all');
    setTypeFilter('all');
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!companyId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
        <p>Company ID not found. Please log in again.</p>
        <p className="text-sm mt-2">Debug: {JSON.stringify(user)}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p>Error loading jobs: {error.message}</p>
        <p className="text-sm mt-2">Company ID: {companyId}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-4 py-2 font-medium transition-colors ${
            statusFilter === 'all'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All ({summary.total})
        </button>
        <button
          onClick={() => handleFilterChange('active')}
          className={`px-4 py-2 font-medium transition-colors ${
            statusFilter === 'active'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Active ({summary.active})
        </button>
        <button
          onClick={() => handleFilterChange('draft')}
          className={`px-4 py-2 font-medium transition-colors ${
            statusFilter === 'draft'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Draft ({summary.draft})
        </button>
        <button
          onClick={() => handleFilterChange('inactive')}
          className={`px-4 py-2 font-medium transition-colors ${
            statusFilter === 'inactive'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Inactive ({summary.inactive})
        </button>
      </div>

      {/* Additional Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Location:</label>
          <select
            value={locationFilter}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Locations</option>
            {uniqueLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Department:</label>
          <select
            value={departmentFilter}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {uniqueDepartments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Type:</label>
          <select
            value={typeFilter}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {(locationFilter !== 'all' || departmentFilter !== 'all' || typeFilter !== 'all') && (
          <button
            onClick={clearAllFilters}
            className="px-4 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        )}

        <div className="ml-auto text-sm text-gray-600">
          {pagination.totalJobs} {pagination.totalJobs === 1 ? 'job' : 'jobs'} found
        </div>
      </div>

      {/* Jobs list */}
      {currentJobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            {statusFilter === 'all' 
              ? 'No jobs found. Create your first job posting!' 
              : `No ${statusFilter} jobs found.`}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {currentJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
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
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{job.applicationCount || 0} applications</span>
                  </div>
                </div>

                <div className="ml-4">
                  <button
                    onClick={() => onEdit(job)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Edit job"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing {((pagination.currentPage - 1) * pagination.jobsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.jobsPerPage, pagination.totalJobs)} of {pagination.totalJobs} jobs
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === pagination.totalPages ||
                    (pageNumber >= pagination.currentPage - 1 && pageNumber <= pagination.currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          pagination.currentPage === pageNumber
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === pagination.currentPage - 2 ||
                    pageNumber === pagination.currentPage + 2
                  ) {
                    return <span key={pageNumber} className="px-2 py-2 text-gray-500">...</span>;
                  }
                  return null;
                })}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobList;

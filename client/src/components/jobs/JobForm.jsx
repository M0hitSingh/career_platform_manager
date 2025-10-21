import { useState, useEffect } from 'react';

const JobForm = ({ job, onSubmit, onCancel, onDelete, onStatusChange }) => {
  const [formData, setFormData] = useState({
    title: '',
    workPolicy: '',
    location: '',
    department: '',
    employmentType: '',
    experienceLevel: '',
    jobType: '',
    salaryRange: '',
    description: '',
    status: 'draft',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Populate form if editing existing job
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        workPolicy: job.workPolicy || '',
        location: job.location || '',
        department: job.department || '',
        employmentType: job.employmentType || '',
        experienceLevel: job.experienceLevel || '',
        jobType: job.jobType || '',
        salaryRange: job.salaryRange || '',
        description: job.description || '',
        status: job.status || 'draft',
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }

    if (!formData.workPolicy) {
      newErrors.workPolicy = 'Work policy is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.employmentType) {
      newErrors.employmentType = 'Employment type is required';
    }

    if (!formData.experienceLevel) {
      newErrors.experienceLevel = 'Experience level is required';
    }

    if (!formData.jobType) {
      newErrors.jobType = 'Job type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // If status changed and we're editing, call onStatusChange first
      if (job && formData.status !== job.status && onStatusChange) {
        await onStatusChange(job._id, formData.status);
      }
      // Then submit the form data
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status and Delete Section (only for editing) */}
      {job && (
        <div className="pb-6 border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label htmlFor="status" className="text-sm font-medium text-gray-700">Job Status:</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {formData.status !== job.status && (
                <span className="text-sm text-amber-600 font-medium">
                  (Unsaved change)
                </span>
              )}
            </div>
            
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete Job
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Are you sure?</span>
                <button
                  type="button"
                  onClick={() => {
                    onDelete && onDelete(job._id);
                    setShowDeleteConfirm(false);
                  }}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes, Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Job Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g. Senior Software Engineer"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      {/* Work Policy */}
      <div>
        <label htmlFor="workPolicy" className="block text-sm font-medium text-gray-700 mb-1">
          Work Policy *
        </label>
        <select
          id="workPolicy"
          name="workPolicy"
          value={formData.workPolicy}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.workPolicy ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select work policy</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
        </select>
        {errors.workPolicy && <p className="mt-1 text-sm text-red-600">{errors.workPolicy}</p>}
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location *
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.location ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g. San Francisco, CA"
        />
        {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
      </div>

      {/* Department */}
      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
          Department *
        </label>
        <input
          type="text"
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.department ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g. Engineering"
        />
        {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
      </div>

      {/* Employment Type */}
      <div>
        <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
          Employment Type *
        </label>
        <select
          id="employmentType"
          name="employmentType"
          value={formData.employmentType}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.employmentType ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select employment type</option>
          <option value="Full time">Full time</option>
          <option value="Part time">Part time</option>
          <option value="Contract">Contract</option>
        </select>
        {errors.employmentType && <p className="mt-1 text-sm text-red-600">{errors.employmentType}</p>}
      </div>

      {/* Experience Level */}
      <div>
        <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
          Experience Level *
        </label>
        <select
          id="experienceLevel"
          name="experienceLevel"
          value={formData.experienceLevel}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.experienceLevel ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select experience level</option>
          <option value="Entry">Entry</option>
          <option value="Mid">Mid</option>
          <option value="Senior">Senior</option>
          <option value="Lead">Lead</option>
        </select>
        {errors.experienceLevel && <p className="mt-1 text-sm text-red-600">{errors.experienceLevel}</p>}
      </div>

      {/* Job Type */}
      <div>
        <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
          Job Type *
        </label>
        <select
          id="jobType"
          name="jobType"
          value={formData.jobType}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.jobType ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select job type</option>
          <option value="Permanent">Permanent</option>
          <option value="Temporary">Temporary</option>
          <option value="Internship">Internship</option>
        </select>
        {errors.jobType && <p className="mt-1 text-sm text-red-600">{errors.jobType}</p>}
      </div>

      {/* Salary Range */}
      <div>
        <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700 mb-1">
          Salary Range
        </label>
        <input
          type="text"
          id="salaryRange"
          name="salaryRange"
          value={formData.salaryRange}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g. $100,000 - $150,000"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Job Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe the role, responsibilities, and requirements..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
        </button>
      </div>
    </form>
  );
};

export default JobForm;

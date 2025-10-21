import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import JobList from '../components/jobs/JobList';
import JobForm from '../components/jobs/JobForm';
import JobUpload from '../components/jobs/JobUpload';

const ManageJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { companySlug } = useParams();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [notification, setNotification] = useState(null);

  // Show notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: async (jobData) => {
      const response = await api.post(`/jobs`, jobData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      setShowForm(false);
      showNotification('Job created successfully!');
    },
    onError: (error) => {
      showNotification(error.response?.data?.error || 'Failed to create job', 'error');
    },
  });

  // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: async ({ jobId, jobData }) => {
      const response = await api.put(`/jobs/${jobId}`, jobData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      setShowForm(false);
      setEditingJob(null);
      showNotification('Job updated successfully!');
    },
    onError: (error) => {
      showNotification(error.response?.data?.error || 'Failed to update job', 'error');
    },
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: async (jobId) => {
      await api.delete(`/jobs/${jobId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      showNotification('Job deleted successfully!');
    },
    onError: (error) => {
      showNotification(error.response?.data?.error || 'Failed to delete job', 'error');
    },
  });

  // Update job status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ jobId, status }) => {
      const response = await api.patch(`/jobs/${jobId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      showNotification('Job status updated successfully!');
    },
    onError: (error) => {
      showNotification(error.response?.data?.error || 'Failed to update job status', 'error');
    },
  });

  const handleCreateJob = () => {
    setEditingJob(null);
    setShowForm(true);
    setShowUpload(false);
  };

  const handleUploadJobs = () => {
    setShowUpload(true);
    setShowForm(false);
    setEditingJob(null);
  };

  const handleBulkUpload = async (jobs) => {
    try {
      const companyId = user?.company?._id || user?.company?.id;
      if (!companyId) {
        throw new Error('Company ID not found');
      }
      
      const response = await api.post(`/jobs/bulk`, { jobs });
      queryClient.invalidateQueries(['jobs']);
      showNotification(
        `Successfully uploaded ${response.data.created} jobs${response.data.failed > 0 ? `, ${response.data.failed} failed` : ''}`,
        response.data.failed > 0 ? 'warning' : 'success'
      );
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to upload jobs');
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowForm(true);
    setShowUpload(false);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      deleteJobMutation.mutate(jobId);
    }
  };

  const handleStatusChange = (jobId, status) => {
    updateStatusMutation.mutate({ jobId, status });
  };

  const handleFormSubmit = async (formData) => {
    if (editingJob) {
      await updateJobMutation.mutateAsync({ jobId: editingJob._id, jobData: formData });
    } else {
      await createJobMutation.mutateAsync(formData);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setShowUpload(false);
    setEditingJob(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/${companySlug}/dashboard`)}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
              <p className="text-gray-600 mt-1">Create and manage your job postings</p>
            </div>
            {!showForm && !showUpload && (
              <div className="flex gap-3">
                <button
                  onClick={handleUploadJobs}
                  className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-medium flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload CSV
                </button>
                <button
                  onClick={handleCreateJob}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-medium flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Job
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg ${
            notification.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Job Form, Upload, or Job List */}
        {showUpload ? (
          <JobUpload
            onUpload={handleBulkUpload}
            onClose={handleFormCancel}
          />
        ) : showForm ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {editingJob ? 'Edit Job' : 'Create New Job'}
            </h2>
            <JobForm
              job={editingJob}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              onDelete={handleDeleteJob}
              onStatusChange={handleStatusChange}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <JobList
              onEdit={handleEditJob}
              onDelete={handleDeleteJob}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageJobs;

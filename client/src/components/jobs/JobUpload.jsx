import { useState } from 'react';
import Papa from 'papaparse';

const JobUpload = ({ onUpload, onClose }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv') {
        setError('Please upload a CSV file');
        return;
      }
      setFile(selectedFile);
      setError('');
      
      // Parse and preview CSV
      Papa.parse(selectedFile, {
        header: true,
        preview: 5,
        complete: (results) => {
          setPreview(results.data);
        },
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const jobs = results.data.map((row) => ({
            title: row.title,
            workPolicy: row.work_policy,
            location: row.location,
            department: row.department,
            employmentType: row.employment_type,
            experienceLevel: row.experience_level,
            jobType: row.job_type,
            salaryRange: row.salary_range,
            description: row.description || 'Job description to be added',
            requirements: row.requirements || 'Requirements to be added',
            responsibilities: row.responsibilities || 'Responsibilities to be added',
            status: 'draft', // Default to draft
          }));

          await onUpload(jobs);
          onClose();
        } catch (err) {
          setError(err.message || 'Failed to upload jobs');
        } finally {
          setUploading(false);
        }
      },
      error: (err) => {
        setError('Failed to parse CSV file');
        setUploading(false);
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Upload Jobs from CSV</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Instructions */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">CSV Format Requirements:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Required columns: title, work_policy, location, department, employment_type</li>
          <li>• Optional columns: experience_level, job_type, salary_range, description, requirements, responsibilities</li>
          <li>• All jobs will be created as drafts by default</li>
        </ul>
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select CSV File
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Preview */}
      {preview.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Preview (first 5 rows):</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preview.map((row, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 whitespace-nowrap">{row.title}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.location}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.department}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{row.employment_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          disabled={uploading}
          className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="px-6 py-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {uploading && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {uploading ? 'Uploading...' : 'Upload Jobs'}
        </button>
      </div>
    </div>
  );
};

export default JobUpload;

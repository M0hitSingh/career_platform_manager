import { useState, useEffect } from 'react';
import { usePageBuilder } from '../../context/PageBuilderContext';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/api';

const BrandingModal = ({ isOpen, onClose }) => {
  const { branding, updateBranding } = usePageBuilder();
  const { user } = useAuth();
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(user?.company?.logo || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Local state for colors (not saved until Save button is clicked)
  const [localBranding, setLocalBranding] = useState(branding);
  const [hasChanges, setHasChanges] = useState(false);

  // Update local branding when global branding changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalBranding(branding);
      setHasChanges(false);
      setMessage({ type: '', text: '' });
    }
  }, [branding, isOpen]);

  if (!isOpen) return null;

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Logo = reader.result;
        
        // Upload to server
        const response = await api.post(`/companies/logo`, {
          logo: base64Logo
        });

        setMessage({ type: 'success', text: 'Logo uploaded successfully!' });
        setLogoFile(null);
        
        // Update user in localStorage
        const updatedUser = { ...user };
        updatedUser.company.logo = response.data.logo;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(logoFile);
    } catch (error) {
      console.error('Logo upload error:', error);
      
      // Handle unauthorized access
      if (handleApiError(error, navigate)) {
        return; // Exit early, user will be redirected
      }
      
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to upload logo' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleColorChange = (colorKey, value) => {
    const newBranding = { ...localBranding, [colorKey]: value };
    
    // Update local state for tracking changes
    setLocalBranding(newBranding);
    setHasChanges(true);
    setMessage({ type: '', text: '' });
    
    // Update global context for instant preview
    updateBranding(newBranding);
  };



  const refreshUserData = async () => {
    try {
      const response = await api.get('/auth/me');
      const updatedUser = response.data.user;
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      let currentUser = user;
      
      // If user.company.id is missing, try to refresh user data
      if (!currentUser?.company?.id) {
        console.log('Company ID missing, refreshing user data...');
        try {
          currentUser = await refreshUserData();
        } catch (refreshError) {
          throw new Error('Company information not available. Please refresh the page and try again.');
        }
      }
      
      if (!currentUser?.company?.id) {
        throw new Error('Company information not available. Please refresh the page and try again.');
      }

      await api.patch(`/companies/branding`, localBranding);
      
      // The global branding state is already updated from handleColorChange
      // Just mark as saved
      setHasChanges(false);
      
      setMessage({ type: 'success', text: 'Branding saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Branding update error:', error);
      
      // Handle unauthorized access
      if (handleApiError(error, navigate)) {
        return; // Exit early, user will be redirected
      }
      
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || error.message || 'Failed to save branding' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setLocalBranding(branding);
    setHasChanges(false);
    setMessage({ type: '', text: '' });
    
    // Reset global context to the original saved branding
    updateBranding(branding);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Brand Settings</h2>
            <p className="text-sm text-gray-600 mt-1">
              Customize your career page's visual identity
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
            title="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Message Display */}
            {message.text && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Logo Upload Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Company Logo
              </label>
              
              {logoPreview && (
                <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                  <img
                    src={logoPreview}
                    alt="Company logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}

              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                
                {logoFile && (
                  <button
                    onClick={handleLogoUpload}
                    disabled={uploading}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                  >
                    {uploading ? 'Uploading...' : 'Upload Logo'}
                  </button>
                )}
              </div>
            </div>

            {/* Color Customization Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900">Theme Colors</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Primary Color */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={localBranding.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localBranding.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>

                {/* Secondary Color */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={localBranding.secondaryColor}
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localBranding.secondaryColor}
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="#10B981"
                    />
                  </div>
                </div>

                {/* Button Color */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Button Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={localBranding.buttonColor}
                      onChange={(e) => handleColorChange('buttonColor', e.target.value)}
                      className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localBranding.buttonColor}
                      onChange={(e) => handleColorChange('buttonColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="#EF4444"
                    />
                  </div>
                </div>

                {/* Text Color */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Text Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={localBranding.textColor}
                      onChange={(e) => handleColorChange('textColor', e.target.value)}
                      className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localBranding.textColor}
                      onChange={(e) => handleColorChange('textColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="#1F2937"
                    />
                  </div>
                </div>

                {/* Background Color */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Background Color
                  </label>
                  <div className="flex items-center space-x-3 max-w-md">
                    <input
                      type="color"
                      value={localBranding.backgroundColor}
                      onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                      className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localBranding.backgroundColor}
                      onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="#F3F4F6"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save/Reset Buttons */}
            {hasChanges && (
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleReset}
                  disabled={saving}
                  className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                >
                  Reset Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandingModal;
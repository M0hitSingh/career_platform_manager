import { useState, useEffect, useCallback, useRef } from 'react';
import { usePageBuilder } from '../../context/PageBuilderContext';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/api';

const BrandingPanel = () => {
  const { branding, updateBranding } = usePageBuilder();
  const { user } = useAuth();
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(user?.company?.logo || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Local state for colors with auto-save
  const [localBranding, setLocalBranding] = useState(branding);
  const saveTimeoutRef = useRef(null);

  // Update local branding when global branding changes
  useEffect(() => {
    setLocalBranding(branding);
  }, [branding]);

  // Debounced save function
  const debouncedSave = useCallback(async (brandingData) => {
    try {
      await api.patch(`/companies/branding`, brandingData);
      setMessage({ type: 'success', text: 'Colors saved!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    } catch (error) {
      console.error('Branding update error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to save colors' 
      });
    }
  }, []);

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
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
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Logo = reader.result;
        
        const response = await api.post(`/companies/logo`, {
          logo: base64Logo
        });

        setMessage({ type: 'success', text: 'Logo uploaded!' });
        setLogoFile(null);
        
        const updatedUser = { ...user };
        updatedUser.company.logo = response.data.logo;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(logoFile);
    } catch (error) {
      console.error('Logo upload error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to upload logo' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleColorChange = (colorKey, value) => {
    // Clean and validate the color value
    let cleanValue = value.trim();
    
    // Ensure it starts with # if it's a hex color
    if (cleanValue && !cleanValue.startsWith('#')) {
      cleanValue = '#' + cleanValue;
    }
    
    // Validate hex color format
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (cleanValue && !hexColorRegex.test(cleanValue)) {
      // If invalid, don't update
      setMessage({ type: 'error', text: 'Please enter a valid hex color (e.g., #FF0000)' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }
    
    const newBranding = { ...localBranding, [colorKey]: cleanValue };
    
    // Update local state and global context for instant preview
    setLocalBranding(newBranding);
    updateBranding(newBranding);
    setMessage({ type: '', text: '' });
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout for debounced save
    saveTimeoutRef.current = setTimeout(() => {
      debouncedSave(newBranding);
    }, 1000); // Save after 1 second of no changes
  };





  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Message Display */}
      {message.text && (
        <div
          className={`p-2 rounded text-xs ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Logo Upload */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-700">
          Company Logo
        </label>
        
        {logoPreview && (
          <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center overflow-hidden border border-gray-200">
            <img
              src={logoPreview}
              alt="Logo"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleLogoFileChange}
          className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
        
        {logoFile && (
          <button
            onClick={handleLogoUpload}
            disabled={uploading}
            className="w-full py-1.5 px-3 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:bg-gray-400"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        )}
      </div>

      {/* Colors */}
      <div className="space-y-3 pt-3 border-t border-gray-200">
        <h4 className="text-xs font-semibold text-gray-900">Global Theme Colors</h4>
        <p className="text-xs text-gray-500">These colors apply to all components by default</p>

        {/* Primary Color */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">Primary Color</label>
          <p className="text-xs text-gray-500">Used for job filters background</p>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={localBranding.primaryColor}
              onChange={(e) => handleColorChange('primaryColor', e.target.value)}
              className="h-8 w-12 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={localBranding.primaryColor}
              onChange={(e) => handleColorChange('primaryColor', e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
            />
          </div>
        </div>

        {/* Heading Color */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">Heading Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={localBranding.headingColor || localBranding.primaryColor}
              onChange={(e) => handleColorChange('headingColor', e.target.value)}
              className="h-8 w-12 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={localBranding.headingColor || localBranding.primaryColor}
              onChange={(e) => handleColorChange('headingColor', e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
            />
          </div>
        </div>

        {/* Text Color */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">Text Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={localBranding.textColor}
              onChange={(e) => handleColorChange('textColor', e.target.value)}
              className="h-8 w-12 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={localBranding.textColor}
              onChange={(e) => handleColorChange('textColor', e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
            />
          </div>
        </div>

        {/* Button Color */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">Button Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={localBranding.buttonColor}
              onChange={(e) => handleColorChange('buttonColor', e.target.value)}
              className="h-8 w-12 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={localBranding.buttonColor}
              onChange={(e) => handleColorChange('buttonColor', e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
            />
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">Background Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={localBranding.backgroundColor}
              onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
              className="h-8 w-12 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={localBranding.backgroundColor}
              onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
            />
          </div>
        </div>
      </div>

      {/* Auto-save info */}
      <div className="pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Colors are automatically saved as you change them
        </p>
      </div>
    </div>
  );
};

export default BrandingPanel;

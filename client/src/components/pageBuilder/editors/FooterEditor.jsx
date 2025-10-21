import { useState, useEffect } from 'react';
import AdvancedStyling from './AdvancedStyling';

const FooterEditor = ({ config = {}, onUpdate }) => {
  const [footerText, setFooterText] = useState(config.footerText || '');
  const [socialLinks, setSocialLinks] = useState(config.socialLinks || []);

  useEffect(() => {
    setFooterText(config.footerText || '');
    setSocialLinks(config.socialLinks || []);
  }, [config]);

  const handleFooterTextChange = (e) => {
    const value = e.target.value;
    setFooterText(value);
    onUpdate({ ...config, footerText: value });
  };

  const handleAddSocialLink = () => {
    const newLink = { platform: 'linkedin', url: '' };
    const updated = [...socialLinks, newLink];
    setSocialLinks(updated);
    onUpdate({ ...config, socialLinks: updated });
  };

  const handleRemoveSocialLink = (index) => {
    const updated = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updated);
    onUpdate({ ...config, socialLinks: updated });
  };

  const handleSocialLinkChange = (index, field, value) => {
    const updated = socialLinks.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    );
    setSocialLinks(updated);
    onUpdate({ ...config, socialLinks: updated });
  };

  const platformOptions = [
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'github', label: 'GitHub' },
    { value: 'website', label: 'Website' }
  ];

  return (
    <div className="space-y-6">
      {/* Footer Text */}
      <div>
        <label htmlFor="footerText" className="block text-sm font-medium text-gray-700 mb-2">
          Footer Text
        </label>
        <textarea
          id="footerText"
          value={footerText}
          onChange={handleFooterTextChange}
          placeholder="e.g., Workable collects and processes personal data in accordance with applicable data protection laws..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">Add disclaimer, privacy notice, or any footer text</p>
      </div>

      {/* Social Links */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Social Links
          </label>
          <button
            type="button"
            onClick={handleAddSocialLink}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            + Add Link
          </button>
        </div>

        {socialLinks.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-sm text-gray-500">No social links added yet</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add Link" to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {socialLinks.map((link, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-start space-x-2">
                  <div className="flex-1 space-y-2">
                    {/* Platform Selection */}
                    <select
                      value={link.platform}
                      onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      {platformOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    {/* URL Input */}
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                      placeholder={`Enter ${link.platform} URL`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveSocialLink(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Remove link"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Info */}
      {socialLinks.length > 0 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-800 font-medium">✓ {socialLinks.length} social link{socialLinks.length !== 1 ? 's' : ''} configured</p>
        </div>
      )}

      {/* Advanced Styling */}
      <AdvancedStyling config={config} onUpdate={onUpdate} showPadding={false} showHeight={false} />
    </div>
  );
};

export default FooterEditor;

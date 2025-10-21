import { useState, useEffect } from 'react';
import AdvancedStyling from './AdvancedStyling';

const HtmlBoxEditor = ({ config = {}, onUpdate }) => {
  const [html, setHtml] = useState(config.html || '');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setHtml(config.html || '');
  }, [config.html]);

  const handleHtmlChange = (e) => {
    const value = e.target.value;
    setHtml(value);
    onUpdate({ html: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="htmlContent" className="block text-sm font-medium text-gray-700 mb-2">
          Custom HTML Content
        </label>
        <textarea
          id="htmlContent"
          value={html}
          onChange={handleHtmlChange}
          placeholder="<div>Enter your custom HTML here...</div>"
          rows={12}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
        />
        <p className="mt-2 text-xs text-gray-500">
          HTML will be sanitized to prevent XSS attacks
        </p>
      </div>

      {html && (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      )}

      {showPreview && html && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs font-medium text-gray-700 mb-2">Preview (Sanitized)</p>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800 font-medium mb-1">⚠️ Security Notice</p>
        <p className="text-xs text-yellow-700">
          Custom HTML will be sanitized before rendering on the public career page to prevent security vulnerabilities. Some tags and attributes may be removed.
        </p>
      </div>

      {!html && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 font-medium mb-1">💡 Use Cases</p>
          <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
            <li>Embed custom widgets or forms</li>
            <li>Add styled content blocks</li>
            <li>Include third-party integrations</li>
          </ul>
        </div>
      )}

      {/* Advanced Styling */}
      <AdvancedStyling config={config} onUpdate={onUpdate} showPadding={false} showHeight={false} />
    </div>
  );
};

export default HtmlBoxEditor;

import { useState, useEffect } from 'react';
import AdvancedStyling from './AdvancedStyling';

const TextComponentEditor = ({ config = {}, onUpdate }) => {
  const [heading, setHeading] = useState(config.heading || '');
  const [subheading, setSubheading] = useState(config.subheading || '');
  const [text, setText] = useState(config.text || '');
  const [alignment, setAlignment] = useState(config.alignment || 'start');

  useEffect(() => {
    setHeading(config.heading || '');
    setSubheading(config.subheading || '');
    setText(config.text || '');
    setAlignment(config.alignment || 'start');
  }, [config]);

  const handleHeadingChange = (e) => {
    const value = e.target.value;
    setHeading(value);
    onUpdate({ heading: value, subheading, text, alignment });
  };

  const handleSubheadingChange = (e) => {
    const value = e.target.value;
    setSubheading(value);
    onUpdate({ heading, subheading: value, text, alignment });
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);
    onUpdate({ heading, subheading, text: value, alignment });
  };

  const handleAlignmentChange = (newAlignment) => {
    setAlignment(newAlignment);
    onUpdate({ heading, subheading, text, alignment: newAlignment });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="heading" className="block text-sm font-medium text-gray-700 mb-2">
          Heading
        </label>
        <input
          type="text"
          id="heading"
          value={heading}
          onChange={handleHeadingChange}
          placeholder="Enter heading text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="subheading" className="block text-sm font-medium text-gray-700 mb-2">
          Subheading
        </label>
        <input
          type="text"
          id="subheading"
          value={subheading}
          onChange={handleSubheadingChange}
          placeholder="Enter subheading text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
          Body Text
        </label>
        <textarea
          id="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Enter body text"
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Alignment
        </label>
        <div className="flex space-x-2">
          <button
            onClick={() => handleAlignmentChange('start')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
              alignment === 'start'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h7" />
              </svg>
              <span>Start</span>
            </div>
          </button>

          <button
            onClick={() => handleAlignmentChange('center')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
              alignment === 'center'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M9 18h6" />
              </svg>
              <span>Center</span>
            </div>
          </button>

          <button
            onClick={() => handleAlignmentChange('end')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
              alignment === 'end'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M13 18h7" />
              </svg>
              <span>End</span>
            </div>
          </button>
        </div>
      </div>

      {/* Preview */}
      {(heading || subheading || text) && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs font-medium text-gray-700 mb-2">Preview</p>
          <div className={`text-${alignment}`}>
            {heading && <h2 className="text-lg font-bold text-gray-900">{heading}</h2>}
            {subheading && <h3 className="text-md font-semibold text-gray-700 mt-1">{subheading}</h3>}
            {text && <p className="text-sm text-gray-600 mt-2">{text}</p>}
          </div>
        </div>
      )}

      {/* Advanced Styling */}
      <AdvancedStyling config={config} onUpdate={onUpdate} showPadding={false} showHeight={false} />
    </div>
  );
};

export default TextComponentEditor;

import { useState, useEffect } from 'react';
import AdvancedStyling from './AdvancedStyling';

const AboutSectionEditor = ({ config = {}, onUpdate }) => {
  const [heading, setHeading] = useState(config.heading || '');
  const [text, setText] = useState(config.text || '');
  const [alignment, setAlignment] = useState(config.alignment || 'start');

  useEffect(() => {
    setHeading(config.heading || '');
    setText(config.text || '');
    setAlignment(config.alignment || 'start');
  }, [config]);

  const handleUpdate = (updates) => {
    const newConfig = {
      heading: updates.heading !== undefined ? updates.heading : heading,
      text: updates.text !== undefined ? updates.text : text,
      alignment: updates.alignment !== undefined ? updates.alignment : alignment
    };
    onUpdate(newConfig);
  };

  const handleHeadingChange = (e) => {
    const value = e.target.value;
    setHeading(value);
    handleUpdate({ heading: value });
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);
    handleUpdate({ text: value });
  };

  const handleAlignmentChange = (value) => {
    setAlignment(value);
    handleUpdate({ alignment: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="aboutHeading" className="block text-sm font-medium text-gray-700 mb-2">
          Heading
        </label>
        <input
          type="text"
          id="aboutHeading"
          value={heading}
          onChange={handleHeadingChange}
          placeholder="e.g., About Our Company"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
        />
      </div>

      <div>
        <label htmlFor="aboutText" className="block text-sm font-medium text-gray-700 mb-2">
          Text Content
        </label>
        <textarea
          id="aboutText"
          value={text}
          onChange={handleTextChange}
          placeholder="Enter information about your company..."
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none placeholder:text-gray-400"
        />
        <p className="mt-2 text-xs text-gray-500">
          Describe your company, mission, values, and culture. Press Enter for line breaks.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Alignment
        </label>
        <div className="flex space-x-2">
          <button
            onClick={() => handleAlignmentChange('start')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${alignment === 'start'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
          >
            Left
          </button>
          <button
            onClick={() => handleAlignmentChange('center')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${alignment === 'center'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
          >
            Center
          </button>
          <button
            onClick={() => handleAlignmentChange('end')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${alignment === 'end'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
          >
            Right
          </button>
        </div>
      </div>

      {!heading && !text && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            💡 Tip: Use this section to tell candidates about your company's story, mission, and what makes it a great place to work.
          </p>
        </div>
      )}

      {/* Advanced Styling */}
      <AdvancedStyling config={config} onUpdate={onUpdate} showPadding={false} showHeight={false} />
    </div>
  );
};

export default AboutSectionEditor;

import { useState } from 'react';

const AdvancedStyling = ({ config = {}, onUpdate, showColors = true, showPadding = true, showHeight = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const padding = config.padding !== undefined ? config.padding : 0;
  const height = config.height !== undefined ? config.height : 50;
  
  // Color overrides
  const customColors = config.customColors || {};

  const handlePaddingChange = (value) => {
    const numValue = parseInt(value) || 0;
    const clamped = Math.max(0, Math.min(50, numValue)); // Clamp between 0-50%

    onUpdate({
      ...config,
      padding: clamped,
      paddingLeft: clamped,
      paddingRight: clamped
    });
  };

  const handleHeightChange = (value) => {
    const numValue = parseInt(value) || 10;
    const clamped = Math.max(10, Math.min(100, numValue)); // Clamp between 10-100%

    onUpdate({
      ...config,
      height: clamped
    });
  };

  const handleColorChange = (colorKey, value) => {
    onUpdate({
      ...config,
      customColors: {
        ...customColors,
        [colorKey]: value
      }
    });
  };

  const handleResetColor = (colorKey) => {
    const newCustomColors = { ...customColors };
    delete newCustomColors[colorKey];
    onUpdate({
      ...config,
      customColors: newCustomColors
    });
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
      >
        <span>Advanced Styling</span>
        <svg
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Color Overrides */}
          {showColors && (
            <div className="space-y-3">
              <h5 className="text-xs font-semibold text-gray-700">Color Overrides</h5>
              <p className="text-xs text-gray-500">Override global theme colors for this component only</p>

              {/* Heading Color Override */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-gray-700">Heading Color</label>
                  {customColors.headingColor && (
                    <button
                      type="button"
                      onClick={() => handleResetColor('headingColor')}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={customColors.headingColor || '#3B82F6'}
                    onChange={(e) => handleColorChange('headingColor', e.target.value)}
                    className="h-8 w-12 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customColors.headingColor || ''}
                    onChange={(e) => handleColorChange('headingColor', e.target.value)}
                    placeholder="Use global"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                </div>
              </div>

              {/* Text Color Override */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-gray-700">Text Color</label>
                  {customColors.textColor && (
                    <button
                      type="button"
                      onClick={() => handleResetColor('textColor')}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={customColors.textColor || '#1F2937'}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    className="h-8 w-12 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customColors.textColor || ''}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    placeholder="Use global"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                </div>
              </div>

              {/* Button Color Override */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-gray-700">Button Color</label>
                  {customColors.buttonColor && (
                    <button
                      type="button"
                      onClick={() => handleResetColor('buttonColor')}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={customColors.buttonColor || '#EF4444'}
                    onChange={(e) => handleColorChange('buttonColor', e.target.value)}
                    className="h-8 w-12 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customColors.buttonColor || ''}
                    onChange={(e) => handleColorChange('buttonColor', e.target.value)}
                    placeholder="Use global"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                </div>
              </div>

              {/* Background Color Override */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-gray-700">Background Color</label>
                  {customColors.backgroundColor && (
                    <button
                      type="button"
                      onClick={() => handleResetColor('backgroundColor')}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={customColors.backgroundColor || '#F3F4F6'}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    className="h-8 w-12 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customColors.backgroundColor || ''}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    placeholder="Use global"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Horizontal Padding */}
          {showPadding && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Horizontal Padding (%)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={padding}
                  onChange={(e) => handlePaddingChange(e.target.value)}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">%</span>
              </div>
            </div>
          )}

          {/* Height */}
          {showHeight && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Height (%)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={height}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">%</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedStyling;

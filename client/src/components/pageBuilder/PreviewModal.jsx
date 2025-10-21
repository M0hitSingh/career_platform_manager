import { useState } from 'react';
import { usePageBuilder } from '../../context/PageBuilderContext';
import ComponentRenderer from './ComponentRenderer';

const PreviewModal = ({ isOpen, onClose }) => {
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' or 'mobile'
  const { components, branding } = usePageBuilder();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden preview-modal">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">Preview Career Page</h2>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === 'desktop'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Desktop</span>
                </div>
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === 'mobile'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
                  </svg>
                  <span>Mobile</span>
                </div>
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preview Content */}
        <div 
          className="flex-1 overflow-auto flex justify-center" 
          style={{ backgroundColor: viewMode === 'mobile' ? '#6B7280' : (branding.backgroundColor || '#F3F4F6') }}
        >
          <div
            className={`shadow-lg transition-all duration-300 ${viewMode === 'mobile'
              ? 'w-96 mx-auto'
              : 'w-full max-w-6xl'
              }`}
            style={{
              minHeight: viewMode === 'mobile' ? '600px' : '800px',
              backgroundColor: branding.backgroundColor
            }}
          >
            {/* Render Components */}
            <div className="w-full">
              {components.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No components added</h3>
                  <p className="text-gray-500">Add components to see your career page preview</p>
                </div>
              ) : (
                <div className="w-full">
                  {components
                    .sort((a, b) => a.order - b.order)
                    .map((component) => (
                      <div key={component.id} className="w-full">
                        <ComponentRenderer
                          component={component}
                          branding={branding}
                          isPreview={true}
                          viewMode={viewMode}
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
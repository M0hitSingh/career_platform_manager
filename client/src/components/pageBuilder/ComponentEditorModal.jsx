import { useState, useEffect } from 'react';
import { usePageBuilder } from '../../context/PageBuilderContext';
import VideoBoxEditor from './editors/VideoBoxEditor';
import ImageBoxEditor from './editors/ImageBoxEditor';
import TextComponentEditor from './editors/TextComponentEditor';
import CompanyBannerEditor from './editors/CompanyBannerEditor';
import AboutSectionEditor from './editors/AboutSectionEditor';
import HtmlBoxEditor from './editors/HtmlBoxEditor';
import FooterEditor from './editors/FooterEditor';

const ComponentEditorModal = ({ isOpen, onClose }) => {
  const { selectedComponent, components, updateComponent } = usePageBuilder();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay before showing animation
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen || !selectedComponent) return null;

  // Find the selected component
  const component = components.find(c => c.id === selectedComponent);

  if (!component) return null;

  // Handle config updates
  const handleConfigUpdate = (updates) => {
    console.log('Modal handleConfigUpdate called with:', updates);
    console.log('Component ID:', component.id);
    updateComponent(component.id, updates);
  };

  // Render the appropriate editor based on component type
  const renderEditor = () => {
    switch (component.type) {
      case 'video':
        return <VideoBoxEditor config={component.config} onUpdate={handleConfigUpdate} />;
      case 'image':
        return <ImageBoxEditor config={component.config} onUpdate={handleConfigUpdate} />;
      case 'text':
        return <TextComponentEditor config={component.config} onUpdate={handleConfigUpdate} />;
      case 'banner':
        return <CompanyBannerEditor config={component.config} onUpdate={handleConfigUpdate} />;
      case 'about':
        return <AboutSectionEditor config={component.config} onUpdate={handleConfigUpdate} />;
      case 'html':
        return <HtmlBoxEditor config={component.config} onUpdate={handleConfigUpdate} />;
      case 'footer':
        return <FooterEditor config={component.config} onUpdate={handleConfigUpdate} />;
      case 'jobs':
        return (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Job Section component automatically displays published jobs. No configuration needed.
            </p>
          </div>
        );
      default:
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              No editor available for this component type.
            </p>
          </div>
        );
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300 bg-transparent`}
      style={{ pointerEvents: isAnimating ? 'auto' : 'none' }}
    >
      <div
        className={`bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col border-2 border-gray-300 transition-all duration-300 ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        style={{ pointerEvents: 'auto', width: '600px', maxHeight: '75vh' }}
      >
        {/* Header */}
        <div className="p-3 border-gray-200 bg-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 capitalize">
              Edit {component.type}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Customize content and appearance
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-auto p-3">
          {renderEditor()}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComponentEditorModal;

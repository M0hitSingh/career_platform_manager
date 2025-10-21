import { usePageBuilder } from '../../context/PageBuilderContext';
import VideoBoxEditor from './editors/VideoBoxEditor';
import ImageBoxEditor from './editors/ImageBoxEditor';
import TextComponentEditor from './editors/TextComponentEditor';
import CompanyBannerEditor from './editors/CompanyBannerEditor';
import AboutSectionEditor from './editors/AboutSectionEditor';
import HtmlBoxEditor from './editors/HtmlBoxEditor';
import FooterEditor from './editors/FooterEditor';

const ComponentEditor = () => {
  const { selectedComponent, components, updateComponent, setSelectedComponent } = usePageBuilder();

  // Find the selected component
  const component = components.find(c => c.id === selectedComponent);

  if (!component) {
    return (
      <div className="p-6 text-center text-gray-500">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        <p className="text-sm">Select a component to edit its properties</p>
      </div>
    );
  }

  // Handle config updates
  const handleConfigUpdate = (updates) => {
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-gray-200 bg-white">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 capitalize">
              Edit {component.type} Component
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Customize the content and appearance
            </p>
          </div>
          <button
            onClick={() => setSelectedComponent(null)}
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded"
            title="Close editor"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto p-4">
        {renderEditor()}
      </div>
    </div>
  );
};

export default ComponentEditor;

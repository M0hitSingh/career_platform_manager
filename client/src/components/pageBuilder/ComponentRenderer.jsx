import { usePageBuilder } from '../../context/PageBuilderContext';
import CompanyBanner from '../careerPageComponents/CompanyBanner';
import AboutSection from '../careerPageComponents/AboutSection';
import JobSection from '../careerPageComponents/JobSection';
import ImageBox from '../careerPageComponents/ImageBox';
import VideoBox from '../careerPageComponents/VideoBox';
import TextComponent from '../careerPageComponents/TextComponent';
import HtmlBox from '../careerPageComponents/HtmlBox';
import Footer from '../careerPageComponents/Footer';

const ComponentRenderer = ({ component, branding: propBranding, isPreview = false, viewMode = 'desktop' }) => {
  const { branding: contextBranding } = usePageBuilder();
  const branding = propBranding || contextBranding;
  const config = component.config || {};

  // Create a key based on config to force re-render when config changes
  const configKey = JSON.stringify(config);

  // Get padding from config or use default 20%
  const paddingLeft = config.paddingLeft || 0;
  const paddingRight = config.paddingRight || 0;

  // Adjust padding for mobile view in preview mode
  const containerStyle = {
    paddingLeft: isPreview && viewMode === 'mobile' ? '4%' : `${paddingLeft}%`,
    paddingRight: isPreview && viewMode === 'mobile' ? '4%' : `${paddingRight}%`
  };

  const renderComponent = () => {
    const commonProps = {
      config,
      branding,
      isPreview,
      viewMode
    };

    switch (component.type) {
      case 'banner':
        return <CompanyBanner key={configKey} {...commonProps} />;

      case 'about':
        return <AboutSection key={configKey} {...commonProps} />;

      case 'jobs':
        return <JobSection key={configKey} {...commonProps} />;

      case 'image':
        return <ImageBox key={configKey} {...commonProps} isBuilder={!isPreview} />;

      case 'video':
        return <VideoBox key={configKey} {...commonProps} />;

      case 'text':
        return <TextComponent key={configKey} {...commonProps} />;

      case 'html':
        return <HtmlBox key={configKey} {...commonProps} />;

      case 'footer':
        return <Footer key={configKey} {...commonProps} isBuilder={!isPreview} />;

      default:
        return (
          <div key={configKey} className="p-8 bg-gray-100 rounded text-center">
            <p className="text-gray-600">Unknown component type: {component.type}</p>
          </div>
        );
    }
  };

  return (
    <div style={containerStyle}>
      {renderComponent()}
    </div>
  );
};

export default ComponentRenderer;

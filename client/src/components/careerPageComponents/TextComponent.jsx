import React from 'react';
import ComponentWrapper from './ComponentWrapper';

/**
 * TextComponent displays heading, subheading, and body text
 * @param {Object} props
 * @param {Object} props.config - Component configuration
 * @param {string} props.config.heading - Heading text
 * @param {string} props.config.subheading - Subheading text
 * @param {string} props.config.text - Body text
 * @param {string} props.config.alignment - Text alignment: 'start', 'center', 'end'
 * @param {Object} props.branding - Branding colors
 * @param {boolean} props.isBuilder - Whether in builder mode
 */
const TextComponent = ({ config = {}, branding = {}, isBuilder = false, isPreview = false, viewMode = 'desktop' }) => {
  const {
    heading = '',
    subheading = '',
    text = '',
    alignment = 'start'
  } = config;

  // Map alignment to Tailwind classes
  const alignmentMap = {
    start: 'text-left',
    center: 'text-center',
    end: 'text-right'
  };

  const alignmentClass = alignmentMap[alignment] || 'text-left';

  return (
    <ComponentWrapper
      primaryColor={branding.primaryColor}
      secondaryColor={branding.secondaryColor}
      textColor={branding.textColor}
      buttonColor={branding.buttonColor}
      backgroundColor={branding.backgroundColor}
      className="text-component"
    >
      <div 
        className="w-full bg-white bg-opacity-95"
        style={{ backgroundColor: branding.backgroundColor ? `${branding.backgroundColor}F0` : '#FFFFFFF0' }}
      >
        <div className={`w-full max-w-6xl mx-auto ${isPreview && viewMode === 'mobile' ? 'px-4 py-8' : 'px-6 py-12'} ${alignmentClass}`}>
        {heading && (
          <h2
            className={`${isPreview && viewMode === 'mobile' ? 'text-2xl' : 'text-4xl'} font-bold mb-4`}
            style={{ color: branding.primaryColor }}
          >
            {heading}
          </h2>
        )}
        
        {subheading && (
          <h3
            className={`${isPreview && viewMode === 'mobile' ? 'text-xl' : 'text-2xl'} font-semibold mb-6`}
            style={{ color: branding.secondaryColor }}
          >
            {subheading}
          </h3>
        )}
        
        {text && (
          <div
            className={`${isPreview && viewMode === 'mobile' ? 'text-base' : 'text-lg'} leading-relaxed whitespace-pre-wrap`}
            style={{ color: branding.textColor }}
          >
            {text}
          </div>
        )}

        {!heading && !subheading && !text && isBuilder && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg" style={{ borderColor: branding.primaryColor }}>
            <p style={{ color: branding.textColor }}>Add text content...</p>
          </div>
        )}
        </div>
      </div>
    </ComponentWrapper>
  );
};

export default TextComponent;

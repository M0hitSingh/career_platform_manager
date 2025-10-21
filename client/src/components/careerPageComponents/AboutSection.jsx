import ComponentWrapper from './ComponentWrapper';

/**
 * AboutSection component displays company about content
 * @param {Object} props
 * @param {Object} props.config - Component configuration
 * @param {string} props.config.heading - Section heading
 * @param {string} props.config.text - About content text
 * @param {string} props.config.alignment - Text alignment: 'start', 'center', 'end'
 * @param {Object} props.branding - Branding colors
 * @param {boolean} props.isBuilder - Whether in builder mode (allows editing)
 * @param {Function} props.onUpdate - Callback for content updates in builder mode
 */
const AboutSection = ({ config = {}, branding = {}, isBuilder = false, isPreview = false, viewMode = 'desktop' }) => {
  const {
    heading = '',
    text = '',
    alignment = 'start',
    customColors = {}
  } = config;

  // Get effective colors (custom overrides or global branding)
  const effectiveColors = {
    headingColor: customColors.headingColor || branding.headingColor || branding.primaryColor,
    textColor: customColors.textColor || branding.textColor,
    buttonColor: customColors.buttonColor || branding.buttonColor,
    backgroundColor: customColors.backgroundColor || branding.backgroundColor
  };

  // Map alignment values to Tailwind classes
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
      className="about-section"
    >
      <div
        className="w-full"
        style={{
          backgroundColor: effectiveColors.backgroundColor ? `${effectiveColors.backgroundColor}F0` : '#FFFFFFF0',
          minHeight: '200px'
        }}
      >
        <div className={`w-full max-w-6xl mx-auto ${isPreview && viewMode === 'mobile' ? 'px-4 py-8' : 'px-6 py-12'}`}>
          <div className={`space-y-6 ${alignmentClass}`}>
            {heading && (
              <h2
                className={`${isPreview && viewMode === 'mobile' ? 'text-xl' : 'text-2xl md:text-3xl'} font-bold`}
                style={{ color: effectiveColors.headingColor }}
              >
                {heading}
              </h2>
            )}

            {text && (
              <div
                className={`${isPreview && viewMode === 'mobile' ? 'text-sm' : 'text-base md:text-lg'} leading-relaxed whitespace-pre-line`}
                style={{ color: effectiveColors.textColor }}
              >
                {text}
              </div>
            )}

            {!heading && !text && (
              <div
                className="text-center py-24 border-2 border-dashed rounded-lg"
                style={{ borderColor: effectiveColors.headingColor || '#3B82F6' }}
              >
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: effectiveColors.headingColor || '#3B82F6' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p style={{ color: effectiveColors.textColor || '#374151' }}>
                  {isBuilder ? 'Add a heading and text content' : 'No content available'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ComponentWrapper>
  );
};

export default AboutSection;

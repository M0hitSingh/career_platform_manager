import React from 'react';
import ComponentWrapper from './ComponentWrapper';

/**
 * CompanyBanner component displays a banner with background image and text overlay
 * @param {Object} props
 * @param {Object} props.config - Component configuration
 * @param {string} props.config.imageUrl - Background image URL
 * @param {string} props.config.text - Overlay text
 * @param {Object} props.config.textPosition - Text positioning
 * @param {string} props.config.textPosition.horizontal - Horizontal position: 'start', 'center', 'end'
 * @param {string} props.config.textPosition.vertical - Vertical position: 'up', 'mid', 'down'
 * @param {Object} props.branding - Branding colors
 * @param {boolean} props.isBuilder - Whether in builder mode
 */
const CompanyBanner = ({ config = {}, branding = {}, isBuilder = false, isPreview = false, viewMode = 'desktop' }) => {
  const {
    imageUrl = '',
    text = '',
    description = '',
    buttonText = '',
    buttonLink = '',
    textPosition = { horizontal: 'center', vertical: 'mid' },
    paddingLeft = 0,
    paddingRight = 0,
    height = 50,
    customColors = {}
  } = config;

  // Get effective colors (custom overrides or global branding)
  const effectiveColors = {
    headingColor: customColors.headingColor || branding.headingColor || branding.primaryColor,
    textColor: customColors.textColor || branding.textColor,
    buttonColor: customColors.buttonColor || branding.buttonColor,
    backgroundColor: customColors.backgroundColor || branding.backgroundColor
  };



  // Map position values to Tailwind classes
  const horizontalAlignmentMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end'
  };

  const verticalAlignmentMap = {
    up: 'items-start',
    mid: 'items-center',
    down: 'items-end'
  };

  const horizontalClass = horizontalAlignmentMap[textPosition.horizontal] || 'justify-center';
  const verticalClass = verticalAlignmentMap[textPosition.vertical] || 'items-center';

  // Adjust height for mobile view (height is now in percentage)
  const adjustedHeight = isPreview && viewMode === 'mobile' ? Math.max(height, 40) : height;

  // Mobile-specific background styling
  const isMobile = isPreview && viewMode === 'mobile';

  const backgroundStyle = {
    backgroundColor: imageUrl ? 'transparent' : (effectiveColors.backgroundColor || '#3B82F6'),
    backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
    paddingLeft: `${paddingLeft}%`,
    paddingRight: `${paddingRight}%`
  };



  // Check if component is empty (no text, description, or button)
  const isEmpty = !text && !description && !buttonText;

  return (
    <ComponentWrapper
      primaryColor={branding.primaryColor}
      secondaryColor={branding.secondaryColor}
      textColor={branding.textColor}
      buttonColor={branding.buttonColor}
      backgroundColor={branding.backgroundColor}
      className="company-banner"
    >
      {isEmpty && isBuilder ? (
        // Empty state with proper styling
        <div
          className="text-center py-24 border-2 border-dashed rounded-lg"
          style={{
            borderColor: effectiveColors.headingColor || '#3B82F6',
            backgroundColor: effectiveColors.backgroundColor || '#F3F4F6',
            height: `${adjustedHeight}vh`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div>
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p style={{ color: effectiveColors.textColor || '#374151' }}>
              Add heading, description, and button to create your hero banner
            </p>
          </div>
        </div>
      ) : (
        // Normal banner with content
        <div
          className={`relative w-full bg-center flex ${horizontalClass} ${verticalClass}`}
          style={{
            ...backgroundStyle,
            height: isMobile ? `${adjustedHeight - 30}vh` : `${adjustedHeight}vh`,
            backgroundSize: isMobile ? 'contain' : 'cover',
            backgroundPosition: isMobile ? 'center top' : 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0"></div>

          {/* Text content */}
          <div className={`relative z-10 w-full h-full flex flex-col ${horizontalClass} ${verticalClass} ${isPreview && viewMode === 'mobile' ? 'p-4 space-y-3' : 'p-8 space-y-6'} max-w-6xl mx-auto`}>
            {text && (
              <h1
                className={`${isPreview && viewMode === 'mobile' ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'} font-bold drop-shadow-lg ${textPosition.horizontal === 'center' ? 'text-center' : textPosition.horizontal === 'end' ? 'text-right' : 'text-left'}`}
                style={{ color: effectiveColors.headingColor || '#FFFFFF' }}
              >
                {text}
              </h1>
            )}

            {description && (
              <p
                className={`${isPreview && viewMode === 'mobile' ? 'text-xs sm:text-sm' : 'text-sm md:text-base'} drop-shadow-lg max-w-2xl whitespace-pre-line ${textPosition.horizontal === 'center' ? 'text-center' : textPosition.horizontal === 'end' ? 'text-right' : 'text-left'}`}
                style={{ color: effectiveColors.textColor || '#FFFFFF' }}
              >
                {description}
              </p>
            )}

            {buttonText && (
              <div className={`flex ${textPosition.horizontal === 'center' ? 'justify-center' : textPosition.horizontal === 'end' ? 'justify-end' : 'justify-start'}`}>
                <a
                  href={buttonLink || '#'}
                  className={`${isPreview && viewMode === 'mobile' ? 'px-4 py-2 text-sm' : 'px-6 py-3'} rounded-md font-medium text-white transition-colors shadow-lg`}
                  style={{ backgroundColor: effectiveColors.buttonColor || '#3B82F6' }}
                >
                  {buttonText}
                </a>
              </div>
            )}

            {/* Show placeholder text if no content but not completely empty */}
            {!text && !description && !buttonText && !isBuilder && (
              <h1
                className={`${isPreview && viewMode === 'mobile' ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'} font-bold drop-shadow-lg ${textPosition.horizontal === 'center' ? 'text-center' : textPosition.horizontal === 'end' ? 'text-right' : 'text-left'}`}
                style={{ color: effectiveColors.headingColor || '#FFFFFF' }}
              >
                Welcome
              </h1>
            )}
          </div>
        </div>
      )}
    </ComponentWrapper>
  );
};

export default CompanyBanner;

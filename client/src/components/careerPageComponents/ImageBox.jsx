import React, { useState } from 'react';
import ComponentWrapper from './ComponentWrapper';

/**
 * ImageBox component displays images in a row or carousel
 * @param {Object} props
 * @param {Object} props.config - Component configuration
 * @param {Array} props.config.images - Array of image objects with url and caption
 * @param {Object} props.branding - Branding colors
 * @param {boolean} props.isBuilder - Whether in builder mode
 */
const ImageBox = ({ config = {}, branding = {}, isBuilder = false, viewMode = 'desktop' }) => {
  const { images = [] } = config;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use carousel if more than 3 images to prevent overcrowding, or always use carousel on mobile
  const useCarousel = images.length > 3 || (viewMode === 'mobile' && images.length > 1);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0 && !isBuilder) {
    return null;
  }

  return (
    <ComponentWrapper
      primaryColor={branding.primaryColor}
      secondaryColor={branding.secondaryColor}
      textColor={branding.textColor}
      buttonColor={branding.buttonColor}
      backgroundColor={branding.backgroundColor}
      className="image-box"
    >
      <div 
        className="w-full bg-white bg-opacity-95 overflow-hidden"
        style={{ 
          backgroundColor: branding.backgroundColor ? `${branding.backgroundColor}E6` : '#FFFFFFE6',
          minHeight: '200px'
        }}
      >
        <div className="w-full max-w-6xl mx-auto px-6 py-12 overflow-hidden">
        {images.length === 0 ? (
          <div 
            className="text-center py-24 border-2 border-dashed rounded-lg"
            style={{ borderColor: branding.primaryColor || '#3B82F6' }}
          >
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: branding.primaryColor || '#3B82F6' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p style={{ color: branding.textColor || '#374151' }}>
              {isBuilder ? 'Add images to display gallery' : 'No images to display'}
            </p>
          </div>
        ) : useCarousel ? (
          // Carousel view for many images
          <div className="relative max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-lg shadow-xl aspect-video bg-gray-100">
              <img
                src={images[currentIndex].url}
                alt={images[currentIndex].caption || `Image ${currentIndex + 1}`}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              
              {/* Image counter */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
            
            {images[currentIndex].caption && (
              <p className="text-center mt-4 text-base md:text-lg font-medium" style={{ color: branding.textColor }}>
                {images[currentIndex].caption}
              </p>
            )}
            
            {/* Navigation buttons */}
            <button
              onClick={prevImage}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 md:p-3 shadow-lg transition-all duration-200 hover:scale-110"
              style={{ color: branding.primaryColor }}
            >
              <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 md:p-3 shadow-lg transition-all duration-200 hover:scale-110"
              style={{ color: branding.primaryColor }}
            >
              <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots indicator */}
            <div className="flex justify-center gap-1 md:gap-2 mt-6 flex-wrap">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex ? 'w-6 md:w-8' : 'w-2'
                  }`}
                  style={{
                    backgroundColor: index === currentIndex ? branding.primaryColor : branding.textColor,
                    opacity: index === currentIndex ? 1 : 0.4
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          // Row view for few images with better spacing - always vertical on mobile
          <div className={`grid gap-6 w-full grid-cols-1 ${
            images.length === 1 ? 'max-w-2xl mx-auto' :
            images.length === 2 ? 'md:grid-cols-2' :
            'md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {images.map((image, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 aspect-square bg-gray-100">
                  <img
                    src={image.url}
                    alt={image.caption || `Image ${index + 1}`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                {image.caption && (
                  <p 
                    className="text-center mt-3 text-sm font-medium" 
                    style={{ color: branding.textColor }}
                  >
                    {image.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </ComponentWrapper>
  );
};

export default ImageBox;

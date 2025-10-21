import React from 'react';
import DOMPurify from 'dompurify';
import ComponentWrapper from './ComponentWrapper';

/**
 * HtmlBox component renders custom HTML content with XSS protection
 * @param {Object} props
 * @param {Object} props.config - Component configuration
 * @param {string} props.config.html - HTML content to render
 * @param {Object} props.branding - Branding colors
 * @param {boolean} props.isBuilder - Whether in builder mode
 */
const HtmlBox = ({ config = {}, branding = {}, isBuilder = false }) => {
  const { html = '' } = config;

  // Sanitize HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'img', 'div', 'span', 'blockquote', 'code', 'pre',
      'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'style', 'target'],
    ALLOW_DATA_ATTR: false
  });

  return (
    <ComponentWrapper
      primaryColor={branding.primaryColor}
      secondaryColor={branding.secondaryColor}
      textColor={branding.textColor}
      buttonColor={branding.buttonColor}
      backgroundColor={branding.backgroundColor}
      className="html-box"
    >
      <div className="w-full max-w-6xl mx-auto px-6 py-12">
        {!html ? (
          <div 
            className="text-center py-12 border-2 border-dashed rounded-lg"
            style={{ borderColor: branding.primaryColor }}
          >
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: branding.primaryColor }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            <p style={{ color: branding.textColor }}>
              {isBuilder ? 'Add custom HTML content...' : 'No content available'}
            </p>
          </div>
        ) : (
          <div
            className="prose prose-lg max-w-none"
            style={{ color: branding.textColor }}
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        )}
      </div>
    </ComponentWrapper>
  );
};

export default HtmlBox;

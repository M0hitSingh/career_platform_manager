import React from 'react';
import ComponentWrapper from './ComponentWrapper';

/**
 * VideoBox component embeds a video from URL
 * @param {Object} props
 * @param {Object} props.config - Component configuration
 * @param {string} props.config.videoUrl - Video URL (YouTube, Vimeo, or direct video URL)
 * @param {Object} props.branding - Branding colors
 * @param {boolean} props.isBuilder - Whether in builder mode
 */
const VideoBox = ({ config = {}, branding = {}, isBuilder = false, isPreview = false, viewMode = 'desktop' }) => {
  const { videoUrl = '' } = config;

  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // YouTube URL patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Vimeo URL patterns
    const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[3]) {
      return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
    }
    
    // Return original URL for direct video files or already embedded URLs
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);
  const isDirectVideo = embedUrl && (embedUrl.endsWith('.mp4') || embedUrl.endsWith('.webm') || embedUrl.endsWith('.ogg'));

  return (
    <ComponentWrapper
      primaryColor={branding.primaryColor}
      secondaryColor={branding.secondaryColor}
      textColor={branding.textColor}
      buttonColor={branding.buttonColor}
      backgroundColor={branding.backgroundColor}
      className="video-box"
    >
      <div className={`w-full max-w-6xl mx-auto ${isPreview && viewMode === 'mobile' ? 'px-4 py-8' : 'px-6 py-12'}`}>
        {!embedUrl ? (
          <div
            className="text-center py-24 border-2 border-dashed rounded-lg"
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
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p style={{ color: branding.textColor }}>
              {isBuilder ? 'Add a video URL to display video' : 'No video available'}
            </p>
          </div>
        ) : isDirectVideo ? (
          // Direct video file
          <video
            controls
            className="w-full rounded-lg shadow-lg"
            style={{ maxHeight: '500px' }}
          >
            <source src={embedUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Video content"
            />
          </div>
        )}
      </div>
    </ComponentWrapper>
  );
};

export default VideoBox;

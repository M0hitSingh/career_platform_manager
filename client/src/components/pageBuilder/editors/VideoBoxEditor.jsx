import { useState, useEffect } from 'react';
import AdvancedStyling from './AdvancedStyling';

const VideoBoxEditor = ({ config = {}, onUpdate }) => {
  const [videoUrl, setVideoUrl] = useState(config.videoUrl || '');

  useEffect(() => {
    setVideoUrl(config.videoUrl || '');
  }, [config.videoUrl]);

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setVideoUrl(newUrl);
    onUpdate({ videoUrl: newUrl });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
          Video URL
        </label>
        <input
          type="url"
          id="videoUrl"
          value={videoUrl}
          onChange={handleUrlChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-2 text-xs text-gray-500">
          Supports YouTube, Vimeo, and direct video URLs
        </p>
      </div>

      {videoUrl && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-xs text-green-800 font-medium">✓ Video URL set</p>
          <p className="text-xs text-green-600 mt-1 break-all">{videoUrl}</p>
        </div>
      )}

      {/* Advanced Styling */}
      <AdvancedStyling config={config} onUpdate={onUpdate} showPadding={false} showHeight={false} />
    </div>
  );
};

export default VideoBoxEditor;

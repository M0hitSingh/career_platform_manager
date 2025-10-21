import { useState, useEffect } from 'react';
import ImageCropper from '../../common/ImageCropper';
import AdvancedStyling from './AdvancedStyling';

const ImageBoxEditor = ({ config = {}, onUpdate }) => {
  const [images, setImages] = useState(config.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropAspectRatio, setCropAspectRatio] = useState(16 / 9);

  useEffect(() => {
    setImages(config.images || []);
  }, [config.images]);

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;

    const newImage = {
      url: newImageUrl.trim(),
      caption: newImageCaption.trim()
    };

    const updatedImages = [...images, newImage];
    setImages(updatedImages);
    onUpdate({ images: updatedImages });

    // Reset form
    setNewImageUrl('');
    setNewImageCaption('');
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onUpdate({ images: updatedImages });
  };

  const handleUpdateCaption = (index, caption) => {
    const updatedImages = images.map((img, i) =>
      i === index ? { ...img, caption } : img
    );
    setImages(updatedImages);
    onUpdate({ images: updatedImages });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a local URL for the uploaded file and open cropper
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImage) => {
    setNewImageUrl(croppedImage);
    setShowCropper(false);
    setImageToCrop(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setImageToCrop(null);
  };

  const openCropperForUrl = () => {
    if (!newImageUrl.trim()) return;
    setImageToCrop(newImageUrl);
    setShowCropper(true);
  };

  return (
    <div className="space-y-6">
      {/* Image Cropper Modal */}
      {showCropper && imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          aspectRatio={cropAspectRatio || undefined}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
      {/* Add New Image Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900">Add Image</h4>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <div className="flex space-x-2">
            <input
              type="url"
              id="imageUrl"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {newImageUrl && (
              <button
                onClick={openCropperForUrl}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                title="Crop image"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* <div>
          <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-700 mb-1">
            Crop Aspect Ratio
          </label>
          <select
            id="aspectRatio"
            value={cropAspectRatio}
            onChange={(e) => setCropAspectRatio(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={16/9}>16:9 (Landscape)</option>
            <option value={4/3}>4:3 (Standard)</option>
            <option value={1}>1:1 (Square)</option>
            <option value={3/4}>3:4 (Portrait)</option>
            <option value={0}>Free (No constraint)</option>
          </select>
        </div> */}

        <div>
          <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-1">
            Or Upload File
          </label>
          <input
            type="file"
            id="imageFile"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="mt-1 text-xs text-gray-500">
            Uploaded images are stored as base64
          </p>
        </div>

        <div>
          <label htmlFor="imageCaption" className="block text-sm font-medium text-gray-700 mb-1">
            Caption (optional)
          </label>
          <input
            type="text"
            id="imageCaption"
            value={newImageCaption}
            onChange={(e) => setNewImageCaption(e.target.value)}
            placeholder="Image description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleAddImage}
          disabled={!newImageUrl.trim()}
          className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Add Image
        </button>
      </div>

      {/* Image List - Simple List without Previews */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">
            Images ({images.length})
          </h4>

          <div className="space-y-2">
            {images.map((image, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Image {index + 1}
                  </span>
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Remove image"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <input
                  type="text"
                  value={image.caption || ''}
                  onChange={(e) => handleUpdateCaption(index, e.target.value)}
                  placeholder="Add caption for this image"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length === 0 && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-sm text-gray-500">No images added yet</p>
        </div>
      )}

      {/* Advanced Styling */}
      <AdvancedStyling config={config} onUpdate={onUpdate} showPadding={false} showHeight={false} />
    </div>
  );
};

export default ImageBoxEditor;

import { useState, useRef, useCallback } from 'react';

const ImageCropper = ({ image, onCropComplete, onCancel, aspectRatio = 16/9 }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [cropArea, setCropArea] = useState({ x: 50, y: 50, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - cropArea.x,
      y: e.clientY - cropArea.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setCropArea(prev => ({
      ...prev,
      x: Math.max(0, Math.min(rect.width - prev.width, e.clientX - rect.left - dragStart.x)),
      y: Math.max(0, Math.min(rect.height - prev.height, e.clientY - rect.top - dragStart.y))
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const createCroppedImage = useCallback(async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const imageElement = imageRef.current;
    
    if (!imageElement) return image;

    const scaleX = imageElement.naturalWidth / imageElement.width;
    const scaleY = imageElement.naturalHeight / imageElement.height;

    canvas.width = cropArea.width * scaleX;
    canvas.height = cropArea.height * scaleY;
    
    ctx.drawImage(
      imageElement,
      cropArea.x * scaleX,
      cropArea.y * scaleY,
      cropArea.width * scaleX,
      cropArea.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.9);
    });
  }, [image, cropArea]);

  const handleSave = async () => {
    const croppedImage = await createCroppedImage();
    onCropComplete(croppedImage);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Crop Image</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div 
          className="relative flex-1 min-h-[400px] bg-gray-100 rounded-lg overflow-hidden cursor-crosshair"
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imageRef}
            src={image}
            alt="Crop preview"
            className="w-full h-full object-contain"
            draggable={false}
          />
          
          {/* Crop overlay */}
          <div
            className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20 cursor-move"
            style={{
              left: cropArea.x,
              top: cropArea.y,
              width: cropArea.width,
              height: cropArea.height
            }}
            onMouseDown={handleMouseDown}
          >
            {/* Corner handles */}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 cursor-nw-resize"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 cursor-ne-resize"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 cursor-sw-resize"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 cursor-se-resize"></div>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Crop Area: {cropArea.width} × {cropArea.height}
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setCropArea(prev => ({ ...prev, width: Math.max(50, prev.width - 10) }))}
                className="px-2 py-1 bg-gray-200 rounded text-sm"
              >
                Smaller
              </button>
              <button
                onClick={() => setCropArea(prev => ({ ...prev, width: prev.width + 10, height: prev.height + 10 }))}
                className="px-2 py-1 bg-gray-200 rounded text-sm"
              >
                Larger
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Aspect Ratio:</label>
              <select
                value={aspectRatio}
                onChange={(e) => {
                  // This would need to be passed as a prop to change aspect ratio
                }}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
                disabled
              >
                <option value={16/9}>16:9 (Landscape)</option>
                <option value={4/3}>4:3 (Standard)</option>
                <option value={1}>1:1 (Square)</option>
                <option value={3/4}>3:4 (Portrait)</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Crop & Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
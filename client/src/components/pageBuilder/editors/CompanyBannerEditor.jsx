import { useState, useEffect } from 'react';
import AdvancedStyling from './AdvancedStyling';

const CompanyBannerEditor = ({ config = {}, onUpdate }) => {
  const [imageUrl, setImageUrl] = useState(config.imageUrl || '');
  const [text, setText] = useState(config.text || '');
  const [description, setDescription] = useState(config.description || '');
  const [buttonText, setButtonText] = useState(config.buttonText || '');
  const [buttonLink, setButtonLink] = useState(config.buttonLink || '');
  const [horizontalPosition, setHorizontalPosition] = useState(
    config.textPosition?.horizontal || 'center'
  );
  const [verticalPosition, setVerticalPosition] = useState(
    config.textPosition?.vertical || 'mid'
  );

  useEffect(() => {
    setImageUrl(config.imageUrl || '');
    setText(config.text || '');
    setDescription(config.description || '');
    setButtonText(config.buttonText || '');
    setButtonLink(config.buttonLink || '');
    setHorizontalPosition(config.textPosition?.horizontal || 'center');
    setVerticalPosition(config.textPosition?.vertical || 'mid');
  }, [config]);

  const handleUpdate = (updates) => {
    const newConfig = {
      imageUrl: updates.imageUrl !== undefined ? updates.imageUrl : imageUrl,
      text: updates.text !== undefined ? updates.text : text,
      description: updates.description !== undefined ? updates.description : description,
      buttonText: updates.buttonText !== undefined ? updates.buttonText : buttonText,
      buttonLink: updates.buttonLink !== undefined ? updates.buttonLink : buttonLink,
      textPosition: {
        horizontal: updates.horizontal !== undefined ? updates.horizontal : horizontalPosition,
        vertical: updates.vertical !== undefined ? updates.vertical : verticalPosition
      }
    };
    console.log('Calling onUpdate with config:', newConfig);
    onUpdate(newConfig);
  };

  const handleImageUrlChange = (e) => {
    const value = e.target.value;
    setImageUrl(value);
    console.log('Updating image URL:', value);
    handleUpdate({ imageUrl: value });
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);
    handleUpdate({ text: value });
  };



  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    handleUpdate({ description: value });
  };

  const handleButtonTextChange = (e) => {
    const value = e.target.value;
    setButtonText(value);
    handleUpdate({ buttonText: value });
  };

  const handleButtonLinkChange = (e) => {
    const value = e.target.value;
    setButtonLink(value);
    handleUpdate({ buttonLink: value });
  };

  const handleHorizontalChange = (value) => {
    setHorizontalPosition(value);
    handleUpdate({ horizontal: value });
  };

  const handleVerticalChange = (value) => {
    setVerticalPosition(value);
    handleUpdate({ vertical: value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
      handleUpdate({ imageUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="bannerImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
          Background Image URL
        </label>
        <input
          type="url"
          id="bannerImageUrl"
          value={imageUrl}
          onChange={handleImageUrlChange}
          placeholder="https://example.com/banner.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
        />
      </div>

      <div>
        <label htmlFor="bannerImageFile" className="block text-sm font-medium text-gray-700 mb-2">
          Or Upload Image
        </label>
        <input
          type="file"
          id="bannerImageFile"
          accept="image/*"
          onChange={handleFileUpload}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div>
        <label htmlFor="bannerText" className="block text-sm font-medium text-gray-700 mb-2">
          Heading
        </label>
        <input
          type="text"
          id="bannerText"
          value={text}
          onChange={handleTextChange}
          placeholder="Enter main heading"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
        />
      </div>



      <div>
        <label htmlFor="bannerDescription" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="bannerDescription"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Enter description paragraph"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none placeholder:text-gray-400"
        />
      </div>

      <div>
        <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700 mb-2">
          Button Text
        </label>
        <input
          type="text"
          id="buttonText"
          value={buttonText}
          onChange={handleButtonTextChange}
          placeholder="e.g., View jobs"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
        />
      </div>

      <div>
        <label htmlFor="buttonLink" className="block text-sm font-medium text-gray-700 mb-2">
          Button Link
        </label>
        <input
          type="text"
          id="buttonLink"
          value={buttonLink}
          onChange={handleButtonLinkChange}
          placeholder="e.g., #jobs or /careers"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vertical Position
        </label>
        <div className="flex space-x-2">
          <button
            onClick={() => handleHorizontalChange('start')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${horizontalPosition === 'start'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
          >
            Start
          </button>
          <button
            onClick={() => handleHorizontalChange('center')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${horizontalPosition === 'center'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
          >
            Center
          </button>
          <button
            onClick={() => handleHorizontalChange('end')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${horizontalPosition === 'end'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
          >
            End
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Horizontal Position
        </label>
        <div className="flex space-x-2">
          <button
            onClick={() => handleVerticalChange('up')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${verticalPosition === 'up'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
          >
            Top
          </button>
          <button
            onClick={() => handleVerticalChange('mid')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${verticalPosition === 'mid'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
          >
            Middle
          </button>
          <button
            onClick={() => handleVerticalChange('down')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${verticalPosition === 'down'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
          >
            Bottom
          </button>
        </div>
      </div>



      {/* Advanced Styling */}
      <AdvancedStyling config={config} onUpdate={onUpdate} />
    </div>
  );
};

export default CompanyBannerEditor;

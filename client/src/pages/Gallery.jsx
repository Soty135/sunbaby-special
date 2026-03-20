import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import { getMediaUrl } from '../services/api';

const VideoThumbnail = ({ src }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const captureFrame = () => {
      if (videoRef.current) {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 320;
        canvas.height = video.videoHeight || 240;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setThumbnail(canvas.toDataURL('image/jpeg', 0.8));
      }
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', captureFrame);
      return () => video.removeEventListener('loadeddata', captureFrame);
    }
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        crossOrigin="anonymous"
        className="hidden"
        onLoadedData={captureFrame}
      />
      {thumbnail ? (
        <img src={thumbnail} alt="Video thumbnail" className="w-full h-full object-cover" />
      ) : (
        <div className="text-6xl">🎬</div>
      )}
    </>
  );
};

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  // Define the function before using it
  const fetchGalleryItems = useCallback(async () => {
    try {
      setLoading(true);
      const url = filter === 'all' 
        ? '/api/gallery'
        : `/api/gallery?mediaType=${filter}`;
      
      const response = await api.get(url);
      setGalleryItems(response.data);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchGalleryItems();
  }, [filter, fetchGalleryItems]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Gallery</h1>
          <p className="text-xl text-gray-600">View our delicious food collection</p>
        </div>

        {/* Filter */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-2 flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('image')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'image'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Images
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'video'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Videos
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {galleryItems.map((item, index) => (
              <div key={`${item._id}-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleItemClick(item)}>
                {/* Media Content */}
                {item.mediaType === 'image' ? (
                  <div className="aspect-square bg-gray-200">
                    {item.mediaURL && (
                      <img 
                        src={getMediaUrl(item.mediaURL)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ) : (
                  <div className="aspect-square bg-gray-800 relative flex items-center justify-center">
                    {item.mediaURL ? (
                      <VideoThumbnail src={getMediaUrl(item.mediaURL)} />
                    ) : (
                      <div className="text-6xl">🎬</div>
                    )}
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 rounded px-2 py-1">
                      <span className="text-white text-xs">Video</span>
                    </div>
                  </div>
                )}
                
                {/* Title and Description below media */}
                <div className="p-1 sm:p-2">
                  <h3 className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-1">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && galleryItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🖼️</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Gallery Items</h2>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'No gallery items found.'
                : `No ${filter}s found.`
              }
            </p>
          </div>
        )}

        {/* Modal for Selected Item */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{selectedItem.title}</h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Media Display */}
                  {selectedItem.mediaType === 'image' ? (
                    <div className="bg-gray-100 rounded-lg p-4">
                      <img 
                        src={getMediaUrl(selectedItem.mediaURL)}
                        alt={selectedItem.title}
                        className="w-full max-h-96 object-contain mx-auto"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-center min-h-64">
                      {selectedItem.mediaURL ? (
                        <video 
                          src={getMediaUrl(selectedItem.mediaURL)}
                          alt={selectedItem.title}
                          className="w-full max-h-96 mx-auto"
                          controls
                          playsInline
                        />
                      ) : (
                        <div className="text-8xl mb-4">🎬</div>
                      )}
                    </div>
                  )}
                  
                  {/* Item Details */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                    <p className="text-gray-600">
                      {selectedItem.description || 'No description available.'}
                    </p>
                  </div>
                  
                  {/* Meta Information */}
                  <div className="text-sm text-gray-500 pt-4 border-t">
                    <p>Type: {selectedItem.mediaType}</p>
                    <p>Upload Date: {new Date(selectedItem.uploadDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import api, { getMediaUrl } from '../services/api';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const { user, logout } = useAdminAuth();
  const [activeSection, setActiveSection] = useState('menu');
  const [menuItems, setMenuItems] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Menu form state
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main',
    imageURL: ''
  });
  
  // Gallery form state
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    mediaType: 'image',
    mediaURL: ''
  });

  // File states
  const [menuImageFile, setMenuImageFile] = useState(null);
  const [galleryMediaFile, setGalleryMediaFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [galleryPreviewUrl, setGalleryPreviewUrl] = useState('');

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    // Clear any dummy cart data when admin accesses dashboard
    localStorage.removeItem('guestCart');
    
    if (activeSection === 'menu') {
      fetchMenuItems();
    } else if (activeSection === 'gallery') {
      fetchGalleryItems();
    }
  }, [activeSection]);

  const fetchMenuItems = async () => {
    try {
      const response = await api.get('/api/menu');
      setMenuItems(response.data);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    }
  };

  const fetchGalleryItems = async () => {
    try {
      const response = await api.get('/api/gallery');
      setGalleryItems(response.data);
    } catch (error) {
      console.error('Failed to fetch gallery items:', error);
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Add all form fields
      Object.keys(menuForm).forEach(key => {
        if (key !== 'imageURL') {
          formData.append(key, menuForm[key]);
        }
      });
      
      // Add image file if selected
      if (menuImageFile) {
        formData.append('image', menuImageFile);
      } else if (menuForm.imageURL && menuForm.imageURL.startsWith('blob:')) {
        // Convert blob URL to file
        const response = await fetch(menuForm.imageURL);
        const blob = await response.blob();
        const file = new File([blob], 'menu-item.jpg', { type: 'image/jpeg' });
        formData.append('image', file);
      }
      
      if (menuForm._id) {
        formData.append('_id', menuForm._id);
        await api.put(`/api/menu/${menuForm._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/api/menu', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      setMenuForm({ name: '', description: '', price: '', category: 'main', imageURL: '' });
      setMenuImageFile(null);
      setPreviewUrl('');
      fetchMenuItems();
      Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Menu item has been saved successfully.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Failed to save menu item:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save menu item.',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMenuItem = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });
    
    if (!result.isConfirmed) return;
    
    try {
      await api.delete(`/api/menu/${id}`);
      fetchMenuItems();
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Menu item has been deleted.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Failed to delete menu item:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete menu item.',
      });
    }
  };

  const editMenuItem = (item) => {
    setMenuForm({
      _id: item._id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageURL: item.imageURL || ''
    });
    setPreviewUrl(item.imageURL ? getMediaUrl(item.imageURL) : '');
    setMenuImageFile(null);
  };

  const toggleAvailability = async (id, currentAvailability) => {
    try {
      const response = await api.patch(`/api/menu/${id}/toggle-availability`);
      fetchMenuItems();
      Swal.fire({
        icon: 'success',
        title: 'Availability Updated',
        text: `Item is now ${response.data.availability ? 'available' : 'unavailable'}!`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Failed to toggle availability:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update availability.',
      });
    }
  };

  const deleteGalleryItem = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });
    
    if (!result.isConfirmed) return;
    
    try {
      await api.delete(`/api/gallery/${id}`);
      fetchGalleryItems();
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Gallery item has been deleted.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Failed to delete gallery item:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete gallery item.',
      });
    }
  };

  const editGalleryItem = (item) => {
    setGalleryForm({
      _id: item._id,
      title: item.title,
      description: item.description,
      mediaType: item.mediaType,
      mediaURL: item.mediaURL || ''
    });
    setGalleryPreviewUrl(item.mediaURL || '');
    setGalleryMediaFile(null);
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Add all form fields
      Object.keys(galleryForm).forEach(key => {
        if (key !== 'mediaURL') {
          formData.append(key, galleryForm[key]);
        }
      });
      
      // Add media file if selected
      if (galleryMediaFile) {
        formData.append('media', galleryMediaFile);
      } else if (galleryForm.mediaURL && galleryForm.mediaURL.startsWith('blob:')) {
        // Convert blob URL to file
        const response = await fetch(galleryForm.mediaURL);
        const blob = await response.blob();
        const file = new File([blob], 'gallery-media.jpg', { type: galleryForm.mediaType === 'image' ? 'image/jpeg' : 'video/mp4' });
        formData.append('media', file);
      }
      
      if (galleryForm._id) {
        await api.put(`/api/gallery/${galleryForm._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/api/gallery/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      setGalleryForm({ title: '', description: '', mediaType: 'image', mediaURL: '' });
      setGalleryMediaFile(null);
      setGalleryPreviewUrl('');
      fetchGalleryItems();
      Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: galleryForm._id ? 'Gallery item updated successfully!' : 'Gallery item added successfully!',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Failed to save gallery item:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save gallery item: ' + (error.response?.data?.message || error.message),
      });
    } finally {
      setLoading(false);
    }
  };

  const selectFromGallery = (mediaType = 'image') => {
    const filteredItems = galleryItems.filter(item => item.mediaType === mediaType);
    if (filteredItems.length === 0) {
      alert(`No ${mediaType}s in gallery. Please add some first!`);
      return;
    }
    
    const selected = filteredItems[0]; // Select first item for simplicity
    if (mediaType === 'image') {
      setMenuForm({...menuForm, imageURL: selected.mediaURL});
      setPreviewUrl(selected.mediaURL);
      setMenuImageFile(null);
    }
  };

  const renderMenuManagement = () => (
    <div className="space-y-6">
      {/* Add/Edit Menu Item Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">
          {menuForm._id ? 'Edit Menu Item' : 'Add New Menu Item'}
        </h3>
        <form onSubmit={handleMenuSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                required
                value={menuForm.name}
                onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., Jollof Rice"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={menuForm.price}
                onChange={(e) => setMenuForm({...menuForm, price: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="12.99"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={menuForm.category}
              onChange={(e) => setMenuForm({...menuForm, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="main">Main Dish</option>
              <option value="side">Side Dish</option>
              <option value="drink">Drink</option>
              <option value="dessert">Dessert</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={menuForm.description}
              onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Describe your delicious dish..."
            />
          </div>
          
          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setMenuImageFile(file);
                      const url = URL.createObjectURL(file);
                      setPreviewUrl(url);
                      setMenuForm({...menuForm, imageURL: url});
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              {/* Gallery Selector */}
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => selectFromGallery('image')}
                  className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                  🖼️ Select from Gallery
                </button>
              </div>
            </div>
            
            {/* Image Preview */}
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-md border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl('');
                    setMenuImageFile(null);
                    setMenuForm({...menuForm, imageURL: ''});
                  }}
                  className="ml-2 text-red-600 hover:text-red-800 text-sm"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (menuForm._id ? 'Update Item' : 'Add Item')}
            </button>
            {menuForm._id && (
              <button
                type="button"
                onClick={() => {
                  setMenuForm({ name: '', description: '', price: '', category: 'main', imageURL: '' });
                  setMenuImageFile(null);
                  setPreviewUrl('');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Menu Items List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Current Menu Items</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {menuItems.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleAvailability(item._id, item.availability)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.availability
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {item.availability ? '✅ Available' : '❌ Unavailable'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => editMenuItem(item)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMenuItem(item._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {menuItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No menu items found. Add your first item above!
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderGalleryManagement = () => (
    <div className="space-y-6">
      {/* Add/Edit Gallery Item Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">
          {galleryForm._id ? 'Edit Gallery Item' : 'Add New Gallery Item'}
        </h3>
        <form onSubmit={handleGallerySubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              required
              value={galleryForm.title}
              onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Delicious Jollof Rice"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
            <select
              value={galleryForm.mediaType}
              onChange={(e) => setGalleryForm({...galleryForm, mediaType: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={galleryForm.description}
              onChange={(e) => setGalleryForm({...galleryForm, description: e.target.value})}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Describe this media..."
            />
          </div>
          
          {/* File Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload {galleryForm.mediaType === 'image' ? 'Image' : 'Video'} File
            </label>
            <input
              type="file"
              accept={galleryForm.mediaType === 'image' ? 'image/*' : 'video/*'}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setGalleryMediaFile(file);
                  const url = URL.createObjectURL(file);
                  setGalleryPreviewUrl(url);
                  setGalleryForm({...galleryForm, mediaURL: url});
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          {/* Media Preview */}
          {galleryPreviewUrl && (
            <div className="mt-2">
              <div className="text-sm text-gray-700 mb-2">Preview:</div>
              {galleryForm.mediaType === 'image' ? (
                <img
                  src={galleryPreviewUrl}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-md border border-gray-300"
                />
              ) : (
                <div className="h-32 w-32 bg-gray-200 rounded-md border border-gray-300 flex items-center justify-center">
                  <span className="text-4xl">🎬</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setGalleryPreviewUrl('');
                  setGalleryMediaFile(null);
                  setGalleryForm({...galleryForm, mediaURL: ''});
                }}
                className="ml-2 text-red-600 hover:text-red-800 text-sm"
              >
                Remove File
              </button>
            </div>
          )}
          
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (galleryForm._id ? 'Update Media' : 'Add Media')}
            </button>
            {galleryForm._id && (
              <button
                type="button"
                onClick={() => {
                  setGalleryForm({ title: '', description: '', mediaType: 'image', mediaURL: '' });
                  setGalleryMediaFile(null);
                  setGalleryPreviewUrl('');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Gallery Items List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Current Gallery Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div key={item._id} className="border border-gray-200 rounded-lg p-4">
              <div className="aspect-w-16 aspect-h-12 bg-gray-100 mb-4 flex items-center justify-center">
                {item.mediaType === 'image' && item.mediaURL ? (
                  <img 
                    src={getMediaUrl(item.mediaURL)} 
                    alt={item.title}
                    className="max-h-32 object-contain"
                  />
                ) : item.mediaType === 'video' && item.mediaURL ? (
                  <video 
                    src={getMediaUrl(item.mediaURL)}
                    alt={item.title}
                    className="max-h-32 object-contain"
                  />
                ) : (
                  <div className="text-4xl">🎬</div>
                )}
              </div>
              <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
              <p className="text-sm text-gray-500 mb-3">{item.description}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => editGalleryItem(item)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteGalleryItem(item._id)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {galleryItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No gallery items found. Add your first media above!
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">👨‍🍳 Admin Dashboard</h1>
              <span className="ml-4 text-sm opacity-75">Welcome, {user?.email}</span>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/"
                className="bg-white text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
              >
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Navigation Tabs */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setActiveSection('menu')}
              className={`px-4 py-2 rounded-md font-medium ${
                activeSection === 'menu'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              🍽️ Menu Management
            </button>
            <button
              onClick={() => setActiveSection('gallery')}
              className={`px-4 py-2 rounded-md font-medium ${
                activeSection === 'gallery'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              🖼️ Gallery Management
            </button>
          </div>

          {/* Active Section */}
          {activeSection === 'menu' && renderMenuManagement()}
          {activeSection === 'gallery' && renderGalleryManagement()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
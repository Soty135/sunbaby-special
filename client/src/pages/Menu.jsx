import React, { useState, useEffect, useCallback } from 'react';
import useCart from '../hooks/useCart';
import api from '../services/api';
import { getMediaUrl } from '../services/api';
import Swal from 'sweetalert2';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart } = useCart();

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      
      // Always fetch all menu items to keep categories consistent
      const response = await api.get('/api/menu');
      
      console.log('Menu Data received:', response.data);
      console.log('Data length:', response.data?.length);
      
      // Extract unique categories from all items
      const uniqueCategories = [...new Set(response.data.map(item => item.category))];
      setCategories(uniqueCategories);
      
      // Filter locally based on selected category
      const filteredItems = selectedCategory === 'all' 
        ? response.data 
        : response.data.filter(item => item.category === selectedCategory);
      
      setMenuItems(filteredItems);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchMenuItems();
  }, [selectedCategory]);

  const handleAddToCart = async (menuItemId, itemName) => {
    try {
      await addToCart(menuItemId);
      Swal.fire({
        icon: 'success',
        title: 'Added to Cart!',
        text: `${itemName} has been added to your cart.`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add item to cart. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">🍽️ Menu</h1>
          <p className="text-xl md:text-2xl text-gray-600">Browse our delicious options</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No menu items found</h2>
            <p className="text-gray-600 mb-8">
              {selectedCategory === 'all' 
                ? 'No menu items available at the moment.'
                : `No items found in ${selectedCategory} category.`
              }
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 max-w-md mx-auto">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">💡 Tip:</h3>
              <p className="text-xs text-yellow-700">
                Try adding some delicious menu items through the admin dashboard to get started!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {menuItems.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Item Image */}
                <div className="relative h-32 overflow-hidden">
                  {item.imageURL ? (
                    <img 
                      src={getMediaUrl(item.imageURL)}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-t-lg"
                      loading="lazy"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 rounded-t-lg">
                      <span className="text-4xl">🍽️</span>
                    </div>
                  )}
                  {item.imageURL && (
                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                      📷 Image
                    </div>
                  )}
                </div>
                
                {/* Item Details */}
                <div className="p-3">
                  <div className="mb-2">
                    <h3 className="text-base font-bold text-gray-900">{item.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-green-600">${item.price.toFixed(2)}</span>
                      <div className="flex flex-wrap gap-1">
                        {item.preparationTime && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
                            ⏱️ {item.preparationTime} min
                          </span>
                        )}
                        <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Badges and Info */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.availability ? (
                      <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full">
                        ✅ Available
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded-full">
                        ❌ Out of Stock
                      </span>
                    )}
                  </div>
                  
                  {/* Allergens */}
                  {item.allergens && item.allergens.length > 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs font-medium text-gray-800 mb-1">Allergens:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.allergens.map((allergen, index) => (
                          <span key={index} className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">
                            {allergen}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Ingredients */}
                  {item.ingredients && item.ingredients.length > 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs font-medium text-gray-800 mb-1">Ingredients:</p>
                      <p className="text-xs text-gray-600">
                        {item.ingredients.join(', ')}
                      </p>
                    </div>
                  )}
                  
                  {/* Add to Cart Button */}
                  <div className="mt-3">
                    <button
                      onClick={() => handleAddToCart(item._id, item.name)}
                      disabled={!item.availability}
                      className={`w-full py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                        item.availability
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        {item.availability ? (
                          <>
                            🛒 Add to Cart
                          </>
                        ) : (
                          <>
                            ❌ Out of Stock
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
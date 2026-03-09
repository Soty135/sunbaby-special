import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const handleWhatsAppOrder = () => {
    const phoneNumber = '2347030462122';
    const message = encodeURIComponent('Hey Sunbaby Special, I\'d like to place a special order.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Sunbaby Special
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100">
            Delicious food delivered right to your doorstep
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/menu"
              className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors"
            >
              View Menu
            </Link>
            <button
              onClick={handleWhatsAppOrder}
              className="bg-green-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-900 transition-colors flex items-center justify-center gap-2"
            >
              <span>📱</span> Make Special Order
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Why Choose Sunbaby Special?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Easy Payment</h3>
              <p className="text-gray-600">Multiple payment options for your convenience</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable delivery to your location</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Secure Payments</h3>
              <p className="text-gray-600">Safe and secure payment processing</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🍲</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Lots of Varieties</h3>
              <p className="text-gray-600">Wide range of delicious options to choose from</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Order?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Place your order now through WhatsApp for quick and easy service!
          </p>
          <button
            onClick={handleWhatsAppOrder}
            className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-colors flex items-center justify-center gap-2 mx-auto text-lg"
          >
            <span>📱</span> Order Now on WhatsApp
          </button>
        </div>
      </section>

      {/* Featured Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            What Makes Us Special
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Fresh Ingredients</h3>
              <p className="text-gray-600 mb-6">
                We use only the freshest ingredients sourced from local suppliers to ensure 
                the highest quality and taste in every dish we prepare.
              </p>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Authentic Recipes</h3>
              <p className="text-gray-600">
                Our recipes are carefully crafted and perfected over years to bring you the 
                authentic flavors you crave, with a modern twist.
              </p>
            </div>
            <div className="bg-gray-200 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-xl text-gray-700">Taste the Difference</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
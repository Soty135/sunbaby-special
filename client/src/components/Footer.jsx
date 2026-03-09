import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">🍲 Sunbaby Special</h3>
            <p className="text-gray-300">
              Delicious food delivered right to your doorstep. Quality ingredients, 
              authentic flavors, and exceptional service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-green-400 transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-green-400 transition-colors">About Us</a></li>
              <li><a href="/menu" className="hover:text-green-400 transition-colors">Menu</a></li>
              <li><a href="/gallery" className="hover:text-green-400 transition-colors">Gallery</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-gray-300">
              <p>📍 Location: Maryland, USA</p>
              <p>📞 Phone: +234 703 046 2122</p>
              <p>✉️ Email: info@sunbabyspecial.com</p>
              <div className="mt-4">
                <p className="font-semibold mb-2">Follow Us:</p>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-green-400 transition-colors">Facebook</a>
                  <a href="https://instagram.com/sunbabyspecials" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">Instagram</a>
                  <a href="#" className="hover:text-green-400 transition-colors">Twitter</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Sunbaby Special. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
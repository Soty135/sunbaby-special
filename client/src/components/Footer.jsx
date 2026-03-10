import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-base md:text-lg font-bold mb-2">🍲 Sunbaby Special</h3>
            <p className="text-xs md:text-sm text-gray-300">
              Delicious food delivered to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm md:text-base font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1 text-xs md:text-sm text-gray-300">
              <li><Link to="/" className="hover:text-green-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-green-400 transition-colors">About Us</Link></li>
              <li><Link to="/menu" className="hover:text-green-400 transition-colors">Menu</Link></li>
              <li><Link to="/gallery" className="hover:text-green-400 transition-colors">Gallery</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm md:text-base font-semibold mb-2">Contact Us</h3>
            <div className="space-y-1 text-xs md:text-sm text-gray-300">
              <p>📍 Maryland, USA</p>
              <p>📞 +234 703 046 2122</p>
              <p>✉️ info@sunbabyspecial.com</p>
              <div className="mt-2">
                <p className="font-semibold mb-1">Follow Us:</p>
                <div className="flex space-x-3">
                  <a href="#" className="hover:text-green-400 transition-colors">Facebook</a>
                  <a href="https://instagram.com/sunbabyspecials" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">Instagram</a>
                  <a href="#" className="hover:text-green-400 transition-colors">Twitter</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-3 border-t border-gray-700 text-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Sunbaby Special. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
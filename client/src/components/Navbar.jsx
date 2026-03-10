import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAdminAuth();
  const { items } = useCart();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav ref={menuRef} className="bg-green-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-white">
              🍲 Sunbaby Special
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`hover:text-green-200 transition-colors ${isActive('/') ? 'text-green-200' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`hover:text-green-200 transition-colors ${isActive('/about') ? 'text-green-200' : ''}`}
            >
              About
            </Link>
            <Link
              to="/menu"
              className={`hover:text-green-200 transition-colors ${isActive('/menu') ? 'text-green-200' : ''}`}
            >
              Menu
            </Link>
            <Link
              to="/gallery"
              className={`hover:text-green-200 transition-colors ${isActive('/gallery') ? 'text-green-200' : ''}`}
            >
              Gallery
            </Link>
            <Link
              to="/cart"
              className={`hover:text-green-200 transition-colors flex items-center ${isActive('/cart') ? 'text-green-200' : ''}`}
            >
              Cart
              {cartItemCount > 0 && (
                <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user?.role === 'admin' ? (
              <Link
                to="/admin/dashboard"
                className="hover:text-green-200 transition-colors"
              >
                Admin Dashboard
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="hover:text-green-200 transition-colors"
              >
                Admin Login
              </Link>
            )}

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="hover:text-green-200 transition-colors"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-green-200 focus:outline-none p-1"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-green-700 absolute w-full left-0 shadow-lg`}>
        <div className="px-2 py-1 space-y-0.5">
          <Link
            to="/"
            className={`block px-2 py-1.5 rounded text-sm font-medium hover:bg-green-600 ${isActive('/') ? 'bg-green-600' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`block px-2 py-1.5 rounded text-sm font-medium hover:bg-green-600 ${isActive('/about') ? 'bg-green-600' : ''}`}
          >
            About
          </Link>
          <Link
            to="/menu"
            className={`block px-2 py-1.5 rounded text-sm font-medium hover:bg-green-600 ${isActive('/menu') ? 'bg-green-600' : ''}`}
          >
            Menu
          </Link>
          <Link
            to="/gallery"
            className={`block px-2 py-1.5 rounded text-sm font-medium hover:bg-green-600 ${isActive('/gallery') ? 'bg-green-600' : ''}`}
          >
            Gallery
          </Link>
          <Link
            to="/cart"
            className={`block px-2 py-1.5 rounded text-sm font-medium hover:bg-green-600 flex items-center ${isActive('/cart') ? 'bg-green-600' : ''}`}
          >
            Cart
            {cartItemCount > 0 && (
              <span className="ml-1 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">
                {cartItemCount}
              </span>
            )}
          </Link>
          
          {!isAuthenticated && (
            <Link
              to="/admin/login"
              className={`block px-2 py-1.5 rounded text-sm font-medium hover:bg-green-600 ${isActive('/admin/login') ? 'bg-green-600' : ''}`}
            >
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
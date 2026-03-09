import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAdminAuth();
  const { items } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-green-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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
            <button className="text-white hover:text-green-200 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-green-700">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 ${isActive('/') ? 'bg-green-600' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 ${isActive('/about') ? 'bg-green-600' : ''}`}
          >
            About
          </Link>
          <Link
            to="/menu"
            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 ${isActive('/menu') ? 'bg-green-600' : ''}`}
          >
            Menu
          </Link>
          <Link
            to="/gallery"
            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 ${isActive('/gallery') ? 'bg-green-600' : ''}`}
          >
            Gallery
          </Link>
          <Link
            to="/cart"
            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 flex items-center ${isActive('/cart') ? 'bg-green-600' : ''}`}
          >
            Cart
            {cartItemCount > 0 && (
              <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {cartItemCount}
              </span>
            )}
          </Link>
          
          {!isAuthenticated && (
            <Link
              to="/admin/login"
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 ${isActive('/admin/login') ? 'bg-green-600' : ''}`}
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
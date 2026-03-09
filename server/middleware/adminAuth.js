const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle fallback mock admin token
    if (decoded.id === 'mock-admin-id') {
      req.user = {
        _id: 'mock-admin-id',
        email: 'admin@sunbaby.com',
        role: 'admin'
      };
      return next();
    }
    
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

module.exports = adminAuth;
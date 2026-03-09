const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Admin Login Route
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fallback for when database is not connected
    if (email === 'admin@sunbaby.com' && password === 'admin123') {
      const token = jwt.sign(
        { id: 'mock-admin-id', role: 'admin' },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '1d' }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: 'mock-admin-id',
          email: 'admin@sunbaby.com',
          role: 'admin'
        }
      });
    }

    try {
      // Check if any admin exists, if not create default
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount === 0) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('admin123', salt);
        
        const defaultAdmin = new User({
          name: 'Admin User',
          email: 'admin@sunbaby.com',
          passwordHash,
          role: 'admin'
        });
        
        await defaultAdmin.save();
        console.log('Default admin user created: admin@sunbaby.com / admin123');
      }
      
      // Check if requested admin exists
      const admin = await User.findOne({ email, role: 'admin' });
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Invalid admin credentials'
        });
      }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Create and sign JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });

    } catch (dbError) {
      console.error('Database error during admin login:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Database connection error'
      });
    }

  } catch (error) {
    console.error('Admin login error:', error);
    console.error('Error stack:', error.stack);
    console.error('Request body:', req.body);
    console.error('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    res.status(500).json({
      success: false,
      message: 'Server error during admin login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Verify admin token
router.get('/admin/verify', require('../middleware/adminAuth'), (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;
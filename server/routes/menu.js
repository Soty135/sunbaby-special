const express = require('express');
const multer = require('multer');
const path = require('path');
const MenuItem = require('../models/MenuItem');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'menu-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const allowedExtensions = /\.(jpeg|jpg|png|gif|webp)$/i;
    
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all menu items (public)
router.get('/', async (req, res) => {
  try {
    const { category, available } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (available !== undefined) filter.availability = available === 'true';

    const menuItems = await MenuItem.find(filter).sort({ createdAt: -1 });
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single menu item (public)
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create menu item (admin only)
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, availability = true, imageURL } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ 
        message: 'Missing required fields'
      });
    }

    let finalImageURL = '';

    // Handle file upload - convert to Base64
    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      const mimeType = req.file.mimetype;
      finalImageURL = `data:${mimeType};base64,${base64}`;
    } else if (imageURL && imageURL.startsWith('data:')) {
      // Already Base64
      finalImageURL = imageURL;
    } else if (imageURL && !imageURL.startsWith('http')) {
      // Keep existing path for backwards compatibility
      finalImageURL = imageURL;
    }

    const menuItem = new MenuItem({
      name,
      description,
      price: parseFloat(price),
      category,
      availability,
      imageURL: finalImageURL
    });

    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update menu item (admin only)
router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, availability, imageURL } = req.body;
    
    const updateData = {
      name,
      description,
      price: parseFloat(price),
      category,
      availability: availability !== 'false'
    };

    // Handle file upload - convert to Base64
    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      const mimeType = req.file.mimetype;
      updateData.imageURL = `data:${mimeType};base64,${base64}`;
    } else if (imageURL && imageURL.startsWith('data:')) {
      // Already Base64
      updateData.imageURL = imageURL;
    } else if (imageURL !== undefined) {
      // Keep existing path or new URL
      updateData.imageURL = imageURL;
    }

    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json(menuItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete menu item (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle menu item availability (admin only)
router.patch('/:id/toggle-availability', adminAuth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    menuItem.availability = !menuItem.availability;
    await menuItem.save();
    
    res.json(menuItem);
  } catch (error) {
    console.error('Error toggling menu item availability:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
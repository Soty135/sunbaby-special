const express = require('express');
const multer = require('multer');
const MenuItem = require('../models/MenuItem');
const adminAuth = require('../middleware/adminAuth');
const { menuStorage } = require('../config/cloudinary');

const router = express.Router();

const upload = multer({
  storage: menuStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const allowedExtensions = /\.(jpeg|jpg|png|gif|webp)$/i;

    const extname = allowedExtensions.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.get('/', async (req, res) => {
  try {
    const { category, available } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (available !== undefined) filter.availability = available === 'true';

    const menuItems = await MenuItem.find(filter).sort({ createdAt: -1 });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

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

router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, availability = true, imageURL, sizes } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        message: 'Missing required fields',
      });
    }

    let finalImageURL = '';

    if (req.file) {
      finalImageURL = req.file.path;
    } else if (imageURL && imageURL.startsWith('http')) {
      finalImageURL = imageURL;
    }

    let parsedSizes = [];
    if (sizes) {
      try {
        parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
      } catch (e) {
        console.error('Error parsing sizes:', e);
      }
    }

    const menuItem = new MenuItem({
      name,
      description,
      price: parseFloat(price),
      category,
      availability,
      imageURL: finalImageURL,
      sizes: parsedSizes,
    });

    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, availability, imageURL, sizes } = req.body;

    const updateData = {
      name,
      description,
      price: parseFloat(price),
      category,
      availability: availability !== 'false',
    };

    if (req.file) {
      updateData.imageURL = req.file.path;
    } else if (imageURL !== undefined) {
      updateData.imageURL = imageURL;
    }

    if (sizes !== undefined) {
      try {
        updateData.sizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
      } catch (e) {
        console.error('Error parsing sizes:', e);
        updateData.sizes = [];
      }
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

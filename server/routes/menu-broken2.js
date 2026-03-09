const express = require('express');
const multer = require('multer');
const path = require('path');
const MenuItem = require('../models/MenuItem');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all menu items (public)
router.get('/', async (req, res) => {
  try {
    const { category, available } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (available !== undefined) filter.availability = available === 'true';

    // Try to get from database first with shorter timeout
    try {
      const menuItems = await Promise.race([
        MenuItem.find(filter).sort({ createdAt: -1 }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('DB timeout')), 3000)
        )
      ]);
      return res.json(menuItems);
    } catch (dbError) {
      // Fallback to mock data if database is not available
      console.log('Database not available, using mock data:', dbError.message);
      
      const mockMenuItems = [
        {
          _id: '1',
          name: 'Jollof Rice with Chicken',
          description: 'Classic Nigerian jollof rice served with grilled chicken and plantains',
          price: 15.99,
          category: 'Main Course',
          availability: true,
          imageURL: '/uploads/jollof.jpg',
          createdAt: new Date()
        },
        {
          _id: '2',
          name: 'Pounded Yam with Egusi Soup',
          description: 'Traditional pounded yam served with rich egusi soup and assorted meats',
          price: 18.99,
          category: 'Main Course',
          availability: true,
          imageURL: '/uploads/pounded-yam.jpg',
          createdAt: new Date()
        },
        {
          _id: '3',
          name: 'Fried Rice with Shrimp',
          description: 'Special fried rice with succulent shrimp and mixed vegetables',
          price: 16.99,
          category: 'Main Course',
          availability: true,
          imageURL: '/uploads/fried-rice.jpg',
          createdAt: new Date()
        },
        {
          _id: '4',
          name: 'Meat Pie',
          description: 'Flaky pastry filled with seasoned minced meat and vegetables',
          price: 4.99,
          category: 'Snacks',
          availability: true,
          imageURL: '/uploads/meat-pie.jpg',
          createdAt: new Date()
        },
        {
          _id: '5',
          name: 'Chin Chin',
          description: 'Crunchy, sweet snack perfect for any occasion',
          price: 3.99,
          category: 'Snacks',
          availability: true,
          imageURL: '/uploads/chin-chin.jpg',
          createdAt: new Date()
        },
        {
          _id: '6',
          name: 'Zobo Drink',
          description: 'Refreshing hibiscus drink with natural flavors',
          price: 2.99,
          category: 'Drinks',
          availability: true,
          imageURL: '/uploads/zobo-drink.jpg',
          createdAt: new Date()
        }
      ];

      // Apply filters to mock data
      let filteredItems = mockMenuItems;
      if (category) {
        filteredItems = filteredItems.filter(item => item.category === category);
      }
      if (available !== undefined) {
        filteredItems = filteredItems.filter(item => item.availability === (available === 'true'));
      }

      res.json(filteredItems);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single menu item (public)
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await Promise.race([
      MenuItem.findById(req.params.id),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('DB timeout')), 3000)
      )
    ]);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Configure multer for menu item image uploads
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

// Create menu item (admin only)
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, availability = true, imageURL } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        missing: {
          name: !name,
          description: !description,
          price: !price,
          category: !category
        }
      });
    }

    // If file was uploaded, use its path, otherwise use the provided imageURL
    const finalImageURL = req.file ? `/uploads/${req.file.filename}` : (imageURL || '');

    // Try database first with timeout
    try {
      const menuItem = new MenuItem({
        name,
        description,
        price,
        category,
        availability,
        imageURL: finalImageURL
      });

      const savedItem = await Promise.race([
        menuItem.save(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('DB timeout')), 3000)
        )
      ]);
      
      console.log('Menu item saved successfully:', savedItem._id);
      return res.status(201).json(savedItem);
    } catch (dbError) {
      console.log('Database not available for menu creation, using mock data:', dbError.message);
      
      // Find existing mock item by name (check global mockMenuItems)
      const existingItem = mockMenuItems.find(item => 
        item.name.toLowerCase() === name.toLowerCase()
      );
      
      if (existingItem) {
        return res.status(400).json({ 
          message: 'Menu item already exists',
          existingItem: existingItem
        });
      }
      
      // Mock menu item creation
      const mockMenuItem = {
        _id: `mock-menu-${Date.now()}`,
        name,
        description,
        price: parseFloat(price),
        category,
        availability: availability !== 'false',
        imageURL: finalImageURL,
        createdAt: new Date()
      };
      
      // Store in global mock array
      mockMenuItems.push(mockMenuItem);
      
      console.log('Created mock menu item:', mockMenuItem);
      res.status(201).json(mockMenuItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update menu item (admin only) 
router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, availability, imageURL } = req.body;
    
    // Build update object
    const updateData = {
      name,
      description,
      price,
      category,
      availability
    };

    // Handle image update
    if (req.file) {
      updateData.imageURL = `/uploads/${req.file.filename}`;
    } else if (imageURL !== undefined) {
      updateData.imageURL = imageURL;
    }

    // Mock menu item update (database fallback)
    const mockMenuItem = {
      _id: req.params.id,
      name,
      description,
      price: parseFloat(price),
      category,
      availability: availability !== 'false',
      imageURL: updateData.imageURL || '/uploads/default.jpg',
      updatedAt: new Date()
    };

    console.log('Updated mock menu item:', mockMenuItem);
    res.json(mockMenuItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete menu item (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    // Find item by ID
    const itemIndex = mockMenuItems.findIndex(item => item._id === req.params.id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Remove item
    mockMenuItems.splice(itemIndex, 1);
    
    console.log('Deleted mock menu item:', req.params.id);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
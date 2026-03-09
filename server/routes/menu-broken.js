const express = require('express');
const multer = require('multer');
const path = require('path');
const MenuItem = require('../models/MenuItem');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// In-memory menu storage for fallback
let mockMenuItems = [];

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
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
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
      
      // Include mock menu items in results
      const allItems = [...mockMenuItems];
      res.json(allItems);
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
          imageURL: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzRFQ0RDNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qb3VuZGVkIFlhbTwvdGV4dD48L3N2Zz4=',
          createdAt: new Date()
        },
        {
          _id: '3',
          name: 'Fried Rice with Shrimp',
          description: 'Special fried rice with succulent shrimp and mixed vegetables',
          price: 16.99,
          category: 'Main Course',
          availability: true,
          imageURL: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzQ1QjdEMSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5GcmllZCBSaWNlPC90ZXh0Pjwvc3ZnPg==',
          createdAt: new Date()
        },
        {
          _id: '4',
          name: 'Meat Pie',
          description: 'Flaky pastry filled with seasoned minced meat and vegetables',
          price: 4.99,
          category: 'Snacks',
          availability: true,
          imageURL: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0Y3REM2RiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5NZWF0IFBpZTwvdGV4dD48L3N2Zz4=',
          createdAt: new Date()
        },
        {
          _id: '5',
          name: 'Chin Chin',
          description: 'Crunchy, sweet snack perfect for any occasion',
          price: 3.99,
          category: 'Snacks',
          availability: true,
          imageURL: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIkJCOkZDRSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DaGluIENoaW48L3RleHQ+PC9zdmc+',
          createdAt: new Date()
        },
        {
          _id: '6',
          name: 'Zobo Drink',
          description: 'Refreshing hibiscus drink with natural flavors',
          price: 2.99,
          category: 'Drinks',
          availability: true,
          imageURL: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0U3NEMzQyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ab2JvIERyaW5rPC90ZXh0Pjwvc3ZnPg==',
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
    console.log('Menu item creation request:', {
      body: req.body,
      file: req.file ? req.file.filename : 'No file',
      user: req.user
    });

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
      
      // Fallback to mock menu item creation
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
      
      // Store in mock array
      mockMenuItems.push(mockMenuItem);
      
      console.log('Returning mock menu item:', mockMenuItem);
      res.status(201).json(mockMenuItem);
    }
  } catch (error) {
    console.error('Menu item creation error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({ 
        message: 'Validation Error', 
        errors: validationErrors 
      });
    }
    
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

    // Try database first with timeout
    try {
      const menuItem = await Promise.race([
        MenuItem.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true, runValidators: true }
        ),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('DB timeout')), 3000)
        )
      ]);

      if (!menuItem) {
        return res.status(404).json({ message: 'Menu item not found' });
      }

      return res.json(menuItem);
    } catch (dbError) {
      console.log('Database not available for menu update, using mock data:', dbError.message);
      
      // Fallback to in-memory update
      const itemIndex = mockMenuItems.findIndex(item => item._id === req.params.id);
      
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      
      // Update the mock item
      Object.assign(mockMenuItems[itemIndex], {
        name,
        description,
        price: parseFloat(price),
        category,
        availability: availability !== 'false',
        imageURL: req.file ? `/uploads/${req.file.filename}` : (imageURL || '')
      });
      
      console.log('Updated mock menu item:', mockMenuItems[itemIndex]);
      res.json(mockMenuItems[itemIndex]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete menu item (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    // Try database first with timeout
    try {
      const menuItem = await Promise.race([
        MenuItem.findByIdAndDelete(req.params.id),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('DB timeout')), 3000)
        )
      ]);

      if (!menuItem) {
        return res.status(404).json({ message: 'Menu item not found' });
      }

      res.json({ message: 'Menu item deleted successfully' });
    } catch (dbError) {
      console.log('Database not available for menu delete, using mock data:', dbError.message);
      
      // Fallback to in-memory delete
      const itemIndex = mockMenuItems.findIndex(item => item._id === req.params.id);
      
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      
      mockMenuItems.splice(itemIndex, 1);
      
      console.log('Deleted mock menu item:', req.params.id);
      res.json({ message: 'Menu item deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
const express = require('express');
const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');


const router = express.Router();

// In-memory cart storage for fallback
const mockCarts = new Map();

// Mock menu items for cart operations (matching menu route IDs)
const mockMenuItems = {
  'mock-1': { _id: 'mock-1', name: 'Jollof Rice with Chicken', price: 15.99, availability: true },
  'mock-2': { _id: 'mock-2', name: 'Pounded Yam with Egusi Soup', price: 18.99, availability: true },
  'mock-3': { _id: 'mock-3', name: 'Fried Rice with Shrimp', price: 16.99, availability: true },
  'mock-4': { _id: 'mock-4', name: 'Meat Pie', price: 4.99, availability: true },
  'mock-5': { _id: 'mock-5', name: 'Chin Chin', price: 3.99, availability: true },
  'mock-6': { _id: 'mock-6', name: 'Zobo Drink', price: 2.99, availability: true }
};

// Get user's cart
router.get('/', async (req, res) => {
  try {
    console.log('Get cart request for user:', req.user ? req.user._id : 'No user');
    
    // Try database first with timeout
    try {
      let cart = await Promise.race([
        Cart.findOne({ userId: req.user._id }).populate('items.menuItemId'),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('DB timeout')), 3000)
        )
      ]);
      
      if (!cart) {
        cart = new Cart({ userId: req.user._id, items: [] });
        await cart.save();
        console.log('Created new cart for user:', req.user._id);
      }

      console.log('Cart retrieved successfully:', cart._id);
      return res.json(cart);
    } catch (dbError) {
      console.log('Database not available for cart, using mock data:', dbError.message);
      
      // Fallback to mock cart data
      if (!mockCarts.has(req.user._id)) {
        const initialCart = {
          _id: 'mock-cart-id',
          userId: req.user._id,
          items: [],
          totalAmount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        mockCarts.set(req.user._id, initialCart);
        console.log('Returning mock cart for user:', req.user._id);
        return res.json(initialCart);
      }
      
      const mockCart = mockCarts.get(req.user._id);
      // Populate menu item data for each cart item
      mockCart.items = mockCart.items.map(item => ({
        ...item,
        menuItemId: item.menuItemId._id ? item.menuItemId : {
          _id: item.menuItemId,
          name: mockMenuItems[item.menuItemId]?.name,
          price: item.price,
          availability: mockMenuItems[item.menuItemId]?.availability,
          imageURL: mockMenuItems[item.menuItemId]?.imageURL
        }
      }));
      
      console.log('Returning mock cart for user:', req.user._id);
      res.json(mockCart);
    }
  } catch (error) {
    console.error('Get cart error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    console.log('Add to cart request START');
    console.log('Request body:', req.body);
    console.log('Request user:', req.user ? req.user._id : 'No user');
    console.log('Request headers:', req.headers);

    const { menuItemId, quantity = 1 } = req.body;

    if (!menuItemId) {
      return res.status(400).json({ message: 'Menu item ID is required' });
    }

    // Try database first with timeout
    try {
      // Verify menu item exists (check both database and mock items)
      let menuItem;
      
      // Try database first with timeout
      try {
        menuItem = await Promise.race([
          MenuItem.findById(menuItemId),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('DB timeout')), 3000)
          )
        ]);
      } catch (dbError) {
        console.log('Database not available for cart add, checking mock items:', dbError.message);
      }
      
      // If database failed, check mock items
      if (!menuItem) {
        menuItem = mockMenuItems.find(item => 
          (item._id === menuItemId || item.id === menuItemId)
        );
      }
      
      if (!menuItem) {
        return res.status(400).json({ message: 'Menu item not found' });
      }
      
      // Check availability (handle both database and mock items)
      let isAvailable = menuItem.availability;
      if (!isAvailable && menuItem) {
        isAvailable = menuItem.availability !== false;
      }

      let cart = await Promise.race([
        Cart.findOne({ userId: req.user._id }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('DB timeout')), 3000)
        )
      ]);
    
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.menuItemId.toString() === menuItemId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        menuItemId,
        quantity,
        price: menuItem.price
      });
    }

    // Calculate total before saving
    cart.totalAmount = cart.calculateTotal();
    
      const savedCart = await cart.save();
      console.log('Cart saved successfully:', savedCart._id);
      console.log('Cart items:', savedCart.items);

      res.json(savedCart);
    } catch (dbError) {
      console.log('Database not available for add to cart, using mock data:', dbError.message);
      
      // Fallback to in-memory cart
      if (!mockCarts.has(req.user._id)) {
        mockCarts.set(req.user._id, {
          _id: 'mock-cart-id',
          userId: req.user._id,
          items: [],
          totalAmount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      const mockCart = mockCarts.get(req.user._id);
      const mockMenuItem = mockMenuItems[menuItemId];
      
      if (!mockMenuItem) {
        return res.status(400).json({ message: 'Menu item not found' });
      }
      
      if (!mockMenuItem.availability) {
        return res.status(400).json({ message: 'Menu item not available' });
      }
      
      const existingItemIndex = mockCart.items.findIndex(
        item => item.menuItemId.toString() === menuItemId
      );
      
      if (existingItemIndex > -1) {
        mockCart.items[existingItemIndex].quantity += quantity;
      } else {
        mockCart.items.push({
          menuItemId: {
            _id: mockMenuItem._id,
            name: mockMenuItem.name,
            price: mockMenuItem.price,
            availability: mockMenuItem.availability,
            imageURL: mockMenuItem.imageURL
          },
          quantity,
          price: mockMenuItem.price
        });
      }
      
      // Calculate total
      mockCart.totalAmount = mockCart.items.reduce(
        (total, item) => total + (item.price * item.quantity), 
        0
      );
      mockCart.updatedAt = new Date();
      
      console.log('Mock cart updated:', mockCart);
      res.json(mockCart);
    }
  } catch (error) {
    console.error('Cart add error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update item quantity
router.put('/update', async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Try database first with timeout
    try {
      let cart = await Promise.race([
        Cart.findOne({ userId: req.user._id }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('DB timeout')), 3000)
        )
      ]);
      
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      const itemIndex = cart.items.findIndex(
        item => item.menuItemId.toString() === menuItemId
      );

      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }

      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      await cart.populate('items.menuItemId');

      res.json(cart);
    } catch (dbError) {
      console.log('Database not available for update cart, using mock data:', dbError.message);
      
      // Fallback to in-memory cart
      if (!mockCarts.has(req.user._id)) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      
      const mockCart = mockCarts.get(req.user._id);
      const itemIndex = mockCart.items.findIndex(
        item => item.menuItemId._id === menuItemId || item.menuItemId.toString() === menuItemId
      );
      
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
      
      mockCart.items[itemIndex].quantity = quantity;
      
      // Calculate total
      mockCart.totalAmount = mockCart.items.reduce(
        (total, item) => total + (item.price * item.quantity), 
        0
      );
      mockCart.updatedAt = new Date();
      
      console.log('Mock cart updated:', mockCart);
      res.json(mockCart);
    }
  } catch (error) {
    console.error('Cart update error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:menuItemId', async (req, res) => {
  try {
    // Try database first with timeout
    try {
      let cart = await Promise.race([
        Cart.findOne({ userId: req.user._id }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('DB timeout')), 3000)
        )
      ]);
      
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      cart.items = cart.items.filter(
        item => item.menuItemId.toString() !== req.params.menuItemId
      );

      await cart.save();
      await cart.populate('items.menuItemId');

      res.json(cart);
    } catch (dbError) {
      console.log('Database not available for remove cart, using mock data:', dbError.message);
      
      // Fallback to in-memory cart
      if (!mockCarts.has(req.user._id)) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      
      const mockCart = mockCarts.get(req.user._id);
      mockCart.items = mockCart.items.filter(
        item => (item.menuItemId._id !== req.params.menuItemId && item.menuItemId.toString() !== req.params.menuItemId)
      );
      
      // Calculate total
      mockCart.totalAmount = mockCart.items.reduce(
        (total, item) => total + (item.price * item.quantity), 
        0
      );
      mockCart.updatedAt = new Date();
      
      console.log('Mock cart item removed:', mockCart);
      res.json(mockCart);
    }
  } catch (error) {
    console.error('Cart remove error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear cart
router.delete('/clear', async (req, res) => {
  try {
    // Try database first with timeout
    try {
      let cart = await Promise.race([
        Cart.findOne({ userId: req.user._id }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('DB timeout')), 3000)
        )
      ]);
      
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      cart.items = [];
      await cart.save();

      res.json({ message: 'Cart cleared successfully' });
    } catch (dbError) {
      console.log('Database not available for clear cart, using mock data:', dbError.message);
      
      // Fallback to in-memory cart
      if (!mockCarts.has(req.user._id)) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      
      const mockCart = mockCarts.get(req.user._id);
      mockCart.items = [];
      mockCart.totalAmount = 0;
      mockCart.updatedAt = new Date();
      
      console.log('Mock cart cleared:', mockCart);
      res.json({ message: 'Cart cleared successfully' });
    }
  } catch (error) {
    console.error('Cart clear error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const Gallery = require('../models/Gallery');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// In-memory gallery storage for fallback
let mockGalleryItems = [];

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|webp/;
    const allowedExtensions = /\.(jpeg|jpg|png|gif|mp4|avi|mov|webp)$/i;
    
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  }
});

// Get all gallery items (public)
router.get('/', async (req, res) => {
  try {
    const { mediaType } = req.query;
    let filter = {};
    
    if (mediaType) filter.mediaType = mediaType;

    // Try to get from database first with shorter timeout
    try {
      const galleryItems = await Promise.race([
        Gallery.find(filter)
          .populate('uploadedBy', 'name')
          .sort({ createdAt: -1 }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('DB timeout')), 3000)
        )
      ]);
      return res.json(galleryItems);
    } catch (dbError) {
      // Fallback to only show uploaded items (no mock data)
      console.log('Database not available, using uploaded gallery items:', dbError.message);
      
      // Apply filters to uploaded items
      let filteredItems = mockGalleryItems;
      if (mediaType) {
        filteredItems = filteredItems.filter(item => item.mediaType === mediaType);
      }

      // Return only uploaded items
      res.json(filteredItems);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single gallery item (public)
router.get('/:id', async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id)
      .populate('uploadedBy', 'name');
    
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.json(galleryItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload gallery item (admin only)
router.post('/upload', adminAuth, upload.single('media'), async (req, res) => {
  try {
    console.log('Gallery upload request received');
    console.log('req.file:', req.file);
    console.log('req.body:', req.body);
    console.log('req.user:', req.user);
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description } = req.body;

    // Determine media type based on file mimetype
    const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';

    // Try database first with timeout
    try {
      console.log('Attempting to save to MongoDB...');
      const galleryItem = new Gallery({
        title,
        description,
        mediaURL: `/uploads/${req.file.filename}`,
        mediaType,
        uploadedBy: new mongoose.Types.ObjectId(req.user.id)
      });

      await galleryItem.save();
      await galleryItem.populate('uploadedBy', 'name');
      console.log('Saved to MongoDB successfully');

      res.status(201).json(galleryItem);
    } catch (dbError) {
      console.log('Database error:', dbError.message);
      console.log('Falling back to mock data');
      
      // Fallback to mock gallery upload
      const mockGalleryItem = {
        _id: `mock-gallery-${Date.now()}`,
        title,
        description,
        mediaURL: `/uploads/${req.file.filename}`,
        mediaType,
        uploadedBy: {
          _id: new mongoose.Types.ObjectId(req.user.id),
          name: req.user.name || 'Admin'
        },
        uploadDate: new Date()
      };
      
      // Add to mock gallery items array for persistence during session
      mockGalleryItems.push(mockGalleryItem);
      console.log('Saved mock gallery upload:', mockGalleryItem);
      console.log('Current mock gallery items:', mockGalleryItems.length);
      res.status(201).json(mockGalleryItem);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update gallery item (admin only)
router.put('/:id', adminAuth, upload.single('media'), async (req, res) => {
  try {
    const { title, description, mediaType } = req.body;

    const updateData = {
      title,
      description
    };

    // If a new file was uploaded, update the mediaURL and mediaType
    if (req.file) {
      updateData.mediaURL = `/uploads/${req.file.filename}`;
      updateData.mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    } else if (mediaType) {
      updateData.mediaType = mediaType;
    }

    const galleryItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'name');

    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json(galleryItem);
  } catch (error) {
    console.error('Error updating gallery:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete gallery item (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const galleryItem = await Gallery.findByIdAndDelete(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    // TODO: Delete actual file from filesystem
    // fs.unlinkSync(path.join('uploads', galleryItem.mediaURL.split('/').pop()));

    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Gallery = require('../models/Gallery');
const adminAuth = require('../middleware/adminAuth');
const { galleryStorage } = require('../config/cloudinary');

const router = express.Router();

let mockGalleryItems = [];

const upload = multer({
  storage: galleryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|webp/;
    const allowedExtensions = /\.(jpeg|jpg|png|gif|mp4|avi|mov|webp)$/i;

    const extname = allowedExtensions.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  },
});

router.get('/', async (req, res) => {
  try {
    const { mediaType } = req.query;
    let filter = {};

    if (mediaType) filter.mediaType = mediaType;

    try {
      const galleryItems = await Promise.race([
        Gallery.find(filter)
          .populate('uploadedBy', 'name')
          .sort({ createdAt: -1 }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('DB timeout')), 3000),
        ),
      ]);
      return res.json(galleryItems);
    } catch (dbError) {
      let filteredItems = mockGalleryItems;
      if (mediaType) {
        filteredItems = filteredItems.filter((item) => item.mediaType === mediaType);
      }
      res.json(filteredItems);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id).populate('uploadedBy', 'name');

    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json(galleryItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/upload', adminAuth, upload.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description } = req.body;
    const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    const mediaURL = req.file.path;

    try {
      let userId = req.user._id;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        userId = '000000000000000000000000';
      }

      const galleryItem = new Gallery({
        title,
        description,
        mediaURL,
        mediaType,
        uploadedBy: new mongoose.Types.ObjectId(userId),
      });

      await galleryItem.save();
      await galleryItem.populate('uploadedBy', 'name');

      res.status(201).json(galleryItem);
    } catch (dbError) {
      const mockGalleryItem = {
        _id: `mock-gallery-${Date.now()}`,
        title,
        description,
        mediaURL,
        mediaType,
        uploadedBy: {
          _id: new mongoose.Types.ObjectId(
            mongoose.Types.ObjectId.isValid(req.user._id) ? req.user._id : '000000000000000000000000',
          ),
          name: req.user.email || 'Admin',
        },
        uploadDate: new Date(),
      };

      mockGalleryItems.push(mockGalleryItem);
      res.status(201).json(mockGalleryItem);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
  }
});

router.put('/:id', adminAuth, upload.single('media'), async (req, res) => {
  try {
    const { title, description, mediaType } = req.body;

    const updateData = {
      title,
      description,
    };

    if (req.file) {
      updateData.mediaURL = req.file.path;
      updateData.mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    } else if (mediaType) {
      updateData.mediaType = mediaType;
    }

    const galleryItem = await Gallery.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('uploadedBy', 'name');

    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json(galleryItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const galleryItem = await Gallery.findByIdAndDelete(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

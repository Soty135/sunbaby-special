const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Missing Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const menuStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sunbaby/menu',
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
  },
});

const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sunbaby/gallery',
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'mp4', 'avi', 'mov', 'webp'],
    resource_type: 'auto',
  },
});

module.exports = { cloudinary, menuStorage, galleryStorage };

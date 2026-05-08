const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MenuItem = require('../models/MenuItem');
const Gallery = require('../models/Gallery');

const isBase64 = (str) => str && str.startsWith('data:');

const uploadBase64ToCloudinary = async (dataUri, folder) => {
  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: 'auto',
    });
    return result.secure_url;
  } catch (err) {
    console.error('  Upload failed:', err.message);
    return null;
  }
};

const migrateMenuItems = async () => {
  const items = await MenuItem.find({});
  let migrated = 0;

  for (const item of items) {
    if (isBase64(item.imageURL)) {
      console.log(`Menu "${item.name}" (${item._id}) — uploading image...`);
      const url = await uploadBase64ToCloudinary(item.imageURL, 'sunbaby/menu');
      if (url) {
        item.imageURL = url;
        await item.save();
        migrated++;
        console.log(`  ✓ ${url}`);
      }
    }
  }

  return migrated;
};

const migrateGallery = async () => {
  const items = await Gallery.find({});
  let migrated = 0;

  for (const item of items) {
    if (isBase64(item.mediaURL)) {
      console.log(`Gallery "${item.title}" (${item._id}) — uploading media...`);
      const url = await uploadBase64ToCloudinary(item.mediaURL, 'sunbaby/gallery');
      if (url) {
        item.mediaURL = url;
        await item.save();
        migrated++;
        console.log(`  ✓ ${url}`);
      }
    }
  }

  return migrated;
};

const run = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.\n');

    console.log('--- Migrating Menu Items ---');
    const menuCount = await migrateMenuItems();

    console.log('\n--- Migrating Gallery Items ---');
    const galleryCount = await migrateGallery();

    console.log('\n--- Migration Complete ---');
    console.log(`Menu items migrated: ${menuCount}`);
    console.log(`Gallery items migrated: ${galleryCount}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

run();

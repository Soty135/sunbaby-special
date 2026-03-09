const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  availability: {
    type: Boolean,
    default: true
  },
  imageURL: {
    type: String,
    default: ''
  },
  preparationTime: {
    type: Number,
    min: [1, 'Preparation time must be at least 1 minute'],
    max: [120, 'Preparation time cannot exceed 120 minutes']
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  allergens: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
menuItemSchema.index({ name: 1 });
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ availability: 1 });
menuItemSchema.index({ price: 1 });

// Virtual for formatted price
menuItemSchema.virtual('priceFormatted').get(function() {
  return `$${this.price.toFixed(2)}`;
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
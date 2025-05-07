const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  targetUrl: {
    type: String
  },
  type: {
    type: String,
    enum: ['merchant', 'user', 'common'],
    default: 'common'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Banner', BannerSchema); 
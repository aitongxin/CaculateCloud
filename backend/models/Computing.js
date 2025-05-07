const mongoose = require('mongoose');

const ComputingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  specs: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: '小时'
  },
  type: {
    type: String,
    enum: ['AI算力', '渲染算力', '普通算力'],
    default: 'AI算力'
  },
  imageUrl: {
    type: String
  },
  description: {
    type: String
  },
  available: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Computing', ComputingSchema); 
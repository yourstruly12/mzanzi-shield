const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'moderate', 'high', 'critical'],
    required: true
  },
  type: {
    type: String,
    enum: ['fire', 'flood', 'earthquake', 'storm', 'other'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  affectedAreas: [String],
  peopleAtRisk: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'monitoring'],
    default: 'active'
  },
  aiConfidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  predictedImpact: {
    type: String,
    enum: ['minimal', 'moderate', 'severe', 'extreme']
  },
  responseTime: {
    type: Number // in minutes
  },
  source: {
    type: String,
    enum: ['sensor', 'ai_prediction', 'user_report', 'external'],
    default: 'sensor'
  }
}, {
  timestamps: true
});

// Index for efficient queries
alertSchema.index({ status: 1, severity: -1, createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);
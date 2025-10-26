const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['temperature', 'humidity', 'wind', 'air_quality', 'seismic', 'water_level', 'fire_hazard'],
    required: true
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    region: { type: String, required: true }
  },
  currentValue: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['normal', 'warning', 'critical'],
    default: 'normal'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  aiPrediction: {
    riskLevel: Number,
    confidence: Number,
    trend: {
      type: String,
      enum: ['increasing', 'decreasing', 'stable']
    },
    lastPrediction: Date
  }
}, {
  timestamps: true
});

// Update status based on value and threshold
sensorSchema.methods.updateStatus = function() {
  if (this.currentValue > this.threshold * 1.2) {
    this.status = 'critical';
  } else if (this.currentValue > this.threshold) {
    this.status = 'warning';
  } else {
    this.status = 'normal';
  }
};

module.exports = mongoose.model('Sensor', sensorSchema);
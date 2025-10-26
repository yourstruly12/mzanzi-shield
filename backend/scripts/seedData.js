const mongoose = require('mongoose');
const Sensor = require('../models/Sensor');
require('dotenv').config();

const seedSensors = [
  {
    name: 'Fire Hazard - Umgeni Park',
    type: 'fire_hazard',
    location: {
      latitude: -29.84,
      longitude: 31.02,
      region: 'durban'
    },
    currentValue: 7.2,
    unit: 'index',
    threshold: 5,
    status: 'warning'
  },
  {
    name: 'Flood Monitor - Morningside',
    type: 'water_level', 
    location: {
      latitude: -29.86,
      longitude: 31.01,
      region: 'durban'
    },
    currentValue: 2.8,
    unit: 'm',
    threshold: 2.5,
    status: 'critical'
  },
  // Add more sensors...
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Sensor.deleteMany({});
    
    // Insert new data
    await Sensor.insertMany(seedSensors);
    console.log('Demo data seeded successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
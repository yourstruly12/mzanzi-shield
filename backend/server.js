const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Climate Resilience & Food Security Backend is running',
    timestamp: new Date().toISOString(),
    initiative: 'FNB Climate Resilience Program',
    version: '2.0.0'
  });
});

// Enhanced mock data with Food Security integration
const mockSensors = [
  {
    id: 1,
    name: 'Fire Hazard Sensor',
    type: 'fire_hazard',
    location: { latitude: -29.84, longitude: 31.02, region: 'durban' },
    currentValue: 7.2,
    unit: 'index',
    threshold: 5,
    status: 'warning',
    icon: 'fire',
    uptime: '98.7%',
    accuracy: '92%',
    lastCalibration: '2023-05-15',
    prediction: { trend: 'increasing', confidence: 0.85 },
    lastUpdated: new Date(),
    // ADD: Food Security Fields
    foodImpact: 'Crop lands at risk',
    affectedSupplies: ['Maize stocks', 'Vegetable farms'],
    resilienceImpact: 'High',
    foodSecurityRisk: '320 tons at risk'
  },
  {
    id: 2,
    name: 'Flood Monitoring',
    type: 'water_level',
    location: { latitude: -29.86, longitude: 31.01, region: 'durban' },
    currentValue: 2.8,
    unit: 'm',
    threshold: 2.5,
    status: 'critical',
    icon: 'water',
    uptime: '95.2%',
    accuracy: '88%',
    lastCalibration: '2023-05-10',
    prediction: { trend: 'stable', confidence: 0.72 },
    lastUpdated: new Date(),
    // ADD: Food Security Fields
    foodImpact: 'Supply routes disrupted',
    affectedSupplies: ['Transport routes', 'Storage facilities'],
    resilienceImpact: 'Critical',
    foodSecurityRisk: '3 supply routes affected'
  },
  {
    id: 3,
    name: 'Weather Station',
    type: 'weather',
    location: { latitude: -29.85, longitude: 31.03, region: 'durban' },
    currentValue: 28,
    unit: '°C',
    threshold: 35,
    status: 'normal',
    icon: 'cloud-sun',
    uptime: '99.1%',
    accuracy: '95%',
    lastCalibration: '2023-05-18',
    prediction: { trend: 'decreasing', confidence: 0.68 },
    lastUpdated: new Date(),
    // ADD: Food Security Fields
    foodImpact: 'Optimal growing conditions',
    affectedSupplies: ['All crops'],
    resilienceImpact: 'Low',
    foodSecurityRisk: 'Stable production'
  },
  {
    id: 4,
    name: 'Air Quality',
    type: 'air_quality',
    location: { latitude: -29.855, longitude: 31.015, region: 'durban' },
    currentValue: 65,
    unit: 'AQI',
    threshold: 100,
    status: 'normal',
    icon: 'wind',
    uptime: '97.5%',
    accuracy: '90%',
    lastCalibration: '2023-05-12',
    prediction: { trend: 'increasing', confidence: 0.79 },
    lastUpdated: new Date(),
    // ADD: Food Security Fields
    foodImpact: 'Good for crop health',
    affectedSupplies: ['Fresh produce'],
    resilienceImpact: 'Low',
    foodSecurityRisk: 'Minimal impact'
  }
];

const foodSecurityData = {
  totalInventory: '2,450 tons',
  atRiskSupplies: '320 tons',
  vulnerablePopulation: '45,000',
  supplyChainStatus: '85%',
  operationalRoutes: '12/15',
  foodPriceIndex: '125.6',
  distribution: [
    { category: 'Grains', amount: '850 tons', risk: 'Low' },
    { category: 'Vegetables', amount: '420 tons', risk: 'Medium' },
    { category: 'Fruits', amount: '380 tons', risk: 'High' },
    { category: 'Protein', amount: '280 tons', risk: 'Low' },
    { category: 'Dairy', amount: '320 tons', risk: 'Medium' },
    { category: 'Emergency Reserve', amount: '200 tons', risk: 'None' }
  ]
};

const vulnerableCommunities = [
  {
    id: 1,
    name: 'KwaMashu Township',
    population: 15000,
    foodSecurityIndex: 'Low',
    climateRisk: 'High',
    mainCrops: ['Maize', 'Vegetables'],
    supportNeeded: ['Food parcels', 'Seeds', 'Irrigation'],
    resilienceScore: 45
  },
  {
    id: 2,
    name: 'Inanda Rural Area',
    population: 12000,
    foodSecurityIndex: 'Medium',
    climateRisk: 'Moderate',
    mainCrops: ['Maize', 'Beans', 'Fruits'],
    supportNeeded: ['Storage facilities', 'Transport'],
    resilienceScore: 60
  },
  {
    id: 3,
    name: 'Umlazi Coastal',
    population: 18000,
    foodSecurityIndex: 'Medium',
    climateRisk: 'High',
    mainCrops: ['Fishing', 'Vegetables'],
    supportNeeded: ['Fishery support', 'Coastal protection'],
    resilienceScore: 55
  }
];

// Enhanced API endpoints
app.get('/api/sensors', (req, res) => {
  res.json(mockSensors);
});

app.get('/api/alerts', (req, res) => {
  const alerts = [
    {
      id: 1,
      title: 'Wildfire Alert - Crop Lands at Risk',
      description: 'Wildfire near Umgeni Park threatening 320 tons of food supplies',
      severity: 'high',
      status: 'active',
      location: 'Umgeni Park, Durban',
      timestamp: new Date(),
      // ADD: Food Security Impact
      foodImpact: {
        suppliesAtRisk: '320 tons',
        affectedCrops: ['Maize', 'Vegetables'],
        communitiesAffected: ['KwaMashu']
      },
      type: 'integrated'
    },
    {
      id: 2,
      title: 'Flood Warning - Supply Chain Disruption',
      description: 'Heavy rains causing flooding, disrupting 3 supply routes',
      severity: 'moderate',
      status: 'monitoring',
      location: 'Morningside, Durban',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      foodImpact: {
        routesDisrupted: 3,
        deliveryDelays: '4-6 hours',
        affectedAreas: ['Inanda', 'Umlazi']
      },
      type: 'integrated'
    }
  ];
  res.json(alerts);
});

// NEW: Food Security endpoints
app.get('/api/food-security', (req, res) => {
  res.json(foodSecurityData);
});

app.get('/api/food-security/communities', (req, res) => {
  res.json(vulnerableCommunities);
});

app.get('/api/food-security/supply-chain', (req, res) => {
  const supplyChain = {
    operationalRoutes: 12,
    disruptedRoutes: 3,
    totalRoutes: 15,
    averageDeliveryTime: '4.2 hours',
    routes: [
      {
        id: 1,
        name: 'Durban Central → KwaMashu',
        status: 'operational',
        lastDelivery: new Date(Date.now() - 2 * 60 * 60 * 1000),
        nextDelivery: new Date(Date.now() + 4 * 60 * 60 * 1000),
        communitiesServed: ['KwaMashu']
      },
      {
        id: 2,
        name: 'Johannesburg → Inanda',
        status: 'delayed',
        lastDelivery: new Date(Date.now() - 8 * 60 * 60 * 1000),
        delayReason: 'Flooded roads',
        communitiesServed: ['Inanda']
      }
    ]
  };
  res.json(supplyChain);
});

// NEW: Analytics data endpoint
app.get('/api/analytics/food-predictions', (req, res) => {
  const predictions = {
    cropYield: {
      current: '85% of target',
      prediction: '72% in 3 months',
      confidence: 78,
      trend: 'down',
      trigger: 'Drought conditions'
    },
    foodPrices: {
      current: '125.6 index',
      prediction: '144.3 in 2 months',
      confidence: 72,
      trend: 'up',
      trigger: 'Supply chain disruptions'
    },
    supplyChain: {
      current: '85% operational',
      prediction: '78% in 1 month',
      confidence: 68,
      trend: 'down',
      trigger: 'Weather-related closures'
    }
  };
  res.json(predictions);
});

// Socket.io for real-time updates with Food Security integration
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Join region-specific room
  socket.on('joinRegion', (region) => {
    socket.join(region);
    console.log(`Client ${socket.id} joined region: ${region}`);
  });
  
  // Handle sensor data updates
  socket.on('sensorData', (data) => {
    console.log('Received sensor data:', data);
    // Broadcast to all clients in the region
    io.to(data.region).emit('sensorUpdate', data);
  });

  // Enhanced real-time updates with Food Security data
  const interval = setInterval(() => {
    // Simulate sensor updates
    mockSensors.forEach(sensor => {
      const fluctuation = (Math.random() - 0.5) * 2;
      const newValue = Math.max(0, sensor.currentValue + fluctuation);
      
      const update = {
        id: sensor.id,
        currentValue: parseFloat(newValue.toFixed(1)),
        status: newValue > sensor.threshold ? 'warning' : 'normal',
        lastUpdated: new Date(),
        // Include food security context
        foodImpact: sensor.foodImpact,
        foodSecurityRisk: sensor.foodSecurityRisk
      };

      // Emit update to all clients in the region
      socket.to('durban').emit('sensorUpdate', update);
    });

    // Simulate food security updates (less frequently)
    if (Math.random() > 0.8) {
      const foodUpdate = {
        type: 'foodSecurityUpdate',
        atRiskSupplies: `${300 + Math.floor(Math.random() * 50)} tons`,
        supplyChainStatus: `${80 + Math.floor(Math.random() * 10)}%`,
        timestamp: new Date(),
        message: 'Food security metrics updated'
      };
      socket.to('durban').emit('foodSecurityUpdate', foodUpdate);
    }

    // Simulate community resilience updates
    if (Math.random() > 0.9) {
      const communityUpdate = {
        type: 'communityUpdate',
        communityId: Math.floor(Math.random() * 3) + 1,
        resilienceScore: 40 + Math.floor(Math.random() * 30),
        timestamp: new Date()
      };
      socket.to('durban').emit('communityUpdate', communityUpdate);
    }

  }, 8000); // Update every 8 seconds

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    clearInterval(interval);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Climate Resilience & Food Security Backend running on port ${PORT}`);
  console.log(`🌱 FNB Initiative: Integrated Disaster Management & Food Security`);
  console.log(`📊 API Endpoints:`);
  console.log(`   → Health: http://localhost:${PORT}/api/health`);
  console.log(`   → Sensors: http://localhost:${PORT}/api/sensors`);
  console.log(`   → Food Security: http://localhost:${PORT}/api/food-security`);
  console.log(`   → Communities: http://localhost:${PORT}/api/food-security/communities`);
  console.log(`   → Analytics: http://localhost:${PORT}/api/analytics/food-predictions`);
  console.log(`📡 Socket.io server ready for real-time climate & food security updates`);
});
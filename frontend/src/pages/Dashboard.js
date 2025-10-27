import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Alert,
  IconButton,
  Card,
  CardContent,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckIcon,
  Agriculture,
  LocalGroceryStore,
  Storage,
  People,
  // Remove Emergency import and use WarningIcon instead
} from '@mui/icons-material';
import { useSocket } from '../context/SocketContext';
import SensorGrid from '../components/SensorGrid';
import RiskMap from '../components/RiskMap';
import StatsOverview from '../components/StatsOverview';
import AIInsights from '../components/AIInsights';

const Dashboard = () => {
  const { socket, isConnected } = useSocket();
  const [sensors, setSensors] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [stats, setStats] = useState({
    highRiskAreas: 5,
    disastersPredicted: 3,
    peopleAtRisk: 1250,
    responseTime: 28,
  });
  const [foodMetrics, setFoodMetrics] = useState({});
  const [integratedAlerts, setIntegratedAlerts] = useState([]);

  useEffect(() => {
    if (socket && isConnected) {
      socket.emit('joinRegion', 'durban');

      socket.on('sensorUpdate', (data) => {
        setSensors(prevSensors => {
          const existingIndex = prevSensors.findIndex(s => s.id === data.id);
          if (existingIndex >= 0) {
            const updated = [...prevSensors];
            updated[existingIndex] = { ...updated[existingIndex], ...data };
            return updated;
          }
          return [...prevSensors, data];
        });
        setLastUpdated(new Date());
      });

      loadInitialData();
    }

    return () => {
      if (socket) {
        socket.off('sensorUpdate');
      }
    };
  }, [socket, isConnected]);

  const loadInitialData = () => {
    const initialSensors = [
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
        // ADD FOOD SECURITY FIELDS:
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
        // ADD FOOD SECURITY FIELDS:
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
        // ADD FOOD SECURITY FIELDS:
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
        // ADD FOOD SECURITY FIELDS:
        foodImpact: 'Good for crop health',
        affectedSupplies: ['Fresh produce'],
        resilienceImpact: 'Low',
        foodSecurityRisk: 'Minimal impact'
      },
    ];

    setSensors(initialSensors);

    const mockAlerts = [{
      id: 1,
      title: 'Moderate fire risk detected in northern areas',
      severity: 'moderate'
    }];
    setAlerts(mockAlerts);

    // ADD Food Security Data
    setFoodMetrics({
      totalInventory: '2,450 tons',
      atRiskSupplies: '320 tons',
      vulnerablePopulation: '45,000',
      supplyChainStatus: '85%',
      operationalRoutes: '12/15',
      foodPriceIndex: '125.6'
    });

    // ADD Integrated Alerts
    setIntegratedAlerts([
      {
        id: 2,
        type: 'integrated',
        title: 'Flood Alert - Food Supply Impact',
        severity: 'high',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        impact: {
          foodSupplies: '320 tons at risk',
          supplyChains: '3 routes disrupted',
          vulnerableAreas: ['KwaMashu', 'Inanda']
        },
        actions: [
          'Activate emergency food reserves',
          'Redirect supply routes',
          'Deploy community support'
        ]
      },
      {
        id: 3,
        type: 'food',
        title: 'Crop Yield Prediction - 40% Reduction Expected',
        severity: 'moderate',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        impact: {
          timeline: 'Next 3 months',
          affectedCrops: ['Maize', 'Vegetables'],
          regions: ['Northern Farmlands']
        },
        actions: [
          'Import grain reserves',
          'Support alternative crops',
          'Price stabilization measures'
        ]
      }
    ]);
  };

  const handleRefresh = () => {
    setLastUpdated(new Date());
    loadInitialData();
  };

  // ADD Food Security Overview Component
  const FoodSecurityOverview = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ background: 'linear-gradient(135deg, #1976d2, #42a5f5)' }}>
          <CardContent sx={{ textAlign: 'center', color: 'white' }}>
            <Storage sx={{ fontSize: 30, mb: 1 }} />
            <Typography variant="h6" component="div" fontWeight="bold">
              {foodMetrics.totalInventory}
            </Typography>
            <Typography variant="body2">
              Food Inventory
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ background: 'linear-gradient(135deg, #ed6c02, #ff9800)' }}>
          <CardContent sx={{ textAlign: 'center', color: 'white' }}>
            <WarningIcon sx={{ fontSize: 30, mb: 1 }} />
            <Typography variant="h6" component="div" fontWeight="bold">
              {foodMetrics.atRiskSupplies}
            </Typography>
            <Typography variant="body2">
              Supplies at Risk
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ background: 'linear-gradient(135deg, #0288d1, #03a9f4)' }}>
          <CardContent sx={{ textAlign: 'center', color: 'white' }}>
            <People sx={{ fontSize: 30, mb: 1 }} />
            <Typography variant="h6" component="div" fontWeight="bold">
              {foodMetrics.vulnerablePopulation}
            </Typography>
            <Typography variant="body2">
              Vulnerable People
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ background: 'linear-gradient(135deg, #388e3c, #4caf50)' }}>
          <CardContent sx={{ textAlign: 'center', color: 'white' }}>
            <LocalGroceryStore sx={{ fontSize: 30, mb: 1 }} />
            <Typography variant="h6" component="div" fontWeight="bold">
              {foodMetrics.supplyChainStatus}
            </Typography>
            <Typography variant="body2">
              Supply Chain Operational
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ background: 'linear-gradient(135deg, #7b1fa2, #9c27b0)' }}>
          <CardContent sx={{ textAlign: 'center', color: 'white' }}>
            <Agriculture sx={{ fontSize: 30, mb: 1 }} />
            <Typography variant="h6" component="div" fontWeight="bold">
              {foodMetrics.foodPriceIndex}
            </Typography>
            <Typography variant="body2">
              Food Price Index
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // ADD Community Resilience Component
  const CommunityResilience = () => (
    <Paper sx={{ p: 2, mb: 3, background: 'linear-gradient(135deg, #f5f5f5, #e8f5e8)' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <People sx={{ mr: 1, color: 'primary.main' }} />
        Community Resilience Scoring
      </Typography>
      <Grid container spacing={2}>
        {[
          { name: 'KwaMashu Township', score: 45, risk: 'High', population: '15,000' },
          { name: 'Inanda Rural Area', score: 60, risk: 'Moderate', population: '12,000' },
          { name: 'Umlazi Coastal', score: 55, risk: 'High', population: '18,000' }
        ].map((community, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {community.name}
                </Typography>
                <Chip 
                  label={`${community.score}/100`}
                  size="small"
                  color={community.score > 70 ? 'success' : community.score > 50 ? 'warning' : 'error'}
                />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={community.score}
                sx={{ 
                  mb: 1, 
                  height: 6, 
                  borderRadius: 3,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: community.score > 70 ? '#4caf50' : community.score > 50 ? '#ff9800' : '#f44336'
                  }
                }}
              />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="caption" color="textSecondary">
                  {community.population}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Risk: {community.risk}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            <Agriculture sx={{ mr: 2, verticalAlign: 'bottom' }} />
          Mzanzi Shield
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Integrated disaster management and food security monitoring for South African communities
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            icon={isConnected ? <CheckIcon /> : <ErrorIcon />}
            label={isConnected ? 'Connected to Server' : 'Disconnected'}
            color={isConnected ? 'success' : 'error'}
            variant="outlined"
          />
          <Chip
            icon={<RefreshIcon />}
            label={`Last updated: ${lastUpdated.toLocaleTimeString()}`}
            variant="outlined"
            onClick={handleRefresh}
            clickable
          />
        </Box>
      </Box>

      {/* Integrated Alert Banner */}
      {integratedAlerts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
            Climate & Food Security Integrated Alerts
          </Typography>
          {integratedAlerts.map(alert => (
            <Alert 
              key={alert.id}
              severity={alert.severity === 'high' ? 'error' : 'warning'}
              sx={{ mb: 1 }}
              icon={alert.severity === 'high' ? <WarningIcon /> : <WarningIcon />}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {alert.title}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {alert.impact.foodSupplies && `• ${alert.impact.foodSupplies}`}
                  {alert.impact.supplyChains && `• ${alert.impact.supplyChains}`}
                  {alert.impact.timeline && `• Timeline: ${alert.impact.timeline}`}
                </Typography>
                {alert.actions && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      Recommended Actions:
                    </Typography>
                    <ul style={{ margin: '2px 0', paddingLeft: '20px' }}>
                      {alert.actions.map((action, index) => (
                        <li key={index} style={{ fontSize: '0.875rem' }}>{action}</li>
                      ))}
                    </ul>
                  </Box>
                )}
              </Box>
            </Alert>
          ))}
        </Box>
      )}

      {/* Original Alert Banner */}
      {alerts.length > 0 && (
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 3,
            background: 'linear-gradient(135deg, #fd7e14, #e36209)',
            color: 'white',
            fontWeight: 'bold',
            '& .MuiAlert-icon': { color: 'white' }
          }}
          icon={<WarningIcon />}
        >
          {alerts[0].title}
        </Alert>
      )}

      {/* Food Security Overview */}
      <FoodSecurityOverview />

      {/* Community Resilience */}
      <CommunityResilience />

      {/* AI Insights */}
      <AIInsights />

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      <Grid container spacing={3}>
        {/* Enhanced Sensor Network with Food Security */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                <i className="fas fa-sensor" style={{ marginRight: '8px' }}></i>
                Sensor Network with Food Security Impact
              </Typography>
              <IconButton size="small" onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Box>
            <SensorGrid sensors={sensors} />
            
            {/* Food Security Summary */}
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalGroceryStore sx={{ mr: 1, fontSize: 18 }} />
                Food Security Summary
              </Typography>
              <Grid container spacing={1}>
                {sensors.filter(s => s.foodSecurityRisk && s.foodSecurityRisk !== 'Minimal impact').map(sensor => (
                  <Grid item xs={12} key={sensor.id}>
                    <Alert severity="warning" sx={{ py: 0.5 }}>
                      <Typography variant="caption">
                        <strong>{sensor.name}:</strong> {sensor.foodSecurityRisk}
                      </Typography>
                    </Alert>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Risk Map */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: '500px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                <i className="fas fa-map-marked-alt" style={{ marginRight: '8px' }}></i>
                Geographic View
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label="Fire Risk" variant="outlined" color="error" size="small" />
                <Chip label="Flood Risk" variant="outlined" color="primary" size="small" />
                <Chip label="Wind Risk" variant="outlined" color="warning" size="small" />
                <Chip 
                  label="Food Security" 
                  variant="outlined" 
                  sx={{ color: '#388e3c', borderColor: '#388e3c' }} 
                  size="small" 
                />
              </Box>
            </Box>
            <RiskMap sensors={sensors} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
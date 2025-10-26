import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Box,
  LinearProgress,
  Chip,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import { 
  SmartToy as AiIcon, 
  TrendingUp, 
  LocationOn, 
  Agriculture,
  LocalGroceryStore,
  Warning,
  Timeline,
  Analytics
} from '@mui/icons-material';
import { useSocket } from '../context/SocketContext';

const Predictions = () => {
  const { socket, isConnected } = useSocket();
  const [activeTab, setActiveTab] = useState(0);
  const [predictions, setPredictions] = useState({
    climate: [],
    foodSecurity: [],
    integrated: []
  });

  // Enhanced predictions data with Climate Resilience & Food Security focus
  const climatePredictions = [
    { 
      type: 'Wildfire', 
      probability: 68, 
      location: 'Northern Farmlands', 
      confidence: 'High',
      timeframe: 'Next 48 hours',
      trigger: 'High temperatures + dry conditions',
      impact: 'Crop lands at risk',
      foodSecurityRisk: '320 tons of crops threatened',
      trend: 'increasing',
      recommendations: ['Activate irrigation systems', 'Prepare firebreaks', 'Monitor crop storage']
    },
    { 
      type: 'Flood', 
      probability: 45, 
      location: 'Coastal Agricultural Areas', 
      confidence: 'Medium',
      timeframe: 'Next 72 hours',
      trigger: 'Heavy rainfall + high tides',
      impact: 'Supply route disruptions',
      foodSecurityRisk: '3 distribution routes potentially affected',
      trend: 'stable',
      recommendations: ['Secure storage facilities', 'Prepare alternative routes', 'Stock emergency supplies']
    },
    { 
      type: 'Severe Storm', 
      probability: 30, 
      location: 'Eastern Farming Districts', 
      confidence: 'Low',
      timeframe: 'Next 24 hours',
      trigger: 'Developing weather system',
      impact: 'Crop damage potential',
      foodSecurityRisk: 'Limited impact expected',
      trend: 'decreasing',
      recommendations: ['Secure loose objects', 'Monitor weather updates', 'Prepare for power outages']
    },
  ];

  const foodSecurityPredictions = [
    {
      type: 'Crop Yield Reduction',
      probability: 72,
      location: 'Maize Production Areas',
      confidence: 'High',
      timeframe: 'Next 3 months',
      trigger: 'Drought conditions persisting',
      impact: '40% yield reduction expected',
      economicImpact: 'Price increase 15-20%',
      trend: 'increasing',
      recommendations: ['Activate grain reserves', 'Support alternative crops', 'Import planning']
    },
    {
      type: 'Supply Chain Disruption',
      probability: 58,
      location: 'Northern Distribution Corridor',
      confidence: 'Medium',
      timeframe: 'Next 2 weeks',
      trigger: 'Infrastructure maintenance + weather',
      impact: 'Delivery delays up to 48 hours',
      economicImpact: 'Temporary price fluctuations',
      trend: 'stable',
      recommendations: ['Activate backup routes', 'Coordinate with logistics partners', 'Community communication']
    },
    {
      type: 'Food Price Spike',
      probability: 65,
      location: 'Urban Centers',
      confidence: 'High',
      timeframe: 'Next month',
      trigger: 'Supply constraints + increased demand',
      impact: 'Affordability concerns for vulnerable groups',
      economicImpact: 'Price index increase 12-18%',
      trend: 'increasing',
      recommendations: ['Price stabilization measures', 'Targeted subsidies', 'Market monitoring']
    }
  ];

  const integratedPredictions = [
    {
      type: 'Compound Risk: Flood + Supply Chain',
      probability: 52,
      location: 'Coastal Distribution Network',
      confidence: 'Medium',
      timeframe: 'Next 5 days',
      climateTrigger: 'Heavy rainfall forecast',
      foodTrigger: 'Critical supply routes in flood-prone areas',
      combinedImpact: 'Simultaneous production and distribution disruption',
      resilienceScore: 45,
      recommendations: [
        'Pre-position emergency supplies',
        'Activate flood protection for storage',
        'Coordinate multi-agency response'
      ]
    },
    {
      type: 'Heatwave + Crop Stress',
      probability: 61,
      location: 'Central Agricultural Zone',
      confidence: 'High',
      timeframe: 'Next week',
      climateTrigger: 'Extended heatwave forecast',
      foodTrigger: 'Critical growth stage for key crops',
      combinedImpact: 'Accelerated crop maturation + reduced yields',
      resilienceScore: 38,
      recommendations: [
        'Emergency irrigation activation',
        'Harvest schedule adjustment',
        'Heat stress management for livestock'
      ]
    }
  ];

  useEffect(() => {
    // Load prediction data
    setPredictions({
      climate: climatePredictions,
      foodSecurity: foodSecurityPredictions,
      integrated: integratedPredictions
    });

    // Listen for real-time prediction updates
    if (socket) {
      socket.on('predictionUpdate', (data) => {
        console.log('Received prediction update:', data);
        // Update predictions based on type
      });
    }

    return () => {
      if (socket) {
        socket.off('predictionUpdate');
      }
    };
  }, [socket]);

  const getConfidenceColor = (confidence) => {
    switch (confidence.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      default: return 'info';
    }
  };

  const getTrendIcon = (trend) => {
    return <TrendingUp sx={{ 
      color: trend === 'increasing' ? 'error.main' : 
             trend === 'decreasing' ? 'success.main' : 'warning.main',
      transform: trend === 'decreasing' ? 'rotate(180deg)' : 'none'
    }} />;
  };

  const PredictionCard = ({ prediction, category }) => (
    <Card sx={{ 
      height: '100%',
      borderLeft: `4px solid ${
        prediction.confidence === 'High' ? '#f44336' :
        prediction.confidence === 'Medium' ? '#ff9800' : '#2196f3'
      }`
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {category === 'foodSecurity' ? <Agriculture /> : 
             category === 'integrated' ? <Warning /> : <Warning />}
            {prediction.type}
          </Typography>
          <Chip 
            label={prediction.confidence} 
            color={getConfidenceColor(prediction.confidence)}
            size="small"
          />
        </Box>
        
        <Box display="flex" alignItems="center" mb={1}>
          <LocationOn sx={{ mr: 1, fontSize: 16 }} />
          <Typography variant="body2">{prediction.location}</Typography>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="body2">Timeframe:</Typography>
          <Typography variant="body2" fontWeight="bold">{prediction.timeframe}</Typography>
        </Box>

        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Probability</Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              {getTrendIcon(prediction.trend)}
              <Typography variant="body2" fontWeight="bold">
                {prediction.probability}%
              </Typography>
            </Box>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={prediction.probability} 
            color={getConfidenceColor(prediction.confidence)}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {/* Enhanced Impact Information */}
        <Alert severity="info" sx={{ mb: 2, fontSize: '0.8rem' }}>
          <Typography variant="subtitle2" gutterBottom>
            🎯 Primary Impact:
          </Typography>
          <Typography variant="body2">
            {prediction.impact}
          </Typography>
          {prediction.foodSecurityRisk && (
            <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 'bold' }}>
              🍲 Food Security: {prediction.foodSecurityRisk}
            </Typography>
          )}
          {prediction.economicImpact && (
            <Typography variant="body2" sx={{ mt: 0.5, color: 'warning.main' }}>
              💰 Economic: {prediction.economicImpact}
            </Typography>
          )}
        </Alert>

        {/* Trigger Information */}
        <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
          🚨 Trigger: {prediction.trigger}
        </Typography>

        {/* Recommendations */}
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" fontWeight="bold" display="block" gutterBottom>
            🛡️ Recommended Actions:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {prediction.recommendations.slice(0, 2).map((rec, idx) => (
              <Chip
                key={idx}
                label={rec}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const TabPanel = ({ children, value, index, ...other }) => (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Enhanced Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          <AiIcon sx={{ mr: 2, verticalAlign: 'bottom' }} />
          AI Predictive Analytics
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Advanced machine learning for Climate Resilience & Food Security risk forecasting
        </Typography>
        
        {/* Connection Status */}
        <Alert 
          severity={isConnected ? "success" : "warning"} 
          sx={{ mt: 2 }}
          icon={isConnected ? <Analytics /> : <Warning />}
        >
          {isConnected ? 
            "✅ Connected to AI prediction engine - Receiving real-time updates" :
            "⚠️ Using cached predictions - Connect to backend for live data"
          }
        </Alert>
      </Box>

      {/* Enhanced Tabs for different prediction types */}
      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
        >
          <Tab 
            icon={<Warning />} 
            label="Climate Risks" 
            iconPosition="start"
          />
          <Tab 
            icon={<Agriculture />} 
            label="Food Security" 
            iconPosition="start"
          />
          <Tab 
            icon={<Warning />}
            label="Integrated Risks" 
            iconPosition="start"
          />
          <Tab 
            icon={<Timeline />} 
            label="Analytics" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Climate Risks Tab */}
      <TabPanel value={activeTab} index={0}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="warning" />
          Climate Risk Predictions
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          AI-powered forecasts for natural disasters and extreme weather events
        </Typography>
        
        <Grid container spacing={3}>
          {predictions.climate.map((prediction, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <PredictionCard prediction={prediction} category="climate" />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Food Security Tab */}
      <TabPanel value={activeTab} index={1}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Agriculture color="success" />
          Food Security Predictions
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Supply chain, pricing, and production forecasts for food system resilience
        </Typography>
        
        <Grid container spacing={3}>
          {predictions.foodSecurity.map((prediction, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <PredictionCard prediction={prediction} category="foodSecurity" />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Integrated Risks Tab */}
      <TabPanel value={activeTab} index={2}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="error" />
          Integrated Risk Predictions
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Compound risk analysis combining climate and food security threats
        </Typography>
        
        <Grid container spacing={3}>
          {predictions.integrated.map((prediction, index) => (
            <Grid item xs={12} md={6} key={index}>
              <PredictionCard prediction={prediction} category="integrated" />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={activeTab} index={3}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Timeline color="info" />
          Prediction Analytics
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Prediction Accuracy Metrics
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Prediction Type</TableCell>
                      <TableCell align="center">Accuracy</TableCell>
                      <TableCell align="center">Confidence</TableCell>
                      <TableCell align="center">Response Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Wildfire Predictions</TableCell>
                      <TableCell align="center">
                        <Chip label="87%" color="success" size="small" />
                      </TableCell>
                      <TableCell align="center">High</TableCell>
                      <TableCell align="center">12-24h</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Flood Forecasting</TableCell>
                      <TableCell align="center">
                        <Chip label="78%" color="warning" size="small" />
                      </TableCell>
                      <TableCell align="center">Medium</TableCell>
                      <TableCell align="center">24-48h</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Crop Yield Predictions</TableCell>
                      <TableCell align="center">
                        <Chip label="82%" color="success" size="small" />
                      </TableCell>
                      <TableCell align="center">High</TableCell>
                      <TableCell align="center">1-3 months</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Supply Chain Disruptions</TableCell>
                      <TableCell align="center">
                        <Chip label="71%" color="warning" size="small" />
                      </TableCell>
                      <TableCell align="center">Medium</TableCell>
                      <TableCell align="center">2-4 weeks</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <AiIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                AI Model Performance
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Overall prediction accuracy across all models
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={82} 
                sx={{ height: 12, borderRadius: 6, mb: 2 }}
                color="success"
              />
              <Typography variant="h4" color="success.main" gutterBottom>
                82%
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Based on 2,450 predictions over 6 months
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Enhanced Footer Section */}
      <Paper sx={{ p: 3, mt: 4, background: 'linear-gradient(135deg, #f8f9fa, #e8f5e8)' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              🎯 FNB Climate Resilience Initiative
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Our AI prediction system combines satellite imagery, weather data, supply chain analytics, 
              and historical patterns to provide early warnings for climate and food security risks. 
              Protecting communities through proactive risk management.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<Analytics />}
              sx={{
                background: 'linear-gradient(135deg, #388e3c, #4caf50)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2e7d32, #388e3c)',
                }
              }}
            >
              Download Report
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Predictions;
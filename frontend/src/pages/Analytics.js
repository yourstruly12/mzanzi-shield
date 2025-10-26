import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Box,
  Chip,
  LinearProgress
} from '@mui/material';
import { 
  Analytics as AnalyticsIcon, 
  TrendingUp, 
  Warning,
  BarChart,
  PieChart,
  Timeline,
  Agriculture,
  LocalGroceryStore,
  Storage,
  TrendingDown,
  Restaurant
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  // Fire Risk Prediction Data
  const fireRiskData = {
    labels: ['Today', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Fire Risk Index',
        data: [7.2, 6.8, 5.4, 4.9, 5.2, 6.1, 7.0],
        borderColor: 'rgba(220, 53, 69, 1)',
        backgroundColor: 'rgba(220, 53, 69, 0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const fireRiskOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: '7-Day Fire Hazard Predictions',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        title: {
          display: true,
          text: 'Fire Risk Index'
        }
      },
    },
  };

  // Flood Risk Data
  const floodRiskData = {
    labels: ['Today', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Flood Probability (%)',
        data: [35, 45, 60, 75, 65, 50, 40],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const floodRiskOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Flood Risk Probability',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Probability (%)'
        }
      },
    },
  };

  // Incident History Data
  const incidentHistoryData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Fire Incidents',
        data: [2, 3, 1, 4, 5, 3, 2, 4, 3, 2, 1, 3],
        backgroundColor: 'rgba(220, 53, 69, 0.7)',
      },
      {
        label: 'Flood Incidents',
        data: [1, 2, 3, 5, 4, 6, 5, 3, 2, 1, 2, 4],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
      {
        label: 'Food Security Incidents',
        data: [0, 1, 2, 3, 2, 4, 3, 2, 1, 2, 3, 2],
        backgroundColor: 'rgba(76, 175, 80, 0.7)',
      },
    ],
  };

  const incidentHistoryOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Historical Incident Data',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Number of Incidents'
        }
      },
    },
  };

  // Risk Distribution Data
  const riskDistributionData = {
    labels: ['High Risk', 'Moderate Risk', 'Low Risk', 'No Risk'],
    datasets: [
      {
        data: [15, 25, 40, 20],
        backgroundColor: [
          'rgba(220, 53, 69, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(40, 167, 69, 0.8)',
          'rgba(108, 117, 125, 0.8)',
        ],
        borderColor: [
          'rgba(220, 53, 69, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(40, 167, 69, 1)',
          'rgba(108, 117, 125, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // NEW: Food Supply Status Data
  const foodSupplyData = {
    labels: ['Maize', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Meat'],
    datasets: [
      {
        label: 'Current Supply (tons)',
        data: [450, 320, 280, 390, 210, 180],
        backgroundColor: 'rgba(76, 175, 80, 0.7)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 1,
      },
      {
        label: 'At Risk Supply',
        data: [120, 85, 45, 60, 10, 25],
        backgroundColor: 'rgba(255, 152, 0, 0.7)',
        borderColor: 'rgba(255, 152, 0, 1)',
        borderWidth: 1,
      },
    ],
  };

  const foodSupplyOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Food Supply Status by Category',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Tons'
        }
      },
    },
  };

  // NEW: Supply Chain Reliability Data
  const supplyChainData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Operational Routes',
        data: [14, 12, 13, 15],
        borderColor: 'rgba(76, 175, 80, 1)',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Disrupted Routes',
        data: [1, 3, 2, 0],
        borderColor: 'rgba(255, 152, 0, 1)',
        backgroundColor: 'rgba(255, 152, 0, 0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const supplyChainOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Supply Chain Reliability',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 20,
        title: {
          display: true,
          text: 'Number of Routes'
        }
      },
    },
  };

  // NEW: Food Price Trend Data
  const foodPriceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Food Price Index',
        data: [115, 118, 122, 125, 128, 130, 132, 135, 138, 140, 142, 145],
        borderColor: 'rgba(156, 39, 176, 1)',
        backgroundColor: 'rgba(156, 39, 176, 0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const foodPriceOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Food Price Trend Analysis',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Price Index'
        }
      },
    },
  };

  // ENHANCED Stats Cards with Food Security
  const statsCards = [
    {
      title: 'Total Incidents',
      value: '156',
      change: '+12%',
      icon: <Warning sx={{ fontSize: 40 }} />,
      color: 'error.main'
    },
    {
      title: 'Food Inventory',
      value: '2,450t',
      change: '+8%',
      icon: <Storage sx={{ fontSize: 40 }} />,
      color: 'success.main'
    },
    {
      title: 'Supply Chain Reliability',
      value: '85%',
      change: '+3%',
      icon: <LocalGroceryStore sx={{ fontSize: 40 }} />,
      color: 'primary.main'
    },
    {
      title: 'AI Accuracy',
      value: '92%',
      change: '+3%',
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      color: 'info.main'
    },
  ];

  // NEW: Food Security Predictions
  const foodPredictions = [
    {
      metric: 'Maize Production',
      current: '85% of target',
      prediction: '72% in 3 months',
      confidence: 78,
      trend: 'down',
      trigger: 'Drought conditions in northern regions'
    },
    {
      metric: 'Vegetable Supply',
      current: '95% of demand',
      prediction: '88% in 2 months',
      confidence: 65,
      trend: 'down',
      trigger: 'Flood impact on coastal farms'
    },
    {
      metric: 'Food Price Index',
      current: '125.6',
      prediction: '144.3 in 2 months',
      confidence: 72,
      trend: 'up',
      trigger: 'Supply chain disruptions'
    },
    {
      metric: 'Supply Chain Reliability',
      current: '85% operational',
      prediction: '78% in 1 month',
      confidence: 68,
      trend: 'down',
      trigger: 'Weather-related route closures'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          <AnalyticsIcon sx={{ mr: 2, verticalAlign: 'bottom' }} />
          Predictive Analytics & Food Security Insights
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Advanced analytics for disaster management and food security monitoring
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" component="div" fontWeight="bold" color={card.color}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {card.title}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color={card.change.startsWith('+') ? 'success.main' : 'error.main'}
                      fontWeight="bold"
                    >
                      {card.change} from last month
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* NEW: Food Security Predictive Analytics */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #f8fff8, #f0f8f0)' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Agriculture sx={{ mr: 1, color: 'success.main' }} />
          AI-Predictive Food Security Analytics
        </Typography>
        <Grid container spacing={2}>
          {foodPredictions.map((pred, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, backgroundColor: 'white' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {pred.metric}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    {pred.trend === 'up' ? <TrendingUp color="error" /> : <TrendingDown color="success" />}
                    <Chip 
                      label={`${pred.confidence}% confidence`}
                      size="small"
                      color={pred.confidence > 75 ? 'error' : pred.confidence > 60 ? 'warning' : 'info'}
                    />
                  </Box>
                </Box>
                
                <LinearProgress 
                  variant="determinate" 
                  value={pred.confidence}
                  sx={{ 
                    mb: 1,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: pred.confidence > 75 ? '#f44336' : pred.confidence > 60 ? '#ff9800' : '#2196f3'
                    }
                  }}
                />
                
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Current: <strong>{pred.current}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Prediction: <strong>{pred.prediction}</strong>
                    </Typography>
                  </Grid>
                </Grid>
                
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  Trigger: {pred.trigger}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Fire Risk Predictions */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <TrendingUp sx={{ mr: 1, color: 'error.main' }} />
              <Typography variant="h6">Fire Hazard Predictions</Typography>
            </Box>
            <Box sx={{ height: 300 }}>
              <Line data={fireRiskData} options={fireRiskOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* NEW: Food Supply Status */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Agriculture sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="h6">Food Supply Status</Typography>
            </Box>
            <Box sx={{ height: 300 }}>
              <Bar data={foodSupplyData} options={foodSupplyOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Flood Risk Analysis */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <BarChart sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Flood Risk Analysis</Typography>
            </Box>
            <Box sx={{ height: 300 }}>
              <Bar data={floodRiskData} options={floodRiskOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* NEW: Supply Chain Reliability */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <LocalGroceryStore sx={{ mr: 1, color: 'info.main' }} />
              <Typography variant="h6">Supply Chain Reliability</Typography>
            </Box>
            <Box sx={{ height: 300 }}>
              <Line data={supplyChainData} options={supplyChainOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Incident History - UPDATED with Food Security */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Timeline sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="h6">Historical Incident Data</Typography>
            </Box>
            <Box sx={{ height: 300 }}>
              <Bar data={incidentHistoryData} options={incidentHistoryOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* NEW: Food Price Trends */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Restaurant sx={{ mr: 1, color: 'secondary.main' }} />
              <Typography variant="h6">Food Price Trends</Typography>
            </Box>
            <Box sx={{ height: 300 }}>
              <Line data={foodPriceData} options={foodPriceOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Additional Analytics Section - ENHANCED */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #fff3e0, #ffecb3)' }}>
            <Warning sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Risk Trends
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Historical risk analysis and trend visualization with predictive modeling
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #e8f5e8, #c8e6c9)' }}>
            <Agriculture sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Food Security
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Supply chain monitoring and food availability predictions
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)' }}>
            <AnalyticsIcon sx={{ fontSize: 60, color: 'info.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              AI Predictions
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Advanced machine learning for disaster and food security forecasting
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analytics;
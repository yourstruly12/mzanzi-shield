import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Box,
  Chip,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress
} from '@mui/material';
import { 
  Notifications as AlertIcon, 
  Error, 
  Warning, 
  Info, 
  Add as AddIcon,
  LocationOn,
  People,
  Schedule,
  Whatshot,
  Opacity,
  FlashOn,
  Terrain,
  Agriculture,
  LocalGroceryStore,
  Report,           // Available emergency icon
  PriorityHigh     // Available emergency icon
} from '@mui/icons-material';
import { useSocket } from '../context/SocketContext';

const Alerts = () => {
  const { socket } = useSocket();
  const [alerts, setAlerts] = useState([]);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    type: 'fire',
    severity: 'moderate',
    location: '',
    description: ''
  });

  // ENHANCED: Sample alerts with Climate Resilience & Food Security integration
  const sampleAlerts = [
    {
      id: 1,
      title: 'Wildfire near Umgeni Park - Crop Lands at Risk',
      type: 'fire',
      severity: 'high',
      location: 'Umgeni Park, Durban',
      coordinates: { latitude: -29.84, longitude: 31.02 },
      description: 'A wildfire has broken out near Umgeni Park. Firefighters are on site controlling the blaze. 320 tons of food supplies are at risk in nearby storage facilities.',
      peopleAffected: 150,
      status: 'active',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      source: 'sensor',
      relatedSensors: [1, 4], // Fire Hazard and Air Quality sensors
      prediction: { probability: 0.78, trend: 'increasing' },
      actions: ['Evacuate affected areas', 'Close windows', 'Avoid outdoor activities'],
      // ADD: Food Security Impact
      foodImpact: {
        suppliesAtRisk: '320 tons',
        affectedCrops: ['Maize', 'Vegetables'],
        storageFacilities: 2,
        communitiesAffected: ['KwaMashu']
      },
      resilienceImpact: 'High',
      initiative: 'Climate Resilience'
    },
    {
      id: 2,
      title: 'Flood Alert in Morningside - Supply Chain Disrupted',
      type: 'flood',
      severity: 'moderate',
      location: 'Morningside, Durban',
      coordinates: { latitude: -29.86, longitude: 31.01 },
      description: 'Heavy rains have caused river levels to rise in Morningside. Flooding expected in low-lying areas. 3 supply routes are currently disrupted affecting food distribution.',
      peopleAffected: 420,
      status: 'monitoring',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      source: 'sensor',
      relatedSensors: [2], // Flood Monitoring sensor
      prediction: { probability: 0.65, trend: 'stable' },
      actions: ['Avoid low-lying areas', 'Prepare sandbags', 'Monitor water levels'],
      // ADD: Food Security Impact
      foodImpact: {
        routesDisrupted: 3,
        deliveryDelays: '4-6 hours',
        affectedCommunities: ['Inanda', 'Umlazi'],
        alternativeRoutes: 'Activated'
      },
      resilienceImpact: 'Critical',
      initiative: 'Food Security'
    },
    {
      id: 3,
      title: 'Power Outage in Glenwood - Food Storage at Risk',
      type: 'power',
      severity: 'low',
      location: 'Glenwood, Durban',
      coordinates: { latitude: -29.85, longitude: 31.03 },
      description: 'Scheduled maintenance caused a power outage affecting Glenwood area. Backup generators activated for food storage facilities. Monitoring refrigeration systems closely.',
      peopleAffected: 1200,
      status: 'resolved',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      source: 'user_report',
      relatedSensors: [3], // Weather Station
      prediction: { probability: 0.15, trend: 'decreasing' },
      actions: ['Check backup generators', 'Update residents', 'Monitor restoration'],
      // ADD: Food Security Impact
      foodImpact: {
        storageFacilitiesAffected: 1,
        backupPower: 'Active',
        riskLevel: 'Low',
        monitoringFrequency: '30 minutes'
      },
      resilienceImpact: 'Medium',
      initiative: 'Food Security'
    },
    {
      id: 4,
      title: 'High Wind Warning - Coastal Farmlands Alert',
      type: 'storm',
      severity: 'moderate',
      location: 'Coastal Regions, Durban',
      coordinates: { latitude: -29.855, longitude: 31.015 },
      description: 'Strong winds expected along coastal areas. Agricultural lands and fishing communities advised to secure assets. Crop damage potential rated as moderate.',
      peopleAffected: 850,
      status: 'active',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      source: 'ai_prediction',
      relatedSensors: [6], // Wind Speed sensor
      prediction: { probability: 0.72, trend: 'increasing' },
      actions: ['Secure outdoor objects', 'Avoid coastal roads', 'Monitor weather updates'],
      // ADD: Food Security Impact
      foodImpact: {
        agriculturalRisk: 'Moderate',
        fishingCommunities: 'Alerted',
        cropProtection: 'Recommended',
        expectedLoss: '5-10% yield'
      },
      resilienceImpact: 'Medium',
      initiative: 'Climate Resilience'
    },
    // NEW: Food Security Specific Alert
    {
      id: 5,
      title: 'Food Supply Chain Disruption - Northern Routes',
      type: 'supply_chain',
      severity: 'high',
      location: 'Northern Supply Corridor',
      coordinates: { latitude: -29.82, longitude: 31.00 },
      description: 'Multiple supply routes to northern communities disrupted due to infrastructure issues. Emergency food distribution activated for affected areas.',
      peopleAffected: 2500,
      status: 'active',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      source: 'logistics_system',
      prediction: { probability: 0.85, trend: 'stable' },
      actions: ['Activate emergency reserves', 'Redirect supply routes', 'Coordinate with communities'],
      // ADD: Food Security Impact
      foodImpact: {
        communitiesServed: 3,
        emergencyReserves: 'Activated',
        estimatedDuration: '8-12 hours',
        alternativeTransport: 'Arranged'
      },
      resilienceImpact: 'High',
      initiative: 'Food Security'
    }
  ];

  useEffect(() => {
    // Load sample alerts
    setAlerts(sampleAlerts);

    // Listen for real-time alert updates
    if (socket) {
      socket.on('newAlert', (alert) => {
        setAlerts(prev => [alert, ...prev]);
      });

      socket.on('alertUpdate', (updatedAlert) => {
        setAlerts(prev => prev.map(alert => 
          alert.id === updatedAlert.id ? updatedAlert : alert
        ));
      });

      // ADD: Listen for integrated alerts (climate + food security)
      socket.on('integratedAlert', (alert) => {
        console.log('Received integrated alert:', alert);
        setAlerts(prev => [alert, ...prev]);
      });
    }

    return () => {
      if (socket) {
        socket.off('newAlert');
        socket.off('alertUpdate');
        socket.off('integratedAlert');
      }
    };
  }, [socket]);

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <Error color="error" />;
      case 'moderate': return <Warning color="warning" />;
      case 'low': return <Info color="info" />;
      default: return <Info color="info" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'error';
      case 'moderate': return 'warning';
      case 'low': return 'info';
      default: return 'info';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'fire': return <Whatshot />;
      case 'flood': return <Opacity />;
      case 'storm': return <FlashOn />;
      case 'power': return <FlashOn />;
      case 'earthquake': return <Terrain />;
      case 'supply_chain': return <LocalGroceryStore />;
      case 'food_security': return <Agriculture />;
      default: return <Warning />;
    }
  };

  const getInitiativeColor = (initiative) => {
    switch (initiative) {
      case 'Climate Resilience': return 'warning';
      case 'Food Security': return 'success';
      default: return 'primary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'error';
      case 'monitoring': return 'warning';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
  };

  const handleReportIncident = () => {
    const alert = {
      id: Date.now(),
      ...newAlert,
      status: 'active',
      timestamp: new Date(),
      source: 'user_report',
      peopleAffected: 0,
      coordinates: { latitude: -29.8587, longitude: 31.0218 }, // Default to Durban
      prediction: { probability: 0.5, trend: 'stable' },
      actions: ['Verify report', 'Dispatch team', 'Assess situation'],
      // ADD: Default food impact for user-reported incidents
      foodImpact: {
        suppliesAtRisk: 'Assessing...',
        communitiesAffected: ['Evaluating impact']
      },
      resilienceImpact: 'Assessing',
      initiative: newAlert.type === 'supply_chain' || newAlert.type === 'food_security' ? 'Food Security' : 'Climate Resilience'
    };

    setAlerts(prev => [alert, ...prev]);
    setOpenReportDialog(false);
    setNewAlert({
      title: '',
      type: 'fire',
      severity: 'moderate',
      location: '',
      description: ''
    });

    // Emit to socket if available
    if (socket) {
      socket.emit('newAlert', alert);
    }
  };

  const updateAlertStatus = (alertId, newStatus) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: newStatus } : alert
    ));

    // Emit to socket if available
    if (socket) {
      socket.emit('updateAlert', { id: alertId, status: newStatus });
    }
  };

  // ENHANCED: Statistics with Food Security focus
  const activeAlerts = alerts.filter(alert => alert.status !== 'resolved');
  const highSeverityAlerts = alerts.filter(alert => alert.severity === 'high');
  const totalPeopleAffected = alerts.reduce((sum, alert) => sum + alert.peopleAffected, 0);
  const foodSecurityAlerts = alerts.filter(alert => alert.initiative === 'Food Security');
  const climateResilienceAlerts = alerts.filter(alert => alert.initiative === 'Climate Resilience');

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* ENHANCED Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          <Report sx={{ mr: 2, verticalAlign: 'bottom' }} /> {/* FIXED: Using Report icon */}
          Climate Resilience & Food Security Alerts
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Integrated alert management for disaster response and food supply chain protection
        </Typography>
      </Box>

      {/* ENHANCED Alert Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ background: 'linear-gradient(135deg, #1976d2, #42a5f5)' }}>
            <CardContent sx={{ textAlign: 'center', color: 'white' }}>
              <Error sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" fontWeight="bold">
                {activeAlerts.length}
              </Typography>
              <Typography variant="body2">
                Active Alerts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ background: 'linear-gradient(135deg, #ed6c02, #ff9800)' }}>
            <CardContent sx={{ textAlign: 'center', color: 'white' }}>
              <Warning sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" fontWeight="bold">
                {highSeverityAlerts.length}
              </Typography>
              <Typography variant="body2">
                High Severity
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ background: 'linear-gradient(135deg, #0288d1, #03a9f4)' }}>
            <CardContent sx={{ textAlign: 'center', color: 'white' }}>
              <People sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" fontWeight="bold">
                {totalPeopleAffected.toLocaleString()}
              </Typography>
              <Typography variant="body2">
                People Affected
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ background: 'linear-gradient(135deg, #388e3c, #4caf50)' }}>
            <CardContent sx={{ textAlign: 'center', color: 'white' }}>
              <Agriculture sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" fontWeight="bold">
                {foodSecurityAlerts.length}
              </Typography>
              <Typography variant="body2">
                Food Security
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ background: 'linear-gradient(135deg, #7b1fa2, #9c27b0)' }}>
            <CardContent sx={{ textAlign: 'center', color: 'white' }}>
              <Whatshot sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" fontWeight="bold">
                28m
              </Typography>
              <Typography variant="body2">
                Avg Response Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* ENHANCED Active Alerts List */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Integrated Alerts Dashboard
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenReportDialog(true)}
                sx={{
                  background: 'linear-gradient(135deg, #388e3c, #4caf50)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2e7d32, #388e3c)',
                  }
                }}
              >
                Report Incident
              </Button>
            </Box>

            {activeAlerts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <AlertIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  No Active Alerts
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  All systems are operating normally
                </Typography>
              </Box>
            ) : (
              activeAlerts.map((alert) => (
                <Card key={alert.id} sx={{ 
                  mb: 2, 
                  borderLeft: `4px solid`,
                  background: alert.initiative === 'Food Security' ? 
                    'linear-gradient(135deg, #f1f8e9, #ffffff)' : 
                    'linear-gradient(135deg, #fff3e0, #ffffff)'
                }} style={{ borderLeftColor: 
                  alert.severity === 'high' ? '#f44336' : 
                  alert.severity === 'moderate' ? '#ff9800' : '#2196f3'
                }}>
                  <CardContent>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                      <Box sx={{ flex: 1 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          {getTypeIcon(alert.type)}
                          <Typography variant="h6" component="div">
                            {alert.title}
                          </Typography>
                          <Chip 
                            label={alert.initiative}
                            size="small"
                            color={getInitiativeColor(alert.initiative)}
                            variant="outlined"
                          />
                        </Box>
                        
                        <Box display="flex" alignItems="center" gap={2} mb={1} flexWrap="wrap">
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="body2" color="textSecondary">
                              {alert.location}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Schedule fontSize="small" color="action" />
                            <Typography variant="body2" color="textSecondary">
                              {formatTime(alert.timestamp)}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <People fontSize="small" color="action" />
                            <Typography variant="body2" color="textSecondary">
                              {alert.peopleAffected} people affected
                            </Typography>
                          </Box>
                        </Box>

                        <Typography variant="body2" paragraph>
                          {alert.description}
                        </Typography>

                        {/* ENHANCED: Food Security Impact Section */}
                        {alert.foodImpact && (
                          <Alert 
                            severity={alert.resilienceImpact === 'Critical' ? 'error' : 'warning'} 
                            sx={{ mb: 2 }}
                            icon={<Agriculture />}
                          >
                            <Box>
                              <Typography variant="subtitle2" gutterBottom>
                                🍲 Food Security Impact:
                              </Typography>
                              {alert.foodImpact.suppliesAtRisk && (
                                <Typography variant="body2">
                                  • Supplies at risk: <strong>{alert.foodImpact.suppliesAtRisk}</strong>
                                </Typography>
                              )}
                              {alert.foodImpact.routesDisrupted && (
                                <Typography variant="body2">
                                  • Routes disrupted: <strong>{alert.foodImpact.routesDisrupted}</strong>
                                </Typography>
                              )}
                              {alert.foodImpact.communitiesAffected && (
                                <Typography variant="body2">
                                  • Communities affected: <strong>{alert.foodImpact.communitiesAffected.join(', ')}</strong>
                                </Typography>
                              )}
                            </Box>
                          </Alert>
                        )}

                        {/* AI Prediction */}
                        {alert.prediction && (
                          <Alert severity="info" sx={{ mb: 2 }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle2">
                                🤖 AI Prediction:
                              </Typography>
                              <Typography variant="body2">
                                {Math.round(alert.prediction.probability * 100)}% probability of escalation
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={alert.prediction.probability * 100}
                                sx={{ flex: 1, ml: 1 }}
                              />
                            </Box>
                          </Alert>
                        )}

                        {/* Recommended Actions */}
                        <Box mb={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            🎯 Recommended Actions:
                          </Typography>
                          <Box display="flex" gap={1} flexWrap="wrap">
                            {alert.actions.map((action, index) => (
                              <Chip
                                key={index}
                                label={action}
                                size="small"
                                variant="outlined"
                                color={getInitiativeColor(alert.initiative)}
                              />
                            ))}
                          </Box>
                        </Box>

                        {/* Related Sensors */}
                        {alert.relatedSensors && (
                          <Typography variant="caption" color="textSecondary">
                            📡 Related Sensors: {alert.relatedSensors.map(id => `#${id}`).join(', ')}
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ textAlign: 'right', ml: 2 }}>
                        <Chip 
                          icon={getSeverityIcon(alert.severity)}
                          label={alert.severity.toUpperCase()}
                          color={getSeverityColor(alert.severity)}
                          sx={{ mb: 1 }}
                        />
                        <Chip 
                          label={alert.status.toUpperCase()}
                          color={getStatusColor(alert.status)}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={() => updateAlertStatus(alert.id, 'resolved')}
                          >
                            Mark Resolved
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Paper>
        </Grid>

        {/* ENHANCED Alert Statistics and Controls */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Initiative Distribution
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Report sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} /> {/* FIXED: Using Report icon */}
              <Typography variant="h4" gutterBottom>
                {alerts.length} Total Alerts
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {activeAlerts.length} Active • {alerts.filter(a => a.status === 'resolved').length} Resolved
              </Typography>
              
              {/* Initiative Distribution */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Whatshot color="warning" />
                    Climate Resilience: {climateResilienceAlerts.length}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(climateResilienceAlerts.length / alerts.length) * 100}
                    color="warning"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Agriculture color="success" />
                    Food Security: {foodSecurityAlerts.length}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(foodSecurityAlerts.length / alerts.length) * 100}
                    color="success"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* ENHANCED Quick Actions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />} 
                onClick={() => setOpenReportDialog(true)}
                sx={{ justifyContent: 'flex-start' }}
              >
                Report New Incident
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<Whatshot />}
                sx={{ justifyContent: 'flex-start' }}
              >
                Climate Resilience Alerts
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<Agriculture />}
                sx={{ justifyContent: 'flex-start' }}
              >
                Food Security Alerts
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<LocalGroceryStore />}
                sx={{ justifyContent: 'flex-start' }}
              >
                Supply Chain Status
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<People />}
                sx={{ justifyContent: 'flex-start' }}
              >
                Community Impact
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ENHANCED Report Incident Dialog */}
      <Dialog open={openReportDialog} onClose={() => setOpenReportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Report color="primary" /> {/* FIXED: Using Report icon */}
            Report New Incident - FNB Climate Resilience
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Incident Title"
              value={newAlert.title}
              onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
              fullWidth
              placeholder="e.g., Flood affecting food distribution routes"
            />
            <FormControl fullWidth>
              <InputLabel>Incident Type</InputLabel>
              <Select
                value={newAlert.type}
                label="Incident Type"
                onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
              >
                <MenuItem value="fire">🔥 Fire</MenuItem>
                <MenuItem value="flood">💧 Flood</MenuItem>
                <MenuItem value="storm">⚡ Storm</MenuItem>
                <MenuItem value="power">🔌 Power Outage</MenuItem>
                <MenuItem value="supply_chain">🚚 Supply Chain</MenuItem>
                <MenuItem value="food_security">🍲 Food Security</MenuItem>
                <MenuItem value="other">❓ Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Severity Level</InputLabel>
              <Select
                value={newAlert.severity}
                label="Severity"
                onChange={(e) => setNewAlert({...newAlert, severity: e.target.value})}
              >
                <MenuItem value="low">🟢 Low</MenuItem>
                <MenuItem value="moderate">🟡 Moderate</MenuItem>
                <MenuItem value="high">🔴 High</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Location"
              value={newAlert.location}
              onChange={(e) => setNewAlert({...newAlert, location: e.target.value})}
              fullWidth
              placeholder="e.g., Community name, coordinates, or landmark"
            />
            <TextField
              label="Incident Description"
              value={newAlert.description}
              onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
              multiline
              rows={3}
              fullWidth
              placeholder="Describe the incident and any food security impacts..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReportDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleReportIncident} 
            variant="contained"
            disabled={!newAlert.title || !newAlert.location}
            sx={{
              background: 'linear-gradient(135deg, #388e3c, #4caf50)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2e7d32, #388e3c)',
              }
            }}
          >
            🚨 Report Incident
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Alerts;
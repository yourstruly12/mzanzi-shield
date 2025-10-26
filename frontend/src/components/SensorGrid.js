import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Whatshot as FireIcon,
  Opacity as WaterIcon,
  Air as WindIcon,
  WbSunny as TempIcon,
} from '@mui/icons-material';

const SensorGrid = ({ sensors }) => {
  const getSensorIcon = (type) => {
    switch (type) {
      case 'fire_hazard': return <FireIcon />;
      case 'water_level': return <WaterIcon />;
      case 'wind': return <WindIcon />;
      case 'temperature': return <TempIcon />;
      default: return <FireIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'error';
      case 'warning': return 'warning';
      default: return 'success';
    }
  };

  return (
    <Grid container spacing={2}>
      {sensors.map((sensor) => (
        <Grid item xs={12} sm={6} key={sensor.id}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Box display="flex" alignItems="center">
                  {getSensorIcon(sensor.type)}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {sensor.name}
                  </Typography>
                </Box>
                <Chip
                  label={sensor.status}
                  color={getStatusColor(sensor.status)}
                  size="small"
                />
              </Box>
              
              <Typography variant="h4" color="primary" gutterBottom>
                {sensor.currentValue} {sensor.unit}
              </Typography>
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="textSecondary">
                  Threshold: {sensor.threshold} {sensor.unit}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(sensor.lastUpdated).toLocaleTimeString()}
                </Typography>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={Math.min((sensor.currentValue / sensor.threshold) * 100, 100)}
                color={getStatusColor(sensor.status)}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SensorGrid;
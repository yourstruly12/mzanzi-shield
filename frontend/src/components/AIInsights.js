import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Alert,
} from '@mui/material';
import { SmartToy as AIIcon } from '@mui/icons-material';

const AIInsights = () => {
  return (
    <Paper sx={{ p: 2, mb: 3, backgroundColor: 'primary.light', color: 'white' }}>
      <Box display="flex" alignItems="center" mb={1}>
        <AIIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="div">
          AI Insight
        </Typography>
        <Chip 
          label="68% Confidence" 
          size="small" 
          sx={{ ml: 2, backgroundColor: 'white', color: 'primary.main' }}
        />
      </Box>
      <Typography variant="body1">
        Based on current weather patterns and historical data, there's a 68% probability 
        of flash flooding in coastal areas within the next 24 hours.
      </Typography>
    </Paper>
  );
};

export default AIInsights;
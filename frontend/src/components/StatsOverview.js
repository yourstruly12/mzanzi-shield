import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import {
  Warning as WarningIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

const StatsOverview = ({ stats }) => {
  const statCards = [
    {
      title: 'High Risk Areas',
      value: stats.highRiskAreas || 0,
      icon: <WarningIcon />,
      color: 'error.main',
    },
    {
      title: 'Active Alerts',
      value: stats.activeAlerts || 0,
      icon: <AnalyticsIcon />,
      color: 'warning.main',
    },
    {
      title: 'People at Risk',
      value: stats.peopleAtRisk ? stats.peopleAtRisk.toLocaleString() : '0',
      icon: <PeopleIcon />,
      color: 'info.main',
    },
    {
      title: 'Avg Response Time',
      value: stats.avgResponseTime ? `${stats.avgResponseTime}m` : '0m',
      icon: <ScheduleIcon />,
      color: 'success.main',
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {statCards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {card.title}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    color: card.color,
                    backgroundColor: `${card.color}15`,
                    borderRadius: '50%',
                    p: 1,
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsOverview;
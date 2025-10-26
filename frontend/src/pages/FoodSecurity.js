import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Paper, Typography, Box, Card, CardContent,
  Chip, LinearProgress, Alert, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Tabs, Tab
} from '@mui/material';
import {
  Agriculture, LocalGroceryStore, Storage, People,
  TrendingUp, Warning, CheckCircle, Restaurant,
  Timeline, Opacity, Whatshot
} from '@mui/icons-material';

const FoodSecurity = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [foodData, setFoodData] = useState({});

  useEffect(() => {
    // Mock data for food security dashboard
    setFoodData({
      inventory: {
        total: '2,450 tons',
        atRisk: '320 tons',
        secure: '2,130 tons',
        distribution: [
          { category: 'Grains', amount: '850 tons', risk: 'Low' },
          { category: 'Vegetables', amount: '420 tons', risk: 'Medium' },
          { category: 'Fruits', amount: '380 tons', risk: 'High' },
          { category: 'Protein', amount: '280 tons', risk: 'Low' },
          { category: 'Dairy', amount: '320 tons', risk: 'Medium' },
          { category: 'Emergency', amount: '200 tons', risk: 'None' },
        ]
      },
      supplyChain: {
        operationalRoutes: 12,
        totalRoutes: 15,
        delayedShipments: 3,
        averageDeliveryTime: '4.2 hours'
      },
      communities: [
        {
          name: 'KwaMashu Township',
          population: 15000,
          foodSecurityIndex: 'Low',
          riskLevel: 'High',
          resilienceScore: 45,
          supportNeeded: ['Food parcels', 'Seeds', 'Irrigation']
        },
        {
          name: 'Inanda Rural Area',
          population: 12000,
          foodSecurityIndex: 'Medium',
          riskLevel: 'Moderate',
          resilienceScore: 60,
          supportNeeded: ['Storage facilities', 'Transport']
        },
        {
          name: 'Umlazi Coastal',
          population: 18000,
          foodSecurityIndex: 'Medium',
          riskLevel: 'High',
          resilienceScore: 55,
          supportNeeded: ['Fishery support', 'Coastal protection']
        }
      ]
    });
  }, []);

  const FoodSecurityOverview = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ background: 'linear-gradient(135deg, #1976d2, #42a5f5)' }}>
          <CardContent sx={{ textAlign: 'center', color: 'white' }}>
            <Storage sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="div" fontWeight="bold">
              {foodData.inventory?.total}
            </Typography>
            <Typography variant="body2">
              Total Food Inventory
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ background: 'linear-gradient(135deg, #ed6c02, #ff9800)' }}>
          <CardContent sx={{ textAlign: 'center', color: 'white' }}>
            <Warning sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="div" fontWeight="bold">
              {foodData.inventory?.atRisk}
            </Typography>
            <Typography variant="body2">
              Supplies at Risk
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ background: 'linear-gradient(135deg, #0288d1, #03a9f4)' }}>
          <CardContent sx={{ textAlign: 'center', color: 'white' }}>
            <LocalGroceryStore sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="div" fontWeight="bold">
              {foodData.supplyChain?.operationalRoutes}/{foodData.supplyChain?.totalRoutes}
            </Typography>
            <Typography variant="body2">
              Operational Routes
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ background: 'linear-gradient(135deg, #388e3c, #4caf50)' }}>
          <CardContent sx={{ textAlign: 'center', color: 'white' }}>
            <People sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="div" fontWeight="bold">
              45,000
            </Typography>
            <Typography variant="body2">
              People Protected
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        <Agriculture sx={{ mr: 2, verticalAlign: 'bottom' }} />
        Food Security Monitoring
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Comprehensive food supply chain monitoring and community resilience tracking
      </Typography>

      <FoodSecurityOverview />

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Food Inventory Distribution
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Food Category</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="center">Risk Level</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {foodData.inventory?.distribution?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {item.category}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold">
                          {item.amount}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={item.risk}
                          size="small"
                          color={
                            item.risk === 'High' ? 'error' :
                            item.risk === 'Medium' ? 'warning' : 'success'
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          icon={item.risk === 'High' ? <Warning /> : <CheckCircle />}
                          label={item.risk === 'High' ? 'Monitor' : 'Secure'}
                          size="small"
                          variant="outlined"
                          color={item.risk === 'High' ? 'error' : 'success'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Community Resilience
            </Typography>
            {foodData.communities?.map((community, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {community.name}
                  </Typography>
                  <Chip 
                    label={`${community.resilienceScore}/100`}
                    size="small"
                    color={
                      community.resilienceScore > 70 ? 'success' :
                      community.resilienceScore > 50 ? 'warning' : 'error'
                    }
                  />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={community.resilienceScore}
                  sx={{ mb: 1, height: 6, borderRadius: 3 }}
                />
                <Typography variant="caption" color="textSecondary" display="block">
                  Population: {community.population.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block">
                  Food Security: {community.foodSecurityIndex}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {community.supportNeeded.map((item, idx) => (
                    <Chip key={idx} label={item} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FoodSecurity;
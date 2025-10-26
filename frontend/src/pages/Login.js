import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const Login = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Typography variant="body1">
          Login functionality will be implemented here.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
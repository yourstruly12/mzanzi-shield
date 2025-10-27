import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import Predictions from './pages/Predictions';
import Login from './pages/Login';
import Weather from './pages/Weather';
import FoodSecurity from './pages/FoodSecurity'; // ADD: New Food Security page
import { SocketProvider } from './context/SocketContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import Navigation from './components/Navigation';
import './App.css';

// ENHANCED: Create theme with Climate Resilience & Food Security design
const createAppTheme = (mode) => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#0066cc' : '#3a86ff',
    },
    secondary: {
      main: mode === 'light' ? '#dc3545' : '#ff6b6b',
    },
    // ADD: Food Security Colors
    success: {
      main: mode === 'light' ? '#2e7d32' : '#4caf50',
      light: mode === 'light' ? '#4caf50' : '#81c784',
      dark: mode === 'light' ? '#1b5e20' : '#388e3c',
    },
    warning: {
      main: mode === 'light' ? '#ed6c02' : '#ff9800',
    },
    info: {
      main: mode === 'light' ? '#0288d1' : '#03a9f4',
    },
    background: {
      default: mode === 'light' 
        ? 'linear-gradient(135deg, #f5f7fa 0%, #e8f5e8 100%)' // ADD: Green tint for food security
        : 'linear-gradient(135deg, #121212 0%, #1a1f1a 100%)', // ADD: Dark green tint
      paper: mode === 'light' 
        ? 'rgba(255, 255, 255, 0.8)' 
        : 'rgba(30, 30, 30, 0.8)',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    h4: {
      fontWeight: 600,
      background: mode === 'light' 
        ? 'linear-gradient(45deg, #0066cc, #2e7d32)'
        : 'linear-gradient(45deg, #3a86ff, #4caf50)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h6: {
      fontWeight: 600,
      color: mode === 'light' ? '#2e7d32' : '#4caf50', // Food security green
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          background: mode === 'light' 
            ? 'rgba(255, 255, 255, 0.85)' 
            : 'rgba(30, 30, 30, 0.85)',
          border: mode === 'light' 
            ? '1px solid rgba(46, 125, 50, 0.1)' // ADD: Green border accent
            : '1px solid rgba(76, 175, 80, 0.1)',
          boxShadow: mode === 'light' 
            ? '0 8px 32px rgba(46, 125, 50, 0.1)' // ADD: Green tinted shadow
            : '0 8px 32px rgba(76, 175, 80, 0.1)',
          borderRadius: 12,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: mode === 'light'
              ? '0 12px 40px rgba(46, 125, 50, 0.15)'
              : '0 12px 40px rgba(76, 175, 80, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          background: mode === 'light' 
            ? 'rgba(255, 255, 255, 0.8)' 
            : 'rgba(30, 30, 30, 0.8)',
          border: mode === 'light' 
            ? '1px solid rgba(46, 125, 50, 0.1)'
            : '1px solid rgba(76, 175, 80, 0.1)',
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
        },
        containedSuccess: {
          background: mode === 'light'
            ? 'linear-gradient(135deg, #4caf50, #2e7d32)'
            : 'linear-gradient(135deg, #66bb6a, #4caf50)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
        colorSuccess: {
          backgroundColor: mode === 'light' ? '#e8f5e8' : '#1b5e20',
          color: mode === 'light' ? '#2e7d32' : '#4caf50',
          border: `1px solid ${mode === 'light' ? '#c8e6c9' : '#2e7d32'}`,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backdropFilter: 'blur(10px)',
        },
        standardSuccess: {
          backgroundColor: mode === 'light' ? '#e8f5e8' : '#1b5e20',
          color: mode === 'light' ? '#2e7d32' : '#4caf50',
          border: `1px solid ${mode === 'light' ? '#c8e6c9' : '#2e7d32'}`,
        },
        standardWarning: {
          backgroundColor: mode === 'light' ? '#fff3e0' : '#e65100',
          color: mode === 'light' ? '#ed6c02' : '#ff9800',
          border: `1px solid ${mode === 'light' ? '#ffe0b2' : '#ff5722'}`,
        },
      },
    },
  },
  // ADD: Custom shape properties
  shape: {
    borderRadius: 8,
  },
  // ADD: Custom transitions
  transitions: {
    duration: {
      short: 250,
      standard: 300,
      complex: 375,
    },
  },
});

function App() {
  const [themeMode, setThemeMode] = useState('light');

  const toggleTheme = () => {
    setThemeMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const theme = createTheme(createAppTheme(themeMode));

  // ADD: Food Security Context Provider (if needed)
  const FoodSecurityContext = React.createContext();

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <SocketProvider>
            <Router>
              <div className="App" data-theme={themeMode}>
                <Navigation />
                <main className="main-content" style={{
                  background: themeMode === 'light'
                    ? 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e8 50%, #f5f7fa 100%)'
                    : 'linear-gradient(135deg, #121212 0%, #1a1f1a 50%, #121212 100%)',
                  minHeight: 'calc(100vh - 120px)',
                  padding: '20px 0',
                }}>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/weather" element={<Weather />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/predictions" element={<Predictions />} />
                    {/* ADD: New Food Security Route */}
                    <Route path="/food-security" element={<FoodSecurity />} />
                    {/* ADD: Fallback route */}
                    <Route path="*" element={<Dashboard />} />
                  </Routes>
                </main>
                
                {/* ADD: Enhanced Footer with FNB branding */}
                <footer style={{
                  backgroundColor: themeMode === 'light' 
                    ? 'rgba(0, 102, 204, 0.1)' 
                    : 'rgba(58, 134, 255, 0.1)',
                  padding: '20px',
                  textAlign: 'center',
                  borderTop: `1px solid ${themeMode === 'light' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(76, 175, 80, 0.1)'}`,
                  backdropFilter: 'blur(10px)',
                }}>
                  <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '20px'
                    }}>
                      <div style={{ textAlign: 'left' }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 1,
                            mb: 1
                          }}
                        >
                          <i className="fas fa-seedling" style={{ color: '#4caf50' }}></i>
                          Mzanzi Shield
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Building resilient communities through innovation
                        </Typography>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                        <div>
                          <Typography variant="caption" fontWeight="bold" display="block">
                            Emergency Contacts
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Disaster Management: 0000 000 000
                          </Typography>
                          <br />
                          <Typography variant="caption" color="textSecondary">
                            Food Security Hotline: 0000 000 000
                          </Typography>
                        </div>
                        
                        <div>
                          <Typography variant="caption" fontWeight="bold" display="block">
                            Quick Links
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Weather Alerts • Food Distribution • Community Support
                          </Typography>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      marginTop: '20px', 
                      paddingTop: '20px', 
                      borderTop: `1px solid ${themeMode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}>
                      <Typography variant="caption" color="textSecondary">
                        © 2024 Mzanzi Shield - Climate Resilience Initiative. Protecting communities, securing futures.
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Last Updated: {new Date().toLocaleDateString()}
                      </Typography>
                    </div>
                  </div>
                </footer>
              </div>
            </Router>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

// ADD: Import Typography for footer
import { Typography } from '@mui/material';

export default App;
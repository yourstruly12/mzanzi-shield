import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Select,
  MenuItem,
  Badge,
  useTheme,
  Chip,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import {
  Shield as ShieldIcon,
  WbSunny as LightIcon,
  NightsStay as DarkIcon,
  Notifications as NotificationIcon,
  Agriculture,
  LocalGroceryStore,
} from '@mui/icons-material';
import { useTheme as useAppTheme } from '../context/ThemeContext';

const Navigation = () => {
  const location = useLocation();
  const theme = useTheme();
  const { themeMode, toggleTheme } = useAppTheme();
  const [language, setLanguage] = useState('en');

  // ENHANCED Navigation Items with Food Security
  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'tachometer-alt' },
    { path: '/weather', label: 'Weather', icon: 'cloud-sun' },
    { path: '/alerts', label: 'Alerts', icon: 'exclamation-triangle', badge: 5 },
    { path: '/analytics', label: 'Analytics', icon: 'chart-line' },
    { path: '/predictions', label: 'AI Predictions', icon: 'robot' },
    // ADD: Food Security Section
    { path: '/food-security', label: 'Food Security', icon: 'seedling', badge: 2 },
  ];

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: theme.palette.mode === 'light' 
          ? 'linear-gradient(135deg, #0066cc, #004080)'
          : 'linear-gradient(135deg, #3a86ff, #2667cc)',
        backdropFilter: 'blur(10px)',
        borderBottom: '3px solid #4caf50', // ADD: Green accent for food security
      }}
    >
      <Toolbar>
        {/* ENHANCED Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <ShieldIcon sx={{ mr: 1, color: '#4caf50' }} /> {/* ADD: Green accent */}
            <Agriculture sx={{ mr: 1, color: '#ffd54f', fontSize: 20 }} /> {/* ADD: Food icon */}
          </Box>
          <Typography 
            variant="h6" 
            component={Link}
            to="/"
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #ffffff, #e8f5e8)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              '&:hover': {
                background: 'linear-gradient(45deg, #ffffff, #c8e6c9)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
              }
            }}
          >
            Climate Resilience & Food Security
          </Typography>
          
          {/* ADD: FNB Partnership Badge */}
          <Chip
            label="FNB Initiative"
            size="small"
            sx={{
              ml: 2,
              backgroundColor: '#ffd54f',
              color: '#333',
              fontWeight: 'bold',
              fontSize: '0.7rem',
              height: '24px',
              '& .MuiChip-label': {
                px: 1,
              }
            }}
          />
        </Box>

        {/* ENHANCED Navigation Items */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isFoodSecurity = item.path === '/food-security';
            
            return (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color="inherit"
                startIcon={
                  isFoodSecurity ? (
                    <Agriculture sx={{ fontSize: 18 }} />
                  ) : (
                    <i className={`fas fa-${item.icon}`} />
                  )
                }
                sx={{ 
                  mx: 0.5,
                  backgroundColor: isActive 
                    ? isFoodSecurity 
                      ? 'rgba(76, 175, 80, 0.3)' // Green for food security
                      : 'rgba(255,255,255,0.2)' 
                    : 'transparent',
                  border: isActive 
                    ? isFoodSecurity 
                      ? '2px solid #4caf50' // Green border for food security
                      : '1px solid rgba(255,255,255,0.3)'
                    : '1px solid transparent',
                  borderRadius: isFoodSecurity ? '20px' : '8px',
                  '&:hover': {
                    backgroundColor: isFoodSecurity 
                      ? 'rgba(76, 175, 80, 0.2)'
                      : 'rgba(255,255,255,0.1)',
                    transform: isFoodSecurity ? 'scale(1.05)' : 'scale(1.02)',
                  },
                  transition: 'all 0.2s ease-in-out',
                  fontWeight: isFoodSecurity ? 'bold' : 'normal',
                }}
              >
                {item.label}
                {item.badge && (
                  <Badge 
                    badgeContent={item.badge} 
                    color={isFoodSecurity ? "success" : "error"} 
                    sx={{ ml: 1 }}
                  />
                )}
              </Button>
            );
          })}
        </Box>

        {/* ENHANCED Control Panel */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
          {/* Food Security Quick Stats */}
          <Box sx={{ 
            display: { xs: 'none', lg: 'flex' }, 
            alignItems: 'center', 
            gap: 1,
            mr: 1,
            px: 2,
            py: 0.5,
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderRadius: '20px',
            border: '1px solid rgba(76, 175, 80, 0.3)',
          }}>
            <LocalGroceryStore sx={{ fontSize: 16, color: '#c8e6c9' }} />
            <Typography variant="caption" sx={{ color: '#e8f5e8', fontWeight: 'bold' }}>
              2,450t
            </Typography>
            <Typography variant="caption" sx={{ color: '#bdbdbd' }}>
              Food Inventory
            </Typography>
          </Box>

          {/* Theme Toggle */}
          <IconButton 
            color="inherit" 
            onClick={toggleTheme}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              }
            }}
          >
            {themeMode === 'light' ? <DarkIcon /> : <LightIcon />}
          </IconButton>

          {/* Language Selector */}
          <Select
            value={language}
            onChange={handleLanguageChange}
            variant="outlined"
            size="small"
            sx={{
              color: 'white',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.5)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.7)',
              },
              '.MuiSvgIcon-root': {
                color: 'white',
              },
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '20px',
              minWidth: '120px',
            }}
          >
            <MenuItem value="en">🇺🇸 English</MenuItem>
            <MenuItem value="zu">🇿🇦 Zulu (isiZulu)</MenuItem>
            <MenuItem value="af">🇿🇦 Afrikaans</MenuItem>
          </Select>

          {/* ENHANCED Emergency Alert with Food Security */}
          <Button
            color="inherit"
            startIcon={<NotificationIcon />}
            endIcon={
              <Badge badgeContent={3} color="error">
                <span></span>
              </Badge>
            }
            sx={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '20px',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              },
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.5s',
              },
              '&:hover::after': {
                left: '100%',
              }
            }}
          >
            Emergency Alert
          </Button>

          {/* ADD: Quick Action Menu */}
          <IconButton 
            color="inherit"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              }
            }}
          >
            <i className="fas fa-ellipsis-v" />
          </IconButton>
        </Box>
      </Toolbar>

      {/* ADD: Secondary Status Bar */}
      <Box sx={{
        backgroundColor: 'rgba(0,0,0,0.2)',
        py: 0.5,
        px: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.75rem',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            label="System Online" 
            size="small" 
            color="success" 
            variant="outlined"
            sx={{ height: '20px', color: 'white', borderColor: '#4caf50' }}
          />
          <Typography variant="caption" sx={{ color: '#e0e0e0' }}>
            Last updated: {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ color: '#e0e0e0' }}>
            <i className="fas fa-seedling" style={{ marginRight: '4px', color: '#4caf50' }}></i>
            Food Security: <strong>85% Operational</strong>
          </Typography>
          <Typography variant="caption" sx={{ color: '#e0e0e0' }}>
            <i className="fas fa-truck" style={{ marginRight: '4px', color: '#2196f3' }}></i>
            Supply Chain: <strong>12/15 Routes</strong>
          </Typography>
          <Typography variant="caption" sx={{ color: '#e0e0e0' }}>
            <i className="fas fa-users" style={{ marginRight: '4px', color: '#ff9800' }}></i>
            Communities: <strong>45,000 Protected</strong>
          </Typography>
        </Box>
      </Box>
    </AppBar>
  );
};

export default Navigation;
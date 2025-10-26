import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Autocomplete,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  LocationOn,
  WbSunny,
  Opacity,
  Air,
  Compress,
  Visibility,
  WbTwilight
} from '@mui/icons-material';

const Weather = () => {
  const [searchCity, setSearchCity] = useState('Durban');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState(['Durban', 'Johannesburg', 'Cape Town', 'Pretoria']);

  // OpenWeather API Key - Use your 32-character key from openweathermap.org
  const API_KEY = '7fd9327094aaaa679676a8f8e0c2c6dc'; // Use only the first 32 characters

  // Get weather data on component mount
  useEffect(() => {
    fetchWeatherByCity('Durban');
  }, []);

  const fetchWeatherByCity = async (cityName) => {
    if (!cityName.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      console.log('Fetching weather for:', cityName);
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`
      );
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Weather data received:', data);
      setWeatherData(data);
      
      // Add to recent searches if not already there
      if (!recentSearches.includes(cityName)) {
        setRecentSearches(prev => [cityName, ...prev.slice(0, 4)]);
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(`Failed to fetch weather: ${err.message}`);
      
      // Fallback to mock data for demo
      setWeatherData(getMockWeatherData(cityName));
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback
  const getMockWeatherData = (cityName) => {
    const mockData = {
      name: cityName,
      sys: { country: 'ZA' },
      main: {
        temp: 25 + Math.random() * 10,
        feels_like: 28 + Math.random() * 8,
        humidity: 60 + Math.floor(Math.random() * 30),
        pressure: 1010 + Math.floor(Math.random() * 20),
        temp_min: 22 + Math.random() * 5,
        temp_max: 30 + Math.random() * 8
      },
      weather: [{ 
        main: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
        description: ['clear sky', 'few clouds', 'light rain'][Math.floor(Math.random() * 3)],
        icon: ['01d', '02d', '10d'][Math.floor(Math.random() * 3)]
      }],
      wind: {
        speed: 5 + Math.random() * 15,
        deg: Math.floor(Math.random() * 360)
      },
      visibility: 8000 + Math.floor(Math.random() * 5000),
      sys: {
        sunrise: Math.floor(Date.now() / 1000) - 21600, // 6 hours ago
        sunset: Math.floor(Date.now() / 1000) + 21600   // 6 hours from now
      }
    };
    return mockData;
  };

  const handleSearch = () => {
    if (searchCity.trim()) {
      fetchWeatherByCity(searchCity);
    }
  };

  const handleCitySelect = (event, value) => {
    if (value) {
      setSearchCity(value);
      fetchWeatherByCity(value);
    }
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degrees / 45) % 8];
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Popular South African cities for suggestions
  const popularCities = [
    'Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 
    'Port Elizabeth', 'Bloemfontein', 'East London', 'Kimberley',
    'Polokwane', 'Nelspruit', 'Pietermaritzburg'
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        <i className="fas fa-cloud-sun" style={{ marginRight: '10px' }}></i>
        Weather Monitoring
      </Typography>

      {error && !weatherData && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error} - Showing demo data
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Current Weather Display */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, minHeight: '500px' }}>
            <Typography variant="h6" gutterBottom>
              <i className="fas fa-location-dot" style={{ marginRight: '8px' }}></i>
              Current Weather
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading weather data...</Typography>
              </Box>
            ) : weatherData ? (
              <Box>
                {/* Weather Header */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h2" color="primary" gutterBottom sx={{ fontSize: { xs: '3rem', md: '4rem' } }}>
                      {Math.round(weatherData.main.temp)}°C
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                      {weatherData.name}, {weatherData.sys.country}
                    </Typography>
                    <Typography variant="h6" color="textSecondary" gutterBottom sx={{ textTransform: 'capitalize', mb: 2 }}>
                      {weatherData.weather[0].description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        icon={<LocationOn />}
                        label={`Feels like: ${Math.round(weatherData.main.feels_like)}°C`}
                        variant="outlined"
                        size="small"
                      />
                      <Chip 
                        label={`Humidity: ${weatherData.main.humidity}%`}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                    <img 
                      src={getWeatherIcon(weatherData.weather[0].icon)} 
                      alt={weatherData.weather[0].description}
                      style={{ 
                        width: 100, 
                        height: 100,
                        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    {weatherData.weather[0].icon && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {weatherData.weather[0].main}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Weather Details Grid */}
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4} md={3}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Opacity sx={{ color: 'primary.main', mb: 1, fontSize: 32 }} />
                        <Typography variant="body2" gutterBottom>Humidity</Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                          {weatherData.main.humidity}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6} sm={4} md={3}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Air sx={{ color: 'info.main', mb: 1, fontSize: 32 }} />
                        <Typography variant="body2" gutterBottom>Wind Speed</Typography>
                        <Typography variant="h6" fontWeight="bold" color="info.main">
                          {weatherData.wind.speed} m/s
                        </Typography>
                        <Typography variant="caption" display="block">
                          {getWindDirection(weatherData.wind.deg)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6} sm={4} md={3}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Compress sx={{ color: 'warning.main', mb: 1, fontSize: 32 }} />
                        <Typography variant="body2" gutterBottom>Pressure</Typography>
                        <Typography variant="h6" fontWeight="bold" color="warning.main">
                          {weatherData.main.pressure} hPa
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6} sm={4} md={3}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Visibility sx={{ color: 'success.main', mb: 1, fontSize: 32 }} />
                        <Typography variant="body2" gutterBottom>Visibility</Typography>
                        <Typography variant="h6" fontWeight="bold" color="success.main">
                          {(weatherData.visibility / 1000).toFixed(1)} km
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6} sm={4} md={3}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <WbSunny sx={{ color: 'error.main', mb: 1, fontSize: 32 }} />
                        <Typography variant="body2" gutterBottom>Min / Max</Typography>
                        <Typography variant="h6" fontWeight="bold" color="error.main">
                          {Math.round(weatherData.main.temp_min)}° / {Math.round(weatherData.main.temp_max)}°
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6} sm={4} md={3}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <WbTwilight sx={{ color: 'secondary.main', mb: 1, fontSize: 32 }} />
                        <Typography variant="body2" gutterBottom>Sunrise</Typography>
                        <Typography variant="h6" fontWeight="bold" color="secondary.main">
                          {formatTime(weatherData.sys.sunrise)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6} sm={4} md={3}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <i className="fas fa-moon" style={{ color: '#1976d2', marginBottom: '8px', fontSize: '32px' }}></i>
                        <Typography variant="body2" gutterBottom>Sunset</Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                          {formatTime(weatherData.sys.sunset)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <i className="fas fa-search-location" style={{ fontSize: '64px', marginBottom: '16px', display: 'block', color: '#ccc' }}></i>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Search for a city to see weather data
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Enter a city name in the search box to get started
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Search Panel */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" gutterBottom>
              <i className="fas fa-search-location" style={{ marginRight: '8px' }}></i>
              Search Locations
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Autocomplete
                freeSolo
                options={[...new Set([...recentSearches, ...popularCities])]}
                value={searchCity}
                onChange={handleCitySelect}
                onInputChange={(event, newValue) => {
                  setSearchCity(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Enter city name"
                    size="small"
                    fullWidth
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                )}
              />
              
              <Button
                variant="contained"
                fullWidth
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                disabled={loading || !searchCity.trim()}
                sx={{ mt: 1 }}
                size="large"
              >
                {loading ? 'Searching...' : 'Search Weather'}
              </Button>
            </Box>

            {/* Recent Searches */}
            <Typography variant="subtitle2" gutterBottom color="textSecondary">
              <i className="fas fa-history" style={{ marginRight: '6px' }}></i>
              Recent Searches:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {recentSearches.map((city, index) => (
                <Chip
                  key={index}
                  label={city}
                  size="small"
                  onClick={() => {
                    setSearchCity(city);
                    fetchWeatherByCity(city);
                  }}
                  clickable
                  variant="outlined"
                />
              ))}
            </Box>

            {/* Popular Cities */}
            <Typography variant="subtitle2" gutterBottom color="textSecondary">
              <i className="fas fa-map-marker-alt" style={{ marginRight: '6px' }}></i>
              Popular South African Cities:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {popularCities.map((city) => (
                <Chip
                  key={city}
                  label={city}
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setSearchCity(city);
                    fetchWeatherByCity(city);
                  }}
                  clickable
                  color="primary"
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Weather;
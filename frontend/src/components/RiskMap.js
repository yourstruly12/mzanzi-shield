import React, { useEffect, useRef, useState } from 'react';
import { Paper, Typography, Box, ButtonGroup, Button, Chip } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const RiskMap = ({ sensors }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [currentLayer, setCurrentLayer] = useState('fire');
  const [markers, setMarkers] = useState([]);

  // Durban coordinates
  const durbanCoords = [-29.8587, 31.0218];

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    mapInstance.current = L.map(mapRef.current).setView(durbanCoords, 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(mapInstance.current);

    // Cleanup on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !sensors.length) return;

    // Clear existing markers
    markers.forEach(marker => {
      if (mapInstance.current && marker) {
        mapInstance.current.removeLayer(marker);
      }
    });

    const newMarkers = sensors.map(sensor => {
      const { latitude, longitude } = sensor.location;
      
      // Determine marker color based on status
      let markerColor;
      switch (sensor.status) {
        case 'critical':
          markerColor = 'red';
          break;
        case 'warning':
          markerColor = 'orange';
          break;
        case 'normal':
          markerColor = 'green';
          break;
        default:
          markerColor = 'blue';
      }

      // ADD: Food security impact indicator
      const foodImpactIndicator = sensor.foodSecurityRisk && sensor.foodSecurityRisk !== 'Minimal impact' && sensor.foodSecurityRisk !== 'Stable production' 
        ? `<div style="background: #ff6b6b; color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px; margin-top: 4px;">Food Risk</div>`
        : '';

      // Create custom icon
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${markerColor};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: bold;
            position: relative;
          ">
            <i class="fas fa-${sensor.icon}" style="font-size: 10px;"></i>
            ${sensor.foodSecurityRisk && sensor.foodSecurityRisk !== 'Minimal impact' && sensor.foodSecurityRisk !== 'Stable production' 
              ? `<div style="position: absolute; top: -5px; right: -5px; width: 8px; height: 8px; background: #ff4444; border-radius: 50%; border: 1px solid white;"></div>` 
              : ''}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      // ENHANCED Popup with Food Security Information
      const marker = L.marker([latitude, longitude], { icon: customIcon })
        .addTo(mapInstance.current)
        .bindPopup(`
          <div style="min-width: 220px;">
            <h3 style="margin: 0 0 8px 0; color: #333;">${sensor.name}</h3>
            <p style="margin: 4px 0;">
              <strong>Type:</strong> ${sensor.type.replace('_', ' ')}
            </p>
            <p style="margin: 4px 0;">
              <strong>Value:</strong> ${sensor.currentValue} ${sensor.unit}
            </p>
            <p style="margin: 4px 0;">
              <strong>Status:</strong> 
              <span style="color: ${markerColor}; font-weight: bold; text-transform: uppercase;">
                ${sensor.status}
              </span>
            </p>
            <p style="margin: 4px 0;">
              <strong>Threshold:</strong> ${sensor.threshold} ${sensor.unit}
            </p>
            
            <!-- ADD Food Security Information -->
            <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; margin: 8px 0; border-left: 3px solid #4caf50;">
              <strong style="color: #2e7d32;">Food Security Impact:</strong>
              <p style="margin: 4px 0; font-size: 0.9em;">${sensor.foodImpact || 'No significant impact'}</p>
              <p style="margin: 4px 0; font-size: 0.8em; color: #666;">
                <strong>Risk Level:</strong> ${sensor.resilienceImpact || 'Low'}
              </p>
              ${sensor.foodSecurityRisk ? `
                <p style="margin: 4px 0; font-size: 0.8em; color: #d32f2f;">
                  <strong>⚠️ Food Risk:</strong> ${sensor.foodSecurityRisk}
                </p>
              ` : ''}
            </div>

            ${sensor.prediction ? `
              <p style="margin: 4px 0;">
                <strong>AI Prediction:</strong> ${sensor.prediction.trend} (${Math.round(sensor.prediction.confidence * 100)}% confidence)
              </p>
            ` : ''}
          </div>
        `);

      // Add animation for critical sensors
      if (sensor.status === 'critical') {
        marker.getElement().style.animation = 'pulse 1.5s infinite';
      }

      return marker;
    });

    setMarkers(newMarkers);

    // Add risk zones based on current layer
    addRiskZones(currentLayer);

  }, [sensors, currentLayer]);

  const addRiskZones = (layerType) => {
    // Remove existing risk zones
    if (mapInstance.current) {
      mapInstance.current.eachLayer(layer => {
        if (layer instanceof L.Circle || layer instanceof L.Polygon) {
          mapInstance.current.removeLayer(layer);
        }
      });
    }

    // Add risk zones based on layer type
    switch (layerType) {
      case 'fire':
        // Fire risk zones
        L.circle([-29.84, 31.02], {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.3,
          radius: 1500
        })
        .addTo(mapInstance.current)
        .bindPopup('<b>Fire Hazard Zone</b><br>High fire risk area - Crop lands at risk<br><span style="color: #d32f2f;">⚠️ 320 tons of food supplies threatened</span>');

        L.circle([-29.83, 31.03], {
          color: 'orange',
          fillColor: '#ff8c00',
          fillOpacity: 0.2,
          radius: 1000
        })
        .addTo(mapInstance.current)
        .bindPopup('<b>Moderate Fire Risk</b><br>Moderate fire risk area<br><span style="color: #ff9800;">⚠️ Monitor crop storage facilities</span>');

        break;

      case 'flood':
        // Flood risk zones
        L.polygon([
          [-29.86, 31.01],
          [-29.86, 31.03],
          [-29.87, 31.03],
          [-29.87, 31.01]
        ], {
          color: 'blue',
          fillColor: '#03f',
          fillOpacity: 0.3
        })
        .addTo(mapInstance.current)
        .bindPopup('<b>Flood Risk Area</b><br>Low-lying area prone to flooding<br><span style="color: #d32f2f;">⚠️ Supply routes disrupted - 3 routes affected</span>');

        L.polygon([
          [-29.855, 31.015],
          [-29.855, 31.025],
          [-29.865, 31.025],
          [-29.865, 31.015]
        ], {
          color: 'lightblue',
          fillColor: '#66ccff',
          fillOpacity: 0.2
        })
        .addTo(mapInstance.current)
        .bindPopup('<b>Moderate Flood Risk</b><br>Potential flood area during heavy rains<br><span style="color: #ff9800;">⚠️ Agricultural land at risk</span>');

        break;

      case 'wind':
        // Wind risk zones
        L.circle([-29.845, 31.01], {
          color: 'purple',
          fillColor: '#9370db',
          fillOpacity: 0.3,
          radius: 2000
        })
        .addTo(mapInstance.current)
        .bindPopup('<b>High Wind Zone</b><br>Area prone to strong winds<br><span style="color: #d32f2f;">⚠️ Crop damage potential - Secure storage facilities</span>');

        L.circle([-29.85, 31.02], {
          color: 'violet',
          fillColor: '#ee82ee',
          fillOpacity: 0.2,
          radius: 1500
        })
        .addTo(mapInstance.current)
        .bindPopup('<b>Moderate Wind Risk</b><br>Moderate wind exposure area<br><span style="color: #ff9800;">⚠️ Monitor crop conditions</span>');

        break;

      // NEW: Food Security Layer
      case 'food':
        // Food distribution centers
        L.circle([-29.85, 31.02], {
          color: 'green',
          fillColor: '#4caf50',
          fillOpacity: 0.4,
          radius: 800
        })
        .addTo(mapInstance.current)
        .bindPopup(`
          <b>🏪 Central Food Distribution Center</b><br>
          Capacity: 1,200 tons<br>
          Status: <span style="color: #4caf50;">Operational</span><br>
          Coverage: 45,000 people<br>
          <span style="color: #1976d2;">📦 Emergency reserves: 320 tons</span>
        `);

        // Vulnerable communities
        L.circle([-29.84, 31.01], {
          color: 'orange',
          fillColor: '#ff9800',
          fillOpacity: 0.3,
          radius: 1000
        })
        .addTo(mapInstance.current)
        .bindPopup(`
          <b>🏘️ KwaMashu Community</b><br>
          Population: 15,000<br>
          Food Security: <span style="color: #f44336;">Low</span><br>
          Resilience Score: 45/100<br>
          <span style="color: #d32f2f;">⚠️ High vulnerability to supply disruptions</span>
        `);

        L.circle([-29.86, 31.025], {
          color: '#ff6b35',
          fillColor: '#ff6b35',
          fillOpacity: 0.3,
          radius: 1200
        })
        .addTo(mapInstance.current)
        .bindPopup(`
          <b>🏘️ Inanda Rural Area</b><br>
          Population: 12,000<br>
          Food Security: <span style="color: #ff9800;">Medium</span><br>
          Resilience Score: 60/100<br>
          <span style="color: #ff9800;">⚠️ Moderate vulnerability</span>
        `);

        // Agricultural areas
        L.polygon([
          [-29.82, 31.00],
          [-29.82, 31.04],
          [-29.80, 31.04],
          [-29.80, 31.00]
        ], {
          color: '#8bc34a',
          fillColor: '#8bc34a',
          fillOpacity: 0.2,
          weight: 2
        })
        .addTo(mapInstance.current)
        .bindPopup(`
          <b>🌾 Northern Farmlands</b><br>
          Primary Crops: Maize, Vegetables<br>
          Production: 850 tons/year<br>
          <span style="color: #ff9800;">⚠️ Drought risk: High</span><br>
          <span style="color: #1976d2;">Predicted yield reduction: 40%</span>
        `);

        // Supply routes
        const supplyRoute = L.polyline([
          [-29.85, 31.02],
          [-29.84, 31.01],
          [-29.86, 31.025]
        ], {
          color: '#2196f3',
          weight: 4,
          opacity: 0.7,
          dashArray: '5, 10'
        }).addTo(mapInstance.current);
        
        supplyRoute.bindPopup(`
          <b>🚚 Primary Supply Route</b><br>
          Status: <span style="color: #4caf50;">Operational</span><br>
          Distance: 28km<br>
          Communities Served: 27,000<br>
          <span style="color: #1976d2;">Last delivery: 2 hours ago</span>
        `);

        break;
    }
  };

  const handleLayerChange = (layer) => {
    setCurrentLayer(layer);
  };

  const getActiveSensors = () => {
    return sensors.filter(sensor => {
      if (currentLayer === 'fire') return sensor.type === 'fire_hazard';
      if (currentLayer === 'flood') return sensor.type === 'water_level';
      if (currentLayer === 'wind') return sensor.type === 'wind';
      if (currentLayer === 'food') return sensor.foodSecurityRisk && sensor.foodSecurityRisk !== 'Minimal impact';
      return true;
    });
  };

  const getFoodRiskSensors = () => {
    return sensors.filter(sensor => 
      sensor.foodSecurityRisk && 
      sensor.foodSecurityRisk !== 'Minimal impact' && 
      sensor.foodSecurityRisk !== 'Stable production'
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Map Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Geographic View - Climate & Food Security
        </Typography>
        
        <ButtonGroup variant="outlined" size="small">
          <Button 
            onClick={() => handleLayerChange('fire')}
            variant={currentLayer === 'fire' ? 'contained' : 'outlined'}
            color="error"
          >
            Fire Risk
          </Button>
          <Button 
            onClick={() => handleLayerChange('flood')}
            variant={currentLayer === 'flood' ? 'contained' : 'outlined'}
            color="primary"
          >
            Flood Risk
          </Button>
          <Button 
            onClick={() => handleLayerChange('wind')}
            variant={currentLayer === 'wind' ? 'contained' : 'outlined'}
            color="secondary"
          >
            Wind Risk
          </Button>
          {/* NEW: Food Security Layer */}
          <Button 
            onClick={() => handleLayerChange('food')}
            variant={currentLayer === 'food' ? 'contained' : 'outlined'}
            sx={{
              color: currentLayer === 'food' ? 'white' : '#2e7d32',
              backgroundColor: currentLayer === 'food' ? '#4caf50' : 'transparent',
              borderColor: '#4caf50',
              '&:hover': {
                backgroundColor: currentLayer === 'food' ? '#45a049' : '#f1f8e9',
                borderColor: '#45a049'
              }
            }}
          >
            Food Security
          </Button>
        </ButtonGroup>
      </Box>

      {/* Active Sensors Info - ENHANCED */}
      <Box sx={{ mb: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip 
          label={`${getActiveSensors().length} active ${currentLayer === 'food' ? 'food-related ' : ''}sensors`}
          size="small"
          variant="outlined"
        />
        <Chip 
          icon={<i className="fas fa-fire" style={{ color: 'red' }}></i>}
          label="Fire Hazard"
          size="small"
          variant={currentLayer === 'fire' ? 'filled' : 'outlined'}
          color="error"
        />
        <Chip 
          icon={<i className="fas fa-water" style={{ color: 'blue' }}></i>}
          label="Flood Monitoring"
          size="small"
          variant={currentLayer === 'flood' ? 'filled' : 'outlined'}
          color="primary"
        />
        <Chip 
          icon={<i className="fas fa-wind" style={{ color: 'purple' }}></i>}
          label="Wind Speed"
          size="small"
          variant={currentLayer === 'wind' ? 'filled' : 'outlined'}
          color="secondary"
        />
        {/* NEW: Food Security Chip */}
        <Chip 
          icon={<i className="fas fa-seedling" style={{ color: '#2e7d32' }}></i>}
          label={`${getFoodRiskSensors().length} Food Risks`}
          size="small"
          variant={currentLayer === 'food' ? 'filled' : 'outlined'}
          sx={{
            color: currentLayer === 'food' ? 'white' : '#2e7d32',
            backgroundColor: currentLayer === 'food' ? '#4caf50' : 'transparent',
          }}
        />
      </Box>

      {/* Map Container */}
      <Box 
        ref={mapRef} 
        sx={{ 
          flex: 1, 
          borderRadius: '8px',
          overflow: 'hidden',
          minHeight: '300px',
          backgroundColor: currentLayer === 'food' ? '#f1f8e9' : '#e8f4f8'
        }}
      />

      {/* ENHANCED Map Legend */}
      <Box sx={{ mt: 1, display: 'flex', gap: 2, flexWrap: 'wrap', fontSize: '0.75rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'red' }}></Box>
          <span>Critical</span>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'orange' }}></Box>
          <span>Warning</span>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'green' }}></Box>
          <span>Normal</span>
        </Box>
        {/* NEW: Food Security Legend Items */}
        {currentLayer === 'food' && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#4caf50' }}></Box>
              <span>Food Center</span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff9800' }}></Box>
              <span>Community</span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#8bc34a' }}></Box>
              <span>Farmland</span>
            </Box>
          </>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ 
            width: 12, 
            height: 12, 
            borderRadius: '50%', 
            backgroundColor: 'blue',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -2,
              right: -2,
              width: 6,
              height: 6,
              backgroundColor: '#ff4444',
              borderRadius: '50%',
              border: '1px solid white'
            }
          }}></Box>
          <span>Food Risk Sensor</span>
        </Box>
      </Box>
    </Box>
  );
};

export default RiskMap;
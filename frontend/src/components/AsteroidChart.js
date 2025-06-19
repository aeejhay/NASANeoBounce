import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import './AsteroidChart.css';

const AsteroidChart = ({ asteroids, chartType }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  };

  const getChartData = () => {
    if (!asteroids || asteroids.length === 0) return [];

    // Take top 10 asteroids for better visualization
    const topAsteroids = asteroids.slice(0, 10);
    
    return topAsteroids.map((asteroid, index) => {
      let value, label;
      
      switch (chartType) {
        case 'velocity':
          value = asteroid.velocity;
          label = `${asteroid.name} (${formatNumber(asteroid.velocity)} km/h)`;
          break;
        case 'distance':
          value = asteroid.distance.kilometers;
          label = `${asteroid.name} (${formatNumber(asteroid.distance.kilometers)} km)`;
          break;
        case 'diameter':
          value = (asteroid.diameter.min + asteroid.diameter.max) / 2;
          label = `${asteroid.name} (${value.toFixed(2)} km)`;
          break;
        default:
          value = asteroid.velocity;
          label = asteroid.name;
      }

      return {
        name: asteroid.name,
        value: value,
        label: label,
        isHazardous: asteroid.isHazardous,
        fullName: asteroid.name
      };
    });
  };

  const getChartTitle = () => {
    switch (chartType) {
      case 'velocity':
        return 'Asteroid Velocities (km/h)';
      case 'distance':
        return 'Asteroid Distances (km)';
      case 'diameter':
        return 'Asteroid Diameters (km)';
      default:
        return 'Asteroid Data';
    }
  };

  const getYAxisLabel = () => {
    switch (chartType) {
      case 'velocity':
        return 'Velocity (km/h)';
      case 'distance':
        return 'Distance (km)';
      case 'diameter':
        return 'Diameter (km)';
      default:
        return 'Value';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-title">{data.fullName}</p>
          <p className="tooltip-value">
            {chartType === 'velocity' && `${formatNumber(data.value)} km/h`}
            {chartType === 'distance' && `${formatNumber(data.value)} km`}
            {chartType === 'diameter' && `${data.value.toFixed(2)} km`}
          </p>
          <p className="tooltip-hazard">
            {data.isHazardous ? '⚠️ Potentially Hazardous' : '✅ Safe'}
          </p>
        </div>
      );
    }
    return null;
  };

  const chartData = getChartData();

  if (chartData.length === 0) {
    return (
      <div className="no-chart-data">
        <p>No data available for chart visualization.</p>
      </div>
    );
  }

  return (
    <div className="asteroid-chart">
      <h4 className="chart-title">{getChartTitle()}</h4>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: '#b3e5fc', fontSize: 12 }}
              tickLine={{ stroke: '#b3e5fc' }}
            />
            <YAxis 
              tick={{ fill: '#b3e5fc', fontSize: 12 }}
              tickLine={{ stroke: '#b3e5fc' }}
              axisLine={{ stroke: '#b3e5fc' }}
              label={{ 
                value: getYAxisLabel(), 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#b3e5fc' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={entry.isHazardous ? '#f44336' : '#2196f3'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color safe"></span>
          <span>Safe Asteroids</span>
        </div>
        <div className="legend-item">
          <span className="legend-color hazardous"></span>
          <span>Potentially Hazardous</span>
        </div>
      </div>
    </div>
  );
};

export default AsteroidChart; 
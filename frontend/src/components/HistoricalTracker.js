import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import './HistoricalTracker.css';

const API_URL = process.env.REACT_APP_API_URL || '';

const HistoricalTracker = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('count');

  useEffect(() => {
    fetchHistoricalData();
  }, []);

  const fetchHistoricalData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/api/neos/historical`);
      setHistoricalData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch historical data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  const getChartData = () => {
    return historicalData.map(item => ({
      ...item,
      formattedDate: formatDate(item.date),
      avgDistanceFormatted: formatNumber(item.averageDistance)
    }));
  };

  const getChartTitle = () => {
    switch (chartType) {
      case 'count':
        return 'Asteroid Count Over Time';
      case 'hazardous':
        return 'Hazardous Asteroids Over Time';
      case 'distance':
        return 'Average Distance Over Time';
      default:
        return 'Historical Data';
    }
  };

  const getYAxisLabel = () => {
    switch (chartType) {
      case 'count':
        return 'Number of Asteroids';
      case 'hazardous':
        return 'Number of Hazardous Asteroids';
      case 'distance':
        return 'Average Distance (km)';
      default:
        return 'Value';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-title">{data.formattedDate}</p>
          <p className="tooltip-value">
            {chartType === 'count' && `Total: ${data.totalCount} asteroids`}
            {chartType === 'hazardous' && `Hazardous: ${data.hazardousCount} asteroids`}
            {chartType === 'distance' && `Avg Distance: ${data.avgDistanceFormatted} km`}
          </p>
          <p className="tooltip-details">
            Total: {data.totalCount} | Hazardous: {data.hazardousCount}
          </p>
        </div>
      );
    }
    return null;
  };

  const chartData = getChartData();

  const totalAsteroids = historicalData.reduce((sum, item) => sum + item.totalCount, 0);
  const totalHazardous = historicalData.reduce((sum, item) => sum + item.hazardousCount, 0);
  const avgDistance = historicalData.length > 0 
    ? historicalData.reduce((sum, item) => sum + item.averageDistance, 0) / historicalData.length
    : 0;

  if (loading) {
    return (
      <div className="historical-tracker">
        <h2 className="card-title">📈 Historical Tracker</h2>
        <div className="loading">Loading historical data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="historical-tracker">
        <h2 className="card-title">📈 Historical Tracker</h2>
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="historical-tracker">
      <div className="historical-header">
        <h2 className="card-title">📈 Historical Tracker</h2>
        <button className="btn" onClick={fetchHistoricalData}>
          🔄 Refresh Data
        </button>
      </div>

      <div className="historical-stats">
        <div className="stat-card">
          <div className="stat-number">{totalAsteroids}</div>
          <div className="stat-label">Total Asteroids (7 days)</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalHazardous}</div>
          <div className="stat-label">Total Hazardous (7 days)</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{formatNumber(avgDistance)}</div>
          <div className="stat-label">Avg Distance (km)</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{historicalData.length}</div>
          <div className="stat-label">Days Tracked</div>
        </div>
      </div>

      <div className="chart-controls">
        <label>Chart Type:</label>
        <select 
          value={chartType} 
          onChange={(e) => setChartType(e.target.value)}
          className="chart-select"
        >
          <option value="count">Asteroid Count</option>
          <option value="hazardous">Hazardous Count</option>
          <option value="distance">Average Distance</option>
        </select>
      </div>

      <div className="card">
        <h3 className="card-title">{getChartTitle()}</h3>
        {chartData.length === 0 ? (
          <div className="no-data">
            <p>No historical data available.</p>
          </div>
        ) : (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              {chartType === 'distance' ? (
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis 
                    dataKey="formattedDate" 
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
                  <Line 
                    type="monotone" 
                    dataKey="averageDistance" 
                    stroke="#2196f3" 
                    strokeWidth={3}
                    dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis 
                    dataKey="formattedDate" 
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
                  <Bar 
                    dataKey={chartType === 'count' ? 'totalCount' : 'hazardousCount'} 
                    fill={chartType === 'count' ? '#2196f3' : '#f44336'}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 className="card-title">📊 Data Summary</h3>
          <div className="data-summary">
            <div className="summary-item">
              <span className="summary-label">Date Range:</span>
              <span className="summary-value">
                {historicalData.length > 0 && (
                  `${formatDate(historicalData[0].date)} - ${formatDate(historicalData[historicalData.length - 1].date)}`
                )}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Most Active Day:</span>
              <span className="summary-value">
                {historicalData.length > 0 && (() => {
                  const maxDay = historicalData.reduce((max, current) => 
                    current.totalCount > max.totalCount ? current : max
                  );
                  return `${formatDate(maxDay.date)} (${maxDay.totalCount} asteroids)`;
                })()}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Highest Hazard Day:</span>
              <span className="summary-value">
                {historicalData.length > 0 && (() => {
                  const maxHazard = historicalData.reduce((max, current) => 
                    current.hazardousCount > max.hazardousCount ? current : max
                  );
                  return `${formatDate(maxHazard.date)} (${maxHazard.hazardousCount} hazardous)`;
                })()}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">📋 Daily Breakdown</h3>
          <div className="daily-breakdown">
            {historicalData.map((item) => (
              <div key={item.date} className="daily-item">
                <div className="daily-date">{formatDate(item.date)}</div>
                <div className="daily-stats">
                  <span className="daily-count">{item.totalCount} total</span>
                  <span className="daily-hazardous">{item.hazardousCount} hazardous</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalTracker; 
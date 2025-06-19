import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AsteroidList from './AsteroidList';
import AsteroidChart from './AsteroidChart';
import HazardWidget from './HazardWidget';
import './AsteroidDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || '';

const AsteroidDashboard = () => {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartType, setChartType] = useState('velocity');

  const fetchAsteroids = async (date, retries = 2) => {
    setLoading(true);
    setError(null);
    
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const response = await axios.get(`${API_URL}/api/neos?date=${formattedDate}`);
      setAsteroids(response.data.asteroids);
    } catch (err) {
      if (retries > 0) {
        setTimeout(() => fetchAsteroids(date, retries - 1), 120000); // retry after 2 minutes
      } else {
        setError(
          (err.response?.data?.message || 'Failed to fetch asteroid data.') +
          ' If this is your first request in a while, the server may be waking up. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsteroids(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const hazardousCount = asteroids.filter(asteroid => asteroid.isHazardous).length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="card-title">🌍 Live Asteroid Dashboard</h2>
        <div className="date-picker-container">
          <label htmlFor="date-picker">Select Date:</label>
          <DatePicker
            id="date-picker"
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            className="date-picker"
          />
        </div>
      </div>

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{asteroids.length}</div>
          <div className="stat-label">Total Asteroids</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{hazardousCount}</div>
          <div className="stat-label">Potentially Hazardous</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {asteroids.length > 0 
              ? Math.round(asteroids.reduce((sum, asteroid) => sum + asteroid.distance.kilometers, 0) / asteroids.length)
              : 0
            }
          </div>
          <div className="stat-label">Avg Distance (km)</div>
        </div>
      </div>

      <div className="dashboard-message">
        <h3>
          {asteroids.length > 0 
            ? `There are ${asteroids.length} asteroid${asteroids.length === 1 ? '' : 's'} near Earth on ${formatDate(selectedDate)}`
            : `No asteroids detected near Earth on ${formatDate(selectedDate)}`
          }
        </h3>
        {hazardousCount > 0 && (
          <p className="hazard-warning">
            ⚠️ {hazardousCount} potentially hazardous asteroid{hazardousCount === 1 ? '' : 's'} detected!
          </p>
        )}
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 className="card-title">📊 Asteroid Analytics</h3>
          <div className="chart-controls">
            <label>Chart Type:</label>
            <select 
              value={chartType} 
              onChange={(e) => setChartType(e.target.value)}
              className="chart-select"
            >
              <option value="velocity">Velocity</option>
              <option value="distance">Distance</option>
              <option value="diameter">Diameter</option>
            </select>
          </div>
          {loading ? (
            <div className="loading">Loading chart data...</div>
          ) : (
            <AsteroidChart asteroids={asteroids} chartType={chartType} />
          )}
        </div>

        <div className="card">
          <HazardWidget asteroids={asteroids} loading={loading} />
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">🪨 Asteroid Details</h3>
        {loading ? (
          <div className="loading">Loading asteroid data...</div>
        ) : (
          <AsteroidList asteroids={asteroids} />
        )}
      </div>
    </div>
  );
};

export default AsteroidDashboard; 
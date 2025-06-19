import React, { useState, useEffect } from 'react';
import './HazardWidget.css';

const HazardWidget = ({ asteroids, loading }) => {
  const [showNotification, setShowNotification] = useState(false);

  const hazardousAsteroids = asteroids.filter(asteroid => asteroid.isHazardous);
  const closestAsteroid = asteroids.length > 0 
    ? asteroids.reduce((closest, current) => 
        current.distance.kilometers < closest.distance.kilometers ? current : closest
      )
    : null;

  const getHazardLevel = () => {
    if (hazardousAsteroids.length === 0) return 'none';
    if (hazardousAsteroids.length <= 2) return 'low';
    if (hazardousAsteroids.length <= 5) return 'medium';
    return 'high';
  };

  const getHazardMessage = () => {
    const level = getHazardLevel();
    switch (level) {
      case 'none':
        return {
          title: '✅ All Clear',
          message: 'No potentially hazardous asteroids detected today.',
          color: '#4caf50'
        };
      case 'low':
        return {
          title: '⚠️ Low Alert',
          message: `${hazardousAsteroids.length} potentially hazardous asteroid${hazardousAsteroids.length === 1 ? '' : 's'} detected. Monitor closely.`,
          color: '#ff9800'
        };
      case 'medium':
        return {
          title: '🚨 Medium Alert',
          message: `${hazardousAsteroids.length} potentially hazardous asteroids detected. Increased monitoring recommended.`,
          color: '#f44336'
        };
      case 'high':
        return {
          title: '🔥 High Alert',
          message: `${hazardousAsteroids.length} potentially hazardous asteroids detected. High risk situation.`,
          color: '#d32f2f'
        };
      default:
        return {
          title: '❓ Unknown',
          message: 'Unable to determine hazard status.',
          color: '#757575'
        };
    }
  };

  const simulateAlert = () => {
    if (hazardousAsteroids.length > 0) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  const hazardInfo = getHazardMessage();

  if (loading) {
    return (
      <div className="hazard-widget">
        <h3 className="card-title">🚨 Hazard Status</h3>
        <div className="loading">Loading hazard data...</div>
      </div>
    );
  }

  return (
    <div className="hazard-widget">
      <h3 className="card-title">🚨 Hazard Status</h3>
      
      <div 
        className="hazard-status"
        style={{ borderColor: hazardInfo.color }}
      >
        <h4 className="hazard-title" style={{ color: hazardInfo.color }}>
          {hazardInfo.title}
        </h4>
        <p className="hazard-message">{hazardInfo.message}</p>
      </div>

      <div className="hazard-stats">
        <div className="hazard-stat">
          <span className="stat-label">Total Asteroids:</span>
          <span className="stat-value">{asteroids.length}</span>
        </div>
        <div className="hazard-stat">
          <span className="stat-label">Hazardous:</span>
          <span className="stat-value hazardous">{hazardousAsteroids.length}</span>
        </div>
        {closestAsteroid && (
          <div className="hazard-stat">
            <span className="stat-label">Closest:</span>
            <span className="stat-value">
              {formatNumber(closestAsteroid.distance.kilometers)} km
            </span>
          </div>
        )}
      </div>

      {hazardousAsteroids.length > 0 && (
        <div className="hazardous-list">
          <h5>Potentially Hazardous Asteroids:</h5>
          <div className="hazardous-items">
            {hazardousAsteroids.slice(0, 3).map((asteroid) => (
              <div key={asteroid.id} className="hazardous-item">
                <span className="asteroid-name">{asteroid.name}</span>
                <span className="asteroid-distance">
                  {formatNumber(asteroid.distance.kilometers)} km
                </span>
              </div>
            ))}
            {hazardousAsteroids.length > 3 && (
              <div className="more-hazardous">
                +{hazardousAsteroids.length - 3} more
              </div>
            )}
          </div>
        </div>
      )}

      <div className="hazard-actions">
        <button 
          className="btn btn-secondary"
          onClick={() => window.open('https://cneos.jpl.nasa.gov/', '_blank')}
        >
          🌐 NASA NEO Database
        </button>
        {hazardousAsteroids.length > 0 && (
          <button 
            className="btn btn-danger"
            onClick={simulateAlert}
          >
            🔔 Test Alert
          </button>
        )}
      </div>

      {showNotification && (
        <div className="notification">
          <div className="notification-content">
            <h4>🚨 Hazard Alert!</h4>
            <p>{hazardousAsteroids.length} potentially hazardous asteroid{hazardousAsteroids.length === 1 ? '' : 's'} detected!</p>
            <p>Monitor NASA updates for more information.</p>
          </div>
        </div>
      )}

      <div className="hazard-info">
        <p>
          <strong>What makes an asteroid "potentially hazardous"?</strong>
        </p>
        <ul>
          <li>Size greater than 140 meters</li>
          <li>Distance less than 0.05 AU (7.5 million km)</li>
          <li>Orbit that could bring it close to Earth</li>
        </ul>
        <p className="disclaimer">
          <em>This data is for educational purposes. Always refer to official NASA sources for critical information.</em>
        </p>
      </div>
    </div>
  );
};

export default HazardWidget; 
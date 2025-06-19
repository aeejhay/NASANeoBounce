import React, { useState } from 'react';
import './AsteroidList.css';

const AsteroidList = ({ asteroids }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAsteroids = [...asteroids].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'distance':
        aValue = a.distance.kilometers;
        bValue = b.distance.kilometers;
        break;
      case 'velocity':
        aValue = a.velocity;
        bValue = b.velocity;
        break;
      case 'diameter':
        aValue = a.diameter.max;
        bValue = b.diameter.max;
        break;
      case 'hazardous':
        aValue = a.isHazardous ? 1 : 0;
        bValue = b.isHazardous ? 1 : 0;
        break;
      default:
        aValue = a.name;
        bValue = b.name;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (asteroids.length === 0) {
    return (
      <div className="no-asteroids">
        <p>No asteroids found for the selected date.</p>
      </div>
    );
  }

  return (
    <div className="asteroid-list">
      <div className="table-container">
        <table className="asteroid-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Name {getSortIcon('name')}
              </th>
              <th onClick={() => handleSort('hazardous')} className="sortable">
                Hazard {getSortIcon('hazardous')}
              </th>
              <th onClick={() => handleSort('distance')} className="sortable">
                Distance {getSortIcon('distance')}
              </th>
              <th onClick={() => handleSort('velocity')} className="sortable">
                Velocity {getSortIcon('velocity')}
              </th>
              <th onClick={() => handleSort('diameter')} className="sortable">
                Diameter {getSortIcon('diameter')}
              </th>
              <th>Close Approach</th>
            </tr>
          </thead>
          <tbody>
            {sortedAsteroids.map((asteroid) => (
              <tr 
                key={asteroid.id} 
                className={asteroid.isHazardous ? 'hazardous' : ''}
              >
                <td className="asteroid-name">
                  <span className="asteroid-icon">🪨</span>
                  {asteroid.name}
                </td>
                <td>
                  {asteroid.isHazardous ? (
                    <span className="hazard-badge">⚠️ Hazardous</span>
                  ) : (
                    <span className="safe-badge">✅ Safe</span>
                  )}
                </td>
                <td>
                  <div className="distance-info">
                    <div>{formatNumber(asteroid.distance.kilometers)} km</div>
                    <div className="lunar-distance">
                      {asteroid.distance.lunar.toFixed(2)} lunar
                    </div>
                  </div>
                </td>
                <td>
                  {formatNumber(asteroid.velocity)} km/h
                </td>
                <td>
                  <div className="diameter-info">
                    <div>
                      {asteroid.diameter.min.toFixed(2)} - {asteroid.diameter.max.toFixed(2)} km
                    </div>
                    <div className="avg-diameter">
                      Avg: {((asteroid.diameter.min + asteroid.diameter.max) / 2).toFixed(2)} km
                    </div>
                  </div>
                </td>
                <td>
                  <div className="approach-info">
                    <div>{asteroid.closeApproachDate}</div>
                    <div className="orbiting-body">
                      {asteroid.orbitingBody}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AsteroidList; 
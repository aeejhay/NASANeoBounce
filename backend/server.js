require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// NASA NEO API endpoint
app.get('/api/neos', async (req, res) => {
  try {
    const { date } = req.query;
    const apiKey = process.env.NASA_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        message: 'NASA API key not configured. Please add NASA_API_KEY to your .env file.' 
      });
    }

    // Use provided date or default to today
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const response = await axios.get(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${targetDate}&end_date=${targetDate}&api_key=${apiKey}`
    );

    // Process and filter the data
    const neoData = response.data;
    const asteroids = [];

    if (neoData.near_earth_objects && neoData.near_earth_objects[targetDate]) {
      neoData.near_earth_objects[targetDate].forEach(asteroid => {
        const closeApproach = asteroid.close_approach_data[0];
        const estimatedDiameter = asteroid.estimated_diameter.kilometers;
        
        asteroids.push({
          id: asteroid.id,
          name: asteroid.name,
          isHazardous: asteroid.is_potentially_hazardous_asteroid,
          distance: {
            kilometers: parseFloat(closeApproach.miss_distance.kilometers),
            lunar: parseFloat(closeApproach.miss_distance.lunar)
          },
          diameter: {
            min: estimatedDiameter.estimated_diameter_min,
            max: estimatedDiameter.estimated_diameter_max
          },
          velocity: parseFloat(closeApproach.relative_velocity.kilometers_per_hour),
          closeApproachDate: closeApproach.close_approach_date,
          orbitingBody: closeApproach.orbiting_body
        });
      });
    }

    res.json({
      date: targetDate,
      count: asteroids.length,
      asteroids: asteroids
    });

  } catch (error) {
    console.error('Error fetching NEO data:', error.message);
    res.status(500).json({ 
      message: 'Failed to fetch NEO data', 
      error: error.message 
    });
  }
});

// Historical data endpoint (up to 7 days)
app.get('/api/neos/historical', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const apiKey = process.env.NASA_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        message: 'NASA API key not configured' 
      });
    }

    // Default to last 7 days if no dates provided
    let startDate, endDate;
    if (start_date && end_date) {
      startDate = start_date;
      endDate = end_date;
    } else {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      
      startDate = sevenDaysAgo.toISOString().split('T')[0];
      endDate = today.toISOString().split('T')[0];
    }

    const response = await axios.get(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`
    );

    const historicalData = [];
    const neoData = response.data;

    if (neoData.near_earth_objects) {
      Object.keys(neoData.near_earth_objects).forEach(date => {
        const asteroids = neoData.near_earth_objects[date];
        const hazardousCount = asteroids.filter(asteroid => 
          asteroid.is_potentially_hazardous_asteroid
        ).length;
        
        const avgDistance = asteroids.reduce((sum, asteroid) => {
          return sum + parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers);
        }, 0) / asteroids.length;

        historicalData.push({
          date,
          totalCount: asteroids.length,
          hazardousCount,
          averageDistance: avgDistance
        });
      });
    }

    res.json({
      startDate,
      endDate,
      data: historicalData.sort((a, b) => new Date(a.date) - new Date(b.date))
    });

  } catch (error) {
    console.error('Error fetching historical NEO data:', error.message);
    res.status(500).json({ 
      message: 'Failed to fetch historical NEO data', 
      error: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'NASA NEO Tracker API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 NASA NEO Tracker Backend running on http://localhost:${PORT}`);
  console.log(`📡 NEO API endpoint: http://localhost:${PORT}/api/neos`);
});
